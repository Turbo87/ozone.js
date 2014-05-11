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

if (typeof exports === 'object')
    module.exports = O3;
