Clazz.declarePackage ("astex.io");
Clazz.load (["astex.io.MMCifReader"], "astex.io.StarMMCifReader", ["astex.io.FILE", "com.globalphasing.startools.StarTokeniser"], function () {
c$ = Clazz.decorateAsClass (function () {
this.tokeniser = null;
Clazz.instantialize (this, arguments);
}, astex.io, "StarMMCifReader", astex.io.MMCifReader);
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, astex.io.StarMMCifReader, []);
});
Clazz.overrideMethod (c$, "initParser", 
function () {
this.tokeniser =  new com.globalphasing.startools.StarTokeniser ();
});
Clazz.overrideMethod (c$, "startMatching", 
function (fileName) {
this.tokeniser.startMatchingFileStream (astex.io.FILE.openStatic (fileName, true));
}, "~S");
Clazz.overrideMethod (c$, "hasMoreTokens", 
function () {
return this.tokeniser.hasMoreTokens ();
});
Clazz.overrideMethod (c$, "nextToken", 
function () {
var tok = this.tokeniser.nextToken ();
while (tok != null && this.tokenType (tok) == 2) tok = this.tokeniser.nextToken ();

return tok;
});
Clazz.overrideMethod (c$, "closeTokeniser", 
function () {
this.tokeniser = null;
});
Clazz.overrideMethod (c$, "getTokenValue", 
function (tok) {
return this.tokenValue (tok);
}, "~O");
Clazz.overrideMethod (c$, "tokenValue", 
function (tok) {
return (tok).getValue ();
}, "~O");
Clazz.overrideMethod (c$, "tokenType", 
function (tok) {
return (tok).getType ();
}, "~O");
});
