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

/*
	Emitter lego

	Emits node.js EventEmitter events on lego activity
*/

var util = require('util');
var Lego = require('./lego');
var EventEmitter = require('events').EventEmitter;

function LegoEmitter() {
	Lego.call(this);
	EventEmitter.call(this);
}

util.inherits(LegoEmitter, Lego);
for (var k in EventEmitter.prototype) {
	if (EventEmitter.prototype.hasOwnProperty(k)) {
		LegoEmitter.prototype[k] = EventEmitter.prototype[k];
	}
}

LegoEmitter.prototype.write = function write(item) {
	Lego.prototype.write.call(this, item);
	this.emit('data', item);
	return this;
};

LegoEmitter.prototype.close = function close(weak) {
	Lego.prototype.close.call(this, weak);
	this.emit('end');
	return this;
};

module.exports = LegoEmitter;
