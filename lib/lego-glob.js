'use strict';

var util = require('util');
var glob = require('glob');
var async = require('async');
var Lego = require('./lego');

function LegoGlob(pattern, globOptions, autoStart) {
  Lego.call(this);

  this.pattern = pattern;
  this.globOptions = globOptions || {};

  if (autoStart) {
    this.start();
  }
}

util.inherits(LegoGlob, Lego);

LegoGlob.prototype.start = function start(close) {
  var self = this;
  close = arguments.length ? !!close : true;
  glob(this.pattern, this.globOptions, function(err, files) {
    if (err) {
      return self.emit('error', err);
    }
    async.each(files, function(file, cb) {
      self.output(file);
      cb();
    }, function(err) {
      if (err) {
        return self.emit('error', err);
      }
      if (close) {
        self.close();
      }
    });
  });
};

module.exports = LegoGlob;
