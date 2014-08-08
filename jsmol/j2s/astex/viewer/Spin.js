Clazz.declarePackage ("astex.viewer");
Clazz.load (["java.lang.Thread"], "astex.viewer.Spin", ["astex.viewer.CommandThread"], function () {
c$ = Clazz.decorateAsClass (function () {
this.moleculeViewer = null;
this.moleculeRenderer = null;
Clazz.instantialize (this, arguments);
}, astex.viewer, "Spin", Thread);
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, astex.viewer.Spin, []);
});
Clazz.makeConstructor (c$, 
function (mv, mr) {
this.construct ();
this.moleculeViewer = mv;
this.moleculeRenderer = mr;
}, "astex.viewer.Viewer,astex.render.MoleculeRenderer");
c$.handleCommand = Clazz.defineMethod (c$, "handleCommand", 
function (mv, mr, args) {
if (args.defined ("-angle")) {
astex.viewer.Spin.angle = args.getDouble ("-angle", 0.5);
}if (args.defined ("-active")) {
if (args.getBoolean ("-active", false)) {
if (astex.viewer.Spin.spinner != null) {
astex.viewer.Spin.spinner.interrupt ();
astex.viewer.Spin.spinner = null;
}var spin =  new astex.viewer.Spin (mv, mr);
astex.viewer.Spin.spinner =  new Thread (spin);
astex.viewer.Spin.spinner.start ();
} else {
astex.viewer.Spin.spinner.interrupt ();
astex.viewer.Spin.spinner = null;
}}}, "astex.viewer.Viewer,astex.render.MoleculeRenderer,astex.util.Arguments");
Clazz.overrideMethod (c$, "run", 
function () {
while (true) {
astex.viewer.CommandThread.execute (this.moleculeRenderer, "spin", "view -rotatez " + astex.viewer.Spin.angle + ";");
try {
Thread.sleep (20);
} catch (e) {
if (Clazz.exceptionOf (e, InterruptedException)) {
} else {
throw e;
}
}
}
});
Clazz.defineStatics (c$,
"angle", 0.5,
"spinner", null);
});
