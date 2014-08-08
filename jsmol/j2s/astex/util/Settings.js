Clazz.declarePackage ("astex.util");
Clazz.load (["java.util.Hashtable"], "astex.util.Settings", ["astex.io.FILE", "astex.util.Log", "$.Properties", "java.lang.Boolean", "$.Double"], function () {
c$ = Clazz.declareType (astex.util, "Settings");
c$.get = Clazz.defineMethod (c$, "get", 
function (table, property) {
var properties = astex.util.Settings.propertyObjects.get (table);
if (properties == null) {
var resource = table + ".properties";
properties = astex.io.FILE.loadProperties (resource);
if (properties == null) {
astex.util.Log.error ("couldn't load " + table);
properties =  new astex.util.Properties ();
}}astex.util.Settings.propertyObjects.put (table, properties);
var object = properties.get (property);
return (object == null ? null : object);
}, "~S,~S");
c$.get = Clazz.defineMethod (c$, "get", 
function (table, property, defaultVal) {
var object = astex.util.Settings.get (table, property);
return (object == null ? defaultVal : object);
}, "~S,~S,~O");
c$.getDouble = Clazz.defineMethod (c$, "getDouble", 
function (table, argument) {
return astex.util.Settings.getDouble (table, argument, 0.0);
}, "~S,~S");
c$.getDouble = Clazz.defineMethod (c$, "getDouble", 
function (table, argument, defaultVal) {
var o = astex.util.Settings.get (table, argument);
if (o == null) return defaultVal;
try {
return Double.$valueOf (o).doubleValue ();
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
astex.util.Log.error (table + "," + argument + " not a double");
return defaultVal;
} else {
throw e;
}
}
}, "~S,~S,~N");
c$.getInteger = Clazz.defineMethod (c$, "getInteger", 
function (table, argument) {
return astex.util.Settings.getInteger (table, argument, 0);
}, "~S,~S");
c$.getInteger = Clazz.defineMethod (c$, "getInteger", 
function (table, argument, defaultVal) {
var o = astex.util.Settings.get (table, argument);
if (o == null) return defaultVal;
try {
return Integer.$valueOf (o).intValue ();
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
astex.util.Log.error (table + "," + argument + " not an integer");
return defaultVal;
} else {
throw e;
}
}
}, "~S,~S,~N");
c$.getString = Clazz.defineMethod (c$, "getString", 
function (table, argument) {
return astex.util.Settings.getString (table, argument, null);
}, "~S,~S");
c$.getString = Clazz.defineMethod (c$, "getString", 
function (table, argument, defaultVal) {
var o = astex.util.Settings.get (table, argument);
return (o == null ? defaultVal : o);
}, "~S,~S,~S");
c$.getBoolean = Clazz.defineMethod (c$, "getBoolean", 
function (table, argument) {
return astex.util.Settings.getBoolean (table, argument, false);
}, "~S,~S");
c$.getBoolean = Clazz.defineMethod (c$, "getBoolean", 
function (table, argument, defaultVal) {
var o = astex.util.Settings.get (table, argument);
if (o == null) return defaultVal;
try {
return Boolean.$valueOf (o).booleanValue ();
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
astex.util.Log.error (table + "," + argument + " not a boolean");
return defaultVal;
} else {
throw e;
}
}
}, "~S,~S,~B");
c$.main = Clazz.defineMethod (c$, "main", 
function (args) {
System.out.println ("thinlet    " + astex.util.Settings.getString ("thinlet", "astex.Distance.mode"));
System.out.println ("hb    " + astex.util.Settings.getDouble ("config", "hbond.constant"));
System.out.println ("gecko " + astex.util.Settings.getDouble ("config", "hbond.gecko"));
System.out.println ("log " + astex.util.Settings.getBoolean ("config", "log"));
System.out.println ("fragment.1 " + astex.util.Settings.getString ("fragment", "fragment.1"));
}, "~A");
c$.propertyObjects = c$.prototype.propertyObjects =  new java.util.Hashtable ();
});
