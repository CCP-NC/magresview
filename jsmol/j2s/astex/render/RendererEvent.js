Clazz.declarePackage ("astex.render");
c$ = Clazz.decorateAsClass (function () {
this.type = 0;
this.item = null;
Clazz.instantialize (this, arguments);
}, astex.render, "RendererEvent");
Clazz.makeConstructor (c$, 
function (t, o) {
this.type = t;
this.item = o;
}, "~N,~O");
Clazz.defineMethod (c$, "getType", 
function () {
return this.type;
});
Clazz.defineMethod (c$, "setType", 
function (v) {
this.type = v;
}, "~N");
Clazz.defineMethod (c$, "getItem", 
function () {
return this.item;
});
Clazz.defineMethod (c$, "setItem", 
function (v) {
this.item = v;
}, "~O");
Clazz.defineStatics (c$,
"ObjectAdded", 1,
"ObjectRemoved", 2,
"FrontClipMoved", 3,
"BackClipMoved", 4);
