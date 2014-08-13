Clazz.declarePackage ("astex.viewer");
Clazz.load (["java.lang.Thread", "java.util.Hashtable", "JU.Lst"], "astex.viewer.CommandThread", ["astex.parser.Parser", "$.Yylex", "java.io.StringReader"], function () {
c$ = Clazz.decorateAsClass (function () {
this.$name = null;
this.mr = null;
this.p = null;
this.l = null;
this.commandQueue = null;
Clazz.instantialize (this, arguments);
}, astex.viewer, "CommandThread", Thread);
Clazz.prepareFields (c$, function () {
this.commandQueue =  new JU.Lst ();
});
c$.execute = Clazz.defineMethod (c$, "execute", 
function (mr, threadName, command) {
var t = astex.viewer.CommandThread.threads.get (threadName);
if (t == null || t.isAlive () == false) {
t =  new astex.viewer.CommandThread (mr);
t.$name = threadName;
astex.viewer.CommandThread.threads.put (threadName, t);
t.start ();
}t.commandQueue.addLast (command);
t.resume ();
}, "astex.render.MoleculeRenderer,~S,~S");
Clazz.makeConstructor (c$, 
 function (m) {
Clazz.superConstructor (this, astex.viewer.CommandThread);
this.mr = m;
this.p =  new astex.parser.Parser ();
this.l =  new astex.parser.Yylex (Clazz.castNullAs ("java.io.BufferedReader"));
}, "astex.render.MoleculeRenderer");
Clazz.overrideMethod (c$, "run", 
function () {
while (true) {
var command = null;
if (this.commandQueue.isEmpty () == false) {
command = this.commandQueue.remove (0);
this.p.setMoleculeRenderer (this.mr);
this.p.setScanner (this.l);
this.l.setInput ( new java.io.StringReader (command));
try {
this.p.parse ();
this.mr.repaint ();
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
System.out.println ("thread " + this.$name + " error executing:");
System.out.println (command);
} else {
throw e;
}
}
} else {
this.suspend ();
}}
});
c$.threads = c$.prototype.threads =  new java.util.Hashtable ();
});
