Clazz.declarePackage ("astex.util");
Clazz.load (["java.util.Hashtable"], "astex.util.Arguments", ["astex.io.FILE", "astex.util.Color32", "java.lang.Boolean", "$.Double"], function () {
c$ = Clazz.declareType (astex.util, "Arguments", java.util.Hashtable);
c$.addDash = Clazz.defineMethod (c$, "addDash", 
function (argument) {
return (argument == null || argument.startsWith ("-") ? argument : "-" + argument);
}, "~S");
Clazz.defineMethod (c$, "defined", 
function (argument) {
return (this.get (astex.util.Arguments.addDash (argument)) != null);
}, "~S");
Clazz.defineMethod (c$, "getDouble", 
function (argument, defaultVal) {
argument = astex.util.Arguments.addDash (argument);
var o = this.get (argument);
if (o == null) {
var value = astex.util.Arguments.propertyGet (argument);
if (value != null) {
return astex.io.FILE.readDouble (value);
}}if (o == null) return defaultVal;
if (Clazz.instanceOf (o, Double)) return (o).doubleValue ();
if (Clazz.instanceOf (o, Integer)) return (o).intValue ();
if (Clazz.instanceOf (o, String)) {
try {
var s = o;
return Double.parseDouble (s);
} catch (e) {
if (Clazz.exceptionOf (e, NumberFormatException)) {
System.out.print ("getDouble " + argument);
System.out.println (": not a double");
return defaultVal;
} else {
throw e;
}
}
}System.out.print ("getDouble " + argument);
System.out.println (": not a double");
return defaultVal;
}, "~S,~N");
Clazz.defineMethod (c$, "getInteger", 
function (argument, defaultVal) {
argument = astex.util.Arguments.addDash (argument);
var o = this.get (argument);
if (o == null) {
var value = astex.util.Arguments.propertyGet (argument);
if (value != null) {
return astex.io.FILE.readInteger (value);
}}if (o == null) return defaultVal;
if (Clazz.instanceOf (o, Integer)) return (o).intValue ();
System.out.print ("getInteger " + argument);
System.out.println (": not an integer");
return defaultVal;
}, "~S,~N");
Clazz.defineMethod (c$, "getString", 
function (argument, defaultVal) {
argument = astex.util.Arguments.addDash (argument);
var o = this.get (argument);
if (o == null) o = astex.util.Arguments.propertyGet (argument);
if (o == null) return defaultVal;
if (Clazz.instanceOf (o, String)) return o;
System.out.print ("getString " + argument);
System.out.println (": not a String");
System.out.println ("value " + o);
return defaultVal;
}, "~S,~S");
Clazz.defineMethod (c$, "getColor", 
function (argument, defaultVal) {
var o = this.getString (argument, null);
if (o == null) return defaultVal;
return astex.util.Color32.getColorFromName (o);
}, "~S,~N");
Clazz.defineMethod (c$, "getBoolean", 
function (argument, defaultVal) {
argument = astex.util.Arguments.addDash (argument);
var o = this.get (argument);
if (o == null) o = astex.util.Arguments.propertyGet (argument);
if (o == null) return defaultVal;
if (Clazz.instanceOf (o, Boolean)) return (o).booleanValue ();
System.out.print ("getBoolean " + argument);
System.out.println (": not a Boolean");
return defaultVal;
}, "~S,~B");
Clazz.defineMethod (c$, "getStringOption", 
function (argument, possibles, possibleValues, defaultValue) {
var value = this.getString (argument, null);
if (value == null) value = astex.util.Arguments.propertyGet (argument);
if (value == null) return defaultValue;
for (var i = 0; i < possibles.length; i++) if (value.equals (possibles[i])) return (possibleValues == null ? i : possibleValues[i]);

System.out.println ("getStringOption: illegal value for " + argument);
System.out.println ("getStringOption: value was " + value);
System.out.print ("getStringOption: possible values: ");
for (var i = 0; i < possibles.length; i++) {
if (i > 0) {
System.out.print (", ");
}System.out.print (possibles[i]);
}
System.out.println ("");
return -1;
}, "~S,~A,~A,~N");
c$.propertyGet = Clazz.defineMethod (c$, "propertyGet", 
function (argument) {
astex.util.Arguments.ensureConfigurationFileLoaded ();
if (argument.startsWith ("-")) {
argument = argument.substring (1, argument.length);
}return astex.util.Arguments.properties.get (argument);
}, "~S");
c$.ensureConfigurationFileLoaded = Clazz.defineMethod (c$, "ensureConfigurationFileLoaded", 
function () {
if (astex.util.Arguments.properties == null) {
astex.util.Arguments.loadConfigurationFile (null);
}});
c$.loadConfigurationFile = Clazz.defineMethod (c$, "loadConfigurationFile", 
function (filename) {
if (filename == null) {
filename = "config.properties";
}astex.util.Arguments.properties = astex.io.FILE.loadProperties (filename);
}, "~S");
Clazz.defineStatics (c$,
"properties", null);
});
