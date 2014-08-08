Clazz.declarePackage ("astex.model");
Clazz.load (["astex.model.Selectable"], "astex.model.Chain", ["astex.model.Residue", "astex.util.DynamicArray"], function () {
c$ = Clazz.decorateAsClass (function () {
this.residues = null;
this.childChains = null;
this.parentChain = null;
this.parent = null;
this.insertionCode = 0;
this.name = null;
this.authName = null;
this.number = 0;
this.currentResidue = null;
Clazz.instantialize (this, arguments);
}, astex.model, "Chain", null, astex.model.Selectable);
Clazz.makeConstructor (c$, 
 function () {
this.residues =  new astex.util.DynamicArray ().set (1, 0);
this.childChains =  new astex.util.DynamicArray ().set (1, 0);
this.initialise ();
});
Clazz.defineMethod (c$, "initialise", 
 function () {
this.name = null;
this.authName = null;
this.number = astex.model.Chain.undefinedChainNumber;
this.parent = null;
this.residues.removeAllElements ();
this.currentResidue = null;
this.childChains.removeAllElements ();
this.parentChain = null;
});
c$.create = Clazz.defineMethod (c$, "create", 
function () {
return  new astex.model.Chain ();
});
Clazz.defineMethod (c$, "setParent", 
function (molecule) {
this.parent = molecule;
}, "astex.model.Molecule");
Clazz.defineMethod (c$, "getParent", 
function () {
return this.parent;
});
Clazz.defineMethod (c$, "setInsertionCode", 
function (code) {
this.insertionCode = code;
}, "~S");
Clazz.defineMethod (c$, "getInsertionCode", 
function () {
return this.insertionCode;
});
Clazz.defineMethod (c$, "setName", 
function (newName) {
this.name = newName;
}, "~S");
Clazz.defineMethod (c$, "getName", 
function () {
return (this.name == null ? astex.model.Chain.undefinedChainName : this.name);
});
Clazz.defineMethod (c$, "setAuthName", 
function (newName) {
this.authName = newName;
}, "~S");
Clazz.defineMethod (c$, "getAuthName", 
function () {
return (this.authName == null ? this.getName () : this.authName);
});
Clazz.defineMethod (c$, "setNumber", 
function (newNumber) {
this.number = newNumber;
}, "~N");
Clazz.defineMethod (c$, "getNumber", 
function () {
return (this.number == astex.model.Chain.undefinedChainNumber ? 1 : this.number);
});
Clazz.defineMethod (c$, "getResidueCount", 
function () {
return this.residues.size ();
});
Clazz.defineMethod (c$, "getResidue", 
function (index) {
return this.residues.get (index);
}, "~N");
Clazz.defineMethod (c$, "addResidue", 
function () {
this.currentResidue = astex.model.Residue.create ();
this.currentResidue.setParent (this);
this.residues.add (this.currentResidue);
return this.currentResidue;
});
Clazz.defineMethod (c$, "removeResidue", 
function (res) {
this.residues.remove (res);
}, "astex.model.Residue");
Clazz.defineMethod (c$, "getCurrentResidue", 
function () {
if (this.currentResidue == null) {
this.addResidue ();
}return this.currentResidue;
});
Clazz.defineMethod (c$, "getMaximumResidueId", 
function () {
var resCount = this.getResidueCount ();
var maximum = -2147483648;
for (var r = 0; r < resCount; r++) {
var res = this.getResidue (r);
if (res.getNumber () > maximum) {
maximum = res.getNumber ();
}}
if (maximum == -2147483648) {
maximum = 0;
}return maximum;
});
Clazz.overrideMethod (c$, "selectStatement", 
function () {
var mol = this.getParent ();
var molSelect = mol.selectStatement ();
return "chain '" + this.getName () + "' and " + molSelect;
});
Clazz.overrideMethod (c$, "select", 
function (state) {
var selectCount = 0;
for (var r = 0; r < this.getResidueCount (); r++) {
var residue = this.getResidue (r);
selectCount += residue.select (state);
}
return selectCount;
}, "~N");
Clazz.defineMethod (c$, "getChildChainCount", 
function () {
return this.childChains.size ();
});
Clazz.defineMethod (c$, "getChildChain", 
function (index) {
return this.childChains.get (index);
}, "~N");
Clazz.defineMethod (c$, "removeChildChain", 
function (ch) {
this.childChains.remove (ch);
}, "astex.model.Chain");
Clazz.defineMethod (c$, "addChildChain", 
function (ch) {
for (var i = 0; i < this.childChains.size (); i++) {
var c = this.getChildChain (i);
if (c.hashCode () == ch.hashCode ()) return;
}
this.childChains.add (ch);
}, "astex.model.Chain");
Clazz.defineMethod (c$, "setParentChain", 
function (ch) {
this.parentChain = ch;
}, "astex.model.Chain");
Clazz.defineMethod (c$, "getParentChain", 
function () {
return this.parentChain;
});
Clazz.defineMethod (c$, "hasParentChain", 
function () {
return this.parentChain != null ? true : false;
});
Clazz.defineStatics (c$,
"undefinedChainNumber", -2147483648,
"undefinedChainName", "X");
});
