Clazz.declarePackage ("astex.util");
Clazz.load (null, "astex.util.Improper", ["astex.util.Point3d"], function () {
c$ = Clazz.decorateAsClass (function () {
this.firstAtom = null;
this.secondAtom = null;
this.thirdAtom = null;
this.fourthAtom = null;
this.idealImproperAngle = 0.0;
this.idealImproperAngleAssigned = false;
Clazz.instantialize (this, arguments);
}, astex.util, "Improper");
Clazz.makeConstructor (c$, 
 function () {
this.initialise ();
});
Clazz.defineMethod (c$, "initialise", 
 function () {
});
c$.create = Clazz.defineMethod (c$, "create", 
function () {
return  new astex.util.Improper ();
});
Clazz.defineMethod (c$, "setFirstAtom", 
function (atom) {
this.firstAtom = atom;
}, "astex.model.Atom");
Clazz.defineMethod (c$, "setSecondAtom", 
function (atom) {
this.secondAtom = atom;
}, "astex.model.Atom");
Clazz.defineMethod (c$, "setThirdAtom", 
function (atom) {
this.thirdAtom = atom;
}, "astex.model.Atom");
Clazz.defineMethod (c$, "setFourthAtom", 
function (atom) {
this.fourthAtom = atom;
}, "astex.model.Atom");
Clazz.defineMethod (c$, "getFirstAtom", 
function () {
return this.firstAtom;
});
Clazz.defineMethod (c$, "getSecondAtom", 
function () {
return this.secondAtom;
});
Clazz.defineMethod (c$, "getThirdAtom", 
function () {
return this.thirdAtom;
});
Clazz.defineMethod (c$, "getFourthAtom", 
function () {
return this.fourthAtom;
});
Clazz.defineMethod (c$, "getAtom", 
function (index) {
if (index == 0) {
return this.firstAtom;
} else if (index == 1) {
return this.secondAtom;
} else if (index == 2) {
return this.thirdAtom;
} else if (index == 3) {
return this.fourthAtom;
} else {
return null;
}}, "~N");
Clazz.defineMethod (c$, "setIdealImproperAngle", 
function (d) {
this.idealImproperAngle = d;
}, "~N");
Clazz.defineMethod (c$, "getIdealImproperAngle", 
function () {
if (this.idealImproperAngleAssigned == false) {
this.idealImproperAngle = astex.util.Point3d.torsionP (this.firstAtom, this.secondAtom, this.thirdAtom, this.fourthAtom);
this.idealImproperAngleAssigned = true;
}return this.idealImproperAngle;
});
});
