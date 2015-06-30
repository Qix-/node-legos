'use strict';

var util = require('util');
var abyss = require('abyss');
var Lego = require('./lego');

function LegoFilter(filter, negate) {
  Lego.call(this);

  var self = this;
  var fn = function(v) {
    abyss.test(filter, v, function(tested) {
      if (tested == !negate) {
        self.output(v);
      }
    });
  };

  this.on('available', fn);
}

util.inherits(LegoFilter, Lego);

module.exports = LegoFilter;
