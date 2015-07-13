'use strict';
// jshint mocha:true

var should = require('should');

var legos = require('./');

it('should successfully initialize', function() {
  var lego = new legos.Lego();
});

it('should throw when writing to closed lego', function() {
  var lego = new legos.Lego();
  (function() {
    lego.write('test');
  }).should.throw();
  (function() {
    lego.open();
    lego.write('test');
  }).should.not.throw();
  (function() {
    lego.open();
    lego.close();
    lego.write('test');
  }).should.throw();
  (function() {
    lego.open();
    lego.close();
    lego.open();
    lego.write('test');
  }).should.not.throw();
});

it('should branch open/close signals', function() {
  var lego1 = new legos.Lego();
  var lego2 = new legos.Lego();
  var lego3 = new legos.Lego();

  lego1.snap(lego2);
  lego1.snap(lego3);

  lego1.open();
  lego1._open.should.equal(true);
  lego2._open.should.equal(true);
  lego3._open.should.equal(true);

  lego1.close();
  lego1._open.should.equal(false);
  lego2._open.should.equal(false);
  lego3._open.should.equal(false);
});

it('should queue multiple input open/close signals', function() {
  var lego1 = new legos.Lego();
  var lego2 = new legos.Lego();
  var lego3 = new legos.Lego();

  lego1.snap(lego3);
  lego2.snap(lego3);

  lego1._open.should.equal(false);
  lego2._open.should.equal(false);
  lego3._open.should.equal(false);

  lego1.open();
  lego1._open.should.equal(true);
  lego2._open.should.equal(false);
  lego3._open.should.equal(true);

  lego2.open();
  lego1._open.should.equal(true);
  lego2._open.should.equal(true);
  lego3._open.should.equal(true);

  lego1.close();
  lego1._open.should.equal(false);
  lego2._open.should.equal(true);
  lego3._open.should.equal(true);

  lego2.close();
  lego1._open.should.equal(false);
  lego2._open.should.equal(false);
  lego3._open.should.equal(false);
});

it('should successfully snap + pass', function() {
  var lego1 = new legos.Lego();
  var lego2 = new legos.Lego();
  var count = 0;

  lego2.write = function write(item) {
    legos.Lego.prototype.write.call(this, item);
    ++count;
  };

  lego1.snap(lego2);
  lego1.open();
  lego1.write('test');
  lego1.close();
  count.should.equal(1);
});

it('should successfully branch outputs', function() {
  var lego1 = new legos.Lego();
  var lego2 = new legos.Lego();
  var lego3 = new legos.Lego();
  var count = 0;

  lego2.write = lego3.write = function write(item) {
    legos.Lego.prototype.write.call(this, item);
    ++count;
  };

  lego1.snap(lego2);
  lego1.snap(lego3);

  lego1.open();
  lego1.write('hello');
  lego1.close();
  count.should.equal(2);
});

it('should successfully branch X-topology in/out', function() {
  var lego1 = new legos.Lego();
  var lego2 = new legos.Lego();
  var lego3 = new legos.Lego();
  var lego4 = new legos.Lego();
  var lego5 = new legos.Lego();
  var lego6 = new legos.Lego();

  lego1.snap(lego3);
  lego2.snap(lego3);
  lego3.snap(lego4);
  lego3.snap(lego5);
  lego4.snap(lego6);
  lego5.snap(lego6);

  var count = 0;

  lego6.write = function write(item) {
    legos.Lego.prototype.write.call(this, item);
    ++count;
  };

  lego1.open();
  lego2.open();
  lego1.write('test');
  lego2.write('test');
  lego3.write('test');
  lego1.close();
  lego2.close();

  count.should.equal(6);
});

it('should successfully branch open/close on X topology', function() {
  var lego1 = new legos.Lego();
  var lego2 = new legos.Lego();
  var lego3 = new legos.Lego();
  var lego4 = new legos.Lego();
  var lego5 = new legos.Lego();
  var lego6 = new legos.Lego();

  lego1.snap(lego3);
  lego2.snap(lego3);
  lego3.snap(lego4);
  lego3.snap(lego5);
  lego4.snap(lego6);
  lego5.snap(lego6);

  lego1._open.should.equal(false);
  lego2._open.should.equal(false);
  lego3._open.should.equal(false);
  lego4._open.should.equal(false);
  lego5._open.should.equal(false);
  lego6._open.should.equal(false);

  lego1.open();
  lego1._open.should.equal(true);
  lego2._open.should.equal(false);
  lego3._open.should.equal(true);
  lego4._open.should.equal(true);
  lego5._open.should.equal(true);
  lego6._open.should.equal(true);

  lego2.open();
  lego1._open.should.equal(true);
  lego2._open.should.equal(true);
  lego3._open.should.equal(true);
  lego4._open.should.equal(true);
  lego5._open.should.equal(true);
  lego6._open.should.equal(true);

  lego1.close();
  lego1._open.should.equal(false);
  lego2._open.should.equal(true);
  lego3._open.should.equal(true);
  lego4._open.should.equal(true);
  lego5._open.should.equal(true);
  lego6._open.should.equal(true);

  lego2.close();
  lego1._open.should.equal(false);
  lego2._open.should.equal(false);
  lego3._open.should.equal(false);
  lego4._open.should.equal(false);
  lego5._open.should.equal(false);
  lego6._open.should.equal(false);
});
