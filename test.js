'use strict';

var should = require('should');

var LegoFilter = require('./lib/lego-filter');

describe('filter', function() {
  it('should allow matching pieces of data', function(done) {
    var filter = new LegoFilter({foo:/^(?:bar|baz)/});
    filter.on('data', function(v) {
      v.should.have.property('foo', 'bar');
      done();
    });
    filter.input({foo:'bar'});
  });

  it('should not allow non-matching pieces of data', function(done) {
    var filter = new LegoFilter({foo:function(v){return false;}});
    filter.on('data', function(v) {
      done('Nope!');
    });

    filter.input({foo:1234});
    setTimeout(done, 20);
  });
});
