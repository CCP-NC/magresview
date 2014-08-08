Clazz.declarePackage ("astex.util");
Clazz.load (["astex.util.Format"], "astex.util.Matrix", ["astex.io.FILE", "astex.util.Log"], function () {
c$ = Clazz.decorateAsClass (function () {
this.x00 = 0;
this.x01 = 0;
this.x02 = 0;
this.x03 = 0;
this.x10 = 0;
this.x11 = 0;
this.x12 = 0;
this.x13 = 0;
this.x20 = 0;
this.x21 = 0;
this.x22 = 0;
this.x23 = 0;
this.x30 = 0;
this.x31 = 0;
this.x32 = 0;
this.x33 = 0;
Clazz.instantialize (this, arguments);
}, astex.util, "Matrix");
Clazz.makeConstructor (c$, 
function () {
this.setIdentity ();
});
Clazz.makeConstructor (c$, 
function ($in) {
this.copy ($in);
}, "astex.util.Matrix");
Clazz.defineMethod (c$, "setIdentity", 
function () {
this.x00 = 1.0;
this.x01 = 0.0;
this.x02 = 0.0;
this.x03 = 0.0;
this.x10 = 0.0;
this.x11 = 1.0;
this.x12 = 0.0;
this.x13 = 0.0;
this.x20 = 0.0;
this.x21 = 0.0;
this.x22 = 1.0;
this.x23 = 0.0;
this.x30 = 0.0;
this.x31 = 0.0;
this.x32 = 0.0;
this.x33 = 1.0;
});
Clazz.defineMethod (c$, "zero", 
function () {
this.x00 = 0.0;
this.x01 = 0.0;
this.x02 = 0.0;
this.x03 = 0.0;
this.x10 = 0.0;
this.x11 = 0.0;
this.x12 = 0.0;
this.x13 = 0.0;
this.x20 = 0.0;
this.x21 = 0.0;
this.x22 = 0.0;
this.x23 = 0.0;
this.x30 = 0.0;
this.x31 = 0.0;
this.x32 = 0.0;
this.x33 = 0.0;
});
Clazz.defineMethod (c$, "set", 
function (m) {
this.x00 = m.x00;
this.x01 = m.x01;
this.x02 = m.x02;
this.x03 = m.x03;
this.x10 = m.x10;
this.x11 = m.x11;
this.x12 = m.x12;
this.x13 = m.x13;
this.x20 = m.x20;
this.x21 = m.x21;
this.x22 = m.x22;
this.x23 = m.x23;
this.x30 = m.x30;
this.x31 = m.x31;
this.x32 = m.x32;
this.x33 = m.x33;
}, "astex.util.Matrix");
Clazz.defineMethod (c$, "set", 
function (i, j, val) {
if (i < 0 || i > 3 || j < 0 || j > 3) {
astex.util.Log.error ("trying to set element " + i + "," + j + " to %g", val);
return;
}if (i == 0) {
if (j == 0) this.x00 = val;
 else if (j == 1) this.x01 = val;
 else if (j == 2) this.x02 = val;
 else if (j == 3) this.x03 = val;
} else if (i == 1) {
if (j == 0) this.x10 = val;
 else if (j == 1) this.x11 = val;
 else if (j == 2) this.x12 = val;
 else if (j == 3) this.x13 = val;
} else if (i == 2) {
if (j == 0) this.x20 = val;
 else if (j == 1) this.x21 = val;
 else if (j == 2) this.x22 = val;
 else if (j == 3) this.x23 = val;
} else if (i == 3) {
if (j == 0) this.x30 = val;
 else if (j == 1) this.x31 = val;
 else if (j == 2) this.x32 = val;
 else if (j == 3) this.x33 = val;
} else {
astex.util.Log.error ("trying to set row %d", i);
}}, "~N,~N,~N");
Clazz.defineMethod (c$, "scale", 
function (sx, sy, sz) {
this.x00 *= sx;
this.x01 *= sy;
this.x02 *= sz;
this.x10 *= sx;
this.x11 *= sy;
this.x12 *= sz;
this.x20 *= sx;
this.x21 *= sy;
this.x22 *= sz;
this.x30 *= sx;
this.x31 *= sy;
this.x32 *= sz;
}, "~N,~N,~N");
Clazz.defineMethod (c$, "translate", 
function (tx, ty, tz) {
this.x00 += this.x03 * tx;
this.x01 += this.x03 * ty;
this.x02 += this.x03 * tz;
this.x10 += this.x13 * tx;
this.x11 += this.x13 * ty;
this.x12 += this.x13 * tz;
this.x20 += this.x23 * tx;
this.x21 += this.x23 * ty;
this.x22 += this.x23 * tz;
this.x30 += this.x33 * tx;
this.x31 += this.x33 * ty;
this.x32 += this.x33 * tz;
}, "~N,~N,~N");
Clazz.defineMethod (c$, "pretranslate", 
function (tx, ty, tz) {
this.x30 = tx * this.x00 + ty * this.x10 + tz * this.x20;
this.x31 = tx * this.x01 + ty * this.x11 + tz * this.x21;
this.x32 = tx * this.x02 + ty * this.x12 + tz * this.x22;
}, "~N,~N,~N");
Clazz.defineMethod (c$, "rotateXdegrees", 
function (d) {
var r = d * 3.141592653589793 / 180.0;
var c = Math.cos (r);
var s = Math.sin (r);
var t = 0.0;
t = this.x01;
this.x01 = t * c - this.x02 * s;
this.x02 = t * s + this.x02 * c;
t = this.x11;
this.x11 = t * c - this.x12 * s;
this.x12 = t * s + this.x12 * c;
t = this.x21;
this.x21 = t * c - this.x22 * s;
this.x22 = t * s + this.x22 * c;
t = this.x31;
this.x31 = t * c - this.x32 * s;
this.x32 = t * s + this.x32 * c;
}, "~N");
Clazz.defineMethod (c$, "rotateYdegrees", 
function (d) {
var r = d * 3.141592653589793 / 180.0;
var c = Math.cos (r);
var s = Math.sin (r);
var t = 0.0;
t = this.x00;
this.x00 = t * c + this.x02 * s;
this.x02 = this.x02 * c - t * s;
t = this.x10;
this.x10 = t * c + this.x12 * s;
this.x12 = this.x12 * c - t * s;
t = this.x20;
this.x20 = t * c + this.x22 * s;
this.x22 = this.x22 * c - t * s;
t = this.x30;
this.x30 = t * c + this.x32 * s;
this.x32 = this.x32 * c - t * s;
}, "~N");
Clazz.defineMethod (c$, "rotateZdegrees", 
function (d) {
var r = d * 3.141592653589793 / 180.0;
var m =  new astex.util.Matrix ();
m.rotateAroundVector (0., 0., 1., r);
this.transform (m);
}, "~N");
Clazz.defineMethod (c$, "transform", 
function (m) {
var xx00 = this.x00;
var xx01 = this.x01;
var xx02 = this.x02;
var xx03 = this.x03;
var xx10 = this.x10;
var xx11 = this.x11;
var xx12 = this.x12;
var xx13 = this.x13;
var xx20 = this.x20;
var xx21 = this.x21;
var xx22 = this.x22;
var xx23 = this.x23;
var xx30 = this.x30;
var xx31 = this.x31;
var xx32 = this.x32;
var xx33 = this.x33;
this.x00 = xx00 * m.x00 + xx01 * m.x10 + xx02 * m.x20 + xx03 * m.x30;
this.x01 = xx00 * m.x01 + xx01 * m.x11 + xx02 * m.x21 + xx03 * m.x31;
this.x02 = xx00 * m.x02 + xx01 * m.x12 + xx02 * m.x22 + xx03 * m.x32;
this.x03 = xx00 * m.x03 + xx01 * m.x13 + xx02 * m.x23 + xx03 * m.x33;
this.x10 = xx10 * m.x00 + xx11 * m.x10 + xx12 * m.x20 + xx13 * m.x30;
this.x11 = xx10 * m.x01 + xx11 * m.x11 + xx12 * m.x21 + xx13 * m.x31;
this.x12 = xx10 * m.x02 + xx11 * m.x12 + xx12 * m.x22 + xx13 * m.x32;
this.x13 = xx10 * m.x03 + xx11 * m.x13 + xx12 * m.x23 + xx13 * m.x33;
this.x20 = xx20 * m.x00 + xx21 * m.x10 + xx22 * m.x20 + xx23 * m.x30;
this.x21 = xx20 * m.x01 + xx21 * m.x11 + xx22 * m.x21 + xx23 * m.x31;
this.x22 = xx20 * m.x02 + xx21 * m.x12 + xx22 * m.x22 + xx23 * m.x32;
this.x23 = xx20 * m.x03 + xx21 * m.x13 + xx22 * m.x23 + xx23 * m.x33;
this.x30 = xx30 * m.x00 + xx31 * m.x10 + xx32 * m.x20 + xx33 * m.x30;
this.x31 = xx30 * m.x01 + xx31 * m.x11 + xx32 * m.x21 + xx33 * m.x31;
this.x32 = xx30 * m.x02 + xx31 * m.x12 + xx32 * m.x22 + xx33 * m.x32;
this.x33 = xx30 * m.x03 + xx31 * m.x13 + xx32 * m.x23 + xx33 * m.x33;
}, "astex.util.Matrix");
Clazz.defineMethod (c$, "transformPt", 
function (p) {
var x = p.x;
var y = p.y;
var z = p.z;
p.x = x * this.x00 + y * this.x10 + z * this.x20 + this.x30;
p.y = x * this.x01 + y * this.x11 + z * this.x21 + this.x31;
p.z = x * this.x02 + y * this.x12 + z * this.x22 + this.x32;
}, "astex.util.Point3d");
Clazz.defineMethod (c$, "transformByInverse", 
function (p) {
var x = p.x;
var y = p.y;
var z = p.z;
p.x = x * this.x00 + y * this.x01 + z * this.x02;
p.y = x * this.x10 + y * this.x11 + z * this.x12;
p.z = x * this.x20 + y * this.x21 + z * this.x22;
}, "astex.util.Point3d");
Clazz.defineMethod (c$, "rotateAroundVector", 
function (p, theta) {
this.rotateAroundVector (p.x, p.y, p.z, theta);
}, "astex.util.Point3d,~N");
Clazz.defineMethod (c$, "rotateAroundVector", 
function (x, y, z, theta) {
var d = x * x + y * y + z * z;
if (d > 1.e-3) {
d = Math.sqrt (d);
x /= d;
y /= d;
z /= d;
} else {
System.out.println ("rotateAroundVector: direction is zero length");
return;
}var s = Math.sin (theta);
var c = Math.cos (theta);
var t = 1.0 - c;
this.setIdentity ();
this.x00 = t * x * x + c;
this.x11 = t * y * y + c;
this.x22 = t * z * z + c;
this.x10 = t * x * y + s * z;
this.x20 = t * x * z - s * y;
this.x01 = t * x * y - s * z;
this.x21 = t * y * z + s * x;
this.x02 = t * x * z + s * y;
this.x12 = t * y * z - s * x;
}, "~N,~N,~N,~N");
Clazz.defineMethod (c$, "print", 
function () {
this.print ("-----------------");
});
Clazz.defineMethod (c$, "print", 
function (message) {
System.out.println (message);
System.out.println ("" + astex.util.Matrix.f6.format (this.x00) + " " + astex.util.Matrix.f6.format (this.x01) + " " + astex.util.Matrix.f6.format (this.x02) + " " + astex.util.Matrix.f6.format (this.x03));
System.out.println ("" + astex.util.Matrix.f6.format (this.x10) + " " + astex.util.Matrix.f6.format (this.x11) + " " + astex.util.Matrix.f6.format (this.x12) + " " + astex.util.Matrix.f6.format (this.x13));
System.out.println ("" + astex.util.Matrix.f6.format (this.x20) + " " + astex.util.Matrix.f6.format (this.x21) + " " + astex.util.Matrix.f6.format (this.x22) + " " + astex.util.Matrix.f6.format (this.x23));
System.out.println ("" + astex.util.Matrix.f6.format (this.x30) + " " + astex.util.Matrix.f6.format (this.x31) + " " + astex.util.Matrix.f6.format (this.x32) + " " + astex.util.Matrix.f6.format (this.x33));
}, "~S");
Clazz.defineMethod (c$, "returnScript", 
function () {
var command = "matrix ";
command += astex.io.FILE.sprintD (" %g", this.x00) + astex.io.FILE.sprintD (" %g", this.x01) + astex.io.FILE.sprintD (" %g", this.x02) + astex.io.FILE.sprintD (" %g", this.x03);
command += astex.io.FILE.sprintD (" %g", this.x10) + astex.io.FILE.sprintD (" %g", this.x11) + astex.io.FILE.sprintD (" %g", this.x12) + astex.io.FILE.sprintD (" %g", this.x13);
command += astex.io.FILE.sprintD (" %g", this.x20) + astex.io.FILE.sprintD (" %g", this.x21) + astex.io.FILE.sprintD (" %g", this.x22) + astex.io.FILE.sprintD (" %g", this.x23);
command += astex.io.FILE.sprintD (" %g", this.x30) + astex.io.FILE.sprintD (" %g", this.x31) + astex.io.FILE.sprintD (" %g", this.x32) + astex.io.FILE.sprintD (" %g", this.x33);
command += ";";
return command;
});
Clazz.defineMethod (c$, "equals", 
function (m) {
if (Math.abs (this.x00 - m.x00) > 1.0E-5) return false;
if (Math.abs (this.x01 - m.x01) > 1.0E-5) return false;
if (Math.abs (this.x02 - m.x02) > 1.0E-5) return false;
if (Math.abs (this.x03 - m.x03) > 1.0E-5) return false;
if (Math.abs (this.x10 - m.x10) > 1.0E-5) return false;
if (Math.abs (this.x11 - m.x11) > 1.0E-5) return false;
if (Math.abs (this.x12 - m.x12) > 1.0E-5) return false;
if (Math.abs (this.x13 - m.x13) > 1.0E-5) return false;
if (Math.abs (this.x20 - m.x20) > 1.0E-5) return false;
if (Math.abs (this.x21 - m.x21) > 1.0E-5) return false;
if (Math.abs (this.x22 - m.x22) > 1.0E-5) return false;
if (Math.abs (this.x23 - m.x23) > 1.0E-5) return false;
if (Math.abs (this.x30 - m.x30) > 1.0E-5) return false;
if (Math.abs (this.x31 - m.x31) > 1.0E-5) return false;
if (Math.abs (this.x32 - m.x32) > 1.0E-5) return false;
if (Math.abs (this.x33 - m.x33) > 1.0E-5) return false;
return true;
}, "astex.util.Matrix");
Clazz.defineMethod (c$, "isIdentity", 
function () {
return this.isIdentity (1.0E-5);
});
Clazz.defineMethod (c$, "isIdentity", 
function (tol) {
if (Math.abs (this.x00 - 1.0) > tol) return false;
if (Math.abs (this.x01) > tol) return false;
if (Math.abs (this.x02) > tol) return false;
if (Math.abs (this.x03) > tol) return false;
if (Math.abs (this.x10) > tol) return false;
if (Math.abs (this.x11 - 1.0) > tol) return false;
if (Math.abs (this.x12) > tol) return false;
if (Math.abs (this.x13) > tol) return false;
if (Math.abs (this.x20) > tol) return false;
if (Math.abs (this.x21) > tol) return false;
if (Math.abs (this.x22 - 1.0) > tol) return false;
if (Math.abs (this.x23) > tol) return false;
if (Math.abs (this.x30) > tol) return false;
if (Math.abs (this.x31) > tol) return false;
if (Math.abs (this.x32) > tol) return false;
if (Math.abs (this.x33 - 1.0) > tol) return false;
return true;
}, "~N");
Clazz.defineMethod (c$, "copy", 
function (m) {
this.x00 = m.x00;
this.x01 = m.x01;
this.x02 = m.x02;
this.x03 = m.x03;
this.x10 = m.x10;
this.x11 = m.x11;
this.x12 = m.x12;
this.x13 = m.x13;
this.x20 = m.x20;
this.x21 = m.x21;
this.x22 = m.x22;
this.x23 = m.x23;
this.x30 = m.x30;
this.x31 = m.x31;
this.x32 = m.x32;
this.x33 = m.x33;
}, "astex.util.Matrix");
Clazz.defineMethod (c$, "transpose", 
function () {
var tmp;
tmp = this.x01;
this.x01 = this.x10;
this.x10 = tmp;
tmp = this.x02;
this.x02 = this.x20;
this.x20 = tmp;
tmp = this.x03;
this.x03 = this.x30;
this.x30 = tmp;
tmp = this.x12;
this.x12 = this.x21;
this.x21 = tmp;
tmp = this.x13;
this.x13 = this.x31;
this.x31 = tmp;
tmp = this.x23;
this.x23 = this.x32;
this.x32 = tmp;
});
c$.invert = Clazz.defineMethod (c$, "invert", 
function ($in, out) {
astex.util.Matrix.adjoint ($in, out);
var det = astex.util.Matrix.det4x4 ($in);
if (Math.abs (det) < 1.0E-8) {
System.err.println ("Matrix.invert: Non-singular matrix, no inverse");
return;
}out.x00 /= det;
out.x01 /= det;
out.x02 /= det;
out.x03 /= det;
out.x10 /= det;
out.x11 /= det;
out.x12 /= det;
out.x13 /= det;
out.x20 /= det;
out.x21 /= det;
out.x22 /= det;
out.x23 /= det;
out.x30 /= det;
out.x31 /= det;
out.x32 /= det;
out.x33 /= det;
}, "astex.util.Matrix,astex.util.Matrix");
c$.adjoint = Clazz.defineMethod (c$, "adjoint", 
function ($in, out) {
var a1;
var a2;
var a3;
var a4;
var b1;
var b2;
var b3;
var b4;
var c1;
var c2;
var c3;
var c4;
var d1;
var d2;
var d3;
var d4;
a1 = $in.x00;
b1 = $in.x01;
c1 = $in.x02;
d1 = $in.x03;
a2 = $in.x10;
b2 = $in.x11;
c2 = $in.x12;
d2 = $in.x13;
a3 = $in.x20;
b3 = $in.x21;
c3 = $in.x22;
d3 = $in.x23;
a4 = $in.x30;
b4 = $in.x31;
c4 = $in.x32;
d4 = $in.x33;
out.x00 = astex.util.Matrix.det3x3 (b2, b3, b4, c2, c3, c4, d2, d3, d4);
out.x10 = -astex.util.Matrix.det3x3 (a2, a3, a4, c2, c3, c4, d2, d3, d4);
out.x20 = astex.util.Matrix.det3x3 (a2, a3, a4, b2, b3, b4, d2, d3, d4);
out.x30 = -astex.util.Matrix.det3x3 (a2, a3, a4, b2, b3, b4, c2, c3, c4);
out.x01 = -astex.util.Matrix.det3x3 (b1, b3, b4, c1, c3, c4, d1, d3, d4);
out.x11 = astex.util.Matrix.det3x3 (a1, a3, a4, c1, c3, c4, d1, d3, d4);
out.x21 = -astex.util.Matrix.det3x3 (a1, a3, a4, b1, b3, b4, d1, d3, d4);
out.x31 = astex.util.Matrix.det3x3 (a1, a3, a4, b1, b3, b4, c1, c3, c4);
out.x02 = astex.util.Matrix.det3x3 (b1, b2, b4, c1, c2, c4, d1, d2, d4);
out.x12 = -astex.util.Matrix.det3x3 (a1, a2, a4, c1, c2, c4, d1, d2, d4);
out.x22 = astex.util.Matrix.det3x3 (a1, a2, a4, b1, b2, b4, d1, d2, d4);
out.x32 = -astex.util.Matrix.det3x3 (a1, a2, a4, b1, b2, b4, c1, c2, c4);
out.x03 = -astex.util.Matrix.det3x3 (b1, b2, b3, c1, c2, c3, d1, d2, d3);
out.x13 = astex.util.Matrix.det3x3 (a1, a2, a3, c1, c2, c3, d1, d2, d3);
out.x23 = -astex.util.Matrix.det3x3 (a1, a2, a3, b1, b2, b3, d1, d2, d3);
out.x33 = astex.util.Matrix.det3x3 (a1, a2, a3, b1, b2, b3, c1, c2, c3);
}, "astex.util.Matrix,astex.util.Matrix");
c$.det4x4 = Clazz.defineMethod (c$, "det4x4", 
 function (m) {
var a1;
var a2;
var a3;
var a4;
var b1;
var b2;
var b3;
var b4;
var c1;
var c2;
var c3;
var c4;
var d1;
var d2;
var d3;
var d4;
a1 = m.x00;
b1 = m.x01;
c1 = m.x02;
d1 = m.x03;
a2 = m.x10;
b2 = m.x11;
c2 = m.x12;
d2 = m.x13;
a3 = m.x20;
b3 = m.x21;
c3 = m.x22;
d3 = m.x23;
a4 = m.x30;
b4 = m.x31;
c4 = m.x32;
d4 = m.x33;
var ans;
ans = a1 * astex.util.Matrix.det3x3 (b2, b3, b4, c2, c3, c4, d2, d3, d4) - b1 * astex.util.Matrix.det3x3 (a2, a3, a4, c2, c3, c4, d2, d3, d4) + c1 * astex.util.Matrix.det3x3 (a2, a3, a4, b2, b3, b4, d2, d3, d4) - d1 * astex.util.Matrix.det3x3 (a2, a3, a4, b2, b3, b4, c2, c3, c4);
return ans;
}, "astex.util.Matrix");
c$.det3x3 = Clazz.defineMethod (c$, "det3x3", 
 function (a1, a2, a3, b1, b2, b3, c1, c2, c3) {
var ans;
ans = a1 * astex.util.Matrix.det2x2 (b2, b3, c2, c3) - b1 * astex.util.Matrix.det2x2 (a2, a3, c2, c3) + c1 * astex.util.Matrix.det2x2 (a2, a3, b2, b3);
return ans;
}, "~N,~N,~N,~N,~N,~N,~N,~N,~N");
c$.det2x2 = Clazz.defineMethod (c$, "det2x2", 
 function (a, b, c, d) {
var ans = a * d - b * c;
return ans;
}, "~N,~N,~N,~N");
c$.interpolate = Clazz.defineMethod (c$, "interpolate", 
function (MS, MF, frac) {
var MI =  new astex.util.Matrix ();
astex.util.Matrix.interpolate (MS, MF, frac, MI);
return MI;
}, "astex.util.Matrix,astex.util.Matrix,~N");
c$.interpolate = Clazz.defineMethod (c$, "interpolate", 
function (MS, MF, frac, MI) {
var qS =  Clazz.newDoubleArray (4, 0);
var qF =  Clazz.newDoubleArray (4, 0);
var qI =  Clazz.newDoubleArray (4, 0);
MS.toQuaternion (qS);
MF.toQuaternion (qF);
astex.util.Matrix.slerp (qS, qF, frac, qI);
MI.fromQuaternion (qI);
}, "astex.util.Matrix,astex.util.Matrix,~N,astex.util.Matrix");
Clazz.defineMethod (c$, "toQuaternion", 
function (q) {
var trace = this.x00 + this.x11 + this.x22 + 1.0;
if (trace > 1.e-7) {
var s = 0.5 / Math.sqrt (trace);
q[0] = (this.x21 - this.x12) * s;
q[1] = (this.x02 - this.x20) * s;
q[2] = (this.x10 - this.x01) * s;
q[3] = 0.25 / s;
} else {
if (this.x00 > this.x11 && this.x00 > this.x22) {
var s = 2.0 * Math.sqrt (1.0 + this.x00 - this.x11 - this.x22);
q[0] = 0.25 * s;
q[1] = (this.x01 + this.x10) / s;
q[2] = (this.x02 + this.x20) / s;
q[3] = (this.x12 - this.x21) / s;
} else if (this.x11 > this.x22) {
var s = 2.0 * Math.sqrt (1.0 + this.x11 - this.x00 - this.x22);
q[0] = (this.x01 + this.x10) / s;
q[1] = 0.25 * s;
q[2] = (this.x12 + this.x21) / s;
q[3] = (this.x02 - this.x20) / s;
} else {
var s = 2.0 * Math.sqrt (1.0 + this.x22 - this.x00 - this.x11);
q[0] = (this.x02 + this.x20) / s;
q[1] = (this.x12 + this.x21) / s;
q[2] = 0.25 * s;
q[3] = (this.x01 - this.x10) / s;
}}var len = q[0] * q[0] + q[1] * q[1] + q[2] * q[2] + q[3] * q[3];
len = Math.sqrt (len);
for (var i = 0; i < 4; i++) {
q[i] /= len;
}
}, "~A");
Clazz.defineMethod (c$, "fromQuaternion", 
function (q) {
var X = q[0];
var Y = q[1];
var Z = q[2];
var W = q[3];
var xx = X * X;
var xy = X * Y;
var xz = X * Z;
var xw = X * W;
var yy = Y * Y;
var yz = Y * Z;
var yw = Y * W;
var zz = Z * Z;
var zw = Z * W;
this.setIdentity ();
this.x00 = 1 - 2 * (yy + zz);
this.x01 = 2 * (xy - zw);
this.x02 = 2 * (xz + yw);
this.x10 = 2 * (xy + zw);
this.x11 = 1 - 2 * (xx + zz);
this.x12 = 2 * (yz - xw);
this.x20 = 2 * (xz - yw);
this.x21 = 2 * (yz + xw);
this.x22 = 1 - 2 * (xx + yy);
}, "~A");
Clazz.defineMethod (c$, "fromQuaternion", 
function (q1, q2, q3, q4) {
this.x00 = q1 * q1 + q2 * q2 - q3 * q3 - q4 * q4;
this.x10 = 2. * (q2 * q3 - q1 * q4);
this.x20 = 2. * (q2 * q4 + q1 * q3);
this.x30 = 0.0;
this.x01 = 2. * (q2 * q3 + q1 * q4);
this.x11 = q1 * q1 - q2 * q2 + q3 * q3 - q4 * q4;
this.x21 = 2. * (q3 * q4 - q1 * q2);
this.x31 = 0.0;
this.x02 = 2. * (q2 * q4 - q1 * q3);
this.x12 = 2. * (q3 * q4 + q1 * q2);
this.x22 = q1 * q1 - q2 * q2 - q3 * q3 + q4 * q4;
this.x32 = 0.0;
this.x03 = this.x13 = this.x23 = 0.0;
this.x33 = 1.0;
}, "~N,~N,~N,~N");
c$.slerp = Clazz.defineMethod (c$, "slerp", 
function (Q0, Q1, T, Result) {
var CosTheta = Q0[3] * Q1[3] - (Q0[0] * Q1[0] + Q0[1] * Q1[1] + Q0[2] * Q1[2]);
var Theta = Math.acos (CosTheta);
var SinTheta = Math.sqrt (1.0 - CosTheta * CosTheta);
if (Math.abs (SinTheta) < 1.e-5) {
for (var i = 0; i < 4; i++) {
Result[i] = Q0[i];
}
return;
}var Sin_T_Theta = Math.sin (T * Theta) / SinTheta;
var Sin_OneMinusT_Theta = Math.sin ((1.0 - T) * Theta) / SinTheta;
for (var i = 0; i < 4; i++) {
Result[i] = Q0[i] * Sin_OneMinusT_Theta + Q1[i] * Sin_T_Theta;
}
var len = Result[0] * Result[0] + Result[1] * Result[1] + Result[2] * Result[2] + Result[3] * Result[3];
len = Math.sqrt (len);
for (var i = 0; i < 4; i++) {
Result[i] /= len;
}
}, "~A,~A,~N,~A");
Clazz.defineMethod (c$, "rotateXYZ", 
function (alpha, beta, gamma) {
var a = Math.toRadians (alpha);
var b = Math.toRadians (beta);
var g = Math.toRadians (gamma);
this.x00 = Math.cos (b) * Math.cos (g);
this.x10 = Math.cos (g) * Math.sin (a) * Math.sin (b) - Math.cos (a) * Math.sin (g);
this.x20 = Math.cos (a) * Math.cos (g) * Math.sin (b) + Math.sin (a) * Math.sin (g);
this.x01 = Math.cos (b) * Math.sin (g);
this.x11 = Math.cos (a) * Math.cos (g) + Math.sin (a) * Math.sin (b) * Math.sin (g);
this.x21 = Math.cos (a) * Math.sin (b) * Math.sin (g) - Math.cos (g) * Math.sin (a);
this.x02 = -Math.sin (b);
this.x12 = Math.cos (b) * Math.sin (a);
this.x22 = Math.cos (a) * Math.cos (b);
this.x33 = 1.0;
}, "~N,~N,~N");
Clazz.defineMethod (c$, "addTranslation", 
function (x, y, z) {
this.x30 += x;
this.x31 += y;
this.x32 += z;
}, "~N,~N,~N");
Clazz.defineMethod (c$, "setTranslation", 
function (x, y, z) {
this.x30 = x;
this.x31 = y;
this.x32 = z;
}, "~N,~N,~N");
Clazz.defineMethod (c$, "getTranslation", 
function () {
var t =  Clazz.newDoubleArray (3, 0);
t[0] = this.x30;
t[1] = this.x31;
t[2] = this.x32;
return t;
});
Clazz.defineMethod (c$, "invert", 
function () {
this.x00 *= -1.0;
this.x11 *= -1.0;
this.x22 *= -1.0;
});
Clazz.defineMethod (c$, "setA", 
function (a) {
this.x00 = a[0];
this.x01 = a[1];
this.x02 = a[2];
this.x03 = a[3];
this.x10 = a[4];
this.x11 = a[5];
this.x12 = a[6];
this.x13 = a[7];
this.x20 = a[8];
this.x21 = a[9];
this.x22 = a[10];
this.x23 = a[11];
this.x30 = a[12];
this.x31 = a[13];
this.x32 = a[14];
this.x33 = a[15];
}, "~A");
c$.f6 = c$.prototype.f6 =  new astex.util.Format ("%11.6f");
Clazz.defineStatics (c$,
"TOL", 1.e-5,
"SMALL_NUMBER", 1.e-8);
});
