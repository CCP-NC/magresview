Clazz.declarePackage ("astex.anasurface");
Clazz.load (["astex.util.DynamicArray"], "astex.anasurface.Torus", null, function () {
c$ = Clazz.decorateAsClass (function () {
this.i = 0;
this.j = 0;
this.tij = null;
this.uij = null;
this.cij = null;
this.cji = null;
this.rcij = 0.0;
this.rcji = 0.0;
this.rij = 0.0;
this.uijnorm = null;
this.uijnorm2 = null;
this.probes = null;
this.faces = null;
this.edges = null;
this.selfIntersects = false;
Clazz.instantialize (this, arguments);
}, astex.anasurface, "Torus");
Clazz.prepareFields (c$, function () {
this.tij =  Clazz.newDoubleArray (3, 0);
this.uij =  Clazz.newDoubleArray (3, 0);
this.cij =  Clazz.newDoubleArray (3, 0);
this.cji =  Clazz.newDoubleArray (3, 0);
this.uijnorm =  Clazz.newDoubleArray (3, 0);
this.uijnorm2 =  Clazz.newDoubleArray (3, 0);
this.probes =  new astex.util.DynamicArray ().set (2, 0);
this.faces =  new astex.util.DynamicArray ().set (10, 0);
this.edges =  new astex.util.DynamicArray ().set (10, 0);
});
Clazz.makeConstructor (c$, 
function (ai, aj) {
this.i = ai;
this.j = aj;
}, "~N,~N");
});
