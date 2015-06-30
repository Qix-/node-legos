'use strict';

var util = require('util');
var EventEmitter = require('events').EventEmitter;

function Lego() {
  EventEmitter.call(this);

  var self = this;

  Object.defineProperty(this, 'output', {
    enumerable: true,
    get: function() {
      return function output(v) {
        self.emit('data', v);
      };
    }
  });

  Object.defineProperty(this, 'input', {
    enumerable: true,
    get: function() {
      return function input(v) {
        self.emit('available', v);
      };
    }
  });
}
util.inherits(Lego, EventEmitter);

Lego.prototype.snapTo = function snapTo(lego) {
  this.on('data', lego.input);
};

module.exports = Lego;
