Clazz.declarePackage ("astex.model");
Clazz.load (["astex.generic.Generic", "astex.model.Selectable"], "astex.model.Residue", ["astex.model.Selection", "astex.util.Color32", "$.DynamicArray", "$.Point3d", "$.Settings", "java.awt.Color", "java.lang.Boolean", "$.Double", "java.util.Collections", "JU.Lst"], function () {
c$ = Clazz.decorateAsClass (function () {
this.atoms = null;
this.parent = null;
this.insertionCode = ' ';
this.name = null;
this.secondaryStructure = 5;
this.number = 0;
this.sequentialNumber = 0;
this.authorNumber = 0;
Clazz.instantialize (this, arguments);
}, astex.model, "Residue", astex.generic.Generic, astex.model.Selectable);
Clazz.makeConstructor (c$, 
 function () {
Clazz.superConstructor (this, astex.model.Residue, []);
this.atoms =  new astex.util.DynamicArray ().set (6, 0);
this.initialise ();
});
Clazz.defineMethod (c$, "initialise", 
 function () {
this.name = null;
this.number = astex.model.Residue.undefinedResidueNumber;
this.sequentialNumber = astex.model.Residue.undefinedResidueNumber;
this.authorNumber = astex.model.Residue.undefinedResidueNumber;
this.parent = null;
this.insertionCode = ' ';
this.atoms.removeAllElements ();
this.setValue ("color", java.awt.Color.white);
this.setValue ("torsions", Boolean.FALSE);
this.setValue ("torsionRadius",  new Double (0.4));
this.setValue ("torsionGreek", Boolean.TRUE);
this.setValue ("torsionFormat", "<3d=true,size=0.3>%t %.1f");
});
c$.create = Clazz.defineMethod (c$, "create", 
function () {
return  new astex.model.Residue ();
});
Clazz.defineMethod (c$, "setParent", 
function (chain) {
this.parent = chain;
}, "astex.model.Chain");
Clazz.defineMethod (c$, "getParent", 
function () {
return this.parent;
});
Clazz.defineMethod (c$, "setInsertionCode", 
function (code) {
this.insertionCode = code;
}, "~S");
Clazz.defineMethod (c$, "getInsertionCode", 
function () {
return this.insertionCode;
});
Clazz.defineMethod (c$, "setName", 
function (newName) {
this.name = newName;
var colorName = astex.util.Settings.getString ("residue", this.name + ".color", "0x000000");
var c = astex.util.Color32.getColorFromName (colorName);
var color =  new java.awt.Color (c);
this.setValue ("color", color);
}, "~S");
Clazz.defineMethod (c$, "hasSelectedAtoms", 
function () {
var atomCount = this.getAtomCount ();
for (var a = 0; a < atomCount; a++) {
var atom = this.getAtom (a);
if (atom.isSelected ()) {
return true;
}}
return false;
});
Clazz.defineMethod (c$, "getName", 
function () {
return (this.name == null ? astex.model.Residue.undefinedResidueName : this.name);
});
Clazz.defineMethod (c$, "getLabel", 
function () {
var label = this.parent.getAuthName () + ':' + this.getAuthorNumber ();
return (this.insertionCode == ' ' ? label : label + "[" + this.insertionCode + "]");
});
Clazz.defineMethod (c$, "getSecondaryStructure", 
function () {
return this.secondaryStructure;
});
Clazz.defineMethod (c$, "setSecondaryStructure", 
function (v) {
this.secondaryStructure = v;
}, "~N");
Clazz.defineMethod (c$, "setSequentialNumber", 
function (sNumber) {
this.sequentialNumber = sNumber;
}, "~N");
Clazz.defineMethod (c$, "setNumber", 
function (newNumber) {
this.number = newNumber;
}, "~N");
Clazz.defineMethod (c$, "getSequentialNumber", 
function () {
return (this.sequentialNumber == astex.model.Residue.undefinedResidueNumber ? 1 : this.sequentialNumber);
});
Clazz.defineMethod (c$, "getNumber", 
function () {
return (this.number == astex.model.Residue.undefinedResidueNumber ? 1 : this.number);
});
Clazz.defineMethod (c$, "getAuthorNumber", 
function () {
return (this.authorNumber == astex.model.Residue.undefinedResidueNumber ? this.getNumber () : this.authorNumber);
});
Clazz.defineMethod (c$, "setAuthorNumber", 
function (authNum) {
this.authorNumber = authNum;
}, "~N");
Clazz.defineMethod (c$, "addAtom", 
function (atom) {
this.atoms.add (atom);
}, "astex.model.Atom");
Clazz.defineMethod (c$, "removeAtom", 
function (atom) {
this.atoms.remove (atom);
if (this.atoms.size () == 0) {
var chain = this.getParent ();
chain.removeResidue (this);
}}, "astex.model.Atom");
Clazz.defineMethod (c$, "$delete", 
function () {
var chain = this.getParent ();
var mol = chain.getParent ();
var atomCount = this.getAtomCount ();
for (var a = atomCount - 1; a >= 0; a--) {
var atom = this.getAtom (a);
var bondCount = atom.getBondCount ();
for (var b = 0; b < bondCount; b++) {
var bond = atom.getBondI (b);
mol.removeBond (bond);
}
this.removeAtom (atom);
mol.removeAtom (atom);
}
});
Clazz.defineMethod (c$, "getAtomCount", 
function () {
return this.atoms.size ();
});
Clazz.defineMethod (c$, "getAtom", 
function (index) {
return this.atoms.get (index);
}, "~N");
Clazz.defineMethod (c$, "getAtomFromName", 
function (nm) {
return this.getAtomFromNameAlt (nm, 'A');
}, "~S");
Clazz.defineMethod (c$, "getAtomFromNameAlt", 
function (nm, code) {
var atomCount = this.getAtomCount ();
for (var i = 0; i < atomCount; i++) {
var a = this.getAtom (i);
if (a.getAtomLabel ().equals (nm) && (a.getInsertionCode () == ' ' || a.getInsertionCode () == code)) {
return a;
}}
return null;
}, "~S,~S");
Clazz.defineMethod (c$, "findAtom", 
function (name) {
return this.findAtomAlt (name, 'A');
}, "~S");
Clazz.defineMethod (c$, "findAtomAlt", 
function (name, code) {
var r = this;
if (name.endsWith ("-") || name.endsWith ("+")) {
var chain = this.getParent ();
var residueCount = chain.getResidueCount ();
var residuePos = -1;
for (var i = 0; i < residueCount; i++) {
var res = chain.getResidue (i);
if (res === this) {
residuePos = i;
break;
}}
if (residuePos != -1) {
if (name.endsWith ("-") && residuePos > 0) {
r = chain.getResidue (residuePos - 1);
} else if (name.endsWith ("+") && residuePos < residueCount - 1) {
r = chain.getResidue (residuePos + 1);
} else {
r = null;
}} else {
r = null;
}name = name.substring (0, name.length - 1);
}return (r == null ? null : r.getAtomFromNameAlt (name, code));
}, "~S,~S");
Clazz.defineMethod (c$, "getAtoms", 
function () {
return this.atoms;
});
Clazz.defineMethod (c$, "isStandardAminoAcid", 
function () {
return this.isStringInArray (this.name, astex.model.Selection.aminoacidNames);
});
Clazz.defineMethod (c$, "isModifiedAminoAcid", 
function () {
return this.isStringInArray (this.name, astex.model.Selection.modifiedAANames);
});
Clazz.defineMethod (c$, "isIon", 
function () {
return this.isStringInArray (this.name, astex.model.Selection.ionNames);
});
Clazz.defineMethod (c$, "isSolvent", 
function () {
return this.isStringInArray (this.name, astex.model.Selection.solventNames);
});
Clazz.defineMethod (c$, "isNucleicAcid", 
function () {
return this.isStringInArray (this.name, astex.model.Selection.dnaNames);
});
Clazz.defineMethod (c$, "isModifiedNucleicAcid", 
function () {
return this.isStringInArray (this.name, astex.model.Selection.modifiedNANames);
});
Clazz.defineMethod (c$, "isStringInArray", 
 function (string, stringArray) {
if (this.name != null) {
var trimmedString = string.trim ();
var count = stringArray.size ();
for (var i = 0; i < count; i++) {
if (trimmedString.equals (stringArray.get (i))) {
return true;
}}
}return false;
}, "~S,astex.util.DynamicArray");
Clazz.defineMethod (c$, "isIsolated", 
function () {
var atomCount = this.getAtomCount ();
for (var a = 0; a < atomCount; a++) {
var atom = this.getAtom (a);
var bondCount = atom.getBondCount ();
for (var b = 0; b < bondCount; b++) {
var bond = atom.getBondI (b);
var otherAtom = bond.getOtherAtom (atom);
var otherResidue = otherAtom.getResidue ();
if (otherResidue !== this) {
return false;
}}
}
return true;
});
Clazz.overrideMethod (c$, "selectStatement", 
function () {
var chain = this.getParent ();
var chainSelect = chain.selectStatement ();
var command = "residue " + this.getNumber ();
command += " and name '" + this.getName () + "'";
var insertionCode = this.getInsertionCode ();
if (insertionCode != ' ') {
command += " and insertion '" + insertionCode + "'";
}return command += " and " + chainSelect;
});
Clazz.overrideMethod (c$, "select", 
function (state) {
var selectCount = 0;
for (var a = 0; a < this.getAtomCount (); a++) {
var atom = this.getAtom (a);
selectCount += atom.select (state);
}
return selectCount;
}, "~N");
Clazz.overrideMethod (c$, "toString", 
function () {
var c = this.getParent ();
return c.getName () + ":" + this.getNumber ();
});
Clazz.overrideMethod (c$, "getProperties", 
function () {
var v =  new JU.Lst ();
v.addLast ("color");
return java.util.Collections.enumeration (v);
});
Clazz.defineMethod (c$, "getCenter", 
function () {
var center =  new astex.util.Point3d ();
var atomCount = this.getAtomCount ();
for (var i = 0; i < atomCount; i++) {
center.add (this.getAtom (i));
}
if (atomCount > 0) center.divide (atomCount);
return center;
});
Clazz.defineStatics (c$,
"undefinedResidueNumber", -2147483648,
"undefinedResidueName", "XXX",
"Undefined", -1,
"Sheet", 1,
"Helix", 2,
"Helix310", 3,
"Turn", 4,
"Coil", 5,
"Coarse", 10,
"ResidueColor", "color",
"Torsions", "torsions",
"TorsionRadius", "torsionRadius",
"TorsionGreek", "torsionGreek",
"TorsionFormat", "torsionFormat");
});
