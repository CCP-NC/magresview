Clazz.declarePackage ("astex.model");
Clazz.load (null, "astex.model.SecondaryStructure", ["astex.render.MoleculeRenderer", "$.Tmesh", "astex.util.Arguments", "$.IntArray", "$.Lattice", "$.Log", "$.Point3d"], function () {
c$ = Clazz.declareType (astex.model, "SecondaryStructure");
c$.assign = Clazz.defineMethod (c$, "assign", 
function (molecules) {
var moleculeCount = molecules.size ();
astex.model.SecondaryStructure.tm =  new astex.render.Tmesh ();
astex.model.SecondaryStructure.resCnt = 0;
for (var m = 0; m < moleculeCount; m++) {
var mol = molecules.get (m);
astex.model.SecondaryStructure.countRes (mol);
}
astex.model.SecondaryStructure.allocateMemory ();
for (var m = 0; m < moleculeCount; m++) {
var mol = molecules.get (m);
astex.model.SecondaryStructure.assignMolecule (mol);
}
return astex.model.SecondaryStructure.tm;
}, "astex.util.DynamicArray");
c$.allocateMemory = Clazz.defineMethod (c$, "allocateMemory", 
function () {
astex.model.SecondaryStructure.residues =  new Array (astex.model.SecondaryStructure.resCnt);
astex.model.SecondaryStructure.hpos =  new Array (astex.model.SecondaryStructure.resCnt);
astex.model.SecondaryStructure.opos =  new Array (astex.model.SecondaryStructure.resCnt);
astex.model.SecondaryStructure.types =  Clazz.newIntArray (astex.model.SecondaryStructure.resCnt, 0);
astex.model.SecondaryStructure.mapping =  Clazz.newIntArray (astex.model.SecondaryStructure.resCnt, 0);
astex.model.SecondaryStructure.hbond_no =  new Array (astex.model.SecondaryStructure.resCnt);
astex.model.SecondaryStructure.hbond_on =  new Array (astex.model.SecondaryStructure.resCnt);
});
c$.countRes = Clazz.defineMethod (c$, "countRes", 
function (mol) {
var chainCount = mol.getChainCount ();
for (var c = 0; c < chainCount; c++) {
var chain = mol.getChain (c);
astex.model.SecondaryStructure.resCnt += (chain.getResidueCount () + 4);
}
}, "astex.model.Molecule");
c$.assignMolecule = Clazz.defineMethod (c$, "assignMolecule", 
function (mol) {
var args =  new astex.util.Arguments ();
var hbondConstant = args.getDouble ("hbond.constant", -999.0);
var hbondCutoff = args.getDouble ("hbond.cutoff", -999.0);
if (astex.model.SecondaryStructure.residues == null) {
astex.model.SecondaryStructure.resCnt = 0;
astex.model.SecondaryStructure.countRes (mol);
astex.model.SecondaryStructure.allocateMemory ();
}astex.model.SecondaryStructure.nres = 0;
var realRes = 0;
var chainCount = mol.getChainCount ();
for (var c = 0; c < chainCount; c++) {
var chain = mol.getChain (c);
var residueCount = chain.getResidueCount ();
for (var r = 0; r < residueCount; r++) {
var res = chain.getResidue (r);
res.setSecondaryStructure (5);
astex.model.SecondaryStructure.residues[astex.model.SecondaryStructure.nres] = res;
astex.model.SecondaryStructure.types[astex.model.SecondaryStructure.nres] = res.getSecondaryStructure ();
astex.model.SecondaryStructure.hbond_no[astex.model.SecondaryStructure.nres] =  new astex.util.IntArray ();
astex.model.SecondaryStructure.hbond_on[astex.model.SecondaryStructure.nres] =  new astex.util.IntArray ();
astex.model.SecondaryStructure.hpos[astex.model.SecondaryStructure.nres] = null;
astex.model.SecondaryStructure.opos[astex.model.SecondaryStructure.nres] = null;
astex.model.SecondaryStructure.mapping[realRes] = astex.model.SecondaryStructure.nres;
realRes++;
astex.model.SecondaryStructure.nres++;
}
for (var i = 0; i < 4; i++) {
astex.model.SecondaryStructure.residues[astex.model.SecondaryStructure.nres] = null;
astex.model.SecondaryStructure.types[astex.model.SecondaryStructure.nres] = -1;
astex.model.SecondaryStructure.hbond_no[astex.model.SecondaryStructure.nres] =  new astex.util.IntArray ();
astex.model.SecondaryStructure.hbond_on[astex.model.SecondaryStructure.nres] =  new astex.util.IntArray ();
astex.model.SecondaryStructure.hpos[astex.model.SecondaryStructure.nres] = null;
astex.model.SecondaryStructure.opos[astex.model.SecondaryStructure.nres] = null;
astex.model.SecondaryStructure.nres++;
}
}
for (var r1 = 0; r1 < astex.model.SecondaryStructure.nres; r1++) {
if (astex.model.SecondaryStructure.residues[r1] != null) {
astex.model.SecondaryStructure.hpos[r1] = astex.model.SecondaryStructure.getAmideHydrogen (astex.model.SecondaryStructure.residues[r1]);
astex.model.SecondaryStructure.opos[r1] = astex.model.SecondaryStructure.residues[r1].getAtomFromName ("O");
}}
var neighbours =  new astex.util.IntArray ();
var ol =  new astex.util.Lattice (astex.model.SecondaryStructure.MaxHBondDistance * 1.05);
for (var r2 = 0; r2 < astex.model.SecondaryStructure.nres; r2++) {
if (astex.model.SecondaryStructure.opos[r2] != null) {
var o = astex.model.SecondaryStructure.opos[r2];
ol.add (r2, o.x, o.y, o.z);
}}
for (var r1 = 0; r1 < astex.model.SecondaryStructure.nres; r1++) {
var h = astex.model.SecondaryStructure.hpos[r1];
if (h != null) {
var n = astex.model.SecondaryStructure.residues[r1].getAtomFromName ("N");
neighbours.removeAllElements ();
ol.getPossibleNeighbours (r1, n.x, n.y, n.z, neighbours, true);
var neighbourCount = neighbours.size ();
for (var i = 0; i < neighbourCount; i++) {
var oid = neighbours.get (i);
var o = astex.model.SecondaryStructure.opos[oid];
if (o != null) {
var c = o.getBondedAtom ("C");
var e = astex.render.MoleculeRenderer.hbondEnergy (n, h, o, c, hbondConstant);
if (e < hbondCutoff) {
astex.model.SecondaryStructure.hbond_no[r1].add (oid);
astex.model.SecondaryStructure.hbond_on[oid].add (r1);
if (astex.model.SecondaryStructure.debug) {
System.out.println ("adding NH..O " + astex.model.SecondaryStructure.residues[r1] + " to " + astex.model.SecondaryStructure.residues[oid] + " d=" + o.distance (h));
}}} else {
astex.util.Log.error ("shouldn't be a null reference in o lattice");
}}
}}
for (var r1 = 3; r1 < astex.model.SecondaryStructure.nres; r1++) {
if (astex.model.SecondaryStructure.hbonded (r1, r1 - 3)) {
for (var r2 = r1 - 2; r2 < r1; r2++) {
astex.model.SecondaryStructure.types[r2] = 4;
}
}}
for (var r1 = 1; r1 < astex.model.SecondaryStructure.nres - 4; r1++) {
if (astex.model.SecondaryStructure.hbonded (r1 + 3, r1 - 1) && astex.model.SecondaryStructure.hbonded (r1 + 4, r1)) {
for (var r2 = r1; r2 <= r1 + 3; r2++) {
astex.model.SecondaryStructure.types[r2] = 2;
}
}if (astex.model.SecondaryStructure.hbonded (r1 + 2, r1 - 1) && astex.model.SecondaryStructure.hbonded (r1 + 3, r1)) {
for (var r2 = r1; r2 <= r1 + 2; r2++) {
astex.model.SecondaryStructure.types[r2] = 2;
}
}}
for (var ri = 0; ri < astex.model.SecondaryStructure.nres; ri++) {
if (astex.model.SecondaryStructure.types[ri] == 5 || astex.model.SecondaryStructure.types[ri] == 1) {
var hbondCount = astex.model.SecondaryStructure.hbond_no[ri].size ();
if (astex.model.SecondaryStructure.debug && hbondCount > 0) {
System.out.println ("checking residue " + astex.model.SecondaryStructure.residues[ri] + " " + hbondCount + " hbonds");
}for (var hb = 0; hb < hbondCount; hb++) {
var rj = astex.model.SecondaryStructure.hbond_no[ri].get (hb);
if (astex.model.SecondaryStructure.debug) {
System.out.println ("hydrogen bonded to " + astex.model.SecondaryStructure.residues[rj]);
}if (ri < rj && rj >= 0 && rj < astex.model.SecondaryStructure.nres) {
if (astex.model.SecondaryStructure.debug) {
System.out.println ("## ri < rj rj valid");
System.out.println ("### type is coilri < rj rj valid");
}if ((astex.model.SecondaryStructure.hbonded (ri, rj) && astex.model.SecondaryStructure.hbonded (rj, ri))) {
if (astex.model.SecondaryStructure.debug) {
System.out.println ("### anti-parallel");
}astex.model.SecondaryStructure.assignSheetType (ri);
astex.model.SecondaryStructure.assignSheetType (rj);
astex.model.SecondaryStructure.assignSheetType (ri - 1);
astex.model.SecondaryStructure.assignSheetType (rj + 1);
if (Math.abs (ri - rj) >= 5) {
astex.model.SecondaryStructure.assignSheetType (ri + 1);
astex.model.SecondaryStructure.assignSheetType (rj - 1);
}}}}
}}
for (var ri = 0; ri < astex.model.SecondaryStructure.nres; ri++) {
if (astex.model.SecondaryStructure.types[ri] == 5 || astex.model.SecondaryStructure.types[ri] == 1) {
var hbondCount = astex.model.SecondaryStructure.hbond_no[ri].size ();
for (var hb = 0; hb < hbondCount; hb++) {
var rrj = astex.model.SecondaryStructure.hbond_no[ri].get (hb);
for (var rj = rrj - 1; rj < rrj + 2; rj++) {
if (rj >= 0 && rj < astex.model.SecondaryStructure.nres) {
if ((astex.model.SecondaryStructure.hbonded (ri, rj - 1) && astex.model.SecondaryStructure.hbonded (rj + 1, ri)) || (astex.model.SecondaryStructure.hbonded (rj - 1, ri) && astex.model.SecondaryStructure.hbonded (ri, rj + 1))) {
astex.model.SecondaryStructure.assignSheetType (ri);
astex.model.SecondaryStructure.assignSheetType (rj);
if (Math.abs (ri - rj) >= 5) {
astex.model.SecondaryStructure.assignSheetType (rj + 1);
}astex.model.SecondaryStructure.assignSheetType (rj - 1);
}}}
}
}}
astex.model.SecondaryStructure.regulariseSS (astex.model.SecondaryStructure.types, astex.model.SecondaryStructure.nres);
astex.model.SecondaryStructure.nres = 0;
for (var c = 0; c < chainCount; c++) {
var chain = mol.getChain (c);
var residueCount = chain.getResidueCount ();
for (var r = 0; r < residueCount; r++) {
var res = chain.getResidue (r);
res.setSecondaryStructure (astex.model.SecondaryStructure.types[astex.model.SecondaryStructure.mapping[astex.model.SecondaryStructure.nres++]]);
}
}
}, "astex.model.Molecule");
c$.assignSheetType = Clazz.defineMethod (c$, "assignSheetType", 
 function (r) {
if (r >= 0 && r < astex.model.SecondaryStructure.nres && (astex.model.SecondaryStructure.types[r] == 5 || astex.model.SecondaryStructure.types[r] == 1)) {
astex.model.SecondaryStructure.types[r] = 1;
}}, "~N");
c$.hbonded = Clazz.defineMethod (c$, "hbonded", 
 function (ri, rj) {
if (ri < 0 || ri >= astex.model.SecondaryStructure.nres || rj < 0 || rj >= astex.model.SecondaryStructure.nres) {
return false;
}if (astex.model.SecondaryStructure.hbond_no[ri].contains (rj)) {
return true;
}return false;
}, "~N,~N");
c$.getAmideHydrogen = Clazz.defineMethod (c$, "getAmideHydrogen", 
 function (r) {
if (r == null) {
return null;
}var N = r.getAtomFromName ("N");
if (N == null) {
return null;
}var CA = N.getBondedAtom ("CA");
var C = N.getBondedAtom ("C");
if (N == null || CA == null || C == null) {
return null;
}var hpos = astex.util.Point3d.newP (N);
hpos.subtract (C);
hpos.add (N);
hpos.subtract (CA);
hpos.normalise ();
hpos.scale (1.04);
hpos.add (N);
return hpos;
}, "astex.model.Residue");
c$.regulariseSS = Clazz.defineMethod (c$, "regulariseSS", 
 function (types, n) {
for (var r = 1; r < n - 1; r++) {
if (types[r] == 5 && ((types[r - 1] == 1 && types[r + 1] == 1) || ((types[r - 1] == 2 && types[r + 1] == 2)))) {
if (astex.model.SecondaryStructure.debug) {
System.out.println ("changing " + astex.model.SecondaryStructure.residues[r]);
}types[r] = types[r - 1];
} else if (types[r] == 2 && ((types[r - 1] == 1 && types[r + 1] == 1))) {
if (astex.model.SecondaryStructure.debug) {
System.out.println ("changing " + astex.model.SecondaryStructure.residues[r]);
}types[r] = types[r - 1];
} else if (types[r] == 1 && ((types[r - 1] != 1 && types[r + 1] != 1))) {
if (astex.model.SecondaryStructure.debug) {
System.out.println ("changing " + astex.model.SecondaryStructure.residues[r]);
}types[r] = types[r - 1];
} else if (types[r] != 5 && ((types[r - 1] == 5 && types[r + 1] == 5))) {
if (astex.model.SecondaryStructure.debug) {
System.out.println ("changing " + astex.model.SecondaryStructure.residues[r]);
}types[r] = 5;
} else if (types[r] == -1) {
types[r] = 5;
}}
for (var r = 0; r < n - 2; r++) {
if (r == 0 && types[r] == 1 && types[r + 1] == 1 && types[r + 2] != 1) {
if (astex.model.SecondaryStructure.debug) System.out.println ("removing 2 residue strand at n-terminus");
types[r] = types[r + 1] = 5;
} else if (r == n - 2 && types[r] != 1 && types[r + 1] == 1 && types[r + 2] == 1) {
types[r + 1] = types[r + 2] = 5;
if (astex.model.SecondaryStructure.debug) System.out.println ("removing 2 residue strand at c-terminus");
} else if (types[r] != 1 && types[r + 1] == 1 && types[r + 2] == 1 && types[r + 3] != 1) {
if (astex.model.SecondaryStructure.debug) System.out.println ("removing 2 residue internal strand");
types[r + 1] = types[r + 2] = 5;
}}
for (var r = 0; r < n; r++) {
if (types[r] == 4) {
types[r] = 5;
}}
}, "~A,~N");
c$.assignInitialType = Clazz.defineMethod (c$, "assignInitialType", 
function (res) {
var Ni = res.getAtomFromName ("N");
var CAi = res.getAtomFromName ("CA");
var Ci = res.getAtomFromName ("C");
var Cim1 = null;
var Nip1 = null;
if (Ni == null && CAi == null && Ci == null) {
res.setSecondaryStructure (-1);
} else {
if (Ni != null) {
Cim1 = Ni.getBondedAtom ("C");
}if (Ci != null) {
Nip1 = Ci.getBondedAtom ("N");
}if (Ni == null || CAi == null || Ci == null || Cim1 == null || Nip1 == null) {
res.setSecondaryStructure (5);
} else {
var phi = astex.util.Point3d.torsionDegreesP (Cim1, Ni, CAi, Ci);
var psi = astex.util.Point3d.torsionDegreesP (Ni, CAi, Ci, Nip1);
var ssType = 5;
if (phi < -45 && phi > -160 && (psi < -170 || psi > 10)) {
} else if (phi < -45 && phi > -160 && psi > -80 && psi < -25) {
ssType = 2;
}res.setSecondaryStructure (ssType);
}}}, "astex.model.Residue");
Clazz.defineStatics (c$,
"MaxHBondDistance", 5.5,
"tm", null,
"residues", null,
"hpos", null,
"opos", null,
"types", null,
"mapping", null,
"hbond_no", null,
"hbond_on", null,
"nres", 0,
"resCnt", 0,
"debug", false);
});
