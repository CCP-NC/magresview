Clazz.declarePackage ("astex.calc");
Clazz.load (["astex.api.AstexTransformer"], "astex.calc.Transformer", ["astex.api.Interface", "astex.util.DoubleArray", "$.Matrix", "java.lang.Double"], function () {
c$ = Clazz.decorateAsClass (function () {
this.stOnto = null;
this.stFrom = null;
this.transformMatrix = null;
this.translationCG = null;
Clazz.instantialize (this, arguments);
}, astex.calc, "Transformer", null, astex.api.AstexTransformer);
Clazz.prepareFields (c$, function () {
this.translationCG = [0, 0, 0];
});
Clazz.overrideMethod (c$, "transform", 
function (mr, type, selectedAtoms) {
System.out.println ("xfm: " + type + "|");
if (this.stOnto != null) {
var aa = this.stOnto[0];
System.out.println ("xfm in " + this.stOnto.length + " " + aa.getX ());
}if (type.equals ("selectionToTransformOnto")) {
var n = selectedAtoms.size ();
this.stOnto =  new Array (n);
System.arraycopy (selectedAtoms.getArray (), 0, this.stOnto, 0, n);
var a = this.stOnto[0];
System.out.println ("set selectionToTransformOnto " + this.stOnto.length + " " + a.getX ());
}if (type.equals ("selectionToTransformFrom")) {
var b = this.stOnto[0];
System.out.println ("set selectionToTransformFrom " + this.stOnto.length + " " + b.getX ());
this.stFrom = selectedAtoms;
var fx =  new astex.util.DoubleArray ();
var fy =  new astex.util.DoubleArray ();
var fz =  new astex.util.DoubleArray ();
var tx =  new astex.util.DoubleArray ();
var ty =  new astex.util.DoubleArray ();
var tz =  new astex.util.DoubleArray ();
var fcg = [0, 0, 0];
var tcg = [0, 0, 0];
var frSize = this.stFrom.size ();
var toSize = this.stOnto.length;
var size = frSize < toSize ? frSize : toSize;
for (var i = 0; i < size; i++) {
var a1 = this.stOnto[i];
var a2 = this.stFrom.get (i);
fx.add (a1.getX ());
fy.add (a1.getY ());
fz.add (a1.getZ ());
tx.add (a2.getX ());
ty.add (a2.getY ());
tz.add (a2.getZ ());
tcg[0] += a1.getX ();
tcg[1] += a1.getY ();
tcg[2] += a1.getZ ();
fcg[0] += a2.getX ();
fcg[1] += a2.getY ();
fcg[2] += a2.getZ ();
if (i < 5) System.out.println (a1.getX () + " " + a2.getX () + " " + tcg[0] + " " + fcg[0]);
}
for (var i = 0; i < 3; i++) {
tcg[i] /= size;
fcg[i] /= size;
}
for (var i = 0; i < 3; i++) {
this.translationCG[i] = tcg[i] - fcg[i];
}
this.transformMatrix =  new astex.util.Matrix ();
(astex.api.Interface.getInterface ("astex.calc.Fit")).fit (fx.getArray (), fy.getArray (), fz.getArray (), tx.getArray (), ty.getArray (), tz.getArray (), tz.size (), this.transformMatrix);
System.out.println ("set selectionToTransformFrom " + size + " " + frSize + " " + toSize);
System.out.println ("trCG: " + this.translationCG[0] + " " + this.translationCG[1] + " " + this.translationCG[2]);
this.stFrom = null;
this.stOnto = null;
}if (type.startsWith ("applyTranslation")) {
var transformFraction = 1;
try {
transformFraction = ( new Double (type.substring (16))).doubleValue ();
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
} else {
throw e;
}
}
System.out.println ("x applyTranslation " + transformFraction);
System.out.println ("trCG 2: " + this.translationCG[0] + " " + this.translationCG[1] + " " + this.translationCG[2]);
for (var i = 0; i < selectedAtoms.size (); i++) {
var a1 = selectedAtoms.get (i);
a1.setXX (a1.getX () + transformFraction * this.translationCG[0]);
a1.setYY (a1.getY () + transformFraction * this.translationCG[1]);
a1.setZZ (a1.getZ () + transformFraction * this.translationCG[2]);
}
}if (this.stOnto != null && this.stOnto.length > 0) {
System.out.println ("end xfm " + this.stOnto.length);
var c = this.stOnto[0];
System.out.println ("end xfm " + this.stOnto.length + " " + c.getX ());
} else {
System.out.println ("end xfm selectionToTransformOnto is null");
}}, "astex.render.MoleculeRenderer,~S,astex.util.DynamicArray");
Clazz.overrideMethod (c$, "rotateByAxis", 
function (ux, uy, uz, px, py, pz, theta, selectedAtoms) {
var angle = theta * 3.141592653589793 / 180;
var c = Math.cos (angle);
var C = 1 - c;
var s = Math.sin (angle);
var ax = px;
var ay = py;
var az = pz;
var x = ux;
var y = uy;
var z = uz;
var r = Math.sqrt (x * x + y * y + z * z);
x /= r;
y /= r;
z /= r;
var ma11 = x * x * C + c;
var ma12 = x * y * C - z * s;
var ma13 = x * z * C + y * s;
var ma21 = y * x * C + z * s;
var ma22 = y * y * C + c;
var ma23 = y * z * C - x * s;
var ma31 = z * x * C - y * s;
var ma32 = z * y * C + x * s;
var ma33 = z * z * C + c;
var selectedAtomCount = selectedAtoms.size ();
var tx;
var ty;
var tz;
var sx;
var sy;
var sz;
for (var i = 0; i < selectedAtomCount; i++) {
var a = selectedAtoms.get (i);
sx = a.getX ();
sy = a.getY ();
sz = a.getZ ();
sx -= ax;
sy -= ay;
sz -= az;
tx = ma11 * sx + ma12 * sy + ma13 * sz;
ty = ma21 * sx + ma22 * sy + ma23 * sz;
tz = ma31 * sx + ma32 * sy + ma33 * sz;
tx += ax;
ty += ay;
tz += az;
a.setXX (tx);
a.setYY (ty);
a.setZZ (tz);
}
}, "~N,~N,~N,~N,~N,~N,~N,astex.util.DynamicArray");
Clazz.overrideMethod (c$, "rotateByMatrix", 
function (ma11, ma12, ma13, ma21, ma22, ma23, ma31, ma32, ma33, selectedAtoms) {
var selectedAtomCount = selectedAtoms.size ();
var tx;
var ty;
var tz;
for (var i = 0; i < selectedAtomCount; i++) {
var a = selectedAtoms.get (i);
tx = ma11 * a.getX () + ma12 * a.getY () + ma13 * a.getZ ();
ty = ma21 * a.getX () + ma22 * a.getY () + ma23 * a.getZ ();
tz = ma31 * a.getX () + ma32 * a.getY () + ma33 * a.getZ ();
a.setXX (tx);
a.setYY (ty);
a.setZZ (tz);
}
}, "~N,~N,~N,~N,~N,~N,~N,~N,~N,astex.util.DynamicArray");
Clazz.overrideMethod (c$, "translate", 
function (rx, ry, rz, selectedAtoms) {
var selectedAtomCount = selectedAtoms.size ();
for (var i = 0; i < selectedAtomCount; i++) {
var a = selectedAtoms.get (i);
a.setXX (a.getX () + rx);
a.setYY (a.getY () + ry);
a.setZZ (a.getZ () + rz);
}
}, "~N,~N,~N,astex.util.DynamicArray");
Clazz.overrideMethod (c$, "moveAtoms", 
function (att, value, selectedAtoms) {
var printedError = false;
for (var i = selectedAtoms.size (); --i >= 0; ) {
var a = selectedAtoms.get (i);
switch (att) {
case 3:
a.setBFactor (value);
break;
case 4:
a.setOccupancy (value);
break;
case 0:
a.setXX (value);
break;
case 1:
a.setYY (value);
break;
case 2:
a.setZZ (value);
break;
default:
if (!printedError) {
System.out.println ("error unknown attribute " + att);
printedError = true;
}}
}
}, "~N,~N,astex.util.DynamicArray");
});
