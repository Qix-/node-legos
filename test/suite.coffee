common = require './common'

module.exports = (legoClass, args..., fn)->
  describe legoClass.name, ->
    common.testBasic new (legoClass.bind.apply legoClass,
      [legoClass].concat args)
    fn()
