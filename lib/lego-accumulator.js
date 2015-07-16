'use strict';
/*
 *          _______
 *         /\      \
 *        /  \      \        _
 *       / O  \      \      | |
 *      /      \      \     | |     ___  __ _  ___  ___
 *     /      O \______\    | |    / _ \/ _` |/ _ \/ __|
 *     \ O      /      /    | |___|  __/ (_| | (_) \__ \
 *      \      /      /     |______\___|\__, |\___/|___/
 *       \  O /      /                   __/ |
 *        \  /      /                   |___/
 *         \/______/
 */

/*
   Accumulator lego

   Accumulates items and emits them on close (or on a call to flush())
*/

var util = require('util');
var Lego = require('./lego');

function LegoAccumulator(emitEmpty) {
  Lego.call(this);

  this.emitEmpty = emitEmpty;

  Object.defineProperty(this, 'items', {
    writable: true,
    value: []
  });
}

util.inherits(LegoAccumulator, Lego);

LegoAccumulator.prototype.write = function write(item) {
  if (!this._open) {
    throw new Error('lego is not open');
  }

  this.items.push(item);
  return this;
};

LegoAccumulator.prototype.flush = function flush() {
  if (this.items.length || this.emitEmpty) {
    Lego.prototype.write.call(this, this.items);
    this.items = [];
  }

  return this;
};

LegoAccumulator.prototype.close = function close() {
  this.flush();
  Lego.prototype.close.call(this);

  return this;
};

module.exports = LegoAccumulator;
