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
    value: function output(v) {
        self.emit('available', v);
      }
  });
}
util.inherits(Lego, EventEmitter);

Lego.prototype.snap = function snap(lego) {
  this.on('data', lego.input);
};

Lego.prototype.unsnap = function unsnap(lego) {
  this.removeListener('data', lego.input);
};

module.exports = Lego;
