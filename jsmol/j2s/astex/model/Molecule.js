Clazz.declarePackage ("astex.model");
Clazz.load (["astex.generic.Generic", "astex.model.Selectable", "astex.util.DynamicArray"], "astex.model.Molecule", ["astex.model.Angle", "$.Atom", "$.Bond", "$.Chain", "$.Ring", "$.Selection", "$.Symmetry", "astex.util.Improper", "$.Matrix", "$.Point3d", "java.lang.Boolean", "$.Double", "java.util.Collections", "JU.Lst"], function () {
c$ = Clazz.decorateAsClass (function () {
this.matrix = null;
this.rdcAxes = null;
this.showRdcAxes = false;
this.atoms = null;
this.bonds = null;
this.angles = null;
this.impropers = null;
this.rings = null;
this.chains = null;
this.moleculeName = null;
this.filename = null;
this.type = null;
this.center = null;
this.radius = 0.0;
this.symmetry = null;
this.bioTransforms = null;
this.expMethod = null;
this.flags = 0;
this.displayStyle = 0;
this.displayed = 1;
this.moleculeType = 1;
this.modelType = 1;
this.modelNumber = 1;
this.centralAtomCount = 0;
this.startAtom = 0;
this.currentChain = null;
this.debug = false;
this.cell1 = null;
this.cell2 = null;
this.nc1 = 0;
this.nc2 = 0;
this.bondingRadii = null;
this.list = null;
this.head = null;
this.atomArray = null;
this.offsets = null;
Clazz.instantialize (this, arguments);
}, astex.model, "Molecule", astex.generic.Generic, astex.model.Selectable);
Clazz.prepareFields (c$, function () {
this.matrix = [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0];
this.rdcAxes = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
this.bioTransforms =  new astex.util.DynamicArray ();
this.displayStyle = astex.model.Molecule.Normal;
this.offsets = [[-1, -1, -1], [0, -1, -1], [1, -1, -1], [-1, 0, -1], [0, 0, -1], [1, 0, -1], [-1, 1, -1], [0, 1, -1], [1, 1, -1], [-1, -1, 0], [0, -1, 0], [1, -1, 0], [-1, 0, 0]];
});
Clazz.defineMethod (c$, "setModelType", 
function (mt) {
this.modelType = mt;
}, "~N");
Clazz.defineMethod (c$, "getModelType", 
function () {
return this.modelType;
});
Clazz.defineMethod (c$, "setModelNumber", 
function (mn) {
this.modelNumber = mn;
}, "~N");
Clazz.defineMethod (c$, "getModelNumber", 
function () {
return this.modelNumber;
});
Clazz.defineMethod (c$, "setCentralAtomCount", 
function (cac) {
this.centralAtomCount = cac;
}, "~N");
Clazz.defineMethod (c$, "getCentralAtomCount", 
function () {
return this.centralAtomCount;
});
Clazz.defineMethod (c$, "getMoleculeType", 
function () {
return this.moleculeType;
});
Clazz.defineMethod (c$, "setMoleculeType", 
function (t) {
this.moleculeType = t;
}, "~N");
Clazz.defineMethod (c$, "setRdcAxes", 
function (r) {
var axesArray = r.$plit ("#");
for (var i = 0; i < 9; i++) {
this.rdcAxes[i] = Double.parseDouble (axesArray[i]);
}
}, "~S");
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, astex.model.Molecule, []);
this.setClassname (this.getClass ().getName ());
 new astex.model.Selection ();
this.atoms =  new astex.util.DynamicArray ().set (20, 0);
this.bonds =  new astex.util.DynamicArray ().set (20, 0);
this.angles =  new astex.util.DynamicArray ().set (20, 0);
this.impropers =  new astex.util.DynamicArray ().set (20, 0);
this.rings =  new astex.util.DynamicArray ().set (1, 1);
this.chains =  new astex.util.DynamicArray ().set (1, 1);
this.initialise ();
});
Clazz.defineMethod (c$, "initialise", 
function () {
this.atoms.removeAllElements ();
this.bonds.removeAllElements ();
this.angles.removeAllElements ();
this.impropers.removeAllElements ();
this.rings.removeAllElements ();
this.chains.removeAllElements ();
this.currentChain = null;
this.flags = 0;
this.center = null;
this.radius = 0.0;
this.symmetry = null;
this.bioTransforms.removeAllElements ();
this.displayStyle = astex.model.Molecule.Normal;
this.displayed = 1;
astex.model.Molecule.residueCount = 0;
this.setValue ("hydrogens", Boolean.TRUE);
this.setValue ("bondDetails", Boolean.TRUE);
});
Clazz.overrideMethod (c$, "toString", 
function () {
var ret = this.getName ();
var atomCount = this.getAtomCount ();
var bondCount = this.getBondCount ();
var chainCount = this.getChainCount ();
if (chainCount > 1) {
ret += (" " + chainCount + " chains");
}ret += (" " + atomCount + " atoms");
ret += (" " + bondCount + " bonds");
return ret;
});
Clazz.defineMethod (c$, "setDisplayStyle", 
function (style) {
this.displayStyle = style;
}, "~N");
Clazz.defineMethod (c$, "getDisplayStyle", 
function () {
return this.displayStyle;
});
Clazz.defineMethod (c$, "isDisplayStyle", 
function (style) {
return (this.displayStyle & style) > 0;
}, "~N");
Clazz.defineMethod (c$, "setDisplayed", 
function (newState) {
if (newState == 0) {
this.displayed = 0;
} else if (newState == 1) {
this.displayed = 1;
} else if (newState == 2) {
this.displayed = 1 - this.displayed;
} else {
System.out.println ("setDisplayed: invalid state " + newState);
}}, "~N");
Clazz.defineMethod (c$, "getDisplayed", 
function () {
return (this.displayed == 1);
});
Clazz.defineMethod (c$, "getAtomCount", 
function () {
return this.atoms.size ();
});
Clazz.defineMethod (c$, "getAtom", 
function (index) {
return this.atoms.get (index);
}, "~N");
Clazz.defineMethod (c$, "getAtomWithId", 
function (id) {
var atomCount = this.getAtomCount ();
for (; this.startAtom < atomCount; this.startAtom++) {
var atom = this.getAtom (this.startAtom);
if (atom.getId () == id) {
return atom;
}}
for (this.startAtom = 0; this.startAtom < atomCount; this.startAtom++) {
var atom = this.getAtom (this.startAtom);
if (atom.getId () == id) {
return atom;
}}
return null;
}, "~N");
Clazz.defineMethod (c$, "assignAtomNumbers", 
function () {
var atomCount = this.getAtomCount ();
for (var a = 0; a < atomCount; a++) {
var atom = this.getAtom (a);
atom.setId (a);
}
});
Clazz.defineMethod (c$, "isSymmetryMolecule", 
function () {
if (this.moleculeName != null && this.moleculeName.startsWith ("Symmetry")) {
return true;
}return false;
});
Clazz.defineMethod (c$, "getBondCount", 
function () {
return this.bonds.size ();
});
Clazz.defineMethod (c$, "getBond", 
function (index) {
return this.bonds.get (index);
}, "~N");
Clazz.defineMethod (c$, "getAngleCount", 
function () {
this.ensureAnglesAssigned ();
return this.angles.size ();
});
Clazz.defineMethod (c$, "getAngle", 
function (index) {
this.ensureAnglesAssigned ();
return this.angles.get (index);
}, "~N");
Clazz.defineMethod (c$, "ensureAnglesAssigned", 
 function () {
if ((this.flags & astex.model.Molecule.AnglesAssigned) == 0) {
this.generateAngles ();
this.flags |= astex.model.Molecule.AnglesAssigned;
}});
Clazz.defineMethod (c$, "generateAngles", 
 function () {
this.angles.removeAllElements ();
var atomCount = this.getAtomCount ();
var atomArray = this.getAtomArray ();
for (var a = 0; a < atomCount; a++) {
var atom = atomArray[a];
var bondCount = atom.getBondCount ();
for (var b1 = 0; b1 < bondCount; b1++) {
var atom1 = atom.getBondedAtom (b1);
for (var b2 = b1 + 1; b2 < bondCount; b2++) {
var atom2 = atom.getBondedAtom (b2);
var angle = astex.model.Angle.create ();
angle.setFirstAtom (atom1);
angle.setSecondAtom (atom);
angle.setThirdAtom (atom2);
this.angles.add (angle);
}
}
}
});
Clazz.defineMethod (c$, "getAngleArray", 
function () {
return this.angles.getArray ();
});
Clazz.defineMethod (c$, "getImproperCount", 
function () {
this.ensureImpropersAssigned ();
return this.impropers.size ();
});
Clazz.defineMethod (c$, "getImproper", 
function (index) {
this.ensureImpropersAssigned ();
return this.impropers.get (index);
}, "~N");
Clazz.defineMethod (c$, "ensureImpropersAssigned", 
 function () {
if ((this.flags & astex.model.Molecule.ImpropersAssigned) == 0) {
this.generateImpropers ();
this.flags |= astex.model.Molecule.ImpropersAssigned;
}});
Clazz.defineMethod (c$, "getImproperArray", 
function () {
return this.impropers.getArray ();
});
Clazz.defineMethod (c$, "getBioTransformCount", 
function () {
return this.bioTransforms.size ();
});
Clazz.defineMethod (c$, "getBioTransform", 
function (i) {
return this.bioTransforms.get (i);
}, "~N");
Clazz.defineMethod (c$, "addBioTransform", 
function (m) {
this.bioTransforms.add (m);
}, "astex.util.Matrix");
Clazz.defineMethod (c$, "getAtomArray", 
function () {
return this.atoms.getArray ();
});
Clazz.defineMethod (c$, "getBondArray", 
function () {
return this.bonds.getArray ();
});
Clazz.defineMethod (c$, "ensureRingsAssigned", 
 function () {
if ((this.flags & astex.model.Molecule.RingsAssigned) == 0) {
this.findRings ();
this.flags |= astex.model.Molecule.RingsAssigned;
}});
Clazz.defineMethod (c$, "getRing", 
function (index) {
this.ensureRingsAssigned ();
return this.rings.get (index);
}, "~N");
Clazz.defineMethod (c$, "getRingCount", 
function () {
this.ensureRingsAssigned ();
return this.rings.size ();
});
Clazz.defineMethod (c$, "getChainCount", 
function () {
return this.chains.size ();
});
Clazz.defineMethod (c$, "getChain", 
function (index) {
return this.chains.get (index);
}, "~N");
Clazz.defineMethod (c$, "getCurrentChain", 
function () {
if (this.currentChain == null) this.addChain ();
return this.currentChain;
});
Clazz.defineMethod (c$, "getResidueCount", 
function () {
var totalResidues = 0;
for (var c = 0; c < this.getChainCount (); c++) {
var chain = this.getChain (c);
totalResidues += chain.getResidueCount ();
}
return totalResidues;
});
Clazz.defineMethod (c$, "addChain", 
function () {
this.currentChain = astex.model.Chain.create ();
this.currentChain.setParent (this);
this.chains.add (this.currentChain);
return this.currentChain;
});
Clazz.defineMethod (c$, "findChain", 
function (name, add) {
var chainCount = this.getChainCount ();
for (var c = 0; c < chainCount; c++) {
var chain = this.getChain (c);
if (chain.getName ().equals (name)) {
return chain;
}}
if (add) {
var chain = this.addChain ();
chain.setName (name);
return chain;
}return null;
}, "~S,~B");
Clazz.defineMethod (c$, "addResidue", 
function () {
var chain = this.getCurrentChain ();
var residue = chain.addResidue ();
residue.setSequentialNumber (astex.model.Molecule.residueCount++);
return residue;
});
Clazz.defineMethod (c$, "getMaximumId", 
function () {
var maxId = -2147483648;
var atomCount = this.getAtomCount ();
for (var a = 0; a < atomCount; a++) {
var atom = this.getAtom (a);
var id = atom.getId ();
if (id > maxId) {
maxId = id;
}}
if (maxId == -2147483648) {
maxId = 0;
}return maxId;
});
Clazz.defineMethod (c$, "addNewAtom", 
function () {
var newAtom = astex.model.Atom.create ();
this.atoms.add (newAtom);
var currentResidue = this.getCurrentChain ().getCurrentResidue ();
currentResidue.addAtom (newAtom);
newAtom.setParent (currentResidue);
return newAtom;
});
Clazz.defineMethod (c$, "addAtomForResidue", 
function (res) {
var atom = astex.model.Atom.create ();
atom.setParent (res);
this.atoms.add (atom);
res.addAtom (atom);
return atom;
}, "astex.model.Residue");
Clazz.defineMethod (c$, "addAtom", 
function (atom) {
this.atoms.add (atom);
var currentResidue = this.getCurrentChain ().getCurrentResidue ();
currentResidue.addAtom (atom);
atom.setParent (currentResidue);
return atom;
}, "astex.model.Atom");
Clazz.defineMethod (c$, "reorderAtoms", 
function () {
var atomCount = this.getAtomCount ();
this.atoms.removeAllElements ();
var chainCount = this.getChainCount ();
for (var c = 0; c < chainCount; c++) {
var chain = this.getChain (c);
var resCount = chain.getResidueCount ();
for (var r = 0; r < resCount; r++) {
var res = chain.getResidue (r);
atomCount = res.getAtomCount ();
for (var a = 0; a < atomCount; a++) {
var atom = res.getAtom (a);
this.atoms.add (atom);
}
}
}
atomCount = this.getAtomCount ();
});
Clazz.defineMethod (c$, "addRing", 
function () {
var newRing = astex.model.Ring.create ();
this.rings.add (newRing);
return newRing;
});
Clazz.defineMethod (c$, "addBond", 
function (firstAtom, secondAtom, bondOrder, explicit, checkChains) {
var firstInsertion = (firstAtom.getInsertionCode ()).charCodeAt (0);
var secondInsertion = (secondAtom.getInsertionCode ()).charCodeAt (0);
var newBond = null;
if (!explicit) {
if ((firstAtom.hasExplicitBond () && secondAtom.hasExplicitBond ())) {
return null;
}}if ((firstInsertion == 32 || secondInsertion == 32) || firstInsertion == secondInsertion) {
if (firstAtom.isSolvent () || secondAtom.isSolvent ()) {
} else {
newBond = astex.model.Bond.create ();
newBond.setFirstAtom (firstAtom);
newBond.setSecondAtom (secondAtom);
newBond.setBondOrder (bondOrder);
if (explicit) {
newBond.setExplicitBond (true);
}this.bonds.add (newBond);
firstAtom.addBond (newBond);
secondAtom.addBond (newBond);
}if (checkChains) {
var ch1 = firstAtom.getResidue ().getParent ();
var ch2 = secondAtom.getResidue ().getParent ();
if (ch1.hashCode () != ch2.hashCode ()) {
ch1.addChildChain (ch2);
ch2.setParentChain (ch1);
}}}return newBond;
}, "astex.model.Atom,astex.model.Atom,~N,~B,~B");
Clazz.defineMethod (c$, "addBondFromIndexOrder", 
function (firstAtomIndex, secondAtomIndex, bondOrder) {
var firstAtom = this.getAtom (firstAtomIndex);
var secondAtom = this.getAtom (secondAtomIndex);
return this.addBond (firstAtom, secondAtom, bondOrder, true, false);
}, "~N,~N,~N");
Clazz.defineMethod (c$, "addBondFromIds", 
function (firstAtomID, secondAtomID, bondOrder) {
var a1 = this.getAtomWithId (firstAtomID);
var searchAtom = this.startAtom;
var a2 = this.getAtomWithId (secondAtomID);
this.startAtom = searchAtom;
var newBond = this.addBond (a1, a2, bondOrder, false, false);
return newBond;
}, "~N,~N,~N");
Clazz.defineMethod (c$, "removeAtom", 
function (a) {
var residue = a.getResidue ();
residue.removeAtom (a);
this.atoms.remove (a);
}, "astex.model.Atom");
Clazz.defineMethod (c$, "removeBond", 
function (b) {
this.bonds.remove (b);
}, "astex.model.Bond");
Clazz.defineMethod (c$, "isSpecialAtom", 
function (atom) {
var element = atom.getElement ();
return (element == 16 || element == 15);
}, "astex.model.Atom");
Clazz.defineMethod (c$, "cellIndex", 
 function (ix, iy, iz, nx, ny, nz) {
return ix + iy * nx + iz * nx * ny;
}, "~N,~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "connect2", 
function () {
var xmin = 1.e10;
var xmax = -1.0E10;
var ymin = 1.e10;
var ymax = -1.0E10;
var zmin = 1.e10;
var zmax = -1.0E10;
var atomCount = this.getAtomCount ();
if (atomCount == 0) {
return 0;
}this.atomArray = this.atoms.getArray ();
this.bondingRadii =  Clazz.newDoubleArray (atomCount, 0);
for (var a1 = 0; a1 < atomCount; a1++) {
var atom = this.getAtom (a1);
this.bondingRadii[a1] = atom.getBondingRadius ();
}
for (var a = 0; a < atomCount; a++) {
var atom = this.getAtom (a);
if (atom.x < xmin) xmin = atom.x;
if (atom.y < ymin) ymin = atom.y;
if (atom.z < zmin) zmin = atom.z;
if (atom.x > xmax) xmax = atom.x;
if (atom.y > ymax) ymax = atom.y;
if (atom.z > zmax) zmax = atom.z;
}
xmin -= 0.1;
ymin -= 0.1;
zmin -= 0.1;
xmax += 0.1;
ymax += 0.1;
zmax += 0.1;
if (this.debug) {
System.out.println ("xmin " + xmin);
System.out.println ("ymin " + ymin);
System.out.println ("zmin " + zmin);
System.out.println ("xmax " + xmax);
System.out.println ("ymax " + ymax);
System.out.println ("zmax " + zmax);
}var spacing = 5.0;
var nx = 1 + Clazz.doubleToInt ((xmax - xmin) / spacing);
var ny = 1 + Clazz.doubleToInt ((ymax - ymin) / spacing);
var nz = 1 + Clazz.doubleToInt ((zmax - zmin) / spacing);
var ncell = nx * ny * nz;
this.cell1 =  Clazz.newIntArray (1024, 0);
this.cell2 =  Clazz.newIntArray (1024, 0);
if (this.debug) {
System.out.println ("nx " + nx + " ny " + ny + " nz " + nz);
}this.head =  Clazz.newIntArray (ncell, 0);
this.list =  Clazz.newIntArray (atomCount, 0);
for (var i = 0; i < ncell; i++) {
this.head[i] = -1;
}
for (var a = 0; a < atomCount; a++) {
var atom = this.getAtom (a);
var ix = Clazz.doubleToInt ((atom.x - xmin) / spacing);
var iy = Clazz.doubleToInt ((atom.y - ymin) / spacing);
var iz = Clazz.doubleToInt ((atom.z - zmin) / spacing);
var icell = this.cellIndex (ix, iy, iz, nx, ny, nz);
if (icell < 0 || icell >= ncell) {
System.out.println ("invalid cell " + icell);
}this.list[a] = this.head[icell];
this.head[icell] = a;
}
var icell = 0;
var offsetlen = this.offsets.length;
var occupiedCells = 0;
for (var iz = 0; iz < nz; iz++) {
for (var iy = 0; iy < ny; iy++) {
for (var ix = 0; ix < nx; ix++) {
if (this.head[icell] != -1) {
occupiedCells++;
this.connectCell (icell);
for (var ioff = 0; ioff < offsetlen; ioff++) {
var ix2 = ix - this.offsets[ioff][0];
var iy2 = iy - this.offsets[ioff][1];
var iz2 = iz - this.offsets[ioff][2];
if (ix2 >= 0 && ix2 < nx && iy2 >= 0 && iy2 < ny && iz2 >= 0 && iz2 < nz) {
var icell2 = this.cellIndex (ix2, iy2, iz2, nx, ny, nz);
this.connectTwoCells (icell2);
}}
}icell++;
}
}
}
if (this.debug) {
var percentOccupied = 100.0 * occupiedCells / ncell;
var atomsPerCell = atomCount / occupiedCells;
System.out.println ("total cells in grid    " + ncell);
System.out.println ("occupied cells in grid " + occupiedCells);
System.out.println ("% cells occupied       " + percentOccupied);
System.out.println ("average atoms per cell " + atomsPerCell);
}this.bondingRadii = null;
this.list = null;
this.head = null;
this.cell1 = null;
this.cell2 = null;
System.gc ();
return 1;
});
Clazz.defineMethod (c$, "getCellContents", 
 function (icell, c) {
var nc = 0;
var j = this.head[icell];
if (j == -1) {
return 0;
}while (j >= 0) {
c[nc++] = j;
j = this.list[j];
}
return nc;
}, "~N,~A");
Clazz.defineMethod (c$, "connectTwoCells", 
 function (icell2) {
this.nc2 = this.getCellContents (icell2, this.cell2);
var localAtomArray = this.atomArray;
for (var i = 0; i < this.nc1; i++) {
var i1 = this.cell1[i];
var a1 = localAtomArray[i1];
var r1 = this.bondingRadii[i1];
for (var j = 0; j < this.nc2; j++) {
var i2 = this.cell2[j];
var a2 = localAtomArray[i2];
var r2 = this.bondingRadii[i2];
var d2 = r1 + r2;
d2 *= d2;
if (a1.distanceSq (a2) < d2) {
if (a1.getAltLoc () == ' ' || a2.getAltLoc () == ' ' || (a1.getAltLoc () == a2.getAltLoc ())) this.addBond (a1, a2, 1, false, false);
}}
}
}, "~N");
Clazz.defineMethod (c$, "connectCell", 
 function (icell) {
this.nc1 = this.getCellContents (icell, this.cell1);
for (var i = 0; i < this.nc1; i++) {
var i1 = this.cell1[i];
var a1 = this.atomArray[i1];
var r1 = this.bondingRadii[i1];
for (var j = i + 1; j < this.nc1; j++) {
var i2 = this.cell1[j];
var a2 = this.atomArray[i2];
var r2 = this.bondingRadii[i2];
var d2 = r1 + r2;
d2 *= d2;
if (a1.distanceSq (a2) < d2) {
if (a1.getAltLoc () == ' ' || a2.getAltLoc () == ' ' || (a1.getAltLoc () == a2.getAltLoc ())) {
this.addBond (a1, a2, 1, false, false);
}}}
}
}, "~N");
Clazz.defineMethod (c$, "autoBond", 
function () {
var atomCount = this.getAtomCount ();
var atomArray = this.atoms.getArray ();
var bondingRadii =  Clazz.newDoubleArray (atomCount, 0);
for (var a1 = 0; a1 < atomCount; a1++) {
var atom = this.getAtom (a1);
bondingRadii[a1] = atom.getBondingRadius ();
}
for (var a1 = 0; a1 < atomCount; a1++) {
var firstAtom = atomArray[a1];
var firstRadius = bondingRadii[a1];
var startAtom = 0;
var endAtom = atomCount;
var specialAtom = this.isSpecialAtom (firstAtom);
if (specialAtom) {
startAtom = 0;
endAtom = atomCount;
} else {
startAtom = a1 + 1;
endAtom = a1 + 50;
if (endAtom > atomCount) {
endAtom = atomCount;
}}for (var a2 = startAtom; a2 < endAtom; a2++) {
if (a2 != a1) {
var secondAtom = atomArray[a2];
var secondRadius = bondingRadii[a2];
var dSquare = firstRadius + secondRadius;
dSquare *= dSquare;
if (firstAtom.distanceSq (secondAtom) < dSquare) {
if (specialAtom) {
var bond = firstAtom.getBond (secondAtom);
if (bond == null) {
this.addBond (firstAtom, secondAtom, 1, false, false);
}} else {
this.addBond (firstAtom, secondAtom, 1, false, false);
}}}}
}
});
Clazz.defineMethod (c$, "connectResidue", 
function (residue) {
var atomCount = residue.getAtomCount ();
for (var a1 = 0; a1 < atomCount; a1++) {
var firstAtom = residue.getAtom (a1);
var firstRadius = firstAtom.getBondingRadius ();
for (var a2 = a1 + 1; a2 < atomCount; a2++) {
var secondAtom = residue.getAtom (a2);
var secondRadius = secondAtom.getBondingRadius ();
var dSquare = firstRadius + secondRadius;
dSquare *= dSquare;
if (firstAtom.distanceSq (secondAtom) < dSquare) {
var bond = firstAtom.getBond (secondAtom);
if (bond == null) {
this.addBond (firstAtom, secondAtom, 1, false, false);
}}}
}
}, "astex.model.Residue");
Clazz.defineMethod (c$, "connectResidues", 
function (firstResidue, secondResidue) {
var firstAtomCount = firstResidue.getAtomCount ();
var secondAtomCount = secondResidue.getAtomCount ();
for (var a1 = 0; a1 < firstAtomCount; a1++) {
var firstAtom = firstResidue.getAtom (a1);
var firstRadius = firstAtom.getBondingRadius ();
for (var a2 = 0; a2 < secondAtomCount; a2++) {
var secondAtom = secondResidue.getAtom (a2);
var secondRadius = secondAtom.getBondingRadius ();
var dSquare = firstRadius + secondRadius;
dSquare *= dSquare;
if (firstAtom.distanceSq (secondAtom) < dSquare) {
var bond = firstAtom.getBond (secondAtom);
if (bond == null) {
this.addBond (firstAtom, secondAtom, 1, false, false);
}}}
}
}, "astex.model.Residue,astex.model.Residue");
Clazz.defineMethod (c$, "countAngles", 
function () {
var totalAngles = 0;
for (var i = 0; i < this.getAtomCount (); i++) {
var atom = this.getAtom (i);
var bondCount = atom.getBondCount ();
totalAngles += Clazz.doubleToInt ((bondCount * (bondCount - 1)) / 2);
}
return totalAngles;
});
Clazz.defineMethod (c$, "findRings", 
function () {
var atomCount = this.getAtomCount ();
var oldIds =  Clazz.newIntArray (atomCount, 0);
for (var i = 0; i < atomCount; i++) {
var atom = this.getAtom (i);
oldIds[i] = atom.getId ();
atom.setId (i + 1);
}
try {
for (var ringSize = 3; ringSize <= 6; ringSize++) {
this.findRings (ringSize);
}
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
} else {
throw e;
}
} finally {
for (var i = 0; i < atomCount; i++) {
var atom = this.getAtom (i);
atom.setId (oldIds[i]);
}
oldIds = null;
}
});
Clazz.defineMethod (c$, "findRings", 
function (ringSize) {
if (ringSize == 3) {
this.find3Rings ();
} else {
var atomPath =  new Array (ringSize);
var bondPath =  new Array (ringSize);
for (var a = 0; a < this.getAtomCount (); a++) {
var atom = this.getAtom (a);
if (atom.getBondCount () > 1) {
this.propagateRingSearch (0, ringSize, atom, atomPath, bondPath);
}}
}}, "~N");
Clazz.defineMethod (c$, "find3Rings", 
function () {
for (var a = 0; a < this.getAtomCount (); a++) {
var atom = this.getAtom (a);
var bondCount = atom.getBondCount ();
for (var i = 0; i < bondCount; i++) {
var bondi = atom.getBondI (i);
var atomi = bondi.getOtherAtom (atom);
for (var j = 0; j < bondCount; j++) {
if (i == j) continue;
var bondj = atom.getBondI (j);
var atomj = bondj.getOtherAtom (atom);
var bondij = atomi.getBond (atomj);
if (bondij != null) {
if (atom.getId () < atomi.getId () && atomi.getId () < atomj.getId ()) {
var newRing = this.addRing ();
newRing.addAtom (atom);
newRing.addAtom (atomi);
newRing.addAtom (atomj);
newRing.addBond (bondi);
newRing.addBond (bondij);
newRing.addBond (bondj);
}}}
}
}
});
Clazz.defineMethod (c$, "propagateRingSearch", 
 function (currentDepth, maximumDepth, currentAtom, atomPath, bondPath) {
if (currentDepth == maximumDepth && currentAtom === atomPath[0]) {
this.possiblyCreateRing (atomPath, bondPath, maximumDepth);
} else if (currentDepth < maximumDepth) {
atomPath[currentDepth] = currentAtom;
for (var b = 0; b < currentAtom.getBondCount (); b++) {
var bond = currentAtom.getBondI (b);
var otherAtom = bond.getOtherAtom (currentAtom);
if (currentDepth == 0 || otherAtom !== atomPath[currentDepth - 1]) {
bondPath[currentDepth] = bond;
this.propagateRingSearch (currentDepth + 1, maximumDepth, otherAtom, atomPath, bondPath);
}}
}}, "~N,~N,astex.model.Atom,~A,~A");
Clazz.defineMethod (c$, "possiblyCreateRing", 
function (atomPath, bondPath, ringSize) {
var firstAtomId = atomPath[0].getId ();
for (var i = 1; i < ringSize; i++) {
var atom = atomPath[i];
if (firstAtomId >= atom.getId ()) {
return;
}}
if (atomPath[1].getId () >= atomPath[ringSize - 1].getId ()) {
return;
}var newRing = this.addRing ();
for (var i = 0; i < ringSize; i++) {
newRing.addAtom (atomPath[i]);
newRing.addBond (bondPath[i]);
}
}, "~A,~A,~N");
Clazz.defineMethod (c$, "isBondInAromaticRing", 
function (bond) {
var ringCount = this.getRingCount ();
for (var r = 0; r < ringCount; r++) {
var ring = this.getRing (r);
if (ring.contains (bond) && ring.isAromatic ()) {
return true;
}}
return false;
}, "astex.model.Bond");
Clazz.defineMethod (c$, "getBestRingContainingBond", 
function (bond) {
var ringCount = this.getRingCount ();
for (var i = 1; i >= 0; i--) {
for (var r = 0; r < ringCount; r++) {
var ring = this.getRing (r);
if (ring.contains (bond) && ring.getAtomCount () == (6 - i) && ring.isAromatic ()) {
return ring;
}}
}
for (var r = 0; r < ringCount; r++) {
var ring = this.getRing (r);
if (ring.contains (bond)) {
return ring;
}}
return null;
}, "astex.model.Bond");
Clazz.defineMethod (c$, "isBondIn6Ring", 
function (bond) {
var ringCount = this.getRingCount ();
for (var r = 0; r < ringCount; r++) {
var ring = this.getRing (r);
if (ring.contains (bond) && ring.getAtomCount () == 6) {
return true;
}}
return false;
}, "astex.model.Bond");
Clazz.defineMethod (c$, "isAtomIn3MemberedRing", 
function (atom) {
var ringCount = this.getRingCount ();
for (var r = 0; r < ringCount; r++) {
var ring = this.getRing (r);
if (ring.getBondCount () == 3 && ring.contains (atom)) {
return true;
}}
return false;
}, "astex.model.Atom");
Clazz.defineMethod (c$, "setName", 
function (name) {
this.moleculeName = name;
}, "~S");
Clazz.defineMethod (c$, "getName", 
function () {
return (this.moleculeName == null ? "Unnamed molecule" : this.moleculeName);
});
Clazz.defineMethod (c$, "setFilename", 
function (s) {
this.filename = s;
}, "~S");
Clazz.defineMethod (c$, "getFilename", 
function () {
return this.filename;
});
Clazz.defineMethod (c$, "setType", 
function (s) {
this.type = s;
}, "~S");
Clazz.defineMethod (c$, "getType", 
function () {
return this.type;
});
Clazz.defineMethod (c$, "setExpMethod", 
function (s) {
this.expMethod = s;
}, "~S");
Clazz.defineMethod (c$, "getExpMethod", 
function () {
return this.expMethod;
});
Clazz.defineMethod (c$, "generateImpropers", 
 function () {
this.impropers.removeAllElements ();
this.generateRingImpropers ();
this.generateBondImpropers ();
this.generateSp2Impropers ();
});
Clazz.defineMethod (c$, "generateRingImpropers", 
function () {
var ringCount = this.getRingCount ();
for (var r = 0; r < ringCount; r++) {
var ring = this.getRing (r);
if (ring.isPlanar ()) {
this.generateRing (ring);
}}
});
Clazz.defineMethod (c$, "generateRing", 
function (ring) {
var atomCount = ring.getAtomCount ();
if (atomCount == 4) {
this.addImproper (ring.getAtom (0), ring.getAtom (1), ring.getAtom (2), ring.getAtom (3));
} else {
for (var a = 0; a < atomCount; a++) {
this.addImproper (ring.getAtom (a), ring.getAtom ((a + 1) % atomCount), ring.getAtom ((a + 2) % atomCount), ring.getAtom ((a + 3) % atomCount));
}
}}, "astex.model.Ring");
Clazz.defineMethod (c$, "generateBondImpropers", 
function () {
var bondCount = this.getBondCount ();
for (var i = 0; i < bondCount; i++) {
var bond = this.getBond (i);
if (this.isBondInAromaticRing (bond) == false && bond.isTerminalBond () == false) {
var bondOrder = bond.getBondOrder ();
if (bondOrder == 1) {
if (this.singleBondRequiresImproper (bond)) {
this.generateSingleBondImproper (bond);
}} else if (bondOrder == 2) {
this.generateDoubleBondImproper (bond);
}}}
});
Clazz.defineMethod (c$, "singleBondRequiresImproper", 
function (bond) {
var firstAtom = bond.getFirstAtom ();
var secondAtom = bond.getSecondAtom ();
var firstAtomElement = firstAtom.getElement ();
var secondAtomElement = secondAtom.getElement ();
if ((firstAtomElement == 6 || firstAtomElement == 7) && (secondAtomElement == 6 || secondAtomElement == 7)) {
if ((firstAtom.hasBondWithOrder (2) || firstAtom.hasBondWithOrder (4)) && (secondAtom.hasBondWithOrder (2) || secondAtom.hasBondWithOrder (4))) {
return true;
}}return false;
}, "astex.model.Bond");
Clazz.defineMethod (c$, "generateDoubleBondImproper", 
function (bond) {
var firstAtom = bond.getFirstAtom ();
var secondAtom = bond.getSecondAtom ();
var firstBond = firstAtom.getBondWithOrder (1);
var secondBond = secondAtom.getBondWithOrder (1);
if (firstBond == null || secondBond == null) {
return;
}var firstBondOther = firstBond.getOtherAtom (firstAtom);
var secondBondOther = secondBond.getOtherAtom (secondAtom);
this.addImproper (firstBondOther, firstAtom, secondAtom, secondBondOther);
}, "astex.model.Bond");
Clazz.defineMethod (c$, "generateSingleBondImproper", 
function (bond) {
var firstAtom = bond.getFirstAtom ();
var secondAtom = bond.getSecondAtom ();
var firstAtomDoubleBond = firstAtom.getBondWithOrder (2);
if (firstAtomDoubleBond == null) {
firstAtomDoubleBond = firstAtom.getBondWithOrder (4);
}if (firstAtomDoubleBond == null) {
System.out.println ("couldn't find double/aromatic bond");
}var secondAtomDoubleBond = secondAtom.getBondWithOrder (2);
if (secondAtomDoubleBond == null) {
secondAtomDoubleBond = secondAtom.getBondWithOrder (4);
}if (secondAtomDoubleBond == null) {
System.out.println ("couldn't find double/aromatic bond");
}var firstAtomOther = firstAtomDoubleBond.getOtherAtom (firstAtom);
var secondAtomOther = secondAtomDoubleBond.getOtherAtom (secondAtom);
this.addImproper (firstAtomOther, firstAtom, secondAtom, secondAtomOther);
}, "astex.model.Bond");
Clazz.defineMethod (c$, "generateSp2Impropers", 
function () {
var atomCount = this.getAtomCount ();
for (var a = 0; a < atomCount; a++) {
var atom = this.getAtom (a);
if (this.atomNeedsImproper (atom)) {
this.addImproper (atom.getBondedAtom (0), atom, atom.getBondedAtom (1), atom.getBondedAtom (2));
}}
});
Clazz.defineMethod (c$, "addImproper", 
function (a1, a2, a3, a4) {
var improper = astex.util.Improper.create ();
improper.setFirstAtom (a1);
improper.setSecondAtom (a2);
improper.setThirdAtom (a3);
improper.setFourthAtom (a4);
this.impropers.add (improper);
}, "astex.model.Atom,astex.model.Atom,astex.model.Atom,astex.model.Atom");
Clazz.defineMethod (c$, "atomNeedsImproper", 
function (atom) {
var bondCount = atom.getBondCount ();
if (bondCount == 3) {
var element = atom.getElement ();
if (element == 6) {
if (atom.hasBondWithOrder (2) || atom.hasBondWithOrder (4)) {
return true;
}} else if (element == 7) {
if (this.nitrogenNeedsImproper (atom)) {
return true;
}}}return false;
}, "astex.model.Atom");
Clazz.defineMethod (c$, "nitrogenNeedsImproper", 
function (atom) {
return (!this.isAtomIn3MemberedRing (atom));
}, "astex.model.Atom");
Clazz.defineMethod (c$, "generatePlanes", 
function (planes) {
var improperCount = this.getImproperCount ();
for (var i = 0; i < improperCount; i++) {
var improper = this.getImproper (i);
var plane =  new astex.util.DynamicArray ();
for (var a = 0; a < 4; a++) {
plane.add (improper.getAtom (a));
}
planes.add (plane);
}
}, "astex.util.DynamicArray");
Clazz.defineMethod (c$, "getCenter", 
function () {
if (this.center == null) {
this.center =  new astex.util.Point3d ();
var atomCount = this.getAtomCount ();
for (var a = 0; a < atomCount; a++) {
var atom = this.getAtom (a);
this.center.add (atom);
}
if (atomCount > 0) {
this.center.divide (atomCount);
}}return astex.util.Point3d.newP (this.center);
});
Clazz.defineMethod (c$, "getRadius", 
function () {
var moleculeCenter = this.getCenter ();
this.radius = 0.0;
var atomCount = this.getAtomCount ();
for (var a = 0; a < atomCount; a++) {
var atom = this.getAtom (a);
var dSq = moleculeCenter.distanceSq (atom);
if (dSq > this.radius) {
this.radius = dSq;
}}
this.radius = Math.sqrt (this.radius);
return this.radius;
});
Clazz.defineMethod (c$, "ensureSymmetryAllocated", 
 function () {
if (this.symmetry == null) {
this.symmetry =  new astex.model.Symmetry ();
}});
Clazz.defineMethod (c$, "setUnitCell", 
function (newCell) {
this.ensureSymmetryAllocated ();
this.symmetry.setUnitCell (newCell);
}, "~A");
Clazz.defineMethod (c$, "getSymmetry", 
function () {
return this.symmetry;
});
Clazz.defineMethod (c$, "setSymmetry", 
function (s) {
this.symmetry = s;
}, "astex.model.Symmetry");
Clazz.defineMethod (c$, "setSpaceGroupName", 
function (name) {
if (name == null) {
this.symmetry = null;
} else {
this.ensureSymmetryAllocated ();
this.symmetry.setSpaceGroupName (name);
}}, "~S");
Clazz.defineMethod (c$, "adjustSymmetry", 
function () {
if (this.symmetry == null) return;
var cartesianToFractional = this.symmetry.getCartesianToFractionalMatrix ();
var fractionalToCartesian = this.symmetry.getFractionalToCartesianMatrix ();
var symmetryOperators = this.symmetry.getSymmetryOperators ();
var operatorCount = symmetryOperators.size ();
for (var s = 0; s < operatorCount; s++) {
var currentTransform =  new astex.util.Matrix ();
var operator = symmetryOperators.get (s);
if (operator.isIdentity ()) continue;
currentTransform.setIdentity ();
currentTransform.transform (cartesianToFractional);
currentTransform.transform (operator);
currentTransform.transform (fractionalToCartesian);
symmetryOperators.setItem (s, currentTransform);
}
});
Clazz.defineMethod (c$, "clearVisitFlags", 
function () {
var atomCount = this.getAtomCount ();
for (var a = 0; a < atomCount; a++) {
var atom = this.getAtom (a);
atom.setVisited (false);
}
});
Clazz.defineMethod (c$, "markRingBonds", 
function () {
var bondCount = this.getBondCount ();
for (var b = 0; b < bondCount; b++) {
var bond = this.getBond (b);
this.clearVisitFlags ();
var firstAtom = bond.getFirstAtom ();
var secondAtom = bond.getSecondAtom ();
secondAtom.setVisited (true);
if (this.propagateCycleSearch (firstAtom, secondAtom, 0)) {
bond.setRingBond (true);
} else {
bond.setRingBond (false);
}}
});
Clazz.defineMethod (c$, "propagateCycleSearch", 
function (firstAtom, secondAtom, depth) {
var bondCount = firstAtom.getBondCount ();
firstAtom.setVisited (true);
for (var b = 0; b < bondCount; b++) {
var bond = firstAtom.getBondI (b);
var otherAtom = bond.getOtherAtom (firstAtom);
if (otherAtom.isVisited ()) {
if (otherAtom === secondAtom && depth > 0) {
return true;
}} else {
var found = this.propagateCycleSearch (otherAtom, secondAtom, depth + 1);
if (found) {
return true;
}}}
return false;
}, "astex.model.Atom,astex.model.Atom,~N");
Clazz.overrideMethod (c$, "selectStatement", 
function () {
return "molexact '" + this.getName () + "'";
});
Clazz.overrideMethod (c$, "select", 
function (state) {
var selectCount = 0;
for (var c = 0; c < this.getChainCount (); c++) {
var chain = this.getChain (c);
selectCount += chain.select (state);
}
return selectCount;
}, "~N");
Clazz.overrideMethod (c$, "setValue", 
function (key, property) {
var name = key;
if (name.equals ("displayed")) {
this.setDisplayed ((property).booleanValue () ? 1 : 0);
}this.setValueGeneric (key, property);
return null;
}, "~O,~O");
Clazz.overrideMethod (c$, "get", 
function (key, def) {
return (key.equals ("displayed") ?  new Boolean (this.getDisplayed ()) : this.get2 (key, def));
}, "~O,~O");
Clazz.overrideMethod (c$, "getProperties", 
function () {
var v =  new JU.Lst ();
v.addLast ("displayed");
v.addLast ("hydrogens");
v.addLast ("bondDetails");
return java.util.Collections.enumeration (v);
});
Clazz.defineStatics (c$,
"RingsAssigned", 0x1,
"AnglesAssigned", 0x2,
"ImpropersAssigned", 0x4,
"residueCount", 0,
"Off", 0,
"Normal", 1,
"Trace", 2,
"TraceAlways", 3,
"NormalMolecule", 1,
"FeatureMolecule", 2,
"SkeletonMolecule", 3,
"SymmetryMolecule", 4,
"SingleModel", 1,
"FirstModel", 2,
"SubsequentModel", 3,
"Displayed", "displayed",
"DisplayHydrogens", "hydrogens",
"DisplayBondDetails", "bondDetails");
});
