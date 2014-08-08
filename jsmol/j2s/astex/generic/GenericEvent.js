Clazz.declarePackage ("astex.generic");
Clazz.load (["astex.generic.Generic"], "astex.generic.GenericEvent", null, function () {
c$ = Clazz.declareType (astex.generic, "GenericEvent", astex.generic.Generic);
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, astex.generic.GenericEvent, []);
});
Clazz.defineMethod (c$, "set", 
function (type, target, a, b) {
this.setClassname ("GenericEvent");
this.setValue ("__type__", type);
this.setValue ("__target__", target);
if (type === "__property_changed__") {
this.setValue ("__name__", a);
this.setValue ("__value__", b);
} else if (type === "__child_added__" || type === "__child_removed__") {
this.setValue ("__child__", a);
} else if (type === "__parent_added__" || type === "__parent_removed__") {
this.setValue ("__parent__", a);
}return this;
}, "~S,~O,~O,~O");
Clazz.overrideMethod (c$, "toString", 
function () {
var s = "GenericEvent: ";
var type = this.get ("__type__", null);
s += "__type__" + "=" + type + " ";
s += "__target__" + "=" + this.get ("__target__", null) + " ";
if ("__property_changed__" === type) {
s += this.get ("__name__", null) + "=" + this.get ("__value__", null);
} else if ("__child_added__" === type) {
s += "__child__" + "=" + this.get ("__child__", null);
} else if ("__child_removed__" === type) {
s += "__child__" + "=" + this.get ("__child__", null);
} else if ("__parent_added__" === type) {
s += "__parent__" + "=" + this.get ("__parent__", null);
} else if ("__parent_removed__" === type) {
s += "__parent__" + "=" + this.get ("__parent__", null);
}return s;
});
Clazz.defineStatics (c$,
"Class", "GenericEvent",
"Type", "__type__",
"PropertyChanged", "__property_changed__",
"ChildAdded", "__child_added__",
"ChildRemoved", "__child_removed__",
"ParentAdded", "__parent_added__",
"ParentRemoved", "__parent_removed__",
"Name", "__name__",
"Value", "__value__",
"Target", "__target__",
"Child", "__child__",
"Parent", "__parent__");
});
