Clazz.declarePackage ("astex.util");
c$ = Clazz.decorateAsClass (function () {
this.objects = null;
this.objectCount = 0;
this.capacityIncrement = 0;
Clazz.instantialize (this, arguments);
}, astex.util, "DynamicArray");
Clazz.defineMethod (c$, "set", 
function (initialSize, increment) {
if (initialSize < 0) {
initialSize = 0;
}if (increment < 0) {
increment = 0;
}if (initialSize > 0) {
this.objects =  new Array (initialSize);
}this.objectCount = 0;
this.capacityIncrement = increment;
return this;
}, "~N,~N");
Clazz.makeConstructor (c$, 
function () {
});
Clazz.defineMethod (c$, "setArray", 
function (a, count) {
this.objects = a;
this.objectCount = count;
return this;
}, "~A,~N");
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
if (this.objects == null || this.objectCount == this.objects.length) {
var newObjects =  new Array (this.objectCount + (this.capacityIncrement > 0 ? this.capacityIncrement : this.objectCount == 0 ? 1 : this.objectCount));
if (this.objects != null) for (var i = 0; i < this.objectCount; i++) newObjects[i] = this.objects[i];

this.objects = newObjects;
}this.objects[this.objectCount++] = object;
return this.objectCount;
}, "~O");
Clazz.defineMethod (c$, "remove", 
function (object) {
for (var i = this.objectCount - 1; i >= 0; i--) {
if (this.objects[i] === object) {
this.removeElement (i);
}}
}, "~O");
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
Clazz.defineMethod (c$, "setItem", 
function (index, val) {
this.objects[index] = val;
}, "~N,~O");
Clazz.defineMethod (c$, "getArray", 
function () {
return this.objects;
});
Clazz.defineMethod (c$, "contains", 
function (object) {
return this.getIndex (object) != -1;
}, "~O");
Clazz.defineMethod (c$, "getIndex", 
function (object) {
for (var i = 0; i < this.objectCount; i++) {
if (this.objects[i] === object) {
return i;
}}
return -1;
}, "~O");
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
}, "~S,astex.util.DynamicArray");
