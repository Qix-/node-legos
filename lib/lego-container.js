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
var Lego = require('./lego');
var arrayWithout = require('array-without');

function LegoContainer(linkfn) {
	Lego.call(this);

	linkfn = linkfn || link;

	Object.defineProperty(this, 'legos', {
		value: []
	});

	Object.defineProperty(this, '_out', {
		value: new Lego()
	});

	Object.defineProperty(this, '_link', {
		value: linkfn
	});

	Lego.prototype.snap.call(this, this._out);

	var self = this;
	this._out.write = function write() {
		for (var i = 0, len = self._outputs.length; i < len; i++) {
			Lego.prototype.write.apply(self._outputs[i], arguments);
		}

		return this;
	};
}

util.inherits(LegoContainer, Lego);

function link(container, method) {
	if (container.legos.length) {
		Lego.prototype[method].call(container, container.legos[0]);
		container.legos[container.legos.length - 1][method](container._out);
	} else {
		Lego.prototype[method].call(container, container._out);
	}

	for (var i = 0, len = container.legos.length - 1; i < len; i++) {
		var lego1 = container.legos[i];
		var lego2 = container.legos[i + 1];
		lego1[method](lego2);
	}
}

function disassemble(container) {
	container._link(container, 'unsnap');
}

function assemble(container) {
	container._link(container, 'snap');
}

LegoContainer.prototype.push = function push() {
	disassemble(this);
	Array.prototype.push.apply(this.legos, arguments);
	assemble(this);

	return this;
};

LegoContainer.prototype.pop = function pop() {
	disassemble(this);
	this.legos.pop();
	assemble(this);

	return this;
};

LegoContainer.prototype.remove = function remove(elem) {
	disassemble(this);
	arrayWithout(this.legos, elem);
	assemble(this);

	return this;
};

module.exports = LegoContainer;
