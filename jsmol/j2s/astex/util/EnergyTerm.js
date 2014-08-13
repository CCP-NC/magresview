Clazz.declarePackage ("astex.util");
Clazz.load (["astex.util.DynamicArray"], "astex.util.EnergyTerm", null, function () {
c$ = Clazz.decorateAsClass (function () {
this.targetValue = 0.0;
this.forceConstant = 10.0;
this.affectedAtoms = null;
this.signalAtoms = null;
this.constrained = false;
Clazz.instantialize (this, arguments);
}, astex.util, "EnergyTerm", astex.util.DynamicArray);
});
