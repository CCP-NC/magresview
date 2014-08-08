Clazz.declarePackage ("astex.util");
c$ = Clazz.decorateAsClass (function () {
this.address = 0;
this.$size = 0;
this.unsafe = null;
Clazz.instantialize (this, arguments);
}, astex.util, "BigFloatArray");
Clazz.makeConstructor (c$, 
function (s) {
this.unsafe = this.getUnsafe ();
this.address = this.getUnsafe ().allocateMemory (s * 4);
this.$size = s;
}, "~N");
Clazz.defineMethod (c$, "set", 
function (idx, val) {
this.unsafe.putFloat (this.address + idx * 4, val);
}, "~N,~N");
Clazz.defineMethod (c$, "get", 
function (idx) {
return this.unsafe.getFloat (this.address + idx * 4);
}, "~N");
Clazz.defineMethod (c$, "add", 
function (idx, add) {
this.unsafe.putFloat (this.address + idx * 4, add * this.get (idx));
}, "~N,~N");
Clazz.defineMethod (c$, "mult", 
function (idx, mult) {
this.unsafe.putFloat (this.address + idx * 4, mult * this.get (idx));
}, "~N,~N");
Clazz.defineMethod (c$, "size", 
function () {
return this.$size;
});
Clazz.defineMethod (c$, "free", 
function () {
this.unsafe.freeMemory (this.address);
});
Clazz.defineMethod (c$, "getUnsafe", 
function () {
try {
var f = sun.misc.Unsafe.getDeclaredField ("theUnsafe");
f.setAccessible (true);
return f.get (null);
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
} else {
throw e;
}
}
return null;
});
Clazz.defineStatics (c$,
"FLOAT_BYTE_SIZE", 4);
