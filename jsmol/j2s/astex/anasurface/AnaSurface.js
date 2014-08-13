Clazz.declarePackage ("astex.anasurface");
Clazz.load (["astex.api.AstexAnaSurface", "astex.anasurface.Face", "astex.render.Tmesh", "astex.util.Color32", "$.DynamicArray", "$.IntArray"], "astex.anasurface.AnaSurface", ["astex.anasurface.Edge", "$.Probe", "$.Torus", "$.Vertex", "astex.io.FILE", "astex.util.Format", "$.Lattice", "$.Log", "java.lang.Exception", "$.Runtime", "$.RuntimeException"], function () {
c$ = Clazz.decorateAsClass (function () {
this.xyz = null;
this.radius = null;
this.radius2 = null;
this.rsq = null;
this.visible = null;
this.colors = null;
this.edgeList = null;
this.probeList = null;
this.faceList = null;
this.vertexList = null;
this.torusList = null;
this.nxyz = 0;
this.probeRadius = 1.5;
this.density = 1;
this.probesFilename = null;
this.probes = null;
this.vertices = null;
this.edges = null;
this.faces = null;
this.torii = null;
this.singleFace = 0;
this.maximumTorusEdges = 0;
this.maximumFaceEdges = 0;
this.selfIntersectingTorii = 0;
this.selfIntersectingProbes = 0;
this.distanceComparisons = 0;
this.tmesh = null;
this.desiredTriangleLength = 1.5;
this.targetLen = 0.0;
this.startTime = 0;
this.backgroundColor = 0;
this.qLength = null;
this.sphereEdges = null;
this.used = null;
this.convexFace = null;
this.sphereFace = null;
this.scount = 0;
this.v0 = null;
this.v1 = null;
this.euse = null;
this.ecount = 0;
this.vArray = null;
this.eArray = null;
this.pp0 = null;
this.pp1 = null;
this.pp2 = null;
this.pp3 = null;
this.npp0 = null;
this.npp1 = null;
this.npp2 = null;
this.npp3 = null;
this.circum = null;
this.tcp = null;
this.unclipped = null;
this.lastunclipped = null;
this.leuc = null;
this.debugColor = null;
this.invertn = null;
this.clipTolerance = 0.0;
this.sorted = null;
this.clippingProbes = null;
this.mid01 = null;
this.mid12 = null;
this.mid20 = null;
this.nmid01 = null;
this.nmid12 = null;
this.nmid20 = null;
this.pp = null;
this.ccij = null;
this.ccji = null;
this.tp = null;
this.ntp = null;
this.tmeshv = null;
this.pp2cij = null;
this.pp2cji = null;
this.n1 = null;
this.n2 = null;
this.torusEdges = null;
this.angles = null;
this.cij2v = null;
this.qij = null;
this.qji = null;
this.cusp = null;
this.nleft = null;
this.nright = null;
this.vx0 = null;
this.vx1 = null;
this.pint = null;
this.oldEdges = null;
this.probe0 = null;
this.probe1 = null;
this.cacheSphere = -1;
this.nnv = null;
this.pdir = null;
this.edgen = null;
this.otherv = null;
this.ab = null;
this.bc = null;
this.dd1 = null;
this.dd3 = null;
this.pos_d = null;
this.first = null;
this.count = null;
this.nn = null;
this.neighbourCount = 0;
this.commonNeighbours = null;
this.commonCount = 0;
this.sx = null;
this.snx = null;
this.tsx = null;
this.clipped = null;
this.hull = null;
this.nsp = 0;
this.si = null;
this.sj = null;
this.sk = null;
this.vn = null;
this.vncount = null;
this.tlist = null;
this.tcount = null;
this.nst = 0;
this.shortestEdge = 0.0;
this.longestEdge = 0.0;
this.currentLongestEdge = 0.0;
Clazz.instantialize (this, arguments);
}, astex.anasurface, "AnaSurface", null, astex.api.AstexAnaSurface);
Clazz.prepareFields (c$, function () {
this.probes =  new astex.util.DynamicArray ().set (1024, 0);
this.vertices =  new astex.util.DynamicArray ().set (1024, 0);
this.edges =  new astex.util.DynamicArray ().set (1024, 0);
this.faces =  new astex.util.DynamicArray ().set (1024, 0);
this.torii =  new astex.util.DynamicArray ().set (1024, 0);
this.tmesh =  new astex.render.Tmesh ();
this.backgroundColor = astex.util.Color32.white;
this.qLength = [0.0, 1.5, 0.9, 0.5, 0.3];
this.sphereEdges =  new Array (100);
this.used =  Clazz.newBooleanArray (100, false);
this.convexFace = astex.anasurface.Face.newType (1);
this.sphereFace = astex.anasurface.Face.newType (1);
this.v0 =  Clazz.newIntArray (10000, 0);
this.v1 =  Clazz.newIntArray (10000, 0);
this.euse =  Clazz.newIntArray (10000, 0);
this.vArray =  new astex.util.IntArray (64);
this.eArray =  new astex.util.IntArray (64);
this.pp0 =  Clazz.newDoubleArray (3, 0);
this.pp1 =  Clazz.newDoubleArray (3, 0);
this.pp2 =  Clazz.newDoubleArray (3, 0);
this.pp3 =  Clazz.newDoubleArray (3, 0);
this.npp0 =  Clazz.newDoubleArray (3, 0);
this.npp1 =  Clazz.newDoubleArray (3, 0);
this.npp2 =  Clazz.newDoubleArray (3, 0);
this.npp3 =  Clazz.newDoubleArray (3, 0);
this.circum =  Clazz.newDoubleArray (3, 0);
this.tcp =  Clazz.newDoubleArray (3, 0);
this.unclipped =  Clazz.newIntArray (3, 0);
this.lastunclipped =  Clazz.newIntArray (3, 0);
this.leuc =  Clazz.newIntArray (3, 0);
this.debugColor = [0xff781e, 0x4bc3ff, 0x37ffc3, 0xaaff00];
this.invertn =  Clazz.newDoubleArray (3, 0);
this.sorted =  new Array (3);
this.mid01 =  Clazz.newDoubleArray (3, 0);
this.mid12 =  Clazz.newDoubleArray (3, 0);
this.mid20 =  Clazz.newDoubleArray (3, 0);
this.nmid01 =  Clazz.newDoubleArray (3, 0);
this.nmid12 =  Clazz.newDoubleArray (3, 0);
this.nmid20 =  Clazz.newDoubleArray (3, 0);
this.pp =  Clazz.newDoubleArray (3, 0);
this.ccij =  Clazz.newDoubleArray (3, 0);
this.ccji =  Clazz.newDoubleArray (3, 0);
this.tp =  Clazz.newDoubleArray (3, 0);
this.ntp =  Clazz.newDoubleArray (3, 0);
this.tmeshv =  Clazz.newIntArray (100, 100, 0);
this.pp2cij =  Clazz.newDoubleArray (3, 0);
this.pp2cji =  Clazz.newDoubleArray (3, 0);
this.n1 =  Clazz.newDoubleArray (3, 0);
this.n2 =  Clazz.newDoubleArray (3, 0);
this.torusEdges =  new Array (1000);
this.angles =  Clazz.newDoubleArray (1000, 0);
this.cij2v =  Clazz.newDoubleArray (3, 0);
this.qij =  Clazz.newDoubleArray (3, 0);
this.qji =  Clazz.newDoubleArray (3, 0);
this.cusp =  Clazz.newDoubleArray (3, 0);
this.nleft =  Clazz.newDoubleArray (3, 0);
this.nright =  Clazz.newDoubleArray (3, 0);
this.vx0 =  Clazz.newDoubleArray (3, 0);
this.vx1 =  Clazz.newDoubleArray (3, 0);
this.pint =  Clazz.newDoubleArray (3, 0);
this.oldEdges =  new Array (100);
this.probe0 =  Clazz.newDoubleArray (3, 0);
this.probe1 =  Clazz.newDoubleArray (3, 0);
this.nnv =  Clazz.newDoubleArray (3, 0);
this.pdir =  Clazz.newDoubleArray (3, 0);
this.edgen =  Clazz.newDoubleArray (3, 0);
this.otherv =  Clazz.newDoubleArray (3, 0);
this.ab =  Clazz.newDoubleArray (3, 0);
this.bc =  Clazz.newDoubleArray (3, 0);
this.dd1 =  Clazz.newDoubleArray (3, 0);
this.dd3 =  Clazz.newDoubleArray (3, 0);
this.pos_d =  Clazz.newDoubleArray (3, 0);
this.sx =  Clazz.newDoubleArray (astex.anasurface.AnaSurface.MAX_SPHERE_POINTS, 3, 0);
this.snx =  Clazz.newDoubleArray (astex.anasurface.AnaSurface.MAX_SPHERE_POINTS, 3, 0);
this.tsx =  Clazz.newDoubleArray (astex.anasurface.AnaSurface.MAX_SPHERE_POINTS, 3, 0);
this.clipped =  Clazz.newIntArray (astex.anasurface.AnaSurface.MAX_SPHERE_POINTS, 0);
this.hull =  Clazz.newIntArray (astex.anasurface.AnaSurface.MAX_SPHERE_POINTS, 0);
this.si =  Clazz.newIntArray (astex.anasurface.AnaSurface.MAX_SPHERE_TRIANGLES, 0);
this.sj =  Clazz.newIntArray (astex.anasurface.AnaSurface.MAX_SPHERE_TRIANGLES, 0);
this.sk =  Clazz.newIntArray (astex.anasurface.AnaSurface.MAX_SPHERE_TRIANGLES, 0);
this.vncount =  Clazz.newIntArray (astex.anasurface.AnaSurface.MAX_SPHERE_POINTS, 0);
this.tcount =  Clazz.newIntArray (astex.anasurface.AnaSurface.MAX_SPHERE_POINTS, 0);
});
Clazz.makeConstructor (c$, 
function () {
});
Clazz.overrideMethod (c$, "construct", 
function (bgcolor, probeRadius, quality, x, r, visible, colors, n) {
this.xyz = x;
this.radius = r;
this.visible = visible;
this.colors = colors;
this.nxyz = n;
this.backgroundColor = bgcolor;
this.probeRadius = probeRadius;
if (quality > 0 && quality < this.qLength.length) {
this.density = quality;
this.desiredTriangleLength = this.qLength[quality];
}var startTime = System.currentTimeMillis ();
this.initialise ();
var then = System.currentTimeMillis ();
this.buildNeighbourList ();
astex.anasurface.AnaSurface.print ("# neighbour list generation time (ms)", (System.currentTimeMillis () - then));
then = System.currentTimeMillis ();
this.constructProbePlacements ();
astex.anasurface.AnaSurface.print ("# probe generation time (ms)", (System.currentTimeMillis () - then));
this.processTorii ();
this.triangulate ();
this.triangulateAtoms ();
var surfaceAtoms = 0;
var maximumVertices = 0;
for (var i = 0; i < this.nxyz; i++) {
if (this.edgeList[i] != null) {
surfaceAtoms++;
if (this.edgeList[i].size () > maximumVertices) {
maximumVertices = this.edgeList[i].size ();
}}}
astex.anasurface.AnaSurface.print ("surfaced atoms", surfaceAtoms);
astex.anasurface.AnaSurface.print ("maximum vertices ", maximumVertices);
astex.anasurface.AnaSurface.print ("total probe placements", this.probes.size ());
astex.anasurface.AnaSurface.print ("total vertices", this.vertices.size ());
astex.anasurface.AnaSurface.print ("total edges", this.edges.size ());
astex.anasurface.AnaSurface.print ("total faces", this.faces.size ());
astex.anasurface.AnaSurface.print ("single face torii", this.singleFace);
astex.anasurface.AnaSurface.print ("maximum torus edges", this.maximumTorusEdges);
astex.anasurface.AnaSurface.print ("maximum face edges", this.maximumFaceEdges);
astex.anasurface.AnaSurface.print ("self intersecting torii", this.selfIntersectingTorii);
astex.anasurface.AnaSurface.print ("self intersecting probes", this.selfIntersectingProbes);
astex.anasurface.AnaSurface.print ("distance comparisons", this.distanceComparisons);
astex.anasurface.AnaSurface.print ("total memory (Mb)", Clazz.doubleToInt (Runtime.getRuntime ().totalMemory () / 1000.));
if (this.probesFilename != null) {
this.outputProbes (this.probes, this.probesFilename);
}astex.anasurface.AnaSurface.print ("points in tmesh", this.tmesh.np);
astex.anasurface.AnaSurface.print ("triangles in tmesh", this.tmesh.nt);
astex.anasurface.AnaSurface.print ("(2n-4)", 2 * this.tmesh.np - 4);
astex.anasurface.AnaSurface.print ("# total surface generation time (s)", (System.currentTimeMillis () - startTime) * 0.001);
System.out.println ("starting decusp");
this.deCuspSurface (this.tmesh);
System.out.println ("done");
this.tmesh.setColorStyle (3);
return this.tmesh;
}, "~N,~N,~N,~A,~A,~A,~A,~N");
Clazz.defineMethod (c$, "deCuspSurface", 
 function (tmesh) {
var probeCount = this.probes.size ();
var l =  new astex.util.Lattice (this.probeRadius * 2.0);
for (var p = 0; p < probeCount; p++) {
var probe = this.probes.get (p);
l.add (p, probe.x[0], probe.x[1], probe.x[2]);
}
var neighbours =  new astex.util.IntArray ();
for (var i = 0; i < tmesh.np; i++) {
tmesh.v[i] = 0.0001;
neighbours.removeAllElements ();
l.getPossibleNeighbours (-1, tmesh.x[i], tmesh.y[i], tmesh.z[i], neighbours, true);
var neighbourCount = neighbours.size ();
var dmin = this.probeRadius;
for (var j = 0; j < neighbourCount; j++) {
var p = neighbours.get (j);
var probe = this.probes.get (p);
var d = this.distance (probe.x[0], probe.x[1], probe.x[2], tmesh.x[i], tmesh.y[i], tmesh.z[i]);
if (d < dmin) {
dmin = d;
}}
tmesh.v[i] = (this.probeRadius - dmin);
}
}, "astex.render.Tmesh");
Clazz.defineMethod (c$, "initialise", 
 function () {
this.radius2 =  Clazz.newDoubleArray (this.nxyz, 0);
this.rsq =  Clazz.newDoubleArray (this.nxyz, 0);
for (var i = 0; i < this.nxyz; i++) {
this.radius2[i] = this.radius[i] + this.probeRadius;
this.rsq[i] = this.radius2[i] * this.radius2[i];
}
this.edgeList =  new Array (this.nxyz);
this.probeList =  new Array (this.nxyz);
this.faceList =  new Array (this.nxyz);
this.vertexList =  new Array (this.nxyz);
this.torusList =  new Array (this.nxyz);
this.targetLen = this.desiredTriangleLength * this.desiredTriangleLength;
this.targetLen = Math.sqrt (0.5 * this.targetLen);
this.buildSphereTemplate (this.density);
});
Clazz.defineMethod (c$, "triangulateAtoms", 
function () {
for (var ia = 0; ia < this.nxyz; ia++) {
if (this.colors != null) {
}this.transformSphere (this.xyz[ia], this.radius[ia]);
this.triangulateSphere (ia);
}
});
Clazz.defineMethod (c$, "triangulate", 
function () {
var faceCount = this.faces.size ();
for (var i = faceCount - 1; i >= 0; i--) {
var f = this.faces.get (i);
var edgeCount = f.size ();
if (edgeCount == 4 && f.type == 2) {
this.processToroidalFace (f);
}}
for (var i = 0; i < faceCount; i++) {
var f = this.faces.get (i);
var edgeCount = f.size ();
if (!(edgeCount == 4 && f.type == 2)) {
if (f.skip == false) {
this.processFace (f);
}}}
});
Clazz.defineMethod (c$, "processFace", 
function (f) {
var edgeCount = f.size ();
if (f.type == 4) {
this.processUndefinedFace (f);
} else if (edgeCount == 4 && f.type == 2) {
this.processToroidalFace (f);
} else {
this.processIrregularFace (f, -1);
}}, "astex.anasurface.Face");
Clazz.defineMethod (c$, "processUndefinedFace", 
 function (f) {
if (f.size () != 3) {
System.out.println ("undefined face has edges " + f.size ());
}var e0 = f.get (0);
var e1 = f.get (1);
var e2 = f.get (2);
this.meshAddTriangle (e0.v0.vi, e1.v0.vi, e2.v0.vi);
}, "astex.anasurface.Face");
Clazz.defineMethod (c$, "processIrregularFace", 
 function (f, ia) {
if (f.cen == null) {
System.out.println ("face has null center, skipping");
return;
}if (f.type == 3) {
this.transformSphere (f.cen, f.r);
}if (f.type != 4) {
this.clipSphere (f, ia);
this.addWholeTriangles (f);
}this.processConvexFace (f);
}, "astex.anasurface.Face,~N");
Clazz.defineMethod (c$, "triangulateSphere", 
 function (ia) {
if (this.edgeList[ia] == null) {
return;
}this.convexFace.type = 1;
this.copy (this.xyz[ia], this.convexFace.cen);
this.convexFace.r = this.radius[ia];
var ecount = this.edgeList[ia].size ();
this.scount = 0;
this.sphereFace.removeAllElements ();
for (var i = 0; i < ecount; i++) {
var e = this.edgeList[ia].get (i);
if (e.v0.i == ia && e.v1.i == ia) {
this.sphereFace.add (e);
}}
var unusedEdges = this.sphereFace.size ();
for (var i = 0; i < unusedEdges; i++) {
this.used[i] = false;
}
while (unusedEdges != 0) {
this.convexFace.removeAllElements ();
var firstEdge = null;
var lastEdge = null;
var previousEdge = null;
var addedEdge = false;
do {
addedEdge = false;
for (var i = 0; i < this.sphereFace.size (); i++) {
if (!this.used[i]) {
var currentEdge = this.sphereFace.get (i);
if (this.convexFace.size () > 0) {
previousEdge = this.convexFace.getReverse (0);
if (previousEdge.v1.vi == currentEdge.v0.vi) {
this.convexFace.add (currentEdge);
this.used[i] = true;
unusedEdges--;
addedEdge = true;
break;
}} else {
this.convexFace.add (currentEdge);
this.used[i] = true;
unusedEdges--;
addedEdge = true;
break;
}}}
firstEdge = this.convexFace.get (0);
lastEdge = this.convexFace.getReverse (0);
} while (lastEdge.v1.vi != firstEdge.v0.vi && addedEdge != false);
if (addedEdge == false) {
System.out.println ("failed to extend contact face");
this.sphereFace.print ("faulty sphere face");
} else {
if (this.convexFace.size () > 0) {
this.processIrregularFace (this.convexFace, ia);
}}}
}, "~N");
Clazz.defineMethod (c$, "processConvexFace", 
 function (f) {
this.vArray.removeAllElements ();
this.eArray.removeAllElements ();
if (f.type == 3 && f.size () > 3) {
System.out.println ("concave edge count " + f.size ());
}for (var i = 0; i < 10000; i++) {
this.euse[i] = 0;
}
var edgeCount = f.size ();
if (edgeCount > this.maximumFaceEdges) {
this.maximumFaceEdges = edgeCount;
}if (edgeCount > 31) {
System.out.println ("aaagh! more than 31 edges on a face");
System.exit (1);
}for (var i = 0; i < edgeCount; i++) {
var e = f.get (i);
var nv = e.size ();
if (nv == 0) {
System.out.println ("Edge has no vertices!!!!!\n!!!!\n!!!!");
}for (var j = 0; j < nv - 1; j++) {
if (astex.anasurface.AnaSurface.debug) {
astex.io.FILE.out.printFI ("adding to vlist %4d\n", e.get (j));
}this.vArray.add (e.get (j));
var edgeMask = (1 << i);
if (j == 0) {
var prevEdge = i - 1;
if (prevEdge == -1) {
prevEdge = edgeCount - 1;
}edgeMask |= (1 << prevEdge);
}this.eArray.add (edgeMask);
}
}
var nv = this.vArray.size ();
var vlist = this.vArray.getArray ();
var elist = this.eArray.getArray ();
if (astex.anasurface.AnaSurface.debug) {
for (var i = 0; i < nv; i++) {
astex.io.FILE.out.printFI ("v[%04d] = ", i);
astex.io.FILE.out.printFI ("%04d mask ", vlist[i]);
for (var ee = 10; ee >= 0; ee--) {
if ((elist[i] & (1 << ee)) != 0) {
System.out.print ("1");
} else {
System.out.print ("0");
}}
System.out.println ("");
}
}this.ecount = 0;
for (var i = 0; i < nv; i++) {
var i1 = i + 1;
if (i1 == nv) {
i1 = 0;
}var v0 = vlist[i];
var v1 = vlist[i1];
if (astex.anasurface.AnaSurface.debug) {
astex.io.FILE.out.printFI ("checking edge %4d", v0);
astex.io.FILE.out.printFI (" %4d\n", v1);
}if (elist[i] != 0 && elist[i1] != 0) {
this.addEdgePair (v0, v1, false);
}}
if (astex.anasurface.AnaSurface.debug) System.out.println ("after edges edge count " + this.ecount);
if (f.type != 4) {
for (var i = 0; i < this.nsp; i++) {
if (this.hull[i] == 1) {
this.vArray.add (this.clipped[i]);
this.eArray.add (0);
}}
for (var i = 0; i < this.nst; i++) {
this.addBoundaryEdgeIfNeeded (this.si[i], this.sj[i]);
this.addBoundaryEdgeIfNeeded (this.sj[i], this.sk[i]);
this.addBoundaryEdgeIfNeeded (this.sk[i], this.si[i]);
}
}if (astex.anasurface.AnaSurface.debug) System.out.println ("after boundary edge count " + this.ecount);
if (astex.anasurface.AnaSurface.debug) System.out.println ("after clipping point count " + this.vArray.size ());
this.addTriangles (f);
}, "astex.anasurface.Face");
Clazz.defineMethod (c$, "addBoundaryEdgeIfNeeded", 
 function (svi, svj) {
if (this.hull[svi] == 1 && this.hull[svj] == 1) {
if (this.getHullCount (svi) < 3 && this.getHullCount (svj) < 3) {
this.addEdgePair (svi, svj, true);
}}}, "~N,~N");
Clazz.defineMethod (c$, "edgePairCount", 
function (vv0, vv1) {
if (vv0 > vv1) {
var tmp = vv0;
vv0 = vv1;
vv1 = tmp;
}for (var i = 0; i < this.ecount; i++) {
if (this.v0[i] == vv0 && this.v1[i] == vv1) {
return this.euse[i];
}}
return 0;
}, "~N,~N");
Clazz.defineMethod (c$, "addEdgePair", 
function (vv0, vv1, lookup) {
if (vv0 == vv1) {
astex.util.Log.error ("vv0 == vv1");
}if (astex.anasurface.AnaSurface.debug) {
System.out.println ("addEdgePair " + vv0 + " " + vv1);
}if (vv0 > vv1) {
var tmp = vv0;
vv0 = vv1;
vv1 = tmp;
}if (lookup) {
for (var i = 0; i < this.ecount; i++) {
if (this.v0[i] == vv0 && this.v1[i] == vv1) {
if (astex.anasurface.AnaSurface.debug) {
astex.io.FILE.out.printFI ("addEdgePair %4d", vv0);
astex.io.FILE.out.printFI (" %4d", vv1);
astex.io.FILE.out.printFI (" euse %d\n", this.euse[i]);
}if (this.euse[i] >= 2) {
astex.io.FILE.out.printFI ("### edge already used twice %4d", vv0);
astex.io.FILE.out.printFI (" %4d\n", vv1);
}this.euse[i]++;
return i;
}}
}this.v0[this.ecount] = vv0;
this.v1[this.ecount] = vv1;
this.euse[this.ecount] = 1;
return this.ecount++;
}, "~N,~N,~B");
Clazz.defineMethod (c$, "addTriangles", 
function (f) {
var nv = this.vArray.size ();
var vlist = this.vArray.getArray ();
var elist = this.eArray.getArray ();
var rlim = this.currentLongestEdge * 1.5;
rlim *= rlim;
if (astex.anasurface.AnaSurface.debug) {
System.out.println ("vertex list");
for (var i = 0; i < nv; i++) {
astex.io.FILE.out.printFI ("v[%03d] = ", i);
astex.io.FILE.out.printFI ("%03d\n", vlist[i]);
}
System.out.println ("vertex list end");
}var nev = 0;
for (var i = 0; i < nv; i++) {
if (elist[i] == 0) {
nev = i;
break;
}}
if (astex.anasurface.AnaSurface.debug) System.out.println ("nev " + nev);
for (var iteration = 0; iteration < 3; iteration++) {
for (var i = 0; i < nv - 2; i++) {
var vi = vlist[i];
this.tmesh.getVertex (vi, this.pp0, this.npp0);
for (var j = i + 1; j < nv - 1; j++) {
var vj = vlist[j];
if (astex.anasurface.AnaSurface.debug) astex.io.FILE.out.printFI ("checking edge %3d ", vi);
if (astex.anasurface.AnaSurface.debug) astex.io.FILE.out.printFI ("%3d\n", vj);
if ((elist[i] & elist[j]) != 0) {
var ji = j - i;
if (ji > 1 && ji < nev - 1) {
if (astex.anasurface.AnaSurface.debug) {
System.out.println ("skipping points not edge neighbours");
System.out.println ("and " + (elist[i] & elist[j]));
System.out.println ("j - i " + (j - i));
}continue;
}}this.tmesh.getVertex (vj, this.pp1, this.npp1);
if (astex.anasurface.AnaSurface.distance2 (this.pp0, this.pp1) > rlim) {
if (astex.anasurface.AnaSurface.debug) System.out.println ("skipping edge points not close enough");
continue;
}for (var k = j + 1; k < nv; k++) {
var vk = vlist[k];
if (astex.anasurface.AnaSurface.debug) {
astex.io.FILE.out.printFI ("checking %3d ", vi);
astex.io.FILE.out.printFI ("%3d ", vj);
astex.io.FILE.out.printFI ("%3d\n", vk);
}var perimeterCount = 0;
if (elist[i] != 0) perimeterCount++;
if (elist[j] != 0) perimeterCount++;
if (elist[k] != 0) perimeterCount++;
if (perimeterCount == 0) {
if (astex.anasurface.AnaSurface.debug) System.out.println ("skipping all interior");
continue;
}if (((elist[i] & elist[j]) & elist[k]) != 0) {
if (astex.anasurface.AnaSurface.debug) System.out.println ("skipping all same edge");
continue;
}if (iteration < 2 && perimeterCount == 3) {
if (astex.anasurface.AnaSurface.debug) System.out.println ("skipping all perimeter");
continue;
}this.tmesh.getVertex (vk, this.pp2, this.npp2);
if (astex.anasurface.AnaSurface.distance2 (this.pp1, this.pp2) > rlim || astex.anasurface.AnaSurface.distance2 (this.pp2, this.pp0) > rlim) {
if (astex.anasurface.AnaSurface.debug) System.out.println ("skipping edges too long");
continue;
}var tok = true;
var rc = this.circumCircle (this.circum, this.pp0, this.pp1, this.pp2);
if (rc == Infinity) {
if (astex.anasurface.AnaSurface.debug) System.out.println ("## no solution for circumCircle");
continue;
}rc *= rc;
for (var l = 0; l < nv; l++) {
if (l != i && l != j && l != k) {
var vl = vlist[l];
this.tmesh.getVertex (vl, this.pp3, null);
if (astex.anasurface.AnaSurface.distance2 (this.circum, this.pp3) < rc) {
if (astex.anasurface.AnaSurface.debug) System.out.println ("skipping delaunay violation");
tok = false;
break;
}}}
if (tok) {
if (this.edgePairCount (vj, vk) == 2) {
if (astex.anasurface.AnaSurface.debug) System.out.println ("skipping edges used");
continue;
}if (this.edgePairCount (vk, vi) == 2) {
if (astex.anasurface.AnaSurface.debug) System.out.println ("skipping edges used");
continue;
}if (this.edgePairCount (vi, vj) == 2) {
if (astex.anasurface.AnaSurface.debug) System.out.println ("skipping edges used");
continue;
}this.addIfAcceptable (vi, this.pp0, this.npp0, vj, this.pp1, this.npp1, vk, this.pp2, this.npp2, f);
}}
}
}
}
if (astex.anasurface.AnaSurface.debug) System.out.println ("end");
if (astex.anasurface.AnaSurface.debug) this.printIfNotComplete ();
}, "astex.anasurface.Face");
Clazz.defineMethod (c$, "printIfNotComplete", 
 function () {
var printit = false;
for (var i = 0; i < this.ecount; i++) {
if (this.v0[i] > this.v1[i]) {
System.out.println ("error disordered edge");
}if (this.euse[i] != 2) {
printit = true;
break;
}}
if (printit) {
System.out.println ("vertex count " + this.vArray.size ());
for (var i = 0; i < this.ecount; i++) {
if (this.euse[i] != 2) {
astex.io.FILE.out.printFI ("edge[%03d] =", i);
astex.io.FILE.out.printFI (" %4d", this.v0[i]);
astex.io.FILE.out.printFI (",%4d", this.v1[i]);
astex.io.FILE.out.printFI (" count = %d\n", this.euse[i]);
}}
}});
Clazz.defineMethod (c$, "addIfAcceptable", 
function (vi, ppi, nppi, vj, ppj, nppj, vk, ppk, nppk, f) {
if (vi == 169 && vj == 654 && vk == 655) {
var e =  new Exception ();
e.printStackTrace ();
}var ec0 = this.edgePairCount (vi, vj);
var ec1 = this.edgePairCount (vj, vk);
var ec2 = this.edgePairCount (vk, vi);
if (ec0 < 2 && ec1 < 2 && ec2 < 2) {
this.addEdgePair (vi, vj, true);
this.addEdgePair (vj, vk, true);
this.addEdgePair (vk, vi, true);
this.meshAddTriangle (vi, vj, vk);
} else {
astex.io.FILE.out.printS ("#### try to add triangle where edges are in use\n");
astex.io.FILE.out.printFI ("%4d ", vi);
astex.io.FILE.out.printFI ("%4d ", vj);
astex.io.FILE.out.printFI ("%4d\n", vk);
if (ec0 < 2) {
astex.io.FILE.out.printFI ("edge %4d-", vi);
astex.io.FILE.out.printFI ("%4d\n", vj);
}if (ec1 < 2) {
astex.io.FILE.out.printFI ("edge %4d-", vj);
astex.io.FILE.out.printFI ("%4d\n", vk);
}if (ec2 < 2) {
astex.io.FILE.out.printFI ("edge %4d-", vk);
astex.io.FILE.out.printFI ("%4d\n", vi);
}}}, "~N,~A,~A,~N,~A,~A,~N,~A,~A,astex.anasurface.Face");
Clazz.defineMethod (c$, "circumCircle", 
function (cc, p1, p2, p3) {
var d1 = 0.0;
var d2 = 0.0;
var d3 = 0.0;
for (var i = 0; i < 3; i++) {
d1 += (p3[i] - p1[i]) * (p2[i] - p1[i]);
d2 += (p3[i] - p2[i]) * (p1[i] - p2[i]);
d3 += (p1[i] - p3[i]) * (p2[i] - p3[i]);
}
var c1 = d2 * d3;
var c2 = d1 * d3;
var c3 = d1 * d2;
var c = c1 + c2 + c3;
var ccc = 2. * c;
var c2c3 = (c2 + c3) / ccc;
var c3c1 = (c3 + c1) / ccc;
var c1c2 = (c1 + c2) / ccc;
for (var i = 0; i < 3; i++) {
cc[i] = (c2c3 * p1[i] + c3c1 * p2[i] + c1c2 * p3[i]);
}
return astex.anasurface.AnaSurface.distance (cc, p1);
}, "~A,~A,~A,~A");
Clazz.defineMethod (c$, "meshAddTriangle", 
function (v0, v1, v2) {
if (v0 == 0 && v1 == 0 && v2 == 0) {
try {
var e =  new RuntimeException ("");
e.printStackTrace ();
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
} else {
throw e;
}
}
}this.tmesh.addTriangle (v0, v1, v2, this.debugColor[this.tmesh.nt % this.debugColor.length]);
}, "~N,~N,~N");
Clazz.defineMethod (c$, "clippedByProbes", 
function (v0, v1, v2) {
if (this.clippingProbes != null) {
var cpc = this.clippingProbes.size ();
for (var i = 0; i < cpc; i++) {
var p = this.clippingProbes.get (i);
if (this.tmesh.distance (v0, p.x) < p.r && this.tmesh.distance (v1, p.x) < p.r && this.tmesh.distance (v2, p.x) < p.r) {
System.out.println ("!! triangle removed by clipping");
return true;
}}
}return false;
}, "~N,~N,~N");
Clazz.defineMethod (c$, "addTriangle", 
function (t) {
var sit = this.si[t];
var sjt = this.sj[t];
var skt = this.sk[t];
var v0 = this.tmesh.addPointXYZ (this.tsx[sit], this.snx[sit], 0.0, 0.0);
var v1 = this.tmesh.addPointXYZ (this.tsx[sjt], this.snx[sjt], 0.0, 0.0);
var v2 = this.tmesh.addPointXYZ (this.tsx[skt], this.snx[skt], 0.0, 0.0);
this.tmesh.addTriangle (v0, v1, v2, 0);
}, "~N");
c$.intersect = Clazz.defineMethod (c$, "intersect", 
function (p1, p2, p3, p4, pa, pb) {
astex.anasurface.AnaSurface.vector (astex.anasurface.AnaSurface.u, p1, p2);
astex.anasurface.AnaSurface.vector (astex.anasurface.AnaSurface.v, p3, p4);
astex.anasurface.AnaSurface.vector (astex.anasurface.AnaSurface.w, p3, p1);
var a = astex.anasurface.AnaSurface.dot (astex.anasurface.AnaSurface.u, astex.anasurface.AnaSurface.u);
var b = astex.anasurface.AnaSurface.dot (astex.anasurface.AnaSurface.u, astex.anasurface.AnaSurface.v);
var c = astex.anasurface.AnaSurface.dot (astex.anasurface.AnaSurface.v, astex.anasurface.AnaSurface.v);
var d = astex.anasurface.AnaSurface.dot (astex.anasurface.AnaSurface.u, astex.anasurface.AnaSurface.w);
var e = astex.anasurface.AnaSurface.dot (astex.anasurface.AnaSurface.v, astex.anasurface.AnaSurface.w);
var D = a * c - b * b;
var sc;
var sN;
var sD = D;
var tc;
var tN;
var tD = D;
if (D < astex.anasurface.AnaSurface.EPS) {
sN = 0.0;
tN = e;
tD = c;
} else {
sN = (b * e - c * d);
tN = (a * e - b * d);
if (sN < 0) {
sN = 0.0;
tN = e;
tD = c;
} else if (sN > sD) {
sN = sD;
tN = e + b;
tD = c;
}}if (tN < 0) {
tN = 0.0;
if (-d < 0) sN = 0.0;
 else if (-d > a) sN = sD;
 else {
sN = -d;
sD = a;
}} else if (tN > tD) {
tN = tD;
if ((-d + b) < 0) sN = 0;
 else if ((-d + b) > a) sN = sD;
 else {
sN = (-d + b);
sD = a;
}}sc = sN / sD;
tc = tN / tD;
var dist = 0.0;
var di = 0.0;
for (var i = 0; i < 3; i++) {
di = astex.anasurface.AnaSurface.w[i] + (sc * astex.anasurface.AnaSurface.u[i]) - (tc * astex.anasurface.AnaSurface.v[i]);
dist += di * di;
}
return Math.sqrt (dist);
}, "~A,~A,~A,~A,~A,~A");
Clazz.defineMethod (c$, "clipSphere", 
function (f, ia) {
var edgeCount = f.size ();
for (var isp = 0; isp < this.nsp; isp++) {
this.clipped[isp] = -1;
}
this.clipTolerance = -0.15 * this.currentLongestEdge;
if (ia == -1) {
for (var a = 0; a < edgeCount; a++) {
var e = f.get (a);
for (var isp = 0; isp < this.nsp; isp++) {
if (this.clipped[isp] == -1) {
if (this.plane_eqn (this.tsx[isp], e.cen, e.n) > this.clipTolerance) {
this.clipped[isp] = -2;
}}}
}
} else {
for (var a = 0; a < this.count[ia]; a++) {
var j = this.nn[this.first[ia] + a];
astex.anasurface.AnaSurface.torusAxisUnitVector (astex.anasurface.AnaSurface.uij, this.xyz[ia], this.xyz[j]);
for (var isp = 0; isp < this.nsp; isp++) {
if (this.clipped[isp] == -1) {
if (this.plane_eqn (this.tsx[isp], astex.anasurface.AnaSurface.cij, astex.anasurface.AnaSurface.uij) > this.clipTolerance) {
this.clipped[isp] = -2;
}}}
}
}for (var ii = 0; ii < this.nsp; ii++) {
this.hull[ii] = 0;
if (this.clipped[ii] == -1) {
var nc = this.vncount[ii];
for (var j = 0; j < nc; j++) {
if (this.clipped[this.vn[ii][j]] == -2) {
this.hull[ii] = 1;
break;
}}
}}
for (var isp = 0; isp < this.nsp; isp++) {
if (this.clipped[isp] == -1) {
if (f.type == 3) {
this.invertn[0] = -this.snx[isp][0];
this.invertn[1] = -this.snx[isp][1];
this.invertn[2] = -this.snx[isp][2];
this.clipped[isp] = this.tmesh.addPointXYZ (this.tsx[isp], this.invertn, 0.0, 0.0);
if (astex.anasurface.AnaSurface.debug) {
this.tmesh.addSphere (this.tsx[isp][0], this.tsx[isp][1], this.tsx[isp][2], 0.05, astex.util.Color32.red);
}var color = this.colorPoint (f, this.tsx[isp]);
this.tmesh.vcolor[this.clipped[isp]] = color;
} else {
this.clipped[isp] = this.tmesh.addPointXYZ (this.tsx[isp], this.snx[isp], 0.0, 0.0);
this.tmesh.vcolor[this.clipped[isp]] = this.colors[ia];
}}}
}, "astex.anasurface.Face,~N");
Clazz.defineMethod (c$, "colorPoint", 
function (f, p) {
var v0 = (f.get (0)).v0;
var v1 = (f.get (1)).v0;
var v2 = (f.get (2)).v0;
var d0 = this.distance (p[0], p[1], p[2], v0.x[0], v0.x[1], v0.x[2]);
var d1 = this.distance (p[0], p[1], p[2], v1.x[0], v1.x[1], v1.x[2]);
var d2 = this.distance (p[0], p[1], p[2], v2.x[0], v2.x[1], v2.x[2]);
var sum = 2.0 * (d0 + d1 + d2);
var comp0 = (d1 + d2) / sum;
var comp1 = (d0 + d2) / sum;
var comp2 = (d0 + d1) / sum;
var r = 0;
var g = 0;
var b = 0;
r += comp0 * astex.util.Color32.getRed (this.colors[v0.i]);
r += comp1 * astex.util.Color32.getRed (this.colors[v1.i]);
r += comp2 * astex.util.Color32.getRed (this.colors[v2.i]);
g += comp0 * astex.util.Color32.getGreen (this.colors[v0.i]);
g += comp1 * astex.util.Color32.getGreen (this.colors[v1.i]);
g += comp2 * astex.util.Color32.getGreen (this.colors[v2.i]);
b += comp0 * astex.util.Color32.getBlue (this.colors[v0.i]);
b += comp1 * astex.util.Color32.getBlue (this.colors[v1.i]);
b += comp2 * astex.util.Color32.getBlue (this.colors[v2.i]);
return astex.util.Color32.pack (r, g, b);
}, "astex.anasurface.Face,~A");
Clazz.defineMethod (c$, "addWholeTriangles", 
function (f) {
for (var t = 0; t < this.nst; t++) {
if (this.clipped[this.si[t]] >= 0 && this.clipped[this.sj[t]] >= 0 && this.clipped[this.sk[t]] >= 0) {
this.meshAddTriangle (this.clipped[this.si[t]], this.clipped[this.sj[t]], this.clipped[this.sk[t]]);
}}
}, "astex.anasurface.Face");
Clazz.defineMethod (c$, "transformSphere", 
function (xs, rs) {
for (var i = 0; i < this.nsp; i++) {
this.clipped[i] = -1;
for (var j = 0; j < 3; j++) {
this.tsx[i][j] = xs[j] + this.sx[i][j] * rs;
}
}
this.currentLongestEdge = rs * this.longestEdge;
}, "~A,~N");
Clazz.defineMethod (c$, "processToroidalFace", 
function (f) {
this.triangulateToroidalFace (f);
}, "astex.anasurface.Face");
Clazz.defineMethod (c$, "triangulateToroidalFace", 
 function (f) {
var t = f.torus;
var e0 = f.get (0);
var e1 = f.get (1);
var e2 = f.get (2);
var e3 = f.get (3);
var a0 = f.startAngle;
var a1 = f.stopAngle;
if (e2.v0.i != t.j) {
System.out.println ("t.i " + t.i + " t.j " + t.j);
System.out.println ("e0.v0.i " + e0.v0.i + " e0.v1.i " + e0.v1.i);
System.out.println ("e1.v0.i " + e1.v0.i + " e1.v1.i " + e1.v1.i);
System.out.println ("e2.v0.i " + e2.v0.i + " e2.v1.i " + e2.v1.i);
System.out.println ("e3.v0.i " + e3.v0.i + " e3.v1.i " + e3.v1.i);
}if (a1 < a0) {
a1 += 6.283185307179586;
}if (a0 > a1) {
System.out.println ("angle error ");
}var effectiveArc = t.rcij;
if (t.rcji > effectiveArc) {
effectiveArc = t.rcji;
}var arcLength = (a1 - a0) * (effectiveArc);
var tpcount = 2 + Clazz.doubleToInt (arcLength / this.targetLen);
var tpcount1 = tpcount - 1;
var angle = a0;
var wrapAngle = 0.0;
var wrapAngleStep = 0.0;
var nwap = 0;
var step = (a1 - a0) / (tpcount1);
e2.setCapacity (tpcount);
e3.setCapacity (tpcount);
for (var a = 0; a < tpcount; a++) {
if (angle > a1) {
angle = a1;
}var sina = Math.sin (angle);
var cosa = Math.cos (angle);
for (var i = 0; i < 3; i++) {
var component = t.uijnorm2[i] * sina + t.uijnorm[i] * cosa;
this.pp[i] = t.tij[i] + t.rij * component;
this.ccij[i] = f.iij[i] + t.rcij * component;
this.ccji[i] = f.iji[i] + t.rcji * component;
}
astex.anasurface.AnaSurface.vector (this.pp2cij, this.pp, this.ccij);
astex.anasurface.AnaSurface.vector (this.pp2cji, this.pp, this.ccji);
wrapAngle = this.angle (this.pp2cij, this.pp2cji);
astex.anasurface.AnaSurface.cross (this.n1, this.pp2cij, this.pp2cji);
astex.anasurface.AnaSurface.cross (this.n2, this.n1, this.pp2cij);
this.normalise (this.n2);
this.normalise (this.pp2cij);
var wrapArcLength = wrapAngle * this.probeRadius;
nwap = 2 + Clazz.doubleToInt (wrapArcLength / this.targetLen);
var nwap1 = nwap - 1;
wrapAngleStep = wrapAngle / (nwap1);
if (a == 0) {
e0.setCapacity (nwap);
e1.setCapacity (nwap);
}var wa = 0.0;
for (var ii = 0; ii < nwap; ii++) {
var sinwa = Math.sin (wa);
var coswa = Math.cos (wa);
if (wa > wrapAngle) {
wa = wrapAngle;
}for (var i = 0; i < 3; i++) {
this.ntp[i] = coswa * this.pp2cij[i] + sinwa * this.n2[i];
this.tp[i] = this.probeRadius * this.ntp[i] + this.pp[i];
this.ntp[i] = -this.ntp[i];
}
var vid = 0;
if (a == 0 && ii == 0) {
vid = e0.v0.vi;
} else if (a == 0 && ii == nwap1) {
vid = e0.v1.vi;
} else if (a == tpcount1 && ii == nwap1) {
vid = e1.v0.vi;
} else if (a == tpcount1 && ii == 0) {
vid = e1.v1.vi;
} else {
vid = this.tmesh.addPointXYZ (this.tp, this.ntp, 0.0, 0.0);
}this.tmeshv[a][ii] = vid;
var colorFrac = ii / (nwap - 1);
this.tmesh.vcolor[vid] = astex.util.Color32.blendF (this.colors[t.i], this.colors[t.j], 1. - colorFrac);
if (a == 0) e0.set (ii, vid);
if (a == tpcount1) e1.set (nwap1 - ii, vid);
if (ii == 0) e3.set (tpcount1 - a, vid);
if (ii == nwap1) e2.set (a, vid);
wa += wrapAngleStep;
}
if (!astex.anasurface.AnaSurface.debug) {
if (a > 0) {
for (var ii = 0; ii < nwap1; ii++) {
this.meshAddTriangle (this.tmeshv[a - 1][ii], this.tmeshv[a][ii], this.tmeshv[a - 1][ii + 1]);
this.meshAddTriangle (this.tmeshv[a][ii], this.tmeshv[a - 1][ii + 1], this.tmeshv[a][ii + 1]);
}
}}angle += step;
}
}, "astex.anasurface.Face");
Clazz.defineMethod (c$, "processTorus", 
 function (t) {
var edgeCount = t.edges.size ();
if (edgeCount == 0) {
System.out.println ("!!! torus with no edges!!!!");
return;
}if (edgeCount % 2 != 0) {
System.out.println ("atom i " + t.i + " j " + t.j);
System.out.println ("odd number of edges " + edgeCount);
return;
}for (var i = 0; i < edgeCount; i++) {
this.torusEdges[i] = t.edges.get (i);
}
for (var ee = 0; ee < edgeCount; ee++) {
var e = this.torusEdges[ee];
if (e.v0.i == t.i) {
astex.anasurface.AnaSurface.vector (this.cij2v, t.cij, e.v0.x);
} else if (e.v1.i == t.i) {
astex.anasurface.AnaSurface.vector (this.cij2v, t.cij, e.v1.x);
} else {
System.out.println ("edge doesn't involve i " + t.i);
System.out.println ("edge has " + e.v0.i + "," + e.v1.i);
}this.angles[ee] = this.angle (this.cij2v, t.uijnorm, t.uijnorm2);
}
for (var ia = 0; ia < edgeCount - 1; ia++) {
for (var ja = 0; ja < edgeCount - 1 - ia; ja++) {
if (this.angles[ja + 1] > this.angles[ja]) {
var tmp = this.angles[ja];
this.angles[ja] = this.angles[ja + 1];
this.angles[ja + 1] = tmp;
var etmp = this.torusEdges[ja];
this.torusEdges[ja] = this.torusEdges[ja + 1];
this.torusEdges[ja + 1] = etmp;
}}
}
for (var ee = 0; ee < edgeCount - 1; ee++) {
if (this.angles[ee] < this.angles[ee + 1]) {
System.out.println ("!!!! error sorting vertex angles " + t.i + "," + t.j);
}}
for (var ee = 0; ee < edgeCount; ee += 2) {
var e0 = this.torusEdges[ee];
var ee1 = 0;
var e1 = null;
if (e0.v1.i == t.i) {
ee1 = ee + 1;
} else {
ee1 = ee - 1;
if (ee1 == -1) {
ee1 = edgeCount - 1;
}}e1 = this.torusEdges[ee1];
if (e0.v0.i != e1.v1.i || e0.v1.i != e1.v0.i) {
System.out.println ("!! unpaired edges");
}var e2 = null;
var e3 = null;
e2 = this.addEdge (e0.v1, e1.v0, t);
e3 = this.addEdge (e1.v1, e0.v0, t);
var f = astex.anasurface.Face.newType (2);
f.torus = t;
this.copy (t.cij, f.iij);
this.copy (t.cji, f.iji);
this.faces.add (f);
if (e0.v1.i == t.i) {
f.startAngle = this.angles[ee1];
f.stopAngle = this.angles[ee];
f.add (e1);
f.add (e0);
f.add (e3);
f.add (e2);
} else {
f.startAngle = this.angles[ee];
f.stopAngle = this.angles[ee1];
f.add (e0);
f.add (e1);
f.add (e2);
f.add (e3);
}}
if (edgeCount > this.maximumTorusEdges) {
this.maximumTorusEdges = edgeCount;
}}, "astex.anasurface.Torus");
Clazz.defineMethod (c$, "replaceProbeEdges", 
function (olde, e0, e1, e2) {
var probeFace = olde.probeFace;
if (olde.v0 !== e0.v0 || olde.v1 !== e2.v1 || e0.v1 !== e1.v0 || e1.v1 !== e2.v0) {
System.out.println ("replacement edges don't span same vertices");
System.out.println ("olde.v0 " + olde.v0.vi + " olde.v1 " + olde.v1.vi);
System.out.println ("e0.v0 " + e0.v0.vi + " e0.v1 " + e0.v1.vi);
System.out.println ("e1.v0 " + e1.v0.vi + " e1.v1 " + e1.v1.vi);
System.out.println ("e2.v0 " + e2.v0.vi + " e2.v1 " + e2.v1.vi);
return;
}if (probeFace == null) {
System.out.println ("edge had no probe in replaceProbeEdges");
return;
}if (probeFace.contains (olde) == false) {
System.out.println ("face didn't contain old edge...");
return;
}var edgeCount = probeFace.size ();
for (var i = 0; i < edgeCount; i++) {
this.oldEdges[i] = probeFace.get (i);
}
probeFace.removeAllElements ();
for (var i = 0; i < edgeCount; i++) {
if (this.oldEdges[i] === olde) {
probeFace.add (e0);
probeFace.add (e1);
probeFace.add (e2);
} else {
probeFace.add (this.oldEdges[i]);
}}
if (probeFace.isValid () == false) {
System.out.println ("new probeFace is not valid");
}}, "astex.anasurface.Edge,astex.anasurface.Edge,astex.anasurface.Edge,astex.anasurface.Edge");
Clazz.defineMethod (c$, "contactCircle", 
 function (cij, ai, ri, aj, rj) {
var rip = ri + this.probeRadius;
var rij = astex.anasurface.AnaSurface.torusCenter (astex.anasurface.AnaSurface.tij, ai, ri, aj, rj, this.probeRadius);
for (var ii = 0; ii < 3; ii++) {
cij[ii] = (ri * astex.anasurface.AnaSurface.tij[ii] + this.probeRadius * ai[ii]) / rip;
}
return rij * ri / (rip);
}, "~A,~A,~N,~A,~N");
Clazz.defineMethod (c$, "processTorii", 
 function () {
var toriiCount = this.torii.size ();
for (var i = 0; i < toriiCount; i++) {
var t = this.torii.get (i);
this.processTorus (t);
}
});
Clazz.defineMethod (c$, "constructProbePlacements", 
 function () {
var tripletCount = 0;
for (var i = 0; i < this.nxyz; i++) {
for (var a = 0; a < this.count[i]; a++) {
var j = this.nn[this.first[i] + a];
if (j > i) {
this.commonCount = astex.anasurface.AnaSurface.commonElements (this.nn, this.first[i], this.count[i], this.nn, this.first[j], this.count[j], this.commonNeighbours);
for (var b = 0; b < this.commonCount; b++) {
var k = this.commonNeighbours[b];
if (k > j) {
tripletCount++;
if (astex.anasurface.AnaSurface.constructProbePlacement (this.xyz[i], this.radius[i], this.xyz[j], this.radius[j], this.xyz[k], this.radius[k], this.probeRadius, this.probe0, this.probe1)) {
var probeCount = 0;
if (!this.obscured (this.probe0, i, j, k)) {
this.processPlacement (this.probe0, i, j, k);
probeCount++;
}if (!this.obscured (this.probe1, i, j, k)) {
this.processPlacement (this.probe1, i, j, k);
probeCount++;
}if (probeCount == 2) {
var rp2 = (2.0 * this.probeRadius) * (2.0 * this.probeRadius);
if (astex.anasurface.AnaSurface.distance2 (this.probe0, this.probe1) < rp2) {
this.selfIntersectingProbes++;
var p1 = this.probes.getReverse (0);
var p2 = this.probes.getReverse (1);
p1.addClippingProbe (p2);
p2.addClippingProbe (p1);
var f1 = this.faces.getReverse (0);
var f2 = this.faces.getReverse (1);
f1.intersection = 1;
f2.intersection = 1;
}}}}}
}}
}
astex.anasurface.AnaSurface.print ("triplets", tripletCount);
});
Clazz.defineMethod (c$, "obscured", 
 function (p, i, j, k) {
if (this.obscured2 (p, k, i, j)) {
return true;
}if (this.obscured2 (p, i, j, k)) {
return true;
}if (this.obscured2 (p, j, i, k)) {
return true;
}return false;
}, "~A,~N,~N,~N");
Clazz.defineMethod (c$, "obscured2", 
 function (p, i, j, k) {
var localrsq = this.rsq;
if (this.cacheSphere != -1) {
if (this.cacheSphere != j && this.cacheSphere != k && this.cacheSphere != i) {
this.distanceComparisons++;
if (astex.anasurface.AnaSurface.distance2 (this.xyz[this.cacheSphere], p) < localrsq[this.cacheSphere]) {
return true;
}this.cacheSphere = -1;
}}var lastn = this.first[i] + this.count[i];
for (var a = this.first[i]; a < lastn; a++) {
var neighbour = this.nn[a];
this.distanceComparisons++;
var dx = p[0] - this.xyz[neighbour][0];
var dy = p[1] - this.xyz[neighbour][1];
var dz = p[2] - this.xyz[neighbour][2];
if (dx * dx + dy * dy + dz * dz < localrsq[neighbour]) {
if (neighbour != j && neighbour != k) {
this.cacheSphere = neighbour;
return true;
}}}
return false;
}, "~A,~N,~N,~N");
Clazz.defineMethod (c$, "addProbePlacement", 
 function (pijk, i, j, k) {
var p =  new astex.anasurface.Probe ();
this.copy (pijk, p.x);
p.i = i;
p.j = j;
p.k = k;
p.r = this.probeRadius;
this.probes.add (p);
if (this.probeList[i] == null) this.probeList[i] =  new astex.util.DynamicArray ().set (10, 0);
if (this.probeList[j] == null) this.probeList[j] =  new astex.util.DynamicArray ().set (10, 0);
if (this.probeList[k] == null) this.probeList[k] =  new astex.util.DynamicArray ().set (10, 0);
this.probeList[i].add (p);
this.probeList[j].add (p);
this.probeList[k].add (p);
return p;
}, "~A,~N,~N,~N");
Clazz.defineMethod (c$, "addVertex", 
 function (vx, i, px) {
var v =  new astex.anasurface.Vertex ();
astex.anasurface.AnaSurface.vector (this.nnv, vx, px);
this.normalise (this.nnv);
v.i = i;
v.vi = this.tmesh.addPointXYZ (vx, this.nnv, 0.0, 0.0);
this.copy (vx, v.x);
if (i != -1) {
if (this.vertexList[i] == null) this.vertexList[i] =  new astex.util.DynamicArray ().set (10, 0);
this.vertexList[i].add (v);
}this.vertices.add (v);
return v;
}, "~A,~N,~A");
Clazz.defineMethod (c$, "addEdge", 
 function (v0, v1, t) {
var e =  new astex.anasurface.Edge ();
e.v0 = v0;
e.v1 = v1;
if (v0.i == t.i) {
this.copy (t.cij, e.cen);
e.r = t.rcij;
this.copy (t.uij, e.n);
} else {
this.copy (t.cji, e.cen);
e.r = t.rcji;
this.copy (t.uij, e.n);
this.negate (e.n);
}this.edges.add (e);
if (this.edgeList[v0.i] == null) this.edgeList[v0.i] =  new astex.util.DynamicArray ().set (10, 0);
if (this.edgeList[v1.i] == null) this.edgeList[v1.i] =  new astex.util.DynamicArray ().set (10, 0);
this.edgeList[v0.i].add (e);
if (v0.i != v1.i) {
this.edgeList[v1.i].add (e);
}return e;
}, "astex.anasurface.Vertex,astex.anasurface.Vertex,astex.anasurface.Torus");
c$.constructProbePlacement = Clazz.defineMethod (c$, "constructProbePlacement", 
function (xi, ri, xj, rj, xk, rk, rp, p0, p1) {
astex.anasurface.AnaSurface.torusAxisUnitVector (astex.anasurface.AnaSurface.uij, xi, xj);
astex.anasurface.AnaSurface.torusAxisUnitVector (astex.anasurface.AnaSurface.uik, xi, xk);
var swijk = astex.anasurface.AnaSurface.baseTriangleAngle (astex.anasurface.AnaSurface.uij, astex.anasurface.AnaSurface.uik);
astex.anasurface.AnaSurface.basePlaneNormalVector (astex.anasurface.AnaSurface.uijk, astex.anasurface.AnaSurface.uij, astex.anasurface.AnaSurface.uik, swijk);
astex.anasurface.AnaSurface.torusBasepointUnitVector (astex.anasurface.AnaSurface.utb, astex.anasurface.AnaSurface.uijk, astex.anasurface.AnaSurface.uij);
astex.anasurface.AnaSurface.basePoint (astex.anasurface.AnaSurface.bijk, astex.anasurface.AnaSurface.tij, astex.anasurface.AnaSurface.utb, astex.anasurface.AnaSurface.uik, astex.anasurface.AnaSurface.tik, swijk);
var hijk = astex.anasurface.AnaSurface.probeHeight (ri + rp, astex.anasurface.AnaSurface.bijk, xi);
if (hijk < 0.0) {
return false;
}astex.anasurface.AnaSurface.probePosition (p0, astex.anasurface.AnaSurface.bijk, hijk, astex.anasurface.AnaSurface.uijk);
astex.anasurface.AnaSurface.probePosition (p1, astex.anasurface.AnaSurface.bijk, -hijk, astex.anasurface.AnaSurface.uijk);
return true;
}, "~A,~N,~A,~N,~A,~N,~N,~A,~A");
Clazz.defineMethod (c$, "processPlacement", 
 function (pijk, i, j, k) {
var p = this.addProbePlacement (pijk, i, j, k);
this.constructVertex (astex.anasurface.AnaSurface.api, pijk, this.xyz[i], this.radius[i]);
var v0 = this.addVertex (astex.anasurface.AnaSurface.api, i, p.x);
this.constructVertex (astex.anasurface.AnaSurface.apj, pijk, this.xyz[j], this.radius[j]);
var v1 = this.addVertex (astex.anasurface.AnaSurface.apj, j, p.x);
this.constructVertex (astex.anasurface.AnaSurface.apk, pijk, this.xyz[k], this.radius[k]);
var v2 = this.addVertex (astex.anasurface.AnaSurface.apk, k, p.x);
astex.anasurface.AnaSurface.vector (this.pdir, astex.anasurface.AnaSurface.bijk, pijk);
var edge0 = null;
var edge1 = null;
var edge2 = null;
if (astex.anasurface.AnaSurface.dot (this.pdir, astex.anasurface.AnaSurface.uijk) > 0.0) {
edge0 = this.constructProbeEdge (v0, astex.anasurface.AnaSurface.api, v1, astex.anasurface.AnaSurface.apj, astex.anasurface.AnaSurface.apk, pijk, this.probeRadius);
edge1 = this.constructProbeEdge (v1, astex.anasurface.AnaSurface.apj, v2, astex.anasurface.AnaSurface.apk, astex.anasurface.AnaSurface.api, pijk, this.probeRadius);
edge2 = this.constructProbeEdge (v2, astex.anasurface.AnaSurface.apk, v0, astex.anasurface.AnaSurface.api, astex.anasurface.AnaSurface.apj, pijk, this.probeRadius);
} else {
edge0 = this.constructProbeEdge (v0, astex.anasurface.AnaSurface.api, v2, astex.anasurface.AnaSurface.apk, astex.anasurface.AnaSurface.apj, pijk, this.probeRadius);
edge1 = this.constructProbeEdge (v2, astex.anasurface.AnaSurface.apk, v1, astex.anasurface.AnaSurface.apj, astex.anasurface.AnaSurface.api, pijk, this.probeRadius);
edge2 = this.constructProbeEdge (v1, astex.anasurface.AnaSurface.apj, v0, astex.anasurface.AnaSurface.api, astex.anasurface.AnaSurface.apk, pijk, this.probeRadius);
}var f = astex.anasurface.Face.newType (3);
f.add (edge0);
f.add (edge1);
f.add (edge2);
this.copy (pijk, f.cen);
f.r = this.probeRadius;
this.faces.add (f);
}, "~A,~N,~N,~N");
Clazz.defineMethod (c$, "constructProbeEdge", 
function (v0, p0, v1, p1, pother, pijk, rad) {
var i = v0.i;
var j = v1.i;
var edge =  new astex.anasurface.Edge ();
this.normal (this.edgen, p0, pijk, p1);
astex.anasurface.AnaSurface.vector (this.otherv, pijk, pother);
if (astex.anasurface.AnaSurface.dot (this.edgen, this.otherv) > 0.0) {
this.negate (this.edgen);
}edge.r = rad;
edge.v0 = v0;
edge.v1 = v1;
this.copy (this.edgen, edge.n);
this.copy (pijk, edge.cen);
var torus = this.findTorus (v0.i, v1.i);
if (torus == null) {
torus =  new astex.anasurface.Torus (v0.i, v1.i);
astex.anasurface.AnaSurface.torusAxisUnitVector (torus.uij, this.xyz[i], this.xyz[j]);
torus.rij = astex.anasurface.AnaSurface.torusCenter (torus.tij, this.xyz[i], this.radius[i], this.xyz[j], this.radius[j], this.probeRadius);
if (torus.rij < this.probeRadius) {
this.selfIntersectingTorii++;
torus.selfIntersects = true;
}torus.rcij = this.contactCircle (torus.cij, this.xyz[i], this.radius[i], this.xyz[j], this.radius[j]);
torus.rcji = this.contactCircle (torus.cji, this.xyz[j], this.radius[j], this.xyz[i], this.radius[i]);
this.normal (torus.uijnorm, torus.uij);
astex.anasurface.AnaSurface.cross (torus.uijnorm2, torus.uij, torus.uijnorm);
this.normalise (torus.uijnorm2);
if (this.torusList[i] == null) this.torusList[i] =  new astex.util.DynamicArray ().set (4, 0);
if (this.torusList[j] == null) this.torusList[j] =  new astex.util.DynamicArray ().set (4, 0);
this.torusList[i].add (torus);
this.torusList[j].add (torus);
if (this.edgeList[i] == null) this.edgeList[i] =  new astex.util.DynamicArray ().set (4, 0);
if (this.edgeList[j] == null) this.edgeList[j] =  new astex.util.DynamicArray ().set (4, 0);
this.edgeList[i].add (edge);
this.edgeList[j].add (edge);
this.torii.add (torus);
}torus.edges.add (edge);
return edge;
}, "astex.anasurface.Vertex,~A,astex.anasurface.Vertex,~A,~A,~A,~N");
Clazz.defineMethod (c$, "findTorus", 
function (i, j) {
if (this.torusList[i] == null) return null;
var torusCount = this.torusList[i].size ();
for (var t = 0; t < torusCount; t++) {
var torus = this.torusList[i].get (t);
if ((torus.i == i && torus.j == j) || (torus.i == j && torus.j == i)) {
return torus;
}}
return null;
}, "~N,~N");
c$.torusAxisUnitVector = Clazz.defineMethod (c$, "torusAxisUnitVector", 
function (uij, ai, aj) {
var dij = 1.0 / astex.anasurface.AnaSurface.distance (ai, aj);
for (var i = 0; i < 3; i++) {
uij[i] = (aj[i] - ai[i]) * dij;
}
}, "~A,~A,~A");
c$.torusCenter = Clazz.defineMethod (c$, "torusCenter", 
function (tij, ai, ri, aj, rj, rp) {
var rip = ri + rp;
var rjp = rj + rp;
var dij2 = astex.anasurface.AnaSurface.distance2 (ai, aj);
var dij = Math.sqrt (dij2);
var rconst = ((rip * rip) - (rjp * rjp)) / dij2;
for (var i = 0; i < 3; i++) {
tij[i] = 0.5 * (ai[i] + aj[i]) + 0.5 * (aj[i] - ai[i]) * rconst;
}
var rsum = rip + rjp;
var rdiff = ri - rj;
return 0.5 * Math.sqrt ((rsum * rsum) - dij2) * Math.sqrt (dij2 - (rdiff * rdiff)) / dij;
}, "~A,~A,~N,~A,~N,~N");
c$.torusRadius = Clazz.defineMethod (c$, "torusRadius", 
function (ri, rj, dij, rp) {
var dij2 = dij * dij;
var rsum = ri + rj + rp + rp;
var rdiff = ri - rj;
return 0.5 * Math.sqrt ((rsum * rsum) - dij2) * Math.sqrt (dij2 - (rdiff * rdiff)) / dij;
}, "~N,~N,~N,~N");
c$.baseTriangleAngle = Clazz.defineMethod (c$, "baseTriangleAngle", 
function (uij, uik) {
var dot2 = astex.anasurface.AnaSurface.dot (uij, uik);
dot2 *= dot2;
if (dot2 < -1.0) dot2 = -1.0;
 else if (dot2 > 1.0) dot2 = 1.0;
return Math.sqrt (1. - dot2);
}, "~A,~A");
c$.basePlaneNormalVector = Clazz.defineMethod (c$, "basePlaneNormalVector", 
function (uijk, uij, uik, swijk) {
astex.anasurface.AnaSurface.cross (uijk, uij, uik);
uijk[0] /= swijk;
uijk[1] /= swijk;
uijk[2] /= swijk;
}, "~A,~A,~A,~N");
c$.torusBasepointUnitVector = Clazz.defineMethod (c$, "torusBasepointUnitVector", 
function (utb, uijk, uij) {
astex.anasurface.AnaSurface.cross (utb, uijk, uij);
}, "~A,~A,~A");
c$.basePoint = Clazz.defineMethod (c$, "basePoint", 
function (bijk, tij, utb, uik, tik, swijk) {
var dotut = 0.0;
for (var i = 0; i < 3; i++) {
dotut += uik[i] * (tik[i] - tij[i]);
}
dotut /= swijk;
for (var i = 0; i < 3; i++) {
bijk[i] = tij[i] + utb[i] * dotut;
}
}, "~A,~A,~A,~A,~A,~N");
c$.probeHeight = Clazz.defineMethod (c$, "probeHeight", 
function (rip, bijk, ai) {
var h2 = (rip * rip) - astex.anasurface.AnaSurface.distance2 (bijk, ai);
return (h2 < 0.0 ? -1 : Math.sqrt (h2));
}, "~N,~A,~A");
c$.probePosition = Clazz.defineMethod (c$, "probePosition", 
function (pijk, bijk, hijk, uijk) {
for (var i = 0; i < 3; i++) {
pijk[i] = bijk[i] + hijk * uijk[i];
}
}, "~A,~A,~N,~A");
Clazz.defineMethod (c$, "constructVertex", 
function (v, pijk, ai, r) {
var rip = r + this.probeRadius;
for (var i = 0; i < 3; i++) {
v[i] = (r * pijk[i] + this.probeRadius * ai[i]) / rip;
}
}, "~A,~A,~A,~N");
c$.cross = Clazz.defineMethod (c$, "cross", 
function (a, b, c) {
a[0] = (b[1] * c[2]) - (b[2] * c[1]);
a[1] = (b[2] * c[0]) - (b[0] * c[2]);
a[2] = (b[0] * c[1]) - (b[1] * c[0]);
return a[0] + a[1] + a[2];
}, "~A,~A,~A");
Clazz.defineMethod (c$, "normal", 
function (n, a, b, c) {
astex.anasurface.AnaSurface.vector (this.ab, a, b);
astex.anasurface.AnaSurface.vector (this.bc, b, c);
n[0] = (this.ab[1] * this.bc[2]) - (this.ab[2] * this.bc[1]);
n[1] = (this.ab[2] * this.bc[0]) - (this.ab[0] * this.bc[2]);
n[2] = (this.ab[0] * this.bc[1]) - (this.ab[1] * this.bc[0]);
return n[0] + n[1] + n[2];
}, "~A,~A,~A,~A");
Clazz.defineMethod (c$, "negate", 
function (a) {
a[0] = -a[0];
a[1] = -a[1];
a[2] = -a[2];
}, "~A");
Clazz.defineMethod (c$, "plane_eqn", 
function (p, o, n) {
var px = p[0] - o[0];
var py = p[1] - o[1];
var pz = p[2] - o[2];
return px * n[0] + py * n[1] + pz * n[2];
}, "~A,~A,~A");
c$.dot = Clazz.defineMethod (c$, "dot", 
function (a, b) {
return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}, "~A,~A");
Clazz.defineMethod (c$, "dotnorm", 
function (a, b) {
return (a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / (astex.anasurface.AnaSurface.length (a) * astex.anasurface.AnaSurface.length (b));
}, "~A,~A");
Clazz.defineMethod (c$, "dot", 
function (ax, ay, az, bx, by, bz) {
return ax * bx + ay * by + az * bz;
}, "~N,~N,~N,~N,~N,~N");
c$.vector = Clazz.defineMethod (c$, "vector", 
function (v, a, b) {
v[0] = b[0] - a[0];
v[1] = b[1] - a[1];
v[2] = b[2] - a[2];
}, "~A,~A,~A");
Clazz.defineMethod (c$, "normal", 
function (n, v) {
n[0] = 1.0;
n[1] = 1.0;
n[2] = 1.0;
if (v[0] != 0.) n[0] = (v[2] + v[1]) / -v[0];
 else if (v[1] != 0.) n[1] = (v[0] + v[2]) / -v[1];
 else if (v[2] != 0.) n[2] = (v[0] + v[1]) / -v[2];
this.normalise (n);
}, "~A,~A");
Clazz.defineMethod (c$, "normalise", 
function (p) {
var len = p[0] * p[0] + p[1] * p[1] + p[2] * p[2];
if (len != 0.0) {
len = Math.sqrt (len);
p[0] /= len;
p[1] /= len;
p[2] /= len;
} else {
astex.anasurface.AnaSurface.print ("Can't normalise vector", p);
}}, "~A");
Clazz.defineMethod (c$, "copy", 
function (b, a) {
a[0] = b[0];
a[1] = b[1];
a[2] = b[2];
}, "~A,~A");
Clazz.defineMethod (c$, "mid", 
function (m, a, b) {
for (var i = 0; i < 3; i++) {
m[i] = 0.5 * (a[i] + b[i]);
}
}, "~A,~A,~A");
c$.distance = Clazz.defineMethod (c$, "distance", 
function (a, b) {
var dx = a[0] - b[0];
var dy = a[1] - b[1];
var dz = a[2] - b[2];
return Math.sqrt (dx * dx + dy * dy + dz * dz);
}, "~A,~A");
c$.distance2 = Clazz.defineMethod (c$, "distance2", 
function (a, b) {
var dx = a[0] - b[0];
var dy = a[1] - b[1];
var dz = a[2] - b[2];
return dx * dx + dy * dy + dz * dz;
}, "~A,~A");
c$.length = Clazz.defineMethod (c$, "length", 
function (v) {
return Math.sqrt (v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
}, "~A");
c$.scale = Clazz.defineMethod (c$, "scale", 
function (v, s) {
v[0] *= s;
v[1] *= s;
v[2] *= s;
}, "~A,~N");
Clazz.defineMethod (c$, "angle2", 
function (v10, v23, v12) {
var result = 0.0;
if (astex.anasurface.AnaSurface.length (v12) < astex.anasurface.AnaSurface.R_SMALL) {
result = this.angle (v10, v23);
} else {
astex.anasurface.AnaSurface.cross (this.dd1, v12, v10);
astex.anasurface.AnaSurface.cross (this.dd3, v12, v23);
if (astex.anasurface.AnaSurface.length (this.dd1) < astex.anasurface.AnaSurface.R_SMALL || astex.anasurface.AnaSurface.length (this.dd3) < astex.anasurface.AnaSurface.R_SMALL) {
result = this.angle (v10, v23);
} else {
result = this.angle (this.dd1, this.dd3);
astex.anasurface.AnaSurface.cross (this.pos_d, v12, this.dd1);
if (astex.anasurface.AnaSurface.dot (this.dd3, this.pos_d) < 0.0) {
result = -result;
}}}return result;
}, "~A,~A,~A");
Clazz.defineMethod (c$, "angle", 
function (ref, n1, n2) {
var result = this.angle (ref, n1);
if (astex.anasurface.AnaSurface.dot (ref, n2) < 0.0) {
result = -result;
}return result;
}, "~A,~A,~A");
Clazz.defineMethod (c$, "angle", 
function (v1, v2) {
var denom = astex.anasurface.AnaSurface.length (v1) * astex.anasurface.AnaSurface.length (v2);
var result = 0.0;
if (denom > astex.anasurface.AnaSurface.R_SMALL) {
result = astex.anasurface.AnaSurface.dot (v1, v2) / denom;
} else {
result = 0.0;
}if (result < -1.0) {
result = -1.0;
}if (result > 1.0) {
result = 1.0;
}result = Math.acos (result);
return result;
}, "~A,~A");
c$.print = Clazz.defineMethod (c$, "print", 
 function (s, x) {
astex.util.Format.print (System.out, "%-10s", s);
astex.util.Format.print (System.out, " %8.3f,", x[0]);
astex.util.Format.print (System.out, " %8.3f,", x[1]);
astex.util.Format.print (System.out, " %8.3f\n", x[2]);
}, "~S,~A");
c$.print = Clazz.defineMethod (c$, "print", 
 function (s, i) {
var len = s.length;
System.out.print (s);
System.out.print (" ");
for (var dot = len + 1; dot < astex.anasurface.AnaSurface.dotCount; dot++) {
System.out.print (".");
}
astex.util.Format.print (System.out, " %7d\n", i);
}, "~S,~N");
c$.print = Clazz.defineMethod (c$, "print", 
 function (s, d) {
var len = s.length;
System.out.print (s);
System.out.print (" ");
for (var dot = len + 1; dot < astex.anasurface.AnaSurface.dotCount; dot++) {
System.out.print (".");
}
astex.util.Format.print (System.out, " %10.2f\n", d);
}, "~S,~N");
Clazz.defineMethod (c$, "buildNeighbourList", 
function () {
this.first =  Clazz.newIntArray (this.nxyz, 0);
this.count =  Clazz.newIntArray (this.nxyz, 0);
var nList =  new astex.util.IntArray (this.nxyz * 60);
var maxNeighbours = 0;
for (var i = 0; i < this.nxyz; i++) {
var ri = this.radius2[i];
this.first[i] = this.neighbourCount;
for (var j = 0; j < this.nxyz; j++) {
var dij2 = astex.anasurface.AnaSurface.distance2 (this.xyz[i], this.xyz[j]);
var rirj = ri + this.radius2[j];
if (dij2 < rirj * rirj) {
if (i != j) {
this.count[i]++;
nList.add (j);
this.neighbourCount++;
}}}
if (this.count[i] > maxNeighbours) {
maxNeighbours = this.count[i];
}}
this.nn = nList.getArray ();
astex.anasurface.AnaSurface.print ("total neighbours", this.neighbourCount);
astex.anasurface.AnaSurface.print ("maximum neighbours", maxNeighbours);
this.commonNeighbours =  Clazz.newIntArray (maxNeighbours, 0);
});
c$.commonElements = Clazz.defineMethod (c$, "commonElements", 
function (a, firsta, na, b, firstb, nb, c) {
if (na == 0 || nb == 0) {
return 0;
}var enda = firsta + na;
var endb = firstb + nb;
var j = firsta;
var k = firstb;
var t = 0;
while (j < enda && k < endb) {
if (a[j] == b[k]) {
c[t] = a[j];
t++;
j++;
k++;
} else if (a[j] < b[k]) {
j++;
} else {
k++;
}}
return t;
}, "~A,~N,~N,~A,~N,~N,~A");
Clazz.defineMethod (c$, "mergeElements", 
function (a, firsta, na, b, firstb, nb, c) {
var enda = firsta + na;
var endb = firstb + nb;
var j = firsta;
var k = firstb;
var t = 0;
while (j < enda && k < endb) {
if (a[j] < b[k]) {
c[t] = a[j];
j++;
t++;
} else if (a[j] > b[k]) {
c[t] = b[k];
k++;
t++;
} else {
c[t] = a[j];
t++;
k++;
j++;
}}
while (j < enda) {
c[t] = a[j];
t++;
j++;
}
while (k < endb) {
c[t] = b[k];
t++;
k++;
}
return t;
}, "~A,~N,~N,~A,~N,~N,~A");
Clazz.defineMethod (c$, "within", 
function (x1, y1, z1, x2, y2, z2, d) {
var dx = x2 - x1;
var dy = y2 - y1;
var dz = z2 - z1;
return (dx * dx + dy * dy + dz * dz < d * d);
}, "~N,~N,~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "distance", 
function (x1, y1, z1, x2, y2, z2) {
var dx = x2 - x1;
var dy = y2 - y1;
var dz = z2 - z1;
return Math.sqrt (dx * dx + dy * dy + dz * dz);
}, "~N,~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "distance2", 
function (x1, y1, z1, x2, y2, z2) {
var dx = x2 - x1;
var dy = y2 - y1;
var dz = z2 - z1;
return dx * dx + dy * dy + dz * dz;
}, "~N,~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "outputProbes", 
function (pr, filename) {
var output = astex.io.FILE.openForWrite (filename);
if (output.errorMsg != null) {
System.err.println ("couldn't open " + filename + " : " + output.errorMsg);
return;
}for (var i = 0; i < pr.size (); i++) {
var p = pr.get (i);
output.printFD ("%.3f", p.x[0]);
output.printFD (" %.3f", p.x[1]);
output.printFD (" %.3f", p.x[2]);
output.printFD (" %.3f\n", this.probeRadius);
}
output.close ();
}, "astex.util.DynamicArray,~S");
Clazz.defineMethod (c$, "buildSphereTemplate", 
 function (subDivisions) {
this.initialiseSphereTemplate ();
var firstTriangle = 0;
var triangleCount = this.nst;
var start = 0;
var stop = 0;
for (var sub = 0; sub < subDivisions; sub++) {
for (var t = firstTriangle; t < triangleCount; t++) {
var midij = this.findSpherePoint (this.si[t], this.sj[t]);
var midjk = this.findSpherePoint (this.sj[t], this.sk[t]);
var midki = this.findSpherePoint (this.sk[t], this.si[t]);
this.addTriangle (midij, midjk, midki);
this.addTriangle (this.si[t], midij, midki);
this.addTriangle (this.sj[t], midjk, midij);
this.addTriangle (this.sk[t], midki, midjk);
}
start = triangleCount;
stop = this.nst;
firstTriangle = triangleCount;
triangleCount = this.nst;
}
this.nst = 0;
for (var t = start; t < stop; t++) {
this.si[this.nst] = this.si[t];
this.sj[this.nst] = this.sj[t];
this.sk[this.nst] = this.sk[t];
this.nst++;
}
for (var i = 0; i < this.nsp; i++) {
for (var j = 0; j < 3; j++) {
this.snx[i][j] = this.sx[i][j];
}
}
this.longestEdge = 0.0;
this.shortestEdge = 1.e10;
for (var i = 0; i < this.nst; i++) {
var vi = this.si[i];
var vj = this.sj[i];
var vk = this.sk[i];
var dedge = astex.anasurface.AnaSurface.distance (this.sx[vi], this.sx[vj]);
if (dedge < this.shortestEdge) {
this.shortestEdge = dedge;
}if (dedge > this.longestEdge) {
this.longestEdge = dedge;
}dedge = astex.anasurface.AnaSurface.distance (this.sx[vi], this.sx[vk]);
if (dedge < this.shortestEdge) {
this.shortestEdge = dedge;
}if (dedge > this.longestEdge) {
this.longestEdge = dedge;
}dedge = astex.anasurface.AnaSurface.distance (this.sx[vk], this.sx[vj]);
if (dedge < this.shortestEdge) {
this.shortestEdge = dedge;
}if (dedge > this.longestEdge) {
this.longestEdge = dedge;
}}
this.vn =  Clazz.newIntArray (this.nsp, 6, 0);
for (var i = 0; i < this.nst; i++) {
this.addNeighbour (this.si[i], this.sj[i]);
this.addNeighbour (this.si[i], this.sk[i]);
this.addNeighbour (this.sj[i], this.sk[i]);
}
this.tlist =  Clazz.newIntArray (this.nsp, 6, 0);
for (var i = 0; i < this.nst; i++) {
var vi = this.si[i];
var vj = this.sj[i];
var vk = this.sk[i];
this.tlist[vi][this.tcount[vi]++] = i;
this.tlist[vj][this.tcount[vj]++] = i;
this.tlist[vk][this.tcount[vk]++] = i;
}
astex.anasurface.AnaSurface.print ("points in sphere template", this.nsp);
astex.anasurface.AnaSurface.print ("triangles in sphere template", this.nst);
}, "~N");
Clazz.defineMethod (c$, "getHullCount", 
 function (svi) {
var hullCount = 0;
for (var j = 0; j < this.vncount[svi]; j++) {
if (this.hull[this.vn[svi][j]] == 1) {
hullCount++;
}}
return hullCount;
}, "~N");
Clazz.defineMethod (c$, "addNeighbour", 
 function (i, v) {
for (var j = 0; j < this.vncount[i]; j++) {
if (this.vn[i][j] == v) {
return true;
}}
this.vn[i][this.vncount[i]++] = v;
this.vn[v][this.vncount[v]++] = i;
return false;
}, "~N,~N");
Clazz.defineMethod (c$, "addTriangle", 
 function (ti, tj, tk) {
this.si[this.nst] = ti;
this.sj[this.nst] = tj;
this.sk[this.nst] = tk;
this.nst++;
}, "~N,~N,~N");
Clazz.defineMethod (c$, "findSpherePoint", 
 function (i, j) {
var mx = 0.5 * (this.sx[i][0] + this.sx[j][0]);
var my = 0.5 * (this.sx[i][1] + this.sx[j][1]);
var mz = 0.5 * (this.sx[i][2] + this.sx[j][2]);
var len = Math.sqrt (mx * mx + my * my + mz * mz);
mx /= len;
my /= len;
mz /= len;
for (var d = 0; d < this.nsp; d++) {
if (this.within (mx, my, mz, this.sx[d][0], this.sx[d][1], this.sx[d][2], 0.0001)) {
return d;
}}
this.sx[this.nsp][0] = mx;
this.sx[this.nsp][1] = my;
this.sx[this.nsp][2] = mz;
this.nsp++;
return this.nsp - 1;
}, "~N,~N");
Clazz.defineMethod (c$, "initialiseSphereTemplate", 
 function () {
this.sx[0][0] = -0.851024;
this.sx[0][1] = 0;
this.sx[0][2] = 0.525126;
this.sx[1][0] = 0;
this.sx[1][1] = 0.525126;
this.sx[1][2] = -0.851024;
this.sx[2][0] = 0;
this.sx[2][1] = 0.525126;
this.sx[2][2] = 0.851024;
this.sx[3][0] = 0.851024;
this.sx[3][1] = 0;
this.sx[3][2] = -0.525126;
this.sx[4][0] = -0.525126;
this.sx[4][1] = -0.851024;
this.sx[4][2] = 0;
this.sx[5][0] = -0.525126;
this.sx[5][1] = 0.851024;
this.sx[5][2] = 0;
this.sx[6][0] = 0;
this.sx[6][1] = -0.525126;
this.sx[6][2] = 0.851024;
this.sx[7][0] = 0.525126;
this.sx[7][1] = 0.851024;
this.sx[7][2] = 0;
this.sx[8][0] = 0;
this.sx[8][1] = -0.525126;
this.sx[8][2] = -0.851024;
this.sx[9][0] = 0.851024;
this.sx[9][1] = 0;
this.sx[9][2] = 0.525126;
this.sx[10][0] = 0.525126;
this.sx[10][1] = -0.851024;
this.sx[10][2] = 0;
this.sx[11][0] = -0.851024;
this.sx[11][1] = 0;
this.sx[11][2] = -0.525126;
this.nsp = 12;
this.si[0] = 9;
this.sj[0] = 2;
this.sk[0] = 6;
this.si[1] = 1;
this.sj[1] = 5;
this.sk[1] = 11;
this.si[2] = 11;
this.sj[2] = 1;
this.sk[2] = 8;
this.si[3] = 0;
this.sj[3] = 11;
this.sk[3] = 4;
this.si[4] = 3;
this.sj[4] = 7;
this.sk[4] = 1;
this.si[5] = 3;
this.sj[5] = 1;
this.sk[5] = 8;
this.si[6] = 9;
this.sj[6] = 3;
this.sk[6] = 7;
this.si[7] = 0;
this.sj[7] = 2;
this.sk[7] = 6;
this.si[8] = 4;
this.sj[8] = 6;
this.sk[8] = 10;
this.si[9] = 1;
this.sj[9] = 7;
this.sk[9] = 5;
this.si[10] = 7;
this.sj[10] = 2;
this.sk[10] = 5;
this.si[11] = 8;
this.sj[11] = 10;
this.sk[11] = 3;
this.si[12] = 4;
this.sj[12] = 11;
this.sk[12] = 8;
this.si[13] = 9;
this.sj[13] = 2;
this.sk[13] = 7;
this.si[14] = 10;
this.sj[14] = 6;
this.sk[14] = 9;
this.si[15] = 0;
this.sj[15] = 11;
this.sk[15] = 5;
this.si[16] = 0;
this.sj[16] = 2;
this.sk[16] = 5;
this.si[17] = 8;
this.sj[17] = 10;
this.sk[17] = 4;
this.si[18] = 3;
this.sj[18] = 9;
this.sk[18] = 10;
this.si[19] = 6;
this.sj[19] = 4;
this.sk[19] = 0;
this.nst = 20;
});
Clazz.defineStatics (c$,
"debug", false,
"defaultProbeRadius", 1.5,
"defaultQuality", 1,
"EPS", 1.e-8,
"u",  Clazz.newDoubleArray (3, 0),
"v",  Clazz.newDoubleArray (3, 0),
"w",  Clazz.newDoubleArray (3, 0),
"uij",  Clazz.newDoubleArray (3, 0),
"uik",  Clazz.newDoubleArray (3, 0),
"tij",  Clazz.newDoubleArray (3, 0),
"tik",  Clazz.newDoubleArray (3, 0),
"uijk",  Clazz.newDoubleArray (3, 0),
"utb",  Clazz.newDoubleArray (3, 0),
"bijk",  Clazz.newDoubleArray (3, 0),
"cij",  Clazz.newDoubleArray (3, 0),
"api",  Clazz.newDoubleArray (3, 0),
"apj",  Clazz.newDoubleArray (3, 0),
"apk",  Clazz.newDoubleArray (3, 0),
"R_SMALL", 0.000000001,
"dotCount", 45,
"MAX_SPHERE_POINTS", 642);
c$.MAX_SPHERE_TRIANGLES = c$.prototype.MAX_SPHERE_TRIANGLES = 2 * 2 * astex.anasurface.AnaSurface.MAX_SPHERE_POINTS - 4;
});
