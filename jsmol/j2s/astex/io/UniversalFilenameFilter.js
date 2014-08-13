Clazz.declarePackage ("astex.io");
Clazz.load (["java.io.FilenameFilter"], "astex.io.UniversalFilenameFilter", null, function () {
c$ = Clazz.decorateAsClass (function () {
this.acceptedExtensions = null;
Clazz.instantialize (this, arguments);
}, astex.io, "UniversalFilenameFilter", null, java.io.FilenameFilter);
Clazz.makeConstructor (c$, 
function (extensions) {
this.setExtensions (extensions);
}, "~A");
Clazz.defineMethod (c$, "setExtensions", 
function (extensions) {
this.acceptedExtensions = extensions;
}, "~A");
Clazz.overrideMethod (c$, "accept", 
function (dir, name) {
var lowerCaseName = name.toLowerCase ();
for (var i = 0; i < this.acceptedExtensions.length; i++) {
var lowerCaseExtension = this.acceptedExtensions[i].toLowerCase ();
if (lowerCaseName.endsWith (lowerCaseExtension)) {
return true;
}}
return false;
}, "java.io.File,~S");
});
