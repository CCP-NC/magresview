Clazz.declarePackage ("J.adapter.readers.cif");
Clazz.load (["J.adapter.readers.cif.MSRdr"], "J.adapter.readers.cif.MSCifRdr", ["java.lang.Character", "$.Double", "JU.M3", "$.Matrix", "$.PT"], function () {
c$ = Clazz.decorateAsClass (function () {
this.field = null;
this.comSSMat = null;
Clazz.instantialize (this, arguments);
}, J.adapter.readers.cif, "MSCifRdr", J.adapter.readers.cif.MSRdr);
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, J.adapter.readers.cif.MSCifRdr, []);
});
Clazz.defineMethod (c$, "processEntry", 
function () {
var cr = this.cr;
if (cr.key.equals ("_cell_commen_t_section_1")) {
this.isCommensurate = true;
this.commensurateSection1 = cr.parseIntStr (cr.data);
}if (cr.key.startsWith ("_cell_commen_supercell_matrix")) {
this.isCommensurate = true;
if (this.comSSMat == null) this.comSSMat = JU.M3.newM3 (null);
var tokens = JU.PT.split (cr.key, "_");
var r = cr.parseIntStr (tokens[tokens.length - 2]);
var c = cr.parseIntStr (tokens[tokens.length - 1]);
if (r > 0 && c > 0) this.comSSMat.setElement (r - 1, c - 1, cr.parseFloatStr (cr.data));
}});
Clazz.defineMethod (c$, "processLoopBlock", 
function () {
var cr = this.cr;
if (cr.key.equals ("_cell_subsystem_code")) return this.processSubsystemLoopBlock ();
if (!cr.key.startsWith ("_cell_wave") && !cr.key.contains ("fourier") && !cr.key.contains ("_special_func")) return 0;
if (cr.asc.iSet < 0) cr.asc.newAtomSet ();
cr.parseLoopParameters (J.adapter.readers.cif.MSCifRdr.modulationFields);
var tok;
while (cr.parser.getData ()) {
var ignore = false;
var id = null;
var atomLabel = null;
var axis = null;
var pt = [NaN, NaN, NaN];
var c = NaN;
var w = NaN;
var fid = null;
var n = cr.parser.getFieldCount ();
for (var i = 0; i < n; ++i) {
switch (tok = this.fieldProperty (cr, i)) {
case 0:
cr.haveCellWaveVector = true;
case 40:
case 41:
case 42:
case 4:
pt[0] = pt[1] = pt[2] = 0;
case 13:
case 25:
case 50:
case 35:
case 43:
case 44:
case 45:
switch (tok) {
case 0:
id = "W_";
break;
case 4:
id = "F_";
break;
case 40:
case 41:
case 42:
fid = "?" + this.field;
pt[2] = 1;
continue;
case 43:
case 44:
case 45:
atomLabel = axis = "*";
case 13:
case 25:
case 50:
case 35:
id = Character.toUpperCase (J.adapter.readers.cif.MSCifRdr.modulationFields[tok].charAt (11)) + "_";
break;
}
id += this.field;
break;
case 46:
id = "J_O";
pt[0] = pt[2] = 1;
case 55:
if (id == null) id = "M_T";
case 18:
if (id == null) id = "D_S";
case 30:
if (id == null) id = "O_0";
axis = "0";
case 11:
case 24:
case 48:
case 33:
atomLabel = this.field;
break;
case 12:
case 49:
axis = this.field;
if (this.modAxes != null && this.modAxes.indexOf (axis.toUpperCase ()) < 0) ignore = true;
break;
case 34:
axis = this.field.toUpperCase ();
break;
case 27:
case 31:
case 15:
case 52:
case 37:
case 66:
case 62:
case 64:
pt[2] = 0;
case 1:
case 5:
case 19:
case 56:
pt[0] = cr.parseFloatStr (this.field);
break;
case 8:
id += "_coefs_";
pt =  Clazz.newDoubleArray (this.modDim, 0);
pt[0] = cr.parseFloatStr (this.field);
break;
case 16:
case 28:
case 53:
case 38:
pt[0] = cr.parseFloatStr (this.field);
pt[2] = 1;
break;
case 63:
case 26:
axis = "0";
case 2:
case 6:
case 9:
case 17:
case 29:
case 54:
case 39:
case 32:
case 20:
case 57:
case 47:
case 14:
case 51:
case 36:
case 61:
case 65:
pt[1] = cr.parseFloatStr (this.field);
break;
case 3:
case 7:
case 10:
case 21:
case 58:
pt[2] = cr.parseFloatStr (this.field);
break;
case 22:
case 59:
c = cr.parseFloatStr (this.field);
break;
case 23:
case 60:
w = cr.parseFloatStr (this.field);
break;
}
if (ignore || id == null || atomLabel != null && !atomLabel.equals ("*") && cr.rejectAtomName (atomLabel)) continue;
var d = 0;
for (var j = 0; j < pt.length; j++) d += pt[j];

if (Double.isNaN (d) || d > 1e10 || d == 0) continue;
switch (id.charAt (0)) {
case 'W':
case 'F':
break;
case 'D':
case 'O':
case 'M':
case 'U':
case 'J':
if (atomLabel == null || axis == null) continue;
if (id.equals ("D_S") || id.equals ("M_T")) {
if (Double.isNaN (c) || Double.isNaN (w)) continue;
if (pt[0] != 0) this.addMod (id + "#x;" + atomLabel, fid, [c, w, pt[0]]);
if (pt[1] != 0) this.addMod (id + "#y;" + atomLabel, fid, [c, w, pt[1]]);
if (pt[2] != 0) this.addMod (id + "#z;" + atomLabel, fid, [c, w, pt[2]]);
continue;
}id += "#" + axis + ";" + atomLabel;
break;
}
this.addMod (id, fid, pt);
}
}
return 1;
});
Clazz.defineMethod (c$, "addMod", 
 function (id, fid, params) {
if (fid != null) id += fid;
this.addModulation (null, id, params, -1);
}, "~S,~S,~A");
Clazz.defineMethod (c$, "processSubsystemLoopBlock", 
 function () {
var cr = this.cr;
cr.parseLoopParameters (null);
while (cr.parser.getData ()) {
this.fieldProperty (cr, 0);
var id = this.field;
this.addSubsystem (id, this.getSparseMatrix (cr, "_w_", 1, 3 + this.modDim));
}
return 1;
});
Clazz.defineMethod (c$, "getSparseMatrix", 
 function (cr, term, i, dim) {
var m =  new JU.Matrix (null, dim, dim);
var a = m.getArray ();
var key;
var p;
var n = cr.parser.getFieldCount ();
for (; i < n; ++i) {
if ((p = this.fieldProperty (cr, i)) < 0 || !(key = cr.parser.getField (p)).contains (term)) continue;
var tokens = JU.PT.split (key, "_");
var r = cr.parseIntStr (tokens[tokens.length - 2]);
var c = cr.parseIntStr (tokens[tokens.length - 1]);
if (r > 0 && c > 0) a[r - 1][c - 1] = cr.parseFloatStr (this.field);
}
return m;
}, "J.adapter.readers.cif.CifReader,~S,~N,~N");
Clazz.defineMethod (c$, "fieldProperty", 
 function (cr, i) {
return ((this.field = cr.parser.getLoopData (i)).length > 0 && this.field.charAt (0) != '\0' ? cr.propertyOf[i] : -1);
}, "J.adapter.readers.cif.CifReader,~N");
Clazz.defineStatics (c$,
"WV_ID", 0,
"WV_X", 1,
"WV_Y", 2,
"WV_Z", 3,
"FWV_ID", 4,
"FWV_X", 5,
"FWV_Y", 6,
"FWV_Z", 7,
"JANA_FWV_Q1_COEF", 8,
"JANA_FWV_Q2_COEF", 9,
"JANA_FWV_Q3_COEF", 10,
"FWV_DISP_LABEL", 11,
"FWV_DISP_AXIS", 12,
"FWV_DISP_SEQ_ID", 13,
"FWV_DISP_COS", 14,
"FWV_DISP_SIN", 15,
"FWV_DISP_MODULUS", 16,
"FWV_DISP_PHASE", 17,
"DISP_SPEC_LABEL", 18,
"DISP_SAW_AX", 19,
"DISP_SAW_AY", 20,
"DISP_SAW_AZ", 21,
"DISP_SAW_C", 22,
"DISP_SAW_W", 23,
"FWV_OCC_LABEL", 24,
"FWV_OCC_SEQ_ID", 25,
"FWV_OCC_COS", 26,
"FWV_OCC_SIN", 27,
"FWV_OCC_MODULUS", 28,
"FWV_OCC_PHASE", 29,
"OCC_SPECIAL_LABEL", 30,
"OCC_CRENEL_C", 31,
"OCC_CRENEL_W", 32,
"FWV_U_LABEL", 33,
"FWV_U_TENS", 34,
"FWV_U_SEQ_ID", 35,
"FWV_U_COS", 36,
"FWV_U_SIN", 37,
"FWV_U_MODULUS", 38,
"FWV_U_PHASE", 39,
"FD_ID", 40,
"FO_ID", 41,
"FU_ID", 42,
"FDP_ID", 43,
"FOP_ID", 44,
"FUP_ID", 45,
"JANA_OCC_ABS_LABEL", 46,
"JANA_OCC_ABS_O_0", 47,
"FWV_SPIN_LABEL", 48,
"FWV_SPIN_AXIS", 49,
"FWV_SPIN_SEQ_ID", 50,
"FWV_SPIN_COS", 51,
"FWV_SPIN_SIN", 52,
"FWV_SPIN_MODULUS", 53,
"FWV_SPIN_PHASE", 54,
"SPIN_SPEC_LABEL", 55,
"SPIN_SAW_AX", 56,
"SPIN_SAW_AY", 57,
"SPIN_SAW_AZ", 58,
"SPIN_SAW_C", 59,
"SPIN_SAW_W", 60,
"DEPR_FD_COS", 61,
"DEPR_FD_SIN", 62,
"DEPR_FO_COS", 63,
"DEPR_FO_SIN", 64,
"DEPR_FU_COS", 65,
"DEPR_FU_SIN", 66,
"modulationFields", ["_cell_wave_vector_seq_id", "_cell_wave_vector_x", "_cell_wave_vector_y", "_cell_wave_vector_z", "_atom_site_fourier_wave_vector_seq_id", "_atom_site_fourier_wave_vector_x", "_atom_site_fourier_wave_vector_y", "_atom_site_fourier_wave_vector_z", "_atom_site_fourier_wave_vector_q1_coeff", "_atom_site_fourier_wave_vector_q2_coeff", "_atom_site_fourier_wave_vector_q3_coeff", "_atom_site_displace_fourier_atom_site_label", "_atom_site_displace_fourier_axis", "_atom_site_displace_fourier_wave_vector_seq_id", "_atom_site_displace_fourier_param_cos", "_atom_site_displace_fourier_param_sin", "_atom_site_displace_fourier_param_modulus", "_atom_site_displace_fourier_param_phase", "_atom_site_displace_special_func_atom_site_label", "_atom_site_displace_special_func_sawtooth_ax", "_atom_site_displace_special_func_sawtooth_ay", "_atom_site_displace_special_func_sawtooth_az", "_atom_site_displace_special_func_sawtooth_c", "_atom_site_displace_special_func_sawtooth_w", "_atom_site_occ_fourier_atom_site_label", "_atom_site_occ_fourier_wave_vector_seq_id", "_atom_site_occ_fourier_param_cos", "_atom_site_occ_fourier_param_sin", "_atom_site_occ_fourier_param_modulus", "_atom_site_occ_fourier_param_phase", "_atom_site_occ_special_func_atom_site_label", "_atom_site_occ_special_func_crenel_c", "_atom_site_occ_special_func_crenel_w", "_atom_site_u_fourier_atom_site_label", "_atom_site_u_fourier_tens_elem", "_atom_site_u_fourier_wave_vector_seq_id", "_atom_site_u_fourier_param_cos", "_atom_site_u_fourier_param_sin", "_atom_site_u_fourier_param_modulus", "_atom_site_u_fourier_param_phase", "_atom_site_displace_fourier_id", "_atom_site_occ_fourier_id", "_atom_site_u_fourier_id", "_atom_site_displace_fourier_param_id", "_atom_site_occ_fourier_param_id", "_atom_site_u_fourier_param_id", "_atom_site_occ_fourier_absolute_site_label", "_atom_site_occ_fourier_absolute", "_atom_site_moment_fourier_atom_site_label", "_atom_site_moment_fourier_axis", "_atom_site_moment_fourier_wave_vector_seq_id", "_atom_site_moment_fourier_param_cos", "_atom_site_moment_fourier_param_sin", "_atom_site_moment_fourier_param_modulus", "_atom_site_moment_fourier_param_phase", "_atom_site_moment_special_func_atom_site_label", "_atom_site_moment_special_func_sawtooth_ax", "_atom_site_moment_special_func_sawtooth_ay", "_atom_site_moment_special_func_sawtooth_az", "_atom_site_moment_special_func_sawtooth_c", "_atom_site_moment_special_func_sawtooth_w", "_atom_site_displace_fourier_cos", "_atom_site_displace_fourier_sin", "_atom_site_occ_fourier_cos", "_atom_site_occ_fourier_sin", "_atom_site_u_fourier_cos", "_atom_site_u_fourier_sin"],
"NONE", -1);
});
