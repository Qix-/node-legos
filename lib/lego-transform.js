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

function LegoTransform(transformer) {
	LegoFn.call(this, function (item, cb) {
		abyss.clone(item, function (err, cloned) {
			if (err) {
				throw err;
			}
			abyss.transform(transformer, cloned, function (err, transformed) {
				if (err) {
					throw err;
				}
				cb(transformed);
			});
		});
	});
}

util.inherits(LegoTransform, LegoFn);

module.exports = LegoTransform;
