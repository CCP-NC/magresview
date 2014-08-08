Clazz.declarePackage ("astex.io");
Clazz.load (["astex.api.AstexVolumeMapIO", "astex.util.Format"], "astex.io.VolumeMapIO", ["astex.api.Interface", "astex.io.FILE", "$.IO", "astex.map.MapEdit", "astex.render.MoleculeRenderer", "astex.util.Point3d", "astex.viewer.Viewer", "java.lang.Double", "$.OutOfMemoryError", "$.Throwable", "JU.BS", "$.SB"], function () {
c$ = Clazz.decorateAsClass (function () {
this.map = null;
this.nPoints = 0;
this.file = null;
this.isBytes = false;
this.isBits = false;
this.isFloats = false;
this.dataMode = 0;
this.useBig = false;
this.data = null;
this.bigData = null;
this.bigByteArray = null;
this.byteArray = null;
this.oheader = null;
this.prod = 0.0;
this.plus = 0.0;
this.bigEndian = false;
Clazz.instantialize (this, arguments);
}, astex.io, "VolumeMapIO", null, astex.api.AstexVolumeMapIO);
Clazz.prepareFields (c$, function () {
this.oheader =  Clazz.newIntArray (23, 0);
});
Clazz.makeConstructor (c$, 
function () {
});
Clazz.defineMethod (c$, "setGlobals", 
 function (map) {
this.map = map;
this.dataMode = map.dataMode;
this.isBytes = (this.dataMode == 1);
this.isBits = (this.dataMode == 0);
this.isFloats = (this.dataMode == 2);
this.useBig = map.useBig;
this.data = map.data;
this.bigData = map.bigData;
this.bigByteArray = map.bigByteArray;
this.byteArray = map.byteArray;
this.prod = map.prod;
this.plus = map.plus;
}, "astex.map.VolumeMapImp");
c$.printStack = Clazz.defineMethod (c$, "printStack", 
function () {
var t =  new Throwable ();
var frames = t.getStackTrace ();
for (var i = 0; i < frames.length; i++) {
System.out.println (frames[i]);
}
});
Clazz.overrideMethod (c$, "read", 
function (map) {
this.setGlobals (map);
this.nPoints = map.nPoints;
this.closeFile ();
if (map.headerInitialised == false) {
if (!this.openFile (map)) return false;
this.readHeader ();
}return true;
}, "astex.map.VolumeMapImp");
Clazz.defineMethod (c$, "openFile", 
 function (map) {
this.file = astex.io.FILE.openStatic (map.filename, true);
if (this.file == null) {
System.out.println ("Could not access: " + map.filename);
return false;
}return true;
}, "astex.map.VolumeMapImp");
Clazz.overrideMethod (c$, "write", 
function (map, outFile, dataType, recalc) {
this.setGlobals (map);
try {
if (outFile == null) return;
var outType = 1;
if (outFile.indexOf (".bit") != -1) {
outType = 7;
} else if (outFile.indexOf (".brix") != -1 || outFile.indexOf (".omap") != -1) {
outType = 6;
}if (outType == 7) {
var label = Double.toString (map.rawLevel);
this.createMaskLevel (astex.render.MoleculeRenderer.colors[0].getRGB (), label, map.rawLevel);
var m = map.getMaskByName (label, true);
m.setLabelPosition (1, 1, 1);
var itmp =  Clazz.newIntArray (3, 0);
for (var i = 0; i < 3; i++) itmp[i] = map.maximumGrid[i] - map.minimumGrid[i];

m.setGrid (itmp);
for (var i = 0; i < 3; i++) itmp[i] = map.minimumGrid[i] + map.nu[i];

m.setOrigin (itmp);
var tmpCell =  Clazz.newDoubleArray (6, 0);
for (var i = 0; i < 3; i++) tmpCell[i] = map.cell[i] * map.grid[i] / map.nv[i];

for (var i = 3; i < 6; i++) tmpCell[i] = map.cell[i];

m.setCell (tmpCell);
m.write (outFile);
map.removeMaskByName (label);
} else {
var out =  new java.io.DataOutputStream ( new java.io.BufferedOutputStream ( new java.io.FileOutputStream (outFile)));
if (outType == 1) {
this.writeCCP4Header (out, dataType, recalc);
this.writeData (out, dataType, outFile);
} else if (outType == 6) {
this.writeBrixHeader (out);
this.writeOData (out, outFile);
}out.close ();
}} catch (e$$) {
if (Clazz.exceptionOf (e$$, java.io.FileNotFoundException)) {
var e = e$$;
{
System.out.println ("Failed to open file: " + outFile);
System.out.println ("Error message: " + e.getMessage ());
}
} else if (Clazz.exceptionOf (e$$, java.io.IOException)) {
var e = e$$;
{
System.out.println ("An IO Exception happen while writing to file: " + outFile);
System.out.println ("Error message: " + e.getMessage ());
}
} else {
throw e$$;
}
}
}, "astex.map.VolumeMapImp,~S,~N,~B");
Clazz.defineMethod (c$, "writeCCP4Header", 
 function (out, dataType, recalc) {
var sizes = this.map.getMapBoxDimensions ();
System.out.println ("sizes: " + sizes[0] + " " + sizes[1] + " " + sizes[2]);
astex.io.IO.writeIntegerArray (out, sizes);
if (dataType == 10) {
out.writeInt (0);
} else {
out.writeInt (dataType);
}for (var i = 0; i < 3; i++) {
out.writeInt (this.map.centerGrid[i] + this.map.nu[i] - Clazz.doubleToInt (sizes[i] / 2));
}
if (sizes[0] != this.map.grid[0] || sizes[1] != this.map.grid[1] || sizes[2] != this.map.grid[2]) {
astex.io.IO.writeIntegerArray (out, sizes);
} else {
astex.io.IO.writeIntegerArray (out, this.map.nv);
}var cellCpy =  Clazz.newDoubleArray (6, 0);
for (var i = 0; i < 6; i++) {
if (i < 3) {
cellCpy[i] = this.map.cell[i] * this.map.$scale * sizes[i] / this.map.grid[i];
} else {
cellCpy[i] = this.map.cell[i];
}}
astex.io.IO.writeDoubleArrayAsFloat (out, cellCpy);
var a =  Clazz.newIntArray (3, 0);
for (var i = 0; i < 3; i++) a[i] = this.map.axis[i] + 1;

astex.io.IO.writeIntegerArray (out, a);
for (var i = 0; i < 3; i++) {
if (this.map.grid[i] - sizes[i] != 0) recalc = true;
}
var tmpStats =  Clazz.newDoubleArray (5, 0);
if (recalc) {
this.map.recalcStats (tmpStats);
} else {
for (var i = 0; i < 4; i++) tmpStats[i] = this.map.stat[i];

tmpStats[4] = this.map.rms;
}if (dataType == 0) {
tmpStats[0] = -128;
tmpStats[1] = 127;
tmpStats[2] = -128 + 256 * (this.map.stat[2] - this.map.stat[0]) / this.map.stat[3];
tmpStats[4] = 256 * tmpStats[4] / this.map.stat[3];
} else if (dataType == 10) {
tmpStats[0] = 0;
tmpStats[1] = 1;
tmpStats[2] = this.map.stat[2];
tmpStats[4] = this.map.stat[4];
} else if (dataType == 1) {
if (this.map.mapType == 6 || this.map.mapType == 5 || !this.isBytes) {
tmpStats[0] = -32768;
tmpStats[1] = 32767;
tmpStats[2] = -32768 + 65536 * (this.map.stat[2] - this.map.stat[0]) / this.map.stat[3];
tmpStats[4] = 65536 * tmpStats[4] / this.map.stat[3];
}}astex.io.IO.writeDoubleArrayAsFloat (out, tmpStats, 3);
astex.io.IO.writeIntegerArray (out, this.map.ihdr3);
astex.io.IO.writeDoubleArrayAsFloat (out, this.map.rhdr3);
astex.io.IO.writeIntegerArray (out, this.map.ihdr4);
astex.io.IO.writeDoubleArrayAsFloat (out, this.map.offset);
astex.io.IO.writeCharArray (out, "MAP ");
var msdata = [17, 17, 0, 0];
var stamp =  String.instantialize (msdata);
astex.io.IO.writeCharArray (out, stamp);
astex.io.IO.writeDoubleAsFloat (out, tmpStats[4]);
astex.io.IO.writeIntegerArray (out, this.map.ihdr5);
var labels =  String.instantialize (this.map.ihdr6);
var labelsLen = labels.lastIndexOf ("//");
labelsLen += 2;
astex.io.IO.writeCharArray (out, labels, 0, labelsLen);
var existingLines = labels.$plit ("//");
var nLines = existingLines.length;
var f2 =  new astex.util.Format ("%8.2f");
var newLines =  new Array (5);
newLines[0] = " Written by OpenAstexViewer - version EBI20100304 //";
newLines[1] = " Suggested Level: " + this.map.rawLevel + " //";
newLines[2] = " Translations (x, y, z): " + f2.format (this.map.transform.x30) + " " + f2.format (this.map.transform.x31) + " " + f2.format (this.map.transform.x32) + " //";
newLines[3] = " Rotations: " + f2.format (this.map.rotation[0]) + " " + f2.format (this.map.rotation[1]) + " " + f2.format (this.map.rotation[2]) + " //";
var s = "";
if (astex.viewer.Viewer.apiPlatform != null) {
s = astex.viewer.Viewer.apiPlatform.getDateFormat ("8601");
} else if (astex.map.MapEdit.apiPlatform != null) {
s = astex.map.MapEdit.apiPlatform.getDateFormat ("8601");
}newLines[4] = " TIMESTAMP Written on: " + s + " // ";
for (var i = 0; i < 5 && nLines < 10; i++, nLines++) {
astex.io.IO.writeCharArray (out, newLines[i]);
labelsLen += newLines[i].length;
}
var padding = 800 - labelsLen;
for (var i = 0; i < padding; i++) astex.io.IO.writeCharArray (out, " ");

if (this.map.symRecords != null) astex.io.IO.writeCharArray (out, this.map.symRecords);
}, "java.io.DataOutputStream,~N,~B");
Clazz.defineMethod (c$, "writeData", 
 function (out, outType, outFile) {
this.nPoints = this.map.nPoints;
switch (outType) {
case 0:
if (this.isBits) {
var np = this.map.dataMask.size ();
for (var i = 0; i < np; i++) {
var val = (this.map.dataMask.get (i) ? 1 : 0);
out.writeByte (val);
}
return;
}if (this.isFloats) {
this.ensureMapCapacity (this.nPoints, 1);
var bScale = 256.0 / this.map.stat[3];
if (this.useBig) {
for (var i = 0; i < this.nPoints; i++) {
var bVal = Clazz.doubleToByte (-128 + (this.map.bigData.get (i) - this.map.stat[0]) * bScale);
this.map.bigByteArray.set (i, bVal);
}
} else {
for (var i = 0; i < this.nPoints; i++) {
this.map.byteArray[i] = Clazz.doubleToByte (-128 + (this.map.data[i] - this.map.stat[0]) * bScale);
}
}}if (this.useBig) {
if (this.map.invert) {
astex.io.IO.writeReverseBigByteArray (out, this.map.bigByteArray, this.nPoints);
} else {
astex.io.IO.writeBigByteArray (out, this.map.bigByteArray, this.nPoints);
}System.out.println ("Wrote " + this.map.bigByteArray.size () + " points to " + outFile + " as bytes");
} else {
if (this.map.invert) {
astex.io.IO.writeReverseByteArray (out, this.map.byteArray, this.nPoints);
} else {
astex.io.IO.writeByteArray (out, this.map.byteArray, this.nPoints);
}System.out.println ("Wrote " + this.map.byteArray.length + " points to " + outFile + " as bytes");
}break;
case 10:
if (this.useBig) {
System.err.println ("Can not handle large byte_1 array for maps!!!!!");
return;
}if (this.isFloats) {
this.ensureMapCapacity (this.nPoints, 1);
for (var i = 0; i < this.nPoints; i++) {
this.map.byteArray[i] = Clazz.floatToByte (this.map.data[i]);
}
}if (this.map.invert) {
astex.io.IO.writeReverseByteArray (out, this.map.byteArray, this.nPoints);
} else {
astex.io.IO.writeByteArray (out, this.map.byteArray, this.nPoints);
}System.out.println ("Wrote " + this.map.byteArray.length + " points to " + outFile + " as bytes");
break;
case 1:
if (this.isFloats) {
var sScale = 65536 / this.map.stat[3];
if (this.map.invert) {
if (this.useBig) {
for (var i = this.nPoints - 1; i >= 0; i--) {
var val = Clazz.doubleToShort (-32768 + (this.map.bigData.get (i) - this.map.stat[0]) * sScale);
out.writeShort (val);
}
} else {
for (var i = this.nPoints - 1; i >= 0; i--) {
var val = Clazz.doubleToShort (-32768 + (this.map.data[i] - this.map.stat[0]) * sScale);
out.writeShort (val);
}
}} else {
if (this.useBig) {
for (var i = 0; i < this.nPoints; i++) {
var val = Clazz.doubleToShort (-32768 + (this.map.bigData.get (i) - this.map.stat[0]) * sScale);
out.writeShort (val);
}
} else {
for (var i = 0; i < this.nPoints; i++) {
var val = Clazz.doubleToShort (-32768 + (this.map.data[i] - this.map.stat[0]) * sScale);
out.writeShort (val);
}
}}System.out.println ("Wrote " + this.nPoints + " points to " + outFile + " as short integers");
} else if (this.isBytes) {
if (this.useBig) {
System.err.println ("Can not handle large byte array 1 for maps!!!!!");
return;
}if (this.map.invert) {
astex.io.IO.writeReverseByteArrayAsShort (out, this.map.byteArray, this.nPoints);
} else {
astex.io.IO.writeByteArrayAsShort (out, this.map.byteArray, this.nPoints);
}System.out.println ("Wrote " + this.map.byteArray.length + " points to " + outFile + " as short integers");
}break;
case 2:
default:
if (this.isBits) {
var np = this.map.dataMask.size ();
for (var i = 0; i < np; i++) {
var val = (this.map.dataMask.get (i) ? 1.0 : 0.0);
out.writeFloat (val);
}
return;
}if (this.isBytes) {
this.ensureMapCapacity (this.nPoints, 2);
var bScale = this.map.stat[3] / 256.0;
if (this.useBig) {
for (var i = 0; i < this.nPoints; i++) {
this.map.bigData.set (i, this.map.stat[0] + (this.map.bigByteArray.get (i) + 128.0) * bScale);
}
} else {
for (var i = 0; i < this.nPoints; i++) {
this.map.data[i] = this.map.stat[0] + (this.map.byteArray[i] + 128.0) * bScale;
}
}}if (this.useBig) {
if (this.map.invert) {
astex.io.IO.writeReverseBigFloatArray (out, this.map.bigData, this.nPoints);
} else {
astex.io.IO.writeBigFloatArray (out, this.map.bigData, this.nPoints);
}} else {
if (this.map.invert) {
astex.io.IO.writeReverseFloatArray (out, this.map.data, this.nPoints);
} else {
astex.io.IO.writeFloatArray (out, this.map.data, this.nPoints);
}}System.out.println ("Wrote " + this.map.data.length + " points to " + outFile + " as floating point numbers");
break;
}
}, "java.io.DataOutputStream,~N,~S");
Clazz.defineMethod (c$, "writeBrixHeader", 
 function (out) {
var sb =  new JU.SB ();
var i5 =  new astex.util.Format ("%5d");
var i7 =  new astex.util.Format ("%7d");
var f3 =  new astex.util.Format ("%10.3f");
var f5 =  new astex.util.Format ("%11.5f");
var sizes = this.map.getMapBoxDimensions ();
sb.append (":-) origin");
for (var i = 0; i < 3; i++) sb.append (i5.format (this.map.nu[this.map.raxis[i]] + this.map.minimumGrid[this.map.raxis[i]]));

sb.append (" extent");
for (var i = 0; i < 3; i++) sb.append (i5.format (sizes[this.map.raxis[i]]));

sb.append (" grid");
if (sizes[0] != this.map.grid[0] || sizes[1] != this.map.grid[1] || sizes[2] != this.map.grid[2]) {
for (var i = 0; i < 3; i++) sb.append (i5.format (sizes[i]));

} else {
for (var i = 0; i < 3; i++) sb.append (i5.format (this.map.nv[i]));

}sb.append (" cell ");
for (var i = 0; i < 3; i++) sb.append (f3.format (this.map.cell[i] * this.map.$scale * sizes[i] / this.map.grid[i]));

for (var i = 3; i < 6; i++) sb.append (f3.format (this.map.cell[i]));

sb.append (" prod ");
if (this.prod < 1.0E-8) {
this.prod = 256.0 / this.map.stat[3];
this.plus = this.map.stat[0] * -this.prod;
}sb.append (f5.format (this.prod));
sb.append (" plus ");
sb.append (i7.format (Clazz.doubleToInt (this.plus)));
sb.append (" sigma  ");
sb.append (f5.format (this.map.rms));
var s = sb.toString ();
out.writeBytes (s);
for (var i = s.length; i < 512; i++) out.writeBytes (" ");

}, "java.io.DataOutputStream");
Clazz.defineMethod (c$, "writeOData", 
 function (out, fName) {
var brixOut =  Clazz.newByteArray (512, 0);
var bytesWritten = 0;
var bScale = .0;
switch (this.dataMode) {
case 0:
System.out.println ("No point in converting bit array to byte array");
break;
case 2:
if (this.map.stat[3] < 1.0E-8) {
System.out.println ("Header data incomplete, can not set scaling for byte data.");
System.out.println ("The map: " + this.map.getName () + " will not be written");
return;
}bScale = 256.0 / this.map.stat[3];
case 1:
var dim =  Clazz.newIntArray (3, 0);
var xtra =  Clazz.newIntArray (3, 0);
var cLen =  Clazz.newIntArray (3, 0);
var gridDim =  Clazz.newIntArray (3, 0);
for (var i = 0; i < 3; i++) {
cLen[i] = 8;
xtra[i] = 8;
gridDim[this.map.raxis[i]] = this.map.maximumGrid[this.map.raxis[i]] - this.map.minimumGrid[this.map.raxis[i]];
dim[i] = Clazz.doubleToInt (gridDim[this.map.raxis[i]] / 8);
var rem = gridDim[this.map.raxis[i]] % 8;
if (rem > 0) {
dim[i]++;
xtra[i] = rem;
}}
for (var k = 0; k < dim[2]; k++) {
if (k == dim[2] - 1) cLen[2] = xtra[2];
cLen[1] = 8;
for (var j = 0; j < dim[1]; j++) {
if (j == dim[1] - 1) cLen[1] = xtra[1];
cLen[0] = 8;
for (var i = 0; i < dim[0]; i++) {
if (i == dim[0] - 1) cLen[0] = xtra[0];
for (var k1 = 0; k1 < cLen[2]; k1++) {
for (var j1 = 0; j1 < cLen[1]; j1++) {
for (var i1 = 0; i1 < cLen[0]; i1++) {
var brixIndex = 64 * k1 + 8 * j1 + i1;
var dataIndex = this.calcDataIndex (8 * i + i1, 8 * j + j1, 8 * k + k1, gridDim);
if (dataIndex >= gridDim[0] * gridDim[1] * gridDim[2]) break;
if (this.isBytes) {
var val = (this.map.byteArray[dataIndex] + 128);
if (val >= 128) val -= 256;
brixOut[brixIndex] = val;
} else if (this.isFloats) {
brixOut[brixIndex] = Clazz.doubleToByte ((this.map.data[dataIndex] - this.map.stat[0]) * bScale);
if (this.map.data[dataIndex] >= this.map.stat[1]) brixOut[brixIndex] = -1;
}}
}
}
out.write (brixOut, 0, 512);
bytesWritten += 512;
}
}
}
System.out.println ("Wrote " + bytesWritten + " points to " + fName);
break;
}
}, "java.io.DataOutputStream,~S");
Clazz.defineMethod (c$, "calcDataIndex", 
 function (i, j, k, dim) {
var swap =  Clazz.newIntArray (3, 0);
swap[this.map.raxis[0]] = i;
swap[this.map.raxis[1]] = j;
swap[this.map.raxis[2]] = k;
var res = swap[2] * dim[0] * dim[1] + swap[1] * dim[0] + swap[0];
return res;
}, "~N,~N,~N,~A");
c$.convertBigToLittle = Clazz.defineMethod (c$, "convertBigToLittle", 
function (i) {
return (i >>> 24) | (i << 24) | ((i << 8) & 0x00ff0000) | ((i >> 8) & 0x0000ff00);
}, "~N");
Clazz.defineMethod (c$, "readHeader", 
function () {
System.out.println ("mapType " + this.map.mapType);
if (this.map.headerInitialised) {
return;
}switch (this.map.mapType) {
case 1:
this.readCCP4Header ();
break;
case 5:
this.readOHeader ();
break;
case 3:
this.readInsightHeader ();
break;
case 4:
this.readAstexHeader ();
break;
case 6:
this.readBrixHeader ();
break;
case 7:
this.readBitBinary ();
break;
}
});
Clazz.defineMethod (c$, "readAstexHeader", 
 function () {
while (this.file.nextLine ()) {
if (this.file.getChar (0) != '#') {
break;
}var header = this.file.getCurrentLineAsString ();
System.out.println (header);
}
this.map.ngrid[0] = this.file.readFieldInt (0);
this.map.ngrid[1] = this.file.readFieldInt (1);
this.map.ngrid[2] = this.file.readFieldInt (2);
this.file.nextLine ();
this.map.origin.set (this.file.readFieldDbl (0), this.file.readFieldDbl (1), this.file.readFieldDbl (2));
this.file.nextLine ();
this.map.spacing.set (this.file.readFieldDbl (0), this.file.readFieldDbl (1), this.file.readFieldDbl (2));
var dataPoints = this.map.ngrid[0] * this.map.ngrid[1] * this.map.ngrid[2];
this.ensureMapCapacity (dataPoints, this.dataMode);
for (var i = 0; i < dataPoints; i++) {
this.file.nextLine ();
this.map.data[i] = this.file.readFieldDbl (0);
}
this.map.rms = 1.0;
this.file.close ();
});
Clazz.defineMethod (c$, "readInsightHeader", 
 function () {
this.map.rms = 1.0;
this.file.nextLine ();
System.out.println (this.file.getCurrentLineAsString ());
this.file.nextLine ();
System.out.println (this.file.getCurrentLineAsString ());
this.file.nextLine ();
var fields = astex.io.FILE.split (this.file.getCurrentLineAsString (), null);
var lx = astex.io.FILE.readDouble (fields[0]);
var ly = astex.io.FILE.readDouble (fields[1]);
var lz = astex.io.FILE.readDouble (fields[2]);
this.file.nextLine ();
fields = astex.io.FILE.split (this.file.getCurrentLineAsString (), null);
this.map.ngrid[0] = astex.io.FILE.readInteger (fields[0]) + 1;
this.map.ngrid[1] = astex.io.FILE.readInteger (fields[1]) + 1;
this.map.ngrid[2] = astex.io.FILE.readInteger (fields[2]) + 1;
for (var i = 0; i < 3; i++) {
this.map.minimumGrid[i] = 0;
this.map.maximumGrid[i] = this.map.ngrid[i];
this.map.nu[i] = 0;
}
this.file.nextLine ();
fields = astex.io.FILE.split (this.file.getCurrentLineAsString (), null);
var dx = lx / (this.map.ngrid[0] - 1);
var dy = ly / (this.map.ngrid[1] - 1);
var dz = lz / (this.map.ngrid[2] - 1);
this.map.spacing.set (dx, dy, dz);
var ox = astex.io.FILE.readInteger (fields[1]) * dx;
var oy = astex.io.FILE.readInteger (fields[3]) * dy;
var oz = astex.io.FILE.readInteger (fields[5]) * dz;
this.map.origin.set (ox, oy, oz);
System.out.println ("Origin ... " + this.map.origin);
System.out.println ("Spacing .." + this.map.spacing);
var dataPoints = this.map.ngrid[0] * this.map.ngrid[1] * this.map.ngrid[2];
this.ensureMapCapacity (dataPoints, this.dataMode);
for (var i = 0; i < dataPoints; i++) {
this.file.nextLine ();
this.map.data[i] = this.file.readDoubleRange (0, 10);
}
this.file.close ();
});
Clazz.defineMethod (c$, "readBrixHeader", 
 function () {
var rawHeader =  Clazz.newByteArray (512, 0);
for (var i = 0; i < 512; i++) {
rawHeader[i] = this.file.readByteAsInt ();
}
var header =  String.instantialize (rawHeader);
var words = header.$plit ("\\s+");
if (words[0].equals (":-)")) {
} else {
System.out.println ("Does not recognize the file " + this.map.getFile () + " as a BRIX file");
System.out.println ("Magic token '" + words[0] + "' did not match should be ':-)'");
return;
}if (words.length < 26) {
System.out.println ("Does not recognize the file " + this.map.getFile () + " as a BRIX file");
System.out.println ("Only found " + words.length + " words (should be 26)");
return;
}for (var i = 0; i < 3; i++) this.map.nu[i] = Integer.parseInt (words[i + 2]);

for (var i = 0; i < 3; i++) this.map.grid[i] = Integer.parseInt (words[i + 6]);

for (var i = 0; i < 3; i++) this.map.nv[i] = Integer.parseInt (words[i + 10]);

for (var i = 0; i < 6; i++) this.map.cell[i] = Double.parseDouble (words[i + 14]);

this.map.prod = this.prod = Double.parseDouble (words[21]);
this.map.plus = this.plus = Double.parseDouble (words[23]);
this.map.rms = Double.parseDouble (words[25]);
for (var i = 0; i < 3; i++) {
this.map.axis[i] = i;
this.map.raxis[i] = i;
}
if (this.map.mapMode == 0) this.map.rawLevel = this.map.rms;
this.readOData (true);
});
Clazz.defineMethod (c$, "readOData", 
 function (needStat) {
var inx = Clazz.doubleToInt (this.map.grid[0] / 8);
var iny = Clazz.doubleToInt (this.map.grid[1] / 8);
var inz = Clazz.doubleToInt (this.map.grid[2] / 8);
if ((this.map.grid[0] % 8) > 0) inx++;
if ((this.map.grid[1] % 8) > 0) iny++;
if ((this.map.grid[2] % 8) > 0) inz++;
var xtraX = (this.map.grid[0] % 8);
var xtraY = (this.map.grid[1] % 8);
var xtraZ = (this.map.grid[2] % 8);
var blockData =  Clazz.newByteArray (512, 0);
this.map.odata =  Clazz.newByteArray (inx * 8, iny * 8, inz * 8, 0);
var min = 256;
var max = 0;
for (var k = 0; k < inz; k++) {
for (var j = 0; j < iny; j++) {
for (var i = 0; i < inx; i++) {
for (var d = 0; d < 512; d++) {
blockData[d] = this.file.readByteAsInt ();
}
var byteSwap = false;
if (byteSwap) {
for (var ii = 0; ii < 511; ii += 2) {
var dum = blockData[ii];
blockData[ii] = blockData[ii + 1];
blockData[ii + 1] = dum;
}
}var cubieSizeX = 8;
var cubieSizeY = 8;
var cubieSizeZ = 8;
if (xtraX > 0) if (i == inx - 1) cubieSizeX = xtraX;
if (xtraY > 0) if (j == iny - 1) cubieSizeY = xtraY;
if (xtraZ > 0) if (k == inz - 1) cubieSizeZ = xtraZ;
for (var n = 0; n < cubieSizeZ; n++) {
for (var m = 0; m < cubieSizeY; m++) {
for (var l = 0; l < cubieSizeX; l++) {
var sboxLMN = blockData[8 * 8 * n + 8 * m + l];
var pt3 = (k) * 8 + n;
var pt2 = (j) * 8 + m;
var pt1 = (i) * 8 + l;
this.map.odata[pt1][pt2][pt3] = sboxLMN;
if (needStat) {
var tmp = sboxLMN;
if (tmp < 0) tmp += 256;
if (tmp > max) max = tmp;
if (tmp < min) min = tmp;
}}
}
}
}
}
}
if (needStat) {
this.map.stat[0] = (min - this.plus) / this.prod;
this.map.stat[1] = (max - this.plus) / this.prod;
this.map.stat[3] = this.map.stat[1] - this.map.stat[0];
this.map.stat[4] = this.map.rms;
if (this.map.debug) System.out.println ("stats " + max + " " + min + " " + this.map.stat[0] + " " + this.map.stat[1] + " " + this.map.stat[3]);
}this.map.setUnitCell (this.map.cell);
this.map.headerInitialised = true;
this.printHeader (System.out);
}, "~B");
Clazz.defineMethod (c$, "readOHeader", 
 function () {
if (this.map.debug) System.out.println ("readOHeader");
astex.io.IO.readShortArray (this.file, this.oheader, this.map.bigEndian);
if (this.map.debug) {
for (var i = 0; i < 23; i++) {
System.out.println ("oheader[" + i + "] = " + this.oheader[i]);
}
}for (var i = 0; i < 466; i++) {
var c = this.file.readByteAsInt ();
if (c == astex.io.FILE.EOF) {
System.out.println ("eof reading o header");
return;
}}
var iprod = this.oheader[15];
var iplus = this.oheader[16];
var iscale1 = this.oheader[17];
var iscale2 = this.oheader[18];
var imin = this.oheader[19];
var imax = this.oheader[20];
var isigma = this.oheader[21];
var imean = this.oheader[22];
this.map.grid[0] = this.oheader[3];
this.map.grid[1] = this.oheader[4];
this.map.grid[2] = this.oheader[5];
this.map.nu[0] = this.oheader[0];
this.map.nu[1] = this.oheader[1];
this.map.nu[2] = this.oheader[2];
this.map.nv[0] = this.oheader[6];
this.map.nv[1] = this.oheader[7];
this.map.nv[2] = this.oheader[8];
this.map.axis[0] = 0;
this.map.axis[1] = 1;
this.map.axis[2] = 2;
if (iscale1 == 0) iscale1 = 100;
if (iscale2 == 0) iscale2 = 100;
this.map.prod = this.prod = iprod / iscale2;
this.map.plus = this.plus = iplus;
this.map.stat[0] = (imin - this.plus) / this.prod;
this.map.stat[1] = (imax - this.plus) / this.prod;
this.map.rms = (isigma - this.plus) / this.prod;
this.map.stat[2] = (imean - this.plus) / this.prod;
this.map.stat[3] = this.map.stat[1] - this.map.stat[0];
this.map.stat[4] = this.map.rms;
if (this.map.mapMode == 0) this.map.rawLevel = this.map.rms;
for (var i = 0; i < 6; i++) {
this.map.cell[i] = this.oheader[i + 9] / iscale1;
}
this.readOData (false);
});
Clazz.defineMethod (c$, "readCCP4Header", 
 function () {
astex.io.IO.readIntegerArray (this.file, this.map.grid, this.map.bigEndian);
var firstWord = this.map.grid[0];
if (firstWord >= 65536 || firstWord < -65536) {
this.map.bigEndian = false;
this.map.grid[0] = astex.io.VolumeMapIO.convertBigToLittle (this.map.grid[0]);
this.map.grid[1] = astex.io.VolumeMapIO.convertBigToLittle (this.map.grid[1]);
this.map.grid[2] = astex.io.VolumeMapIO.convertBigToLittle (this.map.grid[2]);
}this.bigEndian = this.map.bigEndian;
var tmp = this.map.getLargestGridExtent ();
if (tmp < this.map.contourSize) this.map.setContourSize (tmp);
this.map.mode = astex.io.IO.readInteger (this.file, this.bigEndian);
if (this.map.mode != 0 && this.map.mode != 1 && this.map.mode != 2) {
this.closeFile ();
return;
}astex.io.IO.readIntegerArray (this.file, this.map.nu, this.bigEndian);
astex.io.IO.readIntegerArray (this.file, this.map.nv, this.bigEndian);
astex.io.IO.readFloatsAsDoubleArray (this.file, this.map.cell, this.map.cell.length, this.bigEndian);
for (var i = 0; i < 3; i++) {
if (Math.abs (this.map.cell[i]) < 1.0E-8) {
System.out.println ("WARNING: Cell size in file is 0");
System.out.println ("Setting cell size to grid size, i.e, 1 Angstrom/voxel");
this.map.cell[i] = this.map.grid[i];
}}
astex.io.IO.readIntegerArray (this.file, this.map.axis, this.bigEndian);
for (var i = 0; i < 3; i++) this.map.axis[i] -= 1;

for (var i = 0; i < 3; i++) this.map.raxis[this.map.axis[i]] = i;

astex.io.IO.readFloatsAsDoubleArray (this.file, this.map.stat, 3, this.bigEndian);
this.map.stat[3] = this.map.stat[1] - this.map.stat[0];
astex.io.IO.readIntegerArray (this.file, this.map.ihdr3, this.bigEndian);
astex.io.IO.readFloatsAsDoubleArray (this.file, this.map.rhdr3, this.map.rhdr3.length, this.bigEndian);
astex.io.IO.readIntegerArray (this.file, this.map.ihdr4, this.bigEndian);
astex.io.IO.readFloatsAsDoubleArray (this.file, this.map.offset, this.map.offset.length, this.bigEndian);
if (Math.abs (this.map.offset[0]) > 1.0E-8 || Math.abs (this.map.offset[1]) > 1.0E-8 || Math.abs (this.map.offset[2]) > 1.0E-8) {
System.out.println ("Non standard origin field found in map will use these in place of the settings");
System.out.println ("for N[C|R|S]START " + this.map.offset[0] + " " + this.map.offset[1] + " " + this.map.offset[2]);
if (this.map.nu[0] != 0 || this.map.nu[1] != 0 || this.map.nu[2] != 0) System.out.println ("offset was: " + this.map.nu[0] + " " + this.map.nu[1] + " " + this.map.nu[2]);
for (var i = 0; i < 3; i++) this.map.nu[i] = Math.round (this.map.offset[i] * this.map.grid[i] / this.map.cell[i]);

}astex.io.IO.readIntegerArray (this.file, this.map.ihdr4b, this.bigEndian);
this.map.rms = astex.io.IO.readFloat (this.file, this.bigEndian);
if (this.map.firstTime && this.map.mapMode == 0) {
this.map.rawLevel = this.map.rms;
}astex.io.IO.readIntegerArray (this.file, this.map.ihdr5, this.bigEndian);
for (var i = 0; i < this.map.ihdr6.length; i++) {
this.map.ihdr6[i] = String.fromCharCode (this.file.readByteAsInt ());
}
if (this.map.ihdr3[1] > 0) {
this.map.symRecords =  Clazz.newCharArray (this.map.ihdr3[1], '\0');
for (var i = 0; i < this.map.ihdr3[1]; i++) {
this.map.symRecords[i] = String.fromCharCode (this.file.readByteAsInt ());
}
}this.map.setSpaceGroupNumber (this.map.ihdr3[0]);
System.out.println ("ihdr3[0] " + this.map.ihdr3[0]);
System.out.println ("gsgn     " + this.map.getSpaceGroupNumber ());
this.map.setUnitCell (this.map.cell);
this.map.setRotations (.0, .0, .0);
this.printHeader (System.out);
this.map.firstTime = false;
});
Clazz.defineMethod (c$, "readBitBinary", 
 function () {
if (this.map.needsReading () != 2) return;
var then = 0;
if (this.map.debug) then = System.currentTimeMillis ();
this.file.close ();
var m = astex.render.MoleculeRenderer.newMapMask (0);
m.setFileName (this.map.filename);
m.read (this.map);
this.map.nv = this.map.grid = m.getGrid ();
this.map.cell = m.getCell ();
this.map.nu = m.getOrigin ();
this.map.nPoints = this.nPoints = this.map.nv[0] * this.map.nv[1] * this.map.nv[2];
if (this.nPoints > 2147483638) this.useBig = true;
this.map.rms = this.map.rawLevel = 0.5;
for (var i = 0; i < 3; i++) this.map.axis[i] = i;

this.setGlobals (this.map);
this.ensureMapCapacity (this.nPoints, this.dataMode);
this.map.dataMask.clearAll ();
this.map.dataMask.or (m.getMask ());
this.map.setUnitCell (this.map.cell);
this.map.setRotations (.0, .0, .0);
this.map.setContourColor (0, m.getColor ());
for (var i = 0; i < 3; i++) this.map.setCenterGrid (i, Clazz.doubleToInt (this.map.grid[i] / 2));

this.map.setContourSize (Clazz.doubleToInt ((this.map.getLargestGridExtent () + 1) / 2));
this.printHeader (System.out);
if (this.map.debug) {
var now = System.currentTimeMillis () - then;
System.out.println ("Time to read bit binary: " + now + " ms");
}this.map.setNeedsReading (1);
});
Clazz.overrideMethod (c$, "writeHeader", 
function (map) {
this.setGlobals (map);
var fName = map.getFile ();
fName += ".head";
try {
var out =  new java.io.PrintStream ( new java.io.BufferedOutputStream ( new java.io.FileOutputStream (fName, true)));
if (out != null) {
this.printHeaderAlt (out);
out.close ();
}} catch (e$$) {
if (Clazz.exceptionOf (e$$, java.io.FileNotFoundException)) {
var e = e$$;
{
}
} else if (Clazz.exceptionOf (e$$, SecurityException)) {
var e = e$$;
{
}
} else {
throw e$$;
}
}
}, "astex.map.VolumeMapImp");
Clazz.defineMethod (c$, "printHeaderAlt", 
function (ps) {
var f8 =  new astex.util.Format ("%.8f");
var f3 =  new astex.util.Format ("%.3f");
ps.println ("bigEndian " + this.bigEndian);
ps.println ("file " + this.map.getFile ());
ps.println ("gridX " + this.map.grid[0]);
ps.println ("gridY " + this.map.grid[1]);
ps.println ("gridZ " + this.map.grid[2]);
ps.println ("min " + f8.format (this.map.stat[0]));
ps.println ("max " + f8.format (this.map.stat[1]));
ps.println ("ave " + f8.format (this.map.stat[2]));
ps.println ("rms " + f8.format (this.map.getSigma ()));
ps.println ("range " + f8.format (this.map.stat[3]));
ps.print ("axisOrder ");
for (var j = 0; j < 3; j++) {
if (this.map.axis[j] == 0) {
ps.print ("X");
} else if (this.map.axis[j] == 1) {
ps.print ("Y");
} else if (this.map.axis[j] == 2) {
ps.print ("Z");
}}
ps.println ();
ps.println ("pixelSize " + f3.format (this.map.cell[0] / this.map.grid[0]));
}, "java.io.PrintStream");
Clazz.defineMethod (c$, "printHeader", 
function (printStream) {
var d5 =  new astex.util.Format ("%5d");
var f5 =  new astex.util.Format ("%10.5f");
var f3 =  new astex.util.Format ("%8.3f");
if (this.map.debug) System.out.println ("big endian is: " + this.bigEndian);
printStream.println ("Map " + this.map.getFile ());
printStream.print ("Grid in file  ");
for (var i = 0; i < 3; i++) printStream.print (d5.format (this.map.grid[i]));

printStream.println ("");
printStream.print ("Grid origin   ");
for (var i = 0; i < 3; i++) printStream.print (d5.format (this.map.nu[i]));

printStream.println ("");
printStream.print ("Grid size     ");
for (var i = 0; i < 3; i++) printStream.print (d5.format (this.map.nv[i]));

printStream.println ("");
if (Math.abs (this.map.stat[0]) > 1.0E-8 || Math.abs (this.map.stat[1]) > 1.0E-8) {
printStream.print ("Min density    " + f5.format (this.map.stat[0]) + "\n");
printStream.print ("Max density    " + f5.format (this.map.stat[1]) + "\n");
} else if (this.map.debug) {
printStream.print (" min max: " + this.map.stat[0] + " " + this.map.stat[1] + " " + this.map.stat[2] + " " + this.map.rms + "\n");
}printStream.print ("RMS density   " + f5.format (this.map.rms));
printStream.println ("");
printStream.print ("Map mode      " + d5.format (this.map.mode));
if (this.map.mapType == 1) {
switch (this.map.mode) {
case 0:
printStream.print (" (1-byte signed int)");
break;
case 1:
printStream.print (" (2-byte signed int)");
break;
case 2:
printStream.print (" (4-byte float)");
break;
}
}printStream.println ("");
printStream.print ("Axis order      ");
for (var j = 0; j < 3; j++) {
printStream.print (" ");
if (this.map.axis[j] == 0) {
printStream.print ("X");
} else if (this.map.axis[j] == 1) {
printStream.print ("Y");
} else if (this.map.axis[j] == 2) {
printStream.print ("Z");
}}
printStream.println ("");
if (this.map.debug) printStream.println ("raxis order: " + this.map.raxis[0] + " " + this.map.raxis[1] + " " + this.map.raxis[2]);
printStream.print ("Unit cell     ");
for (var i = 0; i < 6; i++) printStream.print (f3.format (this.map.cell[i]));

printStream.println ("");
}, "java.io.PrintStream");
Clazz.overrideMethod (c$, "readSegger", 
function (map, fName, level) {
try {
(astex.api.Interface.getInterface ("astex.io.SeggerReader")).readSegger (map, fName, level);
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
System.out.println ("The Segger reader is only supported in the standalone version of Astex Viewer. ");
} else {
throw e;
}
}
}, "astex.map.VolumeMapImp,~S,~N");
Clazz.defineMethod (c$, "ensureMapCapacity", 
 function (dataPoints, dMode) {
switch (dMode) {
case 0:
if (this.useBig) {
System.err.println ("Can not handle large data as USE_BITS");
return;
}if (this.map.dataMask == null || dataPoints > this.map.dataMask.size ()) {
try {
this.map.dataMask = JU.BS.newN (dataPoints + 1);
} catch (e) {
if (Clazz.exceptionOf (e, OutOfMemoryError)) {
System.out.println ("Out of memory in Map, trying to allocate: " + Clazz.doubleToInt (dataPoints / 8) + " bytes");
throw  new OutOfMemoryError (e.getMessage ());
} else {
throw e;
}
}
}break;
case 1:
try {
if (this.useBig) {
if (this.map.bigByteArray == null || dataPoints > this.map.bigByteArray.size ()) {
this.map.bigByteArray =  new astex.util.BigByteArray (dataPoints);
}} else {
if (this.map.byteArray == null || dataPoints > this.map.byteArray.length) {
this.map.byteArray =  Clazz.newByteArray (dataPoints, 0);
}if (this.map.bigByteArray != null) {
this.map.bigByteArray.free ();
this.map.bigByteArray = null;
}}} catch (e) {
if (Clazz.exceptionOf (e, OutOfMemoryError)) {
System.out.println ("Out of memory in Map, trying to allocate: " + dataPoints + " bytes");
throw  new OutOfMemoryError (e.getMessage ());
} else {
throw e;
}
}
break;
case 2:
try {
if (this.useBig) {
if (this.map.bigData == null || dataPoints > this.map.bigData.size ()) {
this.map.bigData =  new astex.util.BigFloatArray (dataPoints);
}} else {
if (this.map.data == null || dataPoints > this.map.data.length) {
this.map.data =  Clazz.newFloatArray (dataPoints, 0);
}if (this.map.bigData != null) {
this.map.bigData.free ();
this.map.bigData = null;
}}} catch (e) {
if (Clazz.exceptionOf (e, OutOfMemoryError)) {
System.out.println ("Out of memory in Map, trying to allocate: " + 4 * dataPoints + " bytes");
throw  new OutOfMemoryError (e.getMessage ());
} else {
throw e;
}
}
break;
default:
System.out.println ("Unknown data model in ensureMapCapacity: " + this.dataMode);
break;
}
this.setGlobals (this.map);
}, "~N,~N");
Clazz.overrideMethod (c$, "readRegionData", 
function (map) {
if (map.mapType != 1 && map.mapType != 5 && map.mapType != 6) {
return false;
}if ((map.mapType == 1 && map.mode != 0 && map.mode != 1 && map.mode != 2)) {
System.out.println ("Only mode 0, 1, and 2 (byte, short, and float)" + " supported for CCP4/MRC maps, map will not be read. Mode: " + map.mode);
return false;
}this.setGlobals (map);
this.reset (map);
var then = 0;
if (map.debug) then = System.currentTimeMillis ();
var dx = map.maximumGrid[0] - map.minimumGrid[0];
var dy = map.maximumGrid[1] - map.minimumGrid[1];
var dz = map.maximumGrid[2] - map.minimumGrid[2];
if (map.debug) {
System.out.println ("readRegion dx " + dx);
System.out.println ("readRegion dy " + dy);
System.out.println ("readRegion dz " + dz);
System.out.println ("readRegion minimumGrid[0] " + map.minimumGrid[0]);
System.out.println ("readRegion minimumGrid[1] " + map.minimumGrid[1]);
System.out.println ("readRegion minimumGrid[2] " + map.minimumGrid[2]);
System.out.println ("readRegion maximumGrid[0] " + map.maximumGrid[0]);
System.out.println ("readRegion maximumGrid[1] " + map.maximumGrid[1]);
System.out.println ("readRegion maximumGrid[2] " + map.maximumGrid[2]);
}map.nPoints = this.nPoints = dx * dy * dz;
if (this.nPoints > 2147483638) map.useBig = this.useBig = true;
this.ensureMapCapacity (this.nPoints, this.dataMode);
var point = 0;
var grid0 = map.grid[0];
var grid1 = map.grid[1];
var grid2 = map.grid[2];
var max0 = map.maximumGrid[0];
var max1 = map.maximumGrid[1];
var max2 = map.maximumGrid[2];
var min0 = map.minimumGrid[0];
var min1 = map.minimumGrid[1];
var min2 = map.minimumGrid[2];
if (map.debug) {
System.out.println (grid0 + " " + grid1 + " " + grid2 + " " + min0 + " " + min1 + " " + min2 + " " + max0 + " " + max1 + " " + max2);
}var bScale = .0;
if (this.isBytes) {
if (map.stat[3] < 1.0E-8) {
System.out.println ("Header data incomplete, can not set scaling for byte data.");
System.out.println ("The map: " + map.getName () + " will not be read");
return false;
}bScale = 256.0 / map.stat[3];
}this.setGlobals (map);
if (map.mapType == 1) {
var mode = map.mode;
for (var s = 0; s < max2; s++) {
for (var r = 0; r < grid1; r++) {
for (var c = 0; c < grid0; c++) {
if (s >= min2 && s < max2 && r >= min1 && r < max1 && c >= min0 && c < max0) {
var f = .0;
switch (mode) {
case 0:
var b = this.file.readByteAsInt ();
if (b > 127) b -= 256;
f = b;
break;
case 1:
f = astex.io.IO.readShort (this.file, this.bigEndian);
break;
case 2:
f = astex.io.IO.readFloat (this.file, this.bigEndian);
break;
}
if (this.isBytes) {
var bVal = Clazz.doubleToByte ((f - map.stat[0]) * bScale - 128.0);
if (this.useBig) {
this.bigByteArray.set (point++, bVal);
} else {
this.byteArray[point++] = bVal;
}} else {
if (this.useBig) {
this.bigData.set (point++, f);
} else {
this.data[point++] = f;
}}} else {
var bc = 0;
switch (mode) {
case 0:
bc = 1;
break;
case 1:
bc = 2;
break;
case 2:
bc = 4;
break;
}
var i = this.file.skip (bc);
if (i == astex.io.FILE.EOF) {
System.out.println ("unexpected EOF!");
}}}
}
}
} else if (map.mapType == 5 || map.mapType == 6) {
for (var s = 0; s < max2; s++) {
for (var r = 0; r < grid1; r++) {
for (var c = 0; c < grid0; c++) {
if (s >= min2 && s < max2 && r >= min1 && r < max1 && c >= min0 && c < max0) {
var b = map.odata[c][r][s];
var sb = 0;
if (b < 0) {
sb = (b + 256);
} else {
sb = b;
}if (this.isBytes) {
var bVal = (sb - 128);
if (this.useBig) {
this.bigByteArray.set (point++, bVal);
} else {
this.byteArray[point++] = bVal;
}} else {
var f = ((sb - this.plus) / this.prod);
if (this.useBig) {
this.bigData.set (point++, f);
} else {
this.data[point++] = f;
}}}}
}
}
} else {
System.out.println ("trying to reread data for type " + map.mapType);
}System.out.println ("Points read: " + point);
if (map.debug) {
var now = System.currentTimeMillis () - then;
System.out.println ("Time to read region: " + now + " ms");
}if (this.file != null) {
this.file.close ();
this.file = null;
}map.setNeedsReading (1);
if (map.debug) {
map.recalcStats (map.stat);
this.printHeader (System.out);
var l2 = (map.rawLevel - 0.03 * (map.stat[1] - map.stat[0]));
this.extent (map.rawLevel, l2);
}return true;
}, "astex.map.VolumeMapImp");
Clazz.defineMethod (c$, "extent", 
 function (level1, level2) {
var maximumGrid = this.map.maximumGrid;
var minimumGrid = this.map.minimumGrid;
var data = this.map.data;
var minX1 = maximumGrid[0];
var minY1 = maximumGrid[1];
var minZ1 = maximumGrid[2];
var minX2 = maximumGrid[0];
var minY2 = maximumGrid[1];
var minZ2 = maximumGrid[2];
var maxX1 = minimumGrid[0];
var maxY1 = minimumGrid[1];
var maxZ1 = minimumGrid[2];
var maxX2 = minimumGrid[0];
var maxY2 = minimumGrid[1];
var maxZ2 = minimumGrid[2];
var mx = maximumGrid[0] - minimumGrid[0];
var mxy = mx * (maximumGrid[1] - minimumGrid[1]);
System.out.println ("levels: " + level1 + " " + level2);
for (var i = minimumGrid[0]; i < maximumGrid[0]; i++) {
for (var j = minimumGrid[1]; j < maximumGrid[1]; j++) {
for (var k = minimumGrid[2]; k < maximumGrid[2]; k++) {
var pos = k * mxy + j * mx + i;
var val = data[pos];
if (val > level1) {
if (i < minX1) minX1 = i;
if (i > maxX1) maxX1 = i;
if (j < minY1) minY1 = j;
if (j > maxY1) maxY1 = j;
if (k < minZ1) minZ1 = k;
if (k > maxZ1) maxZ1 = k;
}if (val > level2) {
if (i < minX2) minX2 = i;
if (i > maxX2) maxX2 = i;
if (j < minY2) minY2 = j;
if (j > maxY2) maxY2 = j;
if (k < minZ2) minZ2 = k;
if (k > maxZ2) maxZ2 = k;
}}
}
}
System.out.println ("min l1: " + minX1 + " " + minY1 + " " + minZ1);
System.out.println ("max l1: " + maxX1 + " " + maxY1 + " " + maxZ1);
System.out.println ("min l2: " + minX2 + " " + minY2 + " " + minZ2);
System.out.println ("max l2: " + maxX2 + " " + maxY2 + " " + maxZ1);
var bX = Clazz.doubleToInt ((maxX1 - minX1 + 1) + .05 * (maximumGrid[0] - minimumGrid[0]));
var bY = Clazz.doubleToInt ((maxY1 - minY1 + 1) + .05 * (maximumGrid[1] - minimumGrid[1]));
var bZ = Clazz.doubleToInt ((maxZ1 - minZ1 + 1) + .05 * (maximumGrid[2] - minimumGrid[2]));
System.out.println ("box 1:" + bX + " " + bY + " " + bZ);
System.out.println ("box 2:" + (maxX2 - minX2 + 1) + " " + (maxY2 - minY2 + 1) + " " + (maxZ2 - minZ2 + 1));
}, "~N,~N");
Clazz.defineMethod (c$, "downSample", 
function (newSizes, doCenter, downVoxel) {
if (!this.isFloats) {
System.out.println ("Down sampling only supported for floating point data mode.");
return;
}if (newSizes[0] == 0) {
for (var i = 0; i < 3; i++) {
var ns = Clazz.doubleToInt (this.map.cell[i] / downVoxel);
if (ns < 160) ns = 160;
if (ns > this.map.grid[i]) ns = this.map.grid[i];
newSizes[i] = ns;
}
}var newx = newSizes[0];
var newy = newSizes[1];
var newz = newSizes[2];
var newxy = newx * newy;
var newPoints = newxy * newz;
var mx = this.map.maximumGrid[0] - this.map.minimumGrid[0];
var mxy = mx * (this.map.maximumGrid[1] - this.map.minimumGrid[1]);
var tmpVol =  Clazz.newFloatArray (newPoints, 0);
var grid = this.map.grid;
if (this.map.debug) {
System.out.println ("newSizes: " + newx + " " + newy + " " + newz);
System.out.println ("grid: " + grid[0] + " " + grid[1] + " " + grid[2]);
}for (var i = 0; i < newx; i++) {
var ii = Clazz.doubleToInt ((i * grid[0]) / newx);
var irem = (i * grid[0]) % newx;
var iFrac = .0;
var doIfrac = false;
if (irem != 0) {
doIfrac = true;
iFrac = (irem) / newx;
}for (var j = 0; j < newy; j++) {
var jj = Clazz.doubleToInt ((j * grid[1]) / newy);
var jrem = (j * grid[1]) % newy;
var jFrac = .0;
var doJfrac = false;
if (jrem != 0) {
doJfrac = true;
jFrac = (jrem) / newy;
}for (var k = 0; k < newz; k++) {
var kk = Clazz.doubleToInt ((k * grid[2]) / newz);
var krem = (k * grid[2]) % newz;
var kFrac = .0;
var doKfrac = false;
if (krem != 0) {
doKfrac = true;
kFrac = (krem) / newz;
}var newVal = this.value (ii, jj, kk, doIfrac, doJfrac, doKfrac, iFrac, jFrac, kFrac, mx, mxy);
var newPos = k * newxy + j * newx + i;
tmpVol[newPos] = newVal;
}
}
}
for (var i = 0; i < 3; i++) {
if (this.map.debug) System.out.println ("i " + i + " nu " + this.map.nu[i] + " grid " + grid[i] + " new size " + newSizes[i] + " unit cell " + this.map.nv[i]);
this.map.maximumGrid[i] = this.map.minimumGrid[i] + newSizes[i];
this.map.centerGrid[i] = Clazz.doubleToInt (newSizes[i] / 2);
if (doCenter) {
this.map.nu[i] = Clazz.doubleToInt (-newSizes[i] / 2);
} else {
this.map.nu[i] = Math.round (this.map.nu[i] * newSizes[i] / grid[i]);
this.map.nu[i] += this.map.centerGrid[i] - Clazz.doubleToInt (newSizes[i] / 2);
}this.map.nv[this.map.axis[i]] = Math.round (this.map.nv[this.map.axis[i]] * newSizes[i] / this.map.grid[i]);
this.map.grid[i] = newSizes[i];
}
this.map.nPoints = this.nPoints = newPoints;
this.useBig = false;
if (this.nPoints > 2147483638) this.useBig = true;
this.data = tmpVol;
this.setGlobals (this.map);
this.map.recalcStats (this.map.stat);
}, "~A,~B,~N");
Clazz.defineMethod (c$, "value", 
function (i, j, k, doIfrac, doJfrac, doKfrac, iFrac, jFrac, kFrac, mx, mxy) {
var pos = k * mxy + j * mx + i;
var val = this.map.getValue (pos);
var newVal = (1.0 - iFrac) * (1.0 - jFrac) * (1.0 - kFrac) * val;
if (doIfrac) {
pos++;
val = this.map.getValue (pos);
newVal += iFrac * (1.0 - jFrac) * (1.0 - kFrac) * val;
}if (doJfrac) {
pos = k * mxy + (j + 1) * mx + i;
val = this.map.getValue (pos);
newVal += (1.0 - iFrac) * jFrac * (1.0 - kFrac) * val;
if (doIfrac) {
pos++;
val = this.map.getValue (pos);
newVal += iFrac * jFrac * (1.0 - kFrac) * val;
}}if (doKfrac) {
pos = (k + 1) * mxy + j * mx + i;
val = this.map.getValue (pos);
newVal += (1.0 - iFrac) * (1.0 - jFrac) * kFrac * val;
if (doIfrac) {
pos++;
val = this.map.getValue (pos);
newVal += iFrac * (1.0 - jFrac) * kFrac * val;
}if (doJfrac) {
pos = (k + 1) * mxy + (j + 1) * mx + i;
val = this.map.getValue (pos);
newVal += (1.0 - iFrac) * jFrac * kFrac * val;
if (doIfrac) {
pos++;
val = this.map.getValue (pos);
newVal += iFrac * jFrac * kFrac * val;
}}}return newVal;
}, "~N,~N,~N,~B,~B,~B,~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "reScale", 
function () {
var scale = (256.0 / this.map.getMinMax ()[3]);
if (this.useBig) {
var np = this.bigData.size ();
for (var i = 0; i < np; i++) {
this.bigData.set (i, this.bigData.get (i) * scale);
}
} else {
var np = this.map.getDataArraySize ();
for (var i = 0; i < np; i++) {
this.data[i] *= scale;
}
}this.map.recalcStats (this.map.stat);
});
c$.genBinLabel = Clazz.defineMethod (c$, "genBinLabel", 
function (value, range) {
var str;
if (range < .00001) {
str = astex.io.VolumeMapIO.gf9.format (value);
} else if (range < .0001) {
str = astex.io.VolumeMapIO.gf7.format (value);
} else if (range < .001) {
str = astex.io.VolumeMapIO.gf7.format (value);
} else if (range < .01) {
str = astex.io.VolumeMapIO.gf6.format (value);
} else if (range < .1) {
str = astex.io.VolumeMapIO.gf5.format (value);
} else if (range < 1.0) {
str = astex.io.VolumeMapIO.gf4.format (value);
} else if (range < 10.0) {
str = astex.io.VolumeMapIO.gf3.format (value);
} else {
str = astex.io.VolumeMapIO.gf2.format (value);
}return str;
}, "~N,~N");
Clazz.overrideMethod (c$, "writeGraph", 
function (map, nIntervals, fName, findMax) {
this.setGlobals (map);
if (fName == null) fName = "graph.txt";
var minMax = map.getMinMax ();
var bins =  Clazz.newIntArray (nIntervals + 1, 0);
var np = map.getDataSize ();
System.out.println ("np " + np + " min " + minMax[0] + " ave " + minMax[3]);
for (var i = 0; i < np; i++) {
var val = map.getValue (i);
var bin = Clazz.doubleToInt (nIntervals * ((val - minMax[0]) / minMax[3]));
if (bin > nIntervals + 1) {
System.out.println ("bin number outside range: " + bin + " " + nIntervals + 1);
continue;
}bins[bin]++;
}
var str =  String.instantialize ();
var frac = minMax[3] / nIntervals;
if (findMax) {
var maxBin = 0;
var maxPoints = bins[0];
for (var i = 0; i < nIntervals; i++) {
if (bins[i] > maxPoints) {
maxBin = i;
maxPoints = bins[i];
}}
str += astex.io.VolumeMapIO.genBinLabel ((minMax[0] + (maxBin + 0.5) * frac), minMax[3]) + " " + bins[maxBin] + "\n";
} else {
for (var i = 0; i < nIntervals; i++) {
if (bins[i] > 0) {
str += astex.io.VolumeMapIO.genBinLabel ((minMax[0] + (i + 0.5) * frac), minMax[3]) + ", " + astex.io.VolumeMapIO.gf4.format (Math.log10 (bins[i])) + "\n";
} else {
System.out.println ("bin " + i + " do not have any points");
}}
}try {
var out =  new java.io.DataOutputStream ( new java.io.BufferedOutputStream ( new java.io.FileOutputStream (fName, true)));
if (out != null) {
out.writeBytes (str);
out.close ();
}} catch (e$$) {
if (Clazz.exceptionOf (e$$, java.io.FileNotFoundException)) {
var e = e$$;
{
}
} else if (Clazz.exceptionOf (e$$, SecurityException)) {
var e = e$$;
{
}
} else if (Clazz.exceptionOf (e$$, java.io.IOException)) {
var e = e$$;
{
System.err.println ("Got IO Exception in Density graph");
}
} else {
throw e$$;
}
}
}, "astex.map.VolumeMapImp,~N,~S,~B");
Clazz.overrideMethod (c$, "findLevel", 
function (map, fName, volume) {
this.setGlobals (map);
var nIntervals = 256;
var minMax = map.getMinMax ();
var bins =  Clazz.newLongArray (nIntervals + 1, 0);
var mmin = minMax[0];
var range = minMax[3];
var scale = 0.001 * map.cell[0] * map.cell[1] * map.cell[2] * Math.cos (Math.toRadians (map.cell[5] - 90.0)) / (map.nv[0] * map.nv[1] * map.nv[2]);
var np = map.getDataSize ();
for (var i = 0; i < np; i++) {
var val = map.getValue (i);
var bin = Clazz.doubleToInt (nIntervals * ((val - mmin) / range));
if (bin > nIntervals + 1) {
System.out.println ("bin number outside range: " + bin + " " + nIntervals + 1);
continue;
}for (var b = 0; b <= bin; b++) {
bins[b]++;
}
}
np = 0;
var b = nIntervals;
var sumVol = .0;
for (b = nIntervals; b >= 0; b--) {
np = bins[b];
sumVol = bins[b] * scale;
if (volume < sumVol) break;
}
var level = mmin + range * (b + 0.5) / 256.0;
var str = Double.toString (level);
System.out.println ("FindLevel, level: " + level + " volume: " + volume);
try {
var out =  new java.io.DataOutputStream ( new java.io.BufferedOutputStream ( new java.io.FileOutputStream (fName, true)));
if (out != null) {
out.writeBytes (str);
out.close ();
}} catch (e$$) {
if (Clazz.exceptionOf (e$$, java.io.FileNotFoundException)) {
var e = e$$;
{
}
} else if (Clazz.exceptionOf (e$$, SecurityException)) {
var e = e$$;
{
}
} else if (Clazz.exceptionOf (e$$, java.io.IOException)) {
var e = e$$;
{
}
} else {
throw e$$;
}
}
}, "astex.map.VolumeMapImp,~S,~N");
Clazz.overrideMethod (c$, "writeFillLevel", 
function (map, level, fName) {
if (fName == null) fName = "fillLevel.txt";
var pCount = 0;
var np = map.getDataSize ();
for (var i = 0; i < np; i++) {
if (map.getValue (i) >= level) pCount++;
}
var fillLevel = Math.pow ((pCount / np), 0.3333333333333333);
var f4 =  new astex.util.Format ("%.4f");
var str = f4.format (fillLevel) + "\n";
System.out.println ("inside " + pCount + " points " + np + " fill level " + fillLevel);
try {
var out =  new java.io.DataOutputStream ( new java.io.BufferedOutputStream ( new java.io.FileOutputStream (fName, true)));
if (out != null) {
out.writeBytes (str);
out.close ();
}} catch (e$$) {
if (Clazz.exceptionOf (e$$, java.io.FileNotFoundException)) {
var e = e$$;
{
}
} else if (Clazz.exceptionOf (e$$, SecurityException)) {
var e = e$$;
{
}
} else if (Clazz.exceptionOf (e$$, java.io.IOException)) {
var e = e$$;
{
}
} else {
throw e$$;
}
}
}, "astex.map.VolumeMapImp,~N,~S");
Clazz.defineMethod (c$, "writeVolume", 
function (map, level, fName) {
this.setGlobals (map);
if (fName == null) fName = "volume.txt";
var scale = 0.001 * map.cell[0] * map.cell[1] * map.cell[2] * Math.cos (Math.toRadians (map.cell[5] - 90.0)) / (map.nv[0] * map.nv[1] * map.nv[2]);
var pCount = 0;
var np = map.getDataSize ();
for (var i = 0; i < np; i++) {
if (map.getValue (i) >= level) pCount++;
}
var f2 =  new astex.util.Format ("%.2f");
var str = f2.format (pCount * scale) + " nm3\n";
System.out.println ("write volume, points " + pCount + " scale " + scale + " volume " + str);
try {
var out =  new java.io.DataOutputStream ( new java.io.BufferedOutputStream ( new java.io.FileOutputStream (fName, true)));
if (out != null) {
out.writeBytes (str);
out.close ();
}} catch (e$$) {
if (Clazz.exceptionOf (e$$, java.io.FileNotFoundException)) {
var e = e$$;
{
}
} else if (Clazz.exceptionOf (e$$, SecurityException)) {
var e = e$$;
{
}
} else if (Clazz.exceptionOf (e$$, java.io.IOException)) {
var e = e$$;
{
}
} else {
throw e$$;
}
}
}, "astex.map.VolumeMapImp,~N,~S");
Clazz.defineMethod (c$, "writeVolume", 
function (map, nIntervals, fName, doNeighbour) {
if (fName == null) fName = "volume.txt";
var minMax = map.getMinMax ();
var bins =  Clazz.newLongArray (nIntervals + 1, 0);
var withNeighbour =  Clazz.newLongArray (nIntervals + 1, 0);
var mmin = minMax[0];
var range = minMax[3];
var scale = 0.001 * map.cell[0] * map.cell[1] * map.cell[2] * Math.cos (Math.toRadians (map.cell[5] - 90.0)) / (map.nv[0] * map.nv[1] * map.nv[2]);
if (doNeighbour) {
var x = map.raxis[0];
var y = map.raxis[1];
var z = map.raxis[2];
var mx = map.maximumGrid[x] - map.minimumGrid[x];
var mxy = mx * (map.maximumGrid[y] - map.minimumGrid[y]);
var minx = map.minimumGrid[x];
var miny = map.minimumGrid[y];
var minz = map.minimumGrid[z];
var maxx = map.maximumGrid[x];
var maxy = map.maximumGrid[y];
var maxz = map.maximumGrid[z];
System.out.println ("mx " + mx + " mxy " + mxy + " scale " + scale + " gamma " + map.cell[5]);
for (var i = minx; i < maxx; i++) {
for (var j = miny; j < maxy; j++) {
for (var k = minz; k < maxz; k++) {
var pos = k * mxy + j * mx + i;
var val = map.getValue (pos);
var bin = Clazz.doubleToInt (nIntervals * ((val - mmin) / range));
if (bin > nIntervals + 1) {
System.out.println ("bin number outside range: " + bin + " " + nIntervals + 1);
continue;
}for (var b = 0; b <= bin; b++) {
bins[b]++;
var binLevel = (mmin + bin * range / nIntervals);
var hasNeighbour = false;
gotNeighbour : {
for (var ii = i - 1; ii <= i + 1; ii++) {
if ((ii < minx) || (ii >= maxx)) continue;
for (var jj = j - 1; jj <= j + 1; jj++) {
if ((jj < miny) || (jj >= maxy)) continue;
for (var kk = k - 1; kk <= k + 1; kk++) {
if ((kk < minz) || (kk >= maxz)) continue;
if (ii == i && jj == j && kk == k) continue;
pos = kk * mxy + jj * mx + ii;
val = map.getValue (pos);
if (val >= binLevel) {
hasNeighbour = true;
break gotNeighbour;
}}
}
}
}if (hasNeighbour) withNeighbour[b]++;
}
}
}
}
} else {
var np = map.getDataSize ();
System.out.println ("np " + np + " scale " + scale + " gamma " + map.cell[5]);
for (var i = 0; i < np; i++) {
var val = map.getValue (i);
var bin = Clazz.doubleToInt (nIntervals * ((val - mmin) / range));
if (bin > nIntervals + 1) {
System.out.println ("bin number outside range: " + bin + " " + nIntervals + 1);
continue;
}for (var b = 0; b <= bin; b++) {
bins[b]++;
}
}
}var f2 =  new astex.util.Format ("%.2f");
var str =  String.instantialize ();
var frac = range / nIntervals;
for (var i = 0; i < nIntervals; i++) {
if (doNeighbour) {
str += astex.io.VolumeMapIO.genBinLabel ((mmin + i * frac), range) + ", " + bins[i] + ", " + f2.format (bins[i] * scale) + ", " + withNeighbour[i] + ", " + f2.format (withNeighbour[i] * scale) + "\n";
} else {
str += astex.io.VolumeMapIO.genBinLabel ((mmin + i * frac), range) + ", " + bins[i] + ", " + f2.format (bins[i] * scale) + "\n";
}}
try {
var out =  new java.io.DataOutputStream ( new java.io.BufferedOutputStream ( new java.io.FileOutputStream (fName, true)));
if (out != null) {
out.writeBytes (str);
out.close ();
}} catch (e$$) {
if (Clazz.exceptionOf (e$$, java.io.FileNotFoundException)) {
var e = e$$;
{
}
} else if (Clazz.exceptionOf (e$$, SecurityException)) {
var e = e$$;
{
}
} else if (Clazz.exceptionOf (e$$, java.io.IOException)) {
var e = e$$;
{
}
} else {
throw e$$;
}
}
}, "astex.map.VolumeMapImp,~N,~S,~B");
Clazz.overrideMethod (c$, "writeFit", 
function (map, str, fName) {
if (fName == null) fName = "fitLog.txt";
try {
var out =  new java.io.DataOutputStream ( new java.io.BufferedOutputStream ( new java.io.FileOutputStream (fName, true)));
if (out != null) {
out.writeBytes (str);
out.close ();
}} catch (e$$) {
if (Clazz.exceptionOf (e$$, java.io.FileNotFoundException)) {
var e = e$$;
{
}
} else if (Clazz.exceptionOf (e$$, SecurityException)) {
var e = e$$;
{
}
} else if (Clazz.exceptionOf (e$$, java.io.IOException)) {
var e = e$$;
{
}
} else {
throw e$$;
}
}
}, "astex.map.VolumeMapImp,~S,~S");
Clazz.defineMethod (c$, "createMaskLevel", 
function (color, label, threshold) {
var np = this.map.getDataSize ();
var mask = astex.render.MoleculeRenderer.newMapMask (np);
mask.setColor (color);
mask.setLabel (label);
if (this.isBits) {
mask.setMask (this.map.getDataMask ());
mask.setLabelPosition (0, 0, 0);
} else {
var needSwap = false;
var mx = 0;
var mxy = 0;
var mapType = this.map.getMapType ();
if (mapType == 1 || mapType == 5 || mapType == 6) {
mx = this.map.grid[this.map.axis[0]];
mxy = mx * this.map.grid[this.map.axis[1]];
for (var i = 0; i < 3; i++) if (this.map.axis[i] != i) needSwap = true;

} else {
mx = this.map.ngrid[0];
mxy = mx * this.map.ngrid[1];
}if (needSwap) System.out.println ("Need to swap axes when writing bit version of map");
var pSum =  new astex.util.Point3d ();
var g =  Clazz.newIntArray (3, 0);
var h =  Clazz.newIntArray (3, 0);
for (var i = 0; i < np; i++) {
if ((this.isBytes && this.map.byteArray[i] >= threshold) || (this.isFloats && this.map.data[i] >= threshold)) {
g[2] = Clazz.doubleToInt (i / mxy);
g[1] = Clazz.doubleToInt ((i - g[2] * mxy) / mx);
g[0] = i - g[2] * mxy - g[1] * mx;
var p =  new astex.util.Point3d ();
this.map.absoluteGridToCartesian (g, p);
pSum.add (p);
var j = i;
if (needSwap) {
for (var ii = 0; ii < 3; ii++) {
h[ii] = g[this.map.axis[ii]];
}
j = h[2] * mxy + h[1] * mx + h[0];
}mask.setBit (j);
}}
this.map.nearestRelativeGrid (pSum, g);
mask.setLabelPosition (g);
}mask.setGrid (this.map.grid);
var itmp =  Clazz.newIntArray (3, 0);
for (var i = 0; i < 3; i++) itmp[i] = this.map.minimumGrid[i] + this.map.nu[i];

mask.setOrigin (itmp);
var tmpCell =  Clazz.newDoubleArray (6, 0);
for (var i = 0; i < 3; i++) tmpCell[i] = this.map.cell[i] * this.map.grid[i] / this.map.nv[i];

for (var i = 3; i < 6; i++) tmpCell[i] = this.map.cell[i];

mask.setCell (tmpCell);
this.map.addMask (mask);
System.out.println ("Added mask with threshold: " + threshold + " containing " + mask.getMask ().cardinality () + " points");
}, "~N,~S,~N");
Clazz.defineMethod (c$, "closeFile", 
 function () {
if (this.file != null) {
this.file.close ();
this.file = null;
}});
Clazz.overrideMethod (c$, "reset", 
function (map) {
this.closeFile ();
this.openFile (map);
this.file = astex.io.FILE.openStatic (map.filename, true);
if (map.mapType == 1) {
this.file.skip (1024 + map.ihdr3[1]);
}}, "astex.map.VolumeMapImp");
Clazz.defineStatics (c$,
"BRIX_BLOCK_SIZE", 512,
"fitLogName", "fitLog.txt",
"volumeName", "volume.txt",
"graphName", "graph.txt",
"fillName", "fillLevel.txt");
c$.gf2 = c$.prototype.gf2 =  new astex.util.Format ("%7.2f");
c$.gf3 = c$.prototype.gf3 =  new astex.util.Format ("%7.3f");
c$.gf4 = c$.prototype.gf4 =  new astex.util.Format ("%7.4f");
c$.gf5 = c$.prototype.gf5 =  new astex.util.Format ("%8.5f");
c$.gf6 = c$.prototype.gf6 =  new astex.util.Format ("%9.6f");
c$.gf7 = c$.prototype.gf7 =  new astex.util.Format ("%10.7f");
c$.gf9 = c$.prototype.gf9 =  new astex.util.Format ("%12.9f");
Clazz.defineStatics (c$,
"CCP4_HEADER_SIZE", 1024);
});
