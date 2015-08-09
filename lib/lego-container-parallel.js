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
var LegoContainer = require('./lego-container');

function LegoContainerParallel() {
	LegoContainer.call(this, linkParallel);
}

util.inherits(LegoContainerParallel, LegoContainer);

function linkParallel(container, snap) {
	for (var i = 0, len = container.children.length; i < len; i++) {
		var lego = container.children[i];
		lego[snap](container._out);
		container._in[snap](lego);
	}
}

module.exports = LegoContainerParallel;
