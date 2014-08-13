Clazz.declarePackage ("astex.util");
c$ = Clazz.decorateAsClass (function () {
this.objects = null;
this.objectCount = 0;
this.capacityIncrement = 4;
Clazz.instantialize (this, arguments);
}, astex.util, "StringArray");
Clazz.makeConstructor (c$, 
function (initialSize, increment) {
if (initialSize < 0) {
initialSize = 0;
}if (increment < 0) {
increment = 0;
}if (initialSize > 0) {
this.objects =  new Array (initialSize);
}this.objectCount = 0;
this.capacityIncrement = increment;
}, "~N,~N");
Clazz.makeConstructor (c$, 
function () {
this.construct (0);
});
Clazz.makeConstructor (c$, 
function (initialSize) {
this.construct (initialSize, 0);
}, "~N");
Clazz.defineMethod (c$, "ensureCapacity", 
 function () {
if (this.objects == null || this.objectCount == this.objects.length) {
var newCapacity;
if (this.capacityIncrement == 0) {
newCapacity = this.objectCount * 2;
} else {
newCapacity = this.objectCount + this.capacityIncrement;
}if (newCapacity == 0) {
newCapacity = 1;
}var newObjects =  new Array (newCapacity);
if (this.objects != null) {
for (var i = 0; i < this.objectCount; i++) {
newObjects[i] = this.objects[i];
}
}this.objects = newObjects;
}});
Clazz.defineMethod (c$, "setCapacity", 
function (count) {
if (this.objectCount != 0) {
System.err.println ("setCapacity called on non-empty Array");
return;
}this.objectCount = count;
this.objects =  new Array (this.objectCount);
}, "~N");
Clazz.defineMethod (c$, "add", 
function (object) {
this.ensureCapacity ();
this.objects[this.objectCount] = object;
return this.objectCount++;
}, "~S");
Clazz.defineMethod (c$, "remove", 
function (object) {
for (var i = this.objectCount - 1; i >= 0; i--) {
if (this.objects[i] === object) {
this.removeElement (i);
}}
}, "~S");
Clazz.defineMethod (c$, "removeElement", 
function (element) {
if (element == this.objectCount - 1) {
this.objectCount--;
this.objects[this.objectCount] = null;
} else if (element < this.objectCount && element >= 0) {
for (var i = element + 1; i < this.objectCount; i++) {
this.objects[i - 1] = this.objects[i];
}
this.objectCount--;
this.objects[this.objectCount] = null;
}}, "~N");
Clazz.defineMethod (c$, "removeAllElements", 
function () {
for (var i = 0; i < this.objectCount; i++) {
this.objects[i] = null;
}
this.objectCount = 0;
});
Clazz.defineMethod (c$, "get", 
function (index) {
return this.objects[index];
}, "~N");
Clazz.defineMethod (c$, "getReverse", 
function (index) {
return this.objects[this.objectCount - index - 1];
}, "~N");
Clazz.defineMethod (c$, "set", 
function (index, val) {
this.objects[index] = val;
}, "~N,~S");
Clazz.defineMethod (c$, "getArray", 
function () {
return this.objects;
});
Clazz.defineMethod (c$, "contains", 
function (object) {
return this.getIndex (object) != -1;
}, "~S");
Clazz.defineMethod (c$, "getIndex", 
function (object) {
for (var i = 0; i < this.objectCount; i++) {
if (this.objects[i] === object) {
return i;
}}
return -1;
}, "~S");
Clazz.defineMethod (c$, "size", 
function () {
return this.objectCount;
});
c$.print = Clazz.defineMethod (c$, "print", 
function (message, array) {
System.out.println (message);
for (var i = 0; i < array.size (); i++) {
System.out.println ("array[" + i + "] = " + array.get (i));
}
}, "~S,astex.util.StringArray");
