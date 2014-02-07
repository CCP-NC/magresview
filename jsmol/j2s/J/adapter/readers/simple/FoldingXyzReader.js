Clazz.declarePackage ("J.adapter.readers.simple");
Clazz.load (["J.adapter.smarter.AtomSetCollectionReader"], "J.adapter.readers.simple.FoldingXyzReader", ["java.util.Hashtable", "JU.AU", "$.PT", "J.adapter.smarter.Atom"], function () {
c$ = Clazz.declareType (J.adapter.readers.simple, "FoldingXyzReader", J.adapter.smarter.AtomSetCollectionReader);
$_V(c$, "initializeReader", 
function () {
this.atomSetCollection.setNoAutoBond ();
});
$_V(c$, "checkLine", 
function () {
var next = [0];
var token = JU.PT.parseTokenNext (this.line, next);
if (token == null) return true;
var addAtoms = this.doGetModel (++this.modelNumber, null);
var modelAtomCount = this.parseIntStr (token);
var tokens = this.getTokens ();
if (addAtoms) {
this.atomSetCollection.newAtomSet ();
this.atomSetCollection.setAtomSetName (tokens.length == 2 ? "Protein " + tokens[1] : this.line.substring (next[0]));
}var readLine = this.readAtoms (modelAtomCount + 1, addAtoms);
this.continuing = !addAtoms || !this.isLastModel (this.modelNumber);
return readLine;
});
$_M(c$, "readAtoms", 
function (atomCount, addAtoms) {
var htBondCounts =  new java.util.Hashtable ();
var bonds = JU.AU.newInt2 (atomCount);
var haveAtomTypes = true;
var checking = true;
var i0 = this.atomSetCollection.atomCount;
var lastAtom = null;
var readNextLine = true;
for (var i = 0; i < atomCount; i++) {
this.discardLinesUntilNonBlank ();
if (this.line == null) break;
var tokens = J.adapter.smarter.AtomSetCollectionReader.getTokensStr (this.line);
if (tokens[0].equals (lastAtom)) {
readNextLine = false;
break;
}lastAtom = tokens[0];
if (!addAtoms) continue;
this.addAtomXYZSymName (tokens, 2, this.getElement (tokens[1]), tokens[1]);
var n = tokens.length - 5;
bonds[i] =  Clazz.newIntArray (n, 0);
for (var j = 0; j < n; j++) {
var t = tokens[j + 5];
var i2 = this.parseIntStr (t) - 1;
bonds[i][j] = i2;
if (checking) {
if (n == 0 || i2 == i || i2 < 0 || i2 >= atomCount) {
haveAtomTypes = (n > 0);
checking = false;
} else {
var count = htBondCounts.get (t);
if (count == null) htBondCounts.put (t, count =  Clazz.newIntArray (1, 0));
if (++count[0] > 10) haveAtomTypes = !(checking = false);
}}}
}
if (addAtoms) this.makeBonds (i0, bonds, !checking && haveAtomTypes);
return readNextLine;
}, "~N,~B");
$_M(c$, "makeBonds", 
($fz = function (i0, bonds, haveAtomTypes) {
var atoms = this.atomSetCollection.atoms;
for (var i = bonds.length; --i >= 0; ) {
var b = bonds[i];
if (b == null) continue;
var a = atoms[i0 + i];
var b0 = 0;
if (haveAtomTypes) a.atomName += "\0" + (b[b0++] + 1);
for (var j = b.length; --j >= b0; ) if (b[j] > i) this.atomSetCollection.addNewBondWithOrder (i0 + i, i0 + b[j], 1);

}
}, $fz.isPrivate = true, $fz), "~N,~A,~B");
$_M(c$, "getElement", 
($fz = function (name) {
var n = name.length;
switch (n) {
case 1:
break;
default:
var c1 = name.charAt (0);
var c2 = name.charAt (1);
n = (J.adapter.smarter.Atom.isValidElementSymbol2 (c1, c2) || c1 == 'C' && c2 == 'L' ? 2 : 1);
}
return name.substring (0, n);
}, $fz.isPrivate = true, $fz), "~S");
});
