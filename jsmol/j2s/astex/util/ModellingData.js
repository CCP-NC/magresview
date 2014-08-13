Clazz.declarePackage ("astex.util");
Clazz.load (["astex.util.Point3d"], "astex.util.ModellingData", null, function () {
c$ = Clazz.decorateAsClass (function () {
this.gradient = null;
this.energy = 0.0;
this.radius = -1.0;
Clazz.instantialize (this, arguments);
}, astex.util, "ModellingData");
Clazz.prepareFields (c$, function () {
this.gradient =  new astex.util.Point3d ();
});
});
