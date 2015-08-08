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
	Why don't we use events.EventEmitter?
	events.EventEmitter is too basic for something like DAG graphs,
	where merging and channeling becomes the norm.

	For instance, plugging two legos into a single, "merge" lego
	causes a problem; under Legos <= 0.4.x, only one of the source legos
	needed to trigger 'end' in order to trigger 'end' on the rest of the
	chain. That was a no-go.

	Legos now includes a full event emission system built from scratch that,
	while completely interfacing with existing streams and event systems,
	includes extra (better) support for channels.
*/

var arrayWithout = require('array-without');

function Lego() {
	Object.defineProperty(this, '_inputs', {
		value: []
	});
	Object.defineProperty(this, '_outputs', {
		value: []
	});
	Object.defineProperty(this, '_open', {
		writable: true,
		value: false
	});
	Object.defineProperty(this, '_openStrong', {
		writable: true,
		value: false
	});
}

function checkOpen(lego) {
	return lego._inputs.filter(function (input) {
		return input._open;
	}).length;
}

Lego.prototype = {
	snap: function snap(lego) {
		if (!(lego instanceof Lego)) {
			throw new Error('not a Lego');
		}

		if (this._outputs.indexOf(lego) === -1) {
			this._outputs.push(lego);
			lego._inputs.push(this);

			if (this._open && !lego._open) {
				// weakly open the lego
				lego.open(true);
			}

			return this;
		}

		return this;
	},

	unsnap: function unsnap(lego) {
		if (!(lego instanceof Lego)) {
			throw new Error('not a Lego');
		}

		arrayWithout.inline(this._outputs, lego);
		arrayWithout.inline(lego._inputs, this);

		if (!lego._openStrong && (!lego._inputs.length || !checkOpen(lego))) {
			// weakly close the lego
			lego.close(true);
		}

		return this;
	},

	open: function open(weak) {
		/*
			allow changing open strength if explicitly opened,
			even when already open
		*/
		this._openStrong = this._openStrong || !weak;

		if (this._open) {
			return this;
		}

		this._open = true;
		for (var i = 0, len = this._outputs.length; i < len; i++) {
			var output = this._outputs[i];

			// weakly open each output
			output.open(true);
		}

		return this;
	},

	close: function close(weak) {
		if (!this._open) {
			return this;
		}

		/*
			 ignore weak closes when we're strongly (explicitly) open
		*/
		if (weak && this._openStrong) {
			return this;
		}

		/*
			this allows us to safely call close()
			without running the risk of inputs falsely
			calling write() and causing a bunch of issues.
		*/
		if (checkOpen(this)) {
			/*
				we set _openStrong to false because we've
				explicitly closed this and now it's
				only opened via a source input being open.
			 */
			this._openStrong = false;
			return this;
		}

		this._open = false;
		this._openStrong = false;
		for (var i = 0, len = this._outputs.length; i < len; i++) {
			// weakly close outputs
			this._outputs[i].close(true);
		}

		return this;
	},

	write: function write(item) {
		if (!this._open) {
			throw new Error('lego is not open');
		}

		for (var i = 0, len = this._outputs.length; i < len; i++) {
			this._outputs[i].write(item);
		}

		return this;
	}
};

module.exports = Lego;
