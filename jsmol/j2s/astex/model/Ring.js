Clazz.declarePackage ("astex.model");
Clazz.load (["astex.generic.Generic", "astex.util.DynamicArray"], "astex.model.Ring", ["astex.util.Point3d"], function () {
c$ = Clazz.decorateAsClass (function () {
this.atoms = null;
this.bonds = null;
Clazz.instantialize (this, arguments);
}, astex.model, "Ring", astex.generic.Generic);
Clazz.prepareFields (c$, function () {
this.atoms =  new astex.util.DynamicArray ().set (6, 1);
this.bonds =  new astex.util.DynamicArray ().set (6, 1);
});
Clazz.makeConstructor (c$, 
 function () {
Clazz.superConstructor (this, astex.model.Ring, []);
this.initialise ();
});
Clazz.defineMethod (c$, "initialise", 
 function () {
this.atoms.removeAllElements ();
this.bonds.removeAllElements ();
});
c$.create = Clazz.defineMethod (c$, "create", 
function () {
return  new astex.model.Ring ();
});
Clazz.defineMethod (c$, "addAtom", 
function (a) {
this.atoms.add (a);
}, "astex.model.Atom");
Clazz.defineMethod (c$, "addBond", 
function (b) {
this.bonds.add (b);
}, "astex.model.Bond");
Clazz.defineMethod (c$, "getAtom", 
function (index) {
return this.atoms.get (index);
}, "~N");
Clazz.defineMethod (c$, "getBond", 
function (index) {
return this.bonds.get (index);
}, "~N");
Clazz.defineMethod (c$, "getAtomCount", 
function () {
return this.atoms.size ();
});
Clazz.defineMethod (c$, "getBondCount", 
function () {
return this.bonds.size ();
});
Clazz.defineMethod (c$, "contains", 
function (queryAtom) {
var atomCount = this.getAtomCount ();
for (var i = 0; i < atomCount; i++) {
var atom = this.getAtom (i);
if (atom === queryAtom) {
return true;
}}
return false;
}, "astex.model.Atom");
Clazz.defineMethod (c$, "contains", 
function (queryBond) {
var bondCount = this.getBondCount ();
for (var i = 0; i < bondCount; i++) {
var bond = this.getBond (i);
if (bond === queryBond) {
return true;
}}
return false;
}, "astex.model.Bond");
Clazz.defineMethod (c$, "getAtomIndex", 
function (queryAtom) {
var atomCount = this.getAtomCount ();
for (var a = 0; a < atomCount; a++) {
var atom = this.getAtom (a);
if (atom === queryAtom) {
return a;
}}
return -1;
}, "astex.model.Atom");
Clazz.defineMethod (c$, "isPlanar", 
function () {
if (this.isAromatic ()) {
return true;
}var bondCount = this.getBondCount ();
if (bondCount == 4) {
for (var i = 0; i < bondCount; i++) {
var bond = this.getBond (i);
if (bond.isNonRotatable ()) {
return true;
}}
}return false;
});
Clazz.defineMethod (c$, "isAromatic", 
function () {
var atomCount = this.getAtomCount ();
if (atomCount < 5 || atomCount > 6) {
return false;
}var bondCount = this.getBondCount ();
var allAromatic = true;
for (var i = 0; i < bondCount; i++) {
var bond = this.getBond (i);
if (bond.getBondOrder () != 4) {
allAromatic = false;
break;
}}
if (allAromatic) {
return true;
}var heteroAtomCount = 0;
for (var i = 0; i < atomCount; i++) {
var atom = this.getAtom (i);
if (atom.getElement () != 6) {
heteroAtomCount++;
}}
if (bondCount == 6) {
allAromatic = true;
for (var i = 0; i < bondCount; i++) {
var bond = this.getBond (i);
var nextBond = this.getBond (i == bondCount - 1 ? 0 : i + 1);
var bondOrder = bond.getBondOrder ();
var nextBondOrder = nextBond.getBondOrder ();
if ((bondOrder == 1 && nextBondOrder == 2) || (nextBondOrder == 1 && bondOrder == 2)) {
continue;
}allAromatic = false;
break;
}
if (allAromatic) {
return true;
}} else if (atomCount == 5) {
var doubleBondCount = 0;
for (var i = 0; i < bondCount; i++) {
var bond = this.getBond (i);
if (bond.getBondOrder () == 2) {
doubleBondCount++;
}}
if (heteroAtomCount > 0 && doubleBondCount > 1) {
return true;
}}return false;
});
Clazz.defineMethod (c$, "getRingCenter", 
function () {
var center =  new astex.util.Point3d ();
var atomCount = this.getAtomCount ();
if (atomCount > 0) {
for (var i = 0; i < atomCount; i++) {
var atom = this.getAtom (i);
center.add (atom);
}
center.scale (1. / atomCount);
}return center;
});
});
