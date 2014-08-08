Clazz.declarePackage ("astex.util");
c$ = Clazz.decorateAsClass (function () {
this.symbol = null;
this.symbolLen = 0;
this.atomicNumber = 0;
this.mass = 0;
this.valences = null;
this.drow = 0;
this.dcol = 0;
Clazz.instantialize (this, arguments);
}, astex.util, "AtomicElement");
Clazz.makeConstructor (c$, 
function (an, s, m, vv1, vv2, vv3, vv4, ddrow, ddcol) {
this.atomicNumber = an;
this.symbol = s;
this.mass = m;
this.valences =  Clazz.newIntArray (4, 0);
this.valences[0] = vv1;
this.valences[1] = vv2;
this.valences[2] = vv3;
this.valences[3] = vv4;
this.drow = ddrow;
this.dcol = ddcol;
}, "~N,~S,~N,~N,~N,~N,~N,~N,~N");
Clazz.defineStatics (c$,
"MAX_VALENCE_STATES", 4);
