'use strict';

var should = require('should');

var LegoFilter = require('./lib/lego-filter');
var LegoTransform = require('./lib/lego-transform');

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

describe('transform', function() {
  it('should transform simple values', function(done) {
    var filter = new LegoTransform({foo:3});
    filter.on('data', function(v) {
      v.should.have.property('foo', 3);
      done();
    });
    filter.input({foo:'bar'});
  });
  it('should transform regex values', function(done) {
    var filter = new LegoTransform({foo:[/^b/, 'm']});
    filter.on('data', function(v) {
      v.should.have.property('foo', 'mar');
      done();
    });
    filter.input({foo:'bar'});
  });
  it('should ignore invalid transforms', function(done) {
    var filter = new LegoTransform({qux:[/^b/, 'm']});
    filter.on('data', function(v) {
      v.should.have.property('foo', 'bar');
      done();
    });
    filter.input({foo:'bar'});
  });
  it('should allow basic functional transforms', function(done) {
    var filter = new LegoTransform(function() { return "changed"; });
    filter.on('data', function(v) {
      v.should.equal("changed");
      done();
    });
    filter.input({foo:'bar'});
  });
});
