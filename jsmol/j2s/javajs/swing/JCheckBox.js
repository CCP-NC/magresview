Clazz.declarePackage ("javajs.swing");
Clazz.load (["javajs.swing.AbstractButton"], "javajs.swing.JCheckBox", null, function () {
c$ = Clazz.declareType (javajs.swing, "JCheckBox", javajs.swing.AbstractButton);
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, javajs.swing.JCheckBox, ["chkJCB"]);
});
$_V(c$, "toHTML", 
function () {
var s = "<input type=checkbox id='" + this.id + "' class='JCheckBox' style='" + this.getCSSstyle (0, 0) + "' " + (this.selected ? "checked='checked' " : "") + "onclick='SwingController.click(this)'>" + "<label for='" + this.id + "'>" + this.text + "</label>";
return s;
});
});
