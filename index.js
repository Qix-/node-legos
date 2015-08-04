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

var assertModule = require('assert-module');

module.exports = {
  get Lego() {
    return require('./lib/lego');
  },

  get LegoFn() {
    return require('./lib/lego-fn');
  },

  get LegoAccumulator() {
    return require('./lib/lego-accumulator');
  },

  get LegoTransform() {
    return require('./lib/lego-transform');
  },

  get LegoContainer() {
    return require('./lib/lego-container');
  },

  get LegoContainerParallel() {
    return require('./lib/lego-container-parallel');
  },

  get LegoFilter() {
    return require('./lib/lego-filter');
  },

  get LegoEmitter() {
    assertModule('events',
        'package `events` must be available to use its lego');
    return require('./lib/lego-emitter');
  },

  get LegoGlob() {
    assertModule('glob', 'package `glob` must be installed to use its lego');
    return require('./lib/lego-glob');
  }
};
