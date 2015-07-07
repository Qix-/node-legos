'use strict';

var assertModule = require('assert-module');

module.exports = {
  get Lego() {
    return require('./lib/lego');
  },

  get LegoTransform() {
    return require('./lib/lego-transform');
  },

  get LegoFilter() {
    return require('./lib/lego-filter');
  },

  get LegoContainer() {
    return require('./lib/lego-container');
  },

  get LegoPassthrough() {
    return require('./lib/lego-passthrough');
  },

  get LegoAccumulator() {
    return require('./lib/lego-accumulator');
  },

  get LegoGlob() {
    assertModule('glob', '`glob` must be installed to use this lego');
    return require('./lib/lego-glob');
  }
};
