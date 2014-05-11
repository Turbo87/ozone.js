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
});
