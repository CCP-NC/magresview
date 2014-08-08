Clazz.declarePackage ("astex.model");
Clazz.load (null, "astex.model.Angle", ["astex.util.Point3d"], function () {
c$ = Clazz.decorateAsClass (function () {
this.firstAtom = null;
this.secondAtom = null;
this.thirdAtom = null;
this.idealBondAngle = -1.0;
Clazz.instantialize (this, arguments);
}, astex.model, "Angle");
Clazz.makeConstructor (c$, 
 function () {
this.initialise ();
});
Clazz.defineMethod (c$, "initialise", 
 function () {
});
c$.create = Clazz.defineMethod (c$, "create", 
function () {
return  new astex.model.Angle ();
});
Clazz.defineMethod (c$, "setFirstAtom", 
function (newFirstAtom) {
this.firstAtom = newFirstAtom;
}, "astex.model.Atom");
Clazz.defineMethod (c$, "setSecondAtom", 
function (newSecondAtom) {
this.secondAtom = newSecondAtom;
}, "astex.model.Atom");
Clazz.defineMethod (c$, "setThirdAtom", 
function (newThirdAtom) {
this.thirdAtom = newThirdAtom;
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
Clazz.defineMethod (c$, "getAtom", 
function (index) {
if (index == 0) {
return this.firstAtom;
} else if (index == 1) {
return this.secondAtom;
} else if (index == 2) {
return this.thirdAtom;
} else {
return null;
}}, "~N");
Clazz.defineMethod (c$, "setIdealBondAngle", 
function (d) {
this.idealBondAngle = d;
}, "~N");
Clazz.defineMethod (c$, "getIdealBondAngle", 
function () {
if (this.idealBondAngle < 0.0) {
this.idealBondAngle = astex.util.Point3d.angle (this.firstAtom, this.secondAtom, this.thirdAtom);
}return this.idealBondAngle;
});
});
