Clazz.declarePackage ("astex.util");
Clazz.load (["astex.util.AtomicElement"], "astex.util.PeriodicTable", ["java.lang.Character"], function () {
c$ = Clazz.declareType (astex.util, "PeriodicTable");
c$.getElementFromSymbol = Clazz.defineMethod (c$, "getElementFromSymbol", 
function (symbol) {
if (symbol.length == 1) {
var c1 = symbol.charAt (0);
switch (c1) {
case 'C':
return 6;
case 'N':
return 7;
case 'O':
return 8;
case 'P':
return 15;
case 'S':
return 16;
case 'H':
return 1;
}
}for (var pass = 0; pass < 2; pass++) {
for (var i = 1; i < astex.util.PeriodicTable.elements.length; i++) {
if (astex.util.PeriodicTable.elements[i].symbol.equals (symbol)) {
return astex.util.PeriodicTable.elements[i].atomicNumber;
}}
if (symbol.startsWith ("A")) {
symbol = " " + symbol.substring (1);
}}
return 0;
}, "~S");
c$.getElementFromSymbol = Clazz.defineMethod (c$, "getElementFromSymbol", 
function (e0, e1) {
if (e0 == ' ') {
switch (e1) {
case 'C':
return 6;
case 'N':
return 7;
case 'O':
return 8;
case 'P':
return 15;
case 'S':
return 16;
case 'H':
return 1;
}
}var symbol = null;
var buf = null;
if (e0 == ' ') {
buf =  Clazz.newCharArray (1, '\0');
buf[0] = e1;
} else {
buf =  Clazz.newCharArray (2, '\0');
buf[0] = e0;
buf[1] = Character.toLowerCase (e1);
}symbol =  String.instantialize (buf);
return astex.util.PeriodicTable.getElementFromSymbol (symbol);
}, "~S,~S");
c$.getAtomSymbolFromElement = Clazz.defineMethod (c$, "getAtomSymbolFromElement", 
function (num) {
var sym = null;
switch (num) {
case 0:
sym = "?";
break;
default:
if (num > 0 && num < astex.util.PeriodicTable.elements.length) {
sym = astex.util.PeriodicTable.elements[num].symbol;
} else {
sym = "";
}break;
}
return sym;
}, "~N");
c$.getElement = Clazz.defineMethod (c$, "getElement", 
function (c0, c1) {
switch (c0) {
case 'A':
switch (c1) {
case 'c':
return 89;
case 'g':
return 47;
case 'l':
return 13;
case 'm':
return 95;
case 'r':
return 18;
case 's':
return 33;
case 't':
return 85;
case 'u':
return 79;
default:
return 0;
}
case 'B':
switch (c1) {
case ' ':
case 0:
return 5;
case 'a':
return 56;
case 'e':
return 4;
case 'i':
return 83;
case 'k':
return 97;
case 'r':
return 35;
default:
return 0;
}
case 'C':
switch (c1) {
case ' ':
case 0:
return 6;
case 'a':
return 20;
case 'd':
return 48;
case 'e':
return 58;
case 'f':
return 98;
case 'l':
return 17;
case 'm':
return 96;
case 'o':
return 27;
case 'r':
return 24;
case 's':
return 55;
case 'u':
return 29;
default:
return 0;
}
case 'D':
switch (c1) {
case 'y':
return 66;
default:
return 0;
}
case 'E':
switch (c1) {
case 'r':
return 68;
case 's':
return 99;
case 'u':
return 63;
default:
return 0;
}
case 'F':
switch (c1) {
case ' ':
case 0:
return 9;
case 'e':
return 26;
case 'm':
return 100;
case 'r':
return 87;
default:
return 0;
}
case 'G':
switch (c1) {
case 'a':
return 31;
case 'd':
return 64;
case 'e':
return 32;
default:
return 0;
}
case 'H':
switch (c1) {
case ' ':
case 0:
return 1;
case 'e':
return 2;
case 'f':
return 72;
case 'g':
return 80;
case 'o':
return 67;
default:
return 0;
}
case 'I':
switch (c1) {
case ' ':
case 0:
return 53;
case 'n':
return 49;
case 'r':
return 77;
default:
return 0;
}
case 'K':
switch (c1) {
case ' ':
case 0:
return 19;
case 'r':
return 36;
default:
return 0;
}
case 'L':
switch (c1) {
case 'a':
return 57;
case 'i':
return 3;
case 'r':
return 103;
case 'u':
return 71;
default:
return 0;
}
case 'M':
switch (c1) {
case 'd':
return 101;
case 'g':
return 12;
case 'n':
return 25;
case 'o':
return 42;
default:
return 0;
}
case 'N':
switch (c1) {
case ' ':
case 0:
return 7;
case 'a':
return 11;
case 'b':
return 41;
case 'd':
return 60;
case 'e':
return 10;
case 'i':
return 28;
case 'o':
return 102;
case 'p':
return 93;
default:
return 0;
}
case 'O':
switch (c1) {
case ' ':
case 0:
return 8;
case 's':
return 76;
default:
return 0;
}
case 'P':
switch (c1) {
case ' ':
case 0:
return 15;
case 'a':
return 91;
case 'b':
return 82;
case 'd':
return 46;
case 'm':
return 61;
case 'o':
return 84;
case 'r':
return 59;
case 't':
return 78;
case 'u':
return 94;
default:
return 0;
}
case 'R':
switch (c1) {
case 'a':
return 88;
case 'b':
return 37;
case 'e':
return 75;
case 'h':
return 45;
case 'n':
return 86;
case 'u':
return 44;
default:
return 0;
}
case 'S':
switch (c1) {
case ' ':
case 0:
return 16;
case 'b':
return 51;
case 'c':
return 21;
case 'e':
return 34;
case 'i':
return 14;
case 'm':
return 62;
case 'n':
return 50;
case 'r':
return 38;
default:
return 0;
}
case 'T':
switch (c1) {
case 'a':
return 73;
case 'b':
return 65;
case 'c':
return 43;
case 'e':
return 52;
case 'h':
return 90;
case 'i':
return 22;
case 'l':
return 81;
case 'm':
return 69;
default:
return 0;
}
case 'U':
switch (c1) {
case ' ':
case 0:
return 92;
default:
return 0;
}
case 'V':
switch (c1) {
case ' ':
case 0:
return 23;
default:
return 0;
}
case 'W':
switch (c1) {
case ' ':
case 0:
return 74;
default:
return 0;
}
case 'X':
switch (c1) {
case 'e':
return 54;
default:
return 0;
}
case 'Y':
switch (c1) {
case ' ':
case 0:
return 39;
case 'b':
return 70;
default:
return 0;
}
case 'Z':
switch (c1) {
case 'n':
return 30;
case 'r':
return 40;
default:
return 0;
}
}
return 0;
}, "~S,~S");
c$.getSymbol = Clazz.defineMethod (c$, "getSymbol", 
function (el) {
return astex.util.PeriodicTable.symbols[el];
}, "~N");
c$.elements = c$.prototype.elements = [ new astex.util.AtomicElement (0, "h+", 0.00000, 15, 0, 0, 0, 0, 0),  new astex.util.AtomicElement (1, "H", 1.00797, 1, 0, 0, 0, 8, 0),  new astex.util.AtomicElement (2, "He", 4.00260, 15, 0, 0, 0, 8, 17),  new astex.util.AtomicElement (3, "Li", 6.93900, 1, 0, 0, 0, 7, 0),  new astex.util.AtomicElement (4, "Be", 9.01220, 2, 0, 0, 0, 7, 1),  new astex.util.AtomicElement (5, "B", 10.81100, 3, 0, 0, 0, 7, 12),  new astex.util.AtomicElement (6, "C", 12.01115, 4, 0, 0, 0, 7, 13),  new astex.util.AtomicElement (7, "N", 14.00670, 3, 5, 0, 0, 7, 14),  new astex.util.AtomicElement (8, "O", 15.99940, 2, 0, 0, 0, 7, 15),  new astex.util.AtomicElement (9, "F", 18.99840, 1, 0, 0, 0, 7, 16),  new astex.util.AtomicElement (10, "Ne", 20.18300, 15, 0, 0, 0, 7, 17),  new astex.util.AtomicElement (11, "Na", 22.98980, 1, 0, 0, 0, 6, 0),  new astex.util.AtomicElement (12, "Mg", 24.31200, 2, 0, 0, 0, 6, 1),  new astex.util.AtomicElement (13, "Al", 26.98150, 3, 0, 0, 0, 6, 12),  new astex.util.AtomicElement (14, "Si", 28.08600, 4, 0, 0, 0, 6, 13),  new astex.util.AtomicElement (15, "P", 30.97380, 3, 5, 0, 0, 6, 14),  new astex.util.AtomicElement (16, "S", 32.06400, 2, 4, 6, 0, 6, 15),  new astex.util.AtomicElement (17, "Cl", 35.45300, 1, 3, 5, 7, 6, 16),  new astex.util.AtomicElement (18, "Ar", 39.94800, 15, 0, 0, 0, 6, 17),  new astex.util.AtomicElement (19, "K", 39.10200, 1, 0, 0, 0, 5, 0),  new astex.util.AtomicElement (20, "Ca", 40.08000, 2, 0, 0, 0, 5, 1),  new astex.util.AtomicElement (21, "Sc", 44.95600, 3, 0, 0, 0, 5, 2),  new astex.util.AtomicElement (22, "Ti", 47.90000, 3, 4, 0, 0, 5, 3),  new astex.util.AtomicElement (23, "V", 50.94200, 2, 3, 4, 5, 5, 4),  new astex.util.AtomicElement (24, "Cr", 51.99600, 2, 3, 6, 0, 5, 5),  new astex.util.AtomicElement (25, "Mn", 54.93800, 2, 3, 4, 6, 5, 6),  new astex.util.AtomicElement (26, "Fe", 55.84700, 2, 3, 4, 6, 5, 7),  new astex.util.AtomicElement (27, "Co", 58.93320, 2, 3, 0, 0, 5, 8),  new astex.util.AtomicElement (28, "Ni", 58.71000, 2, 3, 0, 0, 5, 9),  new astex.util.AtomicElement (29, "Cu", 63.54600, 1, 2, 0, 0, 5, 10),  new astex.util.AtomicElement (30, "Zn", 65.37000, 2, 0, 0, 0, 5, 11),  new astex.util.AtomicElement (31, "Ga", 69.72000, 3, 0, 0, 0, 5, 12),  new astex.util.AtomicElement (32, "Ge", 72.59000, 2, 4, 0, 0, 5, 13),  new astex.util.AtomicElement (33, "As", 74.92160, 3, 5, 0, 0, 5, 14),  new astex.util.AtomicElement (34, "Se", 78.96000, 2, 4, 6, 0, 5, 15),  new astex.util.AtomicElement (35, "Br", 79.90400, 1, 3, 5, 7, 5, 16),  new astex.util.AtomicElement (36, "Kr", 83.80000, 15, 0, 0, 0, 5, 17),  new astex.util.AtomicElement (37, "Rb", 85.47000, 1, 0, 0, 0, 4, 0),  new astex.util.AtomicElement (38, "Sr", 87.62000, 2, 0, 0, 0, 4, 1),  new astex.util.AtomicElement (39, "Y", 88.90500, 3, 0, 0, 0, 4, 2),  new astex.util.AtomicElement (40, "Zr", 91.22000, 4, 0, 0, 0, 4, 3),  new astex.util.AtomicElement (41, "Nb", 92.90600, 3, 5, 0, 0, 4, 4),  new astex.util.AtomicElement (42, "Mo", 95.94000, 3, 4, 5, 6, 4, 5),  new astex.util.AtomicElement (43, "Tc", 98.90620, 7, 0, 0, 0, 4, 6),  new astex.util.AtomicElement (44, "Ru", 101.07000, 2, 3, 4, 6, 4, 7),  new astex.util.AtomicElement (45, "Rh", 102.90500, 2, 3, 4, 0, 4, 8),  new astex.util.AtomicElement (46, "Pd", 106.40000, 2, 4, 0, 0, 4, 9),  new astex.util.AtomicElement (47, "Ag", 107.86800, 1, 0, 0, 0, 4, 10),  new astex.util.AtomicElement (48, "Cd", 112.40000, 2, 0, 0, 0, 4, 11),  new astex.util.AtomicElement (49, "In", 114.82000, 3, 0, 0, 0, 4, 12),  new astex.util.AtomicElement (50, "Sn", 118.69000, 2, 4, 0, 0, 4, 13),  new astex.util.AtomicElement (51, "Sb", 121.75000, 3, 5, 0, 0, 4, 14),  new astex.util.AtomicElement (52, "Te", 127.60000, 2, 4, 6, 0, 4, 15),  new astex.util.AtomicElement (53, "I", 126.90440, 1, 3, 5, 7, 4, 16),  new astex.util.AtomicElement (54, "Xe", 131.30000, 15, 0, 0, 0, 4, 17),  new astex.util.AtomicElement (55, "Cs", 132.90500, 1, 0, 0, 0, 3, 0),  new astex.util.AtomicElement (56, "Ba", 137.33000, 2, 0, 0, 0, 3, 1),  new astex.util.AtomicElement (57, "La", 138.91000, 3, 0, 0, 0, 1, 2),  new astex.util.AtomicElement (58, "Ce", 140.12000, 3, 4, 0, 0, 1, 3),  new astex.util.AtomicElement (59, "Pr", 140.90700, 3, 4, 0, 0, 1, 4),  new astex.util.AtomicElement (60, "Nd", 144.24000, 3, 0, 0, 0, 1, 5),  new astex.util.AtomicElement (61, "Pm", 145.00000, 3, 0, 0, 0, 1, 6),  new astex.util.AtomicElement (62, "Sm", 150.35000, 2, 3, 0, 0, 1, 7),  new astex.util.AtomicElement (63, "Eu", 151.96000, 2, 3, 0, 0, 1, 8),  new astex.util.AtomicElement (64, "Gd", 157.25000, 3, 0, 0, 0, 1, 9),  new astex.util.AtomicElement (65, "Tb", 158.92400, 3, 4, 0, 0, 1, 10),  new astex.util.AtomicElement (66, "Dy", 162.50000, 3, 0, 0, 0, 1, 11),  new astex.util.AtomicElement (67, "Ho", 164.93000, 3, 0, 0, 0, 1, 12),  new astex.util.AtomicElement (68, "Er", 167.26000, 3, 0, 0, 0, 1, 13),  new astex.util.AtomicElement (69, "Tm", 168.93400, 2, 3, 0, 0, 1, 14),  new astex.util.AtomicElement (70, "Yb", 173.04000, 2, 3, 0, 0, 1, 15),  new astex.util.AtomicElement (71, "Lu", 174.97000, 3, 0, 0, 0, 1, 16),  new astex.util.AtomicElement (72, "Hf", 178.49000, 4, 0, 0, 0, 3, 3),  new astex.util.AtomicElement (73, "Ta", 180.94800, 5, 0, 0, 0, 3, 4),  new astex.util.AtomicElement (74, "W", 183.85000, 3, 4, 5, 6, 3, 5),  new astex.util.AtomicElement (75, "Re", 186.20000, 2, 4, 6, 7, 3, 6),  new astex.util.AtomicElement (76, "Os", 190.20000, 2, 3, 4, 6, 3, 7),  new astex.util.AtomicElement (77, "Ir", 192.20000, 2, 3, 4, 6, 3, 8),  new astex.util.AtomicElement (78, "Pt", 195.09000, 2, 4, 0, 0, 3, 9),  new astex.util.AtomicElement (79, "Au", 196.96700, 1, 3, 0, 0, 3, 10),  new astex.util.AtomicElement (80, "Hg", 200.59000, 1, 2, 0, 0, 3, 11),  new astex.util.AtomicElement (81, "Tl", 204.37000, 1, 3, 0, 0, 3, 12),  new astex.util.AtomicElement (82, "Pb", 207.19000, 2, 4, 0, 0, 3, 13),  new astex.util.AtomicElement (83, "Bi", 208.98000, 3, 5, 0, 0, 3, 14),  new astex.util.AtomicElement (84, "Po", 209.00000, 2, 4, 0, 0, 3, 15),  new astex.util.AtomicElement (85, "At", 210.00000, 1, 3, 5, 7, 3, 16),  new astex.util.AtomicElement (86, "Rn", 222.00000, 15, 0, 0, 0, 3, 17),  new astex.util.AtomicElement (87, "Fr", 223.00000, 1, 0, 0, 0, 2, 0),  new astex.util.AtomicElement (88, "Ra", 226.03000, 2, 0, 0, 0, 2, 1),  new astex.util.AtomicElement (89, "Ac", 227.00000, 3, 0, 0, 0, 0, 2),  new astex.util.AtomicElement (90, "Th", 232.03800, 3, 4, 0, 0, 0, 3),  new astex.util.AtomicElement (91, "Pa", 231.04000, 3, 4, 5, 0, 0, 4),  new astex.util.AtomicElement (92, "U", 238.03000, 3, 4, 5, 6, 0, 5),  new astex.util.AtomicElement (93, "Np", 237.05000, 3, 4, 5, 6, 0, 6),  new astex.util.AtomicElement (94, "Pu", 244.00000, 3, 4, 5, 6, 0, 7),  new astex.util.AtomicElement (95, "Am", 243.00000, 3, 4, 5, 6, 0, 8),  new astex.util.AtomicElement (96, "Cm", 247.00000, 3, 0, 0, 0, 0, 9),  new astex.util.AtomicElement (97, "Bk", 247.00000, 3, 4, 0, 0, 0, 10),  new astex.util.AtomicElement (98, "Cf", 251.00000, 3, 0, 0, 0, 0, 11),  new astex.util.AtomicElement (99, "Es", 254.00000, 3, 0, 0, 0, 0, 12),  new astex.util.AtomicElement (100, "Fm", 257.00000, 3, 0, 0, 0, 0, 13),  new astex.util.AtomicElement (101, "Md", 258.00000, 3, 0, 0, 0, 0, 14),  new astex.util.AtomicElement (102, "No", 259.00000, 1, 0, 0, 0, 0, 15),  new astex.util.AtomicElement (103, "Lr", 260.00000, 1, 0, 0, 0, 0, 16),  new astex.util.AtomicElement (104, "D", 2.01400, 1, 0, 0, 0, 7, 0),  new astex.util.AtomicElement (105, "T", 3.01605, 1, 0, 0, 0, 7, 1),  new astex.util.AtomicElement (106, "R", 0.00000, 0, 0, 0, 0, 6, 0),  new astex.util.AtomicElement (107, "X", 0.00000, 0, 0, 0, 0, 6, 1),  new astex.util.AtomicElement (108, "Gly", 57.04765, 2, 0, 0, 0, 5, 0),  new astex.util.AtomicElement (109, "Ala", 71.07474, 2, 0, 0, 0, 5, 1),  new astex.util.AtomicElement (110, "Val", 99.12892, 2, 0, 0, 0, 5, 2),  new astex.util.AtomicElement (111, "Leu", 113.15601, 2, 0, 0, 0, 5, 3),  new astex.util.AtomicElement (112, "Ile", 113.15601, 2, 0, 0, 0, 5, 4),  new astex.util.AtomicElement (113, "Ser", 87.07414, 2, 0, 0, 0, 5, 5),  new astex.util.AtomicElement (114, "Thr", 101.10123, 2, 0, 0, 0, 5, 6),  new astex.util.AtomicElement (115, "Asp", 115.08469, 2, 0, 0, 0, 5, 7),  new astex.util.AtomicElement (116, "Asn", 114.09996, 2, 0, 0, 0, 5, 8),  new astex.util.AtomicElement (117, "Glu", 129.11178, 2, 0, 0, 0, 5, 9),  new astex.util.AtomicElement (118, "Gln", 128.12705, 2, 0, 0, 0, 5, 10),  new astex.util.AtomicElement (119, "Lys", 128.17068, 2, 0, 0, 0, 5, 11),  new astex.util.AtomicElement (120, "Hyl", 144.17008, 2, 0, 0, 0, 4, 0),  new astex.util.AtomicElement (121, "His", 137.13753, 2, 0, 0, 0, 4, 1),  new astex.util.AtomicElement (122, "Arg", 156.18408, 2, 0, 0, 0, 4, 2),  new astex.util.AtomicElement (123, "Phe", 147.17352, 2, 0, 0, 0, 4, 3),  new astex.util.AtomicElement (124, "Tyr", 163.17292, 2, 0, 0, 0, 4, 4),  new astex.util.AtomicElement (125, "Trp", 186.21049, 2, 0, 0, 0, 4, 5),  new astex.util.AtomicElement (126, "Thy", 758.85682, 2, 0, 0, 0, 4, 6),  new astex.util.AtomicElement (127, "Cys", 103.13874, 2, 0, 0, 0, 4, 7),  new astex.util.AtomicElement (128, "Cst", 222.28154, 2, 0, 0, 0, 4, 8),  new astex.util.AtomicElement (129, "Met", 131.19292, 2, 0, 0, 0, 4, 9),  new astex.util.AtomicElement (130, "Pro", 97.11298, 2, 0, 0, 0, 4, 10),  new astex.util.AtomicElement (131, "Hyp", 113.11238, 2, 0, 0, 0, 4, 11),  new astex.util.AtomicElement (132, "H+", 1.00797, 15, 0, 0, 0, 8, 0),  new astex.util.AtomicElement (133, "H2", 2.01594, 15, 0, 0, 0, 8, 1)];
Clazz.defineStatics (c$,
"UNKNOWN", 0,
"HYDROGEN", 1,
"HELIUM", 2,
"LITHIUM", 3,
"BERYLLIUM", 4,
"BORON", 5,
"CARBON", 6,
"NITROGEN", 7,
"OXYGEN", 8,
"FLUORINE", 9,
"NEON", 10,
"SODIUM", 11,
"MAGNESIUM", 12,
"ALUMINUM", 13,
"SILICON", 14,
"PHOSPHORUS", 15,
"SULPHUR", 16,
"CHLORINE", 17,
"ARGON", 18,
"POTASSIUM", 19,
"CALCIUM", 20,
"SCANDIUM", 21,
"TITANIUM", 22,
"VANADIUM", 23,
"CHROMIUM", 24,
"MANGANESE", 25,
"IRON", 26,
"COBALT", 27,
"NICKEL", 28,
"COPPER", 29,
"ZINC", 30,
"GALLIUM", 31,
"GERMANIUM", 32,
"ARSENIC", 33,
"SELENIUM", 34,
"BROMINE", 35,
"KRYPTON", 36,
"RUBIDIUM", 37,
"STRONTIUM", 38,
"YTTRIUM", 39,
"ZIRCONIUM", 40,
"NIOBIUM", 41,
"MOLYBDENUM", 42,
"TECHNETIUM", 43,
"RUTHENIUM", 44,
"RHODIUM", 45,
"PALLADIUM", 46,
"SILVER", 47,
"CADMIUM", 48,
"INDIUM", 49,
"TIN", 50,
"ANTIMONY", 51,
"TELLURIUM", 52,
"IODINE", 53,
"XENON", 54,
"CESIUM", 55,
"BARIUM", 56,
"LANTHANUM", 57,
"CERIUM", 58,
"PRASEODYMIUM", 59,
"NEODYMIUM", 60,
"PROMETHIUM", 61,
"SAMARIUM", 62,
"EUROPIUM", 63,
"GADOLINIUM", 64,
"TERBIUM", 65,
"DYSPROSIUM", 66,
"HOLMIUM", 67,
"ERBIUM", 68,
"THULIUM", 69,
"YTTERBIUM", 70,
"LUTETIUM", 71,
"HAFNIUM", 72,
"TANTALUM", 73,
"WOLFRAM", 74,
"RHENIUM", 75,
"OSMIUM", 76,
"IRIDIUM", 77,
"PLATINUM", 78,
"GOLD", 79,
"MERCURY", 80,
"THALLIUM", 81,
"LEAD", 82,
"BISMUTH", 83,
"POLONIUM", 84,
"ASTATINE", 85,
"RADON", 86,
"FRANCIUM", 87,
"RADIUM", 88,
"ACTINIUM", 89,
"THORIUM", 90,
"PROTACTINIUM", 91,
"URANIUM", 92,
"NEPTUNIUM", 93,
"PLUTONIUM", 94,
"AMERICIUM", 95,
"CURIUM", 96,
"BERKELIUM", 97,
"CALIFORNIUM", 98,
"EINSTEINIUM", 99,
"FERMIUM", 100,
"MENDELEVIUM", 101,
"NOBELIUM", 102,
"LAWRENCIUM", 103,
"UNQ", 104,
"UNP", 105,
"valenceSymbols", ["(O)", "(I)", "(II)", "(III)", "(IV)", "(V)", "(VI)", "(VII)", "(VIII)", "(IX)", "(X)", "(XI)", "(XII)", "(XIII)", "(XIV)"],
"radicalSymbols", ["", ":", ".", "^^"],
"attachmentLabels", ["!", "*", "*\"", "?"],
"symbols", ["*", "H", "He", "Li", "Be", "B", "C", "N", "O", "F", "Ne", "Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar", "K", "Ca", "Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn", "Ga", "Ge", "As", "Se", "Br", "Kr", "Rb", "Sr", "Y", "Zr", "Nb", "Mo", "Tc", "Ru", "Rh", "Pd", "Ag", "Cd", "In", "Sn", "Sb", "Te", "I", "Xe", "Cs", "Ba", "La", "Ce", "Pr", "Nd", "Pm", "Sm", "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm", "Yb", "Lu", "Hf", "Ta", "W", "Re", "Os", "Ir", "Pt", "Au", "Hg", "Tl", "Pb", "Bi", "Po", "At", "Rn", "Fr", "Ra", "Ac", "Th", "Pa", "U", "Np", "Pu", "Am", "Cm", "Bk", "Cf", "Es", "Fm", "Md", "No", "Lr"]);
});
