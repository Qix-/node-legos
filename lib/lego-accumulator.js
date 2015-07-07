'use strict';

var util = require('util');
var Lego = require('./lego');

function LegoAccumulator() {
  Lego.call(this);

  var items = [];

  var self = this;
  this.on('available', function(data) {
    items.push(data);
  });
  this.on('preEnd', function() {
    self.output(items);
  });
}

util.inherits(LegoAccumulator, Lego);

module.exports = LegoAccumulator;
