Clazz.declarePackage ("astex.render");
c$ = Clazz.decorateAsClass (function () {
this.x = 0;
this.y = 0;
this.z = 0;
this.nx = 0;
this.ny = 0;
this.u = 0;
this.v = 0;
this.r = 0;
this.g = 0;
this.b = 0;
Clazz.instantialize (this, arguments);
}, astex.render, "Vertex");
Clazz.makeConstructor (c$, 
function () {
});
