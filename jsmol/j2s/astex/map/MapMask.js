Clazz.declarePackage ("astex.map");
Clazz.load (["astex.api.AstexMask", "astex.util.Color32", "$.Format", "java.util.Hashtable"], "astex.map.MapMask", ["astex.io.FILE", "$.IO", "astex.map.MapEdit", "astex.render.MoleculeRenderer", "astex.util.Matrix", "astex.viewer.Viewer", "java.lang.Boolean", "$.Double", "$.Throwable", "JU.BS", "$.SB"], function () {
c$ = Clazz.decorateAsClass (function () {
this.color = 0;
this.map = null;
this.version = null;
this.label = null;
this.timeStamp = null;
this.labelPos = null;
this.grid = null;
this.gridSize = 0;
this.origin = null;
this.cell = null;
this.fileName = null;
this.mask = null;
this.cntFormat = null;
this.rotFormat = null;
this.transFormat = null;
Clazz.instantialize (this, arguments);
}, astex.map, "MapMask", null, astex.api.AstexMask);
Clazz.prepareFields (c$, function () {
this.color = astex.util.Color32.red;
this.version =  String.instantialize ();
this.label =  String.instantialize ();
this.timeStamp =  String.instantialize ();
this.labelPos =  Clazz.newIntArray (3, 0);
this.grid =  Clazz.newIntArray (3, 0);
this.origin =  Clazz.newIntArray (3, 0);
this.cell =  Clazz.newDoubleArray (6, 0);
this.cntFormat =  new astex.util.Format ("%3d");
this.rotFormat =  new astex.util.Format ("%9.6f");
this.transFormat =  new astex.util.Format ("%14.5f");
});
Clazz.makeConstructor (c$, 
function () {
});
Clazz.overrideMethod (c$, "set", 
function (nSize) {
if (nSize > 0) {
this.mask = JU.BS.newN (nSize + 1);
this.setVersion ("20110218");
}return this;
}, "~N");
Clazz.defineMethod (c$, "getMask", 
function () {
return this.mask;
});
Clazz.overrideMethod (c$, "setBit", 
function (bit) {
this.mask.set (bit);
}, "~N");
Clazz.defineMethod (c$, "getColor", 
function () {
return this.color;
});
Clazz.defineMethod (c$, "setColor", 
function (c) {
this.color = c;
}, "~N");
Clazz.overrideMethod (c$, "getLabel", 
function () {
return this.label;
});
Clazz.defineMethod (c$, "setLabel", 
function (l) {
this.label = l;
}, "~S");
Clazz.defineMethod (c$, "getTimestamp", 
function () {
return this.timeStamp;
});
Clazz.defineMethod (c$, "setTimestamp", 
function (ts) {
this.timeStamp = ts;
}, "~S");
Clazz.defineMethod (c$, "getLabelPosition", 
function () {
return this.labelPos;
});
Clazz.defineMethod (c$, "setLabelPosition", 
function (x, y, z) {
this.labelPos[0] = x;
this.labelPos[1] = y;
this.labelPos[2] = z;
}, "~N,~N,~N");
Clazz.defineMethod (c$, "setLabelPosition", 
function (p) {
for (var i = 0; i < 3; i++) this.labelPos[i] = p[i];

}, "~A");
Clazz.defineMethod (c$, "getGrid", 
function () {
return this.grid;
});
Clazz.defineMethod (c$, "setGrid", 
function (x, y, z) {
this.grid[0] = x;
this.grid[1] = y;
this.grid[2] = z;
this.gridSize = x * y * z;
}, "~N,~N,~N");
Clazz.defineMethod (c$, "setGrid", 
function (g) {
for (var i = 0; i < 3; i++) this.grid[i] = g[i];

this.gridSize = this.grid[0] * this.grid[1] * this.grid[2];
}, "~A");
Clazz.defineMethod (c$, "getOrigin", 
function () {
return this.origin;
});
Clazz.defineMethod (c$, "setOrigin", 
function (x, y, z) {
this.origin[0] = x;
this.origin[1] = y;
this.origin[2] = z;
}, "~N,~N,~N");
Clazz.defineMethod (c$, "setOrigin", 
function (o) {
for (var i = 0; i < 3; i++) this.origin[i] = o[i];

}, "~A");
Clazz.defineMethod (c$, "getCell", 
function () {
return this.cell;
});
Clazz.defineMethod (c$, "setCell", 
function (a, b, c, alpha, beta, gamma) {
this.cell[0] = a;
this.cell[1] = b;
this.cell[2] = c;
this.cell[3] = alpha;
this.cell[4] = beta;
this.cell[5] = gamma;
}, "~N,~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "setCell", 
function (c) {
for (var i = 0; i < 6; i++) this.cell[i] = c[i];

}, "~A");
Clazz.defineMethod (c$, "getMap", 
function () {
return this.map;
});
Clazz.overrideMethod (c$, "setMap", 
function (m) {
this.map = m;
}, "astex.map.VolumeMap");
Clazz.overrideMethod (c$, "setMask", 
function (bs) {
this.mask = bs;
}, "JU.BS");
Clazz.defineMethod (c$, "getVersion", 
function () {
return this.version;
});
Clazz.overrideMethod (c$, "setVersion", 
function (v) {
this.version = v;
}, "~S");
Clazz.overrideMethod (c$, "setFileName", 
function (s) {
this.fileName = s;
}, "~S");
Clazz.overrideMethod (c$, "read", 
function (m) {
if (m == null) return 1;
try {
var file = astex.io.FILE.open (this.fileName);
if (file == null) {
System.out.println ("Failed to open file: " + this.fileName);
return 2;
}this.setMap (m);
this.readHeader (file);
this.readData (file);
return 0;
} catch (e$$) {
if (Clazz.exceptionOf (e$$, java.io.FileNotFoundException)) {
var e = e$$;
{
System.out.println ("Failed to open file: " + this.fileName);
System.out.println ("Error message: " + e.getMessage ());
}
} else if (Clazz.exceptionOf (e$$, java.io.IOException)) {
var e = e$$;
{
System.out.println ("An IO Exception happen while reading from file: " + this.fileName);
System.out.println ("Error message: " + e.getMessage ());
}
} else {
throw e$$;
}
}
return 3;
}, "astex.map.VolumeMap");
Clazz.defineMethod (c$, "readHeader", 
function ($in) {
var notData = true;
var line = "";
while (notData) {
line = $in.readLine ();
var tokens = line.$plit ("\\s+", 2);
if (tokens[0].equals ("DATA")) {
notData = false;
} else if (tokens[0].equals ("COLOR")) {
this.setColor (Integer.parseInt (tokens[1].trim ()));
} else if (tokens[0].equals ("SIZE")) {
Integer.parseInt (tokens[1]);
} else if (tokens[0].equals ("LABEL")) {
this.setLabel (tokens[1]);
} else if (tokens[0].equals ("LABELPOSITION")) {
var threeInts = tokens[1].$plit ("\\s+", 3);
var ints =  Clazz.newIntArray (3, 0);
for (var i = 0; i < 3; i++) ints[i] = Integer.parseInt (threeInts[i].trim ());

this.setLabelPosition (ints);
} else if (tokens[0].equals ("GRID")) {
var threeInts = tokens[1].$plit ("\\s+", 3);
var ints =  Clazz.newIntArray (3, 0);
for (var i = 0; i < 3; i++) ints[i] = Integer.parseInt (threeInts[i].trim ());

this.setGrid (ints);
this.mask = JU.BS.newN (this.gridSize);
} else if (tokens[0].equals ("ORIGIN")) {
var threeInts = tokens[1].$plit ("\\s+", 3);
var ints =  Clazz.newIntArray (3, 0);
for (var i = 0; i < 3; i++) ints[i] = Integer.parseInt (threeInts[i].trim ());

this.setOrigin (ints);
} else if (tokens[0].equals ("CELL")) {
var sixDoubles = tokens[1].$plit ("\\s+", 6);
var doubles =  Clazz.newDoubleArray (6, 0);
for (var i = 0; i < 6; i++) doubles[i] = Double.parseDouble (sixDoubles[i].trim ());

this.setCell (doubles);
} else if (tokens[0].equals ("TRANSFORM")) {
var m =  new astex.util.Matrix ();
m.x00 = Double.parseDouble (line.substring (24, 32));
m.x01 = Double.parseDouble (line.substring (34, 42));
m.x02 = Double.parseDouble (line.substring (44, 52));
m.x03 = Double.parseDouble (line.substring (54, 67));
line = $in.readLine ();
m.x10 = Double.parseDouble (line.substring (24, 32));
m.x11 = Double.parseDouble (line.substring (34, 42));
m.x12 = Double.parseDouble (line.substring (44, 52));
m.x13 = Double.parseDouble (line.substring (54, 67));
line = $in.readLine ();
m.x20 = Double.parseDouble (line.substring (24, 32));
m.x21 = Double.parseDouble (line.substring (34, 42));
m.x22 = Double.parseDouble (line.substring (44, 52));
m.x23 = Double.parseDouble (line.substring (54, 67));
this.map.addTransform (m);
} else if (tokens[0].equals ("VERSION")) {
this.checkVersion (tokens[1]);
}}
}, "astex.io.FILE");
c$.printStack = Clazz.defineMethod (c$, "printStack", 
function () {
var t =  new Throwable ();
var frames = t.getStackTrace ();
for (var i = 0; i < frames.length; i++) {
System.out.println (frames[i]);
}
});
Clazz.defineMethod (c$, "checkVersion", 
 function (v) {
this.buildVersionDictionary ();
if (astex.map.MapMask.versions.containsKey (v)) this.setVersion (v);
if (this.getVersion ().length == 0) {
System.out.println ("The version: " + v + "does not match any known version!");
}}, "~S");
Clazz.defineMethod (c$, "buildVersionDictionary", 
 function () {
astex.map.MapMask.versions.put ("20100304", Boolean.TRUE);
astex.map.MapMask.versions.put ("20110218", Boolean.TRUE);
});
Clazz.defineMethod (c$, "readData", 
function ($in) {
var line = "";
var from;
var to = 0;
if (this.mask == null) this.mask = JU.BS.newN (1000);
while ((line = $in.readLine ()) != null) {
var tokens = line.$plit ("\\s+", 2);
from = Integer.parseInt (tokens[0]);
to = Integer.parseInt (tokens[1]) + 1;
this.mask.setBits (from, to);
}
System.out.println ("Read " + this.mask.cardinality () + " mask points from " + this.fileName);
}, "astex.io.FILE");
Clazz.overrideMethod (c$, "write", 
function (outFile) {
if (outFile == null) return;
var out =  new java.io.DataOutputStream ( new java.io.BufferedOutputStream ( new java.io.FileOutputStream (outFile)));
if (this.mask.length () > this.gridSize) this.mask.clearBits (this.gridSize, this.mask.length ());
this.writeHeader (out);
this.writeData (out);
out.close ();
System.out.println ("Wrote " + this.mask.cardinality () + " mask points to " + outFile);
}, "~S");
Clazz.defineMethod (c$, "writeHeader", 
 function (out) {
var sb =  new JU.SB ();
sb.append ("MAP");
sb.append (" ");
sb.append (this.getMap ().getFile ());
sb.append ("\n");
astex.io.IO.writeCharArray (out, sb.toString ());
sb.setLength (0);
sb.append ("VERSION");
sb.append (" ");
sb.append (this.getVersion ());
sb.append ("\n");
astex.io.IO.writeCharArray (out, sb.toString ());
sb.setLength (0);
sb.append ("LABEL");
sb.append (" ");
sb.append (this.getLabel ());
sb.append ("\n");
astex.io.IO.writeCharArray (out, sb.toString ());
sb.setLength (0);
sb.append ("LABELPOSITION");
sb.append (" ");
sb.appendI (this.labelPos[0]);
sb.append (" ");
sb.appendI (this.labelPos[1]);
sb.append (" ");
sb.appendI (this.labelPos[2]);
sb.append ("\n");
astex.io.IO.writeCharArray (out, sb.toString ());
sb.setLength (0);
sb.append ("COLOR");
sb.append (" ");
sb.appendI (this.getColor ());
sb.append ("\n");
astex.io.IO.writeCharArray (out, sb.toString ());
sb.setLength (0);
sb.append ("GRID");
sb.append (" ");
sb.appendI (this.grid[0]);
sb.append (" ");
sb.appendI (this.grid[1]);
sb.append (" ");
sb.appendI (this.grid[2]);
sb.append ("\n");
astex.io.IO.writeCharArray (out, sb.toString ());
sb.setLength (0);
var s = "";
if (astex.viewer.Viewer.apiPlatform != null) {
s = astex.viewer.Viewer.apiPlatform.getDateFormat ("8601");
} else if (astex.map.MapEdit.apiPlatform != null) {
s = astex.map.MapEdit.apiPlatform.getDateFormat ("8601");
}sb.append ("TIMESTAMP");
sb.append (" Written on ");
sb.append (s);
sb.append (" for ");
sb.append (System.getProperty ("user.name"));
sb.append ("\n");
astex.io.IO.writeCharArray (out, sb.toString ());
sb.setLength (0);
sb.append ("SIZE");
sb.append (" ");
sb.appendI (this.mask.cardinality ());
sb.append ("\n");
astex.io.IO.writeCharArray (out, sb.toString ());
sb.setLength (0);
if (this.cell[0] > .0) {
sb.append ("ORIGIN");
sb.append (" ");
sb.appendI (this.origin[0]);
sb.append (" ");
sb.appendI (this.origin[1]);
sb.append (" ");
sb.appendI (this.origin[2]);
sb.append ("\n");
astex.io.IO.writeCharArray (out, sb.toString ());
sb.setLength (0);
sb.append ("CELL");
for (var i = 0; i < 6; i++) {
sb.append (" ");
sb.appendD (this.cell[i]);
}
sb.append ("\n");
astex.io.IO.writeCharArray (out, sb.toString ());
sb.setLength (0);
}if (this.map.getSymmetryOperatorsCount () > 1) {
for (var i = 0; i < this.map.getSymmetryOperatorsCount (); i++) {
var m = this.map.getSymmetryOperator (i);
sb.append ("TRANSFORM");
sb.append ("         1 ");
sb.append (this.cntFormat.format (i));
sb.append (" ");
sb.append (this.rotFormat.format (m.x00));
sb.append (" ");
sb.append (this.rotFormat.format (m.x10));
sb.append (" ");
sb.append (this.rotFormat.format (m.x20));
sb.append (" ");
sb.append (this.transFormat.format (m.x30));
sb.append ("\n");
astex.io.IO.writeCharArray (out, sb.toString ());
sb.setLength (0);
sb.append ("TRANSFORM");
sb.append ("         2 ");
sb.append (this.cntFormat.format (i));
sb.append (" ");
sb.append (this.rotFormat.format (m.x01));
sb.append (" ");
sb.append (this.rotFormat.format (m.x11));
sb.append (" ");
sb.append (this.rotFormat.format (m.x21));
sb.append (" ");
sb.append (this.transFormat.format (m.x31));
sb.append ("\n");
astex.io.IO.writeCharArray (out, sb.toString ());
sb.setLength (0);
sb.append ("TRANSFORM");
sb.append ("         3 ");
sb.append (this.cntFormat.format (i));
sb.append (" ");
sb.append (this.rotFormat.format (m.x02));
sb.append (" ");
sb.append (this.rotFormat.format (m.x12));
sb.append (" ");
sb.append (this.rotFormat.format (m.x22));
sb.append (" ");
sb.append (this.transFormat.format (m.x32));
sb.append ("\n");
astex.io.IO.writeCharArray (out, sb.toString ());
sb.setLength (0);
}
}sb.append ("DATA");
sb.append ("\n");
astex.io.IO.writeCharArray (out, sb.toString ());
}, "java.io.DataOutputStream");
Clazz.defineMethod (c$, "writeData", 
 function (out) {
var i = 0;
var j = 0;
while (i < this.mask.length () && i >= 0) {
i = this.mask.nextSetBit (j);
if (i >= 0 && i < this.gridSize) {
j = this.mask.nextClearBit (i);
var sb =  new JU.SB ();
sb.appendI (i);
sb.append (" ");
sb.appendI (j - 1);
sb.append ("\n");
astex.io.IO.writeCharArray (out, sb.toString ());
}}
}, "java.io.DataOutputStream");
Clazz.overrideMethod (c$, "expand", 
function () {
var copy = this.mask.clone ();
var mx = this.grid[0];
var mxy = mx * this.grid[1];
for (var b = copy.nextSetBit (0); b >= 0; b = copy.nextSetBit (b + 1)) {
var z = Clazz.doubleToInt (b / mxy);
var y = Clazz.doubleToInt ((b - z * mxy) / mx);
var x = b - z * mxy - y * mx;
var minX = Math.max (x - 1, 0);
var maxX = Math.min (x + 1, this.grid[0]);
var minY = Math.max (y - 1, 0);
var maxY = Math.min (y + 1, this.grid[1]);
var minZ = Math.max (z - 1, 0);
var maxZ = Math.min (z + 1, this.grid[2]);
for (var i = minX; i <= maxX; i++) {
for (var j = minY; j <= maxY; j++) {
for (var k = minZ; k <= maxZ; k++) {
this.mask.set (k * mxy + j * mx + i);
}
}
}
}
System.out.println ("Expanded to " + this.mask.cardinality () + " points in mask");
});
Clazz.overrideMethod (c$, "contract", 
function () {
var copy = this.mask.clone ();
var mx = this.grid[0];
var mxy = mx * this.grid[1];
for (var b = copy.nextSetBit (0); b >= 0; b = copy.nextSetBit (b + 1)) {
var z = Clazz.doubleToInt (b / mxy);
var y = Clazz.doubleToInt ((b - z * mxy) / mx);
var x = b - z * mxy - y * mx;
var minX = Math.max (x - 1, 0);
var maxX = Math.min (x + 1, this.grid[0]);
var minY = Math.max (y - 1, 0);
var maxY = Math.min (y + 1, this.grid[1]);
var minZ = Math.max (z - 1, 0);
var maxZ = Math.min (z + 1, this.grid[2]);
var removeBit = false;
here : for (var i = minX; i <= maxX; i++) {
for (var j = minY; j <= maxY; j++) {
for (var k = minZ; k <= maxZ; k++) {
if (copy.get (k * mxy + j * mx + i) == false) {
removeBit = true;
break here;
}}
}
}
if (removeBit) this.mask.clear (b);
}
System.out.println ("Contracted to " + this.mask.cardinality () + " points in mask");
});
Clazz.defineMethod (c$, "calcLabelLocation", 
function () {
var p =  Clazz.newIntArray (3, 0);
var y = 0;
var z = 0;
var mx = this.grid[0];
var mxy = mx * this.grid[1];
for (var b = this.mask.nextSetBit (0); b >= 0; b = this.mask.nextSetBit (b + 1)) {
z = Clazz.doubleToInt (b / mxy);
p[2] += z;
y = Clazz.doubleToInt ((b - z * mxy) / mx);
p[1] += y;
p[0] += b - z * mxy - y * mx;
}
for (var i = 0; i < 3; i++) p[i] /= this.mask.cardinality ();

this.setLabelPosition (p);
});
Clazz.overrideMethod (c$, "maskLogic", 
function (mapName, mask1, mask2, mask3, op, maps) {
if (maps.size () == 0) return null;
var map = (maps.get (0)).findMap (maps, mapName);
if (map == null) return null;
var m1 = map.getMaskByName (maps, mapName, mask1);
var m2 = map.getMaskByName (maps, mapName, mask2);
var m3 = astex.render.MoleculeRenderer.newMapMask (m1.getMask ().size ());
m3.getMask ().or (m1.getMask ());
m3.setColor (m1.getColor ());
m3.setGrid (m1.getGrid ());
var p1 = m1.getLabelPosition ();
var p2 = m2.getLabelPosition ();
var message = mask3 + " created by ";
switch (op) {
case 1:
message += "adding ";
m3.getMask ().and (m2.getMask ());
for (var i = 0; i < 3; i++) p1[i] = Clazz.doubleToInt ((p1[i] + p2[i]) / 2);

break;
case 2:
message += "oring ";
m3.getMask ().or (m2.getMask ());
for (var i = 0; i < 3; i++) p1[i] = Clazz.doubleToInt ((p1[i] + p2[i]) / 2);

break;
case 3:
message += "xoring ";
m3.getMask ().xor (m2.getMask ());
for (var i = 0; i < 3; i++) p1[i] = Clazz.doubleToInt ((p1[i] + p2[i]) / 2);

break;
case 4:
message += "subing ";
m3.getMask ().andNot (m2.getMask ());
break;
}
m3.setLabelPosition (p1);
m3.setLabel (mask3);
map.addMask (m3);
message += mask1 + " and " + mask2 + " new mask has " + m3.getMask ().cardinality () + " points.";
System.out.println (message);
return m3;
}, "~S,~S,~S,~S,~N,astex.util.DynamicArray");
Clazz.defineStatics (c$,
"Version1", "20100304",
"Version2", "20110218");
c$.versions = c$.prototype.versions =  new java.util.Hashtable ();
Clazz.defineStatics (c$,
"Map", "MAP",
"Version", "VERSION",
"Label", "LABEL",
"LabelPos", "LABELPOSITION",
"Color", "COLOR",
"Data", "DATA",
"Size", "SIZE",
"Grid", "GRID",
"Timestamp", "TIMESTAMP",
"Cell", "CELL",
"Origin", "ORIGIN",
"Transform", "TRANSFORM",
"SplitPattern", "\\s+");
});
