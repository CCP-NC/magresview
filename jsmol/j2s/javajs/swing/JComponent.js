Clazz.declarePackage ("javajs.swing");
Clazz.load (["javajs.awt.Container"], "javajs.swing.JComponent", null, function () {
c$ = Clazz.decorateAsClass (function () {
this.autoScrolls = false;
Clazz.instantialize (this, arguments);
}, javajs.swing, "JComponent", javajs.awt.Container);
$_M(c$, "setAutoscrolls", 
function (b) {
this.autoScrolls = b;
}, "~B");
});
