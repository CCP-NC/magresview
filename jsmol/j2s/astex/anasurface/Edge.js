Clazz.declarePackage ("astex.anasurface");
Clazz.load (["astex.util.IntArray", "astex.anasurface.Vertex"], "astex.anasurface.Edge", null, function () {
c$ = Clazz.decorateAsClass (function () {
this.torus = null;
this.v0 = null;
this.v1 = null;
this.cen = null;
this.r = 0;
this.angle = 0;
this.selfIntersects = false;
this.n = null;
this.probeFace = null;
this.torusFace = null;
Clazz.instantialize (this, arguments);
}, astex.anasurface, "Edge", astex.util.IntArray);
Clazz.prepareFields (c$, function () {
this.v0 =  new astex.anasurface.Vertex ();
this.v1 =  new astex.anasurface.Vertex ();
this.cen =  Clazz.newDoubleArray (3, 0);
this.n =  Clazz.newDoubleArray (3, 0);
});
Clazz.defineMethod (c$, "print", 
function (s) {
System.out.println (s + " v0.i " + this.v0.i + " v1.i " + this.v1.i);
}, "~S");
Clazz.defineMethod (c$, "isEdge", 
function (i, j) {
if ((this.v0.i == i && this.v1.i == j) || (this.v1.i == i && this.v0.i == j)) {
return true;
}return false;
}, "~N,~N");
Clazz.defineMethod (c$, "copy", 
function () {
var newe =  new astex.anasurface.Edge ();
for (var i = 0; i < 3; i++) {
newe.cen[i] = this.cen[i];
newe.n[i] = this.n[i];
}
newe.angle = this.angle;
newe.r = this.r;
newe.v0 = this.v0;
newe.v1 = this.v1;
return newe;
});
});
