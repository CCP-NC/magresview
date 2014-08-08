Clazz.declarePackage ("astex.api");
Clazz.load (null, "astex.api.Interface", ["astex.util.Logger"], function () {
c$ = Clazz.declareType (astex.api, "Interface");
c$.getInterface = Clazz.defineMethod (c$, "getInterface", 
function (name) {
try {
var x = Clazz._4Name (name);
return (x == null ? null : x.newInstance ());
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
astex.util.Logger.error ("Interface.java Error creating instance for " + name + ": \n" + e);
return null;
} else {
throw e;
}
}
}, "~S");
c$.getOption = Clazz.defineMethod (c$, "getOption", 
function (className) {
return astex.api.Interface.getInterface ("astex." + className);
}, "~S");
c$.getUtil = Clazz.defineMethod (c$, "getUtil", 
function (name) {
return astex.api.Interface.getInterface ("astex.util." + name);
}, "~S");
});
