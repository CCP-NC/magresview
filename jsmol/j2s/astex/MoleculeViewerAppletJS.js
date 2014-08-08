Clazz.declarePackage ("astex");
Clazz.load (["astex.GenericApplet", "javajs.api.JSInterface"], "astex.MoleculeViewerAppletJS", ["astex.awtjs2d.ViewerJS", "astex.io.FILE", "astex.util.Log", "java.net.URL", "JU.AjaxURLStreamHandlerFactory", "$.PT"], function () {
c$ = Clazz.decorateAsClass (function () {
this.callJsoInit = false;
this.info = null;
Clazz.instantialize (this, arguments);
}, astex, "MoleculeViewerAppletJS", astex.GenericApplet, javajs.api.JSInterface);
Clazz.makeConstructor (c$, 
function (Info) {
Clazz.superConstructor (this, astex.MoleculeViewerAppletJS, []);
this.info = Info;
this.run ();
}, "java.util.Hashtable");
Clazz.defineMethod (c$, "setJSObject", 
function () {
{
this.viewer.jso = window;
}});
Clazz.defineMethod (c$, "run", 
function () {
this.viewer =  new astex.awtjs2d.ViewerJS ();
this.reportProgress ();
astex.io.FILE.setDebug (false);
try {
java.net.URL.setURLStreamHandlerFactory ( new JU.AjaxURLStreamHandlerFactory ());
} catch (e) {
}
try {
var dbase =  new java.net.URL (Clazz.castNullAs ("java.net.URL"), this.getParameter ("documentBase"), null);
var cbase =  new java.net.URL (Clazz.castNullAs ("java.net.URL"), this.getParameter ("codePath"), null);
System.out.println ("documentBase = " + dbase);
System.out.println ("codeBase = " + cbase);
astex.io.FILE.setDocumentBase (dbase);
astex.io.FILE.setCodeBase (cbase);
if (dbase.toString ().startsWith ("file")) {
astex.io.FILE.setTryFiles (true);
}} catch (e1) {
if (Clazz.exceptionOf (e1, java.net.MalformedURLException)) {
System.out.println ("bad URL for documentBase or codeBase");
} else {
throw e1;
}
}
 new astex.util.Log ();
this.callJsoInit = this.checkBoolean ("jso.init", "jsoinit");
this.setJSObject ();
this.reportProgress ();
this.initialiseApplet (this.info);
this.reportProgress ();
try {
this.publicInit ();
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
System.out.println ("some terrible error occurred loading user extension");
} else {
throw e;
}
}
this.viewer.ready = true;
this.viewer.repaint ();
if (this.callJsoInit) {
}});
Clazz.defineMethod (c$, "publicInit", 
 function () {
});
Clazz.overrideMethod (c$, "checkBoolean", 
function (config, param) {
return "true".equals (this.getParameter (param));
}, "~S,~S");
Clazz.overrideMethod (c$, "getParameter", 
function (key) {
return (this.info.containsKey (key) ? this.info.get (key).toString () : null);
}, "~S");
Clazz.overrideMethod (c$, "reportProgress", 
function () {
});
Clazz.overrideMethod (c$, "destroy", 
function () {
});
Clazz.overrideMethod (c$, "doSendCallback", 
function (callback, data, strInfo) {
if (callback == null || callback.length == 0) {
} else if (callback.equals ("alert")) {
{
alert(strInfo); return "";
}} else {
var tokens = JU.PT.split (callback, ".");
{
try{ var o = window[tokens[0]]; for (var i = 1; i <
tokens.length; i++) o = o[tokens[i]]; for (var i = 0; i <
data.length; i++) data[i] && data[i].booleanValue &&
(data[i] = data[i].booleanValue());
return o(data[0],data[1],
data[2],data[3],data[4],data[5],data[6],data[7]); } catch
(e) { System.out.println(callback + " failed " + e); }
}}return "";
}, "~S,~A,~S");
Clazz.overrideMethod (c$, "cacheFileByName", 
function (fileName, isAdd) {
return 0;
}, "~S,~B");
Clazz.overrideMethod (c$, "cachePut", 
function (key, data) {
}, "~S,~O");
Clazz.overrideMethod (c$, "getGLmolView", 
function () {
return null;
});
Clazz.overrideMethod (c$, "getFullName", 
function () {
return (this.viewer).fullName;
});
Clazz.overrideMethod (c$, "processMouseEvent", 
function (id, x, y, modifiers, time) {
return (this.viewer).processMouseEvent (id, x, y, modifiers, time);
}, "~N,~N,~N,~N,~N");
Clazz.overrideMethod (c$, "setDisplay", 
function (canvas) {
(this.viewer).setDisplay (canvas);
}, "~O");
Clazz.overrideMethod (c$, "setStatusDragDropped", 
function (mode, x, y, fileName) {
return true;
}, "~N,~N,~N,~S");
Clazz.overrideMethod (c$, "startHoverWatcher", 
function (enable) {
}, "~B");
Clazz.overrideMethod (c$, "update", 
function () {
(this.viewer).updateJS ();
});
Clazz.overrideMethod (c$, "setScreenDimension", 
function (width, height) {
(this.viewer).setScreenDimension (width, height);
}, "~N,~N");
Clazz.overrideMethod (c$, "loadInlineString", 
function (mol, script, isAppend) {
return null;
}, "~S,~S,~B");
Clazz.overrideMethod (c$, "openFile", 
function (fileName) {
this.script ("load \"" + fileName + "\"");
return null;
}, "~S");
Clazz.overrideMethod (c$, "openFileAsyncSpecial", 
function (fileName, flags) {
}, "~S,~N");
Clazz.overrideMethod (c$, "processTwoPointGesture", 
function (touches) {
}, "~A");
});
