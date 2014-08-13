Clazz.declarePackage ("astex.viewer");
Clazz.load (["astex.render.MoleculeRendererListener", "javajs.api.BytePoster", "$.EventManager", "$.PlatformViewer", "astex.util.Format", "java.util.Hashtable", "JU.Lst"], "astex.viewer.Viewer", ["astex.api.Interface", "astex.io.FILE", "astex.render.MoleculeRenderer", "$.Tmesh", "astex.util.DynamicArray", "java.awt.event.MouseEvent", "java.lang.RuntimeException", "java.net.URL", "javajs.awt.Dimension", "JU.PT", "$.SB"], function () {
c$ = Clazz.decorateAsClass (function () {
this.atomPickedCallback = "appletAtomClicked";
this.distancePickedCallback = "appletDistanceClicked";
this.display = null;
this.htmlName = null;
this.appletCodeBase = null;
this.appletDocumentBase = null;
this.syncId = null;
this.fullName = null;
this.appletName = null;
this.movieId = null;
this.hostport = null;
this.widgetId = null;
this.privateKey = 0;
this.mouse = null;
this.javaApplet = null;
this.astexCanvas = null;
this.jsAtomSelectedBehaviour = null;
this.moleculeRenderer = null;
this.showFrameRate = false;
this.showVersion = false;
this.moveAtomsAllowed = false;
this.excludeFromSelection = false;
this.ready = true;
this.announce = false;
this.mapState = null;
this.keyDefinitions = null;
this.animationThread = null;
this.stages = null;
this.mouseOverCommand = null;
this.mouseOverLabel = null;
this.onClickLabel = null;
this.trackedAtom = null;
this.trackedAtomLabel = null;
this.rotFormat = null;
this.repaintListeners = null;
this.viewChangeOnly = false;
this.preferredSize = null;
this.pickedAtom = null;
this.pickedDistance = null;
this.backboneLabel = "";
this.callJsoClick = false;
this.callJsoHover = false;
this.frameCount = 0;
this.mouseDraggedEvent = null;
this.mousePressedEvent = null;
this.mousePressedTime = 0;
this.dragged = false;
this.centerMoved = false;
this.popup = null;
this.allowPopup = false;
this.writeBMPHash = null;
Clazz.instantialize (this, arguments);
}, astex.viewer, "Viewer", null, [javajs.api.PlatformViewer, javajs.api.BytePoster, astex.render.MoleculeRendererListener, javajs.api.EventManager]);
Clazz.prepareFields (c$, function () {
this.privateKey = Math.random ();
this.stages =  new JU.Lst ();
this.rotFormat =  new astex.util.Format ("%.1f");
this.writeBMPHash =  new java.util.Hashtable ();
});
Clazz.defineMethod (c$, "getMovid", 
function () {
return this.movieId;
});
Clazz.defineMethod (c$, "setOptions", 
function (info) {
this.fullName = info.get ("fullName");
if (this.fullName == null) this.fullName = "";
System.out.println ("Astex applet " + this.fullName + " initializing...");
var o = info.get ("codePath");
if (o == null) o = "../java/";
this.appletCodeBase = o.toString ();
o = info.get ("documentBase");
this.appletDocumentBase = (o == null ? "" : o.toString ());
var i = this.fullName.indexOf ("__");
this.htmlName = (i < 0 ? this.fullName : this.fullName.substring (0, i));
this.appletName = JU.PT.split (this.htmlName + "_", "_")[0];
this.syncId = (i < 0 ? "" : this.fullName.substring (i + 2, this.fullName.length - 2));
this.display = info.get ("display");
{
this.display = this.display &&
document.getElementById(this.display);
}astex.viewer.Viewer.apiPlatform = astex.api.Interface.getInterface ((astex.viewer.Viewer.isJS ? "astex.awtjs2d." : "astex.awt.") + "Platform");
astex.viewer.Viewer.apiPlatform.setViewer (this, this.display);
if (astex.viewer.Viewer.$isApplet) try {
var dbase =  new java.net.URL (Clazz.castNullAs ("java.net.URL"), this.appletDocumentBase, null);
var cbase =  new java.net.URL (Clazz.castNullAs ("java.net.URL"), this.appletCodeBase, null);
System.out.println ("documentBase = " + dbase);
System.out.println ("codeBase = " + cbase);
astex.io.FILE.setDocumentBase (dbase);
astex.io.FILE.setCodeBase (cbase);
if (dbase.toString ().startsWith ("file")) {
astex.io.FILE.setTryFiles (true);
}} catch (e1) {
if (Clazz.exceptionOf (e1, java.net.MalformedURLException)) {
System.out.println ("bad URL for documentBase or codeBase");
} else {
throw e1;
}
}
if (this.display != null) this.mouse = astex.viewer.Viewer.apiPlatform.getMouseManager (this.privateKey, this.display);
System.out.println ("Viewer.display=" + this.display);
System.out.println ("Viewer.isJS=" + astex.viewer.Viewer.isJS);
System.out.println ("Viewer.isApplet=" + astex.viewer.Viewer.$isApplet);
this.moleculeRenderer =  new astex.render.MoleculeRenderer (this);
this.moleculeRenderer.renderer.setColor (0x00ff00);
}, "java.util.Map");
Clazz.defineMethod (c$, "repaint", 
function () {
if (this.astexCanvas != null) this.astexCanvas.repaint ();
});
Clazz.defineMethod (c$, "render", 
function (isTainted, width, height) {
if (isTainted) {
this.moleculeRenderer.renderer.setSize (width, height);
this.moleculeRenderer.dirty = true;
this.astexCanvas.setMemoryImageSource ();
}this.moleculeRenderer.paint ();
}, "~B,~N,~N");
Clazz.defineMethod (c$, "getActionManager", 
function () {
return this;
});
Clazz.defineMethod (c$, "getDisplay", 
function () {
return this.display;
});
Clazz.defineMethod (c$, "isApplet", 
function () {
return astex.viewer.Viewer.$isApplet;
});
Clazz.defineMethod (c$, "setMouse", 
function (s, o) {
if ("-mouseover".equals (s)) {
this.mouseOverLabel = o;
} else if ("-onclick".equals (s)) {
this.onClickLabel = o;
} else if ("-mouseovercommand".equals (s)) {
this.mouseOverCommand = o;
}}, "~S,~O");
Clazz.defineMethod (c$, "handleMouseOver", 
function (x, y) {
var nearestAtom = this.moleculeRenderer.getNearestAtom (x, y);
if (nearestAtom === this.trackedAtom) {
return;
}if (this.trackedAtom != null) {
this.trackedAtom.setCustomLabel (this.trackedAtomLabel);
this.trackedAtom = null;
}if (nearestAtom != null) {
this.trackedAtom = nearestAtom;
this.trackedAtomLabel = nearestAtom.getCustomLabel ();
this.trackedAtom.setCustomLabel (this.mouseOverLabel);
}this.dirtyRepaint ();
}, "~N,~N");
Clazz.defineMethod (c$, "handleMouseOverCommand", 
function (x, y) {
var nearestAtom = this.moleculeRenderer.getNearestAtom (x, y);
if (nearestAtom === this.trackedAtom) {
return;
}if (nearestAtom != null) {
this.trackedAtom = nearestAtom;
var command = nearestAtom.generateLabel (this.mouseOverCommand);
this.execute (command);
}this.dirtyRepaint ();
}, "~N,~N");
Clazz.defineMethod (c$, "execute", 
function (s) {
this.moleculeRenderer.execute (s);
}, "~S");
Clazz.defineMethod (c$, "applyMapState", 
function () {
if (this.mapState != null) {
this.mapState.map.applyMapState (this.moleculeRenderer, this.mapState);
this.dirtyRepaint ();
}});
Clazz.defineMethod (c$, "animating", 
function () {
return (this.animationThread != null && this.animationThread.isAlive () && !this.animationThread.getInteractive ());
});
Clazz.defineMethod (c$, "interactiveAnimation", 
function () {
return (this.animationThread != null && this.animationThread.isAlive () ? this.animationThread.getInteractive () : true);
});
Clazz.defineMethod (c$, "handlePrint", 
function (output) {
var sb =  new JU.SB ();
var len = output.length;
for (var i = 0; i < len; i++) {
var c = output.charAt (i);
if (c == '\\') {
if (i < len - 1) {
i++;
c = output.charAt (i);
if (c == 'n') {
sb.appendC ('\n');
} else if (c == 'r') {
sb.appendC ('\r');
} else if (c == '\\') {
sb.appendC ('\\');
} else {
sb.appendC (c);
}} else {
sb.appendC ('\\');
}} else {
sb.appendC (c);
}}
System.out.println (sb.toString ());
}, "~S");
Clazz.defineMethod (c$, "addRepaintListener", 
function (c) {
if (this.repaintListeners == null) {
this.repaintListeners =  new astex.util.DynamicArray ();
}this.repaintListeners.add (c);
}, "~O");
Clazz.defineMethod (c$, "removeRepaintListener", 
function (c) {
if (this.repaintListeners != null) {
this.repaintListeners.remove (c);
} else {
throw  new RuntimeException ("no such repaintListener " + c);
}}, "~O");
Clazz.defineMethod (c$, "dirtyRepaint", 
function () {
this.moleculeRenderer.dirty = true;
this.repaint ();
if (this.viewChangeOnly == false && this.repaintListeners != null) {
this.notifyRepaintListeners ();
}this.viewChangeOnly = false;
});
Clazz.defineMethod (c$, "notifyRepaintListeners", 
 function () {
if (this.repaintListeners != null) {
var repaintListenerCount = this.repaintListeners.size ();
for (var r = 0; r < repaintListenerCount; r++) (this.repaintListeners.get (r)).repaint ();

}});
Clazz.overrideMethod (c$, "genericAdded", 
function (renderer, generic) {
}, "astex.render.MoleculeRenderer,astex.generic.Generic");
Clazz.overrideMethod (c$, "genericRemoved", 
function (renderer, generic) {
}, "astex.render.MoleculeRenderer,astex.generic.Generic");
Clazz.defineMethod (c$, "getMoleculeRenderer", 
function () {
return this.moleculeRenderer;
});
Clazz.defineMethod (c$, "setArrayCopy", 
function (arraycopy) {
}, "~B");
Clazz.defineMethod (c$, "loadMolecule", 
function (filename) {
filename = astex.io.FILE.getRelativePath (filename);
var command = "molecule load '" + filename + "' '" + filename + "';";
if (filename.toLowerCase ().indexOf (".sdf") != -1 || filename.toLowerCase ().indexOf (".mol") != -1) {
command += "cylinder_radius 0.09 molexact '" + filename + "';";
command += "display cylinders on molexact '" + filename + "';";
}this.moleculeRenderer.execute (command);
}, "~S");
Clazz.defineMethod (c$, "executeScript", 
function (filename) {
if (filename.endsWith (";")) {
this.moleculeRenderer.execute (filename.substring (1));
return;
}filename = astex.io.FILE.getRelativePath (filename);
System.out.println ("about to execute script " + filename);
this.moleculeRenderer.executeScript (filename);
}, "~S");
Clazz.defineMethod (c$, "loadMap", 
function (filename) {
filename = astex.io.FILE.getRelativePath (filename);
var command = "map load '" + filename + "' '" + filename + "';";
this.moleculeRenderer.execute (command);
}, "~S");
Clazz.defineMethod (c$, "setCenter", 
function (center) {
this.moleculeRenderer.setCenter (center);
}, "astex.util.Point3d");
Clazz.defineMethod (c$, "setRadius", 
function (radius) {
this.moleculeRenderer.setRadius (radius);
}, "~N");
Clazz.defineMethod (c$, "setSymmetry", 
function (symmetry) {
}, "~B");
Clazz.defineMethod (c$, "addMap", 
function (map) {
this.moleculeRenderer.addMap (map);
}, "astex.map.VolumeMap");
Clazz.defineMethod (c$, "removeMap", 
function (map) {
this.moleculeRenderer.removeMap (map);
}, "astex.map.VolumeMap");
Clazz.defineMethod (c$, "setPreferredSize", 
function (w, h) {
this.preferredSize =  new javajs.awt.Dimension (w, h);
}, "~N,~N");
Clazz.defineMethod (c$, "taint", 
function () {
this.astexCanvas.taint ();
this.moleculeRenderer.dirty = true;
});
Clazz.defineMethod (c$, "checkHover", 
function (x, y) {
if (this.callJsoHover) {
var nearestAtom = this.moleculeRenderer.getNearestAtom (x, y);
if (nearestAtom != null) {
this.callJsoAtomPicked (nearestAtom);
}}}, "~N,~N");
Clazz.defineMethod (c$, "checkPick", 
function (x, y, isAlt) {
this.pickedAtom = this.moleculeRenderer.getNearestAtom (x, y);
if (this.pickedAtom == null) {
this.pickedDistance = this.moleculeRenderer.getNearestDistance (x, y);
if (this.pickedDistance != null && this.callJsoClick) {
this.callJsoDistancePicked ();
}this.backboneLabel = this.moleculeRenderer.getNearestBackbonePoint (x, y);
}if (isAlt) return false;
if (this.pickedAtom != null && this.callJsoClick) this.callJsoAtomPicked (this.pickedAtom);
return true;
}, "~N,~N,~B");
Clazz.defineMethod (c$, "callJsoAtomPicked", 
 function (atom) {
if (atom != null) {
var r = atom.getResidue ();
var c = r.getParent ();
var m1 = c.getParent ();
try {
var jsPar1 = m1.getName () + ":" + c.getName () + ":" + r.getNumber () + r.getName () + ":" + atom.getAtomLabel ();
var jsPars = [jsPar1.toUpperCase ()];
this.callJSO (this.atomPickedCallback, jsPars);
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
System.err.println ("Error calling JavaScript -> appletAtomClicked");
} else {
throw e;
}
}
}return;
}, "astex.model.Atom");
Clazz.defineMethod (c$, "callJsoDistancePicked", 
function () {
if (this.pickedDistance != null) {
var a1 = this.pickedDistance.group0.get (0);
var a2 = this.pickedDistance.group1.get (0);
var r1 = a1.getResidue ();
var r2 = a2.getResidue ();
var c1 = r1.getParent ();
var c2 = r2.getParent ();
var satom1 = c1.getName () + ":" + r1.getNumber () + r1.getName () + ":" + a1.getAtomLabel ();
var satom2 = c2.getName () + ":" + r2.getNumber () + r2.getName () + ":" + a2.getAtomLabel ();
var rS = satom1 + ":" + satom2;
try {
var jsPars = [rS];
this.callJSO (this.distancePickedCallback, jsPars);
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
System.err.println ("Error calling JavaScript -> appletDistanceClicked");
} else {
throw e;
}
}
}return;
});
Clazz.defineMethod (c$, "checkMouseRelease", 
 function (isPopup, isShift, x, y) {
if (isPopup) {
this.showPopupMenu (x, y);
} else {
if (this.pickedAtom != null) {
if (this.dragged == false) {
if (isShift) {
this.moleculeRenderer.setCenter (this.pickedAtom);
} else {
this.moleculeRenderer.addSelectedAtom (this.pickedAtom);
this.moleculeRenderer.handlePick (this.pickedAtom);
if (this.onClickLabel != null) {
if (this.pickedAtom.getCustomLabel () == null) {
var label = this.pickedAtom.generateLabel (this.onClickLabel);
this.pickedAtom.setCustomLabel (label);
} else {
this.pickedAtom.setCustomLabel (null);
}} else {
if (this.pickedAtom.isLabelled ()) {
this.pickedAtom.setLabelled (false);
this.moleculeRenderer.setStatusAtom (null);
} else {
this.moleculeRenderer.removeAllLabelledAtoms ();
this.pickedAtom.setLabelled (true);
this.moleculeRenderer.setStatusAtom (this.pickedAtom);
}}this.moleculeRenderer.generateBumps (this.pickedAtom);
}}} else {
if (this.dragged == false) {
this.moleculeRenderer.removeAllSelectedAtoms ();
this.moleculeRenderer.setStatusAtom (null);
}}if (!this.backboneLabel.equals ("")) {
var bLabel = astex.render.Tmesh.genBackboneLabel (this.backboneLabel);
this.moleculeRenderer.renderer.setStatusString (bLabel);
} else if (this.pickedAtom != null) {
this.moleculeRenderer.renderer.setStatusString ("");
}if (this.centerMoved) {
this.dirtyRepaint ();
var center = this.moleculeRenderer.renderer.getCenter ();
this.moleculeRenderer.setCenter (center, false);
this.centerMoved = false;
}}this.pickedAtom = null;
this.backboneLabel = "";
this.mouseDraggedEvent = null;
this.mousePressedEvent = null;
this.dirtyRepaint ();
this.suspendAnimationThread (true);
}, "~B,~B,~N,~N");
Clazz.defineMethod (c$, "checkMouseDragged", 
 function (isControl, isShift, x, y) {
if (this.mousePressedEvent == null) {
this.dragged = false;
return;
}var dx = x - this.mousePressedEvent.getX ();
var dy = y - this.mousePressedEvent.getY ();
if (Math.abs (dx) > 2 || Math.abs (dy) > 2) {
this.dragged = true;
}if (this.dragged) {
dx = x - this.mouseDraggedEvent.getX ();
dy = y - this.mouseDraggedEvent.getY ();
if (this.pickedAtom != null && this.moveAtomsAllowed) {
} else if (isControl) {
this.moleculeRenderer.translateCenter (dx, dy);
this.centerMoved = true;
} else if (isShift) {
this.moleculeRenderer.renderer.applyZoom (dy * 0.005);
} else {
if (this.mousePressedEvent.getY () < this.getHeight () * 0.05) {
this.moleculeRenderer.renderer.rotateZ (dx * 0.5);
} else {
this.moleculeRenderer.renderer.rotateY (dx * 0.5);
this.moleculeRenderer.renderer.rotateX (dy * 0.5);
}}}this.viewChangeOnly = true;
this.dirtyRepaint ();
}, "~B,~B,~N,~N");
Clazz.defineMethod (c$, "setMapStateFromMap", 
function (map) {
if (this.mapState != null && map != null) {
map.setStateOf (this.mapState);
this.mapState.transparency = this.moleculeRenderer.getMapContourTransparency (map, 0);
}}, "astex.map.VolumeMap");
Clazz.defineMethod (c$, "setUsePopupMenu", 
function (state) {
this.allowPopup = state;
if (!this.allowPopup) this.popup = null;
}, "~B");
Clazz.defineMethod (c$, "handleAnimation", 
function (args) {
(astex.api.Interface.getInterface ("astex.awt.Animate")).handleAnimation (this, args);
}, "astex.util.Arguments");
Clazz.defineMethod (c$, "removeAnimationThread", 
function (t) {
if (this.animationThread != null) {
this.animationThread = null;
}this.dirtyRepaint ();
}, "astex.api.AstexThread");
Clazz.defineMethod (c$, "suspendAnimationThread", 
function (run) {
if (this.animationThread != null) {
if (run) {
this.animationThread.resume ();
this.animationThread.run ();
} else {
this.animationThread.suspend ();
}}}, "~B");
Clazz.defineMethod (c$, "saveAndExit", 
function () {
{
System.exit (0);
}});
Clazz.defineMethod (c$, "saveMolecules", 
function () {
var moleculeCount = this.moleculeRenderer.getMoleculeCount ();
for (var m = 0; m < moleculeCount; m++) {
var molecule = this.moleculeRenderer.getMolecule (m);
this.saveMolecule (molecule);
}
});
Clazz.defineMethod (c$, "getView", 
function () {
return this.moleculeRenderer.getView ();
});
Clazz.defineMethod (c$, "saveMolecule", 
function (molecule) {
var name = molecule.getFilename ();
if (name != null) astex.io.FILE.writeMol (molecule, name, null, null);
}, "astex.model.Molecule");
Clazz.defineMethod (c$, "saveScript", 
function (scriptFile) {
this.moleculeRenderer.writeScript (scriptFile);
}, "~S");
Clazz.overrideMethod (c$, "postByteArray", 
function (fileName, bytes) {
try {
return astex.viewer.Viewer.apiPlatform.getURLContents ( new java.net.URL (Clazz.castNullAs ("java.net.URL"), fileName, null), bytes, null, true);
} catch (e) {
if (Clazz.exceptionOf (e, java.net.MalformedURLException)) {
return e.toString ();
} else {
throw e;
}
}
}, "~S,~A");
Clazz.overrideMethod (c$, "moleculeAdded", 
function (renderer, molecule) {
this.updateMenus ();
}, "astex.render.MoleculeRenderer,astex.model.Molecule");
Clazz.overrideMethod (c$, "moleculeRemoved", 
function (renderer, molecule) {
this.updateMenus ();
}, "astex.render.MoleculeRenderer,astex.model.Molecule");
Clazz.overrideMethod (c$, "maskAdded", 
function (renderer, mask) {
this.updateMenus ();
}, "astex.render.MoleculeRenderer,astex.api.AstexMask");
Clazz.overrideMethod (c$, "maskEdited", 
function (renderer, mapName, mask) {
this.updateMenus ();
this.updateMaskEditDialog (mapName, mask.getLabel ());
}, "astex.render.MoleculeRenderer,~S,astex.api.AstexMask");
Clazz.overrideMethod (c$, "maskRemoved", 
function (renderer, map, mask) {
this.updateMenus ();
this.updateMaskCount (map, map.getName ());
}, "astex.render.MoleculeRenderer,astex.map.VolumeMap,astex.api.AstexMask");
Clazz.defineMethod (c$, "advancedMapSettingsDialog", 
function (advanced) {
}, "~B");
Clazz.defineMethod (c$, "processCommand", 
function (command) {
var redraw = true;
if (command.equals ("Exit")) {
this.saveAndExit ();
} else if (command.equals ("Run Script...")) {
var scriptFile = this.loadFileFromDialog ("Run script");
if (scriptFile != null) {
this.executeScript (scriptFile);
}} else if (command.equals ("Open Structure...")) {
var pdbFile = this.loadFileFromDialog ("Load structure");
if (pdbFile != null) {
this.loadMolecule (pdbFile);
}} else if (command.equals ("Open Map...")) {
var mapFile = this.loadFileFromDialog ("Load map");
if (mapFile != null) {
this.loadMap (mapFile);
}} else if (command.equals ("Open Object...")) {
var tmeshFile = this.loadFileFromDialog ("Load object (.tmesh)");
if (tmeshFile != null) {
var tm = astex.render.Tmesh.read (tmeshFile);
this.moleculeRenderer.addGraphicalObject (tm);
}} else if (command.equals ("By Chain")) {
this.moleculeRenderer.colorByChain ();
} else if (command.equals ("By Atom")) {
this.moleculeRenderer.colorByAtom ();
} else if (command.equals ("By B-factor")) {
this.moleculeRenderer.colorByBFactor ();
} else if (command.equals ("By B-factor Range")) {
this.moleculeRenderer.colorByPropertyRange (3);
} else if (command.equals ("By Rainbow")) {
this.moleculeRenderer.execute ("color_by_rainbow default;");
} else if (command.equals ("Clear")) {
this.moleculeRenderer.removeAllSelectedAtoms ();
} else if (command.equals ("Popup...")) {
this.setUI ();
} else if (command.equals ("Center On Selection")) {
var selectedAtoms = this.moleculeRenderer.getSelectedOrLabelledAtoms ();
this.moleculeRenderer.setCenter (selectedAtoms);
} else if (command.equals ("Clip Maps To Selection")) {
var selectedAtoms = this.moleculeRenderer.getSelectedAtoms ();
this.moleculeRenderer.clipMaps (null, selectedAtoms, true);
} else if (command.equals ("Wide Bonds For Selection")) {
var selectedAtoms = this.moleculeRenderer.getSelectedAtoms ();
this.moleculeRenderer.setWideBondsA (selectedAtoms);
} else if (command.equals ("Reset")) {
this.moleculeRenderer.resetView ();
} else if (command.equals ("Contour Levels...")) {
this.showContourLevelDialog (true);
} else if (command.equals (astex.viewer.Viewer.HideContourDialogString)) {
this.showContourLevelDialog (false);
} else if (command.equals ("Map Settings...")) {
this.showMapSettingsDialog (true);
} else if (command.equals ("Hide map settings dialog")) {
this.showMapSettingsDialog (false);
} else if (command.equals ("Apply map settings dialog")) {
this.setMapStateFromDialog ();
this.applyMapState ();
} else if (command.equals ("Advanced map settings dialog")) {
this.advancedMapSettingsDialog (true);
} else if (command.equals ("Hide Advanced map settings dialog")) {
this.advancedMapSettingsDialog (false);
} else if (command.equals ("Add mask...")) {
this.showMaskAddingDialog (true);
} else if (command.equals ("Apply add mask")) {
this.createMask ();
this.showMaskAddingDialog (false);
} else if (command.equals ("Hide mask dialog")) {
this.showMaskAddingDialog (false);
} else if (command.equals ("Hide Mask Edit Dialog")) {
this.showMaskEditingDialog (null, null);
} else if (this.writeBMPHash.containsKey (command)) {
var bitmapFileName = this.saveFileFromDialog ("Choose a BMP file...", null);
if (bitmapFileName != null) {
System.out.println ("starting offscreen render");
var s = this.writeBMPHash.get (command);
s += " -writeimage '" + bitmapFileName + "';";
this.moleculeRenderer.execute (s);
System.out.println ("finished writing image");
}} else if (command.equals ("Clear distances")) {
this.moleculeRenderer.removeAllDistances ();
} else if (command.equals ("Clear angles")) {
this.moleculeRenderer.removeAllAngles ();
} else if (command.equals ("Clear torsions")) {
this.moleculeRenderer.removeAllTorsions ();
} else {
redraw = this.processCommands2 (command);
return false;
}if (redraw) this.dirtyRepaint ();
return true;
}, "~S");
Clazz.defineMethod (c$, "processCommands2", 
 function (commandString) {
var words = commandString.$plit ("\\s", 3);
var command = words[0];
var redraw = true;
if (command.equals ("CloseMolecule")) {
this.moleculeRenderer.removeMoleculeByName (words[1]);
} else if (command.equals ("CloseMap")) {
this.moleculeRenderer.removeMapByName (words[1]);
} else if (command.equals ("CloseMask")) {
this.moleculeRenderer.removeMaskByName (words[1], words[2]);
} else if (command.equals ("CloseAllMasks")) {
this.moleculeRenderer.removeAllMasks (words[1]);
} else if (command.equals ("EditMask")) {
this.showMaskEditingDialog (words[1], words[2]);
} else if (command.equals ("SaveMolecule")) {
this.saveMoleculeByName (words[1]);
} else if (command.equals ("SaveMap")) {
this.saveMapByName (words[1]);
} else if (command.equals ("OpenMask")) {
this.readMaskForMapFromDialog (words[1]);
} else if (command.equals ("SaveMask")) {
this.saveMask (words[1], words[2]);
} else if (command.equals ("SaveAllMasks")) {
this.saveMask (words[1], null);
} else if (command.equals ("MaskContract")) {
this.moleculeRenderer.contractMask (words[1], words[2]);
this.updateMaskEdit (words[1], words[2]);
} else if (command.equals ("MaskExpand")) {
this.moleculeRenderer.expandMask (words[1], words[2]);
this.updateMaskEdit (words[1], words[2]);
} else if (command.equals ("SetColor")) {
this.moleculeRenderer.execute ("color " + words[1] + " default;");
} else if (command.equals ("SetBackgroundColor")) {
this.moleculeRenderer.execute ("background " + words[1] + ";");
} else if (command.equals ("Select")) {
var selection = this.moleculeRenderer.getAtomsInSelection (words[1]);
this.moleculeRenderer.setSelected (selection, this.excludeFromSelection ? 0 : 1);
} else if (command.equals ("SelectLigand")) {
var selection = this.moleculeRenderer.getAtomsInLigands ();
this.moleculeRenderer.setSelected (selection, this.excludeFromSelection ? 0 : 1);
} else if (commandString.equals ("Save View...")) {
var viewFile = this.saveFileFromDialog ("Save view", null);
if (viewFile != null) {
this.saveScript (viewFile);
}} else if (commandString.equals ("Save All")) {
this.saveMolecules ();
} else {
System.out.println ("unhandled command <" + commandString + ">");
redraw = false;
}return redraw;
}, "~S");
Clazz.defineMethod (c$, "saveMask", 
 function (mapName, maskName) {
if (maskName == null) {
this.moleculeRenderer.writeAllMasks (mapName, null);
return;
}var map = this.moleculeRenderer.findMap (mapName);
if (map == null) {
System.out.println ("no such map <" + mapName + ">");
return;
}var mask = map.getMaskByName (maskName, true);
if (mask == null) {
System.out.println ("no such mask <" + maskName + ">");
return;
}var newFileName = this.saveFileFromDialog ("Choose Filename for Mask...", null);
if (newFileName == null) return;
newFileName = astex.io.FILE.checkMaskExtension (mask, newFileName);
try {
mask.write (newFileName);
} catch (e$$) {
if (Clazz.exceptionOf (e$$, java.io.FileNotFoundException)) {
var e = e$$;
{
System.out.println ("Failed to open file: " + newFileName);
System.out.println ("Error message: " + e.getMessage ());
}
} else if (Clazz.exceptionOf (e$$, java.io.IOException)) {
var e = e$$;
{
System.out.println ("An IO Exception happened while writing to file: " + newFileName);
System.out.println ("Error message: " + e.getMessage ());
}
} else {
throw e$$;
}
}
this.updateMenus ();
}, "~S,~S");
Clazz.defineMethod (c$, "saveMoleculeByName", 
function (name) {
var mol = this.moleculeRenderer.findMolecule (name);
if (mol == null) {
System.out.println ("no such molecule <" + name + ">");
return;
}var newFileName = this.saveFileFromDialog ("Choose Filename...", null);
if (newFileName == null) {
return;
}newFileName = astex.io.FILE.checkExtension (mol, newFileName);
System.out.println ("new file name <" + newFileName + ">");
var result = astex.io.FILE.writeMol (mol, newFileName, null, null);
if (!result.startsWith ("OK")) {
System.out.println ("saveMolecule: couldn't open " + newFileName + " : " + result);
return;
}mol.setName (newFileName);
mol.setFilename (newFileName);
this.moleculeRenderer.fireMoleculeRemovedEvent (mol);
this.moleculeRenderer.fireMoleculeAddedEvent (mol);
this.updateMenus ();
}, "~S");
Clazz.defineMethod (c$, "saveMapByName", 
function (name) {
var map = this.moleculeRenderer.findMap (name);
if (map == null) {
System.out.println ("no such map <" + name + ">");
return;
}var mapType = map.getMapType ();
if (mapType != 1 && mapType != 5 && mapType != 6) {
System.out.println ("Can only export CCP4 and Brix maps");
return;
}var newFileName = this.saveFileFromDialog ("Choose Filename...", null);
if (newFileName == null) return;
newFileName = astex.io.FILE.checkMapExtension (map, newFileName);
System.out.println ("new file name <" + newFileName + ">");
this.moleculeRenderer.writeMap (name, newFileName);
this.updateMenus ();
}, "~S");
Clazz.defineMethod (c$, "updateMaskEdit", 
 function (mapName, maskName) {
var map = this.moleculeRenderer.findMap (mapName);
var mask = map.getMaskByName (maskName, true);
if (mask != null) this.populateMaskEditingDialog (mask);
}, "~S,~S");
Clazz.overrideMethod (c$, "keyPressed", 
function (keyCode, modifiers) {
return false;
}, "~N,~N");
Clazz.overrideMethod (c$, "keyTyped", 
function (keyChar, modifiers) {
return false;
}, "~N,~N");
Clazz.overrideMethod (c$, "keyReleased", 
function (keyCode) {
}, "~N");
Clazz.overrideMethod (c$, "mouseAction", 
function (mode, time, x, y, count, buttonMods) {
var btn = buttonMods & 28;
var c = this.display;
switch (btn) {
case 0:
break;
case 4:
btn = 3;
break;
case 8:
btn = 2;
break;
case 16:
btn = 1;
break;
default:
btn = 0;
break;
}
switch (mode) {
case 0:
this.mouseMoved ( new java.awt.event.MouseEvent (c, 503, time, buttonMods, x, y, x, y, count, false, btn));
break;
case 4:
btn = Math.max (1, btn);
count = Math.max (1, count);
var isPopup = (buttonMods == 4 && count == 1);
this.mousePressed ( new java.awt.event.MouseEvent (c, 501, time, buttonMods, x, y, x, y, count, isPopup, btn));
break;
case 1:
btn = Math.max (1, btn);
count = Math.max (1, count);
this.mouseDragged ( new java.awt.event.MouseEvent (c, 506, time, buttonMods, x, y, x, y, count, false, btn));
break;
case 5:
btn = Math.max (1, btn);
count = Math.max (1, count);
this.mouseReleased ( new java.awt.event.MouseEvent (c, 502, time, buttonMods, x, y, x, y, count, false, btn));
break;
case 2:
btn = Math.max (1, btn);
count = Math.max (1, count);
break;
case 3:
break;
}
}, "~N,~N,~N,~N,~N,~N");
Clazz.overrideMethod (c$, "mouseEnterExit", 
function (time, x, y, isExit) {
}, "~N,~N,~N,~B");
Clazz.defineMethod (c$, "mouseMoved", 
function (e) {
if (this.mouseOverLabel != null) {
this.handleMouseOver (e.getX (), e.getY ());
}if (this.mouseOverCommand != null) {
this.handleMouseOverCommand (e.getX (), e.getY ());
}this.checkHover (e.getX (), e.getY ());
}, "java.awt.event.MouseEvent");
Clazz.defineMethod (c$, "mousePressed", 
function (e) {
this.astexCanvas.requestFocus ();
this.mouseDraggedEvent = this.mousePressedEvent = e;
this.dragged = false;
this.suspendAnimationThread (false);
if (e.isPopupTrigger ()) {
this.showPopupMenu (e.getX (), e.getY ());
} else if (!e.isControlDown ()) {
if (this.showFrameRate) {
this.frameCount = 0;
this.mousePressedTime = System.currentTimeMillis ();
}this.checkPick (e.getX (), e.getY (), e.isAltDown ());
}this.dirtyRepaint ();
}, "java.awt.event.MouseEvent");
Clazz.defineMethod (c$, "mouseDragged", 
function (e) {
if (!e.isAltDown ()) {
this.checkMouseDragged (e.isControlDown (), e.isShiftDown (), e.getX (), e.getY ());
if (this.dragged) this.mouseDraggedEvent = e;
}}, "java.awt.event.MouseEvent");
Clazz.defineMethod (c$, "mouseReleased", 
function (e) {
if (e.isAltDown ()) {
return;
}this.checkMouseRelease (e.isPopupTrigger (), e.isShiftDown (), e.getX (), e.getY ());
}, "java.awt.event.MouseEvent");
Clazz.overrideMethod (c$, "atomSelected", 
function (renderer, atom) {
if (this.jsAtomSelectedBehaviour == null) return;
if (this.jsAtomSelectedBehaviour.equals ("centralDoVisAnnot")) {
this.execJS ("centralDoVisAnnot('" + atom.generateLabel ("%r %c") + "');");
}if (this.jsAtomSelectedBehaviour.equals ("crystviewMonomerClicked")) {
this.execJS ("crystviewMonomerClicked('" + atom.getMolecule ().getName () + "');");
}if (atom == null) return;
var atm = "'" + atom.toTupleString () + "'";
this.execwidget ("appletAtomSelected(" + atm + ")");
}, "astex.render.MoleculeRenderer,astex.model.Atom");
Clazz.defineMethod (c$, "jsalert", 
function (str) {
this.execJS ("alert('" + str + "');");
}, "~S");
Clazz.defineMethod (c$, "execwidget", 
function (str) {
if (this.widgetId == null) return;
this.execJS ("YAHOO.PDBe.OAVwidgetRegistry[" + this.widgetId + "]." + str + ";");
}, "~S");
Clazz.defineMethod (c$, "notifyStatusReady", 
function (b) {
}, "~B");
Clazz.defineStatics (c$,
"$isApplet", false,
"bytePoster", null,
"isJS", false,
"jsDocumentBase", null,
"apiPlatform", null);
{
{
self.Jmol && Jmol.extend && Jmol.extend("astexVwr",
astex.viewer.Viewer.prototype);
}}Clazz.defineStatics (c$,
"Copyright", "Copyright (C) 1999-2007 Astex Therapeutics Ltd.",
"SymmetryString", "Symmetry",
"BumpsString", "Bumps",
"MapsString", "Maps",
"SolventString", "Solvent",
"AxesString", "Axes",
"CloseMoleculeCommand", "CloseMolecule",
"CloseMapCommand", "CloseMap",
"CloseMaskCommand", "CloseMask",
"CloseAllMasksCommand", "CloseAllMasks",
"SaveMoleculeCommand", "SaveMolecule",
"SaveMapCommand", "SaveMap",
"SaveMaskCommand", "SaveMask",
"SaveAllMaskCommand", "SaveAllMasks",
"OpenMaskCommand", "OpenMask",
"EditMaskCommand", "EditMask",
"SelectCommand", "Select",
"SelectLigandCommand", "SelectLigand",
"SetColorCommand", "SetColor",
"SetBackgroundColorCommand", "SetBackgroundColor",
"FileString", "File",
"OpenStructureString", "Open Structure...",
"OpenMapString", "Open Map...",
"OpenMaskString", "Open Mask",
"OpenObjectString", "Open Object...",
"RunScriptString", "Run Script...",
"SaveViewString", "Save View...",
"SaveString", "Save All",
"SaveMoleculeString", "Save Molecule",
"SaveMapString", "Save Map",
"SaveMaskString", "Save Mask",
"WriteBMPString", "Write BMP...",
"ExitString", "Exit",
"DisplayString", "Display",
"OptionsString", "Options",
"MoveAtomsString", "Move Atoms",
"ColorString", "Colour",
"ColorByChainString", "By Chain",
"ColorByAtomString", "By Atom",
"ColorByBFactorString", "By B-factor",
"ColorByBFactorRangeString", "By B-factor Range",
"ColorByRainbowString", "By Rainbow",
"ColorChoiceString", "Change To",
"ColorBackgroundString", "Background",
"CloseString", "Close",
"CloseMapString", "Close Map",
"CloseMaskString", "Close Mask",
"EditMaskString", "Edit Mask",
"SelectString", "Select",
"SelectionPopupString", "Popup...",
"SelectLigandString", "Ligands",
"LigandString", "Ligand",
"ClearSelectionString", "Clear",
"ExcludeString", "Exclude",
"ViewString", "View",
"ResetViewString", "Reset",
"CenterViewString", "Center On Selection",
"ClipMapsToSelectionString", "Clip Maps To Selection",
"WideBondsForSelectionString", "Wide Bonds For Selection",
"ContourLevelsString", "Contour Levels...",
"MapSettingsString", "Map Settings...",
"MEDtolerance", "MaskEditTolerance",
"MEDmaskLabel", "MaskEditLabel",
"MEDcolor", "MaskEditColor",
"MEDmaskSize", "MaskSize",
"MEDpanel", "MaskEditPanel",
"MaskExpandString", "MaskExpand",
"MaskContractString", "MaskContract",
"HideMaskEditDialogString", "Hide Mask Edit Dialog",
"EditMaskDialogString", "Edit Mask",
"Aring", "\u00c5",
"MaskTolerance", "5.0",
"MaskSizeString", "Points in mask",
"HideMapSettingsDialogString", "Hide map settings dialog",
"ApplyMapSettingsDialogString", "Apply map settings dialog",
"AdvancedMapSettingsDialogString", "Advanced map settings dialog",
"HideAdvancedMapSettingsDialogString", "Hide Advanced map settings dialog",
"AddMaskDialogString", "Add Mask to Map",
"AddMaskString", "Add mask...",
"HideMaskDialogString", "Hide mask dialog",
"ApplyAddMaskString", "Apply add mask",
"MSDalphaValue", "Rotate alpha",
"MSDalphaSlider", "Alpha Slider",
"MSDbetaValue", "Rotate beta",
"MSDbetaSlider", "Beta Slider",
"MSDgammaValue", "Rotate gamma",
"MSDgammaSlider", "Gamma Slider",
"MSDscaleValue", "Scale Value",
"MSDscaleSlider", "Scale Slider",
"MSDsizeValue", "Size Value",
"MSDsizeSlider", "Size Slider",
"MSDlevelValue", "Raw Contour Level",
"MSDlevelSlider", "Contour Level Slider",
"MSDtransparencyValue", "Transparency Value",
"MSDtransparencySlider", "Transparency Slider",
"MSDmapChoice", "Map Choice",
"MSDxBox", "X Box",
"MSDyBox", "Y Box",
"MSDzBox", "Z Box",
"MSDgridXValue", "Grid X Value",
"MSDgridXSlider", "Grid X Slider",
"MSDgridYValue", "Grid Y Value",
"MSDgridYSlider", "Grid Y Slider",
"MSDgridZValue", "Grid Z Value",
"MSDgridZSlider", "Grid Z Slider",
"MSDshowGrid", "Show Grid Box",
"MSDinvert", "Invert Image",
"MSDstyle", "Solid",
"MSDshowMap", "Show Map",
"MSDcolor", "Map Color",
"MSDcutSelection", "Cut map based on selection",
"MSDcutDistance", "Cut distance (A)",
"MSDmaskValue", "Mask Value",
"MSDmaskShowLabel", "Show mask label",
"MSDcenter", "Center",
"HideContourDialogString", "Hide contour dialog",
"SpaceSplit", "\\s");
});
