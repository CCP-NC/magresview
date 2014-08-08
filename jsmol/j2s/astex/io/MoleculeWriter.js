Clazz.declarePackage ("astex.io");
Clazz.load (["astex.api.AstexMoleculeWriter"], "astex.io.MoleculeWriter", ["astex.Version", "astex.io.MoleculeReader", "astex.model.Atom", "astex.util.PeriodicTable", "java.util.Hashtable"], function () {
c$ = Clazz.declareType (astex.io, "MoleculeWriter", null, astex.api.AstexMoleculeWriter);
Clazz.makeConstructor (c$, 
function () {
});
Clazz.defineMethod (c$, "write", 
function (molecule, output) {
this.write (molecule, output, null);
}, "astex.model.Molecule,astex.io.FILE");
Clazz.defineMethod (c$, "write", 
function (molecule, output, type) {
if (type == null) {
type = molecule.getType ();
} else if (type.indexOf (".") >= 0) {
type = astex.io.MoleculeReader.getTypeFromExtension (type);
}if ("mol".equals (type)) {
this.writeMDLMol (molecule, output);
} else if ("pdb".equals (type)) {
this.writePDB (molecule, output);
} else if ("mol2".equals (type)) {
this.writeMol2 (molecule, output);
} else {
System.err.println ("MoleculeIO.write: unsupported type: " + type);
}}, "astex.model.Molecule,astex.io.FILE,~S");
Clazz.overrideMethod (c$, "writePDB", 
function (molecule, output) {
var symmetry = molecule.getSymmetry ();
output.println ("REMARK Written by AstexViewer " + astex.Version.getVersion ());
if (symmetry != null) {
output.printS ("CRYST1");
for (var i = 0; i < 3; i++) output.printFD ("%9.3f", symmetry.unitCell[i]);

for (var i = 3; i < 6; i++) output.printFD ("%7.2f", symmetry.unitCell[i]);

output.println (" " + symmetry.getOriginalSpaceGroupName ());
var scale = symmetry.scale;
if (scale != null) {
output.printS ("SCALE1    ");
output.printFD ("%10.6f", scale.x00);
output.printFD ("%10.6f", scale.x10);
output.printFD ("%10.6f", scale.x20);
output.printFD ("     %10.5f\n", scale.x30);
output.printS ("SCALE2    ");
output.printFD ("%10.6f", scale.x01);
output.printFD ("%10.6f", scale.x11);
output.printFD ("%10.6f", scale.x21);
output.printFD ("     %10.5f\n", scale.x31);
output.printS ("SCALE3    ");
output.printFD ("%10.6f", scale.x02);
output.printFD ("%10.6f", scale.x12);
output.printFD ("%10.6f", scale.x22);
output.printFD ("     %10.5f\n", scale.x32);
}}var atomCount = molecule.getAtomCount ();
for (var i = 0; i < atomCount; i++) {
var atom = molecule.getAtom (i);
if (atom.isHeteroAtom ()) {
output.printS ("HETATM");
} else {
output.printS ("ATOM  ");
}output.printFI ("%5d", atom.getId ());
var atomName = atom.getAtomLabel ();
var len = atomName.length;
if (len > 4) atomName = atomName.substring (0, len = 4);
var leftJust = ((atom.attributes & astex.model.Atom.NameLeftJustified) != 0);
var padLeft = (len == 4 || !leftJust ? " " : "  ");
var padRight = "   ".substring (0, 4 - len - (leftJust ? 0 : 1));
output.printS (padLeft + atomName + padRight);
var altLoc = atom.getInsertionCode ();
output.printFC ("%c", altLoc);
var res = atom.getResidue ();
output.printFS ("%-3s", res.getName ());
var chain = res.getParent ();
var chainName = chain.getName ();
if (chainName.length > 1) {
System.err.println ("MoleculeIO.writePDB: chain name > 1 character |" + chainName + "|");
chainName = chainName.substring (0, 1);
}output.printFS (" %s", chainName);
output.printFI ("%4d", res.getNumber ());
var c = res.getInsertionCode ();
output.printFC ("%c", c);
output.printS ("   ");
output.printFD ("%8.3f", atom.getX ());
output.printFD ("%8.3f", atom.getY ());
output.printFD ("%8.3f", atom.getZ ());
output.printFD ("%6.2f", atom.getOccupancy ());
output.printFD ("%6.2f", atom.getBFactor ());
output.printS ("          ");
var symbol = astex.util.PeriodicTable.getAtomSymbolFromElement (atom.getElement ());
if (symbol.length == 1) {
output.printFS (" %s", symbol);
} else {
output.printFS ("%s", symbol.toUpperCase ());
}output.printS ("\n");
}
for (var i = 0; i < atomCount; i++) {
var atom = molecule.getAtom (i);
var bondCount = atom.getBondCount ();
var needsConects = false;
for (var b = 0; b < bondCount; b++) {
var bond = atom.getBondI (b);
if (bond.getBondOrder () > 1) {
needsConects = true;
break;
}}
for (var b = 0; b < bondCount; b++) {
var bond = atom.getBondI (b);
if (needsConects || bond.isExplicitBond ()) {
var otherAtom = bond.getOtherAtom (atom);
output.printS ("CONECT");
output.printFI ("%5d", atom.getId ());
var bondOrder = bond.getBondOrder ();
var otherId = otherAtom.getId ();
for (var bo = 0; bo < bondOrder; bo++) {
output.printFI ("%5d", otherId);
}
output.printS ("\n");
}}
}
}, "astex.model.Molecule,astex.io.FILE");
Clazz.overrideMethod (c$, "writeMol2", 
function (molecule, output) {
output.println ("# Sybyl Mol2 file written by AstexViewer " + astex.Version.getVersion ());
output.println ("@<TRIPOS>MOLECULE");
output.println (molecule.getName ());
var residueCount = molecule.getResidueCount ();
output.printFI ("%d", molecule.getAtomCount ());
output.printFI (" %d", molecule.getBondCount ());
output.printFI (" %d\n", residueCount);
output.println ((residueCount == 1) ? "SMALL" : "PROTEIN");
output.println ("USER_CHARGES");
output.println ("");
output.println ("");
var atomCount = molecule.getAtomCount ();
var prevRes = null;
var resNumber = 0;
var atomNumberHash =  new java.util.Hashtable ();
output.println ("@<TRIPOS>ATOM");
for (var a = 0; a < atomCount; a++) {
var atom = molecule.getAtom (a);
output.printFI ("%5d", a + 1);
output.printFS (" %-4s", atom.getAtomLabel ());
output.printFD (" %8.3f", atom.getX ());
output.printFD (" %8.3f", atom.getY ());
output.printFD (" %8.3f", atom.getZ ());
output.printFS (" %-6s", atom.getAtomType ());
var res = atom.getResidue ();
if (res !== prevRes) {
resNumber++;
prevRes = res;
}output.printFI (" %5d", resNumber);
if (residueCount == 1) {
output.printFS (" %3s", res.getName ());
} else {
output.printFS (" %3s", res.getName ());
output.printFI ("%-5d", res.getNumber ());
}output.printFD (" %8.3f\n", atom.getBFactor ());
atomNumberHash.put (atom,  new Integer (a + 1));
}
var bondCount = molecule.getBondCount ();
output.println ("@<TRIPOS>BOND");
for (var b = 0; b < bondCount; b++) {
var bond = molecule.getBond (b);
output.printFI ("%5d", b + 1);
var i = (atomNumberHash.get (bond.getFirstAtom ())).intValue ();
var j = (atomNumberHash.get (bond.getSecondAtom ())).intValue ();
output.printFI (" %5d", i);
output.printFI (" %5d", j);
var bondOrder = bond.getBondOrder ();
if (bondOrder > 0 && bondOrder <= 3) {
output.printFI (" %3d", bondOrder);
} else if (bondOrder == 4) {
output.printS ("  ar");
} else if (bondOrder == 5) {
output.printS ("  am");
} else {
output.printS ("  un");
}output.printS ("\n");
}
atomNumberHash = null;
}, "astex.model.Molecule,astex.io.FILE");
Clazz.defineMethod (c$, "writeMDLMol", 
function (molecule, output) {
this.writeMDLMol (molecule, output, true);
}, "astex.model.Molecule,astex.io.FILE");
Clazz.defineMethod (c$, "writeMDLMol", 
function (molecule, output, dollars) {
output.println (molecule.getName ());
output.println ("AstexViewer");
output.println ("");
var atomCount = molecule.getAtomCount ();
var bondCount = molecule.getBondCount ();
output.printFI ("%3d", atomCount);
output.printFI ("%3d", bondCount);
output.println ("  0  0  0  0  0  0  0  0999 V2000");
for (var a = 0; a < atomCount; a++) {
var atom = molecule.getAtom (a);
atom.setId (a + 1);
}
for (var a = 0; a < atomCount; a++) {
var atom = molecule.getAtom (a);
output.printFD ("%10.4f", atom.getX ());
output.printFD ("%10.4f", atom.getY ());
output.printFD ("%10.4f", atom.getZ ());
output.printS (" ");
var symbol = atom.getAtomSymbol ();
output.printS (symbol);
if (symbol.length == 1) {
output.printS ("  ");
} else if (symbol.length == 2) {
output.printS (" ");
} else if (symbol.length == 3) {
}output.printS (" ");
output.printS ("0");
output.printS (" ");
var charge = atom.getCharge ();
if (charge != 0) {
charge = 4 - charge;
}output.printFI ("%2d", charge);
output.println ("  0  0  0  0  0  0  0  0  0  0");
}
for (var b = 0; b < bondCount; b++) {
var bond = molecule.getBond (b);
var firstAtom = bond.getFirstAtom ();
var secondAtom = bond.getSecondAtom ();
var order = bond.getBondOrder ();
output.printFI ("%3d", firstAtom.getId ());
output.printFI ("%3d", secondAtom.getId ());
output.printFI ("%3d", order);
output.println ("  0  0  0  0");
}
output.println ("M  END");
if (dollars) {
output.println ("$$$$");
}}, "astex.model.Molecule,astex.io.FILE,~B");
Clazz.overrideMethod (c$, "writeMDLMolSeparator", 
function (output) {
output.println ("$$$$");
}, "astex.io.FILE");
});
