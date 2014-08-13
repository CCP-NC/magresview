Clazz.declarePackage ("astex.map");
Clazz.load (["astex.api.AstexTexGen"], "astex.map.Texgen", ["astex.io.FILE", "astex.render.MoleculeRenderer", "$.Texture", "$.Tmesh", "astex.util.Color32", "$.DoubleArray", "$.IntArray", "$.Lattice", "$.Log", "$.Point3d", "java.lang.Double"], function () {
c$ = Clazz.declareType (astex.map, "Texgen", null, astex.api.AstexTexGen);
Clazz.makeConstructor (c$, 
function () {
});
Clazz.overrideMethod (c$, "distance", 
function (tm, points, uv) {
var tnp = tm.np;
var np = points.size ();
var tlocal = null;
var dmax = 0.0;
if (uv == 1) {
tlocal = tm.u;
} else if (uv == 2) {
tlocal = tm.v;
} else {
System.out.println ("Texgen.distance: " + "invalid texture coordinate " + uv);
return;
}for (var i = 0; i < tnp; i++) {
var tx = tm.x[i];
var ty = tm.y[i];
var tz = tm.z[i];
var dmin = 1.e10;
for (var j = 0; j < np; j++) {
var p = points.get (j);
var dx = tx - p.x;
var dy = ty - p.y;
var dz = tz - p.z;
var d2 = dx * dx + dy * dy + dz * dz;
if (d2 < dmin) {
dmin = d2;
}}
var d = Math.sqrt (dmin);
if (d > dmax) {
dmax = d;
}tlocal[i] = d;
}
if (Math.abs (dmax) > 1.e-3) {
if (uv == 1) {
tm.setUOffset (0.0);
tm.setUScale (1. / dmax);
} else if (uv == 2) {
tm.setVOffset (0.0);
tm.setVScale (1. / dmax);
}} else {
astex.util.Log.error ("dmax was zero");
}}, "astex.render.Tmesh,astex.util.DynamicArray,~N");
Clazz.overrideMethod (c$, "curvature", 
function (tm, points, uv, maxd) {
var tnp = tm.np;
var np = points.size ();
var tlocal = null;
var maxd2 = maxd * maxd;
var min = 1.e10;
var max = 0.0;
if (uv == 1) {
tlocal = tm.u;
} else if (uv == 2) {
tlocal = tm.v;
} else {
System.out.println ("Texgen.distance: " + "invalid texture coordinate " + uv);
return;
}for (var i = 0; i < tnp; i++) {
var tx = tm.x[i];
var ty = tm.y[i];
var tz = tm.z[i];
var dtotal = 0.0;
for (var j = 0; j < np; j++) {
var p = points.get (j);
var dx = tx - p.x;
var dy = ty - p.y;
var dz = tz - p.z;
var d2 = dx * dx + dy * dy + dz * dz;
if (d2 < maxd2) {
d2 = Math.sqrt (d2);
dtotal += (maxd - d2);
}}
tlocal[i] = dtotal;
if (dtotal > max) {
max = dtotal;
}if (dtotal < min) {
min = dtotal;
}}
for (var i = 0; i < tnp; i++) {
tlocal[i] = ((tlocal[i] - min) / (max - min));
}
}, "astex.render.Tmesh,astex.util.DynamicArray,~N,~N");
Clazz.overrideMethod (c$, "rectangular", 
function (tm) {
var tnp = tm.np;
var xmin = 1.e10;
var xmax = -1.0E10;
var ymin = 1.e10;
var ymax = -1.0E10;
for (var i = 0; i < tnp; i++) {
if (tm.x[i] < xmin) xmin = tm.x[i];
if (tm.x[i] > xmax) xmax = tm.x[i];
if (tm.y[i] < ymin) ymin = tm.y[i];
if (tm.y[i] > ymax) ymax = tm.y[i];
}
var dx = xmax - xmin;
var dy = ymax - ymin;
for (var i = 0; i < tnp; i++) {
tm.u[i] = ((tm.x[i] - xmin) / dx);
tm.v[i] = ((ymax - tm.y[i]) / dy);
}
}, "astex.render.Tmesh");
Clazz.overrideMethod (c$, "property_map", 
function (tm, atoms, uv, maxd, absolute, func) {
var atomCount = atoms.size ();
var tlocal = null;
var min = 1.0e10;
var max = -1.0E10;
var maxd2 = maxd * maxd;
var halfWidth = 1.;
var dCutoff = 3.0;
var topPart = Math.exp (-halfWidth * dCutoff) + 1.0;
if (uv == 1) {
tlocal = tm.u;
} else if (uv == 2) {
tlocal = tm.v;
}var arraySize = atomCount * 2;
if (astex.map.Texgen.x == null || astex.map.Texgen.x.length < arraySize) {
astex.map.Texgen.x =  Clazz.newDoubleArray (arraySize, 0);
astex.map.Texgen.y =  Clazz.newDoubleArray (arraySize, 0);
astex.map.Texgen.z =  Clazz.newDoubleArray (arraySize, 0);
astex.map.Texgen.r =  Clazz.newDoubleArray (arraySize, 0);
astex.map.Texgen.q =  Clazz.newDoubleArray (arraySize, 0);
}var na = 0;
var amideProtons = 0;
for (var i = 0; i < atomCount; i++) {
var a = atoms.get (i);
var name = a.getAtomLabel ();
if (func == 1) {
if (name != null && name.equals ("N")) {
var nh = astex.map.Texgen.getAmideHydrogen (a);
if (nh != null) {
astex.map.Texgen.x[na] = nh.getX ();
astex.map.Texgen.y[na] = nh.getY ();
astex.map.Texgen.z[na] = nh.getZ ();
astex.map.Texgen.q[na] = 0.25;
na++;
amideProtons++;
}}}var qa = a.getPartialCharge ();
if (func == 1) {
qa *= a.getOccupancy ();
}if (Math.abs (qa) > 1.e-3) {
astex.map.Texgen.x[na] = a.getX ();
astex.map.Texgen.y[na] = a.getY ();
astex.map.Texgen.z[na] = a.getZ ();
astex.map.Texgen.r[na] = a.getVDWRadius ();
astex.map.Texgen.q[na] = qa;
na++;
}}
var l =  new astex.util.Lattice (maxd);
for (var ia = 0; ia < na; ia++) {
l.add (ia, astex.map.Texgen.x[ia], astex.map.Texgen.y[ia], astex.map.Texgen.z[ia]);
}
if (func == 1) {
System.out.println ("added " + amideProtons + " amide protons");
}var tnp = tm.np;
for (var i = 0; i < tnp; i++) {
var tx = tm.x[i];
var ty = tm.y[i];
var tz = tm.z[i];
var dtotal = 0.0;
var norm = 0.0;
for (var j = 0; j < na; j++) {
var dx = tx - astex.map.Texgen.x[j];
var dy = ty - astex.map.Texgen.y[j];
var dz = tz - astex.map.Texgen.z[j];
var d2 = dx * dx + dy * dy + dz * dz;
if (d2 < maxd2) {
if (func == 1) {
dtotal += astex.map.Texgen.q[j] / d2;
} else if (func == 2) {
var d = Math.sqrt (d2);
var gd = topPart / (Math.exp (halfWidth * (d - dCutoff)) + 1.0);
dtotal += astex.map.Texgen.q[j] * gd;
norm += gd;
}}}
if (func == 2) {
dtotal /= norm;
}tlocal[i] = dtotal;
if (dtotal > max) {
max = dtotal;
}if (dtotal < min) {
min = dtotal;
}}
astex.io.FILE.out.printFD ("property min %.3f ", min);
astex.io.FILE.out.printFD ("max %.3f\n", max);
if (uv == 1) {
if (func == 2) {
tm.setUOffset (min);
tm.setUScale (1.0 / (max - min));
} else {
tm.setUOffset (-0.5);
}} else {
if (func == 2) {
tm.setVOffset (min);
tm.setVScale (1.0 / (max - min));
} else {
tm.setVOffset (-0.5);
}}}, "astex.render.Tmesh,astex.util.DynamicArray,~N,~N,~B,~N");
c$.getAmideHydrogen = Clazz.defineMethod (c$, "getAmideHydrogen", 
 function (N) {
if (N == null) {
return null;
}var H = N.getBondedAtom ("H");
if (H != null) {
return null;
}var CA = N.getBondedAtom ("CA");
var C = N.getBondedAtom ("C");
if (N == null || CA == null || C == null) {
return null;
}var hpos =  new astex.util.Point3d ();
hpos.setP (N);
hpos.subtract (C);
hpos.add (N);
hpos.subtract (CA);
hpos.normalise ();
hpos.scale (1.04);
hpos.add (N);
return hpos;
}, "astex.model.Atom");
Clazz.overrideMethod (c$, "processObjectCommand", 
function (mr, sym, name, name2, v1, v2, selectedAtoms) {
var objects;
var tm;
var uv;
switch (sym) {
case 65:
mr.removeGraphicalObjects (name);
break;
case 72:
tm = astex.render.Tmesh.read (name2);
tm.setName (name);
mr.addGraphicalObject (tm);
break;
case 66:
var mode = astex.render.MoleculeRenderer.getOnOffMode (name2);
if (mode >= 0) {
mr.setGraphicalObjectsVisibility (name, 0);
} else {
mr.setGraphicalObjectsColour (name, astex.util.Color32.getColorFromName (name2));
}break;
case 121:
mr.setGraphicalObjectBackface (name, name2.equals ("on"));
break;
case 116:
mr.textures.put (name, astex.render.Texture.simpleTexture ());
break;
case 113:
if (Double.isNaN (v1)) {
var textureHash = mr.textures;
if (textureHash.get (name) == null) {
var tex = astex.render.Texture.loadTexture (name2);
if (tex == null) {
System.out.println ("couldn't load texture " + name2);
} else {
textureHash.put (name, tex);
}} else {
System.out.println ("texture " + name + " already defined: not reloaded");
}break;
}if (Double.isNaN (v2)) {
mr.applyTexture (name, name2);
break;
}uv = astex.map.Texgen.getUVSpec (name2);
if (uv < 0) {
System.out.println ("texture command not recognised: " + name2);
return;
}var min = v1;
var max = v2;
objects = mr.getGraphicalObjects (name);
for (var i = objects.size (); --i >= 0; ) (objects.get (i)).setTextureRange (uv, min, max);

break;
case 153:
var att = 0;
if (name2.equals ("vscale")) {
att = 2;
} else if (name2.equals ("uscale")) {
att = 1;
} else if (name2.equals ("vdiv")) {
att = 2;
v1 = 1.0 / v1;
} else if (name2.equals ("udiv")) {
att = 1;
v1 = 1.0 / v1;
} else if (name2.equals ("voffset")) {
att = 4;
} else if (name2.equals ("uoffset")) {
att = 3;
} else {
System.out.println ("unknown texture attribute " + name2);
}if (att != 0) mr.scaleTexture (name, att, v1);
break;
case 95:
objects = mr.getGraphicalObjects (name);
uv = astex.map.Texgen.getUVSpec (name2);
if (uv < 0) return;
for (var i = objects.size (); --i >= 0; ) this.distance (objects.get (i), selectedAtoms, uv);

break;
case 118:
uv = astex.map.Texgen.getUVSpec (name2);
if (uv < 0) return;
objects = mr.getGraphicalObjects (name);
for (var i = objects.size (); --i >= 0; ) this.curvature (objects.get (i), selectedAtoms, uv, v1);

break;
case 119:
case 120:
if (name2.equals (null)) {
mr.textures.put (name, astex.render.Texture.lipophilicityTexture ());
break;
}uv = astex.map.Texgen.getUVSpec (name2);
objects = mr.getGraphicalObjects (name);
var type = (sym == 119 ? 1 : 2);
for (var i = objects.size (); --i >= 0; ) this.property_map (objects.get (i), selectedAtoms, uv, v1, false, type);

break;
case 77:
var color = astex.util.Color32.getColorFromName (name2);
objects = mr.getGraphicalObjects (name);
for (var i = objects.size (); --i >= 0; ) {
tm = objects.get (i);
tm.setColorStyle (1);
tm.setColor (color);
}
break;
case 36:
objects = mr.getGraphicalObjects (name);
for (var i = objects.size (); --i >= 0; ) (objects.get (i)).setLineWidth (v1);

break;
case 115:
objects = mr.getGraphicalObjects (name);
var t = Clazz.doubleToInt (v2);
for (var i = objects.size (); --i >= 0; ) (objects.get (i)).setTransparency (t);

break;
case 87:
uv = astex.map.Texgen.getUVSpec (name2);
objects = mr.getGraphicalObjects (name);
for (var i = objects.size (); --i >= 0; ) (objects.get (i)).clip (uv);

break;
case 122:
objects = mr.getGraphicalObjects (name);
tm = astex.render.Tmesh.copy (objects);
tm.setName (name2);
mr.addGraphicalObject (tm);
break;
case 117:
objects = mr.getGraphicalObjects (name);
for (var i = objects.size (); --i >= 0; ) this.rectangular (objects.get (i));

break;
case 143:
if (v1 == 1) {
mr.writeObject (name, name2);
} else {
var map = mr.findMap (name);
tm = mr.getContourGraphicalObject (map, 0);
tm.output (name2);
}break;
}
}, "astex.render.MoleculeRenderer,~N,~S,~S,~N,~N,astex.util.DynamicArray");
c$.getUVSpec = Clazz.defineMethod (c$, "getUVSpec", 
 function (uvspec) {
return (uvspec.startsWith ("u") ? 1 : uvspec.startsWith ("v") ? 2 : -1);
}, "~S");
Clazz.overrideMethod (c$, "handleObjectCommand", 
function (mr, namePattern, args) {
var mapAtoms = args.get ("-map");
if (mapAtoms == null) return;
var newColor = -2147483648;
if (args.defined ("-defaultcolor")) {
var defaultColorName = args.getString ("-defaultcolor", "white");
newColor = astex.util.Color32.getColorFromName (defaultColorName);
}var objects = mr.getGraphicalObjects (namePattern);
var dmax = args.getDouble ("-dmax", 1.5);
var wmax = args.getDouble ("-wmax", 1000.0);
wmax = 1. / wmax;
for (var i = objects.size (); --i >= 0; ) {
var tmesh = objects.get (i);
var color = (newColor == -2147483648 ? tmesh.getColor () : newColor);
astex.map.Texgen.mapAtomColors (tmesh, mapAtoms, color, dmax, wmax);
if (tmesh.lines != null) astex.map.Texgen.mapAtomColors (tmesh.lines, mapAtoms, color, dmax, wmax);
if (tmesh.spheres != null) astex.map.Texgen.mapAtomColors (tmesh.spheres, mapAtoms, color, dmax, wmax);
if (tmesh.cylinders != null) astex.map.Texgen.mapAtomColors (tmesh.cylinders, mapAtoms, color, dmax, wmax);
}
}, "astex.render.MoleculeRenderer,~S,astex.util.Arguments");
c$.mapAtomColors = Clazz.defineMethod (c$, "mapAtomColors", 
 function (tmesh, mapAtoms, defaultColor, dmax, wmax) {
var maxRadius = 0.0;
var atomCount = mapAtoms.size ();
for (var a = 0; a < atomCount; a++) {
var atom = mapAtoms.get (a);
var r = atom.getVDWRadius ();
if (r > maxRadius) {
maxRadius = r;
}}
maxRadius += dmax;
var l =  new astex.util.Lattice (maxRadius + 0.01);
for (var a = 0; a < atomCount; a++) {
var atom = mapAtoms.get (a);
l.add (a, atom.x, atom.y, atom.z);
}
var pointCount = tmesh.np;
var neighbours =  new astex.util.IntArray ();
var nearest =  new astex.util.IntArray ();
var distances =  new astex.util.DoubleArray ();
for (var i = 0; i < pointCount; i++) {
neighbours.removeAllElements ();
var tx = tmesh.x[i];
var ty = tmesh.y[i];
var tz = tmesh.z[i];
l.getPossibleNeighbours (-1, tx, ty, tz, neighbours, true);
var neighbourCount = neighbours.size ();
var dnear = 1.e10;
nearest.removeAllElements ();
distances.removeAllElements ();
for (var j = 0; j < neighbourCount; j++) {
var neighbour = neighbours.get (j);
var atom = mapAtoms.get (neighbour);
var ar = atom.getVDWRadius ();
var dx = atom.x - tx;
var dy = atom.y - ty;
var dz = atom.z - tz;
var d = Math.sqrt (dx * dx + dy * dy + dz * dz);
if (d < ar + dmax) {
nearest.add (neighbour);
d -= ar;
d += wmax;
d = 1. / Math.abs (d) - 1. / dmax;
distances.add (d);
if (d < dnear) {
dnear = d;
}}}
var nearCount = nearest.size ();
if (nearCount == 0) {
tmesh.vcolor[i] = defaultColor;
} else if (nearCount == 1) {
var a = nearest.get (0);
var atom = mapAtoms.get (a);
var color = atom.getColor ();
tmesh.vcolor[i] = color;
} else {
var sum = 0.0;
for (var nn = 0; nn < nearCount; nn++) {
sum += distances.get (nn);
}
var r = 0;
var g = 0;
var b = 0;
for (var nn = 0; nn < nearCount; nn++) {
var a = nearest.get (nn);
var atom = mapAtoms.get (a);
var color = atom.getColor ();
var comp = distances.get (nn) / sum;
r += comp * astex.util.Color32.getRed (color);
g += comp * astex.util.Color32.getGreen (color);
b += comp * astex.util.Color32.getBlue (color);
}
tmesh.vcolor[i] = astex.util.Color32.getClampColor (r, g, b);
}}
tmesh.setColorStyle (3);
}, "astex.render.Tmesh,astex.util.DynamicArray,~N,~N,~N");
Clazz.defineStatics (c$,
"x", null,
"y", null,
"z", null,
"r", null,
"q", null);
});
