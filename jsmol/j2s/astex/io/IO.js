Clazz.declarePackage ("astex.io");
Clazz.load (["JU.BC"], "astex.io.IO", ["astex.io.FILE"], function () {
c$ = Clazz.declareType (astex.io, "IO", JU.BC);
c$.printArray = Clazz.defineMethod (c$, "printArray", 
function (name, array) {
System.out.print (name);
for (var i = 0; i < array.length; i++) {
System.out.print (" " + array[i]);
}
System.out.println ("");
}, "~S,~A");
c$.printArray = Clazz.defineMethod (c$, "printArray", 
function (name, array) {
System.out.print (name);
for (var i = 0; i < array.length; i++) {
System.out.print (" " + array[i]);
}
System.out.println ("");
}, "~S,~A");
c$.readShortArray = Clazz.defineMethod (c$, "readShortArray", 
function (file, array, bigEndian) {
return astex.io.IO.readShortArray (file, array, array.length, bigEndian);
}, "astex.io.FILE,~A,~B");
c$.readShortArray = Clazz.defineMethod (c$, "readShortArray", 
function (file, array, count, bigEndian) {
for (var i = 0; i < count; i++) {
array[i] = astex.io.IO.readShort (file, bigEndian);
}
return 0;
}, "astex.io.FILE,~A,~N,~B");
c$.readIntegerArray = Clazz.defineMethod (c$, "readIntegerArray", 
function (file, array, bigEndian) {
return astex.io.IO.readIntegerArray (file, array, array.length, bigEndian);
}, "astex.io.FILE,~A,~B");
c$.readIntegerArray = Clazz.defineMethod (c$, "readIntegerArray", 
function (file, array, count, bigEndian) {
for (var i = 0; i < count; i++) {
array[i] = astex.io.IO.readInteger (file, bigEndian);
}
return 0;
}, "astex.io.FILE,~A,~N,~B");
c$.readFloatsAsDoubleArray = Clazz.defineMethod (c$, "readFloatsAsDoubleArray", 
function (file, array, count, bigEndian) {
for (var i = 0; i < count; i++) {
array[i] = astex.io.IO.readFloat (file, bigEndian);
}
return 0;
}, "astex.io.FILE,~A,~N,~B");
c$.readShort = Clazz.defineMethod (c$, "readShort", 
function (file, bigEndian) {
if (file == null) {
System.out.println ("Map.readShort: file is null");
}var ch1 = file.readByteAsInt ();
var ch2 = file.readByteAsInt ();
if (ch1 == astex.io.FILE.EOF || ch2 == astex.io.FILE.EOF) {
System.out.println ("eof in readShort");
return astex.io.FILE.EOF;
}var n = (bigEndian ? ((((ch1 << 8) + ((ch2))))) : ((((ch2 << 8) + ((ch1))))));
{
return (n > 0x7FFF ? n - 0x10000 : n);
}}, "astex.io.FILE,~B");
c$.readInteger = Clazz.defineMethod (c$, "readInteger", 
function (file, bigEndian) {
var ch1 = file.readByteAsInt ();
var ch2 = file.readByteAsInt ();
var ch3 = file.readByteAsInt ();
var ch4 = file.readByteAsInt ();
if ((ch1 == astex.io.FILE.EOF || ch2 == astex.io.FILE.EOF || ch3 == astex.io.FILE.EOF || ch4 == astex.io.FILE.EOF)) {
System.out.println ("eof");
}var n = bigEndian ? ((ch1 << 24) + (ch2 << 16) + (ch3 << 8) + (ch4 << 0)) : ((ch4 << 24) + (ch3 << 16) + (ch2 << 8) + (ch1 << 0));
{
return (n > 0x7FFFFFFF ? n - 0x100000000 : n);
}}, "astex.io.FILE,~B");
c$.readFloat = Clazz.defineMethod (c$, "readFloat", 
function (file, bigEndian) {
try {
return JU.BC.intToFloat (astex.io.IO.readInteger (file, bigEndian));
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
return NaN;
} else {
throw e;
}
}
}, "astex.io.FILE,~B");
c$.readByteArray = Clazz.defineMethod (c$, "readByteArray", 
function (file, array, len) {
try {
file.read (array, 0, len);
} catch (e) {
if (Clazz.exceptionOf (e, java.io.IOException)) {
System.out.println ("failed to read " + len + " bytes from file " + astex.io.FILE.getRelativePath (null));
System.out.println ("" + e);
} else {
throw e;
}
}
}, "astex.io.FILE,~A,~N");
c$.writeIntegerArray = Clazz.defineMethod (c$, "writeIntegerArray", 
function (s, a, n) {
for (var i = 0; i < n; i++) {
s.writeInt (a[i]);
}
}, "java.io.DataOutputStream,~A,~N");
c$.writeIntegerArray = Clazz.defineMethod (c$, "writeIntegerArray", 
function (s, a) {
astex.io.IO.writeIntegerArray (s, a, a.length);
}, "java.io.DataOutputStream,~A");
c$.writeFloatArray = Clazz.defineMethod (c$, "writeFloatArray", 
function (s, a, n) {
for (var i = 0; i < n; i++) {
s.writeFloat (a[i]);
}
}, "java.io.DataOutputStream,~A,~N");
c$.writeFloatArray = Clazz.defineMethod (c$, "writeFloatArray", 
function (s, a) {
astex.io.IO.writeFloatArray (s, a, a.length);
}, "java.io.DataOutputStream,~A");
c$.writeReverseFloatArray = Clazz.defineMethod (c$, "writeReverseFloatArray", 
function (s, a, n) {
for (var i = n - 1; i >= 0; i--) {
s.writeFloat (a[i]);
}
}, "java.io.DataOutputStream,~A,~N");
c$.writeBigFloatArray = Clazz.defineMethod (c$, "writeBigFloatArray", 
function (s, a, n) {
for (var i = 0; i < n; i++) {
s.writeFloat (a.get (i));
}
}, "java.io.DataOutputStream,astex.util.BigFloatArray,~N");
c$.writeReverseBigFloatArray = Clazz.defineMethod (c$, "writeReverseBigFloatArray", 
function (s, a, n) {
for (var i = n - 1; i >= 0; i--) {
s.writeFloat (a.get (i));
}
}, "java.io.DataOutputStream,astex.util.BigFloatArray,~N");
c$.writeDoubleArrayAsFloat = Clazz.defineMethod (c$, "writeDoubleArrayAsFloat", 
function (s, a) {
astex.io.IO.writeDoubleArrayAsFloat (s, a, a.length);
}, "java.io.DataOutputStream,~A");
c$.writeDoubleArrayAsFloat = Clazz.defineMethod (c$, "writeDoubleArrayAsFloat", 
function (s, a, n) {
for (var i = 0; i < n; i++) {
s.writeFloat (a[i]);
}
}, "java.io.DataOutputStream,~A,~N");
c$.writeDoubleAsFloat = Clazz.defineMethod (c$, "writeDoubleAsFloat", 
function (s, d) {
s.writeFloat (d);
}, "java.io.DataOutputStream,~N");
c$.writeCharArray = Clazz.defineMethod (c$, "writeCharArray", 
function (s, str) {
var b = str.getBytes ("UTF-8");
s.write (b, 0, b.length);
}, "java.io.DataOutputStream,~S");
c$.writeCharArray = Clazz.defineMethod (c$, "writeCharArray", 
function (s, str, offset, len) {
var b = str.getBytes ("UTF-8");
s.write (b, offset, len);
}, "java.io.DataOutputStream,~S,~N,~N");
c$.writeCharArray = Clazz.defineMethod (c$, "writeCharArray", 
function (s, c) {
var str =  String.instantialize (c);
astex.io.IO.writeCharArray (s, str);
}, "java.io.DataOutputStream,~A");
c$.writeByteArray = Clazz.defineMethod (c$, "writeByteArray", 
function (s, array, len) {
s.write (array, 0, len);
}, "java.io.DataOutputStream,~A,~N");
c$.writeReverseByteArray = Clazz.defineMethod (c$, "writeReverseByteArray", 
function (s, a, n) {
for (var i = n - 1; i >= 0; i--) {
s.write (a[i]);
}
}, "java.io.DataOutputStream,~A,~N");
c$.writeBigByteArray = Clazz.defineMethod (c$, "writeBigByteArray", 
function (s, a, len) {
for (var i = 0; i < len; i++) {
s.write (a.get (i));
}
}, "java.io.DataOutputStream,astex.util.BigByteArray,~N");
c$.writeReverseBigByteArray = Clazz.defineMethod (c$, "writeReverseBigByteArray", 
function (s, a, n) {
for (var i = n - 1; i >= 0; i--) {
s.write (a.get (i));
}
}, "java.io.DataOutputStream,astex.util.BigByteArray,~N");
c$.writeByteAsShort = Clazz.defineMethod (c$, "writeByteAsShort", 
function (s, b) {
s.writeShort (b);
}, "java.io.DataOutputStream,~N");
c$.writeByteArrayAsShort = Clazz.defineMethod (c$, "writeByteArrayAsShort", 
function (s, a, n) {
for (var i = 0; i < n; i++) {
s.writeShort (a[i]);
}
}, "java.io.DataOutputStream,~A,~N");
c$.writeReverseByteArrayAsShort = Clazz.defineMethod (c$, "writeReverseByteArrayAsShort", 
function (s, a, n) {
for (var i = n - 1; i >= 0; i--) {
s.writeShort (a[i]);
}
}, "java.io.DataOutputStream,~A,~N");
Clazz.defineStatics (c$,
"OAV_MAX_ARRAY", 2147483638);
});
