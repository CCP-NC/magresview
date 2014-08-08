Clazz.declarePackage ("astex.map");
Clazz.load (["astex.api.AstexSurface", "astex.util.DynamicArray", "$.Point3d"], "astex.map.Surface", ["astex.io.FILE", "astex.map.March", "astex.render.Tmesh", "astex.util.IntArray", "$.Lattice"], function () {
c$ = Clazz.declareType (astex.map, "Surface", null, astex.api.AstexSurface);
c$.debug = Clazz.defineMethod (c$, "debug", 
function (s) {
if (astex.map.Surface.debugFlag) {
System.out.println (s);
}}, "~S");
c$.setDebug = Clazz.defineMethod (c$, "setDebug", 
function (d) {
astex.map.Surface.debugFlag = d;
}, "~B");
Clazz.overrideMethod (c$, "setProbeRadius", 
function (radius) {
astex.map.Surface.rp = radius;
}, "~N");
Clazz.overrideMethod (c$, "setMinimumSpacing", 
function (s) {
astex.map.Surface.minimumSpacing = s;
}, "~N");
c$.setMaximumGridsize = Clazz.defineMethod (c$, "setMaximumGridsize", 
function (gs) {
astex.map.Surface.maximumGridSize = gs;
}, "~N");
Clazz.overrideMethod (c$, "connolly", 
function (atoms, gridSpacing, solid) {
astex.map.Surface.desiredGridSpacing = gridSpacing;
astex.map.Surface.atomCount = atoms.size ();
astex.map.Surface.ax =  Clazz.newDoubleArray (astex.map.Surface.atomCount, 0);
astex.map.Surface.ay =  Clazz.newDoubleArray (astex.map.Surface.atomCount, 0);
astex.map.Surface.az =  Clazz.newDoubleArray (astex.map.Surface.atomCount, 0);
astex.map.Surface.ar =  Clazz.newDoubleArray (astex.map.Surface.atomCount, 0);
astex.map.Surface.ar2 =  Clazz.newDoubleArray (astex.map.Surface.atomCount, 0);
astex.map.Surface.selected =  Clazz.newIntArray (astex.map.Surface.atomCount, 0);
astex.map.Surface.neighbours =  Clazz.newIntArray (astex.map.Surface.atomCount, 0);
var selectionCount = 0;
astex.map.Surface.maxRadius = 0.0;
for (var a = 0; a < astex.map.Surface.atomCount; a++) {
var atom = atoms.get (a);
astex.map.Surface.ar[a] = atom.getVDWRadius () + astex.map.Surface.rp;
if (astex.map.Surface.ar[a] > astex.map.Surface.maxRadius) {
astex.map.Surface.maxRadius = astex.map.Surface.ar[a];
}astex.map.Surface.ar2[a] = astex.map.Surface.ar[a] * astex.map.Surface.ar[a];
astex.map.Surface.ax[a] = atom.getX ();
astex.map.Surface.ay[a] = atom.getY ();
astex.map.Surface.az[a] = atom.getZ ();
if (atom.isSelected ()) {
astex.map.Surface.selected[a] = 1;
selectionCount++;
} else {
astex.map.Surface.selected[a] = 0;
}}
astex.io.FILE.out.printFD ("maximum solvent extended radius %.2f\n", astex.map.Surface.maxRadius);
astex.map.Surface.l =  new astex.util.Lattice (2.01 * astex.map.Surface.maxRadius);
for (var a = 0; a < astex.map.Surface.atomCount; a++) {
astex.map.Surface.l.add (a, astex.map.Surface.ax[a], astex.map.Surface.ay[a], astex.map.Surface.az[a]);
}
if (selectionCount == 0) {
for (var a = 0; a < astex.map.Surface.atomCount; a++) {
astex.map.Surface.selected[a] = 1;
}
selectionCount = astex.map.Surface.atomCount;
}if (selectionCount != astex.map.Surface.atomCount) {
for (var a = 0; a < astex.map.Surface.atomCount; a++) {
if (astex.map.Surface.selected[a] == 0) {
for (var b = 0; b < astex.map.Surface.atomCount; b++) {
if (astex.map.Surface.selected[b] == 1 && astex.map.Surface.distance2 (astex.map.Surface.ax[a], astex.map.Surface.ay[a], astex.map.Surface.az[a], astex.map.Surface.ax[b], astex.map.Surface.ay[b], astex.map.Surface.az[b]) < (astex.map.Surface.ar[a] + astex.map.Surface.ar[b]) * (astex.map.Surface.ar[a] + astex.map.Surface.ar[b])) {
astex.map.Surface.selected[a] = 2;
break;
}}
}}
}astex.map.Surface.initialiseGrid (solid ? astex.map.Surface.minimumSpacing : astex.map.Surface.minimumSpacing * 2.5);
var then;
then = System.currentTimeMillis ();
astex.map.Surface.projectPoints ();
astex.map.Surface.debug ("Point projection " + (System.currentTimeMillis () - then));
then = System.currentTimeMillis ();
astex.map.Surface.projectTorii ();
astex.map.Surface.debug ("Torus projection " + (System.currentTimeMillis () - then));
var gridPointCount = astex.map.Surface.gx * astex.map.Surface.gy * astex.map.Surface.gz;
var gr = astex.map.Surface.grid;
for (var i = 0; i < gridPointCount; i++) {
if (gr[i] < 0.0) {
gr[i] = 0.0;
}}
var surface =  new astex.render.Tmesh ();
if (solid) {
surface.style = 3;
} else {
surface.style = 2;
}then = System.currentTimeMillis ();
 new astex.map.March ().surface (solid, astex.map.Surface.grid, astex.map.Surface.gx, astex.map.Surface.gy, astex.map.Surface.gz, astex.map.Surface.rp, false, surface);
astex.map.Surface.debug ("Contour         " + (System.currentTimeMillis () - then));
var pointCount = surface.np;
for (var i = 0; i < pointCount; i++) {
surface.x[i] *= astex.map.Surface.spacing;
surface.x[i] += astex.map.Surface.gminx;
surface.y[i] *= astex.map.Surface.spacing;
surface.y[i] += astex.map.Surface.gminy;
surface.z[i] *= astex.map.Surface.spacing;
surface.z[i] += astex.map.Surface.gminz;
}
if (selectionCount != astex.map.Surface.atomCount) {
astex.map.Surface.clipSurface (surface, solid);
}if (!solid) {
surface.nx = null;
surface.ny = null;
surface.nz = null;
surface.u = null;
surface.v = null;
}if (solid) {
astex.map.Surface.debug ("points " + surface.np + " triangles " + surface.nt);
}return surface;
}, "astex.util.DynamicArray,~N,~B");
c$.fixNormals = Clazz.defineMethod (c$, "fixNormals", 
function (surface) {
astex.map.Surface.l =  new astex.util.Lattice ((astex.map.Surface.maxRadius - astex.map.Surface.rp) * 1.05);
for (var a = 0; a < astex.map.Surface.atomCount; a++) {
astex.map.Surface.l.add (a, astex.map.Surface.ax[a], astex.map.Surface.ay[a], astex.map.Surface.az[a]);
}
var neighbours =  new astex.util.IntArray ();
var pointCount = surface.np;
for (var p = 0; p < pointCount; p++) {
neighbours.removeAllElements ();
var px = surface.x[p];
var py = surface.y[p];
var pz = surface.z[p];
astex.map.Surface.l.getPossibleNeighbours (-1, px, py, pz, neighbours, true);
var neighbourCount = neighbours.size ();
var total = 0;
for (var n = 0; n < neighbourCount; n++) {
var a = neighbours.get (n);
var d = astex.map.Surface.distance (astex.map.Surface.ax[a], astex.map.Surface.ay[a], astex.map.Surface.az[a], px, py, pz);
if (Math.abs (d - (astex.map.Surface.ar[a] - astex.map.Surface.rp)) < 0.0005) {
total++;
var nx = px - astex.map.Surface.ax[a];
var ny = py - astex.map.Surface.ay[a];
var nz = pz - astex.map.Surface.az[a];
var len = Math.sqrt (nx * nx + ny * ny + nz * nz);
nx /= len;
ny /= len;
nz /= len;
surface.nx[p] = nx;
surface.ny[p] = ny;
surface.nz[p] = nz;
}}
if (total > 1) {
System.out.println ("point " + p + " on surface of " + total + " atoms");
}}
}, "astex.render.Tmesh");
c$.clipSurface = Clazz.defineMethod (c$, "clipSurface", 
function (surface, solid) {
var pointCount = surface.np;
var then = System.currentTimeMillis ();
astex.map.Surface.lastClip = -1;
astex.map.Surface.neighbourCount = 0;
for (var a = 0; a < astex.map.Surface.atomCount; a++) {
if (astex.map.Surface.selected[a] == 1) {
astex.map.Surface.neighbours[astex.map.Surface.neighbourCount++] = a;
}}
if (astex.map.Surface.visible == null || astex.map.Surface.visible.length < pointCount) {
astex.map.Surface.visible =  Clazz.newIntArray (pointCount, 0);
}astex.map.Surface.debug ("before compaction points " + surface.np + " triangles " + surface.nt);
then = System.currentTimeMillis ();
var distanceComparisons = 0;
var aax = astex.map.Surface.ax;
var aay = astex.map.Surface.ay;
var aaz = astex.map.Surface.az;
for (var i = 0; i < pointCount; i++) {
var vis = 0;
var x = surface.x[i];
var y = surface.y[i];
var z = surface.z[i];
if (astex.map.Surface.lastClip != -1) {
distanceComparisons++;
var dx = aax[astex.map.Surface.lastClip] - x;
var dy = aay[astex.map.Surface.lastClip] - y;
var dz = aaz[astex.map.Surface.lastClip] - z;
var d2 = dx * dx + dy * dy + dz * dz;
if (d2 < astex.map.Surface.ar2[astex.map.Surface.lastClip]) {
vis = 1;
} else {
astex.map.Surface.lastClip = -1;
}}if (vis == 0) {
for (var aa = 0; aa < astex.map.Surface.neighbourCount; aa++) {
var a = astex.map.Surface.neighbours[aa];
var dx = aax[a] - x;
var dy = aay[a] - y;
var dz = aaz[a] - z;
var d2 = dx * dx + dy * dy + dz * dz;
distanceComparisons++;
if (d2 < astex.map.Surface.ar2[a]) {
vis = 1;
astex.map.Surface.lastClip = a;
break;
}}
}astex.map.Surface.visible[i] = vis;
}
astex.map.Surface.debug ("distanceComparisons " + distanceComparisons);
astex.map.Surface.debug ("visibility         " + (System.currentTimeMillis () - then));
then = System.currentTimeMillis ();
var newLines = 0;
if (solid) {
for (var i = 0; i < surface.nt; i++) {
var v0 = surface.t0[i];
var v1 = surface.t1[i];
var v2 = surface.t2[i];
if (astex.map.Surface.visible[v0] == 1 && astex.map.Surface.visible[v1] == 1 && astex.map.Surface.visible[v2] == 1) {
surface.t0[newLines] = v0;
surface.t1[newLines] = v1;
surface.t2[newLines] = v2;
surface.tcolor[newLines] = surface.tcolor[i];
newLines++;
}}
} else {
for (var i = 0; i < surface.nt; i++) {
var v0 = surface.t0[i];
var v1 = surface.t1[i];
if (astex.map.Surface.visible[v0] == 1 && astex.map.Surface.visible[v1] == 1) {
surface.t0[newLines] = v0;
surface.t1[newLines] = v1;
surface.tcolor[newLines] = surface.tcolor[i];
newLines++;
}}
}astex.map.Surface.debug ("line compaction         " + (System.currentTimeMillis () - then));
surface.nt = newLines;
var newPoints = 0;
if (astex.map.Surface.reordered == null || astex.map.Surface.reordered.length < pointCount) {
astex.map.Surface.reordered =  Clazz.newIntArray (pointCount, 0);
}then = System.currentTimeMillis ();
for (var i = 0; i < surface.np; i++) {
if (astex.map.Surface.visible[i] == 1) {
surface.x[newPoints] = surface.x[i];
surface.y[newPoints] = surface.y[i];
surface.z[newPoints] = surface.z[i];
if (solid) {
surface.nx[newPoints] = surface.nx[i];
surface.ny[newPoints] = surface.ny[i];
surface.nz[newPoints] = surface.nz[i];
}surface.vcolor[newPoints] = surface.vcolor[i];
astex.map.Surface.reordered[i] = newPoints;
newPoints++;
}}
System.out.println ("newPoints " + newPoints);
surface.np = newPoints;
for (var i = 0; i < surface.nt; i++) {
surface.t0[i] = astex.map.Surface.reordered[surface.t0[i]];
surface.t1[i] = astex.map.Surface.reordered[surface.t1[i]];
if (solid) {
surface.t2[i] = astex.map.Surface.reordered[surface.t2[i]];
}}
astex.map.Surface.debug ("point compaction         " + (System.currentTimeMillis () - then));
}, "astex.render.Tmesh,~B");
c$.projectPoints = Clazz.defineMethod (c$, "projectPoints", 
function () {
var gr = astex.map.Surface.grid;
var possibleNeighbours =  new astex.util.IntArray ();
for (var a = 0; a < astex.map.Surface.atomCount; a++) {
var ra = astex.map.Surface.ar[a];
var r2 = ra * ra;
var aax = astex.map.Surface.ax[a];
var aay = astex.map.Surface.ay[a];
var aaz = astex.map.Surface.az[a];
astex.map.Surface.neighbourCount = 0;
if (astex.map.Surface.selected[a] > 0) {
possibleNeighbours.removeAllElements ();
astex.map.Surface.l.getPossibleNeighbours (a, aax, aay, aaz, possibleNeighbours, true);
var possibleNeighbourCount = possibleNeighbours.size ();
for (var p = 0; p < possibleNeighbourCount; p++) {
var b = possibleNeighbours.get (p);
var rb = astex.map.Surface.ar[b];
if (astex.map.Surface.distance2 (aax, aay, aaz, astex.map.Surface.ax[b], astex.map.Surface.ay[b], astex.map.Surface.az[b]) < (ra + rb) * (ra + rb)) {
astex.map.Surface.neighbours[astex.map.Surface.neighbourCount++] = b;
}}
var ng = 1 + Clazz.doubleToInt (ra / astex.map.Surface.spacing);
var iax = Clazz.doubleToInt (0.5 + ((aax - astex.map.Surface.gminx) / astex.map.Surface.spacing));
var iay = Clazz.doubleToInt (0.5 + ((aay - astex.map.Surface.gminy) / astex.map.Surface.spacing));
var iaz = Clazz.doubleToInt (0.5 + ((aaz - astex.map.Surface.gminz) / astex.map.Surface.spacing));
var minx = iax - ng;
if (minx < 0) minx = 0;
var maxx = iax + ng;
if (maxx > astex.map.Surface.gx) maxx = astex.map.Surface.gx;
var miny = iay - ng;
if (miny < 0) miny = 0;
var maxy = iay + ng;
if (maxy > astex.map.Surface.gy) maxy = astex.map.Surface.gy;
var minz = iaz - ng;
if (minz < 0) minz = 0;
var maxz = iaz + ng;
if (maxz > astex.map.Surface.gz) maxz = astex.map.Surface.gz;
astex.map.Surface.lastClip = -1;
for (var iz = minz; iz < maxz; iz++) {
var dz = astex.map.Surface.gridz[iz] - aaz;
var zoffset = astex.map.Surface.gx * astex.map.Surface.gy * iz;
for (var iy = miny; iy < maxy; iy++) {
var dy = astex.map.Surface.gridy[iy] - aay;
var dzy2 = dz * dz + dy * dy;
var yzoffset = zoffset + astex.map.Surface.gx * iy;
for (var ix = minx; ix < maxx; ix++) {
var dx = astex.map.Surface.gridx[ix] - aax;
var d2 = dzy2 + dx * dx;
if (d2 < r2) {
var idx = ix + yzoffset;
var current = gr[idx];
if (current < 0.0) {
current = -current;
gr[idx] = current;
}var d = Math.sqrt (d2);
var ap = ra / d;
var spx = dx * ap;
var spy = dy * ap;
var spz = dz * ap;
spx += aax;
spy += aay;
spz += aaz;
if (astex.map.Surface.obscured (spx, spy, spz, a, -1) == -1) {
var dd = ra - d;
if (dd < current) {
gr[idx] = dd;
}}}}
}
}
}}
});
c$.projectTorii = Clazz.defineMethod (c$, "projectTorii", 
function () {
var possibleNeighbours =  new astex.util.IntArray ();
for (var a = 0; a < astex.map.Surface.atomCount; a++) {
var r1 = astex.map.Surface.ar[a];
var aax = astex.map.Surface.ax[a];
var aay = astex.map.Surface.ay[a];
var aaz = astex.map.Surface.az[a];
astex.map.Surface.neighbourCount = 0;
if (astex.map.Surface.selected[a] > 0) {
possibleNeighbours.removeAllElements ();
astex.map.Surface.l.getPossibleNeighbours (a, aax, aay, aaz, possibleNeighbours, true);
var possibleNeighbourCount = possibleNeighbours.size ();
for (var p = 0; p < possibleNeighbourCount; p++) {
var b = possibleNeighbours.get (p);
if (astex.map.Surface.selected[b] > 0 && a != b) {
var r12 = r1 + astex.map.Surface.ar[b];
var dx = aax - astex.map.Surface.ax[b];
var dy = aay - astex.map.Surface.ay[b];
var dz = aaz - astex.map.Surface.az[b];
if ((dx * dx + dy * dy + dz * dz) < r12 * r12) {
astex.map.Surface.neighbours[astex.map.Surface.neighbourCount++] = b;
}}}
for (var b = 0; b < astex.map.Surface.neighbourCount; b++) {
if (a < astex.map.Surface.neighbours[b]) {
astex.map.Surface.projectTorus (a, astex.map.Surface.neighbours[b]);
}}
}}
});
c$.projectTorus = Clazz.defineMethod (c$, "projectTorus", 
function (a, b) {
var r1 = astex.map.Surface.ar[a];
var r2 = astex.map.Surface.ar[b];
var dx = astex.map.Surface.ax[b] - astex.map.Surface.ax[a];
var dy = astex.map.Surface.ay[b] - astex.map.Surface.ay[a];
var dz = astex.map.Surface.az[b] - astex.map.Surface.az[a];
var d = Math.sqrt (dx * dx + dy * dy + dz * dz);
var cosA = (r1 * r1 + d * d - r2 * r2) / (2.0 * r1 * d);
var dmp = r1 * cosA;
var gr = astex.map.Surface.grid;
astex.map.Surface.atom1.set (astex.map.Surface.ax[a], astex.map.Surface.ay[a], astex.map.Surface.az[a]);
astex.map.Surface.atom2.set (astex.map.Surface.ax[b], astex.map.Surface.ay[b], astex.map.Surface.az[b]);
astex.util.Point3d.unitVectorP3 (astex.map.Surface.mid, astex.map.Surface.atom1, astex.map.Surface.atom2);
astex.util.Point3d.normalToLine (astex.map.Surface.mid, astex.map.Surface.n1);
astex.util.Point3d.crossPts (astex.map.Surface.n2, astex.map.Surface.mid, astex.map.Surface.n1);
var r = Math.sqrt (r1 * r1 - dmp * dmp);
astex.map.Surface.n1.scale (r);
astex.map.Surface.n2.scale (r);
astex.map.Surface.mid.scale (dmp);
astex.map.Surface.mid.add (astex.map.Surface.atom1);
var step = 6.283185307179586 / astex.map.Surface.np;
var theta = 0.0;
if (astex.map.Surface.cosTable == null) {
astex.map.Surface.cosTable =  Clazz.newDoubleArray (astex.map.Surface.np, 0);
astex.map.Surface.sinTable =  Clazz.newDoubleArray (astex.map.Surface.np, 0);
for (var j = 0; j < astex.map.Surface.np; j++) {
astex.map.Surface.cosTable[j] = Math.cos (theta);
astex.map.Surface.sinTable[j] = Math.sin (theta);
theta += step;
}
}astex.map.Surface.lastClip = -1;
for (var i = 0; i < astex.map.Surface.np; i++) {
var cost = astex.map.Surface.cosTable[i];
var sint = astex.map.Surface.sinTable[i];
var px = astex.map.Surface.mid.x + cost * astex.map.Surface.n1.x + sint * astex.map.Surface.n2.x;
var py = astex.map.Surface.mid.y + cost * astex.map.Surface.n1.y + sint * astex.map.Surface.n2.y;
var pz = astex.map.Surface.mid.z + cost * astex.map.Surface.n1.z + sint * astex.map.Surface.n2.z;
if (astex.map.Surface.obscured (px, py, pz, a, b) == -1) {
var ng = 4 + Clazz.doubleToInt ((astex.map.Surface.rp / astex.map.Surface.spacing));
var iax = Clazz.doubleToInt (0.5 + ((px - astex.map.Surface.gminx) / astex.map.Surface.spacing));
var iay = Clazz.doubleToInt (0.5 + ((py - astex.map.Surface.gminy) / astex.map.Surface.spacing));
var iaz = Clazz.doubleToInt (0.5 + ((pz - astex.map.Surface.gminz) / astex.map.Surface.spacing));
var minx = iax - ng;
if (minx < 0) minx = 0;
var maxx = iax + ng;
if (maxx > astex.map.Surface.gx) maxx = astex.map.Surface.gx;
var miny = iay - ng;
if (miny < 0) miny = 0;
var maxy = iay + ng;
if (maxy > astex.map.Surface.gy) maxy = astex.map.Surface.gy;
var minz = iaz - ng;
if (minz < 0) minz = 0;
var maxz = iaz + ng;
if (maxz > astex.map.Surface.gz) maxz = astex.map.Surface.gz;
for (var iz = minz; iz < maxz; iz++) {
var zoffset = astex.map.Surface.gx * astex.map.Surface.gy * iz;
dz = pz - astex.map.Surface.gridz[iz];
for (var iy = miny; iy < maxy; iy++) {
var yzoffset = zoffset + astex.map.Surface.gx * iy;
dy = py - astex.map.Surface.gridy[iy];
var dzy2 = dz * dz + dy * dy;
for (var ix = minx; ix < maxx; ix++) {
dx = px - astex.map.Surface.gridx[ix];
var d2 = dzy2 + dx * dx;
var idx = ix + yzoffset;
var current = gr[idx];
if (current > 0.0 && d2 < (current * current)) {
gr[idx] = Math.sqrt (d2);
}}
}
}
}}
}, "~N,~N");
c$.distance = Clazz.defineMethod (c$, "distance", 
function (xa, ya, za, xb, yb, zb) {
var dx = xa - xb;
var dy = ya - yb;
var dz = za - zb;
return Math.sqrt (dx * dx + dy * dy + dz * dz);
}, "~N,~N,~N,~N,~N,~N");
c$.distance2 = Clazz.defineMethod (c$, "distance2", 
function (xa, ya, za, xb, yb, zb) {
var dx = xa - xb;
var dy = ya - yb;
var dz = za - zb;
return (dx * dx + dy * dy + dz * dz);
}, "~N,~N,~N,~N,~N,~N");
c$.obscured = Clazz.defineMethod (c$, "obscured", 
function (x, y, z, a, b) {
if (astex.map.Surface.lastClip != -1) {
var dx = astex.map.Surface.ax[astex.map.Surface.lastClip] - x;
var dy = astex.map.Surface.ay[astex.map.Surface.lastClip] - y;
var dz = astex.map.Surface.az[astex.map.Surface.lastClip] - z;
var d2 = dx * dx + dy * dy + dz * dz;
if (d2 < astex.map.Surface.ar2[astex.map.Surface.lastClip] && astex.map.Surface.lastClip != a && astex.map.Surface.lastClip != b) {
return astex.map.Surface.lastClip;
}astex.map.Surface.lastClip = -1;
}for (var ia = 0; ia < astex.map.Surface.neighbourCount; ia++) {
var i = astex.map.Surface.neighbours[ia];
var dx = astex.map.Surface.ax[i] - x;
var dy = astex.map.Surface.ay[i] - y;
var dz = astex.map.Surface.az[i] - z;
var d2 = dx * dx + dy * dy + dz * dz;
if (d2 < astex.map.Surface.ar2[i] && i != a && i != b) {
astex.map.Surface.lastClip = i;
return astex.map.Surface.lastClip;
}}
astex.map.Surface.lastClip = -1;
return astex.map.Surface.lastClip;
}, "~N,~N,~N,~N,~N");
c$.initialiseGrid = Clazz.defineMethod (c$, "initialiseGrid", 
function (minSpacing) {
astex.map.Surface.gminx = astex.map.Surface.gminy = astex.map.Surface.gminz = 1.e10;
astex.map.Surface.gmaxx = astex.map.Surface.gmaxy = astex.map.Surface.gmaxz = -1.0E10;
for (var a = 0; a < astex.map.Surface.atomCount; a++) {
if (astex.map.Surface.selected[a] == 1) {
if (astex.map.Surface.ax[a] - astex.map.Surface.ar[a] < astex.map.Surface.gminx) astex.map.Surface.gminx = astex.map.Surface.ax[a] - astex.map.Surface.ar[a];
if (astex.map.Surface.ay[a] - astex.map.Surface.ar[a] < astex.map.Surface.gminy) astex.map.Surface.gminy = astex.map.Surface.ay[a] - astex.map.Surface.ar[a];
if (astex.map.Surface.az[a] - astex.map.Surface.ar[a] < astex.map.Surface.gminz) astex.map.Surface.gminz = astex.map.Surface.az[a] - astex.map.Surface.ar[a];
if (astex.map.Surface.ax[a] + astex.map.Surface.ar[a] > astex.map.Surface.gmaxx) astex.map.Surface.gmaxx = astex.map.Surface.ax[a] + astex.map.Surface.ar[a];
if (astex.map.Surface.ay[a] + astex.map.Surface.ar[a] > astex.map.Surface.gmaxy) astex.map.Surface.gmaxy = astex.map.Surface.ay[a] + astex.map.Surface.ar[a];
if (astex.map.Surface.az[a] + astex.map.Surface.ar[a] > astex.map.Surface.gmaxz) astex.map.Surface.gmaxz = astex.map.Surface.az[a] + astex.map.Surface.ar[a];
}}
var gridBorder = 0.2;
astex.map.Surface.gminx -= gridBorder;
astex.map.Surface.gminy -= gridBorder;
astex.map.Surface.gminz -= gridBorder;
astex.map.Surface.gmaxx += gridBorder;
astex.map.Surface.gmaxy += gridBorder;
astex.map.Surface.gmaxz += gridBorder;
astex.map.Surface.debug ("min " + astex.map.Surface.gminx + " " + astex.map.Surface.gminy + " " + astex.map.Surface.gminz);
astex.map.Surface.debug ("max " + astex.map.Surface.gmaxx + " " + astex.map.Surface.gmaxy + " " + astex.map.Surface.gmaxz);
var maxe = astex.map.Surface.gmaxx - astex.map.Surface.gminx;
if (astex.map.Surface.gmaxy - astex.map.Surface.gminy > maxe) maxe = astex.map.Surface.gmaxy - astex.map.Surface.gminy;
if (astex.map.Surface.gmaxz - astex.map.Surface.gminz > maxe) maxe = astex.map.Surface.gmaxz - astex.map.Surface.gminz;
var biggestGrid = Clazz.doubleToInt (maxe / astex.map.Surface.desiredGridSpacing);
if (biggestGrid > astex.map.Surface.maximumGridSize) {
biggestGrid = astex.map.Surface.maximumGridSize;
astex.map.Surface.spacing = maxe / biggestGrid;
} else {
astex.map.Surface.spacing = astex.map.Surface.desiredGridSpacing;
}if (astex.map.Surface.spacing < minSpacing) {
astex.map.Surface.spacing = minSpacing;
}astex.map.Surface.debug ("spacing " + astex.map.Surface.spacing);
astex.map.Surface.gx = 1 + Clazz.doubleToInt ((astex.map.Surface.gmaxx - astex.map.Surface.gminx) / astex.map.Surface.spacing);
astex.map.Surface.gy = 1 + Clazz.doubleToInt ((astex.map.Surface.gmaxy - astex.map.Surface.gminy) / astex.map.Surface.spacing);
astex.map.Surface.gz = 1 + Clazz.doubleToInt ((astex.map.Surface.gmaxz - astex.map.Surface.gminz) / astex.map.Surface.spacing);
astex.map.Surface.debug ("gx " + astex.map.Surface.gx + " gy " + astex.map.Surface.gy + " gz " + astex.map.Surface.gz);
var gridPointCount = astex.map.Surface.gx * astex.map.Surface.gy * astex.map.Surface.gz;
astex.map.Surface.grid =  Clazz.newFloatArray (gridPointCount, 0);
var gr = astex.map.Surface.grid;
for (var i = 0; i < gridPointCount; i++) {
gr[i] = -1001.0;
}
astex.map.Surface.gridx =  Clazz.newDoubleArray (astex.map.Surface.gx, 0);
astex.map.Surface.gridy =  Clazz.newDoubleArray (astex.map.Surface.gy, 0);
astex.map.Surface.gridz =  Clazz.newDoubleArray (astex.map.Surface.gz, 0);
for (var i = 0; i < astex.map.Surface.gx; i++) astex.map.Surface.gridx[i] = astex.map.Surface.gminx + i * astex.map.Surface.spacing;

for (var i = 0; i < astex.map.Surface.gy; i++) astex.map.Surface.gridy[i] = astex.map.Surface.gminy + i * astex.map.Surface.spacing;

for (var i = 0; i < astex.map.Surface.gz; i++) astex.map.Surface.gridz[i] = astex.map.Surface.gminz + i * astex.map.Surface.spacing;

}, "~N");
c$.addSpherePoint = Clazz.defineMethod (c$, "addSpherePoint", 
 function (p) {
astex.map.Surface.dots.add (astex.util.Point3d.newP (p));
}, "astex.util.Point3d");
c$.addTriangle = Clazz.defineMethod (c$, "addTriangle", 
 function (i, j, k) {
var tri =  Clazz.newIntArray (3, 0);
tri[0] = i;
tri[1] = j;
tri[2] = k;
astex.map.Surface.triangles.add (tri);
}, "~N,~N,~N");
c$.findSpherePoint = Clazz.defineMethod (c$, "findSpherePoint", 
 function (a, b) {
var mid = astex.util.Point3d.mid (a, b);
var len = mid.length ();
mid.scale (1. / len);
var dotCount = astex.map.Surface.dots.size ();
for (var d = 0; d < dotCount; d++) {
var p = astex.map.Surface.dots.get (d);
if (p.distanceSq (mid) < 0.0001) {
return d;
}}
astex.map.Surface.dots.add (mid);
return astex.map.Surface.dots.size () - 1;
}, "astex.util.Point3d,astex.util.Point3d");
c$.sphereGen = Clazz.defineMethod (c$, "sphereGen", 
function (subDivisions) {
astex.map.Surface.dots.removeAllElements ();
astex.map.Surface.triangles.removeAllElements ();
astex.map.Surface.addSpherePoint (astex.util.Point3d.new3 (1.0, 0.0, 0.0));
astex.map.Surface.addSpherePoint (astex.util.Point3d.new3 (0.0, 1.0, 0.0));
astex.map.Surface.addSpherePoint (astex.util.Point3d.new3 (0.0, 0.0, 1.0));
astex.map.Surface.addSpherePoint (astex.util.Point3d.new3 (-1.0, 0.0, 0.0));
astex.map.Surface.addSpherePoint (astex.util.Point3d.new3 (0.0, -1.0, 0.0));
astex.map.Surface.addSpherePoint (astex.util.Point3d.new3 (0.0, 0.0, -1.0));
astex.map.Surface.addTriangle (0, 1, 2);
astex.map.Surface.addTriangle (0, 1, 5);
astex.map.Surface.addTriangle (0, 2, 4);
astex.map.Surface.addTriangle (0, 4, 5);
astex.map.Surface.addTriangle (1, 2, 3);
astex.map.Surface.addTriangle (1, 3, 5);
astex.map.Surface.addTriangle (2, 3, 4);
astex.map.Surface.addTriangle (3, 4, 5);
var firstTriangle = 0;
for (var sub = 0; sub < subDivisions; sub++) {
var triCount = astex.map.Surface.triangles.size ();
for (var t = firstTriangle; t < triCount; t++) {
var tri = astex.map.Surface.triangles.get (t);
var v0 = astex.map.Surface.dots.get (tri[0]);
var v1 = astex.map.Surface.dots.get (tri[1]);
var v2 = astex.map.Surface.dots.get (tri[2]);
var mid01 = astex.map.Surface.findSpherePoint (v0, v1);
var mid12 = astex.map.Surface.findSpherePoint (v1, v2);
var mid20 = astex.map.Surface.findSpherePoint (v2, v0);
astex.map.Surface.addTriangle (mid01, mid12, mid20);
astex.map.Surface.addTriangle (tri[0], mid01, mid20);
astex.map.Surface.addTriangle (tri[1], mid01, mid12);
astex.map.Surface.addTriangle (tri[2], mid12, mid20);
}
firstTriangle = triCount;
}
}, "~N");
Clazz.overrideMethod (c$, "dotSurface", 
function (selectedAtoms, subDivisions) {
astex.map.Surface.sphereGen (subDivisions);
var dotCount = astex.map.Surface.dots.size ();
var dot =  new astex.util.Point3d ();
var ds =  new astex.render.Tmesh ();
ds.style = 1;
var atomCount = selectedAtoms.size ();
astex.map.Surface.neighbours =  Clazz.newIntArray (atomCount, 0);
for (var a = 0; a < atomCount; a++) {
var atom = selectedAtoms.get (a);
var ra = atom.getVDWRadius ();
var atomColor = atom.getColor ();
astex.map.Surface.neighbourCount = 0;
for (var b = 0; b < atomCount; b++) {
var atom2 = selectedAtoms.get (b);
if (a != b) {
var rb = atom2.getVDWRadius ();
if (atom.distanceSq (atom2) < (ra + rb) * (ra + rb)) {
astex.map.Surface.neighbours[astex.map.Surface.neighbourCount++] = b;
}}}
var r = atom.getVDWRadius ();
var lastClippingAtom = null;
for (var i = 0; i < dotCount; i++) {
var clipped = false;
dot.setP (astex.map.Surface.dots.get (i));
dot.scale (r);
dot.add (atom);
if (lastClippingAtom != null) {
var lastr = lastClippingAtom.getVDWRadius ();
if (lastClippingAtom.distanceSq (dot) < lastr * lastr) {
clipped = true;
} else {
lastClippingAtom = null;
}}if (clipped == false) {
for (var b = 0; b < astex.map.Surface.neighbourCount; b++) {
var atom2 = selectedAtoms.get (astex.map.Surface.neighbours[b]);
var r2 = atom2.getVDWRadius ();
if (atom2.distanceSq (dot) < r2 * r2) {
lastClippingAtom = atom2;
clipped = true;
}}
}if (!clipped) {
ds.addPointNoNormNoLabel (dot.x, dot.y, dot.z, atomColor);
}}
}
return ds;
}, "astex.util.DynamicArray,~N");
Clazz.defineStatics (c$,
"minimumSpacing", 0.25,
"spacing", 0.0,
"desiredGridSpacing", 0.5,
"maximumGridSize", 100,
"gx", 0,
"gy", 0,
"gz", 0,
"grid", null,
"gminx", 0,
"gminy", 0,
"gminz", 0,
"gmaxx", 0,
"gmaxy", 0,
"gmaxz", 0,
"gridx", null,
"gridy", null,
"gridz", null,
"visible", null,
"reordered", null,
"rp", 1.5,
"maxRadius", 0.0,
"np", 40,
"debugFlag", false,
"ax", null,
"ay", null,
"az", null,
"ar", null,
"ar2", null,
"selected", null,
"atomCount", 0,
"neighbourCount", 0,
"neighbours", null,
"l", null);
c$.atom1 = c$.prototype.atom1 =  new astex.util.Point3d ();
c$.atom2 = c$.prototype.atom2 =  new astex.util.Point3d ();
c$.mid = c$.prototype.mid =  new astex.util.Point3d ();
c$.n1 = c$.prototype.n1 =  new astex.util.Point3d ();
c$.n2 = c$.prototype.n2 =  new astex.util.Point3d ();
Clazz.defineStatics (c$,
"cosTable", null,
"sinTable", null,
"lastClip", -1);
c$.dots = c$.prototype.dots =  new astex.util.DynamicArray ();
c$.triangles = c$.prototype.triangles =  new astex.util.DynamicArray ();
});
