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
}

function checkOpen(lego) {
  return lego._inputs.filter(function(input) {
    return input._open;
  }).length;
}

Lego.prototype = {
  snap: function snap(lego) {
    if (!(lego instanceof Lego)) {
      throw new Error('argument is not a Lego');
    }

    if (this._outputs.indexOf(lego) === -1) {
      this._outputs.push(lego);
      lego._inputs.push(this);

      if (this._open && !lego._open) {
        lego.open();
      }

      return true;
    }

    return false;
  },

  unsnap: function unsnap(lego) {
    if (!(lego instanceof Lego)) {
      throw new Error('argument is not a Lego');
    }

    if (this._outputs.indexOf(lego) !== -1) {
      this._outputs.splice(this._outputs.indexOf(lego), 1);
      lego._inputs.splice(lego._inputs.indexOf(this), 1);

      if (lego._open && lego._inputs.length && !checkOpen(lego)) {
        lego.close();
      }

      return true;
    }

    return false;
  },

  open: function open() {
    if (this._open) {
      return false;
    }

    this._open = true;
    for (var i = 0, len = this._outputs.length; i < len; i++) {
      this._outputs[i].open();
    }

    return true;
  },

  close: function close() {
    if (!this._open) {
      return false;
    }

    if (checkOpen(this)) {
      return true;
    }

    this._open = false;
    for (var i = 0, len = this._outputs.length; i < len; i++) {
      this._outputs[i].close();
    }

    return true;
  },

  write: function write(item) {
    if (!this._open) {
      throw new Error('lego is not open');
    }

    for (var i = 0, len = this._outputs.length; i < len; i++) {
      this._outputs[i].write(item);
    }

    return !!this._outputs.length;
  }
};

module.exports = Lego;
