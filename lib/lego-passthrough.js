'use strict';

var util = require('util');
var Lego = require('./lego');

function LegoPassthrough() {
  Lego.call(this);
  this.on('available', this.output);
}

util.inherits(LegoPassthrough, Lego);

module.exports = LegoPassthrough;
