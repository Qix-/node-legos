'use strict';

var should = require('should');

var LegoFilter = require('./lib/lego-filter');
var LegoTransform = require('./lib/lego-transform');
var LegoContainer = require('./lib/lego-container');

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

describe('snapping', function() {
  it('should snap and transform + filter', function(done) {
    var transformer = new LegoTransform(function(v) { return v * 2; });
    var filter = new LegoFilter(function(v) { return v < 10; });
    var sum = 0;

    transformer.snap(filter);
    filter.on('data', function(v) {
      sum += v;
    });

    for (var i = 0; i < 100; i++) {
      transformer.input(i);
    }

    setTimeout(function() {
      sum.should.equal(20);
      done();
    }, 20);
  });
});

describe('container', function() {
  it('should push and transform + filter', function(done) {
    var container = new LegoContainer();
    var transformer = new LegoTransform(function(v) { console.log("T", v); return v * 2; });
    var filter = new LegoFilter(function(v) { console.log("F", v); return v < 10; });
    var sum = 0;

    container.push(transformer, filter);

    container.on('data', function(v) {
      console.log(v);
      sum += v;
    });

    for (var i = 0; i < 100; i++) {
      container.input(i);
    }

    setTimeout(function() {
      sum.should.equal(20);
      done();
    }, 20);
  });
});
