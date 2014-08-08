Clazz.declarePackage ("astex.map");
Clazz.load (null, "astex.map.Featurize", ["astex.model.Molecule", "astex.util.Color32"], function () {
c$ = Clazz.declareType (astex.map, "Featurize");
c$.handleCommand = Clazz.defineMethod (c$, "handleCommand", 
function (mv, mr, args) {
var mapName = args.getString ("-map", null);
var molName = args.getString ("-molecule", null);
var featureValue = args.getDouble ("-level", 1.0);
var neighbourCount = args.getInteger ("-neighbours", 7);
if (mapName == null || molName == null) {
System.out.println ("astex.Featurize: you must specify -map and -molecule");
return;
}var featureMolecule = mr.findMolecule (molName);
if (featureMolecule == null) {
featureMolecule =  new astex.model.Molecule ();
featureMolecule.setMoleculeType (2);
featureMolecule.setName (molName);
mv.addMolecule (featureMolecule);
}featureMolecule.initialise ();
var maps = mr.getMaps (mapName);
var mapBoxSize;
for (var m = 0; m < maps.size (); m++) {
var map = maps.get (m);
mapBoxSize = map.getMapBoxDimensions ();
var rms = map.getSigma ();
var level = featureValue * rms;
for (var i = 0; i < mapBoxSize[0]; i++) {
for (var j = 0; j < mapBoxSize[1]; j++) {
for (var k = 0; k < mapBoxSize[2]; k++) {
var val = map.getValueAtRelativeGrid (i, j, k);
if (val > level) {
var highCount = 0;
for (var ii = -1; ii <= 1; ii++) {
for (var jj = -1; jj <= 1; jj++) {
for (var kk = -1; kk <= 1; kk++) {
if (ii != 0 || jj != 0 || kk != 0) {
var neighbourVal = map.getValueAtRelativeGrid (i + ii, j + jj, k + kk);
if (neighbourVal > val) {
highCount++;
}}}
}
}
if (highCount < neighbourCount) {
var a = featureMolecule.addNewAtom ();
a.setElement (0);
a.setColor (astex.util.Color32.thistle);
map.relativeGridToCartesian (i, j, k, a);
}}}
}
}
}
}, "astex.viewer.Viewer,astex.render.MoleculeRenderer,astex.util.Arguments");
});
