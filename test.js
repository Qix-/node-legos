'use strict';

var should = require('should');

var legos = require('./');
var LegoFilter = require('./lib/lego-filter');
var LegoTransform = require('./lib/lego-transform');
var LegoContainer = require('./lib/lego-container');

describe('filter', function() {
  it('should allow matching pieces of data', function(done) {
    var filter = new LegoFilter({foo:/^(?:bar|baz)/});
    var result = false;
    filter.on('data', function(v) {
      v.should.have.property('foo', 'bar');
      done();
    });
    filter.input({foo:'bar'});
    filter.close();
  });

  it('should not allow non-matching pieces of data', function(done) {
    var filter = new LegoFilter({foo:function(v){return false;}});
    filter.on('data', function(v) {
      done('Nope!');
    });
    filter.on('end', function() {
      done();
    });

    filter.input({foo:1234});
    filter.close();
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
    filter.close();
  });
  it('should transform regex values', function(done) {
    var filter = new LegoTransform({foo:[/^b/, 'm']});
    filter.on('data', function(v) {
      v.should.have.property('foo', 'mar');
      done();
    });
    filter.input({foo:'bar'});
    filter.close();
  });
  it('should ignore invalid transforms', function(done) {
    var filter = new LegoTransform({qux:[/^b/, 'm']});
    filter.on('data', function(v) {
      v.should.have.property('foo', 'bar');
      done();
    });
    filter.input({foo:'bar'});
    filter.close();
  });
  it('should allow basic functional transforms', function(done) {
    var filter = new LegoTransform(function() { return "changed"; });
    filter.on('data', function(v) {
      v.should.equal("changed");
      done();
    });
    filter.input({foo:'bar'});
    filter.close();
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

    filter.on('end', function() {
      sum.should.equal(20);
      done();
    });

    for (var i = 0; i < 100; i++) {
      transformer.input(i);
    }

    transformer.close();
  });
});

describe('container', function() {
  it('should push and transform + filter', function(done) {
    var container = new LegoContainer();
    var transformer = new LegoTransform(function(v) { return v * 2; });
    var filter = new LegoFilter(function(v) { return v < 10; });
    var sum = 0;

    container.push(transformer);
    container.push(filter);

    container.on('data', function(v) {
      sum += v;
    });

    container.on('end', function() {
      sum.should.equal(20);
      done();
    });

    for (var i = 0; i < 100; i++) {
      container.input(i);
    }

    container.close();
  });

  it('should propogate errors', function(done) {
    var container = new LegoContainer();
    var filter = new LegoFilter(/123/); // doesn't really matter

    container.push(filter);

    container.on('error', function(e) {
      e.should.equal('Foobar');
      done();
    });

    filter.emit('error', 'Foobar');

    container.close();
  });
});

describe('api', function() {
  it('should create a working filter', function(done) {
    var filter = legos.pass.when(5);
    filter.on('data', function(n) {
      n.should.equal(5);
      done();
    });

    filter.input(17);
    filter.input("Hello");
    filter.input(5);
    filter.close();
  });

  it('should create a working negated filter', function(done) {
    var filter = legos.pass.when.not(5);
    filter.on('data', function(n) {
      n.should.equal(17);
      done();
    });

    filter.input(5);
    filter.input(5);
    filter.input(17);
    filter.close();
  });

  it('should create a working transformer', function(done) {
    var transformer = legos.pass.and.transform(1234);
    transformer.on('data', function(n) {
      n.should.equal(1234);
      done();
    });

    transformer.input(17);
    transformer.close();
  });

  it('should create a working transformer -> filter', function(done) {
    var pipe = legos.pass
      .filter(24)
      .and.transform(function(v) { return v * 2; });

    pipe.on('data', function(n) {
      n.should.equal(48);
      done();
    });

    pipe.input(100);
    pipe.input(24);
    pipe.close();
  });
});
