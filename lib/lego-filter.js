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
var abyss = require('abyss');
var LegoFn = require('./lego-fn');

function LegoFilter(filter, negate) {
  LegoFn.call(this, function(item, cb) {
    abyss.test(filter, item, function(tested) {
      if (tested == !negate) {
        cb(item);
      }
    });
  });
}

util.inherits(LegoFilter, LegoFn);

module.exports = LegoFilter;
