Clazz.declarePackage ("astex.shadow");
Clazz.load (["astex.util.IntArray"], "astex.shadow.NeighbourGrid2D", ["astex.io.FILE"], function () {
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
this.offsets = null;
Clazz.instantialize (this, arguments);
}, astex.shadow, "NeighbourGrid2D");
Clazz.prepareFields (c$, function () {
this.list =  new astex.util.IntArray ();
this.offsets = [[-1, -1, -1], [0, -1, -1], [1, -1, -1], [-1, 0, -1], [0, 0, -1], [1, 0, -1], [-1, 1, -1], [0, 1, -1], [1, 1, -1], [-1, -1, 0], [0, -1, 0], [1, -1, 0], [-1, 0, 0]];
});
Clazz.makeConstructor (c$, 
function () {
});
Clazz.defineMethod (c$, "getSpacing", 
function () {
return this.spacing;
});
Clazz.defineMethod (c$, "reset", 
function (xmin, ymin, xmax, ymax, dmin) {
this.xmin = xmin;
this.ymin = ymin;
this.xmax = xmax;
this.ymax = ymax;
this.spacing = dmin;
this.nx = 1 + Clazz.doubleToInt ((xmax - xmin) / dmin);
this.ny = 1 + Clazz.doubleToInt ((ymax - ymin) / dmin);
if (this.nx > 64 || this.ny > 64) {
var biggest = xmax - xmin;
if (ymax - ymin > biggest) biggest = ymax - ymin;
this.spacing = biggest / (65);
this.nx = 1 + Clazz.doubleToInt ((xmax - xmin) / this.spacing);
this.ny = 1 + Clazz.doubleToInt ((ymax - ymin) / this.spacing);
}this.ncell = this.nx * this.ny;
if (this.head == null || this.head.length < this.ncell) {
this.head =  Clazz.newIntArray (this.ncell, 0);
}for (var i = 0; i < this.ncell; i++) {
this.head[i] = -1;
}
this.list.removeAllElements ();
}, "~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "add", 
function (i, x, y) {
if (x < this.xmin || y < this.ymin || x > this.xmax || y > this.ymax) {
System.out.println ("NeighbourGrid.add(): unable to add " + i + " coordinate outside of box");
astex.io.FILE.out.printFD ("x %8.3f, ", x);
astex.io.FILE.out.printFD ("y %8.3f\n", y);
return;
}var ix = Clazz.doubleToInt ((x - this.xmin) / this.spacing);
var iy = Clazz.doubleToInt ((y - this.ymin) / this.spacing);
var icell = this.findcell (ix, iy);
if (icell < 0 || icell >= this.ncell) {
System.out.println ("invalid cell " + icell + " for object " + i);
return;
}this.list.add (this.head[icell]);
this.head[icell] = i;
}, "~N,~N,~N");
Clazz.defineMethod (c$, "getPossibleNeighbours", 
function (id, x, y, d, neighbours, allNeighbours) {
var ibox = (Clazz.doubleToInt ((x - this.xmin) / this.spacing));
var jbox = (Clazz.doubleToInt ((y - this.ymin) / this.spacing));
var offset = 0 + Clazz.doubleToInt (0.5 + d / this.spacing);
var l = this.list.getArray ();
for (var i = -offset; i <= offset; i++) {
var ii = ibox + i;
for (var j = -offset; j <= offset; j++) {
var jj = jbox + j;
var c = this.findcell (ii, jj);
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
return neighbours.size ();
}, "~N,~N,~N,~N,astex.util.IntArray,~B");
Clazz.defineMethod (c$, "findcell", 
 function (i, j) {
if (i < 0 || j < 0 || i >= this.nx || j >= this.ny) return -1;
return i + j * this.nx;
}, "~N,~N");
Clazz.defineStatics (c$,
"MaxDim", 64,
"DefaultObjectCount", 512);
});
