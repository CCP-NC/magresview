Clazz.declarePackage ("astex.io");
Clazz.load (null, "astex.io.MoleculeReader", ["astex.api.Interface", "astex.io.FILE", "astex.model.Atom", "$.Molecule", "$.Residue", "$.Symmetry", "astex.util.Color32", "$.Matrix", "$.PeriodicTable", "$.Point3d", "JU.SB"], function () {
c$ = Clazz.declareType (astex.io, "MoleculeReader");
c$.getTypeFromExtension = Clazz.defineMethod (c$, "getTypeFromExtension", 
function (filename) {
var type = null;
if (filename == null) {
return null;
}if (filename.indexOf (".mol2") != -1 || filename.indexOf (".istr") != -1) {
type = "mol2";
} else if (filename.indexOf (".mol") != -1 || filename.indexOf (".sd") != -1 || filename.indexOf (".sdf") != -1 || filename.contains ("cactus.nci.nih.gov") || filename.contains ("pubchem.ncbi.nlm.nih.gov")) {
type = "mol";
} else if (filename.indexOf (".pdb") != -1 || filename.indexOf (".ent") != -1) {
type = "pdb";
} else if (filename.indexOf (".simple") != -1) {
type = "simple";
} else if (filename.indexOf (".xyzr") != -1) {
type = "xyzr";
} else if (filename.indexOf (".tmesh") != -1) {
type = "tmesh";
} else if (filename.indexOf (".cif") != -1) {
type = "mmcif";
}return type;
}, "~S");
c$.readFile = Clazz.defineMethod (c$, "readFile", 
function (filename) {
var type = "pdb";
type = astex.io.MoleculeReader.getTypeFromExtension (filename);
if (type != null) {
var file = astex.io.FILE.open (filename);
if (file == null) {
System.err.println ("error opening " + filename);
System.err.println ("exception " + astex.io.FILE.getException ());
return null;
}var molecule = astex.io.MoleculeReader.read (type, file, filename);
if (molecule != null) {
molecule.setName (filename);
molecule.setFilename (filename);
}file.close ();
System.out.println (molecule);
return molecule;
}return null;
}, "~S");
c$.read = Clazz.defineMethod (c$, "read", 
function (type, file, fileName) {
var molecule = null;
if (type.equals ("mol")) {
molecule = astex.io.MoleculeReader.readMDLMol (file);
} else if (type.equals ("mol2")) {
molecule = astex.io.MoleculeReader.readMol2 (file);
} else if (type.equals ("pdb")) {
molecule = astex.io.MoleculeReader.readPDB (file);
} else if (type.equals ("simple")) {
molecule = astex.io.MoleculeReader.readSimple (file);
} else if (type.equals ("xyzr")) {
molecule = astex.io.MoleculeReader.readXyzr (file);
} else if (type.equals ("tmesh")) {
molecule = astex.io.MoleculeReader.readTmesh (file);
} else if (type.equals ("mmcif")) {
System.err.println ("mmCIF reader is called directly from MoleculeRenderer, should not be read here");
} else {
System.err.println ("MoleculeIO: format '" + type + "' unsupported");
}if (molecule != null) {
molecule.setType (type);
} else {
System.err.println ("Failed to read molecule form file: " + fileName);
}return molecule;
}, "~S,astex.io.FILE,~S");
c$.readSybylBondBlock = Clazz.defineMethod (c$, "readSybylBondBlock", 
function (file, bondCount, molecule, atomsInOrder) {
for (var i = 0; i < bondCount; i++) {
file.nextLine ();
var firstAtom = file.readFieldInt (1);
var secondAtom = file.readFieldInt (2);
var bondOrder = 0;
var order = file.getField (3);
if (order != null && order.charAt (0) == 'a') {
switch (order.length == 1 ? '\0' : order.charAt (1)) {
case 'r':
bondOrder = 4;
break;
case 'm':
bondOrder = 5;
break;
}
} else {
bondOrder = astex.io.FILE.readInteger (order);
}if (atomsInOrder) {
var a1 = molecule.getAtom (firstAtom - 1);
var a2 = molecule.getAtom (secondAtom - 1);
molecule.addBond (a1, a2, bondOrder, true, false);
} else {
molecule.addBondFromIds (firstAtom, secondAtom, bondOrder);
}}
}, "astex.io.FILE,~N,astex.model.Molecule,~B");
c$.readSybylAtomBlock = Clazz.defineMethod (c$, "readSybylAtomBlock", 
function (file, atomCount, molecule) {
var atomsInOrder = true;
var previousId = -2147483648;
for (var i = 0; i < atomCount; i++) {
file.nextLine ();
if (file.getFieldCount () >= 7) {
var resId = file.readFieldInt (6);
if (resId != previousId) {
var residue = molecule.addResidue ();
if (file.getFieldCount () >= 8) {
var resName = file.getField (7);
var resNumber = resName.substring (3);
resName = resName.substring (0, 3);
residue.setName (resName);
residue.setNumber (astex.io.FILE.readInteger (resNumber));
}previousId = resId;
}}var newAtom = molecule.addNewAtom ();
newAtom.setId (file.readFieldInt (0));
if (atomsInOrder && newAtom.getId () != i + 1) {
System.err.println ("atoms not in order in mol2 file");
atomsInOrder = false;
}var atomLabel = file.getField (1);
newAtom.setAtomLabel (atomLabel);
var x = file.readFieldDbl (2);
var y = file.readFieldDbl (3);
var z = file.readFieldDbl (4);
newAtom.set (x, y, z);
if (file.getFieldCount () >= 6) {
var type = file.getField (5);
newAtom.setAtomType (type);
var char1 = (type.length > 1 ? type.charAt (1) : '\0');
var sym;
switch (char1) {
case '\0':
case '.':
case ' ':
sym = type.substring (0, 1);
break;
default:
sym = type.substring (0, 2);
break;
}
var element = astex.util.PeriodicTable.getElementFromSymbol (sym);
newAtom.setElement (element);
}if (file.getFieldCount () >= 9) {
newAtom.setBFactor (file.readFieldDbl (8));
}}
return atomsInOrder;
}, "astex.io.FILE,~N,astex.model.Molecule");
c$.readMol2 = Clazz.defineMethod (c$, "readMol2", 
function (file) {
var molecule =  new astex.model.Molecule ();
var atomCount = 0;
var bondCount = 0;
var averageDenstiy = -1.0;
var symmetryElements = 1;
var atomsInOrder = false;
while (file.nextLine ()) {
var c0 = file.getChar (0);
if (c0 == '@') {
var char9 = file.getChar (9);
if (char9 == 'M' && file.currentLineContains ("@<TRIPOS>MOLECULE", 0)) {
if (file.nextLine () == false) {
System.err.println ("error reading molecule header");
}molecule.setName (file.getCurrentLineAsString ());
if (file.nextLine () == false) {
System.err.println ("error reading molecule header");
}var line = file.getCurrentLineAsString ();
var tokens = astex.io.FILE.split (line, null);
atomCount = astex.io.FILE.readInteger (tokens[0]);
bondCount = astex.io.FILE.readInteger (tokens[1]);
} else if (char9 == 'A' && file.currentLineContains ("@<TRIPOS>ATOM", 0)) {
atomsInOrder = astex.io.MoleculeReader.readSybylAtomBlock (file, atomCount, molecule);
} else if (char9 == 'B' && file.currentLineContains ("@<TRIPOS>BOND", 0)) {
astex.io.MoleculeReader.readSybylBondBlock (file, bondCount, molecule, atomsInOrder);
}} else if (c0 == '#') {
var c1 = file.getChar (1);
var c2 = file.getChar (2);
if (c1 == ' ' && c2 == 'N') {
var line = file.getCurrentLineAsString ();
if (line.startsWith ("# Number_Of_Central_Group_Atoms:")) {
var ncentral = file.readFieldInt (2);
molecule.setCentralAtomCount (ncentral);
}} else if (c1 == ' ' && c2 == 'A') {
var line = file.getCurrentLineAsString ();
if (line.startsWith ("# Average_Density:")) {
averageDenstiy = file.readFieldDbl (2);
}} else if (c1 == 'E' && c2 == 'L') {
var symmetry =  new astex.util.Matrix ();
symmetry.x00 = file.readFieldDbl (1);
symmetry.x01 = file.readFieldDbl (2);
symmetry.x02 = file.readFieldDbl (3);
symmetry.x10 = file.readFieldDbl (4);
symmetry.x11 = file.readFieldDbl (5);
symmetry.x12 = file.readFieldDbl (6);
symmetry.x20 = file.readFieldDbl (7);
symmetry.x21 = file.readFieldDbl (8);
symmetry.x22 = file.readFieldDbl (9);
symmetryElements++;
var ncentral = molecule.getCentralAtomCount ();
var p =  new astex.util.Point3d ();
var currentAtomCount = molecule.getAtomCount ();
for (var a = ncentral; a < atomCount; a++) {
var atom = molecule.getAtom (a);
p.setP (atom);
symmetry.transformPt (p);
var newAtom = molecule.addNewAtom ();
newAtom.setP (p);
newAtom.setId (currentAtomCount++);
newAtom.setElement (atom.getElement ());
}
}}}
if (averageDenstiy > 0.0) {
averageDenstiy *= symmetryElements;
atomCount = molecule.getAtomCount ();
for (var a = 0; a < atomCount; a++) {
var atom = molecule.getAtom (a);
atom.setBFactor (averageDenstiy);
}
} else {
averageDenstiy = 1.0;
}if (molecule.getChainCount () > 0) {
var chain = molecule.getChain (0);
chain.setName (" ");
}return molecule;
}, "astex.io.FILE");
c$.summariseMolecule = Clazz.defineMethod (c$, "summariseMolecule", 
function (molecule) {
System.out.println ("name " + molecule.getName ());
var atomCount = molecule.getAtomCount ();
var bondCount = molecule.getBondCount ();
System.out.println ("" + atomCount + " atoms " + bondCount + " bonds ");
}, "astex.model.Molecule");
c$.readTmesh = Clazz.defineMethod (c$, "readTmesh", 
function (file) {
var molecule =  new astex.model.Molecule ();
var acount = 0;
file.nextLine ();
acount = file.readFieldInt (0);
for (var i = 0; i < acount; i++) {
file.nextLine ();
var atom = molecule.addNewAtom ();
atom.setId (i);
var x = file.readFieldDbl (0);
var y = file.readFieldDbl (1);
var z = file.readFieldDbl (2);
atom.set (x, y, z);
atom.setElement (1);
}
file.nextLine ();
var bcount = file.readFieldInt (0);
var vertices =  Clazz.newIntArray (100, 0);
for (var i = 0; i < bcount; i++) {
file.nextLine ();
var vcount = file.readFieldInt (0);
for (var v = 0; v < vcount; v++) {
file.nextLine ();
vertices[v] = file.readFieldInt (0);
}
for (var v = 0; v < vcount; v++) {
var v1 = (v + 1) % vcount;
if (vertices[v] == -1 || vertices[v1] == -1) {
System.err.println ("invalid vertex " + vertices[v] + " " + vertices[v1]);
} else {
molecule.addBondFromIndexOrder (vertices[v], vertices[v1], 1);
}}
}
return molecule;
}, "astex.io.FILE");
c$.readXyzr = Clazz.defineMethod (c$, "readXyzr", 
function (file) {
var molecule =  new astex.model.Molecule ();
var acount = 0;
while (file.nextLine ()) {
var atom = molecule.addNewAtom ();
acount++;
atom.setId (acount);
var x = file.readFieldDbl (0);
var y = file.readFieldDbl (1);
var z = file.readFieldDbl (2);
atom.set (x, y, z);
var r = 1.5;
if (file.getFieldCount () == 4) {
file.readFieldDbl (3);
}atom.setVDWRadius (r);
atom.setElement (0);
atom.setColor (astex.util.Color32.white);
}
return molecule;
}, "astex.io.FILE");
c$.readSimple = Clazz.defineMethod (c$, "readSimple", 
function (file) {
var molecule =  new astex.model.Molecule ();
file.nextLine ();
var atomCount = file.readFieldInt (0);
for (var i = 0; i < atomCount; i++) {
file.nextLine ();
var atom = molecule.addNewAtom ();
atom.setId (i);
var element = astex.util.PeriodicTable.getElementFromSymbol (file.getField (0));
atom.setElement (element);
var x = file.readFieldDbl (1);
var y = file.readFieldDbl (2);
var z = file.readFieldDbl (3);
atom.set (x, y, z);
}
file.nextLine ();
var bondCount = file.readFieldInt (0);
for (var b = 0; b < bondCount; b++) {
file.nextLine ();
var firstAtom = file.readFieldInt (0);
var secondAtom = file.readFieldInt (1);
var bondOrder = file.readFieldInt (2);
molecule.addBondFromIndexOrder (firstAtom - 1, secondAtom - 1, bondOrder);
}
return molecule;
}, "astex.io.FILE");
c$.readMDLMol = Clazz.defineMethod (c$, "readMDLMol", 
function (file) {
if (file.nextLine () == false) {
return null;
}var molecule =  new astex.model.Molecule ();
molecule.setName (file.getCurrentLineAsString ());
file.nextLine ();
file.nextLine ();
file.nextLine ();
var atomCount = file.readIntRange (0, 3);
var bondCount = file.readIntRange (3, 3);
for (var i = 0; i < atomCount; i++) {
file.nextLine ();
var atom = molecule.addNewAtom ();
atom.setId (i + 1);
var x = file.readDoubleRange (0, 10);
var y = file.readDoubleRange (10, 10);
var z = file.readDoubleRange (20, 10);
atom.set (x, y, z);
var atomName = file.getSubstring (31, 2).trim ();
var element = astex.util.PeriodicTable.getElementFromSymbol (atomName);
atom.setElement (element);
var charge = file.readIntRange (37, 2);
if (charge != 0) {
charge = -charge + 4;
atom.setCharge (charge);
}}
for (var b = 0; b < bondCount; b++) {
file.nextLine ();
var firstAtom = file.readIntRange (0, 3);
var secondAtom = file.readIntRange (3, 3);
var bondOrder = file.readIntRange (6, 3);
molecule.addBondFromIndexOrder (firstAtom - 1, secondAtom - 1, bondOrder);
}
while (file.nextLine ()) {
if (file.getChar (0) == '$' && file.getChar (1) == '$' && file.getChar (2) == '$' && file.getChar (3) == '$') {
break;
}}
return molecule;
}, "astex.io.FILE");
c$.initialiseReader = Clazz.defineMethod (c$, "initialiseReader", 
 function () {
astex.io.MoleculeReader.lastResidueNumber = astex.model.Residue.undefinedResidueNumber;
astex.io.MoleculeReader.lastInsertionCode = String.fromCharCode (0);
astex.io.MoleculeReader.lastChainId = String.fromCharCode (0);
astex.io.MoleculeReader.lastResidueA = String.fromCharCode (0);
astex.io.MoleculeReader.lastResidueB = String.fromCharCode (0);
astex.io.MoleculeReader.lastResidueC = String.fromCharCode (0);
});
c$.needNewChain = Clazz.defineMethod (c$, "needNewChain", 
 function (currentChainId) {
if (currentChainId != astex.io.MoleculeReader.lastChainId) {
astex.io.MoleculeReader.initialiseReader ();
astex.io.MoleculeReader.lastChainId = currentChainId;
return true;
}return false;
}, "~S");
c$.needNewResidue = Clazz.defineMethod (c$, "needNewResidue", 
function (currentResidueNumber, currentInsertionCode, currentResidueA, currentResidueB, currentResidueC) {
if (astex.io.MoleculeReader.lastResidueA != currentResidueA || astex.io.MoleculeReader.lastResidueB != currentResidueB || astex.io.MoleculeReader.lastResidueC != currentResidueC || astex.io.MoleculeReader.lastResidueNumber != currentResidueNumber || astex.io.MoleculeReader.lastInsertionCode != currentInsertionCode) {
astex.io.MoleculeReader.lastResidueNumber = currentResidueNumber;
astex.io.MoleculeReader.lastInsertionCode = currentInsertionCode;
astex.io.MoleculeReader.lastResidueA = currentResidueA;
astex.io.MoleculeReader.lastResidueB = currentResidueB;
astex.io.MoleculeReader.lastResidueC = currentResidueC;
return true;
}return false;
}, "~N,~S,~S,~S,~S");
c$.readPDB = Clazz.defineMethod (c$, "readPDB", 
function (file) {
var molecule =  new astex.model.Molecule ();
var seenENDMDL = false;
astex.io.MoleculeReader.initialiseReader ();
while (file.nextLine ()) {
var line = file.getCurrentLineAsString ();
if (line.startsWith ("ENDM")) {
seenENDMDL = true;
break;
}if (line.startsWith ("EXPDTA")) {
molecule.setExpMethod (line.substring (7));
}if (seenENDMDL == false && line.startsWith ("ATOM") || line.startsWith ("HETA")) {
var residueId = file.readIntRange (22, 4);
var insertionCode = file.getChar (26);
var chainId = file.getChar (21);
var ca = file.getChar (17);
var cb = file.getChar (18);
var cc = file.getChar (19);
if (astex.io.MoleculeReader.needNewChain (chainId)) {
var chain = molecule.addChain ();
chain.setName (file.getSubstring (21, 1));
}if (astex.io.MoleculeReader.needNewResidue (residueId, insertionCode, ca, cb, cc)) {
var residue = molecule.addResidue ();
var residueName = astex.io.MoleculeReader.getResidueName (ca, cb, cc);
residue.setNumber (residueId);
residue.setInsertionCode (insertionCode);
residue.setName (residueName);
}astex.io.MoleculeReader.readPDBAtom (file, molecule);
} else if (line.startsWith ("CONE")) {
var firstId = file.readIntRange (6, 5);
var firstAtom = null;
for (var i = 0; i < 6; i++) {
var start = 11 + i * 5;
var secondId = file.readIntRange (start, 5);
if (secondId == 0) {
break;
}if (secondId > firstId) {
if (firstAtom == null) {
firstAtom = molecule.getAtomWithId (firstId);
if (firstAtom == null) {
break;
}}var secondAtom = molecule.getAtomWithId (secondId);
if (secondAtom != null) {
var bond = firstAtom.getBond (secondAtom);
if (bond != null) {
bond.setBondOrder (bond.getBondOrder () + 1);
} else {
bond = molecule.addBond (firstAtom, secondAtom, 1, true, true);
}}}}
} else if (line.startsWith ("CRYS")) {
astex.io.MoleculeReader.readUnitCell (molecule, file);
} else if (line.startsWith ("REMARK 350")) {
astex.io.MoleculeReader.readTransforms (molecule, file, "REMARK 350", "BIOMT1");
} else if (line.startsWith ("REM")) {
} else if (line.startsWith ("SCAL")) {
astex.io.MoleculeReader.readScaleRecord (molecule, file);
}}
var symmetry = molecule.getSymmetry ();
if (symmetry != null) {
symmetry.prepareSymmetry ();
molecule.adjustSymmetry ();
}var success = molecule.connect2 ();
if (success == 0) {
return null;
}return molecule;
}, "astex.io.FILE");
c$.readScaleRecord = Clazz.defineMethod (c$, "readScaleRecord", 
function (molecule, file) {
var symmetry = molecule.getSymmetry ();
if (symmetry == null) {
System.err.println ("readScaleRecord: molecule has scale but no CRYST1 record");
return;
}if (symmetry.scale == null) {
symmetry.scale =  new astex.util.Matrix ();
}var r = symmetry.scale;
var c5 = file.getChar (5);
if (c5 == '1') {
r.x00 = file.readDoubleRange (11, 9);
r.x10 = file.readDoubleRange (21, 9);
r.x20 = file.readDoubleRange (31, 9);
r.x30 = file.readDoubleRange (44, 11);
} else if (c5 == '2') {
r.x01 = file.readDoubleRange (11, 9);
r.x11 = file.readDoubleRange (21, 9);
r.x21 = file.readDoubleRange (31, 9);
r.x31 = file.readDoubleRange (44, 11);
} else if (c5 == '3') {
r.x02 = file.readDoubleRange (11, 9);
r.x12 = file.readDoubleRange (21, 9);
r.x22 = file.readDoubleRange (31, 9);
r.x32 = file.readDoubleRange (44, 11);
} else {
System.err.println ("readScaleRecord: illegal scale record");
System.err.println (file.getCurrentLineAsString ());
return;
}}, "astex.model.Molecule,astex.io.FILE");
c$.readUnitCell = Clazz.defineMethod (c$, "readUnitCell", 
function (molecule, file) {
var symmetry =  new astex.model.Symmetry ();
molecule.setSymmetry (symmetry);
var cell =  Clazz.newDoubleArray (6, 0);
cell[0] = file.readDoubleRange (6, 9);
cell[1] = file.readDoubleRange (15, 9);
cell[2] = file.readDoubleRange (24, 9);
cell[3] = file.readDoubleRange (33, 7);
cell[4] = file.readDoubleRange (40, 7);
cell[5] = file.readDoubleRange (47, 7);
molecule.setUnitCell (cell);
var spaceGroupName =  new JU.SB ();
var originalSpaceGroupName = file.getSubstring (55, 10);
if (originalSpaceGroupName != null) {
originalSpaceGroupName = originalSpaceGroupName.trim ();
}symmetry.setOriginalSpaceGroupName (originalSpaceGroupName);
var len = file.getLineLength ();
if (len > 65) {
len = 65;
}for (var i = 55; i < len; i++) {
var c = file.getChar (i);
if (i == 55) {
if (c == 'R' && Math.abs (cell[3] - cell[5]) > 0.001) {
System.err.println ("Spacegroup changed from R to H classification as alpha != gamma");
c = 'H';
}}if (c != ' ') {
spaceGroupName.appendC (c);
}}
if (spaceGroupName.length () != 0) {
molecule.setSpaceGroupName (spaceGroupName.toString ());
} else {
System.err.println ("molecule had CRYST1 record but no spacegroup");
System.err.println (file.getCurrentLineAsString ());
molecule.setSpaceGroupName (null);
}}, "astex.model.Molecule,astex.io.FILE");
c$.readTransforms = Clazz.defineMethod (c$, "readTransforms", 
function (molecule, file, remark, record) {
var line = file.getCurrentLineAsString ();
var cnt = 0;
while (line.startsWith (remark)) {
if (line.startsWith (record, 13)) {
var m =  new astex.util.Matrix ();
m.x00 = file.readDoubleRange (24, 9);
m.x10 = file.readDoubleRange (34, 9);
m.x20 = file.readDoubleRange (44, 9);
m.x30 = file.readDoubleRange (54, 13);
file.nextLine ();
m.x01 = file.readDoubleRange (24, 9);
m.x11 = file.readDoubleRange (34, 9);
m.x21 = file.readDoubleRange (44, 9);
m.x31 = file.readDoubleRange (54, 13);
file.nextLine ();
m.x02 = file.readDoubleRange (24, 9);
m.x12 = file.readDoubleRange (34, 9);
m.x22 = file.readDoubleRange (44, 9);
m.x32 = file.readDoubleRange (54, 13);
molecule.addBioTransform (m);
cnt++;
}line = file.readLine ();
}
if (cnt > 1) System.out.println ("Read " + cnt + " transforms from " + remark);
}, "astex.model.Molecule,astex.io.FILE,~S,~S");
c$.readPDBAtom = Clazz.defineMethod (c$, "readPDBAtom", 
function (file, molecule) {
var atom = molecule.addNewAtom ();
var c12 = file.getChar (12);
var c13 = file.getChar (13);
var c14 = file.getChar (14);
var c15 = file.getChar (15);
var atomLabel = astex.io.MoleculeReader.getAtomName (c12, c13, c14, c15);
atom.setAtomLabel (atomLabel);
if (c12 != ' ') {
atom.attributes |= astex.model.Atom.NameLeftJustified;
}if (astex.io.MoleculeReader.isSolventAtom ()) {
atom.setSolvent (true);
}var c0 = file.getChar (0);
if (c0 == 'H') {
atom.setHeteroAtom (true);
}var id = file.readIntRange (6, 5);
atom.setId (id);
var c16 = file.getChar (16);
atom.setInsertionCode (c16);
var x = file.readDoubleRange (30, 8);
var y = file.readDoubleRange (38, 8);
var z = file.readDoubleRange (46, 8);
atom.set (x, y, z);
var o = file.readDoubleRange (56, 4);
atom.setOccupancy (o);
var b = file.readDoubleRange (60, 6);
atom.setBFactor (b);
var element = 0;
if (file.getLineLength () >= 78) {
var e0 = file.getChar (76);
var e1 = file.getChar (77);
element = astex.util.PeriodicTable.getElementFromSymbol (e0, e1);
}if (element == 0) {
element = astex.io.MoleculeReader.getElementFromPDBAtomLabel (c12, c13);
}atom.setElement (element);
return atom;
}, "astex.io.FILE,astex.model.Molecule");
c$.isSolventAtom = Clazz.defineMethod (c$, "isSolventAtom", 
function () {
if ((astex.io.MoleculeReader.lastResidueA == 'H' && astex.io.MoleculeReader.lastResidueB == 'O' && astex.io.MoleculeReader.lastResidueC == 'H') || (astex.io.MoleculeReader.lastResidueA == 'W' && astex.io.MoleculeReader.lastResidueB == 'A' && astex.io.MoleculeReader.lastResidueC == 'T') || (astex.io.MoleculeReader.lastResidueA == 'D' && astex.io.MoleculeReader.lastResidueB == 'O' && astex.io.MoleculeReader.lastResidueC == 'D')) {
return true;
}return false;
});
c$.getElementFromPDBAtomLabel = Clazz.defineMethod (c$, "getElementFromPDBAtomLabel", 
function (c0, c1) {
if (c0 == ' ') {
switch (c1) {
case 'C':
return 6;
case 'O':
return 8;
case 'N':
return 7;
case 'S':
return 16;
case 'P':
return 15;
case 'F':
return 9;
case 'H':
return 1;
case 'W':
return 74;
case 'Q':
return 0;
default:
return 6;
}
}switch (c0) {
case 'C':
return (c1 == 'l' || c1 == 'L' ? 17 : 6);
case 'H':
return 1;
case 'F':
return 26;
case 'W':
return 74;
case 'B':
return (c1 == 'R' || c1 == 'r' ? 35 : 5);
case '1':
case '2':
case '3':
case '4':
case '5':
case '6':
case '7':
case '8':
case '9':
case '0':
return 1;
}
return 6;
}, "~S,~S");
c$.getResidueName = Clazz.defineMethod (c$, "getResidueName", 
function (a, b, c) {
var sum = a.charCodeAt (0) + 256 * b.charCodeAt (0) + 256 * 256 * c.charCodeAt (0);
switch (sum) {
case 4268064:
return "A";
case 4399136:
return "C";
case 4661280:
return "G";
case 5505024:
return "T";
case 5578784:
return "U";
case 4279361:
return "ALA";
case 4674113:
return "ARG";
case 5133121:
return "ASN";
case 5264193:
return "ASP";
case 5462339:
return "CYS";
case 5590087:
return "GLU";
case 5131335:
return "GLN";
case 5852231:
return "GLY";
case 5458248:
return "HIS";
case 4541513:
return "ILE";
case 5588300:
return "LEU";
case 5462348:
return "LYS";
case 5522765:
return "MET";
case 4540496:
return "PHE";
case 5198416:
return "PRO";
case 5391699:
return "SER";
case 5263956:
return "TRP";
case 5392468:
return "THR";
case 5396820:
return "TYR";
case 4997462:
return "VAL";
case 5521751:
return "WAT";
default:
var tmp =  Clazz.newCharArray (3, '\0');
tmp[0] = a;
tmp[1] = b;
tmp[2] = c;
var s =  String.instantialize (tmp, 0, 3);
return s.trim ();
}
}, "~S,~S,~S");
c$.getAtomName = Clazz.defineMethod (c$, "getAtomName", 
function (a, b, c, d) {
var sum = a.charCodeAt (0) + 256 * b.charCodeAt (0) + 65536 * c.charCodeAt (0) + 16777216 * d.charCodeAt (0);
switch (sum) {
case 538985248:
return "C";
case 707871520:
return "C1*";
case 540164896:
return "C2";
case 707937056:
return "C2*";
case 708002592:
return "C3*";
case 540295968:
return "C4";
case 708068128:
return "C4*";
case 540361504:
return "C5";
case 708133664:
return "C5*";
case 540427040:
return "C6";
case 540558112:
return "C8";
case 541147936:
return "CA";
case 541213472:
return "CB";
case 541344544:
return "CD";
case 826557216:
return "CD1";
case 843334432:
return "CD2";
case 541410080:
return "CE";
case 826622752:
return "CE1";
case 843399968:
return "CE2";
case 860177184:
return "CE3";
case 541541152:
return "CG";
case 826753824:
return "CG1";
case 843531040:
return "CG2";
case 843596576:
return "CH2";
case 542786336:
return "CZ";
case 844776224:
return "CZ2";
case 861553440:
return "CZ3";
case 538988064:
return "N";
case 540102176:
return "N1";
case 540167712:
return "N2";
case 540233248:
return "N3";
case 540298784:
return "N4";
case 540429856:
return "N6";
case 540495392:
return "N7";
case 540626464:
return "N9";
case 826560032:
return "ND1";
case 843337248:
return "ND2";
case 541412896:
return "NE";
case 826625568:
return "NE1";
case 843402784:
return "NE2";
case 826822176:
return "NH1";
case 843599392:
return "NH2";
case 542789152:
return "NZ";
case 538988320:
return "O";
case 1345408800:
return "O1P";
case 540167968:
return "O2";
case 707940128:
return "O2*";
case 1345474336:
return "O2P";
case 708005664:
return "O3*";
case 540299040:
return "O4";
case 708071200:
return "O4*";
case 708136736:
return "O5*";
case 540430112:
return "O6";
case 826560288:
return "OD1";
case 843337504:
return "OD2";
case 826625824:
return "OE1";
case 843403040:
return "OE2";
case 541544224:
return "OG";
case 826756896:
return "OG1";
case 541609760:
return "OH";
case 1415073568:
return "OXT";
case 538988576:
return "P";
case 541348640:
return "SD";
case 541545248:
return "SG";
default:
var tmp =  Clazz.newCharArray (4, '\0');
tmp[0] = a;
tmp[1] = b;
tmp[2] = c;
tmp[3] = d;
var string =  String.instantialize (tmp, 0, 4);
return string.trim ();
}
}, "~S,~S,~S,~S");
c$.readMMCif = Clazz.defineMethod (c$, "readMMCif", 
function (filename, useStar) {
var type = (useStar ? "astex.io.StarMMCifReader" : "astex.io.JSmolMMCifReader");
var asm = astex.api.Interface.getInterface (type);
var t = System.currentTimeMillis ();
var mols = asm.readMolecules (filename);
System.out.println ((System.currentTimeMillis () - t) + " ms to read " + filename + " using " + type);
System.out.println (mols);
return mols;
}, "~S,~B");
Clazz.defineStatics (c$,
"SybylMol2", "mol2",
"MDLMol", "mol",
"SimpleMol", "simple",
"XyzrMol", "xyzr",
"TmeshMol", "tmesh",
"PDBFile", "pdb",
"MMCIFFile", "mmcif",
"lastResidueNumber", 0,
"lastInsertionCode", '\0',
"lastChainId", '\0',
"lastResidueA", '\0',
"lastResidueB", '\0',
"lastResidueC", '\0');
});
