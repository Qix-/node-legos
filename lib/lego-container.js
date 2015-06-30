'use strict';

var util = require('util');
var Lego = require('./lego');
var LegoPassthrough = require('./lego-passthrough');

function LegoContainer() {
  Lego.call(this);
  this.legos = [];

  Object.defineProperty(this, '_left', {
    value: new LegoPassthrough()
  });
  Object.defineProperty(this, '_right', {
    value: new LegoPassthrough()
  });

  this.on('available', this._left.input);
  this._right.on('data', this.output);
  this._left.snap(this._right);
}

util.inherits(LegoContainer, Lego);

LegoContainer.prototype.deconstruct = function deconstruct() {
  this._left.removeAllListeners('data');
  if (this.legos.length) {
    this.legos[this.legos.length - 1].unsnap(this._right);
  }

  for (var i = 0, len = this.legos.length - 1; i < len; i++) {
    var legoFrom = this.legos[i];
    var legoTo = this.legos[i + 1];
    legoFrom.unsnap(legoTo);
  }
};

LegoContainer.prototype.construct = function construct() {
  for (var i = 0, len = this.legos.length - 1; i < len; i++) {
    var legoFrom = this.legos[i];
    var legoTo = this.legos[i + 1];
    legoFrom.snap(legoTo);
  }

  if (this.legos.length) {
    this._left.snap(this.legos[0]);
    this.legos[this.legos.length - 1].snap(this._right);
  } else {
    this._left.snap(this._right);
  }
};

LegoContainer.prototype.push = function push(lego) {
  this.deconstruct();
  var res = Array.prototype.push.apply(this.legos, arguments);
  this.construct();
  return res;
};

LegoContainer.prototype.pop = function pop(lego) {
  this.deconstruct();
  var res = this.legos.push(lego);
  this.construct();
  return res;
};

LegoContainer.prototype.splice = function splice(start, del) {
  this.deconstruct();
  var res = Array.prototype.splice.apply(this.legos, arguments);
  this.construct();
  return res;
};

module.exports = LegoContainer;
