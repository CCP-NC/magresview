Clazz.declarePackage ("astex.map");
Clazz.load (["astex.api.AstexSchematic", "astex.util.Point3d"], "astex.map.Schematic", ["astex.render.MoleculeRenderer", "$.Tmesh", "astex.util.Color32", "$.DoubleArray", "$.Matrix"], function () {
c$ = Clazz.declareType (astex.map, "Schematic", null, astex.api.AstexSchematic);
Clazz.makeConstructor (c$, 
function () {
});
Clazz.overrideMethod (c$, "create", 
function (args, mr, atoms) {
var name = args.getString ("-name", "defaultSchematic");
var tm =  new astex.render.Tmesh ();
tm.setName (name);
var useBackbone = args.getBoolean ("-usebackbone", false);
if (useBackbone) {
tm.style = 2;
tm.setLineWidth (-3.0);
astex.map.Schematic.addLabels = args.getBoolean ("-addlabels", false);
tm.useLabels = astex.map.Schematic.addLabels;
tm.isSelectable = astex.map.Schematic.addLabels;
}var iterator = mr.getAtomIterator ();
while (iterator.hasMoreElements ()) {
var atom = iterator.getNextAtom ();
atom.setTemporarilySelected (false);
}
var atomCount = atoms.size ();
for (var a = 0; a < atomCount; a++) {
var atom = atoms.get (a);
atom.x = atom.xo;
atom.y = atom.yo;
atom.z = atom.zo;
atom.setTemporarilySelected (true);
tm.matrix = atom.getMolecule ().matrix;
}
var doSymmetry = args.getBoolean ("-symmetry", false);
try {
var moleculeCount = mr.getMoleculeCount ();
var tmTracker =  new astex.map.Schematic.TmTracker ();
if (doSymmetry) {
tmTracker.init (moleculeCount + 1);
}for (var i = 0; i < moleculeCount; i++) {
var m = mr.getMolecule (i);
for (var c = 0; c < m.getChainCount (); c++) {
var chain = m.getChain (c);
astex.map.Schematic.chainSchematic (args, tm, chain, c);
}
if (doSymmetry) {
tmTracker.npEnd[i] = tmTracker.npStart[i + 1] = tm.np;
tmTracker.ntEnd[i] = tmTracker.ntStart[i + 1] = tm.nt;
}}
if (useBackbone == false) tm.recalculateNormals ();
if (doSymmetry) {
for (var i = 0; i < moleculeCount; i++) {
var m = mr.getMolecule (i);
if (m == null) continue;
if (m.getModelType () == 3) continue;
if ((m.getSymmetry () != null) && (m.getSymmetry ().getSymmetryOperators () != null) && (m.getSymmetry ().getSymmetryOperators ().size () > 1)) {
astex.map.Schematic.copySchematic (args, tm, m, tmTracker, mr, i, 1);
} else if (m.getBioTransformCount () > 1) {
astex.map.Schematic.copySchematic (args, tm, m, tmTracker, mr, i, 2);
}}
}} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
{
alert(e + Clazz.getStackTrace());
}} else {
throw e;
}
}
return tm;
}, "astex.util.Arguments,astex.render.MoleculeRenderer,astex.util.DynamicArray");
c$.copySchematic = Clazz.defineMethod (c$, "copySchematic", 
 function (args, tm, mol, tmTracker, mr, molIndex, mode) {
var nCopies = 0;
var nOps = 0;
var limit = args.getInteger ("-symcopies", 0);
var useMiddle = args.getBoolean ("-usemiddle", false);
var symmetryOperators = null;
if (mode == 1) {
symmetryOperators = mol.getSymmetry ().getSymmetryOperators ();
nOps = nCopies = symmetryOperators.size ();
} else {
nOps = nCopies = mol.getBioTransformCount ();
}var symCheck = args.getBoolean ("-symcheck", false);
if (limit > 0 && limit < nCopies) nCopies = limit;
var start = 0;
var finish = nCopies;
if (useMiddle) {
start = Clazz.doubleToInt ((nOps - nCopies) / 2);
finish += start;
}for (var i = start; i < finish; i++) {
var mtrx;
if (mode == 1) {
mtrx = symmetryOperators.get (i);
} else {
mtrx = mol.getBioTransform (i);
}if (mtrx.isIdentity ()) continue;
if (mode == 1) mtrx = astex.map.Schematic.translateMatrix (mol, mtrx, mr, symCheck);
if (symCheck && !astex.map.Schematic.checkCopy (mr, mol, mtrx)) continue;
tm.translateCopy (mtrx, tmTracker.npStart[molIndex], tmTracker.npEnd[molIndex], tmTracker.ntStart[molIndex], tmTracker.ntEnd[molIndex]);
}
}, "astex.util.Arguments,astex.render.Tmesh,astex.model.Molecule,astex.map.Schematic.TmTracker,astex.render.MoleculeRenderer,~N,~N");
c$.translateMatrix = Clazz.defineMethod (c$, "translateMatrix", 
 function (mol, curMtrx, mr, symCheck) {
var sym = mol.getSymmetry ();
var cartesianToFractional = sym.getCartesianToFractionalMatrix ();
var fractionalToCartesian = sym.getFractionalToCartesianMatrix ();
var newMtrx =  new astex.util.Matrix (curMtrx);
var newCenter =  new astex.util.Point3d ();
var molCenter = mol.getCenter ();
newCenter.setP (molCenter);
newCenter.transform (curMtrx);
newCenter.transform (cartesianToFractional);
newMtrx.transform (cartesianToFractional);
if (!symCheck) {
var x = newCenter.x;
if (x < -0.5) newMtrx.x30 += Math.rint (-(x));
 else if (x > 0.5) newMtrx.x30 -= Math.rint (x);
var y = newCenter.y;
if (y < 0.5) newMtrx.x31 += Math.rint (-(y));
 else if (y > 0.5) newMtrx.x31 -= Math.rint (y);
var z = newCenter.z;
if (z < -0.5) newMtrx.x32 += Math.rint (-(z));
 else if (z > 0.5) newMtrx.x32 -= Math.rint (z);
}newMtrx.transform (fractionalToCartesian);
newCenter.transform (fractionalToCartesian);
if (symCheck) {
var m = mr.getMap (0);
if (m != null) {
var min =  Clazz.newDoubleArray (3, 0);
var max =  Clazz.newDoubleArray (3, 0);
var voxel =  Clazz.newDoubleArray (3, 0);
m.fillMinMaxVoxel (min, max, voxel);
var molCellSize = mol.getSymmetry ().unitCell[0];
if (newCenter.x < min[0]) newMtrx.x30 += molCellSize * Math.rint (0.5 + (min[0] - newCenter.x) / molCellSize);
 else if (newCenter.x > max[0]) newMtrx.x30 -= molCellSize * (Math.rint (0.5 + (newCenter.x - max[0]) / molCellSize));
molCellSize = mol.getSymmetry ().unitCell[1];
if (newCenter.y < min[1]) newMtrx.x31 += molCellSize * Math.rint (0.5 + (min[1] - newCenter.y) / molCellSize);
 else if (newCenter.y > max[1]) newMtrx.x31 -= molCellSize * (Math.rint (0.5 + (newCenter.y - max[1]) / molCellSize));
molCellSize = mol.getSymmetry ().unitCell[2];
if (newCenter.z < min[2]) newMtrx.x32 += molCellSize * Math.rint (0.5 + (min[2] - newCenter.z) / molCellSize);
 else if (newCenter.z > max[2]) newMtrx.x32 -= molCellSize * (Math.rint (0.5 + (newCenter.z - max[2]) / molCellSize));
}}return newMtrx;
}, "astex.model.Molecule,astex.util.Matrix,astex.render.MoleculeRenderer,~B");
c$.checkCopy = Clazz.defineMethod (c$, "checkCopy", 
 function (mr, mol, mtrx) {
var threshold = 0.40;
var fraction = mr.checkCopy (mol, mtrx);
if (fraction > threshold) return true;
return false;
}, "astex.render.MoleculeRenderer,astex.model.Molecule,astex.util.Matrix");
c$.ensureCapacity = Clazz.defineMethod (c$, "ensureCapacity", 
 function (chain, every) {
var resCount = chain.getResidueCount ();
resCount += every;
resCount /= every;
if (astex.map.Schematic.guides == null || resCount > astex.map.Schematic.guides.length) {
astex.map.Schematic.guides =  new Array (resCount);
astex.map.Schematic.tangents =  new Array (resCount);
astex.map.Schematic.width =  new Array (resCount);
astex.map.Schematic.thick =  new Array (resCount);
astex.map.Schematic.tmp =  new Array (resCount);
astex.map.Schematic.c =  new Array (resCount);
astex.map.Schematic.h =  new Array (resCount);
astex.map.Schematic.t =  new Array (resCount);
astex.map.Schematic.tout =  new Array (resCount);
astex.map.Schematic.rv =  new Array (resCount);
astex.map.Schematic.type =  Clazz.newIntArray (resCount, 0);
astex.map.Schematic.colors =  Clazz.newIntArray (resCount, 0);
astex.map.Schematic.resids =  Clazz.newIntArray (resCount, 0);
astex.map.Schematic.widthInitialised =  Clazz.newBooleanArray (resCount, false);
if (astex.map.Schematic.addLabels) astex.map.Schematic.labels =  new Array (resCount);
for (var i = 0; i < resCount; i++) {
astex.map.Schematic.guides[i] =  new astex.util.Point3d ();
astex.map.Schematic.tangents[i] =  new astex.util.Point3d ();
astex.map.Schematic.width[i] =  new astex.util.Point3d ();
astex.map.Schematic.thick[i] =  new astex.util.Point3d ();
astex.map.Schematic.tmp[i] =  new astex.util.Point3d ();
astex.map.Schematic.c[i] =  new astex.util.Point3d ();
astex.map.Schematic.t[i] =  new astex.util.Point3d ();
astex.map.Schematic.tout[i] =  new astex.util.Point3d ();
astex.map.Schematic.h[i] =  new astex.util.Point3d ();
astex.map.Schematic.rv[i] =  new astex.util.Point3d ();
if (astex.map.Schematic.addLabels) astex.map.Schematic.labels[i] =  String.instantialize ();
}
}if (astex.map.Schematic.addLabels && (astex.map.Schematic.labels == null || resCount > astex.map.Schematic.labels.length)) {
astex.map.Schematic.labels =  new Array (resCount);
for (var i = 0; i < resCount; i++) {
if (astex.map.Schematic.addLabels) astex.map.Schematic.labels[i] =  String.instantialize ();
}
}}, "astex.model.Chain,~N");
c$.chainSchematic = Clazz.defineMethod (c$, "chainSchematic", 
function (args, tm, chain, chainId) {
var minResidues = args.getInteger ("-minchainresidues", 5);
var every = args.getInteger ("-every", 1);
if (every >= minResidues) minResidues = every + 1;
var useBackbone = args.getBoolean ("-usebackbone", false);
if (!useBackbone && chain.getResidueCount () < minResidues) return;
astex.map.Schematic.ensureCapacity (chain, every);
tm.setColorStyle (2);
astex.map.Schematic.guideCount = 0;
var colorByChain = args.getBoolean ("-colorbychain", false);
for (var r = 0; r < chain.getResidueCount (); r++) {
var resType = 0;
if (r % every != 0) continue;
var res = chain.getResidue (r);
if (res.isSolvent ()) continue;
if (res.isStandardAminoAcid () || res.isModifiedAminoAcid ()) {
resType = 1;
} else if (res.isNucleicAcid () || res.isModifiedNucleicAcid ()) {
resType = 2;
} else if (res.isIon ()) {
resType = 4;
} else {
resType = 3;
}var at = res.getAtom (0);
switch (resType) {
case 1:
at = res.getAtomFromName ("CA");
break;
case 2:
at = res.getAtomFromName ("C5'");
if (at == null) at = res.getAtomFromName ("C5*");
if (at == null) at = res.getAtomFromName ("P");
break;
}
if (at != null && at.isTemporarilySelected ()) {
astex.map.Schematic.widthInitialised[astex.map.Schematic.guideCount] = false;
if (resType == 1) {
var C = res.getAtomFromName ("C");
var O = res.getAtomFromName ("O");
if (O != null && C != null) {
astex.map.Schematic.width[astex.map.Schematic.guideCount] = astex.util.Point3d.unitVectorP2 (C, O);
astex.map.Schematic.widthInitialised[astex.map.Schematic.guideCount] = true;
}}if (colorByChain) {
astex.map.Schematic.colors[astex.map.Schematic.guideCount] = astex.render.MoleculeRenderer.getColor (chainId);
} else {
astex.map.Schematic.colors[astex.map.Schematic.guideCount] = at.getColor ();
}switch (resType) {
case 1:
astex.map.Schematic.guides[astex.map.Schematic.guideCount].setP (at);
if (res.getName () === "UNK") {
astex.map.Schematic.type[astex.map.Schematic.guideCount] = 5;
} else {
astex.map.Schematic.type[astex.map.Schematic.guideCount] = res.getSecondaryStructure ();
}break;
case 2:
astex.map.Schematic.guides[astex.map.Schematic.guideCount].setP (at);
astex.map.Schematic.type[astex.map.Schematic.guideCount] = 1;
break;
case 3:
astex.map.Schematic.guides[astex.map.Schematic.guideCount].setP (res.getCenter ());
astex.map.Schematic.type[astex.map.Schematic.guideCount] = -1;
break;
case 4:
default:
astex.map.Schematic.guides[astex.map.Schematic.guideCount].setP (at);
astex.map.Schematic.type[astex.map.Schematic.guideCount] = -1;
break;
}
if (astex.map.Schematic.addLabels) astex.map.Schematic.labels[astex.map.Schematic.guideCount] = chain.getParent ().getName () + ":" + res.getLabel () + ":" + res.getName ();
astex.map.Schematic.guideCount++;
}}
if (!useBackbone) {
if (astex.map.Schematic.guideCount < 2) {
return;
}for (var r = 0; r < astex.map.Schematic.guideCount; r++) {
var before = r - 1;
var after = r + 1;
if (r == 0) {
before = r;
} else if (r == astex.map.Schematic.guideCount - 1) {
after = astex.map.Schematic.guideCount - 1;
}astex.map.Schematic.tangents[r].set (0.0, 0.0, 0.0);
astex.map.Schematic.tangents[r].subtract (astex.map.Schematic.guides[before]);
astex.map.Schematic.tangents[r].add (astex.map.Schematic.guides[after]);
astex.map.Schematic.tangents[r].normalise ();
}
for (var r = 1; r < astex.map.Schematic.guideCount - 1; r++) {
if (astex.map.Schematic.widthInitialised[r] == false) {
var ab = astex.util.Point3d.unitVectorP2 (astex.map.Schematic.guides[r - 1], astex.map.Schematic.guides[r]);
var bc = astex.util.Point3d.unitVectorP2 (astex.map.Schematic.guides[r], astex.map.Schematic.guides[r + 1]);
astex.util.Point3d.crossPts (astex.map.Schematic.width[r], ab, bc);
}}
if (astex.map.Schematic.guideCount > 2) {
if (astex.map.Schematic.widthInitialised[0] == false) {
astex.map.Schematic.width[0].setP (astex.map.Schematic.width[1]);
}if (astex.map.Schematic.widthInitialised[astex.map.Schematic.guideCount - 1] == false) {
astex.map.Schematic.width[astex.map.Schematic.guideCount - 1].setP (astex.map.Schematic.width[astex.map.Schematic.guideCount - 2]);
}}}var allTube = args.getBoolean ("-alltube", false);
if (useBackbone) {
tm.setColorStyle (1);
astex.map.Schematic.residCount = 0;
for (var r = 0; r < astex.map.Schematic.guideCount; r++) {
astex.map.Schematic.resids[astex.map.Schematic.residCount] = r;
astex.map.Schematic.residCount++;
}
astex.map.Schematic.backbone (args, tm);
} else if (allTube) {
astex.map.Schematic.residCount = 0;
for (var r = 0; r < astex.map.Schematic.guideCount; r++) {
astex.map.Schematic.resids[astex.map.Schematic.residCount] = r;
astex.map.Schematic.residCount++;
}
astex.map.Schematic.tube (args, tm);
} else {
astex.map.Schematic.residCount = 0;
for (var r = 0; r < astex.map.Schematic.guideCount; r++) {
if (astex.map.Schematic.type[r] == 1) {
astex.map.Schematic.resids[astex.map.Schematic.residCount] = r;
astex.map.Schematic.residCount++;
} else {
if (astex.map.Schematic.residCount > 0) {
astex.map.Schematic.arrow (args, tm);
astex.map.Schematic.residCount = 0;
}}}
if (astex.map.Schematic.residCount > 0) {
astex.map.Schematic.arrow (args, tm);
astex.map.Schematic.residCount = 0;
}for (var r = 0; r < astex.map.Schematic.guideCount; r++) {
if (astex.map.Schematic.type[r] == 2) {
astex.map.Schematic.resids[astex.map.Schematic.residCount] = r;
astex.map.Schematic.residCount++;
} else {
if (astex.map.Schematic.residCount > 0) {
astex.map.Schematic.ribbon (args, tm);
astex.map.Schematic.residCount = 0;
}}}
if (astex.map.Schematic.residCount > 0) {
astex.map.Schematic.ribbon (args, tm);
astex.map.Schematic.residCount = 0;
}for (var r = 0; r < astex.map.Schematic.guideCount; r++) {
if ((r > 0 && astex.map.Schematic.type[r] != 5 && astex.map.Schematic.type[r - 1] == 5) || (r < astex.map.Schematic.guideCount - 1 && astex.map.Schematic.type[r] != 5 && astex.map.Schematic.type[r + 1] == 5) || astex.map.Schematic.type[r] == 5) {
if (astex.map.Schematic.residCount > 0 && astex.map.Schematic.guides[r].distance (astex.map.Schematic.guides[astex.map.Schematic.resids[astex.map.Schematic.residCount - 1]]) > 4.2) {
astex.map.Schematic.tube (args, tm);
astex.map.Schematic.residCount = 0;
}astex.map.Schematic.resids[astex.map.Schematic.residCount] = r;
astex.map.Schematic.residCount++;
if (r > 0 && astex.map.Schematic.type[r] != 5 && astex.map.Schematic.type[r - 1] == 5) {
astex.map.Schematic.tube (args, tm);
astex.map.Schematic.residCount = 0;
}} else {
if (astex.map.Schematic.residCount > 0) {
astex.map.Schematic.tube (args, tm);
astex.map.Schematic.residCount = 0;
}}}
if (astex.map.Schematic.residCount > 0) {
astex.map.Schematic.tube (args, tm);
astex.map.Schematic.residCount = 0;
}for (var r = 1; r < astex.map.Schematic.guideCount; r++) {
if ((astex.map.Schematic.type[r] == 1 && astex.map.Schematic.type[r - 1] == 2) || (astex.map.Schematic.type[r - 1] == 1 && astex.map.Schematic.type[r] == 2)) {
astex.map.Schematic.resids[0] = r - 1;
astex.map.Schematic.resids[1] = r;
astex.map.Schematic.residCount = 2;
astex.map.Schematic.tube (args, tm);
astex.map.Schematic.residCount = 0;
}}
}}, "astex.util.Arguments,astex.render.Tmesh,astex.model.Chain,~N");
c$.ribbon = Clazz.defineMethod (c$, "ribbon", 
function (args, tm) {
var quality = args.getInteger ("-quality", 1);
var tangent_length = args.getDouble ("-ribbontangent", 5.0);
var splinePoints = args.getInteger ("-ribbonpoints", 8);
var aWidth = 0.5 * args.getDouble ("-ribbonwidth", 2.2);
var minWidth = 0.5 * args.getDouble ("-ribbonminwidth", 0.4);
var aThick = 0.5 * args.getDouble ("-ribbonthickness", 0.15);
var cylinders = args.getBoolean ("-ribboncylinders", false);
var helixBack = args.getBoolean ("-helixback", false);
var ellipse = args.getBoolean ("-ribbonellipse", false);
var ellipsePoints = args.getInteger ("-ribbonellipsepoints", 12);
var colorBySS = args.getBoolean ("-colorbyss", false);
var color = args.getColor ("-ribboncolor", astex.util.Color32.red);
splinePoints *= quality;
ellipsePoints *= quality;
var rfirst = astex.map.Schematic.resids[0];
var rlast = astex.map.Schematic.resids[astex.map.Schematic.residCount - 1];
var plast =  new astex.util.Point3d ();
var p =  new astex.util.Point3d ();
var pnext =  new astex.util.Point3d ();
var currentEllipse = null;
var lastEllipse = null;
var cosTheta = null;
var sinTheta = null;
if (ellipse) {
currentEllipse =  Clazz.newIntArray (ellipsePoints, 0);
lastEllipse =  Clazz.newIntArray (ellipsePoints, 0);
sinTheta =  Clazz.newDoubleArray (ellipsePoints, 0);
cosTheta =  Clazz.newDoubleArray (ellipsePoints, 0);
var step = 6.283185307179586 / ellipsePoints;
var theta = 0.0;
for (var iep = 0; iep < ellipsePoints; iep++) {
var component = 0.0;
if (theta < 3.141592653589793) {
component = -Math.cos (theta) + 1.0;
} else {
component = Math.cos (theta) + 3.0;
}var realTheta = 0.5 * component * 3.141592653589793;
sinTheta[iep] = Math.sin (realTheta);
cosTheta[iep] = Math.cos (realTheta);
theta += step;
}
}var fudgeFirst = false;
var fudgeLast = false;
for (var i = 0; i < astex.map.Schematic.residCount; i++) {
var r = astex.map.Schematic.resids[i];
if (r == 0) {
fudgeFirst = true;
} else if (r == astex.map.Schematic.guideCount - 1) {
fudgeLast = true;
} else {
var ab = astex.util.Point3d.unitVectorP2 (astex.map.Schematic.guides[r - 1], astex.map.Schematic.guides[r]);
var bc = astex.util.Point3d.unitVectorP2 (astex.map.Schematic.guides[r], astex.map.Schematic.guides[r + 1]);
astex.util.Point3d.crossPts (astex.map.Schematic.width[r], ab, bc);
}}
if (fudgeFirst) {
astex.map.Schematic.width[rfirst].setP (astex.map.Schematic.width[rfirst + 1]);
}if (fudgeLast) {
astex.map.Schematic.width[rlast].setP (astex.map.Schematic.width[rlast - 1]);
}for (var i = 0; i < astex.map.Schematic.residCount; i++) {
var r = astex.map.Schematic.resids[i];
for (var j = 0; j < 3; j++) {
astex.map.Schematic.t[r].setComponent (j, 0.9816 * astex.map.Schematic.tangents[r].get (j) - 0.1908 * astex.map.Schematic.width[r].get (j));
astex.map.Schematic.h[r].setComponent (j, 0.848 * astex.map.Schematic.width[r].get (j) + 0.5299 * astex.map.Schematic.tangents[r].get (j));
}
astex.map.Schematic.t[r].normalise ();
astex.map.Schematic.h[r].normalise ();
astex.util.Point3d.crossPts (astex.map.Schematic.tout[r], astex.map.Schematic.t[r], astex.map.Schematic.h[r]);
}
var first = true;
var firstVertices = true;
for (var i = 0; i < astex.map.Schematic.residCount - 1; i++) {
var r = astex.map.Schematic.resids[i];
var w = aWidth;
var at = aThick;
var nsp = splinePoints;
if (i == astex.map.Schematic.residCount - 2) {
nsp = splinePoints + 1;
}for (var sp = 0; sp < nsp; sp++) {
var tp = sp / splinePoints;
var tnext = (sp + 1) / splinePoints;
if (!colorBySS) {
color = astex.util.Color32.blendF (astex.map.Schematic.colors[r], astex.map.Schematic.colors[r + 1], 1. - tp);
}if (i == 0) {
w = minWidth + tp * (aWidth - minWidth);
at = minWidth + tp * (aThick - minWidth);
} else if (i == astex.map.Schematic.residCount - 2) {
w = minWidth + (1. - tp) * (aWidth - minWidth);
at = minWidth + (1. - tp) * (aThick - minWidth);
}astex.map.Schematic.interpolate (astex.map.Schematic.wint, astex.map.Schematic.h[r], astex.map.Schematic.h[r + 1], tp);
astex.map.Schematic.hermite_single (astex.map.Schematic.guides[r], astex.map.Schematic.guides[r + 1], astex.map.Schematic.t[r], tangent_length, astex.map.Schematic.t[r + 1], tangent_length, tp, p);
astex.map.Schematic.hermite_single (astex.map.Schematic.guides[r], astex.map.Schematic.guides[r + 1], astex.map.Schematic.t[r], tangent_length, astex.map.Schematic.t[r + 1], tangent_length, tnext, pnext);
astex.map.Schematic.interpolate (astex.map.Schematic.tint, astex.map.Schematic.tout[r], astex.map.Schematic.tout[r + 1], tp);
if (ellipse) {
for (var iep = 0; iep < ellipsePoints; iep++) {
var ct = cosTheta[iep];
var st = sinTheta[iep];
for (var c = 0; c < 3; c++) {
astex.map.Schematic.ep.setComponent (c, p.get (c) + ct * astex.map.Schematic.wint.get (c) * w + st * astex.map.Schematic.tint.get (c) * at);
astex.map.Schematic.en.setComponent (c, ct * astex.map.Schematic.wint.get (c) * at + st * astex.map.Schematic.tint.get (c) * w);
}
astex.map.Schematic.en.normalise ();
currentEllipse[iep] = tm.addPointNoColor (astex.map.Schematic.ep.x, astex.map.Schematic.ep.y, astex.map.Schematic.ep.z, astex.map.Schematic.en.x, astex.map.Schematic.en.y, astex.map.Schematic.en.z, 0.0, 0.0);
}
if (!first) {
for (var iep = 0; iep < ellipsePoints; iep++) {
var inp = iep + 1;
if (inp == ellipsePoints) {
inp = 0;
}tm.addTriangle (currentEllipse[iep], lastEllipse[iep], currentEllipse[inp], color);
tm.addTriangle (lastEllipse[iep], currentEllipse[inp], lastEllipse[inp], color);
}
}for (var iep = 0; iep < ellipsePoints; iep++) {
lastEllipse[iep] = currentEllipse[iep];
}
} else {
for (var c = 0; c < 3; c++) {
astex.map.Schematic.wptp.setComponent (c, p.get (c) + astex.map.Schematic.wint.get (c) * w + astex.map.Schematic.tint.get (c) * aThick);
astex.map.Schematic.wptm.setComponent (c, p.get (c) + astex.map.Schematic.wint.get (c) * w - astex.map.Schematic.tint.get (c) * aThick);
astex.map.Schematic.wmtp.setComponent (c, p.get (c) - astex.map.Schematic.wint.get (c) * w + astex.map.Schematic.tint.get (c) * aThick);
astex.map.Schematic.wmtm.setComponent (c, p.get (c) - astex.map.Schematic.wint.get (c) * w - astex.map.Schematic.tint.get (c) * aThick);
astex.map.Schematic.wp.setComponent (c, p.get (c) + astex.map.Schematic.wint.get (c) * w);
astex.map.Schematic.wm.setComponent (c, p.get (c) - astex.map.Schematic.wint.get (c) * w);
}
astex.map.Schematic.v[0] = tm.addPointNoColor (astex.map.Schematic.wptm.x, astex.map.Schematic.wptm.y, astex.map.Schematic.wptm.z, -astex.map.Schematic.tint.x, -astex.map.Schematic.tint.y, -astex.map.Schematic.tint.z, 0.0, 0.0);
astex.map.Schematic.v[1] = tm.addPointNoColor (astex.map.Schematic.wmtm.x, astex.map.Schematic.wmtm.y, astex.map.Schematic.wmtm.z, -astex.map.Schematic.tint.x, -astex.map.Schematic.tint.y, -astex.map.Schematic.tint.z, 0.0, 0.0);
astex.map.Schematic.v[2] = tm.addPointNoColor (astex.map.Schematic.wmtp.x, astex.map.Schematic.wmtp.y, astex.map.Schematic.wmtp.z, astex.map.Schematic.tint.x, astex.map.Schematic.tint.y, astex.map.Schematic.tint.z, 0.0, 0.0);
astex.map.Schematic.v[3] = tm.addPointNoColor (astex.map.Schematic.wptp.x, astex.map.Schematic.wptp.y, astex.map.Schematic.wptp.z, astex.map.Schematic.tint.x, astex.map.Schematic.tint.y, astex.map.Schematic.tint.z, 0.0, 0.0);
if (!cylinders) {
astex.map.Schematic.v[4] = tm.addPointNoColor (astex.map.Schematic.wmtm.x, astex.map.Schematic.wmtm.y, astex.map.Schematic.wmtm.z, -astex.map.Schematic.wint.x, -astex.map.Schematic.wint.y, -astex.map.Schematic.wint.z, 0.0, 0.0);
astex.map.Schematic.v[5] = tm.addPointNoColor (astex.map.Schematic.wmtp.x, astex.map.Schematic.wmtp.y, astex.map.Schematic.wmtp.z, -astex.map.Schematic.wint.x, -astex.map.Schematic.wint.y, -astex.map.Schematic.wint.z, 0.0, 0.0);
astex.map.Schematic.v[6] = tm.addPointNoColor (astex.map.Schematic.wptp.x, astex.map.Schematic.wptp.y, astex.map.Schematic.wptp.z, astex.map.Schematic.wint.x, astex.map.Schematic.wint.y, astex.map.Schematic.wint.z, 0.0, 0.0);
astex.map.Schematic.v[7] = tm.addPointNoColor (astex.map.Schematic.wptm.x, astex.map.Schematic.wptm.y, astex.map.Schematic.wptm.z, astex.map.Schematic.wint.x, astex.map.Schematic.wint.y, astex.map.Schematic.wint.z, 0.0, 0.0);
}if (!firstVertices) {
var end = 2;
if (!cylinders) {
end = 4;
}for (var k = 0; k < end; k++) {
var tcolor = color;
if (k == 0 && helixBack) {
tcolor = astex.util.Color32.gray;
} else {
tcolor = color;
}tm.addTriangle (astex.map.Schematic.v[0 + 2 * k], astex.map.Schematic.v[1 + 2 * k], astex.map.Schematic.lastv[0 + 2 * k], tcolor);
tm.addTriangle (astex.map.Schematic.v[1 + 2 * k], astex.map.Schematic.lastv[0 + 2 * k], astex.map.Schematic.lastv[1 + 2 * k], tcolor);
}
var cylRadius = aThick * 1.5;
if (cylinders) {
tm.addCylinder (astex.map.Schematic.wm.x, astex.map.Schematic.wm.y, astex.map.Schematic.wm.z, astex.map.Schematic.wmlast.x, astex.map.Schematic.wmlast.y, astex.map.Schematic.wmlast.z, cylRadius, color, color);
tm.addCylinder (astex.map.Schematic.wp.x, astex.map.Schematic.wp.y, astex.map.Schematic.wp.z, astex.map.Schematic.wplast.x, astex.map.Schematic.wplast.y, astex.map.Schematic.wplast.z, cylRadius, color, color);
}}for (var j = 0; j < 8; j++) {
astex.map.Schematic.lastv[j] = astex.map.Schematic.v[j];
}
}astex.map.Schematic.wmlast.setP (astex.map.Schematic.wm);
astex.map.Schematic.wplast.setP (astex.map.Schematic.wp);
firstVertices = false;
plast.setP (p);
first = false;
}
}
}, "astex.util.Arguments,astex.render.Tmesh");
c$.ensureSplineCapacity = Clazz.defineMethod (c$, "ensureSplineCapacity", 
 function (n) {
if (astex.map.Schematic.spline == null || astex.map.Schematic.spline.length < n) {
astex.map.Schematic.spline =  new Array (n);
astex.map.Schematic.splineColor =  Clazz.newIntArray (n, 0);
}for (var i = 0; i < n; i++) {
astex.map.Schematic.spline[i] =  new astex.util.Point3d ();
}
}, "~N");
c$.backbone = Clazz.defineMethod (c$, "backbone", 
function (args, tm) {
var prev = -1;
var d = 3.0;
for (var i = 0; i < astex.map.Schematic.residCount; i++) {
var p = astex.map.Schematic.guides[i];
var cur = astex.map.Schematic.type[i];
var np = 0;
if (cur == -1) {
if (astex.map.Schematic.addLabels) {
np = tm.addJack (p, d, astex.map.Schematic.colors[i], astex.map.Schematic.labels[i]);
} else {
np = tm.addJack (p, d, astex.map.Schematic.colors[i], "");
}} else {
if (astex.map.Schematic.addLabels) {
np = tm.addPointNoNorm (p.x, p.y, p.z, astex.map.Schematic.colors[i], astex.map.Schematic.labels[i]);
} else {
np = tm.addPointNoNormNoLabel (p.x, p.y, p.z, astex.map.Schematic.colors[i]);
}if (prev != -1 && astex.map.Schematic.checkDistance (i)) {
tm.addLine (np - 1, np, astex.map.Schematic.colors[i]);
}}prev = cur;
}
}, "astex.util.Arguments,astex.render.Tmesh");
c$.checkDistance = Clazz.defineMethod (c$, "checkDistance", 
 function (i) {
if (i == 0) return false;
if ((astex.map.Schematic.guides[i].x - astex.map.Schematic.guides[i - 1].x) * (astex.map.Schematic.guides[i].x - astex.map.Schematic.guides[i - 1].x) + (astex.map.Schematic.guides[i].y - astex.map.Schematic.guides[i - 1].y) * (astex.map.Schematic.guides[i].y - astex.map.Schematic.guides[i - 1].y) + (astex.map.Schematic.guides[i].z - astex.map.Schematic.guides[i - 1].z) * (astex.map.Schematic.guides[i].z - astex.map.Schematic.guides[i - 1].z) < 64.0) return true;
return false;
}, "~N");
c$.tube = Clazz.defineMethod (c$, "tube", 
function (args, tm) {
var quality = args.getInteger ("-quality", 1);
var smooth = args.getInteger ("-tubesmoothing", 1);
var splinePoints = args.getInteger ("-tubepoints", 4);
var perimPoints = args.getInteger ("-tubeperimeter", 8);
var radius = args.getDouble ("-tuberadius", 0.2);
var rTaper = args.getDouble ("-tubetaperradius", 0.1);
var tangent = args.getDouble ("-tubetangent", 2.);
var taper = args.getBoolean ("-tubetaper", false);
var colorBySS = args.getBoolean ("-colorbyss", false);
var color = args.getColor ("-tubecolor", astex.util.Color32.white);
splinePoints *= quality;
perimPoints *= quality;
astex.map.Schematic.ensureSplineCapacity (astex.map.Schematic.residCount * splinePoints);
var rfirst = astex.map.Schematic.resids[0];
var rlast = astex.map.Schematic.resids[astex.map.Schematic.residCount - 1];
var radii = null;
for (var iteration = 0; iteration < smooth; iteration++) {
for (var i = 1; i < astex.map.Schematic.residCount - 1; i++) {
var r = astex.map.Schematic.resids[i];
astex.map.Schematic.tmp[r].setP (astex.map.Schematic.guides[r - 1]);
astex.map.Schematic.tmp[r].add (astex.map.Schematic.guides[r + 1]);
astex.map.Schematic.tmp[r].scale (0.5);
astex.map.Schematic.tmp[r].add (astex.map.Schematic.guides[r]);
astex.map.Schematic.tmp[r].scale (0.5);
}
for (var i = 1; i < astex.map.Schematic.residCount - 1; i++) {
var r = astex.map.Schematic.resids[i];
astex.map.Schematic.guides[r].setP (astex.map.Schematic.tmp[r]);
}
}
for (var r = 1; r < astex.map.Schematic.guideCount - 1; r++) {
var before = r - 1;
var after = r + 1;
if (r == 0) {
before = r;
} else if (r == astex.map.Schematic.guideCount - 1) {
after = astex.map.Schematic.guideCount - 1;
}astex.map.Schematic.tangents[r].set (0.0, 0.0, 0.0);
astex.map.Schematic.tangents[r].subtract (astex.map.Schematic.guides[before]);
astex.map.Schematic.tangents[r].add (astex.map.Schematic.guides[after]);
astex.map.Schematic.tangents[r].normalise ();
}
var fudgeFirst = false;
var fudgeLast = false;
for (var i = 0; i < astex.map.Schematic.residCount; i++) {
var r = astex.map.Schematic.resids[i];
if (r == 0) {
fudgeFirst = true;
} else if (r == astex.map.Schematic.guideCount - 1) {
fudgeLast = true;
} else {
var ab = astex.util.Point3d.unitVectorP2 (astex.map.Schematic.guides[r - 1], astex.map.Schematic.guides[r]);
var bc = astex.util.Point3d.unitVectorP2 (astex.map.Schematic.guides[r], astex.map.Schematic.guides[r + 1]);
astex.util.Point3d.crossPts (astex.map.Schematic.width[r], ab, bc);
}}
if (astex.map.Schematic.residCount == 2) {
astex.util.Point3d.normalToLine (astex.map.Schematic.guides[rfirst], astex.map.Schematic.width[rfirst]);
astex.util.Point3d.normalToLine (astex.map.Schematic.guides[rlast], astex.map.Schematic.width[rlast]);
} else {
if (fudgeFirst) {
astex.map.Schematic.width[rfirst].setP (astex.map.Schematic.width[rfirst + 1]);
}if (fudgeLast) {
astex.map.Schematic.width[rlast].setP (astex.map.Schematic.width[rlast - 1]);
}}for (var i = 1; i < astex.map.Schematic.residCount; i++) {
var r = astex.map.Schematic.resids[i];
if (astex.map.Schematic.width[r].dot (astex.map.Schematic.width[r - 1]) < 0.0) {
astex.map.Schematic.width[r].negate ();
}}
for (var i = 0; i < astex.map.Schematic.residCount; i++) {
var r = astex.map.Schematic.resids[i];
astex.util.Point3d.crossPts (astex.map.Schematic.thick[r], astex.map.Schematic.tangents[r], astex.map.Schematic.width[r]);
}
for (var i = 1; i < astex.map.Schematic.residCount; i++) {
var r = astex.map.Schematic.resids[i];
if (astex.map.Schematic.thick[r].dot (astex.map.Schematic.thick[r - 1]) < 0.0) {
astex.map.Schematic.thick[r].negate ();
}}
var nsp = 0;
var first = true;
var pos =  new astex.util.Point3d ();
var pnew =  Clazz.newIntArray (perimPoints, 0);
var plast =  Clazz.newIntArray (perimPoints, 0);
if (taper) {
radii =  new astex.util.DoubleArray ();
}var sinTheta =  Clazz.newDoubleArray (perimPoints, 0);
var cosTheta =  Clazz.newDoubleArray (perimPoints, 0);
for (var iep = 0; iep < perimPoints; iep++) {
var theta = 2. * 3.141592653589793 * iep / perimPoints;
sinTheta[iep] = Math.sin (theta);
cosTheta[iep] = Math.cos (theta);
}
for (var i = 0; i < astex.map.Schematic.residCount - 1; i++) {
var r = astex.map.Schematic.resids[i];
var sp1 = splinePoints;
if (i == astex.map.Schematic.residCount - 2) {
sp1 = splinePoints + 1;
}for (var sp = 0; sp < sp1; sp++) {
var t = sp / (splinePoints);
if (smooth == 0) {
if (t < 0.5) {
t = t * t;
} else {
t = 1.0 - t;
t = t * t;
t = 1.0 - t;
}}if (taper) {
var rr = radius;
if (i == 0) {
if (t < 0.5) {
rr = rTaper + 2. * t * (radius - rTaper);
}} else if (i == astex.map.Schematic.residCount - 2) {
if (t > 0.5) {
rr = rTaper + 2. * (1.0 - t) * (radius - rTaper);
}}radii.add (rr);
}if (!colorBySS) {
color = astex.util.Color32.blendF (astex.map.Schematic.colors[r], astex.map.Schematic.colors[r + 1], 1. - t);
}astex.map.Schematic.splineColor[nsp] = color;
astex.map.Schematic.hermite_single (astex.map.Schematic.guides[r], astex.map.Schematic.guides[r + 1], astex.map.Schematic.tangents[r], tangent, astex.map.Schematic.tangents[r + 1], tangent, t, astex.map.Schematic.spline[nsp]);
nsp++;
}
}
var alast = null;
var blast = null;
for (var isp = 0; isp < nsp; isp++) {
var p = astex.map.Schematic.spline[isp];
var a = null;
var b = null;
if (alast == null) {
if (isp == 0) {
var dir = astex.util.Point3d.unitVectorP2 (astex.map.Schematic.spline[0], astex.map.Schematic.spline[1]);
a = astex.util.Point3d.normalToLineP (dir);
b = a.cross (dir);
} else {
var ab = astex.util.Point3d.unitVectorP2 (astex.map.Schematic.spline[isp - 1], astex.map.Schematic.spline[isp]);
var bc = astex.util.Point3d.unitVectorP2 (astex.map.Schematic.spline[isp], astex.map.Schematic.spline[isp + 1]);
var dir = astex.util.Point3d.unitVectorP2 (astex.map.Schematic.spline[isp - 1], astex.map.Schematic.spline[isp + 1]);
a = ab.cross (bc);
b = a.cross (dir);
}} else {
var dir = null;
if (isp == nsp - 1) {
dir = astex.util.Point3d.unitVectorP2 (astex.map.Schematic.spline[isp - 1], astex.map.Schematic.spline[isp]);
} else {
dir = astex.util.Point3d.unitVectorP2 (astex.map.Schematic.spline[isp - 1], astex.map.Schematic.spline[isp + 1]);
}b = dir.cross (alast);
a = b.cross (dir);
if (a.dot (alast) < 0.0) a.negate ();
if (b.dot (blast) < 0.0) b.negate ();
}var rr = radius;
if (taper) {
rr = radii.get (isp);
}color = astex.map.Schematic.splineColor[isp];
for (var ip = 0; ip < perimPoints; ip++) {
var costheta = cosTheta[ip];
var sintheta = sinTheta[ip];
for (var j = 0; j < 3; j++) {
pos.setComponent (j, a.get (j) * costheta + b.get (j) * sintheta);
}
pnew[ip] = tm.addPointNoColor (p.x + pos.x * rr, p.y + pos.y * rr, p.z + pos.z * rr, pos.x, pos.y, pos.z, 0.0, 0.0);
}
if (!first) {
for (var ip = 0; ip < perimPoints; ip++) {
var pnext = (ip + 1) % perimPoints;
tm.addTriangle (pnew[ip], plast[ip], pnew[pnext], color);
tm.addTriangle (plast[ip], pnew[pnext], plast[pnext], color);
}
} else {
var ptmp =  Clazz.newDoubleArray (3, 0);
var ntmp =  Clazz.newDoubleArray (3, 0);
var face =  Clazz.newIntArray (perimPoints, 0);
for (var ip = 0; ip < perimPoints; ip++) {
tm.getVertex (pnew[ip], ptmp, ntmp);
face[ip] = tm.addPointNoColor (ptmp[0], ptmp[1], ptmp[2], -astex.map.Schematic.tangents[rfirst].x, -astex.map.Schematic.tangents[rfirst].y, -astex.map.Schematic.tangents[rfirst].z, 0.0, 0.0);
}
for (var ip = 2; ip < perimPoints; ip++) {
tm.addTriangle (face[0], face[ip - 1], face[ip], color);
}
}for (var ip = 0; ip < perimPoints; ip++) {
plast[ip] = pnew[ip];
}
first = false;
alast = a;
blast = b;
}
var ptmp =  Clazz.newDoubleArray (3, 0);
var ntmp =  Clazz.newDoubleArray (3, 0);
var face =  Clazz.newIntArray (perimPoints, 0);
for (var p = 0; p < perimPoints; p++) {
tm.getVertex (pnew[p], ptmp, ntmp);
face[p] = tm.addPointNoColor (ptmp[0], ptmp[1], ptmp[2], astex.map.Schematic.tangents[rlast].x, astex.map.Schematic.tangents[rlast].y, astex.map.Schematic.tangents[rlast].z, 0.0, 0.0);
}
for (var p = 2; p < perimPoints; p++) {
tm.addTriangle (face[0], face[p - 1], face[p], color);
}
}, "astex.util.Arguments,astex.render.Tmesh");
c$.arrow = Clazz.defineMethod (c$, "arrow", 
function (args, tm) {
var quality = args.getInteger ("-quality", 1);
var smooth = args.getInteger ("-arrowsmoothing", 3);
var splinePoints = args.getInteger ("-arrowpoints", 4);
var aHeadWidth = 0.5 * args.getDouble ("-arrowheadwidth", 3.6);
var tangent = args.getDouble ("-arrowtangent", 2.0);
var aWidth = 0.5 * args.getDouble ("-arrowwidth", 2.2);
var aThick = 0.5 * args.getDouble ("-arrowthickness", 0.5);
var colorBySS = args.getBoolean ("-colorbyss", false);
var color = args.getColor ("-arrowcolor", astex.util.Color32.yellow);
splinePoints *= quality;
if (astex.map.Schematic.residCount <= 1) return;
for (var i = 1; i < astex.map.Schematic.residCount; i++) {
var r = astex.map.Schematic.resids[i];
if (astex.map.Schematic.width[r].dot (astex.map.Schematic.width[r - 1]) < 0.0) {
astex.map.Schematic.width[r].negate ();
}}
for (var i = 0; i < astex.map.Schematic.residCount; i++) {
var r = astex.map.Schematic.resids[i];
astex.map.Schematic.tmp[r].setP (astex.map.Schematic.width[r]);
if (i != 0) {
astex.map.Schematic.tmp[r].add (astex.map.Schematic.width[r - 1]);
} else if (i < astex.map.Schematic.residCount - 1) {
astex.map.Schematic.tmp[r].add (astex.map.Schematic.width[r + 1]);
}astex.map.Schematic.tmp[r].normalise ();
}
for (var i = 0; i < astex.map.Schematic.residCount; i++) {
var r = astex.map.Schematic.resids[i];
astex.map.Schematic.width[r].setP (astex.map.Schematic.tmp[r]);
}
for (var iteration = 0; iteration < smooth; iteration++) {
for (var i = 1; i < astex.map.Schematic.residCount - 1; i++) {
var r = astex.map.Schematic.resids[i];
astex.map.Schematic.tmp[r].setP (astex.map.Schematic.guides[r - 1]);
astex.map.Schematic.tmp[r].add (astex.map.Schematic.guides[r + 1]);
astex.map.Schematic.tmp[r].scale (0.5);
astex.map.Schematic.tmp[r].add (astex.map.Schematic.guides[r]);
astex.map.Schematic.tmp[r].scale (0.5);
}
for (var i = 1; i < astex.map.Schematic.residCount - 1; i++) {
var r = astex.map.Schematic.resids[i];
astex.map.Schematic.guides[r].setP (astex.map.Schematic.tmp[r]);
}
}
var ref =  new astex.util.Point3d ();
for (var i = 0; i < astex.map.Schematic.residCount; i++) {
var r = astex.map.Schematic.resids[i];
var before = r - 1;
var after = r + 1;
if (i == 0) {
before = r;
} else if (i == astex.map.Schematic.residCount - 1) {
after = r;
}var ab = astex.util.Point3d.unitVectorP2 (astex.map.Schematic.guides[before], astex.map.Schematic.guides[after]);
astex.util.Point3d.crossPts (astex.map.Schematic.thick[r], ab, astex.map.Schematic.width[r]);
astex.map.Schematic.tangents[r].setP (ab);
astex.util.Point3d.crossPts (ref, astex.map.Schematic.width[r], ab);
astex.util.Point3d.crossPts (astex.map.Schematic.width[r], ref, ab);
astex.map.Schematic.width[r].normalise ();
astex.util.Point3d.crossPts (astex.map.Schematic.thick[r], ab, astex.map.Schematic.width[r]);
}
for (var i = 1; i < astex.map.Schematic.residCount; i++) {
var r = astex.map.Schematic.resids[i];
if (astex.map.Schematic.thick[r].dot (astex.map.Schematic.thick[r - 1]) < 0.0) {
astex.map.Schematic.thick[r].negate ();
}}
if (astex.map.Schematic.residCount > 2) {
var last = astex.map.Schematic.resids[astex.map.Schematic.residCount - 1];
var prevLast = astex.map.Schematic.resids[astex.map.Schematic.residCount - 2];
astex.map.Schematic.width[last].setP (astex.map.Schematic.width[prevLast]);
astex.map.Schematic.thick[last].setP (astex.map.Schematic.thick[prevLast]);
}var first = true;
for (var i = 0; i < astex.map.Schematic.residCount - 1; i++) {
var r = astex.map.Schematic.resids[i];
var w = aWidth;
for (var sp = 0; sp < splinePoints; sp++) {
var t = 0.0;
if (i == astex.map.Schematic.residCount - 3) {
if (sp == splinePoints - 1) {
t = 0.9;
} else {
t = sp / (splinePoints - 1);
}} else if (i == astex.map.Schematic.residCount - 2) {
t = sp / (splinePoints - 1);
} else {
t = sp / (splinePoints);
}if (!colorBySS) {
color = astex.util.Color32.blendF (astex.map.Schematic.colors[r], astex.map.Schematic.colors[r + 1], 1. - t);
}astex.map.Schematic.hermite_single (astex.map.Schematic.guides[r], astex.map.Schematic.guides[r + 1], astex.map.Schematic.tangents[r], tangent, astex.map.Schematic.tangents[r + 1], tangent, t, astex.map.Schematic.p);
if (i == astex.map.Schematic.residCount - 2) {
w = astex.map.Schematic.p.distance (astex.map.Schematic.guides[r + 1]) / astex.map.Schematic.guides[r + 1].distance (astex.map.Schematic.guides[r]);
w *= aHeadWidth;
}astex.map.Schematic.interpolate (astex.map.Schematic.wint, astex.map.Schematic.width[r], astex.map.Schematic.width[r + 1], t);
astex.map.Schematic.interpolate (astex.map.Schematic.tint, astex.map.Schematic.thick[r], astex.map.Schematic.thick[r + 1], t);
for (var c = 0; c < 3; c++) {
astex.map.Schematic.wptp.setComponent (c, astex.map.Schematic.p.get (c) + astex.map.Schematic.wint.get (c) * w + astex.map.Schematic.tint.get (c) * aThick);
astex.map.Schematic.wptm.setComponent (c, astex.map.Schematic.p.get (c) + astex.map.Schematic.wint.get (c) * w - astex.map.Schematic.tint.get (c) * aThick);
astex.map.Schematic.wmtp.setComponent (c, astex.map.Schematic.p.get (c) - astex.map.Schematic.wint.get (c) * w + astex.map.Schematic.tint.get (c) * aThick);
astex.map.Schematic.wmtm.setComponent (c, astex.map.Schematic.p.get (c) - astex.map.Schematic.wint.get (c) * w - astex.map.Schematic.tint.get (c) * aThick);
}
if (first) {
var nx = -astex.map.Schematic.tangents[r].x;
var ny = -astex.map.Schematic.tangents[r].y;
var nz = -astex.map.Schematic.tangents[r].z;
astex.map.Schematic.v[0] = tm.addPointNoColor (astex.map.Schematic.wptp.x, astex.map.Schematic.wptp.y, astex.map.Schematic.wptp.z, nx, ny, nz, 0.0, 0.0);
astex.map.Schematic.v[1] = tm.addPointNoColor (astex.map.Schematic.wptm.x, astex.map.Schematic.wptm.y, astex.map.Schematic.wptm.z, nx, ny, nz, 0.0, 0.0);
astex.map.Schematic.v[2] = tm.addPointNoColor (astex.map.Schematic.wmtp.x, astex.map.Schematic.wmtp.y, astex.map.Schematic.wmtp.z, nx, ny, nz, 0.0, 0.0);
astex.map.Schematic.v[3] = tm.addPointNoColor (astex.map.Schematic.wmtm.x, astex.map.Schematic.wmtm.y, astex.map.Schematic.wmtm.z, nx, ny, nz, 0.0, 0.0);
tm.addTriangle (astex.map.Schematic.v[0], astex.map.Schematic.v[1], astex.map.Schematic.v[2], color);
tm.addTriangle (astex.map.Schematic.v[1], astex.map.Schematic.v[2], astex.map.Schematic.v[3], color);
}if (i == astex.map.Schematic.residCount - 2 && sp == 0) {
var nx = -astex.map.Schematic.tangents[r].x;
var ny = -astex.map.Schematic.tangents[r].y;
var nz = -astex.map.Schematic.tangents[r].z;
astex.map.Schematic.v[0] = tm.addPointNoColor (astex.map.Schematic.wptp.x, astex.map.Schematic.wptp.y, astex.map.Schematic.wptp.z, nx, ny, nz, 0.0, 0.0);
astex.map.Schematic.v[1] = tm.addPointNoColor (astex.map.Schematic.wptm.x, astex.map.Schematic.wptm.y, astex.map.Schematic.wptm.z, nx, ny, nz, 0.0, 0.0);
astex.map.Schematic.v[2] = tm.addPointNoColor (astex.map.Schematic.wmtp.x, astex.map.Schematic.wmtp.y, astex.map.Schematic.wmtp.z, nx, ny, nz, 0.0, 0.0);
astex.map.Schematic.v[3] = tm.addPointNoColor (astex.map.Schematic.wmtm.x, astex.map.Schematic.wmtm.y, astex.map.Schematic.wmtm.z, nx, ny, nz, 0.0, 0.0);
if (astex.map.Schematic.residCount > 2) {
tm.addTriangle (astex.map.Schematic.v[0], astex.map.Schematic.v[1], astex.map.Schematic.hv[1], color);
tm.addTriangle (astex.map.Schematic.v[0], astex.map.Schematic.hv[0], astex.map.Schematic.hv[1], color);
tm.addTriangle (astex.map.Schematic.v[2], astex.map.Schematic.v[3], astex.map.Schematic.hv[3], color);
tm.addTriangle (astex.map.Schematic.v[2], astex.map.Schematic.hv[2], astex.map.Schematic.hv[3], color);
} else {
tm.addTriangle (astex.map.Schematic.v[0], astex.map.Schematic.v[1], astex.map.Schematic.v[2], color);
tm.addTriangle (astex.map.Schematic.v[0], astex.map.Schematic.v[2], astex.map.Schematic.v[3], color);
}}if (i == astex.map.Schematic.residCount - 3 && sp == splinePoints - 1) {
var nx = -astex.map.Schematic.tangents[r].x;
var ny = -astex.map.Schematic.tangents[r].y;
var nz = -astex.map.Schematic.tangents[r].z;
astex.map.Schematic.hv[0] = tm.addPointNoColor (astex.map.Schematic.wptp.x, astex.map.Schematic.wptp.y, astex.map.Schematic.wptp.z, nx, ny, nz, 0.0, 0.0);
astex.map.Schematic.hv[1] = tm.addPointNoColor (astex.map.Schematic.wptm.x, astex.map.Schematic.wptm.y, astex.map.Schematic.wptm.z, nx, ny, nz, 0.0, 0.0);
astex.map.Schematic.hv[2] = tm.addPointNoColor (astex.map.Schematic.wmtp.x, astex.map.Schematic.wmtp.y, astex.map.Schematic.wmtp.z, nx, ny, nz, 0.0, 0.0);
astex.map.Schematic.hv[3] = tm.addPointNoColor (astex.map.Schematic.wmtm.x, astex.map.Schematic.wmtm.y, astex.map.Schematic.wmtm.z, nx, ny, nz, 0.0, 0.0);
}astex.map.Schematic.v[0] = tm.addPointNoColor (astex.map.Schematic.wptp.x, astex.map.Schematic.wptp.y, astex.map.Schematic.wptp.z, astex.map.Schematic.wint.x, astex.map.Schematic.wint.y, astex.map.Schematic.wint.z, 0.0, 0.0);
astex.map.Schematic.v[1] = tm.addPointNoColor (astex.map.Schematic.wptm.x, astex.map.Schematic.wptm.y, astex.map.Schematic.wptm.z, astex.map.Schematic.wint.x, astex.map.Schematic.wint.y, astex.map.Schematic.wint.z, 0.0, 0.0);
astex.map.Schematic.v[2] = tm.addPointNoColor (astex.map.Schematic.wptm.x, astex.map.Schematic.wptm.y, astex.map.Schematic.wptm.z, -astex.map.Schematic.tint.x, -astex.map.Schematic.tint.y, -astex.map.Schematic.tint.z, 0.0, 0.0);
astex.map.Schematic.v[3] = tm.addPointNoColor (astex.map.Schematic.wmtm.x, astex.map.Schematic.wmtm.y, astex.map.Schematic.wmtm.z, -astex.map.Schematic.tint.x, -astex.map.Schematic.tint.y, -astex.map.Schematic.tint.z, 0.0, 0.0);
astex.map.Schematic.v[4] = tm.addPointNoColor (astex.map.Schematic.wmtm.x, astex.map.Schematic.wmtm.y, astex.map.Schematic.wmtm.z, -astex.map.Schematic.wint.x, -astex.map.Schematic.wint.y, -astex.map.Schematic.wint.z, 0.0, 0.0);
astex.map.Schematic.v[5] = tm.addPointNoColor (astex.map.Schematic.wmtp.x, astex.map.Schematic.wmtp.y, astex.map.Schematic.wmtp.z, -astex.map.Schematic.wint.x, -astex.map.Schematic.wint.y, -astex.map.Schematic.wint.z, 0.0, 0.0);
astex.map.Schematic.v[6] = tm.addPointNoColor (astex.map.Schematic.wmtp.x, astex.map.Schematic.wmtp.y, astex.map.Schematic.wmtp.z, astex.map.Schematic.tint.x, astex.map.Schematic.tint.y, astex.map.Schematic.tint.z, 0.0, 0.0);
astex.map.Schematic.v[7] = tm.addPointNoColor (astex.map.Schematic.wptp.x, astex.map.Schematic.wptp.y, astex.map.Schematic.wptp.z, astex.map.Schematic.tint.x, astex.map.Schematic.tint.y, astex.map.Schematic.tint.z, 0.0, 0.0);
if (!first) {
if (i == astex.map.Schematic.residCount - 2 && sp == 0) {
for (var k = 1; k < 4; k += 2) {
tm.addTriangle (astex.map.Schematic.v[0 + 2 * k], astex.map.Schematic.v[1 + 2 * k], astex.map.Schematic.lastv[0 + 2 * k], color);
tm.addTriangle (astex.map.Schematic.v[1 + 2 * k], astex.map.Schematic.lastv[0 + 2 * k], astex.map.Schematic.lastv[1 + 2 * k], color);
}
} else {
for (var k = 0; k < 4; k++) {
tm.addTriangle (astex.map.Schematic.v[0 + 2 * k], astex.map.Schematic.v[1 + 2 * k], astex.map.Schematic.lastv[0 + 2 * k], color);
tm.addTriangle (astex.map.Schematic.v[1 + 2 * k], astex.map.Schematic.lastv[0 + 2 * k], astex.map.Schematic.lastv[1 + 2 * k], color);
}
}}for (var j = 0; j < 8; j++) {
astex.map.Schematic.lastv[j] = astex.map.Schematic.v[j];
}
first = false;
}
}
}, "astex.util.Arguments,astex.render.Tmesh");
c$.interpolate = Clazz.defineMethod (c$, "interpolate", 
function (s, p1, p2, t) {
s.x = p1.x + t * (p2.x - p1.x);
s.y = p1.y + t * (p2.y - p1.y);
s.z = p1.z + t * (p2.z - p1.z);
s.normalise ();
}, "astex.util.Point3d,astex.util.Point3d,astex.util.Point3d,~N");
c$.hermite_single = Clazz.defineMethod (c$, "hermite_single", 
function (P1, P2, T1, T1len, T2, T2len, s, p) {
var h1 = 2 * s * s * s - 3 * s * s + 1;
var h2 = -2 * s * s * s + 3 * s * s;
var h3 = s * s * s - 2 * s * s + s;
var h4 = s * s * s - s * s;
h3 *= T1len;
h4 *= T2len;
p.x = h1 * P1.x + h2 * P2.x + h3 * T1.x + h4 * T2.x;
p.y = h1 * P1.y + h2 * P2.y + h3 * T1.y + h4 * T2.y;
p.z = h1 * P1.z + h2 * P2.z + h3 * T1.z + h4 * T2.z;
}, "astex.util.Point3d,astex.util.Point3d,astex.util.Point3d,~N,astex.util.Point3d,~N,~N,astex.util.Point3d");
Clazz.pu$h(self.c$);
c$ = Clazz.decorateAsClass (function () {
this.npStart = null;
this.npEnd = null;
this.ntStart = null;
this.ntEnd = null;
Clazz.instantialize (this, arguments);
}, astex.map.Schematic, "TmTracker");
Clazz.defineMethod (c$, "init", 
function (a) {
this.npStart =  Clazz.newIntArray (a, 0);
this.npEnd =  Clazz.newIntArray (a, 0);
this.ntStart =  Clazz.newIntArray (a, 0);
this.ntEnd =  Clazz.newIntArray (a, 0);
}, "~N");
c$ = Clazz.p0p ();
Clazz.defineStatics (c$,
"guides", null,
"tangents", null,
"width", null,
"thick", null,
"tmp", null,
"t", null,
"tout", null,
"c", null,
"h", null,
"rv", null,
"type", null,
"colors", null,
"resids", null,
"widthInitialised", null,
"guideCount", 0,
"residCount", 0,
"labels", null,
"addLabels", false,
"ResAA", 1,
"ResNA", 2,
"ResLigand", 3,
"ResIon", 4);
c$.wptp = c$.prototype.wptp =  new astex.util.Point3d ();
c$.wptm = c$.prototype.wptm =  new astex.util.Point3d ();
c$.wmtp = c$.prototype.wmtp =  new astex.util.Point3d ();
c$.wmtm = c$.prototype.wmtm =  new astex.util.Point3d ();
c$.wm = c$.prototype.wm =  new astex.util.Point3d ();
c$.wp = c$.prototype.wp =  new astex.util.Point3d ();
c$.ep = c$.prototype.ep =  new astex.util.Point3d ();
c$.en = c$.prototype.en =  new astex.util.Point3d ();
c$.wmlast = c$.prototype.wmlast =  new astex.util.Point3d ();
c$.wplast = c$.prototype.wplast =  new astex.util.Point3d ();
c$.p = c$.prototype.p =  new astex.util.Point3d ();
c$.wint = c$.prototype.wint =  new astex.util.Point3d ();
c$.tint = c$.prototype.tint =  new astex.util.Point3d ();
Clazz.defineStatics (c$,
"lastv",  Clazz.newIntArray (8, 0),
"v",  Clazz.newIntArray (8, 0),
"hv",  Clazz.newIntArray (4, 0),
"COSA", 0.8480,
"COSB", 0.9816,
"SINA", 0.5299,
"SINB", 0.1908,
"spline", null,
"splineColor", null,
"Dsq", 64.0);
});
