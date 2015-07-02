'use strict';

var util = require('util');
var EventEmitter = require('events').EventEmitter;

function Lego() {
  EventEmitter.call(this);

  var self = this;

  Object.defineProperty(this, 'output', {
    enumerable: true,
    value: function output(v) {
        self.emit('data', v);
      }
  });

  Object.defineProperty(this, 'input', {
    enumerable: true,
    value: function input(v) {
        self.emit('available', v);
      }
  });

  Object.defineProperty(this, 'close', {
    enumerable: true,
    value: function close(v) {
        self.emit('end', v);
      }
  });
}
util.inherits(Lego, EventEmitter);

Lego.prototype.snap = function snap(lego) {
  this.on('data', lego.input);
  this.on('end', lego.close);
  return this;
};

Lego.prototype.unsnap = function unsnap(lego) {
  this.removeListener('data', lego.input);
  this.removeListener('end', lego.close);
  return this;
};

Lego.prototype.close = function close() {
  this.emit('end');
  return this;
};

module.exports = Lego;
