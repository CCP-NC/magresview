Clazz.declarePackage ("astex.model");
Clazz.load (["astex.generic.GenericInterface", "astex.model.Selectable", "astex.util.Point3d", "$.Color32", "$.DynamicArray"], "astex.model.Atom", ["astex.io.FILE", "astex.util.PeriodicTable", "$.Settings", "java.awt.Color", "java.lang.Character", "$.Double", "java.util.Collections", "$.Hashtable", "JU.Lst", "$.PT"], function () {
c$ = Clazz.decorateAsClass (function () {
this.attributes = 0;
this.radius = -1.0;
this.ballRadius = 0.3;
this.modellingData = null;
this.bonds = null;
this.firstBond = null;
this.secondBond = null;
this.thirdBond = null;
this.xs = 0;
this.ys = 0;
this.zs = 0;
this.insertionCode = '\0';
this.altLoc = '\0';
this.color = 0;
this.transparency = 0;
this.atomType = null;
this.element = 0;
this.label = null;
this.customLabel = null;
this.id = 0;
this.charge = 0;
this.bFactor = 0;
this.occupancy = 0;
this.partialCharge = 0;
this.parentResidue = null;
this.properties = null;
Clazz.instantialize (this, arguments);
}, astex.model, "Atom", astex.util.Point3d, [astex.model.Selectable, astex.generic.GenericInterface]);
Clazz.makeConstructor (c$, 
 function () {
Clazz.superConstructor (this, astex.model.Atom, []);
this.initialise ();
});
Clazz.defineMethod (c$, "initialise", 
function () {
this.set (0, 0, 0);
this.bonds = null;
this.firstBond = null;
this.secondBond = null;
this.thirdBond = null;
this.id = astex.model.Atom.Undefined;
this.color = 0xff000000;
this.transparency = 255;
this.charge = 0;
this.partialCharge = 0.0;
this.attributes = astex.model.Atom.Displayed;
this.bFactor = 0.0;
this.occupancy = 1.0;
this.radius = -1.0;
this.ballRadius = 0.3;
this.atomType = null;
this.insertionCode = ' ';
this.altLoc = ' ';
});
Clazz.defineMethod (c$, "setAtomType", 
function (s) {
this.atomType = s;
}, "~S");
Clazz.defineMethod (c$, "getAtomType", 
function () {
return this.atomType;
});
Clazz.defineMethod (c$, "setTransparency", 
function (t) {
this.transparency = t;
}, "~N");
Clazz.defineMethod (c$, "getTransparency", 
function () {
return this.transparency;
});
Clazz.defineMethod (c$, "setInsertionCode", 
function (c) {
this.insertionCode = c;
}, "~S");
Clazz.defineMethod (c$, "getInsertionCode", 
function () {
return this.insertionCode;
});
Clazz.defineMethod (c$, "setAltLoc", 
function (c) {
this.altLoc = c;
}, "~S");
Clazz.defineMethod (c$, "getAltLoc", 
function () {
return this.altLoc;
});
c$.create = Clazz.defineMethod (c$, "create", 
function () {
var atomCacheSize = astex.model.Atom.atomCache.size ();
if (atomCacheSize > 0) {
var atom = astex.model.Atom.atomCache.get (atomCacheSize - 1);
astex.model.Atom.atomCache.removeElement (atomCacheSize - 1);
atom.initialise ();
astex.model.Atom.atomsCached++;
return atom;
}astex.model.Atom.atomsCreated++;
return  new astex.model.Atom ();
});
Clazz.defineMethod (c$, "release", 
function () {
if (astex.model.Atom.atomCache.size () < 2048) {
astex.model.Atom.atomCache.add (this);
} else {
}});
Clazz.defineMethod (c$, "setBFactor", 
function (b) {
this.bFactor = b;
}, "~N");
Clazz.defineMethod (c$, "getBFactor", 
function () {
return this.bFactor;
});
Clazz.defineMethod (c$, "setOccupancy", 
function (o) {
this.occupancy = o;
}, "~N");
Clazz.defineMethod (c$, "getOccupancy", 
function () {
return this.occupancy;
});
Clazz.defineMethod (c$, "getPartialCharge", 
function () {
return this.partialCharge;
});
Clazz.defineMethod (c$, "setPartialCharge", 
function (v) {
this.partialCharge = v;
}, "~N");
Clazz.defineMethod (c$, "getAttribute", 
function (attribute) {
switch (attribute) {
case 0:
return this.x;
case 1:
return this.y;
case 2:
return this.z;
case 3:
return this.bFactor;
case 4:
return this.occupancy;
case 6:
return this.partialCharge;
case 7:
return (this.modellingData == null ? 0 : this.modellingData.energy);
case 5:
return this.getId ();
default:
System.out.println ("Atom: attempt to get unknown attribute " + attribute);
return 0.0;
}
}, "~N");
Clazz.defineMethod (c$, "setId", 
function (newId) {
if (newId == astex.model.Atom.Undefined) {
System.out.println ("explicitly setting id to undefined " + this);
System.out.println ("(anti-desirable)");
}this.id = newId;
}, "~N");
Clazz.defineMethod (c$, "getId", 
function () {
if (this.id == astex.model.Atom.Undefined) {
var molecule = this.getMolecule ();
molecule.assignAtomNumbers ();
}return this.id;
});
Clazz.defineMethod (c$, "setElement", 
function (newElement) {
this.element = newElement;
}, "~N");
Clazz.defineMethod (c$, "getElement", 
function () {
return this.element;
});
Clazz.defineMethod (c$, "getAtomSymbol", 
function () {
var symbol = astex.util.PeriodicTable.getAtomSymbolFromElement (this.element);
return (symbol == null ? "C" : symbol);
});
Clazz.defineMethod (c$, "setAtomLabel", 
function (newLabel) {
this.label = newLabel;
}, "~S");
Clazz.defineMethod (c$, "getAtomLabel", 
function () {
return (this.label == null ? astex.util.PeriodicTable.getAtomSymbolFromElement (this.getElement ()).toUpperCase () + this.getId () : this.label);
});
Clazz.defineMethod (c$, "generateLabel", 
function (format) {
if (format.indexOf ('%') == -1 && format.indexOf ('`') == -1) return format;
var s = "";
var len = format.length;
for (var i = 0; i < len; i++) {
var c = format.charAt (i);
if (c == '%') {
if (i == len - 1) {
System.out.println ("Atom.generateLabel: % at end of format string, just placing %");
} else {
switch (c = format.charAt (i + 1)) {
case '%':
s += '%';
break;
case 'x':
s += astex.io.FILE.sprintD ("%.3f", this.getX ());
break;
case 'y':
s += astex.io.FILE.sprintD ("%.3f", this.getY ());
break;
case 'z':
s += astex.io.FILE.sprintD ("%.3f", this.getZ ());
break;
case 'e':
s += astex.io.FILE.sprintD ("%.2f", (this.modellingData == null ? 0 : this.modellingData.energy));
break;
case 'b':
s += astex.io.FILE.sprintD ("%.1f", this.getBFactor ());
break;
case 'B':
s += astex.io.FILE.sprintI ("%d", Clazz.doubleToInt (this.getBFactor ()));
break;
case 'o':
s += astex.io.FILE.sprintD ("%.2f", this.getOccupancy ());
break;
case 'q':
s += astex.io.FILE.sprintD ("%.2f", this.getPartialCharge ());
break;
case 'i':
s += astex.io.FILE.sprintI ("%-4d", this.getId ());
break;
case 'I':
s += this.getInsertionCode ();
break;
case 'A':
var res = this.getResidue ();
var label = this.getAtomLabel ();
if (res != null && res.isStandardAminoAcid ()) {
var labelLength = label.length;
for (var l = 0; l < labelLength; l++) {
var lc = label.charAt (l);
if (l == 1) {
s += '\\';
s += Character.toLowerCase (lc);
} else {
s += lc;
}}
} else {
s += label;
}break;
case 'a':
s += this.getAtomLabel ();
break;
case 'l':
var al = this.getAltLoc ();
if (al != ' ') s += "[" + al + "]";
break;
default:
var r = this.getResidue ();
var ch;
var m;
if (r != null) switch (c) {
case 'r':
s += astex.io.FILE.sprintI ("%d", r.getNumber ());
if ((r.getInsertionCode ()).charCodeAt (0) != 0 && (c = r.getInsertionCode ()) != ' ') s += c;
break;
case 'R':
s += r.getName ();
break;
case 'f':
var name = r.getName ();
s += name.charAt (0) + name.substring (1).toLowerCase ();
break;
case 'F':
if (r != null) {
var au = r.getAuthorNumber ();
s += (au == -2147483648 ? astex.io.FILE.sprintI ("%d", r.getNumber ()) : astex.io.FILE.sprintI ("%d", au));
if ((c = r.getInsertionCode ()).charCodeAt (0) != 0 && c != ' ') s += "[" + c + "]";
}break;
case 'c':
var chain = r.getParent ();
var n;
if (chain != null && !(n = chain.getAuthName ()).equals (" ")) s += n;
break;
case 'm':
if ((ch = r.getParent ()) != null && (m = ch.getParent ()) != null) s += m.getName ();
break;
case 'M':
m = r.getParent ().getParent ();
if (m.getModelType () != 1) s += "M" + m.getModelNumber () + " ";
break;
}
}
}i++;
} else {
s += c;
}}
format = s;
s = "";
len = format.length;
for (var i = 0; i < len; i++) {
var c = format.charAt (i);
if (c == '`') {
var url = "";
++i;
for (; i < len; i++) {
c = format.charAt (i);
if (c == '`') break;
url += c;
}
var f = astex.io.FILE.getFileAsString (url.toString ());
if (f == null) {
s += "invalid_url";
} else {
s += JU.PT.replaceAllCharacters (f, "\r\n", "");
}} else {
s += c;
}}
return s;
}, "~S");
Clazz.defineMethod (c$, "getSymbol", 
function () {
return astex.util.PeriodicTable.getAtomSymbolFromElement (this.getElement ());
});
Clazz.defineMethod (c$, "getMass", 
function () {
return astex.util.PeriodicTable.elements[this.getElement ()].mass;
});
Clazz.defineMethod (c$, "getCharge", 
function () {
return this.charge;
});
Clazz.defineMethod (c$, "setCharge", 
function (newCharge) {
this.charge = newCharge;
}, "~N");
Clazz.defineMethod (c$, "setColor", 
function (newColor) {
this.color = newColor;
}, "~N");
Clazz.defineMethod (c$, "getColor", 
function () {
if (this.color == 0xff000000) {
switch (this.getElement ()) {
case 6:
this.color = astex.util.Color32.green;
break;
case 8:
this.color = astex.util.Color32.red;
break;
case 7:
this.color = astex.util.Color32.blue;
break;
case 16:
this.color = astex.util.Color32.yellow;
break;
case 15:
this.color = astex.util.Color32.magenta;
break;
case 17:
this.color = astex.util.Color32.orange;
break;
case 9:
this.color = astex.util.Color32.cyan;
break;
case 35:
this.color = astex.util.Color32.magenta;
break;
case 1:
default:
this.color = astex.util.Color32.white;
break;
}
}return this.color;
});
Clazz.defineMethod (c$, "getSelectedColor", 
function () {
return (this.isSelected () ? astex.model.Atom.selectedColor : this.getColor ());
});
Clazz.defineMethod (c$, "resetColor", 
function () {
this.color = 0xff000000;
});
Clazz.defineMethod (c$, "getMolecule", 
function () {
if (this.parentResidue != null) {
var parentChain = this.parentResidue.getParent ();
if (parentChain != null) {
return parentChain.getParent ();
}}return null;
});
Clazz.defineMethod (c$, "setParent", 
function (residue) {
this.parentResidue = residue;
}, "astex.model.Residue");
Clazz.defineMethod (c$, "getResidue", 
function () {
return this.parentResidue;
});
Clazz.defineMethod (c$, "addBond", 
function (bond) {
if (this.bonds != null) {
this.bonds.add (bond);
} else if (this.firstBond == null) {
this.firstBond = bond;
} else if (this.secondBond == null) {
this.secondBond = bond;
} else if (this.thirdBond == null) {
this.thirdBond = bond;
} else {
this.bonds =  new astex.util.DynamicArray ().set (4, 1);
this.bonds.add (this.firstBond);
this.bonds.add (this.secondBond);
this.bonds.add (this.thirdBond);
this.bonds.add (bond);
this.firstBond = null;
this.secondBond = null;
this.thirdBond = null;
}}, "astex.model.Bond");
Clazz.defineMethod (c$, "getBondI", 
function (index) {
if (this.bonds != null) {
return this.bonds.get (index);
}switch (index) {
case 0:
return this.firstBond;
case 1:
return this.secondBond;
case 2:
return this.thirdBond;
default:
return null;
}
}, "~N");
Clazz.defineMethod (c$, "getBondedAtom", 
function (index) {
var bond = this.getBondI (index);
return (bond == null ? null : bond.getOtherAtom (this));
}, "~N");
Clazz.defineMethod (c$, "getBondCount", 
function () {
return (this.bonds != null ? this.bonds.size () : this.thirdBond != null ? 3 : this.secondBond != null ? 2 : this.firstBond != null ? 1 : 0);
});
Clazz.defineMethod (c$, "getBond", 
function (otherAtom) {
for (var i = this.getBondCount (); --i >= 0; ) {
var bond = this.getBondI (i);
if (bond.getOtherAtom (this) === otherAtom) return bond;
}
return null;
}, "astex.model.Atom");
Clazz.defineMethod (c$, "getBondedAtom", 
function (nm) {
var bondCount = this.getBondCount ();
for (var i = 0; i < bondCount; i++) {
var otherAtom = this.getBondedAtom (i);
if (otherAtom.getAtomLabel ().equals (nm) && (otherAtom.getInsertionCode () == ' ' || otherAtom.getInsertionCode () == 'A')) {
return otherAtom;
}}
return null;
}, "~S");
Clazz.defineMethod (c$, "hasBond", 
function (otherAtom) {
return this.getBond (otherAtom) != null;
}, "astex.model.Atom");
Clazz.defineMethod (c$, "hasExplicitBond", 
function () {
var bondCount = this.getBondCount ();
for (var b = 0; b < bondCount; b++) {
var bond = this.getBondI (b);
if (bond.isExplicitBond ()) {
return true;
}}
return false;
});
Clazz.defineMethod (c$, "connected13", 
function (targetAtom) {
for (var b1 = 0; b1 < this.getBondCount (); b1++) {
var bond1 = this.getBondI (b1);
var otherAtom = bond1.getOtherAtom (this);
for (var b2 = 0; b2 < otherAtom.getBondCount (); b2++) {
var bond2 = otherAtom.getBondI (b2);
var finalAtom = bond2.getOtherAtom (otherAtom);
if (finalAtom === targetAtom) {
return true;
}}
}
return false;
}, "astex.model.Atom");
Clazz.defineMethod (c$, "connected14", 
function (targetAtom) {
var bondCount = this.getBondCount ();
var targetBondCount = targetAtom.getBondCount ();
for (var b1 = 0; b1 < bondCount; b1++) {
var bond1 = this.getBondI (b1);
var bond1Other = bond1.getOtherAtom (this);
for (var b2 = 0; b2 < targetBondCount; b2++) {
var bond2 = targetAtom.getBondI (b2);
var bond2Other = bond2.getOtherAtom (targetAtom);
if (bond1Other.hasBond (bond2Other)) {
return true;
}}
}
return false;
}, "astex.model.Atom");
Clazz.defineMethod (c$, "connected121314", 
function (otherAtom) {
return (this.hasBond (otherAtom) || this.connected13 (otherAtom) || this.connected14 (otherAtom));
}, "astex.model.Atom");
Clazz.defineMethod (c$, "getBondWithOrder", 
function (bondOrder) {
var bondCount = this.getBondCount ();
for (var b = 0; b < bondCount; b++) {
var bond = this.getBondI (b);
if (bond.getBondOrder () == bondOrder) return bond;
}
return null;
}, "~N");
Clazz.defineMethod (c$, "hasBondWithOrder", 
function (bondOrder) {
return this.getBondWithOrder (bondOrder) != null;
}, "~N");
Clazz.defineMethod (c$, "getBondingRadius", 
function () {
switch (this.getElement ()) {
case 6:
case 7:
case 9:
case 8:
return 0.9;
case 1:
return 0.3;
case 74:
return 1.0;
case 25:
case 0:
return 0.0;
case 26:
return 1.25;
default:
return 1.2;
}
});
Clazz.defineMethod (c$, "getVDWRadius", 
function () {
if (this.radius < 0.0) {
switch (this.getElement ()) {
case 6:
this.radius = 1.88;
break;
case 7:
this.radius = 1.64;
break;
case 8:
this.radius = 1.42;
break;
case 1:
this.radius = 1.05;
break;
case 16:
this.radius = 1.77;
break;
case 15:
this.radius = 1.7;
break;
case 53:
this.radius = 1.98;
break;
case 35:
this.radius = 1.85;
break;
case 17:
this.radius = 1.75;
break;
default:
this.radius = 1.35;
}
}return this.radius;
});
Clazz.defineMethod (c$, "getBiggestDisplayedRadius", 
function () {
var maxRadius = 0.0;
if ((this.attributes & astex.model.Atom.VDWSphere) != 0) {
var r = this.getVDWRadius ();
if (r > maxRadius) {
maxRadius = r;
}}if ((this.attributes & astex.model.Atom.BallAndStick) != 0) {
var r = this.getBallRadius ();
if (r > maxRadius) {
maxRadius = r;
}}if ((this.attributes & astex.model.Atom.Cylinder) != 0) {
var r = this.getBallRadius ();
if (r > maxRadius) {
maxRadius = r;
}}if ((this.attributes & 4194304) != 0) {
if (maxRadius < 0.4) maxRadius = 0.4;
}return maxRadius + 0.05;
});
Clazz.defineMethod (c$, "setVDWRadius", 
function (r) {
this.radius = r;
}, "~N");
Clazz.defineMethod (c$, "setBallRadius", 
function (r) {
this.ballRadius = r;
}, "~N");
Clazz.defineMethod (c$, "getBallRadius", 
function () {
return this.ballRadius;
});
Clazz.defineMethod (c$, "transformToScreen", 
function (m) {
var t = this.getMolecule ().matrix;
this.x = this.xo * t[0] + this.yo * t[3] + this.zo * t[6] + t[9];
this.y = this.xo * t[1] + this.yo * t[4] + this.zo * t[7] + t[10];
this.z = this.xo * t[2] + this.yo * t[5] + this.zo * t[8] + t[11];
var xx = this.x * m.x00 + this.y * m.x10 + this.z * m.x20 + m.x30 + 0.5;
var yy = this.x * m.x01 + this.y * m.x11 + this.z * m.x21 + m.x31 + 0.5;
var zz = this.x * m.x02 + this.y * m.x12 + this.z * m.x22 + m.x32;
this.xs = Clazz.doubleToInt (xx) << 12;
this.ys = Clazz.doubleToInt (yy) << 12;
this.zs = Clazz.doubleToInt ((zz) * (1048576));
}, "astex.util.Matrix");
Clazz.defineMethod (c$, "isAliphaticHydrogen", 
function () {
if (this.getElement () != 1) {
return false;
}if (this.getBondCount () == 1) {
var atom = this.getBondedAtom (0);
if (atom.getElement () == 6) {
return true;
}}return false;
});
Clazz.defineMethod (c$, "isHBondDonor", 
function () {
var name = this.label;
if (this.isSolvent ()) {
return true;
} else if (!this.parentResidue.isStandardAminoAcid ()) {
return false;
} else {
var resname = this.parentResidue.getName ();
if (name.equals ("N")) {
return (!"PRO".equals (resname));
} else if (name.equals ("NE1") && "TRP".equals (resname)) {
return true;
} else if (name.equals ("OG") && "SER".equals (resname)) {
return true;
} else if (name.equals ("OG1") && "THR".equals (resname)) {
return true;
} else if (name.equals ("ND2") && "ASN".equals (resname)) {
return true;
} else if (name.equals ("NE2") && "GLN".equals (resname)) {
return true;
} else if (name.equals ("OH") && "TYR".equals (resname)) {
return true;
} else if (name.equals ("NE1") && "HIS".equals (resname)) {
return true;
} else if ((name.equals ("NE2") || name.equals ("ND1")) && "HIS".equals (resname)) {
return true;
} else if (name.equals ("NZ") && "LYS".equals (resname)) {
return true;
} else if ((name.equals ("NZ") || name.equals ("N2")) && "PYL".equals (resname)) {
return true;
} else if ((name.equals ("NE") || name.equals ("NH1") || name.equals ("NH2")) && "ARG".equals (resname)) {
return true;
} else {
return false;
}}});
Clazz.defineMethod (c$, "isHBondAcceptor", 
function () {
var name = this.label;
if (this.isSolvent ()) {
return true;
} else if (!this.parentResidue.isStandardAminoAcid ()) {
return false;
} else if (name.equals ("O")) {
return true;
} else {
var resname = this.parentResidue.getName ();
if (name.equals ("NE1") && "TRP".equals (resname)) {
return true;
} else if (name.equals ("OG") && "SER".equals (resname)) {
return true;
} else if (name.equals ("OG1") && "THR".equals (resname)) {
return true;
} else if (name.equals ("OD1") && "ASN".equals (resname)) {
return true;
} else if (name.equals ("OE1") && "GLN".equals (resname)) {
return true;
} else if (name.equals ("OH") && "TYR".equals (resname)) {
return true;
} else if (name.equals ("NE1") && "HIS".equals (resname)) {
return true;
} else if ((name.equals ("NE2") || name.equals ("ND1")) && "HIS".equals (resname)) {
return true;
} else if ((name.equals ("OD1") || name.equals ("OD2")) && "ASP".equals (resname)) {
return true;
} else if ((name.equals ("OE1") || name.equals ("OE2")) && "GLU".equals (resname)) {
return true;
} else if ((name.equals ("O2") || name.equals ("N2")) && "PYL".equals (resname)) {
return true;
} else {
return false;
}}});
Clazz.defineMethod (c$, "hasAttributes", 
function () {
return this.attributes != 0;
});
Clazz.defineMethod (c$, "setOrClearAttribute", 
function (attribute, state) {
if (state) {
this.attributes |= attribute;
} else {
this.attributes &= ~attribute;
}}, "~N,~B");
Clazz.defineMethod (c$, "setSolvent", 
function (state) {
this.setOrClearAttribute (astex.model.Atom.Solvent, state);
}, "~B");
Clazz.defineMethod (c$, "isSolvent", 
function () {
return (this.attributes & astex.model.Atom.Solvent) != 0;
});
Clazz.defineMethod (c$, "isBackbone", 
function () {
var res = this.getResidue ();
if (res == null) return false;
if (res.isSolvent ()) return false;
var l = this.getAtomLabel ();
if (res.isStandardAminoAcid () || res.isModifiedAminoAcid ()) {
if (l.equals ("N") || l.equals ("C") || l.equals ("O") || l.equals ("CA")) return true;
} else if (res.isNucleicAcid () || res.isModifiedNucleicAcid ()) {
if (l.equals ("C3'") || l.equals ("C4'") || l.equals ("C5'")) return true;
if (l.equals ("C3*") || l.equals ("C4*") || l.equals ("C5*")) return true;
if (l.equals ("O3'") || l.equals ("O5'") || l.equals ("P")) return true;
if (l.equals ("O3*") || l.equals ("O5*")) return true;
} else if (res.isIon ()) {
return false;
} else {
if (this === res.getAtom (0)) return true;
}return false;
});
Clazz.defineMethod (c$, "isTrace", 
function () {
var res = this.getResidue ();
if (res == null) return false;
if (res.isSolvent ()) return false;
var l = this.getAtomLabel ();
if (res.isStandardAminoAcid () || res.isModifiedAminoAcid ()) {
if (l.equals ("CA")) return true;
} else if (res.isNucleicAcid () || res.isModifiedNucleicAcid ()) {
if (l.equals ("P")) return true;
} else if (res.isIon ()) {
return false;
} else {
return false;
}return false;
});
Clazz.defineMethod (c$, "setCustomLabel", 
function (l) {
this.customLabel = l;
if (this.customLabel == null) {
this.setOrClearAttribute (astex.model.Atom.CustomLabelled, false);
} else {
this.setOrClearAttribute (astex.model.Atom.CustomLabelled, true);
}}, "~S");
Clazz.defineMethod (c$, "getCustomLabel", 
function () {
return this.customLabel;
});
Clazz.defineMethod (c$, "isLabelled", 
function () {
return (this.attributes & astex.model.Atom.Labelled) != 0;
});
Clazz.defineMethod (c$, "setLabelled", 
function (state) {
this.setOrClearAttribute (astex.model.Atom.Labelled, state);
}, "~B");
Clazz.defineMethod (c$, "setSelected", 
function (state) {
this.setOrClearAttribute (astex.model.Atom.Selected, state);
}, "~B");
Clazz.defineMethod (c$, "isSelected", 
function () {
return (this.attributes & astex.model.Atom.Selected) != 0;
});
Clazz.defineMethod (c$, "setHeteroAtom", 
function (state) {
this.setOrClearAttribute (astex.model.Atom.Hetero, state);
}, "~B");
Clazz.defineMethod (c$, "isHeteroAtom", 
function () {
return (this.attributes & astex.model.Atom.Hetero) != 0;
});
Clazz.defineMethod (c$, "setTemporarilySelected", 
function (state) {
this.setOrClearAttribute (astex.model.Atom.TemporarilySelected, state);
}, "~B");
Clazz.defineMethod (c$, "isTemporarilySelected", 
function () {
return (this.attributes & astex.model.Atom.TemporarilySelected) != 0;
});
Clazz.defineMethod (c$, "setVisited", 
function (state) {
this.setOrClearAttribute (astex.model.Atom.Visited, state);
}, "~B");
Clazz.defineMethod (c$, "isVisited", 
function () {
return (this.attributes & astex.model.Atom.Visited) != 0;
});
Clazz.defineMethod (c$, "setWide", 
function (state) {
this.setOrClearAttribute (astex.model.Atom.Wide, state);
}, "~B");
Clazz.defineMethod (c$, "isWide", 
function () {
return (this.attributes & astex.model.Atom.Wide) != 0;
});
Clazz.defineMethod (c$, "setDisplayed", 
function (state) {
this.setOrClearAttribute (astex.model.Atom.Displayed, state);
}, "~B");
Clazz.defineMethod (c$, "isSimpleDisplayed", 
function () {
return (this.attributes & astex.model.Atom.Displayed) != 0;
});
Clazz.defineMethod (c$, "isDisplayed", 
function () {
var mol = this.getMolecule ();
return (mol.getDisplayed () && (this.attributes & astex.model.Atom.DisplayedMask) != 0);
});
Clazz.overrideMethod (c$, "select", 
function (state) {
switch (state) {
case 1:
this.setSelected (true);
break;
case 2:
if (this.isSelected () == false) this.setSelected (true);
break;
case 3:
this.setSelected (false);
break;
}
return this.isSelected () ? 1 : 0;
}, "~N");
Clazz.overrideMethod (c$, "selectStatement", 
function () {
var res = this.getResidue ();
return "id " + this.getId () + " and " + res.selectStatement ();
});
Clazz.defineMethod (c$, "getHybridisation", 
function () {
var bondCount = this.getBondCount ();
for (var b = 0; b < bondCount; b++) {
var bond = this.getBondI (b);
var bondOrder = bond.getBondOrder ();
if (bondOrder == 2) {
return 2;
} else if (bondOrder == 3) {
return 1;
}}
return 3;
});
Clazz.overrideMethod (c$, "toString", 
function () {
if (astex.model.Atom.defaultLongFormat == null) {
astex.model.Atom.defaultLongFormat = astex.util.Settings.getString ("config", "atom.long.format");
if (astex.model.Atom.defaultLongFormat == null) {
astex.model.Atom.defaultLongFormat = "%a%l %R %M%c:%F ID=%i  X=%x Y=%y Z=%z  O=%o B=%b %m";
}}return this.generateLabel (astex.model.Atom.defaultLongFormat);
});
Clazz.defineMethod (c$, "toTupleString", 
function () {
var ic = "" + this.getResidue ().getInsertionCode ();
return this.generateLabel ("%m,%c,%r,") + ic + "," + this.generateLabel ("%R,%a,") + this.getInsertionCode () + this.generateLabel (",%i");
});
Clazz.defineMethod (c$, "$delete", 
function () {
var res = this.getResidue ();
res.removeAtom (this);
var mol = this.getMolecule ();
if (mol != null) {
mol.removeAtom (this);
} else {
System.out.println ("Atom.delete: not in molecule " + this);
}});
Clazz.defineMethod (c$, "removeBond", 
function (b) {
if (this.bonds != null) {
this.bonds.remove (b);
} else {
if (this.firstBond === b) {
this.firstBond = this.secondBond;
this.secondBond = this.thirdBond;
} else if (this.secondBond === b) {
this.secondBond = this.thirdBond;
} else if (this.thirdBond === b) {
this.thirdBond = null;
}}var mol = this.getMolecule ();
mol.removeBond (b);
}, "astex.model.Bond");
Clazz.defineMethod (c$, "removeAllBonds", 
function () {
if (this.bonds != null) {
this.bonds.removeAllElements ();
this.bonds = null;
}this.firstBond = this.secondBond = this.thirdBond = null;
});
Clazz.overrideMethod (c$, "getProperties", 
function () {
var v =  new JU.Lst ();
v.addLast ("x");
v.addLast ("y");
v.addLast ("z");
v.addLast ("b");
v.addLast ("o");
v.addLast ("charge");
v.addLast ("element");
v.addLast ("color");
v.addLast ("opacity");
v.addLast ("radius");
return java.util.Collections.enumeration (v);
});
Clazz.defineMethod (c$, "get", 
function (key, def) {
var val = null;
if (key.equals ("x")) val =  new Double (this.getAttribute (0));
 else if (key.equals ("y")) val =  new Double (this.getAttribute (1));
 else if (key.equals ("z")) val =  new Double (this.getAttribute (2));
 else if (key.equals ("b")) val =  new Double (this.getAttribute (3));
 else if (key.equals ("o")) val =  new Double (this.getAttribute (4));
 else if (key.equals ("charge")) val =  new Double (this.getAttribute (6));
 else if (key.equals ("element")) val =  new Integer (this.element);
 else if (key.equals ("color")) val =  new java.awt.Color (this.getColor ());
 else if (key.equals ("radius")) val =  new Double (this.getVDWRadius ());
 else if (key.equals ("opacity")) val =  new Integer (this.transparency);
 else {
if (this.properties != null) {
val = this.properties.get (key);
}}return val == null ? def : val;
}, "~O,~O");
Clazz.overrideMethod (c$, "setValue", 
function (key, value) {
if (key.equals ("x")) this.x = (value).doubleValue ();
 else if (key.equals ("y")) this.y = (value).doubleValue ();
 else if (key.equals ("z")) this.z = (value).doubleValue ();
 else if (key.equals ("b")) this.bFactor = (value).doubleValue ();
 else if (key.equals ("o")) this.occupancy = (value).doubleValue ();
 else if (key.equals ("charge")) this.partialCharge = (value).doubleValue ();
 else if (key.equals ("radius")) this.radius = (value).doubleValue ();
 else if (key.equals ("element")) this.element = (value).intValue ();
 else if (key.equals ("color")) this.setColor ((value).getRGB ());
 else if (key.equals ("opacity")) this.transparency = (value).intValue ();
 else {
if (this.properties == null) {
this.properties =  new java.util.Hashtable ();
}if (value == null) {
this.properties.remove (key);
} else {
this.properties.put (key, value);
}}return null;
}, "~O,~O");
Clazz.overrideMethod (c$, "getClassname", 
function () {
return this.getClass ().getName ();
});
Clazz.overrideMethod (c$, "setClassname", 
function (classname) {
}, "~S");
Clazz.overrideMethod (c$, "getParents", 
function (type) {
return null;
}, "~O");
Clazz.overrideMethod (c$, "addParent", 
function (parent) {
}, "astex.generic.GenericInterface");
Clazz.overrideMethod (c$, "removeParent", 
function (parent) {
}, "astex.generic.GenericInterface");
Clazz.overrideMethod (c$, "getChildren", 
function (type) {
return null;
}, "~O");
Clazz.overrideMethod (c$, "addChild", 
function (child) {
}, "astex.generic.GenericInterface");
Clazz.overrideMethod (c$, "removeChild", 
function (child) {
}, "astex.generic.GenericInterface");
Clazz.overrideMethod (c$, "addListener", 
function (geh) {
}, "astex.generic.GenericEventInterface");
Clazz.overrideMethod (c$, "removeListener", 
function (geh) {
}, "astex.generic.GenericEventInterface");
Clazz.defineStatics (c$,
"Undefined", -1,
"Solvent", 0x1,
"Labelled", 0x2,
"Selected", 0x4,
"Hetero", 0x8,
"TemporarilySelected", 0x10,
"Visited", 0x20,
"Displayed", 0x40,
"Wide", 0x80,
"VDWSphere", 0x100,
"Surface", 0x200,
"SurfaceContext", 0x400,
"Property", 0x800,
"BallAndStick", 0x1000,
"Cylinder", 0x2000,
"CustomLabelled", 0x4000,
"ModellingActive", 0x8000,
"ModellingEnvironment", 0x10000,
"ModellingXray", 0x20000,
"ModellingFixed", 0x40000,
"NameLeftJustified", 0x80000,
"Aromatic", 0x100000,
"Ring", 0x200000,
"HairCross", 0x400000);
c$.DisplayedMask = c$.prototype.DisplayedMask = astex.model.Atom.Displayed | astex.model.Atom.Cylinder | astex.model.Atom.BallAndStick | astex.model.Atom.VDWSphere | 4194304;
Clazz.defineStatics (c$,
"X", 0,
"Y", 1,
"Z", 2,
"B", 3,
"O", 4,
"ID", 5,
"Q", 6,
"E", 7);
c$.selectedColor = c$.prototype.selectedColor = astex.util.Color32.yellow;
Clazz.defineStatics (c$,
"defaultBallRadius", 0.3,
"sp3", 3,
"sp2", 2,
"sp", 1,
"MaxAtomCacheSize", 2048);
c$.atomCache = c$.prototype.atomCache =  new astex.util.DynamicArray ().set (2048, 0);
Clazz.defineStatics (c$,
"atomsCreated", 0,
"atomsCached", 0,
"defaultLongFormat", null,
"XAttribute", "x",
"YAttribute", "y",
"ZAttribute", "z",
"BAttribute", "b",
"OAttribute", "o",
"QAttribute", "charge",
"Color", "color",
"Radius", "radius",
"Opacity", "opacity",
"Element", "element");
});
