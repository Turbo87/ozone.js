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

    this.options = {
        fillOpacity: 0.7,
        fillColor: '#fff',
        strokeOpacity: 1,
        strokeColor: '#000',
        strokeWidth: 3,
        strokeShadowColor: '#999'
    };

    // set user-specified options
    this.setOptions(opt_options || {});

    this.zone = this.angle = this.prev = this.next = null;
};

O3.prototype.setOptions = function(options) {
    for (var attrname in options)
        this.options[attrname] = options[attrname];
}

O3.prototype.setZone = function(zone) {
    this.zone = zone;
};

O3.prototype.setAngle = function(angle) {
    this.angle = Angle.normalize(angle);
};

O3.prototype.setLegs = function(prev, next) {
    this.prev = Angle.normalize(prev);
    this.next = Angle.normalize(next);
};

O3.prototype.getEffectiveAngle = function() {
    if (this.angle !== null)
        return this.angle;

    if (this.prev !== null && this.next === null)
        return this.prev + 180;

    if (this.prev === null && this.next !== null)
        return this.next;

    if (this.prev !== null && this.next !== null)
        return Angle.bisector(this.prev, this.next);

    console.error('Undefined angle; use setLegs() or setAngle()');
};

O3.prototype.draw = function() {
    this.clear();

    var angle = this.getEffectiveAngle();

    // calculate bounding box of the observation zone
    var bb = new BBox(0, 0);
    bb.addSector(angle, this.zone.A1, this.zone.R1);
    bb.addSector(angle, this.zone.A2, this.zone.R2);

    // calculate pixel per meter resolution factor
    var factor = Math.min(this.canvas.width / bb.getWidth(),
                          this.canvas.height / bb.getHeight());

    // scale radius to pixels
    var R1 = this.zone.R1 * factor;
    var R2 = this.zone.R2 * factor;

    // calculate reference point coordinate
    var x = this.canvas.width / 2;
    var y = this.canvas.height / 2;

    x += (-bb.left - bb.getWidth() / 2) * factor;
    y += (bb.top - bb.getHeight() / 2) * factor;

    var radA = Angle.toRad(angle);
    var radA1 = Angle.toRad(this.zone.A1);
    var radA2 = Angle.toRad(this.zone.A2);

    this.ctx.beginPath();

    if (this.zone.A2 > 0.5 && this.zone.A2 < 179.5)
        this.ctx.moveTo(x, y);

    this.ctx.arc(x, y, R2,
                 radA + Math.PI / 2 - radA2,
                 radA + Math.PI / 2 - radA1,
                 this.zone.A2 < this.zone.A1);

    this.ctx.arc(x, y, R1,
                 radA + Math.PI / 2 - radA1,
                 radA + Math.PI / 2 + radA1);

    this.ctx.arc(x, y, R2,
                 radA + Math.PI / 2 + radA1,
                 radA + Math.PI / 2 + radA2,
                 this.zone.A2 < this.zone.A1);

    this.ctx.closePath();

    var options = this.options;

    this.ctx.globalAlpha = options.fillOpacity;
    this.ctx.fillStyle = options.fillColor;
    this.ctx.shadowBlur = 0;

    this.ctx.fill();

    this.ctx.globalAlpha = options.strokeOpacity;
    this.ctx.strokeStyle = options.strokeColor;
    this.ctx.lineWidth = options.strokeWidth;
    this.ctx.shadowColor = options.strokeShadowColor;
    this.ctx.shadowBlur = options.strokeWidth;

    this.ctx.stroke();
};

O3.prototype.clear = function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

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

BBox.prototype.addPoint = function (x, y) {
    if (x < this.left)
        this.left = x;
    if (x > this.right)
        this.right = x;
    if (y > this.top)
        this.top = y;
    if (y < this.bottom)
        this.bottom = y;
};

BBox.prototype.addSector = function (angle, width, radius) {
    // ignore sector with less than 50cm radius or less than 0.5 degrees
    if (radius < 0.5 || width < 0.5)
        return;

    // fast path for full circle
    if (width > 179.5) {
        this.addPoint(radius, radius);
        this.addPoint(-radius, -radius);
        return;
    }

    // calculate edge angles
    var left = Angle.normalize(angle + 180 - width);
    var right = Angle.normalize(angle + 180 + width);
    var leftRad = Angle.toRad(left);
    var rightRad = Angle.toRad(right);

    // add edge points to bounding box
    this.addPoint(Math.sin(leftRad) * radius, Math.cos(leftRad) * radius);
    this.addPoint(Math.sin(rightRad) * radius, Math.cos(rightRad) * radius);

    // add right angle points to bounding box if included in sector
    if (Angle.between(0, left, right))
        this.addPoint(0, radius);
    if (Angle.between(90, left, right))
        this.addPoint(radius, 0);
    if (Angle.between(180, left, right))
        this.addPoint(0, -radius);
    if (Angle.between(270, left, right))
        this.addPoint(-radius, 0);
};

BBox.prototype.getWidth = function() {
    return this.right - this.left;
};

BBox.prototype.getHeight = function() {
    return this.top - this.bottom;
};

if (typeof exports === 'object')
    module.exports = O3;
