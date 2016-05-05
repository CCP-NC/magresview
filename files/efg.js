//MagresView 
//by Simone Sturniolo
//
//Copyright 2013 Science and Technology Facilities Council
//This software is distributed under the terms of the GNU General Public License (GNU GPL)
//Please refer to the file COPYING for the text of the license

//This file handles the plotting of Electric Field Gradients

//This function is called with the enable_NMR_controls method and updates the dropdown for efg tag selection

var efg_last_scale = 1.0; //Saves the last used value of the scale - in the case that a zero comes out, uses this one

function efg_dropdown_update()
{
	var dropd = document.getElementById("efg_drop");
	
	dropd.options.length = atom_set.efg_tags.length;
	
	for(var i=0; i < atom_set.efg_tags.length; ++i)
	{
		dropd.options[i] = new Option(atom_set.efg_tags[i], atom_set.efg_tags[i]);
	}
	
}

function efg_plot_handler()
{
	var efg_plot_on = document.getElementById("efg_check").checked;
	var efg_name = document.getElementById("efg_drop").value;
	
	var transl = document.getElementById("opt_transl").value;	
	var scale_ratio = parseFloat(document.getElementById("efg_ell_scale").value);

	var efg_plot_jmol_script = "";

	if (scale_ratio == 0.0)
	{	
		//This part serves the purpose of roughly estimating a size scale for the ellipsoids to print
		
		var efg_max = Jmol.evaluate(mainJmol, "{selected}.tensor(\"" + efg_name + "\", \"value\")").split('\n');
		var avg_efg = 0.0;
		var n = 0;

		for (var i = 0; i < efg_max.length; ++i)
		{
			var ei = parseFloat(efg_max[i]);
			if (isNaN(ei))
				continue;
			avg_efg += Math.abs(ei);
			n++;
		}

		avg_efg /= n;
		avg_radius = Jmol.evaluate(mainJmol, "{selected}.radius");

		if (avg_radius == 0.0)
			scale_ratio = 0.5;
		else
			scale_ratio = avg_radius/avg_efg*1.5;
	}
	
	//New Jmol functionality

	efg_plot_jmol_script = ""

	for (var t = 0; t < atom_set.efg_tags.length; ++t)
	{
		var tag_name = atom_set.efg_tags[t];
		efg_plot_jmol_script += "ellipsoid set \"" + tag_name + "\" {all} off;" 
	}

	if (efg_plot_on == true)
		efg_plot_jmol_script += "ellipsoid set \"" + efg_name + "\" {selected} on scale " + scale_ratio + " color translucent " + transl + " {0 96 192};";

	Jmol.script(mainJmol, efg_plot_jmol_script);		
}

function efg_label_handler()
{
	var efg_plot_on = document.getElementById("efg_check_2").checked;
	var tag = document.getElementById("efg_drop").value;
	
	var l_type_radios = document.getElementsByName("efg_ltype");
	var l_type = 0;
	
	var q_units = document.getElementById("q_units_choice").value;	
	
	// Label precision: default value is 1

	var prec = parseInt(document.getElementById("opt_lab_prec").value);	
	prec = isNaN(prec)? 1 : prec;		// If it's NaN or something, use default value	

	for (var i = 0, length = l_type_radios.length; i < length; i++) {
		 if (l_type_radios[i].checked) {
		     l_type = parseInt(l_type_radios[i].value);
		 }
	}

	var conv = document.getElementById("t_conv_choice").value;	
	var efg_plot_jmol_script = "";
	

	// This bit of code runs if we need to calculate the total shifts
	if (l_type >= 4) {
		efg_plot_jmol_script += efg_total_shifts_script(tag);
	}

	label_components[2] = "";

	if(efg_plot_on)
	{
		var prop = "";
		switch(l_type)
		{
			case 0:
				prop = "vzz";
				break; 
			case 1:
				switch(conv)
				{
					case "haeb":
						prop = "aniso";
						break;
					case "haeb_red":
						prop = "red_aniso";
						break;
					case "herber":
						prop = "span";
						break;
				}
				break; 
			case 2:
				switch (conv) {
					case "haeb":
					case "haeb_red":
						prop = "asymm";
						break;
					case "herber":
						prop = "skew";
						break;
				}
				break; 
			case 3:
				prop = "chi";
				break;
			case 4:
				prop = "tot_shift";
				break;
			case 5:
				prop = "qiso_shift";
				break;
		}

		// The expression is a bit conditional because of units
		l_units = [" au", " au", " ", " " + q_units, " ppm", " ppm"];
		label_components[2] = prop + " = %." + prec + "[property_" + tag + "_" + prop + (l_type == 3? "_" + q_units : "") + "]" + l_units[l_type];
	}
	
	efg_plot_jmol_script += label_composer();
	console.log(efg_plot_jmol_script);

	Jmol.script(mainJmol, efg_plot_jmol_script);
}

function efg_color_handler()
{

	var efg_plot_on = document.getElementById("efg_check_3").checked;
	var tag = document.getElementById("efg_drop").value;
	
	var l_type_radios = document.getElementsByName("efg_ltype");
	var l_type = 0;
	
	var conv = document.getElementById("t_conv_choice").value;
		
	var tab_active = $("#main_tabs").tabs("option", "active");
	var acc_active = $("#visual_accordion").accordion("option", "active");
	var translucency_on = (document.getElementById("vvleck_sphere_check").checked == true) && 
	((document.getElementById("dipolar_check").checked == true) || ((tab_active == tab_index("#visual_accordion") &&				
	acc_active == 3)));

	for (var i = 0, length = l_type_radios.length; i < length; i++) {
		 if (l_type_radios[i].checked) {
		     l_type = parseInt(l_type_radios[i].value);
		 }
	}

	var efg_plot_jmol_script = "";

	//Disable ms color scale (two at the same time would only generate confusion...)
	if (efg_plot_on == true)
	{
		document.getElementById("ms_check_3").disabled = true;
	} else
	{
		document.getElementById("ms_check_3").disabled = false;
	}
	
	if(efg_plot_on)
	{	
		if (l_type == 3) {
			efg_plot_jmol_script += "function abs_chi {return abs(_x.property_" + tag + "_chi);};";	// Used only for l_type == 3
		}
		else if (l_type == 4) {
			efg_plot_jmol_script += efg_total_shifts_script(tag);
		}

		efg_plot_jmol_script += "color {displayed} {200, 200, 200}; {all}.property_efg_colorscale = NaN;";
		efg_plot_jmol_script += " {selected}.property_efg_colorscale = {selected}";

		switch(l_type)
		{
			case 0:
				efg_plot_jmol_script += ".tensor(\"" + tag + "\", \"value\")";
				break; 
			case 1:
				switch(conv)
				{
					case "haeb":
						efg_plot_jmol_script += ".tensor(\"" + tag + "\", \"anisotropy\")";
						break;
					case "haeb_red":
						efg_plot_jmol_script += ".tensor(\"" + tag + "\", \"anisotropy\").mul(2.0/3.0)";
						break;
					case "herber":						
						efg_plot_jmol_script += ".tensor(\"" + tag + "\", \"span\")";
						break;
				}
				break; 
			case 2:
				switch(conv)
				{
					case "haeb":
					case "haeb_red":
						efg_plot_jmol_script += ".tensor(\"" + tag + "\", \"asymmetry\")";
						break;
					case "herber":
						efg_plot_jmol_script += ".tensor(\"" + tag + "\", \"skew\")";
						break;
				}
				break; 
			case 3:
				efg_plot_jmol_script += ".abs_chi.all";
				break;
			case 4:
				efg_plot_jmol_script += ".property_" + tag + "_tot_shift.all";
				break;
			case 5:
				efg_plot_jmol_script += ".property_" + tag + "_qiso_shift.all";
				break;
		}
		
		efg_plot_jmol_script += ".mul(-1);";
		efg_plot_jmol_script += " color {selected} property_efg_colorscale;";
	}
	else
	{
		efg_plot_jmol_script += "color {displayed} none;"
	}

	if (translucency_on)
	{
		efg_plot_jmol_script += " color {displayed and not default_displaygroup} translucent;";
	}
	
	Jmol.script(mainJmol, efg_plot_jmol_script);
}

function efg_drop_handler()
{
	efg_plot_handler();
	efg_label_handler();
	efg_color_handler();
}

function efg_radio_handler(event)
{
	efg_label_handler();
	efg_color_handler();
}

function vzz_2_chi(vzz, el)
{
	var iso = atom_set.atom_elems[el];
	
	if (iso == 0)
		return 0;
	
	return e_charge*iso_table[el][iso].Q*vzz*(9.71736e-7)/h_planck;
}

function efg_ell_scale_handler(evt)
{
	//Compatibility code - see console.js for details
	var evt = window.event || evt;
	var myKey = (evt.keyCode)? evt.keyCode: evt.charCode;
	
	if (myKey == 13)
	{
		evt.preventDefault();
		efg_plot_handler();		
	}
}

// Used for total shifts
function efg_total_shifts_script(tag) {

	efg_plot_jmol_script = "";

	for (var l = 0; l < atom_set.speciesno; ++l) {

		var lab = atom_set.atom_species_labels[l];
		// Get the Larmor frequency (the wrapper is convenient since it implements the default value for NaNs)
        var larm = get_larmor(lab);
        var ref = get_shieldref(lab);

		// Now define the property for the quadrupolar shifts.
		// Doing everything here allows for working only on DISPLAYED atoms, which reduces greatly the computational load
		efg_plot_jmol_script += "function delta_Q_" + tag + "_calc {	\
			var I = abs(spin_data_table[_x.element]);		\
			if (I < 1) { return 0.0; }				\
			var m = I - (I \\ 1);					\
			var Pq = _x.property_" + tag + "_chi_MHz*sqrt(1.0+(_x.property_" + tag + "_asymm**2)/3.0); \
			return -(3.0/40.0)*((Pq/" + larm + ")**2)*(I*(I+1)-9.0*m*(m-1)-3.0)/(I**2*(2*I-1)**2)*1e6;	\
		};";

        // And add it up
		efg_plot_jmol_script += "{" + lab + "_* and displayed}.property_" + tag + "_qiso_shift =  \
								 {" + lab + "_* and displayed}.delta_Q_" + tag + "_calc.all;";			
        if (atom_set.has_ms) {
			efg_plot_jmol_script += "{" + lab + "_* and displayed}.property_" + tag + "_tot_shift = {" + lab + "_* and displayed}.tensor('ms', 'isotropy').add( \
									 {" + lab + "_* and displayed}.property_" + tag + "_qiso_shift.all.mul(-1))";
		}
		else {
			efg_plot_jmol_script += "{" + lab + "_* and displayed}.property_" + tag + "_tot_shift = \
									 {" + lab + "_* and displayed}.property_" + tag + "_qiso_shift.all.mul(-1)";
		}

		// Final bit: referencing
		efg_plot_jmol_script += ".mul(-1).add(" + ref + ");";
	}

	return efg_plot_jmol_script;	
}

// Calculate total shift from given chi, eta and element
function efg_total_shift_calc(chi, eta, el, larm) {
	var I = Math.abs(spin_data_table[el]);
	if (isNaN(I) || I < 1) {
		// Something went wrong, element not found!
		// ...or it simply ain't quadrupolar
		return 0.0;
	}
	var m = I%1;
	var Pq = (chi*1.0e-6)*Math.sqrt(1.0+(eta*eta)/3.0);
	return (-(3.0/40.0)*(Math.pow((Pq/larm),2.0))*(I*(I+1)-9.0*m*(m-1)-3.0)/(I*I*Math.pow((2*I-1),2.0))*1.0e6);
}