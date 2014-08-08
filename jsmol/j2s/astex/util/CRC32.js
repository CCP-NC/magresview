Clazz.declarePackage ("astex.util");
c$ = Clazz.declareType (astex.util, "CRC32");
c$.main = Clazz.defineMethod (c$, "main", 
function (args) {
}, "~A");
Clazz.makeConstructor (c$, 
function () {
astex.util.CRC32.buildCRCTable ();
});
c$.buildCRCTable = Clazz.defineMethod (c$, "buildCRCTable", 
 function () {
var CRC32_POLYNOMIAL = 0xEDB88320;
var i;
var j;
var crc;
astex.util.CRC32.CRCTable =  Clazz.newIntArray (256, 0);
for (i = 0; i <= 255; i++) {
crc = i;
for (j = 8; j > 0; j--) if ((crc & 1) == 1) crc = (crc >>> 1) ^ -306674912;
 else crc >>>= 1;

astex.util.CRC32.CRCTable[i] = crc;
}
});
c$.crc32 = Clazz.defineMethod (c$, "crc32", 
function (buffer) {
return astex.util.CRC32.crc32 (buffer, 0xFFFFFFFF);
}, "~S");
c$.crc32 = Clazz.defineMethod (c$, "crc32", 
function (buffer) {
return astex.util.CRC32.crc32 (buffer, 0xFFFFFFFF);
}, "~A");
c$.crc32 = Clazz.defineMethod (c$, "crc32", 
function (buffer, crc) {
return astex.util.CRC32.crc32 (buffer.getBytes (), crc);
}, "~S,~N");
c$.crc32 = Clazz.defineMethod (c$, "crc32", 
function (buffer, crc) {
return astex.util.CRC32.crc32 (buffer, 0, buffer.length, crc);
}, "~A,~N");
c$.crc32 = Clazz.defineMethod (c$, "crc32", 
function (buffer, start, count, lastcrc) {
var temp1;
var temp2;
var i = start;
if (astex.util.CRC32.CRCTable == null) {
astex.util.CRC32.buildCRCTable ();
}astex.util.CRC32.crc = lastcrc;
while (count-- != 0) {
temp1 = astex.util.CRC32.crc >>> 8;
temp2 = astex.util.CRC32.CRCTable[(astex.util.CRC32.crc ^ buffer[i++]) & 0xFF];
astex.util.CRC32.crc = temp1 ^ temp2;
}
return astex.util.CRC32.crc;
}, "~A,~N,~N,~N");
c$.crc32 = Clazz.defineMethod (c$, "crc32", 
function (buffer, start, count, lastcrc) {
var temp1;
var temp2;
var i = start;
if (astex.util.CRC32.CRCTable == null) {
astex.util.CRC32.buildCRCTable ();
}astex.util.CRC32.crc = lastcrc;
while (count-- != 0) {
var w = buffer[i++];
for (var b = 0; b < 4; b++) {
var bb = (w & 0xff);
w >>= 8;
temp1 = astex.util.CRC32.crc >>> 8;
temp2 = astex.util.CRC32.CRCTable[(astex.util.CRC32.crc ^ bb) & 0xFF];
astex.util.CRC32.crc = temp1 ^ temp2;
}
}
return astex.util.CRC32.crc;
}, "~A,~N,~N,~N");
Clazz.defineStatics (c$,
"CRCTable", null,
"crc", 0);
