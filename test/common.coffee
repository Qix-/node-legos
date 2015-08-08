should = require 'should'
arrayWithout = require 'array-without'
legos = require '../'

module.exports =
  testBasic: (lego)->
    module.exports.testInstanceOf lego
    module.exports.testOpenClose lego
    module.exports.testSnap lego
    module.exports.testUnsnap lego
    module.exports.testBadWrite lego
    module.exports.testOpenOnSnap lego
    module.exports.testCloseOnUnsnap lego
    module.exports.testStrength lego

  testInstanceOf: (lego)->
    it 'should be an instanceof Lego', ->
      lego.should.be.instanceOf legos.Lego

  testOpenClose: (lego)->
    it 'should open and close', ->
      (should lego._open).equal no
      lego.open()
      (should lego._open).equal yes
      lego.close()
      (should lego._open).equal no

  testSnap: (lego)->
    it 'should snap', ->
      next = new legos.Lego
      try
        lego.snap next
        lego._outputs.indexOf(next).should.not.equal -1
        next._inputs.indexOf(lego).should.not.equal -1
      finally
        arrayWithout lego._outputs, next

  testUnsnap: (lego)->
    it 'should unsnap', ->
      next = new legos.Lego
      try
        lego.snap next
        lego._outputs.indexOf(next).should.not.equal -1
        next._inputs.indexOf(lego).should.not.equal -1
        lego.unsnap next
        lego._outputs.indexOf(next).should.equal -1
        next._inputs.indexOf(lego).should.equal -1
      finally
        arrayWithout lego._outputs, next

  testBadWrite: (lego)->
    it 'shouldn\'t allow writing if closed', ->
      if lego._open then lego.close()
      (->
        lego.write 'nope.jpg'
      ).should.throw 'lego is not open'

  testOpenOnSnap: (lego)->
    it 'should open on (opened) snap', ->
      next = new legos.Lego
      next._open.should.equal no
      lego._open.should.equal no
      next.snap lego
      lego._open.should.equal no
      next.unsnap lego
      next.open()
      next._open.should.equal yes
      lego._open.should.equal no
      next.snap lego
      next._open.should.equal yes
      lego._open.should.equal yes
      next.close()
      next._open.should.equal no
      lego._open.should.equal no
      next.unsnap lego

  testCloseOnUnsnap: (lego)->
    it 'should close on unsnap', ->
      next = new legos.Lego
      next._open.should.equal no
      lego._open.should.equal no
      next.snap lego
      next.open()
      next._open.should.equal yes
      lego._open.should.equal yes
      next.unsnap lego
      next._open.should.equal yes
      lego._open.should.equal no

  testStrength: (lego)->
    it 'should honor being strongly open', ->
      next = new legos.Lego
      next._openStrong.should.equal no
      lego._openStrong.should.equal no
      next.snap lego
      next.open()
      next._open.should.equal yes
      next._openStrong.should.equal yes
      lego._open.should.equal yes
      lego._openStrong.should.equal no
      lego.open()
      lego._open.should.equal yes
      lego._openStrong.should.equal yes
      next.close()
      next._open.should.equal no
      lego._open.should.equal yes
      lego._openStrong.should.equal yes
      lego.close()
      lego._open.should.equal no
      lego._openStrong.should.equal no

  testWrite: (description, config)->
    it description, (done)->
      wrapper = module.exports.snapAll config.legos

      i = 0
      wrapper.out.write = (item)->
        (should item).equal config.read[i++]
        if i >= config.read.length
          wrapper.in.close()
          module.exports.unsnapAll wrapper.in
          return done()

      wrapper.in.open()
      for item in config.write
        wrapper.in.write item

  snapAll: (list)->
    # this method treats everything in a list as many-to-many
    # and pads each link with a lego.
    # it's not at all efficient but it works and is predictable,
    # which is all these tests need.
    #
    # this means
    #   [1, [2, 3], 4]
    # turns into
    #   1 -⪧ * -⪧ [2, 3] -⪧ * -⪧ 4
    # where * is a dummy lego for structure:
    #    ┌⪧2─┐
    #   1┤<*>├⪧4
    #    └⪧3─┘
    starter = pad = new legos.Lego
    for i in [0...list.length]
      targets = list[i]
      next = new legos.Lego

      if !Array.isArray targets
        targets = [targets]

      for target in targets
        pad.snap target
        target.snap next

      pad = next

    return in: starter, out: pad

  unsnapAll: (lego)->
    if Array.isArray lego
      return module.exports.unsnapAll lego[0]

    outs = lego._outputs.slice 0
    for out in outs
      lego.unsnap out
      module.exports.unsnapAll out
