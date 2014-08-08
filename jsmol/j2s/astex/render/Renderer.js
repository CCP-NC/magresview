Clazz.declarePackage ("astex.render");
Clazz.load (["astex.render.Tmesh", "$.Vertex", "astex.util.Color32", "$.DoubleArray", "$.DynamicArray", "$.IntArray", "$.Matrix", "$.Point3d", "$.Settings", "java.util.Hashtable", "JU.AU"], "astex.render.Renderer", ["astex.api.Interface", "astex.io.FILE", "astex.map.GraphicalObject", "astex.render.AstexLogo", "$.RendererEvent", "astex.util.Light", "$.Log", "java.lang.Double"], function () {
c$ = Clazz.decorateAsClass (function () {
this.drawImageLogo = false;
this.drawImageLogoPdbe = false;
this.shadowMode = 0;
this.pixelWidth = 0;
this.pixelHeight = 0;
this.pixelCount = 0;
this.pbuffer = null;
this.zbuffer = null;
this.center = null;
this.width = 1.0;
this.back = -1.0;
this.backClip = 0;
this.front = 1.0;
this.frontClip = 0;
this.frameCount = 0;
this.debug = false;
this.ambient = 0;
this.ambientr = 0;
this.ambientg = 0;
this.ambientb = 0;
this.lightingModel = 0;
this.cartoonNormalCutoff = 0.08;
this.lightMapCalculated = false;
this.colorInitialised = false;
this.lights = null;
this.texture = null;
this.clipping = false;
this.transparency = 0xff;
this.transparent = false;
this.clipTriangle = false;
this.rgb = false;
this.phong = true;
this.frontFaceOnly = true;
this.backlit = false;
this.depthcue = false;
this.analyticalSpheres = false;
this.zmin = 0;
this.zmax = 0;
this.triangleColor = 0;
this.triangleColorR = 0;
this.triangleColorG = 0;
this.triangleColorB = 0;
this.colorTriangle = false;
this.scale = 1.0;
this.zoom = 1.0;
this.clipIncrement = 0.5;
this.background = 0xff000000;
this.rbackground = 0;
this.gbackground = 0;
this.bbackground = 0;
this.gradientTop = 0x000000;
this.gradientBottom = 0x000000;
this.backgroundGradient = false;
this.statusString = null;
this.logo = null;
this.debugColor = null;
this.triangleColors = null;
this.rendererEventListeners = null;
this.antialias = false;
this.wuAntiAlias = false;
this.antialiasModeChanged = false;
this.depthMapInitialised = false;
this.depthScale = null;
this.fogDensity = 0.012;
this.emulate555 = false;
this.imageValidityChecked = false;
this.imageValid = false;
this.DepthCueMin = 50;
this.transparentSphere = -1;
this.sphereOverlaps = null;
this.xt = null;
this.yt = null;
this.zt = null;
this.nxt = null;
this.nyt = null;
this.nzt = null;
this.ut = null;
this.vt = null;
this.clipped = null;
this.overallMatrix = null;
this.rotationMatrix = null;
this.vertexA = null;
this.vertexB = null;
this.vertexC = null;
this.vertexD = null;
this.vA = null;
this.vB = null;
this.vC = null;
this.vD = null;
this.totalSpans = 0;
this.spanLength = 0;
this.spans = null;
this.v0 = 0;
this.v1 = 0;
this.v2 = 0;
this.temp = 0;
this.components = 10;
this.totallyOnScreen = false;
this.renderMode = 0;
this.displayOrder = null;
this.zRange = -1;
this.pixelShade = -1;
this.tuv = null;
this.eye = null;
this.eyedir = null;
this.textureMap = null;
this.triangleRaysCast = 0;
this.triangleRaysIntersected = 0;
this.rp_drgb = null;
this.rp_srgb = null;
this.rp_shadowrgb = null;
this.cylinder = null;
this.cx0 = null;
this.cx1 = null;
this.cx2 = null;
this.nx0 = null;
this.nx1 = null;
this.nx2 = null;
this.ray1 = null;
this.ray2 = null;
this.i1 = null;
this.i2 = null;
this.scx1 = null;
this.scx2 = null;
this.cylPoint = null;
this.cylNormal = null;
this.kU = null;
this.kV = null;
this.kW = null;
this.kD = null;
this.kDiff = null;
this.kP = null;
this.capDir = null;
this.nOrigin = null;
this.cap0 = null;
this.cap1 = null;
this.fTmpStore = null;
this.afT = null;
this.fWLength = 0.0;
this.fDLength = 0.0;
this.fInvDLength = 0.0;
this.capRadius = 0.0;
this.fRadiusSqr = 0.0;
this.sphereColor = null;
this.sphereZ = null;
this.szCache = null;
this.scCache = null;
this.sradius = null;
this.scolor = null;
this.cacheCount = 0;
this.stransx = null;
this.stransy = null;
this.stransz = null;
this.stransxt = null;
this.stransyt = null;
this.stranszt = null;
this.stransr = null;
this.stransrt = null;
this.stransrgb = null;
this.stransp = null;
this.stransid = null;
this.charOffsets = null;
this.fontMin = null;
this.fontMax = null;
this.stringJustification = 9;
this.stringColor = 0;
this.colorDefined = false;
this.stringSize = 0.5;
this.stringRadius = -1.0;
this.string3d = false;
this.tix = null;
this.romanBitmapFont = null;
this.greekBitmapFont = null;
this.pixMin = null;
this.pixMax = null;
this.hersheyScale = -1.0;
this.hersheyRadius = -1.0;
this.fontHeight = 0.0;
this.fontRadius = 0.0;
this.xd = null;
this.yd = null;
this.zd = null;
this.hersheyHash = null;
this.defaultBitmapFontSize = 0;
this.bitmapFonts = null;
this.lineRadius = -1.0;
this.vx1 = null;
this.vx2 = null;
this.gamma_table = null;
this.drawGamma = 2.;
this.then = 0;
this.apbuffer = null;
this.azbuffer = null;
this.opbuffer = null;
this.ozbuffer = null;
this.realw = 0;
this.realh = 0;
this.realPixelCount = 0;
this.mr = null;
this.displayStatusString = true;
this.displaySizeBar = 0;
this.samples = 1;
this.colorMapCacheCount = 0;
this.colorMapCacheMisses = 0;
this.colorMapCache = null;
this.colorMapCacheColor = null;
this.color = 0;
this.firstTime = true;
this.powFactor = 1.0;
this.wrapAngle = -1.0;
this.cosWrapAngle = 0;
this.intensityMap = null;
this.diffuseMap = null;
this.shadowMap = null;
this.highlightMap = null;
this.colorMap = null;
Clazz.instantialize (this, arguments);
}, astex.render, "Renderer");
Clazz.prepareFields (c$, function () {
this.center =  new astex.util.Point3d ();
this.ambient = astex.util.Color32.black;
this.lights =  new astex.util.DynamicArray ().set (8, 0);
this.debugColor = [0xff9999, 0x99ff99, 0x9999ff, 0xffff99, 0xff99ff, 0x99ffff];
this.triangleColors = [astex.util.Color32.white, 0xff9999, 0x99ff99, 0x9999ff, astex.util.Color32.red, astex.util.Color32.green, astex.util.Color32.blue, astex.util.Color32.brown];
this.rendererEventListeners =  new astex.util.DynamicArray ();
this.depthScale =  Clazz.newIntArray (257, 0);
this.sphereOverlaps =  new astex.util.IntArray ();
this.overallMatrix =  new astex.util.Matrix ();
this.rotationMatrix =  new astex.util.Matrix ();
this.vertexA =  new astex.render.Vertex ();
this.vertexB =  new astex.render.Vertex ();
this.vertexC =  new astex.render.Vertex ();
this.vertexD =  new astex.render.Vertex ();
this.spans =  Clazz.newIntArray (100, 0);
this.tuv =  Clazz.newDoubleArray (3, 0);
this.eye =  Clazz.newDoubleArray (3, 0);
this.eyedir =  Clazz.newDoubleArray (3, 0);
this.rp_drgb =  Clazz.newIntArray (3, 0);
this.rp_srgb =  Clazz.newIntArray (3, 0);
this.rp_shadowrgb =  Clazz.newIntArray (3, 0);
this.cylinder =  new astex.render.Tmesh ();
this.cx0 =  Clazz.newDoubleArray (3, 0);
this.cx1 =  Clazz.newDoubleArray (3, 0);
this.cx2 =  Clazz.newDoubleArray (3, 0);
this.nx0 =  Clazz.newDoubleArray (3, 0);
this.nx1 =  Clazz.newDoubleArray (3, 0);
this.nx2 =  Clazz.newDoubleArray (3, 0);
this.ray1 =  Clazz.newDoubleArray (3, 0);
this.ray2 =  Clazz.newDoubleArray (3, 0);
this.i1 =  Clazz.newDoubleArray (3, 0);
this.i2 =  Clazz.newDoubleArray (3, 0);
this.scx1 =  Clazz.newIntArray (3, 0);
this.scx2 =  Clazz.newIntArray (3, 0);
this.cylPoint =  Clazz.newDoubleArray (3, 0);
this.cylNormal =  Clazz.newDoubleArray (3, 0);
this.kU =  Clazz.newDoubleArray (3, 0);
this.kV =  Clazz.newDoubleArray (3, 0);
this.kW =  Clazz.newDoubleArray (3, 0);
this.kD =  Clazz.newDoubleArray (3, 0);
this.kDiff =  Clazz.newDoubleArray (3, 0);
this.kP =  Clazz.newDoubleArray (3, 0);
this.capDir =  Clazz.newDoubleArray (3, 0);
this.nOrigin =  Clazz.newDoubleArray (3, 0);
this.cap0 =  Clazz.newDoubleArray (3, 0);
this.cap1 =  Clazz.newDoubleArray (3, 0);
this.fTmpStore =  Clazz.newDoubleArray (2, 0);
this.afT =  Clazz.newDoubleArray (3, 0);
this.szCache = JU.AU.newInt2 (32);
this.scCache = JU.AU.newInt2 (32);
this.sradius =  Clazz.newIntArray (32, 0);
this.scolor =  Clazz.newIntArray (32, 0);
this.stransx =  new astex.util.DoubleArray ();
this.stransy =  new astex.util.DoubleArray ();
this.stransz =  new astex.util.DoubleArray ();
this.stransxt =  new astex.util.DoubleArray ();
this.stransyt =  new astex.util.DoubleArray ();
this.stranszt =  new astex.util.DoubleArray ();
this.stransr =  new astex.util.DoubleArray ();
this.stransrt =  new astex.util.DoubleArray ();
this.stransrgb =  new astex.util.IntArray ();
this.stransp =  new astex.util.IntArray ();
this.stransid =  new astex.util.IntArray ();
this.charOffsets =  Clazz.newDoubleArray (3, 0);
this.fontMin =  Clazz.newDoubleArray (3, 0);
this.fontMax =  Clazz.newDoubleArray (3, 0);
this.stringColor = astex.util.Color32.white;
this.tix =  Clazz.newDoubleArray (3, 0);
this.pixMin =  Clazz.newIntArray (3, 0);
this.pixMax =  Clazz.newIntArray (3, 0);
this.xd =  new astex.util.Point3d ();
this.yd =  new astex.util.Point3d ();
this.zd =  new astex.util.Point3d ();
this.hersheyHash =  new java.util.Hashtable ();
this.defaultBitmapFontSize = astex.util.Settings.getInteger ("fonts", "defaultbitmapfontsize");
this.bitmapFonts =  new java.util.Hashtable ();
this.vx1 =  Clazz.newDoubleArray (3, 0);
this.vx2 =  Clazz.newDoubleArray (3, 0);
this.colorMapCache = JU.AU.newInt2 (astex.render.Renderer.colorMapCacheSize);
this.colorMapCacheColor =  Clazz.newIntArray (astex.render.Renderer.colorMapCacheSize, 0);
this.cosWrapAngle = Math.cos (this.wrapAngle);
this.intensityMap =  Clazz.newIntArray (65536, 0);
this.diffuseMap =  Clazz.newIntArray (65536, 0);
this.shadowMap =  Clazz.newIntArray (65536, 0);
this.highlightMap =  Clazz.newIntArray (65536, 0);
});
Clazz.defineMethod (c$, "getAntiAlias", 
function () {
return this.antialias;
});
Clazz.defineMethod (c$, "setAntiAlias", 
function (b) {
if (this.antialias != b) {
this.antialias = b;
this.antialiasModeChanged = true;
if (this.antialias) {
this.setSamples (2);
} else {
this.setSamples (1);
}}}, "~B");
Clazz.defineMethod (c$, "setLightingModel", 
function (lm) {
this.lightingModel = lm;
this.calculateLightMap ();
}, "~N");
Clazz.defineMethod (c$, "getLightingModel", 
function () {
return this.lightingModel;
});
Clazz.defineMethod (c$, "setCartoonNormalCutoff", 
function (c) {
this.cartoonNormalCutoff = c;
this.calculateLightMap ();
}, "~N");
Clazz.defineMethod (c$, "getCartoonNormalCutoff", 
function () {
return this.cartoonNormalCutoff;
});
Clazz.defineMethod (c$, "setBackgroundColor", 
function (c) {
this.background = c;
}, "~N");
Clazz.defineMethod (c$, "getBackgroundColor", 
function () {
return this.background;
});
Clazz.defineMethod (c$, "setBackgroundTransparency", 
function (c) {
if (c < 0 || c > 255) {
System.out.println ("Illegal value for background transparency ignored: " + c);
return;
}this.background &= 0x00ffffff;
this.background |= c << 24;
if (c != 255) this.renderMode |= 1;
}, "~N");
Clazz.defineMethod (c$, "getBackgroundTransparency", 
function () {
return this.background >> 24;
});
Clazz.defineMethod (c$, "setGradient", 
function (b) {
this.backgroundGradient = b;
}, "~B");
Clazz.defineMethod (c$, "setGradientTop", 
function (c) {
this.gradientTop = c;
}, "~N");
Clazz.defineMethod (c$, "setGradientBottom", 
function (c) {
this.gradientBottom = c;
}, "~N");
Clazz.defineMethod (c$, "setScale", 
function (s) {
this.scale = s;
}, "~N");
Clazz.defineMethod (c$, "getScale", 
function () {
return this.scale;
});
Clazz.defineMethod (c$, "setZoom", 
function (s) {
this.zoom = s;
}, "~N");
Clazz.defineMethod (c$, "getZoom", 
function () {
return this.zoom;
});
Clazz.defineMethod (c$, "applyZoom", 
function (factor) {
this.zoom *= (1. + factor);
if (this.zoom < 0.001) {
this.zoom = 0.001;
}}, "~N");
Clazz.defineMethod (c$, "setRadius", 
function (d) {
this.width = d;
}, "~N");
Clazz.defineMethod (c$, "getRadius", 
function () {
return this.width;
});
Clazz.defineMethod (c$, "setFrontClip", 
function (v) {
this.setFrontClipFE (v, true);
}, "~N");
Clazz.defineMethod (c$, "getFrontClip", 
function () {
return this.front;
});
Clazz.defineMethod (c$, "setFrontClipFE", 
function (v, fireEvent) {
if (v > 1023) {
System.out.println ("Front clip reduced to 1023 higher values tend to cause memory exceptions");
v = 1023;
}this.front = v;
if (this.front < this.clipIncrement) {
this.front = this.clipIncrement;
}if (fireEvent) {
var re =  new astex.render.RendererEvent (3,  new Double (this.front));
this.fireRendererEvent (re);
}}, "~N,~B");
Clazz.defineMethod (c$, "setBackClip", 
function (v) {
this.setBackClipFire (v, true);
}, "~N");
Clazz.defineMethod (c$, "getBackClip", 
function () {
return this.back;
});
Clazz.defineMethod (c$, "setBackClipFire", 
function (v, fireEvent) {
if (v < -1023) {
System.out.println ("Back clip reduced to -1023 higher values tend to cause memory exceptions");
v = -1023;
}this.back = v;
if (-this.back < this.clipIncrement) {
this.back = -this.clipIncrement;
}if (fireEvent) {
var re =  new astex.render.RendererEvent (4,  new Double (this.back));
this.fireRendererEvent (re);
}}, "~N,~B");
Clazz.defineMethod (c$, "setClips", 
function (f, b) {
this.setFrontClip (f);
this.setBackClip (b);
}, "~N,~N");
Clazz.defineMethod (c$, "setClip", 
function (d) {
if (d < this.clipIncrement) {
d = this.clipIncrement;
}this.setFrontClip (d);
this.setBackClip (-d);
}, "~N");
Clazz.defineMethod (c$, "getClip", 
function () {
return this.front;
});
Clazz.defineMethod (c$, "setClipIncrement", 
function (inc) {
this.clipIncrement = inc;
}, "~N");
Clazz.defineMethod (c$, "incrementClip", 
function () {
this.setFrontClip (this.front + this.clipIncrement);
this.setBackClip (this.back - this.clipIncrement);
});
Clazz.defineMethod (c$, "decrementClip", 
function () {
this.setFrontClip (this.front - this.clipIncrement);
this.setBackClip (this.back + this.clipIncrement);
});
Clazz.defineMethod (c$, "incrementFrontClip", 
function () {
this.setFrontClip (this.front + this.clipIncrement);
});
Clazz.defineMethod (c$, "decrementFrontClip", 
function () {
this.setFrontClip (this.front - this.clipIncrement);
});
Clazz.defineMethod (c$, "incrementLargeClip", 
function () {
this.setFrontClip (this.front + 20 * this.clipIncrement);
this.setBackClip (this.back - 20 * this.clipIncrement);
});
Clazz.defineMethod (c$, "decrementLargeClip", 
function () {
this.setFrontClip (this.front - 20 * this.clipIncrement);
this.setBackClip (this.back + 20 * this.clipIncrement);
});
Clazz.defineMethod (c$, "getCenter", 
function () {
return astex.util.Point3d.newP (this.center);
});
Clazz.defineMethod (c$, "setCenter", 
function (p) {
this.center.x = p.x;
this.center.y = p.y;
this.center.z = p.z;
}, "astex.util.Point3d");
Clazz.defineMethod (c$, "resetCenterAndRadius", 
function () {
this.center.x = this.center.y = this.center.z = 0.0;
this.width = 0.0;
});
Clazz.defineMethod (c$, "setDrawLogo", 
function (b) {
this.drawImageLogo = b;
}, "~B");
Clazz.defineMethod (c$, "setDrawLogoPdbe", 
function (b) {
this.drawImageLogoPdbe = b;
}, "~B");
Clazz.makeConstructor (c$, 
function (mr) {
this.mr = mr;
for (var i = 0; i < 100; i++) {
var light = "light" + i;
if (astex.util.Settings.get ("config", light + ".on") == null) {
break;
}var onoff = astex.util.Settings.getBoolean ("config", light + ".on");
var x = astex.util.Settings.getDouble ("config", light + ".x");
var y = astex.util.Settings.getDouble ("config", light + ".y");
var z = astex.util.Settings.getDouble ("config", light + ".z");
var diffuser = astex.util.Settings.getInteger ("config", light + ".diffuse.r");
var diffuseg = astex.util.Settings.getInteger ("config", light + ".diffuse.g");
var diffuseb = astex.util.Settings.getInteger ("config", light + ".diffuse.b");
var highlightr = astex.util.Settings.getInteger ("config", light + ".highlight.r");
var highlightg = astex.util.Settings.getInteger ("config", light + ".highlight.g");
var highlightb = astex.util.Settings.getInteger ("config", light + ".highlight.b");
var power = astex.util.Settings.getDouble ("config", light + ".phongpower");
var diffuse = astex.util.Color32.pack (diffuser, diffuseg, diffuseb);
var highlight = astex.util.Color32.pack (highlightr, highlightg, highlightb);
this.addLight (onoff, x, y, z, diffuse, highlight, power);
}
var ar = astex.util.Settings.getInteger ("config", "ambient.r", 32);
var ag = astex.util.Settings.getInteger ("config", "ambient.g", 32);
var ab = astex.util.Settings.getInteger ("config", "ambient.b", 32);
this.hersheyScale = astex.util.Settings.getDouble ("fonts", "hershey.scale", 0.04);
this.hersheyRadius = astex.util.Settings.getDouble ("fonts", "hershey.radius", 0.04);
this.setAmbient (astex.util.Color32.pack (ar, ag, ab));
this.lineRadius = astex.util.Settings.getDouble ("config", "maplineradius", 0.02);
this.drawImageLogo = astex.util.Settings.getBoolean ("config", "draw.logo", true);
this.drawImageLogoPdbe = astex.util.Settings.getBoolean ("config", "draw.logoPdbe", false);
}, "astex.render.MoleculeRenderer");
Clazz.defineMethod (c$, "setAmbient", 
function (rgb) {
this.ambient = rgb;
this.ambientr = astex.util.Color32.getRed (rgb);
this.ambientg = astex.util.Color32.getGreen (rgb);
this.ambientb = astex.util.Color32.getBlue (rgb);
this.calculateLightMap ();
}, "~N");
Clazz.defineMethod (c$, "getAmbient", 
function () {
return this.ambient;
});
Clazz.defineMethod (c$, "addLight", 
function (onOff, x, y, z, diffuseColor, specularColor, power) {
var l =  new astex.util.Light (onOff, x, y, z, diffuseColor, specularColor, power);
this.lights.add (l);
}, "~B,~N,~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "addRendererEventListener", 
function (rel) {
if (this.rendererEventListeners == null) {
this.rendererEventListeners =  new astex.util.DynamicArray ();
}this.rendererEventListeners.add (rel);
}, "astex.render.RendererEventListener");
Clazz.defineMethod (c$, "removeRendererEventListener", 
function (rel) {
if (this.rendererEventListeners != null) {
this.rendererEventListeners.remove (rel);
}}, "astex.render.RendererEventListener");
Clazz.defineMethod (c$, "fireRendererEvent", 
function (re) {
if (this.rendererEventListeners != null) {
var listenerCount = this.rendererEventListeners.size ();
for (var i = 0; i < listenerCount; i++) {
var rel = this.rendererEventListeners.get (i);
rel.handleRendererEvent (re);
}
}}, "astex.render.RendererEvent");
Clazz.defineMethod (c$, "clearBuffers", 
 function () {
var i;
var zb = this.zbuffer;
var pb = this.pbuffer;
var pc = this.pixelCount;
var zbmin = -2147483648;
this.backClip = Clazz.doubleToInt (this.back * 1048576.0);
this.frontClip = Clazz.doubleToInt (this.front * 1048576.0);
zbmin = this.backClip;
this.rbackground = astex.util.Color32.getRed (this.background);
this.gbackground = astex.util.Color32.getGreen (this.background);
this.bbackground = astex.util.Color32.getBlue (this.background);
for (i = pc; --i >= 0; ) {
zb[i] = zbmin;
}
if (this.backgroundGradient) {
var index = 0;
var rt = astex.util.Color32.getRed (this.gradientTop);
var gt = astex.util.Color32.getGreen (this.gradientTop);
var bt = astex.util.Color32.getBlue (this.gradientTop);
var rb = astex.util.Color32.getRed (this.gradientBottom);
var gb = astex.util.Color32.getGreen (this.gradientBottom);
var bb = astex.util.Color32.getBlue (this.gradientBottom);
for (i = 0; i < this.pixelHeight; i++) {
var rowcol = 0;
var frac = i / (this.pixelHeight - 1);
var rrow = rt + Clazz.doubleToInt (frac * (rb - rt));
var grow = gt + Clazz.doubleToInt (frac * (gb - gt));
var brow = bt + Clazz.doubleToInt (frac * (bb - bt));
rowcol = (rrow << 16) | (grow << 8) | brow;
for (var j = 0; j < this.pixelWidth; j++) {
pb[index++] = rowcol;
}
}
} else {
for (i = pc; --i >= 0; ) {
pb[i] = this.background;
}
}if (!this.depthMapInitialised) {
this.initialiseDepthMap ();
}this.stransx.removeAllElements ();
this.stransy.removeAllElements ();
this.stransz.removeAllElements ();
this.stransr.removeAllElements ();
this.stransxt.removeAllElements ();
this.stransyt.removeAllElements ();
this.stranszt.removeAllElements ();
this.stransrt.removeAllElements ();
this.stransrgb.removeAllElements ();
this.stransp.removeAllElements ();
this.stransid.removeAllElements ();
});
Clazz.defineMethod (c$, "initialiseDepthMap", 
 function () {
for (var i = 0; i < 257; i++) {
if (i == 256) {
this.depthScale[i] = 255;
} else {
this.depthScale[i] = 255 - Clazz.doubleToInt (255 * (Math.pow (2.718281828459045, this.fogDensity * (255 - i)) - 1) / (Math.pow (2.718281828459045, this.fogDensity * 255) - 1));
}}
this.depthMapInitialised = true;
});
Clazz.defineMethod (c$, "postProcess", 
function () {
this.drawObjectsIgnoreTransparency (4);
if (this.depthcue) {
var zb = this.zbuffer;
var pb = this.pbuffer;
this.zmax = this.frontClip;
this.zmin = this.backClip;
if (this.frontClip < this.zmax) {
this.zmax = this.frontClip;
}if (this.backClip > this.zmin) {
this.zmin = this.backClip;
}var range = this.zmax - this.zmin;
var shade;
range = range >> 8;
if (this.background == astex.util.Color32.white) {
for (var i = 0; i < this.pixelCount; i++) {
if (zb[i] != this.zmin) {
var scale = Clazz.doubleToInt ((zb[i] - this.zmin) / range);
shade = this.depthScale[scale];
var whiteComponent = astex.util.Color32.scale (0xcccccc, 255 - shade);
var pixelComponent = astex.util.Color32.scale (pb[i], shade);
pb[i] = astex.util.Color32.add (whiteComponent, pixelComponent);
}}
} else {
for (var i = 0; i < this.pixelCount; i++) {
if (zb[i] != this.zmin) {
var scale = Clazz.doubleToInt ((zb[i] - this.zmin) / range);
shade = this.depthScale[scale];
pb[i] = astex.util.Color32.scale (pb[i], shade);
}}
}}this.drawLogo ();
this.drawStatusString ();
this.drawSizeBar ();
if (this.antialias) {
var pcount = 0;
var index = 0;
var pb = this.pbuffer;
for (var j = 0; j < this.pixelHeight; j += 2) {
for (var i = 0; i < this.pixelWidth; i += 2) {
var r = 0;
var g = 0;
var b = 0;
var p0 = pb[index];
var p1 = pb[index + 1];
var p2 = pb[index + this.pixelWidth];
var p3 = pb[index + this.pixelWidth + 1];
if (p0 == this.background && p1 == this.background && p2 == this.background && p3 == this.background) {
this.opbuffer[pcount++] = this.background;
} else {
r = (p0 & 0xff0000);
g = (p0 & 0xff00);
b = (p0 & 0xff);
r += (p1 & 0xff0000);
g += (p1 & 0xff00);
b += (p1 & 0xff);
r += (p2 & 0xff0000);
g += (p2 & 0xff00);
b += (p2 & 0xff);
r += (p3 & 0xff0000);
g += (p3 & 0xff00);
b += (p3 & 0xff);
r >>= 2;
g >>= 2;
b >>= 2;
this.opbuffer[pcount++] = ((r) & 0xff0000) | ((g) & 0xff00) | (b);
}index += 2;
}
index += this.pixelWidth;
}
}this.drawObjectsIgnoreTransparency (8);
if (this.drawImageLogo) {
var aL =  new astex.render.AstexLogo ();
var hs = this.antialias ? Clazz.doubleToInt (this.pixelHeight / this.getSamples ()) : this.pixelHeight;
var ws = this.antialias ? Clazz.doubleToInt (this.pixelWidth / this.getSamples ()) : this.pixelWidth;
this.drawImage (aL, ws - aL.width, hs - aL.height);
}if (this.drawImageLogoPdbe) {
var aL = astex.api.Interface.getInterface ("astex.render.PdbeLogo");
this.drawImage (aL, 10, 10);
}});
Clazz.defineMethod (c$, "drawImage", 
 function (logo, posX, posY) {
var width = logo.width;
var height = logo.height;
var ws = this.antialias ? Clazz.doubleToInt (this.pixelWidth / this.getSamples ()) : this.pixelWidth;
for (var y = 0; y < height; y++) {
var yp = y + posY - 1;
for (var x = 0; x < width; x++) {
var xp = x + posX;
var imageIndex = x + y * width;
var p = logo.pixels[imageIndex];
var rgb = (p & 0xffffff);
if (rgb != 0) {
var interp = ((p >> 24) & 0xff);
if (interp != 0) {
if (this.antialias) {
var bg = this.opbuffer[xp + yp * ws];
var newp = astex.util.Color32.blendI (rgb, bg, interp);
this.opbuffer[xp + yp * ws] = newp;
} else {
var bg = this.pbuffer[xp + yp * ws];
var newp = astex.util.Color32.blendI (rgb, bg, interp);
this.setPixel3 (xp, yp, newp);
}}}}
}
}, "astex.render.AstexLogo,~N,~N");
Clazz.defineMethod (c$, "depthCueColor", 
 function (c, z) {
var intensity = 0;
if (z > this.frontClip) {
intensity = 255;
} else if (z < this.backClip) {
intensity = this.DepthCueMin;
} else {
var scale = (z - this.backClip) / (this.frontClip - this.backClip);
intensity = Clazz.doubleToInt (this.DepthCueMin + (255 - this.DepthCueMin) * scale);
}if (this.background == astex.util.Color32.black) {
return astex.util.Color32.scale (c, intensity);
}return astex.util.Color32.blendI (c, this.background, intensity);
}, "~N,~N");
Clazz.defineMethod (c$, "depthCueShadedColor", 
 function (c, z) {
if (!this.depthMapInitialised) {
this.initialiseDepthMap ();
}var zslot = Clazz.doubleToInt (255.0 * (z - this.backClip) / (this.frontClip - this.backClip));
if (zslot < 0) {
zslot = 0;
} else if (zslot > 255) {
zslot = 255;
}var ds = this.depthScale[zslot];
if (this.background == astex.util.Color32.black) {
return astex.util.Color32.scale (c, ds);
}return astex.util.Color32.blendI (c, this.background, ds);
}, "~N,~N");
Clazz.defineMethod (c$, "drawObjects", 
function () {
for (var i = 0; i < this.mr.objects.size (); i++) {
var tm = this.mr.objects.get (i);
if (tm.getRenderPass () == 2) {
if (tm.isVisible () && tm.transparency == 255) {
this.renderObject (tm);
}}}
for (var i = 0; i < this.mr.objects.size (); i++) {
var tm = this.mr.objects.get (i);
if (tm.getRenderPass () == 2) {
if (tm.isVisible () && tm.transparency != 255) {
this.renderObject (tm);
}}}
this.renderTransparentSpheres ();
});
Clazz.defineMethod (c$, "drawObjectsIgnoreTransparency", 
 function (pass) {
for (var i = 0; i < this.mr.objects.size (); i++) {
var tm = this.mr.objects.get (i);
if (tm.getRenderPass () == pass) {
if (tm.isVisible ()) {
this.renderObject (tm);
}}}
}, "~N");
Clazz.defineMethod (c$, "renderTransparentSpheres", 
 function () {
var sphereCount = this.stransx.size ();
var stx = this.stransx.getArray ();
var sty = this.stransy.getArray ();
var stz = this.stransz.getArray ();
var str = this.stransr.getArray ();
if (sphereCount > 0) {
var sz = this.stranszt.getArray ();
var ids = this.stransid.getArray ();
this.indexSort (sz, ids, 0, sphereCount - 1);
for (var pass = 0; pass < 2; pass++) {
for (var id = sphereCount - 1; id >= 0; id--) {
var i = ids[id];
if (pass == 0 && this.stransp.get (i) > 200 || pass == 1 && this.stransp.get (i) <= 200) {
this.sphereOverlaps.removeAllElements ();
for (var j = 0; j < sphereCount; j++) {
if (i != j) {
var dx = stx[i] - stx[j];
var dy = sty[i] - sty[j];
var dz = stz[i] - stz[j];
var rr = str[i] + str[j];
if (dx * dx + dy * dy + dz * dz < rr * rr) {
this.sphereOverlaps.add (j);
}}}
this.actuallyDrawSphere (stx[i], sty[i], stz[i], str[i], this.stransrgb.get (i), this.stransp.get (i));
}}
}
}});
Clazz.defineMethod (c$, "indexSort", 
 function (sort, index, L, R) {
var m = (sort[index[L]] + sort[index[R]]) / 2;
var i = L;
var j = R;
var temp;
do {
while (sort[index[i]] < m) i++;

while (sort[index[j]] > m) j--;

if (i <= j) {
temp = index[i];
index[i] = index[j];
index[j] = temp;
i++;
j--;
}} while (j >= i);
if (L < j) this.indexSort (sort, index, L, j);
if (R > i) this.indexSort (sort, index, i, R);
}, "~A,~A,~N,~N");
Clazz.defineMethod (c$, "ensureTransformCapacity", 
 function (n) {
if (this.xt == null || this.xt.length < n) {
this.xt =  Clazz.newIntArray (n, 0);
this.yt =  Clazz.newIntArray (n, 0);
this.zt =  Clazz.newIntArray (n, 0);
this.nxt =  Clazz.newIntArray (n, 0);
this.nyt =  Clazz.newIntArray (n, 0);
this.nzt =  Clazz.newIntArray (n, 0);
this.ut =  Clazz.newIntArray (n, 0);
this.vt =  Clazz.newIntArray (n, 0);
this.clipped =  Clazz.newCharArray (n, '\0');
}}, "~N");
Clazz.defineMethod (c$, "getOverallScale", 
function () {
return this.zoom * this.pixelWidth / (this.width * 2.0);
});
Clazz.defineMethod (c$, "buildOverallMatrix", 
function () {
this.overallMatrix.setIdentity ();
if (this.center != null) {
this.overallMatrix.translate (-this.center.x, -this.center.y, -this.center.z);
}this.overallMatrix.transform (this.rotationMatrix);
var overallScale = this.getOverallScale ();
this.overallMatrix.scale (overallScale, -overallScale, 1.0);
this.overallMatrix.translate (Clazz.doubleToInt (this.pixelWidth / 2), Clazz.doubleToInt (this.pixelHeight / 2), 0.0);
});
Clazz.defineMethod (c$, "rotateX", 
function (degrees) {
this.rotationMatrix.rotateXdegrees (degrees);
}, "~N");
Clazz.defineMethod (c$, "rotateY", 
function (degrees) {
this.rotationMatrix.rotateYdegrees (degrees);
}, "~N");
Clazz.defineMethod (c$, "rotateZ", 
function (degrees) {
this.rotationMatrix.rotateZdegrees (degrees);
}, "~N");
Clazz.defineMethod (c$, "applyTransform2", 
function (x, y, z, s) {
var m = this.overallMatrix;
var mx00 = m.x00;
var mx01 = m.x01;
var mx02 = m.x02;
var mx10 = m.x10;
var mx11 = m.x11;
var mx12 = m.x12;
var mx20 = m.x20;
var mx21 = m.x21;
var mx22 = m.x22;
var mx30 = m.x30;
var mx31 = m.x31;
var mx32 = m.x32;
var xx = x * mx00 + y * mx10 + z * mx20 + mx30 + 0.5;
var yy = x * mx01 + y * mx11 + z * mx21 + mx31 + 0.5;
var zz = x * mx02 + y * mx12 + z * mx22 + mx32;
s[0] = Clazz.doubleToInt (xx);
s[1] = Clazz.doubleToInt (yy);
s[2] = Clazz.doubleToInt (zz);
}, "~N,~N,~N,~A");
Clazz.defineMethod (c$, "applyTransform", 
function (x, y, z, s) {
var m = this.overallMatrix;
var mx00 = m.x00;
var mx01 = m.x01;
var mx02 = m.x02;
var mx10 = m.x10;
var mx11 = m.x11;
var mx12 = m.x12;
var mx20 = m.x20;
var mx21 = m.x21;
var mx22 = m.x22;
var mx30 = m.x30;
var mx31 = m.x31;
var mx32 = m.x32;
var xx = x * mx00 + y * mx10 + z * mx20 + mx30 + 0.5;
var yy = x * mx01 + y * mx11 + z * mx21 + mx31 + 0.5;
var zz = x * mx02 + y * mx12 + z * mx22 + mx32;
s[0] = xx;
s[1] = yy;
s[2] = zz;
}, "~N,~N,~N,~A");
Clazz.defineMethod (c$, "transformNormal", 
function (x, y, z, s) {
var m = this.rotationMatrix;
var mx00 = m.x00;
var mx01 = m.x01;
var mx02 = m.x02;
var mx10 = m.x10;
var mx11 = m.x11;
var mx12 = m.x12;
var mx20 = m.x20;
var mx21 = m.x21;
var mx22 = m.x22;
var mx30 = m.x30;
var mx31 = m.x31;
var mx32 = m.x32;
var xx = x * mx00 + y * mx10 + z * mx20;
var yy = x * mx01 + y * mx11 + z * mx21;
var zz = x * mx02 + y * mx12 + z * mx22;
s[0] = xx;
s[1] = -yy;
s[2] = zz;
}, "~N,~N,~N,~A");
Clazz.defineMethod (c$, "transformObject", 
 function (tmesh) {
var np = tmesh.np;
var xlocal = tmesh.x;
var ylocal = tmesh.y;
var zlocal = tmesh.z;
var nxlocal = tmesh.nx;
var nylocal = tmesh.ny;
var nzlocal = tmesh.nz;
var ulocal = tmesh.u;
var vlocal = tmesh.v;
var m = this.overallMatrix;
var mx00 = m.x00;
var mx01 = m.x01;
var mx02 = m.x02;
var mx10 = m.x10;
var mx11 = m.x11;
var mx12 = m.x12;
var mx20 = m.x20;
var mx21 = m.x21;
var mx22 = m.x22;
var mx30 = m.x30;
var mx31 = m.x31;
var mx32 = m.x32;
var r = this.rotationMatrix;
var rx00 = r.x00;
var rx01 = r.x01;
var rx02 = r.x02;
var rx10 = r.x10;
var rx11 = r.x11;
var rx12 = r.x12;
var rx20 = r.x20;
var rx21 = r.x21;
var rx22 = r.x22;
var rx30 = r.x30;
var rx31 = r.x31;
var rx32 = r.x32;
var x;
var y;
var z;
var xx;
var yy;
var zz;
var transformNormals = false;
var fnb = 524288.0;
var i;
this.ensureTransformCapacity (np);
if (tmesh.style == 3) {
transformNormals = true;
}for (i = 0; i < np; i++) {
x = xlocal[i] * tmesh.matrix[0] + ylocal[i] * tmesh.matrix[3] + zlocal[i] * tmesh.matrix[6] + tmesh.matrix[9];
y = xlocal[i] * tmesh.matrix[1] + ylocal[i] * tmesh.matrix[4] + zlocal[i] * tmesh.matrix[7] + tmesh.matrix[10];
z = xlocal[i] * tmesh.matrix[2] + ylocal[i] * tmesh.matrix[5] + zlocal[i] * tmesh.matrix[8] + tmesh.matrix[11];
xx = x * mx00 + y * mx10 + z * mx20 + mx30 + 0.5;
yy = x * mx01 + y * mx11 + z * mx21 + mx31 + 0.5;
zz = x * mx02 + y * mx12 + z * mx22 + mx32;
this.clipped[i] = String.fromCharCode ( 0);
this.xt[i] = Clazz.doubleToInt (xx);
this.yt[i] = Clazz.doubleToInt (yy);
if (this.xt[i] < 0) this.clipped[i] = String.fromCharCode ((this.clipped[i]).charCodeAt (0) | astex.render.Renderer.XMinClip);
 else if (this.xt[i] >= this.pixelWidth) this.clipped[i] = String.fromCharCode ((this.clipped[i]).charCodeAt (0) | astex.render.Renderer.XMaxClip);
if (this.yt[i] < 0) this.clipped[i] = String.fromCharCode ((this.clipped[i]).charCodeAt (0) | astex.render.Renderer.YMinClip);
 else if (this.yt[i] >= this.pixelHeight) this.clipped[i] = String.fromCharCode ((this.clipped[i]).charCodeAt (0) | astex.render.Renderer.YMaxClip);
this.xt[i] <<= 12;
this.yt[i] <<= 12;
this.zt[i] = Clazz.doubleToInt (zz * 1048576.0);
if (this.debug) {
this.drawStringZoff (xlocal[i], ylocal[i], zlocal[i], 0.1, astex.util.Color32.white, "" + i);
}if (this.zt[i] < this.zmin) {
this.zmin = this.zt[i];
}if (this.zt[i] > this.zmax) {
this.zmax = this.zt[i];
}if (this.zt[i] < this.backClip) {
this.clipped[i] = String.fromCharCode ((this.clipped[i]).charCodeAt (0) | astex.render.Renderer.ZMinClip);
} else if (this.zt[i] > this.frontClip) {
this.clipped[i] = String.fromCharCode ((this.clipped[i]).charCodeAt (0) | astex.render.Renderer.ZMaxClip);
}if (transformNormals && nxlocal != null) {
x = nxlocal[i];
y = nylocal[i];
z = nzlocal[i];
xx = x * rx00 + y * rx10 + z * rx20;
yy = x * rx01 + y * rx11 + z * rx21;
zz = x * rx02 + y * rx12 + z * rx22;
xx = (xx * 128) + 128;
if (xx < 0) {
xx = 0;
} else if (xx > 255) {
xx = 255;
}yy = (yy * 128) + 128;
if (yy < 0) {
yy = 0;
} else if (yy > 255) {
yy = 255;
}this.nxt[i] = Clazz.doubleToInt (xx * 4096.0);
this.nyt[i] = Clazz.doubleToInt (yy * 4096.0);
this.nzt[i] = Clazz.doubleToInt (zz * 4096.0);
if (this.frontFaceOnly) {
if (this.nzt[i] < 0.0) {
this.clipped[i] = String.fromCharCode ((this.clipped[i]).charCodeAt (0) | astex.render.Renderer.NormalClip);
}}}}
if (this.texture != null && ulocal != null) {
var uscale = tmesh.getUScale ();
var vscale = tmesh.getVScale ();
var uoffset = tmesh.getUOffset ();
var voffset = tmesh.getVOffset ();
for (i = 0; i < np; i++) {
var utmp = (uscale * (ulocal[i] - uoffset)) * 255;
var vtmp = (vscale * (vlocal[i] - voffset)) * 255;
if (Clazz.doubleToInt (vtmp) < 0) this.clipped[i] = String.fromCharCode ((this.clipped[i]).charCodeAt (0) | astex.render.Renderer.VMinClip);
if (Clazz.doubleToInt (vtmp) >= 255) this.clipped[i] = String.fromCharCode ((this.clipped[i]).charCodeAt (0) | astex.render.Renderer.VMaxClip);
this.ut[i] = Clazz.doubleToInt (utmp * 4096.0);
this.vt[i] = Clazz.doubleToInt (vtmp * 4096.0);
}
}}, "astex.render.Tmesh");
Clazz.defineMethod (c$, "renderObject", 
 function (tmesh) {
if (Clazz.instanceOf (tmesh, astex.map.GraphicalObject)) {
tmesh.render ();
} else {
this.renderTmeshObject (tmesh);
}}, "astex.render.Tmesh");
Clazz.defineMethod (c$, "renderTmeshObject", 
 function (tmesh) {
if (tmesh.transparency == 0) {
return;
}this.renderMode = 0;
this.transparency = tmesh.transparency;
this.transparent = (this.transparency != 0xff);
if (this.transparency != 0xff) {
this.renderMode |= 1;
}this.texture = tmesh.texture;
if (this.texture != null) {
this.renderMode |= 2;
}this.frontFaceOnly = !tmesh.backface;
if (tmesh.colorStyle == 3) {
this.renderMode |= 8;
} else if (tmesh.colorStyle == 1) {
this.setColor (tmesh.color);
} else if ((this.renderMode & 2) == 0) {
this.renderMode |= 4;
}if (this.texture != null) {
this.phong = false;
} else {
this.phong = true;
}this.transformObject (tmesh);
if (tmesh.style == 5) {
this.renderSphereObject (tmesh);
} else if (tmesh.style == 2) {
this.drawLineObject (tmesh);
} else if (tmesh.style == 3) {
this.renderTriangleObject (tmesh);
} else if (tmesh.style == 1) {
this.renderDotObject (tmesh);
}if (tmesh.spheres != null) {
this.renderSphereObject (tmesh.spheres);
}if (tmesh.cylinders != null) {
this.renderCylinderObject (tmesh.cylinders);
}}, "astex.render.Tmesh");
Clazz.defineMethod (c$, "depthSortTriangles", 
 function (tm) {
var tri = this.displayOrder;
if (tm.nt == 0) return;
this.depthSort (tri, tm, 0, tm.nt - 1);
}, "astex.render.Tmesh");
Clazz.defineMethod (c$, "triangleDepth", 
 function (tm, t) {
var v0 = tm.t0[t];
var v1 = tm.t1[t];
var v2 = tm.t2[t];
return (this.zt[v0] + this.zt[v1] + this.zt[v2]);
}, "astex.render.Tmesh,~N");
Clazz.defineMethod (c$, "depthSort", 
 function (tri, tm, L, R) {
var m = Clazz.doubleToInt ((this.triangleDepth (tm, tri[L]) + this.triangleDepth (tm, tri[R])) / 2);
var i = L;
var j = R;
var temp;
while (i <= j) {
while (this.triangleDepth (tm, tri[i]) < m) i++;

while (this.triangleDepth (tm, tri[j]) > m) j--;

if (i <= j) {
temp = tri[i];
tri[i] = tri[j];
tri[j] = temp;
i++;
j--;
}}
if (L < j) this.depthSort (tri, tm, L, j);
if (i < R) this.depthSort (tri, tm, i, R);
}, "~A,astex.render.Tmesh,~N,~N");
Clazz.defineMethod (c$, "ensureDisplayList", 
 function (tmesh) {
var len = tmesh.nt;
if (this.displayOrder == null || this.displayOrder.length < len) {
this.displayOrder =  Clazz.newIntArray (len, 0);
}for (var i = 0; i < len; i++) {
this.displayOrder[i] = i;
}
}, "astex.render.Tmesh");
Clazz.defineMethod (c$, "renderTriangleObject", 
 function (tmesh) {
var triangles = tmesh.nt;
var tri0 = tmesh.t0;
var tri1 = tmesh.t1;
var tri2 = tmesh.t2;
var shadowZscale = this.getOverallScale () / 1048576.0;
var i;
this.ensureDisplayList (tmesh);
if ((this.renderMode & 1) != 0) {
this.depthSortTriangles (tmesh);
}if (!this.lightMapCalculated) {
this.calculateLightMap ();
}this.components = 10;
if (this.phong != true) {
this.components = 10;
}if ((this.renderMode & 2) != 0) {
this.components = 10;
}if ((this.renderMode & 4) != 0) {
this.colorTriangle = true;
this.phong = false;
} else {
this.colorTriangle = false;
this.phong = true;
}if ((this.renderMode & 8) != 0) {
this.components = 10;
}this.zRange = (this.frontClip - this.backClip) >> 8;
var trianglesRendered = 0;
for (var ii = triangles; --ii >= 0; ) {
i = this.displayOrder[ii];
this.v0 = tri0[i];
this.v1 = tri1[i];
this.v2 = tri2[i];
this.clipTriangle = false;
trianglesRendered++;
if (this.shadowMode == 2 && triangles > 100000) {
if ((trianglesRendered % 10000) == 0) {
astex.io.FILE.out.printFI ("%7d/", trianglesRendered);
astex.io.FILE.out.printFI ("%d\n", triangles);
}}this.totallyOnScreen = ((this.clipped[this.v0]).charCodeAt (0) == 0 && (this.clipped[this.v1]).charCodeAt (0) == 0 && (this.clipped[this.v2]).charCodeAt (0) == 0);
if (this.totallyOnScreen || (((this.clipped[this.v0]).charCodeAt (0) & (this.clipped[this.v1]).charCodeAt (0) & (this.clipped[this.v2]).charCodeAt (0)) == 0) || this.shadowMode == 1) {
if (((((this.clipped[this.v0]).charCodeAt (0) | (this.clipped[this.v1]).charCodeAt (0) | (this.clipped[this.v2]).charCodeAt (0)) & (astex.render.Renderer.ZMinClip | astex.render.Renderer.ZMaxClip)) != 0)) {
this.clipTriangle = true;
}if (this.yt[this.v0] > this.yt[this.v1]) {
this.temp = this.v0;
this.v0 = this.v1;
this.v1 = this.temp;
}if (this.yt[this.v1] > this.yt[this.v2]) {
this.temp = this.v1;
this.v1 = this.v2;
this.v2 = this.temp;
}if (this.yt[this.v0] > this.yt[this.v1]) {
this.temp = this.v0;
this.v0 = this.v1;
this.v1 = this.temp;
}if (this.yt[this.v0] == this.yt[this.v2] && this.shadowMode != 1) {
continue;
}this.vertexA.x = this.xt[this.v0];
this.vertexA.y = this.yt[this.v0];
this.vertexA.z = this.zt[this.v0];
this.vertexA.nx = this.nxt[this.v0];
this.vertexA.ny = this.nyt[this.v0];
this.vertexB.x = this.xt[this.v1];
this.vertexB.y = this.yt[this.v1];
this.vertexB.z = this.zt[this.v1];
this.vertexB.nx = this.nxt[this.v1];
this.vertexB.ny = this.nyt[this.v1];
this.vertexD.x = this.xt[this.v2];
this.vertexD.y = this.yt[this.v2];
this.vertexD.z = this.zt[this.v2];
this.vertexD.nx = this.nxt[this.v2];
this.vertexD.ny = this.nyt[this.v2];
if ((this.renderMode & 8) != 0) {
this.vertexColor (this.vertexA, tmesh.vcolor[this.v0]);
this.vertexColor (this.vertexB, tmesh.vcolor[this.v1]);
this.vertexColor (this.vertexD, tmesh.vcolor[this.v2]);
}if (this.texture != null) {
this.vertexA.u = this.ut[this.v0];
this.vertexA.v = this.vt[this.v0];
this.vertexB.u = this.ut[this.v1];
this.vertexB.v = this.vt[this.v1];
this.vertexD.u = this.ut[this.v2];
this.vertexD.v = this.vt[this.v2];
}if (this.phong != true) {
this.lightVertex (this.vertexA);
this.lightVertex (this.vertexB);
this.lightVertex (this.vertexD);
}if (this.colorTriangle) {
if (tmesh.tcolor[i] != 0) {
this.triangleColor = tmesh.tcolor[i];
} else {
this.triangleColor = this.debugColor[i % this.debugColor.length];
}this.triangleColorR = astex.util.Color32.getRed (this.triangleColor);
this.triangleColorG = astex.util.Color32.getGreen (this.triangleColor);
this.triangleColorB = astex.util.Color32.getBlue (this.triangleColor);
}if (this.shadowMode == 2) {
this.applyTransform (tmesh.x[this.v0], tmesh.y[this.v0], tmesh.z[this.v0], this.cx0);
this.applyTransform (tmesh.x[this.v1], tmesh.y[this.v1], tmesh.z[this.v1], this.cx1);
this.applyTransform (tmesh.x[this.v2], tmesh.y[this.v2], tmesh.z[this.v2], this.cx2);
astex.render.Renderer.getShadowCache ().prepareTriangleCacheList (this.cx0[0], this.cx0[1], this.cx0[2] * this.getOverallScale (), this.cx1[0], this.cx1[1], this.cx1[2] * this.getOverallScale (), this.cx2[0], this.cx2[1], this.cx2[2] * this.getOverallScale (), this.transparent);
this.transformNormal (tmesh.nx[this.v0], tmesh.ny[this.v0], tmesh.nz[this.v0], this.nx0);
this.transformNormal (tmesh.nx[this.v1], tmesh.ny[this.v1], tmesh.nz[this.v1], this.nx1);
this.transformNormal (tmesh.nx[this.v2], tmesh.ny[this.v2], tmesh.nz[this.v2], this.nx2);
if (this.texture != null) {
this.textureMap = this.texture.pixels;
}this.renderShadowTriangle ();
continue;
} else if (this.shadowMode == 1) {
this.applyTransform (tmesh.x[this.v0], tmesh.y[this.v0], tmesh.z[this.v0], this.cx0);
this.applyTransform (tmesh.x[this.v1], tmesh.y[this.v1], tmesh.z[this.v1], this.cx1);
this.applyTransform (tmesh.x[this.v2], tmesh.y[this.v2], tmesh.z[this.v2], this.cx2);
this.cx0[2] *= this.getOverallScale ();
this.cx1[2] *= this.getOverallScale ();
this.cx2[2] *= this.getOverallScale ();
astex.render.Renderer.getShadowCache ().addTriangleToCacheList (this.cx0[0], this.cx0[1], this.cx0[2], this.cx1[0], this.cx1[1], this.cx1[2], this.cx2[0], this.cx2[1], this.cx2[2], this.transparency);
continue;
} else if (this.shadowMode == 0) {
this.renderTriangle ();
}}}
}, "astex.render.Tmesh");
c$.getShadowCache = Clazz.defineMethod (c$, "getShadowCache", 
 function () {
return (astex.render.Renderer.asc == null ? (astex.render.Renderer.asc = astex.api.Interface.getInterface ("astex.shadow.ShadowCache")) : astex.render.Renderer.asc);
});
Clazz.defineMethod (c$, "renderShadowTriangle", 
 function () {
var pxmin = 1 + Clazz.doubleToInt (this.cx0[0]);
if (this.cx1[0] < pxmin) pxmin = Clazz.doubleToInt (this.cx1[0]);
if (this.cx2[0] < pxmin) pxmin = Clazz.doubleToInt (this.cx2[0]);
var pymin = 1 + Clazz.doubleToInt (this.cx0[1]);
if (this.cx1[1] < pymin) pymin = Clazz.doubleToInt (this.cx1[1]);
if (this.cx2[1] < pymin) pymin = Clazz.doubleToInt (this.cx2[1]);
var pxmax = Clazz.doubleToInt (this.cx0[0]);
if (this.cx1[0] > pxmax) pxmax = Clazz.doubleToInt (this.cx1[0]);
if (this.cx2[0] > pxmax) pxmax = Clazz.doubleToInt (this.cx2[0]);
var pymax = Clazz.doubleToInt (this.cx0[1]);
if (this.cx1[1] > pymax) pymax = Clazz.doubleToInt (this.cx1[1]);
if (this.cx2[1] > pymax) pymax = Clazz.doubleToInt (this.cx2[1]);
if (pxmin < 0) pxmin = 0;
if (pymin < 0) pymin = 0;
if (pxmax >= this.pixelWidth) pxmax = this.pixelWidth - 1;
if (pymax >= this.pixelHeight) pymax = this.pixelHeight - 1;
this.eyedir[0] = 0.0;
this.eyedir[1] = 0.0;
this.eyedir[2] = 1.0;
this.eye[2] = this.back;
var renderedScanline = false;
for (var y = pymin; y <= pymax; y++) {
this.eye[1] = y;
renderedScanline = false;
for (var x = pxmin; x <= pxmax; x++) {
this.eye[0] = x;
this.triangleRaysCast++;
if (astex.render.Renderer.getShadowCache ().intersect_triangle (this.eye, this.eyedir, this.cx0, this.cx1, this.cx2, this.tuv) == 1) {
if (this.tuv[0] >= 0.0) {
var i = (y * this.pixelWidth + x);
var z = this.eye[2] + this.tuv[0] * this.eyedir[2];
var iz = Clazz.doubleToInt (z * 1048576.0);
this.triangleRaysIntersected++;
if (iz >= this.backClip && iz <= this.frontClip && iz >= this.zbuffer[i]) {
var oneuv = 1. - this.tuv[1] - this.tuv[2];
var nx = oneuv * this.nx0[0] + this.tuv[1] * this.nx1[0] + this.tuv[2] * this.nx2[0];
var ny = oneuv * this.nx0[1] + this.tuv[1] * this.nx1[1] + this.tuv[2] * this.nx2[1];
var nz = oneuv * this.nx0[2] + this.tuv[1] * this.nx1[2] + this.tuv[2] * this.nx2[2];
this.renderPixel (x, y, z, iz, nx, ny, nz, this.tuv, i);
}renderedScanline = true;
} else {
if (renderedScanline) {
break;
}}}}
}
});
Clazz.defineMethod (c$, "renderPixel", 
 function (x, y, z, iz, nx, ny, nz, tuv, ipix) {
var inside = false;
if (nz < -0.05) {
inside = true;
nx = -nx;
ny = -ny;
nz = -nz;
}var inx = Clazz.doubleToInt (128 + nx * 128);
var iny = Clazz.doubleToInt (128 - ny * 128);
var lutID = inx + (iny << 8);
var pcolor = 0xff00ff;
if ((this.renderMode & 4) != 0) {
pcolor = this.triangleColor;
} else if ((this.renderMode & 8) != 0) {
var oneuv = 1. - tuv[1] - tuv[2];
if (this.texture != null) {
var v = Clazz.doubleToInt (oneuv * this.vertexA.v + tuv[1] * this.vertexB.v + tuv[2] * this.vertexD.v);
if (v < 0 || v >= (1048576.0)) {
return;
}}var r = Clazz.doubleToInt (oneuv * this.vertexA.r + tuv[1] * this.vertexB.r + tuv[2] * this.vertexD.r);
var g = Clazz.doubleToInt (oneuv * this.vertexA.g + tuv[1] * this.vertexB.g + tuv[2] * this.vertexD.g);
var b = Clazz.doubleToInt (oneuv * this.vertexA.b + tuv[1] * this.vertexB.b + tuv[2] * this.vertexD.b);
pcolor = astex.util.Color32.pack (r >> 12, g >> 12, b >> 12);
} else if ((this.renderMode & 2) != 0) {
var oneuv = 1. - tuv[1] - tuv[2];
var u = Clazz.doubleToInt (oneuv * this.vertexA.u + tuv[1] * this.vertexB.u + tuv[2] * this.vertexD.u);
var v = Clazz.doubleToInt (oneuv * this.vertexA.v + tuv[1] * this.vertexB.v + tuv[2] * this.vertexD.v);
var ucoord = (u >> 12);
var vcoord = (v >> 12);
if (ucoord < 0) ucoord = 0;
 else if (ucoord > 255) ucoord = 255;
if (vcoord < 0 || vcoord >= 256) {
return;
}pcolor = this.textureMap[ucoord + (vcoord << 8)];
if ((pcolor & 0xffffff) == 0) {
return;
}} else {
pcolor = this.color;
}this.zbuffer[ipix] = iz;
var c = pcolor;
if (inside) {
c = astex.util.Color32.scale (c, 200);
}var shadowed = false;
if (this.shadowMode == 2 && (astex.render.Renderer.getShadowCache ().selfShadowed (nx, ny, nz, this.cosWrapAngle) || astex.render.Renderer.getShadowCache ().pointShadowed (x, y, z * this.getOverallScale ()))) {
shadowed = true;
}if (shadowed == false) {
c = astex.util.Color32.multiply (c, this.diffuseMap[lutID]);
var s = this.highlightMap[lutID];
if ((this.renderMode & 1) != 0) {
c = astex.util.Color32.blendI (c, this.pbuffer[ipix], this.transparency);
}c = astex.util.Color32.add (c, s);
} else {
c = astex.util.Color32.multiply (c, this.shadowMap[lutID]);
if ((this.renderMode & 1) != 0) {
c = astex.util.Color32.blendI (c, this.pbuffer[ipix], this.transparency);
}}var zscale = Clazz.doubleToInt ((iz - this.backClip) / this.zRange);
var shade = this.depthScale[zscale];
c = astex.util.Color32.blendI (c, this.background, shade);
this.pbuffer[ipix] = c;
}, "~N,~N,~N,~N,~N,~N,~N,~A,~N");
Clazz.defineMethod (c$, "renderTriangle", 
 function () {
var i;
var triCase = 0;
if (this.vertexA.y == this.vertexB.y) {
triCase = 1;
} else if (this.vertexD.y == this.vertexB.y) {
triCase = 2;
}var t = (this.vertexB.y - this.vertexA.y) / (this.vertexD.y - this.vertexA.y);
this.vertexC.x = Clazz.floatToInt (this.vertexA.x + t * (this.vertexD.x - this.vertexA.x));
this.vertexC.y = Clazz.floatToInt (this.vertexA.y + t * (this.vertexD.y - this.vertexA.y));
this.vertexC.z = Clazz.floatToInt (this.vertexA.z + t * (this.vertexD.z - this.vertexA.z));
this.vertexC.nx = Clazz.floatToInt (this.vertexA.nx + t * (this.vertexD.nx - this.vertexA.nx));
this.vertexC.ny = Clazz.floatToInt (this.vertexA.ny + t * (this.vertexD.ny - this.vertexA.ny));
this.vertexC.u = Clazz.floatToInt (this.vertexA.u + t * (this.vertexD.u - this.vertexA.u));
this.vertexC.v = Clazz.floatToInt (this.vertexA.v + t * (this.vertexD.v - this.vertexA.v));
this.vertexC.r = Clazz.floatToInt (this.vertexA.r + t * (this.vertexD.r - this.vertexA.r));
this.vertexC.g = Clazz.floatToInt (this.vertexA.g + t * (this.vertexD.g - this.vertexA.g));
this.vertexC.b = Clazz.floatToInt (this.vertexA.b + t * (this.vertexD.b - this.vertexA.b));
var xa = this.vertexA.x >> 12;
var xd = this.vertexD.x >> 12;
var dx = xd - xa;
if (dx > 0) {
var ya = this.vertexA.y >> 12;
var yd = this.vertexD.y >> 12;
var dy = yd - ya;
if (dy > 0) {
var dxp = Clazz.doubleToInt ((this.vertexD.x - this.vertexA.x) / dy);
var yb = this.vertexB.y >> 12;
this.vertexC.x = this.vertexA.x + (yb - ya) * dxp;
}}if (this.vertexB.x >= this.vertexC.x) {
var tt = this.vertexB;
this.vertexB = this.vertexC;
this.vertexC = tt;
}if (!this.clipTriangle) {
switch (this.renderMode) {
case 0:
this.vA = this.vertexA;
this.vB = this.vertexA;
this.vC = this.vertexB;
this.vD = this.vertexC;
this.renderTriangleP ();
this.vA = this.vertexB;
this.vB = this.vertexC;
this.vC = this.vertexD;
this.vD = this.vertexD;
this.renderTriangleP ();
break;
case 1:
this.vA = this.vertexA;
this.vB = this.vertexA;
this.vC = this.vertexB;
this.vD = this.vertexC;
this.renderTrianglePTrans ();
this.vA = this.vertexB;
this.vB = this.vertexC;
this.vC = this.vertexD;
this.vD = this.vertexD;
this.renderTrianglePTrans ();
break;
case 4:
this.vA = this.vertexA;
this.vB = this.vertexA;
this.vC = this.vertexB;
this.vD = this.vertexC;
this.renderTriangleTri ();
this.vA = this.vertexB;
this.vB = this.vertexC;
this.vC = this.vertexD;
this.vD = this.vertexD;
this.renderTriangleTri ();
break;
case 8:
this.vA = this.vertexA;
this.vB = this.vertexA;
this.vC = this.vertexB;
this.vD = this.vertexC;
this.renderTriangleVertex ();
this.vA = this.vertexB;
this.vB = this.vertexC;
this.vC = this.vertexD;
this.vD = this.vertexD;
this.renderTriangleVertex ();
break;
case 9:
this.vA = this.vertexA;
this.vB = this.vertexA;
this.vC = this.vertexB;
this.vD = this.vertexC;
this.renderTriangleVertexTrans ();
this.vA = this.vertexB;
this.vB = this.vertexC;
this.vC = this.vertexD;
this.vD = this.vertexD;
this.renderTriangleVertexTrans ();
break;
case 3:
this.vA = this.vertexA;
this.vB = this.vertexA;
this.vC = this.vertexB;
this.vD = this.vertexC;
this.renderTriangleTTrans ();
this.vA = this.vertexB;
this.vB = this.vertexC;
this.vC = this.vertexD;
this.vD = this.vertexD;
this.renderTriangleTTrans ();
break;
case 5:
this.vA = this.vertexA;
this.vB = this.vertexA;
this.vC = this.vertexB;
this.vD = this.vertexC;
this.renderTriangleTriTrans ();
this.vA = this.vertexB;
this.vB = this.vertexC;
this.vC = this.vertexD;
this.vD = this.vertexD;
this.renderTriangleTriTrans ();
break;
case 2:
if (this.totallyOnScreen) {
this.vA = this.vertexA;
this.vB = this.vertexA;
this.vC = this.vertexB;
this.vD = this.vertexC;
this.renderTriangleTF ();
this.vA = this.vertexB;
this.vB = this.vertexC;
this.vC = this.vertexD;
this.vD = this.vertexD;
this.renderTriangleTF ();
} else {
this.vA = this.vertexA;
this.vB = this.vertexA;
this.vC = this.vertexB;
this.vD = this.vertexC;
this.renderTriangleT ();
this.vA = this.vertexB;
this.vB = this.vertexC;
this.vC = this.vertexD;
this.vD = this.vertexD;
this.renderTriangleT ();
}break;
default:
this.vA = this.vertexA;
this.vB = this.vertexA;
this.vC = this.vertexB;
this.vD = this.vertexC;
this.renderTriangleUniversal ();
this.vA = this.vertexB;
this.vB = this.vertexC;
this.vC = this.vertexD;
this.vD = this.vertexD;
this.renderTriangleUniversal ();
break;
}
} else {
switch (this.renderMode) {
case 0:
this.vA = this.vertexA;
this.vB = this.vertexA;
this.vC = this.vertexB;
this.vD = this.vertexC;
this.renderTrianglePC ();
this.vA = this.vertexB;
this.vB = this.vertexC;
this.vC = this.vertexD;
this.vD = this.vertexD;
this.renderTrianglePC ();
break;
case 1:
this.vA = this.vertexA;
this.vB = this.vertexA;
this.vC = this.vertexB;
this.vD = this.vertexC;
this.renderTrianglePTransC ();
this.vA = this.vertexB;
this.vB = this.vertexC;
this.vC = this.vertexD;
this.vD = this.vertexD;
this.renderTrianglePTransC ();
break;
case 4:
this.vA = this.vertexA;
this.vB = this.vertexA;
this.vC = this.vertexB;
this.vD = this.vertexC;
this.renderTriangleTriC ();
this.vA = this.vertexB;
this.vB = this.vertexC;
this.vC = this.vertexD;
this.vD = this.vertexD;
this.renderTriangleTriC ();
break;
case 8:
this.vA = this.vertexA;
this.vB = this.vertexA;
this.vC = this.vertexB;
this.vD = this.vertexC;
this.renderTriangleVertexC ();
this.vA = this.vertexB;
this.vB = this.vertexC;
this.vC = this.vertexD;
this.vD = this.vertexD;
this.renderTriangleVertexC ();
break;
case 3:
this.vA = this.vertexA;
this.vB = this.vertexA;
this.vC = this.vertexB;
this.vD = this.vertexC;
this.renderTriangleTTransC ();
this.vA = this.vertexB;
this.vB = this.vertexC;
this.vC = this.vertexD;
this.vD = this.vertexD;
this.renderTriangleTTransC ();
break;
case 5:
this.vA = this.vertexA;
this.vB = this.vertexA;
this.vC = this.vertexB;
this.vD = this.vertexC;
this.renderTriangleTriTransC ();
this.vA = this.vertexB;
this.vB = this.vertexC;
this.vC = this.vertexD;
this.vD = this.vertexD;
this.renderTriangleTriTransC ();
break;
case 9:
this.vA = this.vertexA;
this.vB = this.vertexA;
this.vC = this.vertexB;
this.vD = this.vertexC;
this.renderTriangleVertexTransC ();
this.vA = this.vertexB;
this.vB = this.vertexC;
this.vC = this.vertexD;
this.vD = this.vertexD;
this.renderTriangleVertexTransC ();
break;
case 2:
this.vA = this.vertexA;
this.vB = this.vertexA;
this.vC = this.vertexB;
this.vD = this.vertexC;
this.renderTriangleTC ();
this.vA = this.vertexB;
this.vB = this.vertexC;
this.vC = this.vertexD;
this.vD = this.vertexD;
this.renderTriangleTC ();
break;
default:
this.vA = this.vertexA;
this.vB = this.vertexA;
this.vC = this.vertexB;
this.vD = this.vertexC;
this.renderTriangleUniversalC ();
this.vA = this.vertexB;
this.vB = this.vertexC;
this.vC = this.vertexD;
this.vD = this.vertexD;
this.renderTriangleUniversalC ();
break;
}
}});
Clazz.defineMethod (c$, "drawCylinder", 
function (x1, y1, z1, x2, y2, z2, rgb1, rgb2, r) {
if (rgb1 != rgb2) {
var xm = 0.5 * (x1 + x2);
var ym = 0.5 * (y1 + y2);
var zm = 0.5 * (z1 + z2);
this.drawCylinderEnd (x1, y1, z1, xm, ym, zm, rgb1, r, false);
this.drawCylinderEnd (x2, y2, z2, xm, ym, zm, rgb2, r, false);
} else {
this.drawCylinderEnd (x1, y1, z1, x2, y2, z2, rgb1, r, true);
}}, "~N,~N,~N,~N,~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "drawCylinderEnd", 
 function (x1, y1, z1, x2, y2, z2, rgb1, r, top) {
var overallScale = this.getOverallScale ();
var overallScale1 = 1. / this.getOverallScale ();
var rt = overallScale * r;
var irt = Clazz.doubleToInt (rt);
this.applyTransform (x1, y1, z1, this.cx1);
this.applyTransform (x2, y2, z2, this.cx2);
if (this.cx1[2] + r < this.back && this.cx2[2] + r < this.back) return;
if (this.cx1[2] - r > this.front && this.cx2[2] - r > this.front) return;
var rgb1shade = rgb1;
if (this.background == astex.util.Color32.black) {
rgb1shade = this.depthCueShadedColor (rgb1, Clazz.doubleToInt (0.5 * (this.cx1[2] + this.cx2[2]) * 1048576.0));
}this.cx1[2] *= overallScale;
this.cx2[2] *= overallScale;
this.rayCapsuleIntInit (this.cx1, this.cx2, rt, this.front - this.back);
if (this.shadowMode == 2) {
astex.render.Renderer.getShadowCache ().prepareCylinderCacheList (this.cx1[0], this.cx1[1], this.cx1[2], this.cx2[0], this.cx2[1], this.cx2[2], rt);
} else if (this.shadowMode == 1) {
astex.render.Renderer.getShadowCache ().addCylinderToCacheList (this.cx1[0], this.cx1[1], this.cx1[2], this.cx2[0], this.cx2[1], this.cx2[2], rt);
return;
}var icx10 = Clazz.doubleToInt (this.cx1[0]);
var icx11 = Clazz.doubleToInt (this.cx1[1]);
var icx20 = Clazz.doubleToInt (this.cx2[0]);
var icx21 = Clazz.doubleToInt (this.cx2[1]);
var pxmin = icx10;
if (icx20 < pxmin) pxmin = icx20;
pxmin -= irt + 3;
var pxmax = icx10;
if (icx20 > pxmax) pxmax = icx20;
pxmax += irt + 3;
var pymin = icx11;
if (icx21 < pymin) pymin = icx21;
pymin -= irt + 3;
var pymax = icx11;
if (icx21 > pymax) pymax = icx21;
pymax += irt + 3;
if (pxmin > this.pixelWidth || pymin > this.pixelHeight || pxmax < 0 || pymax < 0) {
return;
}if (pxmin < 0) pxmin = 0;
if (pymin < 0) pymin = 0;
if (pxmax > this.pixelWidth) pxmax = this.pixelWidth;
if (pymax > this.pixelHeight) pymax = this.pixelHeight;
this.ray1[2] = this.back;
this.ray2[2] = this.front;
var pb = this.pbuffer;
var zb = this.zbuffer;
var zeroSpecular = 0;
var nonZeroSpecular = 0;
for (var j = pymin; j < pymax; j++) {
this.ray1[1] = this.ray2[1] = j;
var px = j * this.pixelWidth + pxmin;
var lastIntCount = 0;
for (var i = pxmin; i < pxmax; i++) {
this.ray1[0] = this.ray2[0] = i;
var intCount = this.rayCapsuleInt (this.ray1, this.ray2, this.cylPoint, this.cylNormal, top);
if (intCount > 0) {
var zpos = this.cylPoint[2] * overallScale1;
var izpos = Clazz.doubleToInt (zpos * 1048576.0);
var c = 0;
if (izpos > zb[px] && izpos > this.backClip && izpos < this.frontClip) {
var inx = Clazz.doubleToInt (128 + this.cylNormal[0] * 128);
var iny = Clazz.doubleToInt (128 - this.cylNormal[1] * 128);
var lutID = inx + (iny << 8);
if (this.shadowMode == 2) {
if (astex.render.Renderer.getShadowCache ().pointShadowed (i, j, zpos * overallScale)) {
c = astex.util.Color32.multiply (rgb1shade, this.shadowMap[lutID]);
} else {
var s = this.highlightMap[lutID];
c = astex.util.Color32.multiply (rgb1shade, this.diffuseMap[lutID]);
c = astex.util.Color32.add (c, s);
}} else {
var s = this.highlightMap[lutID];
c = astex.util.Color32.multiply (rgb1shade, this.diffuseMap[lutID]);
c = astex.util.Color32.add (c, s);
}if (this.background != astex.util.Color32.black) {
c = this.depthCueShadedColor (c, izpos);
}pb[px] = c;
zb[px] = izpos;
}}lastIntCount = intCount;
px++;
}
}
}, "~N,~N,~N,~N,~N,~N,~N,~N,~B");
Clazz.defineMethod (c$, "normalise", 
 function (p) {
var len = p[0] * p[0] + p[1] * p[1] + p[2] * p[2];
if (len != 0.0) {
len = Math.sqrt (len);
p[0] /= len;
p[1] /= len;
p[2] /= len;
}return len;
}, "~A");
Clazz.defineMethod (c$, "generateOrthonormalBasis", 
 function (rkU, rkV, rkW, bUnitLengthW) {
if (!bUnitLengthW) {
this.normalise (rkW);
}var fInvLength = 0.0;
if (Math.abs (rkW[0]) >= Math.abs (rkW[1])) {
fInvLength = 1.0 / Math.sqrt (rkW[0] * rkW[0] + rkW[2] * rkW[2]);
rkU[0] = -rkW[2] * fInvLength;
rkU[1] = 0.0;
rkU[2] = +rkW[0] * fInvLength;
} else {
fInvLength = 1.0 / Math.sqrt (rkW[1] * rkW[1] + rkW[2] * rkW[2]);
rkU[0] = 0.0;
rkU[1] = +rkW[2] * fInvLength;
rkU[2] = -rkW[1] * fInvLength;
}this.cross (rkV, rkW, rkU);
this.normalise (rkV);
}, "~A,~A,~A,~B");
Clazz.defineMethod (c$, "cross", 
 function (a, b, c) {
a[0] = (b[1] * c[2]) - (b[2] * c[1]);
a[1] = (b[2] * c[0]) - (b[0] * c[2]);
a[2] = (b[0] * c[1]) - (b[1] * c[0]);
return a[0] + a[1] + a[2];
}, "~A,~A,~A");
Clazz.defineMethod (c$, "rayCapsuleIntInit", 
 function (c0, c1, cr, zrange) {
for (var i = 0; i < 3; i++) {
this.cap0[i] = c0[i];
this.cap1[i] = c1[i];
this.kW[i] = this.capDir[i] = this.cap1[i] - this.cap0[i];
}
this.fWLength = this.normalise (this.kW);
this.generateOrthonormalBasis (this.kU, this.kV, this.kW, true);
this.capRadius = cr;
this.kD[0] = this.kU[2] * zrange;
this.kD[1] = this.kV[2] * zrange;
this.kD[2] = this.kW[2] * zrange;
this.fDLength = this.normalise (this.kD);
this.fInvDLength = 1.0 / this.fDLength;
this.fRadiusSqr = this.capRadius * this.capRadius;
}, "~A,~A,~N,~N");
Clazz.defineMethod (c$, "rayCapsuleInt", 
 function (ray0, ray1, pint, nint, top) {
this.kDiff[0] = ray0[0] - this.cap0[0];
this.kDiff[1] = ray0[1] - this.cap0[1];
this.kDiff[2] = ray0[2] - this.cap0[2];
this.kP[0] = this.kU[0] * this.kDiff[0] + this.kU[1] * this.kDiff[1] + this.kU[2] * this.kDiff[2];
this.kP[1] = this.kV[0] * this.kDiff[0] + this.kV[1] * this.kDiff[1] + this.kV[2] * this.kDiff[2];
this.kP[2] = this.kW[0] * this.kDiff[0] + this.kW[1] * this.kDiff[1] + this.kW[2] * this.kDiff[2];
var fInv;
var fA;
var fB;
var fC;
var fDiscr;
var fRoot;
var fT;
var fTmp;
var iQuantity = 0;
fA = this.kD[0] * this.kD[0] + this.kD[1] * this.kD[1];
fB = this.kP[0] * this.kD[0] + this.kP[1] * this.kD[1];
fC = this.kP[0] * this.kP[0] + this.kP[1] * this.kP[1] - this.fRadiusSqr;
fDiscr = fB * fB - fA * fC;
if (fDiscr < 0.0) {
return 0;
}if (fDiscr > 0.0) {
fRoot = Math.sqrt (fDiscr);
fInv = 1.0 / fA;
fT = (-fB + fRoot) * fInv;
fTmp = this.kP[2] + fT * this.kD[2];
if (0.0 <= fTmp && fTmp <= this.fWLength) {
this.fTmpStore[iQuantity] = fTmp;
this.afT[iQuantity++] = fT * this.fInvDLength;
}}if (iQuantity != 1) {
fB += this.kP[2] * this.kD[2];
fC += this.kP[2] * this.kP[2];
fDiscr = fB * fB - fC;
if (fDiscr > 0.0) {
fRoot = Math.sqrt (fDiscr);
fT = -fB + fRoot;
fTmp = this.kP[2] + fT * this.kD[2];
if (fTmp <= 0.0) {
this.fTmpStore[iQuantity] = 0.0;
this.afT[iQuantity++] = fT * this.fInvDLength;
}} else if (fDiscr == 0.0) {
fT = -fB;
fTmp = this.kP[2] + fT * this.kD[2];
if (fTmp <= 0.0) {
this.fTmpStore[iQuantity] = 0.0;
this.afT[iQuantity++] = fT * this.fInvDLength;
}}if (top && iQuantity != 1) {
fB -= this.kD[2] * this.fWLength;
fC += this.fWLength * (this.fWLength - 2.0 * this.kP[2]);
fDiscr = fB * fB - fC;
if (fDiscr > 0.0) {
fRoot = Math.sqrt (fDiscr);
fT = -fB + fRoot;
fTmp = this.kP[2] + fT * this.kD[2];
if (fTmp >= this.fWLength) {
this.fTmpStore[iQuantity] = this.fWLength;
this.afT[iQuantity++] = fT * this.fInvDLength;
}} else if (fDiscr == 0.0) {
fT = -fB;
fTmp = this.kP[2] + fT * this.kD[2];
if (fTmp >= this.fWLength) {
this.fTmpStore[iQuantity] = this.fWLength;
this.afT[iQuantity++] = fT * this.fInvDLength;
}}}}pint[0] = ray0[0];
pint[1] = ray0[1];
pint[2] = ray0[2] + this.afT[0] * (ray1[2] - ray0[2]);
for (var j = 0; j < 2; j++) {
this.nOrigin[j] = this.cap0[j] + this.fTmpStore[0] * this.kW[j];
nint[j] = (pint[j] - this.nOrigin[j]) / this.capRadius;
}
return iQuantity;
}, "~A,~A,~A,~A,~B");
Clazz.defineMethod (c$, "generateSphereBitmap", 
 function (rorig, rsd, rgb) {
if (!this.lightMapCalculated) {
this.calculateLightMap ();
}var rs = Clazz.doubleToInt (rsd);
var r2 = rs * rs;
var pixel = 0;
var lutID;
var c;
var s;
var dmap = this.diffuseMap;
var smap = this.highlightMap;
this.sphereColor =  Clazz.newIntArray (4 * rs * rs, 0);
this.sphereZ =  Clazz.newIntArray (4 * rs * rs, 0);
for (var iy = -rs; iy < rs; iy++) {
var ny = iy / rs;
var iny = Clazz.doubleToInt (128 + ny * 128);
var iy2 = iy * iy;
for (var ix = -rs; ix < rs; ix++) {
var ix2 = ix * ix;
var nx = ix / rs;
if (ny * ny + nx * nx < 0.97) {
var inx = Clazz.doubleToInt (128 + nx * 128);
var nz = Clazz.doubleToInt (rorig * Math.sqrt (1. - (ny * ny + nx * nx)) * 1048576.0);
this.sphereZ[pixel] = nz;
lutID = inx + (iny << 8);
c = astex.util.Color32.multiply (rgb, dmap[lutID]);
s = smap[lutID];
this.sphereColor[pixel] = astex.util.Color32.add (c, s);
} else {
this.sphereZ[pixel] = 0;
}pixel++;
}
}
var slot = 0;
if (this.cacheCount < 32) {
slot = this.cacheCount;
} else {
slot = rs % 32;
}this.szCache[slot] = this.sphereZ;
this.scCache[slot] = this.sphereColor;
this.sradius[slot] = rs;
this.scolor[slot] = rgb;
if (this.cacheCount < 32) {
this.cacheCount++;
}}, "~N,~N,~N");
Clazz.defineMethod (c$, "drawSphere", 
function (x, y, z, r, rgb) {
if (!this.lightMapCalculated) {
this.calculateLightMap ();
}this.drawSphereT (x, y, z, r, rgb, 255);
}, "~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "drawSphereT", 
function (x, y, z, r, rgb, transp) {
if (transp == 255) {
this.actuallyDrawSphere (x, y, z, r, rgb, transp);
} else {
this.cacheTransparentSphere (x, y, z, r, rgb, transp);
}}, "~N,~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "actuallyDrawSphere", 
 function (x, y, z, r, rgb, transp) {
if (this.analyticalSpheres || transp != 255) {
this.drawAccurateSphere (x, y, z, r, rgb, transp);
return;
}var xs;
var ys;
var rs;
var rs2;
var rsrs;
var zs;
var zback;
var zfront;
var m = this.overallMatrix;
var overallScale = this.getOverallScale ();
xs = Clazz.doubleToInt (x * m.x00 + y * m.x10 + z * m.x20 + m.x30 + 0.5);
ys = Clazz.doubleToInt (x * m.x01 + y * m.x11 + z * m.x21 + m.x31 + 0.5);
zs = x * m.x02 + y * m.x12 + z * m.x22 + m.x32;
var zscale = Clazz.doubleToInt (zs * 1048576.0);
var rsd = overallScale * r;
rs = Clazz.doubleToInt (overallScale * r);
zfront = Clazz.doubleToInt ((zs + r) * 1048576.0);
if (zfront < this.backClip) {
return;
}zback = Clazz.doubleToInt ((zs - r) * 1048576.0);
if (zback > this.frontClip) {
return;
}rs2 = rs * rs;
rsrs = 2 * rs;
var ymin = -rs;
var ymax = rs;
var xmin = -rs;
var xmax = rs;
var zb = this.zbuffer;
var pb = this.pbuffer;
var sz = null;
var sc = null;
for (var i = 0; i < this.cacheCount; i++) {
if (this.sradius[i] == rs && this.scolor[i] == rgb) {
sz = this.szCache[i];
sc = this.scCache[i];
break;
}}
if (sz == null) {
this.generateSphereBitmap (r, rsd, rgb);
sz = this.sphereZ;
sc = this.sphereColor;
}if (ys < rs) ymin = -ys;
if (xs < rs) xmin = -xs;
if (this.pixelHeight - ys < rs) ymax = this.pixelHeight - ys;
if (this.pixelWidth - xs < rs) xmax = this.pixelWidth - xs;
var back = false;
if (zscale < this.frontClip) {
for (var iy = ymin; iy < ymax; iy++) {
var pixel = (ys + iy) * this.pixelWidth + xs + xmin;
var bitmapPixel = (xmin + rs) + (-iy + rs - 1) * rsrs;
for (var ix = xmin; ix < xmax; ix++) {
if (sz[bitmapPixel] != 0) {
var iz = 0;
iz = zscale + sz[bitmapPixel];
if (iz > zb[pixel] && ((iz) >= this.backClip && (iz) <= this.frontClip)) {
zb[pixel] = iz;
if (transp == 255) {
pb[pixel] = sc[bitmapPixel];
} else {
pb[pixel] = astex.util.Color32.blendI (sc[bitmapPixel], pb[pixel], transp);
}} else if (iz > this.frontClip) {
zb[pixel] = this.frontClip;
pb[pixel] = (rgb >> 2) & 0x3F3F3F;
}}pixel++;
bitmapPixel++;
}
}
} else {
for (var iy = ymin; iy < ymax; iy++) {
var pixel = (ys + iy) * this.pixelWidth + xs + xmin;
var bitmapPixel = (xmin + rs) + (-iy + rs - 1) * rsrs;
for (var ix = xmin; ix < xmax; ix++) {
if (sz[bitmapPixel] != 0) {
var iz = 0;
iz = zscale - sz[bitmapPixel];
if (iz < this.frontClip) {
zb[pixel] = this.frontClip;
pb[pixel] = (rgb >> 2) & 0x3F3F3F;
}}pixel++;
bitmapPixel++;
}
}
}}, "~N,~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "cacheTransparentSphere", 
 function (x, y, z, r, rgb, transp) {
var id = this.stransx.size ();
this.stransid.add (id);
this.stransx.add (x);
this.stransy.add (y);
this.stransz.add (z);
this.stransr.add (r);
this.stransrgb.add (rgb);
this.stransp.add (transp);
this.applyTransform (x, y, z, this.cx1);
this.cx1[2] *= this.getOverallScale ();
this.stransxt.add (this.cx1[0]);
this.stransyt.add (this.cx1[1]);
this.stranszt.add (this.cx1[2]);
this.stransrt.add (r * this.getOverallScale ());
}, "~N,~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "spherePointVisible", 
 function (x, y, z) {
var stx = this.stransxt.getArray ();
var sty = this.stransyt.getArray ();
var stz = this.stranszt.getArray ();
var str = this.stransrt.getArray ();
var overlapCount = this.sphereOverlaps.size ();
for (var ii = 0; ii < overlapCount; ii++) {
var i = this.sphereOverlaps.get (ii);
var dx = x - stx[i];
var dy = y - sty[i];
var dz = z - stz[i];
var rt = str[i];
if (dx * dx + dy * dy + dz * dz < rt * rt) {
return false;
}}
return true;
}, "~N,~N,~N");
Clazz.defineMethod (c$, "drawAccurateSphere", 
function (x, y, z, r, rgb, transp) {
var overallScale = this.getOverallScale ();
var overallScale1 = 1. / this.getOverallScale ();
var rt = overallScale * r;
var top = true;
var hit = 0;
var miss = 0;
this.applyTransform (x, y, z, this.cx1);
if (this.cx1[2] - rt > this.front) return;
if (this.cx1[2] + rt < this.back) return;
if (this.background == astex.util.Color32.black) {
rgb = this.depthCueShadedColor (rgb, Clazz.doubleToInt (this.cx1[2] * 1048576.0));
}this.cx1[2] *= overallScale;
var tx = this.cx1[0];
var ty = this.cx1[1];
var tz = this.cx1[2];
var ambientOcclusion = 128;
if (this.shadowMode == 1) {
astex.render.Renderer.getShadowCache ().addSphereToCacheList (tx, ty, tz, rt);
return;
} else if (this.shadowMode == 2) {
astex.render.Renderer.getShadowCache ().prepareSphereCacheList (tx, ty, tz, rt, false);
}var pxmin = Clazz.doubleToInt (tx - rt - 3);
var pxmax = Clazz.doubleToInt (tx + rt + 3);
var pymin = Clazz.doubleToInt (ty - rt - 3);
var pymax = Clazz.doubleToInt (ty + rt + 3);
if (pxmin > this.pixelWidth || pymin > this.pixelHeight || pxmax < 0 || pymax < 0) {
return;
}if (pxmin < 0) pxmin = 0;
if (pymin < 0) pymin = 0;
if (pxmax > this.pixelWidth) pxmax = this.pixelWidth;
if (pymax > this.pixelHeight) pymax = this.pixelHeight;
var pb = this.pbuffer;
var zb = this.zbuffer;
var r2 = rt * rt;
var r1 = 1. / rt;
var clipColor = (rgb >> 2) & 0x3F3F3F;
var cm = this.colorMap;
for (var j = pymin; j < pymax; j++) {
var px = j * this.pixelWidth + pxmin;
var dy = j - ty;
var dy2 = dy * dy;
var sn1 = dy;
sn1 *= r1;
var iny = Clazz.doubleToInt (128 - sn1 * 128);
iny <<= 8;
var lastIntCount = 0;
for (var i = pxmin; i < pxmax; i++) {
var dx = i - tx;
var d2 = dy2 + dx * dx;
if (d2 < r2) {
var h = astex.render.Renderer.fastSqrt (r2 - d2);
for (var sol = 1; sol >= 0; sol -= 2) {
var zpos = tz + sol * h;
var zp = zpos;
zpos *= overallScale1;
var izpos = Clazz.doubleToInt (zpos * 1048576.0);
if (izpos > zb[px] && izpos > this.backClip && izpos < this.frontClip) {
if (true || this.shadowMode == 0 || astex.render.Renderer.getShadowCache ().pointInSphere (i, j, zp) == false) {
var sn0 = dx * r1;
var inx = Clazz.doubleToInt (128 + sn0 * 128);
var lutID = inx + iny;
if (sol == -1) {
var tinx = Clazz.doubleToInt (128 - sn0 * 128);
var tiny = Clazz.doubleToInt (128 + sn1 * 128);
tiny <<= 8;
lutID = tinx + tiny;
}var c = astex.util.Color32.multiply (rgb, this.diffuseMap[lutID]);
if (this.shadowMode == 2) {
if (sol == -1 || astex.render.Renderer.getShadowCache ().pointShadowed (i, j, zp)) {
c = astex.util.Color32.multiply (rgb, this.shadowMap[lutID]);
} else {
var s = this.highlightMap[lutID];
c = astex.util.Color32.add (c, s);
}} else {
var s = this.highlightMap[lutID];
c = astex.util.Color32.add (c, s);
}if (this.background != astex.util.Color32.black) {
c = this.depthCueShadedColor (c, izpos);
}if (transp != 255) {
if (this.spherePointVisible (i, j, zp)) {
c = astex.util.Color32.blendI (c, pb[px], transp);
pb[px] = c;
zb[px] = izpos;
}} else {
pb[px] = c;
zb[px] = izpos;
}break;
}}}
} else {
if (dx > 0) {
break;
}}px++;
}
}
}, "~N,~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "drawBox", 
function (xt, yt, zt, width, c) {
if (this.antialias) {
width *= 2;
}if (((zt) >= this.backClip && (zt) <= this.frontClip)) {
var halfWidth = 1 + Clazz.doubleToInt (width / 2);
var shade = this.depthCueColor (c, zt);
xt >>= 12;
yt >>= 12;
for (var i = -halfWidth; i < halfWidth + 1; i++) {
for (var j = -halfWidth; j < halfWidth + 1; j++) {
this.setPixel4 (xt + i, yt + j, zt, shade);
}
}
}}, "~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "drawPixels", 
function (x, y, z, w, h, pix, hints) {
this.applyTransform (x, y, z, this.tix);
var p = 0;
for (var j = 0; j < h; j++) {
for (var i = 0; i < w; i++) {
var pixel = pix[p++];
var xs = Clazz.doubleToInt (this.tix[0]) + i;
var ys = Clazz.doubleToInt (this.tix[1]) + j - h;
if (xs >= 0 && ys >= 0 && xs < this.pixelWidth && ys < this.pixelHeight) {
var zs = Clazz.doubleToInt (this.tix[2] * 1048576.0);
var alpha = (pixel >> 24) & 0xff;
if (alpha > 0) {
var pixelIndex = xs + ys * this.pixelWidth;
if (this.antialias) {
var bg = this.opbuffer[pixelIndex];
var newp = astex.util.Color32.blendI (pixel, bg, alpha);
this.opbuffer[pixelIndex] = newp;
} else {
var bg = this.pbuffer[pixelIndex];
var newp = astex.util.Color32.blendI (pixel, bg, alpha);
this.setPixel4 (xs, ys, zs, newp);
}}}}
}
}, "~N,~N,~N,~N,~N,~A,~N");
Clazz.defineMethod (c$, "drawDirectString", 
function (x, y, color, string) {
var stringLength = string.length;
if (this.antialias) {
x &= 0xfffffffe;
y &= 0xfffffffe;
}this.setupString (string, this.charOffsets);
var font = null;
for (var i = 0; i < stringLength; i++) {
var c = string.charAt (i);
if (c == '\\') {
i++;
c = string.charAt (i);
font = this.greekBitmapFont;
} else {
font = this.romanBitmapFont;
}x += this.drawChar (x + Clazz.doubleToInt (this.charOffsets[0] + 0.5), y - Clazz.doubleToInt (this.charOffsets[1] + 0.5), 0, c, font, color, true, null, null, false);
}
}, "~N,~N,~N,~S");
Clazz.defineMethod (c$, "drawString", 
function (x, y, z, color, string) {
this.drawStringZoff (x, y, z, 0.0, color, string);
}, "~N,~N,~N,~N,~S");
Clazz.defineMethod (c$, "drawStringZoff", 
function (x, y, z, zoff, color, string) {
this.setupString (string, this.charOffsets);
if (this.colorDefined == false) {
this.stringColor = color;
}if (this.string3d) {
this.drawHersheyString (x, y, z, zoff, 0.5, color, string);
} else {
this.applyTransform (x, y, z, this.tix);
this.drawBitmapString (Clazz.doubleToInt (this.tix[0]), Clazz.doubleToInt (this.tix[1]), Clazz.doubleToInt (this.tix[2] * 1048576.0), zoff, color, string);
}}, "~N,~N,~N,~N,~N,~S");
Clazz.defineMethod (c$, "drawBitmapString", 
 function (x, y, z, zoff, color, string) {
z += Clazz.doubleToInt (zoff * 1048576.0);
if (((z) >= this.backClip && (z) <= this.frontClip)) {
var shade = this.depthCueColor (this.stringColor, z);
var stringLength = string.length;
var firstChar = 0;
if (string.charAt (0) == '<') {
firstChar = string.indexOf ('>') + 1;
}var font = null;
for (var i = 0; i < 3; i++) {
this.pixMin[i] = 2147483647;
this.pixMax[i] = -2147483648;
}
for (var pass = 0; pass < 2; pass++) {
var measure = (pass == 0);
var xstart = x;
var ystart = y;
if (pass == 1) {
if ((this.stringJustification & 1) != 0) {
xstart = x;
} else if ((this.stringJustification & 2) != 0) {
xstart = x - (this.pixMax[0] - this.pixMin[0]);
} else if ((this.stringJustification & 32) != 0) {
xstart = x - Clazz.doubleToInt ((this.pixMax[0] - this.pixMin[0]) / 2);
}if ((this.stringJustification & 8) != 0) {
ystart = y;
} else if ((this.stringJustification & 4) != 0) {
ystart = y + (this.pixMax[1] - this.pixMin[1]);
} else if ((this.stringJustification & 16) != 0) {
ystart = y + Clazz.doubleToInt ((this.pixMax[1] - this.pixMin[1]) / 2);
}}for (var i = firstChar; i < stringLength; i++) {
var c = string.charAt (i);
if (c == '\\') {
i++;
c = string.charAt (i);
font = this.greekBitmapFont;
} else {
font = this.romanBitmapFont;
}var xpos = xstart + Clazz.doubleToInt (this.charOffsets[0] + 0.5);
var ypos = ystart - Clazz.doubleToInt (this.charOffsets[1] + 0.5);
xpos = this.samples * (Clazz.doubleToInt (xpos / this.samples));
ypos = this.samples * (Clazz.doubleToInt (ypos / this.samples));
xstart += this.drawChar (xpos, ypos, z, c, font, shade, false, this.pixMin, this.pixMax, measure);
}
}
}}, "~N,~N,~N,~N,~N,~S");
Clazz.defineMethod (c$, "drawChar", 
 function (xOrigin, yOrigin, zOrigin, c, bitmapFont, color, overlay, min, max, measure) {
if (bitmapFont == null) {
astex.util.Log.error ("null font");
return 0;
}if (c.charCodeAt (0) < 32 || c.charCodeAt (0) > 126) {
astex.util.Log.warn ("character not in printable range: %d", c.charCodeAt (0));
c = '*';
}var maxCharWidth = bitmapFont[0];
var maxCharHeight = bitmapFont[1];
var maxAscent = bitmapFont[2];
var maxDescent = bitmapFont[3];
var standardLeading = bitmapFont[4];
var charIndex = c.charCodeAt (0) - 32;
var gridX = charIndex % 12;
var gridY = Clazz.doubleToInt (charIndex / 12);
var bitmapWidth = bitmapFont[charIndex + 512];
var xBitmapOrigin = (gridX) * maxCharWidth;
var yBitmapOrigin = 9 + (gridY + 1) * maxCharHeight;
yBitmapOrigin -= maxAscent;
yOrigin -= maxAscent;
yOrigin -= (this.samples - 1) * maxAscent;
var bitmapHeight = maxAscent + maxDescent;
for (var y = 0; y < bitmapHeight; y++) {
var yPixel = yBitmapOrigin + y;
for (var x = 0; x < bitmapWidth; x++) {
var xPixel = xBitmapOrigin + x;
var bitmapPixel = xPixel + yPixel * 512;
if (bitmapFont[bitmapPixel] != 0) {
if (measure) {
for (var ay = 0; ay < this.samples; ay++) {
for (var ax = 0; ax < this.samples; ax++) {
var xp = xOrigin + this.samples * x + ax;
var yp = yOrigin + this.samples * y + ay;
if (xp < min[0]) min[0] = xp;
if (yp < min[1]) min[1] = yp;
if (xp > max[0]) max[0] = xp;
if (yp > max[1]) max[1] = yp;
}
}
} else {
for (var ay = 0; ay < this.samples; ay++) {
for (var ax = 0; ax < this.samples; ax++) {
if (overlay) {
this.setPixel3 (xOrigin + this.samples * x + ax, yOrigin + this.samples * y + ay, color);
} else {
this.setPixel4 (xOrigin + this.samples * x + ax, yOrigin + this.samples * y + ay, zOrigin, color);
}}
}
}if (false) {
if (overlay) {
if (this.samples > 1) {
for (var ay = 0; ay < this.samples; ay++) {
for (var ax = 0; ax < this.samples; ax++) {
this.setPixel3 (xOrigin + this.samples * x + ax, yOrigin + this.samples * y + ay, color);
}
}
} else {
this.setPixel3 (xOrigin + x, yOrigin + y, color);
}} else {
if (this.samples > 1) {
for (var ay = 0; ay < this.samples; ay++) {
for (var ax = 0; ax < this.samples; ax++) {
this.setPixel4 (xOrigin + this.samples * x + ax, yOrigin + this.samples * y + ay, zOrigin, color);
}
}
} else {
this.setPixel4 (xOrigin + x, yOrigin + y, zOrigin, color);
}}}}}
}
return this.samples * (bitmapWidth + standardLeading);
}, "~N,~N,~N,~S,~A,~N,~B,~A,~A,~B");
Clazz.defineMethod (c$, "drawHersheyString", 
 function (x, y, z, zoff, size, color, string) {
this.xd.set (1., 0., 0.);
this.yd.set (0., -1.0, 0.);
this.zd.set (0., 0., 1.);
this.fontHeight = this.stringSize * this.hersheyScale;
this.fontRadius = this.stringSize * this.stringRadius;
var xorig = x;
var yorig = y;
var zorig = z;
for (var pass = 0; pass < 2; pass++) {
x = xorig;
y = yorig;
z = zorig;
if (pass == 0) {
for (var i = 0; i < 3; i++) {
this.fontMin[i] = 1.e10;
this.fontMax[i] = -1.0E10;
}
} else {
this.rotationMatrix.transformByInverse (this.xd);
this.rotationMatrix.transformByInverse (this.yd);
this.rotationMatrix.transformByInverse (this.zd);
}if (pass == 1) {
var dx = 0.0;
var dy = 0.0;
if ((this.stringJustification & 1) != 0) {
dx = x - this.fontMin[0];
} else if ((this.stringJustification & 2) != 0) {
dx = x - this.fontMax[0];
} else if ((this.stringJustification & 32) != 0) {
dx = x - 0.5 * (this.fontMax[0] + this.fontMin[0]);
}if ((this.stringJustification & 8) != 0) {
dy = y - this.fontMin[1];
} else if ((this.stringJustification & 4) != 0) {
dy = y - this.fontMax[1];
} else if ((this.stringJustification & 16) != 0) {
dy = y - 0.5 * (this.fontMax[1] + this.fontMin[1]);
}x += dx * this.xd.x;
y += dx * this.xd.y;
z += dx * this.xd.z;
x -= dy * this.yd.x;
y -= dy * this.yd.y;
z -= dy * this.yd.z;
x += this.charOffsets[0] * this.xd.x;
y += this.charOffsets[0] * this.xd.y;
z += this.charOffsets[0] * this.xd.z;
x -= this.charOffsets[1] * this.yd.x;
y -= this.charOffsets[1] * this.yd.y;
z -= this.charOffsets[1] * this.yd.z;
x += this.charOffsets[2] * this.zd.x;
y += this.charOffsets[2] * this.zd.y;
z += this.charOffsets[2] * this.zd.z;
}try {
var hersheyFont = this.getHersheyFont ("hershey.normal");
var shade = this.stringColor;
var stringLength = string.length;
var firstChar = 0;
if (string.charAt (0) == '<') {
firstChar = string.indexOf ('>') + 1;
}for (var i = firstChar; i < stringLength; i++) {
var c = string.charAt (i);
if (c == '\\') {
i++;
c = string.charAt (i);
hersheyFont = this.getHersheyFont ("hershey.greek");
} else {
hersheyFont = this.getHersheyFont ("hershey.normal");
}var xshift = this.drawHersheyChar3d (x, y, z, zoff, size, c, hersheyFont, shade, pass == 0 ? true : false, this.fontMin, this.fontMax);
x += xshift * this.xd.x;
y += xshift * this.xd.y;
z += xshift * this.xd.z;
}
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
System.out.println ("exception " + e);
} else {
throw e;
}
}
this.fontMin[0] -= this.fontRadius;
this.fontMin[1] -= this.fontRadius;
this.fontMax[0] += this.fontRadius;
this.fontMax[1] += this.fontRadius;
}
}, "~N,~N,~N,~N,~N,~N,~S");
Clazz.defineMethod (c$, "drawHersheyChar3d", 
 function (x, y, z, zoff, size, c, font, shade, measure, fmin, fmax) {
var s = font.get (c.charCodeAt (0) - 32);
var len = s.length;
var lm = ((s.charCodeAt (0) - 82)) * this.fontHeight;
var rm = ((s.charCodeAt (1) - 82)) * this.fontHeight;
x -= lm * this.xd.x;
y -= lm * this.xd.y;
z -= lm * this.xd.z;
var lastx = -1;
var lasty = -1;
var nextx = -1;
var nexty = -1;
for (var i = 2; i < len; i += 2) {
var c0 = s.charAt (i);
var c1 = s.charAt (i + 1);
if (c0 == ' ' && c1 == 'R') {
nextx = -1;
nexty = -1;
} else {
nextx = (c0.charCodeAt (0) - 82);
nexty = (c1.charCodeAt (0) - 82);
if (lastx != -1 || lasty != -1) {
var xnew = nextx * this.xd.x + nexty * this.yd.x;
var ynew = nextx * this.xd.y + nexty * this.yd.y;
var znew = nextx * this.xd.z + nexty * this.yd.z;
var xold = lastx * this.xd.x + lasty * this.yd.x;
var yold = lastx * this.xd.y + lasty * this.yd.y;
var zold = lastx * this.xd.z + lasty * this.yd.z;
var xstart = x + xnew * this.fontHeight + zoff * this.zd.x;
var ystart = y + ynew * this.fontHeight + zoff * this.zd.y;
var zstart = z + znew * this.fontHeight + zoff * this.zd.z;
var xstop = x + xold * this.fontHeight + zoff * this.zd.x;
var ystop = y + yold * this.fontHeight + zoff * this.zd.y;
var zstop = z + zold * this.fontHeight + zoff * this.zd.z;
if (measure) {
if (xstart > fmax[0]) fmax[0] = xstart;
if (ystart > fmax[1]) fmax[1] = ystart;
if (xstop > fmax[0]) fmax[0] = xstop;
if (ystop > fmax[1]) fmax[1] = ystop;
if (xstart < fmin[0]) fmin[0] = xstart;
if (ystart < fmin[1]) fmin[1] = ystart;
if (xstop < fmin[0]) fmin[0] = xstop;
if (ystop < fmin[1]) fmin[1] = ystop;
} else {
this.drawCylinder (xstart, ystart, zstart, xstop, ystop, zstop, shade, shade, this.fontRadius);
}}}lastx = nextx;
lasty = nexty;
}
return rm - lm;
}, "~N,~N,~N,~N,~N,~S,astex.util.DynamicArray,~N,~B,~A,~A");
Clazz.defineMethod (c$, "getHersheyFont", 
 function (name) {
var hersheyFont = this.hersheyHash.get (name);
if (hersheyFont == null) {
var hersheyFontName = astex.util.Settings.getString ("fonts", name);
var hf = astex.io.FILE.open (hersheyFontName);
if (hf == null) {
astex.util.Log.error ("couldn't open " + hersheyFontName);
return null;
}hersheyFont =  new astex.util.DynamicArray ();
while (hf.nextLine ()) {
var line = hf.getCurrentLineAsString ();
hersheyFont.add (line.substring (8));
}
hf.close ();
this.hersheyHash.put (name, hersheyFont);
}return hersheyFont;
}, "~S");
Clazz.defineMethod (c$, "setupString", 
 function (s, charOffsets) {
var fontname = null;
charOffsets[0] = 0.0;
charOffsets[1] = 0.0;
charOffsets[2] = 0.0;
this.stringJustification = 9;
this.stringColor = astex.util.Color32.white;
this.stringSize = 0.5;
this.stringRadius = this.hersheyRadius;
this.string3d = false;
this.colorDefined = false;
var stringPoints = this.defaultBitmapFontSize;
if (s.startsWith ("<")) {
var pos = s.indexOf ('>');
if (pos == -1) {
astex.util.Log.error ("unterminated string intro: no matching >");
} else {
var format = s.substring (1, pos);
var tokens = astex.io.FILE.split (format, ",");
if (format.indexOf ('=') != -1) {
for (var i = 0; i < tokens.length; i++) {
if (tokens[i].indexOf ('=') != -1) {
var bits = astex.io.FILE.split (tokens[i], "=");
var option = bits[0];
if (option.equals ("justify")) {
this.stringJustification = 0;
if (bits[1].indexOf ('l') != -1) {
this.stringJustification |= 1;
}if (bits[1].indexOf ('r') != -1) {
this.stringJustification |= 2;
}if (bits[1].indexOf ('t') != -1) {
this.stringJustification |= 4;
}if (bits[1].indexOf ('b') != -1) {
this.stringJustification |= 8;
}if (bits[1].indexOf ('v') != -1) {
this.stringJustification |= 16;
}if (bits[1].indexOf ('h') != -1) {
this.stringJustification |= 32;
}} else if (option.equals ("color") || option.equals ("colour")) {
this.stringColor = astex.util.Color32.getColorFromName (bits[1]);
this.colorDefined = true;
} else if (option.equals ("points")) {
stringPoints = astex.io.FILE.readInteger (bits[1]);
} else if (option.equals ("size")) {
this.stringSize = astex.io.FILE.readDouble (bits[1]);
} else if (option.equals ("radius")) {
this.stringRadius = astex.io.FILE.readDouble (bits[1]);
} else if (option.equals ("xoff")) {
charOffsets[0] = astex.io.FILE.readDouble (bits[1]);
} else if (option.equals ("yoff")) {
charOffsets[1] = astex.io.FILE.readDouble (bits[1]);
} else if (option.equals ("zoff")) {
charOffsets[2] = astex.io.FILE.readDouble (bits[1]);
} else if (option.equals ("font")) {
fontname = bits[1];
} else if (option.equals ("3d")) {
this.string3d = bits[1].startsWith ("t");
} else {
astex.util.Log.error ("unrecognized font keyword " + tokens[i]);
}}}
} else {
if (tokens.length == 1) {
fontname = tokens[0];
} else if (tokens.length == 2) {
charOffsets[0] = astex.io.FILE.readDouble (tokens[0]);
charOffsets[1] = astex.io.FILE.readDouble (tokens[1]);
} else if (tokens.length == 3) {
charOffsets[0] = astex.io.FILE.readDouble (tokens[0]);
charOffsets[1] = astex.io.FILE.readDouble (tokens[1]);
fontname = tokens[2];
} else {
}}}}if (this.string3d == false) {
this.romanBitmapFont = astex.io.FILE.getFont ("arial." + stringPoints, this.bitmapFonts);
this.greekBitmapFont = astex.io.FILE.getFont ("symbol." + stringPoints, this.bitmapFonts);
}}, "~S,~A");
Clazz.defineMethod (c$, "drawZImage", 
function (x, y, z, pix, w, h) {
}, "~N,~N,~N,~A,~N,~N");
Clazz.defineMethod (c$, "drawDot", 
function (xt, yt, zt, c) {
if (((zt) >= this.backClip && (zt) <= this.frontClip)) {
var shade = this.depthCueColor (c, zt);
xt >>= 12;
yt >>= 12;
this.setPixel4 (xt, yt, zt, shade);
this.setPixel4 (xt + 1, yt, zt, shade);
this.setPixel4 (xt, yt + 1, zt, shade);
this.setPixel4 (xt + 1, yt + 1, zt, shade);
}}, "~N,~N,~N,~N");
Clazz.defineMethod (c$, "setPixel4", 
function (x, y, z, c) {
if (x >= 0 && x < this.pixelWidth && y >= 0 && y < this.pixelHeight) {
var pos = (y * this.pixelWidth + x);
if (this.zbuffer[pos] < z) {
this.pbuffer[pos] = c;
this.zbuffer[pos] = z;
}}}, "~N,~N,~N,~N");
Clazz.defineMethod (c$, "setPixel3", 
function (x, y, c) {
if (x >= 0 && x < this.pixelWidth && y >= 0 && y < this.pixelHeight) {
var pos = (y * this.pixelWidth + x);
this.pbuffer[pos] = c;
}}, "~N,~N,~N");
Clazz.defineMethod (c$, "getPixel", 
function (x, y) {
if (x >= 0 && x < this.pixelWidth && y >= 0 && y < this.pixelHeight) {
var pos = (y * this.pixelWidth + x);
return this.pbuffer[pos];
}return 0;
}, "~N,~N");
Clazz.defineMethod (c$, "drawLineT", 
 function (tmesh, v1, v2, rgb1, rgb2, pixelWidth) {
var outCode1 = (this.clipped[v1]).charCodeAt (0);
var outCode2 = (this.clipped[v2]).charCodeAt (0);
var rgb1shade = 0;
var rgb2shade = 0;
if (false && this.shadowMode != 0) {
this.drawCylinder (tmesh.x[v1], tmesh.y[v1], tmesh.z[v1], tmesh.x[v2], tmesh.y[v2], tmesh.z[v2], rgb1, rgb2, pixelWidth * 0.02);
return;
}if (this.antialias) {
pixelWidth *= 2;
}if (pixelWidth > 3) {
pixelWidth = 3;
}var x1 = this.xt[v1] >> 12;
var y1 = this.yt[v1] >> 12;
var z1 = this.zt[v1];
var x2 = this.xt[v2] >> 12;
var y2 = this.yt[v2] >> 12;
var z2 = this.zt[v2];
var zc = Clazz.doubleToInt ((z1 + z2) / 2);
var scale = 255;
if (!this.depthcue) {
if (zc > this.frontClip) {
scale = 255;
} else if (zc < this.backClip) {
scale = 0;
} else {
scale = Clazz.doubleToInt (255 * (zc - this.backClip) / (this.frontClip - this.backClip));
}rgb1shade = this.depthCueColor (rgb1, zc);
if (rgb1 != rgb2) {
rgb2shade = this.depthCueColor (rgb2, zc);
}} else {
rgb1shade = rgb1;
rgb2shade = rgb2;
}if (outCode1 == 0 && outCode2 == 0) {
if (rgb1 == rgb2) {
if (pixelWidth == 1) {
if (this.wuAntiAlias) {
this.drawAntiAliasedLine (x1, y1, z1, x2, y2, z2, rgb1shade, rgb1shade);
} else {
this.drawFastIntegerLine (x1, y1, z1, x2, y2, z2, rgb1shade);
}} else {
this.drawWideIntegerLine (x1, y1, z1, x2, y2, z2, rgb1shade, pixelWidth);
}} else {
var xc = Clazz.doubleToInt ((x1 + x2) / 2);
var yc = Clazz.doubleToInt ((y1 + y2) / 2);
if (pixelWidth == 1) {
if (this.wuAntiAlias) {
this.drawAntiAliasedLine (x1, y1, z1, xc, yc, zc, rgb1shade, rgb1shade);
this.drawAntiAliasedLine (xc, yc, zc, x2, y2, z2, rgb2shade, rgb2shade);
} else {
this.drawFastIntegerLine (x1, y1, z1, xc, yc, zc, rgb1shade);
this.drawFastIntegerLine (xc, yc, zc, x2, y2, z2, rgb2shade);
}} else {
this.drawWideIntegerLine (x1, y1, z1, xc, yc, zc, rgb1shade, pixelWidth);
this.drawWideIntegerLine (xc, yc, zc, x2, y2, z2, rgb2shade, pixelWidth);
}}} else if ((outCode1 & outCode2) == 0) {
if (rgb1 == rgb2) {
if (pixelWidth == 1) {
if (this.wuAntiAlias) {
this.drawAntiAliasedLine (x1, y1, z1, x2, y2, z2, rgb1shade, rgb1shade);
} else {
this.drawSafeIntegerLine (x1, y1, z1, x2, y2, z2, rgb1shade);
}} else {
this.drawWideIntegerLine (x1, y1, z1, x2, y2, z2, rgb1shade, pixelWidth);
}} else {
var xc = Clazz.doubleToInt ((x1 + x2) / 2);
var yc = Clazz.doubleToInt ((y1 + y2) / 2);
if (pixelWidth == 1) {
if (this.wuAntiAlias) {
this.drawAntiAliasedLine (x1, y1, z1, xc, yc, zc, rgb1shade, rgb1shade);
this.drawAntiAliasedLine (xc, yc, zc, x2, y2, z2, rgb2shade, rgb2shade);
} else {
this.drawSafeIntegerLine (x1, y1, z1, xc, yc, zc, rgb1shade);
this.drawSafeIntegerLine (xc, yc, zc, x2, y2, z2, rgb2shade);
}} else {
this.drawWideIntegerLine (x1, y1, z1, xc, yc, zc, rgb1shade, pixelWidth);
this.drawWideIntegerLine (xc, yc, zc, x2, y2, z2, rgb2shade, pixelWidth);
}}}}, "astex.render.Tmesh,~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "drawCross", 
function (x, y, z, len, isBackbone) {
var rgb = 0x8000;
if (isBackbone) rgb = 0x80;
var width = Clazz.doubleToInt (this.pixelWidth / 300);
if (width < 2) width = 2;
if (this.getSamples () == 1) len *= 2;
this.drawLineD (x - len, y, z, x + len, y, z, rgb, rgb, width);
this.drawLineD (x, y - len, z, x, y + len, z, rgb, rgb, width);
this.drawLineD (x, y, z - len, x, y, z + len, rgb, rgb, width);
}, "~N,~N,~N,~N,~B");
Clazz.defineMethod (c$, "drawLineD", 
function (x1, y1, z1, x2, y2, z2, rgb1, rgb2, pixelWidth) {
this.applyTransform (x1, y1, z1, this.vx1);
this.applyTransform (x2, y2, z2, this.vx2);
this.drawLineI (Clazz.doubleToInt (this.vx1[0]) << 12, Clazz.doubleToInt (this.vx1[1]) << 12, Clazz.doubleToInt (this.vx1[2] * (1048576)), Clazz.doubleToInt (this.vx2[0]) << 12, Clazz.doubleToInt (this.vx2[1]) << 12, Clazz.doubleToInt (this.vx2[2] * (1048576)), rgb1, rgb2, pixelWidth);
}, "~N,~N,~N,~N,~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "drawLineI", 
function (x1, y1, z1, x2, y2, z2, rgb1, rgb2, lineWidth) {
var outCode1 = 0;
var outCode2 = 0;
var rgb1shade = 0;
var rgb2shade = 0;
if (this.antialias) {
lineWidth *= 2;
}if (lineWidth > 7) {
lineWidth = 7;
}x1 >>= 12;
x2 >>= 12;
y1 >>= 12;
y2 >>= 12;
if (x1 < 0) outCode1 |= astex.render.Renderer.XMinClip;
 else if (x1 >= this.pixelWidth) outCode1 |= astex.render.Renderer.XMaxClip;
if (y1 < 0) outCode1 |= astex.render.Renderer.YMinClip;
 else if (y1 >= this.pixelHeight) outCode1 |= astex.render.Renderer.YMaxClip;
if (z1 < this.backClip) outCode1 |= astex.render.Renderer.ZMinClip;
 else if (z1 > this.frontClip) outCode1 |= astex.render.Renderer.ZMaxClip;
if (x2 < 0) outCode2 |= astex.render.Renderer.XMinClip;
 else if (x2 >= this.pixelWidth) outCode2 |= astex.render.Renderer.XMaxClip;
if (y2 < 0) outCode2 |= astex.render.Renderer.YMinClip;
 else if (y2 >= this.pixelHeight) outCode2 |= astex.render.Renderer.YMaxClip;
if (z2 < this.backClip) outCode2 |= astex.render.Renderer.ZMinClip;
 else if (z2 > this.frontClip) outCode2 |= astex.render.Renderer.ZMaxClip;
var zc = Clazz.doubleToInt ((z1 + z2) / 2);
if (!this.depthcue) {
rgb1shade = this.depthCueColor (rgb1, z1);
if (rgb1 != rgb2) {
rgb2shade = this.depthCueColor (rgb2, z2);
}} else {
rgb1shade = rgb1;
rgb2shade = rgb2;
}if (outCode1 == 0 && outCode2 == 0) {
if (rgb1 == rgb2) {
if (lineWidth == 1) {
if (this.wuAntiAlias) {
this.drawAntiAliasedLine (x1, y1, z1, x2, y2, z2, rgb1shade, rgb1shade);
} else {
this.drawFastIntegerLine (x1, y1, z1, x2, y2, z2, rgb1shade);
}} else {
this.drawWideIntegerLine (x1, y1, z1, x2, y2, z2, rgb1shade, lineWidth);
}} else {
var xc = Clazz.doubleToInt ((x1 + x2) / 2);
var yc = Clazz.doubleToInt ((y1 + y2) / 2);
if (lineWidth == 1) {
if (this.wuAntiAlias) {
this.drawAntiAliasedLine (x1, y1, z1, x2, y2, z2, rgb1shade, rgb2shade);
} else {
this.drawFastIntegerLine (x1, y1, z1, xc, yc, zc, rgb1shade);
this.drawFastIntegerLine (xc, yc, zc, x2, y2, z2, rgb2shade);
}} else {
this.drawWideIntegerLine (x1, y1, z1, xc, yc, zc, rgb1shade, lineWidth);
this.drawWideIntegerLine (xc, yc, zc, x2, y2, z2, rgb2shade, lineWidth);
}}} else if ((outCode1 & outCode2) == 0) {
if (rgb1 == rgb2) {
if (lineWidth == 1) {
if (this.wuAntiAlias) {
this.drawAntiAliasedLine (x1, y1, z1, x2, y2, z2, rgb1shade, rgb1shade);
} else {
this.drawSafeIntegerLine (x1, y1, z1, x2, y2, z2, rgb1shade);
}} else {
this.drawWideIntegerLine (x1, y1, z1, x2, y2, z2, rgb1shade, lineWidth);
}} else {
var xc = Clazz.doubleToInt ((x1 + x2) / 2);
var yc = Clazz.doubleToInt ((y1 + y2) / 2);
if (lineWidth == 1) {
if (this.wuAntiAlias) {
this.drawAntiAliasedLine (x1, y1, z1, x2, y2, z2, rgb1shade, rgb2shade);
} else {
this.drawSafeIntegerLine (x1, y1, z1, xc, yc, zc, rgb1shade);
this.drawSafeIntegerLine (xc, yc, zc, x2, y2, z2, rgb2shade);
}} else {
this.drawWideIntegerLine (x1, y1, z1, xc, yc, zc, rgb1shade, lineWidth);
this.drawWideIntegerLine (xc, yc, zc, x2, y2, z2, rgb2shade, lineWidth);
}}}}, "~N,~N,~N,~N,~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "setDrawGamma", 
function (d) {
this.gamma_table = null;
this.drawGamma = d;
}, "~N");
Clazz.defineMethod (c$, "initialiseGammaTable", 
function () {
if (this.gamma_table == null) {
this.gamma_table =  Clazz.newIntArray (256, 0);
for (var i = 0; i < 256; i++) {
this.gamma_table[i] = Clazz.doubleToInt ((255) * Math.pow (i / ((255)), 1.0 / this.drawGamma));
}
}});
Clazz.defineMethod (c$, "drawAntiAliasedLine", 
function (x0, y0, z0, x1, y1, z1, Colour0, Colour1) {
if (this.gamma_table == null) {
this.initialiseGammaTable ();
}var dx;
var dy;
var dz;
var xDir;
var z;
if (y0 > y1) {
var swap = y0;
y0 = y1;
y1 = swap;
swap = x0;
x0 = x1;
x1 = swap;
swap = Colour0;
Colour0 = Colour1;
Colour1 = swap;
swap = z0;
z0 = z1;
z1 = swap;
}dx = x1 - x0;
dy = y1 - y0;
if (dx >= 0) {
xDir = 1;
} else {
xDir = -1;
dx = -dx;
}var Colour = Colour0;
if (dx == 0) {
var ym = (y0 + y1) >> 1;
dz = dy != 0 ? Clazz.doubleToInt ((z1 - z0) / dy) : 0;
z = z0;
for (var py = y0 + 1; py <= ym; py++) {
this.blendPixel (x0, py, z, Colour0, 255);
z += dz;
}
for (var py = ym + 1; py < y1; py++) {
this.blendPixel (x0, py, z, Colour1, 255);
z += dz;
}
return;
}if (dy == 0) {
if (x0 > x1) {
var swap = x0;
x0 = x1;
x1 = swap;
swap = Colour0;
Colour0 = Colour1;
Colour1 = swap;
swap = z0;
z0 = z1;
z1 = swap;
}var xm = (x0 + x1) >> 1;
dz = (dx != 0) ? Clazz.doubleToInt ((z1 - z0) / dx) : 0;
z = z0;
for (var px = x0 + 1; px <= xm; px++) {
this.blendPixel (px, y0, z, Colour0, 255);
z += dz;
}
for (var px = xm + 1; px < x1; px++) {
this.blendPixel (px, y0, z, Colour1, 255);
z += dz;
}
return;
}var dx2 = dx >> 1;
var dy2 = dy >> 1;
this.blendPixel (x0, y0, z0, Colour0, 255);
this.blendPixel (x1, y1, z1, Colour1, 255);
var ErrorAcc = 0;
var Transparency;
if (dy > dx) {
dz = dy != 0 ? Clazz.doubleToInt ((z1 - z0) / dy) : 0;
z = z0;
var ErrorAdj = Clazz.doubleToInt ((dx << 16) / dy);
if (xDir < 0) {
while (--dy != 0) {
if (dy <= dy2) {
Colour = Colour1;
}ErrorAcc += ErrorAdj;
++y0;
x1 = x0 - (ErrorAcc >> 16);
Transparency = (ErrorAcc >> 8);
this.blendPixel (x1, y0, z, Colour, ~Transparency);
this.blendPixel (x1 - 1, y0, z, Colour, Transparency);
z += dz;
}
} else {
while (--dy != 0) {
if (dy <= dy2) {
Colour = Colour1;
}ErrorAcc += ErrorAdj;
++y0;
x1 = x0 + (ErrorAcc >> 16);
Transparency = ErrorAcc >> 8;
this.blendPixel (x1, y0, z, Colour, ~Transparency);
this.blendPixel (x1 + xDir, y0, z, Colour, Transparency);
z += dz;
}
}} else {
dz = dx != 0 ? Clazz.doubleToInt ((z1 - z0) / dx) : 0;
z = z0;
var ErrorAdj = Clazz.doubleToInt ((dy << 16) / dx);
while (--dx != 0) {
if (dx <= dx2) {
Colour = Colour1;
}ErrorAcc += ErrorAdj;
x0 += xDir;
y1 = y0 + (ErrorAcc >> 16);
Transparency = ErrorAcc >> 8;
this.blendPixel (x0, y1, z, Colour, ~Transparency);
this.blendPixel (x0, y1 + 1, z, Colour, Transparency);
z += dz;
}
}}, "~N,~N,~N,~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "blendPixel", 
function (x, y, z, c, transp) {
if (x < 0 || y < 0 || x >= this.pixelWidth || y >= this.pixelHeight) return;
var p = (y * this.pixelWidth + x);
if (((z) >= this.backClip && (z) <= this.frontClip) && z > this.zbuffer[p]) {
var bg = this.pbuffer[p];
transp &= 0xff;
transp = this.gamma_table[transp];
var fg = astex.util.Color32.scale (c, transp);
var rbg = (bg >> 16) & 0xff;
var gbg = (bg >> 8) & 0xff;
var bbg = (bg & 0xff);
var rfg = (fg >> 16) & 0xff;
var gfg = (fg >> 8) & 0xff;
var bfg = (fg & 0xff);
c = astex.util.Color32.pack ((rbg > rfg) ? rbg : rfg, (gbg > gfg) ? gbg : gfg, (bbg > bfg) ? bbg : bfg);
this.pbuffer[p] = c;
this.zbuffer[p] = z;
}}, "~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "blendPixel2", 
function (x, y, z, c, transp) {
var p = (y * this.pixelWidth + x);
if (z > this.zbuffer[p] && z < this.frontClip) {
var bg = this.pbuffer[p];
transp &= 0xff;
var fg = astex.util.Color32.scale (c, transp);
this.pbuffer[p] = astex.util.Color32.add (fg, bg);
}}, "~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "renderSphereObject", 
 function (tmesh) {
var sphereCount = tmesh.np;
for (var i = 0; i < sphereCount; i++) {
var c0 = 0;
if (tmesh.colorStyle == 1) {
c0 = tmesh.color;
} else if (tmesh.colorStyle == 3) {
c0 = tmesh.vcolor[i];
} else {
c0 = tmesh.vcolor[i];
}this.drawSphere (tmesh.x[i], tmesh.y[i], tmesh.z[i], tmesh.nx[i], c0);
}
}, "astex.render.Tmesh");
Clazz.defineMethod (c$, "renderDotObject", 
 function (tmesh) {
var dotCount = tmesh.np;
for (var i = 0; i < dotCount; i++) {
this.drawDot (this.xt[i], this.yt[i], this.zt[i], tmesh.vcolor[i]);
}
}, "astex.render.Tmesh");
Clazz.defineMethod (c$, "renderCylinderObject", 
 function (tmesh) {
var cylinderCount = tmesh.nt;
for (var i = 0; i < cylinderCount; i++) {
var p0 = tmesh.t0[i];
var p1 = tmesh.t1[i];
var c0 = 0;
var c1 = 0;
if (tmesh.colorStyle == 1) {
c0 = tmesh.color;
c1 = tmesh.color;
} else {
c0 = tmesh.vcolor[p0];
c1 = tmesh.vcolor[p1];
}this.drawCylinder (tmesh.x[p0], tmesh.y[p0], tmesh.z[p0], tmesh.x[p1], tmesh.y[p1], tmesh.z[p1], c0, c1, tmesh.nx[p0]);
}
}, "astex.render.Tmesh");
Clazz.defineMethod (c$, "drawLineObject", 
 function (tm) {
var nt = tm.nt;
var lineWidth = tm.getLineWidth ();
for (var i = 0; i < nt; i++) {
var v0 = tm.t0[i];
var v1 = tm.t1[i];
if (lineWidth < 0.0) {
var iw = Clazz.doubleToInt (-lineWidth + 0.5);
if (tm.vcolor[v0] == 0 && tm.vcolor[v1] == 0) {
this.drawLineT (tm, v0, v1, tm.color, tm.color, iw);
} else {
this.drawLineT (tm, v0, v1, tm.vcolor[v0], tm.vcolor[v1], iw);
}} else {
if (tm.vcolor[v0] == 0 && tm.vcolor[v1] == 0) {
this.drawCylinder (tm.x[v0], tm.y[v0], tm.z[v0], tm.x[v1], tm.y[v1], tm.z[v1], tm.color, tm.color, lineWidth);
} else {
this.drawCylinder (tm.x[v0], tm.y[v0], tm.z[v0], tm.x[v1], tm.y[v1], tm.z[v1], tm.vcolor[v0], tm.vcolor[v1], lineWidth);
}}}
}, "astex.render.Tmesh");
Clazz.defineMethod (c$, "privateRedraw", 
 function () {
this.clearBuffers ();
this.buildOverallMatrix ();
this.drawObjectsIgnoreTransparency (1);
});
Clazz.defineMethod (c$, "publicRedraw", 
function () {
});
Clazz.defineMethod (c$, "setupAntiAlias", 
 function () {
if (this.antialiasModeChanged) {
if (this.antialias) {
this.realw = this.pixelWidth;
this.realh = this.pixelHeight;
this.pixelWidth = this.realw * 2;
this.pixelHeight = this.realh * 2;
this.pixelCount = this.pixelWidth * this.pixelHeight;
if (this.apbuffer == null || this.apbuffer.length < this.pixelCount) {
this.apbuffer =  Clazz.newIntArray (this.pixelCount, 0);
this.azbuffer =  Clazz.newIntArray (this.pixelCount, 0);
}this.opbuffer = this.pbuffer;
this.ozbuffer = this.zbuffer;
this.pbuffer = this.apbuffer;
this.zbuffer = this.azbuffer;
} else {
if (this.opbuffer != null) {
this.pbuffer = this.opbuffer;
this.zbuffer = this.ozbuffer;
this.pixelWidth = this.realw;
this.pixelHeight = this.realh;
this.pixelCount = this.pixelWidth * this.pixelHeight;
this.opbuffer = null;
this.ozbuffer = null;
}}this.antialiasModeChanged = false;
}});
Clazz.defineMethod (c$, "redraw", 
function () {
this.triangleRaysIntersected = 0;
this.triangleRaysCast = 0;
if (this.shadowMode == 1) {
astex.render.Renderer.getShadowCache ().clearShadowCaches ();
} else if (this.shadowMode == 2) {
astex.render.Renderer.getShadowCache ().setupShadowCaches (this.lights.get (0), this.getOverallScale ());
}this.zmin = 2147483647;
this.zmax = -2147483648;
this.setupAntiAlias ();
this.privateRedraw ();
this.publicRedraw ();
this.frameCount++;
});
Clazz.defineMethod (c$, "drawLogo", 
 function () {
if (this.logo != null) {
this.drawDirectString (4, 12, astex.util.Color32.white, this.logo);
}});
Clazz.defineMethod (c$, "setDisplayStatusString", 
function (b) {
this.displayStatusString = b;
}, "~B");
Clazz.defineMethod (c$, "drawStatusString", 
 function () {
if (this.displayStatusString) {
if (this.statusString != null) {
var stringColor = astex.util.Color32.black;
if (this.background == astex.util.Color32.black) stringColor = astex.util.Color32.white;
this.drawDirectString (3, this.pixelHeight - 3, stringColor, this.statusString);
}}});
Clazz.defineMethod (c$, "setDrawSizeBar", 
function (sb) {
if (sb) {
this.displaySizeBar = 1;
} else {
this.displaySizeBar = 0;
}}, "~B");
Clazz.defineMethod (c$, "setDrawSizeBarOnly", 
function (sbo) {
if (sbo) {
this.displaySizeBar = 2;
} else {
this.displaySizeBar = 0;
}}, "~B");
Clazz.defineMethod (c$, "calcSizeBar", 
 function () {
var r = this.getRadius ();
var sz;
if (r < 20.0) {
sz = 0.1;
} else if (r < 50.0) {
sz = 0.2;
} else if (r < 100.0) {
sz = 0.5;
} else if (r < 200.0) {
sz = 1;
} else if (r < 500.0) {
sz = 2;
} else if (r < 1000.0) {
sz = 5;
} else if (r < 2000.0) {
sz = 10;
} else if (r < 5000.0) {
sz = 20;
} else if (r < 10000.0) {
sz = 50;
} else if (r < 20000.0) {
sz = 100;
} else if (r < 50000.0) {
sz = 200;
} else if (r < 100000.0) {
sz = 500;
} else {
sz = 1000;
}return sz;
});
Clazz.defineMethod (c$, "drawSizeBar", 
 function () {
if (this.displaySizeBar > 0) {
var sz = this.calcSizeBar ();
var pos = Clazz.doubleToInt (this.pixelWidth / 100);
if (pos < 1) pos = 1;
var sbColor = astex.util.Color32.black;
if (this.background == astex.util.Color32.black) sbColor = astex.util.Color32.white;
var sizeBarInfo = Double.toString (sz) + " nm";
if (this.displaySizeBar == 1) {
this.drawDirectString (pos, this.pixelHeight - pos, sbColor, sizeBarInfo);
}var len = Clazz.doubleToInt (10 * sz * this.pixelWidth / this.getRadius ());
var width = Clazz.doubleToInt (this.pixelWidth / 300);
if (width < 1) width = 1;
this.drawWideBar (pos, this.pixelHeight - 5 * pos, sbColor, len, width);
}});
Clazz.defineMethod (c$, "getSizeBarString", 
function () {
var sbString = "";
if (this.displaySizeBar == 2) {
var sz = this.calcSizeBar ();
sbString = Double.toString (sz) + " nm";
}return sbString;
});
Clazz.defineMethod (c$, "setLogo", 
function (newLogo) {
this.logo = newLogo;
}, "~S");
Clazz.defineMethod (c$, "getLogo", 
function () {
return this.logo;
});
Clazz.defineMethod (c$, "setStatusString", 
function (newStatusString) {
this.statusString = newStatusString;
}, "~S");
Clazz.defineMethod (c$, "getStatusString", 
function () {
return this.statusString;
});
Clazz.defineMethod (c$, "setSize", 
function (width, height) {
this.pixelWidth = width;
this.pixelHeight = height;
this.pixelCount = this.pixelWidth * this.pixelHeight;
if (this.pbuffer == null || this.pbuffer.length < this.pixelCount || this.antialias) {
this.pbuffer =  Clazz.newIntArray (this.pixelCount, 0);
this.zbuffer =  Clazz.newIntArray (this.pixelCount, 0);
this.antialiasModeChanged = true;
}}, "~N,~N");
Clazz.defineMethod (c$, "setSamples", 
function (s) {
this.samples = s;
}, "~N");
Clazz.defineMethod (c$, "getSamples", 
function () {
return this.samples;
});
Clazz.defineMethod (c$, "initialiseColorMaps", 
 function () {
if (this.colorMap == null) this.colorMap =  Clazz.newIntArray (65536, 0);
if (this.intensityMap == null) this.intensityMap =  Clazz.newIntArray (65536, 0);
if (this.diffuseMap == null) this.diffuseMap =  Clazz.newIntArray (65536, 0);
if (this.highlightMap == null) this.highlightMap =  Clazz.newIntArray (65536, 0);
if (this.shadowMap == null) this.shadowMap =  Clazz.newIntArray (65536, 0);
if (this.colorMapCache == null) this.colorMapCache =  Clazz.newIntArray (astex.render.Renderer.colorMapCacheSize, 0);
if (this.colorMapCacheColor == null) this.colorMapCacheColor =  Clazz.newIntArray (astex.render.Renderer.colorMapCacheSize, 0);
});
Clazz.defineMethod (c$, "setColor", 
function (newc) {
if (this.colorMap == null) {
this.initialiseColorMaps ();
}if (newc == this.color) return;
if (!this.lightMapCalculated) {
this.calculateLightMap ();
}this.color = newc;
this.colorInitialised = false;
for (var i = 0; i < this.colorMapCacheCount; i++) {
if (this.colorMapCacheColor[i] == newc) {
this.colorMap = this.colorMapCache[i];
this.colorInitialised = true;
return;
}}
var slot = -1;
if (this.colorMapCacheCount < astex.render.Renderer.colorMapCacheSize) {
slot = this.colorMapCacheCount++;
} else {
slot = 0;
this.colorMapCacheMisses++;
if ((this.colorMapCacheMisses % 100) == 0) {
System.out.println ("color map cache misses " + this.colorMapCacheMisses);
}}this.colorMap =  Clazz.newIntArray (65536, 0);
this.colorMapCache[slot] = this.colorMap;
this.colorMapCacheColor[slot] = newc;
this.initialiseColor ();
}, "~N");
Clazz.defineMethod (c$, "lightVertex", 
 function (v) {
var lutID = (((v.nx) >> 12) + (((v.ny) >> 12) << 8));
var color = this.colorMap[lutID];
v.r = ((color >> 16) & 255) << 12;
v.g = ((color >> 8) & 255) << 12;
v.b = ((color) & 255) << 12;
}, "astex.render.Vertex");
Clazz.defineMethod (c$, "vertexColor", 
 function (v, color) {
v.r = ((color >> 16) & 255) << 12;
v.g = ((color >> 8) & 255) << 12;
v.b = ((color) & 255) << 12;
}, "astex.render.Vertex,~N");
Clazz.defineMethod (c$, "drawRdcAxes", 
function (m) {
if (!m.showRdcAxes) {
return;
}var rdcColours = [astex.util.Color32.rdcz, astex.util.Color32.rdcy, astex.util.Color32.rdcx];
for (var i = 0; i < 3; i++) {
var x = m.rdcAxes[3 * i];
var y = m.rdcAxes[3 * i + 1];
var z = m.rdcAxes[3 * i + 2];
var molX = m.matrix[0] * x + m.matrix[3] * y + m.matrix[6] * z;
var molY = m.matrix[1] * x + m.matrix[4] * y + m.matrix[7] * z;
var molZ = m.matrix[2] * x + m.matrix[5] * y + m.matrix[8] * z;
var RDCx = 0.4 * this.getRadius () * molX;
var RDCy = 0.4 * this.getRadius () * molY;
var RDCz = 0.4 * this.getRadius () * molZ;
var RDCc = rdcColours[i % 3];
this.drawCylinder (-RDCx, -RDCy, -RDCz, RDCx, RDCy, RDCz, RDCc, RDCc, 0.5);
}
}, "astex.model.Molecule");
Clazz.defineMethod (c$, "doAntialiasForImage", 
function () {
var w = this.pixelWidth;
var h = this.pixelHeight;
var sample = this.samples;
var wa = Clazz.doubleToInt (w / sample);
var ha = Clazz.doubleToInt (h / sample);
var pa = wa * ha;
var tempBuffer =  Clazz.newIntArray (pa, 0);
var indexa = 0;
var sample2 = sample * sample;
for (var j = 0; j < ha; j++) {
for (var i = 0; i < wa; i++) {
var r = 0;
var g = 0;
var b = 0;
for (var iys = 0; iys < sample; iys++) {
var iy = j * sample + iys;
for (var ixs = 0; ixs < sample; ixs++) {
var ix = i * sample + ixs;
var index = ix + w * iy;
var rgb = this.pbuffer[index];
var rp = (rgb >> 16) & 0xff;
var gp = (rgb >> 8) & 0xff;
var bp = (rgb & 0xff);
r += rp;
g += gp;
b += bp;
}
}
r /= sample2;
g /= sample2;
b /= sample2;
tempBuffer[indexa] = astex.util.Color32.pack (r, g, b);
indexa++;
}
}
return tempBuffer;
});
c$.fastSqrt = Clazz.defineMethod (c$, "fastSqrt", 
 function (d) {
try {
if (astex.render.Renderer.sqrtTable == null) {
astex.render.Renderer.sqrtTable =  Clazz.newDoubleArray (10000, 0);
for (var i = 0; i < 10000; i++) {
astex.render.Renderer.sqrtTable[i] = Math.sqrt (i);
}
}return astex.render.Renderer.sqrtTable[Clazz.doubleToInt (d)];
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
return Math.sqrt (d);
} else {
throw e;
}
}
}, "~N");
Clazz.defineMethod (c$, "calculateLightMap", 
function () {
if (false) {
if (this.firstTime) {
System.out.println ("initialising light tables... 65536 Entries");
}}for (var i = 0; i < 32; i++) {
this.szCache[i] = null;
this.scCache[i] = null;
}
for (var i = 0; i < astex.render.Renderer.colorMapCacheSize; i++) {
this.colorMapCache[i] = null;
}
this.cacheCount = 0;
this.colorMapCacheCount = 0;
this.color = 0;
var dnx;
var dny;
var dnz;
var angle;
var tableEntry = 0;
var dmap = this.diffuseMap;
var smap = this.highlightMap;
var imap = this.intensityMap;
var shadowrgb =  Clazz.newIntArray (3, 0);
var drgb =  Clazz.newIntArray (3, 0);
var srgb =  Clazz.newIntArray (3, 0);
for (var ny = -128; ny < 128; ny++) {
dny = ny / 128;
for (var nx = -128; nx < 128; nx++) {
tableEntry = (nx + 128) + ((ny + 128) * (256));
dnx = nx / 128;
dnz = 1.0 - Math.sqrt (dnx * dnx + dny * dny);
if (this.lightingModel == 1) {
drgb[0] = drgb[1] = drgb[2] = 255;
srgb[0] = srgb[1] = srgb[2] = 0;
shadowrgb[0] = shadowrgb[1] = shadowrgb[2] = 128;
if (dnz < this.cartoonNormalCutoff) {
drgb[0] = drgb[1] = drgb[2] = 0;
shadowrgb[0] = shadowrgb[1] = shadowrgb[2] = 0;
}} else {
this.generateColour (dnx, dny, dnz, drgb, srgb, shadowrgb);
}imap[tableEntry] = Clazz.doubleToInt ((drgb[0] + drgb[1] + drgb[2]) / 3);
dmap[tableEntry] = astex.util.Color32.getClampColor (drgb[0], drgb[1], drgb[2]);
smap[tableEntry] = astex.util.Color32.getClampColor (srgb[0], srgb[1], srgb[2]);
this.shadowMap[tableEntry] = astex.util.Color32.getClampColor (shadowrgb[0], shadowrgb[1], shadowrgb[2]);
}
}
this.lightMapCalculated = true;
if (false) {
if (this.firstTime) {
System.out.println ("done");
this.firstTime = false;
}}});
Clazz.defineMethod (c$, "setPowFactor", 
function (d) {
this.powFactor = d;
this.lightMapCalculated = false;
this.cacheCount = 0;
}, "~N");
Clazz.defineMethod (c$, "setWrapAngle", 
function (d) {
this.wrapAngle = d;
this.cosWrapAngle = Math.cos (this.wrapAngle);
this.lightMapCalculated = false;
this.cacheCount = 0;
}, "~N");
Clazz.defineMethod (c$, "generateColour", 
 function (nx, ny, nz, drgb, srgb, shadowrgb) {
srgb[0] = 0;
srgb[1] = 0;
srgb[2] = 0;
shadowrgb[0] = this.ambientr;
shadowrgb[1] = this.ambientg;
shadowrgb[2] = this.ambientb;
drgb[0] = this.ambientr;
drgb[1] = this.ambientg;
drgb[2] = this.ambientb;
if (this.wrapAngle < 0.0) {
var w = astex.util.Settings.getDouble ("config", "wrapangle");
w *= 0.017453292519943295;
this.setWrapAngle (w);
}for (var i = 0; i < this.lights.size (); i++) {
var l = this.lights.get (i);
if (l.on) {
var diffuse = l.diffuse;
var specular = l.specular;
if (nz > 1.0) nz = 1.0;
var len = Math.sqrt (nx * nx + ny * ny + nz * nz);
nx /= len;
ny /= len;
nz /= len;
var cos = astex.render.Renderer.cos (l.pos[0], l.pos[1], l.pos[2], nx, ny, nz);
if (this.powFactor < 1.0) {
cos = Math.pow (cos, this.powFactor);
}var dcos = cos;
if (this.wrapAngle > 1.5707963267948966) {
dcos = 1.0 - Math.acos (cos) / this.wrapAngle;
dcos = (dcos > 0) ? dcos : 0;
} else {
dcos = (cos > 0) ? cos : 0;
}var phong = 0.0;
if (Math.abs (l.power) < 0.1) {
phong = 0.0;
} else {
phong = Math.abs (Math.pow (cos, l.power));
}for (var comp = 0; comp < 3; comp++) {
drgb[comp] += Clazz.doubleToInt (astex.util.Color32.getComponent (diffuse, comp) * dcos);
if (i != 0) {
shadowrgb[comp] += Clazz.doubleToInt (astex.util.Color32.getComponent (diffuse, comp) * dcos);
}srgb[comp] += Clazz.doubleToInt (astex.util.Color32.getComponent (specular, comp) * phong);
}
}}
for (var comp = 0; comp < 3; comp++) {
if (drgb[comp] > 255) drgb[comp] = 255;
if (srgb[comp] > 255) srgb[comp] = 255;
if (shadowrgb[comp] > 255) shadowrgb[comp] = 255;
}
}, "~N,~N,~N,~A,~A,~A");
c$.cos = Clazz.defineMethod (c$, "cos", 
 function (xa, ya, za, xb, yb, zb) {
var la = Math.sqrt (xa * xa + ya * ya + za * za);
var lb = Math.sqrt (xb * xb + yb * yb + zb * zb);
return (xa * xb + ya * yb + za * zb) / (la * lb);
}, "~N,~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "initialiseColor", 
 function () {
var rcomp = (this.color >> 16) & 255;
var gcomp = (this.color >> 8) & 255;
var bcomp = this.color & 255;
var rint;
var gint;
var bint;
var pixel;
var overflow;
var c;
var s;
var dcolor;
var dmap = this.diffuseMap;
var smap = this.highlightMap;
for (var i = 0; i < 65536; i++) {
dcolor = dmap[i];
rint = (dcolor >> 16) & 255;
gint = (dcolor >> 8) & 255;
bint = dcolor & 255;
c = (((rcomp * rint) >> 8) << 16) | ((gcomp * gint) & 0xff00) | ((bcomp * bint) >> 8);
s = smap[i];
pixel = astex.util.Color32.add (c, s);
this.colorMap[i] = pixel;
}
this.colorInitialised = true;
});
Clazz.defineMethod (c$, "renderTriangleUniversal", 
 function () {
var ymin = ((this.vA.y + (2048)) >> 12);
var ymax = ((this.vC.y + (2048)) >> 12);
if (ymax < 0 || ymin >= this.pixelHeight) {
return;
}var dy = ymax - ymin;
if (dy <= 0) {
return;
}var zb = this.zbuffer;
var px = this.pbuffer;
var smap = this.highlightMap;
var dmap = this.diffuseMap;
var imap = this.intensityMap;
var lw = this.pixelWidth;
var lh = this.pixelHeight;
var cmap = this.colorMap;
var xL = this.vA.x;
var zL = this.vA.z;
var xR = this.vB.x;
var zR = this.vB.z;
var nxL = this.vA.nx;
var nyL = this.vA.ny;
var nxR = this.vB.nx;
var nyR = this.vB.ny;
var uL = this.vA.u;
var vL = this.vA.v;
var uR = this.vB.u;
var vR = this.vB.v;
var rL = this.vA.r;
var gL = this.vA.g;
var bL = this.vA.b;
var rR = this.vB.r;
var gR = this.vB.g;
var bR = this.vB.b;
var dxL = Clazz.doubleToInt ((this.vC.x - this.vA.x) / dy);
var dzL = Clazz.doubleToInt ((this.vC.z - this.vA.z) / dy);
var dxR = Clazz.doubleToInt ((this.vD.x - this.vB.x) / dy);
var dzR = Clazz.doubleToInt ((this.vD.z - this.vB.z) / dy);
var dnxL = Clazz.doubleToInt ((this.vC.nx - this.vA.nx) / dy);
var dnyL = Clazz.doubleToInt ((this.vC.ny - this.vA.ny) / dy);
var dnxR = Clazz.doubleToInt ((this.vD.nx - this.vB.nx) / dy);
var dnyR = Clazz.doubleToInt ((this.vD.ny - this.vB.ny) / dy);
var duL = Clazz.doubleToInt ((this.vC.u - this.vA.u) / dy);
var dvL = Clazz.doubleToInt ((this.vC.v - this.vA.v) / dy);
var duR = Clazz.doubleToInt ((this.vD.u - this.vB.u) / dy);
var dvR = Clazz.doubleToInt ((this.vD.v - this.vB.v) / dy);
var drL = Clazz.doubleToInt ((this.vC.r - this.vA.r) / dy);
var dgL = Clazz.doubleToInt ((this.vC.g - this.vA.g) / dy);
var dbL = Clazz.doubleToInt ((this.vC.b - this.vA.b) / dy);
var drR = Clazz.doubleToInt ((this.vD.r - this.vB.r) / dy);
var dgR = Clazz.doubleToInt ((this.vD.g - this.vB.g) / dy);
var dbR = Clazz.doubleToInt ((this.vD.b - this.vB.b) / dy);
if (ymin < 0) {
xL -= dxL * ymin;
zL -= dzL * ymin;
xR -= dxR * ymin;
zR -= dzR * ymin;
nxL -= dnxL * ymin;
nyL -= dnyL * ymin;
nxR -= dnxR * ymin;
nyR -= dnyR * ymin;
uL -= duL * ymin;
vL -= dvL * ymin;
uR -= duR * ymin;
vR -= dvR * ymin;
rL -= drL * ymin;
gL -= dgL * ymin;
bL -= dbL * ymin;
rR -= drR * ymin;
gR -= dgR * ymin;
bR -= dbR * ymin;
ymin = 0;
}if (lh < ymax) {
ymax = lh;
}for (var y = ymin; y < ymax; y++) {
var dz = 0;
var dr = 0;
var dg = 0;
var db = 0;
var dnx = 0;
var dny = 0;
var du = 0;
var dv = 0;
var ixL = ((xL + (2048)) >> 12);
var ixR = ((xR + (2048)) >> 12);
var dx = ixR - ixL;
var z = zL;
var nx = nxL;
var ny = nyL;
var u = uL;
var v = vL;
var r = rL;
var g = gL;
var b = bL;
if (dx > 0) {
dz = Clazz.doubleToInt ((zR - zL) / dx);
dnx = Clazz.doubleToInt ((nxR - nxL) / dx);
dny = Clazz.doubleToInt ((nyR - nyL) / dx);
du = Clazz.doubleToInt ((uR - uL) / dx);
dv = Clazz.doubleToInt ((vR - vL) / dx);
dr = Clazz.doubleToInt ((rR - rL) / dx);
dg = Clazz.doubleToInt ((gR - gL) / dx);
db = Clazz.doubleToInt ((bR - bL) / dx);
}if (ixL < 0) {
z -= dz * ixL;
nx -= dnx * ixL;
ny -= dny * ixL;
u -= du * ixL;
v -= dv * ixL;
r -= dr * ixL;
g -= dg * ixL;
b -= db * ixL;
ixL = 0;
}if (ixR > lw) {
ixR = lw;
}var i = ixL + lw * y;
for (; ixL < ixR; ixL++) {
if ((z > zb[i])) {
var c;
var lookup = (((nx) >> 12) + (((ny) >> 12) << 8));
c = 0xff00ff;
zb[i] = z;
var s = smap[lookup];
c = astex.util.Color32.add (c, s);
var zscale = Clazz.doubleToInt ((z - this.backClip) / this.zRange);
var shade = this.depthScale[zscale];
px[i] = astex.util.Color32.blendI (c, this.background, shade);
}z += dz;
nx += dnx;
ny += dny;
u += du;
v += dv;
r += dr;
g += dg;
b += db;
i++;
}
xL += dxL;
zL += dzL;
xR += dxR;
zR += dzR;
nxL += dnxL;
nyL += dnyL;
nxR += dnxR;
nyR += dnyR;
uL += duL;
vL += dvL;
uR += duR;
vR += dvR;
rL += drL;
gL += dgL;
bL += dbL;
rR += drR;
gR += dgR;
bR += dbR;
}
});
Clazz.defineMethod (c$, "renderTriangleUniversalC", 
 function () {
var ymin = ((this.vA.y + (2048)) >> 12);
var ymax = ((this.vC.y + (2048)) >> 12);
if (ymax < 0 || ymin >= this.pixelHeight) {
return;
}var dy = ymax - ymin;
if (dy <= 0) {
return;
}var zb = this.zbuffer;
var px = this.pbuffer;
var smap = this.highlightMap;
var dmap = this.diffuseMap;
var imap = this.intensityMap;
var lw = this.pixelWidth;
var lh = this.pixelHeight;
var cmap = this.colorMap;
var xL = this.vA.x;
var zL = this.vA.z;
var xR = this.vB.x;
var zR = this.vB.z;
var nxL = this.vA.nx;
var nyL = this.vA.ny;
var nxR = this.vB.nx;
var nyR = this.vB.ny;
var uL = this.vA.u;
var vL = this.vA.v;
var uR = this.vB.u;
var vR = this.vB.v;
var rL = this.vA.r;
var gL = this.vA.g;
var bL = this.vA.b;
var rR = this.vB.r;
var gR = this.vB.g;
var bR = this.vB.b;
var dxL = Clazz.doubleToInt ((this.vC.x - this.vA.x) / dy);
var dzL = Clazz.doubleToInt ((this.vC.z - this.vA.z) / dy);
var dxR = Clazz.doubleToInt ((this.vD.x - this.vB.x) / dy);
var dzR = Clazz.doubleToInt ((this.vD.z - this.vB.z) / dy);
var dnxL = Clazz.doubleToInt ((this.vC.nx - this.vA.nx) / dy);
var dnyL = Clazz.doubleToInt ((this.vC.ny - this.vA.ny) / dy);
var dnxR = Clazz.doubleToInt ((this.vD.nx - this.vB.nx) / dy);
var dnyR = Clazz.doubleToInt ((this.vD.ny - this.vB.ny) / dy);
var duL = Clazz.doubleToInt ((this.vC.u - this.vA.u) / dy);
var dvL = Clazz.doubleToInt ((this.vC.v - this.vA.v) / dy);
var duR = Clazz.doubleToInt ((this.vD.u - this.vB.u) / dy);
var dvR = Clazz.doubleToInt ((this.vD.v - this.vB.v) / dy);
var drL = Clazz.doubleToInt ((this.vC.r - this.vA.r) / dy);
var dgL = Clazz.doubleToInt ((this.vC.g - this.vA.g) / dy);
var dbL = Clazz.doubleToInt ((this.vC.b - this.vA.b) / dy);
var drR = Clazz.doubleToInt ((this.vD.r - this.vB.r) / dy);
var dgR = Clazz.doubleToInt ((this.vD.g - this.vB.g) / dy);
var dbR = Clazz.doubleToInt ((this.vD.b - this.vB.b) / dy);
if (ymin < 0) {
xL -= dxL * ymin;
zL -= dzL * ymin;
xR -= dxR * ymin;
zR -= dzR * ymin;
nxL -= dnxL * ymin;
nyL -= dnyL * ymin;
nxR -= dnxR * ymin;
nyR -= dnyR * ymin;
uL -= duL * ymin;
vL -= dvL * ymin;
uR -= duR * ymin;
vR -= dvR * ymin;
rL -= drL * ymin;
gL -= dgL * ymin;
bL -= dbL * ymin;
rR -= drR * ymin;
gR -= dgR * ymin;
bR -= dbR * ymin;
ymin = 0;
}if (lh < ymax) {
ymax = lh;
}for (var y = ymin; y < ymax; y++) {
var dz = 0;
var dr = 0;
var dg = 0;
var db = 0;
var dnx = 0;
var dny = 0;
var du = 0;
var dv = 0;
var ixL = ((xL + (2048)) >> 12);
var ixR = ((xR + (2048)) >> 12);
var dx = ixR - ixL;
var z = zL;
var nx = nxL;
var ny = nyL;
var u = uL;
var v = vL;
var r = rL;
var g = gL;
var b = bL;
if (dx > 0) {
dz = Clazz.doubleToInt ((zR - zL) / dx);
dnx = Clazz.doubleToInt ((nxR - nxL) / dx);
dny = Clazz.doubleToInt ((nyR - nyL) / dx);
du = Clazz.doubleToInt ((uR - uL) / dx);
dv = Clazz.doubleToInt ((vR - vL) / dx);
dr = Clazz.doubleToInt ((rR - rL) / dx);
dg = Clazz.doubleToInt ((gR - gL) / dx);
db = Clazz.doubleToInt ((bR - bL) / dx);
}if (ixL < 0) {
z -= dz * ixL;
nx -= dnx * ixL;
ny -= dny * ixL;
u -= du * ixL;
v -= dv * ixL;
r -= dr * ixL;
g -= dg * ixL;
b -= db * ixL;
ixL = 0;
}if (ixR > lw) {
ixR = lw;
}var i = ixL + lw * y;
for (; ixL < ixR; ixL++) {
if ((z < this.frontClip && z >= zb[i])) {
var c;
var lookup = (((nx) >> 12) + (((ny) >> 12) << 8));
c = 0xff00ff;
zb[i] = z;
var s = smap[lookup];
c = astex.util.Color32.add (c, s);
var zscale = Clazz.doubleToInt ((z - this.backClip) / this.zRange);
var shade = this.depthScale[zscale];
px[i] = astex.util.Color32.blendI (c, this.background, shade);
}z += dz;
nx += dnx;
ny += dny;
u += du;
v += dv;
r += dr;
g += dg;
b += db;
i++;
}
xL += dxL;
zL += dzL;
xR += dxR;
zR += dzR;
nxL += dnxL;
nyL += dnyL;
nxR += dnxR;
nyR += dnyR;
uL += duL;
vL += dvL;
uR += duR;
vR += dvR;
rL += drL;
gL += dgL;
bL += dbL;
rR += drR;
gR += dgR;
bR += dbR;
}
});
Clazz.defineMethod (c$, "renderTriangleVertex", 
 function () {
var ymin = ((this.vA.y + (2048)) >> 12);
var ymax = ((this.vC.y + (2048)) >> 12);
if (ymax < 0 || ymin >= this.pixelHeight) {
return;
}var dy = ymax - ymin;
if (dy <= 0) {
return;
}var zb = this.zbuffer;
var px = this.pbuffer;
var smap = this.highlightMap;
var dmap = this.diffuseMap;
var imap = this.intensityMap;
var lw = this.pixelWidth;
var lh = this.pixelHeight;
var cmap = this.colorMap;
var xL = this.vA.x;
var zL = this.vA.z;
var xR = this.vB.x;
var zR = this.vB.z;
var nxL = this.vA.nx;
var nyL = this.vA.ny;
var nxR = this.vB.nx;
var nyR = this.vB.ny;
var rL = this.vA.r;
var gL = this.vA.g;
var bL = this.vA.b;
var rR = this.vB.r;
var gR = this.vB.g;
var bR = this.vB.b;
var dxL = Clazz.doubleToInt ((this.vC.x - this.vA.x) / dy);
var dzL = Clazz.doubleToInt ((this.vC.z - this.vA.z) / dy);
var dxR = Clazz.doubleToInt ((this.vD.x - this.vB.x) / dy);
var dzR = Clazz.doubleToInt ((this.vD.z - this.vB.z) / dy);
var dnxL = Clazz.doubleToInt ((this.vC.nx - this.vA.nx) / dy);
var dnyL = Clazz.doubleToInt ((this.vC.ny - this.vA.ny) / dy);
var dnxR = Clazz.doubleToInt ((this.vD.nx - this.vB.nx) / dy);
var dnyR = Clazz.doubleToInt ((this.vD.ny - this.vB.ny) / dy);
var drL = Clazz.doubleToInt ((this.vC.r - this.vA.r) / dy);
var dgL = Clazz.doubleToInt ((this.vC.g - this.vA.g) / dy);
var dbL = Clazz.doubleToInt ((this.vC.b - this.vA.b) / dy);
var drR = Clazz.doubleToInt ((this.vD.r - this.vB.r) / dy);
var dgR = Clazz.doubleToInt ((this.vD.g - this.vB.g) / dy);
var dbR = Clazz.doubleToInt ((this.vD.b - this.vB.b) / dy);
if (ymin < 0) {
xL -= dxL * ymin;
zL -= dzL * ymin;
xR -= dxR * ymin;
zR -= dzR * ymin;
nxL -= dnxL * ymin;
nyL -= dnyL * ymin;
nxR -= dnxR * ymin;
nyR -= dnyR * ymin;
rL -= drL * ymin;
gL -= dgL * ymin;
bL -= dbL * ymin;
rR -= drR * ymin;
gR -= dgR * ymin;
bR -= dbR * ymin;
ymin = 0;
}if (lh < ymax) {
ymax = lh;
}for (var y = ymin; y < ymax; y++) {
var dz = 0;
var dr = 0;
var dg = 0;
var db = 0;
var dnx = 0;
var dny = 0;
var du = 0;
var dv = 0;
var ixL = ((xL + (2048)) >> 12);
var ixR = ((xR + (2048)) >> 12);
var dx = ixR - ixL;
var z = zL;
var nx = nxL;
var ny = nyL;
var r = rL;
var g = gL;
var b = bL;
if (dx > 0) {
dz = Clazz.doubleToInt ((zR - zL) / dx);
dnx = Clazz.doubleToInt ((nxR - nxL) / dx);
dny = Clazz.doubleToInt ((nyR - nyL) / dx);
dr = Clazz.doubleToInt ((rR - rL) / dx);
dg = Clazz.doubleToInt ((gR - gL) / dx);
db = Clazz.doubleToInt ((bR - bL) / dx);
}if (ixL < 0) {
z -= dz * ixL;
nx -= dnx * ixL;
ny -= dny * ixL;
r -= dr * ixL;
g -= dg * ixL;
b -= db * ixL;
ixL = 0;
}if (ixR > lw) {
ixR = lw;
}var i = ixL + lw * y;
for (; ixL < ixR; ixL++) {
if ((z > zb[i])) {
var c;
var lookup = (((nx) >> 12) + (((ny) >> 12) << 8));
c = astex.util.Color32.pack (r >> 12, g >> 12, b >> 12);
zb[i] = z;
var s = smap[lookup];
c = astex.util.Color32.add (c, s);
var zscale = Clazz.doubleToInt ((z - this.backClip) / this.zRange);
var shade = this.depthScale[zscale];
px[i] = astex.util.Color32.blendI (c, this.background, shade);
}z += dz;
nx += dnx;
ny += dny;
r += dr;
g += dg;
b += db;
i++;
}
xL += dxL;
zL += dzL;
xR += dxR;
zR += dzR;
nxL += dnxL;
nyL += dnyL;
nxR += dnxR;
nyR += dnyR;
rL += drL;
gL += dgL;
bL += dbL;
rR += drR;
gR += dgR;
bR += dbR;
}
});
Clazz.defineMethod (c$, "renderTriangleTri", 
 function () {
var ymin = ((this.vA.y + (2048)) >> 12);
var ymax = ((this.vC.y + (2048)) >> 12);
if (ymax < 0 || ymin >= this.pixelHeight) {
return;
}var dy = ymax - ymin;
if (dy <= 0) {
return;
}var zb = this.zbuffer;
var px = this.pbuffer;
var smap = this.highlightMap;
var dmap = this.diffuseMap;
var imap = this.intensityMap;
var lw = this.pixelWidth;
var lh = this.pixelHeight;
var cmap = this.colorMap;
var xL = this.vA.x;
var zL = this.vA.z;
var xR = this.vB.x;
var zR = this.vB.z;
var nxL = this.vA.nx;
var nyL = this.vA.ny;
var nxR = this.vB.nx;
var nyR = this.vB.ny;
var dxL = Clazz.doubleToInt ((this.vC.x - this.vA.x) / dy);
var dzL = Clazz.doubleToInt ((this.vC.z - this.vA.z) / dy);
var dxR = Clazz.doubleToInt ((this.vD.x - this.vB.x) / dy);
var dzR = Clazz.doubleToInt ((this.vD.z - this.vB.z) / dy);
var dnxL = Clazz.doubleToInt ((this.vC.nx - this.vA.nx) / dy);
var dnyL = Clazz.doubleToInt ((this.vC.ny - this.vA.ny) / dy);
var dnxR = Clazz.doubleToInt ((this.vD.nx - this.vB.nx) / dy);
var dnyR = Clazz.doubleToInt ((this.vD.ny - this.vB.ny) / dy);
if (ymin < 0) {
xL -= dxL * ymin;
zL -= dzL * ymin;
xR -= dxR * ymin;
zR -= dzR * ymin;
nxL -= dnxL * ymin;
nyL -= dnyL * ymin;
nxR -= dnxR * ymin;
nyR -= dnyR * ymin;
ymin = 0;
}if (lh < ymax) {
ymax = lh;
}for (var y = ymin; y < ymax; y++) {
var dz = 0;
var dr = 0;
var dg = 0;
var db = 0;
var dnx = 0;
var dny = 0;
var du = 0;
var dv = 0;
var ixL = ((xL + (2048)) >> 12);
var ixR = ((xR + (2048)) >> 12);
var dx = ixR - ixL;
var z = zL;
var nx = nxL;
var ny = nyL;
if (dx > 0) {
dz = Clazz.doubleToInt ((zR - zL) / dx);
dnx = Clazz.doubleToInt ((nxR - nxL) / dx);
dny = Clazz.doubleToInt ((nyR - nyL) / dx);
}if (ixL < 0) {
z -= dz * ixL;
nx -= dnx * ixL;
ny -= dny * ixL;
ixL = 0;
}if (ixR > lw) {
ixR = lw;
}var i = ixL + lw * y;
for (; ixL < ixR; ixL++) {
if ((z > zb[i])) {
var c;
var lookup = (((nx) >> 12) + (((ny) >> 12) << 8));
c = this.triangleColor;
c = astex.util.Color32.multiply (c, dmap[lookup]);
zb[i] = z;
var s = smap[lookup];
c = astex.util.Color32.add (c, s);
var zscale = Clazz.doubleToInt ((z - this.backClip) / this.zRange);
var shade = this.depthScale[zscale];
px[i] = astex.util.Color32.blendI (c, this.background, shade);
}z += dz;
nx += dnx;
ny += dny;
i++;
}
xL += dxL;
zL += dzL;
xR += dxR;
zR += dzR;
nxL += dnxL;
nyL += dnyL;
nxR += dnxR;
nyR += dnyR;
}
});
Clazz.defineMethod (c$, "renderTriangleTriC", 
 function () {
var ymin = ((this.vA.y + (2048)) >> 12);
var ymax = ((this.vC.y + (2048)) >> 12);
if (ymax < 0 || ymin >= this.pixelHeight) {
return;
}var dy = ymax - ymin;
if (dy <= 0) {
return;
}var zb = this.zbuffer;
var px = this.pbuffer;
var smap = this.highlightMap;
var dmap = this.diffuseMap;
var imap = this.intensityMap;
var lw = this.pixelWidth;
var lh = this.pixelHeight;
var cmap = this.colorMap;
var xL = this.vA.x;
var zL = this.vA.z;
var xR = this.vB.x;
var zR = this.vB.z;
var nxL = this.vA.nx;
var nyL = this.vA.ny;
var nxR = this.vB.nx;
var nyR = this.vB.ny;
var dxL = Clazz.doubleToInt ((this.vC.x - this.vA.x) / dy);
var dzL = Clazz.doubleToInt ((this.vC.z - this.vA.z) / dy);
var dxR = Clazz.doubleToInt ((this.vD.x - this.vB.x) / dy);
var dzR = Clazz.doubleToInt ((this.vD.z - this.vB.z) / dy);
var dnxL = Clazz.doubleToInt ((this.vC.nx - this.vA.nx) / dy);
var dnyL = Clazz.doubleToInt ((this.vC.ny - this.vA.ny) / dy);
var dnxR = Clazz.doubleToInt ((this.vD.nx - this.vB.nx) / dy);
var dnyR = Clazz.doubleToInt ((this.vD.ny - this.vB.ny) / dy);
if (ymin < 0) {
xL -= dxL * ymin;
zL -= dzL * ymin;
xR -= dxR * ymin;
zR -= dzR * ymin;
nxL -= dnxL * ymin;
nyL -= dnyL * ymin;
nxR -= dnxR * ymin;
nyR -= dnyR * ymin;
ymin = 0;
}if (lh < ymax) {
ymax = lh;
}for (var y = ymin; y < ymax; y++) {
var dz = 0;
var dr = 0;
var dg = 0;
var db = 0;
var dnx = 0;
var dny = 0;
var du = 0;
var dv = 0;
var ixL = ((xL + (2048)) >> 12);
var ixR = ((xR + (2048)) >> 12);
var dx = ixR - ixL;
var z = zL;
var nx = nxL;
var ny = nyL;
if (dx > 0) {
dz = Clazz.doubleToInt ((zR - zL) / dx);
dnx = Clazz.doubleToInt ((nxR - nxL) / dx);
dny = Clazz.doubleToInt ((nyR - nyL) / dx);
}if (ixL < 0) {
z -= dz * ixL;
nx -= dnx * ixL;
ny -= dny * ixL;
ixL = 0;
}if (ixR > lw) {
ixR = lw;
}var i = ixL + lw * y;
for (; ixL < ixR; ixL++) {
if ((z < this.frontClip && z >= zb[i])) {
var c;
var lookup = (((nx) >> 12) + (((ny) >> 12) << 8));
c = this.triangleColor;
c = astex.util.Color32.multiply (c, dmap[lookup]);
zb[i] = z;
var s = smap[lookup];
c = astex.util.Color32.add (c, s);
var zscale = Clazz.doubleToInt ((z - this.backClip) / this.zRange);
var shade = this.depthScale[zscale];
px[i] = astex.util.Color32.blendI (c, this.background, shade);
}z += dz;
nx += dnx;
ny += dny;
i++;
}
xL += dxL;
zL += dzL;
xR += dxR;
zR += dzR;
nxL += dnxL;
nyL += dnyL;
nxR += dnxR;
nyR += dnyR;
}
});
Clazz.defineMethod (c$, "renderTriangleVertexC", 
 function () {
var ymin = ((this.vA.y + (2048)) >> 12);
var ymax = ((this.vC.y + (2048)) >> 12);
if (ymax < 0 || ymin >= this.pixelHeight) {
return;
}var dy = ymax - ymin;
if (dy <= 0) {
return;
}var zb = this.zbuffer;
var px = this.pbuffer;
var smap = this.highlightMap;
var dmap = this.diffuseMap;
var imap = this.intensityMap;
var lw = this.pixelWidth;
var lh = this.pixelHeight;
var cmap = this.colorMap;
var xL = this.vA.x;
var zL = this.vA.z;
var xR = this.vB.x;
var zR = this.vB.z;
var nxL = this.vA.nx;
var nyL = this.vA.ny;
var nxR = this.vB.nx;
var nyR = this.vB.ny;
var rL = this.vA.r;
var gL = this.vA.g;
var bL = this.vA.b;
var rR = this.vB.r;
var gR = this.vB.g;
var bR = this.vB.b;
var dxL = Clazz.doubleToInt ((this.vC.x - this.vA.x) / dy);
var dzL = Clazz.doubleToInt ((this.vC.z - this.vA.z) / dy);
var dxR = Clazz.doubleToInt ((this.vD.x - this.vB.x) / dy);
var dzR = Clazz.doubleToInt ((this.vD.z - this.vB.z) / dy);
var dnxL = Clazz.doubleToInt ((this.vC.nx - this.vA.nx) / dy);
var dnyL = Clazz.doubleToInt ((this.vC.ny - this.vA.ny) / dy);
var dnxR = Clazz.doubleToInt ((this.vD.nx - this.vB.nx) / dy);
var dnyR = Clazz.doubleToInt ((this.vD.ny - this.vB.ny) / dy);
var drL = Clazz.doubleToInt ((this.vC.r - this.vA.r) / dy);
var dgL = Clazz.doubleToInt ((this.vC.g - this.vA.g) / dy);
var dbL = Clazz.doubleToInt ((this.vC.b - this.vA.b) / dy);
var drR = Clazz.doubleToInt ((this.vD.r - this.vB.r) / dy);
var dgR = Clazz.doubleToInt ((this.vD.g - this.vB.g) / dy);
var dbR = Clazz.doubleToInt ((this.vD.b - this.vB.b) / dy);
if (ymin < 0) {
xL -= dxL * ymin;
zL -= dzL * ymin;
xR -= dxR * ymin;
zR -= dzR * ymin;
nxL -= dnxL * ymin;
nyL -= dnyL * ymin;
nxR -= dnxR * ymin;
nyR -= dnyR * ymin;
rL -= drL * ymin;
gL -= dgL * ymin;
bL -= dbL * ymin;
rR -= drR * ymin;
gR -= dgR * ymin;
bR -= dbR * ymin;
ymin = 0;
}if (lh < ymax) {
ymax = lh;
}for (var y = ymin; y < ymax; y++) {
var dz = 0;
var dr = 0;
var dg = 0;
var db = 0;
var dnx = 0;
var dny = 0;
var du = 0;
var dv = 0;
var ixL = ((xL + (2048)) >> 12);
var ixR = ((xR + (2048)) >> 12);
var dx = ixR - ixL;
var z = zL;
var nx = nxL;
var ny = nyL;
var r = rL;
var g = gL;
var b = bL;
if (dx > 0) {
dz = Clazz.doubleToInt ((zR - zL) / dx);
dnx = Clazz.doubleToInt ((nxR - nxL) / dx);
dny = Clazz.doubleToInt ((nyR - nyL) / dx);
dr = Clazz.doubleToInt ((rR - rL) / dx);
dg = Clazz.doubleToInt ((gR - gL) / dx);
db = Clazz.doubleToInt ((bR - bL) / dx);
}if (ixL < 0) {
z -= dz * ixL;
nx -= dnx * ixL;
ny -= dny * ixL;
r -= dr * ixL;
g -= dg * ixL;
b -= db * ixL;
ixL = 0;
}if (ixR > lw) {
ixR = lw;
}var i = ixL + lw * y;
for (; ixL < ixR; ixL++) {
if ((z < this.frontClip && z >= zb[i])) {
var c;
var lookup = (((nx) >> 12) + (((ny) >> 12) << 8));
c = astex.util.Color32.pack (r >> 12, g >> 12, b >> 12);
zb[i] = z;
var s = smap[lookup];
c = astex.util.Color32.add (c, s);
var zscale = Clazz.doubleToInt ((z - this.backClip) / this.zRange);
var shade = this.depthScale[zscale];
px[i] = astex.util.Color32.blendI (c, this.background, shade);
}z += dz;
nx += dnx;
ny += dny;
r += dr;
g += dg;
b += db;
i++;
}
xL += dxL;
zL += dzL;
xR += dxR;
zR += dzR;
nxL += dnxL;
nyL += dnyL;
nxR += dnxR;
nyR += dnyR;
rL += drL;
gL += dgL;
bL += dbL;
rR += drR;
gR += dgR;
bR += dbR;
}
});
Clazz.defineMethod (c$, "renderTriangleTriTrans", 
 function () {
var ymin = ((this.vA.y + (2048)) >> 12);
var ymax = ((this.vC.y + (2048)) >> 12);
if (ymax < 0 || ymin >= this.pixelHeight) {
return;
}var dy = ymax - ymin;
if (dy <= 0) {
return;
}var zb = this.zbuffer;
var px = this.pbuffer;
var smap = this.highlightMap;
var dmap = this.diffuseMap;
var imap = this.intensityMap;
var lw = this.pixelWidth;
var lh = this.pixelHeight;
var cmap = this.colorMap;
var xL = this.vA.x;
var zL = this.vA.z;
var xR = this.vB.x;
var zR = this.vB.z;
var nxL = this.vA.nx;
var nyL = this.vA.ny;
var nxR = this.vB.nx;
var nyR = this.vB.ny;
var dxL = Clazz.doubleToInt ((this.vC.x - this.vA.x) / dy);
var dzL = Clazz.doubleToInt ((this.vC.z - this.vA.z) / dy);
var dxR = Clazz.doubleToInt ((this.vD.x - this.vB.x) / dy);
var dzR = Clazz.doubleToInt ((this.vD.z - this.vB.z) / dy);
var dnxL = Clazz.doubleToInt ((this.vC.nx - this.vA.nx) / dy);
var dnyL = Clazz.doubleToInt ((this.vC.ny - this.vA.ny) / dy);
var dnxR = Clazz.doubleToInt ((this.vD.nx - this.vB.nx) / dy);
var dnyR = Clazz.doubleToInt ((this.vD.ny - this.vB.ny) / dy);
if (ymin < 0) {
xL -= dxL * ymin;
zL -= dzL * ymin;
xR -= dxR * ymin;
zR -= dzR * ymin;
nxL -= dnxL * ymin;
nyL -= dnyL * ymin;
nxR -= dnxR * ymin;
nyR -= dnyR * ymin;
ymin = 0;
}if (lh < ymax) {
ymax = lh;
}for (var y = ymin; y < ymax; y++) {
var dz = 0;
var dr = 0;
var dg = 0;
var db = 0;
var dnx = 0;
var dny = 0;
var du = 0;
var dv = 0;
var ixL = ((xL + (2048)) >> 12);
var ixR = ((xR + (2048)) >> 12);
var dx = ixR - ixL;
var z = zL;
var nx = nxL;
var ny = nyL;
if (dx > 0) {
dz = Clazz.doubleToInt ((zR - zL) / dx);
dnx = Clazz.doubleToInt ((nxR - nxL) / dx);
dny = Clazz.doubleToInt ((nyR - nyL) / dx);
}if (ixL < 0) {
z -= dz * ixL;
nx -= dnx * ixL;
ny -= dny * ixL;
ixL = 0;
}if (ixR > lw) {
ixR = lw;
}var i = ixL + lw * y;
for (; ixL < ixR; ixL++) {
if ((z > zb[i])) {
var c;
var lookup = (((nx) >> 12) + (((ny) >> 12) << 8));
c = this.triangleColor;
c = astex.util.Color32.multiply (c, dmap[lookup]);
zb[i] = z;
c = astex.util.Color32.blendI (c, px[i], this.transparency);
var s = smap[lookup];
c = astex.util.Color32.add (c, s);
var zscale = Clazz.doubleToInt ((z - this.backClip) / this.zRange);
var shade = this.depthScale[zscale];
px[i] = astex.util.Color32.blendI (c, this.background, shade);
}z += dz;
nx += dnx;
ny += dny;
i++;
}
xL += dxL;
zL += dzL;
xR += dxR;
zR += dzR;
nxL += dnxL;
nyL += dnyL;
nxR += dnxR;
nyR += dnyR;
}
});
Clazz.defineMethod (c$, "renderTriangleVertexTrans", 
 function () {
var ymin = ((this.vA.y + (2048)) >> 12);
var ymax = ((this.vC.y + (2048)) >> 12);
if (ymax < 0 || ymin >= this.pixelHeight) {
return;
}var dy = ymax - ymin;
if (dy <= 0) {
return;
}var zb = this.zbuffer;
var px = this.pbuffer;
var smap = this.highlightMap;
var dmap = this.diffuseMap;
var imap = this.intensityMap;
var lw = this.pixelWidth;
var lh = this.pixelHeight;
var cmap = this.colorMap;
var xL = this.vA.x;
var zL = this.vA.z;
var xR = this.vB.x;
var zR = this.vB.z;
var nxL = this.vA.nx;
var nyL = this.vA.ny;
var nxR = this.vB.nx;
var nyR = this.vB.ny;
var rL = this.vA.r;
var gL = this.vA.g;
var bL = this.vA.b;
var rR = this.vB.r;
var gR = this.vB.g;
var bR = this.vB.b;
var dxL = Clazz.doubleToInt ((this.vC.x - this.vA.x) / dy);
var dzL = Clazz.doubleToInt ((this.vC.z - this.vA.z) / dy);
var dxR = Clazz.doubleToInt ((this.vD.x - this.vB.x) / dy);
var dzR = Clazz.doubleToInt ((this.vD.z - this.vB.z) / dy);
var dnxL = Clazz.doubleToInt ((this.vC.nx - this.vA.nx) / dy);
var dnyL = Clazz.doubleToInt ((this.vC.ny - this.vA.ny) / dy);
var dnxR = Clazz.doubleToInt ((this.vD.nx - this.vB.nx) / dy);
var dnyR = Clazz.doubleToInt ((this.vD.ny - this.vB.ny) / dy);
var drL = Clazz.doubleToInt ((this.vC.r - this.vA.r) / dy);
var dgL = Clazz.doubleToInt ((this.vC.g - this.vA.g) / dy);
var dbL = Clazz.doubleToInt ((this.vC.b - this.vA.b) / dy);
var drR = Clazz.doubleToInt ((this.vD.r - this.vB.r) / dy);
var dgR = Clazz.doubleToInt ((this.vD.g - this.vB.g) / dy);
var dbR = Clazz.doubleToInt ((this.vD.b - this.vB.b) / dy);
if (ymin < 0) {
xL -= dxL * ymin;
zL -= dzL * ymin;
xR -= dxR * ymin;
zR -= dzR * ymin;
nxL -= dnxL * ymin;
nyL -= dnyL * ymin;
nxR -= dnxR * ymin;
nyR -= dnyR * ymin;
rL -= drL * ymin;
gL -= dgL * ymin;
bL -= dbL * ymin;
rR -= drR * ymin;
gR -= dgR * ymin;
bR -= dbR * ymin;
ymin = 0;
}if (lh < ymax) {
ymax = lh;
}for (var y = ymin; y < ymax; y++) {
var dz = 0;
var dr = 0;
var dg = 0;
var db = 0;
var dnx = 0;
var dny = 0;
var du = 0;
var dv = 0;
var ixL = ((xL + (2048)) >> 12);
var ixR = ((xR + (2048)) >> 12);
var dx = ixR - ixL;
var z = zL;
var nx = nxL;
var ny = nyL;
var r = rL;
var g = gL;
var b = bL;
if (dx > 0) {
dz = Clazz.doubleToInt ((zR - zL) / dx);
dnx = Clazz.doubleToInt ((nxR - nxL) / dx);
dny = Clazz.doubleToInt ((nyR - nyL) / dx);
dr = Clazz.doubleToInt ((rR - rL) / dx);
dg = Clazz.doubleToInt ((gR - gL) / dx);
db = Clazz.doubleToInt ((bR - bL) / dx);
}if (ixL < 0) {
z -= dz * ixL;
nx -= dnx * ixL;
ny -= dny * ixL;
r -= dr * ixL;
g -= dg * ixL;
b -= db * ixL;
ixL = 0;
}if (ixR > lw) {
ixR = lw;
}var i = ixL + lw * y;
for (; ixL < ixR; ixL++) {
if ((z > zb[i])) {
var c;
var lookup = (((nx) >> 12) + (((ny) >> 12) << 8));
c = astex.util.Color32.pack (r >> 12, g >> 12, b >> 12);
zb[i] = z;
c = astex.util.Color32.blendI (c, px[i], this.transparency);
var s = smap[lookup];
c = astex.util.Color32.add (c, s);
var zscale = Clazz.doubleToInt ((z - this.backClip) / this.zRange);
var shade = this.depthScale[zscale];
px[i] = astex.util.Color32.blendI (c, this.background, shade);
}z += dz;
nx += dnx;
ny += dny;
r += dr;
g += dg;
b += db;
i++;
}
xL += dxL;
zL += dzL;
xR += dxR;
zR += dzR;
nxL += dnxL;
nyL += dnyL;
nxR += dnxR;
nyR += dnyR;
rL += drL;
gL += dgL;
bL += dbL;
rR += drR;
gR += dgR;
bR += dbR;
}
});
Clazz.defineMethod (c$, "renderTriangleTriTransC", 
 function () {
var ymin = ((this.vA.y + (2048)) >> 12);
var ymax = ((this.vC.y + (2048)) >> 12);
if (ymax < 0 || ymin >= this.pixelHeight) {
return;
}var dy = ymax - ymin;
if (dy <= 0) {
return;
}var zb = this.zbuffer;
var px = this.pbuffer;
var smap = this.highlightMap;
var dmap = this.diffuseMap;
var imap = this.intensityMap;
var lw = this.pixelWidth;
var lh = this.pixelHeight;
var cmap = this.colorMap;
var xL = this.vA.x;
var zL = this.vA.z;
var xR = this.vB.x;
var zR = this.vB.z;
var nxL = this.vA.nx;
var nyL = this.vA.ny;
var nxR = this.vB.nx;
var nyR = this.vB.ny;
var dxL = Clazz.doubleToInt ((this.vC.x - this.vA.x) / dy);
var dzL = Clazz.doubleToInt ((this.vC.z - this.vA.z) / dy);
var dxR = Clazz.doubleToInt ((this.vD.x - this.vB.x) / dy);
var dzR = Clazz.doubleToInt ((this.vD.z - this.vB.z) / dy);
var dnxL = Clazz.doubleToInt ((this.vC.nx - this.vA.nx) / dy);
var dnyL = Clazz.doubleToInt ((this.vC.ny - this.vA.ny) / dy);
var dnxR = Clazz.doubleToInt ((this.vD.nx - this.vB.nx) / dy);
var dnyR = Clazz.doubleToInt ((this.vD.ny - this.vB.ny) / dy);
if (ymin < 0) {
xL -= dxL * ymin;
zL -= dzL * ymin;
xR -= dxR * ymin;
zR -= dzR * ymin;
nxL -= dnxL * ymin;
nyL -= dnyL * ymin;
nxR -= dnxR * ymin;
nyR -= dnyR * ymin;
ymin = 0;
}if (lh < ymax) {
ymax = lh;
}for (var y = ymin; y < ymax; y++) {
var dz = 0;
var dr = 0;
var dg = 0;
var db = 0;
var dnx = 0;
var dny = 0;
var du = 0;
var dv = 0;
var ixL = ((xL + (2048)) >> 12);
var ixR = ((xR + (2048)) >> 12);
var dx = ixR - ixL;
var z = zL;
var nx = nxL;
var ny = nyL;
if (dx > 0) {
dz = Clazz.doubleToInt ((zR - zL) / dx);
dnx = Clazz.doubleToInt ((nxR - nxL) / dx);
dny = Clazz.doubleToInt ((nyR - nyL) / dx);
}if (ixL < 0) {
z -= dz * ixL;
nx -= dnx * ixL;
ny -= dny * ixL;
ixL = 0;
}if (ixR > lw) {
ixR = lw;
}var i = ixL + lw * y;
for (; ixL < ixR; ixL++) {
if ((z < this.frontClip && z >= zb[i])) {
var c;
var lookup = (((nx) >> 12) + (((ny) >> 12) << 8));
c = this.triangleColor;
c = astex.util.Color32.multiply (c, dmap[lookup]);
zb[i] = z;
c = astex.util.Color32.blendI (c, px[i], this.transparency);
var s = smap[lookup];
c = astex.util.Color32.add (c, s);
var zscale = Clazz.doubleToInt ((z - this.backClip) / this.zRange);
var shade = this.depthScale[zscale];
px[i] = astex.util.Color32.blendI (c, this.background, shade);
}z += dz;
nx += dnx;
ny += dny;
i++;
}
xL += dxL;
zL += dzL;
xR += dxR;
zR += dzR;
nxL += dnxL;
nyL += dnyL;
nxR += dnxR;
nyR += dnyR;
}
});
Clazz.defineMethod (c$, "renderTriangleVertexTransC", 
 function () {
var ymin = ((this.vA.y + (2048)) >> 12);
var ymax = ((this.vC.y + (2048)) >> 12);
if (ymax < 0 || ymin >= this.pixelHeight) {
return;
}var dy = ymax - ymin;
if (dy <= 0) {
return;
}var zb = this.zbuffer;
var px = this.pbuffer;
var smap = this.highlightMap;
var dmap = this.diffuseMap;
var imap = this.intensityMap;
var lw = this.pixelWidth;
var lh = this.pixelHeight;
var cmap = this.colorMap;
var xL = this.vA.x;
var zL = this.vA.z;
var xR = this.vB.x;
var zR = this.vB.z;
var nxL = this.vA.nx;
var nyL = this.vA.ny;
var nxR = this.vB.nx;
var nyR = this.vB.ny;
var rL = this.vA.r;
var gL = this.vA.g;
var bL = this.vA.b;
var rR = this.vB.r;
var gR = this.vB.g;
var bR = this.vB.b;
var dxL = Clazz.doubleToInt ((this.vC.x - this.vA.x) / dy);
var dzL = Clazz.doubleToInt ((this.vC.z - this.vA.z) / dy);
var dxR = Clazz.doubleToInt ((this.vD.x - this.vB.x) / dy);
var dzR = Clazz.doubleToInt ((this.vD.z - this.vB.z) / dy);
var dnxL = Clazz.doubleToInt ((this.vC.nx - this.vA.nx) / dy);
var dnyL = Clazz.doubleToInt ((this.vC.ny - this.vA.ny) / dy);
var dnxR = Clazz.doubleToInt ((this.vD.nx - this.vB.nx) / dy);
var dnyR = Clazz.doubleToInt ((this.vD.ny - this.vB.ny) / dy);
var drL = Clazz.doubleToInt ((this.vC.r - this.vA.r) / dy);
var dgL = Clazz.doubleToInt ((this.vC.g - this.vA.g) / dy);
var dbL = Clazz.doubleToInt ((this.vC.b - this.vA.b) / dy);
var drR = Clazz.doubleToInt ((this.vD.r - this.vB.r) / dy);
var dgR = Clazz.doubleToInt ((this.vD.g - this.vB.g) / dy);
var dbR = Clazz.doubleToInt ((this.vD.b - this.vB.b) / dy);
if (ymin < 0) {
xL -= dxL * ymin;
zL -= dzL * ymin;
xR -= dxR * ymin;
zR -= dzR * ymin;
nxL -= dnxL * ymin;
nyL -= dnyL * ymin;
nxR -= dnxR * ymin;
nyR -= dnyR * ymin;
rL -= drL * ymin;
gL -= dgL * ymin;
bL -= dbL * ymin;
rR -= drR * ymin;
gR -= dgR * ymin;
bR -= dbR * ymin;
ymin = 0;
}if (lh < ymax) {
ymax = lh;
}for (var y = ymin; y < ymax; y++) {
var dz = 0;
var dr = 0;
var dg = 0;
var db = 0;
var dnx = 0;
var dny = 0;
var du = 0;
var dv = 0;
var ixL = ((xL + (2048)) >> 12);
var ixR = ((xR + (2048)) >> 12);
var dx = ixR - ixL;
var z = zL;
var nx = nxL;
var ny = nyL;
var r = rL;
var g = gL;
var b = bL;
if (dx > 0) {
dz = Clazz.doubleToInt ((zR - zL) / dx);
dnx = Clazz.doubleToInt ((nxR - nxL) / dx);
dny = Clazz.doubleToInt ((nyR - nyL) / dx);
dr = Clazz.doubleToInt ((rR - rL) / dx);
dg = Clazz.doubleToInt ((gR - gL) / dx);
db = Clazz.doubleToInt ((bR - bL) / dx);
}if (ixL < 0) {
z -= dz * ixL;
nx -= dnx * ixL;
ny -= dny * ixL;
r -= dr * ixL;
g -= dg * ixL;
b -= db * ixL;
ixL = 0;
}if (ixR > lw) {
ixR = lw;
}var i = ixL + lw * y;
for (; ixL < ixR; ixL++) {
if ((z < this.frontClip && z >= zb[i])) {
var c;
var lookup = (((nx) >> 12) + (((ny) >> 12) << 8));
c = astex.util.Color32.pack (r >> 12, g >> 12, b >> 12);
zb[i] = z;
c = astex.util.Color32.blendI (c, px[i], this.transparency);
var s = smap[lookup];
c = astex.util.Color32.add (c, s);
var zscale = Clazz.doubleToInt ((z - this.backClip) / this.zRange);
var shade = this.depthScale[zscale];
px[i] = astex.util.Color32.blendI (c, this.background, shade);
}z += dz;
nx += dnx;
ny += dny;
r += dr;
g += dg;
b += db;
i++;
}
xL += dxL;
zL += dzL;
xR += dxR;
zR += dzR;
nxL += dnxL;
nyL += dnyL;
nxR += dnxR;
nyR += dnyR;
rL += drL;
gL += dgL;
bL += dbL;
rR += drR;
gR += dgR;
bR += dbR;
}
});
Clazz.defineMethod (c$, "renderTriangleP", 
 function () {
var ymin = ((this.vA.y + (2048)) >> 12);
var ymax = ((this.vC.y + (2048)) >> 12);
if (ymax < 0 || ymin >= this.pixelHeight) {
return;
}var dy = ymax - ymin;
if (dy <= 0) {
return;
}var zb = this.zbuffer;
var px = this.pbuffer;
var smap = this.highlightMap;
var dmap = this.diffuseMap;
var imap = this.intensityMap;
var lw = this.pixelWidth;
var lh = this.pixelHeight;
var cmap = this.colorMap;
var xL = this.vA.x;
var zL = this.vA.z;
var xR = this.vB.x;
var zR = this.vB.z;
var nxL = this.vA.nx;
var nyL = this.vA.ny;
var nxR = this.vB.nx;
var nyR = this.vB.ny;
var dxL = Clazz.doubleToInt ((this.vC.x - this.vA.x) / dy);
var dzL = Clazz.doubleToInt ((this.vC.z - this.vA.z) / dy);
var dxR = Clazz.doubleToInt ((this.vD.x - this.vB.x) / dy);
var dzR = Clazz.doubleToInt ((this.vD.z - this.vB.z) / dy);
var dnxL = Clazz.doubleToInt ((this.vC.nx - this.vA.nx) / dy);
var dnyL = Clazz.doubleToInt ((this.vC.ny - this.vA.ny) / dy);
var dnxR = Clazz.doubleToInt ((this.vD.nx - this.vB.nx) / dy);
var dnyR = Clazz.doubleToInt ((this.vD.ny - this.vB.ny) / dy);
if (ymin < 0) {
xL -= dxL * ymin;
zL -= dzL * ymin;
xR -= dxR * ymin;
zR -= dzR * ymin;
nxL -= dnxL * ymin;
nyL -= dnyL * ymin;
nxR -= dnxR * ymin;
nyR -= dnyR * ymin;
ymin = 0;
}if (lh < ymax) {
ymax = lh;
}for (var y = ymin; y < ymax; y++) {
var dz = 0;
var dr = 0;
var dg = 0;
var db = 0;
var dnx = 0;
var dny = 0;
var du = 0;
var dv = 0;
var ixL = ((xL + (2048)) >> 12);
var ixR = ((xR + (2048)) >> 12);
var dx = ixR - ixL;
var z = zL;
var nx = nxL;
var ny = nyL;
if (dx > 0) {
dz = Clazz.doubleToInt ((zR - zL) / dx);
dnx = Clazz.doubleToInt ((nxR - nxL) / dx);
dny = Clazz.doubleToInt ((nyR - nyL) / dx);
}if (ixL < 0) {
z -= dz * ixL;
nx -= dnx * ixL;
ny -= dny * ixL;
ixL = 0;
}if (ixR > lw) {
ixR = lw;
}var i = ixL + lw * y;
for (; ixL < ixR; ixL++) {
if ((z > zb[i])) {
var c;
var lookup = (((nx) >> 12) + (((ny) >> 12) << 8));
c = cmap[lookup];
zb[i] = z;
var s = smap[lookup];
c = astex.util.Color32.add (c, s);
var zscale = Clazz.doubleToInt ((z - this.backClip) / this.zRange);
var shade = this.depthScale[zscale];
px[i] = astex.util.Color32.blendI (c, this.background, shade);
}z += dz;
nx += dnx;
ny += dny;
i++;
}
xL += dxL;
zL += dzL;
xR += dxR;
zR += dzR;
nxL += dnxL;
nyL += dnyL;
nxR += dnxR;
nyR += dnyR;
}
});
Clazz.defineMethod (c$, "renderTriangleTTrans", 
 function () {
var ymin = ((this.vA.y + (2048)) >> 12);
var ymax = ((this.vC.y + (2048)) >> 12);
if (ymax < 0 || ymin >= this.pixelHeight) {
return;
}var dy = ymax - ymin;
if (dy <= 0) {
return;
}var zb = this.zbuffer;
var px = this.pbuffer;
var smap = this.highlightMap;
var dmap = this.diffuseMap;
var imap = this.intensityMap;
var tmap = null;
if (this.texture != null) {
tmap = this.texture.pixels;
}var lw = this.pixelWidth;
var lh = this.pixelHeight;
var cmap = this.colorMap;
var xL = this.vA.x;
var zL = this.vA.z;
var xR = this.vB.x;
var zR = this.vB.z;
var nxL = this.vA.nx;
var nyL = this.vA.ny;
var nxR = this.vB.nx;
var nyR = this.vB.ny;
var uL = this.vA.u;
var vL = this.vA.v;
var uR = this.vB.u;
var vR = this.vB.v;
var dxL = Clazz.doubleToInt ((this.vC.x - this.vA.x) / dy);
var dzL = Clazz.doubleToInt ((this.vC.z - this.vA.z) / dy);
var dxR = Clazz.doubleToInt ((this.vD.x - this.vB.x) / dy);
var dzR = Clazz.doubleToInt ((this.vD.z - this.vB.z) / dy);
var dnxL = Clazz.doubleToInt ((this.vC.nx - this.vA.nx) / dy);
var dnyL = Clazz.doubleToInt ((this.vC.ny - this.vA.ny) / dy);
var dnxR = Clazz.doubleToInt ((this.vD.nx - this.vB.nx) / dy);
var dnyR = Clazz.doubleToInt ((this.vD.ny - this.vB.ny) / dy);
var duL = Clazz.doubleToInt ((this.vC.u - this.vA.u) / dy);
var dvL = Clazz.doubleToInt ((this.vC.v - this.vA.v) / dy);
var duR = Clazz.doubleToInt ((this.vD.u - this.vB.u) / dy);
var dvR = Clazz.doubleToInt ((this.vD.v - this.vB.v) / dy);
if (ymin < 0) {
xL -= dxL * ymin;
zL -= dzL * ymin;
xR -= dxR * ymin;
zR -= dzR * ymin;
nxL -= dnxL * ymin;
nyL -= dnyL * ymin;
nxR -= dnxR * ymin;
nyR -= dnyR * ymin;
uL -= duL * ymin;
vL -= dvL * ymin;
uR -= duR * ymin;
vR -= dvR * ymin;
ymin = 0;
}if (lh < ymax) {
ymax = lh;
}for (var y = ymin; y < ymax; y++) {
var dz = 0;
var dr = 0;
var dg = 0;
var db = 0;
var dnx = 0;
var dny = 0;
var du = 0;
var dv = 0;
var ixL = ((xL + (2048)) >> 12);
var ixR = ((xR + (2048)) >> 12);
var dx = ixR - ixL;
var z = zL;
var nx = nxL;
var ny = nyL;
var u = uL;
var v = vL;
if (dx > 0) {
dz = Clazz.doubleToInt ((zR - zL) / dx);
dnx = Clazz.doubleToInt ((nxR - nxL) / dx);
dny = Clazz.doubleToInt ((nyR - nyL) / dx);
du = Clazz.doubleToInt ((uR - uL) / dx);
dv = Clazz.doubleToInt ((vR - vL) / dx);
}if (ixL < 0) {
z -= dz * ixL;
nx -= dnx * ixL;
ny -= dny * ixL;
u -= du * ixL;
v -= dv * ixL;
ixL = 0;
}if (ixR > lw) {
ixR = lw;
}var i = ixL + lw * y;
for (; ixL < ixR; ixL++) {
if ((z > zb[i])) {
var c;
var lookup = (((nx) >> 12) + (((ny) >> 12) << 8));
var ucoord = (u >> 12);
var vcoord = (v >> 12);
if (ucoord < 0) ucoord = 0;
 else if (ucoord > 255) ucoord = 255;
if (vcoord < 0 || vcoord >= 256) continue;
c = tmap[ucoord + (vcoord << 8)];
if ((c & 0xffffff) == 0) continue;
c = astex.util.Color32.multiply (c, dmap[lookup]);
zb[i] = z;
c = astex.util.Color32.blendI (c, px[i], this.transparency);
var s = smap[lookup];
c = astex.util.Color32.add (c, s);
var zscale = Clazz.doubleToInt ((z - this.backClip) / this.zRange);
var shade = this.depthScale[zscale];
px[i] = astex.util.Color32.blendI (c, this.background, shade);
}z += dz;
nx += dnx;
ny += dny;
u += du;
v += dv;
i++;
}
xL += dxL;
zL += dzL;
xR += dxR;
zR += dzR;
nxL += dnxL;
nyL += dnyL;
nxR += dnxR;
nyR += dnyR;
uL += duL;
vL += dvL;
uR += duR;
vR += dvR;
}
});
Clazz.defineMethod (c$, "renderTrianglePTrans", 
 function () {
var ymin = ((this.vA.y + (2048)) >> 12);
var ymax = ((this.vC.y + (2048)) >> 12);
if (ymax < 0 || ymin >= this.pixelHeight) {
return;
}var dy = ymax - ymin;
if (dy <= 0) {
return;
}var zb = this.zbuffer;
var px = this.pbuffer;
var smap = this.highlightMap;
var dmap = this.diffuseMap;
var imap = this.intensityMap;
var lw = this.pixelWidth;
var lh = this.pixelHeight;
var cmap = this.colorMap;
var xL = this.vA.x;
var zL = this.vA.z;
var xR = this.vB.x;
var zR = this.vB.z;
var nxL = this.vA.nx;
var nyL = this.vA.ny;
var nxR = this.vB.nx;
var nyR = this.vB.ny;
var dxL = Clazz.doubleToInt ((this.vC.x - this.vA.x) / dy);
var dzL = Clazz.doubleToInt ((this.vC.z - this.vA.z) / dy);
var dxR = Clazz.doubleToInt ((this.vD.x - this.vB.x) / dy);
var dzR = Clazz.doubleToInt ((this.vD.z - this.vB.z) / dy);
var dnxL = Clazz.doubleToInt ((this.vC.nx - this.vA.nx) / dy);
var dnyL = Clazz.doubleToInt ((this.vC.ny - this.vA.ny) / dy);
var dnxR = Clazz.doubleToInt ((this.vD.nx - this.vB.nx) / dy);
var dnyR = Clazz.doubleToInt ((this.vD.ny - this.vB.ny) / dy);
if (ymin < 0) {
xL -= dxL * ymin;
zL -= dzL * ymin;
xR -= dxR * ymin;
zR -= dzR * ymin;
nxL -= dnxL * ymin;
nyL -= dnyL * ymin;
nxR -= dnxR * ymin;
nyR -= dnyR * ymin;
ymin = 0;
}if (lh < ymax) {
ymax = lh;
}for (var y = ymin; y < ymax; y++) {
var dz = 0;
var dr = 0;
var dg = 0;
var db = 0;
var dnx = 0;
var dny = 0;
var du = 0;
var dv = 0;
var ixL = ((xL + (2048)) >> 12);
var ixR = ((xR + (2048)) >> 12);
var dx = ixR - ixL;
var z = zL;
var nx = nxL;
var ny = nyL;
if (dx > 0) {
dz = Clazz.doubleToInt ((zR - zL) / dx);
dnx = Clazz.doubleToInt ((nxR - nxL) / dx);
dny = Clazz.doubleToInt ((nyR - nyL) / dx);
}if (ixL < 0) {
z -= dz * ixL;
nx -= dnx * ixL;
ny -= dny * ixL;
ixL = 0;
}if (ixR > lw) {
ixR = lw;
}var i = ixL + lw * y;
for (; ixL < ixR; ixL++) {
if ((z > zb[i])) {
var c;
var lookup = (((nx) >> 12) + (((ny) >> 12) << 8));
c = cmap[lookup];
zb[i] = z;
c = astex.util.Color32.blendI (c, px[i], this.transparency);
var s = smap[lookup];
c = astex.util.Color32.add (c, s);
var zscale = Clazz.doubleToInt ((z - this.backClip) / this.zRange);
var shade = this.depthScale[zscale];
px[i] = astex.util.Color32.blendI (c, this.background, shade);
}z += dz;
nx += dnx;
ny += dny;
i++;
}
xL += dxL;
zL += dzL;
xR += dxR;
zR += dzR;
nxL += dnxL;
nyL += dnyL;
nxR += dnxR;
nyR += dnyR;
}
});
Clazz.defineMethod (c$, "renderTrianglePTransC", 
 function () {
var ymin = ((this.vA.y + (2048)) >> 12);
var ymax = ((this.vC.y + (2048)) >> 12);
if (ymax < 0 || ymin >= this.pixelHeight) {
return;
}var dy = ymax - ymin;
if (dy <= 0) {
return;
}var zb = this.zbuffer;
var px = this.pbuffer;
var smap = this.highlightMap;
var dmap = this.diffuseMap;
var imap = this.intensityMap;
var lw = this.pixelWidth;
var lh = this.pixelHeight;
var cmap = this.colorMap;
var xL = this.vA.x;
var zL = this.vA.z;
var xR = this.vB.x;
var zR = this.vB.z;
var nxL = this.vA.nx;
var nyL = this.vA.ny;
var nxR = this.vB.nx;
var nyR = this.vB.ny;
var dxL = Clazz.doubleToInt ((this.vC.x - this.vA.x) / dy);
var dzL = Clazz.doubleToInt ((this.vC.z - this.vA.z) / dy);
var dxR = Clazz.doubleToInt ((this.vD.x - this.vB.x) / dy);
var dzR = Clazz.doubleToInt ((this.vD.z - this.vB.z) / dy);
var dnxL = Clazz.doubleToInt ((this.vC.nx - this.vA.nx) / dy);
var dnyL = Clazz.doubleToInt ((this.vC.ny - this.vA.ny) / dy);
var dnxR = Clazz.doubleToInt ((this.vD.nx - this.vB.nx) / dy);
var dnyR = Clazz.doubleToInt ((this.vD.ny - this.vB.ny) / dy);
if (ymin < 0) {
xL -= dxL * ymin;
zL -= dzL * ymin;
xR -= dxR * ymin;
zR -= dzR * ymin;
nxL -= dnxL * ymin;
nyL -= dnyL * ymin;
nxR -= dnxR * ymin;
nyR -= dnyR * ymin;
ymin = 0;
}if (lh < ymax) {
ymax = lh;
}for (var y = ymin; y < ymax; y++) {
var dz = 0;
var dr = 0;
var dg = 0;
var db = 0;
var dnx = 0;
var dny = 0;
var du = 0;
var dv = 0;
var ixL = ((xL + (2048)) >> 12);
var ixR = ((xR + (2048)) >> 12);
var dx = ixR - ixL;
var z = zL;
var nx = nxL;
var ny = nyL;
if (dx > 0) {
dz = Clazz.doubleToInt ((zR - zL) / dx);
dnx = Clazz.doubleToInt ((nxR - nxL) / dx);
dny = Clazz.doubleToInt ((nyR - nyL) / dx);
}if (ixL < 0) {
z -= dz * ixL;
nx -= dnx * ixL;
ny -= dny * ixL;
ixL = 0;
}if (ixR > lw) {
ixR = lw;
}var i = ixL + lw * y;
for (; ixL < ixR; ixL++) {
if ((z < this.frontClip && z >= zb[i])) {
var c;
var lookup = (((nx) >> 12) + (((ny) >> 12) << 8));
c = cmap[lookup];
zb[i] = z;
c = astex.util.Color32.blendI (c, px[i], this.transparency);
var s = smap[lookup];
c = astex.util.Color32.add (c, s);
var zscale = Clazz.doubleToInt ((z - this.backClip) / this.zRange);
var shade = this.depthScale[zscale];
px[i] = astex.util.Color32.blendI (c, this.background, shade);
}z += dz;
nx += dnx;
ny += dny;
i++;
}
xL += dxL;
zL += dzL;
xR += dxR;
zR += dzR;
nxL += dnxL;
nyL += dnyL;
nxR += dnxR;
nyR += dnyR;
}
});
Clazz.defineMethod (c$, "renderTriangleTTransC", 
 function () {
var ymin = ((this.vA.y + (2048)) >> 12);
var ymax = ((this.vC.y + (2048)) >> 12);
if (ymax < 0 || ymin >= this.pixelHeight) {
return;
}var dy = ymax - ymin;
if (dy <= 0) {
return;
}var zb = this.zbuffer;
var px = this.pbuffer;
var smap = this.highlightMap;
var dmap = this.diffuseMap;
var imap = this.intensityMap;
var tmap = null;
if (this.texture != null) {
tmap = this.texture.pixels;
}var lw = this.pixelWidth;
var lh = this.pixelHeight;
var cmap = this.colorMap;
var xL = this.vA.x;
var zL = this.vA.z;
var xR = this.vB.x;
var zR = this.vB.z;
var nxL = this.vA.nx;
var nyL = this.vA.ny;
var nxR = this.vB.nx;
var nyR = this.vB.ny;
var uL = this.vA.u;
var vL = this.vA.v;
var uR = this.vB.u;
var vR = this.vB.v;
var dxL = Clazz.doubleToInt ((this.vC.x - this.vA.x) / dy);
var dzL = Clazz.doubleToInt ((this.vC.z - this.vA.z) / dy);
var dxR = Clazz.doubleToInt ((this.vD.x - this.vB.x) / dy);
var dzR = Clazz.doubleToInt ((this.vD.z - this.vB.z) / dy);
var dnxL = Clazz.doubleToInt ((this.vC.nx - this.vA.nx) / dy);
var dnyL = Clazz.doubleToInt ((this.vC.ny - this.vA.ny) / dy);
var dnxR = Clazz.doubleToInt ((this.vD.nx - this.vB.nx) / dy);
var dnyR = Clazz.doubleToInt ((this.vD.ny - this.vB.ny) / dy);
var duL = Clazz.doubleToInt ((this.vC.u - this.vA.u) / dy);
var dvL = Clazz.doubleToInt ((this.vC.v - this.vA.v) / dy);
var duR = Clazz.doubleToInt ((this.vD.u - this.vB.u) / dy);
var dvR = Clazz.doubleToInt ((this.vD.v - this.vB.v) / dy);
if (ymin < 0) {
xL -= dxL * ymin;
zL -= dzL * ymin;
xR -= dxR * ymin;
zR -= dzR * ymin;
nxL -= dnxL * ymin;
nyL -= dnyL * ymin;
nxR -= dnxR * ymin;
nyR -= dnyR * ymin;
uL -= duL * ymin;
vL -= dvL * ymin;
uR -= duR * ymin;
vR -= dvR * ymin;
ymin = 0;
}if (lh < ymax) {
ymax = lh;
}for (var y = ymin; y < ymax; y++) {
var dz = 0;
var dr = 0;
var dg = 0;
var db = 0;
var dnx = 0;
var dny = 0;
var du = 0;
var dv = 0;
var ixL = ((xL + (2048)) >> 12);
var ixR = ((xR + (2048)) >> 12);
var dx = ixR - ixL;
var z = zL;
var nx = nxL;
var ny = nyL;
var u = uL;
var v = vL;
if (dx > 0) {
dz = Clazz.doubleToInt ((zR - zL) / dx);
dnx = Clazz.doubleToInt ((nxR - nxL) / dx);
dny = Clazz.doubleToInt ((nyR - nyL) / dx);
du = Clazz.doubleToInt ((uR - uL) / dx);
dv = Clazz.doubleToInt ((vR - vL) / dx);
}if (ixL < 0) {
z -= dz * ixL;
nx -= dnx * ixL;
ny -= dny * ixL;
u -= du * ixL;
v -= dv * ixL;
ixL = 0;
}if (ixR > lw) {
ixR = lw;
}var i = ixL + lw * y;
for (; ixL < ixR; ixL++) {
if ((z < this.frontClip && z >= zb[i])) {
var c;
var lookup = (((nx) >> 12) + (((ny) >> 12) << 8));
var ucoord = (u >> 12);
var vcoord = (v >> 12);
if (ucoord < 0) ucoord = 0;
 else if (ucoord > 255) ucoord = 255;
if (vcoord < 0 || vcoord >= 256) continue;
c = tmap[ucoord + (vcoord << 8)];
if ((c & 0xffffff) == 0) continue;
c = astex.util.Color32.multiply (c, dmap[lookup]);
zb[i] = z;
c = astex.util.Color32.blendI (c, px[i], this.transparency);
var s = smap[lookup];
c = astex.util.Color32.add (c, s);
var zscale = Clazz.doubleToInt ((z - this.backClip) / this.zRange);
var shade = this.depthScale[zscale];
px[i] = astex.util.Color32.blendI (c, this.background, shade);
}z += dz;
nx += dnx;
ny += dny;
u += du;
v += dv;
i++;
}
xL += dxL;
zL += dzL;
xR += dxR;
zR += dzR;
nxL += dnxL;
nyL += dnyL;
nxR += dnxR;
nyR += dnyR;
uL += duL;
vL += dvL;
uR += duR;
vR += dvR;
}
});
Clazz.defineMethod (c$, "renderTrianglePC", 
 function () {
var ymin = ((this.vA.y + (2048)) >> 12);
var ymax = ((this.vC.y + (2048)) >> 12);
if (ymax < 0 || ymin >= this.pixelHeight) {
return;
}var dy = ymax - ymin;
if (dy <= 0) {
return;
}var zb = this.zbuffer;
var px = this.pbuffer;
var smap = this.highlightMap;
var dmap = this.diffuseMap;
var imap = this.intensityMap;
var lw = this.pixelWidth;
var lh = this.pixelHeight;
var cmap = this.colorMap;
var xL = this.vA.x;
var zL = this.vA.z;
var xR = this.vB.x;
var zR = this.vB.z;
var nxL = this.vA.nx;
var nyL = this.vA.ny;
var nxR = this.vB.nx;
var nyR = this.vB.ny;
var dxL = Clazz.doubleToInt ((this.vC.x - this.vA.x) / dy);
var dzL = Clazz.doubleToInt ((this.vC.z - this.vA.z) / dy);
var dxR = Clazz.doubleToInt ((this.vD.x - this.vB.x) / dy);
var dzR = Clazz.doubleToInt ((this.vD.z - this.vB.z) / dy);
var dnxL = Clazz.doubleToInt ((this.vC.nx - this.vA.nx) / dy);
var dnyL = Clazz.doubleToInt ((this.vC.ny - this.vA.ny) / dy);
var dnxR = Clazz.doubleToInt ((this.vD.nx - this.vB.nx) / dy);
var dnyR = Clazz.doubleToInt ((this.vD.ny - this.vB.ny) / dy);
if (ymin < 0) {
xL -= dxL * ymin;
zL -= dzL * ymin;
xR -= dxR * ymin;
zR -= dzR * ymin;
nxL -= dnxL * ymin;
nyL -= dnyL * ymin;
nxR -= dnxR * ymin;
nyR -= dnyR * ymin;
ymin = 0;
}if (lh < ymax) {
ymax = lh;
}for (var y = ymin; y < ymax; y++) {
var dz = 0;
var dr = 0;
var dg = 0;
var db = 0;
var dnx = 0;
var dny = 0;
var du = 0;
var dv = 0;
var ixL = ((xL + (2048)) >> 12);
var ixR = ((xR + (2048)) >> 12);
var dx = ixR - ixL;
var z = zL;
var nx = nxL;
var ny = nyL;
if (dx > 0) {
dz = Clazz.doubleToInt ((zR - zL) / dx);
dnx = Clazz.doubleToInt ((nxR - nxL) / dx);
dny = Clazz.doubleToInt ((nyR - nyL) / dx);
}if (ixL < 0) {
z -= dz * ixL;
nx -= dnx * ixL;
ny -= dny * ixL;
ixL = 0;
}if (ixR > lw) {
ixR = lw;
}var i = ixL + lw * y;
for (; ixL < ixR; ixL++) {
if ((z < this.frontClip && z >= zb[i])) {
var c;
var lookup = (((nx) >> 12) + (((ny) >> 12) << 8));
c = cmap[lookup];
zb[i] = z;
var s = smap[lookup];
c = astex.util.Color32.add (c, s);
var zscale = Clazz.doubleToInt ((z - this.backClip) / this.zRange);
var shade = this.depthScale[zscale];
px[i] = astex.util.Color32.blendI (c, this.background, shade);
}z += dz;
nx += dnx;
ny += dny;
i++;
}
xL += dxL;
zL += dzL;
xR += dxR;
zR += dzR;
nxL += dnxL;
nyL += dnyL;
nxR += dnxR;
nyR += dnyR;
}
});
Clazz.defineMethod (c$, "renderTriangleT", 
 function () {
var ymin = ((this.vA.y + (2048)) >> 12);
var ymax = ((this.vC.y + (2048)) >> 12);
if (ymax < 0 || ymin >= this.pixelHeight) {
return;
}var dy = ymax - ymin;
if (dy <= 0) {
return;
}var zb = this.zbuffer;
var px = this.pbuffer;
var smap = this.highlightMap;
var dmap = this.diffuseMap;
var imap = this.intensityMap;
var tmap = null;
if (this.texture != null) {
tmap = this.texture.pixels;
}var lw = this.pixelWidth;
var lh = this.pixelHeight;
var cmap = this.colorMap;
var xL = this.vA.x;
var zL = this.vA.z;
var xR = this.vB.x;
var zR = this.vB.z;
var nxL = this.vA.nx;
var nyL = this.vA.ny;
var nxR = this.vB.nx;
var nyR = this.vB.ny;
var uL = this.vA.u;
var vL = this.vA.v;
var uR = this.vB.u;
var vR = this.vB.v;
var dxL = Clazz.doubleToInt ((this.vC.x - this.vA.x) / dy);
var dzL = Clazz.doubleToInt ((this.vC.z - this.vA.z) / dy);
var dxR = Clazz.doubleToInt ((this.vD.x - this.vB.x) / dy);
var dzR = Clazz.doubleToInt ((this.vD.z - this.vB.z) / dy);
var dnxL = Clazz.doubleToInt ((this.vC.nx - this.vA.nx) / dy);
var dnyL = Clazz.doubleToInt ((this.vC.ny - this.vA.ny) / dy);
var dnxR = Clazz.doubleToInt ((this.vD.nx - this.vB.nx) / dy);
var dnyR = Clazz.doubleToInt ((this.vD.ny - this.vB.ny) / dy);
var duL = Clazz.doubleToInt ((this.vC.u - this.vA.u) / dy);
var dvL = Clazz.doubleToInt ((this.vC.v - this.vA.v) / dy);
var duR = Clazz.doubleToInt ((this.vD.u - this.vB.u) / dy);
var dvR = Clazz.doubleToInt ((this.vD.v - this.vB.v) / dy);
if (ymin < 0) {
xL -= dxL * ymin;
zL -= dzL * ymin;
xR -= dxR * ymin;
zR -= dzR * ymin;
nxL -= dnxL * ymin;
nyL -= dnyL * ymin;
nxR -= dnxR * ymin;
nyR -= dnyR * ymin;
uL -= duL * ymin;
vL -= dvL * ymin;
uR -= duR * ymin;
vR -= dvR * ymin;
ymin = 0;
}if (lh < ymax) {
ymax = lh;
}for (var y = ymin; y < ymax; y++) {
var dz = 0;
var dr = 0;
var dg = 0;
var db = 0;
var dnx = 0;
var dny = 0;
var du = 0;
var dv = 0;
var ixL = ((xL + (2048)) >> 12);
var ixR = ((xR + (2048)) >> 12);
var dx = ixR - ixL;
var z = zL;
var nx = nxL;
var ny = nyL;
var u = uL;
var v = vL;
if (dx > 0) {
dz = Clazz.doubleToInt ((zR - zL) / dx);
dnx = Clazz.doubleToInt ((nxR - nxL) / dx);
dny = Clazz.doubleToInt ((nyR - nyL) / dx);
du = Clazz.doubleToInt ((uR - uL) / dx);
dv = Clazz.doubleToInt ((vR - vL) / dx);
}if (ixL < 0) {
z -= dz * ixL;
nx -= dnx * ixL;
ny -= dny * ixL;
u -= du * ixL;
v -= dv * ixL;
ixL = 0;
}if (ixR > lw) {
ixR = lw;
}var i = ixL + lw * y;
for (; ixL < ixR; ixL++) {
if ((z > zb[i])) {
var c;
var lookup = (((nx) >> 12) + (((ny) >> 12) << 8));
var ucoord = (u >> 12);
var vcoord = (v >> 12);
if (ucoord < 0) ucoord = 0;
 else if (ucoord > 255) ucoord = 255;
if (vcoord < 0 || vcoord >= 256) continue;
c = tmap[ucoord + (vcoord << 8)];
if ((c & 0xffffff) == 0) continue;
c = astex.util.Color32.multiply (c, dmap[lookup]);
zb[i] = z;
var s = smap[lookup];
c = astex.util.Color32.add (c, s);
var zscale = Clazz.doubleToInt ((z - this.backClip) / this.zRange);
var shade = this.depthScale[zscale];
px[i] = astex.util.Color32.blendI (c, this.background, shade);
}z += dz;
nx += dnx;
ny += dny;
u += du;
v += dv;
i++;
}
xL += dxL;
zL += dzL;
xR += dxR;
zR += dzR;
nxL += dnxL;
nyL += dnyL;
nxR += dnxR;
nyR += dnyR;
uL += duL;
vL += dvL;
uR += duR;
vR += dvR;
}
});
Clazz.defineMethod (c$, "renderTriangleTF", 
 function () {
var ymin = ((this.vA.y + (2048)) >> 12);
var ymax = ((this.vC.y + (2048)) >> 12);
if (ymax < 0 || ymin >= this.pixelHeight) {
return;
}var dy = ymax - ymin;
if (dy <= 0) {
return;
}var zb = this.zbuffer;
var px = this.pbuffer;
var smap = this.highlightMap;
var dmap = this.diffuseMap;
var imap = this.intensityMap;
var tmap = null;
if (this.texture != null) {
tmap = this.texture.pixels;
}var lw = this.pixelWidth;
var lh = this.pixelHeight;
var cmap = this.colorMap;
var xL = this.vA.x;
var zL = this.vA.z;
var xR = this.vB.x;
var zR = this.vB.z;
var nxL = this.vA.nx;
var nyL = this.vA.ny;
var nxR = this.vB.nx;
var nyR = this.vB.ny;
var uL = this.vA.u;
var vL = this.vA.v;
var uR = this.vB.u;
var vR = this.vB.v;
var dxL = Clazz.doubleToInt ((this.vC.x - this.vA.x) / dy);
var dzL = Clazz.doubleToInt ((this.vC.z - this.vA.z) / dy);
var dxR = Clazz.doubleToInt ((this.vD.x - this.vB.x) / dy);
var dzR = Clazz.doubleToInt ((this.vD.z - this.vB.z) / dy);
var dnxL = Clazz.doubleToInt ((this.vC.nx - this.vA.nx) / dy);
var dnyL = Clazz.doubleToInt ((this.vC.ny - this.vA.ny) / dy);
var dnxR = Clazz.doubleToInt ((this.vD.nx - this.vB.nx) / dy);
var dnyR = Clazz.doubleToInt ((this.vD.ny - this.vB.ny) / dy);
var duL = Clazz.doubleToInt ((this.vC.u - this.vA.u) / dy);
var dvL = Clazz.doubleToInt ((this.vC.v - this.vA.v) / dy);
var duR = Clazz.doubleToInt ((this.vD.u - this.vB.u) / dy);
var dvR = Clazz.doubleToInt ((this.vD.v - this.vB.v) / dy);
if (ymin < 0) {
xL -= dxL * ymin;
zL -= dzL * ymin;
xR -= dxR * ymin;
zR -= dzR * ymin;
nxL -= dnxL * ymin;
nyL -= dnyL * ymin;
nxR -= dnxR * ymin;
nyR -= dnyR * ymin;
uL -= duL * ymin;
vL -= dvL * ymin;
uR -= duR * ymin;
vR -= dvR * ymin;
ymin = 0;
}if (lh < ymax) {
ymax = lh;
}for (var y = ymin; y < ymax; y++) {
var dz = 0;
var dr = 0;
var dg = 0;
var db = 0;
var dnx = 0;
var dny = 0;
var du = 0;
var dv = 0;
var ixL = ((xL + (2048)) >> 12);
var ixR = ((xR + (2048)) >> 12);
var dx = ixR - ixL;
var z = zL;
var nx = nxL;
var ny = nyL;
var u = uL;
var v = vL;
if (dx > 0) {
dz = Clazz.doubleToInt ((zR - zL) / dx);
dnx = Clazz.doubleToInt ((nxR - nxL) / dx);
dny = Clazz.doubleToInt ((nyR - nyL) / dx);
du = Clazz.doubleToInt ((uR - uL) / dx);
dv = Clazz.doubleToInt ((vR - vL) / dx);
}if (ixL < 0) {
z -= dz * ixL;
nx -= dnx * ixL;
ny -= dny * ixL;
u -= du * ixL;
v -= dv * ixL;
ixL = 0;
}if (ixR > lw) {
ixR = lw;
}var i = ixL + lw * y;
for (; ixL < ixR; ixL++) {
if ((z > zb[i])) {
var c;
var lookup = (((nx) >> 12) + (((ny) >> 12) << 8));
var ucoord = (u >> 12);
var vcoord = (v >> 12);
if (ucoord < 0) ucoord = 0;
 else if (ucoord > 255) ucoord = 255;
if (vcoord < 0 || vcoord >= 256) continue;
c = tmap[ucoord + (vcoord << 8)];
if ((c & 0xffffff) == 0) continue;
c = astex.util.Color32.multiply (c, dmap[lookup]);
zb[i] = z;
var s = smap[lookup];
c = astex.util.Color32.add (c, s);
var zscale = Clazz.doubleToInt ((z - this.backClip) / this.zRange);
var shade = this.depthScale[zscale];
px[i] = astex.util.Color32.blendI (c, this.background, shade);
}z += dz;
nx += dnx;
ny += dny;
u += du;
v += dv;
i++;
}
xL += dxL;
zL += dzL;
xR += dxR;
zR += dzR;
nxL += dnxL;
nyL += dnyL;
nxR += dnxR;
nyR += dnyR;
uL += duL;
vL += dvL;
uR += duR;
vR += dvR;
}
});
Clazz.defineMethod (c$, "renderTriangleTC", 
 function () {
var ymin = ((this.vA.y + (2048)) >> 12);
var ymax = ((this.vC.y + (2048)) >> 12);
if (ymax < 0 || ymin >= this.pixelHeight) {
return;
}var dy = ymax - ymin;
if (dy <= 0) {
return;
}var zb = this.zbuffer;
var px = this.pbuffer;
var smap = this.highlightMap;
var dmap = this.diffuseMap;
var imap = this.intensityMap;
var tmap = null;
if (this.texture != null) {
tmap = this.texture.pixels;
}var lw = this.pixelWidth;
var lh = this.pixelHeight;
var cmap = this.colorMap;
var xL = this.vA.x;
var zL = this.vA.z;
var xR = this.vB.x;
var zR = this.vB.z;
var nxL = this.vA.nx;
var nyL = this.vA.ny;
var nxR = this.vB.nx;
var nyR = this.vB.ny;
var uL = this.vA.u;
var vL = this.vA.v;
var uR = this.vB.u;
var vR = this.vB.v;
var dxL = Clazz.doubleToInt ((this.vC.x - this.vA.x) / dy);
var dzL = Clazz.doubleToInt ((this.vC.z - this.vA.z) / dy);
var dxR = Clazz.doubleToInt ((this.vD.x - this.vB.x) / dy);
var dzR = Clazz.doubleToInt ((this.vD.z - this.vB.z) / dy);
var dnxL = Clazz.doubleToInt ((this.vC.nx - this.vA.nx) / dy);
var dnyL = Clazz.doubleToInt ((this.vC.ny - this.vA.ny) / dy);
var dnxR = Clazz.doubleToInt ((this.vD.nx - this.vB.nx) / dy);
var dnyR = Clazz.doubleToInt ((this.vD.ny - this.vB.ny) / dy);
var duL = Clazz.doubleToInt ((this.vC.u - this.vA.u) / dy);
var dvL = Clazz.doubleToInt ((this.vC.v - this.vA.v) / dy);
var duR = Clazz.doubleToInt ((this.vD.u - this.vB.u) / dy);
var dvR = Clazz.doubleToInt ((this.vD.v - this.vB.v) / dy);
if (ymin < 0) {
xL -= dxL * ymin;
zL -= dzL * ymin;
xR -= dxR * ymin;
zR -= dzR * ymin;
nxL -= dnxL * ymin;
nyL -= dnyL * ymin;
nxR -= dnxR * ymin;
nyR -= dnyR * ymin;
uL -= duL * ymin;
vL -= dvL * ymin;
uR -= duR * ymin;
vR -= dvR * ymin;
ymin = 0;
}if (lh < ymax) {
ymax = lh;
}for (var y = ymin; y < ymax; y++) {
var dz = 0;
var dr = 0;
var dg = 0;
var db = 0;
var dnx = 0;
var dny = 0;
var du = 0;
var dv = 0;
var ixL = ((xL + (2048)) >> 12);
var ixR = ((xR + (2048)) >> 12);
var dx = ixR - ixL;
var z = zL;
var nx = nxL;
var ny = nyL;
var u = uL;
var v = vL;
if (dx > 0) {
dz = Clazz.doubleToInt ((zR - zL) / dx);
dnx = Clazz.doubleToInt ((nxR - nxL) / dx);
dny = Clazz.doubleToInt ((nyR - nyL) / dx);
du = Clazz.doubleToInt ((uR - uL) / dx);
dv = Clazz.doubleToInt ((vR - vL) / dx);
}if (ixL < 0) {
z -= dz * ixL;
nx -= dnx * ixL;
ny -= dny * ixL;
u -= du * ixL;
v -= dv * ixL;
ixL = 0;
}if (ixR > lw) {
ixR = lw;
}var i = ixL + lw * y;
for (; ixL < ixR; ixL++) {
if ((z < this.frontClip && z >= zb[i])) {
var c;
var lookup = (((nx) >> 12) + (((ny) >> 12) << 8));
var ucoord = (u >> 12);
var vcoord = (v >> 12);
if (ucoord < 0) ucoord = 0;
 else if (ucoord > 255) ucoord = 255;
if (vcoord < 0 || vcoord >= 256) continue;
c = tmap[ucoord + (vcoord << 8)];
if ((c & 0xffffff) == 0) continue;
c = astex.util.Color32.multiply (c, dmap[lookup]);
zb[i] = z;
var s = smap[lookup];
c = astex.util.Color32.add (c, s);
var zscale = Clazz.doubleToInt ((z - this.backClip) / this.zRange);
var shade = this.depthScale[zscale];
px[i] = astex.util.Color32.blendI (c, this.background, shade);
}z += dz;
nx += dnx;
ny += dny;
u += du;
v += dv;
i++;
}
xL += dxL;
zL += dzL;
xR += dxR;
zR += dzR;
nxL += dnxL;
nyL += dnyL;
nxR += dnxR;
nyR += dnyR;
uL += duL;
vL += dvL;
uR += duR;
vR += dvR;
}
});
Clazz.defineMethod (c$, "drawFastIntegerLine", 
 function (x1, y1, z1, x2, y2, z2, rgb) {
var incr1;
var incr2;
var d;
var x;
var y;
var xend;
var yend;
var xdirflag;
var ydirflag;
var z;
var dz;
var pb = this.pbuffer;
var zb = this.zbuffer;
var dx = x2 - x1;
if (dx < 0) dx = -dx;
var dy = y2 - y1;
if (dy < 0) dy = -dy;
var pixelIndex = 0;
if (dy == 0 && dx == 0) {
x = x1;
y = y1;
pixelIndex = y * this.pixelWidth + x;
z = z1 > z2 ? z1 : z2;
if (z > zb[pixelIndex]) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}return;
}if (dy <= dx) {
d = 2 * dy - dx;
incr1 = 2 * dy;
incr2 = 2 * (dy - dx);
if (x1 > x2) {
x = x2;
y = y2;
z = z2;
dz = Clazz.doubleToInt ((z1 - z2) / dx);
ydirflag = (-1);
xend = x1;
} else {
x = x1;
y = y1;
z = z1;
dz = Clazz.doubleToInt ((z2 - z1) / dx);
ydirflag = 1;
xend = x2;
}pixelIndex = y * this.pixelWidth + x;
if (z > zb[pixelIndex]) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}if (((y2 - y1) * ydirflag) > 0) {
while (x < xend) {
x++;
z += dz;
if (d < 0) {
d += incr1;
} else {
y++;
pixelIndex += this.pixelWidth;
d += incr2;
}pixelIndex++;
if (z > zb[pixelIndex]) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}}
} else {
while (x < xend) {
x++;
z += dz;
if (d < 0) {
d += incr1;
} else {
y--;
pixelIndex -= this.pixelWidth;
d += incr2;
}pixelIndex++;
if (z > zb[pixelIndex]) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}}
}} else {
d = 2 * dx - dy;
incr1 = 2 * dx;
incr2 = 2 * (dx - dy);
if (y1 > y2) {
y = y2;
x = x2;
z = z2;
dz = Clazz.doubleToInt ((z1 - z2) / dy);
yend = y1;
xdirflag = (-1);
} else {
y = y1;
x = x1;
z = z1;
dz = Clazz.doubleToInt ((z2 - z1) / dy);
yend = y2;
xdirflag = 1;
}pixelIndex = y * this.pixelWidth + x;
if (z > zb[pixelIndex]) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}if (((x2 - x1) * xdirflag) > 0) {
while (y < yend) {
y++;
z += dz;
if (d < 0) {
d += incr1;
} else {
x++;
pixelIndex++;
d += incr2;
}pixelIndex += this.pixelWidth;
if (z > zb[pixelIndex]) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}}
} else {
while (y < yend) {
y++;
z += dz;
if (d < 0) {
d += incr1;
} else {
x--;
pixelIndex--;
d += incr2;
}pixelIndex += this.pixelWidth;
if (z > zb[pixelIndex]) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}}
}}}, "~N,~N,~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "drawWideBar", 
 function (x, y, rgb, len, width) {
var pb = this.pbuffer;
var zb = this.zbuffer;
for (var w = 0; w < width; w++) {
var pi = (y + w) * this.pixelWidth + x;
for (var i = 0; i < len; i++, pi++) {
if (0 > zb[pi]) {
zb[pi] = 0;
pb[pi] = rgb;
}}
}
return;
}, "~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "drawSafeIntegerLine", 
 function (x1, y1, z1, x2, y2, z2, rgb) {
var incr1;
var incr2;
var d;
var x;
var y;
var xend;
var yend;
var xdirflag;
var ydirflag;
var z;
var dz;
var pb = this.pbuffer;
var zb = this.zbuffer;
var dx = x2 - x1;
if (dx < 0) dx = -dx;
var dy = y2 - y1;
if (dy < 0) dy = -dy;
var pixelIndex = 0;
if (dy == 0 && dx == 0) {
x = x1;
y = y1;
pixelIndex = y * this.pixelWidth + x;
z = z1 > z2 ? z1 : z2;
if (x >= 0 && y >= 0 && x < this.pixelWidth && y < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}return;
}if (dy <= dx) {
d = 2 * dy - dx;
incr1 = 2 * dy;
incr2 = 2 * (dy - dx);
if (x1 > x2) {
x = x2;
y = y2;
z = z2;
dz = Clazz.doubleToInt ((z1 - z2) / dx);
ydirflag = (-1);
xend = x1;
} else {
x = x1;
y = y1;
z = z1;
dz = Clazz.doubleToInt ((z2 - z1) / dx);
ydirflag = 1;
xend = x2;
}pixelIndex = y * this.pixelWidth + x;
if (x >= 0 && y >= 0 && x < this.pixelWidth && y < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}if (((y2 - y1) * ydirflag) > 0) {
while (x < xend) {
x++;
z += dz;
if (d < 0) {
d += incr1;
} else {
y++;
pixelIndex += this.pixelWidth;
d += incr2;
}pixelIndex++;
if (x >= 0 && y >= 0 && x < this.pixelWidth && y < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}}
} else {
while (x < xend) {
x++;
z += dz;
if (d < 0) {
d += incr1;
} else {
y--;
pixelIndex -= this.pixelWidth;
d += incr2;
}pixelIndex++;
if (x >= 0 && y >= 0 && x < this.pixelWidth && y < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}}
}} else {
d = 2 * dx - dy;
incr1 = 2 * dx;
incr2 = 2 * (dx - dy);
if (y1 > y2) {
y = y2;
x = x2;
z = z2;
dz = Clazz.doubleToInt ((z1 - z2) / dy);
yend = y1;
xdirflag = (-1);
} else {
y = y1;
x = x1;
z = z1;
dz = Clazz.doubleToInt ((z2 - z1) / dy);
yend = y2;
xdirflag = 1;
}pixelIndex = y * this.pixelWidth + x;
if (x >= 0 && y >= 0 && x < this.pixelWidth && y < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}if (((x2 - x1) * xdirflag) > 0) {
while (y < yend) {
y++;
z += dz;
if (d < 0) {
d += incr1;
} else {
x++;
pixelIndex++;
d += incr2;
}pixelIndex += this.pixelWidth;
if (x >= 0 && y >= 0 && x < this.pixelWidth && y < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}}
} else {
while (y < yend) {
y++;
z += dz;
if (d < 0) {
d += incr1;
} else {
x--;
pixelIndex--;
d += incr2;
}pixelIndex += this.pixelWidth;
if (x >= 0 && y >= 0 && x < this.pixelWidth && y < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}}
}}}, "~N,~N,~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "drawWideIntegerLine", 
 function (x1, y1, z1, x2, y2, z2, rgb, width) {
var incr1;
var incr2;
var d;
var x;
var y;
var xend;
var yend;
var xdirflag;
var ydirflag;
var z;
var dz;
var pb = this.pbuffer;
var zb = this.zbuffer;
var dx = x2 - x1;
if (dx < 0) dx = -dx;
var dy = y2 - y1;
if (dy < 0) dy = -dy;
var pixelIndex = 0;
if (dy == 0 && dx == 0) {
x = x1;
y = y1;
pixelIndex = y * this.pixelWidth + x;
z = z1 > z2 ? z1 : z2;
pixelIndex = this.pixelWidth * (y) + (x);
if ((x) >= 0 && (y) >= 0 && (x) < this.pixelWidth && (y) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y) + (x + 1);
if ((x + 1) >= 0 && (y) >= 0 && (x + 1) < this.pixelWidth && (y) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y + 1) + (x);
if ((x) >= 0 && (y + 1) >= 0 && (x) < this.pixelWidth && (y + 1) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y) + (x - 1);
if ((x - 1) >= 0 && (y) >= 0 && (x - 1) < this.pixelWidth && (y) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y - 1) + (x);
if ((x) >= 0 && (y - 1) >= 0 && (x) < this.pixelWidth && (y - 1) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}if (width > 2) {
pixelIndex = this.pixelWidth * (y + 1) + (x + 1);
if ((x + 1) >= 0 && (y + 1) >= 0 && (x + 1) < this.pixelWidth && (y + 1) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y + 1) + (x - 1);
if ((x - 1) >= 0 && (y + 1) >= 0 && (x - 1) < this.pixelWidth && (y + 1) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y - 1) + (x - 1);
if ((x - 1) >= 0 && (y - 1) >= 0 && (x - 1) < this.pixelWidth && (y - 1) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y - 1) + (x + 1);
if ((x + 1) >= 0 && (y - 1) >= 0 && (x + 1) < this.pixelWidth && (y - 1) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}}if (width > 4) {
pixelIndex = this.pixelWidth * (y + 2) + (x + 2);
if ((x + 2) >= 0 && (y + 2) >= 0 && (x + 2) < this.pixelWidth && (y + 2) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y + 2) + (x - 2);
if ((x - 2) >= 0 && (y + 2) >= 0 && (x - 2) < this.pixelWidth && (y + 2) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y - 2) + (x - 2);
if ((x - 2) >= 0 && (y - 2) >= 0 && (x - 2) < this.pixelWidth && (y - 2) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y - 2) + (x + 2);
if ((x + 2) >= 0 && (y - 2) >= 0 && (x + 2) < this.pixelWidth && (y - 2) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}}if (width > 6) {
pixelIndex = this.pixelWidth * (y + 3) + (x + 3);
if ((x + 3) >= 0 && (y + 3) >= 0 && (x + 3) < this.pixelWidth && (y + 3) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y + 3) + (x - 3);
if ((x - 3) >= 0 && (y + 3) >= 0 && (x - 3) < this.pixelWidth && (y + 3) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y - 3) + (x - 3);
if ((x - 3) >= 0 && (y - 3) >= 0 && (x - 3) < this.pixelWidth && (y - 3) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y - 3) + (x + 3);
if ((x + 3) >= 0 && (y - 3) >= 0 && (x + 3) < this.pixelWidth && (y - 3) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}}return;
}if (dy <= dx) {
d = 2 * dy - dx;
incr1 = 2 * dy;
incr2 = 2 * (dy - dx);
if (x1 > x2) {
x = x2;
y = y2;
z = z2;
dz = Clazz.doubleToInt ((z1 - z2) / dx);
ydirflag = (-1);
xend = x1;
} else {
x = x1;
y = y1;
z = z1;
dz = Clazz.doubleToInt ((z2 - z1) / dx);
ydirflag = 1;
xend = x2;
}pixelIndex = y * this.pixelWidth + x;
pixelIndex = this.pixelWidth * (y) + (x);
if ((x) >= 0 && (y) >= 0 && (x) < this.pixelWidth && (y) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y) + (x + 1);
if ((x + 1) >= 0 && (y) >= 0 && (x + 1) < this.pixelWidth && (y) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y + 1) + (x);
if ((x) >= 0 && (y + 1) >= 0 && (x) < this.pixelWidth && (y + 1) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y) + (x - 1);
if ((x - 1) >= 0 && (y) >= 0 && (x - 1) < this.pixelWidth && (y) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y - 1) + (x);
if ((x) >= 0 && (y - 1) >= 0 && (x) < this.pixelWidth && (y - 1) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}if (width > 2) {
pixelIndex = this.pixelWidth * (y + 1) + (x + 1);
if ((x + 1) >= 0 && (y + 1) >= 0 && (x + 1) < this.pixelWidth && (y + 1) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y + 1) + (x - 1);
if ((x - 1) >= 0 && (y + 1) >= 0 && (x - 1) < this.pixelWidth && (y + 1) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y - 1) + (x - 1);
if ((x - 1) >= 0 && (y - 1) >= 0 && (x - 1) < this.pixelWidth && (y - 1) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y - 1) + (x + 1);
if ((x + 1) >= 0 && (y - 1) >= 0 && (x + 1) < this.pixelWidth && (y - 1) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}}if (width > 4) {
pixelIndex = this.pixelWidth * (y + 2) + (x + 2);
if ((x + 2) >= 0 && (y + 2) >= 0 && (x + 2) < this.pixelWidth && (y + 2) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y + 2) + (x - 2);
if ((x - 2) >= 0 && (y + 2) >= 0 && (x - 2) < this.pixelWidth && (y + 2) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y - 2) + (x - 2);
if ((x - 2) >= 0 && (y - 2) >= 0 && (x - 2) < this.pixelWidth && (y - 2) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y - 2) + (x + 2);
if ((x + 2) >= 0 && (y - 2) >= 0 && (x + 2) < this.pixelWidth && (y - 2) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}}if (width > 6) {
pixelIndex = this.pixelWidth * (y + 3) + (x + 3);
if ((x + 3) >= 0 && (y + 3) >= 0 && (x + 3) < this.pixelWidth && (y + 3) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y + 3) + (x - 3);
if ((x - 3) >= 0 && (y + 3) >= 0 && (x - 3) < this.pixelWidth && (y + 3) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y - 3) + (x - 3);
if ((x - 3) >= 0 && (y - 3) >= 0 && (x - 3) < this.pixelWidth && (y - 3) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y - 3) + (x + 3);
if ((x + 3) >= 0 && (y - 3) >= 0 && (x + 3) < this.pixelWidth && (y - 3) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}}if (((y2 - y1) * ydirflag) > 0) {
while (x < xend) {
x++;
z += dz;
if (d < 0) {
d += incr1;
} else {
y++;
pixelIndex += this.pixelWidth;
d += incr2;
}pixelIndex++;
pixelIndex = this.pixelWidth * (y) + (x);
if ((x) >= 0 && (y) >= 0 && (x) < this.pixelWidth && (y) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y) + (x + 1);
if ((x + 1) >= 0 && (y) >= 0 && (x + 1) < this.pixelWidth && (y) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y + 1) + (x);
if ((x) >= 0 && (y + 1) >= 0 && (x) < this.pixelWidth && (y + 1) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y) + (x - 1);
if ((x - 1) >= 0 && (y) >= 0 && (x - 1) < this.pixelWidth && (y) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y - 1) + (x);
if ((x) >= 0 && (y - 1) >= 0 && (x) < this.pixelWidth && (y - 1) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}if (width > 2) {
pixelIndex = this.pixelWidth * (y + 1) + (x + 1);
if ((x + 1) >= 0 && (y + 1) >= 0 && (x + 1) < this.pixelWidth && (y + 1) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y + 1) + (x - 1);
if ((x - 1) >= 0 && (y + 1) >= 0 && (x - 1) < this.pixelWidth && (y + 1) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y - 1) + (x - 1);
if ((x - 1) >= 0 && (y - 1) >= 0 && (x - 1) < this.pixelWidth && (y - 1) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y - 1) + (x + 1);
if ((x + 1) >= 0 && (y - 1) >= 0 && (x + 1) < this.pixelWidth && (y - 1) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}}if (width > 4) {
pixelIndex = this.pixelWidth * (y + 2) + (x + 2);
if ((x + 2) >= 0 && (y + 2) >= 0 && (x + 2) < this.pixelWidth && (y + 2) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y + 2) + (x - 2);
if ((x - 2) >= 0 && (y + 2) >= 0 && (x - 2) < this.pixelWidth && (y + 2) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y - 2) + (x - 2);
if ((x - 2) >= 0 && (y - 2) >= 0 && (x - 2) < this.pixelWidth && (y - 2) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y - 2) + (x + 2);
if ((x + 2) >= 0 && (y - 2) >= 0 && (x + 2) < this.pixelWidth && (y - 2) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}}if (width > 6) {
pixelIndex = this.pixelWidth * (y + 3) + (x + 3);
if ((x + 3) >= 0 && (y + 3) >= 0 && (x + 3) < this.pixelWidth && (y + 3) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y + 3) + (x - 3);
if ((x - 3) >= 0 && (y + 3) >= 0 && (x - 3) < this.pixelWidth && (y + 3) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y - 3) + (x - 3);
if ((x - 3) >= 0 && (y - 3) >= 0 && (x - 3) < this.pixelWidth && (y - 3) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y - 3) + (x + 3);
if ((x + 3) >= 0 && (y - 3) >= 0 && (x + 3) < this.pixelWidth && (y - 3) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}}}
} else {
while (x < xend) {
x++;
z += dz;
if (d < 0) {
d += incr1;
} else {
y--;
pixelIndex -= this.pixelWidth;
d += incr2;
}pixelIndex++;
pixelIndex = this.pixelWidth * (y) + (x);
if ((x) >= 0 && (y) >= 0 && (x) < this.pixelWidth && (y) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y) + (x + 1);
if ((x + 1) >= 0 && (y) >= 0 && (x + 1) < this.pixelWidth && (y) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y + 1) + (x);
if ((x) >= 0 && (y + 1) >= 0 && (x) < this.pixelWidth && (y + 1) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y) + (x - 1);
if ((x - 1) >= 0 && (y) >= 0 && (x - 1) < this.pixelWidth && (y) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y - 1) + (x);
if ((x) >= 0 && (y - 1) >= 0 && (x) < this.pixelWidth && (y - 1) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}if (width > 2) {
pixelIndex = this.pixelWidth * (y + 1) + (x + 1);
if ((x + 1) >= 0 && (y + 1) >= 0 && (x + 1) < this.pixelWidth && (y + 1) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y + 1) + (x - 1);
if ((x - 1) >= 0 && (y + 1) >= 0 && (x - 1) < this.pixelWidth && (y + 1) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y - 1) + (x - 1);
if ((x - 1) >= 0 && (y - 1) >= 0 && (x - 1) < this.pixelWidth && (y - 1) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y - 1) + (x + 1);
if ((x + 1) >= 0 && (y - 1) >= 0 && (x + 1) < this.pixelWidth && (y - 1) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}}if (width > 4) {
pixelIndex = this.pixelWidth * (y + 2) + (x + 2);
if ((x + 2) >= 0 && (y + 2) >= 0 && (x + 2) < this.pixelWidth && (y + 2) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y + 2) + (x - 2);
if ((x - 2) >= 0 && (y + 2) >= 0 && (x - 2) < this.pixelWidth && (y + 2) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y - 2) + (x - 2);
if ((x - 2) >= 0 && (y - 2) >= 0 && (x - 2) < this.pixelWidth && (y - 2) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y - 2) + (x + 2);
if ((x + 2) >= 0 && (y - 2) >= 0 && (x + 2) < this.pixelWidth && (y - 2) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}}if (width > 6) {
pixelIndex = this.pixelWidth * (y + 3) + (x + 3);
if ((x + 3) >= 0 && (y + 3) >= 0 && (x + 3) < this.pixelWidth && (y + 3) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y + 3) + (x - 3);
if ((x - 3) >= 0 && (y + 3) >= 0 && (x - 3) < this.pixelWidth && (y + 3) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y - 3) + (x - 3);
if ((x - 3) >= 0 && (y - 3) >= 0 && (x - 3) < this.pixelWidth && (y - 3) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y - 3) + (x + 3);
if ((x + 3) >= 0 && (y - 3) >= 0 && (x + 3) < this.pixelWidth && (y - 3) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}}}
}} else {
d = 2 * dx - dy;
incr1 = 2 * dx;
incr2 = 2 * (dx - dy);
if (y1 > y2) {
y = y2;
x = x2;
z = z2;
dz = Clazz.doubleToInt ((z1 - z2) / dy);
yend = y1;
xdirflag = (-1);
} else {
y = y1;
x = x1;
z = z1;
dz = Clazz.doubleToInt ((z2 - z1) / dy);
yend = y2;
xdirflag = 1;
}pixelIndex = y * this.pixelWidth + x;
pixelIndex = this.pixelWidth * (y) + (x);
if ((x) >= 0 && (y) >= 0 && (x) < this.pixelWidth && (y) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y) + (x + 1);
if ((x + 1) >= 0 && (y) >= 0 && (x + 1) < this.pixelWidth && (y) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y + 1) + (x);
if ((x) >= 0 && (y + 1) >= 0 && (x) < this.pixelWidth && (y + 1) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y) + (x - 1);
if ((x - 1) >= 0 && (y) >= 0 && (x - 1) < this.pixelWidth && (y) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y - 1) + (x);
if ((x) >= 0 && (y - 1) >= 0 && (x) < this.pixelWidth && (y - 1) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}if (width > 2) {
pixelIndex = this.pixelWidth * (y + 1) + (x + 1);
if ((x + 1) >= 0 && (y + 1) >= 0 && (x + 1) < this.pixelWidth && (y + 1) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y + 1) + (x - 1);
if ((x - 1) >= 0 && (y + 1) >= 0 && (x - 1) < this.pixelWidth && (y + 1) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y - 1) + (x - 1);
if ((x - 1) >= 0 && (y - 1) >= 0 && (x - 1) < this.pixelWidth && (y - 1) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y - 1) + (x + 1);
if ((x + 1) >= 0 && (y - 1) >= 0 && (x + 1) < this.pixelWidth && (y - 1) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}}if (width > 4) {
pixelIndex = this.pixelWidth * (y + 2) + (x + 2);
if ((x + 2) >= 0 && (y + 2) >= 0 && (x + 2) < this.pixelWidth && (y + 2) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y + 2) + (x - 2);
if ((x - 2) >= 0 && (y + 2) >= 0 && (x - 2) < this.pixelWidth && (y + 2) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y - 2) + (x - 2);
if ((x - 2) >= 0 && (y - 2) >= 0 && (x - 2) < this.pixelWidth && (y - 2) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y - 2) + (x + 2);
if ((x + 2) >= 0 && (y - 2) >= 0 && (x + 2) < this.pixelWidth && (y - 2) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}}if (width > 6) {
pixelIndex = this.pixelWidth * (y + 3) + (x + 3);
if ((x + 3) >= 0 && (y + 3) >= 0 && (x + 3) < this.pixelWidth && (y + 3) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y + 3) + (x - 3);
if ((x - 3) >= 0 && (y + 3) >= 0 && (x - 3) < this.pixelWidth && (y + 3) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y - 3) + (x - 3);
if ((x - 3) >= 0 && (y - 3) >= 0 && (x - 3) < this.pixelWidth && (y - 3) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y - 3) + (x + 3);
if ((x + 3) >= 0 && (y - 3) >= 0 && (x + 3) < this.pixelWidth && (y - 3) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}}if (((x2 - x1) * xdirflag) > 0) {
while (y < yend) {
y++;
z += dz;
if (d < 0) {
d += incr1;
} else {
x++;
pixelIndex++;
d += incr2;
}pixelIndex += this.pixelWidth;
pixelIndex = this.pixelWidth * (y) + (x);
if ((x) >= 0 && (y) >= 0 && (x) < this.pixelWidth && (y) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y) + (x + 1);
if ((x + 1) >= 0 && (y) >= 0 && (x + 1) < this.pixelWidth && (y) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y + 1) + (x);
if ((x) >= 0 && (y + 1) >= 0 && (x) < this.pixelWidth && (y + 1) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y) + (x - 1);
if ((x - 1) >= 0 && (y) >= 0 && (x - 1) < this.pixelWidth && (y) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y - 1) + (x);
if ((x) >= 0 && (y - 1) >= 0 && (x) < this.pixelWidth && (y - 1) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}if (width > 2) {
pixelIndex = this.pixelWidth * (y + 1) + (x + 1);
if ((x + 1) >= 0 && (y + 1) >= 0 && (x + 1) < this.pixelWidth && (y + 1) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y + 1) + (x - 1);
if ((x - 1) >= 0 && (y + 1) >= 0 && (x - 1) < this.pixelWidth && (y + 1) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y - 1) + (x - 1);
if ((x - 1) >= 0 && (y - 1) >= 0 && (x - 1) < this.pixelWidth && (y - 1) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y - 1) + (x + 1);
if ((x + 1) >= 0 && (y - 1) >= 0 && (x + 1) < this.pixelWidth && (y - 1) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}}if (width > 4) {
pixelIndex = this.pixelWidth * (y + 2) + (x + 2);
if ((x + 2) >= 0 && (y + 2) >= 0 && (x + 2) < this.pixelWidth && (y + 2) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y + 2) + (x - 2);
if ((x - 2) >= 0 && (y + 2) >= 0 && (x - 2) < this.pixelWidth && (y + 2) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y - 2) + (x - 2);
if ((x - 2) >= 0 && (y - 2) >= 0 && (x - 2) < this.pixelWidth && (y - 2) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y - 2) + (x + 2);
if ((x + 2) >= 0 && (y - 2) >= 0 && (x + 2) < this.pixelWidth && (y - 2) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}}if (width > 6) {
pixelIndex = this.pixelWidth * (y + 3) + (x + 3);
if ((x + 3) >= 0 && (y + 3) >= 0 && (x + 3) < this.pixelWidth && (y + 3) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y + 3) + (x - 3);
if ((x - 3) >= 0 && (y + 3) >= 0 && (x - 3) < this.pixelWidth && (y + 3) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y - 3) + (x - 3);
if ((x - 3) >= 0 && (y - 3) >= 0 && (x - 3) < this.pixelWidth && (y - 3) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y - 3) + (x + 3);
if ((x + 3) >= 0 && (y - 3) >= 0 && (x + 3) < this.pixelWidth && (y - 3) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}}}
} else {
while (y < yend) {
y++;
z += dz;
if (d < 0) {
d += incr1;
} else {
x--;
pixelIndex--;
d += incr2;
}pixelIndex += this.pixelWidth;
pixelIndex = this.pixelWidth * (y) + (x);
if ((x) >= 0 && (y) >= 0 && (x) < this.pixelWidth && (y) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y) + (x + 1);
if ((x + 1) >= 0 && (y) >= 0 && (x + 1) < this.pixelWidth && (y) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y + 1) + (x);
if ((x) >= 0 && (y + 1) >= 0 && (x) < this.pixelWidth && (y + 1) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y) + (x - 1);
if ((x - 1) >= 0 && (y) >= 0 && (x - 1) < this.pixelWidth && (y) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y - 1) + (x);
if ((x) >= 0 && (y - 1) >= 0 && (x) < this.pixelWidth && (y - 1) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}if (width > 2) {
pixelIndex = this.pixelWidth * (y + 1) + (x + 1);
if ((x + 1) >= 0 && (y + 1) >= 0 && (x + 1) < this.pixelWidth && (y + 1) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y + 1) + (x - 1);
if ((x - 1) >= 0 && (y + 1) >= 0 && (x - 1) < this.pixelWidth && (y + 1) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y - 1) + (x - 1);
if ((x - 1) >= 0 && (y - 1) >= 0 && (x - 1) < this.pixelWidth && (y - 1) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y - 1) + (x + 1);
if ((x + 1) >= 0 && (y - 1) >= 0 && (x + 1) < this.pixelWidth && (y - 1) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}}if (width > 4) {
pixelIndex = this.pixelWidth * (y + 2) + (x + 2);
if ((x + 2) >= 0 && (y + 2) >= 0 && (x + 2) < this.pixelWidth && (y + 2) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y + 2) + (x - 2);
if ((x - 2) >= 0 && (y + 2) >= 0 && (x - 2) < this.pixelWidth && (y + 2) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y - 2) + (x - 2);
if ((x - 2) >= 0 && (y - 2) >= 0 && (x - 2) < this.pixelWidth && (y - 2) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y - 2) + (x + 2);
if ((x + 2) >= 0 && (y - 2) >= 0 && (x + 2) < this.pixelWidth && (y - 2) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}}if (width > 6) {
pixelIndex = this.pixelWidth * (y + 3) + (x + 3);
if ((x + 3) >= 0 && (y + 3) >= 0 && (x + 3) < this.pixelWidth && (y + 3) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y + 3) + (x - 3);
if ((x - 3) >= 0 && (y + 3) >= 0 && (x - 3) < this.pixelWidth && (y + 3) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y - 3) + (x - 3);
if ((x - 3) >= 0 && (y - 3) >= 0 && (x - 3) < this.pixelWidth && (y - 3) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}pixelIndex = this.pixelWidth * (y - 3) + (x + 3);
if ((x + 3) >= 0 && (y - 3) >= 0 && (x + 3) < this.pixelWidth && (y - 3) < this.pixelHeight && z > zb[pixelIndex] && z < this.frontClip && z > this.backClip) {
zb[pixelIndex] = z;
pb[pixelIndex] = rgb;
}}}
}}}, "~N,~N,~N,~N,~N,~N,~N,~N");
Clazz.defineStatics (c$,
"ShadowsOff", 0,
"ShadowsAccumulate", 1,
"ShadowsOn", 2,
"PreRenderPass", 1,
"RenderPass", 2,
"PostRenderPass", 4,
"FinalRenderPass", 8,
"tempBuffer", null,
"FixedBits", 12,
"FFixedBits", (4096),
"ZFixedBits", (1048576),
"MaxClipPlanes", 1023,
"DefaultLightingModel", 0,
"CartoonLightingModel", 1,
"minimumZoom", 0.001,
"csByte0", 110,
"csByte1", 82,
"csByte2", 154,
"csByte3", 240,
"ModeTransparent", 0x1,
"ModeTexture", 0x2,
"ModeTriangle", 0x4,
"ModeVertex", 0x8,
"ModeTextureTransparent", 3,
"ModeTriangleTransparent", 5,
"ModeVertexTransparent", 9,
"asc", null,
"Irregular", 0,
"FlatTop", 1,
"FlatBottom", 2,
"MaxCache", 32,
"JustifyLeft", 1,
"JustifyRight", 2,
"JustifyTop", 4,
"JustifyBottom", 8,
"JustifyVertical", 16,
"JustifyHorizontal", 32,
"JustifyDefault", 9,
"NoSizeBar", 0,
"SizeBar", 1,
"SizeBarOnly", 2,
"colorMapCacheSize", 256,
"sqrtTable", null,
"PiBy2", 1.5707963267948966,
"NormalBits", 8,
"NormalSamples", (128),
"MapEntries", 65536,
"NormalSamples2", 255,
"XMinClip", 1,
"XMaxClip", 2,
"YMinClip", 4,
"YMaxClip", 8,
"ZMinClip", 16,
"ZMaxClip", 32,
"UMinClip", 64,
"UMaxClip", 128,
"VMinClip", 256,
"VMaxClip", 512,
"NormalClip", 1024);
});
