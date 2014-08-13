Clazz.declarePackage ("astex.calc");
Clazz.load (["JU.Lst"], "astex.calc.SuperImpose", ["astex.api.Interface", "astex.util.Point3d", "java.lang.Double"], function () {
c$ = Clazz.decorateAsClass (function () {
this.source = null;
this.target = null;
this.R = null;
this.F = null;
this.centerS = null;
this.centerT = null;
this.maxEigen = 0.0;
this.maxVector = null;
this.molRenderer = null;
this.rmsd = 0.0;
this.transform = null;
Clazz.instantialize (this, arguments);
}, astex.calc, "SuperImpose");
Clazz.prepareFields (c$, function () {
this.source =  new JU.Lst ();
this.target =  new JU.Lst ();
this.R =  Clazz.newDoubleArray (3, 3, 0);
this.F =  Clazz.newDoubleArray (4, 4, 0);
this.centerS =  Clazz.newDoubleArray (3, 0);
this.centerT =  Clazz.newDoubleArray (3, 0);
this.maxVector =  Clazz.newDoubleArray (4, 0);
this.transform = [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0];
});
Clazz.makeConstructor (c$, 
function () {
});
Clazz.defineMethod (c$, "transformMolecules", 
function (residueString) {
var i;
var j;
var k;
var max = this.molRenderer.getMoleculeCount ();
var rCount;
var res = residueString.$plit (":");
var currRes;
var c;
var r;
var a;
if (max < 2) {
return;
}var mT = this.molRenderer.getMolecule (0);
var mS;
var tm;
this.clear ();
for (i = 0; i < res.length; i++) {
currRes = res[i].$plit ("=");
c = mT.findChain (currRes[0], false);
a = null;
rCount = c.getResidueCount ();
for (j = 0; j < rCount; j++) {
r = c.getResidue (j);
if (r.getNumber () == Integer.parseInt (currRes[1])) {
a = r.getAtomFromName ("CA");
break;
}}
if (a != null) {
this.addTarget (a);
} else {
System.err.println ("Atom not found");
return;
}}
for (k = 1; k < max; k++) {
this.clearSource ();
mS = this.molRenderer.getMolecule (k);
for (i = 0; i < res.length; i++) {
currRes = res[i].$plit ("=");
c = mS.findChain (currRes[0], false);
a = null;
rCount = c.getResidueCount ();
for (j = 0; j < rCount; j++) {
r = c.getResidue (j);
if (r.getNumber () == Integer.parseInt (currRes[1])) {
a = r.getAtomFromName ("CA");
break;
}}
if (a != null) {
this.addSource (a);
} else {
System.err.println ("Atom not found");
return;
}}
if (this.source.size () == this.target.size () && this.source.size () > 2) {
this.transform = [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0];
this.process ();
mS.matrix = this.transform;
if (mS.getName ().substring (0, 5).equals ("model")) {
tm = this.molRenderer.getGraphicalObjectByName ("s" + mS.getName ().substring (5));
if (tm != null) {
tm.matrix = this.transform;
}}} else {
System.err.println ("Atom mismatch in source/target or not enough atoms");
}}
this.molRenderer.repaint ();
}, "~S");
Clazz.defineMethod (c$, "setRenderer", 
function (mR) {
this.molRenderer = mR;
}, "astex.render.MoleculeRenderer");
Clazz.defineMethod (c$, "addDummy", 
function () {
var a = astex.util.Point3d.new3 (0.620, -24.548, -2.17);
this.addTarget (a);
a = astex.util.Point3d.new3 (4.016, -23.473, -0.833);
this.addTarget (a);
a = astex.util.Point3d.new3 (4.476, -20.255, 1.235);
this.addTarget (a);
a = astex.util.Point3d.new3 (0.393, -23.124, -0.686);
this.addSource (a);
a = astex.util.Point3d.new3 (3.872, -23.322, 0.853);
this.addSource (a);
a = astex.util.Point3d.new3 (4.866, -20.467, 3.242);
this.addSource (a);
});
Clazz.defineMethod (c$, "clearSource", 
function () {
this.source.clear ();
});
Clazz.defineMethod (c$, "clearTarget", 
function () {
this.target.clear ();
});
Clazz.defineMethod (c$, "clear", 
function () {
this.clearSource ();
this.clearTarget ();
});
Clazz.defineMethod (c$, "addTarget", 
function (atom) {
this.target.addLast (atom);
}, "astex.util.Point3d");
Clazz.defineMethod (c$, "addSource", 
function (atom) {
this.source.addLast (atom);
}, "astex.util.Point3d");
Clazz.defineMethod (c$, "process", 
function () {
this.buildR ();
this.buildF ();
this.buildTransforms ();
});
Clazz.defineMethod (c$, "buildR", 
function () {
var i;
var j;
var N;
var s;
var t;
for (i = 0; i < 3; i++) {
this.centerS[i] = 0.0;
this.centerT[i] = 0.0;
for (N = 0; N < this.source.size (); N++) {
s = this.source.get (N);
t = this.target.get (N);
this.centerS[i] += s.geto (i);
this.centerT[i] += t.geto (i);
}
this.centerS[i] /= this.source.size ();
this.centerT[i] /= this.target.size ();
}
for (i = 0; i < 3; i++) {
for (j = 0; j < 3; j++) {
this.R[i][j] = 0.0;
}
}
for (N = 0; N < this.source.size (); N++) {
s = this.source.get (N);
t = this.target.get (N);
for (i = 0; i < 3; i++) {
for (j = 0; j < 3; j++) {
this.R[i][j] += (s.geto (i) - this.centerS[i]) * (t.geto (j) - this.centerT[j]);
}
}
}
});
Clazz.defineMethod (c$, "buildF", 
function () {
this.F[0][0] = this.R[0][0] + this.R[1][1] + this.R[2][2];
this.F[1][1] = this.R[0][0] - this.R[1][1] - this.R[2][2];
this.F[2][2] = -this.R[0][0] + this.R[1][1] - this.R[2][2];
this.F[3][3] = -this.R[0][0] - this.R[1][1] + this.R[2][2];
this.F[0][1] = this.R[1][2] - this.R[2][1];
this.F[1][0] = this.F[0][1];
this.F[0][2] = this.R[2][0] - this.R[0][2];
this.F[2][0] = this.F[0][2];
this.F[0][3] = this.R[0][1] - this.R[1][0];
this.F[3][0] = this.F[0][3];
this.F[1][2] = this.R[0][1] + this.R[1][0];
this.F[2][1] = this.F[1][2];
this.F[1][3] = this.R[0][2] + this.R[2][0];
this.F[3][1] = this.F[1][3];
this.F[2][3] = this.R[1][2] + this.R[2][1];
this.F[3][2] = this.F[2][3];
});
Clazz.defineMethod (c$, "buildTransforms", 
function () {
var eigen = astex.api.Interface.getInterface ("JU.Eigen");
eigen.setM (this.F);
var eigenValues = eigen.getEigenvalues ();
this.maxEigen = eigenValues[2];
var eigenVectors = eigen.getEigenvectorsFloatTransposed ();
for (var i = 0; i < 3; i++) this.maxVector[i] = eigenVectors[3][i];

this.transform[0] = this.maxVector[0] * this.maxVector[0] + this.maxVector[1] * this.maxVector[1] - this.maxVector[2] * this.maxVector[2] - this.maxVector[3] * this.maxVector[3];
this.transform[1] = 2 * (this.maxVector[1] * this.maxVector[2] + this.maxVector[0] * this.maxVector[3]);
this.transform[2] = 2 * (this.maxVector[1] * this.maxVector[3] - this.maxVector[0] * this.maxVector[2]);
this.transform[3] = 2 * (this.maxVector[1] * this.maxVector[2] - this.maxVector[0] * this.maxVector[3]);
this.transform[4] = this.maxVector[0] * this.maxVector[0] - this.maxVector[1] * this.maxVector[1] + this.maxVector[2] * this.maxVector[2] - this.maxVector[3] * this.maxVector[3];
this.transform[5] = 2 * (this.maxVector[2] * this.maxVector[3] + this.maxVector[0] * this.maxVector[1]);
this.transform[6] = 2 * (this.maxVector[1] * this.maxVector[3] + this.maxVector[0] * this.maxVector[2]);
this.transform[7] = 2 * (this.maxVector[2] * this.maxVector[3] - this.maxVector[0] * this.maxVector[1]);
this.transform[8] = this.maxVector[0] * this.maxVector[0] - this.maxVector[1] * this.maxVector[1] - this.maxVector[2] * this.maxVector[2] + this.maxVector[3] * this.maxVector[3];
this.transform[9] = this.centerT[0] - this.centerS[0] * this.transform[0] - this.centerS[1] * this.transform[3] - this.centerS[2] * this.transform[6];
this.transform[10] = this.centerT[1] - this.centerS[0] * this.transform[1] - this.centerS[1] * this.transform[4] - this.centerS[2] * this.transform[7];
this.transform[11] = this.centerT[2] - this.centerS[0] * this.transform[2] - this.centerS[1] * this.transform[5] - this.centerS[2] * this.transform[8];
this.rmsd = -2.0 * this.maxEigen;
var N;
var p1;
var p2;
for (N = 0; N < this.source.size (); N++) {
p1 = this.source.get (N);
p2 = this.target.get (N);
for (var i = 0; i < 3; i++) {
this.rmsd += Math.pow (p1.geto (i) - this.centerS[i], 2);
this.rmsd += Math.pow (p2.geto (i) - this.centerT[i], 2);
}
}
this.rmsd /= 3.0 * this.source.size ();
if (this.rmsd > 0.0) {
this.rmsd = Math.sqrt (this.rmsd);
}});
Clazz.defineMethod (c$, "printOut", 
function () {
var i;
var point;
System.err.println ("-----------------------------------------------------------------------------------");
System.err.println ("Superimpose printout");
System.err.println ("Atoms in source: " + Integer.toString (this.source.size ()));
for (i = 0; i < this.source.size (); i++) {
point = this.source.get (i);
System.err.println (" xyz: " + Double.toString (point.x) + "  " + Double.toString (point.y) + "  " + Double.toString (point.z));
}
System.err.println (" < >: " + Double.toString (this.centerS[0]) + "  " + Double.toString (this.centerS[1]) + "  " + Double.toString (this.centerS[2]));
System.err.println ("Atoms in target: " + Integer.toString (this.target.size ()));
for (i = 0; i < this.target.size (); i++) {
point = this.target.get (i);
System.err.println (" xyz: " + Double.toString (point.x) + "  " + Double.toString (point.y) + "  " + Double.toString (point.z));
}
System.err.println (" < >: " + Double.toString (this.centerT[0]) + "  " + Double.toString (this.centerT[1]) + "  " + Double.toString (this.centerT[2]));
System.err.println ("Matrix R: ");
System.err.println (Double.toString (this.R[0][0]) + "  " + Double.toString (this.R[0][1]) + "  " + Double.toString (this.R[0][2]));
System.err.println (Double.toString (this.R[1][0]) + "  " + Double.toString (this.R[1][1]) + "  " + Double.toString (this.R[1][2]));
System.err.println (Double.toString (this.R[2][0]) + "  " + Double.toString (this.R[2][1]) + "  " + Double.toString (this.R[2][2]));
System.err.println ("Matrix F: ");
System.err.println (Double.toString (this.F[0][0]) + "  " + Double.toString (this.F[0][1]) + "  " + Double.toString (this.F[0][2]) + "  " + Double.toString (this.F[0][3]));
System.err.println (Double.toString (this.F[1][0]) + "  " + Double.toString (this.F[1][1]) + "  " + Double.toString (this.F[1][2]) + "  " + Double.toString (this.F[1][3]));
System.err.println (Double.toString (this.F[2][0]) + "  " + Double.toString (this.F[2][1]) + "  " + Double.toString (this.F[2][2]) + "  " + Double.toString (this.F[2][3]));
System.err.println (Double.toString (this.F[3][0]) + "  " + Double.toString (this.F[3][1]) + "  " + Double.toString (this.F[3][2]) + "  " + Double.toString (this.F[3][3]));
System.err.println ("RMSD: " + Double.toString (this.rmsd));
System.err.println ("Transform (Rotation):");
System.err.println (Double.toString (this.transform[0]) + "  " + Double.toString (this.transform[1]) + "  " + Double.toString (this.transform[2]));
System.err.println (Double.toString (this.transform[3]) + "  " + Double.toString (this.transform[4]) + "  " + Double.toString (this.transform[5]));
System.err.println (Double.toString (this.transform[6]) + "  " + Double.toString (this.transform[7]) + "  " + Double.toString (this.transform[8]));
System.err.println ("Transform (Translation):");
System.err.println (Double.toString (this.transform[9]) + "  " + Double.toString (this.transform[10]) + "  " + Double.toString (this.transform[11]));
System.err.println ("-----------------------------------------------------------------------------------");
});
});
