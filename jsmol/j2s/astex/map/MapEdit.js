Clazz.declarePackage ("astex.map");
Clazz.load (["astex.api.AstexMapEdit", "astex.util.DynamicArray"], "astex.map.MapEdit", ["astex.map.VolumeMapImp", "java.lang.Double", "$.Float"], function () {
c$ = Clazz.decorateAsClass (function () {
this.subMaps = null;
Clazz.instantialize (this, arguments);
}, astex.map, "MapEdit", null, astex.api.AstexMapEdit);
Clazz.prepareFields (c$, function () {
this.subMaps =  new astex.util.DynamicArray ();
});
Clazz.makeConstructor (c$, 
function () {
});
Clazz.overrideMethod (c$, "run", 
function (inName, outName, b, subName) {
astex.map.MapEdit.inFile = inName;
astex.map.MapEdit.outFile = outName;
if (subName != null) {
astex.map.MapEdit.doConv = false;
var subNames = subName.$plit (",");
for (var i = 0; i < subNames.length; i++) {
astex.map.MapEdit.subFiles[astex.map.MapEdit.nSubFiles++] = subNames[i++];
}
}this.openFiles ();
if (astex.map.MapEdit.doConv) {
this.write ();
} else if (astex.map.MapEdit.doBit) {
this.writeBit ();
} else {
if (this.subtract ()) this.write ();
}}, "~S,~S,~B,~S");
c$.printUsage = Clazz.defineMethod (c$, "printUsage", 
function () {
System.out.println ("MapEdit is a command line tool for some simple map manipulations.");
System.out.println ("Modes:");
System.out.println ("a. subtract small maps, e.g. segments, from a larger reference map.");
System.out.println ("   In the reference map, the data points that have the same value as");
System.out.println ("   in the sub map is set to the minimum value");
System.out.println ("b. convert a map to a compressed bit representation, given a specified level");
System.out.println ("   The map can be downsampled at the same time.  Linear interpolation for");
System.out.println ("   for data points that is not on a grid point in the original map.");
System.out.println ("   Specify the downsampled map size either as one or three values:");
System.out.println ("   -s 150 or -s 160,160,80");
System.out.println ("   the new map can optionally be centered as part of the down sampling (-c)");
System.out.println ("   -m 0|1|2 can be used to specify output mode if the out file is in");
System.out.println ("   CCP4 format");
System.out.println ("   -r rescale the values in the map to a range of 256 without moving 0.");
System.out.println ("c. some manipulations not in Tom's mapFix program.  Set space group with:");
System.out.println ("   -spg number");
System.out.println ("   Changing the space group is only useful when the original and new");
System.out.println ("   has the same angles");
System.out.println ("   -a addValue | -x multiplyValue");
System.out.println ("   Add/multiply to supplied value to each density point.  Some tools do not work");
System.out.println ("   well with maps that have the background scattering at other levels than 0");
System.out.println ("d. downsampling, either specify number of voxels as 1 or 3 numbers, or give a");
System.out.println ("   target grid size.  -s 160 -s 120,140,160 -sv 6.0");
System.out.println ("Usage:");
System.out.println ("  MapEdit -i 'in.map' -o 'out.map' -d 'sub1.map' -d 'sub2.map' ... ");
System.out.println ("Up to 1000 sub files can be handled\n");
System.out.println ("  MapEdit -i 'in.map' -o 'out.bit' -b level [-c] [-s size[,size,size]]");
});
Clazz.defineMethod (c$, "openFiles", 
 function () {
astex.map.MapEdit.inMap =  new astex.map.VolumeMapImp ();
astex.map.MapEdit.inMap.setFile (astex.map.MapEdit.inFile);
astex.map.MapEdit.inMap.setName (astex.map.MapEdit.inFile);
if (this.readMap (astex.map.MapEdit.inMap)) {
for (var i = 0; i < astex.map.MapEdit.nSubFiles; i++) {
var sub =  new astex.map.VolumeMapImp ();
sub.setFile (astex.map.MapEdit.subFiles[i]);
sub.setName (astex.map.MapEdit.subFiles[i]);
this.readMap (sub);
this.subMaps.add (sub);
}
return true;
}return false;
});
Clazz.defineMethod (c$, "readMap", 
 function (map) {
if (map.read ()) {
map.setMinMaxAll ();
for (var i = 0; i < 3; i++) map.setCenterGrid (i, Clazz.doubleToInt (map.grid[i] / 2));

if (!map.readRegionIOData ()) return false;
if (astex.map.MapEdit.doDown) map.downSample (astex.map.MapEdit.downSizes, astex.map.MapEdit.doCenter, astex.map.MapEdit.downVoxel);
if (astex.map.MapEdit.reScale) map.reScale ();
return true;
}return false;
}, "astex.map.VolumeMapImp");
Clazz.defineMethod (c$, "subtract", 
 function () {
switch (astex.map.MapEdit.inMap.getDataMode ()) {
case 0:
var inMask = astex.map.MapEdit.inMap.getDataMask ();
for (var i = 0; i < astex.map.MapEdit.nSubFiles; i++) {
var m = this.subMaps.get (i);
if (m.getDataMode () != 0) {
System.out.println ("Mixed map data modes not implemented for subtract.");
System.out.println ("Exiting!!!");
return false;
}var mMask = m.getDataMask ();
inMask.andNot (mMask);
}
astex.map.MapEdit.inMap.setDataMask (inMask);
break;
case 1:
System.out.println ("Not implemented subtract for byte masks yet");
return false;
case 2:
var yz = astex.map.MapEdit.inMap.grid[0] * astex.map.MapEdit.inMap.grid[1];
var z = astex.map.MapEdit.inMap.grid[0];
var inData = astex.map.MapEdit.inMap.getDataArray ();
var minMax = astex.map.MapEdit.inMap.getMinMax ();
var minValue = minMax[0];
var count = 0;
for (var i = 0; i < astex.map.MapEdit.nSubFiles; i++) {
var m = this.subMaps.get (i);
if (m.getDataMode () != 2) {
System.out.println ("Mixed map data modes not implemented for subtract.");
System.out.println ("Exiting!!!");
return false;
}var subData = m.getDataArray ();
var min0 = m.nu[2] - astex.map.MapEdit.inMap.nu[2];
var max0 = min0 + m.grid[2];
var min1 = m.nu[1] - astex.map.MapEdit.inMap.nu[1];
var max1 = min1 + m.grid[1];
var min2 = m.nu[0] - astex.map.MapEdit.inMap.nu[0];
var max2 = min2 + m.grid[0];
var myz = m.grid[0] * m.grid[1];
var mz = m.grid[0];
for (var j = min0, j1 = 0; j < max0; j++, j1++) {
for (var k = min1, k1 = 0; k < max1; k++, k1++) {
for (var l = min2, l1 = 0; l < max2; l++, l1++) {
var pos = j * yz + k * z + l;
var pos1 = j1 * myz + k1 * mz + l1;
if (Math.abs (subData[pos1] - inData[pos]) < 1.0E-8) {
inData[pos] = minValue;
count++;
}}
}
}
System.out.println ("Changed pixels: " + count);
}
astex.map.MapEdit.inMap.setDataArray (inData);
astex.map.MapEdit.inMap.recalcStats (astex.map.MapEdit.inMap.getMinMax ());
}
return true;
});
Clazz.defineMethod (c$, "write", 
 function () {
astex.map.MapEdit.inMap.write (astex.map.MapEdit.outFile, astex.map.MapEdit.outMode, astex.map.MapEdit.doAdd, astex.map.MapEdit.add, astex.map.MapEdit.doMult, astex.map.MapEdit.mult);
});
Clazz.defineMethod (c$, "writeBit", 
 function () {
var level = Double.parseDouble (astex.map.MapEdit.levelStr);
astex.map.MapEdit.inMap.createMaskLevel (0xff, astex.map.MapEdit.levelStr, level);
var m = astex.map.MapEdit.inMap.getMaskByName (astex.map.MapEdit.levelStr, true);
m.setLabelPosition (1, 1, 1);
m.setOrigin (astex.map.MapEdit.inMap.nu);
m.setCell (astex.map.MapEdit.inMap.cell);
try {
m.write (astex.map.MapEdit.outFile);
} catch (e$$) {
if (Clazz.exceptionOf (e$$, java.io.FileNotFoundException)) {
var e = e$$;
{
System.out.println ("File not found exception, may mean that you " + "do not have write priviledge in the specified directory or " + "that you try to overwrite an existing file: " + astex.map.MapEdit.outFile);
System.out.println ("Error message: " + e.getMessage ());
}
} else if (Clazz.exceptionOf (e$$, java.io.IOException)) {
var e = e$$;
{
System.out.println ("An IO Exception happen while writing to file: " + astex.map.MapEdit.outFile);
System.out.println ("Error message: " + e.getMessage ());
}
} else {
throw e$$;
}
}
});
Clazz.defineStatics (c$,
"inFile", null,
"outFile", null,
"nSubFiles", 0,
"MaxSubFiles", 1000);
c$.subFiles = c$.prototype.subFiles =  new Array (1000);
Clazz.defineStatics (c$,
"inMap", null,
"doConv", true,
"doBit", false,
"doCenter", false,
"levelStr", null,
"doDown", false,
"downSizes",  Clazz.newIntArray (3, 0),
"reScale", false,
"spaceGroup", 0,
"outMode", 2,
"doAdd", false,
"add", 0.0,
"doMult", false,
"mult", 1.0,
"downVoxel", 0.0,
"apiPlatform", null);
});
