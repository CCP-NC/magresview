Clazz.declarePackage ("astex.model");
c$ = Clazz.declareType (astex.model, "MoleculeEvent");
Clazz.defineStatics (c$,
"MoleculeAdded", 1,
"MoleculeRemoved", 2,
"MoleculeChanged", 4,
"AtomAdded", 8,
"AtomRemoved", 16,
"AtomChanged", 32,
"AtomSelected", 64,
"MoleculeEventMask", 7,
"AtomEventMask", 120);
