Clazz.declarePackage ("astex.anasurface");
c$ = Clazz.decorateAsClass (function () {
this.x = null;
this.i = 0;
this.vi = 0;
Clazz.instantialize (this, arguments);
}, astex.anasurface, "Vertex");
Clazz.prepareFields (c$, function () {
this.x =  Clazz.newDoubleArray (3, 0);
});
