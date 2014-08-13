Clazz.declarePackage ("astex.anasurface");
Clazz.load (null, "astex.anasurface.Probe", ["astex.util.DynamicArray"], function () {
c$ = Clazz.decorateAsClass (function () {
this.x = null;
this.bijk = null;
this.r = 0.0;
this.bc = 0;
this.edge0 = null;
this.edge1 = null;
this.edge2 = null;
this.i = 0;
this.j = 0;
this.k = 0;
this.clippingProbes = null;
Clazz.instantialize (this, arguments);
}, astex.anasurface, "Probe");
Clazz.prepareFields (c$, function () {
this.x =  Clazz.newDoubleArray (3, 0);
this.bijk =  Clazz.newDoubleArray (3, 0);
});
Clazz.defineMethod (c$, "addClippingProbe", 
function (p) {
if (this.clippingProbes == null) {
this.clippingProbes =  new astex.util.DynamicArray ().set (2, 0);
}this.clippingProbes.add (p);
}, "astex.anasurface.Probe");
Clazz.defineMethod (c$, "involves", 
function (iatom) {
if (this.i == iatom || this.j == iatom || this.k == iatom) {
return true;
}return false;
}, "~N");
Clazz.defineMethod (c$, "getVertexForAtom", 
function (iatom) {
if (this.edge0.v0.i == iatom) return this.edge0.v0;
if (this.edge1.v0.i == iatom) return this.edge1.v0;
if (this.edge2.v0.i == iatom) return this.edge2.v0;
return null;
}, "~N");
Clazz.defineMethod (c$, "getEdgeTo", 
function (i) {
if (this.edge0.v1.i == i) return this.edge0;
if (this.edge1.v1.i == i) return this.edge1;
if (this.edge2.v1.i == i) return this.edge2;
return null;
}, "~N");
Clazz.defineMethod (c$, "getEdgeFrom", 
function (i) {
if (this.edge0.v0.i == i) return this.edge0;
if (this.edge1.v0.i == i) return this.edge1;
if (this.edge2.v0.i == i) return this.edge2;
return null;
}, "~N");
Clazz.defineMethod (c$, "getEdge", 
function (i, j) {
if (this.edge0.isEdge (i, j)) {
return this.edge0;
}if (this.edge1.isEdge (i, j)) {
return this.edge1;
}if (this.edge2.isEdge (i, j)) {
return this.edge2;
}return null;
}, "~N,~N");
});
