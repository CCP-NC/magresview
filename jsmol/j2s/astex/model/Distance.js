Clazz.declarePackage ("astex.model");
Clazz.load (["astex.generic.Generic", "astex.util.DynamicArray"], "astex.model.Distance", ["astex.generic.GenericInterface", "astex.util.Color32", "$.Point3d", "java.awt.Color"], function () {
c$ = Clazz.decorateAsClass (function () {
this.group0 = null;
this.group1 = null;
Clazz.instantialize (this, arguments);
}, astex.model, "Distance", astex.generic.Generic);
Clazz.prepareFields (c$, function () {
this.group0 =  new astex.util.DynamicArray ();
this.group1 =  new astex.util.DynamicArray ();
});
c$.createDistanceMonitor = Clazz.defineMethod (c$, "createDistanceMonitor", 
function (a0, a1) {
var monitorAtomLabel = "%a %r%c";
var d =  new astex.model.Distance ();
d.group0.add (a0);
d.group1.add (a1);
d.setString ("name", a0.generateLabel (monitorAtomLabel) + "-" + a1.generateLabel (monitorAtomLabel));
d.setString ("format", "%.2fA");
d.setDouble ("on", 0.2);
d.setDouble ("off", 0.2);
d.setDouble ("radius", -1.0);
d.setInteger ("mode", 1);
d.setBoolean ("visible", true);
d.setValue ("color",  new java.awt.Color (astex.util.Color32.white));
d.setValue ("labelcolor",  new java.awt.Color (astex.util.Color32.white));
return d;
}, "astex.model.Atom,astex.model.Atom");
Clazz.defineMethod (c$, "getCenter0", 
function () {
var p =  new astex.util.Point3d ();
this.getCenter (p, this.group0);
return p;
});
Clazz.defineMethod (c$, "getCenter1", 
function () {
var p =  new astex.util.Point3d ();
this.getCenter (p, this.group1);
return p;
});
Clazz.defineMethod (c$, "getCenter", 
function (p, d) {
p.set (0.0, 0.0, 0.0);
var n = d.size ();
if (n == 0) {
return;
}for (var i = 0; i < n; i++) {
var a = d.get (i);
p.x += a.x;
p.y += a.y;
p.z += a.z;
}
p.x /= n;
p.y /= n;
p.z /= n;
}, "astex.util.Point3d,astex.util.DynamicArray");
Clazz.defineMethod (c$, "valid", 
function () {
if (this.getBoolean ("visible", false) == false) {
return false;
}var ngroup0 = this.group0.size ();
var ngroup1 = this.group1.size ();
if (ngroup0 == 0 || ngroup1 == 0) {
return false;
}for (var i = 0; i < ngroup0; i++) {
var a = this.group0.get (i);
if (a.isDisplayed () == false) {
return false;
}var mol = a.getMolecule ();
if (mol.getDisplayed () == false) {
return false;
}}
for (var i = 0; i < ngroup1; i++) {
var a = this.group1.get (i);
if (a.isDisplayed () == false) {
return false;
}var mol = a.getMolecule ();
if (mol.getDisplayed () == false) {
return false;
}}
return true;
});
Clazz.defineStatics (c$,
"Mode", "mode",
"Visible", "visible",
"Format", "format",
"Color", "color",
"LabelColor", "labelcolor",
"On", "on",
"Off", "off",
"Radius", "radius",
"Pairs", 1,
"Centroids", 2);
});
