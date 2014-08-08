Clazz.declarePackage ("astex");
c$ = Clazz.declareType (astex, "Version");
c$.getVersion = Clazz.defineMethod (c$, "getVersion", 
function () {
return astex.Version.major + "." + astex.Version.minor + "." + astex.Version.build;
});
Clazz.defineStatics (c$,
"major", 4,
"minor", 0,
"build", 0);
