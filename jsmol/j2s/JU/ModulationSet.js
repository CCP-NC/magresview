Clazz.declarePackage ("JU");
Clazz.load (["J.api.JmolModulationSet", "JU.Vibration", "JU.P3"], "JU.ModulationSet", ["java.lang.Float", "java.util.Hashtable", "JU.Lst", "$.Matrix", "$.V3", "JU.Escape", "$.Logger"], function () {
c$ = Clazz.decorateAsClass (function () {
this.vOcc = NaN;
this.htUij = null;
this.vOcc0 = 0;
this.id = null;
this.mods = null;
this.iop = 0;
this.r0 = null;
this.vib = null;
this.mxyz = null;
this.mscale = 1;
this.symmetry = null;
this.gammaE = null;
this.gammaIinv = null;
this.sigma = null;
this.sI = null;
this.tau = null;
this.enabled = false;
this.$scale = 1;
this.qtOffset = null;
this.isQ = false;
this.t = null;
this.modTemp = null;
this.strop = null;
this.isSubsystem = false;
this.tFactor = null;
this.ptTemp = null;
this.v0 = null;
this.axesLengths = null;
Clazz.instantialize (this, arguments);
}, JU, "ModulationSet", JU.Vibration, J.api.JmolModulationSet);
Clazz.prepareFields (c$, function () {
this.qtOffset =  new JU.P3 ();
this.ptTemp =  new JU.P3 ();
});
Clazz.overrideMethod (c$, "getScale", 
function () {
return this.$scale;
});
Clazz.overrideMethod (c$, "isEnabled", 
function () {
return this.enabled;
});
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, JU.ModulationSet, []);
});
Clazz.defineMethod (c$, "setMod", 
function (id, r0, modDim, mods, gammaE, factors, iop, symmetry, v) {
this.r0 = JU.P3.newP (r0);
this.vib = v;
if (v != null) this.mxyz =  new JU.V3 ();
this.modDim = modDim;
this.mods = mods;
this.iop = iop;
this.symmetry = symmetry;
this.strop = symmetry.getSpaceGroupXyz (iop, false);
this.id = id + "_" + symmetry.getSpaceGroupName ();
this.sigma = factors[0];
this.tFactor = factors[1];
this.isSubsystem = (this.tFactor != null);
if (this.isSubsystem) {
this.tFactor = this.tFactor.inverse ();
}this.gammaE = gammaE;
var rsvs = symmetry.getOperationRsVs (iop);
this.gammaIinv = rsvs.getSubmatrix (3, 3, modDim, modDim).inverse ();
this.sI = rsvs.getSubmatrix (3, 3 + modDim, modDim, 1);
this.tau = this.gammaIinv.mul (this.sigma.mul (JU.Matrix.newT (r0, true)).sub (this.sI));
if (JU.Logger.debuggingHigh) JU.Logger.debug ("MODSET create r=" + JU.Escape.eP (r0) + " si=" + JU.Escape.e (this.sI.getArray ()) + " ginv=" + this.gammaIinv.toString ().$replace ('\n', ' '));
this.t =  new JU.Matrix (null, modDim, 1);
return this;
}, "~S,JU.P3,~N,JU.Lst,JU.M3,~A,~N,J.api.SymmetryInterface,JU.Vibration");
Clazz.overrideMethod (c$, "getUnitCell", 
function () {
return (this.isSubsystem ? this.symmetry : null);
});
Clazz.defineMethod (c$, "calculate", 
function (fracT, isQ) {
this.x = this.y = this.z = 0;
if (this.mxyz != null) this.mxyz.set (0, 0, 0);
this.htUij = null;
this.vOcc = NaN;
var a = this.t.getArray ();
for (var i = 0; i < this.modDim; i++) a[i][0] = 0;

if (isQ && this.qtOffset != null) {
var q =  new JU.Matrix (null, 3, 1);
a = q.getArray ();
a[0][0] = this.qtOffset.x;
a[1][0] = this.qtOffset.y;
a[2][0] = this.qtOffset.z;
a = (this.t = this.sigma.mul (q)).getArray ();
}if (fracT != null) {
switch (this.modDim) {
default:
a[2][0] += fracT.z;
case 2:
a[1][0] += fracT.y;
case 1:
a[0][0] += fracT.x;
break;
}
if (this.isSubsystem) this.t = this.tFactor.mul (this.t);
}this.t = this.gammaIinv.mul (this.t).add (this.tau);
var ta = this.t.getArray ();
for (var i = this.mods.size (); --i >= 0; ) this.mods.get (i).apply (this, ta);

this.gammaE.rotate (this);
if (this.mxyz != null) this.gammaE.rotate (this.mxyz);
return this;
}, "JU.T3,~B");
Clazz.defineMethod (c$, "addUTens", 
function (utens, v) {
if (this.htUij == null) this.htUij =  new java.util.Hashtable ();
var f = this.htUij.get (utens);
if (JU.Logger.debuggingHigh) JU.Logger.debug ("MODSET " + this.id + " utens=" + utens + " f=" + f + " v=" + v);
if (f != null) v += f.floatValue ();
this.htUij.put (utens, Float.$valueOf (v));
}, "~S,~N");
Clazz.overrideMethod (c$, "setModTQ", 
function (a, isOn, qtOffset, isQ, scale) {
if (this.enabled) this.addTo (a, NaN);
this.enabled = false;
this.$scale = scale;
if (qtOffset != null) {
this.qtOffset.setT (qtOffset);
this.isQ = isQ;
if (isQ) qtOffset = null;
this.calculate (qtOffset, isQ);
}if (isOn) {
this.addTo (a, 1);
this.enabled = true;
}}, "JU.T3,~B,JU.T3,~B,~N");
Clazz.overrideMethod (c$, "addTo", 
function (a, scale) {
var isReset = (Float.isNaN (scale));
if (isReset) scale = -1;
this.ptTemp.setT (this);
this.ptTemp.scale (this.$scale * scale);
this.symmetry.toCartesian (this.ptTemp, true);
a.add (this.ptTemp);
if (this.mxyz == null) return;
this.vib.setT (this.v0);
if (isReset) return;
this.ptTemp.setT (this.mxyz);
this.ptTemp.scale (this.$scale * scale);
this.symmetry.toCartesian (this.ptTemp, true);
this.ptTemp.scale (this.mscale);
this.vib.add (this.ptTemp);
}, "JU.T3,~N");
Clazz.overrideMethod (c$, "getState", 
function () {
var s = "";
if (this.qtOffset != null && this.qtOffset.length () > 0) s += "; modulation " + JU.Escape.eP (this.qtOffset) + " " + this.isQ + ";\n";
s += "modulation {selected} " + (this.enabled ? "ON" : "OFF");
return s;
});
Clazz.overrideMethod (c$, "getModPoint", 
function (asEnabled) {
return (asEnabled ? this : this.r0);
}, "~B");
Clazz.overrideMethod (c$, "getModulation", 
function (type, t456) {
this.getModTemp ();
if (type.equals ("D")) {
return JU.P3.newP (t456 == null ? this.r0 : this.modTemp.calculate (t456, false));
}if (type.equals ("M")) {
return JU.P3.newP (t456 == null ? this.v0 : this.modTemp.calculate (t456, false).mxyz);
}if (type.equals ("T")) {
this.modTemp.calculate (t456, false);
var ta = this.modTemp.t.getArray ();
return JU.P3.new3 (ta[0][0], (this.modDim > 1 ? ta[1][0] : 0), (this.modDim > 1 ? ta[2][0] : 0));
}return null;
}, "~S,JU.T3");
Clazz.overrideMethod (c$, "setTempPoint", 
function (a, t456, vibScale, scale) {
if (!this.enabled) return;
this.getModTemp ();
this.addTo (a, NaN);
this.modTemp.calculate (t456, false).addTo (a, scale);
}, "JU.T3,JU.T3,~N,~N");
Clazz.defineMethod (c$, "getModTemp", 
 function () {
if (this.modTemp == null) {
this.modTemp =  new JU.ModulationSet ();
this.modTemp.id = this.id;
this.modTemp.tau = this.tau;
this.modTemp.mods = this.mods;
this.modTemp.gammaE = this.gammaE;
this.modTemp.modDim = this.modDim;
this.modTemp.gammaIinv = this.gammaIinv;
this.modTemp.sigma = this.sigma;
this.modTemp.r0 = this.r0;
this.modTemp.v0 = this.v0;
this.modTemp.vib = this.vib;
this.modTemp.symmetry = this.symmetry;
this.modTemp.t = this.t;
if (this.mxyz != null) {
this.modTemp.mxyz =  new JU.V3 ();
}}this.modTemp.mscale = this.mscale;
});
Clazz.overrideMethod (c$, "getInfo", 
function (info) {
var modInfo =  new java.util.Hashtable ();
modInfo.put ("id", this.id);
modInfo.put ("r0", this.r0);
modInfo.put ("tau", this.tau.getArray ());
modInfo.put ("modDim", Integer.$valueOf (this.modDim));
modInfo.put ("gammaE", this.gammaE);
modInfo.put ("gammaIinv", this.gammaIinv.getArray ());
modInfo.put ("sI", this.sI.getArray ());
modInfo.put ("sigma", this.sigma.getArray ());
modInfo.put ("symop", Integer.$valueOf (this.iop + 1));
modInfo.put ("strop", this.strop);
modInfo.put ("unitcell", this.symmetry.getUnitCellInfo ());
var mInfo =  new JU.Lst ();
for (var i = 0; i < this.mods.size (); i++) mInfo.addLast (this.mods.get (i).getInfo ());

modInfo.put ("mods", mInfo);
info.put ("modulation", modInfo);
}, "java.util.Map");
Clazz.overrideMethod (c$, "setXYZ", 
function (v) {
if (this.vib == null || v.length () == 0 && this.vib.modDim == -2) return;
this.mscale *= v.length () / this.vib.length ();
this.vib.setT (v);
}, "JU.T3");
Clazz.overrideMethod (c$, "getVibration", 
function (forceNew) {
if (this.vib == null && forceNew) this.vib =  new JU.Vibration ();
return this.vib;
}, "~B");
Clazz.overrideMethod (c$, "getV3", 
function () {
return (this.mxyz == null ? this : this.mxyz);
});
Clazz.overrideMethod (c$, "scaleVibration", 
function (m) {
if (this.vib != null) this.vib.scale (m);
this.mscale *= m;
}, "~N");
Clazz.overrideMethod (c$, "setMoment", 
function () {
if (this.mxyz == null) return;
this.symmetry.toCartesian (this.vib, true);
this.v0 = JU.V3.newV (this.vib);
});
Clazz.overrideMethod (c$, "isNonzero", 
function () {
return this.x != 0 || this.y != 0 || this.z != 0 || this.mxyz != null && (this.mxyz.x != 0 || this.mxyz.y != 0 || this.mxyz.z != 0);
});
Clazz.defineMethod (c$, "getAxesLengths", 
function () {
return (this.axesLengths == null ? (this.axesLengths = this.symmetry.getNotionalUnitCell ()) : this.axesLengths);
});
});
