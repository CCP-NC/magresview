Clazz.declarePackage ("astex");
Clazz.load (["astex.api.AstexViewerAPI"], "astex.GenericApplet", ["astex.api.Interface", "astex.io.FILE", "$.MoleculeReader", "astex.render.MoleculeRenderer", "astex.util.DynamicArray", "$.Settings", "astex.viewer.Viewer", "java.lang.Boolean", "$.StringBuffer", "java.net.URL", "java.util.Hashtable"], function () {
c$ = Clazz.decorateAsClass (function () {
this.viewer = null;
this.debug = false;
this.fullName = null;
this.htmlName = null;
this.readyCallback = null;
this.lcParams = null;
Clazz.instantialize (this, arguments);
}, astex, "GenericApplet", null, astex.api.AstexViewerAPI);
Clazz.makeConstructor (c$, 
function () {
});
Clazz.defineMethod (c$, "initialiseApplet", 
function (info) {
this.viewer.setOptions (info);
this.lcParams =  new java.util.Hashtable ();
for (var e, $e = this.lcParams.entrySet ().iterator (); $e.hasNext () && ((e = $e.next ()) || true);) this.lcParams.put (e.getKey ().toString ().toLowerCase (), e.getValue ());

this.viewer.callJsoHover = this.checkBoolean ("jso.hover", "jsohover");
this.viewer.callJsoClick = this.checkBoolean ("jso.click", "jsoclick");
this.fullName = info.get ("fullName");
this.htmlName = info.get ("name");
this.readyCallback = info.get ("appletReadyCallback");
this.viewer.setUsePopupMenu (!"false".equals (this.getParameter ("popupmenu")));
this.viewer.createMenuBar ();
this.viewer.getMoleculeRenderer ().renderer.setColor (0x00ff00);
var arraycopy = this.getParameter ("arraycopy");
if (arraycopy != null && arraycopy.equals ("true")) {
this.viewer.setArrayCopy (true);
}var moleculeNames = this.getParameterList ("molecule");
for (var i = 0; i < moleculeNames.size (); i++) {
var moleculeName = moleculeNames.get (i);
var molecule = astex.io.MoleculeReader.readFile (moleculeName);
this.viewer.addMolecule (molecule);
}
this.reportProgress ();
var mapNames = this.getParameterList ("map");
for (var i = 0; i < mapNames.size (); i++) {
var mapName = mapNames.get (i);
var map = astex.render.MoleculeRenderer.newVolumeMap ();
map.setFile (mapName);
this.viewer.addMap (map);
}
this.reportProgress ();
var centerString = this.getParameter ("center");
var moleculeRenderer = this.viewer.getMoleculeRenderer ();
if (centerString != null) {
var words = astex.io.FILE.split (centerString, null);
if (words.length == 3) {
var x = astex.io.FILE.readDouble (words[0]);
var y = astex.io.FILE.readDouble (words[1]);
var z = astex.io.FILE.readDouble (words[2]);
moleculeRenderer.setCenter (x, y, z);
} else {
var centerSelection = moleculeRenderer.getAtomsInSelection (centerString);
moleculeRenderer.setCenter (centerSelection);
}}this.reportProgress ();
var clipString = this.getParameter ("clip");
if (clipString != null) {
var clip = astex.io.FILE.readDouble (clipString);
moleculeRenderer.setClip (clip);
}this.reportProgress ();
var wideBondsString = this.getParameter ("wide");
if (wideBondsString != null) {
moleculeRenderer.resetWideBonds ();
var wideBondsSelection = moleculeRenderer.getAtomsInSelection (wideBondsString);
var atomCount = wideBondsSelection.size ();
for (var a = 0; a < atomCount; a++) {
var atom = wideBondsSelection.get (a);
var bondCount = atom.getBondCount ();
for (var b = 0; b < bondCount; b++) {
var bond = atom.getBondI (b);
bond.setWideBond (true);
}
}
}this.reportProgress ();
var bumpString = this.getParameter ("bump");
if (bumpString != null) {
moleculeRenderer.setDisplayBumps (true);
var bumpAtoms = moleculeRenderer.getAtomsInSelection (bumpString);
moleculeRenderer.generateBumps (bumpAtoms);
}this.reportProgress ();
var scriptFile = this.getParameter ("scriptFile");
if (scriptFile != null) {
this.executeFile (scriptFile);
}this.reportProgress ();
var param = this.getParameter ("keepmodel1");
if (param != null && param.equals ("true")) {
moleculeRenderer.setKeepModel1 (true);
}param = this.getParameter ("showonload");
if (param != null && param.equals ("false")) {
moleculeRenderer.setShowOnLoad (false);
}var pdbelogo = this.getParameter ("pdbelogo");
if (pdbelogo != null && pdbelogo.equals ("true")) {
moleculeRenderer.renderer.setDrawLogoPdbe (true);
}var astexlogo = this.getParameter ("astexlogo");
if (astexlogo != null && astexlogo.equals ("false")) {
moleculeRenderer.renderer.setDrawLogo (false);
}var scriptString = this.getParameter ("script");
if (scriptString != null) {
moleculeRenderer.execute (scriptString);
}this.reportProgress ();
if (this.readyCallback != null) this.doSendCallback (this.readyCallback, [this.htmlName, this.fullName, Boolean.TRUE, this], null);
}, "java.util.Map");
Clazz.defineMethod (c$, "jsalert", 
function (str) {
this.viewer.execJS ("alert ('" + str + "');");
}, "~S");
Clazz.defineMethod (c$, "execJS", 
function (str) {
this.viewer.execJS (str);
}, "~S");
Clazz.defineMethod (c$, "checkBoolean", 
function (config, param) {
var p = this.getParameter (param);
var q = this.lcParams.get (param);
return ("true".equals (p) || "true".equals (q) || p == null && q == null && astex.util.Settings.getBoolean ("config", config));
}, "~S,~S");
Clazz.defineMethod (c$, "getParameterList", 
 function (prefix) {
var parameters =  new astex.util.DynamicArray ();
var value;
if ((value = this.getParameter (prefix)) != null) parameters.add (value);
for (var i = 1; (value = this.getParameter (prefix + i)) != null; i++) parameters.add (value);

return parameters;
}, "~S");
Clazz.overrideMethod (c$, "setJSO", 
function (widgetid) {
this.viewer.widgetId = widgetid;
}, "~S");
Clazz.overrideMethod (c$, "setMovid", 
function (s) {
this.viewer.movieId = s;
}, "~S");
Clazz.overrideMethod (c$, "setMovieHostport", 
function (s) {
this.viewer.hostport = s;
}, "~S");
Clazz.overrideMethod (c$, "setMovieFrameIndex", 
function (i) {
this.viewer.moleculeRenderer.framenum = 0;
}, "~N");
Clazz.overrideMethod (c$, "hideMapContour", 
function (mapIndex, contour) {
this.viewer.moleculeRenderer.getMap (mapIndex).setContourDisplayed (contour, false);
this.viewer.moleculeRenderer.contourMap (this.viewer.moleculeRenderer.getMap (mapIndex), contour);
this.viewer.dirtyRepaint ();
}, "~N,~N");
Clazz.overrideMethod (c$, "showMapContour", 
function (mapIndex, contour) {
this.viewer.moleculeRenderer.getMap (mapIndex).setContourDisplayed (contour, true);
this.viewer.moleculeRenderer.contourMap (this.viewer.moleculeRenderer.getMap (mapIndex), contour);
this.viewer.dirtyRepaint ();
}, "~N,~N");
Clazz.overrideMethod (c$, "setMapContourColor", 
function (mapIndex, contour, color) {
this.viewer.moleculeRenderer.getMap (mapIndex).setContourColor (contour, color);
this.viewer.moleculeRenderer.contourMap (this.viewer.moleculeRenderer.getMap (mapIndex), contour);
this.viewer.dirtyRepaint ();
}, "~N,~N,~N");
Clazz.overrideMethod (c$, "setMapContourLevel", 
function (mapIndex, contour, level) {
this.viewer.moleculeRenderer.getMap (mapIndex).setContourLevel (contour, level);
this.viewer.moleculeRenderer.contourMap (this.viewer.moleculeRenderer.getMap (mapIndex), contour);
this.viewer.dirtyRepaint ();
}, "~N,~N,~N");
Clazz.overrideMethod (c$, "showContourLevelDialog", 
function () {
this.viewer.showContourLevelDialog (true);
});
Clazz.overrideMethod (c$, "setMinimumGridSpacing", 
function (s) {
(astex.api.Interface.getInterface ("astex.map.Surface")).setMinimumSpacing (s);
}, "~N");
Clazz.overrideMethod (c$, "setJSatomSelectedBehaviour", 
function (str) {
this.viewer.jsAtomSelectedBehaviour = str;
}, "~S");
Clazz.overrideMethod (c$, "numGrObs", 
function () {
var tm = this.viewer.moleculeRenderer.getGraphicalObjectI (0);
this.jsalert (tm.nt + " " + tm.np);
});
Clazz.overrideMethod (c$, "removeAllSurfaceSymops", 
function () {
this.viewer.moleculeRenderer.removeAllSurfaceSymops ();
});
Clazz.overrideMethod (c$, "addSurfaceSymop", 
function (opname, r00, r01, r02, r03, r10, r11, r12, r13, r20, r21, r22, r23, r30, r31, r32, r33) {
var op = [[r00, r01, r02, r03], [r10, r11, r12, r13], [r20, r21, r22, r23], [r30, r31, r32, r33]];
this.viewer.moleculeRenderer.addSurfaceSymop (opname, op);
}, "~S,~N,~N,~N,~N,~N,~N,~N,~N,~N,~N,~N,~N,~N,~N,~N,~N");
Clazz.overrideMethod (c$, "drawCell", 
function (dx, dy, dz, range, cellname) {
this.viewer.moleculeRenderer.addCell (cellname, range, dx, dy, dz);
}, "~N,~N,~N,~N,~S");
Clazz.overrideMethod (c$, "script", 
function (command) {
this.execute (command);
}, "~S");
Clazz.overrideMethod (c$, "execute", 
function (command) {
if (this.debug) {
System.out.println ("command: " + command);
}this.viewer.getMoleculeRenderer ().execute (command);
this.viewer.repaint ();
}, "~S");
Clazz.overrideMethod (c$, "execute_norepaint", 
function (command) {
var renderer = this.viewer.getMoleculeRenderer ();
if (this.debug) {
System.out.println ("command: " + command);
}renderer.execute (command);
}, "~S");
Clazz.overrideMethod (c$, "executeFile", 
function (scriptFile) {
this.execute (astex.io.FILE.getFileAsString (scriptFile));
this.viewer.repaint ();
}, "~S");
Clazz.overrideMethod (c$, "debugOn", 
function () {
this.debug = true;
});
Clazz.overrideMethod (c$, "debugOff", 
function () {
this.debug = false;
});
Clazz.overrideMethod (c$, "fetch", 
function (urlName) {
if (this.debug) {
System.out.println ("about to call fetch");
System.out.println ("url=" + urlName);
}return astex.io.FILE.getFileAsString (urlName);
}, "~S");
Clazz.overrideMethod (c$, "fetchSafe", 
function (urlString) {
var output = null;
if (urlString.length > 2048) {
output = this.fetchPost (urlString);
} else {
output = this.fetchNormal (urlString);
}return output;
}, "~S");
Clazz.defineMethod (c$, "fetchPost", 
 function (urlString) {
var questionPos = urlString.indexOf ('?');
var urlSection = urlString;
var parameterSection = null;
if (questionPos != -1) {
urlSection = urlString.substring (0, questionPos);
parameterSection = urlString.substring (questionPos + 1, urlString.length);
}try {
return astex.viewer.Viewer.apiPlatform.getURLContents ( new java.net.URL (Clazz.castNullAs ("java.net.URL"), urlSection, null), null, parameterSection, true);
} catch (t) {
System.out.println ("URLFetch - fetchPost(): " + "error opening url: " + urlString);
return null;
}
}, "~S");
Clazz.defineMethod (c$, "fetchNormal", 
 function (urlString) {
return astex.io.FILE.getFileAsString (urlString);
}, "~S");
Clazz.overrideMethod (c$, "isMoleculeLoaded", 
function (molname) {
return this.viewer.getMoleculeRenderer ().isMoleculeLoaded (molname);
}, "~S");
Clazz.overrideMethod (c$, "resetView", 
function () {
this.viewer.getMoleculeRenderer ().resetView ();
});
Clazz.overrideMethod (c$, "getView", 
function () {
return this.viewer.moleculeRenderer.getView ();
});
Clazz.overrideMethod (c$, "getSelection", 
function () {
var renderer = this.viewer.getMoleculeRenderer ();
var selection =  new StringBuffer ();
var molCount = renderer.getMoleculeCount ();
for (var m = 0; m < molCount; m++) {
var alreadySelected = false;
var mol = renderer.getMolecule (m);
var atomCount = mol.getAtomCount ();
for (var a = 0; a < atomCount; a++) {
var atom = mol.getAtom (a);
if (atom.isSelected ()) {
if (!alreadySelected) {
if (selection.length () > 0) {
selection.append ("|");
}selection.append (mol.getName ());
alreadySelected = true;
}selection.append ("," + atom.getId ());
}}
}
return selection.toString ();
});
Clazz.overrideMethod (c$, "getCoordinates", 
function () {
var renderer = this.viewer.getMoleculeRenderer ();
var buf =  new StringBuffer ();
var iterator = renderer.getAtomIterator ();
while (iterator.hasMoreElements ()) {
var atom = iterator.getNextAtom ();
if (atom.isSelected ()) {
if (buf.length () > 0) {
buf.append ("|");
}buf.append ("" + atom.getX ());
buf.append ("," + atom.getY ());
buf.append ("," + atom.getZ ());
}}
return buf.toString ();
});
Clazz.overrideMethod (c$, "getZoom", 
function () {
return this.viewer.getMoleculeRenderer ().renderer.getZoom ();
});
Clazz.overrideMethod (c$, "setZoom", 
function (zoom) {
this.viewer.getMoleculeRenderer ().renderer.setZoom (zoom);
this.viewer.getMoleculeRenderer ().renderer.redraw ();
}, "~N");
Clazz.overrideMethod (c$, "getSelectedAtoms", 
function () {
var mr = this.viewer.getMoleculeRenderer ();
var buf =  new StringBuffer (2048);
var iterator = mr.getAtomIterator ();
var first = true;
while (iterator.hasMoreElements ()) {
var atom = iterator.getNextAtom ();
if (atom.isSelected ()) {
if (!first) {
buf.append (",");
}var res = atom.getResidue ();
var chain = res.getParent ();
var mol = chain.getParent ();
buf.append (mol.getName ());
buf.append ("|");
buf.append (chain.getName ());
buf.append ("|");
buf.append (res.getNumber ());
buf.append ("|");
buf.append (res.getInsertionCode ());
buf.append ("|");
buf.append (res.getName ());
buf.append ("|");
buf.append (atom.getAtomSymbol ());
buf.append ("|");
buf.append (atom.getAttribute (0));
buf.append ("|");
buf.append (atom.getAttribute (1));
buf.append ("|");
buf.append (atom.getAttribute (2));
buf.append ("|");
buf.append (atom.getAttribute (3));
buf.append ("|");
buf.append (atom.getAttribute (4));
buf.append ("|");
buf.append (atom.getAtomLabel ());
first = false;
}}
return buf.toString ();
});
Clazz.overrideMethod (c$, "getColor", 
function (x, y) {
return this.viewer.getColorStr (x, y);
}, "~N,~N");
});
