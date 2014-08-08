Clazz.declarePackage ("astex.render");
Clazz.load (["astex.util.Point3d"], "astex.render.Tmesh", ["astex.io.FILE", "astex.util.Color32", "$.DynamicArray", "$.Log", "java.lang.OutOfMemoryError", "$.Runtime", "java.util.Hashtable"], function () {
c$ = Clazz.decorateAsClass (function () {
this.matrix = null;
this.np = 0;
this.npalloc = 0;
this.x = null;
this.y = null;
this.z = null;
this.nx = null;
this.ny = null;
this.nz = null;
this.u = null;
this.v = null;
this.vcolor = null;
this.labels = null;
this.texture = null;
this.transparency = 0xff;
this.textureScalingMode = 0;
this.umin = 0.0;
this.umax = 1.0;
this.vmin = 0.0;
this.vmax = 1.0;
this.uoffset = 0.0;
this.uscale = 1.0;
this.voffset = 0.0;
this.vscale = 1.0;
this.spheres = null;
this.cylinders = null;
this.lines = null;
this.nt = 0;
this.ntalloc = 0;
this.t0 = null;
this.t1 = null;
this.t2 = null;
this.tcolor = null;
this.PointAllocationIncrement = 4096;
this.TriangleAllocationIncrement = 8192;
this.style = 3;
this.colorStyle = 1;
this.debug = false;
this.useLabels = false;
this.isSelectable = false;
this.visible = true;
this.backface = false;
this.color = 0x00ff00;
this.name = null;
this.lineWidth = -1.0;
this.clipHash = null;
this.ab = null;
this.bc = null;
this.norm = null;
this.origNorm = null;
this.triangleRef = null;
this.ntriangles = null;
this.keepTriangles = null;
this.keepPoints = null;
this.moleculeRenderer = null;
this.renderPass = 2;
Clazz.instantialize (this, arguments);
}, astex.render, "Tmesh");
Clazz.prepareFields (c$, function () {
this.matrix = [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0];
this.ab =  new astex.util.Point3d ();
this.bc =  new astex.util.Point3d ();
this.norm =  new astex.util.Point3d ();
this.origNorm =  new astex.util.Point3d ();
});
Clazz.defineMethod (c$, "setUScale", 
function (f) {
this.uscale = f;
}, "~N");
Clazz.defineMethod (c$, "setVScale", 
function (f) {
this.vscale = f;
}, "~N");
Clazz.defineMethod (c$, "setUOffset", 
function (f) {
this.uoffset = f;
}, "~N");
Clazz.defineMethod (c$, "setVOffset", 
function (f) {
this.voffset = f;
}, "~N");
Clazz.defineMethod (c$, "getUScale", 
function () {
return this.uscale;
});
Clazz.defineMethod (c$, "getVScale", 
function () {
return this.vscale;
});
Clazz.defineMethod (c$, "getUOffset", 
function () {
return this.uoffset;
});
Clazz.defineMethod (c$, "getVOffset", 
function () {
return this.voffset;
});
Clazz.defineMethod (c$, "empty", 
function () {
this.np = 0;
this.nt = 0;
});
Clazz.defineMethod (c$, "getInverseTexture", 
function (uv, val) {
var inv = 0.0;
if (uv == 1) {
inv = this.uoffset + (val / this.uscale);
} else if (uv == 2) {
inv = this.voffset + (val / this.vscale);
} else {
astex.util.Log.error ("texture coordinate must be 1 or 2, not " + uv);
}return inv;
}, "~N,~N");
Clazz.defineMethod (c$, "setTextureRange", 
function (uv, min, max) {
var delta = Math.abs (max - min);
if (delta < 1.e-3) {
delta = 1.e-3;
}var scale = 1. / delta;
if (uv == 1) {
this.setUOffset (min);
this.setUScale (scale);
} else if (uv == 2) {
this.setVOffset (min);
this.setVScale (scale);
} else {
astex.util.Log.error ("texture coordinate must be 1 or 2, not " + uv);
}}, "~N,~N,~N");
Clazz.defineMethod (c$, "setMinMax", 
function (uv) {
var tmin = 1.e10;
var tmax = -1.0E10;
var pointCount = this.np;
if (uv == 1 || uv == 2) {
var tt = null;
if (uv == 1) {
tt = this.u;
} else if (uv == 2) {
tt = this.v;
}for (var i = 0; i < pointCount; i++) {
var t = tt[i];
if (t < tmin) tmin = t;
if (t > tmax) tmax = t;
}
this.setTextureRange (uv, tmin, tmax);
} else {
astex.util.Log.error ("texture coordinate must be 1 or 2, not " + uv);
}}, "~N");
Clazz.defineMethod (c$, "setColorStyle", 
function (s) {
this.colorStyle = s;
if (this.lines != null) this.lines.setColorStyle (s);
if (this.spheres != null) this.spheres.setColorStyle (s);
if (this.cylinders != null) this.cylinders.setColorStyle (s);
}, "~N");
Clazz.defineMethod (c$, "getColorStyle", 
function () {
return this.colorStyle;
});
Clazz.makeConstructor (c$, 
function () {
});
Clazz.defineMethod (c$, "isVisible", 
function () {
return this.visible;
});
Clazz.defineMethod (c$, "setTextureScalingMode", 
function (sm) {
this.textureScalingMode = sm;
}, "~N");
Clazz.defineMethod (c$, "getTextureScalingMode", 
function () {
return this.textureScalingMode;
});
Clazz.defineMethod (c$, "setVisible", 
function (v) {
this.visible = v;
}, "~B");
Clazz.defineMethod (c$, "getBackface", 
function () {
return this.backface;
});
Clazz.defineMethod (c$, "setBackface", 
function (v) {
this.backface = v;
}, "~B");
Clazz.defineMethod (c$, "getColor", 
function () {
return this.color;
});
Clazz.defineMethod (c$, "setColor", 
function (v) {
this.color = v;
this.texture = null;
if (this.lines != null) this.lines.setColor (v);
if (this.spheres != null) this.spheres.setColor (v);
if (this.cylinders != null) this.cylinders.setColor (v);
}, "~N");
Clazz.defineMethod (c$, "getName", 
function () {
return this.name;
});
Clazz.defineMethod (c$, "setTransparency", 
function (t) {
if (t < 0) {
System.out.println ("setTransparency: illegal transparency " + t);
t = 0;
} else if (t > 255) {
System.out.println ("setTransparency: illegal transparency " + t);
t = 255;
}this.transparency = t;
}, "~N");
Clazz.defineMethod (c$, "getTransparency", 
function () {
return this.transparency;
});
Clazz.defineMethod (c$, "setName", 
function (v) {
this.name = v;
}, "~S");
Clazz.defineMethod (c$, "setLineWidth", 
function (d) {
this.lineWidth = d;
if (this.lines != null) {
this.lines.setLineWidth (d);
}}, "~N");
Clazz.defineMethod (c$, "getLineWidth", 
function () {
return this.lineWidth;
});
Clazz.defineMethod (c$, "addPointPts", 
function (x, n, tu, tv) {
return this.addPointNoColor (x.x, x.y, x.z, n.x, n.y, n.z, tu, tv);
}, "astex.util.Point3d,astex.util.Point3d,~N,~N");
Clazz.defineMethod (c$, "addPointXYZ", 
function (x, n, tu, tv) {
return this.addPointNoColor (x[0], x[1], x[2], n[0], n[1], n[2], tu, tv);
}, "~A,~A,~N,~N");
Clazz.defineMethod (c$, "addPointNoColor", 
function (xp, yp, zp, xn, yn, zn, tu, tv) {
return this.addPointNoLabel (xp, yp, zp, xn, yn, zn, 0, tu, tv);
}, "~N,~N,~N,~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "addPointNoLabel", 
function (xp, yp, zp, xn, yn, zn, colour, tu, tv) {
return this.addPoint (xp, yp, zp, xn, yn, zn, colour, tu, tv, null);
}, "~N,~N,~N,~N,~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "addPoint", 
function (xp, yp, zp, xn, yn, zn, colour, tu, tv, label) {
this.ensurePointCapacityOne ();
this.x[this.np] = xp;
this.y[this.np] = yp;
this.z[this.np] = zp;
this.nx[this.np] = xn;
this.ny[this.np] = yn;
this.nz[this.np] = zn;
this.u[this.np] = tu;
this.v[this.np] = tv;
this.vcolor[this.np] = colour;
if (this.useLabels) this.labels[this.np] = label;
return this.np++;
}, "~N,~N,~N,~N,~N,~N,~N,~N,~N,~S");
Clazz.defineMethod (c$, "addPointNoNorm", 
function (xp, yp, zp, c, l) {
this.ensurePointCapacityOne ();
this.x[this.np] = xp;
this.y[this.np] = yp;
this.z[this.np] = zp;
this.vcolor[this.np] = c;
if (this.useLabels) this.labels[this.np] = l;
return this.np++;
}, "~N,~N,~N,~N,~S");
Clazz.defineMethod (c$, "addPointNoNormNoLabel", 
function (xp, yp, zp, c) {
return this.addPointNoNorm (xp, yp, zp, c, null);
}, "~N,~N,~N,~N");
Clazz.defineMethod (c$, "getVertex", 
function (v, px, nxx) {
if (this.np <= v) {
System.out.println ("Tmesh getVertex, point capacity: " + this.np + " requested index: " + v);
return;
}px[0] = this.x[v];
px[1] = this.y[v];
px[2] = this.z[v];
if (nxx != null) {
nxx[0] = this.nx[v];
nxx[1] = this.ny[v];
nxx[2] = this.nz[v];
}}, "~N,~A,~A");
Clazz.defineMethod (c$, "setVertex", 
function (v, px, nxx) {
this.x[v] = px[0];
this.y[v] = px[1];
this.z[v] = px[2];
if (nxx != null) {
this.nx[v] = nxx[0];
this.ny[v] = nxx[1];
this.nz[v] = nxx[2];
}}, "~N,~A,~A");
Clazz.defineMethod (c$, "getnPoints", 
function () {
return this.np;
});
Clazz.defineMethod (c$, "setPointCapacity", 
function (nn) {
this.npalloc = nn;
this.x =  Clazz.newFloatArray (this.npalloc, 0);
this.y =  Clazz.newFloatArray (this.npalloc, 0);
this.z =  Clazz.newFloatArray (this.npalloc, 0);
this.nx =  Clazz.newFloatArray (this.npalloc, 0);
this.ny =  Clazz.newFloatArray (this.npalloc, 0);
this.nz =  Clazz.newFloatArray (this.npalloc, 0);
this.u =  Clazz.newFloatArray (this.npalloc, 0);
this.v =  Clazz.newFloatArray (this.npalloc, 0);
this.vcolor =  Clazz.newIntArray (this.npalloc, 0);
if (this.useLabels) {
this.labels =  new Array (this.npalloc);
}}, "~N");
Clazz.defineMethod (c$, "ensurePointCapacity", 
 function (npNeeded) {
if (this.npalloc <= npNeeded) {
while (npNeeded > this.npalloc + this.PointAllocationIncrement) {
this.PointAllocationIncrement *= 2;
}
this.npalloc += this.PointAllocationIncrement;
this.doPointAllocation ();
}}, "~N");
Clazz.defineMethod (c$, "ensurePointCapacityOne", 
function () {
if (this.np == this.npalloc) {
this.npalloc += this.PointAllocationIncrement;
if (this.PointAllocationIncrement < 131072) this.PointAllocationIncrement *= 2;
this.doPointAllocation ();
}});
Clazz.defineMethod (c$, "doPointAllocation", 
 function () {
try {
var newx =  Clazz.newFloatArray (this.npalloc, 0);
var newy =  Clazz.newFloatArray (this.npalloc, 0);
var newz =  Clazz.newFloatArray (this.npalloc, 0);
var newnx =  Clazz.newFloatArray (this.npalloc, 0);
var newny =  Clazz.newFloatArray (this.npalloc, 0);
var newnz =  Clazz.newFloatArray (this.npalloc, 0);
var newu =  Clazz.newFloatArray (this.npalloc, 0);
var newv =  Clazz.newFloatArray (this.npalloc, 0);
var newvcolor =  Clazz.newIntArray (this.npalloc, 0);
if (this.debug) {
System.gc ();
System.out.println ("Tmesh point mem usage: " + (Runtime.getRuntime ().totalMemory () - Runtime.getRuntime ().freeMemory ()) + " np " + this.np + " npalloc " + this.npalloc);
}if (this.np != 0) {
System.arraycopy (this.x, 0, newx, 0, this.np);
System.arraycopy (this.y, 0, newy, 0, this.np);
System.arraycopy (this.z, 0, newz, 0, this.np);
System.arraycopy (this.nx, 0, newnx, 0, this.np);
System.arraycopy (this.ny, 0, newny, 0, this.np);
System.arraycopy (this.nz, 0, newnz, 0, this.np);
System.arraycopy (this.u, 0, newu, 0, this.np);
System.arraycopy (this.v, 0, newv, 0, this.np);
System.arraycopy (this.vcolor, 0, newvcolor, 0, this.np);
}this.x = newx;
this.y = newy;
this.z = newz;
this.nx = newnx;
this.ny = newny;
this.nz = newnz;
this.u = newu;
this.v = newv;
this.vcolor = newvcolor;
if (this.useLabels) {
var newlabels =  new Array (this.npalloc);
if (this.np != 0) {
System.arraycopy (this.labels, 0, newlabels, 0, this.np);
}this.labels = newlabels;
}} catch (e) {
if (Clazz.exceptionOf (e, OutOfMemoryError)) {
System.out.println ("Out of memory in Tmesh, trying to allocate points: " + 9 * 4 * this.npalloc + " bytes");
throw  new OutOfMemoryError (e.getMessage ());
} else {
throw e;
}
}
});
Clazz.defineMethod (c$, "addLine", 
function (i, j, c) {
if (i == -1 || j == -1) {
System.out.println ("addLine i " + i + " j " + j + " faceIndex " + c);
return this.nt;
}this.ensureTriangleCapacityOne ();
this.t0[this.nt] = i;
this.t1[this.nt] = j;
this.t2[this.nt] = -1;
this.tcolor[this.nt] = c;
return this.nt++;
}, "~N,~N,~N");
Clazz.defineMethod (c$, "addTriangle", 
function (i, j, k, color) {
this.ensureTriangleCapacityOne ();
if ((i == j || i == k || j == k) || this.debug) {
System.out.println ("tmesh.addTriangle i=" + i + " j=" + j + " k=" + k);
}if (i != -1 && j != -1 && k != -1) {
this.t0[this.nt] = i;
this.t1[this.nt] = j;
this.t2[this.nt] = k;
this.tcolor[this.nt] = color;
return this.nt++;
}return -1;
}, "~N,~N,~N,~N");
Clazz.defineMethod (c$, "setTriangleCapacity", 
function (nn) {
this.ntalloc = nn;
this.t0 =  Clazz.newIntArray (this.ntalloc, 0);
this.t1 =  Clazz.newIntArray (this.ntalloc, 0);
this.t2 =  Clazz.newIntArray (this.ntalloc, 0);
this.tcolor =  Clazz.newIntArray (this.ntalloc, 0);
}, "~N");
Clazz.defineMethod (c$, "ensureTriangleCapacity", 
 function (ntNeeded) {
if (this.ntalloc <= ntNeeded) {
while (ntNeeded > this.ntalloc + this.TriangleAllocationIncrement) {
this.TriangleAllocationIncrement *= 2;
}
this.ntalloc += this.TriangleAllocationIncrement;
this.doTriangleAllocation ();
}}, "~N");
Clazz.defineMethod (c$, "ensureTriangleCapacityOne", 
function () {
if (this.nt == this.ntalloc) {
this.ntalloc += this.TriangleAllocationIncrement;
if (this.TriangleAllocationIncrement < 131072) this.TriangleAllocationIncrement *= 2;
this.doTriangleAllocation ();
}});
Clazz.defineMethod (c$, "doTriangleAllocation", 
function () {
try {
var newt0 =  Clazz.newIntArray (this.ntalloc, 0);
var newt1 =  Clazz.newIntArray (this.ntalloc, 0);
var newt2 =  Clazz.newIntArray (this.ntalloc, 0);
var newtcolor =  Clazz.newIntArray (this.ntalloc, 0);
if (this.debug) {
System.gc ();
System.out.println ("Tmesh triangle mem usage: " + (Runtime.getRuntime ().totalMemory () - Runtime.getRuntime ().freeMemory ()) + " nt " + this.nt + " ntalloc " + this.ntalloc);
}if (this.nt != 0) {
System.arraycopy (this.t0, 0, newt0, 0, this.nt);
System.arraycopy (this.t1, 0, newt1, 0, this.nt);
System.arraycopy (this.t2, 0, newt2, 0, this.nt);
System.arraycopy (this.tcolor, 0, newtcolor, 0, this.nt);
}this.t0 = newt0;
this.t1 = newt1;
this.t2 = newt2;
this.tcolor = newtcolor;
} catch (e) {
if (Clazz.exceptionOf (e, OutOfMemoryError)) {
System.out.println ("Out of memory in Tmesh, trying to allocate new triangles: " + 4 * 4 * this.ntalloc + " bytes");
throw  new OutOfMemoryError (e.getMessage ());
} else {
throw e;
}
}
});
Clazz.defineMethod (c$, "addSphere", 
function (xx, yy, zz, rr, cc) {
if (this.style != 5) {
if (this.spheres == null) {
this.spheres =  new astex.render.Tmesh ();
this.spheres.style = 5;
}this.spheres.addSphere (xx, yy, zz, rr, cc);
} else {
this.ensurePointCapacityOne ();
this.x[this.np] = xx;
this.y[this.np] = yy;
this.z[this.np] = zz;
this.vcolor[this.np] = cc;
this.nx[this.np] = rr;
this.np++;
}}, "~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "addLine2", 
function (x1, y1, z1, x2, y2, z2, c1, c2) {
this.addCylinder (x1, y1, z1, x2, y2, z2, 0.0, c1, c2);
}, "~N,~N,~N,~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "addCylinder", 
function (x1, y1, z1, x2, y2, z2, r, c1, c2) {
if (this.style != 4) {
if (this.cylinders == null) {
this.cylinders =  new astex.render.Tmesh ();
this.cylinders.style = 4;
this.cylinders.colorStyle = 3;
}this.cylinders.addCylinder (x1, y1, z1, x2, y2, z2, r, c1, c2);
} else {
this.ensurePointCapacityOne ();
this.x[this.np] = x1;
this.y[this.np] = y1;
this.z[this.np] = z1;
this.vcolor[this.np] = c1;
this.nx[this.np] = r;
this.np++;
this.ensurePointCapacityOne ();
this.x[this.np] = x2;
this.y[this.np] = y2;
this.z[this.np] = z2;
this.vcolor[this.np] = c2;
this.nx[this.np] = r;
this.np++;
this.ensureTriangleCapacityOne ();
this.t0[this.nt] = this.np - 2;
this.t1[this.nt] = this.np - 1;
this.nt++;
}}, "~N,~N,~N,~N,~N,~N,~N,~N,~N");
c$.readPly = Clazz.defineMethod (c$, "readPly", 
function (f) {
System.out.println ("reading ply file");
var tmesh =  new astex.render.Tmesh ();
var vcount = 0;
var fcount = 0;
while (f.nextLine ()) {
var fieldCount = f.getFieldCount ();
if (fieldCount == 3 && f.getField (0).equals ("element")) {
if (f.getField (1).equals ("vertex")) {
vcount = f.readFieldInt (2);
tmesh.setPointCapacity (vcount);
System.out.println ("vertex count " + vcount);
} else if (f.getField (1).equals ("face")) {
fcount = f.readFieldInt (2);
tmesh.setTriangleCapacity (fcount);
System.out.println ("face count " + fcount);
}} else if (fieldCount == 1 && f.getField (0).equals ("end_header")) {
System.out.println ("seen end of header");
break;
}}
for (var i = 0; i < vcount; i++) {
f.nextLine ();
var fieldCount = f.getFieldCount ();
var u = 0.0;
var v = 0.0;
f.readFieldFloat (0);
f.readFieldFloat (1);
f.readFieldFloat (2);
if (fieldCount == 5) {
u = v = f.readFieldFloat (4);
}tmesh.addPointNoColor (f.readFieldDbl (0), f.readFieldDbl (1), f.readFieldDbl (2), 0.0, 0.0, 0.0, u, v);
if (i != 0 && i % 100000 == 0) {
System.out.println ("vertex " + i);
}}
for (var i = 0; i < fcount; i++) {
f.nextLine ();
var fieldCount = f.getFieldCount ();
if (fieldCount == 4) {
tmesh.addTriangle (f.readFieldInt (1), f.readFieldInt (2), f.readFieldInt (3), 0);
} else {
System.out.println ("more than 4 fields on face record.");
break;
}if (i != 0 && i % 100000 == 0) {
System.out.println ("face " + i);
}}
var a =  Clazz.newDoubleArray (3, 0);
var b =  Clazz.newDoubleArray (3, 0);
var n =  Clazz.newDoubleArray (3, 0);
for (var i = 0; i < tmesh.nt; i++) {
var ti = tmesh.t0[i];
var tj = tmesh.t1[i];
var tk = tmesh.t2[i];
a[0] = tmesh.x[ti] - tmesh.x[tj];
a[1] = tmesh.y[ti] - tmesh.y[tj];
a[2] = tmesh.z[ti] - tmesh.z[tj];
b[0] = tmesh.x[tk] - tmesh.x[tj];
b[1] = tmesh.y[tk] - tmesh.y[tj];
b[2] = tmesh.z[tk] - tmesh.z[tj];
astex.util.Point3d.cross (n, b, a);
tmesh.nx[ti] += n[0];
tmesh.ny[ti] += n[1];
tmesh.nz[ti] += n[2];
tmesh.nx[tj] += n[0];
tmesh.ny[tj] += n[1];
tmesh.nz[tj] += n[2];
tmesh.nx[tk] += n[0];
tmesh.ny[tk] += n[1];
tmesh.nz[tk] += n[2];
}
for (var i = 0; i < tmesh.np; i++) {
var dx = tmesh.nx[i];
var dy = tmesh.ny[i];
var dz = tmesh.nz[i];
var len = Math.sqrt (dx * dx + dy * dy + dz * dz);
tmesh.nx[i] /= len;
tmesh.ny[i] /= len;
tmesh.nz[i] /= len;
}
return tmesh;
}, "astex.io.FILE");
c$.readFromData3 = Clazz.defineMethod (c$, "readFromData3", 
function (data, tr) {
var tmesh =  new astex.render.Tmesh ();
tmesh.setPointCapacity (3);
for (var i = 0; i < 3; i++) {
var newx = tr[0][0] * data.x[i] + tr[0][1] * data.y[i] + tr[0][2] * data.z[i] + tr[0][3];
var newy = tr[1][0] * data.x[i] + tr[1][1] * data.y[i] + tr[1][2] * data.z[i] + tr[1][3];
var newz = tr[2][0] * data.x[i] + tr[2][1] * data.y[i] + tr[2][2] * data.z[i] + tr[2][3];
var nx = tr[0][0] * data.nx[i] + tr[0][1] * data.ny[i] + tr[0][2] * data.nz[i];
var ny = tr[1][0] * data.nx[i] + tr[1][1] * data.ny[i] + tr[1][2] * data.nz[i];
var nz = tr[2][0] * data.nx[i] + tr[2][1] * data.ny[i] + tr[2][2] * data.nz[i];
tmesh.addPointNoColor (newx, newy, newz, nx, ny, nz, data.u[i], data.v[i]);
}
tmesh.setTriangleCapacity (1);
tmesh.addTriangle (0, 1, 2, 0x001100);
return tmesh;
}, "astex.render.Tmesh,~A");
c$.readFromData2 = Clazz.defineMethod (c$, "readFromData2", 
function (data, tr) {
var tmesh =  new astex.render.Tmesh ();
tmesh.setPointCapacity (2 * data.np);
for (var i = 0; i < data.np; i++) {
var newx = tr[0][0] * data.x[i] + tr[0][1] * data.y[i] + tr[0][2] * data.z[i] + tr[0][3];
var newy = tr[1][0] * data.x[i] + tr[1][1] * data.y[i] + tr[1][2] * data.z[i] + tr[1][3];
var newz = tr[2][0] * data.x[i] + tr[2][1] * data.y[i] + tr[2][2] * data.z[i] + tr[2][3];
var nx = tr[0][0] * data.nx[i] + tr[0][1] * data.ny[i] + tr[0][2] * data.nz[i];
var ny = tr[1][0] * data.nx[i] + tr[1][1] * data.ny[i] + tr[1][2] * data.nz[i];
var nz = tr[2][0] * data.nx[i] + tr[2][1] * data.ny[i] + tr[2][2] * data.nz[i];
tmesh.addPointNoColor (newx, newy, newz, nx, ny, nz, data.u[i], data.v[i]);
}
for (var i = 0; i < data.np; i++) {
var newx = tr[0][0] * data.x[i] + tr[0][1] * data.y[i] + tr[0][2] * data.z[i];
var newy = tr[1][0] * data.x[i] + tr[1][1] * data.y[i] + tr[1][2] * data.z[i];
var newz = tr[2][0] * data.x[i] + tr[2][1] * data.y[i] + tr[2][2] * data.z[i];
var nx = tr[0][0] * data.nx[i] + tr[0][1] * data.ny[i] + tr[0][2] * data.nz[i];
var ny = tr[1][0] * data.nx[i] + tr[1][1] * data.ny[i] + tr[1][2] * data.nz[i];
var nz = tr[2][0] * data.nx[i] + tr[2][1] * data.ny[i] + tr[2][2] * data.nz[i];
tmesh.addPointNoColor (newx, newy, newz, nx, ny, nz, data.u[i], data.v[i]);
}
tmesh.setTriangleCapacity (2 * data.t0.length);
for (var i = 0; i < data.t0.length; i++) {
tmesh.addTriangle (data.t0[i], data.t1[i], data.t2[i], 0x001100);
tmesh.addTriangle (data.t0[i] + data.x.length, data.t1[i] + data.x.length, data.t2[i] + data.x.length, 0x001100);
}
return tmesh;
}, "astex.render.Tmesh,~A");
c$.readFromData = Clazz.defineMethod (c$, "readFromData", 
function (data, tr) {
var tmesh =  new astex.render.Tmesh ();
for (var i = 0; i < data.np; i++) {
var newx = tr[0][0] * data.x[i] + tr[0][1] * data.y[i] + tr[0][2] * data.z[i] + tr[0][3];
var newy = tr[1][0] * data.x[i] + tr[1][1] * data.y[i] + tr[1][2] * data.z[i] + tr[1][3];
var newz = tr[2][0] * data.x[i] + tr[2][1] * data.y[i] + tr[2][2] * data.z[i] + tr[2][3];
var nx = tr[0][0] * data.nx[i] + tr[0][1] * data.ny[i] + tr[0][2] * data.nz[i];
var ny = tr[1][0] * data.nx[i] + tr[1][1] * data.ny[i] + tr[1][2] * data.nz[i];
var nz = tr[2][0] * data.nx[i] + tr[2][1] * data.ny[i] + tr[2][2] * data.nz[i];
tmesh.addPointNoColor (newx, newy, newz, nx, ny, nz, data.u[i], data.v[i]);
}
for (var i = 0; i < data.nt; i++) {
tmesh.addTriangle (data.t0[i], data.t1[i], data.t2[i], 0x001100);
}
return tmesh;
}, "astex.render.Tmesh,~A");
c$.read = Clazz.defineMethod (c$, "read", 
function (file) {
var f = astex.io.FILE.open (file);
if (f == null) {
astex.io.FILE.getException ().printStackTrace ();
return null;
}if (file.indexOf (".ply") != -1) {
return astex.render.Tmesh.readPly (f);
} else if (file.indexOf (".gro") != -1) {
}f.nextLine ();
var tmesh =  new astex.render.Tmesh ();
tmesh.name = file;
var nv = f.readFieldInt (0);
if (f.getFieldCount () > 1) {
tmesh.colorStyle = f.readFieldInt (1);
}if (f.getFieldCount () > 2) {
tmesh.lineWidth = f.readFieldDbl (2);
}if (f.getFieldCount () > 3) {
var o = f.readFieldInt (3);
if (o == 1) {
tmesh.useLabels = true;
tmesh.isSelectable = true;
}}tmesh.setPointCapacity (nv);
for (var i = 0; i < nv; i++) {
f.nextLine ();
var vx = f.readFieldDbl (0);
var vy = f.readFieldDbl (1);
var vz = f.readFieldDbl (2);
var nx = f.readFieldDbl (3);
var ny = f.readFieldDbl (4);
var nz = f.readFieldDbl (5);
var c = f.readFieldInt (6);
var u = f.readFieldDbl (7);
var v = f.readFieldDbl (8);
var s = "";
if (tmesh.useLabels) s = f.getField (9);
tmesh.addPoint (vx, vy, vz, nx, ny, nz, c, u, v, s);
}
f.nextLine ();
var ntm = f.readFieldInt (0);
tmesh.setTriangleCapacity (2 * nv);
System.out.println ("number of tmeshes " + ntm);
var vertices =  Clazz.newIntArray (100, 0);
var tc = 0;
var linesOnly = true;
for (var i = 0; i < ntm; i++) {
f.nextLine ();
var np = f.readFieldInt (0);
if (np > vertices.length) {
vertices =  Clazz.newIntArray (np, 0);
}tc = 0;
if (f.getFieldCount () > 1) {
tc = f.readFieldInt (1);
}for (var j = 0; j < np; j++) {
f.nextLine ();
vertices[j] = f.readFieldInt (0);
}
if (np == 2 || (np == 3 && vertices[2] == -1)) {
tmesh.addLine (vertices[0], vertices[1], tc);
} else {
linesOnly = false;
for (var j = 0; j < np - 2; j++) {
tmesh.addTriangle (vertices[j], vertices[j + 1], vertices[j + 2], tc);
}
}}
if (linesOnly) tmesh.style = 2;
f.close ();
return tmesh;
}, "~S");
Clazz.defineMethod (c$, "distance", 
function (v0, v1) {
var dx = this.x[v0] - this.x[v1];
var dy = this.y[v0] - this.y[v1];
var dz = this.z[v0] - this.z[v1];
return Math.sqrt (dx * dx + dy * dy + dz * dz);
}, "~N,~N");
Clazz.defineMethod (c$, "distance", 
function (v0, p) {
var dx = this.x[v0] - p[0];
var dy = this.y[v0] - p[1];
var dz = this.z[v0] - p[2];
return Math.sqrt (dx * dx + dy * dy + dz * dz);
}, "~N,~A");
Clazz.defineMethod (c$, "mid", 
function (v, v0, v1) {
v[0] = 0.5 * (this.x[v0] + this.x[v1]);
v[1] = 0.5 * (this.y[v0] + this.y[v1]);
v[2] = 0.5 * (this.z[v0] + this.z[v1]);
}, "~A,~N,~N");
Clazz.defineMethod (c$, "output", 
function (filename) {
var output = astex.io.FILE.openForWrite (filename);
if (output.errorMsg != null) {
System.err.println ("tmesh.output() couldn't open " + filename + " : " + output.errorMsg);
return;
}output.printFI ("%d", this.np);
output.printFI (" %d", this.colorStyle);
output.printFD (" %.3f", this.lineWidth);
var o = this.useLabels ? 1 : 0;
output.printFI (" %d\n", o);
for (var i = 0; i < this.np; i++) {
output.printFD (" %.3f", this.x[i]);
output.printFD (" %.3f", this.y[i]);
output.printFD (" %.3f", this.z[i]);
output.printFD (" %.3f", this.nx[i]);
output.printFD (" %.3f", this.ny[i]);
output.printFD (" %.3f", this.nz[i]);
output.printFI (" %d", this.vcolor[i]);
if (this.u != null) {
output.printFD (" %.3f", this.u[i]);
} else {
output.printS (" 0");
}if (this.v != null) {
output.printFD (" %.3f", this.v[i]);
} else {
output.printS (" 0");
}if (this.useLabels) output.printS (" " + this.labels[i]);
output.println ("");
}
output.printFI ("%d\n", this.nt);
for (var i = 0; i < this.nt; i++) {
output.printFI ("3 %d\n", this.tcolor[i]);
output.printFI ("%d\n", this.t0[i]);
output.printFI ("%d\n", this.t1[i]);
output.printFI ("%d\n", this.t2[i]);
}
output.close ();
}, "~S");
Clazz.defineMethod (c$, "getBoundingSphere", 
function (c) {
if (c == null) {
System.out.println ("tmesh " + this.name + ": null array for center");
return 0.0;
}c[0] = c[1] = c[2] = 0.0;
if (this.np > 0) {
for (var i = 0; i < this.np; i++) {
c[0] += this.x[i];
c[1] += this.y[i];
c[2] += this.z[i];
}
c[0] /= this.np;
c[1] /= this.np;
c[2] /= this.np;
var rsq = 0.0;
for (var i = 0; i < this.np; i++) {
var dx = c[0] - this.x[i];
var dy = c[1] - this.y[i];
var dz = c[2] - this.z[i];
var rnew = dx * dx + dy * dy + dz * dz;
if (rnew > rsq) {
rsq = rnew;
}}
return Math.sqrt (rsq);
}return 0.0;
}, "~A");
Clazz.defineMethod (c$, "clip", 
function (uv) {
var pclip =  Clazz.newIntArray (this.np, 0);
var used =  Clazz.newIntArray (this.np, 0);
var remainingPoints = 0;
this.clipHash =  new java.util.Hashtable ();
System.out.println ("Tmesh.clip: clipping " + this.getName ());
System.out.println ("Initial points " + this.np + " triangles " + this.nt);
for (var i = 0; i < this.np; i++) {
var clipped = 0;
if ((uv | 1) != 0) {
var ut = this.uscale * (this.u[i] - this.uoffset);
if (ut < 0.0 || ut > 1.0) clipped = 1;
}if (clipped == 0 && ((uv | 2) != 0)) {
var vt = this.vscale * (this.v[i] - this.voffset);
if (vt < 0.0 || vt > 1.0) clipped = 1;
}pclip[i] = clipped;
used[i] = 1 - clipped;
}
var remainingTriangles = 0;
var t0new =  Clazz.newIntArray (2 * this.nt, 0);
var t1new =  Clazz.newIntArray (2 * this.nt, 0);
var t2new =  Clazz.newIntArray (2 * this.nt, 0);
var tcolornew =  Clazz.newIntArray (2 * this.nt, 0);
for (var i = 0; i < this.nt; i++) {
var totalUsed = used[this.t0[i]] + used[this.t1[i]] + used[this.t2[i]];
if (totalUsed == 3) {
t0new[remainingTriangles] = this.t0[i];
t1new[remainingTriangles] = this.t1[i];
t2new[remainingTriangles] = this.t2[i];
tcolornew[remainingTriangles] = this.tcolor[i];
remainingTriangles++;
} else if (totalUsed == 1) {
var v0 = -1;
var v1 = -1;
var v2 = -1;
if (used[this.t0[i]] == 1) {
v0 = this.t0[i];
v1 = this.addClipVertex (this.t0[i], this.t1[i], uv);
v2 = this.addClipVertex (this.t0[i], this.t2[i], uv);
} else if (used[this.t1[i]] == 1) {
v0 = this.t1[i];
v1 = this.addClipVertex (this.t1[i], this.t2[i], uv);
v2 = this.addClipVertex (this.t1[i], this.t0[i], uv);
} else if (used[this.t2[i]] == 1) {
v0 = this.t2[i];
v1 = this.addClipVertex (this.t2[i], this.t0[i], uv);
v2 = this.addClipVertex (this.t2[i], this.t1[i], uv);
}if (v0 != -1 && v1 != -1 && v2 != -1) {
t0new[remainingTriangles] = v0;
t1new[remainingTriangles] = v1;
t2new[remainingTriangles] = v2;
tcolornew[remainingTriangles] = this.tcolor[i];
remainingTriangles++;
} else {
System.out.println ("skipping triangle");
}} else if (totalUsed == 2) {
var v0 = -1;
var v1 = -1;
var v2 = -1;
var va = -1;
var vb = -1;
if (used[this.t0[i]] == 0) {
v0 = this.t0[i];
v1 = this.t1[i];
v2 = this.t2[i];
va = this.addClipVertex (this.t0[i], this.t1[i], uv);
vb = this.addClipVertex (this.t0[i], this.t2[i], uv);
} else if (used[this.t1[i]] == 0) {
v0 = this.t1[i];
v2 = this.t0[i];
v1 = this.t2[i];
va = this.addClipVertex (this.t1[i], this.t2[i], uv);
vb = this.addClipVertex (this.t1[i], this.t0[i], uv);
} else if (used[this.t2[i]] == 0) {
v0 = this.t2[i];
v1 = this.t0[i];
v2 = this.t1[i];
va = this.addClipVertex (this.t2[i], this.t0[i], uv);
vb = this.addClipVertex (this.t2[i], this.t1[i], uv);
}if (v0 != -1 && v1 != -1 && v2 != -1 && va != -1 && vb != -1) {
t0new[remainingTriangles] = va;
t1new[remainingTriangles] = v1;
t2new[remainingTriangles] = v2;
tcolornew[remainingTriangles] = this.tcolor[i];
remainingTriangles++;
t0new[remainingTriangles] = va;
t1new[remainingTriangles] = vb;
t2new[remainingTriangles] = v2;
tcolornew[remainingTriangles] = this.tcolor[i];
remainingTriangles++;
} else {
System.out.println ("skipping triangle");
}}}
this.nt = remainingTriangles;
this.t0 = t0new;
this.t1 = t1new;
this.t2 = t2new;
this.tcolor = tcolornew;
pclip =  Clazz.newIntArray (this.np, 0);
used =  Clazz.newIntArray (this.np, 0);
for (var i = 0; i < this.np; i++) {
used[i] = 0;
}
for (var i = 0; i < this.nt; i++) {
used[this.t0[i]] = 1;
used[this.t1[i]] = 1;
used[this.t2[i]] = 1;
}
remainingPoints = 0;
for (var i = 0; i < this.np; i++) {
if (used[i] == 1) {
this.x[remainingPoints] = this.x[i];
this.y[remainingPoints] = this.y[i];
this.z[remainingPoints] = this.z[i];
this.nx[remainingPoints] = this.nx[i];
this.ny[remainingPoints] = this.ny[i];
this.nz[remainingPoints] = this.nz[i];
this.u[remainingPoints] = this.u[i];
this.v[remainingPoints] = this.v[i];
this.vcolor[remainingPoints] = this.vcolor[i];
pclip[i] = remainingPoints++;
} else {
pclip[i] = -1;
}}
this.np = remainingPoints;
for (var i = 0; i < this.nt; i++) {
this.t0[i] = pclip[this.t0[i]];
this.t1[i] = pclip[this.t1[i]];
this.t2[i] = pclip[this.t2[i]];
}
System.out.println ("Final   points " + this.np + " triangles " + this.nt);
}, "~N");
Clazz.defineMethod (c$, "addClipVertex", 
 function (v0, v1, uv) {
if (v0 == -1 || v1 == -1) {
System.out.println ("vertex is out of use v0 " + v0 + " v1 " + v1);
return -1;
}var hashVal = null;
if (v0 < v1) {
hashVal =  new Integer (v0 + 1000000 * v1);
} else {
hashVal =  new Integer (v1 + 1000000 * v0);
}var newVertex = this.clipHash.get (hashVal);
if (newVertex != null) {
return newVertex.intValue ();
}newVertex =  new Integer (this.np);
var t0 = 0.0;
var t1 = 0.0;
if (uv == 1) {
t0 = this.uscale * (this.u[v0] - this.uoffset);
t1 = this.uscale * (this.u[v1] - this.uoffset);
} else {
t0 = this.vscale * (this.v[v0] - this.voffset);
t1 = this.vscale * (this.v[v1] - this.voffset);
}if (t0 >= 0.0 && t1 >= 0.0 && t0 <= 1.0 && t1 <= 1.0) {
System.out.println ("t0 " + t0);
System.out.println ("t1 " + t1);
System.out.println ("edge shouldn't be clipped, both points are in 0-1");
return -1;
}var frac = (1.0 - t0) / (t1 - t0);
if (frac < 0.0 || frac > 1.0) {
System.out.println ("t0 " + t0);
System.out.println ("t1 " + t1);
System.out.println ("frac " + frac);
return -1;
}this.ensurePointCapacityOne ();
this.x[this.np] = (this.x[v0] + frac * (this.x[v1] - this.x[v0]));
this.y[this.np] = (this.y[v0] + frac * (this.y[v1] - this.y[v0]));
this.z[this.np] = (this.z[v0] + frac * (this.z[v1] - this.z[v0]));
this.nx[this.np] = (this.nx[v0] + frac * (this.nx[v1] - this.nx[v0]));
this.ny[this.np] = (this.ny[v0] + frac * (this.ny[v1] - this.ny[v0]));
this.nz[this.np] = (this.nz[v0] + frac * (this.nz[v1] - this.nz[v0]));
this.u[this.np] = (this.u[v0] + frac * (this.u[v1] - this.u[v0]));
this.v[this.np] = (this.v[v0] + frac * (this.v[v1] - this.v[v0]));
this.vcolor[this.np] = astex.util.Color32.blendF (this.vcolor[v0], this.vcolor[v1], frac);
var len = this.nx[this.np] * this.nx[this.np];
len += this.ny[this.np] * this.ny[this.np];
len += this.nz[this.np] * this.nz[this.np];
len = Math.sqrt (len);
this.nx[this.np] /= len;
this.ny[this.np] /= len;
this.nz[this.np] /= len;
this.clipHash.put (hashVal, newVertex);
this.np++;
return newVertex.intValue ();
}, "~N,~N,~N");
Clazz.defineMethod (c$, "recalculateNormals", 
function () {
var newnx =  Clazz.newDoubleArray (this.np, 0);
var newny =  Clazz.newDoubleArray (this.np, 0);
var newnz =  Clazz.newDoubleArray (this.np, 0);
for (var i = 0; i < this.nt; i++) {
this.origNorm.x = this.nx[this.t0[i]] + this.nx[this.t1[i]] + this.nx[this.t2[i]];
this.origNorm.y = this.ny[this.t0[i]] + this.ny[this.t1[i]] + this.ny[this.t2[i]];
this.origNorm.z = this.nz[this.t0[i]] + this.nz[this.t1[i]] + this.nz[this.t2[i]];
this.ab.x = this.x[this.t0[i]] - this.x[this.t1[i]];
this.ab.y = this.y[this.t0[i]] - this.y[this.t1[i]];
this.ab.z = this.z[this.t0[i]] - this.z[this.t1[i]];
this.bc.x = this.x[this.t1[i]] - this.x[this.t2[i]];
this.bc.y = this.y[this.t1[i]] - this.y[this.t2[i]];
this.bc.z = this.z[this.t1[i]] - this.z[this.t2[i]];
astex.util.Point3d.crossNoNormalise (this.norm, this.ab, this.bc);
var dot = this.norm.x * this.origNorm.x + this.norm.y * this.origNorm.y + this.norm.z * this.origNorm.z;
if (dot < 0.0) {
this.norm.negate ();
}newnx[this.t0[i]] += this.norm.x;
newny[this.t0[i]] += this.norm.y;
newnz[this.t0[i]] += this.norm.z;
newnx[this.t1[i]] += this.norm.x;
newny[this.t1[i]] += this.norm.y;
newnz[this.t1[i]] += this.norm.z;
newnx[this.t2[i]] += this.norm.x;
newny[this.t2[i]] += this.norm.y;
newnz[this.t2[i]] += this.norm.z;
}
for (var i = 0; i < this.np; i++) {
var len = newnx[i] * newnx[i];
len += newny[i] * newny[i];
len += newnz[i] * newnz[i];
len = Math.sqrt (len);
if (len == 0.0) len = 1.0;
this.nx[i] = (newnx[i] / len);
this.ny[i] = (newny[i] / len);
this.nz[i] = (newnz[i] / len);
}
newnx = null;
newny = null;
newnz = null;
});
Clazz.overrideMethod (c$, "toString", 
function () {
return this.name + ": " + this.np + " points, " + this.nt + " triangles";
});
Clazz.defineMethod (c$, "triangleLookup", 
 function (i, j) {
return (i + this.np * j);
}, "~N,~N");
Clazz.defineMethod (c$, "sumTriangleDis", 
 function (i, j, k) {
var dis = 0.0;
dis += this.distance (i, j);
dis += this.distance (j, k);
dis += this.distance (i, k);
return dis;
}, "~N,~N,~N");
Clazz.defineMethod (c$, "removeTriangle", 
 function (t, p1, p2) {
this.keepTriangles[t] = false;
this.keepPoints[p1] = false;
this.interpolate (p1, p2);
var ntri = this.ntriangles[p1];
for (var ot = 0; ot < ntri; ot++) {
var lt = this.triangleLookup (p1, ot);
var tref = this.triangleRef[lt];
this.changeTriangleRef (p1, p2, tref);
this.changePointTriangleRef (p2, tref);
}
}, "~N,~N,~N");
Clazz.defineMethod (c$, "interpolate", 
 function (p1, p2) {
this.x[p2] = 0.5 * (this.x[p2] + this.x[p1]);
this.y[p2] = 0.5 * (this.y[p2] + this.y[p1]);
this.z[p2] = 0.5 * (this.z[p2] + this.z[p1]);
this.nx[p2] = 0.5 * (this.nx[p2] + this.nx[p1]);
this.ny[p2] = 0.5 * (this.ny[p2] + this.ny[p1]);
this.nz[p2] = 0.5 * (this.nz[p2] + this.nz[p1]);
this.u[p2] = 0.5 * (this.u[p2] + this.u[p1]);
this.v[p2] = 0.5 * (this.v[p2] + this.v[p1]);
}, "~N,~N");
Clazz.defineMethod (c$, "changePointTriangleRef", 
 function (p2, t) {
var ntri = this.ntriangles[p2];
for (var j = 0; j < ntri; j++) {
var lt = this.triangleLookup (p2, j);
var tref = this.triangleRef[lt];
if (tref == t) return;
}
var lt = this.triangleLookup (p2, ntri);
this.triangleRef[lt] = t;
this.ntriangles[p2]++;
}, "~N,~N");
Clazz.defineMethod (c$, "changeTriangleRef", 
 function (p1, p2, t) {
if (this.t0[t] == p1) {
this.t0[t] = p2;
if (this.t1[t] == p2 || this.t2[t] == p2) {
this.keepTriangles[t] = false;
}}if (this.t1[t] == p1) {
this.t1[t] = p2;
if (this.t0[t] == p2 || this.t2[t] == p2) {
this.keepTriangles[t] = false;
}}if (this.t2[t] == p1) {
this.t2[t] = p2;
if (this.t0[t] == p2 || this.t1[t] == p2) {
this.keepTriangles[t] = false;
}}}, "~N,~N,~N");
Clazz.defineMethod (c$, "copyUp", 
 function (c, i) {
this.x[c] = this.x[i];
this.y[c] = this.y[i];
this.z[c] = this.z[i];
this.nx[c] = this.nx[i];
this.ny[c] = this.ny[i];
this.nz[c] = this.nz[i];
this.u[c] = this.u[i];
this.v[c] = this.v[i];
c++;
return c;
}, "~N,~N");
Clazz.defineMethod (c$, "copyUpTriangles", 
 function (c, i) {
this.t0[c] = this.t0[i];
this.t1[c] = this.t1[i];
this.t2[c] = this.t2[i];
c++;
return c;
}, "~N,~N");
Clazz.defineMethod (c$, "smooth", 
function (dlen) {
var flen = dlen;
var avDis = 0.0;
this.triangleRef =  Clazz.newIntArray (this.np * 100, 0);
this.ntriangles =  Clazz.newIntArray (this.np, 0);
this.keepTriangles =  Clazz.newBooleanArray (this.nt, false);
this.keepPoints =  Clazz.newBooleanArray (this.np, false);
for (var i = 0; i < this.np; i++) {
this.ntriangles[i] = 0;
this.keepPoints[i] = false;
}
var allTriangles = true;
for (var i = 0; i < this.nt; i++) {
var look;
var p0 = this.t0[i];
this.keepTriangles[i] = true;
look = this.triangleLookup (p0, this.ntriangles[p0]);
this.triangleRef[look] = i;
this.ntriangles[p0]++;
var p1 = this.t1[i];
look = this.triangleLookup (p1, this.ntriangles[p1]);
this.triangleRef[look] = i;
this.ntriangles[p1]++;
var p2 = this.t2[i];
if (p2 < 0 || this.ntriangles[p2] < 0) {
allTriangles = false;
break;
}look = this.triangleLookup (p2, this.ntriangles[p2]);
this.triangleRef[look] = i;
this.ntriangles[p2]++;
avDis += this.sumTriangleDis (p0, p1, p2);
}
if (allTriangles) {
avDis /= (2 * this.nt);
flen *= avDis;
for (var t = 0; t < this.nt; t++) {
if (this.keepTriangles[t]) {
if (this.distance (this.t0[t], this.t1[t]) < flen) {
this.removeTriangle (t, this.t0[t], this.t1[t]);
} else if (this.distance (this.t1[t], this.t2[t]) < flen) {
this.removeTriangle (t, this.t1[t], this.t2[t]);
} else if (this.distance (this.t0[t], this.t2[t]) < flen) {
this.removeTriangle (t, this.t0[t], this.t2[t]);
}}}
for (var i = 0; i < this.nt; i++) {
if (this.keepTriangles[i]) {
this.keepPoints[this.t0[i]] = true;
this.keepPoints[this.t1[i]] = true;
this.keepPoints[this.t2[i]] = true;
}}
var count = 0;
for (var i = 0; i < this.np; i++) {
if (this.keepPoints[i]) {
count = this.copyUp (count, i);
for (var j = 0; j < this.ntriangles[i]; j++) {
var look = this.triangleRef[this.triangleLookup (i, j)];
if (this.keepTriangles[look]) {
if (this.t0[look] == i) {
this.t0[look] = count - 1;
}if (this.t1[look] == i) {
this.t1[look] = count - 1;
}if (this.t2[look] == i) {
this.t2[look] = count - 1;
}}}
}}
this.np = count;
count = 0;
for (var i = 0; i < this.nt; i++) {
if (this.keepTriangles[i]) {
count = this.copyUpTriangles (count, i);
}}
this.nt = count;
System.out.println ("number of vertices (after smoothing) " + this.np);
System.out.println ("number of triangles (after smoothing) " + this.nt);
}this.triangleRef = null;
this.ntriangles = null;
this.keepTriangles = null;
this.keepPoints = null;
}, "~N");
c$.copy = Clazz.defineMethod (c$, "copy", 
function (objects) {
var newTmesh =  new astex.render.Tmesh ();
var objectCount = objects.size ();
for (var o = 0; o < objectCount; o++) {
var tm = objects.get (o);
var cp = newTmesh.np;
for (var i = 0; i < tm.np; i++) {
newTmesh.addPointNoColor (tm.x[i], tm.y[i], tm.z[i], tm.nx[i], tm.ny[i], tm.nz[i], tm.u[i], tm.v[i]);
newTmesh.vcolor[cp + i] = tm.vcolor[i];
}
for (var i = 0; i < tm.nt; i++) {
newTmesh.addTriangle (tm.t0[i] + cp, tm.t1[i] + cp, tm.t2[i] + cp, tm.tcolor[i]);
}
newTmesh.setRenderPass (tm.getRenderPass ());
newTmesh.setColorStyle (tm.getColorStyle ());
newTmesh.texture = tm.texture;
newTmesh.transparency = tm.transparency;
newTmesh.uoffset = tm.uoffset;
newTmesh.voffset = tm.voffset;
newTmesh.uscale = tm.uscale;
newTmesh.vscale = tm.vscale;
newTmesh.backface = tm.backface;
newTmesh.visible = tm.visible;
if (tm.spheres != null) {
var tmp =  new astex.util.DynamicArray ();
tmp.add (tm.spheres);
newTmesh.spheres = astex.render.Tmesh.copy (tmp);
}if (tm.cylinders != null) {
var tmp =  new astex.util.DynamicArray ();
tmp.add (tm.cylinders);
newTmesh.cylinders = astex.render.Tmesh.copy (tmp);
}if (tm.lines != null) {
var tmp =  new astex.util.DynamicArray ();
tmp.add (tm.lines);
newTmesh.lines = astex.render.Tmesh.copy (tmp);
}}
return newTmesh;
}, "astex.util.DynamicArray");
Clazz.defineMethod (c$, "getRenderer", 
function () {
return this.moleculeRenderer;
});
Clazz.defineMethod (c$, "setRenderer", 
function (r) {
this.moleculeRenderer = r;
}, "astex.render.MoleculeRenderer");
Clazz.defineMethod (c$, "getRenderPass", 
function () {
return this.renderPass;
});
Clazz.defineMethod (c$, "setRenderPass", 
function (newRenderPass) {
this.renderPass = newRenderPass;
}, "~N");
Clazz.defineMethod (c$, "render", 
function () {
});
Clazz.defineMethod (c$, "copySelf", 
function () {
var tm =  new astex.render.Tmesh ();
tm.np = this.np;
tm.npalloc = this.npalloc;
tm.x =  Clazz.newFloatArray (this.x.length, 0);
tm.y =  Clazz.newFloatArray (this.y.length, 0);
tm.z =  Clazz.newFloatArray (this.z.length, 0);
tm.nx =  Clazz.newFloatArray (this.nx.length, 0);
tm.ny =  Clazz.newFloatArray (this.ny.length, 0);
tm.nz =  Clazz.newFloatArray (this.nz.length, 0);
tm.u =  Clazz.newFloatArray (this.u.length, 0);
tm.v =  Clazz.newFloatArray (this.v.length, 0);
System.arraycopy (this.x, 0, tm.x, 0, this.x.length);
System.arraycopy (this.y, 0, tm.y, 0, this.y.length);
System.arraycopy (this.z, 0, tm.z, 0, this.z.length);
System.arraycopy (this.nx, 0, tm.nx, 0, this.nx.length);
System.arraycopy (this.ny, 0, tm.ny, 0, this.ny.length);
System.arraycopy (this.nz, 0, tm.nz, 0, this.nz.length);
System.arraycopy (this.u, 0, tm.u, 0, this.u.length);
System.arraycopy (this.v, 0, tm.v, 0, this.v.length);
tm.t0 =  Clazz.newIntArray (this.t0.length, 0);
tm.t1 =  Clazz.newIntArray (this.t1.length, 0);
tm.t2 =  Clazz.newIntArray (this.t2.length, 0);
tm.tcolor =  Clazz.newIntArray (this.tcolor.length, 0);
tm.vcolor =  Clazz.newIntArray (this.vcolor.length, 0);
System.arraycopy (this.t0, 0, tm.t0, 0, this.t0.length);
System.arraycopy (this.t1, 0, tm.t1, 0, this.t1.length);
System.arraycopy (this.t2, 0, tm.t2, 0, this.t2.length);
System.arraycopy (this.tcolor, 0, tm.tcolor, 0, this.tcolor.length);
System.arraycopy (this.vcolor, 0, tm.vcolor, 0, this.vcolor.length);
tm.texture = this.texture;
tm.transparency = this.transparency;
tm.textureScalingMode = this.textureScalingMode;
tm.umin = this.umin;
tm.umax = this.umax;
tm.vmin = this.vmin;
tm.vmax = this.vmax;
tm.uoffset = this.uoffset;
tm.uscale = this.uscale;
tm.voffset = this.voffset;
tm.vscale = this.vscale;
tm.spheres = null;
tm.cylinders = null;
tm.lines = null;
tm.nt = this.nt;
tm.ntalloc = this.ntalloc;
tm.style = this.style;
tm.colorStyle = this.colorStyle;
tm.debug = this.debug;
tm.visible = this.visible;
tm.backface = this.backface;
tm.color = this.color;
tm.name = this.name + ".copy";
tm.lineWidth = this.lineWidth;
tm.clipHash =  new java.util.Hashtable (this.clipHash);
tm.ab = astex.util.Point3d.newP (this.ab);
tm.bc = astex.util.Point3d.newP (this.bc);
tm.norm = astex.util.Point3d.newP (this.norm);
tm.origNorm = astex.util.Point3d.newP (this.origNorm);
tm.triangleRef =  Clazz.newIntArray (this.triangleRef.length, 0);
System.arraycopy (this.triangleRef, 0, tm.triangleRef, 0, this.triangleRef.length);
tm.ntriangles =  Clazz.newIntArray (this.ntriangles.length, 0);
System.arraycopy (this.ntriangles, 0, tm.ntriangles, 0, this.ntriangles.length);
tm.keepTriangles =  Clazz.newBooleanArray (this.keepTriangles.length, false);
System.arraycopy (this.keepTriangles, 0, tm.keepTriangles, 0, this.keepTriangles.length);
tm.keepPoints =  Clazz.newBooleanArray (this.keepPoints.length, false);
System.arraycopy (this.keepPoints, 0, tm.keepPoints, 0, this.keepPoints.length);
tm.moleculeRenderer = this.moleculeRenderer;
tm.renderPass = this.renderPass;
return tm;
});
Clazz.defineMethod (c$, "translateCopy", 
function (mtrx, npStart, npEnd, ntStart, ntEnd) {
var newPoints = npEnd - npStart;
var pointsNeeded = this.np + newPoints;
this.ensurePointCapacity (pointsNeeded);
var newTriangles = ntEnd - ntStart;
var trianglesNeeded = this.nt + newTriangles;
this.ensureTriangleCapacity (trianglesNeeded);
System.arraycopy (this.u, npStart, this.u, this.np, newPoints);
System.arraycopy (this.v, npStart, this.v, this.np, newPoints);
System.arraycopy (this.vcolor, npStart, this.vcolor, this.np, newPoints);
if (this.useLabels) System.arraycopy (this.labels, npStart, this.labels, this.np, newPoints);
for (var i = npStart, pos = this.np; i < npEnd; i++, pos++) {
var p = astex.util.Point3d.new3 (this.x[i], this.y[i], this.z[i]);
p.transform (mtrx);
this.x[pos] = p.x;
this.y[pos] = p.y;
this.z[pos] = p.z;
p.set (this.nx[i], this.ny[i], this.nz[i]);
p.transform (mtrx);
this.nx[pos] = p.x;
this.ny[pos] = p.y;
this.nz[pos] = p.z;
}
System.arraycopy (this.tcolor, ntStart, this.tcolor, this.nt, newTriangles);
var offset = this.np - npStart;
for (var i = ntStart, pos = this.nt; i < ntEnd; i++, pos++) {
this.t0[pos] = this.t0[i] + offset;
this.t1[pos] = this.t1[i] + offset;
if (this.t2[i] == -1) {
this.t2[pos] = -1;
} else {
this.t2[pos] = this.t2[i] + offset;
}}
this.np += newPoints;
this.nt += newTriangles;
if (this.cylinders != null) System.out.println ("Copy tmesh: cylinders not empty");
if (this.lines != null) System.out.println ("Copy tmesh: line is not null");
if (this.spheres != null) System.out.println ("Copy tmesh: spheres is not null");
}, "astex.util.Matrix,~N,~N,~N,~N");
Clazz.defineMethod (c$, "transformToScreen", 
function (m, p, sc) {
var xx = this.x[p] * m.x00 + this.y[p] * m.x10 + this.z[p] * m.x20 + m.x30 + 0.5;
var yy = this.x[p] * m.x01 + this.y[p] * m.x11 + this.z[p] * m.x21 + m.x31 + 0.5;
var zz = this.x[p] * m.x02 + this.y[p] * m.x12 + this.z[p] * m.x22 + m.x32;
sc[0] = Clazz.doubleToInt (xx) << 12;
sc[1] = Clazz.doubleToInt (yy) << 12;
sc[2] = Clazz.doubleToInt ((zz) * (1048576));
}, "astex.util.Matrix,~N,~A");
c$.genBackboneLabel = Clazz.defineMethod (c$, "genBackboneLabel", 
function (label) {
var out = "";
var elem = label.$plit (":");
if (elem.length > 0) out += "model: " + elem[0];
if (elem.length > 1) out += " chain: " + elem[1];
if (elem.length > 2) out += " residue id: " + elem[2];
if (elem.length > 3) out += " residue name: " + elem[3];
return out;
}, "~S");
Clazz.defineMethod (c$, "addJack", 
function (p, d, c, str) {
var np = 0;
np = this.addPointNoNorm (p.x, p.y, p.z, c, str);
np = this.addPointNoNorm (p.x - d, p.y, p.z, c, str);
np = this.addPointNoNorm (p.x + d, p.y, p.z, c, str);
this.addLine (np - 1, np, c);
np = this.addPointNoNorm (p.x, p.y - d, p.z, c, str);
np = this.addPointNoNorm (p.x, p.y + d, p.z, c, str);
this.addLine (np - 1, np, c);
np = this.addPointNoNorm (p.x, p.y, p.z - d, c, str);
np = this.addPointNoNorm (p.x, p.y, p.z + d, c, str);
this.addLine (np - 1, np, c);
return np;
}, "astex.util.Point3d,~N,~N,~S");
Clazz.defineStatics (c$,
"OriginalScalingMode", 0,
"MinMaxScalingMode", 1,
"UScale", 1,
"VScale", 2,
"UOffset", 3,
"VOffset", 4,
"UTexture", 1,
"VTexture", 2,
"UpperAllocationLimit", 131072,
"DOTS", 1,
"LINES", 2,
"TRIANGLES", 3,
"CYLINDERS", 4,
"SPHERES", 5,
"ObjectColor", 1,
"TriangleColor", 2,
"VertexColor", 3,
"maxTriangles", 100);
});
