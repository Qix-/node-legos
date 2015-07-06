'use strict';

var util = require('util');

var Lego = require('./lib/lego');
var LegoContainer = require('./lib/lego-container');
var LegoTransform = require('./lib/lego-transform');
var LegoFilter = require('./lib/lego-filter');

function Legos() {
  LegoContainer.call(this);

  this.negate = false;
}

Legos.prototype = {
  get when() {
    this.negate = false;

    var self = this;

    var when = function when(filter) {
      self.push(new LegoFilter(filter, self.negate));
      return self;
    }

    when.not = function not() {
      self.negate = true;
      return when.apply(self, arguments);
    };

    return when;
  },

  get filter() {
    return this.when;
  },

  transform: function transform(transformation) {
    this.push(new LegoTransform(transformation));
    return this;
  },

  get and() {
    return this;
  }
};

for (var k in LegoContainer.prototype) {
  Legos.prototype[k] = LegoContainer.prototype[k];
}

module.exports = {
  Lego: Lego,
  LegoTransform: LegoTransform,
  LegoFilter: LegoFilter,
  LegoContainer: LegoContainer,

  get allow() {
    return new Legos();
  },

  get pass() {
    return new Legos();
  },

  get deny() {
    var lego = new Legos();
    lego.negate = true;
    return lego;
  }
};
