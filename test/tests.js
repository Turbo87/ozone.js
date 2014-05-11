var expect = require('chai').expect;

var O3 = require('../src/ozone');
var Angle = O3.Angle;

describe('Angle', function() {
  describe('normalize()', function() {
    it('should return normalized angle', function(){
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
    it('should return whether angle is between left and right', function(){
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
