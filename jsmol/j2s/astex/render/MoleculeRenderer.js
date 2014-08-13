Clazz.declarePackage ("astex.render");
Clazz.load (["astex.model.Atom", "astex.util.DynamicArray", "$.Format", "$.Point3d", "java.util.Hashtable", "$.Random", "JU.SB"], "astex.render.MoleculeRenderer", ["astex.api.Interface", "astex.generic.Generic", "astex.io.FILE", "$.MoleculeReader", "astex.map.VolumeMap", "astex.model.Bond", "$.Distance", "$.Molecule", "$.ResidueIterator", "$.SecondaryStructure", "astex.parser.Parser", "$.Yylex", "astex.render.Renderer", "$.RendererEvent", "$.Texture", "$.Tmesh", "astex.util.AtomIterator", "$.BondIterator", "$.Color32", "$.IntArray", "$.Lattice", "$.Log", "$.Matrix", "$.Mmatch", "$.Settings", "$.Util", "astex.viewer.Viewer", "java.awt.Color", "java.lang.Double", "$.Float", "$.OutOfMemoryError", "$.Runtime", "$.RuntimeException", "JU.Lst", "$.Rdr"], function () {
c$ = Clazz.decorateAsClass (function () {
this.molecules = null;
this.dummyGeneric = null;
this.renderer = null;
this.viewer = null;
this.rgen = null;
this.framenum = 0;
this.selectedAtoms = null;
this.bumpAtoms = null;
this.distances = null;
this.torsions = null;
this.hbonds = null;
this.moleculeRendererListeners = null;
this.groups = null;
this.symmetry = null;
this.mapRadius = 7.0;
this.symmetryRadius = 15.0;
this.displayRadius = 6.0;
this.minimumClipDistance = 2.0;
this.displaySymmetry = true;
this.displayBumps = false;
this.bumpInSameMolecule = false;
this.displayDistances = true;
this.displayMaps = true;
this.displaySolvent = true;
this.displayRdcAxes = true;
this.displayAxes = false;
this.pickMode = 1;
this.keepModel1 = false;
this.showOnLoad = true;
this.allowFastDraw = true;
this.fastDraw = false;
this.printSelectCount = true;
this.pdbeOptionPrintCount = true;
this.debug = false;
this.mapBehaviourMode = 2;
this.hersheyFonts = false;
this.pickedAtoms = null;
this.properties = null;
this.defaultStatusLabelFormat = null;
this.displayAsCylinders = false;
this.displayAtomLabel = true;
this.angles = null;
this.selectionStack = null;
this.contourLevelCount = 0;
this.contourLevels = null;
this.contourColors = null;
this.contourStyles = null;
this.contourDisplayed = null;
this.shadows = false;
this.dirty = false;
this.renderPasses = null;
this.sphereAtoms = null;
this.currentMolecule = null;
this.atoms = null;
this.ta01 = null;
this.ta12 = null;
this.ta23 = null;
this.n012 = null;
this.n123 = null;
this.p01 = null;
this.p23 = null;
this.m12 = null;
this.n = null;
this.last = null;
this.arc = null;
this.dla = null;
this.dlb = null;
this.angleFormat = null;
this.distanceFormat = null;
this.dummyAtom = null;
this.doubleBondOffset = 0.35;
this.doubleBondRadiusScale = 0.4;
this.dummyAtom1 = null;
this.dummyAtom2 = null;
this.aromaticBondDotGap = 0.2;
this.bondLineRadius = -1.0;
this.hsvtmp = null;
this.slideNumber = -1;
this.slideShow = null;
this.commandLog = null;
this.parserStack = null;
this.lexerStack = null;
this.parserDepth = -1;
this.lastScriptFile = null;
this.maps = null;
this.splatKernel = null;
this.s = null;
this.objects = null;
this.textures = null;
this.transformer = null;
this.surfaceSymopNames = null;
this.surfaceSymops = null;
Clazz.instantialize (this, arguments);
}, astex.render, "MoleculeRenderer");
Clazz.prepareFields (c$, function () {
this.molecules =  new astex.util.DynamicArray ();
this.rgen =  new java.util.Random ();
this.selectedAtoms =  new astex.util.DynamicArray ();
this.bumpAtoms =  new astex.util.DynamicArray ();
this.distances =  new astex.util.DynamicArray ();
this.torsions =  new astex.util.DynamicArray ();
this.hbonds =  new astex.util.DynamicArray ();
this.moleculeRendererListeners =  new astex.util.DynamicArray ();
this.groups =  new java.util.Hashtable ();
this.pickedAtoms =  new astex.util.DynamicArray ();
this.angles =  new astex.util.DynamicArray ();
this.selectionStack =  new astex.util.DynamicArray ();
this.contourLevels =  Clazz.newDoubleArray (astex.render.MoleculeRenderer.MaximumContourLevels, 0);
this.contourColors =  Clazz.newIntArray (astex.render.MoleculeRenderer.MaximumContourLevels, 0);
this.contourStyles =  Clazz.newIntArray (astex.render.MoleculeRenderer.MaximumContourLevels, 0);
this.contourDisplayed =  Clazz.newBooleanArray (astex.render.MoleculeRenderer.MaximumContourLevels, false);
this.renderPasses =  Clazz.newIntArray (2, 0);
this.sphereAtoms =  new astex.util.DynamicArray ().set (512, 0);
this.atoms =  new Array (4);
this.ta01 =  new astex.util.Point3d ();
this.ta12 =  new astex.util.Point3d ();
this.ta23 =  new astex.util.Point3d ();
this.n012 =  new astex.util.Point3d ();
this.n123 =  new astex.util.Point3d ();
this.p01 =  new astex.util.Point3d ();
this.p23 =  new astex.util.Point3d ();
this.m12 =  new astex.util.Point3d ();
this.n =  new astex.util.Point3d ();
this.last =  new astex.util.Point3d ();
this.arc =  new astex.util.Point3d ();
this.dla =  new astex.util.Point3d ();
this.dlb =  new astex.util.Point3d ();
this.angleFormat =  new astex.util.Format ("%.1f");
this.distanceFormat =  new astex.util.Format ("%.2fA");
this.dummyAtom = astex.model.Atom.create ();
this.dummyAtom1 = astex.model.Atom.create ();
this.dummyAtom2 = astex.model.Atom.create ();
this.hsvtmp =  Clazz.newDoubleArray (3, 0);
this.commandLog =  new JU.SB ();
this.parserStack =  new Array (10);
this.lexerStack =  new Array (10);
this.maps =  new astex.util.DynamicArray ();
this.s = [0., 0., 0.];
this.objects =  new astex.util.DynamicArray ();
this.textures =  new java.util.Hashtable ();
});
Clazz.makeConstructor (c$, 
function (viewer) {
this.viewer = viewer;
this.addMoleculeRendererListener (viewer);
this.renderer =  new astex.render.Renderer (this);
this.hersheyFonts = astex.util.Settings.getBoolean ("fonts", "hershey.fonts");
this.shadows = astex.util.Settings.getBoolean ("config", "shadows");
this.bondLineRadius = astex.util.Settings.getDouble ("config", "bondlineradius");
this.showOnLoad = astex.util.Settings.getBoolean ("config", "draw.onload");
this.initialise ();
this.setDefaultContourLevels ();
}, "astex.viewer.Viewer");
Clazz.defineMethod (c$, "setShowOnLoad", 
function (b) {
this.showOnLoad = b;
}, "~B");
Clazz.defineMethod (c$, "setKeepModel1", 
function (b) {
this.keepModel1 = b;
}, "~B");
Clazz.defineMethod (c$, "setMatrix", 
function (moleculeName, matrix) {
var tm;
var mol = this.findMolecule (moleculeName);
if (mol == null) {
return;
}var mat = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
var m = matrix.$plit (",");
for (var i = 0; i < m.length; i++) {
mat[i] = Float.parseFloat (m[i]);
}
mol.matrix = mat;
if (mol.getName ().substring (0, 5).equals ("model")) {
tm = this.getGraphicalObjectByName ("s" + mol.getName ().substring (5));
if (tm != null) {
tm.matrix = mat;
}}}, "~S,~S");
Clazz.defineMethod (c$, "repaint", 
function () {
if (this.viewer != null) {
this.viewer.dirtyRepaint ();
}});
Clazz.defineMethod (c$, "setPickMode", 
function (pick) {
if (pick != 1 && pick != 2 && pick != 3 && pick != 4) {
pick = 1;
}this.pickMode = pick;
}, "~N");
Clazz.defineMethod (c$, "setMode", 
function (m) {
if (m != 1 && m != 2) m = 1;
this.mapBehaviourMode = m;
}, "~N");
Clazz.defineMethod (c$, "setNContours", 
function (n) {
this.resizeContourArrays (n);
}, "~N");
Clazz.defineMethod (c$, "setPrintSelectCount", 
function (b) {
this.printSelectCount = b;
}, "~B");
Clazz.defineMethod (c$, "getPrintSelectCount", 
function () {
return this.printSelectCount;
});
Clazz.defineMethod (c$, "handleDeleteCommand", 
function (selectedAtoms) {
var atomCount = selectedAtoms.size ();
for (var a = 0; a < atomCount; a++) {
var atom = selectedAtoms.get (a);
this.deleteAtom (atom);
}
}, "astex.util.DynamicArray");
Clazz.defineMethod (c$, "deleteAtom", 
function (atom) {
var bondCount = atom.getBondCount ();
var mol = atom.getMolecule ();
for (var b = bondCount - 1; b >= 0; b--) {
var bond = atom.getBondI (b);
var other = bond.getOtherAtom (atom);
atom.removeBond (bond);
other.removeBond (bond);
mol.removeBond (bond);
}
mol.removeAtom (atom);
}, "astex.model.Atom");
Clazz.defineMethod (c$, "handlePick", 
function (pickedAtom) {
if (this.pickMode == 1) {
return;
}if (this.pickMode == 2) {
if (this.pickedAtoms.size () == 2) {
var atom0 = this.pickedAtoms.get (0);
var atom1 = this.pickedAtoms.get (1);
var distance = astex.model.Distance.createDistanceMonitor (atom0, atom1);
this.addDistance (distance);
this.pickedAtoms.removeAllElements ();
}} else if (this.pickMode == 3) {
if (this.pickedAtoms.size () == 3) {
var atom0 = this.pickedAtoms.get (0);
var atom1 = this.pickedAtoms.get (1);
var atom2 = this.pickedAtoms.get (2);
this.addAngle (atom0, atom1, atom2);
this.pickedAtoms.removeAllElements ();
}} else if (this.pickMode == 4) {
if (this.pickedAtoms.size () == 4) {
var atom0 = this.pickedAtoms.get (0);
var atom1 = this.pickedAtoms.get (1);
var atom2 = this.pickedAtoms.get (2);
var atom3 = this.pickedAtoms.get (3);
this.addTorsion (atom0, atom1, atom2, atom3);
this.pickedAtoms.removeAllElements ();
}} else {
System.out.println ("Invalid pick mode");
}}, "astex.model.Atom");
Clazz.defineMethod (c$, "handleUpdateCommand", 
function (args, fa) {
}, "astex.util.Arguments,astex.util.FloatArray");
Clazz.defineMethod (c$, "handleUserCommand", 
function (className, args) {
if (className == null) {
astex.util.Log.error ("command name is null");
return;
}try {
{
window[className].apply(null, args);
}} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
astex.util.Log.error ("error loading user class " + className);
{
System.out.println(e);// Clazz.getStackTrace());
}} else {
throw e;
}
}
this.viewer.dirtyRepaint ();
}, "~S,astex.util.Arguments");
Clazz.defineMethod (c$, "handleWriteCommand", 
function (args) {
var typeString = args.getString ("-type", null);
var urlString = args.getString ("-url", null);
var fileString = args.getString ("-file", null);
var moleculeString = args.getString ("-molecule", null);
var parameterName = args.getString ("-parameter", "pdb");
var selected = args.getBoolean ("-selected", true);
var debugConnect = args.getBoolean ("-debug", true);
var mol = null;
var type = null;
if (moleculeString != null) {
mol = this.findMolecule (moleculeString);
if (mol == null) {
astex.util.Log.error ("no molecule " + moleculeString);
}} else if (selected) {
var iterator = this.getAtomIterator ();
while (iterator.hasMoreElements ()) {
var atom = iterator.getNextAtom ();
if (atom.isSelected ()) {
mol = atom.getMolecule ();
break;
}}
} else {
astex.util.Log.error ("no molecule specification specified");
return;
}if (mol == null) {
astex.util.Log.error ("no molecule matches specification");
return;
}if (typeString != null && typeString.startsWith (".") == false) {
typeString = "." + typeString;
}type = astex.io.MoleculeReader.getTypeFromExtension (typeString);
if (urlString != null) {
this.writeMoleculeToUrl (mol, urlString, debugConnect, type, parameterName);
} else if (fileString != null) {
this.writeMoleculeToFile (mol, fileString, debugConnect, type);
} else {
astex.util.Log.error ("you must specify -file or -url");
}}, "astex.util.Arguments");
Clazz.defineMethod (c$, "setRendererSize", 
function (w, h) {
this.renderer.setSize (w, h);
}, "~N,~N");
Clazz.defineMethod (c$, "labelTermini", 
function () {
var moleculeCount = this.getMoleculeCount ();
for (var num = 0; num < moleculeCount; num++) {
var thisMolecule = this.getMolecule (num);
var chainCount = thisMolecule.getChainCount ();
for (var chainnum = 0; chainnum < chainCount; chainnum++) {
var thisChain = thisMolecule.getChain (chainnum);
var residueCount = thisChain.getResidueCount ();
var firstResidue = thisChain.getResidue (0);
var lastResidue = thisChain.getResidue (residueCount - 1);
var atom = firstResidue.getAtom (0);
var label = "XXX";
if (firstResidue.isNucleicAcid ()) {
label = "5'";
} else {
label = "N";
}atom.setCustomLabel (label);
atom = lastResidue.getAtom (0);
if (lastResidue.isNucleicAcid ()) {
label = "3'";
} else {
label = "C";
}atom.setCustomLabel (label);
}
}
});
Clazz.defineMethod (c$, "getImage", 
function (outputWidth, outputHeight, urlSafeEncoding, addPrefix, format) {
var w = this.renderer.pixelWidth;
var h = this.renderer.pixelHeight;
var sample = this.renderer.getSamples ();
this.viewer.taint ();
this.renderer.setSize (outputWidth, outputHeight);
this.renderer.setSamples (sample);
this.paint ();
var ret = this.getRenderedImageString (Math.min (1, urlSafeEncoding), format);
this.viewer.taint ();
this.renderer.setSize (w, h);
this.paint ();
return (urlSafeEncoding < 0 ? ret : (addPrefix == 1 ? "data:image/" + format + ";base64," : "") + ret);
}, "~N,~N,~N,~N,~S");
Clazz.defineMethod (c$, "showRdcAxes", 
function (B) {
this.displayRdcAxes = B;
}, "~B");
Clazz.defineMethod (c$, "setMoleculeDisplay", 
function (molecule, B) {
var m = this.findMolecule (molecule);
m.showRdcAxes = B;
}, "~S,~B");
Clazz.defineMethod (c$, "setRdcAxes", 
function (molecule, rdcString) {
var m = this.findMolecule (molecule);
m.setRdcAxes (rdcString);
}, "~S,~S");
Clazz.defineMethod (c$, "getAtomFromIds", 
function (chain, resid, atom, model) {
var mol = this.getMolecule (model);
var appletChain = mol.findChain (chain, false);
if (appletChain == null) {
return null;
}var residueCount = appletChain.getResidueCount ();
var appletResidue = null;
var residue;
for (var r = 0; r < residueCount; r++) {
residue = appletChain.getResidue (r);
if (residue.getNumber () == resid) {
appletResidue = residue;
break;
}}
if (appletResidue == null) {
return null;
}return appletResidue.getAtomFromName (atom);
}, "~S,~N,~S,~N");
Clazz.defineMethod (c$, "drawDistanceByID", 
function (chain1, residue1, atom1, chain2, residue2, atom2, model, violation) {
var appletAtom1 = this.getAtomFromIds (chain1, residue1, atom1, model);
var appletAtom2 = this.getAtomFromIds (chain2, residue2, atom2, model);
if (appletAtom1 == null) {
return;
}if (appletAtom2 == null) {
return;
}var distance =  new astex.model.Distance ();
distance.group0.add (appletAtom1);
distance.group1.add (appletAtom2);
distance.setString ("name", "distance");
if (violation > 500.0) {
distance.setValue ("color", java.awt.Color.red);
} else if (violation > 300.0) {
distance.setValue ("color", java.awt.Color.orange);
} else if (violation > 0.0) {
distance.setValue ("color", java.awt.Color.yellow);
} else {
distance.setValue ("color", java.awt.Color.green);
}distance.setDouble ("radius", 0.075);
distance.setDouble ("on", 1.0);
distance.setDouble ("off", 0.0);
this.distances.add (distance);
}, "~S,~N,~S,~S,~N,~S,~N,~N");
Clazz.defineMethod (c$, "writeMoleculeToFile", 
function (mol, fileName, debugConnect, type) {
astex.io.FILE.writeMol (mol, fileName, type, null);
}, "astex.model.Molecule,~S,~B,~S");
Clazz.defineMethod (c$, "writeMoleculeToUrl", 
function (mol, urlString, debugConnect, type, parameterName) {
return astex.io.FILE.writeMol (mol, urlString, type, parameterName);
}, "astex.model.Molecule,~S,~B,~S,~S");
Clazz.defineMethod (c$, "handleDistanceCommand", 
function (args) {
var from = args.get ("-from");
var to = args.get ("-to");
var mode = args.getString ("-mode", "pairs");
var dmax = args.getDouble ("-dmax", 5.0);
var contact = args.getDouble ("-contact", 0.5);
var visible = args.getString ("-visible", null);
if (visible != null) {
var pattern = args.getString ("-name", null);
for (var i = 0; i < this.distances.size (); i++) {
var d = this.distances.get (i);
var name = d.getString ("name", null);
if (pattern == null || (name != null && astex.util.Mmatch.matches (pattern, name))) {
d.setBoolean ("visible", "on".equals (visible));
}}
} else if (from != null && mode.equals ("bumps")) {
var d =  new astex.model.Distance ();
this.configureDistance (d, args);
d.setInteger ("mode", 1);
this.addDistance (d);
var fromCount = from.size ();
for (var i = 0; i < fromCount; i++) {
var froma = from.get (i);
var fromr = froma.getVDWRadius ();
for (var j = i + 1; j < fromCount; j++) {
var toa = from.get (j);
var dist = froma.distance (toa);
if (dist < dmax && froma !== toa && dist < (toa.getVDWRadius () + fromr + contact)) {
if (froma.connected121314 (toa) == false) {
d.group0.add (froma);
d.group1.add (toa);
}}}
}
} else if (from != null && to != null) {
System.out.println ("fromCount " + from.size ());
System.out.println ("toCount   " + to.size ());
if (mode.equals ("centroid")) {
var d =  new astex.model.Distance ();
d.setInteger ("mode", 2);
for (var i = 0; i < from.size (); i++) {
d.group0.add (from.get (i));
}
for (var i = 0; i < to.size (); i++) {
d.group1.add (to.get (i));
}
if (d.getCenter0 ().distance (d.getCenter1 ()) < dmax) {
this.configureDistance (d, args);
this.addDistance (d);
}} else if (mode.equals ("pairs") || mode.equals ("nbpairs")) {
var allowBonded = true;
if (mode.equals ("nbpairs")) {
allowBonded = false;
}var fromCount = from.size ();
var toCount = to.size ();
var d =  new astex.model.Distance ();
this.configureDistance (d, args);
d.setInteger ("mode", 1);
this.addDistance (d);
for (var i = 0; i < fromCount; i++) {
var froma = from.get (i);
var fromr = froma.getVDWRadius ();
for (var j = 0; j < toCount; j++) {
var toa = to.get (j);
var dist = froma.distance (toa);
if (dist < dmax && froma !== toa && dist < (toa.getVDWRadius () + fromr + contact)) {
if (allowBonded || froma.connected121314 (toa) == false) {
d.group0.add (froma);
d.group1.add (toa);
}}}
}
}} else {
var deletePattern = args.getString ("-delete", null);
if (deletePattern != null) {
this.deleteDistances (deletePattern);
} else {
System.out.println ("distance: you must specify -from and -to or -delete");
}}}, "astex.util.Arguments");
Clazz.defineMethod (c$, "deleteDistances", 
 function (pattern) {
var distanceCount = this.distances.size ();
var deleted = 0;
for (var j = distanceCount - 1; j >= 0; j--) {
var d = this.distances.get (j);
var name = d.getString ("name", null);
if (name != null && astex.util.Mmatch.matches (pattern, name)) {
this.distances.removeElement (j);
this.fireGenericRemovedEvent (d);
deleted++;
}}
System.out.println ("deleted " + deleted + " distances");
}, "~S");
Clazz.defineMethod (c$, "configureDistance", 
 function (d, args) {
d.setBoolean ("visible", true);
d.setDouble ("radius", args.getDouble ("-radius", 0.0));
d.setDouble ("on", args.getDouble ("-on", 0.0));
d.setDouble ("off", args.getDouble ("-off", 0.0));
d.setString ("format", args.getString ("-format", null));
d.setString ("name", args.getString ("-name", null));
var colour = args.getString ("-colour", "white");
d.setValue ("color",  new java.awt.Color (astex.util.Color32.getColorFromName (colour)));
colour = args.getString ("-labelcolour", "white");
d.setValue ("labelcolor",  new java.awt.Color (astex.util.Color32.getColorFromName (colour)));
}, "astex.model.Distance,astex.util.Arguments");
Clazz.defineMethod (c$, "handleHbondCommand", 
function (args) {
var calculateAtoms = args.get ("-calculate");
var deleteAtoms = args.get ("-delete");
var deleteAll = args.getBoolean ("-deleteall", false);
if (deleteAll) {
this.hbonds.removeAllElements ();
}if (calculateAtoms != null) {
this.calculateHbonds (calculateAtoms, args);
} else if (deleteAtoms != null) {
this.deleteHbonds (deleteAtoms, args);
}}, "astex.util.Arguments");
Clazz.defineMethod (c$, "calculateHbonds", 
function (atoms, args) {
var l =  new astex.util.Lattice (5.5);
var atomCount = atoms.size ();
var hbondConstant = args.getDouble ("hbond.constant", -999.0);
var hbondCutoff = args.getDouble ("hbond.cutoff", -999.0);
System.out.println ("hbondCutoff " + hbondCutoff);
for (var i = 0; i < atomCount; i++) {
var a = atoms.get (i);
if (a.getAtomLabel ().equals ("O")) {
l.add (i, a.x, a.y, a.z);
}}
var neighbours =  new astex.util.IntArray ();
for (var i = 0; i < atomCount; i++) {
var a = atoms.get (i);
if (a.getAtomLabel ().equals ("N")) {
var n = a;
var h = astex.render.MoleculeRenderer.getAmideHydrogen (a);
neighbours.removeAllElements ();
l.getPossibleNeighbours (-2147483648, n.x, n.y, n.z, neighbours, true);
var neighbourCount = neighbours.size ();
for (var j = 0; j < neighbourCount; j++) {
var o = atoms.get (neighbours.get (j));
var c = o.getBondedAtom ("C");
var e = astex.render.MoleculeRenderer.hbondEnergy (n, h, o, c, hbondConstant);
if (e < hbondCutoff) {
var hbond = astex.model.Bond.create ();
hbond.setFirstAtom (n);
hbond.setSecondAtom (o);
this.hbonds.add (hbond);
}}
}}
System.out.println ("number of hbonds " + this.hbonds.size ());
}, "astex.util.DynamicArray,astex.util.Arguments");
Clazz.defineMethod (c$, "deleteHbonds", 
 function (atoms, args) {
var hbondCount = this.hbonds.size ();
var removedCount = 0;
for (var i = hbondCount - 1; i >= 0; i--) {
var hbond = this.hbonds.get (i);
var firstAtom = hbond.getFirstAtom ();
var secondAtom = hbond.getSecondAtom ();
if (atoms.contains (firstAtom) || atoms.contains (secondAtom)) {
this.hbonds.removeElement (i);
removedCount++;
}}
astex.io.FILE.out.printFI ("removed %d hydrogen bonds", removedCount);
}, "astex.util.DynamicArray,astex.util.Arguments");
c$.hbondEnergy = Clazz.defineMethod (c$, "hbondEnergy", 
function (n, h, o, c, fq1q2) {
if (n != null && h != null && o != null && c != null) {
if (c.hasBond (n) == false || c.hasBond (o) == false) {
var rON = o.distance (n);
var rCH = c.distance (h);
var rOH = o.distance (h);
var rCN = c.distance (n);
var nh = astex.util.Point3d.unitVectorP2 (n, h);
var no = astex.util.Point3d.unitVectorP2 (n, o);
var co = astex.util.Point3d.unitVectorP2 (c, o);
var hno = (57.29577951308232) * Math.acos (nh.dot (no));
var hnoc = (57.29577951308232) * Math.acos (nh.dot (co));
if (hno > 63.0 || hnoc < 90.0) {
return 10000.0;
}return fq1q2 * (1. / rON + 1. / rCH - 1. / rOH - 1. / rCN);
}}return 10000.0;
}, "astex.model.Atom,astex.util.Point3d,astex.model.Atom,astex.model.Atom,~N");
c$.getAmideHydrogen = Clazz.defineMethod (c$, "getAmideHydrogen", 
 function (N) {
if (N == null) {
return null;
}var CA = N.getBondedAtom ("CA");
var C = N.getBondedAtom ("C");
if (N == null || CA == null || C == null) {
return null;
}var hpos =  new astex.util.Point3d ();
hpos.setP (N);
hpos.subtract (C);
hpos.add (N);
hpos.subtract (CA);
hpos.normalise ();
hpos.scale (1.04);
hpos.add (N);
var m = N.getMolecule ();
var ah = m.addNewAtom ();
ah.setP (hpos);
return hpos;
}, "astex.model.Atom");
Clazz.defineMethod (c$, "handleTextureCommand", 
function (args) {
var name = args.getString ("-name", null);
var t = null;
if (name != null) {
t = this.textures.get (name);
if (t == null) {
t =  new astex.render.Texture ();
this.textures.put (name, t);
System.out.println ("adding new texture " + name);
}} else {
System.out.println ("handleTextureCommand: no texture specified [-name]");
return;
}var coord = args.getString ("-coord", null);
var tc = 0;
if (coord != null) {
if (coord.equals ("u")) {
tc = 0;
} else if (coord.equals ("v")) {
tc = 1;
} else {
tc = -1;
}}if (tc == -1) {
System.out.println ("handleTextureCommand: illegal texture coord " + coord);
return;
}var values = args.getString ("-values", null);
if (values != null) {
var colors = astex.io.FILE.split (values, null);
t.fillValues (colors, tc);
}}, "astex.util.Arguments");
Clazz.defineMethod (c$, "handleLightCommand", 
function (l, args) {
if (l < 0 || l >= this.renderer.lights.size ()) {
return;
}var light = this.renderer.lights.get (l);
var changed = false;
if (light == null) {
return;
}if (args.defined ("-x")) {
light.pos[0] = args.getDouble ("-x", 0.0);
changed = true;
}if (args.defined ("-y")) {
light.pos[1] = args.getDouble ("-y", 0.0);
changed = true;
}if (args.defined ("-z")) {
light.pos[2] = args.getDouble ("-z", 1.0);
changed = true;
}if (args.defined ("-on")) {
light.on = args.getBoolean ("-on", true);
changed = true;
}if (args.defined ("-specularint")) {
var intensity = args.getInteger ("-specularint", 64);
light.specular = astex.util.Color32.pack (intensity, intensity, intensity);
changed = true;
}if (args.defined ("-phongpower")) {
var intensity = args.getDouble ("-phongpower", 16.0);
light.power = intensity;
changed = true;
}if (args.defined ("-diffuseint")) {
var intensity = args.getInteger ("-diffuseint", 128);
light.diffuse = astex.util.Color32.pack (intensity, intensity, intensity);
changed = true;
}if (changed) {
light.normalisePos ();
this.renderer.calculateLightMap ();
this.viewer.dirtyRepaint ();
}}, "~N,astex.util.Arguments");
Clazz.defineMethod (c$, "handleObjectCommand", 
function (namePattern, args) {
this.getTexgen ().handleObjectCommand (this, namePattern, args);
}, "~S,astex.util.Arguments");
Clazz.defineMethod (c$, "writeObject", 
function (name, fileName) {
var tm = this.getGraphicalObjectByName (name);
if (tm == null) {
System.out.println ("Could not find object: " + name + " write failed");
return;
}tm.output (fileName);
}, "~S,~S");
Clazz.defineMethod (c$, "initialise", 
function () {
this.properties = astex.io.FILE.loadProperties (astex.render.MoleculeRenderer.moleculeRendererProperties);
var value = null;
value = this.properties.getProperty (astex.render.MoleculeRenderer.displayRadiusProperty);
if (value != null) {
this.displayRadius = astex.io.FILE.readDouble (value);
}value = this.properties.getProperty (astex.render.MoleculeRenderer.symmetryRadiusProperty);
if (value != null) {
this.symmetryRadius = astex.io.FILE.readDouble (value);
}value = this.properties.getProperty (astex.render.MoleculeRenderer.mapRadiusProperty);
if (value != null) {
this.mapRadius = astex.io.FILE.readDouble (value);
}this.processContourProperties ();
});
Clazz.defineMethod (c$, "generateStatusLabel", 
 function (atom) {
if (this.defaultStatusLabelFormat == null) {
this.defaultStatusLabelFormat = astex.util.Settings.getString ("config", "atom.long.format");
if (this.defaultStatusLabelFormat == null) {
this.defaultStatusLabelFormat = "%a %R %c:%r ID=%i  X=%x Y=%y Z=%z  O=%o B=%b %m";
}}return atom.generateLabel (this.defaultStatusLabelFormat);
}, "astex.model.Atom");
Clazz.defineMethod (c$, "setStatusLabelFormat", 
function (s) {
this.defaultStatusLabelFormat = s;
}, "~S");
Clazz.defineMethod (c$, "getStatusLabelFormat", 
function () {
return this.defaultStatusLabelFormat;
});
Clazz.defineMethod (c$, "setStatusAtom", 
function (a) {
if (a == null) {
this.renderer.setStatusString (null);
} else {
this.renderer.setStatusString (this.generateStatusLabel (a));
}}, "astex.model.Atom");
Clazz.defineMethod (c$, "setDisplayStatusString", 
function (b) {
this.renderer.setDisplayStatusString (b);
}, "~B");
Clazz.defineMethod (c$, "setRadius", 
function (radius) {
this.displayRadius = radius;
this.renderer.setRadius (radius);
}, "~N");
Clazz.defineMethod (c$, "setClip", 
function (distance) {
if (distance < this.minimumClipDistance) {
distance = this.minimumClipDistance;
}this.renderer.setClip (distance);
}, "~N");
Clazz.defineMethod (c$, "setSymmetry", 
function (state) {
this.displaySymmetry = state;
if (this.displaySymmetry) {
this.generateSymmetry ();
} else {
this.removeSymmetry ();
}if (this.viewer != null) {
this.viewer.updateDisplayItemFromCommand ("Symmetry", this.displaySymmetry);
}}, "~B");
Clazz.defineMethod (c$, "removeSpaceGroup", 
function () {
this.symmetry = null;
});
Clazz.defineMethod (c$, "addMoleculeRendererListener", 
function (l) {
if (this.moleculeRendererListeners == null) {
this.moleculeRendererListeners =  new astex.util.DynamicArray ();
}this.moleculeRendererListeners.add (l);
}, "astex.render.MoleculeRendererListener");
Clazz.defineMethod (c$, "removeMoleculeRendererListener", 
function (l) {
if (this.moleculeRendererListeners != null) {
this.moleculeRendererListeners.remove (l);
System.out.println ("moleculeRendererListeners " + this.moleculeRendererListeners.size ());
}}, "astex.render.MoleculeRendererListener");
Clazz.defineMethod (c$, "fireMoleculeAddedEvent", 
function (molecule) {
if (this.moleculeRendererListeners != null) {
for (var i = 0; i < this.moleculeRendererListeners.size (); i++) {
var l = this.moleculeRendererListeners.get (i);
l.moleculeAdded (this, molecule);
}
}}, "astex.model.Molecule");
Clazz.defineMethod (c$, "fireMoleculeRemovedEvent", 
function (molecule) {
if (this.moleculeRendererListeners != null) {
for (var i = 0; i < this.moleculeRendererListeners.size (); i++) {
var l = this.moleculeRendererListeners.get (i);
l.moleculeRemoved (this, molecule);
}
}}, "astex.model.Molecule");
Clazz.defineMethod (c$, "fireGenericAddedEvent", 
function (generic) {
if (this.moleculeRendererListeners != null) {
for (var i = 0; i < this.moleculeRendererListeners.size (); i++) {
var l = this.moleculeRendererListeners.get (i);
l.genericAdded (this, generic);
}
}}, "astex.generic.Generic");
Clazz.defineMethod (c$, "fireGenericRemovedEvent", 
function (generic) {
if (this.moleculeRendererListeners != null) {
for (var i = 0; i < this.moleculeRendererListeners.size (); i++) {
var l = this.moleculeRendererListeners.get (i);
l.genericRemoved (this, generic);
}
}}, "astex.generic.Generic");
Clazz.defineMethod (c$, "fireAtomSelectedEvent", 
function (atom) {
if (this.moleculeRendererListeners != null) {
for (var i = 0; i < this.moleculeRendererListeners.size (); i++) {
var l = this.moleculeRendererListeners.get (i);
l.atomSelected (this, atom);
}
}}, "astex.model.Atom");
Clazz.defineMethod (c$, "addMolecule", 
function (molecule) {
this.molecules.add (molecule);
if (this.getMoleculeCount () == 1) {
this.resetView ();
this.initialiseCenter ();
}this.fireMoleculeAddedEvent (molecule);
}, "astex.model.Molecule");
Clazz.defineMethod (c$, "createMoleculeFromFile", 
function (filename, name) {
var sdf = (filename.toLowerCase ().indexOf (".sd") != -1);
var ent = (filename.toLowerCase ().indexOf (".ent") != -1);
var mmcif = (filename.toLowerCase ().indexOf (".cif") != -1);
if (this.debug) {
System.gc ();
System.out.println ("Memory before add molecule: " + 0.000001 * (Runtime.getRuntime ().totalMemory () - Runtime.getRuntime ().freeMemory ()));
}if (this.viewer != null && astex.viewer.Viewer.$isApplet) {
sdf = false;
}if (this.debug) System.out.println ("sdf " + sdf);
if (sdf) {
var f = astex.io.FILE.open (filename);
if (f == null) {
System.out.println ("addMolecule: couldn't load " + filename);
}var molecule = null;
var count = 0;
var start = this.getMoleculeCount ();
while ((molecule = astex.io.MoleculeReader.readMDLMol (f)) != null) {
var molname = molecule.getName ();
if (molname == null || molname.length == 0) {
molname = filename + "_" + count;
molecule.setName (molname);
}molecule.setFilename (filename);
this.addMolecule (molecule);
count++;
}
var finish = this.getMoleculeCount ();
var sel = "molecule";
for (var m = start; m < finish; m++) {
sel += " '#" + m + "'";
}
var command = "cylinder_radius 0.09 " + sel + ";";
command += "display cylinders on " + sel + ";";
this.execute (command);
if (finish - start == 1) {
var mol = this.getMolecule (start);
mol.setName (name);
System.out.println ("renamed single molecule sd to " + name);
}} else if (ent) {
var fname = filename;
var numMod = Integer.parseInt (astex.util.Settings.getString ("config", "molecule.max_models"));
var readCount = 0;
var f;
f = astex.io.FILE.open (fname);
if (f == null) {
System.err.println ("ERROR LOADING FILE: " + fname);
return;
}var i = 0;
while (i < numMod) {
var molecule = astex.io.MoleculeReader.readPDB (f);
if (molecule != null) {
molecule.setFilename (filename);
if (readCount == 0) {
molecule.setModelType (2);
} else {
molecule.setModelType (3);
}i++;
molecule.setName (name + i);
if (this.debug) System.err.println (molecule.getName ());
if (!this.showOnLoad) {
for (var mAtom = 0; mAtom < molecule.getAtomCount (); mAtom++) {
var thisAtom = molecule.getAtom (mAtom);
thisAtom.setDisplayed (false);
}
}this.addMolecule (molecule);
readCount++;
} else {
i = numMod;
if (this.debug) System.err.println ("No more models");
}}
if (readCount == 1 && !this.keepModel1) {
var mName = name + "1";
var molecule = this.findMolecule (mName);
molecule.setName (name);
molecule.setModelType (1);
}f.close ();
} else if (mmcif) {
var mols = astex.io.MoleculeReader.readMMCif (filename, !astex.viewer.Viewer.$isApplet);
var numMod = mols.size ();
for (var i = 0; i < numMod; i++) {
var mol = mols.get (i);
mol.setFilename (filename);
mol.setName (name + Integer.toString (i + 1));
if (mols.size () == 1) mol.setName (name);
this.addMolecule (mol);
}
} else {
var molecule = astex.io.MoleculeReader.readFile (filename);
if (molecule != null) {
molecule.setFilename (filename);
molecule.setName (name);
this.addMolecule (molecule);
} else {
System.out.println ("addMolecule: couldn't load " + filename);
}}if (this.debug) {
System.gc ();
System.out.println ("Memory after add molecule: " + 0.000001 * (Runtime.getRuntime ().totalMemory () - Runtime.getRuntime ().freeMemory ()));
}if (this.debug) System.err.println ("End of function");
}, "~S,~S");
Clazz.defineMethod (c$, "getMoleculeCount", 
function () {
return this.molecules.size ();
});
Clazz.defineMethod (c$, "getMolecule", 
function (i) {
return this.molecules.get (i);
}, "~N");
Clazz.defineMethod (c$, "findMolecule", 
function (name) {
var moleculeCount = this.getMoleculeCount ();
for (var i = 0; i < moleculeCount; i++) {
var molecule = this.getMolecule (i);
var moleculeName = molecule.getName ();
if (name.equals (moleculeName)) {
return molecule;
}}
return null;
}, "~S");
Clazz.defineMethod (c$, "getMolecules", 
function () {
return this.molecules;
});
Clazz.defineMethod (c$, "isMoleculeLoaded", 
function (molname) {
var moleculeCount = this.getMoleculeCount ();
for (var m = moleculeCount - 1; m >= 0; m--) {
var molecule = this.getMolecule (m);
if (molname.equals (molecule.getName ())) return true;
}
return false;
}, "~S");
Clazz.defineMethod (c$, "removeMoleculeByName", 
function (pattern) {
var moleculeCount = this.getMoleculeCount ();
for (var m = moleculeCount - 1; m >= 0; m--) {
var molecule = this.getMolecule (m);
var moleculeName = molecule.getName ();
if (pattern.equals (moleculeName)) {
this.molecules.remove (molecule);
System.out.println ("removed " + moleculeName);
this.fireMoleculeRemovedEvent (molecule);
}}
}, "~S");
Clazz.defineMethod (c$, "removeMolecule", 
function (pattern) {
if (this.debug) {
System.gc ();
System.out.println ("Memory before remove molecule: " + 0.000001 * (Runtime.getRuntime ().totalMemory () - Runtime.getRuntime ().freeMemory ()));
}var moleculeCount = this.getMoleculeCount ();
for (var m = moleculeCount - 1; m >= 0; m--) {
var molecule = this.getMolecule (m);
if (this.moleculeMatches (pattern, molecule)) {
this.molecules.remove (molecule);
this.fireMoleculeRemovedEvent (molecule);
}}
if (this.debug) {
System.out.println ("Memory before gc: " + 0.000001 * (Runtime.getRuntime ().totalMemory () - Runtime.getRuntime ().freeMemory ()));
System.gc ();
System.out.println ("Memory after gc: " + 0.000001 * (Runtime.getRuntime ().totalMemory () - Runtime.getRuntime ().freeMemory ()));
}}, "~S");
Clazz.defineMethod (c$, "moleculeMatches", 
function (pattern, mol) {
if (pattern.startsWith ("#")) {
var moleculeCount = this.getMoleculeCount ();
var id = Integer.parseInt (pattern.substring (1)) % moleculeCount;
for (var m = 0; m < moleculeCount; m++) {
if (this.getMolecule (m) === mol && m == id) {
return true;
}}
} else {
return astex.util.Mmatch.matches (pattern, mol.getName ());
}return false;
}, "~S,astex.model.Molecule");
Clazz.defineMethod (c$, "getNextMoleculeName", 
function () {
var mol = this.getMoleculeCount ();
var molName = null;
do {
molName = "mol" + mol;
mol++;
} while (this.findMolecule (molName) != null);
return molName;
});
Clazz.defineMethod (c$, "getResidueIterator", 
function () {
return  new astex.model.ResidueIterator (this);
});
Clazz.defineMethod (c$, "getBondIterator", 
function () {
return  new astex.util.BondIterator (this);
});
Clazz.defineMethod (c$, "getAtomIterator", 
function () {
return  new astex.util.AtomIterator (this);
});
Clazz.defineMethod (c$, "setDisplayAtomLabel", 
function (b) {
this.displayAtomLabel = b;
}, "~B");
Clazz.defineMethod (c$, "addLabelledAtom", 
function (atom) {
if (atom.isLabelled ()) {
atom.setLabelled (false);
} else {
atom.setLabelled (true);
}}, "astex.model.Atom");
Clazz.defineMethod (c$, "labelledAtomsContains", 
function (atom) {
return false;
}, "astex.model.Atom");
Clazz.defineMethod (c$, "addSelectedAtom", 
function (atom) {
var atomSelect = atom.selectStatement ();
if (this.selectedAtoms.contains (atom) == false) {
this.selectedAtoms.add (atom);
this.execute ("append " + atomSelect + ";");
this.fireAtomSelectedEvent (atom);
} else {
this.selectedAtoms.remove (atom);
this.execute ("exclude " + atomSelect + ";");
}if (this.pickedAtoms.contains (atom)) {
this.pickedAtoms.remove (atom);
} else {
this.pickedAtoms.add (atom);
}}, "astex.model.Atom");
Clazz.defineMethod (c$, "addBumpPair", 
function (atom1, atom2) {
if ((this.bumpInSameMolecule && atom1.getMolecule () === atom2.getMolecule ()) || this.bumpInSameMolecule == false) {
this.bumpAtoms.add (atom1);
this.bumpAtoms.add (atom2);
}}, "astex.model.Atom,astex.model.Atom");
Clazz.defineMethod (c$, "generateBumps", 
function (atom) {
var bumpAtoms =  new astex.util.DynamicArray ();
bumpAtoms.add (atom);
this.generateBumps (bumpAtoms);
}, "astex.model.Atom");
Clazz.defineMethod (c$, "generateBumps", 
function (bumpAtoms) {
this.removeAllBumpAtoms ();
var bumpAtomCount = bumpAtoms.size ();
if (this.displayBumps && bumpAtomCount > 0) {
var sphereAtoms = this.getAtomsAroundSelection (bumpAtoms, 5.0, true);
var sphereAtomCount = sphereAtoms.size ();
for (var i = 0; i < sphereAtomCount; i++) {
var sphereAtom = sphereAtoms.get (i);
var vdwRadius = sphereAtom.getVDWRadius ();
for (var a = 0; a < bumpAtomCount; a++) {
var atom = bumpAtoms.get (a);
var atomVDWRadius = atom.getVDWRadius ();
if (sphereAtom !== atom && atom.hasBond (sphereAtom) == false && atom.connected13 (sphereAtom) == false && atom.connected14 (sphereAtom) == false) {
var dSq = atomVDWRadius + vdwRadius;
dSq = dSq * dSq;
if (atom.distanceSq (sphereAtom) < dSq) {
this.addBumpPair (atom, sphereAtom);
}}}
}
}}, "astex.util.DynamicArray");
Clazz.defineMethod (c$, "addDistance", 
function (d) {
this.distances.add (d);
this.fireGenericAddedEvent (d);
}, "astex.model.Distance");
Clazz.defineMethod (c$, "getDistanceCount", 
function () {
return this.distances.size ();
});
Clazz.defineMethod (c$, "getDistance", 
function (i) {
return this.distances.get (i);
}, "~N");
Clazz.defineMethod (c$, "addDistanceBetweenSelectedAtoms", 
function () {
var selectedAtomCount = this.selectedAtoms.size ();
if (selectedAtomCount == 2) {
var firstAtom = this.selectedAtoms.get (0);
var secondAtom = this.selectedAtoms.get (1);
var d = astex.model.Distance.createDistanceMonitor (firstAtom, secondAtom);
this.addDistance (d);
}});
Clazz.defineMethod (c$, "addDistanceGroups", 
function (firstAtom, secondAtom) {
var distance =  new astex.model.Distance ();
distance.group0.add (firstAtom);
distance.group1.add (secondAtom);
this.addDistance (distance);
}, "astex.model.Atom,astex.model.Atom");
Clazz.defineMethod (c$, "addDistanceAsBond", 
function (firstAtom, secondAtom) {
var bond = astex.model.Bond.create ();
bond.setFirstAtom (firstAtom);
bond.setSecondAtom (secondAtom);
this.distances.add (bond);
}, "astex.model.Atom,astex.model.Atom");
Clazz.defineMethod (c$, "getNearestDistance", 
function (x, y) {
var nearestDistance = null;
var RADIUS = 66.0 / this.renderer.getRadius () * this.renderer.zoom;
var nearest = RADIUS;
for (var m = 0; m < this.distances.size (); m++) {
var thisD = this.distances.get (m);
var a1 = thisD.group0.get (0);
var a2 = thisD.group1.get (0);
if (a1.isDisplayed () && a2.isDisplayed ()) {
var x1 = (a1.xs >> 12) / this.renderer.getSamples ();
var y1 = (a1.ys >> 12) / this.renderer.getSamples ();
var x2 = (a2.xs >> 12) / this.renderer.getSamples ();
var y2 = (a2.ys >> 12) / this.renderer.getSamples ();
var dx = Math.abs (x1 - x2);
var dy = Math.abs (y1 - y2);
if (Math.max (x1, x2) + RADIUS / 2 - dx / 10 > x) {
if (Math.max (y1, y2) + RADIUS / 2 - dy / 10 > y) {
if (Math.min (x1, x2) - RADIUS / 2 + dx / 10 < x) {
if (Math.min (y1, y2) - RADIUS / 2 + dy / 10 < y) {
var slope = (y2 - y1) / (x2 - x1);
var intercept = y1 - slope * x1;
var dist = Math.abs (slope * x + intercept - y);
if (dist <= nearest) {
nearest = dist;
nearestDistance = thisD;
}}}}}}}
return nearestDistance;
}, "~N,~N");
Clazz.defineMethod (c$, "addAngle", 
function (firstAtom, secondAtom, thirdAtom) {
this.angles.add (firstAtom);
this.angles.add (secondAtom);
this.angles.add (thirdAtom);
}, "astex.model.Atom,astex.model.Atom,astex.model.Atom");
Clazz.defineMethod (c$, "addTorsion", 
function (firstAtom, secondAtom, thirdAtom, fourthAtom) {
this.addTorsionColorSize (firstAtom, secondAtom, thirdAtom, fourthAtom, astex.util.Color32.magenta, 0.015);
}, "astex.model.Atom,astex.model.Atom,astex.model.Atom,astex.model.Atom");
Clazz.defineMethod (c$, "addTorsionColorSize", 
function (firstAtom, secondAtom, thirdAtom, fourthAtom, color, size) {
this.torsions.add (firstAtom);
this.torsions.add (secondAtom);
this.torsions.add (thirdAtom);
this.torsions.add (fourthAtom);
this.torsions.add ( new Integer (color));
this.torsions.add ( new Double (size));
}, "astex.model.Atom,astex.model.Atom,astex.model.Atom,astex.model.Atom,~N,~N");
Clazz.defineMethod (c$, "reset", 
function () {
this.removeGraphicalObjects ("*");
this.removeMolecule ("*");
this.removeMaps ();
this.removeAllAngles ();
this.removeAllDistances ();
this.removeAllTorsions ();
this.removeAllLabelledAtoms ();
this.removeAllSelectedAtoms ();
this.removeAllBumpAtoms ();
this.removeSpaceGroup ();
});
Clazz.defineMethod (c$, "removeAllAngles", 
function () {
this.angles.removeAllElements ();
});
Clazz.defineMethod (c$, "removeAllDistances", 
function () {
this.deleteDistances ("*");
});
Clazz.defineMethod (c$, "removeAllTorsions", 
function () {
this.torsions.removeAllElements ();
});
Clazz.defineMethod (c$, "removeAllLabelledAtoms", 
function () {
var atomIterator = this.getAtomIterator ();
while (atomIterator.hasMoreElements ()) {
var atom = atomIterator.getNextAtom ();
atom.setLabelled (false);
}
});
Clazz.defineMethod (c$, "removeAllSelectedAtoms", 
function () {
this.execute ("select none;");
this.selectedAtoms.removeAllElements ();
this.pickedAtoms.removeAllElements ();
this.fireAtomSelectedEvent (null);
});
Clazz.defineMethod (c$, "removeAllBumpAtoms", 
function () {
this.bumpAtoms.removeAllElements ();
});
Clazz.defineMethod (c$, "getBumpAtoms", 
function () {
return this.bumpAtoms;
});
Clazz.defineMethod (c$, "generateSymmetry", 
function (center, radius) {
var symmetryMolecule = null;
if (this.displaySymmetry) {
if (this.getMoleculeCount () > 0) {
this.determineSymmetry ();
if (this.symmetry != null) {
if (this.mapBehaviourMode == 1) {
symmetryMolecule = this.generateSymmetryMolecule (center, radius);
} else {
symmetryMolecule = this.generateSymmetryMolecule2 ();
if (symmetryMolecule == null || symmetryMolecule.getAtomCount () == 0) {
symmetryMolecule = this.generateSymmetryMolecule3 ();
}}}}}return symmetryMolecule;
}, "astex.util.Point3d,~N");
Clazz.defineMethod (c$, "generateSymmetryMolecule", 
function (center, radius) {
var symmetryMolecule =  new astex.model.Molecule ();
symmetryMolecule.setName ("Symmetry");
symmetryMolecule.setMoleculeType (4);
var fractionalCenter = astex.util.Point3d.newP (center);
var molecule = this.getMolecule (0);
var moleculeCenter = molecule.getCenter ();
var moleculeRadius = molecule.getRadius ();
var atomCount = molecule.getAtomCount ();
var oldIds =  Clazz.newIntArray (atomCount, 0);
for (var a = 0; a < atomCount; a++) {
var atom = molecule.getAtom (a);
oldIds[a] = atom.getId ();
}
molecule.assignAtomNumbers ();
var cartesianToFractional = this.symmetry.getCartesianToFractionalMatrix ();
var fractionalToCartesian = this.symmetry.getFractionalToCartesianMatrix ();
fractionalCenter.transform (cartesianToFractional);
var originx = Clazz.doubleToInt (fractionalCenter.x);
if (fractionalCenter.x < 0.0) originx -= 1;
var originy = Clazz.doubleToInt (fractionalCenter.y);
if (fractionalCenter.y < 0.0) originy -= 1;
var originz = Clazz.doubleToInt (fractionalCenter.z);
if (fractionalCenter.z < 0.0) originz -= 1;
System.out.println ("origin " + originx + " " + originy + " " + originz);
var symmetryOperators = this.symmetry.getSymmetryOperators ();
var currentCenter =  new astex.util.Point3d ();
var operatorCount = symmetryOperators.size ();
var currentTransform =  new astex.util.Matrix ();
var unit_cell_offset = 2;
for (var ix = -unit_cell_offset; ix <= unit_cell_offset; ix++) {
for (var iy = -unit_cell_offset; iy <= unit_cell_offset; iy++) {
for (var iz = -unit_cell_offset; iz <= unit_cell_offset; iz++) {
var startOperator = 0;
if (ix == 0 && iy == 0 && iz == 0) {
startOperator = 1;
}for (var s = startOperator; s < operatorCount; s++) {
var operator = symmetryOperators.get (s);
currentTransform.setIdentity ();
currentTransform.transform (cartesianToFractional);
currentTransform.translate (-originx, -originy, -originz);
currentTransform.transform (operator);
currentTransform.translate (ix, iy, iz);
currentTransform.translate (originx, originy, originz);
currentTransform.transform (fractionalToCartesian);
currentCenter.setP (moleculeCenter);
currentCenter.transform (currentTransform);
var d = currentCenter.distance (center);
if (d < radius + moleculeRadius) {
this.addSymmetryAtoms (molecule, center, radius, currentTransform, symmetryMolecule);
}}
}
}
}
symmetryMolecule.autoBond ();
for (var a = 0; a < atomCount; a++) {
var atom = molecule.getAtom (a);
atom.setId (oldIds[a]);
}
return symmetryMolecule;
}, "astex.util.Point3d,~N");
Clazz.defineMethod (c$, "generateSymmetryMolecule2", 
function () {
var symmetryMolecule =  new astex.model.Molecule ();
symmetryMolecule.setName ("Symmetry");
symmetryMolecule.setMoleculeType (4);
var molecule = this.getMolecule (0);
var moleculeCenter = molecule.getCenter ();
var atomCount = molecule.getAtomCount ();
var oldIds =  Clazz.newIntArray (atomCount, 0);
for (var a = 0; a < atomCount; a++) {
var atom = molecule.getAtom (a);
oldIds[a] = atom.getId ();
}
molecule.assignAtomNumbers ();
var cartesianToFractional = this.symmetry.getCartesianToFractionalMatrix ();
var fractionalToCartesian = this.symmetry.getFractionalToCartesianMatrix ();
var symmetryOperators = this.symmetry.getSymmetryOperators ();
var cpyCenter =  new astex.util.Point3d ();
var gridOrigin =  new astex.util.Point3d ();
this.symmetry.getGridOrigin (gridOrigin);
var operatorCount = symmetryOperators.size ();
var currentTransform =  new astex.util.Matrix ();
var startOperator = 1;
for (var s = startOperator; s < operatorCount; s++) {
var operator = this.symmetry.setCurrentTransformForMap (cartesianToFractional, fractionalToCartesian, symmetryOperators.get (s), moleculeCenter, cpyCenter, gridOrigin, currentTransform);
this.addAllSymmetryAtoms (molecule, operator, s, symmetryMolecule);
}
symmetryMolecule.autoBond ();
for (var a = 0; a < atomCount; a++) {
var atom = molecule.getAtom (a);
atom.setId (oldIds[a]);
}
return symmetryMolecule;
});
Clazz.defineMethod (c$, "generateSymmetryMolecule3", 
 function () {
var symmetryMolecule =  new astex.model.Molecule ();
symmetryMolecule.setName ("Symmetry");
symmetryMolecule.setMoleculeType (4);
for (var m = 0; m < this.getMoleculeCount (); m++) {
var molecule = this.getMolecule (m);
var xformCnt = molecule.getBioTransformCount ();
if (xformCnt <= 1) continue;
var atomCount = molecule.getAtomCount ();
var oldIds =  Clazz.newIntArray (atomCount, 0);
for (var a = 0; a < atomCount; a++) {
var atom = molecule.getAtom (a);
oldIds[a] = atom.getId ();
}
molecule.assignAtomNumbers ();
for (var i = 0; i < xformCnt; i++) {
var mtrx = molecule.getBioTransform (i);
if (mtrx.isIdentity ()) continue;
this.addAllSymmetryAtoms (molecule, mtrx, i, symmetryMolecule);
}
for (var a = 0; a < atomCount; a++) {
var atom = molecule.getAtom (a);
atom.setId (oldIds[a]);
}
}
symmetryMolecule.autoBond ();
return symmetryMolecule;
});
Clazz.defineMethod (c$, "addAllSymmetryAtoms", 
 function (molecule, transform, cnt, symmetryMolecule) {
var atomCount = molecule.getAtomCount ();
var p =  new astex.util.Point3d ();
var lastResidue = null;
var lastChain = null;
for (var a = 0; a < atomCount; a++) {
var atom = molecule.getAtom (a);
p.setP (atom);
p.transform (transform);
var res = atom.getResidue ();
var chain = res.getParent ();
if (chain !== lastChain) {
var newChain = symmetryMolecule.addChain ();
this.cpChain (chain, newChain);
}if (res !== lastResidue) {
var newResidue = symmetryMolecule.addResidue ();
this.cpRes (res, newResidue);
}lastResidue = res;
lastChain = chain;
var newAtom = symmetryMolecule.addNewAtom ();
this.cpAtom (atom, newAtom);
newAtom.setP (p);
newAtom.setColor (astex.render.MoleculeRenderer.getColor (cnt % 32));
}
}, "astex.model.Molecule,astex.util.Matrix,~N,astex.model.Molecule");
Clazz.defineMethod (c$, "addSymmetryAtoms_1", 
function (molecule, transform, symmetryMolecule) {
var atomCount = molecule.getAtomCount ();
var inSphere =  Clazz.newIntArray (atomCount, 0);
var p =  new astex.util.Point3d ();
for (var a = 0; a < atomCount; a++) {
var atom = molecule.getAtom (a);
p.setP (atom);
p.transform (transform);
inSphere[a] = 1;
}
this.expandSelection (molecule, inSphere);
var lastResidue = null;
var lastChain = null;
for (var a = 0; a < atomCount; a++) {
if (inSphere[a] != 0) {
var atom = molecule.getAtom (a);
p.setP (atom);
p.transform (transform);
var res = atom.getResidue ();
var chain = res.getParent ();
if (chain !== lastChain) {
var newChain = symmetryMolecule.addChain ();
this.cpChain (chain, newChain);
}if (res !== lastResidue) {
var newResidue = symmetryMolecule.addResidue ();
this.cpRes (res, newResidue);
}lastResidue = res;
lastChain = chain;
var newAtom = symmetryMolecule.addNewAtom ();
this.cpAtom (atom, newAtom);
newAtom.setP (p);
}}
}, "astex.model.Molecule,astex.util.Matrix,astex.model.Molecule");
Clazz.defineMethod (c$, "addSymmetryAtoms", 
function (molecule, center, radius, transform, symmetryMolecule) {
var atomCount = molecule.getAtomCount ();
var inSphere =  Clazz.newIntArray (atomCount, 0);
var p =  new astex.util.Point3d ();
var radiusSq = radius * radius;
for (var a = 0; a < atomCount; a++) {
if (inSphere[a] == 0) {
var atom = molecule.getAtom (a);
p.setP (atom);
p.transform (transform);
if (p.distanceSq (center) < radiusSq) {
inSphere[a] = 1;
}}}
this.expandSelection (molecule, inSphere);
var lastResidue = null;
var lastChain = null;
for (var a = 0; a < atomCount; a++) {
if (inSphere[a] != 0) {
var atom = molecule.getAtom (a);
p.setP (atom);
p.transform (transform);
var res = atom.getResidue ();
var chain = res.getParent ();
if (chain !== lastChain) {
var newChain = symmetryMolecule.addChain ();
this.cpChain (chain, newChain);
}if (res !== lastResidue) {
var newResidue = symmetryMolecule.addResidue ();
this.cpRes (res, newResidue);
}lastResidue = res;
lastChain = chain;
var newAtom = symmetryMolecule.addNewAtom ();
this.cpAtom (atom, newAtom);
newAtom.setP (p);
}}
}, "astex.model.Molecule,astex.util.Point3d,~N,astex.util.Matrix,astex.model.Molecule");
Clazz.defineMethod (c$, "cpChain", 
 function (oldChain, newChain) {
newChain.setName (oldChain.getName ());
newChain.setAuthName (oldChain.getAuthName ());
}, "astex.model.Chain,astex.model.Chain");
Clazz.defineMethod (c$, "cpRes", 
 function (oldRes, newRes) {
newRes.setNumber (oldRes.getNumber ());
newRes.setInsertionCode (oldRes.getInsertionCode ());
newRes.setName (oldRes.getName ());
newRes.setAuthorNumber (oldRes.getAuthorNumber ());
}, "astex.model.Residue,astex.model.Residue");
Clazz.defineMethod (c$, "cpAtom", 
 function (oldAtom, newAtom) {
newAtom.setElement (oldAtom.getElement ());
newAtom.setAtomLabel (oldAtom.getAtomLabel ());
newAtom.setAltLoc (oldAtom.getAltLoc ());
newAtom.setInsertionCode (oldAtom.getInsertionCode ());
}, "astex.model.Atom,astex.model.Atom");
Clazz.defineMethod (c$, "getAtomCount", 
function () {
var moleculeCount = this.molecules.size ();
var atomCount = 0;
for (var m = 0; m < moleculeCount; m++) {
var molecule = this.molecules.get (m);
atomCount += molecule.getAtomCount ();
}
return atomCount;
});
Clazz.defineMethod (c$, "setMoleculeVariable", 
function (pattern, name, value) {
var moleculeCount = this.getMoleculeCount ();
for (var i = 0; i < moleculeCount; i++) {
var m = this.getMolecule (i);
if (this.moleculeMatches (pattern, m)) {
if ("bonddetails".equalsIgnoreCase (name)) {
m.setBoolean ("bondDetails", "on".equalsIgnoreCase (value));
} else {
throw  new RuntimeException ("unknown molecule variable: " + name);
}}}
return 0;
}, "~S,~S,~S");
Clazz.defineMethod (c$, "setMoleculeVisibility", 
function (pattern, action) {
var moleculeCount = this.getMoleculeCount ();
for (var i = 0; i < moleculeCount; i++) {
var m = this.getMolecule (i);
if (this.moleculeMatches (pattern, m)) {
if (action.equals ("off")) {
m.setDisplayed (0);
} else if (action.equals ("on")) {
m.setDisplayed (1);
} else if (action.equals ("toggle")) {
m.setDisplayed (2);
} else if (action.equals ("trace")) {
m.setDisplayStyle (astex.model.Molecule.Trace);
} else if (action.equals ("tracealways")) {
m.setDisplayStyle (astex.model.Molecule.TraceAlways);
} else if (action.equals ("normal")) {
m.setDisplayStyle (astex.model.Molecule.Normal);
} else {
System.out.println ("molecule display: unknown option " + action);
return 1;
}}}
return 0;
}, "~S,~S");
Clazz.defineMethod (c$, "expandSelection", 
function (molecule, inSphere) {
var atomCount = molecule.getAtomCount ();
for (var a = 0; a < atomCount; a++) {
var atom = molecule.getAtom (a);
var id = atom.getId ();
if (inSphere[id] == 1) {
var bondCount = atom.getBondCount ();
for (var b = 0; b < bondCount; b++) {
var bondedAtom = atom.getBondedAtom (b);
var bondedId = bondedAtom.getId ();
inSphere[bondedId] = 2;
}
}}
}, "astex.model.Molecule,~A");
Clazz.defineMethod (c$, "expandSelection1", 
function (molecule, inSphere) {
for (var c = 0; c < molecule.getChainCount (); c++) {
var chain = molecule.getChain (c);
var residueCount = chain.getResidueCount ();
for (var r = 0; r < residueCount; r++) {
var residue = chain.getResidue (r);
var atomCount = residue.getAtomCount ();
var residueSelected = false;
for (var a = 0; a < atomCount; a++) {
var atom = residue.getAtom (a);
var id = atom.getId ();
if (inSphere[id] != 0) {
residueSelected = true;
break;
}}
if (residueSelected) {
for (var a = 0; a < atomCount; a++) {
var atom = residue.getAtom (a);
var id = atom.getId ();
inSphere[id] = 1;
}
}}
}
}, "astex.model.Molecule,~A");
Clazz.defineMethod (c$, "determineSymmetry", 
function () {
if (this.symmetry == null) {
for (var m = 0; m < this.getMoleculeCount (); m++) {
var molecule = this.getMolecule (m);
var moleculeSymmetry = molecule.getSymmetry ();
if (moleculeSymmetry != null) {
this.symmetry = moleculeSymmetry;
break;
}}
}});
Clazz.defineMethod (c$, "handleSelectionCommand", 
function (command, args) {
}, "~S,astex.util.Arguments");
Clazz.defineMethod (c$, "popSelection", 
function () {
var atoms = null;
var selectionStackSize = this.selectionStack.size ();
if (selectionStackSize > 0) {
atoms = this.selectionStack.getReverse (0);
this.selectionStack.removeElement (selectionStackSize - 1);
} else {
astex.util.Log.warn ("can't pop, stack is empty");
}return (atoms == null ?  new astex.util.DynamicArray () : atoms);
});
Clazz.defineMethod (c$, "pushSelection", 
function () {
var iterator = this.getAtomIterator ();
this.selectedAtoms =  new astex.util.DynamicArray ();
while (iterator.hasMoreElements ()) {
var atom = iterator.getNextAtom ();
if (atom.isSelected ()) {
this.selectedAtoms.add (atom);
atom.setSelected (false);
}}
this.selectionStack.add (this.atoms);
});
Clazz.defineMethod (c$, "peekSelection", 
function (i) {
var atoms = null;
var selectionStackSize = this.selectionStack.size ();
if (i < selectionStackSize) {
atoms = this.selectionStack.getReverse (i);
} else {
astex.util.Log.warn ("can't peek selection " + i + ": stack is only " + selectionStackSize + " deep");
}return (atoms == null ?  new astex.util.DynamicArray () : atoms);
}, "~N");
Clazz.defineMethod (c$, "getAtomsInSelection", 
function (expression) {
var selectedAtoms =  new astex.util.DynamicArray ();
var residueExpressions = astex.io.FILE.split (expression, " ");
for (var i = 0; i < residueExpressions.length; i++) {
var thisSelection = this.getAtomsInResidue (residueExpressions[i]);
var thisSelectionCount = thisSelection.size ();
for (var j = 0; j < thisSelectionCount; j++) {
selectedAtoms.add (thisSelection.get (j));
}
}
return selectedAtoms;
}, "~S");
Clazz.defineMethod (c$, "getAtomsInResidue", 
function (residueSpecification) {
var selectedAtoms =  new astex.util.DynamicArray ();
var chainName = null;
var stopResidueNumber = null;
var startResidueNumber = null;
var residueRangeCount = 0;
var atomNameCount = 0;
var atomNames = null;
var residueString = null;
var remainder = null;
var moleculeName = null;
var radius = -1.0;
if (residueSpecification.equalsIgnoreCase ("current")) {
selectedAtoms.setArray (this.getSelectedAtoms ().getArray (), this.getSelectedAtoms ().size ());
return selectedAtoms;
} else if (residueSpecification.equalsIgnoreCase ("all")) {
var iterator = this.getAtomIterator ();
while (iterator.hasMoreElements ()) {
var atom = iterator.getNextAtom ();
selectedAtoms.add (atom);
}
return selectedAtoms;
}var colonTokens = astex.io.FILE.split (residueSpecification, ":");
if (residueSpecification.startsWith ("id:") && colonTokens.length == 3) {
var moleculeCount = this.getMoleculeCount ();
var molName = colonTokens[1];
var idSelection =  new astex.util.DynamicArray ();
for (var i = 0; i < moleculeCount; i++) {
var molecule = this.getMolecule (i);
if (molName.equals (molecule.getName ())) {
var idTokens = astex.io.FILE.split (colonTokens[2], ",");
var idCount = idTokens.length;
var startId =  Clazz.newIntArray (idCount, 0);
var stopId =  Clazz.newIntArray (idCount, 0);
for (var id = 0; id < idCount; id++) {
var ids = astex.io.FILE.split (idTokens[id], "-");
startId[id] = astex.io.FILE.readInteger (ids[0]);
if (ids.length == 1) {
stopId[id] = startId[id];
} else if (ids.length == 2) {
stopId[id] = astex.io.FILE.readInteger (ids[1]);
}}
var atomCount = molecule.getAtomCount ();
for (var a = 0; a < atomCount; a++) {
var atom = molecule.getAtom (a);
var atomId = atom.getId ();
for (var id = 0; id < idCount; id++) {
if (atomId >= startId[id] && atomId <= stopId[id]) {
idSelection.add (atom);
break;
}}
}
}}
return idSelection;
}if (this.debug) {
System.out.println ("colonTokens.length " + colonTokens.length);
for (var i = 0; i < colonTokens.length; i++) {
System.out.println ("token " + colonTokens[i]);
}
}if (colonTokens.length == 1) {
remainder = colonTokens[0];
} else if (colonTokens.length == 2) {
chainName = colonTokens[0];
remainder = colonTokens[1];
} else if (colonTokens.length == 3) {
moleculeName = colonTokens[0];
chainName = colonTokens[1];
remainder = colonTokens[2];
} else if (colonTokens.length == 4) {
radius = astex.io.FILE.readDouble (colonTokens[0]);
moleculeName = colonTokens[1];
chainName = colonTokens[2];
remainder = colonTokens[3];
}var dotTokens = astex.io.FILE.split (remainder, ".");
residueString = dotTokens[0];
if (dotTokens.length == 2) {
atomNames = astex.io.FILE.split (dotTokens[1], ",");
atomNameCount = atomNames.length;
}if (residueString != null) {
if (residueString.equals ("*") || residueString.equals ("")) {
} else {
var residueRanges = astex.io.FILE.split (residueString, ",");
residueRangeCount = residueRanges.length;
startResidueNumber =  Clazz.newIntArray (residueRangeCount, 0);
stopResidueNumber =  Clazz.newIntArray (residueRangeCount, 0);
for (var i = 0; i < residueRangeCount; i++) {
var residueTokens = astex.io.FILE.split (residueRanges[i], "-");
startResidueNumber[i] = astex.io.FILE.readInteger (residueTokens[0]);
if (residueTokens.length == 2) {
stopResidueNumber[i] = astex.io.FILE.readInteger (residueTokens[1]);
} else {
stopResidueNumber[i] = startResidueNumber[i];
}}
}}if (chainName != null) {
chainName = chainName.$replace ('^', ' ');
if (chainName.equals ("*") || chainName.equals ("")) {
chainName = null;
}}if (moleculeName != null) {
if (moleculeName.equals ("")) {
moleculeName = null;
}}if (this.debug) {
System.out.println ("radius " + radius);
System.out.println ("moleculeName " + moleculeName);
System.out.println ("chainName " + moleculeName);
System.out.println ("remainder " + remainder);
}for (var m = 0; m < this.getMoleculeCount (); m++) {
var molecule = this.getMolecule (m);
var chainCount = molecule.getChainCount ();
if (moleculeName == null || this.moleculeMatches (moleculeName, molecule)) {
for (var c = 0; c < chainCount; c++) {
var chain = molecule.getChain (c);
var residueCount = chain.getResidueCount ();
if (chainName == null || astex.util.Mmatch.matches (chainName, chain.getName ())) {
for (var r = 0; r < residueCount; r++) {
var residue = chain.getResidue (r);
var residueNumber = residue.getNumber ();
var residueMatch = 0;
if (residueRangeCount == 0) {
residueMatch = 1;
} else {
for (var i = 0; i < residueRangeCount; i++) {
if (residueNumber >= startResidueNumber[i] && residueNumber <= stopResidueNumber[i]) {
residueMatch = 1;
break;
}}
}if (residueMatch == 1) {
var atomCount = residue.getAtomCount ();
for (var a = 0; a < atomCount; a++) {
var atom = residue.getAtom (a);
var matchedAtom = 0;
if (atomNameCount == 0) {
matchedAtom = 1;
} else {
for (var i = 0; i < atomNameCount; i++) {
if (astex.util.Mmatch.matches (atomNames[i], atom.getAtomLabel ())) {
matchedAtom = 1;
break;
}}
}if (matchedAtom == 1) {
selectedAtoms.add (atom);
}}
}}
}}
}}
if (radius > 0.0) {
var radiusSq = radius * radius;
var radiusSelection =  new astex.util.DynamicArray ();
var iterator = this.getAtomIterator ();
var selectedAtomCount = selectedAtoms.size ();
while (iterator.hasMoreElements ()) {
var atom = iterator.getNextAtom ();
for (var i = 0; i < selectedAtomCount; i++) {
var selectedAtom = selectedAtoms.get (i);
if (atom.distanceSq (selectedAtom) < radiusSq) {
radiusSelection.add (atom);
}}
}
return radiusSelection;
}return selectedAtoms;
}, "~S");
Clazz.defineMethod (c$, "getAtomsInSphere", 
function (c, r) {
var selectedAtoms =  new astex.util.DynamicArray ();
var rSq = r * r;
var moleculeCount = this.getMoleculeCount ();
for (var m = 0; m < moleculeCount; m++) {
var molecule = this.getMolecule (m);
var atomCount = molecule.getAtomCount ();
for (var a = 0; a < atomCount; a++) {
var atom = molecule.getAtom (a);
if (atom.distanceSq (c) < rSq) {
selectedAtoms.add (atom);
}}
}
return selectedAtoms;
}, "astex.util.Point3d,~N");
Clazz.defineMethod (c$, "getAtomsAroundSelection", 
function (selection, radius, include) {
var newSelection =  new astex.util.DynamicArray ();
var selectionCenter = this.getCenter (selection);
if (selectionCenter != null) {
var selectionRadius = this.getRadiusCentered (selection, selectionCenter);
var sphereSelection = this.getAtomsInSphere (selectionCenter, selectionRadius + radius);
var sphereSelectionCount = sphereSelection.size ();
var selectionCount = selection.size ();
var selectionArray = selection.getArray ();
var radiusSq = radius * radius;
for (var i = 0; i < sphereSelectionCount; i++) {
var atom = sphereSelection.get (i);
if (include == false || selection.contains (atom) == false) {
for (var a = 0; a < selectionCount; a++) {
var selectedAtom = selectionArray[a];
if (atom.distanceSq (selectedAtom) < radiusSq) {
newSelection.add (atom);
break;
}}
}}
}return newSelection;
}, "astex.util.DynamicArray,~N,~B");
Clazz.defineMethod (c$, "getAtomsInLigandsSelected", 
function (selectedAtoms) {
var atomIterator = this.getAtomIterator ();
while (atomIterator.hasMoreElements ()) {
var atom = atomIterator.getNextAtom ();
var residue = atom.getResidue ();
if (residue.isStandardAminoAcid () == false && residue.isModifiedAminoAcid () == false && residue.isIon () == false && residue.isNucleicAcid () == false && residue.isModifiedNucleicAcid () == false && residue.isSolvent () == false && atom.getBondCount () > 0) {
selectedAtoms.add (atom);
}}
}, "astex.util.DynamicArray");
Clazz.defineMethod (c$, "getAtomsInLigands", 
function () {
var dynamicArray =  new astex.util.DynamicArray ();
this.getAtomsInLigandsSelected (dynamicArray);
return dynamicArray;
});
Clazz.defineMethod (c$, "getSelectedAtomCount", 
function () {
var iterator = this.getAtomIterator ();
var selectedAtomCount = 0;
while (iterator.hasMoreElements ()) {
var atom = iterator.getNextAtom ();
if (atom.isSelected ()) {
selectedAtomCount++;
}}
return selectedAtomCount;
});
Clazz.defineMethod (c$, "getSelectedAtoms", 
function () {
return this.getSomeAtoms (true, false);
});
Clazz.defineMethod (c$, "getLabelledAtoms", 
function () {
return this.getSomeAtoms (false, true);
});
Clazz.defineMethod (c$, "getSelectedOrLabelledAtoms", 
function () {
return this.getSomeAtoms (true, true);
});
Clazz.defineMethod (c$, "getSomeAtoms", 
function (selected, labelled) {
var selectedAtoms =  new astex.util.DynamicArray ();
var atomIterator = this.getAtomIterator ();
while (atomIterator.hasMoreElements ()) {
var atom = atomIterator.getNextAtom ();
if ((labelled && atom.isLabelled ()) || (selected && atom.isSelected ())) {
selectedAtoms.add (atom);
}}
return selectedAtoms;
}, "~B,~B");
Clazz.defineMethod (c$, "getSelectedResidues", 
function (selectedAtoms) {
var selectedResidues =  new astex.util.DynamicArray ();
if (selectedAtoms == null) selectedAtoms = this.getSelectedAtoms ();
var lastResidue = null;
for (var i = selectedAtoms.size (); --i >= 0; ) {
var residue = (selectedAtoms.get (i)).getResidue ();
if (residue !== lastResidue) {
selectedResidues.add (residue);
lastResidue = residue;
}}
return selectedResidues;
}, "astex.util.DynamicArray");
Clazz.defineMethod (c$, "setSelected", 
function (selection, mode) {
for (var i = selection.size (); --i >= 0; ) {
var a = selection.get (i);
a.setSelected (mode == 1 || mode == 2 && !a.isSelected ());
}
if (this.displayBumps) {
var selectedAtoms = this.getSelectedAtoms ();
this.generateBumps (selectedAtoms);
}}, "astex.util.DynamicArray,~N");
Clazz.defineMethod (c$, "getCenter", 
function (selection) {
var atomCount = selection.size ();
if (atomCount > 0) {
var center =  new astex.util.Point3d ();
for (var a = 0; a < atomCount; a++) {
var atom = selection.get (a);
center.add (atom);
}
center.divide (atomCount);
return center;
}return null;
}, "astex.util.DynamicArray");
Clazz.defineMethod (c$, "getRadius", 
function (selection) {
return this.getRadiusCentered (selection, null);
}, "astex.util.DynamicArray");
Clazz.defineMethod (c$, "getRadiusCentered", 
function (selection, center) {
var radius = 0.0;
var atomCount = selection.size ();
if (atomCount > 0) {
if (center == null) {
center = this.getCenter (selection);
}for (var a = 0; a < atomCount; a++) {
var atom = selection.get (a);
var distance = center.distance (atom);
if (distance > radius) {
radius = distance;
}}
}return radius;
}, "astex.util.DynamicArray,astex.util.Point3d");
Clazz.defineMethod (c$, "resetWideBonds", 
function () {
var moleculeCount = this.getMoleculeCount ();
for (var m = 0; m < moleculeCount; m++) {
var molecule = this.getMolecule (m);
var bondCount = molecule.getBondCount ();
for (var b = 0; b < bondCount; b++) {
var bond = molecule.getBond (b);
bond.setBondWidth (1);
}
}
});
Clazz.defineMethod (c$, "inSameplanarRing", 
function (atom1, atom2) {
var moleculeCount = this.getMoleculeCount ();
for (var m = 0; m < moleculeCount; m++) {
var molecule = this.getMolecule (m);
var ringCount = molecule.getRingCount ();
for (var r = 0; r < ringCount; r++) {
var ring = molecule.getRing (r);
if (ring.getBondCount () == 6) {
if (ring.contains (atom1) && ring.contains (atom2)) {
if (ring.isPlanar ()) {
return true;
}}}}
}
return false;
}, "astex.model.Atom,astex.model.Atom");
Clazz.defineMethod (c$, "setCenter", 
function (x, y, z) {
var newCenter = astex.util.Point3d.new3 (x, y, z);
this.setCenter (newCenter);
}, "~N,~N,~N");
Clazz.defineMethod (c$, "setCenter", 
function (newCenter) {
this.setCenter (newCenter, true);
}, "astex.util.Point3d");
Clazz.defineMethod (c$, "setCenter", 
function (newCenter, setClipping) {
this.renderer.setCenter (newCenter);
if (setClipping) {
this.setRadius (this.displayRadius);
this.setClip (this.displayRadius);
}this.generateMaps ();
this.generateSymmetry ();
}, "astex.util.Point3d,~B");
Clazz.defineMethod (c$, "setCenter", 
function (selectedAtoms) {
var center = this.getCenter (selectedAtoms);
if (center != null) {
this.setCenter (center);
var radius = this.getRadius (selectedAtoms);
this.setClip (radius);
this.setRadius (radius);
this.renderer.setZoom (1.0);
}}, "astex.util.DynamicArray");
Clazz.defineMethod (c$, "setCenter", 
function (label) {
var tmp = label.$plit (" ");
if (tmp.length < 10) return;
var realLabel = tmp[1] + ":" + tmp[3] + ":" + tmp[6] + ":" + tmp[9];
var graphicalObjectCount = this.getGraphicalObjectCount ();
for (var i = 0; i < graphicalObjectCount; i++) {
var tm = this.getGraphicalObjectI (i);
if (!tm.isSelectable) continue;
if (!tm.isVisible ()) continue;
for (var p = 0; p < tm.np; p++) {
if (realLabel.equals (tm.labels[p])) {
var center = astex.util.Point3d.new3 (tm.x[p], tm.y[p], tm.z[p]);
this.setCenter (center);
this.setRadius (20.0);
this.setClip (20.0);
return;
}}
}
}, "~S");
Clazz.defineMethod (c$, "setDisplayBumps", 
function (state) {
this.displayBumps = state;
if (this.displayBumps == false) {
this.removeAllBumpAtoms ();
} else {
var selectedAtoms = this.getSelectedAtoms ();
this.generateBumps (selectedAtoms);
}if (this.viewer != null) {
this.viewer.updateDisplayItemFromCommand ("Bumps", this.displayBumps);
}}, "~B");
Clazz.defineMethod (c$, "setBumpInSameMolecule", 
function (b) {
this.bumpInSameMolecule = b;
}, "~B");
Clazz.defineMethod (c$, "setDisplayAxes", 
function (state) {
this.displayAxes = state;
if (this.viewer != null) {
this.viewer.updateDisplayItemFromCommand ("Axes", this.displayAxes);
}}, "~B");
Clazz.defineMethod (c$, "setDisplayDistances", 
function (d) {
this.displayDistances = d;
}, "~B");
Clazz.defineMethod (c$, "getDisplayDistances", 
function () {
return this.displayDistances;
});
Clazz.defineMethod (c$, "getDisplayBumps", 
function () {
return this.displayBumps;
});
Clazz.defineMethod (c$, "setDisplaySolvent", 
function (state) {
this.displaySolvent = state;
if (this.viewer != null) {
this.viewer.updateDisplayItemFromCommand ("Solvent", this.displaySolvent);
}}, "~B");
Clazz.defineMethod (c$, "setWideBonds", 
function () {
var mapRadiusSq = this.mapRadius * this.mapRadius;
var rendererCenter = this.renderer.getCenter ();
var moleculeCount = this.getMoleculeCount ();
for (var m = 0; m < moleculeCount; m++) {
var molecule = this.getMolecule (m);
var bondCount = molecule.getBondCount ();
for (var b = 0; b < bondCount; b++) {
var bond = molecule.getBond (b);
var firstAtom = bond.getFirstAtom ();
var secondAtom = bond.getSecondAtom ();
if (firstAtom.distanceSq (rendererCenter) < mapRadiusSq && secondAtom.distanceSq (rendererCenter) < mapRadiusSq) {
bond.setWideBond (true);
} else {
bond.setWideBond (false);
}}
}
});
Clazz.defineMethod (c$, "getBondsInSelection", 
function (selectedAtoms) {
var selectedBonds =  new astex.util.DynamicArray ();
var iterator = this.getAtomIterator ();
while (iterator.hasMoreElements ()) {
var atom = iterator.getNextAtom ();
atom.setTemporarilySelected (false);
}
var selectedAtomCount = selectedAtoms.size ();
for (var i = 0; i < selectedAtomCount; i++) {
var a = selectedAtoms.get (i);
a.setTemporarilySelected (true);
}
for (var m = 0; m < this.getMoleculeCount (); m++) {
var molecule = this.getMolecule (m);
var bondCount = molecule.getBondCount ();
for (var b = 0; b < bondCount; b++) {
var bond = molecule.getBond (b);
var firstAtom = bond.getFirstAtom ();
var secondAtom = bond.getSecondAtom ();
if (firstAtom.isTemporarilySelected () && secondAtom.isTemporarilySelected ()) {
selectedBonds.add (bond);
}}
}
return selectedBonds;
}, "astex.util.DynamicArray");
Clazz.defineMethod (c$, "setWideBondsA", 
function (selectedAtoms) {
this.resetWideBonds ();
var selectedAtomCount = selectedAtoms.size ();
for (var a = 0; a < selectedAtomCount; a++) {
var atom = selectedAtoms.get (a);
atom.setTemporarilySelected (true);
}
for (var a = 0; a < selectedAtomCount; a++) {
var atom = selectedAtoms.get (a);
var bondCount = atom.getBondCount ();
if (atom.isTemporarilySelected ()) {
for (var b = 0; b < bondCount; b++) {
var bond = atom.getBondI (b);
var otherAtom = bond.getOtherAtom (atom);
if (otherAtom.isTemporarilySelected ()) {
bond.setBondWidth (2);
}}
}}
for (var a = 0; a < selectedAtomCount; a++) {
var atom = selectedAtoms.get (a);
atom.setTemporarilySelected (false);
}
}, "astex.util.DynamicArray");
Clazz.defineMethod (c$, "addContourLevel", 
function (level, color, display, style) {
if (this.contourLevelCount == astex.render.MoleculeRenderer.MaximumContourLevels) {
System.out.println ("maximum number of contour levels exceeded");
return;
}this.contourLevels[this.contourLevelCount] = level;
this.contourColors[this.contourLevelCount] = color;
this.contourStyles[this.contourLevelCount] = style;
this.contourDisplayed[this.contourLevelCount] = display;
this.contourLevelCount++;
}, "~N,~N,~B,~N");
Clazz.defineMethod (c$, "resetContourLevels", 
function () {
this.contourLevelCount = 0;
});
Clazz.defineMethod (c$, "createSymmetricMolecule", 
function (molname, symmolname, symopnum, ix, iy, iz) {
System.out.println ("hello createSymmetricMolecule " + molname + " " + symmolname + " " + symopnum);
this.determineSymmetry ();
var symmetryMolecule =  new astex.model.Molecule ();
symmetryMolecule.setName (symmolname);
var molecule = null;
for (var mi = 0; mi < this.getMoleculeCount (); mi++) if (this.getMolecule (mi).getName ().equals (molname)) molecule = this.getMolecule (mi);

if (molecule == null) return null;
var moleculeCenter = molecule.getCenter ();
var fractionalCenter = astex.util.Point3d.newP (molecule.getCenter ());
var atomCount = molecule.getAtomCount ();
var oldIds =  Clazz.newIntArray (atomCount, 0);
for (var a = 0; a < atomCount; a++) {
var atom = molecule.getAtom (a);
oldIds[a] = atom.getId ();
}
molecule.assignAtomNumbers ();
var cartesianToFractional = this.symmetry.getCartesianToFractionalMatrix ();
var fractionalToCartesian = this.symmetry.getFractionalToCartesianMatrix ();
fractionalCenter.transform (cartesianToFractional);
var originx = Clazz.doubleToInt (fractionalCenter.x);
if (fractionalCenter.x < 0.0) originx -= 1;
var originy = Clazz.doubleToInt (fractionalCenter.y);
if (fractionalCenter.y < 0.0) originy -= 1;
var originz = Clazz.doubleToInt (fractionalCenter.z);
if (fractionalCenter.z < 0.0) originz -= 1;
var symmetryOperators = this.symmetry.getSymmetryOperators ();
var currentCenter =  new astex.util.Point3d ();
var operatorCount = symmetryOperators.size ();
var currentTransform =  new astex.util.Matrix ();
var startOperator = 0;
if (ix == 0 && iy == 0 && iz == 0) {
startOperator = 1;
}for (var s = startOperator; s < operatorCount; s++) {
if (s != symopnum) continue;
var operator = symmetryOperators.get (s);
currentTransform.setIdentity ();
currentTransform.transform (cartesianToFractional);
currentTransform.translate (-originx, -originy, -originz);
currentTransform.transform (operator);
currentTransform.translate (ix, iy, iz);
currentTransform.translate (originx, originy, originz);
currentTransform.transform (fractionalToCartesian);
currentCenter.setP (moleculeCenter);
currentCenter.transform (currentTransform);
this.addSymmetryAtoms_1 (molecule, currentTransform, symmetryMolecule);
}
symmetryMolecule.autoBond ();
for (var a = 0; a < atomCount; a++) {
var atom = molecule.getAtom (a);
atom.setId (oldIds[a]);
}
this.addMolecule (symmetryMolecule);
return symmetryMolecule;
}, "~S,~S,~N,~N,~N,~N");
Clazz.defineMethod (c$, "generateSymmetry", 
function () {
this.removeSymmetry ();
var symmetry = this.generateSymmetry (this.renderer.getCenter (), this.symmetryRadius);
if (symmetry != null) {
if (this.mapBehaviourMode == 1) {
this.assignSymmetryAtomColors (symmetry);
}this.addMolecule (symmetry);
}});
Clazz.defineMethod (c$, "removeSymmetry", 
function () {
this.removeMolecule ("Symmetry");
});
Clazz.defineMethod (c$, "assignSymmetryAtomColors", 
function (molecule) {
var atomCount = molecule.getAtomCount ();
for (var a = 0; a < atomCount; a++) {
var atom = molecule.getAtom (a);
if (atom.getElement () == 6) {
atom.setColor (0xaaaaaa);
}}
}, "astex.model.Molecule");
Clazz.defineMethod (c$, "paint", 
function () {
if (!this.dirty) {
return;
}var passCount = 1;
if (this.shadows) {
passCount = 2;
this.renderPasses[0] = 1;
this.renderPasses[1] = 2;
} else {
passCount = 1;
this.renderPasses[0] = 0;
}for (var i = 0; i < passCount; i++) {
this.renderer.shadowMode = this.renderPasses[i];
this.renderer.redraw ();
if (this.getMoleculeCount () != 0) {
this.drawMolecules ();
}this.drawAxes ();
this.renderer.drawObjects ();
if (this.displayRdcAxes) {
for (var j = 0; j < this.getMoleculeCount (); j++) {
this.renderer.drawRdcAxes (this.getMolecule (j));
}
}this.drawMaps ();
this.renderer.postProcess ();
}
this.dirty = false;
if (this.viewer.movieId != null) {
try {
var base64 = this.getRenderedImageString (1, "png");
System.err.println ("SIZE " + base64.length);
this.viewer.postMovieFrame (base64, this.framenum++, this.viewer.movieId);
System.err.println ("RANDOM " + this.rgen.nextInt ());
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
System.out.println ("Error creating image " + e);
} else {
throw e;
}
}
}});
Clazz.defineMethod (c$, "drawAxes", 
 function () {
if (this.displayAxes) {
var a = 600.0;
var label = 200.0;
var ticks = [-500.0, -100.0, -10.0, 10.0, 100.0, 500.0];
var tickStr = ["-500", "-100", "-10", "10", "100", "500"];
this.drawLineD (-a, .0, .0, a, .0, .0, astex.util.Color32.yellow, astex.util.Color32.yellow, 1);
this.drawLineD (.0, -a, .0, .0, a, .0, astex.util.Color32.yellow, astex.util.Color32.yellow, 1);
this.drawLineD (.0, .0, -a, .0, .0, a, astex.util.Color32.yellow, astex.util.Color32.yellow, 1);
for (var i = 0; i < ticks.length; i++) {
this.renderer.drawStringZoff (ticks[i], .0, .0, .0, astex.util.Color32.yellow, tickStr[i]);
this.renderer.drawStringZoff (.0, ticks[i], .0, .0, astex.util.Color32.yellow, tickStr[i]);
this.renderer.drawStringZoff (.0, .0, ticks[i], .0, astex.util.Color32.yellow, tickStr[i]);
}
this.renderer.drawStringZoff (label, .0, .0, .0, astex.util.Color32.yellow, "X");
this.renderer.drawStringZoff (.0, label, .0, .0, astex.util.Color32.yellow, "Y");
this.renderer.drawStringZoff (.0, .0, label, .0, astex.util.Color32.yellow, "Z");
this.renderer.drawStringZoff (-label, .0, .0, .0, astex.util.Color32.yellow, "-X");
this.renderer.drawStringZoff (.0, -label, .0, .0, astex.util.Color32.yellow, "-Y");
this.renderer.drawStringZoff (.0, .0, -label, .0, astex.util.Color32.yellow, "-Z");
}});
Clazz.defineMethod (c$, "initialiseCenter", 
function () {
if (this.getMoleculeCount () == 0) {
if (this.getMapCount () > 0) this.centerMap (null);
} else {
var xmin = 1.7976931348623157E308;
var xmax = -1.7976931348623157E308;
var ymin = 1.7976931348623157E308;
var ymax = -1.7976931348623157E308;
var zmin = 1.7976931348623157E308;
var zmax = -1.7976931348623157E308;
var center =  new astex.util.Point3d ();
for (var m = 0; m < this.getMoleculeCount (); m++) {
var molecule = this.getMolecule (m);
for (var a = 0; a < molecule.getAtomCount (); a++) {
var atom = molecule.getAtom (a);
if (atom.isSolvent () == false) {
var x = atom.getX ();
var y = atom.getY ();
var z = atom.getZ ();
if (x < xmin) xmin = x;
if (y < ymin) ymin = y;
if (z < zmin) zmin = z;
if (x > xmax) xmax = x;
if (y > ymax) ymax = y;
if (z > zmax) zmax = z;
}}
var xCenter = 0.5 * (xmin + xmax);
var yCenter = 0.5 * (ymin + ymax);
var zCenter = 0.5 * (zmin + zmax);
center.set (xCenter, yCenter, zCenter);
}
this.renderer.setCenter (center);
if (this.renderer.getRadius () == 0.0) {
var radius = 0.0;
var moleculeCenter = this.renderer.getCenter ();
for (var m = 0; m < this.getMoleculeCount (); m++) {
var molecule = this.getMolecule (m);
for (var a = 0; a < molecule.getAtomCount (); a++) {
var atom = molecule.getAtom (a);
if (atom.isSolvent () == false) {
var distance = atom.distance (moleculeCenter);
if (distance > radius) {
radius = distance;
}}}
}
this.setClip (radius);
radius *= 1.05;
this.setRadius (radius);
}}});
Clazz.defineMethod (c$, "resetTransformationMatrix", 
function () {
this.renderer.rotationMatrix.setIdentity ();
});
Clazz.defineMethod (c$, "resetView", 
function () {
this.renderer.resetCenterAndRadius ();
this.initialiseCenter ();
this.resetTransformationMatrix ();
this.renderer.setZoom (1.0);
});
Clazz.defineMethod (c$, "printMatrix", 
function () {
this.renderer.rotationMatrix.print ("matrix");
var command = "animate\n\t-mode\t\trecenter\n\t-matrix\t\t\"";
var m = this.renderer.rotationMatrix;
command += astex.io.FILE.sprintD ("%g", m.x00) + astex.io.FILE.sprintD (",%g", m.x01);
command += astex.io.FILE.sprintD (",%g", m.x02) + astex.io.FILE.sprintD (",%g", m.x03);
command += astex.io.FILE.sprintD (",%g", m.x10) + astex.io.FILE.sprintD (",%g", m.x11);
command += astex.io.FILE.sprintD (",%g", m.x12) + astex.io.FILE.sprintD (",%g", m.x13);
command += astex.io.FILE.sprintD (",%g", m.x20) + astex.io.FILE.sprintD (",%g", m.x21);
command += astex.io.FILE.sprintD (",%g", m.x22) + astex.io.FILE.sprintD (",%g", m.x23);
command += astex.io.FILE.sprintD (",%g", m.x30) + astex.io.FILE.sprintD (",%g", m.x31);
command += astex.io.FILE.sprintD (",%g", m.x32) + astex.io.FILE.sprintD (",%g", m.x33);
var p = this.renderer.getCenter ();
command += "\"\n\t-center\t\t\"";
command += astex.io.FILE.sprintD ("%g,", p.x);
command += astex.io.FILE.sprintD ("%g,", p.y);
command += astex.io.FILE.sprintD ("%g", p.z);
command += "\"\n";
command += astex.io.FILE.sprintD ("\t-radius\t\t%g\n", (this.renderer.width / this.renderer.zoom));
command += astex.io.FILE.sprintD ("\t-clipfront\t%g\n", this.renderer.front);
command += astex.io.FILE.sprintD ("\t-clipback\t%g\n", this.renderer.back);
command += "\t-steps\t\t10\n";
command += "\t;\n";
System.out.println ("\nCut and paste the command below to recreate the current view");
System.out.println ("Make sure you include the ;\n");
System.out.println (command);
});
Clazz.defineMethod (c$, "transformMolecule", 
function () {
this.renderer.buildOverallMatrix ();
var crossPixels = Clazz.doubleToInt (astex.render.MoleculeRenderer.crossLength * this.renderer.getOverallScale ());
var boxPixels = Clazz.doubleToInt (astex.render.MoleculeRenderer.boxSize * this.renderer.getOverallScale ());
if (boxPixels == 0) {
boxPixels = 1;
}this.sphereAtoms.removeAllElements ();
for (var m = 0; m < this.getMoleculeCount (); m++) {
var molecule = this.getMolecule (m);
var displayHydrogens = molecule.getBoolean ("hydrogens", false);
if (molecule.getDisplayed ()) {
var style = molecule.getDisplayStyle ();
var normal = (style & astex.model.Molecule.Normal) > 0;
var chainCount = molecule.getChainCount ();
for (var c = 0; c < chainCount; c++) {
var chain = molecule.getChain (c);
var residueCount = chain.getResidueCount ();
for (var r = 0; r < residueCount; r++) {
var res = chain.getResidue (r);
var atomCount = res.getAtomCount ();
for (var a = 0; a < atomCount; a++) {
var atom = res.getAtom (a);
if (displayHydrogens || atom.getElement () != 1) {
atom.transformToScreen (this.renderer.overallMatrix);
if ((atom.attributes & astex.model.Atom.VDWSphere) != 0) {
this.sphereAtoms.add (atom);
}if ((atom.attributes & astex.model.Atom.BallAndStick) != 0) {
this.renderer.drawSphere (atom.x, atom.y, atom.z, atom.getBallRadius (), atom.getSelectedColor ());
}if ((atom.attributes & astex.model.Atom.Cylinder) != 0 && atom.getBondCount () == 0) {
this.renderer.drawAccurateSphere (atom.x, atom.y, atom.z, atom.getBallRadius (), atom.getSelectedColor (), 255);
}if ((atom.attributes & 4194304) != 0) {
this.renderer.drawCross (atom.x, atom.y, atom.z, crossPixels, atom.isBackbone ());
}if (atom.isSimpleDisplayed ()) {
if (normal && atom.getBondCount () == 0) {
this.drawAtom (atom, crossPixels);
}if (atom.hasAttributes ()) {
if (atom.isLabelled () && this.displayAtomLabel) {
var color = astex.util.Color32.white;
if (this.renderer.getBackgroundColor () == astex.util.Color32.white) {
color = astex.util.Color32.black;
}var label = this.generateAtomLabel (atom);
var zoff = atom.getBiggestDisplayedRadius ();
this.renderer.drawStringZoff (atom.x, atom.y, atom.z, zoff, color, label);
}var format = atom.getCustomLabel ();
if (format != null) {
var color = astex.util.Color32.white;
if (this.renderer.getBackgroundColor () == astex.util.Color32.white) {
color = astex.util.Color32.black;
}var customLabel = atom.generateLabel (format);
var zoff = atom.getBiggestDisplayedRadius ();
this.renderer.drawStringZoff (atom.x, atom.y, atom.z, zoff, color, customLabel);
}if (atom.isSelected ()) {
this.renderer.drawBox (atom.xs, atom.ys, atom.zs, boxPixels, astex.util.Color32.yellow);
}}}}}
}
}
}}
if (this.sphereAtoms.size () > 0) {
this.sortSphereAtoms ();
var sphereCount = this.sphereAtoms.size ();
for (var i = 0; i < sphereCount; i++) {
var satom = this.sphereAtoms.get (i);
this.renderer.drawSphereT (satom.x, satom.y, satom.z, satom.getVDWRadius (), satom.getSelectedColor (), satom.getTransparency ());
}
}});
Clazz.defineMethod (c$, "sortSphereAtoms", 
 function () {
});
Clazz.defineMethod (c$, "drawMolecules", 
function () {
this.transformMolecule ();
for (var m = 0; m < this.getMoleculeCount (); m++) {
var molecule = this.getMolecule (m);
var displayHydrogens = molecule.getBoolean ("hydrogens", false);
if (molecule.getDisplayed ()) {
var style = molecule.getDisplayStyle ();
if ((style & astex.model.Molecule.Normal) == astex.model.Molecule.Normal) {
this.currentMolecule = molecule;
if (this.allowFastDraw) {
this.fastDraw = !molecule.getBoolean ("bondDetails", true);
} else {
this.fastDraw = true;
}var chainCount = molecule.getChainCount ();
for (var c = 0; c < chainCount; c++) {
var chain = molecule.getChain (c);
var residueCount = chain.getResidueCount ();
for (var r = 0; r < residueCount; r++) {
var res = chain.getResidue (r);
var atomCount = res.getAtomCount ();
for (var a = 0; a < atomCount; a++) {
var atom = res.getAtom (a);
var bondCount = atom.getBondCount ();
for (var b = 0; b < bondCount; b++) {
var bond = atom.getBondI (b);
var firstAtom = bond.getFirstAtom ();
if (displayHydrogens || firstAtom.getElement () != 1) {
if (atom === firstAtom) {
var secondAtom = bond.getSecondAtom ();
if (displayHydrogens || secondAtom.getElement () != 1) {
if (firstAtom.isSimpleDisplayed ()) {
if (secondAtom.isSimpleDisplayed ()) {
var w = -bond.getBondWidth ();
this.drawBond (bond, w);
}}if ((firstAtom.attributes & astex.model.Atom.Cylinder) != 0 && (secondAtom.attributes & astex.model.Atom.Cylinder) != 0) {
var w = bond.getCylinderWidth ();
this.drawBond (bond, w);
}if ((firstAtom.attributes & astex.model.Atom.BallAndStick) != 0 && (secondAtom.attributes & astex.model.Atom.BallAndStick) != 0) {
var w = bond.getStickWidth ();
this.drawSimpleBond (bond, w);
}}}}}
}
}
}
}if ((style & astex.model.Molecule.Trace) == astex.model.Molecule.Trace) {
this.drawTrace (molecule);
}}}
this.drawBumpPairs ();
this.drawDistances ();
this.drawAngles ();
this.drawTorsions ();
this.drawHbonds ();
});
Clazz.defineMethod (c$, "drawTorsionByID", 
function (chain1, residue1, atom1, chain2, residue2, atom2, chain3, residue3, atom3, chain4, residue4, atom4, model, violation) {
var a1 = this.getAtomFromIds (chain1, residue1, atom1, model);
var a2 = this.getAtomFromIds (chain2, residue2, atom2, model);
var a3 = this.getAtomFromIds (chain3, residue3, atom3, model);
var a4 = this.getAtomFromIds (chain4, residue4, atom4, model);
if (a1 == null) {
return;
}if (a2 == null) {
return;
}if (a3 == null) {
return;
}if (a4 == null) {
return;
}var color = astex.util.Color32.green;
if (violation > 5.0) {
color = astex.util.Color32.red;
} else if (violation > 3.0) {
color = astex.util.Color32.orange;
} else if (violation > 1.0) {
color = astex.util.Color32.yellow;
}this.addTorsionColorSize (a1, a2, a3, a4, color, 0.075);
}, "~S,~N,~S,~S,~N,~S,~S,~N,~S,~S,~N,~S,~N,~N");
Clazz.defineMethod (c$, "drawTorsionPt", 
 function (g, label, a0, a1, a2, a3, lineColor, lineRadius) {
astex.util.Point3d.unitVectorP3 (this.ta01, a0, a1);
astex.util.Point3d.unitVectorP3 (this.ta12, a1, a2);
astex.util.Point3d.unitVectorP3 (this.ta23, a2, a3);
astex.util.Point3d.crossPts (this.n012, this.ta01, this.ta12);
astex.util.Point3d.crossPts (this.n123, this.ta12, this.ta23);
astex.util.Point3d.crossPts (this.p01, this.n012, this.ta12);
astex.util.Point3d.crossPts (this.p23, this.n123, this.ta12);
astex.util.Point3d.mid3 (this.m12, a1, a2);
astex.util.Point3d.crossPts (this.n, this.ta12, this.p01);
var radius = g.getDouble ("torsionRadius", 0.3);
if (true) {
var dot = radius / this.p01.dot (this.ta01);
this.renderer.drawCylinder (this.m12.x + radius * this.p01.x, this.m12.y + radius * this.p01.y, this.m12.z + radius * this.p01.z, a1.x + dot * this.ta01.x, a1.y + dot * this.ta01.y, a1.z + dot * this.ta01.z, lineColor, lineColor, lineRadius);
}if (true) {
var dot = radius / this.p23.dot (this.ta23);
this.renderer.drawCylinder (this.m12.x + radius * this.p23.x, this.m12.y + radius * this.p23.y, this.m12.z + radius * this.p23.z, a2.x + dot * this.ta23.x, a2.y + dot * this.ta23.y, a2.z + dot * this.ta23.z, lineColor, lineColor, lineRadius);
}var t = astex.util.Point3d.torsionP (a0, a1, a2, a3);
var step = g.getDouble ("torsionStep", 5.0);
step *= (0.017453292519943295);
if (t < 0.0) {
step = -step;
}var steps = 1 + Clazz.doubleToInt ((t / step) + 0.5);
var angle = 0.0;
for (var s = 0; s < steps; s++) {
var ct = Math.cos (angle);
var st = Math.sin (angle);
this.arc.x = this.m12.x + radius * (ct * this.p01.x + st * this.n.x);
this.arc.y = this.m12.y + radius * (ct * this.p01.y + st * this.n.y);
this.arc.z = this.m12.z + radius * (ct * this.p01.z + st * this.n.z);
if (s > 0) {
this.renderer.drawCylinder (this.arc.x, this.arc.y, this.arc.z, this.last.x, this.last.y, this.last.z, lineColor, lineColor, lineRadius);
}this.last.setP (this.arc);
angle += step;
}
var format = g.getString ("torsionFormat", "%t %.1f");
format = astex.util.Util.replace (format, "%t", label);
if (g.getBoolean ("torsionGreek", false)) {
format = astex.util.Util.replace (format, "chi", "\\c");
format = astex.util.Util.replace (format, "phi", "\\f");
format = astex.util.Util.replace (format, "psi", "\\y");
format = astex.util.Util.replace (format, "omega", "\\w");
}format = astex.io.FILE.sprintD (format, t * 180.0 / 3.141592653589793);
if (lineColor == astex.util.Color32.magenta) {
this.renderer.drawStringZoff (this.m12.x, this.m12.y, this.m12.z, 1.0, astex.util.Color32.white, format);
}}, "astex.generic.Generic,~S,astex.util.Point3d,astex.util.Point3d,astex.util.Point3d,astex.util.Point3d,~N,~N");
Clazz.defineMethod (c$, "drawTrace", 
function (molecule) {
var atomCount = molecule.getAtomCount ();
var previous = null;
for (var i = 0; i < atomCount; i++) {
var a = molecule.getAtom (i);
if (a.getAtomLabel ().equals ("CA")) {
if (previous != null && previous.distance (a) < 4.1 && previous.isDisplayed () && a.isDisplayed ()) {
var previousColor = previous.getColor ();
var atomColor = a.getColor ();
var width = 2;
if (previousColor == atomColor) {
this.drawLineI (previous.xs, previous.ys, previous.zs, a.xs, a.ys, a.zs, previousColor, previousColor, -width);
} else {
this.drawLineI (previous.xs, previous.ys, a.zs, a.xs, a.ys, a.zs, previousColor, atomColor, -width);
}}previous = a;
}}
}, "astex.model.Molecule");
Clazz.defineMethod (c$, "drawDistances", 
function () {
if (this.displayDistances) {
var distanceCount = this.distances.size ();
for (var i = 0; i < distanceCount; i++) {
var distance = this.distances.get (i);
this.drawDistanceObject (distance);
}
}});
Clazz.defineMethod (c$, "drawDistanceObject", 
function (distance) {
if (distance.getBoolean ("visible", true) == false) return;
if (distance.getInteger ("mode", -1) == 2) {
if (distance.valid ()) {
if (distance.group0.size () > 0) {
var g0 = distance.getCenter0 ();
var g1 = distance.getCenter1 ();
this.drawDashedLine (g0.x, g0.y, g0.z, g1.x, g1.y, g1.z, distance.getDouble ("on", 0.2), distance.getDouble ("off", 0.2), distance.getDouble ("radius", -1.0), (distance.get ("color", java.awt.Color.white)).getRGB ());
this.drawDistanceMarker (g0, g1, distance);
}}} else {
var distanceCount = distance.group0.size ();
for (var i = 0; i < distanceCount; i++) {
var g0 = distance.group0.get (i);
var g1 = distance.group1.get (i);
if (g0.isDisplayed () && g1.isDisplayed ()) {
this.drawDashedLine (g0.x, g0.y, g0.z, g1.x, g1.y, g1.z, distance.getDouble ("on", 0.2), distance.getDouble ("off", 0.2), distance.getDouble ("radius", -1.0), (distance.get ("color", java.awt.Color.white)).getRGB ());
this.drawDistanceMarker (g0, g1, distance);
}}
}}, "astex.model.Distance");
Clazz.defineMethod (c$, "drawDistanceMarker", 
 function (g0, g1, d) {
var label = d.getString ("format", null);
if (label != null) {
if (label.indexOf ('%') != -1) {
var len = g0.distance (g1);
label = astex.io.FILE.sprintD (label, len);
}var mx = 0.5 * (g0.x + g1.x);
var my = 0.5 * (g0.y + g1.y);
var mz = 0.5 * (g0.z + g1.z);
this.renderer.drawStringZoff (mx, my, mz, 0.5, (d.get ("labelcolor", java.awt.Color.white)).getRGB (), label);
}}, "astex.util.Point3d,astex.util.Point3d,astex.model.Distance");
Clazz.defineMethod (c$, "drawDashedLine", 
function (ax, ay, az, bx, by, bz, on, off, radius, color) {
this.dla.set (ax, ay, az);
this.dlb.set (bx, by, bz);
var v = astex.util.Point3d.unitVectorP2 (this.dla, this.dlb);
var len = this.dla.distance (this.dlb);
var totalDash = on + off;
var scale = (len / totalDash) / Clazz.doubleToInt (len / totalDash);
on = on * scale;
off = off * scale;
var d = 0.5 * off;
if (Math.abs (off) < 1.e-3 || Math.abs (on) < 1.e-3) {
this.drawLineD (this.dla.x, this.dla.y, this.dla.z, this.dlb.x, this.dlb.y, this.dlb.z, color, color, radius);
} else {
while ((d + on) < (len)) {
var dend = d + on;
this.drawLineD (this.dla.x + d * v.x, this.dla.y + d * v.y, this.dla.z + d * v.z, this.dla.x + dend * v.x, this.dla.y + dend * v.y, this.dla.z + dend * v.z, color, color, radius);
d += on + off;
}
}}, "~N,~N,~N,~N,~N,~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "drawDistances2", 
function () {
if (this.displayDistances) {
var distanceCount = this.distances.size ();
for (var i = 0; i < distanceCount; i++) {
var distance = this.distances.get (i);
var firstAtom = distance.getFirstAtom ();
var secondAtom = distance.getSecondAtom ();
if (firstAtom.isDisplayed () && secondAtom.isDisplayed ()) {
var firstMolecule = firstAtom.getMolecule ();
var secondMolecule = secondAtom.getMolecule ();
if (firstMolecule.getDisplayed () && secondMolecule.getDisplayed ()) {
this.drawDistanceAtoms (firstAtom, secondAtom, true);
}}}
}});
Clazz.defineMethod (c$, "drawTorsions", 
function () {
var count = this.torsions.size ();
for (var i = 0; i < count; i += 6) {
var drawTorsion = true;
for (var j = 0; j < 4; j++) {
var aa = this.torsions.get (i + j);
var mol = aa.getMolecule ();
if (aa.isDisplayed () == false || mol.getDisplayed () == false) {
drawTorsion = false;
}}
if (drawTorsion) {
var a1 = this.torsions.get (i);
var a2 = this.torsions.get (i + 1);
var a3 = this.torsions.get (i + 2);
var a4 = this.torsions.get (i + 3);
var col = (this.torsions.get (i + 4)).intValue ();
var size = (this.torsions.get (i + 5)).doubleValue ();
if (this.dummyGeneric == null) {
this.dummyGeneric =  new astex.generic.Generic ();
this.dummyGeneric.setClassname ("dummy");
}this.drawTorsionPt (this.dummyGeneric, "", a1, a2, a3, a4, col, size);
}}
});
Clazz.defineMethod (c$, "drawTorsionAtoms", 
function (a1, a2, a3, a4) {
var xm = (a1.x + a2.x + a3.x + a4.x) / 4;
var ym = (a1.y + a2.y + a3.y + a4.y) / 4;
var zm = (a1.z + a2.z + a3.z + a4.z) / 4;
var torsion = astex.util.Point3d.torsionDegreesP (a1, a2, a3, a4);
var label = this.angleFormat.format (torsion);
this.renderer.drawString (xm, ym, zm, astex.util.Color32.white, label);
}, "astex.model.Atom,astex.model.Atom,astex.model.Atom,astex.model.Atom");
Clazz.defineMethod (c$, "drawAngles", 
function () {
var count = this.angles.size ();
for (var i = 0; i < count; i += 3) {
var drawAngle = true;
for (var j = 0; j < 3; j++) {
var aa = this.angles.get (i + j);
var mol = aa.getMolecule ();
if (aa.isDisplayed () == false || mol.getDisplayed () == false) {
drawAngle = false;
}}
if (drawAngle) {
var a1 = this.angles.get (i);
var a2 = this.angles.get (i + 1);
var a3 = this.angles.get (i + 2);
this.drawAngle (a1, a2, a3);
}}
});
Clazz.defineMethod (c$, "drawAngle", 
function (a1, a2, a3) {
var xm = (a1.x + a2.x + a3.x) / 3.0;
var ym = (a1.y + a2.y + a3.y) / 3.0;
var zm = (a1.z + a2.z + a3.z) / 3.0;
var angle = astex.util.Point3d.angleDegrees (a1, a2, a3);
var label = this.angleFormat.format (angle);
this.renderer.drawString (xm, ym, zm, astex.util.Color32.yellow, label);
}, "astex.model.Atom,astex.model.Atom,astex.model.Atom");
Clazz.defineMethod (c$, "drawBumpPairs", 
function () {
var bumpPairs = this.getBumpAtoms ();
var bumpCount = bumpPairs.size ();
for (var i = 0; i < bumpCount; i += 2) {
var atom1 = bumpPairs.get (i);
var atom2 = bumpPairs.get (i + 1);
this.drawDistanceAtoms (atom1, atom2, true);
}
});
Clazz.defineMethod (c$, "drawHbonds", 
 function () {
var hbondCount = this.hbonds.size ();
for (var i = 0; i < hbondCount; i++) {
var hbond = this.hbonds.get (i);
var atom0 = hbond.getAtom (0);
var atom1 = hbond.getAtom (1);
if (atom0.isDisplayed () && atom1.isDisplayed ()) {
this.drawDistanceAtoms (atom0, atom1, false);
}}
});
Clazz.defineMethod (c$, "drawDistanceAtoms", 
function (atom1, atom2, displayDistance) {
var molecule1 = atom1.getMolecule ();
var molecule2 = atom2.getMolecule ();
if (molecule1.isDisplayStyle (astex.model.Molecule.Normal) && molecule2.isDisplayStyle (astex.model.Molecule.Normal) && molecule1.getDisplayed () && molecule2.getDisplayed ()) {
if (atom1.isDisplayed () && atom2.isDisplayed ()) {
this.drawDottedLine (atom1, atom2, 0.2, astex.util.Color32.white);
if (displayDistance) {
var xm = (atom1.x + atom2.x) / 2;
var ym = (atom1.y + atom2.y) / 2;
var zm = (atom1.z + atom2.z) / 2;
var d = atom1.distance (atom2);
var label = this.distanceFormat.format (d);
this.renderer.drawString (xm, ym, zm, astex.util.Color32.white, label);
}}}}, "astex.model.Atom,astex.model.Atom,~B");
Clazz.defineMethod (c$, "drawDottedLine", 
function (atom1, atom2, gap, color) {
var d = atom1.distance (atom2);
var current = gap;
var v12 = astex.util.Point3d.unitVectorP2 (atom1, atom2);
while (current < d) {
this.dummyAtom.set (atom1.x + v12.x * current, atom1.y + v12.y * current, atom1.z + v12.z * current);
this.dummyAtom.transformToScreen (this.renderer.overallMatrix);
this.renderer.drawDot (this.dummyAtom.xs, this.dummyAtom.ys, this.dummyAtom.zs, color);
current += gap;
}
}, "astex.model.Atom,astex.model.Atom,~N,~N");
Clazz.defineMethod (c$, "drawTwinColourDottedLine", 
function (atom1, atom2, gap, color1, color2) {
var d = atom1.distance (atom2);
var current = gap;
var v12 = astex.util.Point3d.unitVectorP2 (atom1, atom2);
while (current < d) {
this.dummyAtom.set (atom1.x + v12.x * current, atom1.y + v12.y * current, atom1.z + v12.z * current);
this.dummyAtom.transformToScreen (this.renderer.overallMatrix);
var shade = 0;
this.renderer.setPixel4 (this.dummyAtom.xs, this.dummyAtom.ys, this.dummyAtom.zs, shade);
current += gap;
}
}, "astex.model.Atom,astex.model.Atom,~N,~N,~N");
Clazz.defineMethod (c$, "drawLabelledAtoms", 
function () {
var labelledAtoms = this.getLabelledAtoms ();
for (var i = 0; i < labelledAtoms.size (); i++) {
var atom = labelledAtoms.get (i);
var label = this.generateAtomLabel (atom);
this.renderer.drawString (atom.x, atom.y, atom.z, astex.util.Color32.white, label);
}
});
Clazz.defineMethod (c$, "setAtomLabelFormat", 
function (s) {
astex.render.MoleculeRenderer.defaultShortFormat = s;
}, "~S");
Clazz.defineMethod (c$, "getAtomLabelFormat", 
function () {
return astex.render.MoleculeRenderer.defaultShortFormat;
});
Clazz.defineMethod (c$, "generateAtomLabel", 
function (atom) {
if (astex.render.MoleculeRenderer.defaultShortFormat == null) {
astex.render.MoleculeRenderer.defaultShortFormat = astex.util.Settings.getString ("config", "atom.model.format");
if (astex.render.MoleculeRenderer.defaultShortFormat == null) {
astex.render.MoleculeRenderer.defaultShortFormat = "%M%c:%F%R:%a%l";
}}return atom.generateLabel (astex.render.MoleculeRenderer.defaultShortFormat);
}, "astex.model.Atom");
Clazz.defineMethod (c$, "generateAtomLabels", 
function (format, selectedAtoms) {
for (var i = 0; i < selectedAtoms.size (); i++) {
var a = selectedAtoms.get (i);
a.setCustomLabel (format);
}
}, "~S,astex.util.DynamicArray");
Clazz.defineMethod (c$, "drawAtom", 
function (atom, crossPixels) {
if (this.displaySolvent || atom.isSolvent () == false) {
var z = atom.zs;
var atomColor = atom.getColor ();
if (crossPixels == 1) {
this.renderer.drawDot (atom.xs, atom.ys, z, atomColor);
} else {
crossPixels <<= 12;
crossPixels /= 2;
var x = atom.xs;
var y = atom.ys;
this.drawLineI (x - crossPixels, y, z, x + crossPixels, y, z, atomColor, atomColor, -1);
this.drawLineI (x, y - crossPixels, z, x, y + crossPixels, z, atomColor, atomColor, -1);
}}}, "astex.model.Atom,~N");
Clazz.defineMethod (c$, "drawBond", 
function (bond, w) {
if (this.fastDraw || bond.getBondOrder () == 1) {
this.drawSimpleBond (bond, w);
} else {
this.drawDetailedBond (bond, w);
}}, "astex.model.Bond,~N");
Clazz.defineMethod (c$, "displayBondTypes", 
function (b) {
this.allowFastDraw = b;
}, "~B");
Clazz.defineMethod (c$, "drawDetailedBond", 
 function (bond, w) {
var bondOrder = bond.getBondOrder ();
if (bondOrder == 2 || bondOrder == 4) {
this.drawDoubleBond (bond, false, w > 0.0 ? w * this.doubleBondRadiusScale : w);
this.drawSimpleBond (bond, w);
} else if (bondOrder == 3) {
this.drawDoubleBond (bond, true, w > 0.0 ? w * this.doubleBondRadiusScale : w);
this.drawSimpleBond (bond, w);
} else {
this.drawSimpleBond (bond, w);
}}, "astex.model.Bond,~N");
Clazz.defineMethod (c$, "drawDoubleBond", 
 function (bond, triple, w) {
var firstAtom = bond.getAtom (0);
var secondAtom = bond.getAtom (1);
var firstAtomColor = firstAtom.getColor ();
var secondAtomColor = secondAtom.getColor ();
var ring = this.currentMolecule.getBestRingContainingBond (bond);
if (ring != null) {
var center = ring.getRingCenter ();
var mid =  new astex.util.Point3d ();
mid.add (firstAtom);
mid.add (secondAtom);
mid.scale (0.5);
var mid2Center = astex.util.Point3d.vectorP2 (mid, center);
var length = mid2Center.length ();
var scale = this.doubleBondOffset / length;
var first2Center = astex.util.Point3d.vectorP2 (firstAtom, center);
var second2Center = astex.util.Point3d.vectorP2 (secondAtom, center);
first2Center.scale (scale);
second2Center.scale (scale);
first2Center.add (firstAtom);
second2Center.add (secondAtom);
if (bond.getBondOrder () == 4) {
this.dummyAtom1.setP (first2Center);
this.dummyAtom2.setP (second2Center);
this.drawTwinColourDottedLine (this.dummyAtom1, this.dummyAtom2, this.aromaticBondDotGap, firstAtomColor, secondAtomColor);
} else {
this.drawLineD (first2Center.x, first2Center.y, first2Center.z, second2Center.x, second2Center.y, second2Center.z, firstAtomColor, secondAtomColor, w);
}} else {
var first2second = astex.util.Point3d.unitVectorP2 (firstAtom, secondAtom);
first2second.normalise ();
var normal = this.getDoubleBondOffsetVector (firstAtom, secondAtom);
normal.scale (this.doubleBondOffset);
first2second.scale (0.1);
var firstEnd = astex.util.Point3d.newP (firstAtom);
firstEnd.add (normal);
if (firstAtom.getBondCount () > 1) {
firstEnd.add (first2second);
}var secondEnd = astex.util.Point3d.newP (secondAtom);
secondEnd.add (normal);
if (secondAtom.getBondCount () > 1) {
secondEnd.subtract (first2second);
}if (bond.getBondOrder () == 4) {
this.dummyAtom1.setP (firstEnd);
this.dummyAtom2.setP (secondEnd);
this.drawTwinColourDottedLine (this.dummyAtom1, this.dummyAtom2, this.aromaticBondDotGap, firstAtomColor, secondAtomColor);
} else {
this.drawLineD (firstEnd.x, firstEnd.y, firstEnd.z, secondEnd.x, secondEnd.y, secondEnd.z, firstAtomColor, secondAtomColor, w);
}if (triple) {
firstEnd = astex.util.Point3d.newP (firstAtom);
firstEnd.subtract (normal);
if (firstAtom.getBondCount () > 1) {
firstEnd.add (first2second);
}secondEnd = astex.util.Point3d.newP (secondAtom);
secondEnd.subtract (normal);
if (secondAtom.getBondCount () > 1) {
secondEnd.subtract (first2second);
}this.drawLineD (firstEnd.x, firstEnd.y, firstEnd.z, secondEnd.x, secondEnd.y, secondEnd.z, firstAtomColor, secondAtomColor, w);
}}}, "astex.model.Bond,~B,~N");
Clazz.defineMethod (c$, "getDoubleBondOffsetVector", 
 function (firstAtom, secondAtom) {
var first2second = astex.util.Point3d.unitVectorP2 (firstAtom, secondAtom);
first2second.normalise ();
var targetAtom = null;
var otherAtom = null;
if (firstAtom.getBondCount () > 1) {
targetAtom = firstAtom;
otherAtom = secondAtom;
} else if (secondAtom.getBondCount () > 1) {
targetAtom = secondAtom;
otherAtom = firstAtom;
}if (targetAtom != null) {
var bondCount = targetAtom.getBondCount ();
for (var i = 0; i < bondCount; i++) {
var a = targetAtom.getBondedAtom (i);
if (a !== otherAtom) {
var dir = astex.util.Point3d.unitVectorP2 (targetAtom, a);
var reference = dir.cross (first2second);
reference.normalise ();
var normal = first2second.cross (reference);
normal.normalise ();
return normal;
}}
}return astex.util.Point3d.normalToLineP (first2second);
}, "astex.model.Atom,astex.model.Atom");
Clazz.defineMethod (c$, "drawSimpleBond", 
 function (bond, w) {
var firstAtom = bond.getAtom (0);
var secondAtom = bond.getAtom (1);
var firstAtomColor = firstAtom.getColor ();
var secondAtomColor = secondAtom.getColor ();
if (w < 0.0) {
if (this.renderer.shadowMode != 0) {
this.drawLineD (firstAtom.x, firstAtom.y, firstAtom.z, secondAtom.x, secondAtom.y, secondAtom.z, firstAtomColor, secondAtomColor, -w * this.bondLineRadius);
} else {
this.drawLineI (firstAtom.xs, firstAtom.ys, firstAtom.zs, secondAtom.xs, secondAtom.ys, secondAtom.zs, firstAtomColor, secondAtomColor, w);
}} else {
if (firstAtom.isSelected ()) {
firstAtomColor = astex.util.Color32.yellow;
}if (secondAtom.isSelected ()) {
secondAtomColor = astex.util.Color32.yellow;
}this.drawLineD (firstAtom.x, firstAtom.y, firstAtom.z, secondAtom.x, secondAtom.y, secondAtom.z, firstAtomColor, secondAtomColor, w);
}}, "astex.model.Bond,~N");
Clazz.defineMethod (c$, "drawLineI", 
 function (x1, y1, z1, x2, y2, z2, rgb1, rgb2, width) {
if (width < 0.0) {
var iw = Clazz.doubleToInt (-width + 0.5);
this.renderer.drawLineI (x1, y1, z1, x2, y2, z2, rgb1, rgb2, iw);
} else {
this.renderer.drawCylinder (x1, y1, z1, x2, y2, z2, rgb1, rgb2, width);
}}, "~N,~N,~N,~N,~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "drawLineD", 
 function (x1, y1, z1, x2, y2, z2, rgb1, rgb2, width) {
if (width < 0.0) {
var iw = Clazz.doubleToInt (-width + 0.5);
this.renderer.drawLineD (x1, y1, z1, x2, y2, z2, rgb1, rgb2, iw);
} else {
this.renderer.drawCylinder (x1, y1, z1, x2, y2, z2, rgb1, rgb2, width);
}}, "~N,~N,~N,~N,~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "getNearestAtom", 
function (x, y) {
var nearestAtom = null;
var nearest = 2147483647;
for (var m = 0; m < this.getMoleculeCount (); m++) {
var molecule = this.getMolecule (m);
var atomCount = molecule.getAtomCount ();
var style = molecule.getDisplayStyle ();
if ((style & astex.model.Molecule.Normal) == astex.model.Molecule.Normal && molecule.getDisplayed ()) {
for (var a = 0; a < atomCount; a++) {
var atom = molecule.getAtom (a);
var az = atom.zs;
if (atom.isDisplayed () && az >= this.renderer.backClip && az <= this.renderer.frontClip) {
var ax = Clazz.doubleToInt ((atom.xs >> 12) / this.renderer.getSamples ());
var ay = Clazz.doubleToInt ((atom.ys >> 12) / this.renderer.getSamples ());
var dSquare = (ax - x) * (ax - x) + (ay - y) * (ay - y);
if (dSquare < nearest && dSquare < 64) {
nearest = dSquare;
nearestAtom = atom;
}}}
} else if ((style & astex.model.Molecule.Trace) == astex.model.Molecule.Trace && molecule.getDisplayed ()) {
for (var a = 0; a < atomCount; a++) {
var atom = molecule.getAtom (a);
var az = atom.zs;
if (atom.isDisplayed () && atom.getAtomLabel ().equals ("CA") && az >= this.renderer.backClip && az <= this.renderer.frontClip) {
var ax = Clazz.doubleToInt ((atom.xs >> 12) / this.renderer.getSamples ());
var ay = Clazz.doubleToInt ((atom.ys >> 12) / this.renderer.getSamples ());
var dSquare = (ax - x) * (ax - x) + (ay - y) * (ay - y);
if (dSquare < nearest && dSquare < 64) {
nearest = dSquare;
nearestAtom = atom;
}}}
}}
return nearestAtom;
}, "~N,~N");
Clazz.defineMethod (c$, "getNearestBackbonePoint", 
function (x, y) {
var nearest = 2147483647;
var nearestString = "";
var graphicalObjectCount = this.getGraphicalObjectCount ();
for (var i = 0; i < graphicalObjectCount; i++) {
var tm = this.getGraphicalObjectI (i);
if (!tm.isSelectable) continue;
if (!tm.isVisible ()) continue;
var sc =  Clazz.newIntArray (3, 0);
for (var p = 0; p < tm.np; p++) {
tm.transformToScreen (this.renderer.overallMatrix, p, sc);
if (sc[2] >= this.renderer.backClip && sc[2] <= this.renderer.frontClip) {
var px = sc[0] >> 12;
var py = sc[1] >> 12;
var dSq = (px - x) * (px - x) + (py - y) * (py - y);
if (dSq < nearest && dSq < 64) {
nearest = dSq;
nearestString = tm.labels[p];
}}}
}
return nearestString;
}, "~N,~N");
Clazz.defineMethod (c$, "moveAtom", 
function (atom, dx, dy) {
var direction = astex.util.Point3d.new3 (dx, -dy, 0);
this.renderer.rotationMatrix.transformByInverse (direction);
direction.divide (this.renderer.getOverallScale ());
atom.add (direction);
}, "astex.model.Atom,~N,~N");
Clazz.defineMethod (c$, "translateCenter", 
function (dx, dy) {
var direction = astex.util.Point3d.new3 (-dx, dy, 0);
this.renderer.rotationMatrix.transformByInverse (direction);
direction.divide (this.renderer.getOverallScale ());
var center = this.renderer.getCenter ();
center.add (direction);
this.renderer.setCenter (center);
}, "~N,~N");
Clazz.defineMethod (c$, "colorByChain", 
function () {
var all = (this.getSelectedAtomCount () == 0);
for (var m = 0; m < this.getMoleculeCount (); m++) {
var molecule = this.getMolecule (m);
var chainCount = molecule.getChainCount ();
for (var c = 0; c < chainCount; c++) {
var chain = molecule.getChain (c);
var residueCount = chain.getResidueCount ();
var color = astex.render.MoleculeRenderer.getColor (c);
for (var r = 0; r < residueCount; r++) {
var residue = chain.getResidue (r);
var atomCount = residue.getAtomCount ();
for (var a = 0; a < atomCount; a++) {
var atom = residue.getAtom (a);
if (all || atom.isSelected ()) {
atom.setColor (color);
}}
}
}
}
});
Clazz.defineMethod (c$, "colorByAtom", 
function () {
var all = (this.getSelectedAtomCount () == 0);
for (var m = 0; m < this.getMoleculeCount (); m++) {
var molecule = this.getMolecule (m);
var atomCount = molecule.getAtomCount ();
var symmetryMolecule = molecule.isSymmetryMolecule ();
for (var a = 0; a < atomCount; a++) {
var atom = molecule.getAtom (a);
if (all || atom.isSelected ()) {
atom.resetColor ();
var color = atom.getColor ();
if (symmetryMolecule && atom.getElement () == 6) {
color = astex.util.Color32.grey;
}atom.setColor (color);
}}
}
});
Clazz.defineMethod (c$, "colorBySpecifiedColor", 
function (color) {
var all = (this.getSelectedAtomCount () == 0);
var atomIterator = this.getAtomIterator ();
while (atomIterator.hasMoreElements ()) {
var atom = atomIterator.getNextAtom ();
if (all || atom.isSelected ()) {
atom.setColor (color);
}}
}, "~N");
Clazz.defineMethod (c$, "colorByBFactor", 
function () {
var all = (this.getSelectedAtomCount () == 0);
var atomIterator = this.getAtomIterator ();
while (atomIterator.hasMoreElements ()) {
var atom = atomIterator.getNextAtom ();
if (all || atom.isSelected ()) {
var b = atom.getBFactor ();
var color = 0;
if (b <= 10.0) {
color = astex.util.Color32.rwb7;
} else if (b > 10.0 && b <= 15.0) {
color = astex.util.Color32.rwb6;
} else if (b > 15.0 && b <= 20.0) {
color = astex.util.Color32.rwb5;
} else if (b > 20.0 && b <= 25.0) {
color = astex.util.Color32.rwb4;
} else if (b > 25.0 && b <= 30.0) {
color = astex.util.Color32.rwb3;
} else if (b > 30.0 && b <= 35.0) {
color = astex.util.Color32.rwb2;
} else if (b > 35.0 && b <= 40.0) {
color = astex.util.Color32.rwb1;
} else {
color = astex.util.Color32.rwb0;
}atom.setColor (color);
}}
});
Clazz.defineMethod (c$, "ensureColorRampDefined", 
function () {
if (astex.render.MoleculeRenderer.predefinedColors == null) {
astex.render.MoleculeRenderer.predefinedColors =  Clazz.newIntArray (512, 0);
var ColorRampSize2 = 256;
for (var i = 0; i < ColorRampSize2; i++) {
var r = i;
var g = i;
var b = 255;
astex.render.MoleculeRenderer.predefinedColors[i] = astex.util.Color32.pack (r, g, b);
}
for (var i = 0; i < ColorRampSize2; i++) {
var r = 255;
var g = 255 - i;
var b = 255 - i;
astex.render.MoleculeRenderer.predefinedColors[ColorRampSize2 + i] = astex.util.Color32.pack (r, g, b);
}
}});
Clazz.defineMethod (c$, "colorByPropertyRange", 
function (property) {
var min = 1.e10;
var max = -1.0E10;
var all = (this.getSelectedAtomCount () == 0);
this.ensureColorRampDefined ();
var rms = 0.0;
var selectedCount = 0;
var atomIterator = this.getAtomIterator ();
while (atomIterator.hasMoreElements ()) {
var atom = atomIterator.getNextAtom ();
if (all || atom.isSelected ()) {
selectedCount++;
var b = atom.getAttribute (property);
rms += b * b;
if (b < min) {
min = b;
}if (b > max) {
max = b;
}}}
if (selectedCount > 0) {
rms /= selectedCount;
rms = Math.sqrt (rms);
}if (property == 3) {
max = 2. * rms;
}atomIterator = this.getAtomIterator ();
var colorCount = astex.render.MoleculeRenderer.predefinedColors.length;
while (atomIterator.hasMoreElements ()) {
var atom = atomIterator.getNextAtom ();
if (all || atom.isSelected ()) {
var b = atom.getAttribute (property);
var color = astex.util.Color32.rwb7;
if (property == 3 && Math.abs (b) > 1.e-3) {
color = Clazz.doubleToInt (colorCount * (b - min) / (max - min));
if (color < 0) {
color = 0;
} else if (color >= colorCount) {
color = colorCount - 1;
}color = astex.render.MoleculeRenderer.predefinedColors[color];
}atom.setColor (color);
}}
}, "~N");
Clazz.defineMethod (c$, "colorByRainbow", 
function (selectedAtoms) {
for (var m = 0; m < this.getMoleculeCount (); m++) {
var molecule = this.getMolecule (m);
this.colorByRainbowOld (molecule.atoms);
}
}, "astex.util.DynamicArray");
Clazz.defineMethod (c$, "colorByRainbowOld", 
function (selectedAtoms) {
var atomCount = selectedAtoms.size ();
var step = 240.0 / (atomCount - 1);
var hue = 240.0;
this.hsvtmp[1] = 1.0;
this.hsvtmp[2] = 1.0;
for (var i = 0; i < atomCount; i++) {
var a = selectedAtoms.get (i);
this.hsvtmp[0] = hue;
var c = astex.util.Color32.hsv2packed (this.hsvtmp);
a.setColor (c);
hue -= step;
}
}, "astex.util.DynamicArray");
Clazz.defineMethod (c$, "handleSlideCommand", 
function (args) {
var slideShowString = args.getString ("-slideshow", null);
var forward = args.getInteger ("-forward", -2147483648);
var backward = args.getInteger ("-backward", -2147483648);
var show = args.getInteger ("-show", -2147483648);
if (slideShowString != null) {
this.slideShow = slideShowString;
this.slideNumber = 0;
astex.util.Log.info ("slideshow is " + this.slideShow);
}if (forward != -2147483648) {
this.slideNumber += forward;
}if (backward != -2147483648) {
this.slideNumber -= backward;
}if (show != -2147483648) {
this.slideNumber = show;
}if (this.slideNumber < 0) {
this.slideNumber = 0;
}astex.util.Log.info ("showing slide %d", this.slideNumber);
if (this.slideShow != null) {
var script = astex.io.FILE.sprintI (this.slideShow, this.slideNumber);
astex.util.Log.info ("about to play slide " + script);
this.executeScript (script);
} else {
astex.util.Log.error ("no slideshow defined");
}}, "astex.util.Arguments");
Clazz.defineMethod (c$, "execute", 
function (command) {
this.executeInternal (command);
}, "~S");
Clazz.defineMethod (c$, "parse", 
 function (reader) {
var errorCondition = false;
if (this.parserStack == null) this.parserStack =  new Array (10);
if (this.lexerStack == null) this.lexerStack =  new Array (10);
this.parserDepth++;
try {
if (this.parserStack[this.parserDepth] == null) {
this.parserStack[this.parserDepth] =  new astex.parser.Parser ();
this.lexerStack[this.parserDepth] =  new astex.parser.Yylex (Clazz.castNullAs ("java.io.BufferedReader"));
this.parserStack[this.parserDepth].setScanner (this.lexerStack[this.parserDepth]);
}this.parserStack[this.parserDepth].setMoleculeRenderer (this);
this.lexerStack[this.parserDepth].setInput (reader);
this.parserStack[this.parserDepth].parse ();
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
{
System.out.println(e);// Clazz.getStackTrace());
}errorCondition = true;
} else {
throw e;
}
}
this.parserDepth--;
return !errorCondition;
}, "java.io.Reader");
Clazz.defineMethod (c$, "executeInternal", 
function (command) {
System.out.println ("executing: " + command);
command = command.trim ();
if (command.length < 2 || command.startsWith ("#")) return;
if (this.parse (JU.Rdr.getBR (command))) {
if (this.commandLog == null) this.commandLog =  new JU.SB ();
if (this.debug) System.out.println ("executeInternal: " + command);
this.commandLog.append (command);
} else {
System.err.println ("Syntax error in command:");
System.err.println (command);
}}, "~S");
Clazz.defineMethod (c$, "reExecute", 
function () {
if (this.lastScriptFile != null) {
System.out.println ("reExecute " + this.lastScriptFile);
this.executeScript (this.lastScriptFile);
}});
Clazz.defineMethod (c$, "executeScript", 
function (filename) {
var data = null;
var previous = astex.io.FILE.getTryFiles ();
astex.io.FILE.setTryFiles (true);
try {
data = astex.io.FILE.getFileAsString (filename);
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
System.out.println ("couldn't open script " + filename);
this.lastScriptFile = null;
} else {
throw e;
}
}
astex.io.FILE.setTryFiles (previous);
if (data == null) return;
this.commandLog.append (data);
this.lastScriptFile = filename;
try {
this.parse (JU.Rdr.getBR (data));
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
System.out.println ("error processing command: ");
{
System.out.println(e);// Clazz.getStackTrace());
}} else {
throw e;
}
}
}, "~S");
Clazz.defineMethod (c$, "quit", 
function () {
System.out.println ("Exiting...");
if (this.viewer != null) this.viewer.saveAndExit ();
});
Clazz.defineMethod (c$, "quitAnimate", 
function () {
if (this.viewer != null) this.viewer.quitAnimate ();
});
Clazz.defineMethod (c$, "writeScript", 
function (fileName) {
this.writeScript (fileName, this.commandLog);
}, "~S");
Clazz.defineMethod (c$, "writeView", 
function (fileName) {
var commands =  new JU.SB ();
this.writeScript (fileName, commands);
}, "~S");
Clazz.defineMethod (c$, "writeScript", 
 function (fileName, commands) {
var save = astex.io.FILE.openForWrite (fileName);
if (save.errorMsg != null) {
System.out.println ("Could not write script to " + fileName + " : " + save.errorMsg);
}commands.append ("/* Set the current view. */\n");
commands.append (this.getView ());
var len = commands.length ();
for (var i = 0; i < len; i++) {
var c = commands.charAt (i);
save.printC (c);
if (c == ';') {
save.printC ('\n');
}}
save.close ();
}, "~S,JU.SB");
Clazz.defineMethod (c$, "getView", 
function () {
var viewString = "matrix\n";
var m = this.renderer.rotationMatrix;
viewString += " " + m.x00 + " " + m.x01 + " " + m.x02 + " " + m.x03 + "\n";
viewString += " " + m.x10 + " " + m.x11 + " " + m.x12 + " " + m.x13 + "\n";
viewString += " " + m.x20 + " " + m.x21 + " " + m.x22 + " " + m.x23 + "\n";
viewString += " " + m.x30 + " " + m.x31 + " " + m.x32 + " " + m.x33 + "\n";
viewString += ";";
var center = this.renderer.getCenter ();
viewString += "center " + center.getX () + " " + center.getY () + " " + center.getZ () + ";";
viewString += "radius " + (this.renderer.width / this.renderer.zoom) + ";";
viewString += "clip " + this.renderer.front + " " + this.renderer.back + ";";
return viewString;
});
Clazz.defineMethod (c$, "getRenderedImageString", 
function (urlSafeEncoding, format) {
return astex.viewer.Viewer.apiPlatform.createImage ([this.renderer.doAntialiasForImage (), Integer.$valueOf (Clazz.doubleToInt (this.renderer.pixelWidth / this.renderer.samples)), Integer.$valueOf (Clazz.doubleToInt (this.renderer.pixelHeight / this.renderer.samples)), Integer.$valueOf (urlSafeEncoding), format]);
}, "~N,~S");
Clazz.defineMethod (c$, "getSurface", 
 function () {
return (astex.api.Interface.getInterface ("astex.map.Surface"));
});
Clazz.defineMethod (c$, "getTexgen", 
 function () {
return (astex.api.Interface.getInterface ("astex.map.Texgen"));
});
Clazz.defineMethod (c$, "getCommand", 
 function () {
return (astex.api.Interface.getInterface ("astex.cmds.Command"));
});
c$.getColor = Clazz.defineMethod (c$, "getColor", 
function (i) {
if (astex.render.MoleculeRenderer.colors[0] == null) astex.render.MoleculeRenderer.fillColorArray ();
return astex.render.MoleculeRenderer.colors[i % 32].getRGB ();
}, "~N");
c$.fillColorArray = Clazz.defineMethod (c$, "fillColorArray", 
function () {
astex.render.MoleculeRenderer.colors[0] =  new java.awt.Color (255, 0, 0);
astex.render.MoleculeRenderer.colors[1] =  new java.awt.Color (0, 255, 0);
astex.render.MoleculeRenderer.colors[2] =  new java.awt.Color (0, 0, 255);
astex.render.MoleculeRenderer.colors[3] =  new java.awt.Color (255, 0, 255);
astex.render.MoleculeRenderer.colors[4] =  new java.awt.Color (0, 255, 255);
astex.render.MoleculeRenderer.colors[5] =  new java.awt.Color (255, 255, 255);
astex.render.MoleculeRenderer.colors[6] =  new java.awt.Color (128, 0, 0);
astex.render.MoleculeRenderer.colors[7] =  new java.awt.Color (0, 128, 0);
astex.render.MoleculeRenderer.colors[8] =  new java.awt.Color (0, 0, 128);
astex.render.MoleculeRenderer.colors[9] =  new java.awt.Color (128, 128, 0);
astex.render.MoleculeRenderer.colors[10] =  new java.awt.Color (128, 0, 128);
astex.render.MoleculeRenderer.colors[11] =  new java.awt.Color (0, 128, 128);
astex.render.MoleculeRenderer.colors[12] =  new java.awt.Color (128, 128, 128);
astex.render.MoleculeRenderer.colors[13] =  new java.awt.Color (255, 128, 128);
astex.render.MoleculeRenderer.colors[14] =  new java.awt.Color (128, 255, 128);
astex.render.MoleculeRenderer.colors[15] =  new java.awt.Color (128, 128, 255);
astex.render.MoleculeRenderer.colors[16] =  new java.awt.Color (255, 255, 128);
astex.render.MoleculeRenderer.colors[17] =  new java.awt.Color (255, 128, 255);
astex.render.MoleculeRenderer.colors[18] =  new java.awt.Color (128, 255, 255);
astex.render.MoleculeRenderer.colors[19] =  new java.awt.Color (192, 0, 0);
astex.render.MoleculeRenderer.colors[20] =  new java.awt.Color (0, 192, 0);
astex.render.MoleculeRenderer.colors[21] =  new java.awt.Color (0, 0, 192);
astex.render.MoleculeRenderer.colors[22] =  new java.awt.Color (192, 192, 0);
astex.render.MoleculeRenderer.colors[23] =  new java.awt.Color (192, 0, 192);
astex.render.MoleculeRenderer.colors[24] =  new java.awt.Color (0, 192, 192);
astex.render.MoleculeRenderer.colors[25] =  new java.awt.Color (192, 192, 192);
astex.render.MoleculeRenderer.colors[26] =  new java.awt.Color (255, 192, 192);
astex.render.MoleculeRenderer.colors[27] =  new java.awt.Color (192, 255, 192);
astex.render.MoleculeRenderer.colors[28] =  new java.awt.Color (192, 192, 255);
astex.render.MoleculeRenderer.colors[29] =  new java.awt.Color (255, 255, 192);
astex.render.MoleculeRenderer.colors[30] =  new java.awt.Color (255, 192, 255);
astex.render.MoleculeRenderer.colors[31] =  new java.awt.Color (192, 255, 255);
});
c$.newVolumeMap = Clazz.defineMethod (c$, "newVolumeMap", 
function () {
return astex.api.Interface.getInterface ("astex.map.VolumeMapImp");
});
Clazz.defineMethod (c$, "getMapCount", 
function () {
return this.maps.size ();
});
Clazz.defineMethod (c$, "getMap", 
function (i) {
return this.maps.get (i);
}, "~N");
Clazz.defineMethod (c$, "findMap", 
function (name) {
if (name.length == 0) name = astex.render.MoleculeRenderer.lastMapName;
astex.render.MoleculeRenderer.lastMapName = name;
return (this.getMapCount () == 0 ? null : this.getMap (0).findMap (this.maps, name));
}, "~S");
Clazz.defineMethod (c$, "getMaps", 
function (name) {
var mapArray =  new astex.util.DynamicArray ();
if (name.length == 0) name = astex.render.MoleculeRenderer.lastMapName;
for (var i = 0; i < this.getMapCount (); i++) {
var map = this.getMap (i);
if (astex.util.Mmatch.matches (name, map.getName ())) {
mapArray.add (map);
}}
return mapArray;
}, "~S");
Clazz.defineMethod (c$, "setContourSize", 
function (cs) {
for (var i = 0; i < this.maps.size (); i++) {
var map = this.maps.get (i);
map.setContourSize (cs);
}
}, "~N");
Clazz.defineMethod (c$, "setDefaultContourLevels", 
 function () {
this.resetContourLevels ();
this.addContourLevel (3.0, astex.util.Color32.red, true, 2);
if (this.contourLevelCount < astex.render.MoleculeRenderer.MaximumContourLevels) {
this.addContourLevel (2.0, astex.util.Color32.orange, false, 1);
}if (this.contourLevelCount < astex.render.MoleculeRenderer.MaximumContourLevels) {
this.addContourLevel (-2.0, astex.util.Color32.blue, false, 1);
}});
Clazz.defineMethod (c$, "handleMapCommand", 
function (name, args) {
if (args.defined ("-noop")) return;
var maps = this.getMaps (name);
for (var i = 0; i < maps.size (); i++) (maps.get (i)).handleCommand (this, this.viewer, args);

}, "~S,astex.util.Arguments");
Clazz.defineMethod (c$, "processContourProperties", 
 function () {
var value = this.properties.getProperty (astex.render.MoleculeRenderer.contourNLevelsProperty);
if (value != null) {
var v = astex.io.FILE.readInteger (value);
this.resizeContourArrays (v);
}value = this.properties.getProperty (astex.render.MoleculeRenderer.contourLevelsProperty);
if (value != null) {
this.setupContourLevels (value);
}});
Clazz.defineMethod (c$, "resizeContourArrays", 
 function (size) {
if (size > astex.render.MoleculeRenderer.MaximumContourLevels) {
try {
var newCL =  Clazz.newDoubleArray (size, 0);
var newCC =  Clazz.newIntArray (size, 0);
var newCS =  Clazz.newIntArray (size, 0);
var newCD =  Clazz.newBooleanArray (size, false);
System.arraycopy (this.contourLevels, 0, newCL, 0, astex.render.MoleculeRenderer.MaximumContourLevels);
System.arraycopy (this.contourColors, 0, newCC, 0, astex.render.MoleculeRenderer.MaximumContourLevels);
System.arraycopy (this.contourStyles, 0, newCS, 0, astex.render.MoleculeRenderer.MaximumContourLevels);
System.arraycopy (this.contourDisplayed, 0, newCD, 0, astex.render.MoleculeRenderer.MaximumContourLevels);
this.contourLevels = newCL;
this.contourColors = newCC;
this.contourStyles = newCS;
this.contourDisplayed = newCD;
} catch (e) {
if (Clazz.exceptionOf (e, OutOfMemoryError)) {
System.out.println ("Out of memory in when allocating memory for contour info: " + 17 * size + " bytes");
throw  new OutOfMemoryError (e.getMessage ());
} else {
throw e;
}
}
}astex.render.MoleculeRenderer.MaximumContourLevels = size;
if (this.contourLevelCount < astex.render.MoleculeRenderer.MaximumContourLevels) {
this.addContourLevel (2.0, astex.util.Color32.orange, false, 1);
}if (this.contourLevelCount < astex.render.MoleculeRenderer.MaximumContourLevels) {
this.addContourLevel (-2.0, astex.util.Color32.blue, false, 1);
}}, "~N");
Clazz.defineMethod (c$, "setupContourLevels", 
function (contourLevels) {
this.resetContourLevels ();
var levels = astex.io.FILE.split (contourLevels, ",");
for (var i = 0; i < levels.length && this.contourLevelCount < astex.render.MoleculeRenderer.MaximumContourLevels; i++) {
var attributes = astex.io.FILE.split (levels[i], ":");
var level = astex.io.FILE.readDouble (attributes[0].trim ());
var color = astex.util.Color32.white;
if (attributes.length >= 2) {
color = astex.util.Color32.getColorFromName (attributes[1].trim ());
}var display = false;
if (attributes.length >= 3) {
if (attributes[2].equals ("display")) {
display = true;
}}this.addContourLevel (level, color, display, 1);
}
}, "~S");
Clazz.defineMethod (c$, "fireMapAddedEvent", 
function (map) {
this.doMapChange (map.getName (), true);
}, "astex.map.VolumeMap");
Clazz.defineMethod (c$, "doMapChange", 
 function (name, isAdded) {
if (this.moleculeRendererListeners != null) {
for (var i = 0; i < this.moleculeRendererListeners.size (); i++) {
var l = this.moleculeRendererListeners.get (i);
l.mapChanged (this, name, isAdded);
}
}}, "~S,~B");
Clazz.defineMethod (c$, "fireMapRemovedEvent", 
function (map) {
this.doMapChange (map.getName (), false);
}, "astex.map.VolumeMap");
Clazz.defineMethod (c$, "fireMaskAddedEvent", 
function (mask) {
if (this.moleculeRendererListeners != null) {
for (var i = 0; i < this.moleculeRendererListeners.size (); i++) {
var l = this.moleculeRendererListeners.get (i);
l.maskAdded (this, mask);
}
}}, "astex.api.AstexMask");
Clazz.defineMethod (c$, "fireMaskEditedEvent", 
function (mapName, mask) {
if (this.moleculeRendererListeners != null) {
for (var i = 0; i < this.moleculeRendererListeners.size (); i++) {
var l = this.moleculeRendererListeners.get (i);
l.maskEdited (this, mapName, mask);
}
}}, "~S,astex.api.AstexMask");
Clazz.defineMethod (c$, "fireMaskRemovedEvent", 
function (map, mask) {
if (this.moleculeRendererListeners != null) {
for (var i = 0; i < this.moleculeRendererListeners.size (); i++) {
var l = this.moleculeRendererListeners.get (i);
l.maskRemoved (this, map, mask);
}
}}, "astex.map.VolumeMap,astex.api.AstexMask");
Clazz.defineMethod (c$, "removeMapByName", 
function (pattern) {
var mapCount = this.getMapCount ();
for (var m = mapCount - 1; m >= 0; m--) {
var map = this.getMap (m);
var mapName = map.getName ();
if (pattern.equals (mapName)) {
this.maps.remove (map);
for (var j = astex.render.MoleculeRenderer.MaximumContourLevels - 1; j >= 0; j--) {
var tm = this.getContourGraphicalObject (map, j);
this.removeGraphicalObject (tm, true);
}
System.out.println ("removed " + mapName);
this.fireMapRemovedEvent (map);
}}
}, "~S");
Clazz.defineMethod (c$, "removeMaskByName", 
function (mapName, maskName) {
var map = this.findMap (mapName);
var mask = (maskName == null ? map.removeAllMasks () : map.removeMaskByName (maskName));
this.contourMaps ();
this.fireMaskRemovedEvent (map, mask);
}, "~S,~S");
Clazz.defineMethod (c$, "removeAllMasks", 
function (mapName) {
this.removeMaskByName (mapName, null);
}, "~S");
Clazz.defineMethod (c$, "excludeMap", 
function (parentName, outName, subMaps) {
(astex.api.Interface.getInterface ("astex.map.MapEdit")).run (parentName, outName, false, subMaps);
}, "~S,~S,~S");
Clazz.defineMethod (c$, "removeAllMaps", 
function () {
var mapCount = this.getMapCount ();
for (var m = mapCount - 1; m >= 0; m--) {
var map = this.getMap (m);
this.maps.remove (map);
for (var j = astex.render.MoleculeRenderer.MaximumContourLevels - 1; j >= 0; j--) {
var tm = this.getContourGraphicalObject (map, j);
this.removeGraphicalObject (tm, true);
}
this.fireMapRemovedEvent (map);
}
});
Clazz.defineMethod (c$, "removeMap", 
function (pattern) {
var mapCount = this.getMapCount ();
for (var m = mapCount - 1; m >= 0; m--) {
var map = this.getMap (m);
var mapName = map.getName ();
if (mapName.contains (pattern)) {
this.maps.remove (map);
for (var j = astex.render.MoleculeRenderer.MaximumContourLevels - 1; j >= 0; j--) {
var tm = this.getContourGraphicalObject (map, j);
this.removeGraphicalObject (tm, true);
}
System.out.println ("removed " + mapName);
this.fireMapRemovedEvent (map);
}}
}, "~S");
Clazz.defineMethod (c$, "removeMap", 
function (map) {
if (this.maps.contains (map)) {
this.maps.remove (map);
for (var j = astex.render.MoleculeRenderer.MaximumContourLevels - 1; j >= 0; j--) {
var tm = this.getContourGraphicalObject (map, j);
this.removeGraphicalObject (tm, true);
}
this.fireMapRemovedEvent (map);
}}, "astex.map.VolumeMap");
Clazz.defineMethod (c$, "addMap", 
function (map) {
this.maps.add (map);
var mapCount = this.maps.size ();
var then = 0;
if (this.debug) then = System.currentTimeMillis ();
try {
var fofType = (this.mapBehaviourMode == 1 ? map.getFofType (mapCount) : "2fofc");
astex.util.Log.info ("mapType " + fofType);
map.setContours (fofType, this.contourLevelCount, this.properties);
for (var i = 0; i < this.contourLevelCount; i++) {
var contourObject =  new astex.render.Tmesh ();
contourObject.setName (this.getContourGraphicalObjectName (map, i));
this.addGraphicalObject (contourObject);
}
var readOK = true;
for (var j = 0; j < astex.map.VolumeMap.MaximumContourLevels; j++) {
if (!this.contourMap (map, j)) {
readOK = false;
break;
}}
if (readOK) {
map.setRadius ();
this.fireMapAddedEvent (map);
} else {
System.out.println ("Failed to open map: " + map.getName ());
System.out.println ("Please verify that this actually was a map file");
this.maps.remove (map);
this.removeGraphicalObjectsBeginningWith (map.getName ());
map = null;
}} catch (e) {
if (Clazz.exceptionOf (e, RuntimeException)) {
System.out.println ("Failed to open map: " + map.getName ());
System.out.println ("Please verify that this actually was a map file");
this.maps.remove (map);
this.removeGraphicalObjectsBeginningWith (map.getName ());
map = null;
{
System.out.println(e);// Clazz.getStackTrace());
}} else {
throw e;
}
}
if (this.debug) {
var now = System.currentTimeMillis () - then;
System.out.println ("Time in addMap: " + now + "ms");
}}, "astex.map.VolumeMap");
Clazz.defineMethod (c$, "getNextMapName", 
function () {
var map = this.getMapCount ();
var mapName = null;
do {
mapName = "map" + map;
map++;
} while (this.findMolecule (mapName) != null);
return mapName;
});
Clazz.defineMethod (c$, "setMapContourTransparency", 
function (map, contour, t) {
if (map != null) {
var contourObject = this.getContourGraphicalObject (map, contour);
if (contourObject != null) {
contourObject.setTransparency (t);
}}}, "astex.map.VolumeMap,~N,~N");
Clazz.defineMethod (c$, "getMapContourTransparency", 
function (map, contour) {
if (map != null) {
var contourObject = this.getContourGraphicalObject (map, contour);
if (contourObject != null) {
return contourObject.getTransparency ();
}}return -1;
}, "astex.map.VolumeMap,~N");
Clazz.defineMethod (c$, "centerMapByName", 
function (mapName) {
var map = this.findMap (mapName);
if (map == null) {
System.out.println ("map named: " + mapName + " is not available." + " Did the read fail. Center map will not be done.");
return;
}this.centerMap (map);
}, "~S");
Clazz.defineMethod (c$, "centerMap", 
 function (map) {
if (map == null) map = this.maps.get (0);
var d = map.getRenderCenter ();
this.renderer.setCenter (d);
this.setRadius (map.getRadius ());
this.setClip (1.1 * map.getRadius ());
this.renderer.setZoom (1.0);
this.contourMaps ();
}, "astex.map.VolumeMap");
Clazz.defineMethod (c$, "scaleByMapRadius", 
function (mapName, zoom, level, axis) {
var map = this.findMap (mapName);
if (map == null) {
System.out.println ("map named: " + mapName + " is not available." + " Did the read fail. Radius map will not be done.");
return;
}var xlate =  new astex.util.Point3d ();
var depth =  Clazz.newDoubleArray (2, 0);
this.setRadius (map.calcExtent (level, axis, xlate, depth));
this.renderer.setCenter (xlate);
this.renderer.setZoom (zoom);
this.renderer.setClips (depth[1], depth[0]);
this.contourMaps ();
this.viewer.execJS ("av_adjust_radius(" + this.renderer.getRadius () + ")");
this.viewer.execJS ("av_adjust_clip(" + this.renderer.getClip () + ")");
}, "~S,~N,~N,~S");
Clazz.defineMethod (c$, "zoomMap", 
function (mapName, zoom) {
var map = this.findMap (mapName);
if (map == null) {
System.out.println ("map named: " + mapName + " is not available." + " Did the read fail. Radius map will not be done.");
return;
}this.setRadius (map.getRadius ());
this.setClip (1.1 * this.renderer.getRadius ());
this.renderer.setZoom (zoom);
this.contourMaps ();
}, "~S,~N");
Clazz.defineMethod (c$, "generateMaps", 
function () {
if (this.displayMaps) {
this.readMaps ();
this.contourMaps ();
}});
Clazz.defineMethod (c$, "removeContourLevels", 
function () {
this.removeGraphicalObjectsBeginningWith ("Map");
});
Clazz.defineMethod (c$, "removeMaps", 
function () {
this.removeGraphicalObjectsBeginningWith ("Map");
this.maps.removeAllElements ();
});
Clazz.defineMethod (c$, "setDisplayMaps", 
function (state) {
this.displayMaps = state;
for (var i = 0; i < this.maps.size (); i++) {
var map = this.maps.get (i);
for (var j = 0; j < astex.render.MoleculeRenderer.MaximumContourLevels; j++) {
var tm = this.getContourGraphicalObject (map, j);
if (this.displayMaps) {
tm.setVisible (map.getContourDisplayed (j));
} else {
tm.setVisible (false);
}}
}
if (this.viewer != null) {
this.viewer.updateDisplayItemFromCommand ("Maps", this.displayMaps);
}}, "~B");
Clazz.defineMethod (c$, "readMaps", 
function () {
for (var i = 0; i < this.getMapCount (); i++) {
var map = this.getMap (i);
if (map.hasContoursDisplayed ()) {
map.setRadius ();
}}
});
Clazz.defineMethod (c$, "contourMaps", 
function () {
if (this.displayMaps) {
for (var i = 0; i < this.getMapCount (); i++) {
var map = this.getMap (i);
for (var j = 0; j < astex.map.VolumeMap.MaximumContourLevels; j++) {
this.contourMap (map, j);
}
}
}});
Clazz.defineMethod (c$, "getContourGraphicalObjectName", 
function (map, contour) {
return map.getName () + "_" + contour;
}, "astex.map.VolumeMap,~N");
Clazz.defineMethod (c$, "getContourGraphicalObject", 
function (map, contour) {
var contourName = this.getContourGraphicalObjectName (map, contour);
var contourObject = this.getGraphicalObjectByName (contourName);
return contourObject;
}, "astex.map.VolumeMap,~N");
Clazz.defineMethod (c$, "contourMap", 
function (map, contour) {
return map.contourMap (this, contour);
}, "astex.map.VolumeMap,~N");
Clazz.defineMethod (c$, "defineMaskAll", 
function (mapName, molName) {
var map = this.findMap (mapName);
if (map == null) {
System.out.print ("Map: " + mapName + " not found.");
System.out.println (" Failed to do defineMaskAll()");
return;
}var m = this.findMolecule (molName);
if (m == null) {
System.out.print ("Molecule: " + molName + " not found.");
System.out.println (" Failed to do defineMaskAll()");
return;
}var nChains = m.getChainCount ();
var tolerance = 5.0;
for (var i = 0; i < nChains; i++) {
var ch = m.getChain (i);
if (ch.hasParentChain ()) continue;
var chName = ch.getName ();
var mName = molName + "_" + chName;
ch.select (1);
var childChainCnt = ch.getChildChainCount ();
for (var j = 0; j < childChainCnt; j++) {
var childChain = ch.getChildChain (j);
childChain.select (1);
}
this.createMask (map, astex.render.MoleculeRenderer.getColor (i), mName, tolerance);
ch.select (3);
for (var j = 0; j < childChainCnt; j++) {
var childChain = ch.getChildChain (j);
childChain.select (3);
}
}
}, "~S,~S");
Clazz.defineMethod (c$, "defineMapAllMolecule", 
function (mapName, molName, directory) {
var map = this.findMap (mapName);
if (map == null) {
System.out.print ("Map: " + mapName + " not found.");
System.out.println (" Failed to do 'MAP DEFINE ALL MOLECULE'");
return;
}var m = this.findMolecule (molName);
if (m == null) {
System.out.print ("Molecule: " + molName + " not found.");
System.out.println (" Failed to do 'MAP DEFINE ALL MOLECULE'");
return;
}map.setCutSelection (true);
var nChains = m.getChainCount ();
for (var i = 0; i < nChains; i++) {
var ch = m.getChain (i);
if (ch.hasParentChain ()) continue;
var mName = this.assignName (mapName, m, i);
ch.select (1);
var childChainCnt = ch.getChildChainCount ();
for (var j = 0; j < childChainCnt; j++) {
var childChain = ch.getChildChain (j);
childChain.select (1);
}
map.setNeedsReading (2);
map.readRegion (this);
map.writeTo (directory, mName);
ch.select (3);
for (var j = 0; j < childChainCnt; j++) {
var childChain = ch.getChildChain (j);
childChain.select (3);
}
}
map.setCutSelection (false);
if (this.viewer != null) {
this.viewer.setMapStateFromMap (map);
this.viewer.populateFromMapState ();
}}, "~S,~S,~S");
Clazz.defineMethod (c$, "defineMapMolecule", 
function (molName, where) {
var m = this.findMolecule (molName);
if (m == null) {
System.out.print ("Molecule: " + molName);
System.out.println (" not found.  Fail to do 'MAP DEFINE MOLECULE");
return;
}var nChains = m.getChainCount ();
var uChains =  new JU.SB ();
for (var i = 0; i < nChains; i++) {
var ch = m.getChain (i);
var chName = ch.getName ();
var key = ";" + chName + ";";
if (uChains.indexOf (key) >= 0) continue;
uChains.append (key);
var mapName = this.assignName (null, m, i);
ch.select (1);
var ch2;
for (var j = i + 1; j < nChains; j++) if ((ch2 = m.getChain (j)).getName ().equals (chName)) ch2.select (1);

this.defineMapSelection (-1.0, mapName, m);
var fileName = where + System.getProperty ("file.separator") + mapName;
fileName += ".bit";
this.writeMap (mapName, fileName);
ch.select (3);
for (var j = i + 1; j < nChains; j++) if ((ch2 = m.getChain (j)).getName ().equals (chName)) ch2.select (3);

}
}, "~S,~S");
Clazz.defineMethod (c$, "assignName", 
 function (mapName, m, chainId) {
var ch = m.getChain (chainId);
var chName = ch.getName ();
var chCnt = 0;
for (var i = 0; i < chainId; i++) {
if (m.getChain (i).getName () === chName) chCnt++;
}
var name = "";
if (mapName != null) name = mapName + "_";
name += m.getName () + "_" + chName;
if (chName.matches ("[a-z]")) name += chName;
if (chCnt > 0) name += chCnt;
return name;
}, "~S,astex.model.Molecule,~N");
Clazz.defineMethod (c$, "defineMapSelection", 
function (tolerance, name, m) {
var nAtoms = this.getSelectedAtomCount ();
if (nAtoms == 0) {
System.out.println ("No atoms selected, no mask created.");
return;
}var atoms = this.getSelectedAtoms ();
var map = astex.render.MoleculeRenderer.newVolumeMap ();
var np = map.defineMapSelection (nAtoms, atoms, tolerance, name, m);
this.addMap (map);
System.out.print ("Created mask: " + name + " with " + np + " points");
System.out.println (" using a tolerance of " + tolerance + " A");
}, "~N,~S,astex.model.Molecule");
Clazz.defineMethod (c$, "mapVolume", 
function (mapName) {
var map = this.findMap (mapName);
if (map == null) {
System.out.println ("Could not find map named: \"" + mapName + "\", can not calculate map volume data.");
return;
}var fName = astex.io.FILE.trimExt (map.getFile ()) + mapName + ".volume";
var stats = map.getMinMax ();
var level = stats[2] + stats[4];
map.writeVolume (level, fName);
}, "~S");
Clazz.defineMethod (c$, "mapFillDegree", 
function (mapName, level) {
var map = this.findMap (mapName);
if (map == null) {
System.out.println ("Could not find map named: \"" + mapName + "\", can not calculate map fill degree data.");
return;
}var fName = astex.io.FILE.trimExt (map.getFile ()) + mapName + ".fillLevel";
map.writeFillLevel (level, fName);
}, "~S,~N");
Clazz.defineMethod (c$, "mapVolumeLevel", 
function (mapName, level) {
var map = this.findMap (mapName);
if (map == null) {
System.out.println ("Could not find map named: \"" + mapName + "\", can not calculate map volume data.");
return;
}var fName = astex.io.FILE.trimExt (map.getFile ()) + mapName + ".volume";
map.writeVolume (level, fName);
}, "~S,~N");
Clazz.defineMethod (c$, "findLevel", 
function (mapName, volume) {
var map = this.findMap (mapName);
if (map == null) {
System.out.println ("Could not find map named: \"" + mapName + "\", can not calculate map volume data.");
return;
}var fName = astex.io.FILE.trimExt (map.getFile ()) + mapName + ".level";
map.findLevel (fName, volume);
}, "~S,~N");
Clazz.defineMethod (c$, "setMapMatrix", 
function (mapName, m) {
var map = this.findMap (mapName);
if (map == null) {
System.out.println ("Could not find map named: \"" + mapName + "\", can not calculate map volume data.");
} else {
map.setAddTransform (m);
}}, "~S,astex.util.Matrix");
Clazz.defineMethod (c$, "mapVolume", 
function (mapName, nIntervals, doNeighbour) {
var map = this.findMap (mapName);
if (map == null) {
System.out.println ("Could not find map named: \"" + mapName + "\", can not calculate map volume data.");
return;
}var fName = astex.io.FILE.trimExt (map.getFile ()) + mapName + ".volume";
var b = doNeighbour.equals ("true") ? true : false;
map.writeVolume (nIntervals, fName, b);
}, "~S,~N,~S");
Clazz.defineMethod (c$, "mapGraph", 
function (mapName, nIntervals, findMax) {
var map = this.findMap (mapName);
if (map == null) {
System.out.println ("Could not find map named: \"" + mapName + "\", can not calculate grey density data.");
return;
}var fName = astex.io.FILE.trimExt (map.getFile ()) + mapName + ".graph";
map.writeGraph (nIntervals, fName, findMax);
}, "~S,~N,~B");
Clazz.defineMethod (c$, "mapModelFitAll", 
function (mapName, modelName, nIntervals) {
var map = this.findMap (mapName);
if (map == null) {
System.out.println ("Could not find map named: \"" + mapName + "\", can not check map model fit.");
return;
}var mols =  new JU.Lst ();
var moleculeCount = this.molecules.size ();
for (var m = 0; m < moleculeCount; m++) {
var model = this.molecules.get (m);
if (model.getName ().startsWith (modelName)) mols.addLast (model);
}
if (mols.size () == 0) {
System.out.println ("Could not find model named: \"" + modelName + "\", can not check map model fit.");
return;
}var minMax = map.getMinMax ();
var mtrx =  new astex.util.Matrix ();
for (var i = 0; i <= nIntervals; i++) {
var level = minMax[0] + i / nIntervals * minMax[3];
this.mapModelFit (map, mols, level, i, true, mtrx, false);
}
}, "~S,~S,~N");
Clazz.defineMethod (c$, "drawMaps", 
function () {
var mapCount = this.getMapCount ();
for (var m = 0; m < mapCount; m++) {
var map = this.getMap (m);
if (map.getVolumeRender ()) {
this.drawMapVolumeRender (map);
}if (map.getShowGrid ()) {
this.drawGrid (map);
}if (map.getShowMaskLabels ()) {
this.drawMapMaskLabels (map);
}}
});
Clazz.defineMethod (c$, "drawGrid", 
 function (map) {
var p1 =  new astex.util.Point3d ();
var p2 =  new astex.util.Point3d ();
var width = 1.0;
var minimumGrid = map.getMinGrid ();
var maximumGrid = map.getMaxGrid ();
var nu = map.getNu ();
map.absoluteGridToCartesian (nu[0] + minimumGrid[0], nu[1] + minimumGrid[1], nu[2] + minimumGrid[2], p1);
map.absoluteGridToCartesian (nu[0] + minimumGrid[0], nu[1] + minimumGrid[1], nu[2] + maximumGrid[2], p2);
this.drawLineD (p1.x, p1.y, p1.z, p2.x, p2.y, p2.z, astex.util.Color32.yellow, astex.util.Color32.yellow, width);
map.absoluteGridToCartesian (nu[0] + minimumGrid[0], nu[1] + maximumGrid[1], nu[2] + minimumGrid[2], p2);
this.drawLineD (p1.x, p1.y, p1.z, p2.x, p2.y, p2.z, astex.util.Color32.yellow, astex.util.Color32.yellow, width);
map.absoluteGridToCartesian (nu[0] + maximumGrid[0], nu[1] + minimumGrid[1], nu[2] + minimumGrid[2], p2);
this.drawLineD (p1.x, p1.y, p1.z, p2.x, p2.y, p2.z, astex.util.Color32.yellow, astex.util.Color32.yellow, width);
map.absoluteGridToCartesian (nu[0] + maximumGrid[0], nu[1] + minimumGrid[1], nu[2] + minimumGrid[2], p1);
map.absoluteGridToCartesian (nu[0] + maximumGrid[0], nu[1] + minimumGrid[1], nu[2] + maximumGrid[2], p2);
this.drawLineD (p1.x, p1.y, p1.z, p2.x, p2.y, p2.z, astex.util.Color32.yellow, astex.util.Color32.yellow, width);
map.absoluteGridToCartesian (nu[0] + maximumGrid[0], nu[1] + maximumGrid[1], nu[2] + minimumGrid[2], p2);
this.drawLineD (p1.x, p1.y, p1.z, p2.x, p2.y, p2.z, astex.util.Color32.yellow, astex.util.Color32.yellow, width);
map.absoluteGridToCartesian (nu[0] + minimumGrid[0], nu[1] + maximumGrid[1], nu[2] + minimumGrid[2], p1);
map.absoluteGridToCartesian (nu[0] + maximumGrid[0], nu[1] + maximumGrid[1], nu[2] + minimumGrid[2], p2);
this.drawLineD (p1.x, p1.y, p1.z, p2.x, p2.y, p2.z, astex.util.Color32.yellow, astex.util.Color32.yellow, width);
map.absoluteGridToCartesian (nu[0] + minimumGrid[0], nu[1] + maximumGrid[1], nu[2] + maximumGrid[2], p2);
this.drawLineD (p1.x, p1.y, p1.z, p2.x, p2.y, p2.z, astex.util.Color32.yellow, astex.util.Color32.yellow, width);
map.absoluteGridToCartesian (nu[0] + minimumGrid[0], nu[1] + minimumGrid[1], nu[2] + maximumGrid[2], p1);
map.absoluteGridToCartesian (nu[0] + maximumGrid[0], nu[1] + minimumGrid[1], nu[2] + maximumGrid[2], p2);
this.drawLineD (p1.x, p1.y, p1.z, p2.x, p2.y, p2.z, astex.util.Color32.yellow, astex.util.Color32.yellow, width);
map.absoluteGridToCartesian (nu[0] + minimumGrid[0], nu[1] + maximumGrid[1], nu[2] + maximumGrid[2], p2);
this.drawLineD (p1.x, p1.y, p1.z, p2.x, p2.y, p2.z, astex.util.Color32.yellow, astex.util.Color32.yellow, width);
map.absoluteGridToCartesian (nu[0] + maximumGrid[0], nu[1] + maximumGrid[1], nu[2] + maximumGrid[2], p1);
map.absoluteGridToCartesian (nu[0] + minimumGrid[0], nu[1] + maximumGrid[1], nu[2] + maximumGrid[2], p2);
this.drawLineD (p1.x, p1.y, p1.z, p2.x, p2.y, p2.z, astex.util.Color32.yellow, astex.util.Color32.yellow, width);
map.absoluteGridToCartesian (nu[0] + maximumGrid[0], nu[1] + minimumGrid[1], nu[2] + maximumGrid[2], p2);
this.drawLineD (p1.x, p1.y, p1.z, p2.x, p2.y, p2.z, astex.util.Color32.yellow, astex.util.Color32.yellow, width);
map.absoluteGridToCartesian (nu[0] + maximumGrid[0], nu[1] + maximumGrid[1], nu[2] + minimumGrid[2], p2);
this.drawLineD (p1.x, p1.y, p1.z, p2.x, p2.y, p2.z, astex.util.Color32.yellow, astex.util.Color32.yellow, width);
}, "astex.map.VolumeMap");
Clazz.defineMethod (c$, "drawMapVolumeRender", 
function (map) {
map.drawVolumeRender (this, this.renderer);
}, "astex.map.VolumeMap");
Clazz.defineMethod (c$, "drawMapMaskLabels", 
 function (map) {
var nMasks = map.getMasks ().size ();
for (var i = 0; i < nMasks; i++) {
var mask = map.getMasks ().get (i);
var pos = mask.getLabelPosition ();
var p =  new astex.util.Point3d ();
map.relativeGridToCartesian (pos, p);
var offset = 25.0;
var maskColor =  new java.awt.Color (mask.getColor ());
var labelColor = astex.util.Color32.black;
if (maskColor.getRed () < 105 && maskColor.getGreen () < 90 && maskColor.getBlue () < 170) labelColor = astex.util.Color32.white;
this.renderer.drawStringZoff (p.x, p.y, p.z, offset, labelColor, mask.getLabel ());
}
}, "astex.map.VolumeMap");
Clazz.defineMethod (c$, "checkCopy", 
function (mol, mtrx) {
var mapCount = this.getMapCount ();
if (mapCount == 0) return 1.0;
var map = this.getMap (0);
var level = map.getRawLevel ();
var mols =  new JU.Lst ();
mols.addLast (mol);
return this.mapModelFit (map, mols, level, 0, false, mtrx, false);
}, "astex.model.Molecule,astex.util.Matrix");
Clazz.defineMethod (c$, "mapModelFitByName", 
function (mapName, modelName, level, round, doRes) {
var map = this.findMap (mapName);
if (map == null) {
System.out.println ("Could not find map named: \"" + mapName + "\", can not check map model fit.");
return;
}var mols =  new JU.Lst ();
var moleculeCount = this.molecules.size ();
for (var m = 0; m < moleculeCount; m++) {
var model = this.molecules.get (m);
if (model.getName ().startsWith (modelName)) mols.addLast (model);
}
if (mols.size () == 0) {
System.out.println ("Could not find model named: \"" + modelName + "\", can not check map model fit.");
return;
}var mtrx =  new astex.util.Matrix ();
this.mapModelFit (map, mols, level, round, true, mtrx, doRes);
}, "~S,~S,~N,~N,~B");
Clazz.defineMethod (c$, "mapModelFit", 
function (map, mols, level, round, writeToFile, mtrx, doRes) {
return map.mapModelFit (mols, level, round, writeToFile, mtrx, doRes);
}, "astex.map.VolumeMap,JU.Lst,~N,~N,~B,astex.util.Matrix,~B");
Clazz.defineMethod (c$, "writeMap", 
function (mapName, fileName, dataMode) {
var map = this.findMap (mapName);
if (map == null) {
System.out.print ("Could not find map named: " + mapName);
System.out.println (" failed to write map.");
return;
}map.write (fileName, dataMode, false);
}, "~S,~S,~N");
Clazz.defineMethod (c$, "writeMap", 
function (mapName, fileName) {
this.writeMap (mapName, fileName, 2);
}, "~S,~S");
Clazz.defineMethod (c$, "writeMapHeader", 
function (mapName) {
var map = this.findMap (mapName);
if (map == null) {
System.out.print ("Could not find map named: " + mapName);
System.out.println (" failed to write map header.");
return;
}map.writeHeader ();
}, "~S");
Clazz.defineMethod (c$, "addMaskFromFile", 
function (mapName, mask) {
var map = this.findMap (mapName);
if (mask.read (map) == 0) {
map.addMask (mask);
this.contourMaps ();
this.fireMaskAddedEvent (mask);
}}, "~S,astex.api.AstexMask");
Clazz.defineMethod (c$, "segger", 
function (mapName, segFileName, level) {
var map = this.findMap (mapName);
if (map == null) {
System.out.println ("Cound not find map: '" + mapName + "', make sure that it has been loaded");
} else {
var mask = map.readSegger (segFileName, level);
if (mask != null) {
this.contourMaps ();
this.fireMaskAddedEvent (mask);
}}}, "~S,~S,~N");
Clazz.defineMethod (c$, "createMaskLevel", 
function (map, color, label, threshold) {
map.createMaskLevel (color, label, threshold);
this.contourMaps ();
this.fireMaskAddedEvent (map.getMaskByName (label, true));
}, "astex.map.VolumeMap,~N,~S,~N");
Clazz.defineMethod (c$, "createMask", 
function (map, color, label, tolerance) {
var mask = map.createMask (color, label, tolerance);
this.addMask (map, mask, tolerance);
this.contourMaps ();
this.fireMaskAddedEvent (mask);
}, "astex.map.VolumeMap,~N,~S,~N");
c$.newMapMask = Clazz.defineMethod (c$, "newMapMask", 
function (np) {
return (astex.api.Interface.getInterface ("astex.map.MapMask")).set (np);
}, "~N");
c$.newMarch = Clazz.defineMethod (c$, "newMarch", 
function () {
return (astex.api.Interface.getInterface ("astex.map.March"));
});
Clazz.defineMethod (c$, "addMask", 
function (map, mask, tolerance) {
var nAtoms = this.getSelectedAtomCount ();
if (nAtoms == 0) {
System.out.println ("No atoms selected, no mask created.");
return;
}map.addMaskSelected (mask, tolerance, nAtoms, this.getSelectedAtoms ());
}, "astex.map.VolumeMap,astex.api.AstexMask,~N");
Clazz.defineMethod (c$, "writeAllMasks", 
function (mapName, directory) {
var map = this.findMap (mapName);
if (map == null) {
System.out.print ("Could not find map: " + mapName);
System.out.println (" Failed to writeAllMasks()");
return;
}var nMasks = map.getMasks ().size ();
for (var i = 0; i < nMasks; i++) {
var mask = map.getMaskByIndex (i);
var fileName =  String.instantialize ();
if (directory != null) {
fileName = directory + System.getProperty ("file.separator");
}var label = mask.getLabel ();
fileName += mapName + "_" + label;
var pos = label.lastIndexOf ('_');
if (pos != -1) {
var ch = label.substring (pos + 1, pos + 2);
if (ch.matches ("[a-z]")) {
fileName += ch;
}}fileName += ".mask";
try {
mask.write (fileName);
} catch (e$$) {
if (Clazz.exceptionOf (e$$, java.io.FileNotFoundException)) {
var e = e$$;
{
System.out.println ("Failed to open file: " + fileName);
System.out.println ("Error message: " + e.getMessage ());
}
} else if (Clazz.exceptionOf (e$$, java.io.IOException)) {
var e = e$$;
{
System.out.println ("An IO Exception happened while writing to file: " + fileName);
System.out.println ("Error message: " + e.getMessage ());
}
} else {
throw e$$;
}
}
}
System.out.println ("Written " + nMasks + " masks to file(s)");
}, "~S,~S");
Clazz.defineMethod (c$, "contractMask", 
function (mapName, maskName) {
var mask = this.getMaskByName (mapName, maskName);
mask.contract ();
this.contourMaps ();
}, "~S,~S");
Clazz.defineMethod (c$, "expandMask", 
function (mapName, maskName) {
var mask = this.getMaskByName (mapName, maskName);
mask.expand ();
this.contourMaps ();
}, "~S,~S");
Clazz.defineMethod (c$, "maskColor", 
function (mapName, maskName, color) {
var mask = this.getMaskByName (mapName, maskName);
if (mask != null) {
mask.setColor (color);
this.contourMaps ();
System.out.println ("Set color for mask " + maskName);
}}, "~S,~S,~N");
Clazz.defineMethod (c$, "maskName", 
function (mapName, maskName, name) {
var mask = this.getMaskByName (mapName, maskName);
if (mask != null) {
mask.setLabel (name);
this.fireMaskEditedEvent (mapName, mask);
System.out.println ("Set name for mask " + maskName + " to " + name);
}}, "~S,~S,~S");
Clazz.defineMethod (c$, "maskResize", 
function (mapName, maskName, tolerance) {
var map = this.findMap (mapName);
var mask = this.getMaskByName (mapName, maskName);
if (mask != null) {
if (this.getSelectedAtomCount () == 0) {
System.out.println ("No atoms selected, mask not updated.");
return;
}mask.getMask ().clearAll ();
this.addMask (map, mask, tolerance);
this.contourMaps ();
}}, "~S,~S,~N");
Clazz.defineMethod (c$, "getMaskByName", 
function (mapName, maskName) {
return (this.maps.size () == 0 ? null : (this.maps.get (0)).getMaskByName (this.maps, mapName, maskName));
}, "~S,~S");
Clazz.defineMethod (c$, "maskLogic", 
function (mapName, mask1, mask2, mask3, op) {
var m3 = (astex.api.Interface.getInterface ("astex.map.MapMask")).maskLogic (mapName, mask1, mask2, mask3, op, this.maps);
this.fireMaskAddedEvent (m3);
}, "~S,~S,~S,~S,~N");
Clazz.defineMethod (c$, "clipMapsByDistance", 
function () {
var atomsInSphere = this.getAtomsInSphere (this.renderer.getCenter (), this.displayRadius);
this.clipMaps (null, atomsInSphere, false);
});
Clazz.defineMethod (c$, "clipMaps", 
function (namePattern, selection, inside) {
var n = this.getMapCount ();
if (n == 0) return;
this.getMap (0).clipMaps (this, namePattern, selection, inside);
this.contourMaps ();
}, "~S,astex.util.DynamicArray,~B");
Clazz.defineMethod (c$, "addGraphicalObject", 
function (tm) {
var newName = tm.getName ();
var graphicalObjectCount = this.getGraphicalObjectCount ();
for (var i = 0; i < graphicalObjectCount; i++) {
var object = this.getGraphicalObjectI (i);
var name = object.getName ();
if (name != null && newName != null && newName.equals (name)) {
this.removeGraphicalObject (object, true);
}}
this.objects.add (tm);
tm.setRenderer (this);
this.renderer.fireRendererEvent ( new astex.render.RendererEvent (1, tm));
}, "astex.render.Tmesh");
Clazz.defineMethod (c$, "getGraphicalObjectCount", 
function () {
return this.objects.size ();
});
Clazz.defineMethod (c$, "getGraphicalObjectI", 
function (i) {
return this.objects.get (i);
}, "~N");
Clazz.defineMethod (c$, "getGraphicalObjectByName", 
function (targetName) {
var graphicalObjectCount = this.getGraphicalObjectCount ();
for (var i = graphicalObjectCount - 1; i >= 0; i--) {
var object = this.objects.get (i);
var name = object.getName ();
if (name != null && targetName != null && name.equals (targetName)) {
return object;
}}
return null;
}, "~S");
Clazz.defineMethod (c$, "getGraphicalObjects", 
function (pattern) {
var matchingObjects =  new astex.util.DynamicArray ();
var graphicalObjectCount = this.getGraphicalObjectCount ();
for (var i = 0; i < graphicalObjectCount; i++) {
var object = this.getGraphicalObjectI (i);
var name = object.getName ();
if (name != null && astex.util.Mmatch.matches (pattern, name)) {
matchingObjects.add (object);
}}
return matchingObjects;
}, "~S");
Clazz.defineMethod (c$, "setGraphicalObjectsColour", 
function (pattern, colour) {
var graphicalObjectCount = this.getGraphicalObjectCount ();
for (var i = graphicalObjectCount - 1; i >= 0; i--) {
var object = this.objects.get (i);
var name = object.getName ();
if (name != null && astex.util.Mmatch.matches (pattern, name)) {
object.setColor (colour);
}}
}, "~S,~N");
Clazz.defineMethod (c$, "setGraphicalObjectsVisibility", 
function (pattern, state) {
var graphicalObjectCount = this.getGraphicalObjectCount ();
for (var i = graphicalObjectCount - 1; i >= 0; i--) {
var object = this.getGraphicalObjectI (i);
var name = object.getName ();
if (name != null && astex.util.Mmatch.matches (pattern, name)) {
if (state == 0) {
object.setVisible (false);
} else if (state == 1) {
object.setVisible (true);
} else if (state == 2) {
if (object.isVisible ()) {
object.setVisible (false);
} else {
object.setVisible (true);
}}}}
}, "~S,~N");
Clazz.defineMethod (c$, "removeGraphicalObjects", 
function (pattern) {
var graphicalObjectCount = this.getGraphicalObjectCount ();
for (var i = graphicalObjectCount - 1; i >= 0; i--) {
var object = this.getGraphicalObjectI (i);
var name = object.getName ();
if (name != null && astex.util.Mmatch.matches (pattern, name)) {
this.removeGraphicalObject (object, true);
}}
}, "~S");
Clazz.defineMethod (c$, "removeGraphicalObject", 
function (tm) {
this.removeGraphicalObject (tm, true);
}, "astex.render.Tmesh");
Clazz.defineMethod (c$, "removeGraphicalObject", 
function (tm, fireEvent) {
if (this.objects.contains (tm)) {
this.objects.remove (tm);
tm.setRenderer (null);
if (fireEvent) {
var re =  new astex.render.RendererEvent (2, tm);
this.renderer.fireRendererEvent (re);
}}}, "astex.render.Tmesh,~B");
Clazz.defineMethod (c$, "removeGraphicalObjectsBeginningWith", 
function (prefix) {
var graphicalObjectCount = this.getGraphicalObjectCount ();
for (var i = graphicalObjectCount - 1; i >= 0; i--) {
var object = this.getGraphicalObjectI (i);
var name = object.getName ();
if (name != null && name.startsWith (prefix)) {
this.removeGraphicalObject (object, true);
}}
}, "~S");
Clazz.defineMethod (c$, "applyTexture", 
function (pattern, texName) {
var tex = null;
if ("off".equals (texName)) texName = null;
if (texName != null) {
tex = this.textures.get (texName);
if (tex == null) {
System.out.println ("applyTexture: couldn't find texture " + texName);
return;
}}var graphicalObjectCount = this.getGraphicalObjectCount ();
for (var i = 0; i < graphicalObjectCount; i++) {
var object = this.getGraphicalObjectI (i);
var name = object.getName ();
if (name != null && astex.util.Mmatch.matches (pattern, name)) {
object.texture = tex;
}}
}, "~S,~S");
Clazz.defineMethod (c$, "scaleTexture", 
function (pattern, attribute, value) {
var graphicalObjectCount = this.getGraphicalObjectCount ();
for (var i = 0; i < graphicalObjectCount; i++) {
var object = this.getGraphicalObjectI (i);
var name = object.getName ();
if (name != null && astex.util.Mmatch.matches (pattern, name)) {
if (attribute == 1) {
object.setUScale (value);
} else if (attribute == 2) {
object.setVScale (value);
} else if (attribute == 3) {
object.setUOffset (value);
} else if (attribute == 4) {
object.setVOffset (value);
} else {
System.out.println ("scaleTexture: unknown attribute " + attribute);
}}}
}, "~S,~N,~N");
Clazz.defineMethod (c$, "setGraphicalObjectBackface", 
function (pattern, value) {
var graphicalObjectCount = this.getGraphicalObjectCount ();
for (var i = 0; i < graphicalObjectCount; i++) {
var object = this.getGraphicalObjectI (i);
var name = object.getName ();
if (name != null && astex.util.Mmatch.matches (pattern, name)) {
object.setBackface (value);
}}
}, "~S,~B");
Clazz.defineMethod (c$, "processMapContour", 
function (sym, name, contour, sValue, dValue) {
var maps = this.getMaps (name);
var contourObject;
var mode;
for (var i = 0; i < maps.size (); i++) {
var map = maps.get (i);
var doContour = false;
var ifDisplayed = false;
switch (sym) {
case 76:
switch (mode = astex.render.MoleculeRenderer.getOnOffMode (sValue)) {
case 0:
mode = 1;
break;
case 1:
mode = 2;
break;
case 2:
mode = (map.getContourStyle (contour) == 1 ? 2 : 1);
break;
}
map.setContourStyle (contour, mode);
doContour = true;
break;
case 132:
map.setContourLevel (contour, dValue);
ifDisplayed = true;
break;
case 36:
contourObject = this.getContourGraphicalObject (map, contour);
if (contourObject != null) contourObject.setLineWidth (dValue);
break;
case 115:
this.setMapContourTransparency (map, contour, Clazz.doubleToInt (dValue));
break;
case 84:
mode = astex.render.MoleculeRenderer.getOnOffMode (sValue);
map.setContourDisplayed (contour, mode == 1 || mode == 2 && !map.getContourDisplayed (contour));
if (map.getContourDisplayed (contour)) {
this.contourMap (map, contour);
} else {
contourObject = this.getContourGraphicalObject (map, contour);
contourObject.setVisible (false);
}break;
case 153:
if ("solid".equals (sValue)) {
map.setContourStyle (contour, 2);
doContour = true;
break;
} else if ("wire".equals (sValue)) {
map.setContourStyle (contour, 1);
doContour = true;
break;
}case 77:
map.setContourColor (contour, astex.util.Color32.getColorFromName (sValue));
ifDisplayed = true;
break;
}
if (doContour || ifDisplayed && map.getContourDisplayed (contour)) this.contourMap (map, contour);
}
}, "~N,~S,~N,~S,~N");
c$.getOnOffMode = Clazz.defineMethod (c$, "getOnOffMode", 
function (sValue) {
return (sValue.equals ("off") ? 0 : sValue.equals ("on") ? 1 : sValue.equals ("toggle") ? 2 : -1);
}, "~S");
Clazz.defineMethod (c$, "handleActiveSiteCommand", 
function (args) {
if (this.viewer != null) try {
(astex.api.Interface.getInterface ("astex.design.ActiveSite")).handleCommand (this.viewer, args);
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
} else {
throw e;
}
}
}, "astex.util.Arguments");
Clazz.defineMethod (c$, "processMapCommand", 
function (sym, name, file, dataMode, level, doSurf) {
var map;
switch (sym) {
case 72:
map = astex.render.MoleculeRenderer.newVolumeMap ();
map.setDataMode (dataMode == -2147483648 ? 2 : dataMode);
if (!Double.isNaN (level)) {
map.setRawLevel (level);
map.setMapMode (1);
}map.setFile (file);
map.setName (name);
map.setGenSurface (doSurf);
this.addMap (map);
break;
case 65:
this.removeMap (name);
break;
case 64:
this.removeAllMaps ();
this.processMapCommand (72, name, file, dataMode, level, doSurf);
break;
case 143:
this.writeMap (name, file, (dataMode == -2147483648 ? 2 : dataMode));
break;
}
}, "~N,~S,~S,~N,~N,~B");
Clazz.defineMethod (c$, "processSelect", 
function (sym, name, selectedAtoms) {
var n = (selectedAtoms == null ? 0 : selectedAtoms.size ());
switch (sym) {
case 104:
this.setAtomsAllSelected (false);
sym = 106;
case 106:
case 107:
case 105:
var mode = (sym == 105 ? 2 : sym == 106 ? 1 : 0);
this.setSelected (selectedAtoms, mode);
break;
case 112:
System.out.println ("storing definition " + name + " atom count " + selectedAtoms.size ());
var h =  new java.util.Hashtable ();
for (var i = n; --i >= 0; ) {
var a = selectedAtoms.get (i);
h.put (a, a);
}
this.groups.put (name, h);
break;
case 140:
this.handleDeleteCommand (selectedAtoms);
break;
case 108:
this.pushSelection ();
break;
case 124:
this.groups.remove (name);
break;
}
}, "~N,~S,astex.util.DynamicArray");
Clazz.defineMethod (c$, "processMaskCommand", 
function (sym, mapName, maskName, s1, s2, value) {
var map = (mapName == null ? null : this.findMap (mapName));
var mask;
switch (sym) {
case 72:
mask = astex.render.MoleculeRenderer.newMapMask (0);
mask.setFileName (s1);
this.addMaskFromFile (mapName, mask);
break;
case 143:
if (maskName == null) {
this.writeAllMasks (mapName, s1);
} else {
mask = this.findMap (mapName).getMaskByName (maskName, true);
if (mask != null) mask.write (s1);
}break;
case 104:
this.createMask (map, astex.util.Color32.getColorFromName (s2), maskName, value);
break;
case 112:
if (s1 == null) {
this.createMaskLevel (map, astex.util.Color32.getColorFromName (s2), maskName, value);
} else {
this.defineMaskAll (mapName, s1);
}break;
case 92:
for (var i = Clazz.doubleToInt (value); --i >= 0; ) this.expandMask (mapName, maskName);

break;
case 93:
this.contractMask (mapName, maskName);
break;
case 65:
this.removeMaskByName (mapName, maskName);
break;
case 77:
this.maskColor (mapName, maskName, astex.util.Color32.getColorFromName (s2));
break;
case 44:
this.maskName (mapName, maskName, s1);
break;
case 88:
this.maskResize (mapName, maskName, value);
break;
case 11:
this.maskLogic (mapName, maskName, s1, s2, 1);
break;
case 12:
this.maskLogic (mapName, maskName, s1, s2, 2);
break;
case 14:
this.maskLogic (mapName, maskName, s1, s2, 3);
break;
case 107:
this.maskLogic (mapName, maskName, s1, s2, 4);
break;
}
}, "~N,~S,~S,~S,~S,~N");
Clazz.defineMethod (c$, "processSetCommand", 
function (name, b, s, iValue) {
if (name.equals ("bondtypes")) {
this.displayBondTypes (b);
} else if (name.equals ("bump_in_same_molecule")) {
this.setBumpInSameMolecule (b);
} else if (name.equals ("symmetry")) {
this.setSymmetry (b);
} else if (name.equals ("bumps")) {
this.setDisplayBumps (b);
} else if (name.equals ("selectcount")) {
this.setPrintSelectCount (b);
} else if (name.equals ("axes")) {
this.setDisplayAxes (b);
} else if (name.equals ("maps")) {
this.setDisplayMaps (b);
} else if (name.equals ("arraycopy")) {
System.out.println ("set arraycopy ignored");
} else if (name.equals ("createsymmol")) {
if (s == null) s = "" + iValue;
var comps = s.$plit ("____");
try {
this.createSymmetricMolecule (comps[0], comps[1], Integer.parseInt (comps[2]), Integer.parseInt (comps[3]), Integer.parseInt (comps[4]), Integer.parseInt (comps[5]));
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
System.out.println ("set createsymbol " + s + " could not be parsed as molname____symmolname____symopnum____ix____iy____iz");
} else {
throw e;
}
}
} else if (name.equals ("minimumspacing")) {
this.getSurface ().setMinimumSpacing (s == null ? iValue : astex.io.FILE.readDouble (s));
} else if (name.equals ("contoursize")) {
this.setContourSize (s == null ? iValue : astex.io.FILE.readInteger (s));
} else if (name.equals ("pick")) {
if (s.equals ("distances")) {
this.setPickMode (2);
} else if (s.equals ("angles")) {
this.setPickMode (3);
} else {
System.out.println ("invalid pick mode " + s);
}} else if (name.equals ("mode")) {
if (s.equals ("original")) {
this.setMode (1);
} else if (s.equals ("fullmap")) {
this.setMode (2);
} else {
System.out.println ("invalid mode " + s);
}} else if (name.equals ("ncontours")) {
if (iValue < 1 || iValue > 3) {
System.out.println ("The number of contour levels must be between 1 and 3, " + iValue + " was supplied, ignored");
} else {
this.setNContours (iValue);
}} else {
System.out.println ("invalid parameter " + name);
}}, "~S,~B,~S,~N");
Clazz.defineMethod (c$, "processEditCommand", 
function (name, value, selectedAtoms) {
if (name.equals ("type")) {
for (var i = selectedAtoms.size (); --i >= 0; ) (selectedAtoms.get (i)).setAtomType (name);

} else {
System.out.println ("EDIT command requires keyword \"type\"");
}}, "~S,~S,astex.util.DynamicArray");
Clazz.defineMethod (c$, "getTransformer", 
 function () {
return (this.transformer == null ? this.transformer = astex.api.Interface.getInterface ("astex.calc.Transformer") : this.transformer);
});
Clazz.defineMethod (c$, "processMove", 
function (type, data, selectedAtoms) {
if (type != null) this.getTransformer ().transform (this, type, selectedAtoms);
 else switch (data.length) {
case 2:
this.getTransformer ().moveAtoms (Clazz.doubleToInt (data[0]), data[1], selectedAtoms);
break;
case 3:
this.getTransformer ().translate (data[0], data[1], data[2], selectedAtoms);
break;
case 7:
this.getTransformer ().rotateByAxis (data[0], data[1], data[2], data[3], data[4], data[5], data[6], selectedAtoms);
break;
case 9:
this.getTransformer ().rotateByMatrix (data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[7], data[8], selectedAtoms);
break;
}
}, "~S,~A,astex.util.DynamicArray");
Clazz.defineMethod (c$, "setAtomsAllSelected", 
function (TF) {
var atomIterator = this.getAtomIterator ();
while (atomIterator.hasMoreElements ()) {
var atom = atomIterator.getNextAtom ();
atom.setSelected (TF);
}
}, "~B");
Clazz.defineMethod (c$, "maskToArray", 
function (mask, doCommand) {
var atomCount = this.getAtomCount ();
var n = 0;
for (var i = mask.length; --i >= 0; ) if (mask[i] > 0) n++;

var selectedAtoms =  new astex.util.DynamicArray ().set (n, 0);
var iterator = this.getAtomIterator ();
for (var i = 0; i < atomCount; i++) if (mask[i] > 0) selectedAtoms.add (iterator.getAtom (i));

if (doCommand && this.pdbeOptionPrintCount && this.printSelectCount) System.out.println ("[" + n + "]");
return selectedAtoms;
}, "~A,~B");
Clazz.defineMethod (c$, "processSurface", 
function (name, lazy, isAnalytical, probeRadius, quality, colour, solid, selectedAtoms) {
if (lazy && this.getGraphicalObjectByName (name) != null) {
System.out.println ("No atoms selected, no surface generated");
return;
}this.removeGraphicalObjects (name);
var color = astex.util.Color32.getColorFromName (colour);
var selectedAtomCount = selectedAtoms.size ();
if (selectedAtomCount == 0) return;
if (isAnalytical) {
var xyz =  Clazz.newDoubleArray (selectedAtomCount, 3, 0);
var r =  Clazz.newDoubleArray (selectedAtomCount, 0);
var visible =  Clazz.newIntArray (selectedAtomCount, 0);
var colors =  Clazz.newIntArray (selectedAtomCount, 0);
for (var i = 0; i < selectedAtomCount; i++) {
var a = selectedAtoms.get (i);
xyz[i][0] = a.x;
xyz[i][1] = a.y;
xyz[i][2] = a.z;
r[i] = a.getVDWRadius ();
visible[i] = 1;
colors[i] = a.getColor ();
}
var tm = (astex.api.Interface.getInterface ("astex.anasurface.Anasurface")).construct (color, probeRadius, quality, xyz, r, visible, colors, selectedAtomCount);
tm.setName (name);
this.addGraphicalObject (tm);
return;
}if (probeRadius < 0) {
var dotSurface = this.getSurface ().dotSurface (selectedAtoms, quality);
dotSurface.setName (name);
this.addGraphicalObject (dotSurface);
return;
}this.getSurface ().setProbeRadius (probeRadius);
var surface = this.getSurface ().connolly (selectedAtoms, 0.3, solid);
surface.setName (name);
var c = astex.util.Color32.getColorFromName (colour);
surface.setColor (c);
if (this.surfaceSymops == null || this.surfaceSymops.size () == 0) {
this.addGraphicalObject (surface);
} else {
for (var counter = 0; counter < this.surfaceSymops.size (); counter++) {
try {
var op = this.surfaceSymops.get (counter);
var opname = this.surfaceSymopNames.get (counter);
var surf1 = astex.render.Tmesh.readFromData (surface, op);
surf1.setName (surface.getName () + opname);
this.addGraphicalObject (surf1);
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
this.viewer.jsalert (e.toString ());
} else {
throw e;
}
}
}
}}, "~S,~B,~B,~N,~N,~S,~B,astex.util.DynamicArray");
Clazz.defineMethod (c$, "removeAllSurfaceSymops", 
function () {
if (this.surfaceSymops == null) return;
this.surfaceSymops.clear ();
this.surfaceSymops = null;
this.surfaceSymopNames.clear ();
this.surfaceSymopNames = null;
});
Clazz.defineMethod (c$, "addSurfaceSymop", 
function (opname, op) {
if (this.surfaceSymops == null) {
this.surfaceSymops =  new JU.Lst ();
this.surfaceSymopNames =  new JU.Lst ();
}this.surfaceSymops.addLast (op);
this.surfaceSymopNames.addLast (opname);
}, "~S,~A");
Clazz.defineMethod (c$, "addCell", 
function (cellname, range, dx, dy, dz) {
var linemesh =  new astex.render.Tmesh ();
var verts = [[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0], [0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]];
var pairs = [[0, 4], [0, 3], [0, 1], [1, 2], [1, 5], [2, 6], [2, 3], [3, 7], [7, 6], [7, 4], [5, 4], [5, 6]];
var np = 0;
for (var x = -1 * range; x <= range; x++) for (var y = -1 * range; y <= range; y++) for (var z = -1 * range; z <= range; z++) {
var beforenp = np;
for (var vi = 0; vi < verts.length; vi++) {
linemesh.addPointNoColor (x * dx + verts[vi][0] * dx, y * dy + verts[vi][1] * dy, z * dz + verts[vi][2] * dz, 0, 0, 0, 1, 1);
np++;
}
for (var pi = 0; pi < pairs.length; pi++) linemesh.addTriangle (beforenp + pairs[pi][0], beforenp + pairs[pi][1], 1, 0x001100);

}


linemesh.style = 2;
linemesh.setName (cellname);
this.addGraphicalObject (linemesh);
this.viewer.dirtyRepaint ();
}, "~S,~N,~N,~N,~N");
Clazz.defineMethod (c$, "processBondAttr", 
function (sym, newr, ival, selectedAtoms) {
var selectedBonds = this.getBondsInSelection (selectedAtoms);
for (var i = 0; i < selectedBonds.size (); i++) {
var b = selectedBonds.get (i);
switch (sym) {
case 31:
b.setStickWidth (newr);
break;
case 34:
b.setCylinderWidth (newr);
break;
case 35:
b.setBondWidth (ival);
break;
case 32:
b.setBondColor (ival);
break;
}
}
}, "~N,~N,~N,astex.util.DynamicArray");
Clazz.defineMethod (c$, "processAtomAttr", 
function (sym, newr, selectedAtoms) {
for (var i = selectedAtoms.size (); --i >= 0; ) {
var a = selectedAtoms.get (i);
switch (sym) {
case 89:
a.setVDWRadius (newr);
break;
case 33:
a.setBallRadius (newr);
break;
case 90:
a.setPartialCharge (newr);
break;
}
}
}, "~N,~N,astex.util.DynamicArray");
Clazz.defineMethod (c$, "processStructureCommands", 
function (args, type, selectedAtoms) {
if (args != null) {
var tm = (astex.api.Interface.getInterface ("astex.map.Schematic")).create (args, this, selectedAtoms);
this.addGraphicalObject (tm);
return;
}if (type == null) {
var tm = astex.model.SecondaryStructure.assign (this.getMolecules ());
if (astex.model.SecondaryStructure.debug) {
this.addGraphicalObject (tm);
}return;
}var sstype;
if (type.equals ("helix")) {
sstype = 2;
} else if (type.equals ("sheet")) {
sstype = 1;
} else if (type.equals ("coil")) {
sstype = 5;
} else {
return;
}var res = this.getSelectedResidues (selectedAtoms);
for (var i = res.size (); --i >= 0; ) (res.get (i)).setSecondaryStructure (sstype);

}, "astex.util.Arguments,~S,astex.util.DynamicArray");
Clazz.defineMethod (c$, "processObjectCommand", 
function (sym, name, name2, v1, v2, selectedAtoms) {
this.getTexgen ().processObjectCommand (this, sym, name, name2, v1, v2, selectedAtoms);
}, "~N,~S,~S,~N,~N,astex.util.DynamicArray");
Clazz.defineMethod (c$, "processFetchCommand", 
function (urlName) {
astex.io.FILE.getFileAsString (urlName);
}, "~S");
Clazz.defineMethod (c$, "processDisplayCommand", 
function (sym, mode, isON, selectedAtoms) {
var iterator = this.getAtomIterator ();
var selectedAtomCount = selectedAtoms.size ();
switch (sym) {
case 66:
while (iterator.hasMoreElements ()) iterator.getNextAtom ().setTemporarilySelected (false);

for (var i = selectedAtomCount; --i >= 0; ) (selectedAtoms.get (i)).setTemporarilySelected (true);

iterator = this.getAtomIterator ();
while (iterator.hasMoreElements ()) {
var atom = iterator.getNextAtom ();
atom.setDisplayed (atom.isTemporarilySelected ());
}
break;
case 85:
if (mode != 0) while (iterator.hasMoreElements ()) iterator.getNextAtom ().attributes &= ~mode;

case 84:
if (mode == 0) {
System.out.println ("invalid display mode " + mode);
break;
}for (var i = selectedAtomCount; --i >= 0; ) {
var atom = selectedAtoms.get (i);
if (isON) {
atom.attributes |= mode;
} else {
atom.attributes &= ~mode;
}}
break;
case 75:
for (var m = this.getMoleculeCount (); --m >= 0; ) {
var molecule = this.getMolecule (m);
for (var b = molecule.getBondCount (); --b >= 0; ) molecule.getBond (b).setBondWidth (1);

}
for (var i = selectedAtomCount; --i >= 0; ) {
var atom = selectedAtoms.get (i);
for (var b = atom.getBondCount (); --b >= 0; ) atom.getBondI (b).setBondWidth (2);

}
break;
}
}, "~N,~N,~B,astex.util.DynamicArray");
Clazz.defineMethod (c$, "processColorCommand", 
function (sym, value, selectedAtoms) {
switch (sym) {
case 77:
for (var i = selectedAtoms.size (); --i >= 0; ) (selectedAtoms.get (i)).setColor (value);

break;
case 115:
for (var i = selectedAtoms.size (); --i >= 0; ) (selectedAtoms.get (i)).setTransparency (value);

break;
}
}, "~N,~N,astex.util.DynamicArray");
Clazz.defineMethod (c$, "processDistanceCommand", 
function (first, second, state) {
if (first != null) {
for (var i = first.size (); --i >= 0; ) {
var firstAtom = first.get (i);
for (var j = second.size (); --j >= 0; ) this.addDistanceGroups (firstAtom, second.get (j));

}
} else if (state != null) {
var mode = astex.render.MoleculeRenderer.getOnOffMode (state);
switch (mode) {
case 2:
this.setDisplayDistances (!this.getDisplayDistances ());
break;
case 0:
case 1:
this.setDisplayDistances (mode == 1);
break;
default:
System.out.println ("invalid distance state: " + state);
break;
}
} else {
this.removeAllDistances ();
}}, "astex.util.DynamicArray,astex.util.DynamicArray,~S");
Clazz.defineMethod (c$, "processCommand", 
function (sym, args, selectedAtoms) {
var cmd = this.getCommand ();
switch (sym) {
case 145:
cmd.executePDBe (this, args, selectedAtoms);
break;
case 144:
cmd.executeView (this, args);
break;
case 126:
this.viewer.handleAnimation (args);
break;
}
}, "~N,astex.util.Arguments,astex.util.DynamicArray");
Clazz.defineMethod (c$, "processRendererCommand", 
function (sym, c, d, a) {
switch (sym) {
case 87:
if (Double.isNaN (d)) this.renderer.setClip (c);
 else this.renderer.setClips (c, d);
break;
case 92:
this.renderer.setClip (this.renderer.getClip () + c);
break;
case 102:
this.renderer.rotationMatrix.setA (a);
break;
case 115:
this.renderer.setBackgroundTransparency (Clazz.doubleToInt (c));
break;
case 123:
this.renderer.setBackgroundColor (Clazz.doubleToInt (c));
break;
case 125:
this.viewer.repaint ();
break;
}
}, "~N,~N,~N,~A");
Clazz.defineMethod (c$, "processCenterCommand", 
function (sym, x, y, z, mapName, data) {
switch (sym) {
case 94:
if (data != null) {
this.setCenter (data);
break;
}if (mapName != null) {
this.centerMapByName (mapName);
break;
}if (Double.isNaN (x)) {
this.resetView ();
break;
}this.setCenter (x, y, z);
break;
case 88:
if (mapName == null) {
this.setRadius (x);
break;
}if (data != null) {
var axis = data;
this.scaleByMapRadius (mapName, x, y, axis);
break;
}this.zoomMap (mapName, x);
break;
}
}, "~N,~N,~N,~N,~S,~O");
Clazz.defineMethod (c$, "handlePrint", 
function (output) {
this.viewer.handlePrint (output);
}, "~S");
Clazz.defineStatics (c$,
"MARCH_USE_BITS", 0,
"MARCH_USE_BYTES", 1,
"MARCH_USE_FLOATS", 2,
"lastMapFileName", "",
"lastMapName", "",
"mapRadiusProperty", "map.radius",
"symmetryRadiusProperty", "symmetry.radius",
"displayRadiusProperty", "display.radius",
"contourLevelsProperty", "contour.levels",
"contourNLevelsProperty", "contour.ncontours",
"NORMAL_PICK", 1,
"DISTANCE_PICK", 2,
"ANGLE_PICK", 3,
"TORSION_PICK", 4,
"ORIGINAL_MODE", 1,
"FULLMAP_MODE", 2,
"moleculeRendererProperties", "MoleculeRenderer.properties",
"backboneCenterRange", 20.0,
"MaximumContourLevels", 1,
"crossLength", 0.6,
"boxSize", 0.05,
"defaultShortFormat", null,
"pickDistSq", 64,
"predefinedColors", null,
"ColorRampSize", 512,
"maxHue", 240.0,
"nColors", 32);
c$.colors = c$.prototype.colors =  new Array (32);
});
