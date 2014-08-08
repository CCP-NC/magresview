Clazz.declarePackage ("astex.util");
Clazz.load (null, "astex.util.BigByteArray", ["sun.misc.Unsafe"], function () {
c$ = Clazz.decorateAsClass (function () {
this.address = 0;
this.$size = 0;
this.unsafe = null;
Clazz.instantialize (this, arguments);
}, astex.util, "BigByteArray");
Clazz.defineMethod (c$, "set", 
function (idx, val) {
this.unsafe.putFloat (this.address + idx * 1, val);
}, "~N,~N");
Clazz.defineMethod (c$, "get", 
function (idx) {
return this.unsafe.getByte (this.address + idx * 1);
}, "~N");
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
"BYTE_SIZE", 1);
});
