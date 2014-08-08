Clazz.declarePackage ("astex.util");
Clazz.load (["java.util.Enumeration"], "astex.util.BondIterator", null, function () {
c$ = Clazz.decorateAsClass (function () {
this.renderer = null;
this.moleculeCount = 0;
this.currentMolecule = null;
this.currentMoleculeIndex = 0;
this.currentBondIndex = 0;
this.currentMoleculeBondCount = 0;
Clazz.instantialize (this, arguments);
}, astex.util, "BondIterator", null, java.util.Enumeration);
Clazz.makeConstructor (c$, 
function (moleculeRenderer) {
this.renderer = moleculeRenderer;
this.moleculeCount = this.renderer.getMoleculeCount ();
if (this.moleculeCount > 0) {
this.currentMolecule = this.renderer.getMolecule (0);
this.currentMoleculeBondCount = this.currentMolecule.getBondCount ();
}}, "astex.render.MoleculeRenderer");
Clazz.overrideMethod (c$, "hasMoreElements", 
function () {
if (this.currentMolecule == null) {
return false;
}if (this.currentBondIndex < this.currentMoleculeBondCount) {
return true;
}this.currentBondIndex = 0;
this.currentMolecule = null;
while (++this.currentMoleculeIndex < this.moleculeCount) {
this.currentMolecule = this.renderer.getMolecule (this.currentMoleculeIndex);
if (this.currentMolecule.getBondCount () > 0) {
break;
}this.currentMolecule = null;
}
if (this.currentMolecule != null) {
this.currentMoleculeBondCount = this.currentMolecule.getBondCount ();
return true;
}return false;
});
Clazz.overrideMethod (c$, "nextElement", 
function () {
return (this.hasMoreElements () ? this.currentMolecule.getBond (this.currentBondIndex++) : null);
});
Clazz.defineMethod (c$, "getNextBond", 
function () {
return this.nextElement ();
});
});
