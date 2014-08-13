Clazz.declarePackage ("astex.util");
Clazz.load (null, "astex.util.Format", ["java.lang.Character", "$.Double", "$.IllegalArgumentException", "JU.SB"], function () {
c$ = Clazz.decorateAsClass (function () {
this.width = 0;
this.precision = 0;
this.pre = null;
this.post = null;
this.leading_zeroes = false;
this.show_plus = false;
this.alternate = false;
this.show_space = false;
this.left_align = false;
this.fmt = '\0';
Clazz.instantialize (this, arguments);
}, astex.util, "Format");
Clazz.makeConstructor (c$, 
function (s) {
this.width = 0;
this.precision = -1;
this.pre = "";
this.post = "";
this.leading_zeroes = false;
this.show_plus = false;
this.alternate = false;
this.show_space = false;
this.left_align = false;
this.fmt = ' ';
var length = s.length;
var parse_state = 0;
var i = 0;
while (parse_state == 0) {
if (i >= length) parse_state = 5;
 else if (s.charAt (i) == '%') {
if (i < length - 1) {
if (s.charAt (i + 1) == '%') {
this.pre = this.pre + '%';
i++;
} else parse_state = 1;
} else throw  new IllegalArgumentException ();
} else this.pre = this.pre + s.charAt (i);
i++;
}
while (parse_state == 1) {
if (i >= length) parse_state = 5;
 else if (s.charAt (i) == ' ') this.show_space = true;
 else if (s.charAt (i) == '-') this.left_align = true;
 else if (s.charAt (i) == '+') this.show_plus = true;
 else if (s.charAt (i) == '0') this.leading_zeroes = true;
 else if (s.charAt (i) == '#') this.alternate = true;
 else {
parse_state = 2;
i--;
}i++;
}
while (parse_state == 2) {
if (i >= length) parse_state = 5;
 else if ('0' <= s.charAt (i) && s.charAt (i) <= '9') {
this.width = this.width * 10 + s.charCodeAt (i) - 48;
i++;
} else if (s.charAt (i) == '.') {
parse_state = 3;
this.precision = 0;
i++;
} else parse_state = 4;
}
while (parse_state == 3) {
if (i >= length) parse_state = 5;
 else if ('0' <= s.charAt (i) && s.charAt (i) <= '9') {
this.precision = this.precision * 10 + s.charCodeAt (i) - 48;
i++;
} else parse_state = 4;
}
if (parse_state == 4) {
if (i >= length) parse_state = 5;
 else this.fmt = s.charAt (i);
i++;
}if (i < length) this.post = s.substring (i, length);
}, "~S");
c$.print = Clazz.defineMethod (c$, "print", 
function (s, fmt, x) {
s.print ( new astex.util.Format (fmt).format (x));
}, "java.io.PrintStream,~S,~N");
c$.print = Clazz.defineMethod (c$, "print", 
function (s, fmt, x) {
s.print ( new astex.util.Format (fmt).format (x));
}, "java.io.PrintStream,~S,~N");
c$.print = Clazz.defineMethod (c$, "print", 
function (s, fmt, x) {
s.print ( new astex.util.Format (fmt).format (x));
}, "java.io.PrintStream,~S,~S");
c$.print = Clazz.defineMethod (c$, "print", 
function (s, fmt, x) {
s.print ( new astex.util.Format (fmt).format (x));
}, "java.io.PrintStream,~S,~S");
c$.atoi = Clazz.defineMethod (c$, "atoi", 
function (s) {
return astex.util.Format.atol (s);
}, "~S");
c$.atol = Clazz.defineMethod (c$, "atol", 
function (s) {
var i = 0;
while (i < s.length && Character.isWhitespace (s.charAt (i))) i++;

if (i < s.length && s.charAt (i) == '0') {
if (i + 1 < s.length && (s.charAt (i + 1) == 'x' || s.charAt (i + 1) == 'X')) return astex.util.Format.parseLong (s.substring (i + 2), 16);
return astex.util.Format.parseLong (s, 8);
}return astex.util.Format.parseLong (s, 10);
}, "~S");
c$.parseLong = Clazz.defineMethod (c$, "parseLong", 
 function (s, base) {
var i = 0;
var sign = 1;
var r = 0;
while (i < s.length && Character.isWhitespace (s.charAt (i))) i++;

if (i < s.length && s.charAt (i) == '-') {
sign = -1;
i++;
} else if (i < s.length && s.charAt (i) == '+') {
i++;
}while (i < s.length) {
var ch = s.charAt (i);
if ('0' <= ch && ch.charCodeAt (0) < 48 + base) r = r * base + ch.charCodeAt (0) - 48;
 else if ('A' <= ch && ch.charCodeAt (0) < 65 + base - 10) r = r * base + ch.charCodeAt (0) - 65 + 10;
 else if ('a' <= ch && ch.charCodeAt (0) < 97 + base - 10) r = r * base + ch.charCodeAt (0) - 97 + 10;
 else return r * sign;
i++;
}
return r * sign;
}, "~S,~N");
c$.atof = Clazz.defineMethod (c$, "atof", 
function (s) {
var i = 0;
var sign = 1;
var r = 0;
var p = 1;
var state = 0;
while (i < s.length && Character.isWhitespace (s.charAt (i))) i++;

if (i < s.length && s.charAt (i) == '-') {
sign = -1;
i++;
} else if (i < s.length && s.charAt (i) == '+') {
i++;
}while (i < s.length) {
var ch = s.charAt (i);
if ('0' <= ch && ch <= '9') {
if (state == 0) r = r * 10 + ch.charCodeAt (0) - 48;
 else if (state == 1) {
p = p / 10;
r = r + p * (ch.charCodeAt (0) - 48);
}} else if (ch == '.') {
if (state == 0) state = 1;
 else return sign * r;
} else if (ch == 'e' || ch == 'E') {
var e = astex.util.Format.parseLong (s.substring (i + 1), 10);
return sign * r * Math.pow (10, e);
} else return sign * r;
i++;
}
return sign * r;
}, "~S");
Clazz.defineMethod (c$, "format", 
function (x) {
if (Double.isInfinite (x)) {
return "Infinity";
}var r;
if (this.precision < 0) this.precision = 6;
var s = 1;
if (x < 0) {
x = -x;
s = -1;
}if (this.fmt == 'f') r = this.fixed_format (x);
 else if (this.fmt == 'e' || this.fmt == 'E' || this.fmt == 'g' || this.fmt == 'G') r = this.exp_format (x);
 else throw  new IllegalArgumentException ();
if (Double.isInfinite (x)) {
return "Infinity";
}return this.pad (this.sign (s, r));
}, "~N");
Clazz.defineMethod (c$, "format", 
function (x) {
var r;
var s = 0;
if (this.fmt == 'd' || this.fmt == 'i') {
if (x < 0) {
r = ("" + x).substring (1);
s = -1;
} else {
r = "" + x;
s = 1;
}} else if (this.fmt == 'o') r = astex.util.Format.convert (x, 3, 7, "01234567");
 else if (this.fmt == 'x') r = astex.util.Format.convert (x, 4, 15, "0123456789abcdef");
 else if (this.fmt == 'X') r = astex.util.Format.convert (x, 4, 15, "0123456789ABCDEF");
 else throw  new IllegalArgumentException ();
return this.pad (this.sign (s, r));
}, "~N");
Clazz.defineMethod (c$, "format", 
function (c) {
if (this.fmt != 'c') throw  new IllegalArgumentException ();
var r = "" + c;
return this.pad (r);
}, "~S");
Clazz.defineMethod (c$, "format", 
function (s) {
if (this.fmt != 's') throw  new IllegalArgumentException ();
if (this.precision >= 0 && this.precision < s.length) s = s.substring (0, this.precision);
return this.pad (s);
}, "~S");
c$.repeat = Clazz.defineMethod (c$, "repeat", 
 function (c, n) {
if (n <= 0) return "";
var s =  new JU.SB ();
for (var i = 0; i < n; i++) s.appendC (c);

return s.toString ();
}, "~S,~N");
c$.convert = Clazz.defineMethod (c$, "convert", 
 function (x, n, m, d) {
if (x == 0) return "0";
var r = "";
while (x != 0) {
r = d.charAt ((x & m)) + r;
x = x >>> n;
}
return r;
}, "~N,~N,~N,~S");
Clazz.defineMethod (c$, "pad", 
 function (r) {
var p = astex.util.Format.repeat (' ', this.width - r.length);
if (this.left_align) return this.pre + r + p + this.post;
return this.pre + p + r + this.post;
}, "~S");
Clazz.defineMethod (c$, "sign", 
 function (s, r) {
var p = "";
if (s < 0) p = "-";
 else if (s > 0) {
if (this.show_plus) p = "+";
 else if (this.show_space) p = " ";
} else {
if (this.fmt == 'o' && this.alternate && r.length > 0 && r.charAt (0) != '0') p = "0";
 else if (this.fmt == 'x' && this.alternate) p = "0x";
 else if (this.fmt == 'X' && this.alternate) p = "0X";
}var w = 0;
if (this.leading_zeroes) w = this.width;
 else if ((this.fmt == 'd' || this.fmt == 'i' || this.fmt == 'x' || this.fmt == 'X' || this.fmt == 'o') && this.precision > 0) w = this.precision;
return p + astex.util.Format.repeat ('0', w - p.length - r.length) + r;
}, "~N,~S");
Clazz.defineMethod (c$, "fixed_format", 
 function (d) {
var removeTrailing = (this.fmt == 'G' || this.fmt == 'g') && !this.alternate;
if (d > 0x7FFFFFFFFFFFFFFF) return this.exp_format (d);
if (this.precision == 0) return Clazz.doubleToLong (d + 0.5) + (removeTrailing ? "" : ".");
var whole = Clazz.doubleToLong (d);
var fr = d - whole;
if (fr >= 1 || fr < 0) return this.exp_format (d);
var factor = 1;
var leading_zeroes = "";
for (var i = 1; i <= this.precision && factor <= 0x7FFFFFFFFFFFFFFF; i++) {
factor *= 10;
leading_zeroes = leading_zeroes + "0";
}
var l = Clazz.doubleToLong (factor * fr + 0.5);
if (l >= factor) {
l = 0;
whole++;
}var z = leading_zeroes + l;
z = "." + z.substring (z.length - this.precision, z.length);
if (removeTrailing) {
var t = z.length - 1;
while (t >= 0 && z.charAt (t) == '0') t--;

if (t >= 0 && z.charAt (t) == '.') t--;
z = z.substring (0, t + 1);
}return whole + z;
}, "~N");
Clazz.defineMethod (c$, "exp_format", 
 function (d) {
var f = "";
var e = 0;
var dd = d;
var factor = 1;
if (d != 0) {
while (dd > 10) {
e++;
factor /= 10;
dd = dd / 10;
}
while (dd < 1) {
e--;
factor *= 10;
dd = dd * 10;
}
}if ((this.fmt == 'g' || this.fmt == 'G') && e >= -4 && e < this.precision) return this.fixed_format (d);
d = d * factor;
f = f + this.fixed_format (d);
if (this.fmt == 'e' || this.fmt == 'g') f = f + "e";
 else f = f + "E";
var p = "000";
if (e >= 0) {
f = f + "+";
p = p + e;
} else {
f = f + "-";
p = p + (-e);
}return f + p.substring (p.length - 3, p.length);
}, "~N");
});
