Clazz.declarePackage ("astex.map");
c$ = Clazz.declareType (astex.map, "Contour");
c$.contour = Clazz.defineMethod (c$, "contour", 
function (data, nx, ny, nz, level, contourObject) {
for (var z = 0; z < nz; z++) {
astex.map.Contour.contourSection (data, nx, ny, nz, z, level, contourObject);
}
}, "~A,~N,~N,~N,~N,astex.render.Tmesh");
c$.index = Clazz.defineMethod (c$, "index", 
 function (x, y, z, nx, ny, nz) {
return (z * nx * ny) + (y * nx) + x;
}, "~N,~N,~N,~N,~N,~N");
c$.contourSection = Clazz.defineMethod (c$, "contourSection", 
 function (data, nx, ny, nz, z, level, contourObject) {
var nxy = nx * ny;
var mask = 0;
for (var y = 0; y < ny; y++) {
for (var x = 0; x < nx; x++) {
var index1;
var index2;
var index3;
var index4;
var v1;
var v2;
var v3;
var v4;
index1 = astex.map.Contour.index (x, y, z, nx, ny, nz);
v1 = data[index1];
if (y != ny - 1 && x != nx - 1) {
index2 = index1 + 1;
index3 = index1 + 1 + nx;
index4 = index1 + nx;
v2 = data[index2];
v3 = data[index3];
v4 = data[index4];
mask = 0;
if (level > v1) mask |= 1;
if (level > v2) mask |= 2;
if (level > v3) mask |= 4;
if (level > v4) mask |= 8;
astex.map.Contour.contourOneFace (x, y, z, v1, x + 1, y, z, v2, x + 1, y + 1, z, v3, x, y + 1, z, v4, mask, level, contourObject);
}if (y != ny - 1 && z != nz - 1) {
index2 = index1 + nx;
index3 = index1 + nx + nxy;
index4 = index1 + nxy;
v2 = data[index2];
v3 = data[index3];
v4 = data[index4];
mask = 0;
if (level > v1) mask |= 1;
if (level > v2) mask |= 2;
if (level > v3) mask |= 4;
if (level > v4) mask |= 8;
astex.map.Contour.contourOneFace (x, y, z, v1, x, y + 1, z, v2, x, y + 1, z + 1, v3, x, y, z + 1, v4, mask, level, contourObject);
}if (x != nx - 1 && z != nz - 1) {
index2 = index1 + 1;
index3 = index1 + 1 + nxy;
index4 = index1 + nxy;
v2 = data[index2];
v3 = data[index3];
v4 = data[index4];
mask = 0;
if (level > v1) mask |= 1;
if (level > v2) mask |= 2;
if (level > v3) mask |= 4;
if (level > v4) mask |= 8;
astex.map.Contour.contourOneFace (x, y, z, v1, x + 1, y, z, v2, x + 1, y, z + 1, v3, x, y, z + 1, v4, mask, level, contourObject);
}}
}
}, "~A,~N,~N,~N,~N,~N,astex.render.Tmesh");
c$.contourOneFace = Clazz.defineMethod (c$, "contourOneFace", 
 function (x1, y1, z1, v1, x2, y2, z2, v2, x3, y3, z3, v3, x4, y4, z4, v4, mask, level, contourObject) {
switch (mask) {
case 0:
case 15:
break;
case 1:
case 14:
astex.map.Contour.addLine (x1, y1, z1, v1, x2, y2, z2, v2, x1, y1, z1, v1, x4, y4, z4, v4, level, contourObject);
break;
case 2:
case 13:
astex.map.Contour.addLine (x1, y1, z1, v1, x2, y2, z2, v2, x2, y2, z2, v2, x3, y3, z3, v3, level, contourObject);
break;
case 4:
case 11:
astex.map.Contour.addLine (x2, y2, z2, v2, x3, y3, z3, v3, x3, y3, z3, v3, x4, y4, z4, v4, level, contourObject);
break;
case 8:
case 7:
astex.map.Contour.addLine (x3, y3, z3, v3, x4, y4, z4, v4, x4, y4, z4, v4, x1, y1, z1, v1, level, contourObject);
break;
case 3:
case 12:
astex.map.Contour.addLine (x2, y2, z2, v2, x3, y3, z3, v3, x4, y4, z4, v4, x1, y1, z1, v1, level, contourObject);
break;
case 6:
case 9:
astex.map.Contour.addLine (x1, y1, z1, v1, x2, y2, z2, v2, x4, y4, z4, v4, x3, y3, z3, v3, level, contourObject);
break;
case 5:
case 10:
var mean = 0.25 * (v1 + v2 + v3 + v4);
if (mean > level && v1 > level) {
astex.map.Contour.addLine (x1, y1, z1, v1, x2, y2, z2, v2, x2, y2, z2, v2, x3, y3, z3, v3, level, contourObject);
astex.map.Contour.addLine (x3, y3, z3, v3, x4, y4, z4, v4, x4, y4, z4, v4, x1, y1, z1, v1, level, contourObject);
} else {
astex.map.Contour.addLine (x1, y1, z1, v1, x2, y2, z2, v2, x4, y4, z4, v4, x1, y1, z1, v1, level, contourObject);
astex.map.Contour.addLine (x3, y3, z3, v3, x4, y4, z4, v4, x2, y2, z2, v2, x3, y3, z3, v3, level, contourObject);
}break;
}
}, "~N,~N,~N,~N,~N,~N,~N,~N,~N,~N,~N,~N,~N,~N,~N,~N,~N,~N,astex.render.Tmesh");
c$.addLine = Clazz.defineMethod (c$, "addLine", 
 function (x1, y1, z1, v1, x2, y2, z2, v2, x3, y3, z3, v3, x4, y4, z4, v4, level, contourObject) {
var point1 = astex.map.Contour.addIntersection (x1, y1, z1, v1, x2, y2, z2, v2, level, contourObject);
var point2 = astex.map.Contour.addIntersection (x3, y3, z3, v3, x4, y4, z4, v4, level, contourObject);
contourObject.addLine (point1, point2, 0);
}, "~N,~N,~N,~N,~N,~N,~N,~N,~N,~N,~N,~N,~N,~N,~N,~N,~N,astex.render.Tmesh");
c$.addIntersection = Clazz.defineMethod (c$, "addIntersection", 
 function (x1, y1, z1, v1, x2, y2, z2, v2, level, contourObject) {
var fraction = (level - v1) / (v2 - v1);
var x = x1 + fraction * (x2 - x1);
var y = y1 + fraction * (y2 - y1);
var z = z1 + fraction * (z2 - z1);
var vertex = astex.map.Contour.findVertex (contourObject, x, y, z);
if (vertex == astex.map.Contour.VertexNotFound) {
contourObject.addPointNoNormNoLabel (x, y, z, 0);
return contourObject.np - 1;
}return vertex;
}, "~N,~N,~N,~N,~N,~N,~N,~N,~N,astex.render.Tmesh");
c$.findVertex = Clazz.defineMethod (c$, "findVertex", 
 function (object, x, y, z) {
var pointCount = object.np;
var objectx = object.x;
var objecty = object.y;
var objectz = object.z;
for (var i = pointCount - 1; i >= 0; i--) {
if (objectz[i] < z - 1.1) return astex.map.Contour.VertexNotFound;
var dx = objectx[i] - x;
if (dx < 0.0) dx = -dx;
if (dx < astex.map.Contour.tolerance) {
var dy = Math.abs (objecty[i] - y);
if (dy < astex.map.Contour.tolerance) {
var dz = Math.abs (objectz[i] - z);
if (dz < astex.map.Contour.tolerance) {
return i;
}}}}
return astex.map.Contour.VertexNotFound;
}, "astex.render.Tmesh,~N,~N,~N");
Clazz.defineStatics (c$,
"tolerance", 1.0e-3,
"VertexNotFound", -1);
