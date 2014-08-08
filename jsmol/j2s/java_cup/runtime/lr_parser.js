Clazz.declarePackage ("java_cup.runtime");
Clazz.load (["java.util.Stack", "JU.AU"], "java_cup.runtime.lr_parser", ["java.lang.Error", "$.Exception", "java_cup.runtime.Symbol", "$.virtual_parse_stack", "JU.SB"], function () {
c$ = Clazz.decorateAsClass (function () {
this._done_parsing = false;
this.tos = 0;
this.cur_token = null;
this.stack = null;
this.production_tab = null;
this.action_tab = null;
this.reduce_tab = null;
this._scanner = null;
this.lookahead = null;
this.lookahead_pos = 0;
Clazz.instantialize (this, arguments);
}, java_cup.runtime, "lr_parser");
Clazz.prepareFields (c$, function () {
this.stack =  new java.util.Stack ();
});
Clazz.makeConstructor (c$, 
function () {
});
Clazz.makeConstructor (c$, 
function (s) {
this.construct ();
this.setScanner (s);
}, "java_cup.runtime.Scanner");
Clazz.defineMethod (c$, "error_sync_size", 
function () {
return 3;
});
Clazz.defineMethod (c$, "done_parsing", 
function () {
this._done_parsing = true;
});
Clazz.defineMethod (c$, "setScanner", 
function (s) {
this._scanner = s;
}, "java_cup.runtime.Scanner");
Clazz.defineMethod (c$, "getScanner", 
function () {
return this._scanner;
});
Clazz.defineMethod (c$, "user_init", 
function () {
});
Clazz.defineMethod (c$, "scan", 
function () {
return this.getScanner ().next_token ();
});
Clazz.defineMethod (c$, "report_fatal_error", 
function (message, info) {
this.done_parsing ();
this.report_error (message, info);
throw  new Exception ("Can't recover from previous error(s)");
}, "~S,~O");
Clazz.defineMethod (c$, "report_error", 
function (message, info) {
System.err.print (message);
if (Clazz.instanceOf (info, java_cup.runtime.Symbol)) if ((info).left != -1) System.err.println (" at character " + (info).left + " of input");
 else System.err.println ("");
 else System.err.println ("");
}, "~S,~O");
Clazz.defineMethod (c$, "syntax_error", 
function (cur_token) {
this.report_error ("Syntax error", cur_token);
}, "java_cup.runtime.Symbol");
Clazz.defineMethod (c$, "unrecovered_syntax_error", 
function (cur_token) {
this.report_fatal_error ("Couldn't repair and continue parse", cur_token);
}, "java_cup.runtime.Symbol");
Clazz.defineMethod (c$, "get_action", 
function (state, sym) {
var tag;
var first;
var last;
var probe;
var row = this.action_tab[state];
if (row.length < 20) for (probe = 0; probe < row.length; probe++) {
tag = row[probe++];
if (tag == sym || tag == -1) {
return row[probe];
}}
 else {
first = 0;
last = Clazz.doubleToInt ((row.length - 1) / 2) - 1;
while (first <= last) {
probe = Clazz.doubleToInt ((first + last) / 2);
if (sym == row[probe * 2]) return row[probe * 2 + 1];
 else if (sym > row[probe * 2]) first = probe + 1;
 else last = probe - 1;
}
return row[row.length - 1];
}return 0;
}, "~N,~N");
Clazz.defineMethod (c$, "get_reduce", 
function (state, sym) {
var tag;
var row = this.reduce_tab[state];
if (row == null) return -1;
for (var probe = 0; probe < row.length; probe++) {
tag = row[probe++];
if (tag == sym || tag == -1) {
return row[probe];
}}
return -1;
}, "~N,~N");
Clazz.defineMethod (c$, "parse", 
function () {
var act;
var lhs_sym = null;
var handle_size;
var lhs_sym_num;
this.production_tab = this.production_table ();
this.action_tab = this.action_table ();
this.reduce_tab = this.reduce_table ();
this.init_actions ();
this.user_init ();
this.cur_token = this.scan ();
this.stack.removeAllElements ();
this.stack.push (java_cup.runtime.Symbol.newState (this.start_state ()));
this.tos = 0;
for (this._done_parsing = false; !this._done_parsing; ) {
if (this.cur_token.used_by_parser) throw  new Error ("Symbol recycling detected (fix your scanner).sym=" + this.cur_token.sym);
act = this.get_action ((this.stack.peek ()).parse_state, this.cur_token.sym);
if (act > 0) {
this.cur_token.parse_state = act - 1;
this.cur_token.used_by_parser = true;
this.stack.push (this.cur_token);
this.tos++;
this.cur_token = this.scan ();
} else if (act < 0) {
lhs_sym = this.do_action ((-act) - 1, this, this.stack, this.tos);
lhs_sym_num = this.production_tab[(-act) - 1][0];
handle_size = this.production_tab[(-act) - 1][1];
for (var i = 0; i < handle_size; i++) {
this.stack.pop ();
this.tos--;
}
act = this.get_reduce ((this.stack.peek ()).parse_state, lhs_sym_num);
lhs_sym.parse_state = act;
lhs_sym.used_by_parser = true;
this.stack.push (lhs_sym);
this.tos++;
} else if (act == 0) {
this.syntax_error (this.cur_token);
if (!this.error_recovery (false)) {
this.unrecovered_syntax_error (this.cur_token);
this.done_parsing ();
} else {
lhs_sym = this.stack.peek ();
}}}
return lhs_sym;
});
Clazz.defineMethod (c$, "debug_message", 
function (mess) {
System.err.println (mess);
}, "~S");
Clazz.defineMethod (c$, "dump_stack", 
function () {
if (this.stack == null) {
this.debug_message ("# Stack dump requested, but stack is null");
return;
}this.debug_message ("============ Parse Stack Dump ============");
for (var i = 0; i < this.stack.size (); i++) {
this.debug_message ("Symbol: " + (this.stack.elementAt (i)).sym + " State: " + (this.stack.elementAt (i)).parse_state);
}
this.debug_message ("==========================================");
});
Clazz.defineMethod (c$, "debug_reduce", 
function (prod_num, nt_num, rhs_size) {
this.debug_message ("# Reduce with prod #" + prod_num + " [NT=" + nt_num + ", " + "SZ=" + rhs_size + "]");
}, "~N,~N,~N");
Clazz.defineMethod (c$, "debug_shift", 
function (shift_tkn) {
this.debug_message ("# Shift under term #" + shift_tkn.sym + " to state #" + shift_tkn.parse_state);
}, "java_cup.runtime.Symbol");
Clazz.defineMethod (c$, "debug_stack", 
function () {
var sb = JU.SB.newS ("## STACK:");
for (var i = 0; i < this.stack.size (); i++) {
var s = this.stack.elementAt (i);
sb.append (" <state " + s.parse_state + ", sym " + s.sym + ">");
if ((i % 3) == 2 || (i == (this.stack.size () - 1))) {
this.debug_message (sb.toString ());
sb = JU.SB.newS ("         ");
}}
});
Clazz.defineMethod (c$, "debug_parse", 
function () {
var act;
var lhs_sym = null;
var handle_size;
var lhs_sym_num;
this.production_tab = this.production_table ();
this.action_tab = this.action_table ();
this.reduce_tab = this.reduce_table ();
this.debug_message ("# Initializing parser");
this.init_actions ();
this.user_init ();
this.cur_token = this.scan ();
this.debug_message ("# Current Symbol is #" + this.cur_token.sym);
this.stack.removeAllElements ();
this.stack.push (java_cup.runtime.Symbol.newState (this.start_state ()));
this.tos = 0;
for (this._done_parsing = false; !this._done_parsing; ) {
if (this.cur_token.used_by_parser) throw  new Error ("Symbol recycling detected (fix your scanner).2");
act = this.get_action ((this.stack.peek ()).parse_state, this.cur_token.sym);
if (act > 0) {
this.cur_token.parse_state = act - 1;
this.cur_token.used_by_parser = true;
this.debug_shift (this.cur_token);
this.stack.push (this.cur_token);
this.tos++;
this.cur_token = this.scan ();
this.debug_message ("# Current token is " + this.cur_token);
} else if (act < 0) {
lhs_sym = this.do_action ((-act) - 1, this, this.stack, this.tos);
lhs_sym_num = this.production_tab[(-act) - 1][0];
handle_size = this.production_tab[(-act) - 1][1];
this.debug_reduce ((-act) - 1, lhs_sym_num, handle_size);
for (var i = 0; i < handle_size; i++) {
this.stack.pop ();
this.tos--;
}
act = this.get_reduce ((this.stack.peek ()).parse_state, lhs_sym_num);
this.debug_message ("# Reduce rule: top state " + (this.stack.peek ()).parse_state + ", lhs sym " + lhs_sym_num + " -> state " + act);
lhs_sym.parse_state = act;
lhs_sym.used_by_parser = true;
this.stack.push (lhs_sym);
this.tos++;
this.debug_message ("# Goto state #" + act);
} else if (act == 0) {
this.syntax_error (this.cur_token);
if (!this.error_recovery (true)) {
this.unrecovered_syntax_error (this.cur_token);
this.done_parsing ();
} else {
lhs_sym = this.stack.peek ();
}}}
return lhs_sym;
});
Clazz.defineMethod (c$, "error_recovery", 
function (debug) {
if (debug) this.debug_message ("# Attempting error recovery");
if (!this.find_recovery_config (debug)) {
if (debug) this.debug_message ("# Error recovery fails");
return false;
}this.read_lookahead ();
for (; ; ) {
if (debug) this.debug_message ("# Trying to parse ahead");
if (this.try_parse_ahead (debug)) {
break;
}if (this.lookahead[0].sym == this.EOF_sym ()) {
if (debug) this.debug_message ("# Error recovery fails at EOF");
return false;
}if (debug) this.debug_message ("# Consuming Symbol #" + this.cur_err_token ().sym);
this.restart_lookahead ();
}
if (debug) this.debug_message ("# Parse-ahead ok, going back to normal parse");
this.parse_lookahead (debug);
return true;
}, "~B");
Clazz.defineMethod (c$, "shift_under_error", 
function () {
return this.get_action ((this.stack.peek ()).parse_state, this.error_sym ()) > 0;
});
Clazz.defineMethod (c$, "find_recovery_config", 
function (debug) {
var error_token;
var act;
if (debug) this.debug_message ("# Finding recovery state on stack");
var right_pos = (this.stack.peek ()).right;
var left_pos = (this.stack.peek ()).left;
while (!this.shift_under_error ()) {
if (debug) this.debug_message ("# Pop stack by one, state was # " + (this.stack.peek ()).parse_state);
left_pos = (this.stack.pop ()).left;
this.tos--;
if (this.stack.empty ()) {
if (debug) this.debug_message ("# No recovery state found on stack");
return false;
}}
act = this.get_action ((this.stack.peek ()).parse_state, this.error_sym ());
if (debug) {
this.debug_message ("# Recover state found (#" + (this.stack.peek ()).parse_state + ")");
this.debug_message ("# Shifting on error to state #" + (act - 1));
}error_token =  new java_cup.runtime.Symbol (this.error_sym (), left_pos, right_pos);
error_token.parse_state = act - 1;
error_token.used_by_parser = true;
this.stack.push (error_token);
this.tos++;
return true;
}, "~B");
Clazz.defineMethod (c$, "read_lookahead", 
function () {
this.lookahead =  new Array (this.error_sync_size ());
for (var i = 0; i < this.error_sync_size (); i++) {
this.lookahead[i] = this.cur_token;
this.cur_token = this.scan ();
}
this.lookahead_pos = 0;
});
Clazz.defineMethod (c$, "cur_err_token", 
function () {
return this.lookahead[this.lookahead_pos];
});
Clazz.defineMethod (c$, "advance_lookahead", 
function () {
this.lookahead_pos++;
return this.lookahead_pos < this.error_sync_size ();
});
Clazz.defineMethod (c$, "restart_lookahead", 
function () {
for (var i = 1; i < this.error_sync_size (); i++) this.lookahead[i - 1] = this.lookahead[i];

this.cur_token = this.scan ();
this.lookahead[this.error_sync_size () - 1] = this.cur_token;
this.lookahead_pos = 0;
});
Clazz.defineMethod (c$, "try_parse_ahead", 
function (debug) {
var act;
var lhs;
var rhs_size;
var vstack =  new java_cup.runtime.virtual_parse_stack (this.stack);
for (; ; ) {
act = this.get_action (vstack.top (), this.cur_err_token ().sym);
if (act == 0) return false;
if (act > 0) {
vstack.push (act - 1);
if (debug) this.debug_message ("# Parse-ahead shifts Symbol #" + this.cur_err_token ().sym + " into state #" + (act - 1));
if (!this.advance_lookahead ()) return true;
} else {
if ((-act) - 1 == this.start_production ()) {
if (debug) this.debug_message ("# Parse-ahead accepts");
return true;
}lhs = this.production_tab[(-act) - 1][0];
rhs_size = this.production_tab[(-act) - 1][1];
for (var i = 0; i < rhs_size; i++) vstack.pop ();

if (debug) this.debug_message ("# Parse-ahead reduces: handle size = " + rhs_size + " lhs = #" + lhs + " from state #" + vstack.top ());
vstack.push (this.get_reduce (vstack.top (), lhs));
if (debug) this.debug_message ("# Goto state #" + vstack.top ());
}}
}, "~B");
Clazz.defineMethod (c$, "parse_lookahead", 
function (debug) {
var act;
var lhs_sym = null;
var handle_size;
var lhs_sym_num;
this.lookahead_pos = 0;
if (debug) {
this.debug_message ("# Reparsing saved input with actions");
this.debug_message ("# Current Symbol is #" + this.cur_err_token ().sym);
this.debug_message ("# Current state is #" + (this.stack.peek ()).parse_state);
}while (!this._done_parsing) {
act = this.get_action ((this.stack.peek ()).parse_state, this.cur_err_token ().sym);
if (act > 0) {
this.cur_err_token ().parse_state = act - 1;
this.cur_err_token ().used_by_parser = true;
if (debug) this.debug_shift (this.cur_err_token ());
this.stack.push (this.cur_err_token ());
this.tos++;
if (!this.advance_lookahead ()) {
if (debug) this.debug_message ("# Completed reparse");
return;
}if (debug) this.debug_message ("# Current Symbol is #" + this.cur_err_token ().sym);
} else if (act < 0) {
lhs_sym = this.do_action ((-act) - 1, this, this.stack, this.tos);
lhs_sym_num = this.production_tab[(-act) - 1][0];
handle_size = this.production_tab[(-act) - 1][1];
if (debug) this.debug_reduce ((-act) - 1, lhs_sym_num, handle_size);
for (var i = 0; i < handle_size; i++) {
this.stack.pop ();
this.tos--;
}
act = this.get_reduce ((this.stack.peek ()).parse_state, lhs_sym_num);
lhs_sym.parse_state = act;
lhs_sym.used_by_parser = true;
this.stack.push (lhs_sym);
this.tos++;
if (debug) this.debug_message ("# Goto state #" + act);
} else if (act == 0) {
this.report_fatal_error ("Syntax error", lhs_sym);
return;
}}
}, "~B");
c$.unpackFromStrings = Clazz.defineMethod (c$, "unpackFromStrings", 
function (sa) {
var s;
if (sa.length > 1) {
var sb = JU.SB.newS (sa[0]);
for (var i = 1; i < sa.length; i++) sb.append (sa[i]);

s = sb.toString ();
} else {
s = sa[0];
}var n = 0;
var size1 = ((s.codePointAt (n)) << 16) | (s.codePointAt (n + 1));
n += 2;
var result = JU.AU.newShort2 (size1);
for (var i = 0; i < size1; i++) {
var size2 = ((s.codePointAt (n)) << 16) | (s.codePointAt (n + 1));
n += 2;
result[i] =  Clazz.newShortArray (size2, 0);
for (var j = 0; j < size2; j++) {
var v = (s.codePointAt (n++) - 2);
if (v > 32767) v -= 65536;
result[i][j] = v;
}
}
return result;
}, "~A");
Clazz.defineStatics (c$,
"_error_sync_size", 3);
});
