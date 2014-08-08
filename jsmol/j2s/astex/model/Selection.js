Clazz.declarePackage ("astex.model");
Clazz.load (["astex.util.DynamicArray", "$.Settings"], "astex.model.Selection", ["astex.io.FILE", "astex.util.Mmatch", "$.Point3d", "java.util.Vector"], function () {
c$ = Clazz.declareType (astex.model, "Selection");
Clazz.makeConstructor (c$, 
function () {
if (!astex.model.Selection.initialized) {
var names = ["aminoacid", "dna", "solvent", "ions", "modifiedAA", "modifiedNA"];
for (var i = 0; i < names.length; i++) {
var value = astex.util.Settings.get ("residue", names[i]);
if (value == null) {
System.out.println ("no residue definition for " + names[i]);
continue;
}var residues = astex.io.FILE.split (value, ",");
if (residues == null) continue;
for (var r = 0; r < residues.length; r++) {
if ("aminoacid".equals (names[i])) {
astex.model.Selection.aminoacidNames.add (residues[r]);
} else if ("dna".equals (names[i])) {
astex.model.Selection.dnaNames.add (residues[r]);
} else if ("solvent".equals (names[i])) {
astex.model.Selection.solventNames.add (residues[r]);
} else if ("ions".equals (names[i])) {
astex.model.Selection.ionNames.add (residues[r]);
} else if ("modifiedAA".equals (names[i])) {
astex.model.Selection.modifiedAANames.add (residues[r]);
} else if ("modifiedNA".equals (names[i])) {
astex.model.Selection.modifiedNANames.add (residues[r]);
}}
}
}astex.model.Selection.initialized = true;
});
c$.generateSelectionMask = Clazz.defineMethod (c$, "generateSelectionMask", 
 function (mr) {
return  Clazz.newByteArray (mr.getAtomCount (), 0);
}, "astex.render.MoleculeRenderer");
c$.arrayToMask = Clazz.defineMethod (c$, "arrayToMask", 
function (r, selectedAtoms) {
var count = 0;
var iterator = r.getAtomIterator ();
var mask = astex.model.Selection.generateSelectionMask (r);
var selectedAtomCount = selectedAtoms.size ();
while (iterator.hasMoreElements ()) {
var atom = iterator.getNextAtom ();
atom.setTemporarilySelected (false);
}
for (var i = 0; i < selectedAtomCount; i++) {
var a = selectedAtoms.get (i);
a.setTemporarilySelected (true);
}
iterator = r.getAtomIterator ();
while (iterator.hasMoreElements ()) {
var atom = iterator.getNextAtom ();
if (atom.isTemporarilySelected ()) {
mask[count] = 1;
} else {
mask[count] = 0;
}count++;
}
for (var i = 0; i < selectedAtomCount; i++) {
var a = selectedAtoms.get (i);
a.setTemporarilySelected (false);
}
return mask;
}, "astex.render.MoleculeRenderer,astex.util.DynamicArray");
c$.all = Clazz.defineMethod (c$, "all", 
function (r) {
var mask = astex.model.Selection.generateSelectionMask (r);
var atomCount = mask.length;
for (var i = 0; i < atomCount; i++) {
mask[i] = 1;
}
return mask;
}, "astex.render.MoleculeRenderer");
c$.none = Clazz.defineMethod (c$, "none", 
function (r) {
var mask = astex.model.Selection.generateSelectionMask (r);
var atomCount = mask.length;
for (var i = 0; i < atomCount; i++) {
mask[i] = 0;
}
return mask;
}, "astex.render.MoleculeRenderer");
c$.attribute = Clazz.defineMethod (c$, "attribute", 
function (r, attribute, operator, value) {
var mask = astex.model.Selection.generateSelectionMask (r);
var iterator = r.getAtomIterator ();
var count = 0;
while (iterator.hasMoreElements ()) {
var atom = iterator.getNextAtom ();
var d = atom.getAttribute (attribute);
switch (operator) {
case 0:
mask[count] = ((d > value) ? 1 : 0);
break;
case 1:
mask[count] = ((d >= value) ? 1 : 0);
break;
case 2:
mask[count] = ((d < value) ? 1 : 0);
break;
case 3:
mask[count] = ((d <= value) ? 1 : 0);
break;
case 4:
mask[count] = ((d == value) ? 1 : 0);
break;
case 5:
mask[count] = ((d != value) ? 1 : 0);
break;
default:
System.out.println ("attribute: unknown operator " + operator);
break;
}
count++;
}
return mask;
}, "astex.render.MoleculeRenderer,~N,~N,~N");
c$.residue2 = Clazz.defineMethod (c$, "residue2", 
function (r, ids) {
var minId = 1000000;
var maxId = -1000000;
var idCount = ids.size ();
for (var i = 0; i < idCount; i++) {
var range = ids.get (i);
if (range[0] < minId) {
minId = range[0];
}if (range[1] > maxId) {
maxId = range[1];
}}
var mask = astex.model.Selection.generateSelectionMask (r);
var iterator = r.getAtomIterator ();
var count = 0;
while (iterator.hasMoreElements ()) {
var atom = iterator.getNextAtom ();
var res = atom.getResidue ();
var number = res.getNumber ();
if (number >= minId && number <= maxId) {
for (var i = 0; i < idCount; i++) {
var range = ids.get (i);
if (number >= range[0] && number <= range[1]) {
mask[count] = 1;
break;
}}
}count++;
}
return mask;
}, "astex.render.MoleculeRenderer,java.util.Vector");
c$.residue = Clazz.defineMethod (c$, "residue", 
function (r, ids) {
var minId = 1000000;
var maxId = -1000000;
var idCount = ids.size ();
for (var i = 0; i < idCount; i++) {
var range = ids.get (i);
if (range[0] < minId) {
minId = range[0];
}if (range[1] > maxId) {
maxId = range[1];
}}
var mask = astex.model.Selection.generateSelectionMask (r);
var count = 0;
for (var m = 0; m < r.getMoleculeCount (); m++) {
var mol = r.getMolecule (m);
var chainCount = mol.getChainCount ();
for (var c = 0; c < chainCount; c++) {
var chain = mol.getChain (c);
var resCount = chain.getResidueCount ();
for (var rid = 0; rid < resCount; rid++) {
var res = chain.getResidue (rid);
var number = res.getNumber ();
var match = 0;
if (number >= minId && number <= maxId) {
for (var i = 0; i < idCount; i++) {
var range = ids.get (i);
if (number >= range[0] && number <= range[1]) {
match = 1;
break;
}}
}var residueAtomCount = res.getAtomCount ();
if (match == 1) {
for (var a = 0; a < residueAtomCount; a++) {
mask[count] = match;
count++;
}
} else {
count += residueAtomCount;
}}
}
}
return mask;
}, "astex.render.MoleculeRenderer,java.util.Vector");
c$.modulo = Clazz.defineMethod (c$, "modulo", 
function (r, n) {
var mask = astex.model.Selection.generateSelectionMask (r);
var count = 0;
for (var m = 0; m < r.getMoleculeCount (); m++) {
var mol = r.getMolecule (m);
var chainCount = mol.getChainCount ();
for (var c = 0; c < chainCount; c++) {
var chain = mol.getChain (c);
var resCount = chain.getResidueCount ();
for (var rid = 0; rid < resCount; rid++) {
var res = chain.getResidue (rid);
var number = res.getNumber ();
var match = 0;
if (number % n == 0) {
match = 1;
}var residueAtomCount = res.getAtomCount ();
if (match == 1) {
for (var a = 0; a < residueAtomCount; a++) {
mask[count] = match;
count++;
}
} else {
count += residueAtomCount;
}}
}
}
return mask;
}, "astex.render.MoleculeRenderer,~N");
c$.composite = Clazz.defineMethod (c$, "composite", 
function (r, ids) {
var mask = astex.model.Selection.generateSelectionMask (r);
return mask;
}, "astex.render.MoleculeRenderer,java.util.Vector");
c$.sequential = Clazz.defineMethod (c$, "sequential", 
function (r, ids) {
var minId = 1000000;
var maxId = -1000000;
var idCount = ids.size ();
for (var i = 0; i < idCount; i++) {
var range = ids.get (i);
if (range[0] < minId) {
minId = range[0];
}if (range[1] > maxId) {
maxId = range[1];
}}
var mask = astex.model.Selection.generateSelectionMask (r);
var count = 0;
for (var m = 0; m < r.getMoleculeCount (); m++) {
var mol = r.getMolecule (m);
var chainCount = mol.getChainCount ();
for (var c = 0; c < chainCount; c++) {
var chain = mol.getChain (c);
var resCount = chain.getResidueCount ();
for (var rid = 0; rid < resCount; rid++) {
var res = chain.getResidue (rid);
var number = res.getSequentialNumber ();
var match = 0;
if (number >= minId && number <= maxId) {
for (var i = 0; i < idCount; i++) {
var range = ids.get (i);
if (number >= range[0] && number <= range[1]) {
match = 1;
break;
}}
}var residueAtomCount = res.getAtomCount ();
if (match == 1) {
for (var a = 0; a < residueAtomCount; a++) {
mask[count] = match;
count++;
}
} else {
count += residueAtomCount;
}}
}
}
return mask;
}, "astex.render.MoleculeRenderer,java.util.Vector");
c$.altcode = Clazz.defineMethod (c$, "altcode", 
function (r, givenAltcode) {
var ac = givenAltcode.charAt (0);
var mask = astex.model.Selection.generateSelectionMask (r);
var iterator = r.getAtomIterator ();
var count = 0;
while (iterator.hasMoreElements ()) {
if (ac == iterator.getNextAtom ().getInsertionCode ()) mask[count] = 1;
count++;
}
return mask;
}, "astex.render.MoleculeRenderer,~S");
c$.insertion = Clazz.defineMethod (c$, "insertion", 
function (r, insertionCode) {
var icode = insertionCode.charAt (0);
var mask = astex.model.Selection.generateSelectionMask (r);
var count = 0;
for (var m = 0; m < r.getMoleculeCount (); m++) {
var mol = r.getMolecule (m);
var chainCount = mol.getChainCount ();
for (var c = 0; c < chainCount; c++) {
var chain = mol.getChain (c);
var resCount = chain.getResidueCount ();
for (var rid = 0; rid < resCount; rid++) {
var res = chain.getResidue (rid);
var thisInsertionCode = res.getInsertionCode ();
var match = 0;
if (thisInsertionCode == icode) {
match = 1;
}var residueAtomCount = res.getAtomCount ();
if (match == 1) {
for (var a = 0; a < residueAtomCount; a++) {
mask[count] = match;
count++;
}
} else {
count += residueAtomCount;
}}
}
}
return mask;
}, "astex.render.MoleculeRenderer,~S");
c$.molecule = Clazz.defineMethod (c$, "molecule", 
function (r, ids) {
var idCount = ids.size ();
var mask = astex.model.Selection.generateSelectionMask (r);
var count = 0;
var moleculeCount = r.getMoleculeCount ();
for (var m = 0; m < moleculeCount; m++) {
var mol = r.getMolecule (m);
var matched = 0;
for (var i = 0; i < idCount; i++) {
var id = ids.get (i);
if (id.startsWith ("#")) {
var molNumber = Integer.parseInt (id.substring (1));
if (molNumber == m) {
matched = 1;
break;
}} else if (astex.util.Mmatch.matches (ids.get (i), mol.getName ())) {
matched = 1;
break;
}}
var atomCount = mol.getAtomCount ();
if (matched == 1) {
for (var a = 0; a < atomCount; a++) {
mask[count++] = 1;
}
} else {
count += atomCount;
}}
return mask;
}, "astex.render.MoleculeRenderer,java.util.Vector");
c$.moleculeExact = Clazz.defineMethod (c$, "moleculeExact", 
function (r, ids) {
var idCount = ids.size ();
var mask = astex.model.Selection.generateSelectionMask (r);
var count = 0;
var moleculeCount = r.getMoleculeCount ();
for (var m = 0; m < moleculeCount; m++) {
var mol = r.getMolecule (m);
var matched = 0;
for (var i = 0; i < idCount; i++) {
if ((ids.get (i)).equals (mol.getName ())) {
matched = 1;
break;
}}
var atomCount = mol.getAtomCount ();
if (matched == 1) {
for (var a = 0; a < atomCount; a++) {
mask[count++] = 1;
}
} else {
count += atomCount;
}}
return mask;
}, "astex.render.MoleculeRenderer,java.util.Vector");
c$.byresidue = Clazz.defineMethod (c$, "byresidue", 
function (r, mask) {
var iterator = r.getAtomIterator ();
var count = 0;
while (iterator.hasMoreElements ()) {
iterator.getNextAtom ().setTemporarilySelected (mask[count++] != 0);
}
count = 0;
var moleculeCount = r.getMoleculeCount ();
for (var m = 0; m < moleculeCount; m++) {
var mol = r.getMolecule (m);
var chainCount = mol.getChainCount ();
for (var c = 0; c < chainCount; c++) {
var chain = mol.getChain (c);
var residueCount = chain.getResidueCount ();
for (var rr = 0; rr < residueCount; rr++) {
var residue = chain.getResidue (rr);
var atomCount = residue.getAtomCount ();
var residueSelected = 0;
for (var a = 0; a < atomCount; a++) {
var atom = residue.getAtom (a);
if (atom.isTemporarilySelected ()) {
residueSelected = 1;
break;
}}
for (var a = 0; a < atomCount; a++) {
mask[count++] = residueSelected;
}
}
}
}
return mask;
}, "astex.render.MoleculeRenderer,~A");
c$.bonded = Clazz.defineMethod (c$, "bonded", 
function (r, mask) {
var iterator = r.getAtomIterator ();
var count = 0;
while (iterator.hasMoreElements ()) {
var atom = iterator.getNextAtom ();
atom.setTemporarilySelected (false);
}
iterator = r.getAtomIterator ();
count = 0;
while (iterator.hasMoreElements ()) {
var atom = iterator.getNextAtom ();
if (mask[count] > 0) {
var bondCount = atom.getBondCount ();
for (var b = 0; b < bondCount; b++) {
var bondedAtom = atom.getBondedAtom (b);
bondedAtom.setTemporarilySelected (true);
}
}count++;
}
iterator = r.getAtomIterator ();
count = 0;
while (iterator.hasMoreElements ()) {
var atom = iterator.getNextAtom ();
if (atom.isTemporarilySelected ()) {
mask[count] = 1;
}count++;
}
return mask;
}, "astex.render.MoleculeRenderer,~A");
c$.name = Clazz.defineMethod (c$, "name", 
function (r, ids) {
var idCount = ids.size ();
var mask = astex.model.Selection.generateSelectionMask (r);
var count = 0;
for (var m = 0; m < r.getMoleculeCount (); m++) {
var mol = r.getMolecule (m);
var chainCount = mol.getChainCount ();
for (var c = 0; c < chainCount; c++) {
var chain = mol.getChain (c);
var resCount = chain.getResidueCount ();
for (var rid = 0; rid < resCount; rid++) {
var res = chain.getResidue (rid);
var name = res.getName ();
var matched = 0;
for (var i = 0; i < idCount; i++) {
if (astex.util.Mmatch.matches (ids.get (i), name)) {
matched = 1;
break;
}}
var residueAtomCount = res.getAtomCount ();
if (matched == 1) {
for (var a = 0; a < residueAtomCount; a++) {
mask[count] = 1;
count++;
}
} else {
count += residueAtomCount;
}}
}
}
return mask;
}, "astex.render.MoleculeRenderer,java.util.Vector");
c$.chain = Clazz.defineMethod (c$, "chain", 
function (r, ids) {
var idCount = ids.size ();
var mask = astex.model.Selection.generateSelectionMask (r);
var iterator = r.getAtomIterator ();
var count = 0;
while (iterator.hasMoreElements ()) {
var atom = iterator.getNextAtom ();
var res = atom.getResidue ();
var chain = res.getParent ();
var name = chain.getName ();
for (var i = 0; i < idCount; i++) {
var chainId = ids.get (i);
if (chainId.equals ("_")) {
chainId = " ";
}if (astex.util.Mmatch.matches (chainId, name)) {
mask[count] = 1;
break;
}}
count++;
}
return mask;
}, "astex.render.MoleculeRenderer,java.util.Vector");
c$.atom = Clazz.defineMethod (c$, "atom", 
function (r, ids) {
var idCount = ids.size ();
var mask = astex.model.Selection.generateSelectionMask (r);
var iterator = r.getAtomIterator ();
var count = 0;
while (iterator.hasMoreElements ()) {
var atom = iterator.getNextAtom ();
var name = atom.getAtomLabel ();
for (var i = 0; i < idCount; i++) {
if (astex.util.Mmatch.matches (ids.get (i), name)) {
mask[count] = 1;
break;
}}
count++;
}
return mask;
}, "astex.render.MoleculeRenderer,java.util.Vector");
c$.group = Clazz.defineMethod (c$, "group", 
function (r, group) {
var mask = astex.model.Selection.generateSelectionMask (r);
var iterator = r.getAtomIterator ();
while (iterator.hasMoreElements ()) {
var atom = iterator.getNextAtom ();
atom.setTemporarilySelected (false);
}
var groupEnum = group.keys ();
while (groupEnum.hasMoreElements ()) {
var atom = groupEnum.nextElement ();
atom.setTemporarilySelected (true);
}
var count = 0;
iterator = r.getAtomIterator ();
while (iterator.hasMoreElements ()) {
var atom = iterator.getNextAtom ();
if (atom.isTemporarilySelected ()) {
mask[count] = 1;
} else {
mask[count] = 0;
}count++;
}
return mask;
}, "astex.render.MoleculeRenderer,java.util.Hashtable");
c$.id = Clazz.defineMethod (c$, "id", 
function (r, ids) {
var minId = 1000000;
var maxId = -1000000;
var idCount = ids.size ();
for (var i = 0; i < idCount; i++) {
var range = ids.get (i);
if (range[0] < minId) {
minId = range[0];
}if (range[1] > maxId) {
maxId = range[1];
}}
var mask = astex.model.Selection.generateSelectionMask (r);
var iterator = r.getAtomIterator ();
var count = 0;
while (iterator.hasMoreElements ()) {
var atom = iterator.getNextAtom ();
var number = atom.getId ();
if (number >= minId && number <= maxId) {
for (var i = 0; i < idCount; i++) {
var range = ids.get (i);
if (number >= range[0] && number <= range[1]) {
mask[count] = 1;
break;
}}
}count++;
}
return mask;
}, "astex.render.MoleculeRenderer,java.util.Vector");
c$.element = Clazz.defineMethod (c$, "element", 
function (r, ids) {
var minId = 1000000;
var maxId = -1000000;
var idCount = ids.size ();
for (var i = 0; i < idCount; i++) {
var range = ids.get (i);
if (range[0] < minId) {
minId = range[0];
}if (range[1] > maxId) {
maxId = range[1];
}}
var mask = astex.model.Selection.generateSelectionMask (r);
var iterator = r.getAtomIterator ();
var count = 0;
while (iterator.hasMoreElements ()) {
var atom = iterator.getNextAtom ();
var number = atom.getElement ();
if (number >= minId && number <= maxId) {
for (var i = 0; i < idCount; i++) {
var range = ids.get (i);
if (number >= range[0] && number <= range[1]) {
mask[count] = 1;
break;
}}
}count++;
}
return mask;
}, "astex.render.MoleculeRenderer,java.util.Vector");
c$.current = Clazz.defineMethod (c$, "current", 
function (r) {
var mask = astex.model.Selection.generateSelectionMask (r);
var iterator = r.getAtomIterator ();
var count = 0;
while (iterator.hasMoreElements ()) {
var atom = iterator.getNextAtom ();
if (atom.isSelected ()) {
mask[count] = 1;
} else {
mask[count] = 0;
}count++;
}
return mask;
}, "astex.render.MoleculeRenderer");
c$.property = Clazz.defineMethod (c$, "property", 
function (r, property) {
var mask = astex.model.Selection.generateSelectionMask (r);
var iterator = r.getAtomIterator ();
var count = 0;
while (iterator.hasMoreElements ()) {
var atom = iterator.getNextAtom ();
if ((atom.attributes & property) != 0) {
mask[count] = 1;
} else {
mask[count] = 0;
}count++;
}
return mask;
}, "astex.render.MoleculeRenderer,~N");
c$.displayed = Clazz.defineMethod (c$, "displayed", 
function (r) {
var mask = astex.model.Selection.generateSelectionMask (r);
var iterator = r.getAtomIterator ();
var count = 0;
while (iterator.hasMoreElements ()) {
var atom = iterator.getNextAtom ();
if (atom.isDisplayed ()) {
mask[count] = 1;
} else {
mask[count] = 0;
}count++;
}
return mask;
}, "astex.render.MoleculeRenderer");
c$.labelled = Clazz.defineMethod (c$, "labelled", 
function (r) {
var mask = astex.model.Selection.generateSelectionMask (r);
var iterator = r.getAtomIterator ();
var count = 0;
while (iterator.hasMoreElements ()) {
var atom = iterator.getNextAtom ();
if (atom.isLabelled ()) {
mask[count] = 1;
} else {
mask[count] = 0;
}count++;
}
return mask;
}, "astex.render.MoleculeRenderer");
c$.defaultSelection = Clazz.defineMethod (c$, "defaultSelection", 
function (r) {
var mask = astex.model.Selection.generateSelectionMask (r);
var iterator = r.getAtomIterator ();
var count = 0;
var selected = 0;
while (iterator.hasMoreElements ()) {
var atom = iterator.getNextAtom ();
if (atom.isSelected ()) {
selected++;
mask[count] = 1;
} else {
mask[count] = 0;
}count++;
}
if (selected == 0) {
var maskCount = mask.length;
for (var i = 0; i < maskCount; i++) {
mask[i] = 1;
}
}return mask;
}, "astex.render.MoleculeRenderer");
c$.wide = Clazz.defineMethod (c$, "wide", 
function (r) {
var mask = astex.model.Selection.generateSelectionMask (r);
var iterator = r.getAtomIterator ();
var count = 0;
while (iterator.hasMoreElements ()) {
var atom = iterator.getNextAtom ();
if (atom.isWide ()) {
mask[count] = 1;
} else {
mask[count] = 0;
}count++;
}
return mask;
}, "astex.render.MoleculeRenderer");
c$.sphere = Clazz.defineMethod (c$, "sphere", 
function (r, rad, x, y, z) {
var mask = astex.model.Selection.generateSelectionMask (r);
var iterator = r.getAtomIterator ();
var count = 0;
var radSq = rad * rad;
var p = astex.util.Point3d.new3 (x, y, z);
while (iterator.hasMoreElements ()) {
var atom = iterator.getNextAtom ();
if (atom.distanceSq (p) < radSq) {
mask[count] = 1;
} else {
mask[count] = 0;
}count++;
}
return mask;
}, "astex.render.MoleculeRenderer,~N,~N,~N,~N");
c$.sphere = Clazz.defineMethod (c$, "sphere", 
function (mr, rad, sphereMask) {
var sphereSelection = mr.maskToArray (sphereMask, false);
var sphereSelectionCount = sphereSelection.size ();
var mask = astex.model.Selection.generateSelectionMask (mr);
var iterator = mr.getAtomIterator ();
var count = 0;
var radSq = rad * rad;
while (iterator.hasMoreElements ()) {
var atom = iterator.getNextAtom ();
var inside = 0;
for (var i = 0; i < sphereSelectionCount; i++) {
var sphereAtom = sphereSelection.get (i);
if (atom.distanceSq (sphereAtom) < radSq) {
inside = 1;
break;
}}
if (inside > 0) {
mask[count] = 1;
} else {
mask[count] = 0;
}count++;
}
return mask;
}, "astex.render.MoleculeRenderer,~N,~A");
c$.contact = Clazz.defineMethod (c$, "contact", 
function (mr, rad, sphereMask) {
var sphereSelection = mr.maskToArray (sphereMask, false);
var sphereSelectionCount = sphereSelection.size ();
var mask = astex.model.Selection.generateSelectionMask (mr);
var iterator = mr.getAtomIterator ();
var count = 0;
while (iterator.hasMoreElements ()) {
var atom = iterator.getNextAtom ();
var arad = atom.getVDWRadius () + rad;
var inside = 0;
for (var i = 0; i < sphereSelectionCount; i++) {
var sphereAtom = sphereSelection.get (i);
var srad = sphereAtom.getVDWRadius ();
var radSq = arad + srad;
radSq *= radSq;
if (atom.distanceSq (sphereAtom) < radSq) {
inside = 1;
break;
}}
mask[count++] = (inside >= 0 ? 1 : 0);
}
return mask;
}, "astex.render.MoleculeRenderer,~N,~A");
c$.graph = Clazz.defineMethod (c$, "graph", 
function (mr, graphMask) {
var graphSelection = mr.maskToArray (graphMask, false);
var graphSelectionCount = graphSelection.size ();
var mask = astex.model.Selection.generateSelectionMask (mr);
var count = 0;
var iterator = mr.getAtomIterator ();
while (iterator.hasMoreElements ()) {
var atom = iterator.getNextAtom ();
atom.setTemporarilySelected (false);
}
for (var i = 0; i < graphSelectionCount; i++) {
var atom = graphSelection.get (i);
if (atom.isTemporarilySelected () == false) {
astex.model.Selection.propagateGraph (atom);
}}
iterator = mr.getAtomIterator ();
while (iterator.hasMoreElements ()) {
var atom = iterator.getNextAtom ();
if (atom.isTemporarilySelected ()) {
mask[count] = 1;
} else {
mask[count] = 0;
}count++;
atom.setTemporarilySelected (false);
}
astex.model.Selection.selectionMaskCache.add (graphMask);
return mask;
}, "astex.render.MoleculeRenderer,~A");
c$.propagateGraph = Clazz.defineMethod (c$, "propagateGraph", 
 function (a) {
var bondCount = a.getBondCount ();
a.setTemporarilySelected (true);
for (var i = 0; i < bondCount; i++) {
var otherAtom = a.getBondedAtom (i);
if (otherAtom.isTemporarilySelected () == false) {
astex.model.Selection.propagateGraph (otherAtom);
}}
}, "astex.model.Atom");
c$.compositeSelection = Clazz.defineMethod (c$, "compositeSelection", 
function (r, molecules, chains, residues, atoms) {
var mask1 = astex.model.Selection.molecule (r, molecules);
var mask2 = astex.model.Selection.chain (r, molecules);
mask1 = astex.model.Selection.and (mask1, mask2);
mask2 = astex.model.Selection.residue (r, residues);
mask1 = astex.model.Selection.and (mask1, mask2);
mask2 = astex.model.Selection.atom (r, atoms);
return astex.model.Selection.and (mask1, mask2);
}, "astex.render.MoleculeRenderer,java.util.Vector,java.util.Vector,java.util.Vector,java.util.Vector");
c$.and = Clazz.defineMethod (c$, "and", 
function (mask1, mask2) {
var count = Math.min (mask1.length, mask2.length);
for (var i = 0; i < count; i++) {
if (mask1[i] > 0 && mask2[i] > 0) {
mask1[i] = 1;
} else {
mask1[i] = 0;
}}
return mask1;
}, "~A,~A");
c$.or = Clazz.defineMethod (c$, "or", 
function (mask1, mask2) {
var count = Math.min (mask1.length, mask2.length);
for (var i = 0; i < count; i++) {
if (mask1[i] > 0 || mask2[i] > 0) {
mask1[i] = 1;
} else {
mask1[i] = 0;
}}
astex.model.Selection.selectionMaskCache.add (mask2);
return mask1;
}, "~A,~A");
c$.not = Clazz.defineMethod (c$, "not", 
function (mask1) {
var count = mask1.length;
for (var i = 0; i < count; i++) {
if (mask1[i] == 0) {
mask1[i] = 1;
} else {
mask1[i] = 0;
}}
return mask1;
}, "~A");
c$.builtin = Clazz.defineMethod (c$, "builtin", 
function (r, names) {
var ids =  new java.util.Vector (names.size ());
for (var i = 0; i < names.size (); i++) ids.addElement (names.get (i));

return astex.model.Selection.name (r, ids);
}, "astex.render.MoleculeRenderer,astex.util.DynamicArray");
c$.builtin2 = Clazz.defineMethod (c$, "builtin2", 
function (r, names) {
var ids =  new java.util.Vector (names.size ());
for (var i = 0; i < names.size (); i++) {
ids.addElement (names.get (i));
}
return astex.model.Selection.atom (r, ids);
}, "astex.render.MoleculeRenderer,astex.util.DynamicArray");
c$.builtin3 = Clazz.defineMethod (c$, "builtin3", 
function (r, names) {
var ids =  new java.util.Vector (names.size ());
for (var i = 0; i < names.size (); i++) {
ids.addElement (names.get (i));
}
return astex.model.Selection.name (r, ids);
}, "astex.render.MoleculeRenderer,astex.util.DynamicArray");
c$.aminoacid = Clazz.defineMethod (c$, "aminoacid", 
function (r) {
return astex.model.Selection.builtin (r, astex.model.Selection.aminoacidNames);
}, "astex.render.MoleculeRenderer");
c$.modifiedAA = Clazz.defineMethod (c$, "modifiedAA", 
function (r) {
return astex.model.Selection.builtin (r, astex.model.Selection.modifiedAANames);
}, "astex.render.MoleculeRenderer");
c$.solvent = Clazz.defineMethod (c$, "solvent", 
function (r) {
return astex.model.Selection.builtin (r, astex.model.Selection.solventNames);
}, "astex.render.MoleculeRenderer");
c$.dna = Clazz.defineMethod (c$, "dna", 
function (r) {
return astex.model.Selection.builtin (r, astex.model.Selection.dnaNames);
}, "astex.render.MoleculeRenderer");
c$.modifiedNA = Clazz.defineMethod (c$, "modifiedNA", 
function (r) {
return astex.model.Selection.builtin (r, astex.model.Selection.modifiedNANames);
}, "astex.render.MoleculeRenderer");
c$.ions = Clazz.defineMethod (c$, "ions", 
function (r) {
return astex.model.Selection.builtin3 (r, astex.model.Selection.ionNames);
}, "astex.render.MoleculeRenderer");
c$.aminoacidNames = c$.prototype.aminoacidNames =  new astex.util.DynamicArray ();
c$.modifiedAANames = c$.prototype.modifiedAANames =  new astex.util.DynamicArray ();
c$.dnaNames = c$.prototype.dnaNames =  new astex.util.DynamicArray ();
c$.modifiedNANames = c$.prototype.modifiedNANames =  new astex.util.DynamicArray ();
c$.solventNames = c$.prototype.solventNames =  new astex.util.DynamicArray ();
c$.ionNames = c$.prototype.ionNames =  new astex.util.DynamicArray ();
Clazz.defineStatics (c$,
"initialized", false);
c$.selectionMaskCache = c$.prototype.selectionMaskCache =  new astex.util.DynamicArray ().set (10, 0);
Clazz.defineStatics (c$,
"GT", 0,
"GE", 1,
"LT", 2,
"LE", 3,
"EQ", 4,
"NE", 5);
});
