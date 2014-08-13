Clazz.declarePackage ("java.awt");
c$ = Clazz.decorateAsClass (function () {
this.argb = 0xFF000000;
Clazz.instantialize (this, arguments);
}, java.awt, "Color");
Clazz.makeConstructor (c$, 
function (rgb) {
rgb |= 0xFF000000;
}, "~N");
Clazz.makeConstructor (c$, 
function (r, g, b) {
this.argb = ((r << 16) | (g << 8) | b) & 0xFFFFFFFF;
}, "~N,~N,~N");
Clazz.makeConstructor (c$, 
function (r, g, b, a) {
this.argb = ((a << 24) | (r << 16) | (g << 8) | b) & 0xFFFFFFFF;
}, "~N,~N,~N,~N");
Clazz.defineMethod (c$, "getRed", 
function () {
return (this.argb >> 16) & 0xFF;
});
Clazz.defineMethod (c$, "getGreen", 
function () {
return (this.argb >> 8) & 0xFF;
});
Clazz.defineMethod (c$, "getBlue", 
function () {
return this.argb & 0xFF;
});
Clazz.defineMethod (c$, "getRGB", 
function () {
return this.argb & 0x00FFFFFF;
});
Clazz.defineMethod (c$, "darker", 
function () {
return  new java.awt.Color (Clazz.floatToInt (((this.argb >> 16) & 0xFF) * 0.7), Clazz.floatToInt ((this.argb >> 8 & 0xFF) * 0.7), Clazz.floatToInt ((this.argb & 0xFF) * 0.7));
});
Clazz.defineMethod (c$, "brighter", 
function () {
return  new java.awt.Color (this.br (this.getRed ()), this.br (this.getGreen ()), this.br (this.getBlue ()));
});
Clazz.defineMethod (c$, "br", 
 function (r) {
switch (r) {
case 0:
return 3;
case 1:
case 2:
return 4;
default:
return Clazz.floatToInt (Math.min (255, r / 0.7));
}
}, "~N");
Clazz.overrideMethod (c$, "toString", 
function () {
var s = ("00000000" + Integer.toHexString (this.argb));
return "[0x" + s.substring (s.length - 8, s.length) + "]";
});
c$.white = c$.prototype.white =  new java.awt.Color (0xffffff);
c$.lightGray = c$.prototype.lightGray =  new java.awt.Color (0xc0c0c0);
c$.gray = c$.prototype.gray =  new java.awt.Color (0x808080);
c$.darkGray = c$.prototype.darkGray =  new java.awt.Color (0x404040);
c$.black = c$.prototype.black =  new java.awt.Color (0x000000);
c$.red = c$.prototype.red =  new java.awt.Color (0xff0000);
c$.pink = c$.prototype.pink =  new java.awt.Color (0xffafaf);
c$.orange = c$.prototype.orange =  new java.awt.Color (0xffc800);
c$.yellow = c$.prototype.yellow =  new java.awt.Color (0xffff00);
c$.green = c$.prototype.green =  new java.awt.Color (0x00ff00);
c$.magenta = c$.prototype.magenta =  new java.awt.Color (0xff00ff);
c$.cyan = c$.prototype.cyan =  new java.awt.Color (0x00ffff);
c$.blue = c$.prototype.blue =  new java.awt.Color (0x0000ff);
c$.WHITE = c$.prototype.WHITE = java.awt.Color.white;
c$.LIGHT_GRAY = c$.prototype.LIGHT_GRAY = java.awt.Color.lightGray;
c$.GRAY = c$.prototype.GRAY = java.awt.Color.gray;
c$.DARK_GRAY = c$.prototype.DARK_GRAY = java.awt.Color.darkGray;
c$.BLACK = c$.prototype.BLACK = java.awt.Color.black;
c$.RED = c$.prototype.RED = java.awt.Color.red;
c$.PINK = c$.prototype.PINK = java.awt.Color.pink;
c$.ORANGE = c$.prototype.ORANGE = java.awt.Color.orange;
c$.YELLOW = c$.prototype.YELLOW = java.awt.Color.yellow;
c$.GREEN = c$.prototype.GREEN = java.awt.Color.green;
c$.MAGENTA = c$.prototype.MAGENTA = java.awt.Color.magenta;
c$.CYAN = c$.prototype.CYAN = java.awt.Color.cyan;
c$.BLUE = c$.prototype.BLUE = java.awt.Color.blue;
Clazz.defineStatics (c$,
"BRIGHT_SCALE", 0.7);
