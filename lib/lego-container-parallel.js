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
var LegoContainer = require('./lego-container');

function LegoContainerParallel() {
  LegoContainer.call(this, link);
}

util.inherits(LegoContainerParallel, LegoContainer);

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

module.exports = LegoContainerParallel;
