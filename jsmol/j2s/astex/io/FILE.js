Clazz.declarePackage ("astex.io");
Clazz.load (["java.io.InputStream", "astex.awtjs2d.JSFile", "astex.util.Properties", "java.io.FileOutputStream", "JU.PT"], "astex.io.FILE", ["astex.api.Interface", "astex.awtjs2d.Platform", "astex.util.Log", "$.Settings", "astex.viewer.Viewer", "java.io.BufferedInputStream", "$.BufferedReader", "$.ByteArrayInputStream", "$.ByteArrayOutputStream", "$.File", "$.FileInputStream", "$.InputStreamReader", "java.lang.Double", "$.IllegalArgumentException", "java.net.URL", "java.util.StringTokenizer", "JU.Rdr", "$.SB"], function () {
c$ = Clazz.decorateAsClass (function () {
this.buffer = null;
this.charactersInBuffer = 1;
this.inputStream = null;
this.nextCharacter = 1;
this.fieldsDetermined = false;
this.fieldCount = 0;
this.fieldStartPosition = null;
this.fieldLength = null;
this.lineBuffer = null;
this.lineLength = 0;
this.str = null;
this.lines = null;
this.linePt = 0;
this.line = null;
this.fields = null;
this.outputStream = null;
this.eol0 = ('\n').charCodeAt (0);
this.eol1 = 0;
this.eolLength = 1;
this.width = 0;
this.precision = -1;
this.pre = null;
this.post = null;
this.preCount = 0;
this.postCount = 0;
this.leading_zeroes = false;
this.show_plus = false;
this.alternate = false;
this.show_space = false;
this.left_align = false;
this.fmt = ' ';
this.tb = null;
this.ntb = 0;
this.ntbStart = 0;
this.ntbE = 0;
this.autoFlush = false;
this.prevFormat = null;
this.errorMsg = null;
Clazz.instantialize (this, arguments);
}, astex.io, "FILE", java.io.InputStream);
Clazz.prepareFields (c$, function () {
this.buffer =  Clazz.newByteArray (2049, 0);
this.fieldStartPosition =  Clazz.newIntArray (astex.io.FILE.MaxFields, 0);
this.fieldLength =  Clazz.newIntArray (astex.io.FILE.MaxFields, 0);
this.lineBuffer =  Clazz.newByteArray (astex.io.FILE.lineBufferSize, 0);
this.pre =  Clazz.newByteArray (2048, 0);
this.post =  Clazz.newByteArray (2048, 0);
this.tb =  Clazz.newByteArray (2048, 0);
});
Clazz.defineMethod (c$, "setautoFlush", 
function (f) {
this.autoFlush = f;
}, "~B");
c$.sprintD = Clazz.defineMethod (c$, "sprintD", 
function (f, d) {
astex.io.FILE.spr.parseFormat (f);
astex.io.FILE.spr.formatD (d);
return astex.io.FILE.spr.createString ();
}, "~S,~N");
c$.sprintI = Clazz.defineMethod (c$, "sprintI", 
function (f, d) {
astex.io.FILE.spr.parseFormat (f);
astex.io.FILE.spr.formatL (d);
return astex.io.FILE.spr.createString ();
}, "~S,~N");
c$.sprintS = Clazz.defineMethod (c$, "sprintS", 
function (f, d) {
astex.io.FILE.spr.parseFormat (f);
astex.io.FILE.spr.formatS (d);
return astex.io.FILE.spr.createString ();
}, "~S,~S");
Clazz.defineMethod (c$, "createString", 
 function () {
var localBuffer =  Clazz.newByteArray (2048, 0);
var localtb = this.tb;
var nc = 0;
for (var i = 0; i < this.preCount; i++) {
localBuffer[nc++] = this.pre[i];
}
if (!this.left_align) {
nc = this.repeat (32, this.width - (this.ntb - this.ntbStart) - this.ntbE, localBuffer, nc);
for (var i = this.ntb - 1; i >= this.ntbStart; i--) {
localBuffer[nc++] = localtb[i];
}
for (var i = this.ntbE - 1; i >= 0; i--) {
localBuffer[nc++] = localtb[i];
}
} else {
for (var i = this.ntb - 1; i >= this.ntbStart; i--) {
localBuffer[nc++] = localtb[i];
}
for (var i = this.ntbE - 1; i >= 0; i--) {
localBuffer[nc++] = localtb[i];
}
nc = this.repeat (32, this.width - (this.ntb - this.ntbStart) - this.ntbE, localBuffer, nc);
}for (var i = 0; i < this.postCount; i++) {
localBuffer[nc++] = this.post[i];
}
return  String.instantialize (localBuffer, 0, nc);
});
Clazz.defineMethod (c$, "printC", 
function (c) {
this.flushIfFull (1);
this.buffer[this.charactersInBuffer++] = (c).charCodeAt (0);
}, "~S");
Clazz.defineMethod (c$, "printWPD", 
function (w, p, d) {
this.width = w;
this.precision = p;
this.leading_zeroes = false;
this.show_plus = false;
this.alternate = false;
this.show_space = false;
this.left_align = false;
this.fmt = 'f';
this.preCount = 0;
this.postCount = 0;
this.formatD (d);
this.copyAll ();
}, "~N,~N,~N");
Clazz.defineMethod (c$, "printWI", 
function (w, d) {
this.width = w;
this.precision = -1;
this.leading_zeroes = false;
this.show_plus = false;
this.alternate = false;
this.show_space = false;
this.left_align = false;
this.fmt = 'd';
this.preCount = 0;
this.postCount = 0;
this.formatL (d);
this.copyAll ();
}, "~N,~N");
Clazz.defineMethod (c$, "printFD3", 
function (f, d1, d2, d3) {
if (this.prevFormat !== f) {
this.parseFormat (f);
f.intern ();
this.prevFormat = f;
}this.formatD (d1);
this.copyAll ();
this.formatD (d2);
this.copyAll ();
this.formatD (d3);
this.copyAll ();
}, "~S,~N,~N,~N");
Clazz.defineMethod (c$, "printFI3", 
function (f, d1, d2, d3) {
if (this.prevFormat !== f) {
this.parseFormat (f);
f.intern ();
this.prevFormat = f;
}this.formatL (d1);
this.copyAll ();
this.formatL (d2);
this.copyAll ();
this.formatL (d3);
this.copyAll ();
}, "~S,~N,~N,~N");
Clazz.defineMethod (c$, "printS", 
function (s) {
var len = s.length;
var b = 0;
this.flushIfFull (len);
for (var i = 0; i < len; i++) {
b = (s.charAt (i)).charCodeAt (0);
this.buffer[this.charactersInBuffer++] = b;
}
if (this.autoFlush) this.flush ();
}, "~S");
Clazz.defineMethod (c$, "println", 
function (s) {
var len = s.length;
var b = 0;
this.flushIfFull (len + this.eolLength);
for (var i = 0; i < len; i++) {
b = (s.charAt (i)).charCodeAt (0);
this.buffer[this.charactersInBuffer++] = b;
}
this.eol ();
if (this.autoFlush) this.flush ();
}, "~S");
Clazz.defineMethod (c$, "printFS", 
function (f, s) {
if (this.prevFormat !== f) {
this.parseFormat (f);
f.intern ();
this.prevFormat = f;
}this.formatS (s);
if (this.autoFlush) this.flush ();
}, "~S,~S");
Clazz.defineMethod (c$, "printFC", 
function (f, c) {
if (this.prevFormat !== f) {
this.parseFormat (f);
f.intern ();
this.prevFormat = f;
}this.formatC (c);
if (this.autoFlush) this.flush ();
}, "~S,~S");
Clazz.defineMethod (c$, "printFI", 
function (f, d) {
if (this.prevFormat !== f) {
this.parseFormat (f);
f.intern ();
this.prevFormat = f;
}this.formatL (d);
this.copyAll ();
}, "~S,~N");
Clazz.defineMethod (c$, "printFD", 
function (f, d) {
if (this.prevFormat !== f) {
this.parseFormat (f);
f.intern ();
this.prevFormat = f;
}this.formatD (d);
this.copyAll ();
}, "~S,~N");
Clazz.defineMethod (c$, "formatS", 
function (s) {
if (this.fmt != 's') throw  new IllegalArgumentException ();
this.ntb = 0;
this.ntbStart = 0;
this.ntbE = s.length;
var n = this.preCount + this.postCount + this.width + this.ntbE;
this.flushIfFull (n);
this.preFormat ();
if (!this.left_align) {
this.pad ();
this.copyString (s, this.ntbE);
} else {
this.copyString (s, this.ntbE);
this.pad ();
}this.postFormat ();
}, "~S");
Clazz.defineMethod (c$, "formatL", 
function (d) {
var s = 0;
this.ntb = 0;
this.ntbStart = 0;
this.ntbE = 0;
if (this.fmt == 'd' || this.fmt == 'i') {
if (d < 0) s = -1;
 else s = 1;
}if (this.fmt == 'd' || this.fmt == 'i') this.convert (d, astex.io.FILE.based, 10);
 else if (this.fmt == 'o') this.convert (d, astex.io.FILE.baseo, 8);
 else if (this.fmt == 'x') this.convert (d, astex.io.FILE.basex, 16);
 else if (this.fmt == 'X') this.convert (d, astex.io.FILE.baseX, 16);
 else throw  new IllegalArgumentException ();
this.sign (s);
}, "~N");
Clazz.defineMethod (c$, "formatD", 
function (x) {
var localtb = this.tb;
this.ntb = 0;
this.ntbStart = 0;
this.ntbE = 0;
var s = 1;
if (Double.isInfinite (x)) {
if (x == -Infinity) s = -1;
 else s = 1;
localtb[this.ntb++] = ('f').charCodeAt (0);
localtb[this.ntb++] = ('n').charCodeAt (0);
localtb[this.ntb++] = ('I').charCodeAt (0);
this.ntbStart = this.ntbE;
this.sign (s);
return;
}if (Double.isNaN (x)) {
localtb[this.ntb++] = ('N').charCodeAt (0);
localtb[this.ntb++] = ('a').charCodeAt (0);
localtb[this.ntb++] = ('N').charCodeAt (0);
this.ntbStart = this.ntbE;
return;
}if (this.precision < 0) this.precision = 6;
if (x < 0) {
x = -x;
s = -1;
}if (this.fmt == 'f') {
this.fixedFormat (x);
} else if (this.fmt == 'e' || this.fmt == 'E' || this.fmt == 'g' || this.fmt == 'G') {
this.expFormat (x);
} else {
System.out.println ("formatD - illegal format string (should be one of efgEG): " + this.fmt);
throw  new IllegalArgumentException ();
}if (Double.isInfinite (x)) {
localtb[this.ntb++] = ('f').charCodeAt (0);
localtb[this.ntb++] = ('n').charCodeAt (0);
localtb[this.ntb++] = ('I').charCodeAt (0);
this.ntbStart = this.ntbE;
this.sign (s);
return;
}this.sign (s);
}, "~N");
Clazz.defineMethod (c$, "formatC", 
function (c) {
if (this.fmt != 'c') throw  new IllegalArgumentException ();
this.ntb = 0;
this.ntbStart = 0;
this.ntbE = 1;
var n = this.preCount + this.postCount + this.width - this.ntbE;
this.flushIfFull (n);
this.preFormat ();
if (!this.left_align) {
this.pad ();
this.buffer[this.charactersInBuffer++] = (c).charCodeAt (0);
} else {
this.buffer[this.charactersInBuffer++] = (c).charCodeAt (0);
this.pad ();
}this.postFormat ();
}, "~S");
Clazz.defineMethod (c$, "copyAll", 
 function () {
var n = this.preCount + this.postCount + this.width + (this.ntb - this.ntbStart - this.ntbE);
this.flushIfFull (n);
this.preFormat ();
if (!this.left_align) {
this.pad ();
this.copyNumber ();
} else {
this.copyNumber ();
this.pad ();
}this.postFormat ();
if (this.autoFlush) this.flush ();
});
Clazz.defineMethod (c$, "copyNumber", 
 function () {
var localBuffer = this.buffer;
var localtb = this.tb;
for (var i = this.ntb - 1; i >= this.ntbStart; i--) {
localBuffer[this.charactersInBuffer++] = localtb[i];
}
for (var i = this.ntbE - 1; i >= 0; i--) {
localBuffer[this.charactersInBuffer++] = localtb[i];
}
});
Clazz.defineMethod (c$, "preFormat", 
 function () {
var localBuffer = this.buffer;
for (var i = 0; i < this.preCount; i++) {
localBuffer[this.charactersInBuffer++] = this.pre[i];
}
});
Clazz.defineMethod (c$, "postFormat", 
 function () {
var localBuffer = this.buffer;
for (var i = 0; i < this.postCount; i++) {
localBuffer[this.charactersInBuffer++] = this.post[i];
}
});
Clazz.defineMethod (c$, "pad", 
 function () {
this.charactersInBuffer = this.repeat (32, this.width - (this.ntb - this.ntbStart) - this.ntbE, this.buffer, this.charactersInBuffer);
});
Clazz.defineMethod (c$, "repeat", 
 function (b, n, bArray, nb) {
if (n <= 0) return nb;
for (var i = 0; i < n; i++) {
bArray[nb++] = b;
}
return nb;
}, "~N,~N,~A,~N");
Clazz.defineMethod (c$, "copyString", 
 function (s, len) {
for (var i = 0; i < len; i++) {
this.buffer[this.charactersInBuffer++] = (s.charAt (i)).charCodeAt (0);
}
}, "~S,~N");
Clazz.defineMethod (c$, "fixedFormat", 
 function (d) {
var localtb = this.tb;
var removeTrailing = (this.fmt == 'G' || this.fmt == 'g') && !this.alternate;
if (d > 0x7FFFFFFFFFFFFFFF) {
this.expFormat (d);
return;
}if (this.precision == 0) {
if (!removeTrailing) {
localtb[this.ntb++] = 46;
}this.convert (Clazz.doubleToLong (d + 0.5), astex.io.FILE.based, 10);
this.ntbStart = 0;
this.ntbE = 0;
return;
}var whole = Clazz.doubleToLong (d);
var fr = d - whole;
if (fr >= 1 || fr < 0) {
this.expFormat (d);
return;
}var factor = 1;
for (var i = 1; i <= this.precision && factor <= 0x7FFFFFFFFFFFFFFF; i++) {
factor *= 10;
}
var l = Clazz.doubleToLong (factor * fr + 0.5);
if (l >= factor) {
l = 0;
whole++;
}this.convert (l, astex.io.FILE.based, 10);
var realLeadingZeros = this.precision - this.ntb + this.ntbE;
for (var i = 0; i < realLeadingZeros; i++) {
localtb[this.ntb++] = 48;
}
localtb[this.ntb++] = 46;
this.ntbStart = this.ntbE;
if (removeTrailing) {
while (this.ntbStart < this.ntb && localtb[this.ntbStart] == 48) this.ntbStart++;

if (this.ntbStart < this.ntb && localtb[this.ntbStart] == 46) this.ntbStart++;
}this.convert (whole, astex.io.FILE.based, 10);
}, "~N");
Clazz.defineMethod (c$, "expFormat", 
 function (d) {
var e = 0;
var dd = d;
var factor = 1;
var localtb = this.tb;
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
}if ((this.fmt == 'g' || this.fmt == 'G') && e >= -4 && e < this.precision) {
this.fixedFormat (d);
return;
}if (e >= 0) {
this.convert (e, astex.io.FILE.based, 10);
if (this.ntb < 3) {
for (var i = this.ntb; i < 3; i++) {
localtb[this.ntb++] = 48;
}
}localtb[this.ntb++] = 43;
} else {
this.convert (-e, astex.io.FILE.based, 10);
if (this.ntb < 3) {
for (var i = this.ntb; i < 3; i++) {
localtb[this.ntb++] = 48;
}
}localtb[this.ntb++] = 45;
}if (this.fmt == 'e' || this.fmt == 'g') localtb[this.ntb++] = 101;
 else localtb[this.ntb++] = 69;
this.ntbE = this.ntb;
d = d * factor;
this.fixedFormat (d);
}, "~N");
Clazz.defineMethod (c$, "convert", 
 function (x, b, base) {
var posx;
var localtb = this.tb;
if (x == -9223372036854775808) {
localtb[this.ntb++] = b[8];
localtb[this.ntb++] = b[0];
localtb[this.ntb++] = b[8];
localtb[this.ntb++] = b[5];
localtb[this.ntb++] = b[7];
localtb[this.ntb++] = b[7];
localtb[this.ntb++] = b[4];
localtb[this.ntb++] = b[5];
localtb[this.ntb++] = b[8];
localtb[this.ntb++] = b[6];
localtb[this.ntb++] = b[3];
localtb[this.ntb++] = b[0];
localtb[this.ntb++] = b[2];
localtb[this.ntb++] = b[7];
localtb[this.ntb++] = b[3];
localtb[this.ntb++] = b[3];
localtb[this.ntb++] = b[2];
localtb[this.ntb++] = b[2];
localtb[this.ntb++] = b[9];
return;
}if (x < 0) posx = -x;
 else posx = x;
if (posx == 0) {
localtb[this.ntb++] = b[0];
return;
}var m;
while (posx != 0) {
m = (posx % base);
posx /= base;
localtb[this.ntb++] = b[m];
}
}, "~N,~A,~N");
Clazz.defineMethod (c$, "sign", 
 function (s) {
var signLength = 0;
var signByte1 = 32;
var signByte2 = 32;
var localtb = this.tb;
if (s < 0) {
signLength = 1;
signByte1 = 45;
} else if (s > 0) {
if (this.show_plus) {
signLength = 1;
signByte1 = 43;
} else if (this.show_space) {
signLength = 1;
signByte1 = 32;
}} else {
if (this.fmt == 'o' && this.alternate && this.ntb > 0 && localtb[this.ntb - 1] != 48) {
signLength = 1;
signByte1 = 48;
} else if (this.fmt == 'x' && this.alternate) {
signLength = 2;
signByte2 = 48;
signByte1 = 120;
} else if (this.fmt == 'X' && this.alternate) {
signLength = 2;
signByte2 = 48;
signByte1 = 88;
}}var w = 0;
if (this.leading_zeroes) w = this.width;
 else if ((this.fmt == 'd' || this.fmt == 'i' || this.fmt == 'x' || this.fmt == 'X' || this.fmt == 'o') && this.precision > 0) w = this.precision;
this.ntb = this.repeat (48, w - (this.ntb - this.ntbStart) - this.ntbE - signLength, localtb, this.ntb);
if (signLength > 0) {
localtb[this.ntb++] = signByte1;
if (signLength > 1) {
localtb[this.ntb++] = signByte2;
}}}, "~N");
Clazz.defineMethod (c$, "parseFormat", 
 function (s) {
this.width = 0;
this.precision = -1;
this.leading_zeroes = false;
this.show_plus = false;
this.alternate = false;
this.show_space = false;
this.left_align = false;
this.fmt = ' ';
this.preCount = 0;
this.postCount = 0;
var length = s.length;
var parse_state = 0;
var i = 0;
while (parse_state == 0) {
var ci = s.charAt (i);
if (i >= length) parse_state = 5;
 else if (ci == '%') {
if (i < length - 1) {
if (s.charAt (i + 1) == '%') {
this.pre[this.preCount++] = ('%').charCodeAt (0);
i++;
} else {
parse_state = 1;
}} else {
throw  new IllegalArgumentException ();
}} else {
this.pre[this.preCount++] = (ci).charCodeAt (0);
}i++;
}
while (parse_state == 1) {
var ci = s.charAt (i);
if (i >= length) parse_state = 5;
 else if (ci == ' ') this.show_space = true;
 else if (ci == '-') this.left_align = true;
 else if (ci == '+') this.show_plus = true;
 else if (ci == '0') this.leading_zeroes = true;
 else if (ci == '#') this.alternate = true;
 else {
parse_state = 2;
i--;
}i++;
}
while (parse_state == 2) {
var ci = s.charAt (i);
if (i >= length) parse_state = 5;
 else if ('0' <= ci && ci <= '9') {
this.width = this.width * 10 + ci.charCodeAt (0) - 48;
i++;
} else if (ci == '.') {
parse_state = 3;
this.precision = 0;
i++;
} else parse_state = 4;
}
while (parse_state == 3) {
var ci = s.charAt (i);
if (i >= length) {
parse_state = 5;
} else if ('0' <= ci && ci <= '9') {
this.precision = this.precision * 10 + ci.charCodeAt (0) - 48;
i++;
} else {
parse_state = 4;
}}
if (parse_state == 4) {
if (i >= length) parse_state = 5;
 else this.fmt = s.charAt (i);
i++;
}if (i < length) {
for (var j = i; j < length; j++) {
this.post[this.postCount++] = (s.charAt (j)).charCodeAt (0);
}
}}, "~S");
Clazz.defineMethod (c$, "setOutputStream", 
function (os) {
this.outputStream = os;
}, "java.io.OutputStream");
Clazz.defineMethod (c$, "setEolIdentifier", 
function (opsys) {
switch (opsys) {
case 0:
this.eolLength = 1;
this.eol0 = ('\n').charCodeAt (0);
break;
case 1:
this.eolLength = 2;
this.eol0 = ('\r').charCodeAt (0);
this.eol1 = ('\n').charCodeAt (0);
break;
case 2:
this.eolLength = 1;
this.eol0 = ('\r').charCodeAt (0);
break;
default:
this.eolLength = 1;
this.eol0 = ('\n').charCodeAt (0);
break;
}
}, "~N");
c$.createBackup = Clazz.defineMethod (c$, "createBackup", 
 function (file) {
if (astex.viewer.Viewer.$isApplet) return true;
var f =  new java.io.File (file);
if (!f.exists ()) {
return true;
}var version = 99;
var found = false;
do {
var fileVersion = file + astex.io.FILE.sprintI ("_%02d", version);
var vf =  new java.io.File (fileVersion);
if (vf.exists ()) {
found = true;
} else {
version--;
}} while (!found && version >= 0);
version++;
var fileVersion = file + astex.io.FILE.sprintI ("_%02d", version);
var newf =  new java.io.File (fileVersion);
return f.renameTo (newf);
}, "~S");
c$.openForWrite = Clazz.defineMethod (c$, "openForWrite", 
function (file) {
if (!astex.io.FILE.createBackup (file)) {
System.out.println ("Could not save backup version");
}var output =  new astex.io.FILE ();
try {
var fileOutputStream =  new java.io.FileOutputStream (file);
output.outputStream = fileOutputStream;
output.setCharactersInBuffer (0);
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
astex.io.FILE.setException (e);
output.errorMsg = "" + e;
} else {
throw e;
}
}
return output;
}, "~S");
Clazz.defineMethod (c$, "eol", 
 function () {
this.buffer[this.charactersInBuffer++] = this.eol0;
if (this.eolLength == 2) {
this.buffer[this.charactersInBuffer++] = this.eol1;
}});
Clazz.defineMethod (c$, "flushIfFull", 
 function (len) {
if (len + this.charactersInBuffer >= 2048) {
this.flush ();
}}, "~N");
Clazz.defineMethod (c$, "flush", 
 function () {
if (this.charactersInBuffer > 0) {
try {
this.outputStream.write (this.buffer, 0, this.charactersInBuffer);
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
System.out.println ( String.instantialize (this.buffer).substring (0, this.charactersInBuffer));
} else {
throw e;
}
}
this.charactersInBuffer = 0;
}});
Clazz.overrideMethod (c$, "finalize", 
function () {
if (this.outputStream != null) {
this.flush ();
}});
c$.setTryFiles = Clazz.defineMethod (c$, "setTryFiles", 
function (t) {
astex.io.FILE.tryFiles = t;
}, "~B");
c$.getTryFiles = Clazz.defineMethod (c$, "getTryFiles", 
function () {
return astex.io.FILE.tryFiles;
});
c$.setDebug = Clazz.defineMethod (c$, "setDebug", 
function (state) {
astex.io.FILE.debug = state;
}, "~B");
c$.setDocumentBase = Clazz.defineMethod (c$, "setDocumentBase", 
function (url) {
if (astex.io.FILE.debug) {
System.out.println ("setDocumentBase to " + url);
}astex.io.FILE.documentBase = url;
}, "java.net.URL");
c$.setCodeBase = Clazz.defineMethod (c$, "setCodeBase", 
function (url) {
if (astex.io.FILE.debug) {
System.out.println ("setCodeBase to " + url);
}astex.io.FILE.codeBase = url;
}, "java.net.URL");
c$.setException = Clazz.defineMethod (c$, "setException", 
 function (e) {
astex.io.FILE.exception = e;
}, "Exception");
c$.getException = Clazz.defineMethod (c$, "getException", 
function () {
return astex.io.FILE.exception;
});
Clazz.defineMethod (c$, "getInputStream", 
function () {
return this.inputStream;
});
Clazz.defineMethod (c$, "setCharactersInBuffer", 
function (i) {
this.charactersInBuffer = i;
}, "~N");
Clazz.makeConstructor (c$, 
 function () {
Clazz.superConstructor (this, astex.io.FILE, []);
});
c$.forOutput = Clazz.defineMethod (c$, "forOutput", 
 function (os) {
var f =  new astex.io.FILE ();
f.outputStream = os;
f.setCharactersInBuffer (0);
f.autoFlush = true;
return f;
}, "java.io.OutputStream");
c$.newFile = Clazz.defineMethod (c$, "newFile", 
 function (is, asInputStream) {
if (Clazz.instanceOf (is, astex.io.FILE)) return is;
var f =  new astex.io.FILE ();
if (is == null) return f;
if (Clazz.instanceOf (is, java.io.InputStream)) f.inputStream = is;
 else if (JU.PT.isAB (is)) f.inputStream =  new java.io.ByteArrayInputStream (is);
 else if (asInputStream) f.inputStream =  new java.io.ByteArrayInputStream (is.toString ().getBytes ());
 else f.str = JU.PT.rep (is.toString (), "\r\n", "\n");
astex.io.FILE.setException (null);
return f;
}, "~O,~B");
Clazz.defineMethod (c$, "fill", 
 function () {
var charactersRead;
this.buffer[0] = this.buffer[this.charactersInBuffer - 1];
try {
do {
charactersRead = this.inputStream.read (this.buffer, 1, 2048);
} while (charactersRead == 0);
if (charactersRead > 0) {
this.charactersInBuffer = charactersRead + 1;
this.nextCharacter = 1;
}} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
astex.io.FILE.setException (e);
} else {
throw e;
}
}
});
Clazz.overrideMethod (c$, "readByteAsInt", 
function () {
if (this.nextCharacter >= this.charactersInBuffer) {
this.fill ();
if (this.nextCharacter >= this.charactersInBuffer) {
return astex.io.FILE.EOF;
}}return this.buffer[this.nextCharacter++] & 255;
});
Clazz.defineMethod (c$, "skip", 
function (byteCount) {
if (this.str != null) return 0;
if (this.nextCharacter + byteCount < this.charactersInBuffer) {
this.nextCharacter += byteCount;
} else {
while (byteCount-- > 0) {
var b = this.readByteAsInt ();
if (b == astex.io.FILE.EOF) {
return astex.io.FILE.EOF;
}}
}return 0;
}, "~N");
Clazz.defineMethod (c$, "ungetc", 
 function (c) {
if (this.nextCharacter > 0) {
this.nextCharacter--;
}}, "~N");
Clazz.defineMethod (c$, "getLineLength", 
function () {
return this.lineLength;
});
Clazz.defineMethod (c$, "nextLine", 
function () {
this.fieldsDetermined = false;
this.lineLength = 0;
if (this.str != null) {
if (this.lines == null) this.lines = JU.PT.split (this.str, "\n");
if (this.linePt >= this.lines.length) {
this.line = null;
return false;
}this.line = this.lines[this.linePt++];
this.lineLength = this.line.length;
return true;
}var ch = 0;
do {
ch = this.readByteAsInt ();
if (ch <= 13 && ch != 9) {
if (ch == 10) {
return true;
} else if (ch == 13) {
ch = this.readByteAsInt ();
if (ch != 10 && ch != astex.io.FILE.EOF) {
this.ungetc (ch);
} else {
}return true;
} else if (ch == astex.io.FILE.EOF) {
return this.lineLength > 0;
}} else {
this.lineBuffer[this.lineLength++] = ch;
}} while (this.lineLength < astex.io.FILE.lineBufferSize);
do {
ch = this.readByteAsInt ();
} while ((ch != 10) && (ch != 13) && (ch != astex.io.FILE.EOF));
if (ch == 13) {
ch = this.readByteAsInt ();
if (ch != 10) {
this.ungetc (ch);
}}return true;
});
Clazz.defineMethod (c$, "readLine", 
function () {
return (this.nextLine () ? this.getCurrentLineAsString () : null);
});
Clazz.defineMethod (c$, "getCurrentLineAsString", 
function () {
return (this.str == null ?  String.instantialize (this.lineBuffer, 0, this.lineLength) : this.line);
});
Clazz.defineMethod (c$, "getChar", 
function (offset) {
var isOK = (offset >= 0 && offset < this.lineLength);
return (!isOK ? String.fromCharCode (astex.io.FILE.EOF) : this.str == null ? String.fromCharCode (this.lineBuffer[offset]) : this.line.charAt (offset));
}, "~N");
Clazz.defineMethod (c$, "currentLineContains", 
function (string, offset) {
var len = string.length;
if (len + offset > this.lineLength) return false;
if (this.str != null) return (this.line != null && this.line.indexOf (string, offset) == offset);
for (var i = 0; i < len; i++) {
if (string.charCodeAt (i) != this.lineBuffer[i + offset]) {
return false;
}}
return true;
}, "~S,~N");
Clazz.defineMethod (c$, "getSubstring", 
function (offset, length) {
if (offset >= this.lineLength) return "";
var pt2;
if ((pt2 = offset + length) > this.lineLength) return (this.line == null ?  String.instantialize (this.lineBuffer, offset, this.lineLength - offset) : this.line.substring (offset));
return (this.line == null ?  String.instantialize (this.lineBuffer, offset, length) : this.line.substring (offset, pt2));
}, "~N,~N");
Clazz.defineMethod (c$, "readIntRange", 
function (offset, length) {
var end = Math.min (offset + length, this.lineLength);
if (end == 0) return 0;
if (this.line != null) return astex.io.FILE.readInteger (this.line.substring (offset, end));
var negative = false;
var currentPosition = offset;
for (; currentPosition < end; currentPosition++) {
var b = this.lineBuffer[currentPosition];
if (b == 32 || b == 43) {
continue;
} else if (b == 45) {
negative = true;
} else {
break;
}}
var total = 0;
for (; currentPosition < end; currentPosition++) {
var b = this.lineBuffer[currentPosition];
if (b >= 48 && b <= 57) {
total = (10 * total) + (b - 48);
} else {
break;
}}
return (negative ? -total : total);
}, "~N,~N");
Clazz.defineMethod (c$, "readDoubleRange", 
function (offset, length) {
var end = Math.min (offset + length, this.lineLength);
if (end == 0) return 0;
if (this.line != null) return astex.io.FILE.readDouble (this.line.substring (offset, end));
var negative = false;
var currentPosition = offset;
var total = 0;
var dotSeen = false;
var decimalPlaces = 0;
var exponentSeen = false;
var exponentNegative = false;
var exponentTotal = 0;
for (; currentPosition < end; currentPosition++) {
var b = this.lineBuffer[currentPosition];
if (b >= 48 && b <= 57) {
if (exponentSeen) {
exponentTotal = exponentTotal * 10 + (b - 48);
} else {
total = total * 10 + (b - 48);
if (dotSeen) {
decimalPlaces++;
}}} else if (b == 32 || b == 43) {
continue;
} else if (b == 45) {
if (exponentSeen) {
exponentNegative = true;
} else {
negative = true;
}} else if (b == 46) {
dotSeen = true;
} else if (b == 101 || b == 69) {
exponentSeen = true;
} else {
break;
}}
if (exponentSeen && exponentNegative) {
exponentTotal = -exponentTotal;
}var result = total;
decimalPlaces -= exponentTotal;
switch (decimalPlaces) {
case 1:
result *= 0.1;
break;
case 2:
result *= 0.01;
break;
case 3:
result *= 0.001;
break;
case 4:
result *= 0.0001;
break;
case 5:
result *= 0.00001;
break;
case 6:
result *= 0.000001;
break;
case 7:
result *= 0.0000001;
break;
case 8:
result *= 0.00000001;
break;
case 9:
result *= 0.000000001;
break;
default:
if (decimalPlaces > 0) {
while (decimalPlaces-- > 0) {
result *= 0.1;
}
} else {
while (decimalPlaces++ < 0) {
result *= 10.0;
}
}}
return (negative ? -result : result);
}, "~N,~N");
Clazz.defineMethod (c$, "determineFields", 
 function () {
if (this.str != null) {
this.fields = (this.line == null ?  new Array (0) : JU.PT.getTokens (this.line));
this.fieldCount = this.fields.length;
this.fieldsDetermined = true;
return;
}var len = this.getLineLength ();
var inField = false;
var currentLen = 0;
this.fieldCount = 0;
for (var i = 0; i < len; i++) {
var c = this.lineBuffer[i];
if (c != 32 && c != 9) {
if (inField) {
currentLen++;
} else {
inField = true;
this.fieldStartPosition[this.fieldCount] = i;
currentLen = 1;
this.fieldCount++;
}} else {
if (inField) {
this.fieldLength[this.fieldCount - 1] = currentLen;
inField = false;
}}}
if (inField) {
this.fieldLength[this.fieldCount - 1] = currentLen;
}this.fieldsDetermined = true;
});
Clazz.defineMethod (c$, "getFieldCount", 
function () {
if (!this.fieldsDetermined) this.determineFields ();
return this.fieldCount;
});
Clazz.defineMethod (c$, "getFieldStart", 
 function (f) {
if (!this.fieldsDetermined) {
this.determineFields ();
}return (f >= this.fieldCount || f < 0 ? -1 : this.fieldStartPosition[f]);
}, "~N");
Clazz.defineMethod (c$, "getFieldLength", 
function (f) {
if (!this.fieldsDetermined) {
this.determineFields ();
}return (f >= this.fieldCount || f < 0 ? 0 : this.fields == null ? this.fieldLength[f] : this.fields[f].length);
}, "~N");
Clazz.defineMethod (c$, "getField", 
function (f) {
if (!this.fieldsDetermined) {
this.determineFields ();
}if (f >= this.fieldCount || f < 0) {
return null;
}if (this.fields != null) return this.fields[f];
var start = this.getFieldStart (f);
var len = this.getFieldLength (f);
return this.getSubstring (start, len);
}, "~N");
c$.getRelativePath = Clazz.defineMethod (c$, "getRelativePath", 
function (path) {
try {
var currentDir =  new java.io.File (".");
var currentPath = null;
currentPath = currentDir.getCanonicalPath ();
if (currentPath != null) {
var pathFile =  new java.io.File (path);
var canonicalPath = pathFile.getCanonicalPath ();
if (canonicalPath.startsWith (currentPath)) {
var relativePath = canonicalPath.substring (currentPath.length);
while (relativePath.startsWith ("/") || relativePath.startsWith ("\\")) {
relativePath = relativePath.substring (1);
}
return relativePath;
}}} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
} else {
throw e;
}
}
return path;
}, "~S");
c$.open = Clazz.defineMethod (c$, "open", 
function (resource) {
return astex.io.FILE.openStatic (resource, true);
}, "~S");
c$.openStatic = Clazz.defineMethod (c$, "openStatic", 
function (resource, asBinary) {
var input = null;
if (astex.io.FILE.debug) {
System.out.println ("debug is true in FILE::open");
System.out.println ("FILE.open resource=" + resource);
}var isGzipped = resource.endsWith (".gz");
var isURL = (astex.io.FILE.urlTypeIndex (resource) >= 0);
var isResource = !isURL && resource.endsWith (".properties");
var isBinary = (asBinary || isGzipped || astex.io.FILE.isBinaryName (resource)) && !astex.io.FILE.isAsciiName (resource);
if (!isResource) isURL = new Boolean (isURL | astex.viewer.Viewer.isJS).valueOf ();
while (true) {
if (isResource || !isURL && isBinary) {
if (resource.endsWith (".properties") && resource.indexOf ("/") < 0) resource = "properties/" + resource;
if (astex.io.FILE.debug) {
System.out.println ("attempt to open as relative resource");
}var f = "astex/" + resource;
try {
if ((input = (astex.viewer.Viewer.isJS ? astex.io.FILE.openURL ( new java.net.URL (astex.io.FILE.codeBase, f, null), asBinary) : astex.io.FILE.getClassLoader ().getResourceAsStream (f))) != null) break;
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
System.out.println ("Error opening " + e.toString ());
} else {
throw e;
}
}
}if (astex.io.FILE.documentBase != null) {
if (astex.io.FILE.debug) {
System.out.println ("documentBase " + astex.io.FILE.documentBase);
}try {
var url =  new java.net.URL (astex.io.FILE.documentBase, resource, null);
if (astex.io.FILE.debug) {
System.out.println ("attempting to open url " + url);
}if ((input = astex.io.FILE.openURL (url, isBinary)) != null) break;
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
if (astex.io.FILE.debug) {
System.out.println ("**** URL exception " + e);
}} else {
throw e;
}
}
}if (astex.io.FILE.codeBase != null) {
if (astex.io.FILE.debug) {
System.out.println ("codeBase " + astex.io.FILE.codeBase);
}try {
var url =  new java.net.URL (astex.io.FILE.codeBase, resource, null);
if (astex.io.FILE.debug) {
System.out.println ("attempting to open url " + url);
}if ((input = astex.io.FILE.openURL (url, isBinary)) != null) break;
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
if (astex.io.FILE.debug) {
System.out.println ("**** URL exception " + e);
}} else {
throw e;
}
}
}if (isURL) {
try {
if (astex.io.FILE.debug) {
System.out.println ("attempting to open as absolute url");
}if ((input = astex.io.FILE.openURLFromName (resource, isBinary)) != null) break;
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
if (astex.io.FILE.debug) {
System.out.println ("**** absolute url exception " + e);
}} else {
throw e;
}
}
}if (!isURL && astex.io.FILE.tryFiles) {
try {
if (astex.io.FILE.debug) {
System.out.println ("attempting to open as file");
}if ((input = astex.io.FILE.openLocalFromName (resource)) != null) {
break;
} else if (!astex.viewer.Viewer.isJS && (!resource.endsWith (".gz") && ((input = astex.io.FILE.openLocalFromName (resource + ".gz")) != null))) {
isGzipped = true;
break;
}} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
if (astex.io.FILE.debug) {
System.out.println ("**** open file exception " + e);
}} else {
throw e;
}
}
}break;
}
if (input != null && isGzipped) {
var f = astex.io.FILE.newFile (input, true);
f.unzip ();
return f;
}astex.io.FILE.debug = false;
return (input == null ? null : Clazz.instanceOf (input, astex.io.FILE) ? input : astex.io.FILE.newFile (input, isBinary));
}, "~S,~B");
Clazz.defineMethod (c$, "unzip", 
 function () {
try {
this.inputStream = JU.Rdr.getUnzippedInputStream ( new java.io.BufferedInputStream (this.inputStream));
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
if (astex.io.FILE.debug) {
System.out.println ("failed to open gzip'ed inputStream");
System.out.println ("" + e);
}} else {
throw e;
}
}
});
c$.fromArray = Clazz.defineMethod (c$, "fromArray", 
function (name, data) {
return astex.io.FILE.newFile ( new java.io.ByteArrayInputStream (data), true);
}, "~S,~A");
Clazz.defineMethod (c$, "readAsString", 
function () {
var sb =  new JU.SB ();
var c = 0;
while ((c = this.readByteAsInt ()) != astex.io.FILE.EOF) sb.appendC (String.fromCharCode (c));

this.close ();
return sb.toString ();
});
c$.openLocalFromName = Clazz.defineMethod (c$, "openLocalFromName", 
 function (filename) {
try {
var f = null;
var file =  new java.io.File (filename);
if (file.isAbsolute ()) {
f = astex.io.FILE.openLocalFile (file);
} else {
if (astex.io.FILE.documentBase != null) {
var docBase = astex.io.FILE.documentBase.toString ();
if (docBase.startsWith ("file:/")) {
docBase = docBase.substring (6);
file =  new java.io.File (docBase, filename);
f = astex.io.FILE.openLocalFile (file);
}}if (f == null && astex.io.FILE.codeBase != null) {
var cBase = astex.io.FILE.codeBase.toString ();
if (cBase.startsWith ("file:/")) {
cBase = cBase.substring (6);
file =  new java.io.File (cBase, filename);
f = astex.io.FILE.openLocalFile (file);
}}if (f == null) {
file =  new java.io.File (filename);
f = astex.io.FILE.openLocalFile (file);
}}return f;
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
astex.io.FILE.setException (e);
if (astex.io.FILE.debug) {
System.out.println ("openFile: " + e);
}return null;
} else {
throw e;
}
}
}, "~S");
c$.openLocalFile = Clazz.defineMethod (c$, "openLocalFile", 
 function (file) {
try {
var fileInputStream =  new java.io.FileInputStream (file);
return astex.io.FILE.newFile (fileInputStream, true);
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
astex.io.FILE.setException (e);
if (astex.io.FILE.debug) {
System.out.println ("open(File): " + e);
}return null;
} else {
throw e;
}
}
}, "java.io.File");
c$.openURLFromName = Clazz.defineMethod (c$, "openURLFromName", 
 function (urlname, isBinary) {
try {
var url =  new java.net.URL (Clazz.castNullAs ("java.net.URL"), urlname, null);
return astex.io.FILE.openURL (url, isBinary);
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
astex.io.FILE.setException (e);
return null;
} else {
throw e;
}
}
}, "~S,~B");
c$.openURL = Clazz.defineMethod (c$, "openURL", 
 function (url, isBinary) {
try {
if (astex.viewer.Viewer.isJS) {
return astex.awtjs2d.Platform.getURLContentsStatic (url, null, null, !isBinary);
}return astex.io.FILE.newFile (url.openStream (), isBinary);
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
if (astex.io.FILE.debug) {
System.out.println ("open(URL) exception " + e);
}astex.io.FILE.setException (e);
return null;
} else {
throw e;
}
}
}, "java.net.URL,~B");
c$.isBinaryName = Clazz.defineMethod (c$, "isBinaryName", 
 function (name) {
if (name.length < 4) return true;
return JU.PT.isOneOf (name.substring (name.length - 4).toLowerCase (), ";.gif;.jpg;jpeg;.png;.map;omap;");
}, "~S");
c$.isAsciiName = Clazz.defineMethod (c$, "isAsciiName", 
 function (name) {
if (name.length < 4) return false;
return JU.PT.isOneOf (name.substring (name.length - 4).toLowerCase (), ";.pdb;mcif;mol;3000;2000;.xyz;");
}, "~S");
Clazz.defineMethod (c$, "close", 
function () {
if (this.inputStream != null) {
try {
this.inputStream.close ();
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
astex.io.FILE.setException (e);
} else {
throw e;
}
}
}if (this.outputStream != null) {
try {
this.flush ();
this.outputStream.close ();
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
astex.io.FILE.setException (e);
} else {
throw e;
}
}
}});
c$.loadProperties = Clazz.defineMethod (c$, "loadProperties", 
function (resource) {
var properties =  new astex.util.Properties ();
properties.loadFile (resource);
return properties;
}, "~S");
Clazz.defineMethod (c$, "readFieldFloat", 
function (f) {
return this.readFieldDbl (f);
}, "~N");
Clazz.defineMethod (c$, "readFieldInt", 
function (f) {
if (!this.checkField (f)) return 0;
if (this.fields != null) return astex.io.FILE.readInteger (this.fields[f]);
var start = this.getFieldStart (f);
var len = this.getFieldLength (f);
return this.readIntRange (start, len);
}, "~N");
Clazz.defineMethod (c$, "readFieldDbl", 
function (f) {
if (!this.checkField (f)) return 0;
if (this.fields != null) return astex.io.FILE.readDouble (this.fields[f]);
var start = this.getFieldStart (f);
var len = this.getFieldLength (f);
return this.readDoubleRange (start, len);
}, "~N");
Clazz.defineMethod (c$, "checkField", 
 function (f) {
if (!this.fieldsDetermined) this.determineFields ();
if (f < 0 || f >= this.fieldCount) {
System.out.println ("readIntegerFromField: attempt " + "to read from field " + f);
return false;
}return true;
}, "~N");
c$.readInteger = Clazz.defineMethod (c$, "readInteger", 
function (s) {
var len = s.length;
var value = 0;
var negative = false;
for (var i = 0; i < len; i++) {
var c = s.charAt (i);
if (c >= '0' && c <= '9') {
value = (10 * value) + (c.charCodeAt (0) - 48);
} else if (c == '-') {
negative = true;
}}
return (negative ? -value : value);
}, "~S");
c$.readDouble = Clazz.defineMethod (c$, "readDouble", 
function (string) {
try {
return Double.parseDouble (string);
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
return 0.0;
} else {
throw e;
}
}
}, "~S");
c$.split = Clazz.defineMethod (c$, "split", 
function (string, separators) {
var tokenizer = null;
if (separators == null) {
tokenizer =  new java.util.StringTokenizer (string);
} else {
tokenizer =  new java.util.StringTokenizer (string, separators);
}var fieldCount = tokenizer.countTokens ();
var fields =  new Array (fieldCount);
var field = 0;
while (tokenizer.hasMoreElements ()) {
fields[field++] = tokenizer.nextToken ();
}
return fields;
}, "~S,~S");
c$.deletefile = Clazz.defineMethod (c$, "deletefile", 
function (file) {
var f1 =  new java.io.File (file);
f1.$delete ();
}, "~S");
c$.readFrom = Clazz.defineMethod (c$, "readFrom", 
function (file) {
var bytesRead = 0;
while (file.readByteAsInt () != astex.io.FILE.EOF) {
bytesRead++;
}
return bytesRead;
}, "astex.io.FILE");
Clazz.defineMethod (c$, "getReader", 
function () {
try {
return  new java.io.BufferedReader ( new java.io.InputStreamReader (this.getInputStream (), "UTF-8"));
} catch (e) {
if (Clazz.exceptionOf (e, java.io.UnsupportedEncodingException)) {
return null;
} else {
throw e;
}
}
});
c$.trimExt = Clazz.defineMethod (c$, "trimExt", 
function (fName) {
return fName.$replace ('\\', '/').substring (0, fName.lastIndexOf ('/') + 1);
}, "~S");
c$.readBitmap = Clazz.defineMethod (c$, "readBitmap", 
function (file, size) {
try {
var f = astex.io.FILE.open (file);
var fs = f.getInputStream ();
var bflen = 14;
var bf =  Clazz.newByteArray (bflen, 0);
fs.read (bf, 0, bflen);
var bilen = 40;
var bi =  Clazz.newByteArray (bilen, 0);
fs.read (bi, 0, bilen);
var nwidth = ((bi[7] & 0xff) << 24) | ((bi[6] & 0xff) << 16) | ((bi[5] & 0xff) << 8) | bi[4] & 0xff;
var nheight = ((bi[11] & 0xff) << 24) | ((bi[10] & 0xff) << 16) | ((bi[9] & 0xff) << 8) | bi[8] & 0xff;
var nbitcount = ((bi[15] & 0xff) << 8) | bi[14] & 0xff;
var nsizeimage = ((bi[23] & 0xff) << 24) | ((bi[22] & 0xff) << 16) | ((bi[21] & 0xff) << 8) | bi[20] & 0xff;
var ndata = null;
if (nbitcount == 24) {
var npad = (Clazz.doubleToInt (nsizeimage / nheight)) - nwidth * 3;
ndata =  Clazz.newIntArray (nheight * nwidth, 0);
var brgb =  Clazz.newByteArray ((nwidth + npad) * 3 * nheight, 0);
fs.read (brgb, 0, (nwidth + npad) * 3 * nheight);
var nindex = 0;
for (var j = 0; j < nheight; j++) {
for (var i = 0; i < nwidth; i++) {
ndata[nwidth * (nheight - j - 1) + i] = -16777216 | ((brgb[nindex + 2] & 0xff) << 16) | ((brgb[nindex + 1] & 0xff) << 8) | brgb[nindex] & 0xff;
nindex += 3;
}
nindex += npad;
}
size[0] = nwidth;
size[1] = nheight;
} else {
System.out.println ("readBitmap: not a 24-bit or 8-bit Windows Bitmap, aborting...");
}fs.close ();
return ndata;
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
System.out.println ("readBitmap: some sort of error: " + e);
} else {
throw e;
}
}
return null;
}, "~S,~A");
c$.intToWord = Clazz.defineMethod (c$, "intToWord", 
function (os, parValue) {
try {
os.write ((parValue & 0x00FF));
os.write (((parValue >> 8) & 0x00FF));
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
astex.util.Log.error ("exception " + e);
} else {
throw e;
}
}
}, "java.io.OutputStream,~N");
c$.intToDWord = Clazz.defineMethod (c$, "intToDWord", 
function (os, parValue) {
try {
os.write ((parValue & 0x00FF));
os.write (((parValue >> 8) & 0x000000FF));
os.write (((parValue >> 16) & 0x000000FF));
os.write (((parValue >> 24) & 0x000000FF));
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
astex.util.Log.error ("exception " + e);
} else {
throw e;
}
}
}, "java.io.OutputStream,~N");
c$.getFileAsString = Clazz.defineMethod (c$, "getFileAsString", 
function (scriptFile) {
var f = astex.io.FILE.openStatic (scriptFile, false);
return (f.str == null ? f.readAsString () : f.str);
}, "~S");
c$.getMolWriter = Clazz.defineMethod (c$, "getMolWriter", 
 function () {
return (astex.io.FILE.moleculeWriter == null ? (astex.io.FILE.moleculeWriter = astex.api.Interface.getInterface ("astex.io.MoleculeWriter")) : astex.io.FILE.moleculeWriter);
});
c$.writeMol = Clazz.defineMethod (c$, "writeMol", 
function (mol, fileName, type, paramName) {
if (paramName == null && astex.io.FILE.isLocal (fileName)) {
var output = astex.io.FILE.openForWrite (fileName);
if (output.errorMsg != null) return output.errorMsg;
astex.io.FILE.getMolWriter ().write (mol, output, type == null && fileName.contains (".") ? fileName : type);
output.close ();
return "OK";
}try {
var baos =  new java.io.ByteArrayOutputStream ();
var file = astex.io.FILE.forOutput (baos);
astex.io.FILE.getMolWriter ().write (mol, file, type);
var data = (paramName == null ? null : paramName + "=" +  String.instantialize (baos.toByteArray ()));
return (paramName == null ? astex.viewer.Viewer.bytePoster.postByteArray (fileName, baos.toByteArray ()) : astex.viewer.Viewer.apiPlatform.getURLContents ( new java.net.URL (Clazz.castNullAs ("java.net.URL"), fileName, null), null, paramName + "=" + data, true));
} catch (t) {
return t.toString ();
}
}, "astex.model.Molecule,~S,~S,~S");
c$.newOC = Clazz.defineMethod (c$, "newOC", 
function () {
return astex.api.Interface.getInterface ("JU.OC");
});
c$.urlTypeIndex = Clazz.defineMethod (c$, "urlTypeIndex", 
function (name) {
if (name == null) return -2;
for (var i = 0; i < astex.io.FILE.urlPrefixes.length; ++i) {
if (name.startsWith (astex.io.FILE.urlPrefixes[i])) {
return i;
}}
return -1;
}, "~S");
c$.isLocal = Clazz.defineMethod (c$, "isLocal", 
function (fileName) {
if (fileName == null) return false;
var itype = astex.io.FILE.urlTypeIndex (fileName);
return (itype < 0 || itype == 4);
}, "~S");
c$.constructName = Clazz.defineMethod (c$, "constructName", 
function (directory, file) {
if (directory != null) directory = directory.$replace ("\\", "/");
return (directory == null || file == null ? null : directory.endsWith ("/") ? directory + file : directory + "/" + file);
}, "~S,~S");
c$.checkExtension = Clazz.defineMethod (c$, "checkExtension", 
function (mol, f) {
var file = null;
var extension = null;
var dot = f.lastIndexOf ('.');
if (dot == -1) {
file = f;
} else {
file = f.substring (0, dot);
extension = f.substring (dot + 1, f.length);
}if (extension != null && (extension.equals ("pdb") || extension.equals ("mol") || extension.equals ("sdf"))) {
return f;
}if (extension == null) {
var originalName = mol.getFilename ();
dot = originalName.lastIndexOf ('.');
if (dot == -1) {
var atomCount = mol.getAtomCount ();
if (atomCount < 256) {
extension = "mol";
} else {
extension = "pdb";
}} else {
extension = originalName.substring (dot + 1, originalName.length);
}}return file + "." + extension;
}, "astex.model.Molecule,~S");
c$.checkMapExtension = Clazz.defineMethod (c$, "checkMapExtension", 
function (map, f) {
var file = null;
var extension = null;
var dot = f.lastIndexOf ('.');
if (dot == -1) {
file = f;
} else {
file = f.substring (0, dot);
extension = f.substring (dot + 1, f.length);
}if (extension != null && (extension.equals ("map") || extension.equals ("ccp4") || extension.equals ("bit") || extension.equals ("brix"))) {
return f;
}var originalName = map.getName ();
dot = originalName.lastIndexOf ('.');
if (dot == -1) {
extension = "map";
} else {
extension = originalName.substring (dot + 1, originalName.length);
}return file + "." + extension;
}, "astex.map.VolumeMap,~S");
c$.checkMaskExtension = Clazz.defineMethod (c$, "checkMaskExtension", 
function (mask, f) {
var file = null;
var extension = null;
var dot = f.lastIndexOf ('.');
if (dot == -1) {
file = f;
} else {
file = f.substring (0, dot);
extension = f.substring (dot + 1, f.length);
}if (extension != null && extension.equals ("mask")) {
return f;
}extension = "mask";
return file + "." + extension;
}, "astex.api.AstexMask,~S");
c$.getFont = Clazz.defineMethod (c$, "getFont", 
function (name, bitmapFonts) {
if (name.equals ("default")) {
name = astex.util.Settings.getString ("fonts", "default");
}var font = bitmapFonts.get (name);
if (font == null) {
font =  Clazz.newByteArray (262144, 0);
bitmapFonts.put (name, font);
var fontFile = astex.util.Settings.getString ("fonts", name);
if (fontFile == null) {
astex.util.Log.error ("no such font as " + name);
return (name.equals ("default") ? null : astex.io.FILE.getFont ("default", bitmapFonts));
}var file = astex.io.FILE.openStatic (fontFile, true);
if (file == null) {
astex.util.Log.error ("couldn't find font " + name);
astex.util.Log.error ("was looking for    " + fontFile);
return (name.equals ("default") ? null : astex.io.FILE.getFont ("default", bitmapFonts));
}try {
file.unzip ();
var n = file.read (font, 0, font.length);
System.out.println (n + " bytes read for font " + fontFile);
file.close ();
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
System.out.println ("failed to open gzip'ed font");
System.out.println ("" + e);
} else {
throw e;
}
}
}return font;
}, "~S,java.util.Hashtable");
c$.openBinary = Clazz.defineMethod (c$, "openBinary", 
function (resource) {
return astex.io.FILE.openStatic (resource, true);
}, "~S");
Clazz.defineStatics (c$,
"bufferSize", 2048,
"exception", null,
"EOF", -1,
"MaxFields", 1024,
"documentBase", null,
"codeBase", null,
"debug", false,
"tryFiles", true,
"lineBufferSize", 1024);
c$.out = c$.prototype.out = astex.io.FILE.forOutput (System.out);
c$.err = c$.prototype.err = astex.io.FILE.forOutput (System.err);
c$.$in = c$.prototype.$in = astex.io.FILE.newFile (System.$in, true);
c$.spr = c$.prototype.spr =  new astex.io.FILE ();
Clazz.defineStatics (c$,
"UNIX", 0,
"PC", 1,
"MAC", 2,
"baseo", [('0').charCodeAt (0), ('1').charCodeAt (0), ('2').charCodeAt (0), ('3').charCodeAt (0), ('4').charCodeAt (0), ('5').charCodeAt (0), ('6').charCodeAt (0), ('7').charCodeAt (0)],
"basex", [('0').charCodeAt (0), ('1').charCodeAt (0), ('2').charCodeAt (0), ('3').charCodeAt (0), ('4').charCodeAt (0), ('5').charCodeAt (0), ('6').charCodeAt (0), ('7').charCodeAt (0), ('8').charCodeAt (0), ('9').charCodeAt (0), ('a').charCodeAt (0), ('b').charCodeAt (0), ('c').charCodeAt (0), ('d').charCodeAt (0), ('e').charCodeAt (0), ('f').charCodeAt (0)],
"baseX", [('0').charCodeAt (0), ('1').charCodeAt (0), ('2').charCodeAt (0), ('3').charCodeAt (0), ('4').charCodeAt (0), ('5').charCodeAt (0), ('6').charCodeAt (0), ('7').charCodeAt (0), ('8').charCodeAt (0), ('9').charCodeAt (0), ('A').charCodeAt (0), ('B').charCodeAt (0), ('C').charCodeAt (0), ('D').charCodeAt (0), ('E').charCodeAt (0), ('F').charCodeAt (0)],
"based", [('0').charCodeAt (0), ('1').charCodeAt (0), ('2').charCodeAt (0), ('3').charCodeAt (0), ('4').charCodeAt (0), ('5').charCodeAt (0), ('6').charCodeAt (0), ('7').charCodeAt (0), ('8').charCodeAt (0), ('9').charCodeAt (0)],
"bSpace", (' ').charCodeAt (0),
"bPlus", ('+').charCodeAt (0),
"bMinus", ('-').charCodeAt (0),
"b0", ('0').charCodeAt (0),
"bx", ('x').charCodeAt (0),
"bX", ('X').charCodeAt (0),
"bDot", ('.').charCodeAt (0),
"be", ('e').charCodeAt (0),
"bE", ('E').charCodeAt (0),
"moleculeWriter", null,
"URL_LOCAL", 4,
"urlPrefixes", ["http:", "https:", "sftp:", "ftp:", "file:"],
"maskExtension", "mask",
"maskExtensions", ["mask", "regions"]);
});
