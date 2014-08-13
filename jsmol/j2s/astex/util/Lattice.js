Clazz.declarePackage ("astex.util");
Clazz.load (["astex.util.IntArray"], "astex.util.Lattice", ["astex.io.FILE", "astex.util.Log"], function () {
c$ = Clazz.decorateAsClass (function () {
this.maxDistance = -1.0;
this.cell1 = null;
this.cell2 = null;
this.hashTable = null;
this.celli = null;
this.cellj = null;
this.cellk = null;
this.head = null;
this.list = null;
this.ids = null;
Clazz.instantialize (this, arguments);
}, astex.util, "Lattice");
Clazz.prepareFields (c$, function () {
this.cell1 =  new astex.util.IntArray ();
this.cell2 =  new astex.util.IntArray ();
this.hashTable =  new Array (4096);
this.celli =  new astex.util.IntArray ();
this.cellj =  new astex.util.IntArray ();
this.cellk =  new astex.util.IntArray ();
this.head =  new astex.util.IntArray ();
this.list =  new astex.util.IntArray ();
this.ids =  new astex.util.IntArray ();
});
Clazz.defineMethod (c$, "setMaximumDistance", 
function (d) {
astex.util.Log.check (d > 0.0, "search distance must be > 0.0");
if (this.maxDistance > 0.0) {
astex.util.Log.error ("can't reset maximum distance");
} else {
this.maxDistance = d;
}}, "~N");
Clazz.defineMethod (c$, "getMaximumDistance", 
function () {
return this.maxDistance;
});
Clazz.defineMethod (c$, "getObjectCount", 
function () {
return this.list.size ();
});
Clazz.makeConstructor (c$, 
function (d) {
this.setMaximumDistance (d);
}, "~N");
Clazz.defineMethod (c$, "getCellCount", 
function () {
return this.celli.size ();
});
Clazz.defineMethod (c$, "add", 
function (id, x, y, z) {
var i = this.BOX (x);
var j = this.BOX (y);
var k = this.BOX (z);
var actualId = this.ids.size ();
this.ids.add (id);
var c = this.findcell (i, j, k);
if (c == -1) {
var hashval = this.HASH (i, j, k);
var cellList = this.hashTable[hashval];
if (cellList == null) {
cellList =  new astex.util.IntArray ();
this.hashTable[hashval] = cellList;
}c = this.celli.size ();
cellList.add (c);
this.head.add (-1);
this.celli.add (i);
this.cellj.add (j);
this.cellk.add (k);
}this.list.add (this.head.get (c));
this.head.set (c, actualId);
}, "~N,~N,~N,~N");
Clazz.defineMethod (c$, "getCellContents", 
function (icell, c) {
if (icell == -1) {
return 0;
}var j = this.head.get (icell);
if (j == -1) {
return 0;
}while (j >= 0) {
c.add (this.ids.get (j));
j = this.list.get (j);
}
return c.size ();
}, "~N,astex.util.IntArray");
Clazz.defineMethod (c$, "findcell", 
 function (i, j, k) {
var hashval = this.HASH (i, j, k);
var cellList = this.hashTable[hashval];
if (cellList != null) {
var ci = this.celli.getArray ();
var cj = this.cellj.getArray ();
var ck = this.cellk.getArray ();
var cl = cellList.getArray ();
var cellEntries = cellList.size ();
for (var c = 0; c < cellEntries; c++) {
var cellIndex = cl[c];
if (ci[cellIndex] == i && cj[cellIndex] == j && ck[cellIndex] == k) {
return cellIndex;
}}
}return -1;
}, "~N,~N,~N");
Clazz.defineMethod (c$, "getPossibleNeighbours", 
function (id, x, y, z, neighbours, allNeighbours) {
var ibox = this.BOX (x);
var jbox = this.BOX (y);
var kbox = this.BOX (z);
var h = this.head.getArray ();
var l = this.list.getArray ();
var idsArray = this.ids.getArray ();
for (var i = -1; i <= 1; i++) {
var ii = ibox + i;
for (var j = -1; j <= 1; j++) {
var jj = jbox + j;
for (var k = -1; k <= 1; k++) {
var kk = kbox + k;
var c = this.findcell (ii, jj, kk);
if (c != -1) {
var iobj = h[c];
if (iobj != -1) {
if (allNeighbours) {
if (id == -2147483648) {
while (iobj >= 0) {
neighbours.add (idsArray[iobj]);
iobj = l[iobj];
}
} else {
while (iobj >= 0) {
if (idsArray[iobj] != id) {
neighbours.add (idsArray[iobj]);
}iobj = l[iobj];
}
}} else {
while (iobj >= 0) {
if (idsArray[iobj] > id) {
neighbours.add (idsArray[iobj]);
}iobj = l[iobj];
}
}}}}
}
}
return neighbours.size ();
}, "~N,~N,~N,~N,astex.util.IntArray,~B");
Clazz.defineMethod (c$, "getPossibleCellNeighbours", 
function (cid, objects) {
this.cell1.removeAllElements ();
this.getCellContents (cid, this.cell1);
var count1 = this.cell1.size ();
var c1 = this.cell1.getArray ();
for (var i = 0; i < count1; i++) {
var oi = c1[i];
for (var j = 0; j < count1; j++) {
if (i != j) {
var oj = c1[j];
if (oi < oj) {
objects.add (oi);
objects.add (oj);
}}}
}
var icell = this.celli.get (cid);
var jcell = this.cellj.get (cid);
var kcell = this.cellk.get (cid);
for (var ioff = 0; ioff < astex.util.Lattice.offsets.length; ioff++) {
var ii = icell + astex.util.Lattice.offsets[ioff][0];
var jj = jcell + astex.util.Lattice.offsets[ioff][1];
var kk = kcell + astex.util.Lattice.offsets[ioff][2];
var c = this.findcell (ii, jj, kk);
if (c != -1) {
this.cell2.removeAllElements ();
this.getCellContents (c, this.cell2);
var count2 = this.cell2.size ();
var c2 = this.cell2.getArray ();
for (var i = 0; i < count1; i++) {
var oi = c1[i];
for (var j = 0; j < count2; j++) {
var oj = c2[j];
objects.add (this.ids.get (oi));
objects.add (this.ids.get (oj));
}
}
}}
return objects.size ();
}, "~N,astex.util.IntArray");
Clazz.defineMethod (c$, "printStatistics", 
function (info) {
var occupiedHashSlots = 0;
var minCells = 2147483647;
var maxCells = -2147483648;
var zeroCells = 0;
for (var i = 0; i < 4096; i++) {
if (this.hashTable[i] != null) {
occupiedHashSlots++;
var cellList = this.hashTable[i];
var cellCount = cellList.size ();
if (cellCount > maxCells) {
maxCells = cellCount;
}if (cellCount < minCells) {
minCells = cellCount;
}} else {
zeroCells++;
}}
astex.io.FILE.out.printFI ("hash table size %5d\n", 4096);
astex.io.FILE.out.printFI ("occupied cells  %5d\n", occupiedHashSlots);
astex.io.FILE.out.printFI ("zero cells      %5d\n", zeroCells);
astex.io.FILE.out.printFI ("max cells/slot  %5d\n", maxCells);
astex.io.FILE.out.printFD ("ave cells/slot  %7.1f\n", this.celli.size () / 4096);
}, "~N");
Clazz.defineMethod (c$, "HASH", 
 function (i, j, k) {
if (i < 0) i = -i;
if (j < 0) j = -j;
if (k < 0) k = -k;
return (i & 15) | ((j & 15) << 4) | ((k & 15) << 8);
}, "~N,~N,~N");
Clazz.defineMethod (c$, "BOX", 
function (x) {
return (x > 0.0 ? Clazz.doubleToInt (x / this.maxDistance) : Clazz.doubleToInt (x / this.maxDistance) - 1);
}, "~N");
Clazz.defineStatics (c$,
"offsets", [[1, -1, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0], [-1, -1, 1], [0, -1, 1], [1, -1, 1], [-1, 0, 1], [0, 0, 1], [1, 0, 1], [-1, 1, 1], [0, 1, 1], [1, 1, 1]],
"HS", 16,
"HS_MASK", 15,
"SHIFT", 4,
"SHIFT2", 8,
"HASHTABLESIZE", 4096,
"Undefined", -2147483648);
});
