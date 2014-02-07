Clazz.declarePackage ("JSV.common");
Clazz.load (["java.lang.Enum", "javajs.api.EventManager", "java.util.Hashtable", "JU.List"], "JSV.common.PanelData", ["java.lang.Boolean", "$.Double", "javajs.awt.Font", "JU.CU", "JSV.api.JSVGraphics", "JSV.common.Annotation", "$.Coordinate", "$.GraphSet", "$.JDXSpectrum", "$.JSVFileManager", "$.JSVersion", "$.MeasurementData", "$.Parameters", "$.PeakPickEvent", "$.ScriptToken", "$.SubSpecChangeEvent", "$.ZoomEvent", "JSV.dialog.JSVDialog", "J.util.Logger"], function () {
c$ = Clazz.decorateAsClass (function () {
this.g2d = null;
this.g2d0 = null;
this.viewer = null;
this.listeners = null;
this.currentGraphSet = null;
this.options = null;
this.jsvp = null;
this.graphSets = null;
this.currentSplitPoint = 0;
this.thisWidget = null;
this.coordClicked = null;
this.coordsClicked = null;
this.ctrlPressed = false;
this.shiftPressed = false;
this.drawXAxisLeftToRight = false;
this.isIntegralDrag = false;
this.xAxisLeftToRight = true;
this.scalingFactor = 1;
this.integralShiftMode = 0;
this.left = 60;
this.right = 50;
this.coordStr = "";
this.startupPinTip = "Click to set.";
this.title = null;
this.clickCount = 0;
this.nSpectra = 0;
this.thisWidth = 0;
this.thisHeight = 0;
this.startIndex = 0;
this.endIndex = 0;
this.commonFilePath = null;
this.viewTitle = null;
this.displayFontName = null;
this.titleFontName = null;
this.isPrinting = false;
this.doReset = true;
this.printingFontName = null;
this.printGraphPosition = "default";
this.titleDrawn = false;
this.display1D = false;
this.isLinked = false;
this.printJobTitle = null;
this.spectra = null;
this.taintedAll = true;
this.currentFont = null;
this.mouseState = null;
this.gridOn = false;
this.titleOn = false;
this.mouseX = 0;
this.mouseY = 0;
this.linking = false;
this.xPixelClicked = 0;
this.coordinatesColor = null;
this.gridColor = null;
this.integralPlotColor = null;
this.peakTabColor = null;
this.plotAreaColor = null;
this.scaleColor = null;
this.titleColor = null;
this.unitsColor = null;
this.highlightColor = null;
this.zoomBoxColor = null;
this.zoomBoxColor2 = null;
this.BLACK = null;
this.bgcolor = null;
this.optionsSaved = null;
this.gMain = null;
Clazz.instantialize (this, arguments);
}, JSV.common, "PanelData", null, javajs.api.EventManager);
Clazz.prepareFields (c$, function () {
this.listeners =  new JU.List ();
this.options =  new java.util.Hashtable ();
});
Clazz.makeConstructor (c$, 
function (panel, viewer) {
this.viewer = viewer;
this.jsvp = panel;
this.g2d = this.g2d0 = viewer.g2d;
this.BLACK = this.g2d.getColor1 (0);
this.highlightColor = this.g2d.getColor4 (255, 0, 0, 200);
this.zoomBoxColor = this.g2d.getColor4 (150, 150, 100, 130);
this.zoomBoxColor2 = this.g2d.getColor4 (150, 100, 100, 130);
}, "JSV.api.JSVPanel,JSV.common.JSViewer");
$_M(c$, "addListener", 
function (listener) {
if (!this.listeners.contains (listener)) {
this.listeners.addLast (listener);
}}, "JSV.api.PanelListener");
$_M(c$, "getCurrentGraphSet", 
function () {
return this.currentGraphSet;
});
$_M(c$, "dispose", 
function () {
this.jsvp = null;
for (var i = 0; i < this.graphSets.size (); i++) this.graphSets.get (i).dispose ();

this.graphSets = null;
this.currentFont = null;
this.currentGraphSet = null;
this.coordClicked = null;
this.coordsClicked = null;
this.thisWidget = null;
this.options = null;
this.listeners = null;
});
$_M(c$, "setViewTitle", 
function (title) {
this.viewTitle = title;
}, "~S");
$_M(c$, "getViewTitle", 
function () {
return (this.viewTitle == null ? this.getTitle () : this.viewTitle);
});
$_M(c$, "getInfo", 
function (selectedOnly, key) {
var info =  new java.util.Hashtable ();
var sets = null;
if (selectedOnly) return this.currentGraphSet.getInfo (key, this.getCurrentSpectrumIndex ());
var entries = this.options.entrySet ();
for (var entry, $entry = entries.iterator (); $entry.hasNext () && ((entry = $entry.next ()) || true);) JSV.common.Parameters.putInfo (key, info, entry.getKey ().name (), entry.getValue ());

JSV.common.Parameters.putInfo (key, info, "type", this.getSpectrumAt (0).getDataType ());
JSV.common.Parameters.putInfo (key, info, "title", this.title);
JSV.common.Parameters.putInfo (key, info, "nSets", Integer.$valueOf (this.graphSets.size ()));
sets =  new JU.List ();
for (var i = this.graphSets.size (); --i >= 0; ) sets.addLast (this.graphSets.get (i).getInfo (key, -1));

info.put ("sets", sets);
return info;
}, "~B,~S");
$_M(c$, "setBooleans", 
function (parameters, st) {
if (st == null) {
var booleans = parameters.getBooleans ();
for (var entry, $entry = booleans.entrySet ().iterator (); $entry.hasNext () && ((entry = $entry.next ()) || true);) this.setBooleans (parameters, entry.getKey ());

return;
}this.setBoolean (st, parameters.getBoolean (st));
}, "JSV.common.Parameters,JSV.common.ScriptToken");
$_M(c$, "setBoolean", 
function (st, isTrue) {
this.taintedAll = true;
if (st === JSV.common.ScriptToken.REVERSEPLOT) {
this.currentGraphSet.setReversePlot (isTrue);
return;
}this.options.put (st, Boolean.$valueOf (isTrue));
switch (st) {
case JSV.common.ScriptToken.DISPLAY1D:
case JSV.common.ScriptToken.DISPLAY2D:
this.doReset = true;
break;
}
}, "JSV.common.ScriptToken,~B");
$_M(c$, "getBoolean", 
function (st) {
if (st === JSV.common.ScriptToken.REVERSEPLOT) return this.currentGraphSet.reversePlot;
if (this.options == null) return false;
var b = this.options.get (st);
return (b != null && (Clazz.instanceOf (b, Boolean)) && (b) === Boolean.TRUE);
}, "JSV.common.ScriptToken");
$_M(c$, "setFontName", 
function (st, fontName) {
switch (st) {
case JSV.common.ScriptToken.DISPLAYFONTNAME:
this.displayFontName = fontName;
break;
case JSV.common.ScriptToken.TITLEFONTNAME:
this.titleFontName = fontName;
break;
}
if (fontName != null) this.options.put (st, fontName);
}, "JSV.common.ScriptToken,~S");
$_M(c$, "getDisplay1D", 
function () {
return this.display1D;
});
$_M(c$, "initOne", 
function (spectrum) {
this.spectra =  new JU.List ();
this.spectra.addLast (spectrum);
this.initMany (this.spectra, 0, 0);
}, "JSV.common.JDXSpectrum");
$_M(c$, "initMany", 
function (spectra, startIndex, endIndex) {
this.startIndex = startIndex;
this.endIndex = endIndex;
this.nSpectra = spectra.size ();
this.spectra = spectra;
this.commonFilePath = spectra.get (0).getFilePath ();
for (var i = 0; i < this.nSpectra; i++) if (!this.commonFilePath.equalsIgnoreCase (spectra.get (i).getFilePath ())) {
this.commonFilePath = null;
break;
}
this.setGraphSets (JSV.common.PanelData.LinkMode.NONE);
}, "JU.List,~N,~N");
$_M(c$, "setGraphSets", 
($fz = function (linkMode) {
this.graphSets = JSV.common.GraphSet.createGraphSetsAndSetLinkMode (this, this.jsvp, this.spectra, this.startIndex, this.endIndex, linkMode);
this.currentGraphSet = this.graphSets.get (0);
this.title = this.getSpectrum ().getTitleLabel ();
}, $fz.isPrivate = true, $fz), "JSV.common.PanelData.LinkMode");
$_M(c$, "findMatchingPeakInfo", 
function (pi) {
var pi2 = null;
for (var i = 0; i < this.graphSets.size (); i++) if ((pi2 = this.graphSets.get (i).findMatchingPeakInfo (pi)) != null) break;

return pi2;
}, "JSV.common.PeakInfo");
$_M(c$, "integrateAll", 
function (parameters) {
for (var i = this.graphSets.size (); --i >= 0; ) this.graphSets.get (i).integrate (-1, parameters);

}, "JSV.common.ColorParameters");
$_M(c$, "getNumberOfGraphSets", 
function () {
return this.graphSets.size ();
});
$_M(c$, "getTitle", 
function () {
return this.title;
});
$_M(c$, "refresh", 
function () {
this.doReset = true;
});
$_M(c$, "addAnnotation", 
function (tokens) {
var title = this.currentGraphSet.addAnnotation (tokens, this.getTitle ());
if (title != null) this.title = title;
}, "JU.List");
$_M(c$, "addPeakHighlight", 
function (peakInfo) {
for (var i = 0; i < this.graphSets.size (); i++) this.graphSets.get (i).addPeakHighlight (peakInfo);

}, "JSV.common.PeakInfo");
$_M(c$, "selectPeakByFileIndex", 
function (filePath, index, atomKey) {
var pi = this.currentGraphSet.selectPeakByFileIndex (filePath, index, atomKey);
if (pi == null) for (var i = this.graphSets.size (); --i >= 0; ) if (this.graphSets.get (i) !== this.currentGraphSet && (pi = this.graphSets.get (i).selectPeakByFileIndex (filePath, index, atomKey)) != null) break;

return pi;
}, "~S,~S,~S");
$_M(c$, "setPlotColors", 
function (colors) {
for (var i = this.graphSets.size (); --i >= 0; ) this.graphSets.get (i).setPlotColors (colors);

}, "~A");
$_M(c$, "selectSpectrum", 
function (filePath, type, model, andCurrent) {
if (andCurrent) this.currentGraphSet.selectSpectrum (filePath, type, model);
if ("ID".equals (type)) {
this.jumpToSpectrum (this.getCurrentSpectrumIndex (), true);
return;
}for (var i = 0; i < this.graphSets.size (); i += 1) if (this.graphSets.get (i) !== this.currentGraphSet) this.graphSets.get (i).selectSpectrum (filePath, type, model);

}, "~S,~S,~S,~B");
$_M(c$, "hasFileLoaded", 
function (filePath) {
for (var i = this.graphSets.size (); --i >= 0; ) if (this.graphSets.get (i).hasFileLoaded (filePath)) return true;

return false;
}, "~S");
$_M(c$, "clearAllView", 
function () {
for (var i = this.graphSets.size (); --i >= 0; ) this.graphSets.get (i).clearViews ();

});
$_M(c$, "drawGraph", 
function (gMain, gFront, gRear, width, height, addFilePath) {
var withCoords;
this.gMain = gMain;
this.display1D = !this.isLinked && this.getBoolean (JSV.common.ScriptToken.DISPLAY1D);
var top = 40;
var bottom = 50;
var isResized = (this.isPrinting || this.doReset || this.thisWidth != width || this.thisHeight != height);
if (isResized) this.taintedAll = true;
if (this.taintedAll) this.g2d.fillBackground (gRear, this.bgcolor);
if (gFront !== gMain) {
this.g2d.fillBackground (gFront, null);
if (gMain !== gRear) this.g2d.fillBackground (gMain, null);
this.g2d.setStrokeBold (gMain, false);
}if (this.isPrinting) {
top *= 3;
bottom *= 3;
this.scalingFactor = 10;
withCoords = false;
} else {
this.scalingFactor = 1;
withCoords = this.getBoolean (JSV.common.ScriptToken.COORDINATESON);
this.titleOn = this.getBoolean (JSV.common.ScriptToken.TITLEON);
this.gridOn = this.getBoolean (JSV.common.ScriptToken.GRIDON);
}this.doReset = false;
this.titleDrawn = false;
this.thisWidth = width;
this.thisHeight = height;
for (var i = this.graphSets.size (); --i >= 0; ) this.graphSets.get (i).drawGraphSet (gMain, gFront, gRear, width, height, this.left, this.right, top, bottom, isResized, this.taintedAll);

if (this.titleOn && !this.titleDrawn && this.taintedAll) this.drawTitle (gMain, height * this.scalingFactor, width * this.scalingFactor, this.getDrawTitle (this.isPrinting));
if (withCoords && this.coordStr != null) this.drawCoordinates (gFront, top, this.thisWidth - this.right, top - 20);
if (addFilePath && this.taintedAll) {
var s = (this.commonFilePath != null ? this.commonFilePath : this.graphSets.size () == 1 && this.currentGraphSet.getTitle (true) != null ? this.getSpectrum ().getFilePath () : null);
if (s != null) {
this.printFilePath (gMain, this.left, height, s);
}}if (this.isPrinting) {
this.printVersion (gMain, height);
}this.taintedAll = (this.isPrinting || gMain === gFront);
}, "~O,~O,~O,~N,~N,~B");
$_M(c$, "drawCoordinates", 
function (g, top, x, y) {
this.g2d.setGraphicsColor (g, this.coordinatesColor);
var font = this.setFont (g, this.jsvp.getWidth (), 0, 12, true);
this.g2d.drawString (g, this.coordStr, x - font.stringWidth (this.coordStr), y);
}, "~O,~N,~N,~N");
$_M(c$, "setFont", 
function (g, width, style, size, isLabel) {
return this.g2d.setFont (g, this.getFont (g, width, style, size, isLabel));
}, "~O,~N,~N,~N,~B");
$_M(c$, "printFilePath", 
function (g, x, y, s) {
x *= this.scalingFactor;
y *= this.scalingFactor;
if (s.indexOf ("?") > 0) s = s.substring (s.indexOf ("?") + 1);
s = s.substring (s.lastIndexOf ("/") + 1);
s = s.substring (s.lastIndexOf ("\\") + 1);
this.g2d.setGraphicsColor (g, this.BLACK);
var font = this.setFont (g, 1000, 0, 9, true);
if (x != this.left * this.scalingFactor) x -= font.stringWidth (s);
this.g2d.drawString (g, s, x, y - font.getHeight ());
}, "~O,~N,~N,~S");
$_M(c$, "printVersion", 
function (g, pageHeight) {
this.g2d.setGraphicsColor (g, this.BLACK);
var font = this.setFont (g, 100, 0, 12, true);
var s = this.jsvp.getApiPlatform ().getDateFormat (false) + " JSpecView " + JSV.common.JSVersion.VERSION_SHORT;
var w = font.stringWidth (s);
this.g2d.drawString (g, s, (this.thisWidth - this.right) * this.scalingFactor - w, pageHeight * this.scalingFactor - font.getHeight () * 3);
}, "~O,~N");
$_M(c$, "drawTitle", 
function (g, pageHeight, pageWidth, title) {
title = title.$replace ('\n', ' ');
var font = this.getFont (g, pageWidth, this.isPrinting || this.getBoolean (JSV.common.ScriptToken.TITLEBOLDON) ? 1 : 0, 14, true);
var nPixels = font.stringWidth (title);
if (nPixels > pageWidth) {
var size = Clazz.doubleToInt (14.0 * pageWidth / nPixels);
if (size < 10) size = 10;
font = this.getFont (g, pageWidth, this.isPrinting || this.getBoolean (JSV.common.ScriptToken.TITLEBOLDON) ? 1 : 0, size, true);
}this.g2d.setGraphicsColor (g, this.titleColor);
this.setCurrentFont (this.g2d.setFont (g, font));
this.g2d.drawString (g, title, (this.isPrinting ? this.left * this.scalingFactor : 5), pageHeight - Clazz.doubleToInt (font.getHeight () * (this.isPrinting ? 2 : 0.5)));
}, "~O,~N,~N,~S");
$_M(c$, "setCurrentFont", 
($fz = function (font) {
this.currentFont = font;
}, $fz.isPrivate = true, $fz), "javajs.awt.Font");
$_M(c$, "getFontHeight", 
function () {
return this.currentFont.getAscent ();
});
$_M(c$, "getStringWidth", 
function (s) {
return this.currentFont.stringWidth (s);
}, "~S");
$_M(c$, "selectFromEntireSet", 
function (iSpec) {
for (var i = 0, pt = 0; i < this.graphSets.size (); i++) {
if (iSpec == -2147483648) {
this.graphSets.get (i).setSelected (-1);
continue;
}var specs = this.graphSets.get (i).spectra;
for (var j = 0; j < specs.size (); j++, pt++) if (iSpec < 0 || iSpec == pt) this.graphSets.get (i).setSelected (j);

}
}, "~N");
$_M(c$, "addToList", 
function (iSpec, list) {
for (var i = 0; i < this.spectra.size (); i++) if (iSpec < 0 || i == iSpec) list.addLast (this.spectra.get (i));

}, "~N,JU.List");
$_M(c$, "scaleSelectedBy", 
function (f) {
for (var i = this.graphSets.size (); --i >= 0; ) this.graphSets.get (i).scaleSelectedBy (f);

}, "~N");
$_M(c$, "setCurrentGraphSet", 
($fz = function (gs, yPixel, clickCount) {
var splitPoint = gs.getSplitPoint (yPixel);
var isNewSet = (this.currentGraphSet !== gs);
var isNewSplitPoint = (isNewSet || this.currentSplitPoint != splitPoint);
this.currentGraphSet = gs;
this.currentSplitPoint = splitPoint;
if (isNewSet || gs.nSplit > 1 && isNewSplitPoint) this.setSpectrum (this.currentSplitPoint, true);
if (!isNewSet) {
isNewSet = gs.checkSpectrumClickedEvent (this.mouseX, this.mouseY, clickCount);
if (!isNewSet) return;
}this.jumpToSpectrum (splitPoint, isNewSet || gs.nSplit > 1 && isNewSplitPoint);
}, $fz.isPrivate = true, $fz), "JSV.common.GraphSet,~N,~N");
$_M(c$, "jumpToSpectrum", 
function (index, doSetSpec) {
if (index < 0 || index >= this.currentGraphSet.nSpectra) return;
this.currentSplitPoint = index;
if (doSetSpec) this.setSpectrum (this.currentSplitPoint, true);
var spec = this.getSpectrum ();
this.notifySubSpectrumChange (spec.getSubIndex (), spec);
}, "~N,~B");
$_M(c$, "splitStack", 
function (doSplit) {
this.currentGraphSet.splitStack (this.graphSets, doSplit);
}, "~B");
$_M(c$, "getNumberOfSpectraInCurrentSet", 
function () {
return this.currentGraphSet.nSpectra;
});
$_M(c$, "getSourceID", 
function () {
return this.getSpectrumAt (0).sourceID;
});
$_M(c$, "getStartingPointIndex", 
function (index) {
return this.currentGraphSet.viewData.getStartingPointIndex (index);
}, "~N");
$_M(c$, "getEndingPointIndex", 
function (index) {
return this.currentGraphSet.viewData.getEndingPointIndex (index);
}, "~N");
$_M(c$, "haveSelectedSpectrum", 
function () {
return this.currentGraphSet.haveSelectedSpectrum ();
});
$_M(c$, "getShowAnnotation", 
function (type) {
return this.currentGraphSet.getShowAnnotation (type, -1);
}, "JSV.common.Annotation.AType");
$_M(c$, "showAnnotation", 
function (type, tfToggle) {
this.currentGraphSet.setShowAnnotation (type, tfToggle);
}, "JSV.common.Annotation.AType,Boolean");
$_M(c$, "setYStackOffsetPercent", 
function (offset) {
this.currentGraphSet.yStackOffsetPercent = offset;
}, "~N");
$_M(c$, "setSpectrum", 
function (iSpec, isSplit) {
this.currentGraphSet.setSpectrum (iSpec, isSplit);
}, "~N,~B");
$_M(c$, "getSpectrum", 
function () {
return this.currentGraphSet.getSpectrum ();
});
$_M(c$, "setSpectrum", 
function (spec) {
this.taintedAll = true;
var spec0 = this.currentGraphSet.getSpectrum ();
this.currentGraphSet.setSpectrumJDX (spec);
for (var i = 0; i < this.spectra.size (); i++) if (this.spectra.get (i) === spec0) this.spectra.set (i, spec);

}, "JSV.common.JDXSpectrum");
$_M(c$, "isShowAllStacked", 
function () {
return this.currentGraphSet.showAllStacked;
});
$_M(c$, "getCurrentSpectrumIndex", 
function () {
return this.currentGraphSet.getCurrentSpectrumIndex ();
});
$_M(c$, "getSpectrumAt", 
function (index) {
if (this.currentGraphSet == null) return null;
return this.currentGraphSet.getSpectrumAt (index);
}, "~N");
$_M(c$, "addHighlight", 
function (gs, x1, x2, spec, r, g, b, a) {
(gs == null ? this.currentGraphSet : gs).addHighlight (x1, x2, spec, this.g2d.getColor4 (r, g, b, a));
}, "JSV.common.GraphSet,~N,~N,JSV.common.JDXSpectrum,~N,~N,~N,~N");
$_M(c$, "removeHighlight", 
function (x1, x2) {
this.currentGraphSet.removeHighlight (x1, x2);
}, "~N,~N");
$_M(c$, "removeAllHighlights", 
function () {
this.currentGraphSet.removeAllHighlights ();
});
$_M(c$, "setZoom", 
function (x1, y1, x2, y2) {
this.currentGraphSet.setZoom (x1, y1, x2, y2);
this.doReset = true;
this.taintedAll = true;
this.notifyListeners ( new JSV.common.ZoomEvent (x1, y1, x2, y2));
}, "~N,~N,~N,~N");
$_M(c$, "resetView", 
function () {
this.currentGraphSet.resetView ();
});
$_M(c$, "previousView", 
function () {
this.currentGraphSet.previousView ();
});
$_M(c$, "nextView", 
function () {
this.currentGraphSet.nextView ();
});
$_M(c$, "getSelectedIntegral", 
function () {
return this.currentGraphSet.getSelectedIntegral ();
});
$_M(c$, "advanceSubSpectrum", 
function (dir) {
this.currentGraphSet.advanceSubSpectrum (dir);
}, "~N");
$_M(c$, "setSelectedIntegral", 
function (val) {
this.currentGraphSet.setSelectedIntegral (val);
}, "~N");
$_M(c$, "scaleYBy", 
function (f) {
this.currentGraphSet.scaleYBy (f);
}, "~N");
$_M(c$, "toPeak", 
function (i) {
this.currentGraphSet.toPeak (i);
}, "~N");
$_M(c$, "getClickedCoordinate", 
function () {
return this.coordClicked;
});
$_M(c$, "getPickedCoordinates", 
function (coord, actualCoord) {
return JSV.common.Coordinate.getPickedCoordinates (this.coordsClicked, this.coordClicked, coord, actualCoord);
}, "JSV.common.Coordinate,JSV.common.Coordinate");
$_M(c$, "shiftSpectrum", 
function (dx, x1) {
return this.currentGraphSet.shiftSpectrum (dx, x1);
}, "~N,~N");
$_M(c$, "findX", 
function (spec, d) {
this.currentGraphSet.setXPointer (spec, d);
}, "JSV.common.JDXSpectrum,~N");
$_M(c$, "setXPointers", 
function (spec, x1, spec2, x2) {
this.currentGraphSet.setXPointer (spec, x1);
this.currentGraphSet.setXPointer2 (spec2, x2);
}, "JSV.common.JDXSpectrum,~N,JSV.common.JDXSpectrum,~N");
$_M(c$, "isCurrentGraphSet", 
function (graphSet) {
return graphSet === this.currentGraphSet;
}, "JSV.common.GraphSet");
$_M(c$, "repaint", 
function () {
this.jsvp.doRepaint (false);
});
$_M(c$, "setToolTipText", 
function (s) {
this.jsvp.setToolTipText (s);
}, "~S");
$_M(c$, "setHighlightColor", 
function (color) {
this.jsvp.getPanelData ().setColor (JSV.common.ScriptToken.HIGHLIGHTCOLOR, color);
}, "javajs.api.GenericColor");
$_M(c$, "getInput", 
function (message, title, sval) {
return this.jsvp.getInput (message, title, sval);
}, "~S,~S,~S");
$_M(c$, "getFont", 
($fz = function (g, width, style, size, isLabel) {
size *= this.scalingFactor;
if (isLabel) {
if (width < 400) size = ((width * size) / 400);
} else {
if (width < 250) size = ((width * size) / 250);
}var face = this.jsvp.getFontFaceID (this.isPrinting ? this.printingFontName : this.displayFontName);
return this.currentFont = javajs.awt.Font.createFont3D (face, style, size, size, this.jsvp.getApiPlatform (), g);
}, $fz.isPrivate = true, $fz), "~O,~N,~N,~N,~B");
$_M(c$, "notifySubSpectrumChange", 
function (isub, spec) {
this.notifyListeners ( new JSV.common.SubSpecChangeEvent (isub, (spec == null ? null : spec.getTitleLabel ())));
}, "~N,JSV.common.JDXSpectrum");
$_M(c$, "notifyPeakPickedListeners", 
function (p) {
if (p == null) {
p =  new JSV.common.PeakPickEvent (this.jsvp, this.coordClicked, this.getSpectrum ().getAssociatedPeakInfo (this.xPixelClicked, this.coordClicked));
}this.notifyListeners (p);
}, "JSV.common.PeakPickEvent");
$_M(c$, "notifyListeners", 
function (eventObj) {
for (var i = 0; i < this.listeners.size (); i++) if (this.listeners.get (i) != null) this.listeners.get (i).panelEvent (eventObj);

}, "~O");
$_M(c$, "escapeKeyPressed", 
function (isDEL) {
this.currentGraphSet.escapeKeyPressed (isDEL);
}, "~B");
$_M(c$, "hasFocus", 
function () {
return this.jsvp.hasFocus ();
});
$_M(c$, "isMouseUp", 
function () {
return (this.mouseState === JSV.common.PanelData.Mouse.UP);
});
$_M(c$, "doMouseMoved", 
function (xPixel, yPixel) {
this.mouseX = xPixel;
this.mouseY = yPixel;
this.mouseState = JSV.common.PanelData.Mouse.UP;
this.clickCount = 0;
var gs = JSV.common.GraphSet.findGraphSet (this.graphSets, xPixel, yPixel);
if (gs == null) return;
gs.mouseMovedEvent (xPixel, yPixel);
}, "~N,~N");
$_M(c$, "doMousePressed", 
function (xPixel, yPixel) {
this.mouseState = JSV.common.PanelData.Mouse.DOWN;
var gs = JSV.common.GraphSet.findGraphSet (this.graphSets, xPixel, yPixel);
if (gs == null) return;
this.setCurrentGraphSet (gs, yPixel, 0);
this.clickCount = (++this.clickCount % 3);
gs.checkWidgetEvent (xPixel, yPixel, true);
}, "~N,~N");
$_M(c$, "doMouseDragged", 
function (xPixel, yPixel) {
this.isIntegralDrag = new Boolean (this.isIntegralDrag | this.ctrlPressed).valueOf ();
this.mouseState = JSV.common.PanelData.Mouse.DOWN;
if (JSV.common.GraphSet.findGraphSet (this.graphSets, xPixel, yPixel) !== this.currentGraphSet) return;
this.currentGraphSet.checkWidgetEvent (xPixel, yPixel, false);
this.currentGraphSet.mouseMovedEvent (xPixel, yPixel);
}, "~N,~N");
$_M(c$, "doMouseReleased", 
function (xPixel, yPixel, isButton1) {
this.mouseState = JSV.common.PanelData.Mouse.UP;
if (this.thisWidget == null && this.currentGraphSet.pendingMeasurement == null || !isButton1) return;
this.currentGraphSet.mouseReleasedEvent (xPixel, yPixel);
this.thisWidget = null;
this.isIntegralDrag = false;
this.integralShiftMode = 0;
}, "~N,~N,~B");
$_M(c$, "doMouseClicked", 
function (xPixel, yPixel, isControlDown) {
var gs = JSV.common.GraphSet.findGraphSet (this.graphSets, xPixel, yPixel);
if (gs == null) return;
this.setCurrentGraphSet (gs, yPixel, this.clickCount);
gs.mouseClickedEvent (xPixel, yPixel, this.clickCount, isControlDown);
this.repaint ();
}, "~N,~N,~B");
$_M(c$, "hasCurrentMeasurements", 
function (type) {
return this.currentGraphSet.hasCurrentMeasurement (type);
}, "JSV.common.Annotation.AType");
$_M(c$, "getDialog", 
function (type) {
return this.currentGraphSet.getDialog (type, -1);
}, "JSV.common.Annotation.AType");
$_M(c$, "addDialog", 
function (iSpec, type, dialog) {
this.currentGraphSet.addDialog (iSpec, type, dialog);
}, "~N,JSV.common.Annotation.AType,JSV.api.AnnotationData");
$_M(c$, "getPeakListing", 
function (p, tfToggle) {
if (p != null) this.currentGraphSet.getPeakListing (-1, p, true);
this.currentGraphSet.setPeakListing (tfToggle);
}, "JSV.common.Parameters,Boolean");
$_M(c$, "checkIntegral", 
function (parameters, value) {
this.currentGraphSet.checkIntegral (parameters, value);
}, "JSV.common.Parameters,~S");
$_M(c$, "setIntegrationRatios", 
function (value) {
this.currentGraphSet.setIntegrationRatios (value);
}, "~S");
$_M(c$, "getView", 
function () {
return this.currentGraphSet.getCurrentView ();
});
$_M(c$, "closeAllDialogsExcept", 
function (type) {
for (var i = this.graphSets.size (); --i >= 0; ) this.graphSets.get (i).closeDialogsExcept (type);

}, "JSV.common.Annotation.AType");
$_M(c$, "removeDialog", 
function (dialog) {
this.currentGraphSet.removeDialog (dialog);
}, "JSV.dialog.JSVDialog");
$_M(c$, "normalizeIntegral", 
function () {
var integral = this.getSelectedIntegral ();
if (integral == null) return;
var sValue = integral.text;
if (sValue.length == 0) sValue = "" + integral.getValue ();
var newValue = this.getInput ("Enter a new value for this integral", "Normalize Integral", sValue);
try {
this.setSelectedIntegral (Double.parseDouble (newValue));
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
} else {
throw e;
}
}
});
$_M(c$, "getDrawTitle", 
function (isPrinting) {
var title = null;
if (isPrinting) title = this.printJobTitle;
 else if (this.nSpectra == 1) {
title = this.getSpectrum ().getPeakTitle ();
} else if (this.viewTitle != null) {
if (this.currentGraphSet.getTitle (false) != null) title = this.getSpectrum ().getPeakTitle ();
if (title == null) title = this.viewTitle;
} else {
title = this.jsvp.getTitle ().trim ();
}if (title.indexOf ("\n") >= 0) title = title.substring (0, title.indexOf ("\n")).trim ();
return title;
}, "~B");
$_M(c$, "getPrintJobTitle", 
function (isPrinting) {
var title = null;
if (this.nSpectra == 1) {
title = this.getSpectrum ().getTitle ();
} else if (this.viewTitle != null) {
if (this.graphSets.size () == 1) title = this.currentGraphSet.getTitle (isPrinting);
if (title == null) title = this.viewTitle;
} else {
title = this.jsvp.getTitle ().trim ();
}if (title.indexOf ("\n") >= 0) title = title.substring (0, title.indexOf ("\n")).trim ();
 else if (title.startsWith ("$")) title = title.substring (1);
return title;
}, "~B");
$_M(c$, "linkSpectra", 
function (mode) {
if (mode === JSV.common.PanelData.LinkMode.ALL) mode = (this.nSpectra == 2 ? JSV.common.PanelData.LinkMode.AB : this.nSpectra == 3 ? JSV.common.PanelData.LinkMode.ABC : JSV.common.PanelData.LinkMode.NONE);
if (mode !== JSV.common.PanelData.LinkMode.NONE && mode.toString ().length != this.nSpectra) return;
this.setGraphSets (mode);
}, "JSV.common.PanelData.LinkMode");
$_M(c$, "doZoomLinked", 
function (graphSet, initX, finalX, addZoom, checkRange, is1d) {
if (this.linking) return;
this.linking = true;
var spec = graphSet.getSpectrumAt (0);
for (var i = this.graphSets.size (); --i >= 0; ) {
var gs = this.graphSets.get (i);
if (gs !== graphSet && JSV.common.JDXSpectrum.areXScalesCompatible (spec, this.graphSets.get (i).getSpectrumAt (0), false, true)) gs.doZoom (initX, 0, finalX, 0, is1d, false, checkRange, false, addZoom);
}
this.linking = false;
}, "JSV.common.GraphSet,~N,~N,~B,~B,~B");
$_M(c$, "clearLinkViews", 
function (graphSet) {
if (this.linking) return;
this.linking = true;
var spec = graphSet.getSpectrum ();
for (var i = this.graphSets.size (); --i >= 0; ) {
var gs = this.graphSets.get (i);
if (gs !== graphSet && JSV.common.JDXSpectrum.areXScalesCompatible (spec, this.graphSets.get (i).getSpectrum (), false, true)) gs.clearViews ();
}
this.linking = false;
}, "JSV.common.GraphSet");
$_M(c$, "setlinkedXMove", 
function (graphSet, x, isX2) {
if (this.linking) return;
this.linking = true;
var spec = graphSet.getSpectrum ();
for (var i = this.graphSets.size (); --i >= 0; ) {
var gs = this.graphSets.get (i);
if (gs !== graphSet && JSV.common.JDXSpectrum.areXScalesCompatible (spec, this.graphSets.get (i).getSpectrum (), false, true)) {
if (gs.imageView == null) if (isX2) {
gs.setXPixelMovedTo (1.7976931348623157E308, x, 0, 0);
} else {
gs.setXPixelMovedTo (x, 1.7976931348623157E308, 0, 0);
}}}
this.linking = false;
}, "JSV.common.GraphSet,~N,~B");
$_M(c$, "set2DCrossHairsLinked", 
function (graphSet, x, y, isLocked) {
if (Math.abs (x - y) < 0.1) x = y = 1.7976931348623157E308;
for (var i = this.graphSets.size (); --i >= 0; ) {
var gs = this.graphSets.get (i);
if (gs !== graphSet) gs.set2DXY (x, y, isLocked);
}
}, "JSV.common.GraphSet,~N,~N,~B");
$_M(c$, "dialogsToFront", 
function () {
this.currentGraphSet.dialogsToFront ();
});
$_M(c$, "setColor", 
function (st, color) {
if (color != null) this.options.put (st, JU.CU.toRGBHexString (color));
switch (st) {
case JSV.common.ScriptToken.BACKGROUNDCOLOR:
this.jsvp.setBackgroundColor (this.bgcolor = color);
this.taintedAll = true;
break;
case JSV.common.ScriptToken.COORDINATESCOLOR:
this.coordinatesColor = color;
break;
case JSV.common.ScriptToken.GRIDCOLOR:
this.gridColor = color;
this.taintedAll = true;
break;
case JSV.common.ScriptToken.HIGHLIGHTCOLOR:
this.highlightColor = color;
if (this.highlightColor.getOpacity255 () == 255) this.highlightColor.setOpacity255 (150);
break;
case JSV.common.ScriptToken.INTEGRALPLOTCOLOR:
this.integralPlotColor = color;
this.taintedAll = true;
break;
case JSV.common.ScriptToken.PEAKTABCOLOR:
this.peakTabColor = color;
this.taintedAll = true;
break;
case JSV.common.ScriptToken.PLOTCOLOR:
for (var i = this.graphSets.size (); --i >= 0; ) this.graphSets.get (i).setPlotColor0 (color);

this.taintedAll = true;
break;
case JSV.common.ScriptToken.PLOTAREACOLOR:
this.plotAreaColor = color;
this.taintedAll = true;
break;
case JSV.common.ScriptToken.SCALECOLOR:
this.scaleColor = color;
this.taintedAll = true;
break;
case JSV.common.ScriptToken.TITLECOLOR:
this.titleColor = color;
this.taintedAll = true;
break;
case JSV.common.ScriptToken.UNITSCOLOR:
this.unitsColor = color;
this.taintedAll = true;
break;
case JSV.common.ScriptToken.ZOOMBOXCOLOR:
this.zoomBoxColor = color;
break;
case JSV.common.ScriptToken.ZOOMBOXCOLOR2:
this.zoomBoxColor2 = color;
break;
default:
J.util.Logger.warn ("AwtPanel --- unrecognized color: " + st);
break;
}
}, "JSV.common.ScriptToken,javajs.api.GenericColor");
$_M(c$, "getColor", 
function (whatColor) {
switch (whatColor) {
default:
J.util.Logger.error ("awtgraphset missing color " + whatColor);
return this.BLACK;
case JSV.common.ScriptToken.ZOOMBOXCOLOR2:
return this.zoomBoxColor2;
case JSV.common.ScriptToken.ZOOMBOXCOLOR:
return this.zoomBoxColor;
case JSV.common.ScriptToken.HIGHLIGHTCOLOR:
return this.highlightColor;
case JSV.common.ScriptToken.INTEGRALPLOTCOLOR:
return this.integralPlotColor;
case JSV.common.ScriptToken.GRIDCOLOR:
return this.gridColor;
case JSV.common.ScriptToken.PEAKTABCOLOR:
return this.peakTabColor;
case JSV.common.ScriptToken.PLOTAREACOLOR:
return this.plotAreaColor;
case JSV.common.ScriptToken.SCALECOLOR:
return this.scaleColor;
case JSV.common.ScriptToken.TITLECOLOR:
return this.titleColor;
case JSV.common.ScriptToken.UNITSCOLOR:
return this.unitsColor;
}
}, "JSV.common.ScriptToken");
$_M(c$, "getOverlayLegendData", 
function () {
var numSpectra = this.currentGraphSet.nSpectra;
var data =  new Array (numSpectra);
var f1 = this.getSpectrumAt (0).getFilePath ();
var f2 = this.getSpectrumAt (numSpectra - 1).getFilePath ();
var useFileName = !f1.equals (f2);
for (var index = 0; index < numSpectra; index++) {
var cols =  new Array (3);
var spectrum = this.getSpectrumAt (index);
this.title = spectrum.getTitle ();
if (useFileName) this.title = JSV.common.JSVFileManager.getName (spectrum.getFilePath ()) + " - " + this.title;
var plotColor = this.getCurrentPlotColor (index);
cols[0] =  new Integer (index + 1);
cols[1] = plotColor;
cols[2] = " " + this.title;
data[index] = cols;
}
return data;
});
$_M(c$, "setColorOrFont", 
function (params, st) {
if (st == null) {
var colors = params.elementColors;
for (var entry, $entry = colors.entrySet ().iterator (); $entry.hasNext () && ((entry = $entry.next ()) || true);) this.setColorOrFont (params, entry.getKey ());

this.setColorOrFont (params, JSV.common.ScriptToken.DISPLAYFONTNAME);
this.setColorOrFont (params, JSV.common.ScriptToken.TITLEFONTNAME);
return;
}switch (st) {
case JSV.common.ScriptToken.DISPLAYFONTNAME:
this.setFontName (st, params.displayFontName);
return;
case JSV.common.ScriptToken.TITLEFONTNAME:
this.setFontName (st, params.titleFontName);
return;
}
this.setColor (st, params.getElementColor (st));
}, "JSV.common.ColorParameters,JSV.common.ScriptToken");
$_M(c$, "getCurrentPlotColor", 
function (i) {
return this.currentGraphSet.getPlotColor (i);
}, "~N");
$_M(c$, "setPrint", 
function (pl, fontName) {
if (pl == null) {
this.options.putAll (this.optionsSaved);
this.optionsSaved = null;
return;
}this.printJobTitle = pl.title;
this.printingFontName = fontName;
this.printGraphPosition = pl.position;
this.optionsSaved =  new java.util.Hashtable ();
this.optionsSaved.putAll (this.options);
this.gridOn = pl.showGrid;
this.titleOn = pl.showTitle;
this.setBoolean (JSV.common.ScriptToken.XSCALEON, pl.showXScale);
this.setBoolean (JSV.common.ScriptToken.XUNITSON, pl.showXScale);
this.setBoolean (JSV.common.ScriptToken.YSCALEON, pl.showYScale);
this.setBoolean (JSV.common.ScriptToken.YUNITSON, pl.showYScale);
}, "JSV.common.PrintLayout,~S");
$_M(c$, "showDialog", 
function (type) {
var ad = this.getDialog (type);
this.closeAllDialogsExcept (type);
if (ad != null && Clazz.instanceOf (ad, JSV.dialog.JSVDialog)) return (ad).reEnable ();
var iSpec = this.getCurrentSpectrumIndex ();
if (iSpec < 0) {
this.jsvp.showMessage ("To enable " + type + " first select a spectrum by clicking on it.", "" + type);
return null;
}var spec = this.getSpectrum ();
var dialog = this.viewer.getDialog (type, spec);
if (ad == null && type === JSV.common.Annotation.AType.Measurements) ad =  new JSV.common.MeasurementData (JSV.common.Annotation.AType.Measurements, spec);
if (ad != null) dialog.setData (ad);
this.addDialog (iSpec, type, dialog);
dialog.reEnable ();
return dialog;
}, "JSV.common.Annotation.AType");
$_M(c$, "printPdf", 
function (pdfCreator, pl) {
var isPortrait = !pl.layout.equals ("landscape");
this.print (pdfCreator, (isPortrait ? pl.imageableHeight : pl.imageableWidth), (isPortrait ? pl.imageableWidth : pl.imageableHeight), pl.imageableX, pl.imageableY, pl.paperHeight, pl.paperWidth, isPortrait, 0);
}, "JSV.api.JSVGraphics,JSV.common.PrintLayout");
$_M(c$, "print", 
function (g, height, width, x, y, paperHeight, paperWidth, isPortrait, pi) {
this.g2d = this.g2d0;
if (pi == 0) {
this.isPrinting = true;
var addFilePath = false;
if (Clazz.instanceOf (g, JSV.api.JSVGraphics)) {
this.g2d = g;
g = this.gMain;
}if (this.printGraphPosition.equals ("default")) {
if (isPortrait) {
height = 450;
width = 280;
} else {
height = 280;
width = 450;
}} else if (this.printGraphPosition.equals ("fit to page")) {
addFilePath = true;
} else {
if (isPortrait) {
height = 450;
width = 280;
x = Clazz.doubleToInt (Clazz.doubleToInt (paperWidth - width) / 2);
y = Clazz.doubleToInt (Clazz.doubleToInt (paperHeight - height) / 2);
} else {
height = 280;
width = 450;
y = Clazz.doubleToInt (Clazz.doubleToInt (paperWidth - 280) / 2);
x = Clazz.doubleToInt (Clazz.doubleToInt (paperHeight - 450) / 2);
}}this.g2d.translateScale (g, x, y, 0.1);
this.taintedAll = true;
this.drawGraph (g, g, g, Clazz.doubleToInt (width), Clazz.doubleToInt (height), addFilePath);
this.isPrinting = false;
return 0;
}this.isPrinting = false;
return 1;
}, "~O,~N,~N,~N,~N,~N,~N,~B,~N");
$_V(c$, "keyPressed", 
function (code, modifiers) {
if (this.isPrinting) return false;
this.checkKeyControl (code, true);
switch (code) {
case 27:
case 127:
case 8:
this.escapeKeyPressed (code != 27);
this.isIntegralDrag = false;
this.repaint ();
return true;
}
var scaleFactor = 0;
var doConsume = false;
if (modifiers == 0) {
switch (code) {
case 37:
case 39:
this.doMouseMoved ((code == 39 ? ++this.mouseX : --this.mouseX), this.mouseY);
this.repaint ();
doConsume = true;
break;
case 33:
case 34:
scaleFactor = (code == 33 ? JSV.common.GraphSet.RT2 : 1 / JSV.common.GraphSet.RT2);
doConsume = true;
break;
case 40:
case 38:
var dir = (code == 40 ? -1 : 1);
if (this.getSpectrumAt (0).getSubSpectra () == null) {
this.notifySubSpectrumChange (dir, null);
} else {
this.advanceSubSpectrum (dir);
this.repaint ();
}doConsume = true;
break;
}
} else if (this.checkMod (code, 2)) {
switch (code) {
case 40:
case 38:
case 45:
case 61:
scaleFactor = (code == 61 || code == 38 ? JSV.common.GraphSet.RT2 : 1 / JSV.common.GraphSet.RT2);
doConsume = true;
break;
case 37:
case 39:
this.toPeak (code == 39 ? 1 : -1);
doConsume = true;
break;
}
}if (scaleFactor != 0) {
this.scaleYBy (scaleFactor);
this.repaint ();
}return doConsume;
}, "~N,~N");
$_V(c$, "keyReleased", 
function (keyCode) {
if (this.isPrinting) return;
this.checkKeyControl (keyCode, false);
}, "~N");
$_V(c$, "keyTyped", 
function (ch, mods) {
if (this.isPrinting) return false;
switch (ch) {
case 'n':
if (mods != 0) break;
this.normalizeIntegral ();
return true;
case 26:
if (mods != 2) break;
this.previousView ();
this.repaint ();
return true;
case 25:
if (mods != 2) break;
this.nextView ();
this.repaint ();
return true;
}
return false;
}, "~N,~N");
$_V(c$, "mouseAction", 
function (mode, time, x, y, countIgnored, buttonMods) {
if (this.isPrinting) return;
switch (mode) {
case 4:
if (!this.checkMod (buttonMods, 16)) return;
this.doMousePressed (x, y);
break;
case 5:
this.doMouseReleased (x, y, this.checkMod (buttonMods, 16));
this.repaint ();
break;
case 1:
this.doMouseDragged (x, y);
this.repaint ();
break;
case 0:
this.jsvp.getFocusNow (false);
if ((buttonMods & 28) != 0) {
this.doMouseDragged (x, y);
this.repaint ();
return;
}this.doMouseMoved (x, y);
if (this.coordStr != null) this.repaint ();
break;
case 2:
if (this.checkMod (buttonMods, 4)) {
this.jsvp.showMenu (x, y);
return;
}this.ctrlPressed = false;
this.doMouseClicked (x, y, this.updateControlPressed (buttonMods));
break;
}
}, "~N,~N,~N,~N,~N,~N");
$_M(c$, "checkMod", 
function (buttonMods, mask) {
return ((buttonMods & mask) == mask);
}, "~N,~N");
$_M(c$, "checkKeyControl", 
function (keyCode, isPressed) {
switch (keyCode) {
case 17:
case 157:
this.ctrlPressed = isPressed;
break;
case 16:
this.shiftPressed = isPressed;
break;
}
}, "~N,~B");
$_M(c$, "updateControlPressed", 
function (mods) {
return (this.ctrlPressed = new Boolean (this.ctrlPressed | (this.checkMod (mods, 2) || this.checkMod (mods, 20))).valueOf ());
}, "~N");
$_V(c$, "mouseEnterExit", 
function (time, x, y, isExit) {
if (isExit) {
this.thisWidget = null;
this.isIntegralDrag = false;
this.integralShiftMode = 0;
} else {
try {
this.jsvp.getFocusNow (false);
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
System.out.println ("pd " + this + " cannot focus");
} else {
throw e;
}
}
}}, "~N,~N,~N,~B");
Clazz.pu$h ();
c$ = Clazz.declareType (JSV.common.PanelData, "LinkMode", Enum);
c$.getMode = $_M(c$, "getMode", 
function (a) {
if (a.equals ("*")) return JSV.common.PanelData.LinkMode.ALL;
for (var mode, $mode = 0, $$mode = JSV.common.PanelData.LinkMode.values (); $mode < $$mode.length && ((mode = $$mode[$mode]) || true); $mode++) if (mode.name ().equalsIgnoreCase (a)) return mode;

return JSV.common.PanelData.LinkMode.NONE;
}, "~S");
Clazz.defineEnumConstant (c$, "ALL", 0, []);
Clazz.defineEnumConstant (c$, "NONE", 1, []);
Clazz.defineEnumConstant (c$, "AB", 2, []);
Clazz.defineEnumConstant (c$, "ABC", 3, []);
c$ = Clazz.p0p ();
Clazz.pu$h ();
c$ = Clazz.declareType (JSV.common.PanelData, "Mouse", Enum);
Clazz.defineEnumConstant (c$, "UP", 0, []);
Clazz.defineEnumConstant (c$, "DOWN", 1, []);
c$ = Clazz.p0p ();
Clazz.defineStatics (c$,
"defaultPrintHeight", 450,
"defaultPrintWidth", 280,
"topMargin", 40,
"bottomMargin", 50,
"leftMargin", 60,
"rightMargin", 50);
});
