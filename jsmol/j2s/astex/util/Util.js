Clazz.declarePackage ("astex.util");
Clazz.load (null, "astex.util.Util", ["astex.io.FILE", "JU.SB"], function () {
c$ = Clazz.declareType (astex.util, "Util");
c$.startTimer = Clazz.defineMethod (c$, "startTimer", 
function (i) {
astex.util.Util.startTime[i] = System.currentTimeMillis ();
}, "~N");
c$.stopTimer = Clazz.defineMethod (c$, "stopTimer", 
function (s, i) {
var now = System.currentTimeMillis ();
var delta = now - astex.util.Util.startTime[i];
astex.util.Util.startTime[i] = now;
astex.io.FILE.out.printS (s + " " + delta);
}, "~S,~N");
c$.replace = Clazz.defineMethod (c$, "replace", 
function (s, pattern, replace) {
if (pattern == null || pattern.equals ("") || s == null) {
return s;
}var result =  new JU.SB ();
var start = 0;
var old = 0;
while ((old = s.indexOf (pattern, start)) >= 0) {
result.append (s.substring (start, old));
result.append (replace);
start = old + pattern.length;
}
result.append (s.substring (start));
return result.toString ();
}, "~S,~S,~S");
Clazz.defineStatics (c$,
"startTime",  Clazz.newLongArray (10, 0));
});
