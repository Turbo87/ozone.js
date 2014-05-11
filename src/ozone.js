var O3 = function(id, opt_options) {
    // find canvas element with given id
    this.canvas = document.getElementById(id);
    if (!this.canvas)
        return console.error('#' + id + ' not found');

    if (!this.canvas.getContext)
        return console.error('#' + id + ' is not a canvas');

    // get drawing context
    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx)
        return console.error('could not get drawing context on #' + id);
};

O3.prototype.setOptions = function(options) {
}

O3.prototype.setZone = function(zone) {
};

O3.prototype.setAngle = function(angle) {
};

O3.prototype.setLegs = function(prev, next) {
};

O3.prototype.getEffectiveAngle = function() {
};

O3.prototype.draw = function() {
};

var Angle = O3.Angle = {};

Angle.DEG_TO_RAD = Math.PI / 180;

Angle.toRad = function(angle) {
    return angle * Angle.DEG_TO_RAD;
};

Angle.normalize = function(angle) {
    while (angle < 0)
        angle += 360;
    while (angle >= 360)
        angle -= 360;
    return angle;
};

Angle.between = function(angle, left, right) {
    var width = Angle.normalize(right - left);
    var delta = Angle.normalize(angle - left);
    return delta <= width;
};

Angle.bisector = function(prev, next) {
    prev = Angle.normalize(prev + 180);
    next = Angle.normalize(next);

    if (prev == next) {
        return Angle.normalize(prev + 180);

    } else if (prev > next) {
        if ((prev - next) < 180)
            return Angle.normalize((prev + next) / 2 + 180);
        else
            return Angle.normalize((prev + next) / 2);

    } else {
        if ((next - prev) < 180)
            return Angle.normalize((prev + next) / 2 + 180);
        else
            return Angle.normalize((prev + next) / 2);
    }
}

var BBox = O3.BBox = function(x, y) {
    this.left = this.right = x;
    this.top = this.bottom = y;
};

BBox.prototype.extend = function (x, y) {
    if (x < this.left)
        this.left = x;
    if (x > this.right)
        this.right = x;
    if (y > this.top)
        this.top = y;
    if (y < this.bottom)
        this.bottom = y;
};

BBox.prototype.getWidth = function() {
    return this.right - this.left;
}

BBox.prototype.getHeight = function() {
    return this.top - this.bottom;
}

if (typeof exports === 'object')
    module.exports = O3;
