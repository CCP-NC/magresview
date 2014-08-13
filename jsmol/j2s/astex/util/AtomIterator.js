Clazz.declarePackage ("astex.util");
Clazz.load (["java.util.Enumeration"], "astex.util.AtomIterator", null, function () {
c$ = Clazz.decorateAsClass (function () {
this.renderer = null;
this.moleculeCount = 0;
this.currentMolecule = null;
this.currentMoleculeIndex = 0;
this.currentAtomIndex = 0;
this.currentMoleculeAtomCount = 0;
this.atomPts = null;
this.molecules = null;
this.molPt = 0;
Clazz.instantialize (this, arguments);
}, astex.util, "AtomIterator", null, java.util.Enumeration);
Clazz.makeConstructor (c$, 
function (moleculeRenderer) {
this.renderer = moleculeRenderer;
this.moleculeCount = this.renderer.getMoleculeCount ();
this.molecules = this.renderer.getMolecules ().getArray ();
if (this.moleculeCount > 0) {
this.currentMolecule = this.molecules[0];
this.currentMoleculeAtomCount = this.currentMolecule.getAtomCount ();
}}, "astex.render.MoleculeRenderer");
Clazz.defineMethod (c$, "getAtom", 
function (pt) {
if (this.atomPts == null) {
this.atomPts =  Clazz.newIntArray (this.moleculeCount + 1, 0);
for (var i = 1, p = 0; i <= this.moleculeCount; i++) this.atomPts[i] = p = p + this.renderer.getMolecule (i - 1).getAtomCount ();

}while (pt < this.atomPts[this.molPt]) this.molPt--;

while (pt >= this.atomPts[this.molPt + 1]) this.molPt++;

return (this.molecules[this.molPt]).getAtom (pt - this.atomPts[this.molPt]);
}, "~N");
Clazz.overrideMethod (c$, "hasMoreElements", 
function () {
if (this.currentMolecule == null) {
return false;
}if (this.currentAtomIndex < this.currentMoleculeAtomCount) return true;
this.currentAtomIndex = 0;
this.currentMolecule = null;
while (++this.currentMoleculeIndex < this.moleculeCount) {
this.currentMolecule = this.molecules[this.currentMoleculeIndex];
if (this.currentMolecule.getAtomCount () > 0) break;
this.currentMolecule = null;
}
if (this.currentMolecule != null) {
this.currentMoleculeAtomCount = this.currentMolecule.getAtomCount ();
return true;
}return false;
});
Clazz.overrideMethod (c$, "nextElement", 
function () {
return (this.hasMoreElements () ? this.currentMolecule.getAtom (this.currentAtomIndex++) : null);
});
Clazz.defineMethod (c$, "getNextAtom", 
function () {
return this.nextElement ();
});
});
