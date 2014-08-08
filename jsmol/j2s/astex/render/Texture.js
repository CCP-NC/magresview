Clazz.declarePackage ("astex.render");
Clazz.load (null, "astex.render.Texture", ["astex.api.Interface", "astex.util.Color32"], function () {
c$ = Clazz.decorateAsClass (function () {
this.width = 0;
this.height = 0;
this.pixels = null;
Clazz.instantialize (this, arguments);
}, astex.render, "Texture");
Clazz.makeConstructor (c$, 
function (w, h) {
this.width = w;
this.height = h;
this.pixels =  Clazz.newIntArray (this.width * this.height, 0);
}, "~N,~N");
Clazz.makeConstructor (c$, 
function () {
this.construct (256, 256);
});
c$.lipophilicityTexture = Clazz.defineMethod (c$, "lipophilicityTexture", 
function () {
var t =  new astex.render.Texture (256, 256);
return t;
});
c$.simpleTexture = Clazz.defineMethod (c$, "simpleTexture", 
function () {
var t =  new astex.render.Texture (256, 256);
var entry = 0;
var colors = [astex.util.Color32.pack (255, 0, 0), astex.util.Color32.pack (255, 0, 0), astex.util.Color32.pack (255, 0, 0), astex.util.Color32.pack (255, 64, 64), astex.util.Color32.pack (255, 128, 128), astex.util.Color32.pack (255, 192, 192), astex.util.Color32.pack (255, 255, 255), astex.util.Color32.pack (255, 255, 255), astex.util.Color32.pack (255, 255, 255), astex.util.Color32.pack (255, 255, 255), astex.util.Color32.pack (192, 192, 255), astex.util.Color32.pack (128, 128, 255), astex.util.Color32.pack (64, 64, 255), astex.util.Color32.pack (0, 0, 255), astex.util.Color32.pack (0, 0, 255), astex.util.Color32.pack (0, 0, 255)];
for (var k = 0; k < 256; k++) {
for (var j = 0; j < 16; j++) {
for (var i = 0; i < 16; i++) {
t.pixels[entry++] = colors[j];
}
}
}
return t;
});
Clazz.defineMethod (c$, "fillValues", 
function (colors, tc) {
var rgb =  Clazz.newIntArray (colors.length, 0);
for (var i = 0; i < colors.length; i++) {
rgb[i] = astex.util.Color32.getColorFromName (colors[i]);
}
for (var i = 0; i < this.width; i++) {
var pixel = i;
var slot = Clazz.doubleToInt (colors.length * i / this.width);
var rgbp = rgb[slot];
for (var j = 0; j < this.height; j++) {
this.pixels[pixel] = rgbp;
pixel += this.width;
}
}
}, "~A,~N");
c$.loadTexture = Clazz.defineMethod (c$, "loadTexture", 
function (resource) {
try {
var tex =  new astex.render.Texture ();
tex.loadPixels (resource);
return tex;
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
} else {
throw e;
}
}
return null;
}, "~S");
Clazz.defineMethod (c$, "loadPixels", 
 function (resource) {
var io = astex.api.Interface.getInterface ("astex.io.ImageIO");
io.setTexture (this, resource);
}, "~S");
Clazz.defineMethod (c$, "set", 
function (width, height, pixels) {
System.out.println ("Texture.setSize: original width " + width + " height " + height);
var w = 256;
var h = 256;
var offset = w * h;
var offset2;
if (w * h != 0) {
var newpixels =  Clazz.newIntArray (w * h, 0);
for (var j = h - 1; j >= 0; j--) {
offset -= w;
offset2 = (Clazz.doubleToInt (j * height / h)) * width;
for (var i = w - 1; i >= 0; i--) newpixels[i + offset] = pixels[(Clazz.doubleToInt (i * width / w)) + offset2];

}
this.width = w;
this.height = h;
this.pixels = newpixels;
System.out.println ("Texture.setSize: new     width " + width + " height " + height);
}}, "~N,~N,~A");
});
