Clazz.declarePackage ("astex.generic");
Clazz.load (["astex.generic.GenericInterface", "java.util.Hashtable", "JU.Lst"], "astex.generic.Generic", ["java.lang.Boolean", "$.Double", "$.RuntimeException", "java.util.Collections"], function () {
c$ = Clazz.decorateAsClass (function () {
this.properties = null;
this.children = null;
this.parents = null;
this.listeners = null;
Clazz.instantialize (this, arguments);
}, astex.generic, "Generic", null, astex.generic.GenericInterface);
Clazz.makeConstructor (c$, 
function () {
this.setClassname (this.getClass ().getName ());
});
Clazz.overrideMethod (c$, "get", 
function (key, def) {
return this.get2 (key, def);
}, "~O,~O");
Clazz.defineMethod (c$, "get2", 
function (key, def) {
if (this.properties == null) return def;
var value = this.properties.get (key);
return (value == null ? def : value);
}, "~O,~O");
Clazz.overrideMethod (c$, "setValue", 
function (name, value) {
return this.setValueGeneric (name, value);
}, "~O,~O");
Clazz.defineMethod (c$, "setValueGeneric", 
function (name, value) {
var oldValue = null;
if (this.properties == null) {
this.properties =  new java.util.Hashtable ();
} else {
oldValue = this.properties.get (name);
}if (value == null) {
this.properties.remove (name);
} else {
this.properties.put (name, value);
}if (this.listeners != null) {
var ge =  new astex.generic.GenericEvent ().set ("__property_changed__", this, name, value);
this.notifyListeners (ge);
}return oldValue;
}, "~O,~O");
Clazz.overrideMethod (c$, "getProperties", 
function () {
return (this.properties == null ? astex.generic.Generic.emptyHashtable.keys () : this.properties.keys ());
});
Clazz.overrideMethod (c$, "setClassname", 
function (c) {
this.setValue ("__class__", c);
}, "~S");
Clazz.overrideMethod (c$, "getClassname", 
function () {
return this.get ("__class__", null);
});
Clazz.overrideMethod (c$, "addChild", 
function (child) {
if (this.children == null) {
this.children =  new JU.Lst ();
}this.children.addLast (child);
if (this.listeners != null) {
var ge =  new astex.generic.GenericEvent ().set ("__child_added__", this, child, null);
this.notifyListeners (ge);
}}, "astex.generic.GenericInterface");
Clazz.overrideMethod (c$, "removeChild", 
function (child) {
if (this.children != null) {
this.children.removeObj (child);
} else {
throw  new RuntimeException ("no such child: " + child);
}if (this.listeners != null) {
var ge =  new astex.generic.GenericEvent ().set ("__child_removed__", this, child, null);
this.notifyListeners (ge);
}}, "astex.generic.GenericInterface");
Clazz.overrideMethod (c$, "getChildren", 
function (type) {
return java.util.Collections.enumeration (this.children == null ? astex.generic.Generic.emptyVector : this.children);
}, "~O");
Clazz.overrideMethod (c$, "addParent", 
function (parent) {
if (this.parents == null) this.parents =  new JU.Lst ();
this.parents.addLast (parent);
if (this.listeners != null) {
var ge =  new astex.generic.GenericEvent ().set ("__parent_added__", this, parent, null);
this.notifyListeners (ge);
}}, "astex.generic.GenericInterface");
Clazz.overrideMethod (c$, "removeParent", 
function (parent) {
if (this.parents != null) {
this.parents.removeObj (parent);
} else {
throw  new RuntimeException ("no such parent: " + parent);
}if (this.listeners != null) {
var ge =  new astex.generic.GenericEvent ().set ("__parent_removed__", this, parent, null);
this.notifyListeners (ge);
}}, "astex.generic.GenericInterface");
Clazz.overrideMethod (c$, "getParents", 
function (type) {
return java.util.Collections.enumeration (this.parents == null ? astex.generic.Generic.emptyVector : this.parents);
}, "~O");
Clazz.overrideMethod (c$, "addListener", 
function (gei) {
if (this.listeners == null) {
this.listeners =  new JU.Lst ();
}this.listeners.addLast (gei);
}, "astex.generic.GenericEventInterface");
Clazz.overrideMethod (c$, "removeListener", 
function (gei) {
if (this.listeners != null) {
this.listeners.removeObj (gei);
}}, "astex.generic.GenericEventInterface");
Clazz.defineMethod (c$, "notifyListeners", 
 function (ge) {
if (this.listeners != null) {
var listenersCount = this.listeners.size ();
for (var i = 0; i < listenersCount; i++) {
var listener = this.listeners.get (i);
listener.handleEvent (ge);
}
}}, "astex.generic.GenericEvent");
Clazz.defineMethod (c$, "getDouble", 
function (property, def) {
var val = this.get (property, null);
return val != null ? val.doubleValue () : def;
}, "~O,~N");
Clazz.defineMethod (c$, "getInteger", 
function (property, def) {
var val = this.get (property, null);
return val != null ? val.intValue () : def;
}, "~O,~N");
Clazz.defineMethod (c$, "getString", 
function (property, def) {
var val = this.get (property, null);
return val != null ? val : def;
}, "~O,~S");
Clazz.defineMethod (c$, "getBoolean", 
function (property, def) {
var val = this.get (property, null);
return val != null ? val.booleanValue () : def;
}, "~O,~B");
Clazz.defineMethod (c$, "setDouble", 
function (property, val) {
var dval =  new Double (val);
this.setValue (property, dval);
}, "~O,~N");
Clazz.defineMethod (c$, "setInteger", 
function (property, val) {
var ival =  new Integer (val);
this.setValue (property, ival);
}, "~O,~N");
Clazz.defineMethod (c$, "setString", 
function (property, val) {
this.setValue (property, val);
}, "~O,~S");
Clazz.defineMethod (c$, "setBoolean", 
function (property, val) {
if (val) {
this.setValue (property, Boolean.TRUE);
} else {
this.setValue (property, Boolean.FALSE);
}}, "~O,~B");
Clazz.defineStatics (c$,
"ClassName", "__class__");
c$.emptyHashtable = c$.prototype.emptyHashtable =  new java.util.Hashtable ();
c$.emptyVector = c$.prototype.emptyVector =  new JU.Lst ();
});
