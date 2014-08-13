Clazz.declarePackage ("astex.io");
Clazz.load (["astex.api.AstexImageIO"], "astex.io.ImageIO", ["astex.io.FILE", "astex.util.Log", "java.io.BufferedOutputStream", "$.ByteArrayOutputStream", "$.DataOutputStream", "$.FileOutputStream", "java.lang.Thread", "java.net.URL", "java.util.zip.GZIPOutputStream"], function () {
c$ = Clazz.declareType (astex.io, "ImageIO", null, astex.api.AstexImageIO);
Clazz.makeConstructor (c$, 
function () {
});
Clazz.defineMethod (c$, "write", 
function (name, pixels, width, height, compress) {
return this.write (name, pixels, width, height, compress, "");
}, "~S,~A,~N,~N,~B");
Clazz.defineMethod (c$, "write", 
function (name, pixels, width, height, compress, szLbl) {
if (name.endsWith (".gz")) {
compress = true;
} else if (compress && name.endsWith (".gz") == false) {
name += ".gz";
}{
if (compress) {
compress = false;
name = name.substring(0, name.length() - 3);
}
}var posw = name.indexOf ("%w");
if (posw != -1) {
var newname = name.substring (0, posw);
newname += astex.io.FILE.sprintI ("%d", width);
newname += name.substring (posw + 2, name.length);
name = newname;
}var posh = name.indexOf ("%h");
if (posh != -1) {
var newname = name.substring (0, posh);
newname += astex.io.FILE.sprintI ("%d", height);
newname += name.substring (posh + 2, name.length);
name = newname;
}if (name.indexOf ('%') != -1) {
name = astex.io.FILE.sprintI (name, astex.io.ImageIO.imageNumber);
astex.io.ImageIO.imageNumber++;
}astex.util.Log.info ("writing image to " + name);
var status = false;
if (name.endsWith (".gif")) {
System.out.println ("GIF file I/O not supported");
} else {
var bos = null;
try {
bos =  new java.io.BufferedOutputStream ( new java.io.FileOutputStream (name), 1048576);
var os = bos;
if (compress) {
var gos =  new java.util.zip.GZIPOutputStream (os);
os = gos;
}status = this.writeBMP (os, pixels, width, height);
os.close ();
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
astex.util.Log.error ("exception " + e);
} else {
throw e;
}
}
}if (!szLbl.equals ("")) {
var fName = name + ".sb";
try {
var out =  new java.io.DataOutputStream ( new java.io.BufferedOutputStream ( new java.io.FileOutputStream (fName, true)));
if (out != null) {
out.writeBytes (szLbl);
out.close ();
}} catch (e$$) {
if (Clazz.exceptionOf (e$$, java.io.FileNotFoundException)) {
var e = e$$;
{
}
} else if (Clazz.exceptionOf (e$$, SecurityException)) {
var e = e$$;
{
}
} else if (Clazz.exceptionOf (e$$, java.io.IOException)) {
var e = e$$;
{
}
} else {
throw e$$;
}
}
}return status;
}, "~S,~A,~N,~N,~B,~S");
Clazz.overrideMethod (c$, "writeBMP", 
function (os, pixels, width, height) {
astex.io.ImageIO.writeBitmapFileHeader (os, width, height);
astex.io.ImageIO.writeBitmapInfoHeader (os);
astex.io.ImageIO.writeBitmap (os, pixels, width, height);
return true;
}, "java.io.OutputStream,~A,~N,~N");
c$.loadImage = Clazz.defineMethod (c$, "loadImage", 
function (resource) {
var file = astex.io.FILE.openBinary (resource);
if (file == null) {
return null;
}var input = file.getInputStream ();
if (input == null) {
return null;
}var b =  Clazz.newByteArray (100000, 0);
try {
input.read (b, 0, b.length);
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
System.out.println ("Image was bigger than byte array buffer " + e);
} else {
throw e;
}
}
return java.awt.Toolkit.getDefaultToolkit ().createImage (b);
}, "~S");
c$.writeBitmap = Clazz.defineMethod (c$, "writeBitmap", 
 function (os, pixels, parWidth, parHeight) {
try {
var rgb =  Clazz.newByteArray (3, 0);
var bytesPerRow = parWidth * 3;
if ((bytesPerRow % 4) != 0) {
bytesPerRow = (Clazz.doubleToInt ((bytesPerRow + 3) / 4)) * 4;
}var pad = bytesPerRow - parWidth * 3;
for (var y = parHeight - 1, processed = 0; processed < parHeight; y--, processed++) {
var pos = y * parWidth;
for (var x = 0; x < parWidth; x++) {
var value = pixels[pos];
rgb[0] = (value & 0xFF);
rgb[1] = ((value >> 8) & 0xFF);
rgb[2] = ((value >> 16) & 0xFF);
os.write (rgb, 0, 3);
pos++;
}
for (var i = 0; i < pad; i++) {
os.write (0x00);
}
}
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
astex.util.Log.error ("exception " + e);
} else {
throw e;
}
}
}, "java.io.OutputStream,~A,~N,~N");
c$.writeBitmapFileHeader = Clazz.defineMethod (c$, "writeBitmapFileHeader", 
 function (os, parWidth, parHeight) {
try {
var bytesPerRow = parWidth * 3;
if ((bytesPerRow % 4) != 0) {
bytesPerRow = (Clazz.doubleToInt ((bytesPerRow + 3) / 4)) * 4;
}astex.io.ImageIO.biSizeImage = bytesPerRow * parHeight;
astex.io.ImageIO.bfSize = astex.io.ImageIO.biSizeImage + 14 + 40;
astex.io.ImageIO.biWidth = parWidth;
astex.io.ImageIO.biHeight = parHeight;
os.write (astex.io.ImageIO.bfType, 0, astex.io.ImageIO.bfType.length);
astex.io.FILE.intToDWord (os, astex.io.ImageIO.bfSize);
astex.io.FILE.intToWord (os, astex.io.ImageIO.bfReserved1);
astex.io.FILE.intToWord (os, astex.io.ImageIO.bfReserved2);
astex.io.FILE.intToDWord (os, astex.io.ImageIO.bfOffBits);
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
astex.util.Log.error ("exception " + e);
} else {
throw e;
}
}
}, "java.io.OutputStream,~N,~N");
c$.writeBitmapInfoHeader = Clazz.defineMethod (c$, "writeBitmapInfoHeader", 
 function (os) {
astex.io.FILE.intToDWord (os, astex.io.ImageIO.biSize);
astex.io.FILE.intToDWord (os, astex.io.ImageIO.biWidth);
astex.io.FILE.intToDWord (os, astex.io.ImageIO.biHeight);
astex.io.FILE.intToWord (os, astex.io.ImageIO.biPlanes);
astex.io.FILE.intToWord (os, astex.io.ImageIO.biBitCount);
astex.io.FILE.intToDWord (os, astex.io.ImageIO.biCompression);
astex.io.FILE.intToDWord (os, astex.io.ImageIO.biSizeImage);
astex.io.FILE.intToDWord (os, astex.io.ImageIO.biXPelsPerMeter);
astex.io.FILE.intToDWord (os, astex.io.ImageIO.biYPelsPerMeter);
astex.io.FILE.intToDWord (os, astex.io.ImageIO.biClrUsed);
astex.io.FILE.intToDWord (os, astex.io.ImageIO.biClrImportant);
}, "java.io.OutputStream");
Clazz.overrideMethod (c$, "setTexture", 
function (texture, resource) {
var tex = texture;
var img = java.awt.Toolkit.getDefaultToolkit ().getImage ( new java.net.URL (Clazz.castNullAs ("java.net.URL"), resource, null));
try {
var width;
var height;
while (((width = img.getWidth (null)) < 0) || ((height = img.getHeight (null)) < 0)) {
try {
Thread.sleep (10);
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
} else {
throw e;
}
}
}
System.out.println ("image loaded width " + width + " height " + height);
var pixels =  Clazz.newIntArray (width * height, 0);
var pg =  new java.awt.image.PixelGrabber (img, 0, 0, width, height, pixels, 0, width);
pg.grabPixels ();
tex.set (width, height, pixels);
} catch (e) {
if (Clazz.exceptionOf (e, InterruptedException)) {
{
alert(e + Clazz.getStackTrace());
}} else {
throw e;
}
}
}, "~O,~S");
c$.base64Encode = Clazz.defineMethod (c$, "base64Encode", 
function ($in, urlSafeEncoding) {
var str =  new java.io.ByteArrayOutputStream ();
var size = $in.length;
var byteleft = size % 3;
var x = 0;
var modulus = 0;
var b;
var encodeTable;
try {
if (urlSafeEncoding == 0) {
encodeTable = astex.io.ImageIO.ENCODETABLE;
} else {
encodeTable = astex.io.ImageIO.ENCODETABLESAFE;
}for (var i = 0; i < size - byteleft; i++) {
modulus = (++modulus) % 3;
b = $in[i];
if (b < 0) {
b += 256;
}x = (x << 8) + b;
if (0 == modulus) {
str.write (encodeTable[(x >> 18) & 63]);
str.write (encodeTable[(x >> 12) & 63]);
str.write (encodeTable[(x >> 6) & 63]);
str.write (encodeTable[x & 63]);
x = 0;
}}
switch (byteleft) {
case 0:
break;
case 1:
b = $in[size - 1];
if (b < 0) {
b += 256;
}x = (x << 8) + b;
str.write (encodeTable[(x >> 2) & 63]);
str.write (encodeTable[(x << 4) & 63]);
str.write (61);
str.write (61);
break;
case 2:
b = $in[size - 2];
if (b < 0) {
b += 256;
}x = (x << 8) + b;
b = $in[size - 1];
if (b < 0) {
b += 256;
}x = (x << 8) + b;
str.write (encodeTable[(x >> 10) & 63]);
str.write (encodeTable[(x >> 4) & 63]);
str.write (encodeTable[(x << 2) & 63]);
str.write (61);
break;
}
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
} else {
throw e;
}
}
return str.toString ();
}, "~A,~N");
Clazz.defineStatics (c$,
"imageNumber", 0,
"BITMAPFILEHEADER_SIZE", 14,
"BITMAPINFOHEADER_SIZE", 40,
"bfType", [('B').charCodeAt (0), ('M').charCodeAt (0)],
"bfSize", 0,
"bfReserved1", 0,
"bfReserved2", 0,
"bfOffBits", 54,
"biSize", 40,
"biWidth", 0,
"biHeight", 0,
"biPlanes", 1,
"biBitCount", 24,
"biCompression", 0,
"biSizeImage", 0x030000,
"biXPelsPerMeter", 2834,
"biYPelsPerMeter", 2834,
"biClrUsed", 0,
"biClrImportant", 0,
"PAD", '=',
"MASK_6BITS", 0x3f,
"ENCODETABLESAFE", ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '_'],
"ENCODETABLE", ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '/']);
});
