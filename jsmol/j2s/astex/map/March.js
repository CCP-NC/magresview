Clazz.declarePackage ("astex.map");
Clazz.load (["astex.api.AstexMarch", "JU.BS"], "astex.map.March", ["astex.util.Log"], function () {
c$ = Clazz.decorateAsClass (function () {
this.tmesh = null;
Clazz.instantialize (this, arguments);
}, astex.map, "March", null, astex.api.AstexMarch);
Clazz.makeConstructor (c$, 
function () {
});
Clazz.defineMethod (c$, "surface", 
function (generateTriangles, dataSet, nx, ny, nz, threshold, invert, tm) {
this.surface (generateTriangles, dataSet, null, null, nx, ny, nz, threshold, invert, tm, 0);
return this.tmesh;
}, "~B,JU.BS,~N,~N,~N,~N,~B,astex.render.Tmesh");
Clazz.defineMethod (c$, "surface", 
function (generateTriangles, data, nx, ny, nz, threshold, invert, tm) {
this.surface (generateTriangles, null, data, null, nx, ny, nz, threshold, invert, tm, 2);
return this.tmesh;
}, "~B,~A,~N,~N,~N,~N,~B,astex.render.Tmesh");
Clazz.defineMethod (c$, "surface", 
function (generateTriangles, dataSet, data, byteArray, nx, ny, nz, threshold, invert, tm, dataMode) {
astex.map.March.generateTriangles = generateTriangles;
var i;
var j;
var k;
var off1;
var then = 0;
if (astex.map.March.debug) {
then = System.currentTimeMillis ();
astex.map.March.count = 0;
}this.tmesh = tm;
astex.map.March.iDim = nx;
astex.map.March.jDim = ny;
astex.map.March.kDim = nz;
astex.map.March.iDim1 = astex.map.March.iDim - 1;
astex.map.March.jDim1 = astex.map.March.jDim - 1;
astex.map.March.kDim1 = astex.map.March.kDim - 1;
astex.map.March.iDim2 = astex.map.March.iDim - 2;
astex.map.March.jDim2 = astex.map.March.jDim - 2;
astex.map.March.kDim2 = astex.map.March.kDim - 2;
astex.map.March.ijDim = astex.map.March.iDim * astex.map.March.jDim;
astex.map.March.nLayerEdges = astex.map.March.iDim1 * astex.map.March.jDim1 * 12;
astex.map.March.layerEdges =  Clazz.newIntArray (astex.map.March.nLayerEdges, 0);
for (i = 0; i < astex.map.March.nLayerEdges; i++) {
astex.map.March.layerEdges[i] = -1;
}
astex.map.March.nedge01 = 12 * astex.map.March.iDim1;
astex.map.March.ngrid01 = astex.map.March.iDim * astex.map.March.jDim;
if (astex.map.March.debug) {
System.out.println ("Beginning marching cubes algorithm");
System.out.println ("Dimensions: x " + astex.map.March.iDim + " y " + astex.map.March.jDim + " z " + astex.map.March.kDim);
}astex.map.March.useMode = dataMode;
switch (astex.map.March.useMode) {
case 0:
astex.map.March.bitSet = dataSet;
System.out.println ("Using bit representation to generate surface.");
break;
case 1:
astex.map.March.localByte = byteArray;
System.out.println ("Using byte representation to generate surface.");
break;
case 2:
break;
}
this.marchLayer (data, nx, ny, nz, 0, astex.map.March.layerEdges, threshold);
for (k = 1; k < astex.map.March.kDim1; k++) {
off1 = astex.map.March.getEdgeOffset (0, 0, 0);
for (j = 0; j < astex.map.March.jDim1; j++) {
for (i = 0; i < astex.map.March.iDim1; i++) {
astex.map.March.layerEdges[off1] = astex.map.March.layerEdges[off1 + 2];
astex.map.March.layerEdges[off1 + 4] = astex.map.March.layerEdges[off1 + 6];
astex.map.March.layerEdges[off1 + 8] = astex.map.March.layerEdges[off1 + 11];
astex.map.March.layerEdges[off1 + 9] = astex.map.March.layerEdges[off1 + 10];
astex.map.March.layerEdges[off1 + 1] = -1;
astex.map.March.layerEdges[off1 + 2] = -1;
astex.map.March.layerEdges[off1 + 3] = -1;
astex.map.March.layerEdges[off1 + 5] = -1;
astex.map.March.layerEdges[off1 + 6] = -1;
astex.map.March.layerEdges[off1 + 7] = -1;
astex.map.March.layerEdges[off1 + 10] = -1;
astex.map.March.layerEdges[off1 + 11] = -1;
off1 += 12;
}
}
this.marchLayer (data, nx, ny, nz, k, astex.map.March.layerEdges, threshold);
}
if (astex.map.March.debug) {
System.out.println ("Threshold: " + threshold);
System.out.println ("Count " + astex.map.March.count);
System.out.println ("Finished marching cubes algorithm");
}if (invert) {
for (var iv = 0; iv < this.tmesh.np; iv++) {
this.tmesh.nx[iv] = -this.tmesh.nx[iv];
this.tmesh.ny[iv] = -this.tmesh.ny[iv];
this.tmesh.nz[iv] = -this.tmesh.nz[iv];
}
}if (astex.map.March.debug) {
var now = System.currentTimeMillis ();
System.out.println ("time " + (now - then) + "ms");
System.out.println ("points " + this.tmesh.np + " lines " + this.tmesh.nt);
}return this.tmesh;
}, "~B,JU.BS,~A,~A,~N,~N,~N,~N,~B,astex.render.Tmesh,~N");
Clazz.defineMethod (c$, "marchLayer", 
 function (data, nx, ny, nz, layer, layerEdges, threshold) {
var i;
var j;
var off;
var e;
var localData = data;
var cellIndex;
for (i = 0; i < 12; i++) {
astex.map.March.cellVerts[i] = -1;
}
var iijDim = astex.map.March.iDim + astex.map.March.ijDim;
for (j = 0; j < astex.map.March.jDim1; j++) {
var cell0 = astex.map.March.getOffset (0, j, layer);
switch (astex.map.March.useMode) {
case 0:
astex.map.March.cell[0] = astex.map.March.getValAsFloat (cell0);
astex.map.March.cell[1] = astex.map.March.getValAsFloat (cell0 + astex.map.March.iDim);
astex.map.March.cell[2] = astex.map.March.getValAsFloat (cell0 + iijDim);
astex.map.March.cell[3] = astex.map.March.getValAsFloat (cell0 + astex.map.March.ijDim);
break;
case 1:
astex.map.March.cell[0] = astex.map.March.localByte[cell0];
astex.map.March.cell[1] = astex.map.March.localByte[cell0 + astex.map.March.iDim];
astex.map.March.cell[2] = astex.map.March.localByte[cell0 + iijDim];
astex.map.March.cell[3] = astex.map.March.localByte[cell0 + astex.map.March.ijDim];
break;
case 2:
astex.map.March.cell[0] = localData[cell0];
astex.map.March.cell[1] = localData[cell0 + astex.map.March.iDim];
astex.map.March.cell[2] = localData[cell0 + iijDim];
astex.map.March.cell[3] = localData[cell0 + astex.map.March.ijDim];
break;
}
cellIndex = 0;
if (astex.map.March.cell[0] > threshold) cellIndex |= 1;
if (astex.map.March.cell[1] > threshold) cellIndex |= 2;
if (astex.map.March.cell[2] > threshold) cellIndex |= 4;
if (astex.map.March.cell[3] > threshold) cellIndex |= 8;
for (i = 0; i < astex.map.March.iDim1; i++) {
cell0++;
switch (astex.map.March.useMode) {
case 0:
astex.map.March.cell[4] = astex.map.March.getValAsFloat (cell0);
astex.map.March.cell[5] = astex.map.March.getValAsFloat (cell0 + astex.map.March.iDim);
astex.map.March.cell[6] = astex.map.March.getValAsFloat (cell0 + iijDim);
astex.map.March.cell[7] = astex.map.March.getValAsFloat (cell0 + astex.map.March.ijDim);
break;
case 1:
astex.map.March.cell[4] = astex.map.March.localByte[cell0];
astex.map.March.cell[5] = astex.map.March.localByte[cell0 + astex.map.March.iDim];
astex.map.March.cell[6] = astex.map.March.localByte[cell0 + iijDim];
astex.map.March.cell[7] = astex.map.March.localByte[cell0 + astex.map.March.ijDim];
break;
case 2:
astex.map.March.cell[4] = localData[cell0];
astex.map.March.cell[5] = localData[cell0 + astex.map.March.iDim];
astex.map.March.cell[6] = localData[cell0 + iijDim];
astex.map.March.cell[7] = localData[cell0 + astex.map.March.ijDim];
break;
}
if (astex.map.March.cell[4] > threshold) cellIndex |= 16;
if (astex.map.March.cell[5] > threshold) cellIndex |= 32;
if (astex.map.March.cell[6] > threshold) cellIndex |= 64;
if (astex.map.March.cell[7] > threshold) cellIndex |= 128;
if (cellIndex != 0 && cellIndex != 255) {
astex.map.March.count++;
var lookup = 1;
for (e = 0; e < 12; e++) {
if ((astex.map.March.edgeTable[cellIndex] & lookup) != 0) {
this.addVertex (data, e, i, j, threshold, astex.map.March.cellVerts, layer);
}lookup <<= 1;
}
off = astex.map.March.getEdgeOffset (0, i, j);
for (e = 0; e < 12; e++) {
if (astex.map.March.cellVerts[e] != -1) {
layerEdges[off] = astex.map.March.cellVerts[e];
}off++;
}
if (i < astex.map.March.iDim2) {
off = astex.map.March.getEdgeOffset (0, i + 1, j);
layerEdges[off] = astex.map.March.cellVerts[4];
layerEdges[off + 1] = astex.map.March.cellVerts[5];
layerEdges[off + 2] = astex.map.March.cellVerts[6];
layerEdges[off + 3] = astex.map.March.cellVerts[7];
}if (j < astex.map.March.jDim2) {
off = astex.map.March.getEdgeOffset (3, i, j + 1);
layerEdges[off] = astex.map.March.cellVerts[1];
layerEdges[off + 5] = astex.map.March.cellVerts[9];
layerEdges[off + 4] = astex.map.March.cellVerts[5];
layerEdges[off + 8] = astex.map.March.cellVerts[10];
}if (astex.map.March.generateTriangles) {
var ii = 0;
while (astex.map.March.triTable[cellIndex][ii] != -1) {
this.tmesh.addTriangle (astex.map.March.cellVerts[astex.map.March.triTable[cellIndex][ii]], astex.map.March.cellVerts[astex.map.March.triTable[cellIndex][ii + 1]], astex.map.March.cellVerts[astex.map.March.triTable[cellIndex][ii + 2]], 0);
ii += 3;
}
} else {
if ((cellIndex & 15) != 0 && (cellIndex & 15) != 15) {
this.contourFace (cellIndex, threshold, 0, 1, 2, 3, 0, 1, 2, 3);
}if ((cellIndex & 51) != 0 && (cellIndex & 51) != 51) {
this.contourFace (cellIndex, threshold, 0, 1, 5, 4, 0, 9, 4, 8);
}if ((cellIndex & 153) != 0 && (cellIndex & 153) != 153) {
this.contourFace (cellIndex, threshold, 0, 3, 7, 4, 3, 11, 7, 8);
}if (i == astex.map.March.iDim2) {
this.contourFace (cellIndex, threshold, 4, 5, 6, 7, 4, 5, 6, 7);
}if (j == astex.map.March.jDim2) {
this.contourFace (cellIndex, threshold, 1, 2, 6, 5, 1, 10, 5, 9);
}if (layer == astex.map.March.kDim2) {
this.contourFace (cellIndex, threshold, 2, 3, 7, 6, 2, 11, 6, 10);
}}}astex.map.March.cell[0] = astex.map.March.cell[4];
astex.map.March.cell[1] = astex.map.March.cell[5];
astex.map.March.cell[2] = astex.map.March.cell[6];
astex.map.March.cell[3] = astex.map.March.cell[7];
cellIndex = (cellIndex >>> 4);
}
}
}, "~A,~N,~N,~N,~N,~A,~N");
Clazz.defineMethod (c$, "contourFace", 
 function (cellIndex, level, v0, v1, v2, v3, e0, e1, e2, e3) {
var faceIndex = 0;
if ((cellIndex & (1 << v0)) != 0) faceIndex |= 1;
if ((cellIndex & (1 << v1)) != 0) faceIndex |= 2;
if ((cellIndex & (1 << v2)) != 0) faceIndex |= 4;
if ((cellIndex & (1 << v3)) != 0) faceIndex |= 8;
switch (faceIndex) {
case 0:
case 15:
break;
case 1:
case 14:
this.tmesh.addLine (astex.map.March.cellVerts[e3], astex.map.March.cellVerts[e0], faceIndex);
break;
case 2:
case 13:
this.tmesh.addLine (astex.map.March.cellVerts[e0], astex.map.March.cellVerts[e1], faceIndex);
break;
case 4:
case 11:
this.tmesh.addLine (astex.map.March.cellVerts[e1], astex.map.March.cellVerts[e2], faceIndex);
break;
case 8:
case 7:
this.tmesh.addLine (astex.map.March.cellVerts[e2], astex.map.March.cellVerts[e3], faceIndex);
break;
case 3:
case 12:
this.tmesh.addLine (astex.map.March.cellVerts[e1], astex.map.March.cellVerts[e3], faceIndex);
break;
case 6:
case 9:
this.tmesh.addLine (astex.map.March.cellVerts[e0], astex.map.March.cellVerts[e2], faceIndex);
break;
case 5:
case 10:
var mean = 0.25 * (astex.map.March.cell[v0] + astex.map.March.cell[v1] + astex.map.March.cell[v2] + astex.map.March.cell[v3]);
if (mean > level == astex.map.March.cell[v0] > level) {
this.tmesh.addLine (astex.map.March.cellVerts[e0], astex.map.March.cellVerts[e1], faceIndex);
this.tmesh.addLine (astex.map.March.cellVerts[e2], astex.map.March.cellVerts[e3], faceIndex);
} else {
this.tmesh.addLine (astex.map.March.cellVerts[e0], astex.map.March.cellVerts[e3], faceIndex);
this.tmesh.addLine (astex.map.March.cellVerts[e1], astex.map.March.cellVerts[e2], faceIndex);
}break;
default:
astex.util.Log.error ("unhandled faceIndex %d", faceIndex);
}
}, "~N,~N,~N,~N,~N,~N,~N,~N,~N,~N");
c$.getOffset = Clazz.defineMethod (c$, "getOffset", 
 function (i, j, k) {
return (i + astex.map.March.iDim * j + astex.map.March.ngrid01 * k);
}, "~N,~N,~N");
Clazz.defineMethod (c$, "addVertex", 
 function (data, edgeNum, i, j, threshold, cellVerts, layer) {
var edgeOffset = astex.map.March.getEdgeOffset (edgeNum, i, j);
if (astex.map.March.layerEdges[edgeOffset] == -1) {
cellVerts[edgeNum] = this.makeVertex (data, edgeNum, i, j, layer, threshold);
} else {
cellVerts[edgeNum] = astex.map.March.layerEdges[edgeOffset];
}}, "~A,~N,~N,~N,~N,~A,~N");
c$.getEdgeOffset = Clazz.defineMethod (c$, "getEdgeOffset", 
 function (edgeNum, i, j) {
var off = edgeNum + (12 * i) + astex.map.March.nedge01 * j;
return (off);
}, "~N,~N,~N");
Clazz.defineMethod (c$, "makeVertex", 
 function (data, edgeNum, i, j, k, threshold) {
var d;
var len;
var localData = data;
switch (edgeNum) {
case 0:
astex.map.March.from[0] = i;
astex.map.March.from[1] = j;
astex.map.March.from[2] = k;
astex.map.March.to[0] = i;
astex.map.March.to[1] = j + 1;
astex.map.March.to[2] = k;
break;
case 1:
astex.map.March.from[0] = i;
astex.map.March.from[1] = j + 1;
astex.map.March.from[2] = k;
astex.map.March.to[0] = i;
astex.map.March.to[1] = j + 1;
astex.map.March.to[2] = k + 1;
break;
case 2:
astex.map.March.from[0] = i;
astex.map.March.from[1] = j + 1;
astex.map.March.from[2] = k + 1;
astex.map.March.to[0] = i;
astex.map.March.to[1] = j;
astex.map.March.to[2] = k + 1;
break;
case 3:
astex.map.March.from[0] = i;
astex.map.March.from[1] = j;
astex.map.March.from[2] = k;
astex.map.March.to[0] = i;
astex.map.March.to[1] = j;
astex.map.March.to[2] = k + 1;
break;
case 4:
astex.map.March.from[0] = i + 1;
astex.map.March.from[1] = j;
astex.map.March.from[2] = k;
astex.map.March.to[0] = i + 1;
astex.map.March.to[1] = j + 1;
astex.map.March.to[2] = k;
break;
case 5:
astex.map.March.from[0] = i + 1;
astex.map.March.from[1] = j + 1;
astex.map.March.from[2] = k;
astex.map.March.to[0] = i + 1;
astex.map.March.to[1] = j + 1;
astex.map.March.to[2] = k + 1;
break;
case 6:
astex.map.March.from[0] = i + 1;
astex.map.March.from[1] = j + 1;
astex.map.March.from[2] = k + 1;
astex.map.March.to[0] = i + 1;
astex.map.March.to[1] = j;
astex.map.March.to[2] = k + 1;
break;
case 7:
astex.map.March.from[0] = i + 1;
astex.map.March.from[1] = j;
astex.map.March.from[2] = k;
astex.map.March.to[0] = i + 1;
astex.map.March.to[1] = j;
astex.map.March.to[2] = k + 1;
break;
case 8:
astex.map.March.from[0] = i;
astex.map.March.from[1] = j;
astex.map.March.from[2] = k;
astex.map.March.to[0] = i + 1;
astex.map.March.to[1] = j;
astex.map.March.to[2] = k;
break;
case 9:
astex.map.March.from[0] = i;
astex.map.March.from[1] = j + 1;
astex.map.March.from[2] = k;
astex.map.March.to[0] = i + 1;
astex.map.March.to[1] = j + 1;
astex.map.March.to[2] = k;
break;
case 10:
astex.map.March.from[0] = i;
astex.map.March.from[1] = j + 1;
astex.map.March.from[2] = k + 1;
astex.map.March.to[0] = i + 1;
astex.map.March.to[1] = j + 1;
astex.map.March.to[2] = k + 1;
break;
case 11:
astex.map.March.from[0] = i;
astex.map.March.from[1] = j;
astex.map.March.from[2] = k + 1;
astex.map.March.to[0] = i + 1;
astex.map.March.to[1] = j;
astex.map.March.to[2] = k + 1;
break;
default:
System.out.println ("makeVertex: bad edge index " + edgeNum);
System.exit (2);
break;
}
var fromLookup = astex.map.March.getOffset (astex.map.March.from[0], astex.map.March.from[1], astex.map.March.from[2]);
var toLookup = astex.map.March.getOffset (astex.map.March.to[0], astex.map.March.to[1], astex.map.March.to[2]);
var fromValue;
var toValue;
switch (astex.map.March.useMode) {
case 0:
fromValue = astex.map.March.getValAsFloat (fromLookup);
toValue = astex.map.March.getValAsFloat (toLookup);
break;
case 1:
fromValue = astex.map.March.localByte[fromLookup];
toValue = astex.map.March.localByte[toLookup];
break;
case 2:
fromValue = localData[fromLookup];
toValue = localData[toLookup];
break;
default:
fromValue = .0;
toValue = .0;
break;
}
d = (fromValue - threshold) / (fromValue - toValue);
if (d < 1.0E-6) {
d = 0.0;
} else if (d > (0.999999)) {
d = 1.0;
}astex.map.March.v[0] = astex.map.March.from[0] + d * (astex.map.March.to[0] - astex.map.March.from[0]);
astex.map.March.v[1] = astex.map.March.from[1] + d * (astex.map.March.to[1] - astex.map.March.from[1]);
astex.map.March.v[2] = astex.map.March.from[2] + d * (astex.map.March.to[2] - astex.map.March.from[2]);
if (astex.map.March.generateTriangles) {
switch (astex.map.March.useMode) {
case 0:
if (astex.map.March.from[0] == 0) {
astex.map.March.normFrom[0] = astex.map.March.bNormEdge (fromLookup, 1, true);
} else if (astex.map.March.from[0] == astex.map.March.iDim1) {
astex.map.March.normFrom[0] = astex.map.March.bNormEdge (fromLookup, 1, false);
} else {
astex.map.March.normFrom[0] = astex.map.March.bInterior (fromLookup, 1);
}if (astex.map.March.from[1] == 0) {
astex.map.March.normFrom[1] = astex.map.March.bNormEdge (fromLookup, astex.map.March.iDim, true);
} else if (astex.map.March.from[1] == astex.map.March.jDim1) {
astex.map.March.normFrom[1] = astex.map.March.bNormEdge (fromLookup, astex.map.March.iDim, false);
} else {
astex.map.March.normFrom[1] = astex.map.March.bInterior (fromLookup, astex.map.March.iDim);
}if (astex.map.March.from[2] == 0) {
astex.map.March.normFrom[2] = astex.map.March.bNormEdge (fromLookup, astex.map.March.ijDim, true);
} else if (astex.map.March.from[2] == astex.map.March.kDim1) {
astex.map.March.normFrom[2] = astex.map.March.bNormEdge (fromLookup, astex.map.March.ijDim, false);
} else {
astex.map.March.normFrom[2] = astex.map.March.bInterior (fromLookup, astex.map.March.ijDim);
}if (astex.map.March.to[0] == 0) {
astex.map.March.normTo[0] = astex.map.March.bNormEdge (toLookup, 1, true);
} else if (astex.map.March.to[0] == astex.map.March.iDim1) {
astex.map.March.normTo[0] = astex.map.March.bNormEdge (toLookup, 1, false);
} else {
astex.map.March.normTo[0] = astex.map.March.bInterior (toLookup, 1);
}if (astex.map.March.to[1] == 0) {
astex.map.March.normTo[1] = astex.map.March.bNormEdge (toLookup, astex.map.March.iDim, true);
} else if (astex.map.March.to[1] == astex.map.March.jDim1) {
astex.map.March.normTo[1] = astex.map.March.bNormEdge (toLookup, astex.map.March.iDim, false);
} else {
astex.map.March.normTo[1] = astex.map.March.bInterior (toLookup, astex.map.March.iDim);
}if (astex.map.March.to[2] == 0) {
astex.map.March.normTo[2] = astex.map.March.bNormEdge (toLookup, astex.map.March.ijDim, true);
} else if (astex.map.March.to[2] == astex.map.March.kDim1) {
astex.map.March.normTo[2] = astex.map.March.bNormEdge (toLookup, astex.map.March.ijDim, false);
} else {
astex.map.March.normTo[2] = astex.map.March.bInterior (toLookup, astex.map.March.ijDim);
}break;
case 1:
if (astex.map.March.from[0] == 0) {
astex.map.March.normFrom[0] = astex.map.March.yNormEdge (fromLookup, 1, true);
} else if (astex.map.March.from[0] == astex.map.March.iDim1) {
astex.map.March.normFrom[0] = astex.map.March.yNormEdge (fromLookup, 1, false);
} else {
astex.map.March.normFrom[0] = astex.map.March.yInterior (fromLookup, 1);
}if (astex.map.March.from[1] == 0) {
astex.map.March.normFrom[1] = astex.map.March.yNormEdge (fromLookup, astex.map.March.iDim, true);
} else if (astex.map.March.from[1] == astex.map.March.jDim1) {
astex.map.March.normFrom[1] = astex.map.March.yNormEdge (fromLookup, astex.map.March.iDim, false);
} else {
astex.map.March.normFrom[1] = astex.map.March.yInterior (fromLookup, astex.map.March.iDim);
}if (astex.map.March.from[2] == 0) {
astex.map.March.normFrom[2] = astex.map.March.yNormEdge (fromLookup, astex.map.March.ijDim, true);
} else if (astex.map.March.from[2] == astex.map.March.kDim1) {
astex.map.March.normFrom[2] = astex.map.March.yNormEdge (fromLookup, astex.map.March.ijDim, false);
} else {
astex.map.March.normFrom[2] = astex.map.March.yInterior (fromLookup, astex.map.March.ijDim);
}if (astex.map.March.to[0] == 0) {
astex.map.March.normTo[0] = astex.map.March.yNormEdge (toLookup, 1, true);
} else if (astex.map.March.to[0] == astex.map.March.iDim1) {
astex.map.March.normTo[0] = astex.map.March.yNormEdge (toLookup, 1, false);
} else {
astex.map.March.normTo[0] = astex.map.March.yInterior (toLookup, 1);
}if (astex.map.March.to[1] == 0) {
astex.map.March.normTo[1] = astex.map.March.yNormEdge (toLookup, astex.map.March.iDim, true);
} else if (astex.map.March.to[1] == astex.map.March.jDim1) {
astex.map.March.normTo[1] = astex.map.March.yNormEdge (toLookup, astex.map.March.iDim, false);
} else {
astex.map.March.normTo[1] = astex.map.March.yInterior (toLookup, astex.map.March.iDim);
}if (astex.map.March.to[2] == 0) {
astex.map.March.normTo[2] = astex.map.March.yNormEdge (toLookup, astex.map.March.ijDim, true);
} else if (astex.map.March.to[2] == astex.map.March.kDim1) {
astex.map.March.normTo[2] = astex.map.March.yNormEdge (toLookup, astex.map.March.ijDim, false);
} else {
astex.map.March.normTo[2] = astex.map.March.yInterior (toLookup, astex.map.March.ijDim);
}break;
case 2:
if (astex.map.March.from[0] == 0) {
astex.map.March.normFrom[0] = 0.5 * (-3.0 * localData[fromLookup] + 4.0 * localData[fromLookup + 1] - localData[fromLookup + 2]);
} else if (astex.map.March.from[0] == astex.map.March.iDim1) {
astex.map.March.normFrom[0] = 0.5 * (localData[fromLookup - 2] - 4.0 * localData[fromLookup - 1] + 3.0 * localData[fromLookup]);
} else {
astex.map.March.normFrom[0] = 0.5 * (localData[fromLookup + 1] - localData[fromLookup - 1]);
}if (astex.map.March.from[1] == 0) {
astex.map.March.normFrom[1] = 0.5 * (-3.0 * localData[fromLookup] + 4.0 * localData[fromLookup + astex.map.March.iDim] - localData[fromLookup + (2 * astex.map.March.iDim)]);
} else if (astex.map.March.from[1] == astex.map.March.jDim1) {
astex.map.March.normFrom[1] = 0.5 * (localData[fromLookup - (2 * astex.map.March.iDim)] - 4.0 * localData[fromLookup - astex.map.March.iDim] + 3.0 * localData[fromLookup]);
} else {
astex.map.March.normFrom[1] = 0.5 * (localData[fromLookup + astex.map.March.iDim] - localData[fromLookup - astex.map.March.iDim]);
}if (astex.map.March.from[2] == 0) {
astex.map.March.normFrom[2] = 0.5 * (-3.0 * localData[fromLookup] + 4.0 * localData[fromLookup + astex.map.March.ijDim] - localData[fromLookup + (2 * astex.map.March.ijDim)]);
} else if (astex.map.March.from[2] == astex.map.March.kDim1) {
astex.map.March.normFrom[2] = 0.5 * (localData[fromLookup - (2 * astex.map.March.ijDim)] - 4.0 * localData[fromLookup - astex.map.March.ijDim] + 3.0 * localData[fromLookup]);
} else {
astex.map.March.normFrom[2] = 0.5 * (localData[fromLookup + astex.map.March.ijDim] - localData[fromLookup - astex.map.March.ijDim]);
}if (astex.map.March.to[0] == 0) {
astex.map.March.normTo[0] = 0.5 * (-3.0 * localData[toLookup] + 4.0 * localData[toLookup + 1] - localData[toLookup + 2]);
} else if (astex.map.March.to[0] == astex.map.March.iDim1) {
astex.map.March.normTo[0] = 0.5 * (localData[toLookup - 1] - 4.0 * localData[toLookup - 1] + 3.0 * localData[toLookup]);
} else {
astex.map.March.normTo[0] = 0.5 * (localData[toLookup + 1] - localData[toLookup - 1]);
}if (astex.map.March.to[1] == 0) {
astex.map.March.normTo[1] = 0.5 * (-3.0 * localData[toLookup] + 4.0 * localData[toLookup + astex.map.March.iDim] - localData[toLookup + (2 * astex.map.March.iDim)]);
} else if (astex.map.March.to[1] == astex.map.March.jDim1) {
astex.map.March.normTo[1] = 0.5 * (localData[toLookup - (2 * astex.map.March.iDim)] - 4.0 * localData[toLookup - astex.map.March.iDim] + 3.0 * localData[toLookup]);
} else {
astex.map.March.normTo[1] = 0.5 * (localData[toLookup + astex.map.March.iDim] - localData[toLookup - astex.map.March.iDim]);
}if (astex.map.March.to[2] == 0) {
astex.map.March.normTo[2] = 0.5 * (-3.0 * localData[toLookup] + 4.0 * localData[toLookup + astex.map.March.ijDim] - localData[toLookup + (2 * astex.map.March.ijDim)]);
} else if (astex.map.March.to[2] == astex.map.March.kDim1) {
astex.map.March.normTo[2] = 0.5 * (localData[toLookup - (2 * astex.map.March.ijDim)] - 4.0 * localData[toLookup - astex.map.March.ijDim] + 3.0 * localData[toLookup]);
} else {
astex.map.March.normTo[2] = 0.5 * (localData[toLookup + astex.map.March.ijDim] - localData[toLookup - astex.map.March.ijDim]);
}break;
}
astex.map.March.n[0] = astex.map.March.normFrom[0] + d * (astex.map.March.normTo[0] - astex.map.March.normFrom[0]);
astex.map.March.n[1] = astex.map.March.normFrom[1] + d * (astex.map.March.normTo[1] - astex.map.March.normFrom[1]);
astex.map.March.n[2] = astex.map.March.normFrom[2] + d * (astex.map.March.normTo[2] - astex.map.March.normFrom[2]);
len = Math.sqrt (astex.map.March.n[0] * astex.map.March.n[0] + astex.map.March.n[1] * astex.map.March.n[1] + astex.map.March.n[2] * astex.map.March.n[2]);
if (len > 1.0E-6) {
astex.map.March.n[0] /= len;
astex.map.March.n[1] /= len;
astex.map.March.n[2] /= len;
} else {
astex.map.March.n[0] = 1.0;
astex.map.March.n[1] = 0.0;
astex.map.March.n[2] = 0.0;
}}this.tmesh.addPointNoColor (astex.map.March.v[0], astex.map.March.v[1], astex.map.March.v[2], -astex.map.March.n[0], -astex.map.March.n[1], -astex.map.March.n[2], 0, 0);
return (this.tmesh.getnPoints () - 1);
}, "~A,~N,~N,~N,~N,~N");
c$.getValAsFloat = Clazz.defineMethod (c$, "getValAsFloat", 
 function (bit) {
return astex.map.March.bitSet.get (bit) ? 1.0 : 0.0;
}, "~N");
c$.bNormEdge = Clazz.defineMethod (c$, "bNormEdge", 
 function (base, adjust, where) {
return (where ? 0.5 * (-3.0 * astex.map.March.getValAsFloat (base) + 4.0 * astex.map.March.getValAsFloat (base + adjust) - astex.map.March.getValAsFloat (base + 2 * adjust)) : 0.5 * (3.0 * astex.map.March.getValAsFloat (base) - 4.0 * astex.map.March.getValAsFloat (base - adjust) + astex.map.March.getValAsFloat (base - 2 * adjust)));
}, "~N,~N,~B");
c$.bInterior = Clazz.defineMethod (c$, "bInterior", 
 function (base, adjust) {
return 0.5 * (astex.map.March.getValAsFloat (base + adjust) - astex.map.March.getValAsFloat (base - adjust));
}, "~N,~N");
c$.yNormEdge = Clazz.defineMethod (c$, "yNormEdge", 
 function (base, adjust, where) {
return (where ? 0.5 * (-3.0 * astex.map.March.localByte[base] + 4.0 * astex.map.March.localByte[base + adjust] - astex.map.March.localByte[base + 2 * adjust]) : 0.5 * (3.0 * astex.map.March.localByte[base] - 4.0 * astex.map.March.localByte[base - adjust] + astex.map.March.localByte[base - 2 * adjust]));
}, "~N,~N,~B");
c$.yInterior = Clazz.defineMethod (c$, "yInterior", 
 function (base, adjust) {
return 0.5 * (astex.map.March.localByte[base + adjust] - astex.map.March.localByte[base - adjust]);
}, "~N,~N");
Clazz.defineStatics (c$,
"nLayerEdges", 0,
"layerEdges", null,
"iDim", 0,
"jDim", 0,
"kDim", 0,
"iDim1", 0,
"jDim1", 0,
"kDim1", 0,
"iDim2", 0,
"jDim2", 0,
"kDim2", 0,
"ijDim", 0,
"debug", false,
"emptyEdge", -1,
"epsilon", 0.000001,
"nedge01", 0,
"ngrid01", 0,
"count", 0,
"generateTriangles", true,
"V0", 1,
"V1", 2,
"V2", 4,
"V3", 8,
"V4", 16,
"V5", 32,
"V7", 128,
"Face0123", 15,
"Face0154", 51,
"Face0374", 153);
c$.bitSet = c$.prototype.bitSet =  new JU.BS ();
Clazz.defineStatics (c$,
"localByte", null,
"USE_BITS", 0,
"USE_BYTES", 1,
"USE_FLOATS", 2,
"useMode", 2,
"cell",  Clazz.newFloatArray (8, 0),
"cellVerts",  Clazz.newIntArray (12, 0),
"from",  Clazz.newIntArray (3, 0),
"to",  Clazz.newIntArray (3, 0),
"normFrom",  Clazz.newFloatArray (3, 0),
"normTo",  Clazz.newFloatArray (3, 0),
"v",  Clazz.newFloatArray (3, 0),
"n",  Clazz.newFloatArray (3, 0),
"edgeTable", [0x0, 0x109, 0x203, 0x30a, 0x406, 0x50f, 0x605, 0x70c, 0x80c, 0x905, 0xa0f, 0xb06, 0xc0a, 0xd03, 0xe09, 0xf00, 0x190, 0x99, 0x393, 0x29a, 0x596, 0x49f, 0x795, 0x69c, 0x99c, 0x895, 0xb9f, 0xa96, 0xd9a, 0xc93, 0xf99, 0xe90, 0x230, 0x339, 0x33, 0x13a, 0x636, 0x73f, 0x435, 0x53c, 0xa3c, 0xb35, 0x83f, 0x936, 0xe3a, 0xf33, 0xc39, 0xd30, 0x3a0, 0x2a9, 0x1a3, 0xaa, 0x7a6, 0x6af, 0x5a5, 0x4ac, 0xbac, 0xaa5, 0x9af, 0x8a6, 0xfaa, 0xea3, 0xda9, 0xca0, 0x460, 0x569, 0x663, 0x76a, 0x66, 0x16f, 0x265, 0x36c, 0xc6c, 0xd65, 0xe6f, 0xf66, 0x86a, 0x963, 0xa69, 0xb60, 0x5f0, 0x4f9, 0x7f3, 0x6fa, 0x1f6, 0xff, 0x3f5, 0x2fc, 0xdfc, 0xcf5, 0xfff, 0xef6, 0x9fa, 0x8f3, 0xbf9, 0xaf0, 0x650, 0x759, 0x453, 0x55a, 0x256, 0x35f, 0x55, 0x15c, 0xe5c, 0xf55, 0xc5f, 0xd56, 0xa5a, 0xb53, 0x859, 0x950, 0x7c0, 0x6c9, 0x5c3, 0x4ca, 0x3c6, 0x2cf, 0x1c5, 0xcc, 0xfcc, 0xec5, 0xdcf, 0xcc6, 0xbca, 0xac3, 0x9c9, 0x8c0, 0x8c0, 0x9c9, 0xac3, 0xbca, 0xcc6, 0xdcf, 0xec5, 0xfcc, 0xcc, 0x1c5, 0x2cf, 0x3c6, 0x4ca, 0x5c3, 0x6c9, 0x7c0, 0x950, 0x859, 0xb53, 0xa5a, 0xd56, 0xc5f, 0xf55, 0xe5c, 0x15c, 0x55, 0x35f, 0x256, 0x55a, 0x453, 0x759, 0x650, 0xaf0, 0xbf9, 0x8f3, 0x9fa, 0xef6, 0xfff, 0xcf5, 0xdfc, 0x2fc, 0x3f5, 0xff, 0x1f6, 0x6fa, 0x7f3, 0x4f9, 0x5f0, 0xb60, 0xa69, 0x963, 0x86a, 0xf66, 0xe6f, 0xd65, 0xc6c, 0x36c, 0x265, 0x16f, 0x66, 0x76a, 0x663, 0x569, 0x460, 0xca0, 0xda9, 0xea3, 0xfaa, 0x8a6, 0x9af, 0xaa5, 0xbac, 0x4ac, 0x5a5, 0x6af, 0x7a6, 0xaa, 0x1a3, 0x2a9, 0x3a0, 0xd30, 0xc39, 0xf33, 0xe3a, 0x936, 0x83f, 0xb35, 0xa3c, 0x53c, 0x435, 0x73f, 0x636, 0x13a, 0x33, 0x339, 0x230, 0xe90, 0xf99, 0xc93, 0xd9a, 0xa96, 0xb9f, 0x895, 0x99c, 0x69c, 0x795, 0x49f, 0x596, 0x29a, 0x393, 0x99, 0x190, 0xf00, 0xe09, 0xd03, 0xc0a, 0xb06, 0xa0f, 0x905, 0x80c, 0x70c, 0x605, 0x50f, 0x406, 0x30a, 0x203, 0x109, 0x0],
"triTable", [[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [0, 8, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [0, 1, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [1, 8, 3, 9, 8, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [1, 2, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [0, 8, 3, 1, 2, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [9, 2, 10, 0, 2, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [2, 8, 3, 2, 10, 8, 10, 9, 8, -1, -1, -1, -1, -1, -1, -1], [3, 11, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [0, 11, 2, 8, 11, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [1, 9, 0, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [1, 11, 2, 1, 9, 11, 9, 8, 11, -1, -1, -1, -1, -1, -1, -1], [3, 10, 1, 11, 10, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [0, 10, 1, 0, 8, 10, 8, 11, 10, -1, -1, -1, -1, -1, -1, -1], [3, 9, 0, 3, 11, 9, 11, 10, 9, -1, -1, -1, -1, -1, -1, -1], [9, 8, 10, 10, 8, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [4, 7, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [4, 3, 0, 7, 3, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [0, 1, 9, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [4, 1, 9, 4, 7, 1, 7, 3, 1, -1, -1, -1, -1, -1, -1, -1], [1, 2, 10, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [3, 4, 7, 3, 0, 4, 1, 2, 10, -1, -1, -1, -1, -1, -1, -1], [9, 2, 10, 9, 0, 2, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1], [2, 10, 9, 2, 9, 7, 2, 7, 3, 7, 9, 4, -1, -1, -1, -1], [8, 4, 7, 3, 11, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [11, 4, 7, 11, 2, 4, 2, 0, 4, -1, -1, -1, -1, -1, -1, -1], [9, 0, 1, 8, 4, 7, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1], [4, 7, 11, 9, 4, 11, 9, 11, 2, 9, 2, 1, -1, -1, -1, -1], [3, 10, 1, 3, 11, 10, 7, 8, 4, -1, -1, -1, -1, -1, -1, -1], [1, 11, 10, 1, 4, 11, 1, 0, 4, 7, 11, 4, -1, -1, -1, -1], [4, 7, 8, 9, 0, 11, 9, 11, 10, 11, 0, 3, -1, -1, -1, -1], [4, 7, 11, 4, 11, 9, 9, 11, 10, -1, -1, -1, -1, -1, -1, -1], [9, 5, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [9, 5, 4, 0, 8, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [0, 5, 4, 1, 5, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [8, 5, 4, 8, 3, 5, 3, 1, 5, -1, -1, -1, -1, -1, -1, -1], [1, 2, 10, 9, 5, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [3, 0, 8, 1, 2, 10, 4, 9, 5, -1, -1, -1, -1, -1, -1, -1], [5, 2, 10, 5, 4, 2, 4, 0, 2, -1, -1, -1, -1, -1, -1, -1], [2, 10, 5, 3, 2, 5, 3, 5, 4, 3, 4, 8, -1, -1, -1, -1], [9, 5, 4, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [0, 11, 2, 0, 8, 11, 4, 9, 5, -1, -1, -1, -1, -1, -1, -1], [0, 5, 4, 0, 1, 5, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1], [2, 1, 5, 2, 5, 8, 2, 8, 11, 4, 8, 5, -1, -1, -1, -1], [10, 3, 11, 10, 1, 3, 9, 5, 4, -1, -1, -1, -1, -1, -1, -1], [4, 9, 5, 0, 8, 1, 8, 10, 1, 8, 11, 10, -1, -1, -1, -1], [5, 4, 0, 5, 0, 11, 5, 11, 10, 11, 0, 3, -1, -1, -1, -1], [5, 4, 8, 5, 8, 10, 10, 8, 11, -1, -1, -1, -1, -1, -1, -1], [9, 7, 8, 5, 7, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [9, 3, 0, 9, 5, 3, 5, 7, 3, -1, -1, -1, -1, -1, -1, -1], [0, 7, 8, 0, 1, 7, 1, 5, 7, -1, -1, -1, -1, -1, -1, -1], [1, 5, 3, 3, 5, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [9, 7, 8, 9, 5, 7, 10, 1, 2, -1, -1, -1, -1, -1, -1, -1], [10, 1, 2, 9, 5, 0, 5, 3, 0, 5, 7, 3, -1, -1, -1, -1], [8, 0, 2, 8, 2, 5, 8, 5, 7, 10, 5, 2, -1, -1, -1, -1], [2, 10, 5, 2, 5, 3, 3, 5, 7, -1, -1, -1, -1, -1, -1, -1], [7, 9, 5, 7, 8, 9, 3, 11, 2, -1, -1, -1, -1, -1, -1, -1], [9, 5, 7, 9, 7, 2, 9, 2, 0, 2, 7, 11, -1, -1, -1, -1], [2, 3, 11, 0, 1, 8, 1, 7, 8, 1, 5, 7, -1, -1, -1, -1], [11, 2, 1, 11, 1, 7, 7, 1, 5, -1, -1, -1, -1, -1, -1, -1], [9, 5, 8, 8, 5, 7, 10, 1, 3, 10, 3, 11, -1, -1, -1, -1], [5, 7, 0, 5, 0, 9, 7, 11, 0, 1, 0, 10, 11, 10, 0, -1], [11, 10, 0, 11, 0, 3, 10, 5, 0, 8, 0, 7, 5, 7, 0, -1], [11, 10, 5, 7, 11, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [10, 6, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [0, 8, 3, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [9, 0, 1, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [1, 8, 3, 1, 9, 8, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1], [1, 6, 5, 2, 6, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [1, 6, 5, 1, 2, 6, 3, 0, 8, -1, -1, -1, -1, -1, -1, -1], [9, 6, 5, 9, 0, 6, 0, 2, 6, -1, -1, -1, -1, -1, -1, -1], [5, 9, 8, 5, 8, 2, 5, 2, 6, 3, 2, 8, -1, -1, -1, -1], [2, 3, 11, 10, 6, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [11, 0, 8, 11, 2, 0, 10, 6, 5, -1, -1, -1, -1, -1, -1, -1], [0, 1, 9, 2, 3, 11, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1], [5, 10, 6, 1, 9, 2, 9, 11, 2, 9, 8, 11, -1, -1, -1, -1], [6, 3, 11, 6, 5, 3, 5, 1, 3, -1, -1, -1, -1, -1, -1, -1], [0, 8, 11, 0, 11, 5, 0, 5, 1, 5, 11, 6, -1, -1, -1, -1], [3, 11, 6, 0, 3, 6, 0, 6, 5, 0, 5, 9, -1, -1, -1, -1], [6, 5, 9, 6, 9, 11, 11, 9, 8, -1, -1, -1, -1, -1, -1, -1], [5, 10, 6, 4, 7, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [4, 3, 0, 4, 7, 3, 6, 5, 10, -1, -1, -1, -1, -1, -1, -1], [1, 9, 0, 5, 10, 6, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1], [10, 6, 5, 1, 9, 7, 1, 7, 3, 7, 9, 4, -1, -1, -1, -1], [6, 1, 2, 6, 5, 1, 4, 7, 8, -1, -1, -1, -1, -1, -1, -1], [1, 2, 5, 5, 2, 6, 3, 0, 4, 3, 4, 7, -1, -1, -1, -1], [8, 4, 7, 9, 0, 5, 0, 6, 5, 0, 2, 6, -1, -1, -1, -1], [7, 3, 9, 7, 9, 4, 3, 2, 9, 5, 9, 6, 2, 6, 9, -1], [3, 11, 2, 7, 8, 4, 10, 6, 5, -1, -1, -1, -1, -1, -1, -1], [5, 10, 6, 4, 7, 2, 4, 2, 0, 2, 7, 11, -1, -1, -1, -1], [0, 1, 9, 4, 7, 8, 2, 3, 11, 5, 10, 6, -1, -1, -1, -1], [9, 2, 1, 9, 11, 2, 9, 4, 11, 7, 11, 4, 5, 10, 6, -1], [8, 4, 7, 3, 11, 5, 3, 5, 1, 5, 11, 6, -1, -1, -1, -1], [5, 1, 11, 5, 11, 6, 1, 0, 11, 7, 11, 4, 0, 4, 11, -1], [0, 5, 9, 0, 6, 5, 0, 3, 6, 11, 6, 3, 8, 4, 7, -1], [6, 5, 9, 6, 9, 11, 4, 7, 9, 7, 11, 9, -1, -1, -1, -1], [10, 4, 9, 6, 4, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [4, 10, 6, 4, 9, 10, 0, 8, 3, -1, -1, -1, -1, -1, -1, -1], [10, 0, 1, 10, 6, 0, 6, 4, 0, -1, -1, -1, -1, -1, -1, -1], [8, 3, 1, 8, 1, 6, 8, 6, 4, 6, 1, 10, -1, -1, -1, -1], [1, 4, 9, 1, 2, 4, 2, 6, 4, -1, -1, -1, -1, -1, -1, -1], [3, 0, 8, 1, 2, 9, 2, 4, 9, 2, 6, 4, -1, -1, -1, -1], [0, 2, 4, 4, 2, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [8, 3, 2, 8, 2, 4, 4, 2, 6, -1, -1, -1, -1, -1, -1, -1], [10, 4, 9, 10, 6, 4, 11, 2, 3, -1, -1, -1, -1, -1, -1, -1], [0, 8, 2, 2, 8, 11, 4, 9, 10, 4, 10, 6, -1, -1, -1, -1], [3, 11, 2, 0, 1, 6, 0, 6, 4, 6, 1, 10, -1, -1, -1, -1], [6, 4, 1, 6, 1, 10, 4, 8, 1, 2, 1, 11, 8, 11, 1, -1], [9, 6, 4, 9, 3, 6, 9, 1, 3, 11, 6, 3, -1, -1, -1, -1], [8, 11, 1, 8, 1, 0, 11, 6, 1, 9, 1, 4, 6, 4, 1, -1], [3, 11, 6, 3, 6, 0, 0, 6, 4, -1, -1, -1, -1, -1, -1, -1], [6, 4, 8, 11, 6, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [7, 10, 6, 7, 8, 10, 8, 9, 10, -1, -1, -1, -1, -1, -1, -1], [0, 7, 3, 0, 10, 7, 0, 9, 10, 6, 7, 10, -1, -1, -1, -1], [10, 6, 7, 1, 10, 7, 1, 7, 8, 1, 8, 0, -1, -1, -1, -1], [10, 6, 7, 10, 7, 1, 1, 7, 3, -1, -1, -1, -1, -1, -1, -1], [1, 2, 6, 1, 6, 8, 1, 8, 9, 8, 6, 7, -1, -1, -1, -1], [2, 6, 9, 2, 9, 1, 6, 7, 9, 0, 9, 3, 7, 3, 9, -1], [7, 8, 0, 7, 0, 6, 6, 0, 2, -1, -1, -1, -1, -1, -1, -1], [7, 3, 2, 6, 7, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [2, 3, 11, 10, 6, 8, 10, 8, 9, 8, 6, 7, -1, -1, -1, -1], [2, 0, 7, 2, 7, 11, 0, 9, 7, 6, 7, 10, 9, 10, 7, -1], [1, 8, 0, 1, 7, 8, 1, 10, 7, 6, 7, 10, 2, 3, 11, -1], [11, 2, 1, 11, 1, 7, 10, 6, 1, 6, 7, 1, -1, -1, -1, -1], [8, 9, 6, 8, 6, 7, 9, 1, 6, 11, 6, 3, 1, 3, 6, -1], [0, 9, 1, 11, 6, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [7, 8, 0, 7, 0, 6, 3, 11, 0, 11, 6, 0, -1, -1, -1, -1], [7, 11, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [7, 6, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [3, 0, 8, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [0, 1, 9, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [8, 1, 9, 8, 3, 1, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1], [10, 1, 2, 6, 11, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [1, 2, 10, 3, 0, 8, 6, 11, 7, -1, -1, -1, -1, -1, -1, -1], [2, 9, 0, 2, 10, 9, 6, 11, 7, -1, -1, -1, -1, -1, -1, -1], [6, 11, 7, 2, 10, 3, 10, 8, 3, 10, 9, 8, -1, -1, -1, -1], [7, 2, 3, 6, 2, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [7, 0, 8, 7, 6, 0, 6, 2, 0, -1, -1, -1, -1, -1, -1, -1], [2, 7, 6, 2, 3, 7, 0, 1, 9, -1, -1, -1, -1, -1, -1, -1], [1, 6, 2, 1, 8, 6, 1, 9, 8, 8, 7, 6, -1, -1, -1, -1], [10, 7, 6, 10, 1, 7, 1, 3, 7, -1, -1, -1, -1, -1, -1, -1], [10, 7, 6, 1, 7, 10, 1, 8, 7, 1, 0, 8, -1, -1, -1, -1], [0, 3, 7, 0, 7, 10, 0, 10, 9, 6, 10, 7, -1, -1, -1, -1], [7, 6, 10, 7, 10, 8, 8, 10, 9, -1, -1, -1, -1, -1, -1, -1], [6, 8, 4, 11, 8, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [3, 6, 11, 3, 0, 6, 0, 4, 6, -1, -1, -1, -1, -1, -1, -1], [8, 6, 11, 8, 4, 6, 9, 0, 1, -1, -1, -1, -1, -1, -1, -1], [9, 4, 6, 9, 6, 3, 9, 3, 1, 11, 3, 6, -1, -1, -1, -1], [6, 8, 4, 6, 11, 8, 2, 10, 1, -1, -1, -1, -1, -1, -1, -1], [1, 2, 10, 3, 0, 11, 0, 6, 11, 0, 4, 6, -1, -1, -1, -1], [4, 11, 8, 4, 6, 11, 0, 2, 9, 2, 10, 9, -1, -1, -1, -1], [10, 9, 3, 10, 3, 2, 9, 4, 3, 11, 3, 6, 4, 6, 3, -1], [8, 2, 3, 8, 4, 2, 4, 6, 2, -1, -1, -1, -1, -1, -1, -1], [0, 4, 2, 4, 6, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [1, 9, 0, 2, 3, 4, 2, 4, 6, 4, 3, 8, -1, -1, -1, -1], [1, 9, 4, 1, 4, 2, 2, 4, 6, -1, -1, -1, -1, -1, -1, -1], [8, 1, 3, 8, 6, 1, 8, 4, 6, 6, 10, 1, -1, -1, -1, -1], [10, 1, 0, 10, 0, 6, 6, 0, 4, -1, -1, -1, -1, -1, -1, -1], [4, 6, 3, 4, 3, 8, 6, 10, 3, 0, 3, 9, 10, 9, 3, -1], [10, 9, 4, 6, 10, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [4, 9, 5, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [0, 8, 3, 4, 9, 5, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1], [5, 0, 1, 5, 4, 0, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1], [11, 7, 6, 8, 3, 4, 3, 5, 4, 3, 1, 5, -1, -1, -1, -1], [9, 5, 4, 10, 1, 2, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1], [6, 11, 7, 1, 2, 10, 0, 8, 3, 4, 9, 5, -1, -1, -1, -1], [7, 6, 11, 5, 4, 10, 4, 2, 10, 4, 0, 2, -1, -1, -1, -1], [3, 4, 8, 3, 5, 4, 3, 2, 5, 10, 5, 2, 11, 7, 6, -1], [7, 2, 3, 7, 6, 2, 5, 4, 9, -1, -1, -1, -1, -1, -1, -1], [9, 5, 4, 0, 8, 6, 0, 6, 2, 6, 8, 7, -1, -1, -1, -1], [3, 6, 2, 3, 7, 6, 1, 5, 0, 5, 4, 0, -1, -1, -1, -1], [6, 2, 8, 6, 8, 7, 2, 1, 8, 4, 8, 5, 1, 5, 8, -1], [9, 5, 4, 10, 1, 6, 1, 7, 6, 1, 3, 7, -1, -1, -1, -1], [1, 6, 10, 1, 7, 6, 1, 0, 7, 8, 7, 0, 9, 5, 4, -1], [4, 0, 10, 4, 10, 5, 0, 3, 10, 6, 10, 7, 3, 7, 10, -1], [7, 6, 10, 7, 10, 8, 5, 4, 10, 4, 8, 10, -1, -1, -1, -1], [6, 9, 5, 6, 11, 9, 11, 8, 9, -1, -1, -1, -1, -1, -1, -1], [3, 6, 11, 0, 6, 3, 0, 5, 6, 0, 9, 5, -1, -1, -1, -1], [0, 11, 8, 0, 5, 11, 0, 1, 5, 5, 6, 11, -1, -1, -1, -1], [6, 11, 3, 6, 3, 5, 5, 3, 1, -1, -1, -1, -1, -1, -1, -1], [1, 2, 10, 9, 5, 11, 9, 11, 8, 11, 5, 6, -1, -1, -1, -1], [0, 11, 3, 0, 6, 11, 0, 9, 6, 5, 6, 9, 1, 2, 10, -1], [11, 8, 5, 11, 5, 6, 8, 0, 5, 10, 5, 2, 0, 2, 5, -1], [6, 11, 3, 6, 3, 5, 2, 10, 3, 10, 5, 3, -1, -1, -1, -1], [5, 8, 9, 5, 2, 8, 5, 6, 2, 3, 8, 2, -1, -1, -1, -1], [9, 5, 6, 9, 6, 0, 0, 6, 2, -1, -1, -1, -1, -1, -1, -1], [1, 5, 8, 1, 8, 0, 5, 6, 8, 3, 8, 2, 6, 2, 8, -1], [1, 5, 6, 2, 1, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [1, 3, 6, 1, 6, 10, 3, 8, 6, 5, 6, 9, 8, 9, 6, -1], [10, 1, 0, 10, 0, 6, 9, 5, 0, 5, 6, 0, -1, -1, -1, -1], [0, 3, 8, 5, 6, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [10, 5, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [11, 5, 10, 7, 5, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [11, 5, 10, 11, 7, 5, 8, 3, 0, -1, -1, -1, -1, -1, -1, -1], [5, 11, 7, 5, 10, 11, 1, 9, 0, -1, -1, -1, -1, -1, -1, -1], [10, 7, 5, 10, 11, 7, 9, 8, 1, 8, 3, 1, -1, -1, -1, -1], [11, 1, 2, 11, 7, 1, 7, 5, 1, -1, -1, -1, -1, -1, -1, -1], [0, 8, 3, 1, 2, 7, 1, 7, 5, 7, 2, 11, -1, -1, -1, -1], [9, 7, 5, 9, 2, 7, 9, 0, 2, 2, 11, 7, -1, -1, -1, -1], [7, 5, 2, 7, 2, 11, 5, 9, 2, 3, 2, 8, 9, 8, 2, -1], [2, 5, 10, 2, 3, 5, 3, 7, 5, -1, -1, -1, -1, -1, -1, -1], [8, 2, 0, 8, 5, 2, 8, 7, 5, 10, 2, 5, -1, -1, -1, -1], [9, 0, 1, 5, 10, 3, 5, 3, 7, 3, 10, 2, -1, -1, -1, -1], [9, 8, 2, 9, 2, 1, 8, 7, 2, 10, 2, 5, 7, 5, 2, -1], [1, 3, 5, 3, 7, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [0, 8, 7, 0, 7, 1, 1, 7, 5, -1, -1, -1, -1, -1, -1, -1], [9, 0, 3, 9, 3, 5, 5, 3, 7, -1, -1, -1, -1, -1, -1, -1], [9, 8, 7, 5, 9, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [5, 8, 4, 5, 10, 8, 10, 11, 8, -1, -1, -1, -1, -1, -1, -1], [5, 0, 4, 5, 11, 0, 5, 10, 11, 11, 3, 0, -1, -1, -1, -1], [0, 1, 9, 8, 4, 10, 8, 10, 11, 10, 4, 5, -1, -1, -1, -1], [10, 11, 4, 10, 4, 5, 11, 3, 4, 9, 4, 1, 3, 1, 4, -1], [2, 5, 1, 2, 8, 5, 2, 11, 8, 4, 5, 8, -1, -1, -1, -1], [0, 4, 11, 0, 11, 3, 4, 5, 11, 2, 11, 1, 5, 1, 11, -1], [0, 2, 5, 0, 5, 9, 2, 11, 5, 4, 5, 8, 11, 8, 5, -1], [9, 4, 5, 2, 11, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [2, 5, 10, 3, 5, 2, 3, 4, 5, 3, 8, 4, -1, -1, -1, -1], [5, 10, 2, 5, 2, 4, 4, 2, 0, -1, -1, -1, -1, -1, -1, -1], [3, 10, 2, 3, 5, 10, 3, 8, 5, 4, 5, 8, 0, 1, 9, -1], [5, 10, 2, 5, 2, 4, 1, 9, 2, 9, 4, 2, -1, -1, -1, -1], [8, 4, 5, 8, 5, 3, 3, 5, 1, -1, -1, -1, -1, -1, -1, -1], [0, 4, 5, 1, 0, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [8, 4, 5, 8, 5, 3, 9, 0, 5, 0, 3, 5, -1, -1, -1, -1], [9, 4, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [4, 11, 7, 4, 9, 11, 9, 10, 11, -1, -1, -1, -1, -1, -1, -1], [0, 8, 3, 4, 9, 7, 9, 11, 7, 9, 10, 11, -1, -1, -1, -1], [1, 10, 11, 1, 11, 4, 1, 4, 0, 7, 4, 11, -1, -1, -1, -1], [3, 1, 4, 3, 4, 8, 1, 10, 4, 7, 4, 11, 10, 11, 4, -1], [4, 11, 7, 9, 11, 4, 9, 2, 11, 9, 1, 2, -1, -1, -1, -1], [9, 7, 4, 9, 11, 7, 9, 1, 11, 2, 11, 1, 0, 8, 3, -1], [11, 7, 4, 11, 4, 2, 2, 4, 0, -1, -1, -1, -1, -1, -1, -1], [11, 7, 4, 11, 4, 2, 8, 3, 4, 3, 2, 4, -1, -1, -1, -1], [2, 9, 10, 2, 7, 9, 2, 3, 7, 7, 4, 9, -1, -1, -1, -1], [9, 10, 7, 9, 7, 4, 10, 2, 7, 8, 7, 0, 2, 0, 7, -1], [3, 7, 10, 3, 10, 2, 7, 4, 10, 1, 10, 0, 4, 0, 10, -1], [1, 10, 2, 8, 7, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [4, 9, 1, 4, 1, 7, 7, 1, 3, -1, -1, -1, -1, -1, -1, -1], [4, 9, 1, 4, 1, 7, 0, 8, 1, 8, 7, 1, -1, -1, -1, -1], [4, 0, 3, 7, 4, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [4, 8, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [9, 10, 8, 10, 11, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [3, 0, 9, 3, 9, 11, 11, 9, 10, -1, -1, -1, -1, -1, -1, -1], [0, 1, 10, 0, 10, 8, 8, 10, 11, -1, -1, -1, -1, -1, -1, -1], [3, 1, 10, 11, 3, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [1, 2, 11, 1, 11, 9, 9, 11, 8, -1, -1, -1, -1, -1, -1, -1], [3, 0, 9, 3, 9, 11, 1, 2, 9, 2, 11, 9, -1, -1, -1, -1], [0, 2, 11, 8, 0, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [3, 2, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [2, 3, 8, 2, 8, 10, 10, 8, 9, -1, -1, -1, -1, -1, -1, -1], [9, 10, 2, 0, 9, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [2, 3, 8, 2, 8, 10, 0, 1, 8, 1, 10, 8, -1, -1, -1, -1], [1, 10, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [1, 3, 8, 9, 1, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [0, 9, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [0, 3, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1], [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]]);
});
