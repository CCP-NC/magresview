Clazz.declarePackage ("astex.model");
Clazz.load (["astex.util.Matrix"], "astex.model.Symmetry", ["astex.io.FILE", "astex.util.DynamicArray", "java.util.StringTokenizer"], function () {
c$ = Clazz.decorateAsClass (function () {
this.unitCell = null;
this.fractionalToCartesian = null;
this.cartesianToFractional = null;
this.scale = null;
this.matricesAssigned = false;
this.spaceGroupNumber = 0;
this.spaceGroupName = null;
this.originalSpaceGroupName = null;
this.symmetryOperators = null;
this.symmetryTokens = null;
this.ncode = 1;
Clazz.instantialize (this, arguments);
}, astex.model, "Symmetry");
Clazz.prepareFields (c$, function () {
this.unitCell =  Clazz.newDoubleArray (6, 0);
this.fractionalToCartesian =  new astex.util.Matrix ();
this.cartesianToFractional =  new astex.util.Matrix ();
});
Clazz.defineMethod (c$, "getSymmetryTokens", 
function () {
if (this.symmetryTokens == null) {
this.getSymmetryOperators ();
}if (this.symmetryTokens == null) {
System.out.println ("Failed to generate symmetry operators and tokens");
}return this.symmetryTokens;
});
Clazz.defineMethod (c$, "getSymmetryOperators", 
function () {
if (this.symmetryOperators != null) {
return this.symmetryOperators;
}var file = astex.io.FILE.open (astex.model.Symmetry.symmetryLibrary);
var compactedOriginalName = null;
if (this.originalSpaceGroupName != null) {
compactedOriginalName = "";
for (var i = 0; i < this.originalSpaceGroupName.length; i++) {
var c = this.originalSpaceGroupName.charAt (i);
if (c != ' ') {
compactedOriginalName += c;
}}
}while (file.nextLine ()) {
var line = file.getCurrentLineAsString ();
var tokenizer =  new java.util.StringTokenizer (line);
var numberToken = tokenizer.nextToken ();
var operatorCountToken = tokenizer.nextToken ();
tokenizer.nextToken ();
var shortName = tokenizer.nextToken ();
var name = astex.model.Symmetry.getSpaceGroupName (line);
var number = astex.io.FILE.readInteger (numberToken);
var operatorCount = astex.io.FILE.readInteger (operatorCountToken);
if (number == this.spaceGroupNumber || (compactedOriginalName != null && name.equals (compactedOriginalName)) || (this.spaceGroupName != null && shortName.equals (this.spaceGroupName))) {
System.out.println ("spacegroup matched symmetry definition");
System.out.println (line);
this.symmetryOperators =  new astex.util.DynamicArray ();
this.symmetryTokens =  new astex.util.DynamicArray ();
for (var i = 0; i < operatorCount; i++) {
file.nextLine ();
var operatorString = file.getCurrentLineAsString ();
this.symmetryTokens.add (operatorString);
astex.model.Symmetry.readSymmetryOperator (operatorString, this.symmetryOperators);
}
break;
}for (var i = 0; i < operatorCount; i++) file.nextLine ();

}
if (this.symmetryOperators == null) {
System.out.println ("space group " + compactedOriginalName + " not found, set to use P1");
this.setSpaceGroupNumber (1);
this.setSpaceGroupName ("P1");
this.symmetryOperators =  new astex.util.DynamicArray ();
this.symmetryTokens =  new astex.util.DynamicArray ();
var operatorString = " X,Y,Z";
this.symmetryTokens.add (operatorString);
astex.model.Symmetry.readSymmetryOperator (operatorString, this.symmetryOperators);
}file.close ();
return this.symmetryOperators;
});
Clazz.defineMethod (c$, "addTransform", 
function (m) {
if (this.symmetryOperators == null) this.symmetryOperators =  new astex.util.DynamicArray ();
this.symmetryOperators.add (m);
}, "astex.util.Matrix");
Clazz.defineMethod (c$, "getSymmetryOperatorsCount", 
function () {
if (this.symmetryOperators == null) return 0;
return this.symmetryOperators.size ();
});
Clazz.defineMethod (c$, "getSymmetryOperator", 
function (i) {
if (this.symmetryOperators == null) return null;
return this.symmetryOperators.get (i);
}, "~N");
c$.getSpaceGroupName = Clazz.defineMethod (c$, "getSpaceGroupName", 
function (spaceGroupDescription) {
var firstApostrophe = spaceGroupDescription.indexOf ('\'');
var lastApostrophe = spaceGroupDescription.lastIndexOf ('\'');
var spaceGroupName = "";
for (var i = firstApostrophe + 1; i < lastApostrophe; i++) {
var c = spaceGroupDescription.charAt (i);
if (c != ' ') {
spaceGroupName += c;
}}
return spaceGroupName;
}, "~S");
c$.readSymmetryOperator = Clazz.defineMethod (c$, "readSymmetryOperator", 
function (line, symmetryOperators) {
var lineTokenizer =  new java.util.StringTokenizer (line, ",");
var xToken = lineTokenizer.nextToken ().trim ();
var yToken = lineTokenizer.nextToken ().trim ();
var zToken = lineTokenizer.nextToken ().trim ();
var c =  Clazz.newDoubleArray (4, 0);
var m =  new astex.util.Matrix ();
m.setIdentity ();
astex.model.Symmetry.decodeSymmetryToken (xToken, c);
m.x00 = c[0];
m.x10 = c[1];
m.x20 = c[2];
m.x30 = c[3];
astex.model.Symmetry.decodeSymmetryToken (yToken, c);
m.x01 = c[0];
m.x11 = c[1];
m.x21 = c[2];
m.x31 = c[3];
astex.model.Symmetry.decodeSymmetryToken (zToken, c);
m.x02 = c[0];
m.x12 = c[1];
m.x22 = c[2];
m.x32 = c[3];
symmetryOperators.add (m);
}, "~S,astex.util.DynamicArray");
c$.decodeSymmetryToken = Clazz.defineMethod (c$, "decodeSymmetryToken", 
function (token, components) {
for (var i = 0; i < components.length; i++) {
components[i] = 0.0;
}
for (var i = 0; i < 3; i++) {
if (token.indexOf ("-" + astex.model.Symmetry.positiveAxes[i]) != -1) {
components[i] = -1.0;
} else if (token.indexOf (astex.model.Symmetry.positiveAxes[i]) != -1) {
components[i] = 1.0;
}}
for (var i = 0; i < astex.model.Symmetry.fractions.length; i++) {
if (token.indexOf ("-" + astex.model.Symmetry.fractions[i]) != -1) {
components[3] = -astex.model.Symmetry.fractionValues[i];
break;
} else if (token.indexOf (astex.model.Symmetry.fractions[i]) != -1) {
components[3] = astex.model.Symmetry.fractionValues[i];
break;
}}
}, "~S,~A");
Clazz.defineMethod (c$, "setUnitCell", 
function (newCell) {
for (var i = 0; i < 6; i++) {
this.unitCell[i] = newCell[i];
}
this.cartesianToFractional =  new astex.util.Matrix ();
this.fractionalToCartesian =  new astex.util.Matrix ();
astex.model.Symmetry.generateMatrices (this.unitCell, this.cartesianToFractional, this.fractionalToCartesian);
}, "~A");
Clazz.defineMethod (c$, "prepareSymmetry", 
function () {
if (this.scale == null) {
return;
}var s = this.scale;
var c2f = this.getCartesianToFractionalMatrix ();
if (s.equals (c2f)) {
} else {
System.err.println ("prepareSymmetry: SCALE does not match calculated cartesian->fractional matrix");
System.err.println ("prepareSymmetry: fixing symmetry");
var sinv =  new astex.util.Matrix ();
astex.util.Matrix.invert (s, sinv);
var tmp =  new astex.util.Matrix (s);
tmp.transform (sinv);
var f2c = this.getFractionalToCartesianMatrix ();
var check =  new astex.util.Matrix (s);
check.transform (f2c);
check.x30 = 0.0;
check.x31 = 0.0;
check.x32 = 0.0;
var checkt =  new astex.util.Matrix (check);
checkt.transpose ();
check.transform (checkt);
if (check.isIdentity (1.e-2)) {
c2f.copy (s);
f2c.copy (sinv);
} else {
System.err.println ("prepareSymmetry: inconsistent scale matrix - ignored");
this.scale = null;
}}});
Clazz.defineMethod (c$, "setSpaceGroupNumber", 
function (number) {
this.spaceGroupNumber = number;
this.spaceGroupName = null;
}, "~N");
Clazz.defineMethod (c$, "getSpaceGroupNumber", 
function () {
return this.spaceGroupNumber;
});
Clazz.defineMethod (c$, "setSpaceGroupName", 
function (name) {
this.spaceGroupName = name;
this.spaceGroupNumber = 0;
}, "~S");
Clazz.defineMethod (c$, "getSpaceGroupName", 
function () {
return this.spaceGroupName;
});
Clazz.defineMethod (c$, "setOriginalSpaceGroupName", 
function (s) {
this.originalSpaceGroupName = s;
}, "~S");
Clazz.defineMethod (c$, "getOriginalSpaceGroupName", 
function () {
return this.originalSpaceGroupName;
});
Clazz.defineMethod (c$, "setUnitCellCode", 
function (code) {
this.ncode = code;
}, "~N");
Clazz.defineMethod (c$, "getUnitCellCode", 
function () {
return this.ncode;
});
Clazz.defineMethod (c$, "getCartesianToFractionalMatrix", 
function () {
return this.cartesianToFractional;
});
Clazz.defineMethod (c$, "getFractionalToCartesianMatrix", 
function () {
return this.fractionalToCartesian;
});
c$.SQ = Clazz.defineMethod (c$, "SQ", 
function (x) {
return x * x;
}, "~N");
Clazz.defineMethod (c$, "generateScaledMatrices", 
function (cell, scale) {
var scaledCell =  Clazz.newDoubleArray (6, 0);
for (var i = 0; i < 6; i++) {
if (i < 3) {
scaledCell[i] = cell[i] * scale;
} else {
scaledCell[i] = cell[i];
}}
astex.model.Symmetry.generateMatrices (scaledCell, this.cartesianToFractional, this.fractionalToCartesian);
}, "~A,~N");
c$.generateMatrices = Clazz.defineMethod (c$, "generateMatrices", 
function (cell, cartesianToFractional, fractionalToCartesian) {
var cabg =  Clazz.newDoubleArray (3, 0);
var cabgs =  Clazz.newDoubleArray (3, 0);
var sabg =  Clazz.newDoubleArray (3, 0);
var abcs =  Clazz.newDoubleArray (3, 0);
var sabgs1;
var volume;
cartesianToFractional.setIdentity ();
fractionalToCartesian.setIdentity ();
for (var i = 0; i < 3; i++) {
cabg[i] = Math.cos (3.141592653589793 * cell[i + 3] / 180.0);
sabg[i] = Math.sin (3.141592653589793 * cell[i + 3] / 180.0);
}
cabgs[0] = (cabg[1] * cabg[2] - cabg[0]) / (sabg[1] * sabg[2]);
cabgs[1] = (cabg[2] * cabg[0] - cabg[1]) / (sabg[2] * sabg[0]);
cabgs[2] = (cabg[0] * cabg[1] - cabg[2]) / (sabg[0] * sabg[1]);
volume = cell[0] * cell[1] * cell[2] * Math.sqrt (1.0 + 2.0 * cabg[0] * cabg[1] * cabg[2] - astex.model.Symmetry.SQ (cabg[0]) - astex.model.Symmetry.SQ (cabg[1]) - astex.model.Symmetry.SQ (cabg[2]));
abcs[0] = cell[1] * cell[2] * sabg[0] / volume;
abcs[1] = cell[0] * cell[2] * sabg[1] / volume;
abcs[2] = cell[0] * cell[1] * sabg[2] / volume;
sabgs1 = Math.sqrt (1.0 - astex.model.Symmetry.SQ (cabgs[0]));
cartesianToFractional.x00 = 1.0 / cell[0];
cartesianToFractional.x10 = -cabg[2] / (sabg[2] * cell[0]);
cartesianToFractional.x20 = -(cabg[2] * sabg[1] * cabgs[0] + cabg[1] * sabg[2]) / (sabg[1] * sabgs1 * sabg[2] * cell[0]);
cartesianToFractional.x11 = 1.0 / (sabg[2] * cell[1]);
cartesianToFractional.x21 = cabgs[0] / (sabgs1 * sabg[2] * cell[1]);
cartesianToFractional.x22 = 1.0 / (sabg[1] * sabgs1 * cell[2]);
fractionalToCartesian.x00 = cell[0];
fractionalToCartesian.x10 = cabg[2] * cell[1];
fractionalToCartesian.x20 = cabg[1] * cell[2];
fractionalToCartesian.x11 = sabg[2] * cell[1];
fractionalToCartesian.x21 = -sabg[1] * cabgs[0] * cell[2];
fractionalToCartesian.x22 = sabg[1] * sabgs1 * cell[2];
}, "~A,astex.util.Matrix,astex.util.Matrix");
c$.transformPoint2 = Clazz.defineMethod (c$, "transformPoint2", 
function (p, m) {
var xx = p.x;
var yy = p.y;
var zz = p.z;
p.x = xx * m.x00 + yy * m.x01 + zz * m.x02 + m.x03;
p.y = xx * m.x10 + yy * m.x11 + zz * m.x12 + m.x13;
p.z = xx * m.x20 + yy * m.x21 + zz * m.x22 + m.x23;
}, "astex.util.Point3d,astex.util.Matrix");
Clazz.defineMethod (c$, "cnxSpaceGroupNameToNumber", 
function (cnxName) {
var cnxCount = astex.model.Symmetry.cnxSpaceGroups.length;
for (var i = 0; i < cnxCount; i++) {
if (astex.model.Symmetry.cnxSpaceGroups[i].equals (cnxName)) {
return i;
}}
System.out.println ("cnxSpaceGroupNameToNumber: " + "couldn't match CNX space group  " + cnxName);
return 1;
}, "~S");
Clazz.defineMethod (c$, "getGridOrigin", 
function (gridOrigin) {
gridOrigin.set (0.0, 0.0, 0.0);
}, "astex.util.Point3d");
Clazz.defineMethod (c$, "setCurrentTransformForMap", 
function (cartesianToFractional2, fractionalToCartesian2, operator, moleculeCenter, cpyCenter, gridOrigin, currentTransform) {
return operator;
}, "astex.util.Matrix,astex.util.Matrix,astex.util.Matrix,astex.util.Point3d,astex.util.Point3d,astex.util.Point3d,astex.util.Matrix");
Clazz.defineStatics (c$,
"symmetryLibrary", "symmetry.properties",
"positiveAxes", ["X", "Y", "Z"],
"fractions", ["1/2", "1/3", "2/3", "1/4", "3/4", "1/6", "5/6"],
"fractionValues", [0.5, 0.3333333333333333, 0.6666666666666666, 0.25, 0.75, 0.16666666666666666, 0.8333333333333334],
"cnxSpaceGroups", ["", "P1", "P-1", "P2", "P2(1)", "C2", "PM", "PC", "CM", "CC", "P2/M", "P2(1)/M", "C2/M", "P2/C", "P2(1)/C", "C2/C", "P222", "P222(1)", "P2(1)2(1)2", "P2(1)2(1)2(1)", "C222(1)", "C222", "F222", "I222", "I2(1)2(1)2(1)", "PMM2", "PMC2(1)", "PCC2", "PMA2", "PCA2(1)", "PNC2", "PMN2(1)", "PBA2", "PNA2(1)", "PNN2", "CMM2", "CMC2(1)", "CCC2", "AMM2", "ABM2", "AMA2", "ABA2", "FMM2", "FDD2", "IMM2", "IBA2", "IMA2", "PMMM", "PNNN", "PCCM", "PBAN", "PMMA", "PNNA", "PMNA", "PCCA", "PBAM", "PCCN", "PBCM", "PNNM", "PMMN", "PBCN", "PBCA", "PNMA", "CMCM", "CMCA", "CMMM", "CCCM", "CMMA", "CCCA", "FMMM", "FDDD", "IMMM", "IBAM", "IBCA", "IMMA", "P4", "P4(1)", "P4(2)", "P4(3)", "I4", "I4(1)", "P-4", "I-4", "P4/M", "P4(2)/M", "P4/N", "P4(2)/N", "I4/M", "I4(1)/A", "P422", "P42(1)2", "P4(1)22", "P4(1)2(1)2", "P4(2)22", "P4(2)2(1)2", "P4(3)22", "P4(3)2(1)2", "I422", "I4(1)22", "P4MM", "P4BM", "P4(2)CM", "P4(2)NM", "P4CC", "P4NC", "P4(2)MC", "P4(2)BC", "I4MM", "I4CM", "I4(1)MD", "I4(1)CD", "P-42M", "P-42C", "P-42(1)M", "P-42(1)C", "P-4M2", "P-4C2", "P-4B2", "P-4N2", "I-4M2", "I-4C2", "I-42M", "I-42D", "P4/MMM", "P4/MCC", "P4/NBM", "P4/NNC", "P4/MBM", "P4/MNC", "P4/NMM", "P4/NCC", "P4(2)/MMC", "P4(2)/MCM", "P4(2)/NBC", "P4(2)/NNM", "P4(2)/MBC", "P4(2)/MNM", "P4(2)/NMC", "P4(2)/NCM", "I4/MMM", "I4/MCM", "I4(1)/AMD", "I4(1)/ACD", "P3", "P3(1)", "P3(2)", "R3", "P-3", "R-3", "P312", "P321", "P3(1)12", "P3(1)21", "P3(2)12", "P3(2)21", "R32", "P3M1", "P31M", "P3C1", "P31C", "R3M", "R3C", "P-31M", "P-31C", "P-3M1", "P-3C1", "R-3M", "R-3C", "P6", "P6(1)", "P6(5)", "P6(2)", "P6(4)", "P6(3)", "P-6", "P6/M", "P6(3)/M", "P622", "P6(1)22", "P6(5)22", "P6(2)22", "P6(4)22", "P6(3)22", "P6MM", "P6CC", "P6(3)CM", "P6(3)MC", "P-6M2", "P-6C2", "P-62M", "P-62C", "P6/MMM", "P6/MCC", "P6(3)/MCM", "P6(3)/MMC", "P23", "F23", "I23", "P2(1)3", "I2(1)3", "PM-3", "PN-3", "FM-3", "FD-3", "IM-3", "PA-3", "IA-3", "P432", "P4(2)32", "F432", "F4(1)32", "I432", "P4(3)32", "P4(1)32", "I4(1)32", "P-43M", "F-43M", "I-43M", "P-43N", "F-43C", "I-43D", "PM-3M", "PN-3N", "PM-3N", "PN-3M", "FM-3M", "FM-3C", "FD-3M", "FD-3C", "IM-3M", "IA-3D"]);
});
