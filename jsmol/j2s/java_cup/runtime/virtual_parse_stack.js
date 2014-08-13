Clazz.declarePackage ("java_cup.runtime");
Clazz.load (null, "java_cup.runtime.virtual_parse_stack", ["java.lang.Exception", "java.util.Stack"], function () {
c$ = Clazz.decorateAsClass (function () {
this.real_stack = null;
this.real_next = 0;
this.vstack = null;
Clazz.instantialize (this, arguments);
}, java_cup.runtime, "virtual_parse_stack");
Clazz.makeConstructor (c$, 
function (shadowing_stack) {
if (shadowing_stack == null) throw  new Exception ("Internal parser error: attempt to create null virtual stack");
this.real_stack = shadowing_stack;
this.vstack =  new java.util.Stack ();
this.real_next = 0;
this.get_from_real ();
}, "java.util.Stack");
Clazz.defineMethod (c$, "get_from_real", 
function () {
var stack_sym;
if (this.real_next >= this.real_stack.size ()) return;
stack_sym = this.real_stack.elementAt (this.real_stack.size () - 1 - this.real_next);
this.real_next++;
this.vstack.push ( new Integer (stack_sym.parse_state));
});
Clazz.defineMethod (c$, "empty", 
function () {
return this.vstack.empty ();
});
Clazz.defineMethod (c$, "top", 
function () {
if (this.vstack.empty ()) throw  new Exception ("Internal parser error: top() called on empty virtual stack");
return (this.vstack.peek ()).intValue ();
});
Clazz.defineMethod (c$, "pop", 
function () {
if (this.vstack.empty ()) throw  new Exception ("Internal parser error: pop from empty virtual stack");
this.vstack.pop ();
if (this.vstack.empty ()) this.get_from_real ();
});
Clazz.defineMethod (c$, "push", 
function (state_num) {
this.vstack.push ( new Integer (state_num));
}, "~N");
});
