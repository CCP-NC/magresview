Clazz.declarePackage ("astex.util");
Clazz.load (null, "astex.util.Color32", ["astex.io.FILE", "astex.util.Log", "java.awt.Color", "java.util.Hashtable"], function () {
c$ = Clazz.declareType (astex.util, "Color32");
c$.getComponent = Clazz.defineMethod (c$, "getComponent", 
function (c, comp) {
if (comp == 0) return astex.util.Color32.getRed (c);
if (comp == 1) return astex.util.Color32.getGreen (c);
if (comp == 2) return astex.util.Color32.getBlue (c);
return 0;
}, "~N,~N");
c$.getRed = Clazz.defineMethod (c$, "getRed", 
function (c) {
return (c & 16711680) >> 16;
}, "~N");
c$.getGreen = Clazz.defineMethod (c$, "getGreen", 
function (c) {
return (c & 65280) >> 8;
}, "~N");
c$.getBlue = Clazz.defineMethod (c$, "getBlue", 
function (c) {
return c & 255;
}, "~N");
c$.getIntensity = Clazz.defineMethod (c$, "getIntensity", 
function (c) {
var r = astex.util.Color32.getRed (c);
var g = astex.util.Color32.getGreen (c);
var b = astex.util.Color32.getBlue (c);
var intensity = Clazz.doubleToInt ((r + g + b) / 3.0);
return intensity;
}, "~N");
c$.getMaximumIntensity = Clazz.defineMethod (c$, "getMaximumIntensity", 
function (c) {
var r = astex.util.Color32.getRed (c);
var g = astex.util.Color32.getGreen (c);
var b = astex.util.Color32.getBlue (c);
var max = r;
if (g > max) {
max = g;
}if (b > max) {
max = b;
}return max;
}, "~N");
c$.getGrayScale = Clazz.defineMethod (c$, "getGrayScale", 
function (c) {
var r = astex.util.Color32.getRed (c);
var g = astex.util.Color32.getGreen (c);
var b = astex.util.Color32.getBlue (c);
var luma = Clazz.doubleToInt (r * 0.3 + g * 0.59 + b * 0.11);
if (luma > 255) luma = 255;
return astex.util.Color32.pack (luma, luma, luma);
}, "~N");
c$.getClampColor = Clazz.defineMethod (c$, "getClampColor", 
function (r, g, b) {
return -16777216 | (astex.util.Color32.clamp (r) << 16) | (astex.util.Color32.clamp (g) << 8) | astex.util.Color32.clamp (b);
}, "~N,~N,~N");
c$.clamp = Clazz.defineMethod (c$, "clamp", 
function (num) {
if (num < 0) return 0;
 else if (num > 255) return 255;
 else return num;
}, "~N");
c$.scale = Clazz.defineMethod (c$, "scale", 
function (c, factor) {
if (factor == 255) return c;
if (factor == 0) return 0;
var r = (c >> 16) & 0xff;
var g = (c >> 8) & 0xff;
var b = c & 0xff;
r = (r * factor) >> 8;
g = (g * factor) >> 8;
b = (b * factor) >> 8;
return (r << 16) | (g << 8) | b;
}, "~N,~N");
c$.add = Clazz.defineMethod (c$, "add", 
function (color1, color2) {
var r = (color1 & 16711680) + (color2 & 16711680);
var g = (color1 & 65280) + (color2 & 65280);
var b = (color1 & 255) + (color2 & 255);
if (r > 16711680) r = 16711680;
if (g > 65280) g = 65280;
if (b > 255) b = 255;
return (r | g | b);
}, "~N,~N");
c$.multiply = Clazz.defineMethod (c$, "multiply", 
function (c1, c2) {
var c1r = (c1 >> 16) & 0xff;
var c1g = (c1 >> 8) & 0xff;
var c1b = (c1 >> 0) & 0xff;
var c2r = (c2 >> 16) & 0xff;
var c2g = (c2 >> 8) & 0xff;
var c2b = (c2 >> 0) & 0xff;
c2r = (c1r * c2r) >> 8;
c2g = (c1g * c2g) >> 8;
c2b = (c1b * c2b) >> 8;
return (c2r << 16) | (c2g << 8) | (c2b);
}, "~N,~N");
c$.intensitySpecularise = Clazz.defineMethod (c$, "intensitySpecularise", 
function (c1, intensity, specular) {
c1 = astex.util.Color32.scale (c1, intensity);
return astex.util.Color32.add (c1, specular);
}, "~N,~N,~N");
c$.blendI = Clazz.defineMethod (c$, "blendI", 
function (c1, c2, alpha) {
if (alpha == 0) return c2;
if (alpha == 255) return c1;
var c1r = (c1 >> 16) & 0xff;
var c1g = (c1 >> 8) & 0xff;
var c1b = (c1 >> 0) & 0xff;
var c2r = (c2 >> 16) & 0xff;
var c2g = (c2 >> 8) & 0xff;
var c2b = (c2 >> 0) & 0xff;
var r = (alpha * (c1r) + (255 - alpha) * (c2r)) >> 8;
var g = (alpha * (c1g) + (255 - alpha) * (c2g)) >> 8;
var b = (alpha * (c1b) + (255 - alpha) * (c2b)) >> 8;
return -16777216 | (r << 16) | (g << 8) | b;
}, "~N,~N,~N");
c$.blendF = Clazz.defineMethod (c$, "blendF", 
function (c1, c2, frac) {
return astex.util.Color32.blendI (c1, c2, Clazz.doubleToInt (255 * frac));
}, "~N,~N,~N");
c$.hsv2rgb = Clazz.defineMethod (c$, "hsv2rgb", 
function (hsv, rgb) {
var HueQuadrant;
var HueLocal;
var Diff;
var m;
var n;
var k;
HueLocal = hsv[0];
while (HueLocal >= 360.0) HueLocal = HueLocal - 360.0;

HueLocal = HueLocal / 60.0;
HueQuadrant = Clazz.doubleToInt (HueLocal);
Diff = HueLocal - HueQuadrant;
m = hsv[2] * (1.0 - hsv[1]);
n = hsv[2] * (1.0 - hsv[1] * Diff);
k = hsv[2] * (1.0 - hsv[1] * (1.0 - Diff));
switch (HueQuadrant) {
case 0:
rgb[0] = hsv[2];
rgb[1] = k;
rgb[2] = m;
break;
case 1:
rgb[0] = n;
rgb[1] = hsv[2];
rgb[2] = m;
break;
case 2:
rgb[0] = m;
rgb[1] = hsv[2];
rgb[2] = k;
break;
case 3:
rgb[0] = m;
rgb[1] = n;
rgb[2] = hsv[2];
break;
case 4:
rgb[0] = k;
rgb[1] = m;
rgb[2] = hsv[2];
break;
case 5:
rgb[0] = hsv[2];
rgb[1] = m;
rgb[2] = n;
break;
}
for (var i = 0; i < 3; i++) {
if (rgb[i] < 0.0) rgb[i] = 0.0;
 else if (rgb[i] > 1.0) rgb[i] = 1.0;
}
}, "~A,~A");
c$.pack = Clazz.defineMethod (c$, "pack", 
function (r, g, b) {
return -16777216 | r << 16 | g << 8 | b;
}, "~N,~N,~N");
c$.rgb2hsv = Clazz.defineMethod (c$, "rgb2hsv", 
function (rgb, hsv) {
var x;
var Rtemp;
var Gtemp;
var Btemp;
hsv[2] = Math.max (rgb[0], Math.max (rgb[1], rgb[2]));
x = Math.min (rgb[0], Math.min (rgb[1], rgb[2]));
hsv[1] = (hsv[2] - x) / hsv[2];
Rtemp = (hsv[2] - rgb[0]) * 60 / (hsv[2] - x);
Gtemp = (hsv[2] - rgb[1]) * 60 / (hsv[2] - x);
Btemp = (hsv[2] - rgb[2]) * 60 / (hsv[2] - x);
if (rgb[0] == hsv[2]) {
if (rgb[1] == x) hsv[0] = 300 + Btemp;
 else hsv[0] = 60 - Gtemp;
} else if (rgb[1] == hsv[2]) {
if (rgb[2] == x) hsv[0] = 60 + Rtemp;
 else hsv[0] = 180 - Btemp;
} else {
if (rgb[0] == x) hsv[0] = 180 + Gtemp;
 else hsv[0] = 300 - Rtemp;
}}, "~A,~A");
c$.hsv2packed = Clazz.defineMethod (c$, "hsv2packed", 
function (hsv) {
var r;
var g;
var b;
astex.util.Color32.hsv2rgb (hsv, astex.util.Color32.rgbtmp);
r = Clazz.doubleToInt (astex.util.Color32.rgbtmp[0] * 255.0);
g = Clazz.doubleToInt (astex.util.Color32.rgbtmp[1] * 255.0);
b = Clazz.doubleToInt (astex.util.Color32.rgbtmp[2] * 255.0);
var c = astex.util.Color32.pack (r, g, b);
return c;
}, "~A");
c$.packed2hsv = Clazz.defineMethod (c$, "packed2hsv", 
function (rgb, hsv) {
var r = astex.util.Color32.getRed (rgb);
var g = astex.util.Color32.getGreen (rgb);
var b = astex.util.Color32.getBlue (rgb);
astex.util.Color32.rgbtmp[0] = r / 255.0;
astex.util.Color32.rgbtmp[1] = g / 255.0;
astex.util.Color32.rgbtmp[2] = b / 255.0;
astex.util.Color32.rgb2hsv (astex.util.Color32.rgbtmp, hsv);
}, "~N,~A");
c$.print = Clazz.defineMethod (c$, "print", 
function (s, c) {
astex.util.Color32.print (s, astex.util.Color32.getRed (c), astex.util.Color32.getGreen (c), astex.util.Color32.getBlue (c));
}, "~S,~N");
c$.print = Clazz.defineMethod (c$, "print", 
function (s, r, g, b) {
astex.io.FILE.out.printS (s);
astex.io.FILE.out.printFI (" [%03d", r);
astex.io.FILE.out.printFI (",%03d", g);
astex.io.FILE.out.printFI (",%03d]\n", b);
}, "~S,~N,~N,~N");
c$.format = Clazz.defineMethod (c$, "format", 
function (c) {
return "'0x" + astex.io.FILE.sprintI ("%02x", astex.util.Color32.getRed (c)) + astex.io.FILE.sprintI ("%02x", astex.util.Color32.getGreen (c)) + astex.io.FILE.sprintI ("%02x'", astex.util.Color32.getBlue (c));
}, "~N");
c$.formatNoQuotes = Clazz.defineMethod (c$, "formatNoQuotes", 
function (c) {
return "0x" + astex.io.FILE.sprintI ("%02x", astex.util.Color32.getRed (c)) + astex.io.FILE.sprintI ("%02x", astex.util.Color32.getGreen (c)) + astex.io.FILE.sprintI ("%02x", astex.util.Color32.getBlue (c));
}, "~N");
c$.getColorFromName = Clazz.defineMethod (c$, "getColorFromName", 
function (colorName) {
var len = colorName.length;
var color = astex.util.Color32.undefinedColor;
if (colorName.indexOf (",") != -1) {
var components = astex.io.FILE.split (colorName, ",");
if (components.length == 3) {
var r = astex.io.FILE.readInteger (components[0]);
var g = astex.io.FILE.readInteger (components[1]);
var b = astex.io.FILE.readInteger (components[2]);
color = astex.util.Color32.getClampColor (r, g, b);
} else {
astex.util.Log.error ("color should be \"r,g,b\" not: " + colorName);
}return color;
}var allHex = true;
for (var i = 0; i < len; i++) {
var c = colorName.charAt (i);
if (astex.util.Color32.hexDigits.indexOf (c) == -1) {
allHex = false;
break;
}}
if (allHex) {
var start = -1;
var group_mult = 256;
var char_mult = 16;
if (len == 8 && colorName.charAt (0) == '0' && colorName.charAt (1) == 'x') {
start = 2;
group_mult = 16;
char_mult = 1;
} else if (len == 6) {
start = 0;
group_mult = 16;
char_mult = 1;
} else if (len == 7) {
start = 1;
} else if (len == 4) {
start = 1;
group_mult = 16;
char_mult = 1;
} else if (len == 3) {
start = 0;
}if (start == -1) {
System.out.println ("illegal color format: " + colorName);
return astex.util.Color32.undefinedColor;
}var total = 0;
for (var i = start; i < len; i++) {
var c = colorName.charCodeAt (i);
if (c >= 48 && c <= 57) {
total = group_mult * total + (c - 48) * char_mult;
} else if (c >= 97 && c <= 102) {
total = group_mult * total + (c - 97 + 10) * char_mult;
} else if (c >= 65 && c <= 70) {
total = group_mult * total + (c - 65 + 10) * char_mult;
} else {
System.out.println ("getColorFromName: illegal char: " + String.fromCharCode (c));
}}
color = total;
} else {
astex.util.Color32.ensureColorHashDefined ();
colorName = colorName.toLowerCase ();
var colorValue = astex.util.Color32.colorHash.get (colorName);
if (colorValue != null) {
color = colorValue.intValue ();
} else {
System.out.println ("couldn't find color " + colorName);
color = astex.util.Color32.undefinedColor;
}}return color;
}, "~S");
c$.getAWTColor = Clazz.defineMethod (c$, "getAWTColor", 
function (color) {
var awtColor =  new java.awt.Color (astex.util.Color32.getRed (color), astex.util.Color32.getGreen (color), astex.util.Color32.getBlue (color));
return awtColor;
}, "~N");
c$.ensureColorHashDefined = Clazz.defineMethod (c$, "ensureColorHashDefined", 
 function () {
if (astex.util.Color32.colorHash == null) {
astex.util.Color32.colorHash =  new java.util.Hashtable ();
var f = astex.io.FILE.open ("color.properties");
while (f.nextLine ()) {
if (f.getChar (0) != '#') {
var fc = f.getFieldCount ();
if (fc != 4) {
System.out.println ("color.properties: invalid color definition");
System.out.println (f.getCurrentLineAsString ());
} else {
var name = f.getField (0);
name = name.toLowerCase ();
var colorValue =  new Integer (astex.util.Color32.pack (f.readFieldInt (1), f.readFieldInt (2), f.readFieldInt (3)));
astex.util.Color32.colorHash.put (name, colorValue);
}} else {
System.out.println (f.getCurrentLineAsString ());
}}
System.out.println (astex.util.Color32.colorHash.keySet ().size () + " colors read");
f.close ();
}return;
});
Clazz.defineStatics (c$,
"Alpha", 0xFF000000,
"Red", 0xFF0000,
"Green", 0xFF00,
"Blue", 0xFF,
"rgbtmp",  Clazz.newDoubleArray (3, 0));
c$.snow = c$.prototype.snow = astex.util.Color32.pack (255, 250, 250);
c$.gainsboro = c$.prototype.gainsboro = astex.util.Color32.pack (220, 220, 220);
c$.linen = c$.prototype.linen = astex.util.Color32.pack (250, 240, 230);
c$.bisque = c$.prototype.bisque = astex.util.Color32.pack (255, 228, 196);
c$.moccasin = c$.prototype.moccasin = astex.util.Color32.pack (255, 228, 181);
c$.cornsilk = c$.prototype.cornsilk = astex.util.Color32.pack (255, 248, 220);
c$.ivory = c$.prototype.ivory = astex.util.Color32.pack (255, 255, 240);
c$.seashell = c$.prototype.seashell = astex.util.Color32.pack (255, 245, 238);
c$.honeydew = c$.prototype.honeydew = astex.util.Color32.pack (240, 255, 240);
c$.azure = c$.prototype.azure = astex.util.Color32.pack (240, 255, 255);
c$.lavender = c$.prototype.lavender = astex.util.Color32.pack (230, 230, 250);
c$.white = c$.prototype.white = astex.util.Color32.pack (255, 255, 255);
c$.black = c$.prototype.black = astex.util.Color32.pack (0, 0, 0);
c$.navy = c$.prototype.navy = astex.util.Color32.pack (0, 0, 128);
c$.blue = c$.prototype.blue = astex.util.Color32.pack (0, 0, 255);
c$.turquoise = c$.prototype.turquoise = astex.util.Color32.pack (64, 224, 208);
c$.cyan = c$.prototype.cyan = astex.util.Color32.pack (0, 255, 255);
c$.aquamarine = c$.prototype.aquamarine = astex.util.Color32.pack (127, 255, 212);
c$.green = c$.prototype.green = astex.util.Color32.pack (0, 255, 0);
c$.chartreuse = c$.prototype.chartreuse = astex.util.Color32.pack (127, 255, 0);
c$.khaki = c$.prototype.khaki = astex.util.Color32.pack (240, 230, 140);
c$.yellow = c$.prototype.yellow = astex.util.Color32.pack (255, 255, 0);
c$.gold = c$.prototype.gold = astex.util.Color32.pack (255, 215, 0);
c$.goldenrod = c$.prototype.goldenrod = astex.util.Color32.pack (218, 165, 32);
c$.sienna = c$.prototype.sienna = astex.util.Color32.pack (160, 82, 45);
c$.peru = c$.prototype.peru = astex.util.Color32.pack (205, 133, 63);
c$.burlywood = c$.prototype.burlywood = astex.util.Color32.pack (222, 184, 135);
c$.beige = c$.prototype.beige = astex.util.Color32.pack (245, 245, 220);
c$.wheat = c$.prototype.wheat = astex.util.Color32.pack (245, 222, 179);
c$.tan = c$.prototype.tan = astex.util.Color32.pack (210, 180, 140);
c$.chocolate = c$.prototype.chocolate = astex.util.Color32.pack (210, 105, 30);
c$.firebrick = c$.prototype.firebrick = astex.util.Color32.pack (178, 34, 34);
c$.brown = c$.prototype.brown = astex.util.Color32.pack (165, 42, 42);
c$.salmon = c$.prototype.salmon = astex.util.Color32.pack (250, 128, 114);
c$.orange = c$.prototype.orange = astex.util.Color32.pack (255, 165, 0);
c$.coral = c$.prototype.coral = astex.util.Color32.pack (255, 127, 80);
c$.tomato = c$.prototype.tomato = astex.util.Color32.pack (255, 99, 71);
c$.red = c$.prototype.red = astex.util.Color32.pack (255, 0, 0);
c$.pink = c$.prototype.pink = astex.util.Color32.pack (255, 192, 203);
c$.maroon = c$.prototype.maroon = astex.util.Color32.pack (176, 48, 96);
c$.magenta = c$.prototype.magenta = astex.util.Color32.pack (255, 0, 255);
c$.violet = c$.prototype.violet = astex.util.Color32.pack (238, 130, 238);
c$.plum = c$.prototype.plum = astex.util.Color32.pack (221, 160, 221);
c$.orchid = c$.prototype.orchid = astex.util.Color32.pack (218, 112, 214);
c$.purple = c$.prototype.purple = astex.util.Color32.pack (160, 32, 240);
c$.thistle = c$.prototype.thistle = astex.util.Color32.pack (216, 191, 216);
c$.grey = c$.prototype.grey = astex.util.Color32.pack (190, 190, 190);
c$.gray = c$.prototype.gray = astex.util.Color32.grey;
c$.rwb0 = c$.prototype.rwb0 = astex.util.Color32.pack (255, 0, 0);
c$.rwb1 = c$.prototype.rwb1 = astex.util.Color32.pack (255, 115, 115);
c$.rwb2 = c$.prototype.rwb2 = astex.util.Color32.pack (255, 170, 170);
c$.rwb3 = c$.prototype.rwb3 = astex.util.Color32.pack (255, 215, 215);
c$.rwb4 = c$.prototype.rwb4 = astex.util.Color32.pack (215, 215, 255);
c$.rwb5 = c$.prototype.rwb5 = astex.util.Color32.pack (170, 170, 255);
c$.rwb6 = c$.prototype.rwb6 = astex.util.Color32.pack (115, 115, 255);
c$.rwb7 = c$.prototype.rwb7 = astex.util.Color32.pack (0, 0, 255);
c$.rdcx = c$.prototype.rdcx = astex.util.Color32.pack (69, 114, 167);
c$.rdcy = c$.prototype.rdcy = astex.util.Color32.pack (170, 70, 67);
c$.rdcz = c$.prototype.rdcz = astex.util.Color32.pack (137, 165, 78);
c$.undefinedColor = c$.prototype.undefinedColor = astex.util.Color32.white;
Clazz.defineStatics (c$,
"colorHash", null,
"hexDigits", "0123456789abcdefABCDEFx");
});
