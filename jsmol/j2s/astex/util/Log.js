Clazz.declarePackage ("astex.util");
Clazz.load (["java.util.Hashtable"], "astex.util.Log", ["astex.io.FILE"], function () {
c$ = Clazz.declareType (astex.util, "Log");
c$.debug = Clazz.defineMethod (c$, "debug", 
function (s, d) {
if (astex.util.Log.level <= 1 && astex.util.Log.getLoggingLevel (3) <= 4) astex.util.Log.log (astex.util.Log.logStrings[1], astex.io.FILE.sprintD (s, d));
}, "~S,~N");
c$.debug3 = Clazz.defineMethod (c$, "debug3", 
function (s, d) {
if (astex.util.Log.level <= 2 && astex.util.Log.getLoggingLevel (3) <= 2) astex.util.Log.log (astex.util.Log.logStrings[2], astex.io.FILE.sprintD (s, d));
}, "~S,~N");
c$.debug2 = Clazz.defineMethod (c$, "debug2", 
function (s, d) {
if (astex.util.Log.level <= 3 && astex.util.Log.getLoggingLevel (3) <= 3) astex.util.Log.log (astex.util.Log.logStrings[3], astex.io.FILE.sprintD (s, d));
}, "~S,~N");
c$.debug1 = Clazz.defineMethod (c$, "debug1", 
function (s, d) {
if (astex.util.Log.level <= 4 && astex.util.Log.getLoggingLevel (3) <= 4) astex.util.Log.log (astex.util.Log.logStrings[4], astex.io.FILE.sprintD (s, d));
}, "~S,~N");
c$.info = Clazz.defineMethod (c$, "info", 
function (s, d) {
if (astex.util.Log.level <= 5) astex.util.Log.log (astex.util.Log.logStrings[5], astex.io.FILE.sprintD (s, d));
}, "~S,~N");
c$.warn = Clazz.defineMethod (c$, "warn", 
function (s, d) {
if (astex.util.Log.level <= 6) astex.util.Log.log (astex.util.Log.logStrings[6], astex.io.FILE.sprintD (s, d));
}, "~S,~N");
c$.error = Clazz.defineMethod (c$, "error", 
function (s, d) {
if (astex.util.Log.level <= 7) astex.util.Log.log (astex.util.Log.logStrings[7], astex.io.FILE.sprintD (s, d));
}, "~S,~N");
c$.fatal = Clazz.defineMethod (c$, "fatal", 
function (s, d) {
if (astex.util.Log.level <= 8) astex.util.Log.log (astex.util.Log.logStrings[8], astex.io.FILE.sprintD (s, d));
}, "~S,~N");
c$.debug = Clazz.defineMethod (c$, "debug", 
function (s, d) {
if (astex.util.Log.level <= 1 && astex.util.Log.getLoggingLevel (3) <= 4) astex.util.Log.log (astex.util.Log.logStrings[1], astex.io.FILE.sprintI (s, d));
}, "~S,~N");
c$.debug3 = Clazz.defineMethod (c$, "debug3", 
function (s, d) {
if (astex.util.Log.level <= 2 && astex.util.Log.getLoggingLevel (3) <= 2) astex.util.Log.log (astex.util.Log.logStrings[2], astex.io.FILE.sprintI (s, d));
}, "~S,~N");
c$.debug2 = Clazz.defineMethod (c$, "debug2", 
function (s, d) {
if (astex.util.Log.level <= 3 && astex.util.Log.getLoggingLevel (3) <= 3) astex.util.Log.log (astex.util.Log.logStrings[3], astex.io.FILE.sprintI (s, d));
}, "~S,~N");
c$.debug1 = Clazz.defineMethod (c$, "debug1", 
function (s, d) {
if (astex.util.Log.level <= 4 && astex.util.Log.getLoggingLevel (3) <= 4) astex.util.Log.log (astex.util.Log.logStrings[4], astex.io.FILE.sprintI (s, d));
}, "~S,~N");
c$.info = Clazz.defineMethod (c$, "info", 
function (s, d) {
if (astex.util.Log.level <= 5) astex.util.Log.log (astex.util.Log.logStrings[5], astex.io.FILE.sprintI (s, d));
}, "~S,~N");
c$.warn = Clazz.defineMethod (c$, "warn", 
function (s, d) {
if (astex.util.Log.level <= 6) astex.util.Log.log (astex.util.Log.logStrings[6], astex.io.FILE.sprintI (s, d));
}, "~S,~N");
c$.error = Clazz.defineMethod (c$, "error", 
function (s, d) {
if (astex.util.Log.level <= 7) astex.util.Log.log (astex.util.Log.logStrings[7], astex.io.FILE.sprintI (s, d));
}, "~S,~N");
c$.fatal = Clazz.defineMethod (c$, "fatal", 
function (s, d) {
if (astex.util.Log.level <= 8) astex.util.Log.log (astex.util.Log.logStrings[8], astex.io.FILE.sprintI (s, d));
}, "~S,~N");
c$.debug = Clazz.defineMethod (c$, "debug", 
function (s) {
if (astex.util.Log.level <= 1 && astex.util.Log.getLoggingLevel (3) <= 4) astex.util.Log.log (astex.util.Log.logStrings[1], s);
}, "~S");
c$.debug3 = Clazz.defineMethod (c$, "debug3", 
function (s) {
if (astex.util.Log.level <= 2 && astex.util.Log.getLoggingLevel (3) <= 2) astex.util.Log.log (astex.util.Log.logStrings[2], s);
}, "~S");
c$.debug2 = Clazz.defineMethod (c$, "debug2", 
function (s) {
if (astex.util.Log.level <= 3 && astex.util.Log.getLoggingLevel (3) <= 3) astex.util.Log.log (astex.util.Log.logStrings[3], s);
}, "~S");
c$.debug1 = Clazz.defineMethod (c$, "debug1", 
function (s) {
if (astex.util.Log.level <= 4 && astex.util.Log.getLoggingLevel (3) <= 4) astex.util.Log.log (astex.util.Log.logStrings[4], s);
}, "~S");
c$.info = Clazz.defineMethod (c$, "info", 
function (s) {
if (astex.util.Log.level <= 5) astex.util.Log.log (astex.util.Log.logStrings[5], s);
}, "~S");
c$.warn = Clazz.defineMethod (c$, "warn", 
function (s) {
if (astex.util.Log.level <= 6) astex.util.Log.log (astex.util.Log.logStrings[6], s);
}, "~S");
c$.error = Clazz.defineMethod (c$, "error", 
function (s) {
if (astex.util.Log.level <= 7) astex.util.Log.log (astex.util.Log.logStrings[7], s);
}, "~S");
c$.fatal = Clazz.defineMethod (c$, "fatal", 
function (s) {
if (astex.util.Log.level <= 8) astex.util.Log.log (astex.util.Log.logStrings[8], s);
}, "~S");
c$.check = Clazz.defineMethod (c$, "check", 
function (condition, s) {
if (!condition) astex.util.Log.logAssert (astex.util.Log.logStrings[9], s);
}, "~B,~S");
c$.check = Clazz.defineMethod (c$, "check", 
function (condition, s, d) {
if (!condition) astex.util.Log.logAssert (astex.util.Log.logStrings[9], astex.io.FILE.sprintD (s, d));
}, "~B,~S,~N");
c$.check = Clazz.defineMethod (c$, "check", 
function (condition, s, d) {
if (!condition) astex.util.Log.logAssert (astex.util.Log.logStrings[9], astex.io.FILE.sprintI (s, d));
}, "~B,~S,~N");
c$.logAssert = Clazz.defineMethod (c$, "logAssert", 
 function (intro, s) {
var methodName = astex.util.Log.getMethodName (3);
if (astex.util.Log.fullClass == false) {
var lastDot = methodName.lastIndexOf ('.');
methodName = methodName.substring (lastDot + 1, methodName.length);
}astex.io.FILE.out.printFS ("%-7s", intro);
if (astex.util.Log.fullClass) {
astex.io.FILE.out.printFS ("%-15s - ", methodName);
} else {
astex.io.FILE.out.printFS ("%-10s - ", methodName);
}astex.io.FILE.out.println (s);
}, "~S,~S");
c$.log = Clazz.defineMethod (c$, "log", 
 function (intro, s) {
var methodName = astex.util.Log.getMethodName (3);
if (astex.util.Log.fullClass == false) {
var lastDot = methodName.lastIndexOf ('.');
methodName = methodName.substring (lastDot + 1, methodName.length);
}astex.io.FILE.out.printFS ("%-7s", intro);
if (astex.util.Log.fullClass) {
astex.io.FILE.out.printFS ("%-15s - ", methodName);
} else {
astex.io.FILE.out.printFS ("%-10s - ", methodName);
}astex.io.FILE.out.println (s);
}, "~S,~S");
c$.setLoggingLevel = Clazz.defineMethod (c$, "setLoggingLevel", 
function (l) {
astex.util.Log.level = l;
}, "~N");
c$.getLoggingLevel = Clazz.defineMethod (c$, "getLoggingLevel", 
 function (l) {
{
}return astex.util.Log.logStrings.length;
}, "~N");
c$.getClassName = Clazz.defineMethod (c$, "getClassName", 
 function (methodName) {
if (methodName == null) {
return "unknown-class";
}var pos = methodName.lastIndexOf ('.');
return (pos == -1 ? methodName : methodName.substring (0, pos));
}, "~S");
c$.getMethodName = Clazz.defineMethod (c$, "getMethodName", 
 function (nline) {
var methodName = "unknown-method";
{
var m = arguments.callee;
for (var i = 0; i < nline; i++) m = m.caller;
return m.exName || "unknown method";
}return methodName;
}, "~N");
Clazz.makeConstructor (c$, 
function () {
{
return;
}});
c$.string2level = Clazz.defineMethod (c$, "string2level", 
function (s) {
for (var i = 0; i < astex.util.Log.logStrings.length; i++) {
if (s.equals (astex.util.Log.logStrings[i])) {
return i;
}}
return -1;
}, "~S");
Clazz.defineStatics (c$,
"DEBUG", 1,
"DEBUG3", 2,
"DEBUG2", 3,
"DEBUG1", 4,
"INFO", 5,
"WARN", 6,
"ERROR", 7,
"FATAL", 8,
"ASSERT", 9,
"logStrings", ["ALL", "DEBUG", "DEBUG3", "DEBUG2", "DEBUG1", "INFO", "WARN", "ERROR", "FATAL", "NOTHING", "ASSERT"]);
c$.methodLevels = c$.prototype.methodLevels =  new java.util.Hashtable ();
Clazz.defineStatics (c$,
"level", 5,
"initialised", false,
"fullClass", false);
});
