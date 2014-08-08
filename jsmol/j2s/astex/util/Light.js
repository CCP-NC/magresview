Clazz.declarePackage ("astex.util");
c$ = Clazz.decorateAsClass (function () {
this.pos = null;
this.diffuse = 0;
this.specular = 0;
this.power = 50.0;
this.on = true;
Clazz.instantialize (this, arguments);
}, astex.util, "Light");
Clazz.prepareFields (c$, function () {
this.pos =  Clazz.newDoubleArray (3, 0);
});
Clazz.makeConstructor (c$, 
function (onOff, x, y, z, d, s, pow) {
this.on = onOff;
this.pos[0] = x;
this.pos[1] = y;
this.pos[2] = z;
this.normalisePos ();
this.diffuse = d;
this.specular = s;
this.power = pow;
}, "~B,~N,~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "normalisePos", 
function () {
var norm = this.pos[0] * this.pos[0] + this.pos[1] * this.pos[1] + this.pos[2] * this.pos[2];
norm = Math.sqrt (norm);
this.pos[0] /= norm;
this.pos[1] /= norm;
this.pos[2] /= norm;
});
