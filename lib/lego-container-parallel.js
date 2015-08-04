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

var util = require('util');
var Lego = require('./lego');

function LegoContainerParallel() {
  Lego.call(this);

  Object.defineProperty(this, 'legos', {
    value: []
  });

  Object.defineProperty(this, '_out', {
    value: new Lego()
  });

  Lego.prototype.snap.call(this, this._out);
}

util.inherits(LegoContainerParallel, Lego);

function link(container, method) {
  if (container.legos.length) {
    for (var i = 0, len = container.legos.length; i < len; i++) {
      var lego = container.legos[i];
      lego[method](container._out);
      Lego.prototype[method].call(container, lego);
    }
  } else {
    Lego.prototype[method].call(container, container._out);
  }
}

function disassemble(container) {
  link(container, 'unsnap');
}

function assemble(container) {
  link(container, 'snap');
}

LegoContainerParallel.prototype.snap = function snap(lego) {
  this._out.snap(lego);
  return this;
};

LegoContainerParallel.prototype.unsnap = function unsnap(lego) {
  this._out.unsnap(lego);
  return this;
};

LegoContainerParallel.prototype.push = function push(lego) {
  disassemble(this);
  this.legos.push(lego);
  assemble(this);

  return this;
};

LegoContainerParallel.prototype.pop = function pop() {
  disassemble(this);
  this.legos.pop();
  assemble(this);

  return this;
};

LegoContainerParallel.prototype.remove = function remove(elem) {
  disassemble(this);
  if (elem.constructor === Number) {
    this.legos.remove(elem);
  } else {
    this.legos.remove(this.legos.indexOf(elem));
  }
  assemble(this);

  return this;
};

module.exports = LegoContainerParallel;
