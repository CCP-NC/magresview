Clazz.declarePackage ("java_cup.runtime");
c$ = Clazz.decorateAsClass (function () {
this.sym = 0;
this.parse_state = 0;
this.used_by_parser = false;
this.left = 0;
this.right = 0;
this.value = null;
Clazz.instantialize (this, arguments);
}, java_cup.runtime, "Symbol");
Clazz.makeConstructor (c$, 
function (id, l, r, o) {
this.construct (id);
this.left = l;
this.right = r;
this.value = o;
}, "~N,~N,~N,~O");
Clazz.makeConstructor (c$, 
function (id, o) {
this.construct (id);
this.left = -1;
this.right = -1;
this.value = o;
}, "~N,~O");
Clazz.makeConstructor (c$, 
function (sym_num, l, r) {
this.sym = sym_num;
this.left = l;
this.right = r;
this.value = null;
}, "~N,~N,~N");
Clazz.makeConstructor (c$, 
function (sym_num) {
this.sym = sym_num;
this.parse_state = -1;
this.left = -1;
this.right = -1;
this.value = null;
}, "~N");
c$.newState = Clazz.defineMethod (c$, "newState", 
function (start_state) {
var s =  new java_cup.runtime.Symbol (0, 0, 0, null);
s.parse_state = start_state;
return s;
}, "~N");
Clazz.overrideMethod (c$, "toString", 
function () {
return "#" + this.sym + " " + this.value;
});
