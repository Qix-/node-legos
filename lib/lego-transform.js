'use strict';

var util = require('util');
var abyss = require('abyss');
var Lego = require('./lego');

function LegoTransform(transformer) {
  Lego.call(this);

  var self = this;
  var fn = function(v) {
    abyss.clone(v, function(err, cloned) {
      if (err) {
        return self.emit('error', err);
      }
      abyss.transform(transformer, cloned, function(err, transformed) {
        if (err) {
          return self.emit('error', err);
        }
        self.output(transformed);
      });
    });
  };

  this.on('available', fn);
}

util.inherits(LegoTransform, Lego);

module.exports = LegoTransform;
