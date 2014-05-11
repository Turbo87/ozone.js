# ozone.js

ozone.js is a gliding observation zone renderer based on the HTML5 canvas API.

## Usage

Create a HTML5 canvas somewhere on your page:

~~~~html
<canvas id="myCanvas" width="500" height="400"></canvas>
~~~~

Create an `O3` instance passing in the `id` of the canvas:

~~~~javascript
var o = new O3('myCanvas');
~~~~

Set the observation zone parameters:

~~~~javascript
o.setZone({
    'A1': 45,
    'R1': 10000,
    'A2': 180,
    'R2': 500,
});
~~~~

Set the observation zone angle, or set the legs to calculate the angle automatically:

~~~~javascript
o.setAngle(30);
o.setLegs(80, 200);
~~~~

Setting the legs will also cause the renderer to draw the legs below the observation zone.

Finally draw the observation zone to the canvas:

~~~~javascript
o.draw();
~~~~
