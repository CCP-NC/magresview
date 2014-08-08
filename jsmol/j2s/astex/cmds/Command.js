Clazz.declarePackage ("astex.cmds");
Clazz.load (["astex.api.AstexCommand"], "astex.cmds.Command", ["astex.api.Interface", "astex.io.FILE", "astex.model.Distance", "astex.util.Color32", "$.Log", "java.io.IOException"], function () {
c$ = Clazz.declareType (astex.cmds, "Command", null, astex.api.AstexCommand);
Clazz.overrideMethod (c$, "executePDBe", 
function (mr, args, selectedAtoms) {
if (args.get ("-printcount") != null) {
mr.pdbeOptionPrintCount = args.getBoolean ("-printcount", true);
}if (args.get ("-keepmodel1") != null) {
mr.setKeepModel1 (args.getBoolean ("-keepmodel1", false));
}if (args.getString ("-add", "").equals ("distance")) {
if (selectedAtoms.size () != 2) {
System.out.println ("Not exactly 2 atoms selected");
return;
}var color = args.getString ("-color", "green");
var distance =  new astex.model.Distance ();
distance.group0.add (selectedAtoms.get (0));
distance.group1.add (selectedAtoms.get (1));
distance.setString ("name", "distance");
var icolor = astex.util.Color32.getColorFromName (color);
distance.setValue ("color", astex.util.Color32.getAWTColor (icolor));
distance.setDouble ("radius", 0.075);
distance.setDouble ("on", 1.0);
distance.setDouble ("off", 0.0);
mr.addDistance (distance);
}}, "astex.render.MoleculeRenderer,astex.util.Arguments,astex.util.DynamicArray");
Clazz.overrideMethod (c$, "executeView", 
function (mr, args) {
var zrot = args.getDouble ("-rotatez", -Infinity);
var yrot = args.getDouble ("-rotatey", -Infinity);
var xrot = args.getDouble ("-rotatex", -Infinity);
var antialiasString = args.get ("-antialias");
var realSpheres = args.get ("-realspheres");
var renderDebugString = args.get ("-renderdebug");
var image = args.getString ("-writeimage", null);
if (args.get ("-defaultwidth") != null) {
astex.cmds.Command.defaultWidth = args.getInteger ("-defaultwidth", 400);
}if (args.get ("-defaultheight") != null) {
astex.cmds.Command.defaultHeight = args.getInteger ("-defaultheight", 300);
}if (args.get ("-defaultsample") != null) {
astex.cmds.Command.defaultSample = args.getInteger ("-defaultsample", 1);
}astex.cmds.Command.stepMultiple = args.getInteger ("-stepmultiple", 1);
if (args.get ("-defaultimage") != null) {
astex.cmds.Command.defaultImage = args.get ("-defaultimage");
}if (args.get ("-defaultcompress") != null) {
astex.cmds.Command.defaultCompress = args.getBoolean ("-defaultcompress", false);
}if (args.get ("-ambient") != null) {
var amb = args.getInteger ("-ambient", 64);
mr.renderer.setAmbient (astex.util.Color32.pack (amb, amb, amb));
}if (args.get ("-normalcutoff") != null) {
var c = args.getDouble ("-normalcutoff", 0.07);
mr.renderer.setCartoonNormalCutoff (c);
}if (args.get ("-lightingmodel") != null) {
var model = args.getString ("-lightingmodel", "normal");
if (model.equals ("normal")) {
mr.renderer.setLightingModel (0);
} else if (model.equals ("cartoon")) {
mr.renderer.setLightingModel (1);
} else {
astex.util.Log.error ("unknown lighting model: " + model);
}}if (args.get ("-gradient") != null) {
mr.renderer.setGradient (args.getBoolean ("-gradient", false));
}if (args.get ("-gradienttop") != null) {
mr.renderer.setGradientTop (args.getColor ("-gradienttop", astex.util.Color32.black));
}if (args.get ("-gradientbottom") != null) {
mr.renderer.setGradientBottom (args.getColor ("-gradientbottom", astex.util.Color32.black));
}if (args.get ("-wuantialias") != null) {
mr.renderer.wuAntiAlias = args.getBoolean ("-wuantialias", false);
System.out.println ("wu " + mr.renderer.wuAntiAlias);
}if (args.get ("-drawlogo") != null) {
mr.renderer.setDrawLogo (args.getBoolean ("-drawlogo", true));
}if (args.get ("-drawlogopdbe") != null) {
mr.renderer.setDrawLogoPdbe (args.getBoolean ("-drawlogopdbe", true));
}if (args.get ("-drawsizebar") != null) {
mr.renderer.setDrawSizeBar (args.getBoolean ("-drawsizebar", true));
}if (args.get ("-drawsizebaronly") != null) {
mr.renderer.setDrawSizeBarOnly (args.getBoolean ("-drawsizebaronly", true));
}if (image != null) {
var width = args.getInteger ("-width", -1);
var height = args.getInteger ("-height", -1);
var sample = args.getInteger ("-sample", -1);
var multiple = args.getInteger ("-multiple", -1);
var compress = args.getBoolean ("-compress", false);
var oldWidth = -1;
var oldHeight = -1;
if (image.equals ("default")) {
image = astex.cmds.Command.defaultImage;
}if (multiple > 0) {
width = mr.renderer.pixelWidth * multiple;
height = mr.renderer.pixelHeight * multiple;
}if (width == -1 && height == -1) {
width = astex.cmds.Command.defaultWidth;
height = astex.cmds.Command.defaultHeight;
}if (sample == -1) {
sample = astex.cmds.Command.defaultSample;
}var previousSample = mr.renderer.getSamples ();
width *= sample;
height *= sample;
if (width != -1 && height != -1) {
oldWidth = mr.renderer.pixelWidth;
oldHeight = mr.renderer.pixelHeight;
System.out.println ("Image size " + width + "x" + height);
var mb = (width * height * 3) / (1048576.0);
astex.io.FILE.out.printFD ("Approximate memory use %.1fMb\n", mb);
mr.viewer.taint ();
mr.renderer.setSamples (sample);
mr.renderer.setSize (width, height);
mr.paint ();
}if (compress == false && astex.cmds.Command.defaultCompress) {
compress = true;
}var writer = astex.api.Interface.getInterface ("astex.io.ImageIO");
if (writer == null) {
 new java.io.IOException ("Could not instantialize astex.io.ImageIO");
}if (sample != 1) {
astex.cmds.Command.doAntialias (mr.renderer.pbuffer, mr.renderer.pixelWidth, mr.renderer.pixelHeight, sample);
writer.write (image, astex.cmds.Command.tempBuffer, Clazz.doubleToInt (mr.renderer.pixelWidth / sample), Clazz.doubleToInt (mr.renderer.pixelHeight / sample), compress, mr.renderer.getSizeBarString ());
} else {
writer.write (image, mr.renderer.pbuffer, mr.renderer.pixelWidth, mr.renderer.pixelHeight, compress, mr.renderer.getSizeBarString ());
}System.out.println ("done.");
if (oldHeight > 0 || oldWidth > 0) {
mr.renderer.setSize (oldWidth, oldHeight);
mr.viewer.taint ();
mr.paint ();
}mr.renderer.setSamples (previousSample);
}if (yrot != -Infinity) {
mr.renderer.rotateX (yrot);
}if (zrot != -Infinity) {
mr.renderer.rotateY (zrot);
}if (xrot != -Infinity) {
mr.renderer.rotateZ (xrot);
}if (args.defined ("-wrapangle")) {
mr.renderer.setWrapAngle (3.141592653589793 * args.getDouble ("-wrapangle", 90.0) / 180.0);
}if (args.defined ("-aagamma")) {
mr.renderer.setDrawGamma (args.getDouble ("-aagamma", 2.35));
}if (args.defined ("-powfactor")) {
mr.renderer.setPowFactor (args.getDouble ("-powfactor", 1.0));
}if (antialiasString != null) {
var antialias = args.getBoolean ("-antialias", false);
mr.renderer.setAntiAlias (antialias);
}if (realSpheres != null) {
var spheres = args.getBoolean ("-realspheres", false);
mr.renderer.analyticalSpheres = spheres;
}if (renderDebugString != null) {
var renderDebug = args.getBoolean ("-renderdebug", false);
mr.renderer.debug = renderDebug;
}if (args.get ("-solidfonts") != null) {
mr.hersheyFonts = args.getBoolean ("-solidfonts", false);
}if (args.get ("-shadows") != null) {
mr.shadows = args.getBoolean ("-shadows", false);
}if (args.get ("-background") != null) {
var colorName = args.getString ("-background", "white");
var color = astex.util.Color32.getColorFromName (colorName);
mr.renderer.setBackgroundColor (color);
}if (args.get ("-fog") != null) {
var f = args.getBoolean ("-fog", false);
mr.renderer.depthcue = f;
}mr.viewer.dirtyRepaint ();
mr.renderer.setDrawSizeBar (false);
}, "astex.render.MoleculeRenderer,astex.util.Arguments");
c$.doAntialias = Clazz.defineMethod (c$, "doAntialias", 
function (pbuffer, w, h, sample) {
var wa = Clazz.doubleToInt (w / sample);
var ha = Clazz.doubleToInt (h / sample);
var pa = wa * ha;
if (astex.cmds.Command.tempBuffer == null || astex.cmds.Command.tempBuffer.length < pa) {
astex.cmds.Command.tempBuffer =  Clazz.newIntArray (pa, 0);
}var indexa = 0;
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
var rgb = pbuffer[index];
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
astex.cmds.Command.tempBuffer[indexa] = astex.util.Color32.pack (r, g, b);
indexa++;
}
}
}, "~A,~N,~N,~N");
Clazz.defineStatics (c$,
"defaultWidth", 400,
"defaultHeight", 300,
"defaultSample", 1,
"stepMultiple", 1,
"defaultImage", "movie/image_%04d.bmp",
"defaultCompress", false,
"tempBuffer", null);
});
