Clazz.declarePackage ("astex.anasurface");
Clazz.load (["astex.util.DynamicArray"], "astex.anasurface.Face", null, function () {
c$ = Clazz.decorateAsClass (function () {
this.type = 0;
this.intersection = 0;
this.iij = null;
this.iji = null;
this.skip = false;
this.cen = null;
this.r = -1.0;
this.startAngle = 0.0;
this.stopAngle = 0.0;
this.torus = null;
Clazz.instantialize (this, arguments);
}, astex.anasurface, "Face", astex.util.DynamicArray);
Clazz.prepareFields (c$, function () {
this.cen =  Clazz.newDoubleArray (3, 0);
});
c$.newType = Clazz.defineMethod (c$, "newType", 
function (t) {
var f =  new astex.anasurface.Face ();
f.type = t;
if (t == 2) {
f.iij =  Clazz.newDoubleArray (3, 0);
f.iji =  Clazz.newDoubleArray (3, 0);
}return f;
}, "~N");
Clazz.makeConstructor (c$, 
 function () {
Clazz.superConstructor (this, astex.anasurface.Face, []);
});
Clazz.defineMethod (c$, "add", 
function (e) {
Clazz.superCall (this, astex.anasurface.Face, "add", [e]);
if (this.type == 3) {
if (e.probeFace == null) {
e.probeFace = this;
} else {
}}}, "astex.anasurface.Edge");
Clazz.defineMethod (c$, "isValid", 
function () {
var edgeCount = this.size ();
var previous = this.get (this.size () - 1);
for (var i = 0; i < edgeCount; i++) {
var e = this.get (i);
if (e.v0 !== previous.v1) {
System.out.println ("face error");
return false;
}previous = e;
}
return true;
});
Clazz.defineMethod (c$, "print", 
function (s) {
System.out.println (s + " " + this.size () + " edges");
for (var i = 0; i < this.size (); i++) {
var e = this.get (i);
System.out.println ("v0.vi " + e.v0.vi + " v1.vi " + e.v1.vi);
}
}, "~S");
Clazz.defineStatics (c$,
"ProbeIntersection", 1,
"TorusIntersection", 2,
"Convex", 1,
"Saddle", 2,
"Concave", 3,
"Undefined", 4);
});
