Clazz.declarePackage ("astex.map");
Clazz.load (["astex.render.Tmesh"], "astex.map.GraphicalObject", null, function () {
c$ = Clazz.declareType (astex.map, "GraphicalObject", astex.render.Tmesh);
Clazz.makeConstructor (c$, 
function (r) {
Clazz.superConstructor (this, astex.map.GraphicalObject);
this.setRenderer (r);
}, "astex.render.MoleculeRenderer");
});
