Clazz.declarePackage ("astex.shadow");
Clazz.load (["astex.api.AstexShadowCache", "astex.shadow.NeighbourGrid2D", "astex.util.FloatArray", "$.IntArray", "$.Point3d"], "astex.shadow.ShadowCache", ["astex.anasurface.AnaSurface"], function () {
c$ = Clazz.declareType (astex.shadow, "ShadowCache", null, astex.api.AstexShadowCache);
Clazz.makeConstructor (c$, 
function () {
});
Clazz.overrideMethod (c$, "prepareTriangleCacheList", 
function (x0, y0, z0, x1, y1, z1, x2, y2, z2, targetIsTransparent) {
this.boundingSphereTriangle (x0, y0, z0, x1, y1, z1, x2, y2, z2, astex.shadow.ShadowCache.cbs);
this.prepareSphereCacheList (astex.shadow.ShadowCache.cbs[0], astex.shadow.ShadowCache.cbs[1], astex.shadow.ShadowCache.cbs[2], astex.shadow.ShadowCache.cbs[3], targetIsTransparent);
}, "~N,~N,~N,~N,~N,~N,~N,~N,~N,~B");
Clazz.overrideMethod (c$, "prepareCylinderCacheList", 
function (c0x, c0y, c0z, c1x, c1y, c1z, r) {
this.boundingSphereCylinder (c0x, c0y, c0z, c1x, c1y, c1z, r, astex.shadow.ShadowCache.cbs);
this.prepareSphereCacheList (astex.shadow.ShadowCache.cbs[0], astex.shadow.ShadowCache.cbs[1], astex.shadow.ShadowCache.cbs[2], astex.shadow.ShadowCache.cbs[3], false);
}, "~N,~N,~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "boundingSphereCylinder", 
 function (c0x, c0y, c0z, c1x, c1y, c1z, r, bs) {
bs[0] = 0.5 * (c0x + c1x);
bs[1] = 0.5 * (c0y + c1y);
bs[2] = 0.5 * (c0z + c1z);
var dmx = c0x - c1x;
var dmy = c0y - c1y;
var dmz = c0z - c1z;
bs[3] = 0.5 * Math.sqrt (dmx * dmx + dmy * dmy + dmz * dmz) + r;
}, "~N,~N,~N,~N,~N,~N,~N,~A");
Clazz.defineMethod (c$, "boundingSphereTriangle", 
 function (x0, y0, z0, x1, y1, z1, x2, y2, z2, bs) {
bs[0] = (x0 + x1 + x2) / 3.0;
bs[1] = (y0 + y1 + y2) / 3.0;
bs[2] = (z0 + z1 + z2) / 3.0;
var dmx = x0 - bs[0];
var dmy = y0 - bs[1];
var dmz = z0 - bs[2];
var r = 0.0;
var rad = Math.sqrt (dmx * dmx + dmy * dmy + dmz * dmz);
dmx = x1 - bs[0];
dmy = y1 - bs[1];
dmz = z1 - bs[2];
r = Math.sqrt (dmx * dmx + dmy * dmy + dmz * dmz);
if (r > rad) rad = r;
dmx = x2 - bs[0];
dmy = y2 - bs[1];
dmz = z2 - bs[2];
r = Math.sqrt (dmx * dmx + dmy * dmy + dmz * dmz);
if (r > rad) rad = r;
bs[3] = rad;
}, "~N,~N,~N,~N,~N,~N,~N,~N,~N,~A");
Clazz.overrideMethod (c$, "prepareSphereCacheList", 
function (sx, sy, sz, sr, transparent) {
var sphereCount = astex.shadow.ShadowCache.scachex.size ();
var x = sx * astex.shadow.ShadowCache.lightx.x + sy * astex.shadow.ShadowCache.lightx.y + sz * astex.shadow.ShadowCache.lightx.z;
var y = sx * astex.shadow.ShadowCache.lighty.x + sy * astex.shadow.ShadowCache.lighty.y + sz * astex.shadow.ShadowCache.lighty.z;
if (sphereCount > 0) {
astex.shadow.ShadowCache.sphereOcclusionCacheList.removeAllElements ();
astex.shadow.ShadowCache.sphereShadowCacheList.removeAllElements ();
astex.shadow.ShadowCache.initialList.removeAllElements ();
astex.shadow.ShadowCache.sphereGrid.getPossibleNeighbours (-1, x, y, sr + astex.shadow.ShadowCache.sphereGrid.getSpacing (), astex.shadow.ShadowCache.initialList, true);
var initialSize = astex.shadow.ShadowCache.initialList.size ();
for (var j = 0; j < initialSize; j++) {
var i = astex.shadow.ShadowCache.initialList.get (j);
var r = sr + astex.shadow.ShadowCache.scr[i];
var s2px = sx - astex.shadow.ShadowCache.scx[i];
var s2py = sy - astex.shadow.ShadowCache.scy[i];
var s2pz = sz - astex.shadow.ShadowCache.scz[i];
var dot = s2px * astex.shadow.ShadowCache.light.x + s2py * astex.shadow.ShadowCache.light.y + s2pz * astex.shadow.ShadowCache.light.z;
if (dot <= 0.0) {
var projx = astex.shadow.ShadowCache.lightx.x * s2px + astex.shadow.ShadowCache.lightx.y * s2py + astex.shadow.ShadowCache.lightx.z * s2pz;
var projy = astex.shadow.ShadowCache.lighty.x * s2px + astex.shadow.ShadowCache.lighty.y * s2py + astex.shadow.ShadowCache.lighty.z * s2pz;
if (projx < r && projy < r) {
if (projx * projx + projy * projy < r * r) {
astex.shadow.ShadowCache.sphereShadowCacheList.add (i);
}}}}
}var cylinderCount = astex.shadow.ShadowCache.ccachex0.size ();
if (cylinderCount > 0) {
astex.shadow.ShadowCache.cylinderShadowCacheList.removeAllElements ();
astex.shadow.ShadowCache.initialList.removeAllElements ();
astex.shadow.ShadowCache.cylinderGrid.getPossibleNeighbours (-1, x, y, sr + astex.shadow.ShadowCache.cylinderGrid.getSpacing (), astex.shadow.ShadowCache.initialList, true);
var initialSize = astex.shadow.ShadowCache.initialList.size ();
for (var j = 0; j < initialSize; j++) {
var i = astex.shadow.ShadowCache.initialList.get (j);
this.boundingSphereCylinder (astex.shadow.ShadowCache.ccachex0.get (i), astex.shadow.ShadowCache.ccachey0.get (i), astex.shadow.ShadowCache.ccachez0.get (i), astex.shadow.ShadowCache.ccachex1.get (i), astex.shadow.ShadowCache.ccachey1.get (i), astex.shadow.ShadowCache.ccachez1.get (i), astex.shadow.ShadowCache.ccacher.get (i), astex.shadow.ShadowCache.cbs);
var r = sr + astex.shadow.ShadowCache.cbs[3];
var r2 = r * r;
var s2px = sx - astex.shadow.ShadowCache.cbs[0];
var s2py = sy - astex.shadow.ShadowCache.cbs[1];
var s2pz = sz - astex.shadow.ShadowCache.cbs[2];
var dot = s2px * astex.shadow.ShadowCache.light.x + s2py * astex.shadow.ShadowCache.light.y + s2pz * astex.shadow.ShadowCache.light.z;
if (dot <= 0.0) {
var projx = astex.shadow.ShadowCache.lightx.x * s2px + astex.shadow.ShadowCache.lightx.y * s2py + astex.shadow.ShadowCache.lightx.z * s2pz;
var projy = astex.shadow.ShadowCache.lighty.x * s2px + astex.shadow.ShadowCache.lighty.y * s2py + astex.shadow.ShadowCache.lighty.z * s2pz;
if (projx < r && projy < r) {
if (projx * projx + projy * projy < r2) {
astex.shadow.ShadowCache.cylinderShadowCacheList.add (i);
}}}}
}if (astex.shadow.ShadowCache.tcachex0.size () > 0) {
astex.shadow.ShadowCache.triangleShadowCacheList.removeAllElements ();
astex.shadow.ShadowCache.initialList.removeAllElements ();
astex.shadow.ShadowCache.triangleGrid.getPossibleNeighbours (-1, x, y, sr + astex.shadow.ShadowCache.triangleGrid.getSpacing (), astex.shadow.ShadowCache.initialList, true);
var initialSize = astex.shadow.ShadowCache.initialList.size ();
for (var j = 0; j < initialSize; j++) {
var i = astex.shadow.ShadowCache.initialList.get (j);
var r = sr + astex.shadow.ShadowCache.tcr[i];
var s2px = sx - astex.shadow.ShadowCache.tcx[i];
var s2py = sy - astex.shadow.ShadowCache.tcy[i];
var s2pz = sz - astex.shadow.ShadowCache.tcz[i];
var dot = s2px * astex.shadow.ShadowCache.light.x + s2py * astex.shadow.ShadowCache.light.y + s2pz * astex.shadow.ShadowCache.light.z;
if (dot <= 0.0 && (Math.abs (s2px) > 1.e-3 || Math.abs (s2py) > 1.e-3 || Math.abs (s2pz) > 1.e-3)) {
var projx = astex.shadow.ShadowCache.lightx.x * s2px + astex.shadow.ShadowCache.lightx.y * s2py + astex.shadow.ShadowCache.lightx.z * s2pz;
var projy = astex.shadow.ShadowCache.lighty.x * s2px + astex.shadow.ShadowCache.lighty.y * s2py + astex.shadow.ShadowCache.lighty.z * s2pz;
if (projx < r && projy < r) {
if (projx * projx + projy * projy < r * r) {
astex.shadow.ShadowCache.triangleShadowCacheList.add (i);
}}}}
}}, "~N,~N,~N,~N,~B");
Clazz.overrideMethod (c$, "addSphereToCacheList", 
function (x, y, z, r) {
astex.shadow.ShadowCache.scachex.add (x);
astex.shadow.ShadowCache.scachey.add (y);
astex.shadow.ShadowCache.scachez.add (z);
astex.shadow.ShadowCache.scacher.add (r);
}, "~N,~N,~N,~N");
Clazz.overrideMethod (c$, "addCylinderToCacheList", 
function (x0, y0, z0, x1, y1, z1, r) {
astex.shadow.ShadowCache.ccachex0.add (x0);
astex.shadow.ShadowCache.ccachey0.add (y0);
astex.shadow.ShadowCache.ccachez0.add (z0);
astex.shadow.ShadowCache.ccachex1.add (x1);
astex.shadow.ShadowCache.ccachey1.add (y1);
astex.shadow.ShadowCache.ccachez1.add (z1);
astex.shadow.ShadowCache.ccacher.add (r);
}, "~N,~N,~N,~N,~N,~N,~N");
Clazz.overrideMethod (c$, "addTriangleToCacheList", 
function (x0, y0, z0, x1, y1, z1, x2, y2, z2, transparency) {
astex.shadow.ShadowCache.tcachex0.add (x0);
astex.shadow.ShadowCache.tcachey0.add (y0);
astex.shadow.ShadowCache.tcachez0.add (z0);
astex.shadow.ShadowCache.tcachex1.add (x1);
astex.shadow.ShadowCache.tcachey1.add (y1);
astex.shadow.ShadowCache.tcachez1.add (z1);
astex.shadow.ShadowCache.tcachex2.add (x2);
astex.shadow.ShadowCache.tcachey2.add (y2);
astex.shadow.ShadowCache.tcachez2.add (z2);
}, "~N,~N,~N,~N,~N,~N,~N,~N,~N,~N");
Clazz.overrideMethod (c$, "selfShadowed", 
function (nx, ny, nz, tol) {
if (nx * astex.shadow.ShadowCache.light.x + ny * astex.shadow.ShadowCache.light.y + nz * astex.shadow.ShadowCache.light.z < tol) {
return true;
}return false;
}, "~N,~N,~N,~N");
Clazz.overrideMethod (c$, "pointShadowed", 
function (x, y, z) {
var sphereCacheCount = astex.shadow.ShadowCache.sphereShadowCacheList.size ();
x += 1. * astex.shadow.ShadowCache.light.x;
y += 1. * astex.shadow.ShadowCache.light.y;
z += 1. * astex.shadow.ShadowCache.light.z;
astex.shadow.ShadowCache.px = astex.shadow.ShadowCache.lightx.x * x + astex.shadow.ShadowCache.lightx.y * y + astex.shadow.ShadowCache.lightx.z * z;
astex.shadow.ShadowCache.py = astex.shadow.ShadowCache.lighty.x * x + astex.shadow.ShadowCache.lighty.y * y + astex.shadow.ShadowCache.lighty.z * z;
astex.shadow.ShadowCache.ray0[0] = x;
astex.shadow.ShadowCache.ray0[1] = y;
astex.shadow.ShadowCache.ray0[2] = z;
astex.shadow.ShadowCache.ray1[0] = x + 100000. * astex.shadow.ShadowCache.light.x;
astex.shadow.ShadowCache.ray1[1] = y + 100000. * astex.shadow.ShadowCache.light.y;
astex.shadow.ShadowCache.ray1[2] = z + 100000. * astex.shadow.ShadowCache.light.z;
if (astex.shadow.ShadowCache.lastObscuringSphere != -1) {
if (astex.shadow.ShadowCache.obscuredBySphere (astex.shadow.ShadowCache.lastObscuringSphere, x, y, z)) {
return true;
}astex.shadow.ShadowCache.lastObscuringSphere = -1;
}if (astex.shadow.ShadowCache.lastObscuringCylinder != -1) {
if (astex.shadow.ShadowCache.obscuredByCylinder (astex.shadow.ShadowCache.lastObscuringCylinder)) {
return true;
}astex.shadow.ShadowCache.lastObscuringCylinder = -1;
}var slist = astex.shadow.ShadowCache.sphereShadowCacheList.getArray ();
for (var j = 0; j < sphereCacheCount; j++) {
var i = slist[j];
if (astex.shadow.ShadowCache.obscuredBySphere (i, x, y, z)) {
astex.shadow.ShadowCache.lastObscuringSphere = i;
return true;
}}
var cylinderCacheCount = astex.shadow.ShadowCache.cylinderShadowCacheList.size ();
for (var j = 0; j < cylinderCacheCount; j++) {
var i = astex.shadow.ShadowCache.cylinderShadowCacheList.get (j);
if (astex.shadow.ShadowCache.obscuredByCylinder (i)) {
astex.shadow.ShadowCache.lastObscuringCylinder = i;
return true;
}}
astex.shadow.ShadowCache.light.normalise ();
astex.shadow.ShadowCache.ray1[0] = astex.shadow.ShadowCache.light.x;
astex.shadow.ShadowCache.ray1[1] = astex.shadow.ShadowCache.light.y;
astex.shadow.ShadowCache.ray1[2] = astex.shadow.ShadowCache.light.z;
if (astex.shadow.ShadowCache.lastObscuringTriangle != -1) {
if (this.obscuredByTriangle (astex.shadow.ShadowCache.lastObscuringTriangle)) {
return true;
}astex.shadow.ShadowCache.lastObscuringTriangle = -1;
}var triangleCacheCount = astex.shadow.ShadowCache.triangleShadowCacheList.size ();
for (var j = 0; j < triangleCacheCount; j++) {
var i = astex.shadow.ShadowCache.triangleShadowCacheList.get (j);
if (this.obscuredByTriangle (i)) {
astex.shadow.ShadowCache.lastObscuringTriangle = i;
return true;
}}
return false;
}, "~N,~N,~N");
Clazz.defineMethod (c$, "obscuredByTriangle", 
 function (i) {
var dx = astex.shadow.ShadowCache.px - astex.shadow.ShadowCache.tc2x[i];
var dy = astex.shadow.ShadowCache.py - astex.shadow.ShadowCache.tc2y[i];
var r = astex.shadow.ShadowCache.tcr[i];
if (dx * dx + dy * dy > r * r) {
return false;
}astex.shadow.ShadowCache.c0[0] = astex.shadow.ShadowCache.tx0[i];
astex.shadow.ShadowCache.c0[1] = astex.shadow.ShadowCache.ty0[i];
astex.shadow.ShadowCache.c0[2] = astex.shadow.ShadowCache.tz0[i];
astex.shadow.ShadowCache.c1[0] = astex.shadow.ShadowCache.tx1[i];
astex.shadow.ShadowCache.c1[1] = astex.shadow.ShadowCache.ty1[i];
astex.shadow.ShadowCache.c1[2] = astex.shadow.ShadowCache.tz1[i];
astex.shadow.ShadowCache.c2[0] = astex.shadow.ShadowCache.tx2[i];
astex.shadow.ShadowCache.c2[1] = astex.shadow.ShadowCache.ty2[i];
astex.shadow.ShadowCache.c2[2] = astex.shadow.ShadowCache.tz2[i];
if (this.intersect_triangle (astex.shadow.ShadowCache.ray0, astex.shadow.ShadowCache.ray1, astex.shadow.ShadowCache.c0, astex.shadow.ShadowCache.c1, astex.shadow.ShadowCache.c2, astex.shadow.ShadowCache.tuv) == 1 && astex.shadow.ShadowCache.tuv[0] >= 0.0) {
return true;
}return false;
}, "~N");
c$.obscuredBySphere = Clazz.defineMethod (c$, "obscuredBySphere", 
 function (i, x, y, z) {
var s2px = x - astex.shadow.ShadowCache.scx[i];
var s2py = y - astex.shadow.ShadowCache.scy[i];
var s2pz = z - astex.shadow.ShadowCache.scz[i];
var dot = s2px * astex.shadow.ShadowCache.light.x + s2py * astex.shadow.ShadowCache.light.y + s2pz * astex.shadow.ShadowCache.light.z;
if (dot < 0.0) {
var projx = astex.shadow.ShadowCache.lightx.x * s2px + astex.shadow.ShadowCache.lightx.y * s2py + astex.shadow.ShadowCache.lightx.z * s2pz;
var r = astex.shadow.ShadowCache.scr[i];
if (projx < r) {
var projy = astex.shadow.ShadowCache.lighty.x * s2px + astex.shadow.ShadowCache.lighty.y * s2py + astex.shadow.ShadowCache.lighty.z * s2pz;
if (projy < r && projx * projx + projy * projy < r * r) {
return true;
}}}return false;
}, "~N,~N,~N,~N");
c$.obscuredByCylinder = Clazz.defineMethod (c$, "obscuredByCylinder", 
 function (i) {
astex.shadow.ShadowCache.c0[0] = astex.shadow.ShadowCache.ccachex0.get (i);
astex.shadow.ShadowCache.c0[1] = astex.shadow.ShadowCache.ccachey0.get (i);
astex.shadow.ShadowCache.c0[2] = astex.shadow.ShadowCache.ccachez0.get (i);
astex.shadow.ShadowCache.c1[0] = astex.shadow.ShadowCache.ccachex1.get (i);
astex.shadow.ShadowCache.c1[1] = astex.shadow.ShadowCache.ccachey1.get (i);
astex.shadow.ShadowCache.c1[2] = astex.shadow.ShadowCache.ccachez1.get (i);
if (astex.anasurface.AnaSurface.intersect (astex.shadow.ShadowCache.ray0, astex.shadow.ShadowCache.ray1, astex.shadow.ShadowCache.c0, astex.shadow.ShadowCache.c1, astex.shadow.ShadowCache.rint, astex.shadow.ShadowCache.nint) < astex.shadow.ShadowCache.ccacher.get (i)) {
return true;
}return false;
}, "~N");
Clazz.overrideMethod (c$, "pointInSphere", 
function (x, y, z) {
var sphereCount = astex.shadow.ShadowCache.sphereOcclusionCacheList.size ();
for (var i = 0; i < sphereCount; i++) {
var j = astex.shadow.ShadowCache.sphereOcclusionCacheList.get (i);
var dx = x - astex.shadow.ShadowCache.scachex.get (j);
var dy = y - astex.shadow.ShadowCache.scachey.get (j);
var dz = z - astex.shadow.ShadowCache.scachez.get (j);
var r2 = astex.shadow.ShadowCache.scacher.get (j);
if (dx * dx + dy * dy + dz * dz < r2 * r2) {
return true;
}}
return false;
}, "~N,~N,~N");
Clazz.overrideMethod (c$, "clearShadowCaches", 
function () {
astex.shadow.ShadowCache.scachex.removeAllElements ();
astex.shadow.ShadowCache.scachey.removeAllElements ();
astex.shadow.ShadowCache.scachez.removeAllElements ();
astex.shadow.ShadowCache.scacher.removeAllElements ();
astex.shadow.ShadowCache.ccachex0.removeAllElements ();
astex.shadow.ShadowCache.ccachey0.removeAllElements ();
astex.shadow.ShadowCache.ccachez0.removeAllElements ();
astex.shadow.ShadowCache.ccachex1.removeAllElements ();
astex.shadow.ShadowCache.ccachey1.removeAllElements ();
astex.shadow.ShadowCache.ccachez1.removeAllElements ();
astex.shadow.ShadowCache.ccacher.removeAllElements ();
astex.shadow.ShadowCache.tcachex0.removeAllElements ();
astex.shadow.ShadowCache.tcachey0.removeAllElements ();
astex.shadow.ShadowCache.tcachez0.removeAllElements ();
astex.shadow.ShadowCache.tcachex1.removeAllElements ();
astex.shadow.ShadowCache.tcachey1.removeAllElements ();
astex.shadow.ShadowCache.tcachez1.removeAllElements ();
astex.shadow.ShadowCache.tcachex2.removeAllElements ();
astex.shadow.ShadowCache.tcachey2.removeAllElements ();
astex.shadow.ShadowCache.tcachez2.removeAllElements ();
astex.shadow.ShadowCache.tcen2dx.removeAllElements ();
astex.shadow.ShadowCache.tcen2dy.removeAllElements ();
astex.shadow.ShadowCache.tcenx.removeAllElements ();
astex.shadow.ShadowCache.tceny.removeAllElements ();
astex.shadow.ShadowCache.tcenz.removeAllElements ();
astex.shadow.ShadowCache.tcenr.removeAllElements ();
});
Clazz.overrideMethod (c$, "setupShadowCaches", 
function (l0, ovs) {
astex.shadow.ShadowCache.light.x = l0.pos[0];
astex.shadow.ShadowCache.light.y = -l0.pos[1];
astex.shadow.ShadowCache.light.z = l0.pos[2];
astex.shadow.ShadowCache.light.normalise ();
astex.shadow.ShadowCache.lightx = astex.util.Point3d.normalToLineP (astex.shadow.ShadowCache.light);
astex.shadow.ShadowCache.lightx.normalise ();
astex.shadow.ShadowCache.lighty = astex.shadow.ShadowCache.lightx.cross (astex.shadow.ShadowCache.light);
astex.shadow.ShadowCache.lighty.normalise ();
astex.shadow.ShadowCache.tx0 = astex.shadow.ShadowCache.tcachex0.getArray ();
astex.shadow.ShadowCache.ty0 = astex.shadow.ShadowCache.tcachey0.getArray ();
astex.shadow.ShadowCache.tz0 = astex.shadow.ShadowCache.tcachez0.getArray ();
astex.shadow.ShadowCache.tx1 = astex.shadow.ShadowCache.tcachex1.getArray ();
astex.shadow.ShadowCache.ty1 = astex.shadow.ShadowCache.tcachey1.getArray ();
astex.shadow.ShadowCache.tz1 = astex.shadow.ShadowCache.tcachez1.getArray ();
astex.shadow.ShadowCache.tx2 = astex.shadow.ShadowCache.tcachex2.getArray ();
astex.shadow.ShadowCache.ty2 = astex.shadow.ShadowCache.tcachey2.getArray ();
astex.shadow.ShadowCache.tz2 = astex.shadow.ShadowCache.tcachez2.getArray ();
this.prepareTriangleGrid ();
astex.shadow.ShadowCache.prepareSphereGrid ();
this.prepareCylinderGrid ();
astex.shadow.ShadowCache.lastObscuringSphere = -1;
astex.shadow.ShadowCache.lastObscuringCylinder = -1;
astex.shadow.ShadowCache.lastObscuringTriangle = -1;
astex.shadow.ShadowCache.overallScale = ovs;
astex.shadow.ShadowCache.tc2x = astex.shadow.ShadowCache.tcen2dx.getArray ();
astex.shadow.ShadowCache.tc2y = astex.shadow.ShadowCache.tcen2dy.getArray ();
astex.shadow.ShadowCache.tcx = astex.shadow.ShadowCache.tcenx.getArray ();
astex.shadow.ShadowCache.tcy = astex.shadow.ShadowCache.tceny.getArray ();
astex.shadow.ShadowCache.tcz = astex.shadow.ShadowCache.tcenz.getArray ();
astex.shadow.ShadowCache.tcr = astex.shadow.ShadowCache.tcenr.getArray ();
astex.shadow.ShadowCache.scx = astex.shadow.ShadowCache.scachex.getArray ();
astex.shadow.ShadowCache.scy = astex.shadow.ShadowCache.scachey.getArray ();
astex.shadow.ShadowCache.scz = astex.shadow.ShadowCache.scachez.getArray ();
astex.shadow.ShadowCache.scr = astex.shadow.ShadowCache.scacher.getArray ();
}, "astex.util.Light,~N");
Clazz.defineMethod (c$, "prepareTriangleGrid", 
 function () {
var triangleCount = astex.shadow.ShadowCache.tcachex0.size ();
if (triangleCount == 0) return;
var xmin = 1.e10;
var ymin = 1.e10;
var xmax = -1.0E10;
var ymax = -1.0E10;
var rmax = 0.0;
for (var i = 0; i < triangleCount; i++) {
this.boundingSphereTriangle (astex.shadow.ShadowCache.tx0[i], astex.shadow.ShadowCache.ty0[i], astex.shadow.ShadowCache.tz0[i], astex.shadow.ShadowCache.tx1[i], astex.shadow.ShadowCache.ty1[i], astex.shadow.ShadowCache.tz1[i], astex.shadow.ShadowCache.tx2[i], astex.shadow.ShadowCache.ty2[i], astex.shadow.ShadowCache.tz2[i], astex.shadow.ShadowCache.cbs);
astex.shadow.ShadowCache.tcenx.add (astex.shadow.ShadowCache.cbs[0]);
astex.shadow.ShadowCache.tceny.add (astex.shadow.ShadowCache.cbs[1]);
astex.shadow.ShadowCache.tcenz.add (astex.shadow.ShadowCache.cbs[2]);
astex.shadow.ShadowCache.tcenr.add (astex.shadow.ShadowCache.cbs[3]);
var x = astex.shadow.ShadowCache.cbs[0] * astex.shadow.ShadowCache.lightx.x + astex.shadow.ShadowCache.cbs[1] * astex.shadow.ShadowCache.lightx.y + astex.shadow.ShadowCache.cbs[2] * astex.shadow.ShadowCache.lightx.z;
var y = astex.shadow.ShadowCache.cbs[0] * astex.shadow.ShadowCache.lighty.x + astex.shadow.ShadowCache.cbs[1] * astex.shadow.ShadowCache.lighty.y + astex.shadow.ShadowCache.cbs[2] * astex.shadow.ShadowCache.lighty.z;
astex.shadow.ShadowCache.tcen2dx.add (x);
astex.shadow.ShadowCache.tcen2dy.add (y);
if (x < xmin) xmin = x;
if (x > xmax) xmax = x;
if (y < ymin) ymin = y;
if (y > ymax) ymax = y;
if (astex.shadow.ShadowCache.cbs[3] > rmax) rmax = astex.shadow.ShadowCache.cbs[3];
}
astex.shadow.ShadowCache.triangleGrid.reset (xmin - 0.1, ymin - 0.1, xmax + 0.1, ymax + 0.1, 1.01 * rmax);
astex.shadow.ShadowCache.tcx = astex.shadow.ShadowCache.tcen2dx.getArray ();
astex.shadow.ShadowCache.tcy = astex.shadow.ShadowCache.tcen2dy.getArray ();
for (var i = 0; i < triangleCount; i++) {
astex.shadow.ShadowCache.triangleGrid.add (i, astex.shadow.ShadowCache.tcx[i], astex.shadow.ShadowCache.tcy[i]);
}
});
c$.prepareSphereGrid = Clazz.defineMethod (c$, "prepareSphereGrid", 
 function () {
var sphereCount = astex.shadow.ShadowCache.scachex.size ();
if (sphereCount == 0) return;
var xmin = 1.e10;
var ymin = 1.e10;
var xmax = -1.0E10;
var ymax = -1.0E10;
var rmax = 0.0;
astex.shadow.ShadowCache.scx = astex.shadow.ShadowCache.scachex.getArray ();
astex.shadow.ShadowCache.scy = astex.shadow.ShadowCache.scachey.getArray ();
astex.shadow.ShadowCache.scz = astex.shadow.ShadowCache.scachez.getArray ();
astex.shadow.ShadowCache.scr = astex.shadow.ShadowCache.scacher.getArray ();
for (var i = 0; i < sphereCount; i++) {
var x = astex.shadow.ShadowCache.scx[i] * astex.shadow.ShadowCache.lightx.x + astex.shadow.ShadowCache.scy[i] * astex.shadow.ShadowCache.lightx.y + astex.shadow.ShadowCache.scz[i] * astex.shadow.ShadowCache.lightx.z;
var y = astex.shadow.ShadowCache.scx[i] * astex.shadow.ShadowCache.lighty.x + astex.shadow.ShadowCache.scy[i] * astex.shadow.ShadowCache.lighty.y + astex.shadow.ShadowCache.scz[i] * astex.shadow.ShadowCache.lighty.z;
if (x < xmin) xmin = x;
if (x > xmax) xmax = x;
if (y < ymin) ymin = y;
if (y > ymax) ymax = y;
if (astex.shadow.ShadowCache.scr[i] > rmax) rmax = astex.shadow.ShadowCache.scr[i];
}
astex.shadow.ShadowCache.sphereGrid.reset (xmin - 0.1, ymin - 0.1, xmax + 0.1, ymax + 0.1, 1.01 * rmax);
for (var i = 0; i < sphereCount; i++) {
var x = astex.shadow.ShadowCache.scx[i] * astex.shadow.ShadowCache.lightx.x + astex.shadow.ShadowCache.scy[i] * astex.shadow.ShadowCache.lightx.y + astex.shadow.ShadowCache.scz[i] * astex.shadow.ShadowCache.lightx.z;
var y = astex.shadow.ShadowCache.scx[i] * astex.shadow.ShadowCache.lighty.x + astex.shadow.ShadowCache.scy[i] * astex.shadow.ShadowCache.lighty.y + astex.shadow.ShadowCache.scz[i] * astex.shadow.ShadowCache.lighty.z;
astex.shadow.ShadowCache.sphereGrid.add (i, x, y);
}
});
Clazz.defineMethod (c$, "prepareCylinderGrid", 
 function () {
var cylinderCount = astex.shadow.ShadowCache.ccachex0.size ();
if (cylinderCount == 0) return;
var xmin = 1.e10;
var ymin = 1.e10;
var xmax = -1.0E10;
var ymax = -1.0E10;
var rmax = 0.0;
for (var i = 0; i < cylinderCount; i++) {
this.boundingSphereCylinder (astex.shadow.ShadowCache.ccachex0.get (i), astex.shadow.ShadowCache.ccachey0.get (i), astex.shadow.ShadowCache.ccachez0.get (i), astex.shadow.ShadowCache.ccachex1.get (i), astex.shadow.ShadowCache.ccachey1.get (i), astex.shadow.ShadowCache.ccachez1.get (i), astex.shadow.ShadowCache.ccacher.get (i), astex.shadow.ShadowCache.cbs);
var x = astex.shadow.ShadowCache.cbs[0] * astex.shadow.ShadowCache.lightx.x + astex.shadow.ShadowCache.cbs[1] * astex.shadow.ShadowCache.lightx.y + astex.shadow.ShadowCache.cbs[2] * astex.shadow.ShadowCache.lightx.z;
var y = astex.shadow.ShadowCache.cbs[0] * astex.shadow.ShadowCache.lighty.x + astex.shadow.ShadowCache.cbs[1] * astex.shadow.ShadowCache.lighty.y + astex.shadow.ShadowCache.cbs[2] * astex.shadow.ShadowCache.lighty.z;
if (x < xmin) xmin = x;
if (x > xmax) xmax = x;
if (y < ymin) ymin = y;
if (y > ymax) ymax = y;
if (astex.shadow.ShadowCache.cbs[3] > rmax) rmax = astex.shadow.ShadowCache.cbs[3];
}
astex.shadow.ShadowCache.cylinderGrid.reset (xmin - 0.1, ymin - 0.1, xmax + 0.1, ymax + 0.1, 1.01 * rmax);
astex.shadow.ShadowCache.tcx = astex.shadow.ShadowCache.tcen2dx.getArray ();
astex.shadow.ShadowCache.tcy = astex.shadow.ShadowCache.tcen2dy.getArray ();
for (var i = 0; i < cylinderCount; i++) {
this.boundingSphereCylinder (astex.shadow.ShadowCache.ccachex0.get (i), astex.shadow.ShadowCache.ccachey0.get (i), astex.shadow.ShadowCache.ccachez0.get (i), astex.shadow.ShadowCache.ccachex1.get (i), astex.shadow.ShadowCache.ccachey1.get (i), astex.shadow.ShadowCache.ccachez1.get (i), astex.shadow.ShadowCache.ccacher.get (i), astex.shadow.ShadowCache.cbs);
var x = astex.shadow.ShadowCache.cbs[0] * astex.shadow.ShadowCache.lightx.x + astex.shadow.ShadowCache.cbs[1] * astex.shadow.ShadowCache.lightx.y + astex.shadow.ShadowCache.cbs[2] * astex.shadow.ShadowCache.lightx.z;
var y = astex.shadow.ShadowCache.cbs[0] * astex.shadow.ShadowCache.lighty.x + astex.shadow.ShadowCache.cbs[1] * astex.shadow.ShadowCache.lighty.y + astex.shadow.ShadowCache.cbs[2] * astex.shadow.ShadowCache.lighty.z;
astex.shadow.ShadowCache.cylinderGrid.add (i, x, y);
}
});
c$.CROSS = Clazz.defineMethod (c$, "CROSS", 
function (dest, v1, v2) {
dest[0] = v1[1] * v2[2] - v1[2] * v2[1];
dest[1] = v1[2] * v2[0] - v1[0] * v2[2];
dest[2] = v1[0] * v2[1] - v1[1] * v2[0];
}, "~A,~A,~A");
c$.DOT = Clazz.defineMethod (c$, "DOT", 
function (v1, v2) {
return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
}, "~A,~A");
c$.SUB = Clazz.defineMethod (c$, "SUB", 
function (dest, v1, v2) {
dest[0] = v1[0] - v2[0];
dest[1] = v1[1] - v2[1];
dest[2] = v1[2] - v2[2];
}, "~A,~A,~A");
Clazz.overrideMethod (c$, "intersect_triangle", 
function (orig, dir, vert0, vert1, vert2, tuv) {
var det;
var inv_det;
astex.shadow.ShadowCache.SUB (astex.shadow.ShadowCache.edge1, vert1, vert0);
astex.shadow.ShadowCache.SUB (astex.shadow.ShadowCache.edge2, vert2, vert0);
astex.shadow.ShadowCache.CROSS (astex.shadow.ShadowCache.pvec, dir, astex.shadow.ShadowCache.edge2);
det = astex.shadow.ShadowCache.DOT (astex.shadow.ShadowCache.edge1, astex.shadow.ShadowCache.pvec);
if (det > -1.0E-6 && det < 1.0E-6) return 0;
inv_det = 1.0 / det;
astex.shadow.ShadowCache.SUB (astex.shadow.ShadowCache.tvec, orig, vert0);
tuv[1] = astex.shadow.ShadowCache.DOT (astex.shadow.ShadowCache.tvec, astex.shadow.ShadowCache.pvec) * inv_det;
if (tuv[1] < 0.0 || tuv[1] > 1.0) return 0;
astex.shadow.ShadowCache.CROSS (astex.shadow.ShadowCache.qvec, astex.shadow.ShadowCache.tvec, astex.shadow.ShadowCache.edge1);
tuv[2] = astex.shadow.ShadowCache.DOT (dir, astex.shadow.ShadowCache.qvec) * inv_det;
if (tuv[2] < 0.0 || tuv[1] + tuv[2] > 1.0) return 0;
tuv[0] = astex.shadow.ShadowCache.DOT (astex.shadow.ShadowCache.edge2, astex.shadow.ShadowCache.qvec) * inv_det;
return 1;
}, "~A,~A,~A,~A,~A,~A");
c$.scachex = c$.prototype.scachex =  new astex.util.FloatArray ();
c$.scachey = c$.prototype.scachey =  new astex.util.FloatArray ();
c$.scachez = c$.prototype.scachez =  new astex.util.FloatArray ();
c$.scacher = c$.prototype.scacher =  new astex.util.FloatArray ();
c$.ccachex0 = c$.prototype.ccachex0 =  new astex.util.FloatArray ();
c$.ccachey0 = c$.prototype.ccachey0 =  new astex.util.FloatArray ();
c$.ccachez0 = c$.prototype.ccachez0 =  new astex.util.FloatArray ();
c$.ccachex1 = c$.prototype.ccachex1 =  new astex.util.FloatArray ();
c$.ccachey1 = c$.prototype.ccachey1 =  new astex.util.FloatArray ();
c$.ccachez1 = c$.prototype.ccachez1 =  new astex.util.FloatArray ();
c$.ccacher = c$.prototype.ccacher =  new astex.util.FloatArray ();
c$.tcachex0 = c$.prototype.tcachex0 =  new astex.util.FloatArray ();
c$.tcachey0 = c$.prototype.tcachey0 =  new astex.util.FloatArray ();
c$.tcachez0 = c$.prototype.tcachez0 =  new astex.util.FloatArray ();
c$.tcachex1 = c$.prototype.tcachex1 =  new astex.util.FloatArray ();
c$.tcachey1 = c$.prototype.tcachey1 =  new astex.util.FloatArray ();
c$.tcachez1 = c$.prototype.tcachez1 =  new astex.util.FloatArray ();
c$.tcachex2 = c$.prototype.tcachex2 =  new astex.util.FloatArray ();
c$.tcachey2 = c$.prototype.tcachey2 =  new astex.util.FloatArray ();
c$.tcachez2 = c$.prototype.tcachez2 =  new astex.util.FloatArray ();
c$.tcen2dx = c$.prototype.tcen2dx =  new astex.util.FloatArray ();
c$.tcen2dy = c$.prototype.tcen2dy =  new astex.util.FloatArray ();
c$.tcenx = c$.prototype.tcenx =  new astex.util.FloatArray ();
c$.tceny = c$.prototype.tceny =  new astex.util.FloatArray ();
c$.tcenz = c$.prototype.tcenz =  new astex.util.FloatArray ();
c$.tcenr = c$.prototype.tcenr =  new astex.util.FloatArray ();
Clazz.defineStatics (c$,
"tx0", null,
"ty0", null,
"tz0", null,
"tx1", null,
"ty1", null,
"tz1", null,
"tx2", null,
"ty2", null,
"tz2", null,
"tc2x", null,
"tc2y", null,
"tcx", null,
"tcy", null,
"tcz", null,
"tcr", null,
"scx", null,
"scy", null,
"scz", null,
"scr", null);
c$.sphereShadowCacheList = c$.prototype.sphereShadowCacheList =  new astex.util.IntArray ();
c$.sphereOcclusionCacheList = c$.prototype.sphereOcclusionCacheList =  new astex.util.IntArray ();
c$.cylinderShadowCacheList = c$.prototype.cylinderShadowCacheList =  new astex.util.IntArray ();
c$.triangleShadowCacheList = c$.prototype.triangleShadowCacheList =  new astex.util.IntArray ();
c$.initialList = c$.prototype.initialList =  new astex.util.IntArray ();
Clazz.defineStatics (c$,
"overallScale", 1.0,
"cbs",  Clazz.newDoubleArray (4, 0),
"c0",  Clazz.newDoubleArray (3, 0),
"c1",  Clazz.newDoubleArray (3, 0),
"c2",  Clazz.newDoubleArray (3, 0),
"ray0",  Clazz.newDoubleArray (3, 0),
"ray1",  Clazz.newDoubleArray (3, 0),
"rint",  Clazz.newDoubleArray (3, 0),
"nint",  Clazz.newDoubleArray (3, 0),
"tuv",  Clazz.newDoubleArray (3, 0),
"px", 0.0,
"py", 0.0,
"lastObscuringTriangle", -1,
"lastObscuringSphere", -1,
"lastObscuringCylinder", -1);
c$.light = c$.prototype.light =  new astex.util.Point3d ();
Clazz.defineStatics (c$,
"lightx", null,
"lighty", null);
c$.triangleGrid = c$.prototype.triangleGrid =  new astex.shadow.NeighbourGrid2D ();
c$.sphereGrid = c$.prototype.sphereGrid =  new astex.shadow.NeighbourGrid2D ();
c$.cylinderGrid = c$.prototype.cylinderGrid =  new astex.shadow.NeighbourGrid2D ();
Clazz.defineStatics (c$,
"EPSILON", 0.000001,
"edge1",  Clazz.newDoubleArray (3, 0),
"edge2",  Clazz.newDoubleArray (3, 0),
"tvec",  Clazz.newDoubleArray (3, 0),
"pvec",  Clazz.newDoubleArray (3, 0),
"qvec",  Clazz.newDoubleArray (3, 0));
});
