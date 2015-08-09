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

function LegoContainer(linker) {
	Lego.call(this);

	Object.defineProperty(this, 'children', {
		value: []
	});

	Object.defineProperty(this, '_linker', {
		value: linker || linkSeries
	});

	Object.defineProperty(this, '_in', {
		value: new Lego()
	});

	Object.defineProperty(this, '_out', {
		value: new Lego()
	});

	var self = this;
	this._out.write = function write() {
		Lego.prototype.write.apply(self, arguments);
		return this;
	};
}

function linkSeries(container, snap) {
	for (var i = 0, len = container.children.length; i < len; i++) {
		container.children[i][snap](container.children[i + 1] || container._out);
	}

	container._in[snap](container.children[0] || container._out);
}

util.inherits(LegoContainer, Lego);

LegoContainer.prototype.write = function write() {
	Lego.prototype.write.apply(this._in, arguments);

	return this;
};

LegoContainer.prototype.open = function open(weak) {
	Lego.prototype.open.call(this, weak);
	if (this._open) {
		this._in.open(true);
	}

	return this;
};

LegoContainer.prototype.close = function close(weak) {
	Lego.prototype.close.call(this, weak);
	if (!this._open) {
		this._in.close(true);
	}

	return this;
};

LegoContainer.prototype.push = function push() {
	this._linker(this, 'unsnap');
	Array.prototype.push.apply(this.children, arguments);
	this._linker(this, 'snap');

	return this;
};

LegoContainer.prototype.pop = function pop() {
	this._linker(this, 'unsnap');
	this.children.pop();
	this._linker(this, 'snap');

	return this;
};

LegoContainer.prototype.remove = function remove() {
	this._linker(this, 'unsnap');
	arrayWithout.inline.apply(this.children, arguments);
	this._linker(this, 'snap');

	return this;
};

module.exports = LegoContainer;
