Clazz.declarePackage ("astex.calc");
Clazz.load (["astex.api.AstexFit", "astex.util.Matrix"], "astex.calc.Fit", ["astex.io.FILE", "$.MoleculeReader", "astex.util.DoubleArray", "$.Log", "$.Util"], function () {
c$ = Clazz.declareType (astex.calc, "Fit", null, astex.api.AstexFit);
Clazz.makeConstructor (c$, 
function () {
});
Clazz.overrideMethod (c$, "fit", 
function (x, y, z, xprime, yprime, zprime, n, trans) {
if (n == 0) {
astex.util.Log.error ("no coordinates");
return 9999.9;
}trans.setIdentity ();
var xpc = 0.0;
var ypc = 0.0;
var zpc = 0.0;
var xc = 0.0;
var yc = 0.0;
var zc = 0.0;
for (var i = 0; i < n; i++) {
xpc += xprime[i];
ypc += yprime[i];
zpc += zprime[i];
xc += x[i];
yc += y[i];
zc += z[i];
}
xpc /= n;
ypc /= n;
zpc /= n;
xc /= n;
yc /= n;
zc /= n;
trans.translate (-xpc, -ypc, -zpc);
for (var i = 1; i <= 4; i++) {
for (var j = 1; j <= 4; j++) {
astex.calc.Fit.m[i][j] = 0.0;
}
}
for (var i = 0; i < n; i++) {
var xm = (xprime[i] - xpc) - (x[i] - xc);
var ym = (yprime[i] - ypc) - (y[i] - yc);
var zm = (zprime[i] - zpc) - (z[i] - zc);
var xp = (xprime[i] - xpc) + (x[i] - xc);
var yp = (yprime[i] - ypc) + (y[i] - yc);
var zp = (zprime[i] - zpc) + (z[i] - zc);
astex.calc.Fit.m[1][1] += (xm * xm + ym * ym + zm * zm);
astex.calc.Fit.m[1][2] += (yp * zm - ym * zp);
astex.calc.Fit.m[1][3] += (xm * zp - xp * zm);
astex.calc.Fit.m[1][4] += (xp * ym - xm * yp);
astex.calc.Fit.m[2][2] += (yp * yp + zp * zp + xm * xm);
astex.calc.Fit.m[2][3] += (xm * ym - xp * yp);
astex.calc.Fit.m[2][4] += (xm * zm - xp * zp);
astex.calc.Fit.m[3][3] += (xp * xp + zp * zp + ym * ym);
astex.calc.Fit.m[3][4] += (ym * zm - yp * zp);
astex.calc.Fit.m[4][4] += (xp * xp + yp * yp + zm * zm);
}
for (var i = 1; i <= 4; i++) {
for (var j = i + 1; j <= 4; j++) {
astex.calc.Fit.m[j][i] = astex.calc.Fit.m[i][j];
}
}
if (astex.calc.Fit.debug) {
for (var i = 1; i <= 4; i++) {
for (var j = 1; j <= 4; j++) {
astex.io.FILE.out.printFD ("%10.3f", astex.calc.Fit.m[i][j]);
}
astex.io.FILE.out.printS ("\n");
}
}astex.calc.Fit.tred2 (astex.calc.Fit.m, 4, astex.calc.Fit.d, astex.calc.Fit.e);
astex.calc.Fit.tqli (astex.calc.Fit.d, astex.calc.Fit.e, 4, astex.calc.Fit.m);
if (astex.calc.Fit.debug) {
for (var i = 1; i <= 4; i++) {
astex.io.FILE.out.printFI ("d[%d] = ", i);
astex.io.FILE.out.printFD ("%10.3f\n", astex.calc.Fit.d[i]);
}
astex.io.FILE.out.printS ("quaternion matrix\n");
for (var i = 1; i <= 4; i++) {
for (var j = 1; j <= 4; j++) {
astex.io.FILE.out.printFD ("%10.3f", astex.calc.Fit.m[i][j]);
}
astex.io.FILE.out.printS ("\n");
}
}var emin = 1;
for (var i = 2; i <= 4; i++) {
if (astex.calc.Fit.d[i] < astex.calc.Fit.d[emin]) {
emin = i;
}}
if (astex.calc.Fit.debug) {
astex.io.FILE.out.printFI ("minimum eigen value %d\n", emin);
}var nq = 0.0;
for (var j = 1; j <= 4; j++) {
nq += astex.calc.Fit.m[j][emin] * astex.calc.Fit.m[j][emin];
}
nq = Math.sqrt (nq);
if (astex.calc.Fit.debug) {
astex.io.FILE.out.printS ("quaternion transform\n");
for (var j = 1; j <= 4; j++) {
astex.io.FILE.out.printFD ("%10.3f", astex.calc.Fit.m[j][emin]);
}
astex.io.FILE.out.printS ("\n");
astex.io.FILE.out.printFD ("quaternion norm %8.3f\n", nq);
}if (Math.abs (nq - 1.0) > 1.e-5) {
astex.util.Log.warn ("quaternion norm is not 1.0... %8.3f", nq);
}astex.calc.Fit.rotation.fromQuaternion (astex.calc.Fit.m[1][emin], astex.calc.Fit.m[2][emin], astex.calc.Fit.m[3][emin], astex.calc.Fit.m[4][emin]);
trans.transform (astex.calc.Fit.rotation);
if (astex.calc.Fit.debug) trans.print ("rotation matrix");
trans.translate (xc, yc, zc);
if (astex.calc.Fit.debug) trans.print ("rotation/translation matrix");
return (Math.abs (astex.calc.Fit.d[emin]) < 1.e-5 ? 0 : Math.sqrt (Math.abs (astex.calc.Fit.d[emin]) / n));
}, "~A,~A,~A,~A,~A,~A,~N,astex.util.Matrix");
c$.tred2 = Clazz.defineMethod (c$, "tred2", 
 function (a, n, d, e) {
var l;
var k;
var j;
var i;
var scale;
var hh;
var h;
var g;
var f;
for (i = n; i >= 2; i--) {
l = i - 1;
h = scale = 0.0;
if (l > 1) {
for (k = 1; k <= l; k++) {
scale += Math.abs (a[i][k]);
}
if (scale == 0.0) {
e[i] = a[i][l];
} else {
for (k = 1; k <= l; k++) {
a[i][k] /= scale;
h += a[i][k] * a[i][k];
}
f = a[i][l];
g = (f >= 0.0 ? -Math.sqrt (h) : Math.sqrt (h));
e[i] = scale * g;
h -= f * g;
a[i][l] = f - g;
f = 0.0;
for (j = 1; j <= l; j++) {
a[j][i] = a[i][j] / h;
g = 0.0;
for (k = 1; k <= j; k++) g += a[j][k] * a[i][k];

for (k = j + 1; k <= l; k++) g += a[k][j] * a[i][k];

e[j] = g / h;
f += e[j] * a[i][j];
}
hh = f / (h + h);
for (j = 1; j <= l; j++) {
f = a[i][j];
e[j] = g = e[j] - hh * f;
for (k = 1; k <= j; k++) a[j][k] -= (f * e[k] + g * a[i][k]);

}
}} else e[i] = a[i][l];
d[i] = h;
}
d[1] = 0.0;
e[1] = 0.0;
for (i = 1; i <= n; i++) {
l = i - 1;
if (d[i] != 0.0) {
for (j = 1; j <= l; j++) {
g = 0.0;
for (k = 1; k <= l; k++) g += a[i][k] * a[k][j];

for (k = 1; k <= l; k++) a[k][j] -= g * a[k][i];

}
}d[i] = a[i][i];
a[i][i] = 1.0;
for (j = 1; j <= l; j++) a[j][i] = a[i][j] = 0.0;

}
}, "~A,~N,~A,~A");
c$.SQR = Clazz.defineMethod (c$, "SQR", 
 function (a) {
return a * a;
}, "~N");
c$.SIGN = Clazz.defineMethod (c$, "SIGN", 
 function (a, b) {
var absa = (a < 0.0 ? -a : a);
return (b >= 0.0 ? absa : -absa);
}, "~N,~N");
c$.pythag = Clazz.defineMethod (c$, "pythag", 
 function (a, b) {
var absa;
var absb;
absa = (a < 0.0 ? -a : a);
absb = (b < 0.0 ? -b : b);
if (absa > absb) return absa * Math.sqrt (1.0 + astex.calc.Fit.SQR (absb / absa));
return (absb == 0.0 ? 0.0 : absb * Math.sqrt (1.0 + astex.calc.Fit.SQR (absa / absb)));
}, "~N,~N");
c$.tqli = Clazz.defineMethod (c$, "tqli", 
 function (d, e, n, z) {
var m;
var l;
var iter;
var i;
var k;
var s;
var r;
var p;
var g;
var f;
var dd;
var c;
var b;
for (i = 2; i <= n; i++) e[i - 1] = e[i];

e[n] = 0.0;
for (l = 1; l <= n; l++) {
iter = 0;
do {
for (m = l; m <= n - 1; m++) {
dd = Math.abs (d[m]) + Math.abs (d[m + 1]);
if ((Math.abs (e[m]) + dd) == dd) break;
}
if (m != l) {
if (iter++ == 30) {
System.out.println ("Too many iterations in tqli");
return;
}g = (d[l + 1] - d[l]) / (2.0 * e[l]);
r = astex.calc.Fit.pythag (g, 1.0);
g = d[m] - d[l] + e[l] / (g + astex.calc.Fit.SIGN (r, g));
s = c = 1.0;
p = 0.0;
for (i = m - 1; i >= l; i--) {
f = s * e[i];
b = c * e[i];
e[i + 1] = (r = astex.calc.Fit.pythag (f, g));
if (r == 0.0) {
d[i + 1] -= p;
e[m] = 0.0;
break;
}s = f / r;
c = g / r;
g = d[i + 1] - p;
r = (d[i] - g) * s + 2.0 * c * b;
d[i + 1] = g + (p = s * r);
g = c * r - b;
for (k = 1; k <= n; k++) {
f = z[k][i + 1];
z[k][i + 1] = s * z[k][i] + c * f;
z[k][i] = c * z[k][i] - s * f;
}
}
if (r == 0.0 && i >= l) continue;
d[l] -= p;
e[l] = g;
e[m] = 0.0;
}} while (m != l);
}
}, "~A,~A,~N,~A");
Clazz.defineStatics (c$,
"m",  Clazz.newDoubleArray (5, 5, 0),
"d",  Clazz.newDoubleArray (5, 0),
"e",  Clazz.newDoubleArray (5, 0));
c$.rotation = c$.prototype.rotation =  new astex.util.Matrix ();
Clazz.defineStatics (c$,
"debug", false);
});
