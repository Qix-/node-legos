'use strict';
// jshint mocha:true
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

require('should');

var legos = require('./');

describe('Lego', function() {
  it('should successfully initialize', function() {
    new legos.Lego();
  });

  it('should throw when writing to closed lego', function() {
    var lego = new legos.Lego();
    (function() {
      lego.write('test');
    }).should.throw('lego is not open');
    (function() {
      lego.open();
      lego.write('test');
    }).should.not.throw();
    (function() {
      lego.open();
      lego.close();
      lego.write('test');
    }).should.throw('lego is not open');
    (function() {
      lego.open();
      lego.close();
      lego.open();
      lego.write('test');
    }).should.not.throw();
  });

  it('should branch open/close signals', function() {
    var lego1 = new legos.Lego();
    var lego2 = new legos.Lego();
    var lego3 = new legos.Lego();

    lego1.snap(lego2);
    lego1.snap(lego3);

    lego1.open();
    lego1._open.should.equal(true);
    lego2._open.should.equal(true);
    lego3._open.should.equal(true);

    lego1.close();
    lego1._open.should.equal(false);
    lego2._open.should.equal(false);
    lego3._open.should.equal(false);
  });

  it('should queue multiple input open/close signals', function() {
    var lego1 = new legos.Lego();
    var lego2 = new legos.Lego();
    var lego3 = new legos.Lego();

    lego1.snap(lego3);
    lego2.snap(lego3);

    lego1._open.should.equal(false);
    lego2._open.should.equal(false);
    lego3._open.should.equal(false);

    lego1.open();
    lego1._open.should.equal(true);
    lego2._open.should.equal(false);
    lego3._open.should.equal(true);

    lego2.open();
    lego1._open.should.equal(true);
    lego2._open.should.equal(true);
    lego3._open.should.equal(true);

    lego1.close();
    lego1._open.should.equal(false);
    lego2._open.should.equal(true);
    lego3._open.should.equal(true);

    lego2.close();
    lego1._open.should.equal(false);
    lego2._open.should.equal(false);
    lego3._open.should.equal(false);
  });

  it('should successfully snap + pass', function() {
    var lego1 = new legos.Lego();
    var lego2 = new legos.Lego();
    var count = 0;

    lego2.write = function write(item) {
      legos.Lego.prototype.write.call(this, item);
      ++count;
    };

    lego1.snap(lego2);
    lego1.open();
    lego1.write('test');
    lego1.close();
    count.should.equal(1);
  });

  it('should successfully branch outputs', function() {
    var lego1 = new legos.Lego();
    var lego2 = new legos.Lego();
    var lego3 = new legos.Lego();
    var count = 0;

    lego2.write = lego3.write = function write(item) {
      legos.Lego.prototype.write.call(this, item);
      ++count;
    };

    lego1.snap(lego2);
    lego1.snap(lego3);

    lego1.open();
    lego1.write('hello');
    lego1.close();
    count.should.equal(2);
  });

  it('should successfully branch X-topology in/out', function() {
    var lego1 = new legos.Lego();
    var lego2 = new legos.Lego();
    var lego3 = new legos.Lego();
    var lego4 = new legos.Lego();
    var lego5 = new legos.Lego();
    var lego6 = new legos.Lego();

    lego1.snap(lego3);
    lego2.snap(lego3);
    lego3.snap(lego4);
    lego3.snap(lego5);
    lego4.snap(lego6);
    lego5.snap(lego6);

    var count = 0;

    lego6.write = function write(item) {
      legos.Lego.prototype.write.call(this, item);
      ++count;
    };

    lego1.open();
    lego2.open();
    lego1.write('test');
    lego2.write('test');
    lego3.write('test');
    lego1.close();
    lego2.close();

    count.should.equal(6);
  });

  it('should successfully branch open/close on X topology', function() {
    var lego1 = new legos.Lego();
    var lego2 = new legos.Lego();
    var lego3 = new legos.Lego();
    var lego4 = new legos.Lego();
    var lego5 = new legos.Lego();
    var lego6 = new legos.Lego();

    lego1.snap(lego3);
    lego2.snap(lego3);
    lego3.snap(lego4);
    lego3.snap(lego5);
    lego4.snap(lego6);
    lego5.snap(lego6);

    lego1._open.should.equal(false);
    lego2._open.should.equal(false);
    lego3._open.should.equal(false);
    lego4._open.should.equal(false);
    lego5._open.should.equal(false);
    lego6._open.should.equal(false);

    lego1.open();
    lego1._open.should.equal(true);
    lego2._open.should.equal(false);
    lego3._open.should.equal(true);
    lego4._open.should.equal(true);
    lego5._open.should.equal(true);
    lego6._open.should.equal(true);

    lego2.open();
    lego1._open.should.equal(true);
    lego2._open.should.equal(true);
    lego3._open.should.equal(true);
    lego4._open.should.equal(true);
    lego5._open.should.equal(true);
    lego6._open.should.equal(true);

    lego1.close();
    lego1._open.should.equal(false);
    lego2._open.should.equal(true);
    lego3._open.should.equal(true);
    lego4._open.should.equal(true);
    lego5._open.should.equal(true);
    lego6._open.should.equal(true);

    lego2.close();
    lego1._open.should.equal(false);
    lego2._open.should.equal(false);
    lego3._open.should.equal(false);
    lego4._open.should.equal(false);
    lego5._open.should.equal(false);
    lego6._open.should.equal(false);
  });
});

describe('LegoFn', function() {
  it('should trigger on items', function() {
    var count = 0;
    var lego = new legos.LegoFn(function() {
      ++count;
    });

    lego.open();
    lego.write('test');
    lego.close();

    count.should.equal(1);
  });

  it('should still error on closed lego', function() {
    (function() {
      var lego = new legos.LegoFn();
      lego.write('test');
    }).should.throw('lego is not open');
    (function() {
      var lego = new legos.LegoFn(function(){});
      lego.write('test');
    }).should.throw('lego is not open');
  });
});

describe('LegoAccumulator', function() {
  it('should accumulate items', function() {
    var lego1 = new legos.LegoAccumulator();
    var lego2 = new legos.Lego();

    var count = 0;
    var len = 0;
    lego2.write = function write(item) {
      legos.Lego.prototype.write.call(this, item);
      ++count;
      len = item.length || 0;
    };

    lego1.snap(lego2);

    lego1.open();
    lego1.write('test');
    lego1.write('test');
    lego1.write('test');
    lego1.write('test');
    lego1.close();

    count.should.equal(1);
    len.should.equal(4);
  });
});

describe('LegoTransform', function() {
  it('should transform item (Number)', function(done) {
    var lego1 = new legos.LegoTransform(10);
    var lego2 = new legos.Lego();

    var val = 0;

    lego2.write = function write(item) {
      legos.Lego.prototype.write.call(this, item);
      val = item;
    };

    lego2.close = function close() {
      legos.Lego.prototype.close.call(this);
      val.should.equal(10);
      done();
    };

    lego1.snap(lego2);

    lego1.open();
    lego1.write(1555);
    lego1.close();
  });

  it('should transform item (String)', function(done) {
    var lego1 = new legos.LegoTransform('hello');
    var lego2 = new legos.Lego();

    var val = 0;

    lego2.write = function write(item) {
      legos.Lego.prototype.write.call(this, item);
      val = item;
    };

    lego2.close = function close() {
      legos.Lego.prototype.close.call(this);
      val.should.equal('hello');
      done();
    };

    lego1.snap(lego2);

    lego1.open();
    lego1.write(1555);
    lego1.close();
  });

  it('should transform item (Boolean)', function(done) {
    var lego1 = new legos.LegoTransform(true);
    var lego2 = new legos.Lego();

    var val = 0;

    lego2.write = function write(item) {
      legos.Lego.prototype.write.call(this, item);
      val = item;
    };

    lego2.close = function close() {
      legos.Lego.prototype.close.call(this);
      val.should.equal(true);
      done();
    };

    lego1.snap(lego2);

    lego1.open();
    lego1.write(1555);
    lego1.close();
  });

  it('should transform item (Function)', function(done) {
    var lego1 = new legos.LegoTransform(function(v){return v * 10;});
    var lego2 = new legos.Lego();

    var val = 0;

    lego2.write = function write(item) {
      legos.Lego.prototype.write.call(this, item);
      val = item;
    };

    lego2.close = function close() {
      legos.Lego.prototype.close.call(this);
      val.should.equal(15550);
      done();
    };

    lego1.snap(lego2);

    lego1.open();
    lego1.write(1555);
    lego1.close();
  });

  it('should transform item (deep)', function(done) {
    var lego1 = new legos.LegoTransform({a:{b:1337}});
    var lego2 = new legos.Lego();

    var val = 0;

    lego2.write = function write(item) {
      legos.Lego.prototype.write.call(this, item);
      val = item;
    };

    lego2.close = function close() {
      legos.Lego.prototype.close.call(this);
      val.a.b.should.equal(1337);
      done();
    };

    lego1.snap(lego2);

    lego1.open();
    lego1.write({a:{b:15}});
    lego1.close();
  });
});

describe('LegoContainer', function() {
  for (var i = 0; i <= 5; i++) {
    it('should pass an item (' + i + ' elements)', function() {
      var container = new legos.LegoContainer();
      for (var j = 0; j < i; j++) {
        container.push(new legos.Lego());
      }

      var lego = new legos.Lego();
      var count = 0;
      lego.write = function write(item) {
        legos.Lego.prototype.write.call(this, item);
        ++count;
      };

      container.snap(lego);
      container.open();
      container.write(1234);
      container.close();

      count.should.equal(1);
    });
  }

  for (var i = 0; i <= 5; i++) {
    it('should successfully transfer open/close events  (' + i + ' elements)',
        function() {
      var container = new legos.LegoContainer();
      for (var j = 0; j < i; j++) {
        container.push(new legos.Lego());
      }

      var lego = new legos.Lego();

      container.snap(lego);

      container._open.should.equal(false);
      lego._open.should.equal(false);
      for (var j = 0; j < i; j++) {
        container.legos[j]._open.should.equal(false);
      }

      container.open();
      container._open.should.equal(true);
      lego._open.should.equal(true);
      for (var j = 0; j < i; j++) {
        container.legos[j]._open.should.equal(true);
      }

      container.close();
      lego._open.should.equal(false);
      for (var j = 0; j < i; j++) {
        container.legos[j]._open.should.equal(false);
      }
    });
  }

  for (var i = 0; i <= 5; i++) {
    it('should sucessfully pass items in an X-topology (' + i + ' elements)',
        function() {
      var lego1 = new legos.Lego();
      var lego2 = new legos.Lego();
      var lego3 = new legos.LegoContainer();
      var lego4 = new legos.Lego();
      var lego5 = new legos.Lego();
      var lego6 = new legos.Lego();

      var count = 0;

      for (var j = 0; j < i; j++) {
        var inner = new legos.Lego();
        inner.write = function write(item) {
          legos.Lego.prototype.write.call(this, item);
          ++count;
        };
        lego3.push(inner);
      }

      lego1.snap(lego3);
      lego2.snap(lego3);
      lego3.snap(lego4);
      lego3.snap(lego5);
      lego4.snap(lego6);
      lego5.snap(lego6);

      lego6.write = function write(item) {
        legos.Lego.prototype.write.call(this, item);
        ++count;
      };

      lego1.open();
      lego2.open();
      lego1.write('test');
      lego2.write('test');
      lego3.write('test');
      lego1.close();
      lego2.close();

      count.should.equal(6 + (i * 3)); // three `.write('test')`'s
    });
  }
});

describe('LegoFilter', function() {
  it('should filter items (Number)', function() {
    var lego1 = new legos.LegoFilter(123);
    var lego2 = new legos.Lego();

    var count = 0;

    lego2.write = function write(item) {
      legos.Lego.prototype.write.call(this, item);
      ++count;
    };

    lego1.snap(lego2);
    lego1.open();
    lego1.write(12);
    lego1.write(123);
    lego1.write(234);
    lego1.close();

    count.should.equal(1);
  });

  it('should filter items (String)', function() {
    var lego1 = new legos.LegoFilter('bof');
    var lego2 = new legos.Lego();

    var count = 0;

    lego2.write = function write(item) {
      legos.Lego.prototype.write.call(this, item);
      ++count;
    };

    lego1.snap(lego2);
    lego1.open();
    lego1.write('foo');
    lego1.write(123);
    lego1.write('bar');
    lego1.write(234);
    lego1.write('bof');
    lego1.write('qix');
    lego1.close();

    count.should.equal(1);
  });

  it('should filter items (Boolean)', function() {
    var lego1 = new legos.LegoFilter(false);
    var lego2 = new legos.Lego();

    var count = 0;

    lego2.write = function write(item) {
      legos.Lego.prototype.write.call(this, item);
      ++count;
    };

    lego1.snap(lego2);
    lego1.open();
    lego1.write('foo');
    lego1.write(123);
    lego1.write('bar');
    lego1.write(false);
    lego1.write(true);
    lego1.write(234);
    lego1.write('bof');
    lego1.write('qix');
    lego1.close();

    count.should.equal(1);
  });

  it('should filter items (Function)', function() {
    var lego1 = new legos.LegoFilter(function(v) { return v === 123; });
    var lego2 = new legos.Lego();

    var count = 0;

    lego2.write = function write(item) {
      legos.Lego.prototype.write.call(this, item);
      ++count;
    };

    lego1.snap(lego2);
    lego1.open();
    lego1.write('foo');
    lego1.write(123);
    lego1.write('bar');
    lego1.write(false);
    lego1.write(true);
    lego1.write(234);
    lego1.write('bof');
    lego1.write('qix');
    lego1.close();

    count.should.equal(1);
  });

  it('should filter items (deep)', function() {
    var lego1 = new legos.LegoFilter({foo: function(v) { return v === 123; }});
    var lego2 = new legos.Lego();

    var count = 0;

    lego2.write = function write(item) {
      legos.Lego.prototype.write.call(this, item);
      ++count;
    };

    lego1.snap(lego2);
    lego1.open();
    lego1.write('foo');
    lego1.write(123);
    lego1.write('bar');
    lego1.write(false);
    lego1.write(true);
    lego1.write({herp: 'derp', foo: {bar: 123}});
    lego1.write({foo: 123});
    lego1.write(234);
    lego1.write('bof');
    lego1.write('qix');
    lego1.close();

    count.should.equal(9); // abyss allows non-objects as passes
  });
});

describe('LegoGlob', function() {
  it('should glob files', function(done) {
    var lego1 = new legos.LegoGlob('./*.js');
    var lego2 = new legos.Lego();

    var count = 0;
    lego2.write = function write(item) {
      legos.Lego.prototype.write.call(this, item);
      ++count;
    };

    lego2.close = function close() {
      legos.Lego.prototype.close.call(this);
      lego1._open.should.equal(false);
      lego2._open.should.equal(false);
      count.should.equal(2);
      done();
    };

    lego1.snap(lego2);
    lego1.open();
  });
});

describe('LegoEmitter', function() {
  it('should emit data event', function(done) {
    var lego1 = new legos.Lego();
    var lego2 = new legos.LegoEmitter();

    lego1.snap(lego2);

    var count = 0;
    lego2.on('data', function(item) {
      count += item;
    });

    lego2.on('end', function() {
      count.should.equal(16);
      done();
    });

    lego1.open();
    lego1.write(1);
    lego1.write(20);
    lego1.write(-5);
    lego1.close();
  });
});
