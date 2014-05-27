var expect = require('chai').expect;

var O3 = require('../src/ozone');
var Angle = O3.Angle;
var BBox = O3.BBox;

// mock out DOM
global.document = {
  getElementById: function() {
    return {
      getContext: function() {
        return {}
      }
    };
  }
};

describe('O3', function() {
  var o3;

  beforeEach(function() {
    o3 = new O3();
  });

  describe('setAngle()', function() {
    it('sets the angle property', function() {
      o3.setAngle(123.4);
      expect(o3.angle).to.be.closeTo(123.4, 0.01);
    });

    it('normalizes the angle', function() {
      o3.setAngle(432.1);
      expect(o3.angle).to.be.closeTo(72.1, 0.01);

      o3.setAngle(-123.4);
      expect(o3.angle).to.be.closeTo(236.6, 0.01);
    });
  });

  describe('setLegs()', function() {
    it('sets the angles property', function() {
      o3.setLegs(30, 175.6);
      expect(o3.prev).to.be.closeTo(30, 0.01);
      expect(o3.next).to.be.closeTo(175.6, 0.01);
    });

    it('normalizes the angles', function() {
      o3.setLegs(360, 175.6);
      expect(o3.prev).to.be.closeTo(0, 0.01);
      expect(o3.next).to.be.closeTo(175.6, 0.01);

      o3.setLegs(42, -123.4);
      expect(o3.prev).to.be.closeTo(42, 0.01);
      expect(o3.next).to.be.closeTo(236.6, 0.01);
    });
  });

  describe('getEffectiveAngle()', function() {
    it('primarily uses angle property', function() {
      o3.setAngle(120);
      o3.setLegs(30, 175.6);
      expect(o3.getEffectiveAngle()).to.be.closeTo(120, 0.01);
    });

    it('falls back to legs bisector', function() {
      o3.setLegs(45, 135);
      expect(o3.getEffectiveAngle()).to.be.closeTo(0, 0.01);

      o3.setLegs(-45, 45);
      expect(o3.getEffectiveAngle()).to.be.closeTo(270, 0.01);
    });

    it('works properly on first leg', function() {
      o3.setLegs(45, null);
      expect(o3.getEffectiveAngle()).to.be.closeTo(225, 0.01);
    });

    it('works properly on first leg', function() {
      o3.setLegs(null, 90);
      expect(o3.getEffectiveAngle()).to.be.closeTo(90, 0.01);
    });
  });
});

describe('Angle', function() {
  describe('toRad()', function() {
    it('converts degrees to radian', function() {
      expect(Angle.toRad(0)).to.equal(0);
      expect(Angle.toRad(45)).to.equal(Math.PI / 4);
      expect(Angle.toRad(60)).to.equal(Math.PI / 3);
      expect(Angle.toRad(90)).to.equal(Math.PI / 2);
      expect(Angle.toRad(180)).to.equal(Math.PI);
      expect(Angle.toRad(360)).to.equal(2 * Math.PI);
      expect(Angle.toRad(7200)).to.equal(40 * Math.PI);
    });
  });

  describe('normalize()', function() {
    it('should return normalized angle', function() {
      expect(Angle.normalize(0)).to.equal(0);
      expect(Angle.normalize(360)).to.equal(0);
      expect(Angle.normalize(7200)).to.equal(0);

      expect(Angle.normalize(359)).to.equal(359);
      expect(Angle.normalize(-1)).to.equal(359);

      expect(Angle.normalize(300)).to.equal(300);
      expect(Angle.normalize(-60)).to.equal(300);

      expect(Angle.normalize(123)).to.equal(123);
    });
  });

  describe('between()', function() {
    it('should return whether angle is between left and right', function() {
      expect(Angle.between(0, 30, 180)).to.be.false;
      expect(Angle.between(90, 30, 180)).to.be.true;
      expect(Angle.between(180, 30, 180)).to.be.true;

      expect(Angle.between(-90, -45, 45)).to.be.false;
      expect(Angle.between(-30, -45, 45)).to.be.true;
      expect(Angle.between(30, -45, 45)).to.be.true;
      expect(Angle.between(90, -45, 45)).to.be.false;

      // the angles are normalized, so 180 deg is not between 0 deg and 0 deg
      expect(Angle.between(180, 0, 360)).to.be.false;
    });
  });

  describe('bisector()', function() {
    it('should return the bisector angle', function() {
      expect(Angle.bisector(0, 180)).to.equal(0);
      expect(Angle.bisector(0, 90)).to.equal(315);
      expect(Angle.bisector(0, 60)).to.equal(300);

      expect(Angle.bisector(45, 135)).to.equal(0);
      expect(Angle.bisector(45, -45)).to.equal(90);
    });
  });
});

describe('BBox', function() {
  describe('addPoint()', function() {
    it('should extend the bounding box in the right directions', function() {
      var bb = new BBox(0, -2);

      expect(bb.left).to.equal(0);
      expect(bb.right).to.equal(0);
      expect(bb.top).to.equal(-2);
      expect(bb.bottom).to.equal(-2);

      bb.addPoint(10, 20);

      expect(bb.left).to.equal(0);
      expect(bb.right).to.equal(10);
      expect(bb.top).to.equal(20);
      expect(bb.bottom).to.equal(-2);

      bb.addPoint(-5, 10);

      expect(bb.left).to.equal(-5);
      expect(bb.right).to.equal(10);
      expect(bb.top).to.equal(20);
      expect(bb.bottom).to.equal(-2);
    });
  });

  describe('addSector()', function() {
    it('skips small radius', function() {
      var bb = new BBox(0, 0);
      bb.addSector(90, 180, 0)

      expect(bb.left).to.equal(0);
      expect(bb.right).to.equal(0);
      expect(bb.top).to.equal(0);
      expect(bb.bottom).to.equal(0);
    });

    it('skips small width', function() {
      var bb = new BBox(0, 0);
      bb.addSector(90, 0, 10000)

      expect(bb.left).to.equal(0);
      expect(bb.right).to.equal(0);
      expect(bb.top).to.equal(0);
      expect(bb.bottom).to.equal(0);
    });

    it('handles circles correctly', function() {
      var bb = new BBox(0, 0);
      bb.addSector(90, 180, 10000)

      expect(bb.left).to.equal(-10000);
      expect(bb.right).to.equal(10000);
      expect(bb.top).to.equal(10000);
      expect(bb.bottom).to.equal(-10000);
    });

    it('handles 90 degree sector correctly', function() {
      var bb = new BBox(0, 0);
      bb.addSector(90, 45, 10000)

      expect(bb.left).to.be.closeTo(-10000, 0.01);
      expect(bb.right).to.be.closeTo(0, 0.01);
      expect(bb.top).to.be.closeTo(10000 * Math.sin(Math.PI / 4), 0.01);
      expect(bb.bottom).to.be.closeTo(-10000 * Math.sin(Math.PI / 4), 0.01);
    });

    it('handles 180 degree sector correctly', function() {
      var bb = new BBox(0, 0);
      bb.addSector(90, 90, 10000)

      expect(bb.left).to.be.closeTo(-10000, 0.01);
      expect(bb.right).to.be.closeTo(0, 0.01);
      expect(bb.top).to.be.closeTo(10000, 0.01);
      expect(bb.bottom).to.be.closeTo(-10000, 0.01);
    });
  });

  describe('getWidth/Height()', function() {
    it('should return the right size', function() {
      var bb = new BBox(0, 0);
      bb.addPoint(10, 20);

      expect(bb.getWidth()).to.equal(10);
      expect(bb.getHeight()).to.equal(20);
    });
  });
});
