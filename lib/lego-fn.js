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
   Simple function handler for legos.

   Pass the constructor a fuction; this function receives the item
   as the first parameter, and a callback function as the second parameter.
   This callback function can be called multiple times, and takes an item
   itself. This item is written to all outputs.

   If passed value is not a function, defaults to a passthrough function.
*/

var util = require('util');
var Lego = require('./lego');

function LegoFn(fn) {
  Lego.call(this);

  if (!(fn instanceof Function)) {
    fn = function passthrough(item, cb) {
      cb(item);
    };
  }

  // defining a property because this is
  // more of a base-class to begin with
  Object.defineProperty(this, 'fn', {
    value: fn
  });
}

util.inherits(LegoFn, Lego);

LegoFn.prototype.write = function write(item) {
  if (!this._open) {
    throw new Error('lego is not open');
  }

  var self = this;
  this.fn(item, function(item) {
    Lego.prototype.write.call(self, item);
  });

  return this;
};

module.exports = LegoFn;
