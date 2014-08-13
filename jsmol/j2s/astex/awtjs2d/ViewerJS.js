Clazz.declarePackage ("astex.awtjs2d");
Clazz.load (["astex.viewer.Viewer", "javajs.awt.Dimension"], "astex.awtjs2d.ViewerJS", ["astex.awtjs2d.JSCanvas", "astex.io.FILE"], function () {
c$ = Clazz.decorateAsClass (function () {
this.dimScreen = null;
Clazz.instantialize (this, arguments);
}, astex.awtjs2d, "ViewerJS", astex.viewer.Viewer);
Clazz.prepareFields (c$, function () {
this.dimScreen =  new javajs.awt.Dimension (0, 0);
});
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, astex.awtjs2d.ViewerJS, []);
astex.viewer.Viewer.$isApplet = true;
astex.viewer.Viewer.isJS = true;
astex.viewer.Viewer.bytePoster = this;
this.astexCanvas =  new astex.awtjs2d.JSCanvas (this);
});
Clazz.overrideMethod (c$, "postByteArray", 
function (fileName, bytes) {
return astex.io.FILE.newOC ().setParams (null, fileName, false, null).setBytes (bytes).closeChannel ();
}, "~S,~A");
Clazz.overrideMethod (c$, "repaint", 
function () {
this.astexCanvas.repaint ();
});
Clazz.overrideMethod (c$, "showPopupMenu", 
function (x, y) {
}, "~N,~N");
Clazz.overrideMethod (c$, "callJSO", 
function (funcName, jsPars) {
{
try {
this.jso[funcName].apply(null,jsPars);
} catch (e) {
System.out.println("" + e)
}
}}, "~S,~A");
Clazz.overrideMethod (c$, "execJS", 
function (str) {
{
eval(str);
}}, "~S");
Clazz.overrideMethod (c$, "getColorStr", 
function (x, y) {
return null;
}, "~N,~N");
Clazz.overrideMethod (c$, "getFrame", 
function () {
return null;
});
Clazz.overrideMethod (c$, "getHeight", 
function () {
return 0;
});
Clazz.overrideMethod (c$, "populateFromMapState", 
function () {
});
Clazz.defineMethod (c$, "removeAnimationThread", 
function (animate) {
}, "~O");
Clazz.overrideMethod (c$, "showDialog", 
function (o, x, y) {
}, "~O,~N,~N");
Clazz.overrideMethod (c$, "setMapChoice", 
function (omap) {
}, "~O");
Clazz.overrideMethod (c$, "showMapSettingsDialog", 
function (isVisible) {
}, "~B");
Clazz.overrideMethod (c$, "updateDisplayItemFromCommand", 
function (name, value) {
}, "~S,~B");
Clazz.overrideMethod (c$, "createMenuBar", 
function () {
return null;
});
Clazz.overrideMethod (c$, "setUsePopupMenu", 
function (state) {
}, "~B");
Clazz.overrideMethod (c$, "showContourLevelDialog", 
function (b) {
}, "~B");
Clazz.overrideMethod (c$, "setUI", 
function () {
});
Clazz.overrideMethod (c$, "loadFileFromDialog", 
function (string) {
return null;
}, "~S");
Clazz.overrideMethod (c$, "createMask", 
function () {
});
Clazz.overrideMethod (c$, "createMaskEditingDialog", 
function (moleculeViewer, mapName, maskName) {
}, "astex.viewer.Viewer,~S,~S");
Clazz.overrideMethod (c$, "populateMaskEditingDialog", 
function (mask) {
}, "astex.api.AstexMask");
Clazz.overrideMethod (c$, "readMaskForMapFromDialog", 
function (mapName) {
}, "~S");
Clazz.overrideMethod (c$, "saveFileFromDialog", 
function (title, extensions) {
return null;
}, "~S,~A");
Clazz.overrideMethod (c$, "setMapStateFromDialog", 
function () {
});
Clazz.overrideMethod (c$, "showMaskEditingDialog", 
function (mapName, maskName) {
}, "~S,~S");
Clazz.overrideMethod (c$, "showMaskAddingDialog", 
function (isVisible) {
}, "~B");
Clazz.overrideMethod (c$, "updateMenus", 
function () {
});
Clazz.overrideMethod (c$, "mouseMoved", 
function (arg0) {
}, "java.awt.event.MouseEvent");
Clazz.overrideMethod (c$, "updateMaskEditDialog", 
function (mapName, maskName) {
}, "~S,~S");
Clazz.overrideMethod (c$, "updateMaskCount", 
function (map, name) {
}, "astex.map.VolumeMap,~S");
Clazz.overrideMethod (c$, "setActiveLight", 
function (al, l) {
}, "~N,astex.util.Light");
Clazz.overrideMethod (c$, "mapChanged", 
function (renderer, mapName, isAdded) {
}, "astex.render.MoleculeRenderer,~S,~B");
Clazz.defineMethod (c$, "paintCanvas", 
function (g) {
if (!this.ready) return;
var c = this.astexCanvas;
this.render (c.tainted, c.width > 0 ? c.width : this.dimScreen.width, c.height > 0 ? c.height : this.dimScreen.height);
astex.viewer.Viewer.apiPlatform.drawImage (g, this.display, 0, 0, this.dimScreen.width, this.dimScreen.height);
}, "~O");
Clazz.defineMethod (c$, "updateJS", 
function () {
this.paintCanvas (astex.viewer.Viewer.apiPlatform.getGraphics (null));
});
Clazz.defineMethod (c$, "setScreenDimension", 
function (width, height) {
if (this.dimScreen.width == width && this.dimScreen.height == height) return;
this.resizeImage (width, height);
}, "~N,~N");
Clazz.defineMethod (c$, "resizeImage", 
 function (width, height) {
if (width > 0) {
this.dimScreen.width = width;
this.dimScreen.height = height;
} else {
width = (this.dimScreen.width == 0 ? this.dimScreen.width = 500 : this.dimScreen.width);
height = (this.dimScreen.height == 0 ? this.dimScreen.height = 500 : this.dimScreen.height);
}this.astexCanvas.setBounds (0, 0, width, height);
}, "~N,~N");
Clazz.defineMethod (c$, "processMouseEvent", 
function (id, x, y, modifiers, time) {
return this.mouse.processEvent (id, x, y, modifiers, time);
}, "~N,~N,~N,~N,~N");
Clazz.overrideMethod (c$, "addMolecule", 
function (molecule) {
this.moleculeRenderer.addMolecule (molecule);
}, "astex.model.Molecule");
Clazz.overrideMethod (c$, "postMovieFrame", 
function (img, fnum, movid) {
}, "~S,~N,~S");
Clazz.defineMethod (c$, "setDisplay", 
function (canvas) {
this.display = canvas;
astex.viewer.Viewer.apiPlatform.setViewer (this, canvas);
}, "~O");
Clazz.overrideMethod (c$, "quitAnimate", 
function () {
});
});
