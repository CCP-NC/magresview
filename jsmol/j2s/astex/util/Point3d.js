Clazz.declarePackage ("astex.util");
Clazz.load (null, "astex.util.Point3d", ["astex.io.FILE"], function () {
c$ = Clazz.decorateAsClass (function () {
this.x = 0;
this.y = 0;
this.z = 0;
this.xo = 0;
this.yo = 0;
this.zo = 0;
Clazz.instantialize (this, arguments);
}, astex.util, "Point3d");
Clazz.makeConstructor (c$, 
function () {
});
c$.new3 = Clazz.defineMethod (c$, "new3", 
function (xx, yy, zz) {
var p =  new astex.util.Point3d ();
p.set (xx, yy, zz);
return p;
}, "~N,~N,~N");
c$.new1 = Clazz.defineMethod (c$, "new1", 
function (xx) {
var p =  new astex.util.Point3d ();
p.set (xx, xx, xx);
return p;
}, "~N");
c$.newP = Clazz.defineMethod (c$, "newP", 
function (p) {
var p1 =  new astex.util.Point3d ();
p1.setP (p);
return p1;
}, "astex.util.Point3d");
Clazz.overrideMethod (c$, "clone", 
function () {
return astex.util.Point3d.newP (this);
});
Clazz.defineMethod (c$, "set", 
function (xx, yy, zz) {
this.x = xx;
this.y = yy;
this.z = zz;
this.xo = xx;
this.yo = yy;
this.zo = zz;
}, "~N,~N,~N");
Clazz.defineMethod (c$, "setP", 
function (p) {
this.x = p.x;
this.y = p.y;
this.z = p.z;
this.xo = p.x;
this.yo = p.y;
this.zo = p.z;
}, "astex.util.Point3d");
Clazz.defineMethod (c$, "geto", 
function (i) {
switch (i) {
case 0:
return this.xo;
case 1:
return this.yo;
case 2:
return this.zo;
default:
System.out.println ("Point3d.geto: can't get component " + i);
}
return 1.7976931348623157E308;
}, "~N");
Clazz.defineMethod (c$, "get", 
function (i) {
switch (i) {
case 0:
return this.x;
case 1:
return this.y;
case 2:
return this.z;
default:
System.out.println ("Point3d.get: can't get component " + i);
}
return 1.7976931348623157E308;
}, "~N");
Clazz.defineMethod (c$, "setComponent", 
function (i, v) {
switch (i) {
case 0:
this.x = v;
return;
case 1:
this.y = v;
return;
case 2:
this.z = v;
return;
default:
System.out.println ("Point3d.set: can't set component " + i);
}
}, "~N,~N");
Clazz.defineMethod (c$, "getX", 
function () {
return this.x;
});
Clazz.defineMethod (c$, "getY", 
function () {
return this.y;
});
Clazz.defineMethod (c$, "getZ", 
function () {
return this.z;
});
Clazz.defineMethod (c$, "setX", 
function (xx) {
this.x = xx;
}, "~N");
Clazz.defineMethod (c$, "setY", 
function (yy) {
this.y = yy;
}, "~N");
Clazz.defineMethod (c$, "setZ", 
function (zz) {
this.z = zz;
}, "~N");
Clazz.defineMethod (c$, "setXX", 
function (xx) {
this.x = xx;
this.xo = xx;
}, "~N");
Clazz.defineMethod (c$, "setYY", 
function (yy) {
this.y = yy;
this.yo = yy;
}, "~N");
Clazz.defineMethod (c$, "setZZ", 
function (zz) {
this.z = zz;
this.zo = zz;
}, "~N");
Clazz.defineMethod (c$, "add", 
function (p) {
this.x += p.x;
this.y += p.y;
this.z += p.z;
}, "astex.util.Point3d");
Clazz.defineMethod (c$, "subtract", 
function (p) {
this.x -= p.x;
this.y -= p.y;
this.z -= p.z;
}, "astex.util.Point3d");
Clazz.defineMethod (c$, "translate", 
function (xtrans, ytrans, ztrans) {
this.x += xtrans;
this.y += ytrans;
this.z += ztrans;
}, "~N,~N,~N");
Clazz.defineMethod (c$, "negate", 
function () {
this.x = -this.x;
this.y = -this.y;
this.z = -this.z;
});
Clazz.defineMethod (c$, "min", 
function (p) {
if (p.x < this.x) this.x = p.x;
if (p.y < this.y) this.y = p.y;
if (p.z < this.z) this.z = p.z;
}, "astex.util.Point3d");
Clazz.defineMethod (c$, "max", 
function (p) {
if (p.x > this.x) this.x = p.x;
if (p.y > this.y) this.y = p.y;
if (p.z > this.z) this.z = p.z;
}, "astex.util.Point3d");
c$.mid = Clazz.defineMethod (c$, "mid", 
function (pmin, pmax) {
var middle =  new astex.util.Point3d ();
middle.x = 0.5 * (pmin.x + pmax.x);
middle.y = 0.5 * (pmin.y + pmax.y);
middle.z = 0.5 * (pmin.z + pmax.z);
return middle;
}, "astex.util.Point3d,astex.util.Point3d");
c$.mid3 = Clazz.defineMethod (c$, "mid3", 
function (pmid, pmin, pmax) {
pmid.x = 0.5 * (pmin.x + pmax.x);
pmid.y = 0.5 * (pmin.y + pmax.y);
pmid.z = 0.5 * (pmin.z + pmax.z);
}, "astex.util.Point3d,astex.util.Point3d,astex.util.Point3d");
Clazz.defineMethod (c$, "normalise", 
function () {
var norm = Math.sqrt (this.x * this.x + this.y * this.y + this.z * this.z);
if (Math.abs (norm) > 1.e-5) {
this.x /= norm;
this.y /= norm;
this.z /= norm;
}});
Clazz.defineMethod (c$, "dot", 
function (p) {
return this.x * p.x + this.y * p.y + this.z * p.z;
}, "astex.util.Point3d");
Clazz.defineMethod (c$, "length", 
function () {
return Math.sqrt (this.x * this.x + this.y * this.y + this.z * this.z);
});
c$.length = Clazz.defineMethod (c$, "length", 
function (a) {
return Math.sqrt (a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
}, "~A");
c$.unitVectorP2 = Clazz.defineMethod (c$, "unitVectorP2", 
function (p1, p2) {
var unit =  new astex.util.Point3d ();
unit.set (p2.x - p1.x, p2.y - p1.y, p2.z - p1.z);
unit.normalise ();
return unit;
}, "astex.util.Point3d,astex.util.Point3d");
c$.unitVectorP3 = Clazz.defineMethod (c$, "unitVectorP3", 
function (up12, p1, p2) {
up12.set (p2.x - p1.x, p2.y - p1.y, p2.z - p1.z);
up12.normalise ();
}, "astex.util.Point3d,astex.util.Point3d,astex.util.Point3d");
c$.unitVector = Clazz.defineMethod (c$, "unitVector", 
function (xa, ya, xb, yb) {
var x = xb - xa;
var y = yb - ya;
var norm = Math.sqrt (x * x + y * y);
return (Math.abs (norm) > 1.e-5 ? astex.util.Point3d.new3 (x / norm, y / norm, 0) : astex.util.Point3d.new3 (1., 1., 0));
}, "~N,~N,~N,~N");
c$.vectorP2 = Clazz.defineMethod (c$, "vectorP2", 
function (p1, p2) {
var unit = astex.util.Point3d.new3 (p2.x - p1.x, p2.y - p1.y, p2.z - p1.z);
return unit;
}, "astex.util.Point3d,astex.util.Point3d");
c$.vectorP3 = Clazz.defineMethod (c$, "vectorP3", 
function (p12, p1, p2) {
p12.x = p2.x - p1.x;
p12.y = p2.y - p1.y;
p12.z = p2.z - p1.z;
}, "astex.util.Point3d,astex.util.Point3d,astex.util.Point3d");
c$.normalToLineP = Clazz.defineMethod (c$, "normalToLineP", 
function (p) {
var normal = astex.util.Point3d.new3 (1., 1., 1.);
if (p.x != 0.) normal.x = (p.z + p.y) / -p.x;
 else if (p.y != 0.) normal.y = (p.x + p.z) / -p.y;
 else if (p.z != 0.) normal.z = (p.x + p.y) / -p.z;
normal.normalise ();
return normal;
}, "astex.util.Point3d");
c$.normalToLine = Clazz.defineMethod (c$, "normalToLine", 
function (p, n) {
n.set (1., 1., 1.);
if (p.x != 0.) n.x = (p.z + p.y) / -p.x;
 else if (p.y != 0.) n.y = (p.x + p.z) / -p.y;
 else if (p.z != 0.) n.z = (p.x + p.y) / -p.z;
n.normalise ();
}, "astex.util.Point3d,astex.util.Point3d");
c$.normalToLineLen = Clazz.defineMethod (c$, "normalToLineLen", 
function (xa, ya, xb, yb, len) {
var x2;
var y2;
var norm;
var x1 = xb - xa;
var y1 = yb - ya;
if (Math.abs (y1) < 1.e-5) {
if (xb > xa) {
x2 = 0.0;
y2 = -1.0;
} else {
x2 = 0.0;
y2 = 1.0;
}} else {
if (x1 == 0.0) {
x2 = 1.0;
y2 = 0.0;
} else {
if (y1 / x1 < 0.0) {
if (xb > xa) {
x2 = -1.0;
y2 = x1 / y1;
} else {
x2 = 1.0;
y2 = -x1 / y1;
}} else {
if (xb > xa) {
x2 = 1.0;
y2 = -x1 / y1;
} else {
x2 = -1.0;
y2 = x1 / y1;
}}}}norm = len / Math.sqrt (y2 * y2 + x2 * x2);
x2 *= norm;
y2 *= norm;
return astex.util.Point3d.new3 (x2, y2, 0.);
}, "~N,~N,~N,~N,~N");
c$.normalToLine2 = Clazz.defineMethod (c$, "normalToLine2", 
function (xb, yb) {
return astex.util.Point3d.normalToLineLen (0., 0., xb, yb, 1.0);
}, "~N,~N");
c$.planeEquation = Clazz.defineMethod (c$, "planeEquation", 
function (point, origin, normal) {
var dx = point.x - origin.x;
var dy = point.y - origin.y;
var dz = point.z - origin.z;
return dx * normal.x + dy * normal.y + dz * normal.z;
}, "astex.util.Point3d,astex.util.Point3d,astex.util.Point3d");
Clazz.defineMethod (c$, "cross", 
function (c) {
var a = astex.util.Point3d.new3 ((this.y * c.z) - (this.z * c.y), (this.z * c.x) - (this.x * c.z), (this.x * c.y) - (this.y * c.x));
a.normalise ();
return a;
}, "astex.util.Point3d");
c$.crossPts = Clazz.defineMethod (c$, "crossPts", 
function (a, b, c) {
a.set ((b.y * c.z) - (b.z * c.y), (b.z * c.x) - (b.x * c.z), (b.x * c.y) - (b.y * c.x));
a.normalise ();
}, "astex.util.Point3d,astex.util.Point3d,astex.util.Point3d");
c$.crossNoNormalise = Clazz.defineMethod (c$, "crossNoNormalise", 
function (a, b, c) {
a.set ((b.y * c.z) - (b.z * c.y), (b.z * c.x) - (b.x * c.z), (b.x * c.y) - (b.y * c.x));
}, "astex.util.Point3d,astex.util.Point3d,astex.util.Point3d");
c$.cross = Clazz.defineMethod (c$, "cross", 
function (a, b, c) {
a[0] = (b[1] * c[2]) - (b[2] * c[1]);
a[1] = (b[2] * c[0]) - (b[0] * c[2]);
a[2] = (b[0] * c[1]) - (b[1] * c[0]);
}, "~A,~A,~A");
Clazz.defineMethod (c$, "equal", 
function (b) {
var ret;
ret = ((this.x == b.x) && (this.y == b.y) && (this.z == b.z));
return ret;
}, "astex.util.Point3d");
Clazz.defineMethod (c$, "scale", 
function (len) {
this.x *= len;
this.y *= len;
this.z *= len;
}, "~N");
Clazz.defineMethod (c$, "distance", 
function (p) {
var dx = p.x - this.x;
var dy = p.y - this.y;
var dz = p.z - this.z;
return (Math.sqrt (dx * dx + dy * dy + dz * dz));
}, "astex.util.Point3d");
Clazz.defineMethod (c$, "distanceSq", 
function (p) {
var dx = p.x - this.x;
var dy = p.y - this.y;
var dz = p.z - this.z;
return (dx * dx + dy * dy + dz * dz);
}, "astex.util.Point3d");
Clazz.defineMethod (c$, "divide", 
function (s) {
this.x /= s;
this.y /= s;
this.z /= s;
}, "~N");
Clazz.defineMethod (c$, "isNullVector", 
function () {
return (Math.abs (this.x) < astex.util.Point3d.smallNumber && Math.abs (this.y) < astex.util.Point3d.smallNumber && Math.abs (this.z) < astex.util.Point3d.smallNumber);
});
Clazz.defineMethod (c$, "transformByMatrix", 
function (m) {
var copy = astex.util.Point3d.newP (this);
var xx = this.x;
var yy = this.y;
var zz = this.z;
copy.x = xx * m.x00 + yy * m.x10 + zz * m.x20 + m.x30;
copy.y = xx * m.x01 + yy * m.x11 + zz * m.x21 + m.x31;
copy.z = xx * m.x02 + yy * m.x12 + zz * m.x22 + m.x32;
return copy;
}, "astex.util.Matrix");
Clazz.defineMethod (c$, "transform", 
function (m) {
var xx = this.x * m.x00 + this.y * m.x10 + this.z * m.x20 + m.x30;
var yy = this.x * m.x01 + this.y * m.x11 + this.z * m.x21 + m.x31;
var zz = this.x * m.x02 + this.y * m.x12 + this.z * m.x22 + m.x32;
this.x = xx;
this.y = yy;
this.z = zz;
}, "astex.util.Matrix");
c$.getDist = Clazz.defineMethod (c$, "getDist", 
function (a, b) {
var dx = a.x - b.x;
var dy = a.y - b.y;
var dz = a.z - b.z;
return Math.sqrt (dx * dx + dy * dy + dz * dz);
}, "astex.util.Point3d,astex.util.Point3d");
c$.getDistSq = Clazz.defineMethod (c$, "getDistSq", 
function (a, b) {
var dx = a.x - b.x;
var dy = a.y - b.y;
var dz = a.z - b.z;
return dx * dx + dy * dy + dz * dz;
}, "astex.util.Point3d,astex.util.Point3d");
c$.angle = Clazz.defineMethod (c$, "angle", 
function (a, b, c) {
var xba = a.x - b.x;
var yba = a.y - b.y;
var zba = a.z - b.z;
var xbc = c.x - b.x;
var ybc = c.y - b.y;
var zbc = c.z - b.z;
var ba = Math.sqrt (xba * xba + yba * yba + zba * zba);
var bc = Math.sqrt (xbc * xbc + ybc * ybc + zbc * zbc);
var dot = xba * xbc + yba * ybc + zba * zbc;
dot /= (ba * bc);
return Math.acos (dot);
}, "astex.util.Point3d,astex.util.Point3d,astex.util.Point3d");
c$.angleDegrees = Clazz.defineMethod (c$, "angleDegrees", 
function (a, b, c) {
return 180.0 * astex.util.Point3d.angle (a, b, c) / 3.141592653589793;
}, "astex.util.Point3d,astex.util.Point3d,astex.util.Point3d");
c$.torsion = Clazz.defineMethod (c$, "torsion", 
function (p1x, p1y, p1z, p2x, p2y, p2z, p3x, p3y, p3z, p4x, p4y, p4z) {
astex.util.Point3d.tp1.set (p1x, p1y, p1z);
astex.util.Point3d.tp2.set (p2x, p2y, p2z);
astex.util.Point3d.tp3.set (p3x, p3y, p3z);
astex.util.Point3d.tp4.set (p4x, p4y, p4z);
return astex.util.Point3d.torsionP (astex.util.Point3d.tp1, astex.util.Point3d.tp2, astex.util.Point3d.tp3, astex.util.Point3d.tp4);
}, "~N,~N,~N,~N,~N,~N,~N,~N,~N,~N,~N,~N");
c$.torsionDegrees = Clazz.defineMethod (c$, "torsionDegrees", 
function (p1x, p1y, p1z, p2x, p2y, p2z, p3x, p3y, p3z, p4x, p4y, p4z) {
astex.util.Point3d.tp1.set (p1x, p1y, p1z);
astex.util.Point3d.tp2.set (p2x, p2y, p2z);
astex.util.Point3d.tp3.set (p3x, p3y, p3z);
astex.util.Point3d.tp4.set (p4x, p4y, p4z);
return astex.util.Point3d.torsionDegreesP (astex.util.Point3d.tp1, astex.util.Point3d.tp2, astex.util.Point3d.tp3, astex.util.Point3d.tp4);
}, "~N,~N,~N,~N,~N,~N,~N,~N,~N,~N,~N,~N");
c$.torsionP = Clazz.defineMethod (c$, "torsionP", 
function (p1, p2, p3, p4) {
var v1;
var v2;
var v3;
var n1;
var n2;
var angle;
v1 = astex.util.Point3d.unitVectorP2 (p1, p2);
v2 = astex.util.Point3d.unitVectorP2 (p2, p3);
v3 = astex.util.Point3d.unitVectorP2 (p3, p4);
n1 = v1.cross (v2);
n1.normalise ();
n2 = v2.cross (v3);
n2.normalise ();
var dot = n1.dot (n2);
if (dot > 1.0) dot = 1.0;
 else if (dot < -1.0) dot = -1.0;
angle = Math.acos (dot);
if (n1.dot (v3) < 0.0) angle = -angle;
return angle;
}, "astex.util.Point3d,astex.util.Point3d,astex.util.Point3d,astex.util.Point3d");
c$.torsionDegreesP = Clazz.defineMethod (c$, "torsionDegreesP", 
function (p1, p2, p3, p4) {
return 180.0 * astex.util.Point3d.torsionP (p1, p2, p3, p4) / 3.141592653589793;
}, "astex.util.Point3d,astex.util.Point3d,astex.util.Point3d,astex.util.Point3d");
c$.print = Clazz.defineMethod (c$, "print", 
function (s, x) {
astex.io.FILE.out.printS (s);
astex.io.FILE.out.printFD (" %8.3f", x[0]);
astex.io.FILE.out.printFD (" %8.3f", x[1]);
astex.io.FILE.out.printFD (" %8.3f\n", x[2]);
}, "~S,~A");
Clazz.overrideMethod (c$, "toString", 
function () {
return astex.io.FILE.sprintD ("%8.3f", this.x) + astex.io.FILE.sprintD ("%8.3f", this.y) + astex.io.FILE.sprintD ("%8.3f", this.z);
});
Clazz.defineStatics (c$,
"smallNumber", 1.e-5);
c$.tp1 = c$.prototype.tp1 =  new astex.util.Point3d ();
c$.tp2 = c$.prototype.tp2 =  new astex.util.Point3d ();
c$.tp3 = c$.prototype.tp3 =  new astex.util.Point3d ();
c$.tp4 = c$.prototype.tp4 =  new astex.util.Point3d ();
});
