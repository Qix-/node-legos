#
#         _______
#        /\      \
#       /  \      \        _
#      / O  \      \      | |
#     /      \      \     | |     ___  __ _  ___  ___
#    /      O \______\    | |    / _ \/ _` |/ _ \/ __|
#    \ O      /      /    | |___|  __/ (_| | (_) \__ \
#     \      /      /     |______\___|\__, |\___/|___/
#      \  O /      /                   __/ |
#       \  /      /                   |___/
#        \/______/
#

should = require 'should'
async = require 'async'
common = require './common'
legos = require '../'
suite = require './suite'

suite legos.Lego, ->
  common.testWrite 'should pass elements through',
    legos: [new legos.Lego]
    write: [1, 2, 3, 4, 5, 'hello', [1, 2, 3], {}]
    read : [1, 2, 3, 4, 5, 'hello', [1, 2, 3], {}]

  common.testWrite 'should split/join elements',
    legos: [new legos.Lego, [new legos.Lego, new legos.Lego], new legos.Lego]
    write: [1, 2, 3, 4, 'hello', [1, 2, 3], {}]
    read : [1, 1, 2, 2, 3, 3, 4, 4, 'hello', 'hello',
      [1, 2, 3], [1, 2, 3], {}, {}]

suite legos.LegoAccumulator, ->
  acc = new legos.LegoAccumulator
  common.testWrite 'should buffer elements',
    legos: [acc]
    write: [1, 2, 3, 4, 5, 'hello', false, true]
    read : [[1, 2, 3, 4, 5, 'hello', false, true]]

  common.testWrite 'should successfully reset upon flush',
    legos: [acc]
    write: [1, 2, 3, 4, 3, 2, 1]
    read : [[1, 2, 3, 4, 3, 2, 1]]

  it 'should remain open after hard flush', ->
    cache = null
    reader = new legos.Lego
    reader.write = (item)-> cache = item

    acc.snap reader

    acc._open.should.equal no
    acc.open()
    acc._open.should.equal yes

    acc.write item for item in [1, 2, 3, 4, 5, 'hello']

    acc.flush()
    cache.should.deepEqual [1, 2, 3, 4, 5, 'hello']
    acc._open.should.equal yes

    acc.close()
    cache.should.eql [1, 2, 3, 4, 5, 'hello']

  common.testWrite 'should honor emitEmpty',
    legos: [new legos.LegoAccumulator yes]
    write: []
    read : [[]]

suite legos.LegoContainer, ->
  container = new legos.LegoContainer
  link1 = new legos.Lego
  link2 = new legos.Lego
  link3 = new legos.Lego
  out = new legos.Lego

  container.push link1, link2, link3

  count = 0
  out.write = (i)-> ++count

  link1.snap out
  link2.snap out
  link3.snap out

  describe 'basic', ->
    common.testWrite 'should pass items in series',
      legos: [container]
      write: [1, 2]
      read : [1, 2]

    it 'should have counted the elements', ->
      count.should.equal 6

    it 'should have closed the links', ->
      link1._open.should.equal no
      link2._open.should.equal no
      link3._open.should.equal no
      out._open.should.equal no

  describe 'pop()', ->
    it 'should honor pop', ->
      count = 0
      container.pop()

    common.testWrite 'should pass items in a series',
      legos: [container]
      write: [1, 2]
      read : [1, 2]

    it 'should have counted the elements', ->
      count.should.equal 4

    it 'should have closed the links', ->
      link1._open.should.equal no
      link2._open.should.equal no
      link3._open.should.equal no
      out._open.should.equal no

  describe 'remove()', ->
    it 'should honor remove', ->
      count = 0
      container.remove link1

    common.testWrite 'should pass items in a series',
      legos: [container]
      write: [1, 2]
      read : [1, 2]

    it 'should have counted the elements', ->
      count.should.equal 2

    it 'should have closed the links', ->
      link1._open.should.equal no
      link2._open.should.equal no
      link3._open.should.equal no
      out._open.should.equal no

suite legos.LegoContainerParallel, ->
  lego = new legos.LegoContainerParallel
  lego.push new legos.Lego for [0...3]

  common.testWrite 'should pass elements in parallel',
    legos: [lego],
    write: [1, 2, 3, 4]
    read : [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4]

suite legos.LegoEmitter, ->
  it 'should emit elements to \'data\' event', (done)->
    lego = new legos.LegoEmitter
    next = new legos.Lego

    results = []
    lego.on 'data', (item)->
      results.push item
    lego.on 'end', ->
      lego._open.should.equal no
      next._open.should.equal no
      return done()

    next.snap lego
    next.open()
    lego._open.should.equal yes
    next.write 1
    next.write 2
    results.should.deepEqual [1, 2]
    next.close()

suite legos.LegoFilter, ->
  testTransform = (description, config)->
    config.legos = [new legos.LegoFilter config.filter, config.negate]
    common.testWrite description, config

  describe 'positive', ->
    testTransform 'should filter a single number',
      filter: 123
      write: [123, 142, 123, 12, 'hello', {}, null, 123]
      read: [123, 123, 123]

    testTransform 'should filter a string',
      filter: 'hello!'
      write: [123, 'hello!', 123, 'jello!', 'hello', {}, null, 'hello!']
      read: ['hello!', 'hello!']

    testTransform 'should filter an object',
      filter: {foo: 'bar'}
      write: [123, {foo: 'bar'}, {foo: 'jar'}, [{foo: 'bar'}], 'hello', 'bar']
      read: [{foo: 'bar'}]

  describe 'negative', ->
    testTransform 'should filter a single number',
      filter: 123
      negate: yes
      write: [123, 142, 123, 12, 'hello', {}, null, 123]
      read: [142, 12, 'hello', {}, null]

    testTransform 'should filter a string',
      filter: 'hello!'
      negate: yes
      write: [123, 'hello!', 123, 'jello!', 'hello', {}, null, 'hello!']
      read: [123, 123, 'jello!', 'hello', {}, null]

    testTransform 'should filter an object',
      filter: {foo: 'bar'}
      negate: yes
      write: [123, {foo: 'bar'}, {foo: 'jar'}, [{foo: 'bar'}], 'hello', 'bar']
      read: [123, {foo: 'jar'}, [{foo: 'bar'}], 'hello', 'bar']

suite legos.LegoFn, (->), ->
  it 'shouldn\'t allow non-functions', ->
    (->
      new legos.LegoFn 1234
    ).should.throw 'argument must be a function'

  duplicator = new legos.LegoFn (item, write)->
    write item
    write item

  common.testWrite 'should duplicate items (twice)',
    legos: [duplicator]
    write: [1, 2, 3, 4, 'hello']
    read : [1, 1, 2, 2, 3, 3, 4, 4, 'hello', 'hello']

suite legos.LegoGlob, null, {autoClose: false},  ->
  it 'should glob and close', (done)->
    lego = new legos.LegoGlob '**/*', {cwd: 'test/fixture'}
    next = new legos.Lego

    results = []
    next.write = (item)-> results.push item
    next.close = ->
      results.should.deepEqual ['bar', 'foo', 'qux', 'qux/qix']
      lego._open.should.equal no
      done()

    lego.snap next
    lego.open()

  it 'should glob and stay open', (done)->
    # this isn't going to be a beautiful test.
    lego = new legos.LegoGlob '**/*', {cwd: 'test/fixture', autoClose: no}
    next = new legos.Lego

    results = []
    next.write = (item)-> results.push item

    lego.snap next

    ###
    # what happens here is kind of terrifying.
    # I overwrite `async.each`, the function LegoGlob uses to iterate
    # over the files, and wrap its "result" function (the function called
    # either on completion or on error), allowing me to make sure it hasn't
    # closed itself.
    #
    # this is in lieu of a timeout or other non-reliable means of checking
    # information upon finishing up the scandir() (glob).
    ###
    _each = async.each
    try
      async.each = (arr, itr, result)->
        _each.call async, arr, itr, (err)->
          async.each = _each
          result err
          lego._open.should.equal yes
          next._open.should.equal yes
          results.should.deepEqual ['bar', 'foo', 'qux', 'qux/qix']
          lego.close()
          lego._open.should.equal no
          next._open.should.equal no
          done()

      lego.open()
    catch e
      async.each = _each

suite legos.LegoTransform, ->
  testTransform = (description, config)->
    config.legos = [new legos.LegoTransform config.transform]
    common.testWrite description, config

  testTransform 'should transform basic numbers',
    transform: 123
    write: ['hello', {}, null, 15, 1555, 1234]
    read: [123, 123, 123, 123, 123, 123]

  testTransform 'should transform basic strings',
    transform: 'hi'
    write: ['hello', {}, null, 15, 1555, 1234]
    read: ['hi', 'hi', 'hi', 'hi', 'hi', 'hi']

  testTransform 'should transform to null',
    transform: null
    write: ['hello', {}, null, 15, 1555, 1234]
    read: [null, null, null, null, null, null]

  testTransform 'should transform complex objects',
    transform: a:b:(v)-> v * 2
    write: [{a: b: 16}, {a: b: 54, c: 15}, {a: b: 14}]
    read: [{a: b: 32}, {a: b: 108, c: 15}, {a: b: 28}]

