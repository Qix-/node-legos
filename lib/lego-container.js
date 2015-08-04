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

function LegoContainer() {
  Lego.call(this);

  Object.defineProperty(this, 'legos', {
    value: []
  });

  Object.defineProperty(this, '_out', {
    value: new Lego()
  });

  Lego.prototype.snap.call(this, this._out);
}

util.inherits(LegoContainer, Lego);

function link(container, method) {
  if (container.legos.length) {
    Lego.prototype[method].call(container, container.legos[0]);
    container.legos[container.legos.length - 1][method](container._out);
  } else {
    Lego.prototype[method].call(container, container._out);
  }

  for (var i = 0, len = container.legos.length - 1; i < len; i++) {
    var lego1 = container.legos[i];
    var lego2 = container.legos[i + 1];
    lego1[method](lego2);
  }
}

function disassemble(container) {
  link(container, 'unsnap');
}

function assemble(container) {
  link(container, 'snap');
}

LegoContainer.prototype.snap = function snap(lego) {
  this._out.snap(lego);
  return this;
};

LegoContainer.prototype.unsnap = function unsnap(lego) {
  this._out.unsnap(lego);
  return this;
};

LegoContainer.prototype.push = function push(lego) {
  disassemble(this);
  this.legos.push(lego);
  assemble(this);

  return this;
};

LegoContainer.prototype.pop = function pop() {
  disassemble(this);
  this.legos.pop();
  assemble(this);

  return this;
};

LegoContainer.prototype.remove = function remove(elem) {
  disassemble(this);
  if (elem.constructor === Number) {
    this.legos.remove(elem);
  } else {
    this.legos.remove(this.legos.indexOf(elem));
  }
  assemble(this);

  return this;
};

module.exports = LegoContainer;
