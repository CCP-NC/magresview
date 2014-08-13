Clazz.declarePackage ("astex.model");
Clazz.load (["java.util.Enumeration"], "astex.model.ResidueIterator", null, function () {
c$ = Clazz.decorateAsClass (function () {
this.renderer = null;
this.residueCount = 0;
this.currentResidue = 0;
this.residues = null;
Clazz.instantialize (this, arguments);
}, astex.model, "ResidueIterator", null, java.util.Enumeration);
Clazz.makeConstructor (c$, 
function (moleculeRenderer) {
this.renderer = moleculeRenderer;
var moleculeCount = this.renderer.getMoleculeCount ();
this.residueCount = 0;
for (var m = 0; m < moleculeCount; m++) {
var molecule = this.renderer.getMolecule (m);
var chainCount = molecule.getChainCount ();
for (var c = 0; c < chainCount; c++) {
var chain = molecule.getChain (c);
this.residueCount += chain.getResidueCount ();
}
}
if (this.residueCount > 0) {
this.residues =  new Array (this.residueCount);
this.currentResidue = 0;
for (var m = 0; m < moleculeCount; m++) {
var molecule = this.renderer.getMolecule (m);
var chainCount = molecule.getChainCount ();
for (var c = 0; c < chainCount; c++) {
var chain = molecule.getChain (c);
var residueCount = chain.getResidueCount ();
for (var r = 0; r < residueCount; r++) {
var residue = chain.getResidue (r);
this.residues[this.currentResidue++] = residue;
}
}
}
}this.currentResidue = 0;
}, "astex.render.MoleculeRenderer");
Clazz.overrideMethod (c$, "hasMoreElements", 
function () {
return this.currentResidue < this.residueCount;
});
Clazz.overrideMethod (c$, "nextElement", 
function () {
return (this.currentResidue < this.residueCount ? this.residues[this.currentResidue++] : null);
});
Clazz.defineMethod (c$, "getNextResidue", 
function () {
return this.nextElement ();
});
});
