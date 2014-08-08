Clazz.declarePackage ("astex.io");
Clazz.load (["astex.io.MMCifReader", "javajs.api.GenericLineReader"], "astex.io.JSmolMMCifReader", ["astex.io.FILE", "astex.viewer.Viewer", "java.io.BufferedInputStream", "$.BufferedReader", "$.InputStreamReader", "JU.CifDataParser", "$.PT"], function () {
c$ = Clazz.decorateAsClass (function () {
this.tokeniser = null;
this.br = null;
this.file = null;
this.lines = null;
this.linePt = 0;
Clazz.instantialize (this, arguments);
}, astex.io, "JSmolMMCifReader", astex.io.MMCifReader, javajs.api.GenericLineReader);
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, astex.io.JSmolMMCifReader, []);
});
Clazz.overrideMethod (c$, "initParser", 
function () {
this.tokeniser =  new JU.CifDataParser ();
});
Clazz.overrideMethod (c$, "startMatching", 
function (fileName) {
var data = "";
if (astex.viewer.Viewer.isJS) {
data = astex.io.FILE.getFileAsString (fileName);
if (data == null) data = "";
} else {
this.file = astex.io.FILE.openStatic (fileName, false);
try {
this.br =  new java.io.BufferedReader ( new java.io.InputStreamReader ( new java.io.BufferedInputStream (this.file), "UTF-8"));
data = null;
} catch (e) {
if (Clazz.exceptionOf (e, java.io.UnsupportedEncodingException)) {
} else {
throw e;
}
}
}if (data == null) {
this.tokeniser.set (null, this.br);
} else if (data.length > 0) {
this.lines = JU.PT.split (JU.PT.replaceAllCharacters (data, "\r", "\n"), "\n");
this.linePt = 0;
this.tokeniser.set (this, null);
} else {
System.out.println ("Cannot open " + fileName);
}this.tokeniser.setNullValue (null);
}, "~S");
Clazz.overrideMethod (c$, "hasMoreTokens", 
function () {
try {
return (this.tokeniser.peekToken () != null);
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
return false;
} else {
throw e;
}
}
});
Clazz.overrideMethod (c$, "nextToken", 
function () {
var tok = null;
var type = 0;
try {
tok = this.tokeniser.getNextToken ();
type = (tok.equals ("?") ? 14 : tok.equals (".") ? 13 : tok.equals ("loop_") ? 8 : tok.startsWith ("_") ? 10 : tok.startsWith ("data_") ? 7 : 16);
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
} else {
throw e;
}
}
return [tok, Integer.$valueOf (type)];
});
Clazz.overrideMethod (c$, "getTokenValue", 
function (tok) {
return this.tokenValue (tok);
}, "~O");
Clazz.overrideMethod (c$, "tokenValue", 
function (tok) {
return (tok)[0];
}, "~O");
Clazz.overrideMethod (c$, "tokenType", 
function (tok) {
return ((tok)[1]).intValue ();
}, "~O");
Clazz.overrideMethod (c$, "closeTokeniser", 
function () {
if (this.file != null) this.file.close ();
});
Clazz.overrideMethod (c$, "readNextLine", 
function () {
return (this.linePt >= this.lines.length ? null : this.lines[this.linePt++]);
});
});
