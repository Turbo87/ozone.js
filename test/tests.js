var expect = require('chai').expect;

var O3 = require('../src/ozone');
var Angle = O3.Angle;
var BBox = O3.BBox;

describe('Angle', function() {
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
});

describe('BBox', function() {
  describe('extend()', function() {
    it('should extend the bounding box in the right directions', function() {
      var bb = new BBox(0, -2);

      expect(bb.left).to.equal(0);
      expect(bb.right).to.equal(0);
      expect(bb.top).to.equal(-2);
      expect(bb.bottom).to.equal(-2);

      bb.extend(10, 20);

      expect(bb.left).to.equal(0);
      expect(bb.right).to.equal(10);
      expect(bb.top).to.equal(20);
      expect(bb.bottom).to.equal(-2);

      bb.extend(-5, 10);

      expect(bb.left).to.equal(-5);
      expect(bb.right).to.equal(10);
      expect(bb.top).to.equal(20);
      expect(bb.bottom).to.equal(-2);
    });
  });
});
