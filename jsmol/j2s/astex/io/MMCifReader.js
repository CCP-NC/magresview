Clazz.declarePackage ("astex.io");
Clazz.load (["astex.api.AstexMoleculeReader"], "astex.io.MMCifReader", ["astex.model.Atom", "$.Molecule", "$.Residue", "$.Symmetry", "astex.util.Matrix", "$.PeriodicTable", "$.Settings", "java.lang.Character", "$.Double", "JU.Lst", "$.PT"], function () {
c$ = Clazz.decorateAsClass (function () {
this.lastModelNumber = 0;
this.mmCIFlastChainId = null;
this.mmCIFlastResName = null;
this.lastInsertionCode = '\0';
this.lastResidueNumber = 0;
this.tok = null;
this.labels = null;
this.sz = 0;
Clazz.instantialize (this, arguments);
}, astex.io, "MMCifReader", null, astex.api.AstexMoleculeReader);
Clazz.makeConstructor (c$, 
function () {
this.initialiseReader ();
});
Clazz.defineMethod (c$, "initialiseReader", 
 function () {
this.lastResidueNumber = astex.model.Residue.undefinedResidueNumber;
this.lastInsertionCode = String.fromCharCode ( 0);
this.mmCIFlastChainId = "";
this.mmCIFlastResName = "";
});
Clazz.overrideMethod (c$, "readMolecules", 
function (filename) {
var mols =  new JU.Lst ();
var mol =  new astex.model.Molecule ();
mol.setModelType (1);
mols.addLast (mol);
this.initParser ();
this.lastModelNumber = 1;
var before = System.currentTimeMillis ();
this.startMatching (filename);
var inLoop = false;
this.getToken ();
while (this.tok != null) {
switch (this.tokenType (this.tok)) {
default:
break;
case 8:
inLoop = true;
break;
case 10:
var tokVal = this.tokenValue (this.tok);
if (tokVal.equals ("_exptl.method")) {
mol.setExpMethod (this.tokenValue (this.getToken ()));
continue;
}if (tokVal.startsWith ("_atom_site.")) {
if (inLoop) {
this.readLoopAtoms (mols);
inLoop = false;
continue;
}System.err.println ("Single ATOM/HETATM record not implemented");
break;
}if (tokVal.startsWith ("_atom_sites.")) {
this.readTransMtrx (mol);
continue;
}if (tokVal.startsWith ("_cell.")) {
this.readCellParams (mol);
continue;
}if (tokVal.startsWith ("_symmetry.")) {
this.readSymmetry (mol);
continue;
}if (tokVal.startsWith ("_pdbx_struct_oper_list.")) {
if (inLoop) {
this.readLoopSymOp (mol);
inLoop = false;
} else {
this.mmcifSymOp (mol);
}continue;
}this.getToken ();
}
this.getToken ();
}
System.out.println ("read time " + (System.currentTimeMillis () - before));
for (var i = 0; i < mols.size (); i++) {
mol = mols.get (i);
var symmetry = mol.getSymmetry ();
if (symmetry != null) {
var spaceGroupName = symmetry.getSpaceGroupName ();
if ((spaceGroupName != null) && spaceGroupName.startsWith ("R")) {
if (Math.abs (symmetry.unitCell[3] - symmetry.unitCell[5]) > 0.001) {
spaceGroupName.$replace ('R', 'H');
symmetry.setSpaceGroupName (spaceGroupName);
}}symmetry.prepareSymmetry ();
mol.adjustSymmetry ();
}mol.connect2 ();
}
System.out.println ("exp method " + (mols.get (0)).getExpMethod ());
this.closeTokeniser ();
System.gc ();
return mols;
}, "~S");
Clazz.defineMethod (c$, "getToken", 
 function () {
return (this.tok = (this.hasMoreTokens () ? this.nextToken () : null));
});
Clazz.defineMethod (c$, "readLoopAtoms", 
 function (mols) {
if (!this.getDataLabels ()) return;
var maxModels = Integer.parseInt (astex.util.Settings.getString ("config", "molecule.max_models"));
var model = mols.get (0);
var resName = "";
var chainName = "";
var authChainName = "";
var authResName = "";
var altLoc = ' ';
var insCode = ' ';
var resNum = -2147483648;
var modelNum = -2147483648;
var authResNum = -2147483648;
while (this.isDataToken (this.tok)) {
var atom = astex.model.Atom.create ();
chainName = resName = authChainName = authResName = "";
insCode = altLoc = ' ';
resNum = modelNum = authResNum = -2147483648;
for (var i = 0; i < this.sz; i++) {
var s = this.labels.get (i);
var val = this.tokenValue (this.tok);
if (s.equals ("_atom_site.group_PDB")) {
if (val.equals ("HETATM")) atom.setHeteroAtom (true);
} else if (s.equals ("_atom_site.id")) {
atom.setId (Integer.parseInt (val));
} else if (s.equals ("_atom_site.type_symbol")) {
atom.setElement (astex.util.PeriodicTable.getElementFromSymbol (val));
} else if (s.equals ("_atom_site.label_atom_id")) {
atom.setAtomLabel (val);
} else if (s.equals ("_atom_site.label_alt_id")) {
if (val.matches ("[A-Za-z0-9]")) {
altLoc = val.charAt (0);
atom.setAltLoc (altLoc);
}} else if (s.equals ("_atom_site.label_comp_id")) {
resName = val;
} else if (s.equals ("_atom_site.label_asym_id")) {
chainName = val;
} else if (s.equals ("_atom_site.label_entity_id")) {
} else if (s.equals ("_atom_site.label_seq_id")) {
try {
resNum = Integer.parseInt (val);
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
resNum = 0;
} else {
throw e;
}
}
} else if (s.equals ("_atom_site.pdbx_PDB_ins_code")) {
if (val.length == 1 && Character.isLetterOrDigit (val.charAt (0))) {
insCode = val.charAt (0);
atom.setInsertionCode (insCode);
}} else if (s.equals ("_atom_site.Cartn_x")) {
atom.setXX (Double.parseDouble (val));
} else if (s.equals ("_atom_site.Cartn_y")) {
atom.setYY (Double.parseDouble (val));
} else if (s.equals ("_atom_site.Cartn_z")) {
atom.setZZ (Double.parseDouble (val));
} else if (s.equals ("_atom_site.occupancy")) {
atom.setOccupancy (Double.parseDouble (val));
} else if (s.equals ("_atom_site.B_iso_or_equiv")) {
atom.setBFactor (Double.parseDouble (val));
} else if (s.equals ("_atom_site.auth_seq_id")) {
authResNum = Integer.parseInt (val);
} else if (s.equals ("_atom_site.auth_comp_id")) {
authResName = val;
} else if (s.equals ("_atom_site.auth_asym_id")) {
authChainName = val;
} else if (s.equals ("_atom_site.pdbx_PDB_model_num")) {
modelNum = Integer.parseInt (val);
}this.getToken ();
}
if (this.mmCIFneedNewModel (modelNum)) {
if (modelNum == 2) {
model.setModelType (2);
} else if (modelNum > maxModels) {
System.out.println ("Only reading the first " + maxModels + " models");
return;
}model =  new astex.model.Molecule ();
model.setModelType (3);
model.setModelNumber (modelNum);
mols.addLast (model);
}if (this.mmCIFneedNewChain (chainName)) {
var chain = model.addChain ();
chain.setName (chainName);
chain.setAuthName (authChainName);
}if (this.mmCIFneedNewResidue (authResNum, authResName, insCode)) {
var maxResId = model.getCurrentChain ().getMaximumResidueId ();
var res = model.addResidue ();
if (resNum == 0) {
res.setNumber (maxResId + 1);
} else {
res.setNumber (resNum);
}res.setAuthorNumber (authResNum);
res.setInsertionCode (insCode);
res.setName (resName);
}if (this.mmCIFisSolventAtom (resName)) atom.setSolvent (true);
model.addAtom (atom);
}
}, "JU.Lst");
Clazz.defineMethod (c$, "readLoopSymOp", 
 function (mol) {
if (!this.getDataLabels ()) return;
var cnt = 0;
while (this.isDataToken (this.tok)) {
var m =  new astex.util.Matrix ();
var keep = true;
for (var i = 0; i < this.sz; i++) {
var s = this.labels.get (i);
var val = this.tokenValue (this.tok);
if (s.equals ("_pdbx_struct_oper_list.type")) {
if (!val.contains ("symmetry operation")) keep = false;
} else if (s.equals ("_pdbx_struct_oper_list.matrix[1][1]")) {
m.x00 = Double.parseDouble (val);
} else if (s.equals ("_pdbx_struct_oper_list.matrix[1][2]")) {
m.x10 = Double.parseDouble (val);
} else if (s.equals ("_pdbx_struct_oper_list.matrix[1][3]")) {
m.x20 = Double.parseDouble (val);
} else if (s.equals ("_pdbx_struct_oper_list.matrix[2][1]")) {
m.x01 = Double.parseDouble (val);
} else if (s.equals ("_pdbx_struct_oper_list.matrix[2][2]")) {
m.x11 = Double.parseDouble (val);
} else if (s.equals ("_pdbx_struct_oper_list.matrix[2][3]")) {
m.x21 = Double.parseDouble (val);
} else if (s.equals ("_pdbx_struct_oper_list.matrix[3][1]")) {
m.x02 = Double.parseDouble (val);
} else if (s.equals ("_pdbx_struct_oper_list.matrix[3][2]")) {
m.x12 = Double.parseDouble (val);
} else if (s.equals ("_pdbx_struct_oper_list.matrix[3][3]")) {
m.x22 = Double.parseDouble (val);
} else if (s.equals ("_pdbx_struct_oper_list.vector[1]")) {
m.x30 = Double.parseDouble (val);
} else if (s.equals ("_pdbx_struct_oper_list.vector[2]")) {
m.x31 = Double.parseDouble (val);
} else if (s.equals ("_pdbx_struct_oper_list.vector[3]")) {
m.x32 = Double.parseDouble (val);
}this.getToken ();
}
if (keep) {
mol.addBioTransform (m);
cnt++;
}}
if (cnt > 1) System.out.println ("Read " + cnt + " transforms from _pdbx_struct_oper_list (REMARK 350)");
}, "astex.model.Molecule");
Clazz.defineMethod (c$, "readTransMtrx", 
 function (mol) {
var sym = mol.getSymmetry ();
if (sym == null) {
sym =  new astex.model.Symmetry ();
mol.setSymmetry (sym);
}if (sym.scale == null) {
sym.scale =  new astex.util.Matrix ();
}var r = sym.scale;
var s;
while (this.tok != null && (s = this.tokenValue (this.tok)).startsWith ("_atom_sites.")) {
var val = this.tokenValue (this.getToken ());
if (s.equals ("_atom_sites.fract_transf_matrix[1][1]")) {
r.x00 = Double.parseDouble (val);
} else if (s.equals ("_atom_sites.fract_transf_matrix[1][2]")) {
r.x10 = Double.parseDouble (val);
} else if (s.equals ("_atom_sites.fract_transf_matrix[1][3]")) {
r.x20 = Double.parseDouble (val);
} else if (s.equals ("_atom_sites.fract_transf_matrix[2][1]")) {
r.x01 = Double.parseDouble (val);
} else if (s.equals ("_atom_sites.fract_transf_matrix[2][2]")) {
r.x11 = Double.parseDouble (val);
} else if (s.equals ("_atom_sites.fract_transf_matrix[2][3]")) {
r.x21 = Double.parseDouble (val);
} else if (s.equals ("_atom_sites.fract_transf_matrix[3][1]")) {
r.x02 = Double.parseDouble (val);
} else if (s.equals ("_atom_sites.fract_transf_matrix[3][2]")) {
r.x12 = Double.parseDouble (val);
} else if (s.equals ("_atom_sites.fract_transf_matrix[3][3]")) {
r.x22 = Double.parseDouble (val);
} else if (s.equals ("_atom_sites.fract_transf_vector[1]")) {
r.x30 = Double.parseDouble (val);
} else if (s.equals ("_atom_sites.fract_transf_vector[2]")) {
r.x31 = Double.parseDouble (val);
} else if (s.equals ("_atom_sites.fract_transf_vector[3]")) {
r.x32 = Double.parseDouble (val);
}this.getToken ();
}
}, "astex.model.Molecule");
Clazz.defineMethod (c$, "readCellParams", 
 function (mol) {
var sym = mol.getSymmetry ();
if (sym == null) {
sym =  new astex.model.Symmetry ();
mol.setSymmetry (sym);
}var cell =  Clazz.newDoubleArray (6, 0);
var s;
while (this.tok != null && (s = this.tokenValue (this.tok)).startsWith ("_cell.")) {
var val = this.tokenValue (this.getToken ());
if (s.equals ("_cell.length_a")) {
cell[0] = Double.parseDouble (val);
} else if (s.equals ("_cell.length_b")) {
cell[1] = Double.parseDouble (val);
} else if (s.equals ("_cell.length_c")) {
cell[2] = Double.parseDouble (val);
} else if (s.equals ("_cell.angle_alpha")) {
cell[3] = Double.parseDouble (val);
} else if (s.equals ("_cell.angle_beta")) {
cell[4] = Double.parseDouble (val);
} else if (s.equals ("_cell.angle_gamma")) {
cell[5] = Double.parseDouble (val);
}this.getToken ();
}
mol.setUnitCell (cell);
}, "astex.model.Molecule");
Clazz.defineMethod (c$, "readSymmetry", 
 function (mol) {
var sym = mol.getSymmetry ();
if (sym == null) {
sym =  new astex.model.Symmetry ();
mol.setSymmetry (sym);
}var s;
while (this.tok != null && (s = this.tokenValue (this.tok)).startsWith ("_symmetry.")) {
var val = this.tokenValue (this.getToken ());
if (s.equals ("_symmetry.space_group_name_H-M")) {
sym.setOriginalSpaceGroupName (val.trim ());
sym.setSpaceGroupName (JU.PT.replaceAllCharacters (val, " \t\n", ""));
} else if (s.equals ("_symmetry.Int_Tables_number") && !val.startsWith ("?")) {
sym.setSpaceGroupNumber (Integer.parseInt (val, 10));
}this.getToken ();
}
}, "astex.model.Molecule");
Clazz.defineMethod (c$, "mmcifSymOp", 
 function (mol) {
var m =  new astex.util.Matrix ();
var s;
while (this.tok != null && (s = this.tokenValue (this.tok)).startsWith ("_pdbx_struct_oper_list.")) {
var val = this.tokenValue (this.getToken ());
if (s.equals ("_pdbx_struct_oper_list.matrix[1][1]")) {
m.x00 = Double.parseDouble (val);
} else if (s.equals ("_pdbx_struct_oper_list.matrix[1][2]")) {
m.x10 = Double.parseDouble (val);
} else if (s.equals ("_pdbx_struct_oper_list.matrix[1][3]")) {
m.x20 = Double.parseDouble (val);
} else if (s.equals ("_pdbx_struct_oper_list.matrix[2][1]")) {
m.x01 = Double.parseDouble (val);
} else if (s.equals ("_pdbx_struct_oper_list.matrix[2][2]")) {
m.x11 = Double.parseDouble (val);
} else if (s.equals ("_pdbx_struct_oper_list.matrix[2][3]")) {
m.x21 = Double.parseDouble (val);
} else if (s.equals ("_pdbx_struct_oper_list.matrix[3][1]")) {
m.x02 = Double.parseDouble (val);
} else if (s.equals ("_pdbx_struct_oper_list.matrix[3][2]")) {
m.x12 = Double.parseDouble (val);
} else if (s.equals ("_pdbx_struct_oper_list.matrix[3][3]")) {
m.x22 = Double.parseDouble (val);
} else if (s.equals ("_pdbx_struct_oper_list.vector[1]")) {
m.x30 = Double.parseDouble (val);
} else if (s.equals ("_pdbx_struct_oper_list.vector[2]")) {
m.x31 = Double.parseDouble (val);
} else if (s.equals ("_pdbx_struct_oper_list.vector[3]")) {
m.x32 = Double.parseDouble (val);
}this.getToken ();
}
mol.addBioTransform (m);
System.out.println ("Read 1 transform from _pdbx_struct_oper_list (REMARK 350)");
return;
}, "astex.model.Molecule");
Clazz.defineMethod (c$, "getDataLabels", 
 function () {
this.labels =  new JU.Lst ();
this.labels.addLast (this.tokenValue (this.tok));
while (this.getToken () != null) {
if (this.tokenType (this.tok) != 10) break;
this.labels.addLast (this.tokenValue (this.tok));
}
this.sz = this.labels.size ();
return (this.sz > 0);
});
Clazz.defineMethod (c$, "isDataToken", 
 function (tok) {
var type = (tok == null ? 0 : this.tokenType (tok));
return type == 12 || type == 1 || type == 13 || type == 11 || type == 16 || type == 14;
}, "~O");
Clazz.defineMethod (c$, "mmCIFneedNewModel", 
 function (currentModelNumber) {
if (currentModelNumber != this.lastModelNumber) {
this.initialiseReader ();
this.lastModelNumber = currentModelNumber;
return true;
}return false;
}, "~N");
Clazz.defineMethod (c$, "mmCIFneedNewChain", 
 function (currentChainId) {
if (!currentChainId.equals (this.mmCIFlastChainId)) {
this.initialiseReader ();
this.mmCIFlastChainId = currentChainId;
return true;
}return false;
}, "~S");
Clazz.defineMethod (c$, "mmCIFneedNewResidue", 
function (currentResidueNumber, currentAuthResidueName, currentInsertionCode) {
if (this.lastResidueNumber != currentResidueNumber || !this.mmCIFlastResName.equals (currentAuthResidueName) || this.lastInsertionCode != currentInsertionCode) {
this.lastResidueNumber = currentResidueNumber;
this.mmCIFlastResName = currentAuthResidueName;
this.lastInsertionCode = currentInsertionCode;
return true;
}return false;
}, "~N,~S,~S");
Clazz.defineMethod (c$, "mmCIFisSolventAtom", 
function (resName) {
return (resName.equals ("HOH") || resName.equals ("DOD") || resName.equals ("WAT"));
}, "~S");
Clazz.defineStatics (c$,
"TOKEN_MULTILINE", 1,
"TOKEN_COMMENT", 2,
"TOKEN_DATA", 7,
"TOKEN_LOOP", 8,
"TOKEN_ITEM_NAME", 10,
"TOKEN_SQUOTE_STRING", 11,
"TOKEN_DQUOTE_STRING", 12,
"TOKEN_NULL", 13,
"TOKEN_UNKNOWN", 14,
"TOKEN_STRING", 16);
});
