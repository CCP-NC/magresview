Clazz.declarePackage ("astex.awtjs2d");
Clazz.load (["astex.api.AstexCanvas"], "astex.awtjs2d.JSCanvas", ["astex.viewer.Viewer"], function () {
c$ = Clazz.decorateAsClass (function () {
this.tainted = true;
this.width = 0;
this.height = 0;
this.buf = null;
this.mv = null;
Clazz.instantialize (this, arguments);
}, astex.awtjs2d, "JSCanvas", null, astex.api.AstexCanvas);
Clazz.makeConstructor (c$, 
function (mv) {
this.mv = mv;
}, "astex.awtjs2d.ViewerJS");
Clazz.overrideMethod (c$, "setBounds", 
function (x, y, width, height) {
this.tainted = true;
this.mv.moleculeRenderer.renderer.setSize (width, height);
}, "~N,~N,~N,~N");
Clazz.defineMethod (c$, "getPreferredSize", 
function () {
return null;
});
Clazz.overrideMethod (c$, "setMemoryImageSource", 
function () {
this.buf = this.mv.moleculeRenderer.renderer.pbuffer;
this.width = this.mv.moleculeRenderer.renderer.pixelWidth;
this.height = this.mv.moleculeRenderer.renderer.pixelHeight;
{
this.mv.display.buf32 = this.buf;
}this.tainted = false;
});
Clazz.overrideMethod (c$, "taint", 
function () {
this.tainted = true;
});
Clazz.overrideMethod (c$, "repaint", 
function () {
astex.viewer.Viewer.apiPlatform.repaint (this.mv.getDisplay ());
});
Clazz.overrideMethod (c$, "requestFocus", 
function () {
});
});
