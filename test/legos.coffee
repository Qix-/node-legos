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

  it 'remain open after hard flush', ->
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
suite legos.LegoContainerParallel, ->
suite legos.LegoEmitter, ->
suite legos.LegoFilter, ->
suite legos.LegoFn, ->
suite legos.LegoGlob, null, {autoClose: false},  ->
suite legos.LegoTransform, ->
