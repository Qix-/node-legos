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
var glob = require('glob');
var async = require('async');
var Lego = require('./lego');

function LegoGlob(pattern, opts) {
  Lego.call(this);
  this.pattern = pattern;
  this.options = opts || {};
}

util.inherits(LegoGlob, Lego);

LegoGlob.prototype.open = function open() {
  Lego.prototype.open.call(this);

  var self = this;
  glob(this.pattern, this.options, function(err, files) {
    if (err) {
      throw err;
    }

    async.each(files,
        function(file, cb) {
          self.write(file);
          cb();
        }, function(err) {
          if (err) {
            throw err;
          }
          self.close();
        });
  });
};

module.exports = LegoGlob;
