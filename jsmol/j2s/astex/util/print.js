Clazz.declarePackage ("astex.util");
Clazz.load (null, "astex.util.print", ["astex.io.FILE"], function () {
c$ = Clazz.declareType (astex.util, "print");
c$.f = Clazz.defineMethod (c$, "f", 
function (output) {
System.out.println (output);
}, "~S");
c$.f = Clazz.defineMethod (c$, "f", 
function (o) {
System.out.println (o.toString ());
}, "~O");
c$.f = Clazz.defineMethod (c$, "f", 
function (s, d) {
astex.io.FILE.out.printFD (s, d);
}, "~S,~N");
c$.f = Clazz.defineMethod (c$, "f", 
function (s, f) {
astex.io.FILE.out.printFD (s, f);
}, "~S,~N");
c$.f = Clazz.defineMethod (c$, "f", 
function (s, i) {
astex.io.FILE.out.printFI (s, i);
}, "~S,~N");
c$.f = Clazz.defineMethod (c$, "f", 
function (s, c) {
astex.io.FILE.out.printFC (s, c);
}, "~S,~S");
c$.f = Clazz.defineMethod (c$, "f", 
function (s, a) {
astex.io.FILE.out.printFS (s, a);
}, "~S,~S");
});
