Clazz.declarePackage ("astex.model");
Clazz.load (["astex.generic.Generic"], "astex.model.Bond", ["astex.util.Color32", "$.Point3d", "java.util.Collections", "JU.Lst"], function () {
c$ = Clazz.decorateAsClass (function () {
this.firstAtom = null;
this.secondAtom = null;
this.bondOrder = 0;
this.radii = null;
this.idealBondLength = -1.0;
this.attributes = 0;
this.bondColor = 0;
Clazz.instantialize (this, arguments);
}, astex.model, "Bond", astex.generic.Generic);
Clazz.prepareFields (c$, function () {
this.radii =  Clazz.newByteArray (4, 0);
});
Clazz.makeConstructor (c$, 
 function () {
Clazz.superConstructor (this, astex.model.Bond, []);
this.initialise ();
});
Clazz.overrideMethod (c$, "getClassname", 
function () {
return this.getClass ().getName ();
});
Clazz.defineMethod (c$, "initialise", 
 function () {
this.setBondOrder (1);
this.setBondColor (astex.util.Color32.white);
this.setBondWidth (1);
this.setStickWidth (0.12);
this.setCylinderWidth (0.15);
this.attributes = 0;
});
Clazz.overrideMethod (c$, "setValue", 
function (key, property) {
var name = key;
if (name.equals ("bondorder")) {
this.setBondOrder ((property).intValue ());
} else {
this.setValueGeneric (key, property);
}return null;
}, "~O,~O");
Clazz.overrideMethod (c$, "get", 
function (key, def) {
return (key.equals ("bondorder") ?  new Integer (this.getBondOrder ()) : this.get2 (key, def));
}, "~O,~O");
Clazz.overrideMethod (c$, "getProperties", 
function () {
var v =  new JU.Lst ();
v.addLast ("bondorder");
return java.util.Collections.enumeration (v);
});
Clazz.defineMethod (c$, "isExplicitBond", 
function () {
return (this.attributes & astex.model.Bond.ExplicitBond) != 0;
});
Clazz.defineMethod (c$, "setExplicitBond", 
function (e) {
if (e) {
this.attributes |= astex.model.Bond.ExplicitBond;
} else {
this.attributes &= ~astex.model.Bond.ExplicitBond;
}}, "~B");
Clazz.defineMethod (c$, "getBondWidth", 
function () {
return this.radii[0];
});
Clazz.defineMethod (c$, "setBondWidth", 
function (v) {
this.radii[0] = v;
}, "~N");
Clazz.defineMethod (c$, "getStickWidth", 
function () {
return this.radii[1] * 0.015625;
});
Clazz.defineMethod (c$, "setStickWidth", 
function (v) {
this.radii[1] = Clazz.doubleToByte (v / 0.015625);
}, "~N");
Clazz.defineMethod (c$, "getCylinderWidth", 
function () {
return this.radii[2] * 0.015625;
});
Clazz.defineMethod (c$, "setCylinderWidth", 
function (v) {
this.radii[2] = Clazz.doubleToByte (v / 0.015625);
}, "~N");
Clazz.defineMethod (c$, "getBondColor", 
function () {
return this.bondColor;
});
Clazz.defineMethod (c$, "setBondColor", 
function (v) {
this.bondColor = v;
}, "~N");
Clazz.defineMethod (c$, "setWideBond", 
function (wide) {
if (wide) {
this.attributes |= astex.model.Bond.wideBond;
} else {
this.attributes &= ~astex.model.Bond.wideBond;
}}, "~B");
Clazz.defineMethod (c$, "setRingBond", 
function (ring) {
if (ring) {
this.attributes |= astex.model.Bond.ringBond;
} else {
this.attributes &= ~astex.model.Bond.ringBond;
}}, "~B");
Clazz.defineMethod (c$, "isWideBond", 
function () {
if (this.firstAtom.isWide () && this.secondAtom.isWide ()) {
return true;
}return false;
});
Clazz.defineMethod (c$, "isRingBond", 
function () {
return (this.attributes & astex.model.Bond.ringBond) != 0;
});
Clazz.defineMethod (c$, "setBondOrder", 
function (order) {
this.bondOrder = order;
}, "~N");
Clazz.defineMethod (c$, "getBondOrder", 
function () {
return this.bondOrder;
});
Clazz.defineMethod (c$, "isQueryBond", 
function () {
var order = this.getBondOrder ();
return (order > 3 && order <= 9);
});
c$.create = Clazz.defineMethod (c$, "create", 
function () {
return  new astex.model.Bond ();
});
Clazz.defineMethod (c$, "setFirstAtom", 
function (newFirstAtom) {
this.firstAtom = newFirstAtom;
}, "astex.model.Atom");
Clazz.defineMethod (c$, "setSecondAtom", 
function (newSecondAtom) {
this.secondAtom = newSecondAtom;
}, "astex.model.Atom");
Clazz.defineMethod (c$, "getFirstAtom", 
function () {
return this.firstAtom;
});
Clazz.defineMethod (c$, "getSecondAtom", 
function () {
return this.secondAtom;
});
Clazz.defineMethod (c$, "getAtom", 
function (index) {
switch (index) {
case 0:
return this.firstAtom;
case 1:
return this.secondAtom;
default:
return null;
}
}, "~N");
Clazz.defineMethod (c$, "getOtherAtom", 
function (knownAtom) {
return (knownAtom === this.firstAtom ? this.secondAtom : knownAtom === this.secondAtom ? this.firstAtom : null);
}, "astex.model.Atom");
Clazz.defineMethod (c$, "getBondSymbol", 
function () {
switch (this.getBondOrder ()) {
case 1:
return "-";
case 2:
return "=";
case 3:
return "#";
case 4:
return ":";
default:
return "-";
}
});
Clazz.defineMethod (c$, "isTerminalBond", 
function () {
var a = this.getFirstAtom ();
return (a.getBondCount () == 1 || (a = this.getSecondAtom ()).getBondCount () == 1);
});
Clazz.defineMethod (c$, "isNonRotatable", 
function () {
var bondOrder = this.getBondOrder ();
return (bondOrder == 2 || bondOrder == 4);
});
Clazz.defineMethod (c$, "setIdealBondLength", 
function (d) {
this.idealBondLength = d;
}, "~N");
Clazz.defineMethod (c$, "getIdealBondLength", 
function () {
if (this.idealBondLength < 0.0) {
this.idealBondLength = this.firstAtom.distance (this.secondAtom);
}return this.idealBondLength;
});
Clazz.defineMethod (c$, "getBondLength", 
function () {
return (this.firstAtom == null || this.secondAtom == null ? -1 : this.firstAtom.distance (this.secondAtom));
});
Clazz.overrideMethod (c$, "toString", 
function () {
var firstAtom = this.getFirstAtom ();
var secondAtom = this.getSecondAtom ();
var firstId = firstAtom.getId ();
var secondId = secondAtom.getId ();
return firstAtom.getAtomSymbol () + firstId + this.getBondSymbol () + secondAtom.getAtomSymbol () + secondId;
});
Clazz.defineMethod (c$, "getUnitVector", 
function () {
return astex.util.Point3d.unitVectorP2 (this.getFirstAtom (), this.getSecondAtom ());
});
Clazz.defineMethod (c$, "$delete", 
function () {
this.firstAtom.removeBond (this);
this.secondAtom.removeBond (this);
this.firstAtom = null;
this.secondAtom = null;
});
Clazz.defineStatics (c$,
"BondOrder", "bondorder",
"SingleBond", 1,
"DoubleBond", 2,
"TripleBond", 3,
"AromaticBond", 4,
"AmideBond", 5,
"SingleOrDoubleBond", 6,
"SingleOrAromaticBond", 7,
"DoubleOrAromaticBond", 8,
"AnyBond", 9,
"bondScale", 0.015625,
"wideBond", 1,
"ringBond", 2,
"ExplicitBond", 4);
});
