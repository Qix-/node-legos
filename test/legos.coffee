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
    write: [1, 2, 3, 4, 5, 'hello']
    read : [1, 2, 3, 4, 5, 'hello']

  common.testWrite 'should split/join elements',
    legos: [new legos.Lego, [new legos.Lego, new legos.Lego], new legos.Lego]
    write: [1, 2, 3, 4, 'hello']
    read : [1, 1, 2, 2, 3, 3, 4, 4, 'hello', 'hello']

suite legos.LegoAccumulator, ->
suite legos.LegoContainer, ->
suite legos.LegoContainerParallel, ->
suite legos.LegoEmitter, ->
suite legos.LegoFilter, ->
suite legos.LegoFn, ->
suite legos.LegoGlob, null, {autoClose: false},  ->
suite legos.LegoTransform, ->
