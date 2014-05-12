Clazz.declarePackage ("J.renderbio");
Clazz.load (["J.renderbio.StrandsRenderer", "JU.P3", "$.V3"], "J.renderbio.RocketsRenderer", ["J.constant.EnumStructure", "J.modelsetbio.AlphaPolymer", "$.Helix", "$.Sheet"], function () {
c$ = Clazz.decorateAsClass (function () {
this.newRockets = false;
this.renderArrowHeads = false;
this.cordMidPoints = null;
this.tPending = false;
this.proteinstructurePending = null;
this.startIndexPending = 0;
this.endIndexPending = 0;
this.screenA = null;
this.screenB = null;
this.screenC = null;
this.vtemp = null;
this.vTemp = null;
this.ptC = null;
this.ptTip = null;
this.vW = null;
this.vH = null;
this.corners = null;
this.screenCorners = null;
Clazz.instantialize (this, arguments);
}, J.renderbio, "RocketsRenderer", J.renderbio.StrandsRenderer);
Clazz.prepareFields (c$, function () {
this.screenA =  new JU.P3 ();
this.screenB =  new JU.P3 ();
this.screenC =  new JU.P3 ();
this.vtemp =  new JU.V3 ();
this.vTemp =  new JU.V3 ();
this.ptC =  new JU.P3 ();
this.ptTip =  new JU.P3 ();
this.vW =  new JU.V3 ();
this.vH =  new JU.V3 ();
this.corners =  new Array (8);
this.screenCorners =  new Array (8);
});
$_V(c$, "renderBioShape", 
function (bioShape) {
if (!(Clazz.instanceOf (bioShape.bioPolymer, J.modelsetbio.AlphaPolymer))) return;
if (this.wireframeOnly) {
this.renderStrands ();
return;
}var val = !this.viewer.getBoolean (603979900);
if (this.renderArrowHeads != val) {
bioShape.falsifyMesh ();
this.renderArrowHeads = val;
}this.calcRopeMidPoints (this.newRockets);
this.calcScreenControlPoints (this.cordMidPoints);
this.controlPoints = this.cordMidPoints;
this.renderRockets ();
this.viewer.freeTempPoints (this.cordMidPoints);
}, "J.shapebio.BioShape");
$_M(c$, "isSheet", 
function (i) {
return this.structureTypes[i] === J.constant.EnumStructure.SHEET;
}, "~N");
$_M(c$, "calcRopeMidPoints", 
function (isNewStyle) {
var midPointCount = this.monomerCount + 1;
this.cordMidPoints = this.viewer.allocTempPoints (midPointCount);
var proteinstructurePrev = null;
var point;
for (var i = 0; i < this.monomerCount; ++i) {
point = this.cordMidPoints[i];
var residue = this.monomers[i];
if (isNewStyle && this.renderArrowHeads) {
point.setT (this.controlPoints[i]);
} else if (this.isHelix (i) || !isNewStyle && this.isSheet (i)) {
var proteinstructure = residue.getProteinStructure ();
point.setT (i - 1 != proteinstructure.getMonomerIndex () ? proteinstructure.getAxisStartPoint () : proteinstructure.getAxisEndPoint ());
proteinstructurePrev = proteinstructure;
} else {
if (proteinstructurePrev != null) point.setT (proteinstructurePrev.getAxisEndPoint ());
 else {
point.setT (this.controlPoints[i]);
}proteinstructurePrev = null;
}}
point = this.cordMidPoints[this.monomerCount];
if (proteinstructurePrev != null) point.setT (proteinstructurePrev.getAxisEndPoint ());
 else {
point.setT (this.controlPoints[this.monomerCount]);
}}, "~B");
$_M(c$, "renderRockets", 
function () {
this.tPending = false;
for (var i = this.bsVisible.nextSetBit (0); i >= 0; i = this.bsVisible.nextSetBit (i + 1)) {
var monomer = this.monomers[i];
if (this.isHelix (i) || this.isSheet (i)) {
this.renderSpecialSegment (monomer, this.getLeadColix (i), this.mads[i]);
} else {
this.renderPending ();
this.renderHermiteConic (i, true);
}}
this.renderPending ();
});
$_M(c$, "renderSpecialSegment", 
function (monomer, thisColix, thisMad) {
var proteinstructure = monomer.getProteinStructure ();
if (this.tPending) {
if (proteinstructure === this.proteinstructurePending && thisMad == this.mad && thisColix == this.colix && proteinstructure.getIndex (monomer) == this.endIndexPending + 1) {
++this.endIndexPending;
return;
}this.renderPending ();
}this.proteinstructurePending = proteinstructure;
this.startIndexPending = this.endIndexPending = proteinstructure.getIndex (monomer);
this.colix = thisColix;
this.mad = thisMad;
this.tPending = true;
}, "J.modelsetbio.Monomer,~N,~N");
$_M(c$, "renderPending", 
function () {
if (!this.tPending) return;
var segments = this.proteinstructurePending.getSegments ();
var tEnd = (this.endIndexPending == this.proteinstructurePending.getMonomerCount () - 1);
if (Clazz.instanceOf (this.proteinstructurePending, J.modelsetbio.Helix)) this.renderPendingRocketSegment (this.endIndexPending, segments[this.startIndexPending], segments[this.endIndexPending], segments[this.endIndexPending + 1], tEnd);
 else if (Clazz.instanceOf (this.proteinstructurePending, J.modelsetbio.Sheet)) this.renderPendingSheet (segments[this.startIndexPending], segments[this.endIndexPending], segments[this.endIndexPending + 1], tEnd);
this.tPending = false;
});
$_M(c$, "renderPendingRocketSegment", 
($fz = function (i, pointStart, pointBeforeEnd, pointEnd, tEnd) {
this.viewer.transformPt3f (pointStart, this.screenA);
this.viewer.transformPt3f (pointEnd, this.screenB);
var zMid = Clazz.doubleToInt (Math.floor ((this.screenA.z + this.screenB.z) / 2));
var diameter = Clazz.floatToInt (this.viewer.scaleToScreen (zMid, this.mad));
if (this.g3d.setColix (this.colix)) {
this.g3d.fillCylinderBits (2, diameter, this.screenA, this.screenB);
if (tEnd && this.renderArrowHeads) {
this.vtemp.sub2 (pointEnd, pointStart);
this.vtemp.normalize ();
this.screenA.scaleAdd2 (4.0, this.vtemp, pointEnd);
this.viewer.transformPt3f (this.screenA, this.screenC);
this.renderCone (i, pointEnd, this.screenA, this.screenB, this.screenC);
}if (this.startIndexPending == this.endIndexPending) return;
var t = this.screenB;
this.screenB = this.screenC;
this.screenC = t;
}}, $fz.isPrivate = true, $fz), "~N,JU.P3,JU.P3,JU.P3,~B");
$_M(c$, "renderCone", 
function (i, pointBegin, pointEnd, screenPtBegin, screenPtEnd) {
var coneDiameter = (this.mad << 1) - (this.mad >> 1);
coneDiameter = Clazz.floatToInt (this.viewer.scaleToScreen (Clazz.doubleToInt (Math.floor (screenPtBegin.z)), coneDiameter));
this.g3d.fillConeSceen3f (2, coneDiameter, screenPtBegin, screenPtEnd);
}, "~N,JU.P3,JU.P3,JU.P3,JU.P3");
$_M(c$, "renderPendingSheet", 
($fz = function (ptStart, pointBeforeEnd, ptEnd, tEnd) {
if (!this.g3d.setColix (this.colix)) return;
if (this.corners[0] == null) for (var i = 8; --i >= 0; ) {
this.corners[i] =  new JU.P3 ();
this.screenCorners[i] =  new JU.P3 ();
}
if (tEnd && this.renderArrowHeads) {
this.setBox (1.25, 0.333, pointBeforeEnd);
this.ptTip.scaleAdd2 (-0.5, this.vH, ptEnd);
for (var i = 4; --i >= 0; ) {
var corner = this.corners[i];
corner.setT (this.ptC);
if ((i & 1) != 0) corner.add (this.vW);
if ((i & 2) != 0) corner.add (this.vH);
this.viewer.transformPt3f (corner, this.screenCorners[i]);
}
this.corners[4].setT (this.ptTip);
this.viewer.transformPt3f (this.ptTip, this.screenCorners[4]);
this.corners[5].add2 (this.ptTip, this.vH);
this.viewer.transformPt3f (this.corners[5], this.screenCorners[5]);
this.g3d.fillTriangle3f (this.screenCorners[0], this.screenCorners[1], this.screenCorners[4], true);
this.g3d.fillTriangle3f (this.screenCorners[2], this.screenCorners[3], this.screenCorners[5], true);
for (var i = 0; i < 12; i += 4) {
var i0 = J.renderbio.RocketsRenderer.arrowHeadFaces[i];
var i1 = J.renderbio.RocketsRenderer.arrowHeadFaces[i + 1];
var i2 = J.renderbio.RocketsRenderer.arrowHeadFaces[i + 2];
var i3 = J.renderbio.RocketsRenderer.arrowHeadFaces[i + 3];
this.g3d.fillQuadrilateral (this.screenCorners[i0], this.screenCorners[i1], this.screenCorners[i2], this.screenCorners[i3]);
}
ptEnd = pointBeforeEnd;
}this.setBox (1, 0.25, ptStart);
this.vTemp.sub2 (ptEnd, ptStart);
this.buildBox (this.ptC, this.vW, this.vH, this.vTemp);
for (var i = 0; i < 6; ++i) {
var i0 = J.renderbio.RocketsRenderer.boxFaces[i * 4];
var i1 = J.renderbio.RocketsRenderer.boxFaces[i * 4 + 1];
var i2 = J.renderbio.RocketsRenderer.boxFaces[i * 4 + 2];
var i3 = J.renderbio.RocketsRenderer.boxFaces[i * 4 + 3];
this.g3d.fillQuadrilateral (this.screenCorners[i0], this.screenCorners[i1], this.screenCorners[i2], this.screenCorners[i3]);
}
}, $fz.isPrivate = true, $fz), "JU.P3,JU.P3,JU.P3,~B");
$_M(c$, "setBox", 
($fz = function (w, h, pt) {
var sheet = this.proteinstructurePending;
var scale = this.mad / 1000;
this.vW.setT (sheet.getWidthUnitVector ());
this.vW.scale (scale * w);
this.vH.setT (sheet.getHeightUnitVector ());
this.vH.scale (scale * h);
this.ptC.ave (this.vW, this.vH);
this.ptC.sub2 (pt, this.ptC);
}, $fz.isPrivate = true, $fz), "~N,~N,JU.P3");
$_M(c$, "buildBox", 
($fz = function (pointCorner, scaledWidthVector, scaledHeightVector, lengthVector) {
for (var i = 8; --i >= 0; ) {
var corner = this.corners[i];
corner.setT (pointCorner);
if ((i & 1) != 0) corner.add (scaledWidthVector);
if ((i & 2) != 0) corner.add (scaledHeightVector);
if ((i & 4) != 0) corner.add (lengthVector);
this.viewer.transformPt3f (corner, this.screenCorners[i]);
}
}, $fz.isPrivate = true, $fz), "JU.P3,JU.V3,JU.V3,JU.V3");
Clazz.defineStatics (c$,
"boxFaces", [0, 1, 3, 2, 0, 2, 6, 4, 0, 4, 5, 1, 7, 5, 4, 6, 7, 6, 2, 3, 7, 3, 1, 5],
"arrowHeadFaces", [0, 1, 3, 2, 0, 4, 5, 2, 1, 4, 5, 3]);
});
