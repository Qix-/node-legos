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
    # TODO when shouldjs/should.js#74 is accepted, change to `.deepEqual`
    cache.should.eql [1, 2, 3, 4, 5, 'hello']
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
    # TODO when shouldjs/should.js#74 is accepted, change to `.deepEqual`
    results.should.eql [1, 2]
    next.close()

suite legos.LegoFilter, ->
suite legos.LegoFn, ->
suite legos.LegoGlob, null, {autoClose: false},  ->
suite legos.LegoTransform, ->
