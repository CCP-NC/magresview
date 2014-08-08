Clazz.declarePackage ("astex.shadow");
Clazz.load (null, "astex.shadow.NeighbourGrid", ["astex.util.IntArray"], function () {
c$ = Clazz.decorateAsClass (function () {
this.xmin = 0.0;
this.ymin = 0.0;
this.zmin = 0.0;
this.xmax = 0.0;
this.ymax = 0.0;
this.zmax = 0.0;
this.spacing = 0.0;
this.nx = 0;
this.ny = 0;
this.nz = 0;
this.ncell = 0;
this.list = null;
this.head = null;
Clazz.instantialize (this, arguments);
}, astex.shadow, "NeighbourGrid");
Clazz.makeConstructor (c$, 
function (xmin, ymin, zmin, xmax, ymax, zmax, dmin, sizeHint) {
this.xmin = xmin;
this.ymin = ymin;
this.zmin = zmin;
this.xmax = xmax;
this.ymax = ymax;
this.zmax = zmax;
this.spacing = dmin;
this.nx = 1 + Clazz.doubleToInt ((xmax - xmin) / dmin);
this.ny = 1 + Clazz.doubleToInt ((ymax - ymin) / dmin);
this.nz = 1 + Clazz.doubleToInt ((zmax - zmin) / dmin);
if (this.nx > 64 || this.ny > 64 || this.nz > 64) {
System.out.println ("resetting spacing from " + this.spacing);
var biggest = xmax - xmin;
if (ymax - ymin > biggest) biggest = ymax - ymin;
if (zmax - zmin > biggest) biggest = zmax - zmin;
this.spacing = biggest / (65);
System.out.println ("setting dmin to     " + this.spacing);
System.out.println ("nx = " + this.nx + " ny = " + this.ny + " nz = " + this.nz);
this.nx = 1 + Clazz.doubleToInt ((xmax - xmin) / this.spacing);
this.ny = 1 + Clazz.doubleToInt ((ymax - ymin) / this.spacing);
this.nz = 1 + Clazz.doubleToInt ((zmax - zmin) / this.spacing);
}this.ncell = this.nx * this.ny * this.nz;
if (sizeHint == -1) {
sizeHint = 512;
}this.head =  Clazz.newIntArray (this.ncell, 0);
this.list =  new astex.util.IntArray (sizeHint);
for (var i = 0; i < this.ncell; i++) {
this.head[i] = -1;
}
}, "~N,~N,~N,~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "cellIndex", 
 function (ix, iy, iz, nx, ny, nz) {
return ix + iy * nx + iz * nx * ny;
}, "~N,~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "add", 
function (i, x, y, z) {
if (x < this.xmin || y < this.ymin || z < this.zmin || x > this.xmax || y > this.ymax || z > this.zmax) {
System.out.println ("NeighbourGrid.add(): unable to add " + i + " coordinate outside of box");
return;
}var ix = Clazz.doubleToInt ((x - this.xmin) / this.spacing);
var iy = Clazz.doubleToInt ((y - this.ymin) / this.spacing);
var iz = Clazz.doubleToInt ((z - this.zmin) / this.spacing);
var icell = this.cellIndex (ix, iy, iz, this.nx, this.ny, this.nz);
if (icell < 0 || icell >= this.ncell) {
System.out.println ("invalid cell " + icell + " for object " + i);
return;
}this.list.set (i, this.head[icell]);
this.head[icell] = i;
}, "~N,~N,~N,~N");
Clazz.defineMethod (c$, "getPossibleNeighbours", 
function (id, x, y, z, neighbours, allNeighbours) {
var ibox = (Clazz.doubleToInt ((x - this.xmin) / this.spacing));
var jbox = (Clazz.doubleToInt ((y - this.ymin) / this.spacing));
var kbox = (Clazz.doubleToInt ((z - this.zmin) / this.spacing));
var l = this.list.getArray ();
for (var i = -1; i <= 1; i++) {
var ii = ibox + i;
for (var j = -1; j <= 1; j++) {
var jj = jbox + j;
for (var k = -1; k <= 1; k++) {
var kk = kbox + k;
var c = this.findcell (ii, jj, kk);
if (c != -1) {
var iobj = this.head[c];
if (iobj != -1) {
if (allNeighbours) {
if (id == -1) {
while (iobj >= 0) {
neighbours.add (iobj);
iobj = l[iobj];
}
} else {
while (iobj >= 0) {
if (iobj != id) {
neighbours.add (iobj);
}iobj = l[iobj];
}
}} else {
while (iobj >= 0) {
if (iobj > id) {
neighbours.add (iobj);
}iobj = l[iobj];
}
}}}}
}
}
return neighbours.size ();
}, "~N,~N,~N,~N,astex.util.IntArray,~B");
Clazz.defineMethod (c$, "getCellContents", 
function (icell, c) {
if (icell == -1) {
return 0;
}var j = this.head[icell];
if (j == -1) {
return 0;
}while (j >= 0) {
c.add (this.list.get (j));
j = this.list.get (j);
}
return c.size ();
}, "~N,astex.util.IntArray");
Clazz.defineMethod (c$, "findcell", 
 function (i, j, k) {
if (i < 0 || j < 0 || k < 0) return -1;
if (i >= this.nx || j >= this.ny || k >= this.nz) return -1;
var hashval = this.cellIndex (i, j, k, this.nx, this.ny, this.nz);
return hashval;
}, "~N,~N,~N");
Clazz.defineStatics (c$,
"MaxDim", 64,
"DefaultObjectCount", 512);
});
