Clazz.declarePackage ("astex.map");
Clazz.load (["astex.map.VolumeMap", "astex.model.Symmetry", "astex.util.Color32", "$.DynamicArray", "$.Format", "$.Matrix", "$.Point3d"], "astex.map.VolumeMapImp", ["astex.api.Interface", "astex.io.FILE", "astex.render.MoleculeRenderer", "astex.util.Mmatch", "java.lang.Float", "$.OutOfMemoryError", "$.Throwable", "java.util.Arrays", "JU.BS"], function () {
c$ = Clazz.decorateAsClass (function () {
this.debug = false;
this.volumeRender = false;
this.volumeColor = 0;
this.volumeMin = 0.0;
this.volumeMax = 1.0;
this.contourLevels = null;
this.contourColors = null;
this.contourStyle = null;
this.contourDisplayed = null;
this.mapMode = 0;
this.bigEndian = true;
this.grid = null;
this.nPoints = 0;
this.contourSize = 24;
this.mode = 0;
this.radius = 0;
this.filename = null;
this.name = null;
this.needsReadingFlag = 2;
this.headerInitialised = false;
this.firstTime = true;
this.rawLevel = .0;
this.$scale = 1.0;
this.mapType = 1;
this.centerGrid = null;
this.minimumGrid = null;
this.maximumGrid = null;
this.transform = null;
this.backTransform = null;
this.$addTransform = null;
this.rotation = null;
this.invert = false;
this.$cutSelection = false;
this.cutRadius = 5.0;
this.showMaskLabels = true;
this.nu = null;
this.nv = null;
this.axis = null;
this.raxis = null;
this.ihdr3 = null;
this.ihdr4 = null;
this.ihdr4b = null;
this.ihdr5 = null;
this.ihdr6 = null;
this.cell = null;
this.stat = null;
this.rhdr3 = null;
this.offset = null;
this.symRecords = null;
this.rms = 0;
this.data = null;
this.bigData = null;
this.useBig = false;
this.dataMask = null;
this.byteArray = null;
this.bigByteArray = null;
this.dataMode = 2;
this.genSurface = true;
this.origin = null;
this.spacing = null;
this.ngrid = null;
this.showGrid = false;
this.initialiseContours = true;
this.masks = null;
this.prod = 0;
this.plus = 0;
this.reader = null;
this.writer = null;
this.dummy = null;
this.xxx = null;
this.swapped = null;
this.odata = null;
this.lastAtom = null;
this.clips = 0;
this.lastAtomClips = 0;
this.lastAtomBondedClips = 0;
this.distFormat = null;
this.rotFormat = null;
Clazz.instantialize (this, arguments);
}, astex.map, "VolumeMapImp", astex.model.Symmetry, astex.map.VolumeMap);
Clazz.prepareFields (c$, function () {
this.volumeColor = astex.util.Color32.red;
this.contourLevels =  Clazz.newDoubleArray (astex.map.VolumeMap.MaximumContourLevels, 0);
this.contourColors =  Clazz.newIntArray (astex.map.VolumeMap.MaximumContourLevels, 0);
this.contourStyle =  Clazz.newIntArray (astex.map.VolumeMap.MaximumContourLevels, 0);
this.contourDisplayed =  Clazz.newBooleanArray (astex.map.VolumeMap.MaximumContourLevels, false);
this.grid =  Clazz.newIntArray (3, 0);
this.centerGrid =  Clazz.newIntArray (3, 0);
this.minimumGrid =  Clazz.newIntArray (3, 0);
this.maximumGrid =  Clazz.newIntArray (3, 0);
this.transform =  new astex.util.Matrix ();
this.backTransform =  new astex.util.Matrix ();
this.$addTransform =  new astex.util.Matrix ();
this.rotation =  Clazz.newDoubleArray (3, 0);
this.nu =  Clazz.newIntArray (3, 0);
this.nv =  Clazz.newIntArray (3, 0);
this.axis =  Clazz.newIntArray (3, 0);
this.raxis =  Clazz.newIntArray (3, 0);
this.ihdr3 =  Clazz.newIntArray (3, 0);
this.ihdr4 =  Clazz.newIntArray (12, 0);
this.ihdr4b =  Clazz.newIntArray (2, 0);
this.ihdr5 =  Clazz.newIntArray (1, 0);
this.ihdr6 =  Clazz.newCharArray (800, '\0');
this.cell =  Clazz.newDoubleArray (6, 0);
this.stat =  Clazz.newDoubleArray (5, 0);
this.rhdr3 =  Clazz.newDoubleArray (12, 0);
this.offset =  Clazz.newDoubleArray (3, 0);
this.origin =  new astex.util.Point3d ();
this.spacing =  new astex.util.Point3d ();
this.ngrid =  Clazz.newIntArray (3, 0);
this.masks =  new astex.util.DynamicArray ();
this.dummy =  new astex.util.Point3d ();
this.xxx =  Clazz.newDoubleArray (3, 0);
this.swapped =  Clazz.newDoubleArray (3, 0);
this.distFormat =  new astex.util.Format ("%.2f");
this.rotFormat =  new astex.util.Format ("%.1f");
});
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, astex.map.VolumeMapImp, []);
astex.render.MoleculeRenderer.fillColorArray ();
});
c$.createSimpleMap = Clazz.defineMethod (c$, "createSimpleMap", 
function () {
var map =  new astex.map.VolumeMapImp ();
for (var i = 0; i < 3; i++) {
map.axis[i] = i;
map.raxis[i] = i;
map.nv[i] = 1;
}
map.headerInitialised = true;
map.setMapType (3);
map.setSigma (1.0);
map.initialiseContours = false;
return map;
});
Clazz.overrideMethod (c$, "getSigma", 
function () {
return this.rms;
});
Clazz.overrideMethod (c$, "setSigma", 
function (s) {
this.rms = s;
}, "~N");
Clazz.defineMethod (c$, "needsReading", 
function () {
return this.needsReadingFlag;
});
Clazz.overrideMethod (c$, "setNeedsReading", 
function (flag) {
if (this.needsReadingFlag != 0) this.needsReadingFlag = flag;
if (this.debug) {
System.out.println ("Setting needs reading flag to: " + flag);
astex.map.VolumeMapImp.printStack ();
}}, "~N");
c$.printStack = Clazz.defineMethod (c$, "printStack", 
function () {
var t =  new Throwable ();
var frames = t.getStackTrace ();
for (var i = 0; i < frames.length; i++) {
System.out.println (frames[i]);
}
});
Clazz.overrideMethod (c$, "getMapType", 
function () {
return this.mapType;
});
Clazz.defineMethod (c$, "setMapType", 
function (v) {
this.mapType = v;
}, "~N");
Clazz.defineMethod (c$, "getMapMode", 
function () {
return this.mapMode;
});
Clazz.overrideMethod (c$, "setMapMode", 
function (v) {
this.mapMode = v;
}, "~N");
Clazz.defineMethod (c$, "setMinMax", 
function () {
for (var i = 0; i < 3; i++) {
this.minimumGrid[i] = this.centerGrid[i] - this.contourSize;
this.maximumGrid[i] = this.centerGrid[i] + this.contourSize;
if (this.minimumGrid[i] < 0) this.minimumGrid[i] = 0;
if (this.maximumGrid[i] < 0) this.maximumGrid[i] = 0;
if (this.minimumGrid[i] >= this.grid[i]) this.minimumGrid[i] = this.grid[i];
if (this.maximumGrid[i] >= this.grid[i]) this.maximumGrid[i] = this.grid[i];
}
});
Clazz.defineMethod (c$, "setMinMaxAll", 
function () {
for (var i = 0; i < 3; i++) {
this.minimumGrid[i] = 0;
this.maximumGrid[i] = this.grid[i];
}
if (this.debug) {
System.out.println ("minmaxA, center: " + this.centerGrid[0] + " " + this.centerGrid[1] + " " + this.centerGrid[2]);
System.out.println ("minmaxA, min: " + this.minimumGrid[0] + " " + this.minimumGrid[1] + " " + this.minimumGrid[2]);
System.out.println ("minmaxA, max: " + this.maximumGrid[0] + " " + this.maximumGrid[1] + " " + this.maximumGrid[2]);
}});
Clazz.overrideMethod (c$, "setGenSurface", 
function (b) {
this.genSurface = b;
}, "~B");
Clazz.defineMethod (c$, "getGenSurface", 
function () {
return this.genSurface;
});
Clazz.defineMethod (c$, "read", 
function () {
return this.getReader ().read (this);
});
Clazz.overrideMethod (c$, "readRegionIOData", 
function () {
return this.getReader ().readRegionData (this);
});
Clazz.overrideMethod (c$, "readSegger", 
function (segFileName, level) {
this.getReader ().readSegger (this, segFileName, level);
var nMasks = this.getNMasks ();
return (nMasks > 0 ? this.getMaskByIndex (nMasks - 1) : null);
}, "~S,~N");
Clazz.defineMethod (c$, "getReader", 
 function () {
return (this.reader == null ? (this.reader = astex.api.Interface.getInterface ("astex.io.VolumeMapIO")) : this.reader);
});
Clazz.defineMethod (c$, "getWriter", 
 function () {
return (this.writer == null ? (this.writer = astex.api.Interface.getInterface ("astex.io.VolumeMapIO")) : this.writer);
});
Clazz.overrideMethod (c$, "writeTo", 
function (directory, mName) {
var fileName = directory + System.getProperty ("file.separator") + mName;
switch (this.getDataMode ()) {
case 0:
fileName += ".bit";
break;
case 1:
fileName += ".brix";
break;
case 2:
default:
fileName += ".map";
break;
}
this.write (fileName, 2, false);
}, "~S,~S");
Clazz.defineMethod (c$, "write", 
function (outFile, dataType, doAdd, add, doMult, mult) {
var recalc = false;
if ((doAdd || doMult) && dataType == 2) {
if (this.useBig) {
for (var i = 0; i < this.nPoints; i++) {
this.bigData.mult (i, mult);
this.bigData.add (i, add);
}
} else {
for (var i = 0; i < this.nPoints; i++) {
this.data[i] *= mult;
this.data[i] += add;
}
}recalc = true;
}this.write (outFile, dataType, recalc);
}, "~S,~N,~B,~N,~B,~N");
Clazz.defineMethod (c$, "write", 
function (outFile, dataType, recalc) {
this.getWriter ().write (this, outFile, dataType, recalc);
}, "~S,~N,~B");
Clazz.overrideMethod (c$, "writeHeader", 
function () {
this.getWriter ().writeHeader (this);
});
Clazz.overrideMethod (c$, "writeFillLevel", 
function (level, fName) {
this.getWriter ().writeFillLevel (this, level, fName);
}, "~N,~S");
Clazz.overrideMethod (c$, "setFile", 
function (file) {
if (file.length == 0) file = astex.render.MoleculeRenderer.lastMapFileName;
astex.render.MoleculeRenderer.lastMapFileName = this.filename = file;
System.out.println ("file |" + file + "|");
if (file.indexOf (".grd") != -1) {
this.mapType = 3;
} else if (file.indexOf (".acnt") != -1) {
this.mapType = 2;
} else if (file.indexOf (".map") != -1) {
this.mapType = 1;
} else if (file.indexOf (".ccp4") != -1) {
this.mapType = 1;
} else if (file.indexOf (".mrc") != -1) {
this.mapType = 1;
} else if (file.indexOf (".bmap") != -1) {
this.mapType = 1;
} else if (file.indexOf (".omap") != -1) {
this.mapType = 5;
} else if (file.indexOf (".brix") != -1) {
this.mapType = 6;
} else if (file.indexOf (".sag") != -1) {
this.mapType = 4;
} else if (file.indexOf (".bit") != -1) {
this.mapType = 7;
this.dataMode = 0;
} else if (file.indexOf (".bbb") != -1) {
this.mapType = 7;
this.dataMode = 0;
}System.out.println ("mapType " + this.mapType);
}, "~S");
Clazz.overrideMethod (c$, "getFile", 
function () {
return this.filename;
});
Clazz.overrideMethod (c$, "calcExtent", 
function (level, axisToUse, xlate, depth) {
var extent = 0;
var a = axisToUse.toUpperCase ().charAt (0);
var x = this.raxis[0];
var y = this.raxis[1];
var z = this.raxis[2];
var minX = this.maximumGrid[x];
var minY = this.maximumGrid[y];
var minZ = this.maximumGrid[z];
var maxX = this.minimumGrid[x];
var maxY = this.minimumGrid[y];
var maxZ = this.minimumGrid[z];
var mx = this.maximumGrid[x] - this.minimumGrid[x];
var mxy = mx * (this.maximumGrid[y] - this.minimumGrid[y]);
for (var i = this.minimumGrid[x]; i < this.maximumGrid[x]; i++) {
for (var j = this.minimumGrid[y]; j < this.maximumGrid[y]; j++) {
for (var k = this.minimumGrid[z]; k < this.maximumGrid[z]; k++) {
var pos = k * mxy + j * mx + i;
var val = this.getValue (pos);
if (val > level) {
if (i < minX) minX = i;
if (i > maxX) maxX = i;
if (j < minY) minY = j;
if (j > maxY) maxY = j;
if (k < minZ) minZ = k;
if (k > maxZ) maxZ = k;
}}
}
}
var tmp = .0;
switch (a) {
case 'X':
xlate.x = (this.nu[x] + 0.5 * (maxX + minX)) * this.cell[x] / this.nv[x];
depth[0] = (this.nu[x] + minX) * this.cell[x] / this.nv[x] - xlate.x;
depth[1] = (this.nu[x] + maxX) * this.cell[x] / this.nv[x] - xlate.x;
xlate.y = (this.nu[y] + 0.5 * (maxY + minY)) * this.cell[y] / this.nv[y];
extent = (maxY - minY) * this.cell[y] / this.nv[y];
xlate.z = (this.nu[z] + 0.5 * (maxZ + minZ)) * this.cell[z] / this.nv[z];
tmp = (maxZ - minZ) * this.cell[z] / this.nv[z];
if (tmp > extent) extent = tmp;
break;
case 'Y':
xlate.y = (this.nu[y] + 0.5 * (maxY + minY)) * this.cell[y] / this.nv[y];
depth[0] = (this.nu[y] + minY) * this.cell[y] / this.nv[y] - xlate.y;
depth[1] = (this.nu[y] + maxY) * this.cell[y] / this.nv[y] - xlate.y;
xlate.x = (this.nu[x] + 0.5 * (maxX + minX)) * this.cell[x] / this.nv[x];
extent = (maxX - minX) * this.cell[x] / this.nv[x];
xlate.z = (this.nu[z] + 0.5 * (maxZ + minZ)) * this.cell[z] / this.nv[z];
tmp = (maxZ - minZ) * this.cell[z] / this.nv[z];
if (tmp > extent) extent = tmp;
break;
case 'Z':
default:
xlate.z = (this.nu[z] + 0.5 * (maxZ + minZ)) * this.cell[z] / this.nv[z];
depth[0] = (this.nu[z] + minZ) * this.cell[z] / this.nv[z] - xlate.z;
depth[1] = (this.nu[z] + maxZ) * this.cell[z] / this.nv[z] - xlate.z;
xlate.x = (this.nu[x] + 0.5 * (maxX + minX)) * this.cell[x] / this.nv[x];
extent = (maxX - minX) * this.cell[x] / this.nv[x];
xlate.y = (this.nu[y] + 0.5 * (maxY + minY)) * this.cell[y] / this.nv[y];
tmp = (maxY - minY) * this.cell[y] / this.nv[y];
if (tmp > extent) extent = tmp;
break;
}
depth[0] -= 20.0;
depth[1] += 20.0;
return extent;
}, "~N,~S,astex.util.Point3d,~A");
Clazz.defineMethod (c$, "downSample", 
function (newSizes, doCenter, downVoxel) {
if (this.dataMode != 2) {
System.out.println ("Down sampling only supported for floating point data mode.");
return;
}if (newSizes[0] == 0) {
for (var i = 0; i < 3; i++) {
var ns = Clazz.doubleToInt (this.cell[i] / downVoxel);
if (ns < 160) ns = 160;
if (ns > this.grid[i]) ns = this.grid[i];
newSizes[i] = ns;
}
}var newx = newSizes[0];
var newy = newSizes[1];
var newz = newSizes[2];
var newxy = newx * newy;
var newPoints = newxy * newz;
var mx = this.maximumGrid[0] - this.minimumGrid[0];
var mxy = mx * (this.maximumGrid[1] - this.minimumGrid[1]);
var tmpVol =  Clazz.newFloatArray (newPoints, 0);
if (this.debug) {
System.out.println ("newSizes: " + newx + " " + newy + " " + newz);
System.out.println ("grid: " + this.grid[0] + " " + this.grid[1] + " " + this.grid[2]);
}for (var i = 0; i < newx; i++) {
var ii = Clazz.doubleToInt ((i * this.grid[0]) / newx);
var irem = (i * this.grid[0]) % newx;
var iFrac = .0;
var doIfrac = false;
if (irem != 0) {
doIfrac = true;
iFrac = (irem) / newx;
}for (var j = 0; j < newy; j++) {
var jj = Clazz.doubleToInt ((j * this.grid[1]) / newy);
var jrem = (j * this.grid[1]) % newy;
var jFrac = .0;
var doJfrac = false;
if (jrem != 0) {
doJfrac = true;
jFrac = (jrem) / newy;
}for (var k = 0; k < newz; k++) {
var kk = Clazz.doubleToInt ((k * this.grid[2]) / newz);
var krem = (k * this.grid[2]) % newz;
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
if (this.debug) System.out.println ("i " + i + " nu " + this.nu[i] + " grid " + this.grid[i] + " new size " + newSizes[i] + " unit cell " + this.nv[i]);
this.maximumGrid[i] = this.minimumGrid[i] + newSizes[i];
this.centerGrid[i] = Clazz.doubleToInt (newSizes[i] / 2);
if (doCenter) {
this.nu[i] = Clazz.doubleToInt (-newSizes[i] / 2);
} else {
this.nu[i] = Math.round (this.nu[i] * newSizes[i] / this.grid[i]);
this.nu[i] += this.centerGrid[i] - Clazz.doubleToInt (newSizes[i] / 2);
}this.nv[this.axis[i]] = Math.round (this.nv[this.axis[i]] * newSizes[i] / this.grid[i]);
this.grid[i] = newSizes[i];
}
this.setArraySize (newPoints);
this.data = tmpVol;
this.recalcStats (this.stat);
}, "~A,~B,~N");
Clazz.defineMethod (c$, "value", 
function (i, j, k, doIfrac, doJfrac, doKfrac, iFrac, jFrac, kFrac, mx, mxy) {
var pos = k * mxy + j * mx + i;
var val = this.getValue (pos);
var newVal = (1.0 - iFrac) * (1.0 - jFrac) * (1.0 - kFrac) * val;
if (doIfrac) {
pos++;
val = this.getValue (pos);
newVal += iFrac * (1.0 - jFrac) * (1.0 - kFrac) * val;
}if (doJfrac) {
pos = k * mxy + (j + 1) * mx + i;
val = this.getValue (pos);
newVal += (1.0 - iFrac) * jFrac * (1.0 - kFrac) * val;
if (doIfrac) {
pos++;
val = this.getValue (pos);
newVal += iFrac * jFrac * (1.0 - kFrac) * val;
}}if (doKfrac) {
pos = (k + 1) * mxy + j * mx + i;
val = this.getValue (pos);
newVal += (1.0 - iFrac) * (1.0 - jFrac) * kFrac * val;
if (doIfrac) {
pos++;
val = this.getValue (pos);
newVal += iFrac * (1.0 - jFrac) * kFrac * val;
}if (doJfrac) {
pos = (k + 1) * mxy + (j + 1) * mx + i;
val = this.getValue (pos);
newVal += (1.0 - iFrac) * jFrac * kFrac * val;
if (doIfrac) {
pos++;
val = this.getValue (pos);
newVal += iFrac * jFrac * kFrac * val;
}}}return newVal;
}, "~N,~N,~N,~B,~B,~B,~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "reScale", 
function () {
var scale = (256.0 / this.getMinMax ()[3]);
if (this.useBig) {
var np = this.bigData.size ();
for (var i = 0; i < np; i++) {
this.bigData.set (i, this.bigData.get (i) * scale);
}
} else {
var np = this.getDataArraySize ();
for (var i = 0; i < np; i++) {
this.data[i] *= scale;
}
}this.recalcStats (this.stat);
});
Clazz.defineMethod (c$, "getValue", 
function (i) {
var value = .0;
switch (this.dataMode) {
case 0:
value = this.dataMask.get (i) ? 1.0 : 0.0;
break;
case 1:
if (this.useBig) {
value = this.stat[0] + this.stat[3] * (this.bigByteArray.get (i) + 128) / 256;
} else {
value = this.stat[0] + this.stat[3] * (this.byteArray[i] + 128) / 256;
}break;
case 2:
if (this.useBig) {
value = this.bigData.get (i);
} else {
value = this.data[i];
}break;
}
return value;
}, "~N");
c$.genBinLabel = Clazz.defineMethod (c$, "genBinLabel", 
function (value, range) {
var str;
if (range < .00001) {
str = astex.map.VolumeMapImp.gf9.format (value);
} else if (range < .0001) {
str = astex.map.VolumeMapImp.gf7.format (value);
} else if (range < .001) {
str = astex.map.VolumeMapImp.gf7.format (value);
} else if (range < .01) {
str = astex.map.VolumeMapImp.gf6.format (value);
} else if (range < .1) {
str = astex.map.VolumeMapImp.gf5.format (value);
} else if (range < 1.0) {
str = astex.map.VolumeMapImp.gf4.format (value);
} else if (range < 10.0) {
str = astex.map.VolumeMapImp.gf3.format (value);
} else {
str = astex.map.VolumeMapImp.gf2.format (value);
}return str;
}, "~N,~N");
Clazz.overrideMethod (c$, "writeGraph", 
function (nIntervals, fName, findMax) {
var writer = astex.api.Interface.getInterface ("astex.io.VolumeMapIO");
writer.writeGraph (this, nIntervals, fName, findMax);
}, "~N,~S,~B");
Clazz.overrideMethod (c$, "findLevel", 
function (fName, volume) {
var writer = astex.api.Interface.getInterface ("astex.io.VolumeMapIO");
writer.findLevel (this, fName, volume);
}, "~S,~N");
Clazz.defineMethod (c$, "writeVolume", 
function (nIntervals, fName, doNeighbour) {
var writer = astex.api.Interface.getInterface ("astex.io.VolumeMapIO");
writer.writeVolume (this, nIntervals, fName, doNeighbour);
}, "~N,~S,~B");
Clazz.defineMethod (c$, "writeVolume", 
function (level, fName) {
var writer = astex.api.Interface.getInterface ("astex.io.VolumeMapIO");
writer.writeVolume (this, level, fName);
}, "~N,~S");
Clazz.defineMethod (c$, "writeFit", 
function (str) {
this.writeFit (str, null);
}, "~S");
Clazz.defineMethod (c$, "writeFit", 
function (str, fName) {
var writer = astex.api.Interface.getInterface ("astex.io.VolumeMapIO");
writer.writeFit (this, str, fName);
}, "~S,~S");
Clazz.overrideMethod (c$, "createMaskLevel", 
function (color, label, threshold) {
var np = this.getDataSize ();
var mask = astex.render.MoleculeRenderer.newMapMask (np);
mask.setColor (color);
mask.setLabel (label);
if (this.dataMode == 0) {
mask.setMask (this.getDataMask ());
mask.setLabelPosition (0, 0, 0);
} else {
var needSwap = false;
var mx = 0;
var mxy = 0;
var mapType = this.getMapType ();
if (mapType == 1 || mapType == 5 || mapType == 6) {
mx = this.grid[this.axis[0]];
mxy = mx * this.grid[this.axis[1]];
for (var i = 0; i < 3; i++) if (this.axis[i] != i) needSwap = true;

} else {
mx = this.ngrid[0];
mxy = mx * this.ngrid[1];
}if (needSwap) System.out.println ("Need to swap axes when writing bit version of map");
var pSum =  new astex.util.Point3d ();
var g =  Clazz.newIntArray (3, 0);
var h =  Clazz.newIntArray (3, 0);
for (var i = 0; i < np; i++) {
if ((this.dataMode == 1 && this.byteArray[i] >= threshold) || (this.dataMode == 2 && this.data[i] >= threshold)) {
g[2] = Clazz.doubleToInt (i / mxy);
g[1] = Clazz.doubleToInt ((i - g[2] * mxy) / mx);
g[0] = i - g[2] * mxy - g[1] * mx;
var p =  new astex.util.Point3d ();
this.absoluteGridToCartesian (g, p);
pSum.add (p);
var j = i;
if (needSwap) {
for (var ii = 0; ii < 3; ii++) {
h[ii] = g[this.axis[ii]];
}
j = h[2] * mxy + h[1] * mx + h[0];
}mask.setBit (j);
}}
this.nearestRelativeGrid (pSum, g);
mask.setLabelPosition (g);
}mask.setGrid (this.grid);
var itmp =  Clazz.newIntArray (3, 0);
for (var i = 0; i < 3; i++) itmp[i] = this.minimumGrid[i] + this.nu[i];

mask.setOrigin (itmp);
var tmpCell =  Clazz.newDoubleArray (6, 0);
for (var i = 0; i < 3; i++) tmpCell[i] = this.cell[i] * this.grid[i] / this.nv[i];

for (var i = 3; i < 6; i++) tmpCell[i] = this.cell[i];

mask.setCell (tmpCell);
this.addMask (mask);
System.out.println ("Added mask with threshold: " + threshold + " containing " + mask.getMask ().cardinality () + " points");
}, "~N,~S,~N");
Clazz.defineMethod (c$, "setOffset", 
function (p) {
this.transform.setTranslation (p.x, p.y, p.z);
this.setBackTransform ();
}, "astex.util.Point3d");
Clazz.defineMethod (c$, "setOffset", 
function (x, y, z) {
this.transform.setTranslation (x, y, z);
this.setBackTransform ();
}, "~N,~N,~N");
Clazz.overrideMethod (c$, "getOffset", 
function () {
var p =  new astex.util.Point3d ();
p.x = this.transform.x30;
p.y = this.transform.x31;
p.z = this.transform.x32;
return p;
});
Clazz.overrideMethod (c$, "setAddTransform", 
function (m) {
this.$addTransform = m;
}, "astex.util.Matrix");
Clazz.defineMethod (c$, "getAddTransform", 
function () {
return this.$addTransform;
});
Clazz.defineMethod (c$, "setTransform", 
function (m) {
this.transform.set (m);
this.setBackTransform ();
}, "astex.util.Matrix");
Clazz.overrideMethod (c$, "getTransform", 
function () {
return this.transform;
});
Clazz.defineMethod (c$, "setBackTransform", 
 function () {
astex.util.Matrix.invert (this.transform, this.backTransform);
});
Clazz.defineMethod (c$, "getBackTransform", 
function () {
return this.backTransform;
});
Clazz.defineMethod (c$, "setRadius", 
function (r) {
this.radius = r;
}, "~N");
Clazz.defineMethod (c$, "setRadius", 
function () {
var r = .0;
for (var i = 0; i < 3; i++) {
if (this.cell[i] > r) r = this.cell[i];
}
r *= 0.55;
if (r < 1.0E-8) r = 500.0;
this.radius = r;
});
Clazz.overrideMethod (c$, "getRadius", 
function () {
return this.radius;
});
Clazz.overrideMethod (c$, "getLargestGridExtent", 
function () {
var extent = 0;
for (var i = 0; i < 3; i++) {
if (this.grid[i] > extent) extent = this.grid[i];
}
return extent;
});
Clazz.overrideMethod (c$, "getDataMode", 
function () {
return this.dataMode;
});
Clazz.overrideMethod (c$, "setDataMode", 
function (dm) {
this.dataMode = dm;
}, "~N");
Clazz.overrideMethod (c$, "setName", 
function (mapName) {
if (mapName.length == 0) mapName = astex.render.MoleculeRenderer.lastMapName;
astex.render.MoleculeRenderer.lastMapName = this.name = mapName.$replace ('\\', '/');
}, "~S");
Clazz.defineMethod (c$, "getName", 
function () {
return this.name;
});
Clazz.defineMethod (c$, "setCenterGrid", 
function (i, val) {
if (this.centerGrid[i] != val) {
this.centerGrid[i] = val;
this.setNeedsReading (2);
}}, "~N,~N");
Clazz.defineMethod (c$, "setCenterGrid", 
function (x, y, z) {
this.centerGrid[0] = x;
this.centerGrid[1] = y;
this.centerGrid[2] = z;
}, "~N,~N,~N");
Clazz.overrideMethod (c$, "getCenterGrid", 
function (i) {
return this.centerGrid[i];
}, "~N");
Clazz.defineMethod (c$, "relativeGridToCartesian", 
function (g, p) {
this.relativeGridToCartesian (g[0], g[1], g[2], p);
}, "~A,astex.util.Point3d");
Clazz.defineMethod (c$, "relativeGridToCartesian", 
function (ix, iy, iz, p) {
this.absoluteGridToCartesian (ix + this.nu[0] + this.minimumGrid[0], iy + this.nu[1] + this.minimumGrid[1], iz + this.nu[2] + this.minimumGrid[2], p);
}, "~N,~N,~N,astex.util.Point3d");
Clazz.overrideMethod (c$, "getValueAtRelativeGrid", 
function (gx, gy, gz) {
var xsize = this.maximumGrid[0] - this.minimumGrid[0];
var ysize = this.maximumGrid[1] - this.minimumGrid[1];
var zsize = this.maximumGrid[2] - this.minimumGrid[2];
if (this.mapType == 3) {
xsize = this.ngrid[0];
ysize = this.ngrid[1];
zsize = this.ngrid[2];
}if (gx >= 0 && gx < xsize && gy >= 0 && gy < ysize && gz >= 0 && gz < zsize) {
var pos = gx;
pos += gy * xsize;
pos += gz * xsize * ysize;
return this.data[pos];
}return 0.0;
}, "~N,~N,~N");
Clazz.overrideMethod (c$, "getRelativeGridIndex", 
function (gx, gy, gz) {
var xsize = this.maximumGrid[0] - this.minimumGrid[0];
var ysize = this.maximumGrid[1] - this.minimumGrid[1];
var zsize = this.maximumGrid[2] - this.minimumGrid[2];
if (this.mapType == 3) {
xsize = this.ngrid[0];
ysize = this.ngrid[1];
zsize = this.ngrid[2];
}if (gx >= 0 && gx < xsize && gy >= 0 && gy < ysize && gz >= 0 && gz < zsize) {
var pos = gx;
pos += gy * xsize;
pos += gz * xsize * ysize;
return pos;
}return -1;
}, "~N,~N,~N");
Clazz.overrideMethod (c$, "getMapBoxDimensions", 
function () {
var dims =  Clazz.newIntArray (3, 0);
if (this.mapType == 3) {
for (var i = 0; i < 3; i++) {
dims[i] = this.ngrid[i];
}
} else {
dims[0] = this.maximumGrid[0] - this.minimumGrid[0];
dims[1] = this.maximumGrid[1] - this.minimumGrid[1];
dims[2] = this.maximumGrid[2] - this.minimumGrid[2];
}return dims;
});
Clazz.defineMethod (c$, "getDataArray", 
function () {
return this.data;
});
Clazz.defineMethod (c$, "setDataArray", 
function (d) {
this.data = d;
}, "~A");
Clazz.defineMethod (c$, "getDataSize", 
function () {
var np = 0;
switch (this.dataMode) {
case 0:
np = this.getDataMask ().size ();
break;
case 1:
if (this.useBig) {
np = this.bigByteArray.size ();
} else {
np = this.byteArray.length;
}break;
case 2:
if (this.useBig) {
np = this.bigData.size ();
} else {
np = this.getDataArraySize ();
}break;
}
return np;
});
Clazz.defineMethod (c$, "getDataArraySize", 
function () {
return this.data.length;
});
Clazz.defineMethod (c$, "getDataMask", 
function () {
return this.dataMask;
});
Clazz.defineMethod (c$, "setDataMask", 
function (bs) {
this.dataMask = bs;
}, "JU.BS");
Clazz.defineMethod (c$, "getByteArray", 
function () {
return this.byteArray;
});
Clazz.defineMethod (c$, "absoluteGridToCartesian", 
function (grid, p) {
this.absoluteGridToCartesian (grid[0], grid[1], grid[2], p);
}, "~A,astex.util.Point3d");
Clazz.defineMethod (c$, "absoluteGridToCartesian", 
function (ix, iy, iz, p) {
this.xxx[0] = ix;
this.xxx[1] = iy;
this.xxx[2] = iz;
if (this.mapType == 3) {
p.x = this.origin.x + this.spacing.x * ix;
p.y = this.origin.y + this.spacing.y * iy;
p.z = this.origin.z + this.spacing.z * iz;
} else {
this.swapped[this.axis[0]] = this.xxx[0];
this.swapped[this.axis[1]] = this.xxx[1];
this.swapped[this.axis[2]] = this.xxx[2];
for (var j = 0; j < 3; j++) {
this.swapped[j] /= this.nv[j];
}
p.set (this.swapped[0], this.swapped[1], this.swapped[2]);
p.transform (this.fractionalToCartesian);
p.transform (this.transform);
if (!this.getAddTransform ().isIdentity ()) {
p.transform (this.getAddTransform ());
}}}, "~N,~N,~N,astex.util.Point3d");
Clazz.defineMethod (c$, "nearestRelativeGrid", 
function (p, g) {
this.nearestRelativeGrid (p, g, false);
}, "astex.util.Point3d,~A");
Clazz.defineMethod (c$, "nearestRelativeGrid", 
function (p, g, doRot) {
this.dummy.setP (p);
this.dummy.transform (this.getBackTransform ());
if (doRot) {
var m =  new astex.util.Matrix ();
m.rotateXYZ (this.rotation[0], this.rotation[1], this.rotation[2]);
this.dummy.transform (m);
}this.dummy.transform (this.cartesianToFractional);
this.xxx[0] = this.dummy.x * this.nv[0];
this.xxx[1] = this.dummy.y * this.nv[1];
this.xxx[2] = this.dummy.z * this.nv[2];
this.swapped[0] = this.xxx[this.axis[0]];
this.swapped[1] = this.xxx[this.axis[1]];
this.swapped[2] = this.xxx[this.axis[2]];
this.swapped[0] -= this.nu[0] + this.minimumGrid[0];
this.swapped[1] -= this.nu[1] + this.minimumGrid[1];
this.swapped[2] -= this.nu[2] + this.minimumGrid[2];
g[0] = Clazz.doubleToInt (this.swapped[0] + 0.5);
g[1] = Clazz.doubleToInt (this.swapped[1] + 0.5);
g[2] = Clazz.doubleToInt (this.swapped[2] + 0.5);
}, "astex.util.Point3d,~A,~B");
Clazz.defineMethod (c$, "lowerRelativeGrid", 
function (p, g) {
var frac =  Clazz.newFloatArray (3, 0);
this.lowerRelativeGrid (p, g, frac);
}, "astex.util.Point3d,~A");
Clazz.defineMethod (c$, "lowerRelativeGrid", 
function (p, g, frac) {
this.dummy.setP (p);
this.dummy.transform (this.getBackTransform ());
this.dummy.transform (this.cartesianToFractional);
this.xxx[0] = this.dummy.x * this.nv[0];
this.xxx[1] = this.dummy.y * this.nv[1];
this.xxx[2] = this.dummy.z * this.nv[2];
for (var i = 0; i < 3; i++) {
this.swapped[i] = this.xxx[this.axis[i]];
this.swapped[i] -= this.nu[i] + this.minimumGrid[i];
g[i] = Clazz.doubleToInt (this.swapped[i]);
frac[i] = this.swapped[i] - g[i];
}
}, "astex.util.Point3d,~A,~A");
Clazz.defineMethod (c$, "recalcStats", 
function (tmpStats) {
var min;
var max;
var sum;
var sum2;
min = max = sum = sum2 = .0;
switch (this.dataMode) {
case 0:
return;
case 1:
var val = .0;
if (this.useBig) {
val = this.stat[0] + this.stat[3] * (this.bigByteArray.get (0) + 128) / 256;
} else {
val = this.stat[0] + this.stat[3] * (this.byteArray[0] + 128) / 256;
}min = max = sum = val;
sum2 = val * val;
if (this.useBig) {
for (var i = 1; i < this.nPoints; i++) {
val = this.stat[0] + this.stat[3] * (this.bigByteArray.get (i) + 128) / 256;
if (val < min) min = val;
if (val > max) max = val;
sum += val;
sum2 += val * val;
}
} else {
for (var i = 1; i < this.nPoints; i++) {
val = this.stat[0] + this.stat[3] * (this.byteArray[i] + 128) / 256;
if (val < min) min = val;
if (val > max) max = val;
sum += val;
sum2 += val * val;
}
}break;
case 2:
val = .0;
if (this.useBig) {
val = this.bigData.get (0);
} else {
val = this.data[0];
}min = max = sum = val;
sum2 = val * val;
if (this.useBig) {
for (var i = 1; i < this.nPoints; i++) {
val = this.bigData.get (i);
if (val < min) min = val;
if (val > max) max = val;
sum += val;
sum2 += val * val;
}
} else {
for (var i = 1; i < this.nPoints; i++) {
if (this.data[i] < min) min = this.data[i];
if (this.data[i] > max) max = this.data[i];
sum += this.data[i];
sum2 += this.data[i] * this.data[i];
}
}break;
}
tmpStats[0] = min;
tmpStats[1] = max;
tmpStats[2] = sum / this.nPoints;
tmpStats[3] = max - min;
tmpStats[4] = Math.sqrt (sum2 / this.nPoints);
this.rms = tmpStats[4];
if (this.debug) {
System.out.println ("Recalculated stats");
System.out.println ("Mimimum: " + tmpStats[0]);
System.out.println ("Maximum: " + tmpStats[1]);
System.out.println ("Average: " + tmpStats[2]);
System.out.println ("rms:" + tmpStats[4]);
}}, "~A");
Clazz.overrideMethod (c$, "getMinMax", 
function () {
return this.stat;
});
Clazz.overrideMethod (c$, "getRawLevel", 
function () {
return this.rawLevel;
});
Clazz.overrideMethod (c$, "setRawLevel", 
function (r) {
this.rawLevel = r;
}, "~N");
Clazz.defineMethod (c$, "getScale", 
function () {
return this.$scale;
});
Clazz.overrideMethod (c$, "setScale", 
function (s) {
this.$scale = s;
}, "~N");
Clazz.overrideMethod (c$, "getRotations", 
function () {
return this.rotation;
});
Clazz.overrideMethod (c$, "setRotations", 
function (alpha, beta, gamma) {
this.rotation[0] = alpha;
this.rotation[1] = beta;
this.rotation[2] = gamma;
}, "~N,~N,~N");
Clazz.overrideMethod (c$, "setInvert", 
function (s) {
this.invert = s;
}, "~B");
Clazz.defineMethod (c$, "getInvert", 
function () {
return this.invert;
});
Clazz.overrideMethod (c$, "getShowGrid", 
function () {
return this.showGrid;
});
Clazz.overrideMethod (c$, "setShowGrid", 
function (s) {
this.showGrid = s;
}, "~B");
Clazz.defineMethod (c$, "setArraySize", 
function (i) {
this.nPoints = i;
{
return;
}}, "~N");
Clazz.defineMethod (c$, "getCutSelection", 
function () {
return this.$cutSelection;
});
Clazz.overrideMethod (c$, "setCutSelection", 
function (TF) {
if (TF || this.$cutSelection) this.setNeedsReading (2);
this.$cutSelection = TF;
}, "~B");
Clazz.defineMethod (c$, "getCutRadius", 
function () {
return this.cutRadius;
});
Clazz.overrideMethod (c$, "setCutRadius", 
function (r) {
this.cutRadius = r;
}, "~N");
Clazz.overrideMethod (c$, "setContourLevel", 
function (i, level) {
if (i >= 0 && i < astex.map.VolumeMap.MaximumContourLevels) {
this.contourLevels[i] = level;
}}, "~N,~N");
Clazz.overrideMethod (c$, "setContourColor", 
function (i, color) {
if (i >= 0 && i < astex.map.VolumeMap.MaximumContourLevels) {
this.contourColors[i] = color;
}}, "~N,~N");
Clazz.overrideMethod (c$, "setContourStyle", 
function (i, style) {
if (i >= 0 && i < astex.map.VolumeMap.MaximumContourLevels) {
this.contourStyle[i] = style;
}}, "~N,~N");
Clazz.overrideMethod (c$, "setContourDisplayed", 
function (i, displayed) {
if (i >= 0 && i < astex.map.VolumeMap.MaximumContourLevels) {
this.contourDisplayed[i] = displayed;
}}, "~N,~B");
Clazz.overrideMethod (c$, "getContourLevel", 
function (i) {
if (i >= 0 && i < astex.map.VolumeMap.MaximumContourLevels) {
return this.contourLevels[i];
}return 0.0;
}, "~N");
Clazz.overrideMethod (c$, "getContourColor", 
function (i) {
if (i >= 0 && i < astex.map.VolumeMap.MaximumContourLevels) {
return this.contourColors[i];
}return 0;
}, "~N");
Clazz.overrideMethod (c$, "getContourStyle", 
function (i) {
if (i >= 0 && i < astex.map.VolumeMap.MaximumContourLevels) {
return this.contourStyle[i];
}return 1;
}, "~N");
Clazz.overrideMethod (c$, "getContourDisplayed", 
function (i) {
if (i >= 0 && i < astex.map.VolumeMap.MaximumContourLevels) {
return this.contourDisplayed[i];
}return false;
}, "~N");
Clazz.overrideMethod (c$, "hasContoursDisplayed", 
function () {
for (var i = 0; i < astex.map.VolumeMap.MaximumContourLevels; i++) {
if (this.getContourDisplayed (i)) {
return true;
}}
return false;
});
Clazz.overrideMethod (c$, "setContourSize", 
function (s) {
if (this.contourSize != s) {
this.contourSize = s;
this.setNeedsReading (2);
}}, "~N");
Clazz.overrideMethod (c$, "getContourSize", 
function () {
return this.contourSize;
});
Clazz.defineMethod (c$, "setMasks", 
function (masks) {
this.masks = masks;
}, "astex.util.DynamicArray");
Clazz.overrideMethod (c$, "getMasks", 
function () {
return this.masks;
});
Clazz.defineMethod (c$, "getNMasks", 
function () {
return this.masks.size ();
});
Clazz.overrideMethod (c$, "addMask", 
function (mask) {
mask.setMap (this);
this.masks.add (mask);
}, "astex.api.AstexMask");
Clazz.defineMethod (c$, "getMaskByName", 
function (name, warn) {
var mask = null;
for (var i = 0; i < this.masks.size (); i++) {
mask = this.masks.get (i);
if (mask.getLabel ().equals (name)) return mask;
}
if (warn) System.out.println ("Could not find mask: " + name + " for map: " + this.getName ());
return null;
}, "~S,~B");
Clazz.overrideMethod (c$, "getMaskByIndex", 
function (index) {
return this.masks.get (index);
}, "~N");
Clazz.defineMethod (c$, "setShowMaskLabels", 
function (showMaskLabels) {
this.showMaskLabels = showMaskLabels;
}, "~B");
Clazz.overrideMethod (c$, "getShowMaskLabels", 
function () {
return this.showMaskLabels;
});
Clazz.overrideMethod (c$, "removeMaskByName", 
function (name) {
var mask = null;
for (var i = 0; i < this.masks.size (); i++) {
mask = this.masks.get (i);
if (mask.getLabel ().equals (name)) {
this.masks.removeElement (i);
return mask;
}}
return mask;
}, "~S");
Clazz.defineMethod (c$, "removeMask", 
function (i) {
var mask = this.masks.get (i);
this.masks.removeElement (i);
return mask;
}, "~N");
Clazz.defineMethod (c$, "setSpaceGroup", 
function (spaceGroup) {
this.setSpaceGroupNumber (spaceGroup);
var symmetryTokens = this.getSymmetryTokens ();
if (symmetryTokens != null) {
var nRecords = symmetryTokens.size ();
this.symRecords =  Clazz.newCharArray (nRecords * 80, '\0');
for (var i = 0; i < nRecords; i++) {
var token = symmetryTokens.get (i);
var tokenLength = token.length;
for (var j = 0; j < tokenLength; j++) this.symRecords[80 * i + j] = token.charAt (j);

for (var j = tokenLength; j < 80; j++) this.symRecords[80 * i + j] = ' ';

}
}this.ihdr3[0] = spaceGroup;
this.ihdr3[1] = this.symRecords.length;
}, "~N");
Clazz.defineMethod (c$, "getUseSymmetry", 
function () {
return astex.map.VolumeMapImp.useSymmetry;
});
Clazz.overrideMethod (c$, "setUseSymmetry", 
function (u) {
astex.map.VolumeMapImp.useSymmetry = u;
}, "~B");
Clazz.defineMethod (c$, "getMaxSymmetry", 
function () {
return astex.map.VolumeMapImp.maxSymmetry;
});
Clazz.overrideMethod (c$, "setMaxSymmetry", 
function (m) {
astex.map.VolumeMapImp.maxSymmetry = m;
}, "~N");
Clazz.defineMethod (c$, "finalize", 
function () {
try {
if (this.bigData != null) {
this.bigData.free ();
this.bigData = null;
}if (this.bigByteArray != null) {
this.bigByteArray.free ();
this.bigByteArray = null;
}} catch (t) {
throw t;
} finally {
Clazz.superCall (this, astex.map.VolumeMapImp, "finalize", []);
}
});
Clazz.overrideMethod (c$, "findMap", 
function (maps, mapName) {
for (var i = maps.size (); --i >= 0; ) {
var map = maps.get (i);
if (map.getName ().equals (mapName)) return map;
}
return null;
}, "astex.util.DynamicArray,~S");
Clazz.defineMethod (c$, "getMaskByName", 
function (maps, mapName, maskName) {
var map = this.findMap (maps, mapName);
return (map == null ? null : map.getMaskByName (maskName, true));
}, "astex.util.DynamicArray,~S,~S");
Clazz.overrideMethod (c$, "getGridOrigin", 
function (gridOrigin) {
gridOrigin.set ((this.nu[this.raxis[0]] / this.nv[0]), (this.nu[this.raxis[1]] / this.nv[1]), (this.nu[this.raxis[2]] / this.nv[2]));
}, "astex.util.Point3d");
Clazz.overrideMethod (c$, "setCurrentTransformForMap", 
function (cartesianToFractional, fractionalToCartesian, operator, moleculeCenter, cpyCenter, gridOrigin, currentTransform) {
currentTransform.setIdentity ();
currentTransform.transform (cartesianToFractional);
currentTransform.transform (operator);
cpyCenter.setP (moleculeCenter);
cpyCenter.transform (cartesianToFractional);
cpyCenter.transform (operator);
var x = cpyCenter.x - gridOrigin.x;
if (x < .0) currentTransform.x30 += Math.rint (-(x - .5));
 else if (x > 1.0) currentTransform.x30 -= Math.rint (x - .5);
var y = cpyCenter.y - gridOrigin.y;
if (y < .0) currentTransform.x31 += Math.rint (-(y - .5));
 else if (y > 1.0) currentTransform.x31 -= Math.rint (y - .5);
var z = cpyCenter.z - gridOrigin.z;
if (z < .0) currentTransform.x32 += Math.rint (-(z - .5));
 else if (z > 1.0) currentTransform.x32 -= Math.rint (z - .5);
currentTransform.transform (fractionalToCartesian);
return currentTransform;
}, "astex.util.Matrix,astex.util.Matrix,astex.util.Matrix,astex.util.Point3d,astex.util.Point3d,astex.util.Point3d,astex.util.Matrix");
Clazz.defineMethod (c$, "clipMap", 
function (mr, selection, inside) {
if (this.getDataMode () == 0) {
System.out.print ("clip map not implemented for maps in bitset mode,");
System.out.println (" map: " + this.getName ());
return;
}var p =  new astex.util.Point3d ();
var data = this.getDataArray ();
var point = 0;
for (var iz = this.minimumGrid[2]; iz < this.maximumGrid[2]; iz++) {
for (var iy = this.minimumGrid[1]; iy < this.maximumGrid[1]; iy++) {
var gridStart = this.minimumGrid[0];
var gridStop = this.maximumGrid[0];
for (var ix = gridStart; ix < gridStop; ix++) {
this.absoluteGridToCartesian (ix + this.nu[0], iy + this.nu[1], iz + this.nu[2], p);
if (this.clipped (p, selection) != inside) {
data[point] = 0.0;
}point++;
}
}
}
}, "astex.render.MoleculeRenderer,astex.util.DynamicArray,~B");
Clazz.overrideMethod (c$, "clipMaps", 
function (mr, namePattern, selection, inside) {
System.out.println ("clip maps");
this.lastAtom = null;
this.lastAtomClips = 0;
this.lastAtomBondedClips = 0;
this.clips = 0;
for (var i = 0; i < mr.getMapCount (); i++) {
var map = mr.getMap (i);
if (namePattern == null || astex.util.Mmatch.matches (namePattern, map.getName ())) {
map.clipMap (mr, selection, inside);
}}
System.out.println ("clips " + this.clips);
System.out.println ("last atom clips " + this.lastAtomClips);
System.out.println ("last atom bonded clips " + this.lastAtomBondedClips);
}, "astex.render.MoleculeRenderer,~S,astex.util.DynamicArray,~B");
Clazz.defineMethod (c$, "clipped", 
 function (p, selection) {
var dSq = 2.25;
if (this.lastAtom != null) {
if (p.distanceSq (this.lastAtom) < dSq) {
this.lastAtomClips++;
return true;
}this.lastAtom = null;
}var atomCount = selection.size ();
var atoms = selection.getArray ();
for (var a = 0; a < atomCount; a++) {
var atom = atoms[a];
var dx = 0.0;
if (atom.x > p.x) {
dx = atom.x - p.x;
} else {
dx = p.x - atom.x;
}if (dx < 1.5) {
if (p.distanceSq (atom) < dSq) {
this.lastAtom = atom;
this.clips++;
return true;
}}}
return false;
}, "astex.util.Point3d,astex.util.DynamicArray");
Clazz.defineMethod (c$, "swapAxes", 
 function (p) {
var x = p.x;
var y = p.y;
var z = p.z;
if (this.axis[0] == 0) p.x = x;
 else if (this.axis[0] == 1) p.x = y;
 else if (this.axis[0] == 2) p.x = z;
if (this.axis[1] == 0) p.y = x;
 else if (this.axis[1] == 1) p.y = y;
 else if (this.axis[1] == 2) p.y = z;
if (this.axis[2] == 0) p.z = x;
 else if (this.axis[2] == 1) p.z = y;
 else if (this.axis[2] == 2) p.z = z;
}, "astex.util.Point3d");
Clazz.defineMethod (c$, "transformContourPoints", 
function (contour) {
var pointCount = contour.np;
var p =  new astex.util.Point3d ();
var mapType = this.getMapType ();
if (mapType == 1 || mapType == 5 || mapType == 6 || mapType == 7) {
for (var i = 0; i < pointCount; i++) {
this.relativeGridToCartesian (contour.x[i], contour.y[i], contour.z[i], p);
contour.x[i] = p.x;
contour.y[i] = p.y;
contour.z[i] = p.z;
}
} else {
for (var i = 0; i < pointCount; i++) {
contour.x[i] *= this.spacing.x;
contour.y[i] *= this.spacing.y;
contour.z[i] *= this.spacing.z;
contour.x[i] += this.origin.x;
contour.y[i] += this.origin.y;
contour.z[i] += this.origin.z;
}
}if (contour.style == 3 && mapType == 1) {
var xxx =  Clazz.newDoubleArray (3, 0);
var swapped =  Clazz.newDoubleArray (3, 0);
for (var i = 0; i < contour.np; i++) {
xxx[0] = contour.nx[i];
xxx[1] = contour.ny[i];
xxx[2] = contour.nz[i];
swapped[this.axis[0]] = xxx[0];
swapped[this.axis[1]] = xxx[1];
swapped[this.axis[2]] = xxx[2];
contour.nx[i] = swapped[0];
contour.ny[i] = swapped[1];
contour.nz[i] = swapped[2];
}
}}, "astex.render.Tmesh");
Clazz.defineMethod (c$, "contourRegion", 
 function (contour, contourNumber, style) {
var nx = 0;
var ny = 0;
var nz = 0;
var mapType = this.getMapType ();
var level = this.getContourLevel (contourNumber);
contour.empty ();
System.gc ();
if (style == 1) {
contour.style = 2;
} else if (style == 2) {
contour.style = 3;
if (!this.getAddTransform ().isIdentity ()) contour.backface = true;
}if (mapType == 1 || mapType == 5 || mapType == 6 || mapType == 7) {
nx = this.maximumGrid[0] - this.minimumGrid[0];
ny = this.maximumGrid[1] - this.minimumGrid[1];
nz = this.maximumGrid[2] - this.minimumGrid[2];
} else {
nx = this.ngrid[0];
ny = this.ngrid[1];
nz = this.ngrid[2];
}if (nx > 1 && ny > 1 && nz > 1) {
var rmsLevel = this.rms * level;
if (this.getMapMode () == 1) rmsLevel = this.getRawLevel ();
switch (this.getDataMode ()) {
case 0:
rmsLevel = 0.5;
break;
case 1:
var mapStat = this.getMinMax ();
rmsLevel = (rmsLevel - mapStat[0]) * 256.0 / mapStat[3] - 128.0;
break;
}
var generateTriangles = false;
if (style == 1) {
generateTriangles = false;
} else if (style == 2) {
generateTriangles = true;
}astex.render.MoleculeRenderer.newMarch ().surface (generateTriangles, this.getDataMask (), this.getDataArray (), this.getByteArray (), nx, ny, nz, rmsLevel, false, contour, this.getDataMode ());
} else {
System.out.println ("Can not render a surface for map: " + this.getName () + " need at least two layers in each dimension");
}this.transformContourPoints (contour);
var doSymmetry = this.getUseSymmetry ();
if (doSymmetry) {
var symmetryOperators = this.getSymmetryOperators ();
if (symmetryOperators != null) {
var nCopies = symmetryOperators.size ();
var maxCopies = this.getMaxSymmetry ();
if (maxCopies > 0 && nCopies > maxCopies) nCopies = maxCopies;
var endNp = contour.np;
var endNt = contour.nt;
for (var i = 0; i < nCopies; i++) {
var mtrx = symmetryOperators.get (i);
if (mtrx.isIdentity ()) continue;
contour.translateCopy (mtrx, 0, endNp, 0, endNt);
}
}}return contour;
}, "astex.render.Tmesh,~N,~N");
Clazz.overrideMethod (c$, "contourMap", 
function (mr, contour) {
var contourName = mr.getContourGraphicalObjectName (this, contour);
if (this.needsReading () == 2) {
if (!this.determineRegion (mr)) return false;
if (this.mapType != 7 && !this.readRegionIOData ()) return false;
}if (this.getContourDisplayed (contour)) {
try {
var style = this.getContourStyle (contour);
var contourObject = this.contourRegion (mr.getContourGraphicalObject (this, contour), contour, style);
contourObject.setColor (this.getContourColor (contour));
if (this.getMasks ().size () > 0) this.setMapColors (contourObject);
contourObject.setName (contourName);
contourObject.setVisible (true);
} catch (e) {
if (Clazz.exceptionOf (e, OutOfMemoryError)) {
System.gc ();
throw  new OutOfMemoryError (e.getMessage ());
} else {
throw e;
}
}
} else {
var contourObject = mr.getContourGraphicalObject (this, contour);
contourObject.setVisible (false);
}return true;
}, "astex.render.MoleculeRenderer,~N");
Clazz.defineMethod (c$, "determineRegion", 
 function (mr) {
if (!this.read ()) return false;
var mapType = this.getMapType ();
if (mapType == 1 || mapType == 5 || mapType == 6 || mapType == 7) {
var cartesianToFractional = this.getCartesianToFractionalMatrix ();
var mapCenter = mr.renderer.getCenter ();
mapCenter.transform (cartesianToFractional);
mapCenter.x *= this.nv[0];
mapCenter.y *= this.nv[1];
mapCenter.z *= this.nv[2];
this.swapAxes (mapCenter);
if (mr.mapBehaviourMode == 1) {
this.setCenterGrid (0, Clazz.doubleToInt (mapCenter.x));
this.setCenterGrid (1, Clazz.doubleToInt (mapCenter.y));
this.setCenterGrid (2, Clazz.doubleToInt (mapCenter.z));
for (var i = 0; i < 3; i++) {
this.setCenterGrid (i, this.getCenterGrid (i) - this.nu[i]);
this.minimumGrid[i] = this.getCenterGrid (i) - this.getContourSize ();
this.maximumGrid[i] = this.getCenterGrid (i) + this.getContourSize ();
if (this.minimumGrid[i] < 0) this.minimumGrid[i] = 0;
if (this.maximumGrid[i] < 0) this.maximumGrid[i] = 0;
if (this.minimumGrid[i] >= this.grid[i]) this.minimumGrid[i] = this.grid[i];
if (this.maximumGrid[i] >= this.grid[i]) this.maximumGrid[i] = this.grid[i];
}
} else {
for (var i = 0; i < 3; i++) this.setCenterGrid (i, Clazz.doubleToInt (this.grid[i] / 2));

var farCorner = astex.util.Point3d.new3 (this.cell[0], this.cell[1], this.cell[2]);
var farDist = farCorner.length () / 2.0;
this.setContourSize (Clazz.doubleToInt ((this.getLargestGridExtent () + 1) / 2));
this.setMinMax ();
if (farDist > mr.renderer.getClip ()) mr.setClip (farDist);
if (farDist > mr.renderer.getRadius ()) mr.setRadius (farDist);
}}return true;
}, "astex.render.MoleculeRenderer");
Clazz.overrideMethod (c$, "getAxis", 
function (i) {
return this.axis[i];
}, "~N");
Clazz.overrideMethod (c$, "fillMinMaxVoxel", 
function (min, max, voxel) {
for (var i = 0; i < 3; i++) {
voxel[i] = this.cell[i] / this.nv[i];
min[i] = this.nu[this.raxis[i]] * voxel[i];
max[i] = min[i] + this.grid[this.raxis[i]] * voxel[i];
}
}, "~A,~A,~A");
Clazz.overrideMethod (c$, "setVolumeRender", 
function (TF) {
this.volumeRender = TF;
}, "~B");
Clazz.overrideMethod (c$, "setVolumeColor", 
function (color) {
this.volumeColor = color;
}, "~N");
Clazz.overrideMethod (c$, "setVolumeMin", 
function (min) {
this.volumeMin = min;
}, "~N");
Clazz.overrideMethod (c$, "setVolumeMax", 
function (max) {
this.volumeMax = max;
}, "~N");
Clazz.overrideMethod (c$, "removeAllMasks", 
function () {
var mask = null;
for (var i = this.getMasks ().size (); --i >= 0; ) mask = this.removeMask (i);

return mask;
});
Clazz.overrideMethod (c$, "getRenderCenter", 
function () {
var dir =  Clazz.newDoubleArray (3, 0);
for (var i = 0; i < 3; i++) {
var axis = this.getAxis (i);
dir[i] = (this.nu[axis] + this.getCenterGrid (axis)) * this.cell[axis] / this.nv[axis];
}
var d = astex.util.Point3d.new3 (dir[0], dir[1], dir[2]);
d.add (this.getOffset ());
return d;
});
Clazz.overrideMethod (c$, "defineMapSelection", 
function (nAtoms, atoms, tolerance, name, m) {
this.setDataMode (0);
this.setRawLevel (0.5);
this.setMapMode (1);
this.setName (name);
this.setNeedsReading (0);
var minXd;
var minYd;
var minZd;
var maxXd;
var maxYd;
var maxZd;
var at = atoms.get (0);
minXd = maxXd = at.x;
minYd = maxYd = at.y;
minZd = maxZd = at.z;
var atSym = at.getAtomSymbol ();
var allTheSame = true;
for (var a = 1; a < nAtoms; a++) {
at = atoms.get (a);
if (at.x > maxXd) maxXd = at.x;
if (at.x < minXd) minXd = at.x;
if (at.y > maxYd) maxYd = at.y;
if (at.y < minYd) minYd = at.y;
if (at.z > maxZd) maxZd = at.z;
if (at.z < minZd) minZd = at.z;
if (atSym !== at.getAtomSymbol ()) allTheSame = false;
}
if (tolerance < .0) {
tolerance = 2.0;
if (allTheSame) {
if (atSym.equals ("C")) {
tolerance = 4.0;
} else if (atSym.equals ("P")) {
tolerance = 5.0;
} else {
tolerance = 4.0;
}}}var xRange = maxXd - minXd;
var yRange = maxYd - minYd;
var zRange = maxZd - minZd;
var scale = 2.0;
var iScale = 1.0 / scale;
var ix = 3 + Clazz.doubleToInt ((xRange + 2 * tolerance) * iScale);
var iy = 3 + Clazz.doubleToInt ((yRange + 2 * tolerance) * iScale);
var iz = 3 + Clazz.doubleToInt ((zRange + 2 * tolerance) * iScale);
var offx = Clazz.doubleToInt ((minXd - tolerance) * iScale) - 1;
var offy = Clazz.doubleToInt ((minYd - tolerance) * iScale) - 1;
var offz = Clazz.doubleToInt ((minZd - tolerance) * iScale) - 1;
var maxExtent = ix;
if (maxExtent < iy) maxExtent = iy;
if (maxExtent < iz) maxExtent = iz;
var np = ix * iy * iz;
var bs = JU.BS.newN (np);
var maxPointsAway = 1 + Clazz.doubleToInt (tolerance * iScale);
var mxy = ix * iy;
var pSum =  new astex.util.Point3d ();
var tol2 = tolerance * tolerance;
for (var a = 0; a < nAtoms; a++) {
at = atoms.get (a);
var p = astex.util.Point3d.new3 (at.x, at.y, at.z);
pSum.add (p);
var x = Clazz.doubleToInt (at.x * iScale) - offx;
var minX = Math.max (x - maxPointsAway, 0);
var maxX = Math.min (x + maxPointsAway, ix);
var y = Clazz.doubleToInt (at.y * iScale) - offy;
var minY = Math.max (y - maxPointsAway, 0);
var maxY = Math.min (y + maxPointsAway, iy);
var z = Clazz.doubleToInt (at.z * iScale) - offz;
var minZ = Math.max (z - maxPointsAway, 0);
var maxZ = Math.min (z + maxPointsAway, iz);
for (var i = minX; i < maxX; i++) {
var cart =  new astex.util.Point3d ();
cart.x = (i + offx) * scale;
for (var j = minY; j < maxY; j++) {
cart.y = (j + offy) * scale;
for (var k = minZ; k < maxZ; k++) {
cart.z = (k + offz) * scale;
if (p.distanceSq (cart) < tol2) {
var pos = k * mxy + j * ix + i;
bs.set (pos);
}}
}
}
}
this.setArraySize (np);
this.grid[0] = this.nv[0] = ix;
this.grid[1] = this.nv[1] = iy;
this.grid[2] = this.nv[2] = iz;
this.nu[0] = offx;
this.nu[1] = offy;
this.nu[2] = offz;
this.cell[0] = ix * scale;
this.cell[1] = iy * scale;
this.cell[2] = iz * scale;
for (var i = 3; i < 6; i++) this.cell[i] = 90.0;

for (var i = 0; i < 3; i++) this.axis[i] = i;

this.setUnitCell (this.cell);
this.setContourSize (maxExtent);
this.setCenterGrid (Clazz.doubleToInt (ix / 2), Clazz.doubleToInt (iy / 2), Clazz.doubleToInt (iz / 2));
this.setMinMax ();
this.setDataMask (bs);
if (m != null) {
var symmetryOperators = null;
var nCopies = 0;
var symType = 0;
if (m.getSymmetry ().getSymmetryOperators ().size () > 1) {
symmetryOperators = m.getSymmetry ().getSymmetryOperators ();
nCopies = symmetryOperators.size ();
symType = 1;
} else if (m.getBioTransformCount () > 1) {
nCopies = m.getBioTransformCount ();
symType = 2;
}for (var i = 0; i < nCopies; i++) {
var mtrx;
if (symType == 1) {
mtrx = symmetryOperators.get (i);
} else {
mtrx = m.getBioTransform (i);
}this.addTransform (mtrx);
}
}return np;
}, "~N,astex.util.DynamicArray,~N,~S,astex.model.Molecule");
Clazz.overrideMethod (c$, "cutSelection", 
function (nAtoms, atoms) {
var ix = 0;
var iy = 0;
var iz = 0;
var mx = 0;
var mxy = 0;
var mapType = this.getMapType ();
var dataMode = this.getDataMode ();
if (dataMode != 2 && dataMode != 1) {
System.out.print ("Cutting map based on selection only supported");
System.out.println (" for floating point data mode");
return;
}if (mapType == 1 || mapType == 5 || mapType == 6) {
ix = this.minimumGrid[0] + this.nu[0];
iy = this.minimumGrid[1] + this.nu[1];
iz = this.minimumGrid[2] + this.nu[2];
mx = this.maximumGrid[0] - this.minimumGrid[0];
mxy = mx * (this.maximumGrid[1] - this.minimumGrid[1]);
} else {
mx = this.ngrid[0];
mxy = mx * this.ngrid[1];
}var tolerance = this.getCutRadius ();
var tol2 = tolerance * tolerance;
var g =  Clazz.newIntArray (3, 0);
var maxPointsAway = 1 + Clazz.doubleToInt (tolerance * this.cell[0] / this.grid[0]);
var np = this.getDataSize ();
var stat = this.getMinMax ();
var data = null;
var tmpData = null;
var bData = null;
var bTmpData = null;
if (dataMode == 1) {
bData = this.getByteArray ();
bTmpData =  Clazz.newByteArray (np, 0);
System.arraycopy (bData, 0, bTmpData, 0, np);
var minValue = -128;
java.util.Arrays.fill (bData, minValue);
} else {
data = this.getDataArray ();
tmpData =  Clazz.newFloatArray (np, 0);
System.arraycopy (data, 0, tmpData, 0, np);
var minValue = stat[0];
java.util.Arrays.fill (data, minValue);
}for (var a = 0; a < nAtoms; a++) {
var at = atoms.get (a);
var p = astex.util.Point3d.new3 (at.x, at.y, at.z);
this.nearestRelativeGrid (p, g);
var minX = Math.max (g[0] - maxPointsAway, 0);
var maxX = Math.min (g[0] + maxPointsAway, this.grid[0]);
var minY = Math.max (g[1] - maxPointsAway, 0);
var maxY = Math.min (g[1] + maxPointsAway, this.grid[1]);
var minZ = Math.max (g[2] - maxPointsAway, 0);
var maxZ = Math.min (g[2] + maxPointsAway, this.grid[2]);
for (var i = minX; i < maxX; i++) {
for (var j = minY; j < maxY; j++) {
for (var k = minZ; k < maxZ; k++) {
var cart =  new astex.util.Point3d ();
this.absoluteGridToCartesian (i + ix, j + iy, k + iz, cart);
if (p.distanceSq (cart) < tol2) {
var pos = k * mxy + j * mx + i;
if (dataMode == 1) {
bData[pos] = bTmpData[pos];
} else {
data[pos] = tmpData[pos];
}}}
}
}
}
}, "~N,astex.util.DynamicArray");
Clazz.overrideMethod (c$, "getFofType", 
function (mapCount) {
var filename = this.getFile ();
if (filename != null) {
var lowercase = filename.toLowerCase ();
if (lowercase.indexOf ("2fofc") != -1) return "2fofc";
if (lowercase.indexOf ("fofc") != -1) return "fofc";
}if (mapCount == 1) return "2fofc";
return "fofc";
}, "~N");
Clazz.overrideMethod (c$, "setMapColors", 
function (object) {
var g =  Clazz.newIntArray (3, 0);
var index;
var nMasks = this.getMasks ().size ();
var my = this.grid[0];
var myz = my * this.grid[1];
object.setColorStyle (3);
for (var i = 0; i < object.np; i++) {
var p = astex.util.Point3d.new3 (object.x[i], object.y[i], object.z[i]);
object.vcolor[i] = this.getContourColor (0);
this.nearestRelativeGrid (p, g, true);
index = g[2] * myz + g[1] * my + g[0];
for (var m = 0; m < nMasks; m++) {
var mask = this.getMasks ().get (m);
if (mask.getMask ().get (index)) {
object.vcolor[i] = mask.getColor ();
break;
}}
}
}, "astex.render.Tmesh");
Clazz.overrideMethod (c$, "setStateOf", 
function (mapState) {
mapState.map = this;
var offset = this.getOffset ();
var rot = this.getRotations ();
mapState.x = offset.x;
mapState.y = offset.y;
mapState.z = offset.z;
mapState.alpha = rot[0];
mapState.beta = rot[1];
mapState.gamma = rot[2];
mapState.iStyle = this.getContourStyle (0);
mapState.showMap = this.getContourDisplayed (0);
mapState.color = this.getContourColor (0);
mapState.level = this.getRawLevel ();
mapState.scale = this.getScale ();
mapState.size = this.getContourSize () * 2;
for (var i = 0; i < 3; i++) {
var axis = this.getAxis (i);
mapState.iGridMax[i] = this.grid[axis] + this.nu[axis] + 1;
mapState.iGridMin[i] = this.nu[axis];
mapState.iGridVal[i] = this.nu[axis] + this.getCenterGrid (axis);
}
mapState.invert = this.getInvert ();
mapState.showGrid = this.getShowGrid ();
mapState.cutSelection = this.getCutSelection ();
mapState.cutDistance = this.getCutRadius ();
mapState.showMaskLabel = this.getShowMaskLabels ();
mapState.nMasks = this.getMasks ().size ();
mapState.centerMap = false;
}, "astex.map.MapState");
Clazz.overrideMethod (c$, "applyMapState", 
function (mr, mapState) {
System.out.println ("Map: " + this.getName ());
if (Math.abs (mapState.x) > 1.0E-8 || Math.abs (mapState.y) > 1.0E-8 || Math.abs (mapState.z) > 1.0E-8) {
System.out.println ("Offset (A): " + this.distFormat.format (mapState.x) + " " + this.distFormat.format (mapState.y) + " " + this.distFormat.format (mapState.z));
}if (Math.abs (mapState.alpha) > 1.0E-8 || Math.abs (mapState.beta) > 1.0E-8 || Math.abs (mapState.gamma) > 1.0E-8) {
System.out.println ("Rotate (degrees): " + this.rotFormat.format (mapState.alpha) + " " + this.rotFormat.format (mapState.beta) + " " + this.rotFormat.format (mapState.gamma));
}System.out.println ("Level: " + this.distFormat.format (mapState.level) + " Scale: " + this.distFormat.format (mapState.scale) + " Size: " + mapState.size);
if (mapState.centerMap) {
mr.centerMapByName (this.getName ());
}System.out.println ("Grid center: " + mapState.iGridVal[0] + " " + mapState.iGridVal[1] + " " + mapState.iGridVal[2]);
var iGrid =  Clazz.newIntArray (3, 0);
for (var i = 0; i < 3; i++) {
iGrid[i] = mapState.iGridVal[i];
if (iGrid[i] != this.nu[this.axis[i]] + this.getCenterGrid (this.axis[i])) {
this.setCenterGrid (i, iGrid[i] - this.nu[i]);
}}
this.setMapMode (1);
this.setScale (mapState.scale);
this.setShowGrid (mapState.showGrid);
this.setInvert (mapState.invert);
this.setCutSelection (mapState.cutSelection);
this.setCutRadius (mapState.cutDistance);
this.setRawLevel (mapState.level);
this.setShowMaskLabels (mapState.showMaskLabel);
var transform =  new astex.util.Matrix ();
transform.rotateXYZ (mapState.alpha, mapState.beta, mapState.gamma);
transform.addTranslation (mapState.x, mapState.y, mapState.z);
if (this.needsReading () != 0) this.readRegionTransformed (mr, transform, Clazz.doubleToInt ((mapState.size + 1) / 2), mapState.scale);
this.setRotations (mapState.alpha, mapState.beta, mapState.gamma);
this.setContourDisplayed (0, mapState.showMap);
for (var i = 0; i < astex.map.VolumeMap.MaximumContourLevels; i++) {
if (mapState.showMap == false) this.setContourDisplayed (i, mapState.showMap);
this.setContourStyle (i, mapState.iStyle);
this.setContourColor (i, mapState.color);
mr.setMapContourTransparency (this, i, mapState.transparency);
this.contourMap (mr, i);
}
}, "astex.render.MoleculeRenderer,astex.map.MapState");
Clazz.overrideMethod (c$, "readRegion", 
function (mr) {
var transform =  new astex.util.Matrix ();
var rot = this.getRotations ();
transform.rotateXYZ (rot[0], rot[1], rot[2]);
var trn = this.getTransform ().getTranslation ();
transform.translate (trn[0], trn[1], trn[2]);
this.readRegionTransformed (mr, transform, this.getContourSize (), this.getScale ());
for (var i = 0; i < astex.map.VolumeMap.MaximumContourLevels; i++) this.contourMap (mr, i);

mr.repaint ();
if (this.getInvert ()) this.setOffset (trn[0], trn[1], trn[2]);
}, "astex.render.MoleculeRenderer");
Clazz.overrideMethod (c$, "handleCommand", 
function (mr, viewer, args) {
if (args.defined ("-scale")) {
this.setScale (args.getDouble ("-scale", 1.0));
} else if (args.defined ("-level")) {
this.setRawLevel (args.getDouble ("-level", 0.0));
this.setMapMode (1);
} else if (args.defined ("-size")) {
this.setContourSize (args.getInteger ("-size", 24));
} else if (args.defined ("-transparency")) {
mr.setMapContourTransparency (this, 0, args.getInteger ("-transparency", 255));
} else if (args.defined ("-offset")) {
var s = args.getString ("-offset", "0.0,0.0,0.0");
var a = s.$plit (",");
var offset = astex.util.Point3d.new3 (Float.parseFloat (a[0]), Float.parseFloat (a[1]), Float.parseFloat (a[2]));
this.setOffset (offset);
} else if (args.defined ("-rotate")) {
var s = args.getString ("-rotate", "0.0,0.0,0.0");
var a = s.$plit (",");
this.setRotations (Float.parseFloat (a[0]), Float.parseFloat (a[1]), Float.parseFloat (a[2]));
} else if (args.defined ("-center")) {
var s = args.getString ("-center", "0,0,0");
var a = s.$plit (",");
for (var j = 0; j < 3; j++) this.setCenterGrid (j, Integer.parseInt (a[j]) - this.nu[j]);

} else if (args.defined ("-grid")) {
this.setShowGrid (args.getBoolean ("-grid", false));
} else if (args.defined ("-invert")) {
this.setInvert (args.getBoolean ("-invert", false));
} else if (args.defined ("-style")) {
var iStyle = args.getInteger ("-style", 1);
for (var j = 0; j < astex.map.VolumeMap.MaximumContourLevels; j++) this.setContourStyle (j, iStyle);

} else if (args.defined ("-reread")) {
var b = args.getBoolean ("-reread", false);
if (b) this.readRegion (mr);
if (viewer != null) {
viewer.setMapStateFromMap (this);
viewer.populateFromMapState ();
}} else if (args.defined ("-showmapdialog")) {
if (viewer != null) {
var b = args.getBoolean ("-showmapdialog", true);
if (b) {
viewer.showMapSettingsDialog (true);
viewer.setMapChoice (this);
viewer.setMapStateFromMap (this);
viewer.populateFromMapState ();
} else {
viewer.showMapSettingsDialog (false);
}}} else if (args.defined ("-saveas")) {
var newFileName = args.getString ("-saveas", null);
mr.writeMap (this.name, newFileName);
} else if (args.defined ("-color")) {
var c = args.getColor ("-color", 0xffff00);
for (var j = 0; j < astex.map.VolumeMap.MaximumContourLevels; j++) this.setContourColor (j, c);

} else if (args.defined ("-show")) {
var b = args.getBoolean ("-show", true);
if (b) {
this.setContourDisplayed (0, true);
} else {
for (var j = 0; j < astex.map.VolumeMap.MaximumContourLevels; j++) this.setContourDisplayed (j, false);

}} else if (args.defined ("-cutselection")) {
this.setCutSelection (args.getBoolean ("-cutselection", false));
} else if (args.defined ("-cutdistance")) {
this.setCutRadius (args.getDouble ("-cutdistance", 1.5));
} else if (args.defined ("-useSymmetry")) {
this.setUseSymmetry (args.getBoolean ("-useSymmetry", false));
} else if (args.defined ("-maxSymmetry")) {
this.setMaxSymmetry (args.getInteger ("maxSymmetry", 0));
} else if (args.defined ("-volumerender") || args.defined ("-volumecolor") || args.defined ("-volumemin") || args.defined ("-volumemax")) {
if (args.defined ("-volumerender")) {
this.setVolumeRender (args.getBoolean ("-volumerender", false));
}if (args.defined ("-volumecolor")) {
this.setVolumeColor (args.getColor ("-volumecolor", astex.util.Color32.red));
}if (args.defined ("-volumemin")) {
this.setVolumeMin (args.getDouble ("-volumemin", 0.0));
}if (args.defined ("-volumemax")) {
this.setVolumeMax (args.getDouble ("-volumemax", 1.0));
}} else {
System.out.println ("changing " + this.getName ());
var changed = false;
var centerValue = args.getDouble ("-multicenter", -Infinity);
if (centerValue != -Infinity) {
var spread = args.getDouble ("-multispread", 1.0);
for (var j = 0; j < astex.map.VolumeMap.MaximumContourLevels; j++) {
this.setContourLevel (j, centerValue);
centerValue += spread;
}
changed = true;
}var contourColourString = args.getString ("-multicolor", null);
if (contourColourString != null) {
var colors =  Clazz.newIntArray (3, 0);
var centerColour = astex.util.Color32.getColorFromName (contourColourString);
colors[0] = centerColour;
colors[1] = astex.util.Color32.add (centerColour, astex.util.Color32.scale (astex.util.Color32.white, 64));
colors[2] = astex.util.Color32.add (centerColour, astex.util.Color32.scale (astex.util.Color32.white, 128));
for (var j = 0; j < astex.map.VolumeMap.MaximumContourLevels; j++) {
this.setContourColor (j, colors[j]);
}
changed = true;
}if (changed) {
for (var j = 0; j < astex.map.VolumeMap.MaximumContourLevels; j++) {
this.contourMap (mr, j);
}
}}}, "astex.render.MoleculeRenderer,astex.viewer.Viewer,astex.util.Arguments");
Clazz.defineMethod (c$, "readRegionTransformed", 
 function (mr, transform, size, scale) {
if (this.getMapType () != 1 && this.getMapType () != 5 && this.getMapType () != 6) return;
if (!transform.isIdentity ()) {
System.out.println ("readRegion - incoming transform not identity");
}if (this.getInvert ()) {
var m =  new astex.util.Matrix ();
m.invert ();
transform.transform (m);
}this.setTransform (transform);
if (this.getContourSize () != size) {
if (size == -1) {
size = 24;
} else if (size == 0) {
size = this.nv[0];
for (var i = 1; i < 3; i++) {
if (this.nv[i] < size) {
size = this.nv[i];
}}
}this.setContourSize (size);
}if (scale < 1.0E-8) scale = 1.0;
this.generateScaledMatrices (this.cell, scale);
this.setMinMax ();
if (this.getCutSelection ()) this.setNeedsReading (2);
if (this.needsReading () == 2) {
this.getReader ().reset (this);
this.readRegionIOData ();
}if (this.getCutSelection ()) {
var nAtoms = mr.getSelectedAtomCount ();
if (nAtoms == 0) System.out.println ("No atoms selected, no mask created.");
 else this.cutSelection (nAtoms, mr.getSelectedAtoms ());
}}, "astex.render.MoleculeRenderer,astex.util.Matrix,~N,~N");
Clazz.overrideMethod (c$, "setContours", 
function (fofType, contourLevelCount, properties) {
if (this.initialiseContours) {
for (var i = 0; i < contourLevelCount; i++) {
var prefix = fofType + "." + i;
var levelLabel = prefix + ".level";
var levelString = properties.get (levelLabel);
var level = 3.0;
if (levelString != null) {
level = astex.io.FILE.readDouble (levelString);
}this.setContourLevel (i, level);
var colourLabel = prefix + ".colour";
var colourString = properties.get (colourLabel);
var colour = astex.util.Color32.blue;
if (colourString != null) {
colour = astex.util.Color32.getColorFromName (colourString);
}this.setContourColor (i, colour);
var displayLabel = prefix + ".displayed";
var displayString = properties.get (displayLabel);
var display = "true".equals (displayString);
if (!this.getGenSurface ()) display = false;
this.setContourDisplayed (i, display);
var styleLabel = prefix + ".style";
var styleString = properties.get (styleLabel);
var style = 1;
if (styleString != null) {
if (styleString.equals ("solid")) {
style = 2;
} else if (styleString.equals ("lines")) {
style = 1;
}}this.setContourStyle (i, style);
}
}}, "~S,~N,astex.util.Properties");
Clazz.overrideMethod (c$, "getVolumeRender", 
function () {
return false;
});
Clazz.overrideMethod (c$, "getMinGrid", 
function () {
return this.minimumGrid;
});
Clazz.overrideMethod (c$, "getMaxGrid", 
function () {
return this.maximumGrid;
});
Clazz.overrideMethod (c$, "getNu", 
function () {
return this.nu;
});
Clazz.overrideMethod (c$, "drawVolumeRender", 
function (mr, renderer) {
var gp = 0;
var s = mr.s;
System.out.println ("in drawMap!!!!");
var overallScale = renderer.getOverallScale ();
var spacing2 = this.spacing.x * 2.0;
var pixels = Clazz.doubleToInt (spacing2 * overallScale + 0.5);
var pixels2 = (Clazz.doubleToInt (pixels / 2)) * (Clazz.doubleToInt (pixels / 2));
var splatSize = 2 * pixels + 1;
var splatKernel = mr.splatKernel;
if (splatKernel == null || splatKernel.length < splatSize * splatSize) {
splatKernel = mr.splatKernel =  Clazz.newIntArray (splatSize * splatSize, 0);
}var index = 0;
for (var iy = -pixels; iy <= pixels; iy++) {
for (var ix = -pixels; ix <= pixels; ix++) {
splatKernel[index] = Clazz.doubleToInt (255.0 * Math.exp (-((ix * ix) / pixels2 + (iy * iy) / pixels2)));
index++;
}
}
var emax = this.volumeMax * this.getSigma ();
var emin = this.volumeMin * this.getSigma ();
var color = this.volumeColor;
var minTransp = 3;
var data = this.getDataArray ();
for (var k = 0; k < this.ngrid[2]; k++) {
var z = this.origin.z + k * this.spacing.z;
for (var j = 0; j < this.ngrid[1]; j++) {
var y = this.origin.y + j * this.spacing.y;
for (var i = 0; i < this.ngrid[0]; i++) {
var x = this.origin.x + i * this.spacing.x;
var v = data[gp];
var op = Clazz.doubleToInt (255 * (emax - v) / (emax - emin));
if (op < 256 && op >= minTransp) {
renderer.applyTransform (x, y, z, s);
var xs = Clazz.doubleToInt (s[0]);
var ys = Clazz.doubleToInt (s[1]);
if (xs > -pixels && xs < renderer.pixelWidth + pixels && ys > -pixels && ys < renderer.pixelHeight + pixels) {
var zs = Clazz.doubleToInt (s[2] * (1048576));
if (zs < renderer.frontClip && zs > renderer.backClip) {
for (var iy = -pixels; iy <= pixels; iy++) {
var yp = ys + iy;
if (yp >= 0 && yp < renderer.pixelHeight) {
index = (iy + pixels) * splatSize;
for (var ix = -pixels; ix <= pixels; ix++) {
var xp = xs + ix;
if (xp >= 0 && xp < renderer.pixelWidth) {
var intensity = (op * splatKernel[index]) >> 8;
if (intensity > 0) {
if (intensity > 255) {
intensity = 255;
}renderer.blendPixel2 (xp, yp, zs, color, intensity);
}}index++;
}
}}
}}}gp++;
}
}
}
}, "astex.render.MoleculeRenderer,astex.render.Renderer");
Clazz.overrideMethod (c$, "mapModelFit", 
function (mols, level, round, writeToFile, mtrx, doRes) {
var numMol = mols.size ();
if (numMol == 0) {
System.err.println ("No models provided can not calculate mapModelFit");
return 0.0;
}var nBAtoms = 0;
var nTAtoms = 0;
var nAAtoms = 0;
var dim = this.getMapBoxDimensions ();
var iCnt = 0;
var oCnt = 0;
var obCnt = 0;
var iBCnt = 0;
var nx = dim[0];
var nxy = nx * dim[1];
var fFormat =  new astex.util.Format ("%.4f");
var mapName = this.getName ();
var outString;
var mol = mols.get (0);
var modelName = mol.getName ();
if (mol.getModelType () != 1) {
modelName = modelName.substring (0, modelName.length - Integer.toString (mol.getModelNumber ()).length);
}for (var m = 0; m < numMol; m++) {
mol = mols.get (m);
var nAtoms = mol.getAtomCount ();
nAAtoms += nAtoms;
var frac =  Clazz.newFloatArray (3, 0);
var nRes = mol.getResidueCount ();
var ic =  Clazz.newIntArray (nRes, 0);
var oc =  Clazz.newIntArray (nRes, 0);
var resNames =  new Array (nRes);
var resLabels =  new Array (nRes);
var resCnt = -1;
var thisLabel = "";
var thisResName = "";
for (var i = 0; i < nAtoms; i++) {
var a = mol.getAtom (i);
if (doRes && ((thisLabel.equals (a.getResidue ().getLabel ()) == false) || (thisResName.equals (a.getResidue ().getName ()) == false))) {
resCnt++;
thisLabel = a.getResidue ().getLabel ();
thisResName = a.getResidue ().getName ();
resLabels[resCnt] = thisLabel;
resNames[resCnt] = thisLabel + a.getResidue ().getName ();
}var isBackbone = a.isBackbone ();
if (isBackbone) nBAtoms++;
if (a.isTrace ()) nTAtoms++;
var g =  Clazz.newIntArray (3, 0);
var p = astex.util.Point3d.new3 (a.x, a.y, a.z);
p.transform (mtrx);
this.lowerRelativeGrid (p, g, frac);
var insideBox = true;
for (var j = 0; j < 3; j++) {
if (g[j] < 0 || g[j] >= dim[j]) insideBox = false;
if (g[j] == (dim[j] - 1) && frac[j] > .0) insideBox = false;
}
if (insideBox == false) {
obCnt++;
if (doRes) oc[resCnt]++;
continue;
}var doIfrac = (frac[0] > .0) ? true : false;
var doJfrac = (frac[1] > .0) ? true : false;
var doKfrac = (frac[2] > .0) ? true : false;
var value = this.value (g[0], g[1], g[2], doIfrac, doJfrac, doKfrac, frac[0], frac[1], frac[2], nx, nxy);
if (value < level) {
oCnt++;
if (doRes) oc[resCnt]++;
} else {
if (isBackbone) iBCnt++;
iCnt++;
if (doRes) ic[resCnt]++;
}}
if (writeToFile && doRes) {
var modelNum = Integer.toString (mol.getModelNumber ());
var fName = astex.io.FILE.trimExt (this.getFile ()) + mapName + "_" + modelName + ".resInclude";
if (m == 0) astex.io.FILE.deletefile (fName);
outString = "";
for (var i = 0; i < nRes; i++) {
var aiFrac = ic[i] / (ic[i] + oc[i]);
var colour = this.calcColour (aiFrac);
outString += resNames[i] + ", " + fFormat.format (aiFrac) + ", " + colour + " \n";
}
this.writeFit (outString, fName);
outString = "";
fName += "Label";
if (m == 0) astex.io.FILE.deletefile (fName);
var pos = resLabels[0].indexOf (":");
var curCh = resLabels[0].substring (0, pos);
var i = 0;
var j = 0;
if (numMol > 1) {
outString = "[M" + modelNum + ']';
}outString += resLabels[0];
while (i < nRes) {
pos = resLabels[i].indexOf (":");
var thisCh = resLabels[i].substring (0, pos);
if (!thisCh.equals (curCh) || j > 199) {
if (j != 0) {
outString += "-" + resLabels[i - 1] + "\n";
}j = 0;
curCh = thisCh;
if (numMol > 1) {
outString += "[M" + modelNum + ']';
}outString += resLabels[i];
}i++;
j++;
}
if (j == 1) {
outString += "\n";
} else {
outString += "-" + resLabels[i - 1] + "\n";
}this.writeFit (outString, fName);
}}
if (writeToFile) {
if (round == 0) {
var fName = astex.io.FILE.trimExt (this.getFile ()) + mapName + "_" + modelName + ".istrace";
if (nTAtoms == nAAtoms) {
outString = "AllTrace true\n";
} else {
outString = "AllTrace false\n";
}if (nBAtoms == nAAtoms) {
outString += "AllBackbone true";
} else {
outString += "AllBackbone false";
}this.writeFit (outString, fName);
}outString = mapName + " " + modelName + " " + level + " " + nAAtoms + " " + iCnt + " " + oCnt + " " + obCnt + " " + fFormat.format (iCnt / nAAtoms) + " " + fFormat.format (oCnt / nAAtoms) + " " + fFormat.format (obCnt / nAAtoms) + " " + numMol + "\n";
var fName = astex.io.FILE.trimExt (this.getFile ()) + mapName + "_" + modelName + ".fit";
this.writeFit (outString, fName);
outString = astex.map.VolumeMapImp.genBinLabel (level, this.getMinMax ()[3]) + ", " + fFormat.format (iCnt / nAAtoms) + ", " + fFormat.format (iBCnt / nBAtoms) + "\n";
fName = astex.io.FILE.trimExt (this.getFile ()) + mapName + "_" + modelName + ".bfit";
this.writeFit (outString, fName);
}return (iCnt / nAAtoms);
}, "JU.Lst,~N,~N,~B,astex.util.Matrix,~B");
Clazz.defineMethod (c$, "calcColour", 
 function (v) {
var r;
var g;
if (v < 0.5) {
r = 255.0;
g = 510 * v;
} else {
r = (1 - v) * 510;
g = 255;
}var ic = Clazz.doubleToInt (r) * 256 * 256 + Clazz.doubleToInt (g) * 256;
var format =  new astex.util.Format ("#%06X");
var hexColour = format.format (0xFFFFFF & ic);
return hexColour;
}, "~N");
Clazz.overrideMethod (c$, "addMaskSelected", 
function (mask, tolerance, nAtoms, atoms) {
var ix = 0;
var iy = 0;
var iz = 0;
var mx = 0;
var mxy = 0;
var mapType = this.getMapType ();
if (mapType == 1 || mapType == 5 || mapType == 6 || mapType == 7) {
ix = this.minimumGrid[this.axis[0]] + this.nu[this.axis[0]];
iy = this.minimumGrid[this.axis[1]] + this.nu[this.axis[1]];
iz = this.minimumGrid[this.axis[2]] + this.nu[this.axis[2]];
mx = this.grid[this.axis[0]];
mxy = mx * this.grid[this.axis[1]];
} else {
mx = this.ngrid[0];
mxy = mx * this.ngrid[1];
}var tol2 = tolerance * tolerance;
var g =  Clazz.newIntArray (3, 0);
var maxPointsAway = 1 + Clazz.doubleToInt (tolerance * this.cell[0] / this.nv[0]);
var pSum =  new astex.util.Point3d ();
for (var a = 0; a < nAtoms; a++) {
var at = atoms.get (a);
var p = astex.util.Point3d.new3 (at.x, at.y, at.z);
pSum.add (p);
this.nearestRelativeGrid (p, g);
var minX = Math.max (g[0] - maxPointsAway, this.minimumGrid[this.axis[0]]);
var maxX = Math.min (g[0] + maxPointsAway, this.maximumGrid[this.axis[0]]);
var minY = Math.max (g[1] - maxPointsAway, this.minimumGrid[this.axis[1]]);
var maxY = Math.min (g[1] + maxPointsAway, this.maximumGrid[this.axis[1]]);
var minZ = Math.max (g[2] - maxPointsAway, this.minimumGrid[this.axis[2]]);
var maxZ = Math.min (g[2] + maxPointsAway, this.maximumGrid[this.axis[2]]);
for (var i = minX; i < maxX; i++) {
for (var j = minY; j < maxY; j++) {
for (var k = minZ; k < maxZ; k++) {
var cart =  new astex.util.Point3d ();
this.absoluteGridToCartesian (i + ix, j + iy, k + iz, cart);
if (p.distanceSq (cart) < tol2) {
var pos = k * mxy + j * mx + i;
mask.setBit (pos);
}}
}
}
}
pSum.divide (nAtoms);
this.nearestRelativeGrid (pSum, g);
mask.setLabelPosition (g);
System.out.println (mask.getMask ().cardinality () + " points set in mask");
}, "astex.api.AstexMask,~N,~N,astex.util.DynamicArray");
Clazz.overrideMethod (c$, "createMask", 
function (color, label, tolerance) {
var np = this.getDataSize ();
var mask = astex.render.MoleculeRenderer.newMapMask (np);
mask.setColor (color);
mask.setLabel (label);
mask.setGrid (this.grid);
this.addMask (mask);
return mask;
}, "~N,~S,~N");
Clazz.defineStatics (c$,
"CONTOUR_SIZE", 24,
"useSymmetry", false,
"maxSymmetry", 0);
c$.gf2 = c$.prototype.gf2 =  new astex.util.Format ("%7.2f");
c$.gf3 = c$.prototype.gf3 =  new astex.util.Format ("%7.3f");
c$.gf4 = c$.prototype.gf4 =  new astex.util.Format ("%7.4f");
c$.gf5 = c$.prototype.gf5 =  new astex.util.Format ("%8.5f");
c$.gf6 = c$.prototype.gf6 =  new astex.util.Format ("%9.6f");
c$.gf7 = c$.prototype.gf7 =  new astex.util.Format ("%10.7f");
c$.gf9 = c$.prototype.gf9 =  new astex.util.Format ("%12.9f");
Clazz.defineStatics (c$,
"clipDistance", 1.5);
});
