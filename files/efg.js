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
			scale_ratio = avg_radius/avg_efg*1.2*0.2;
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
	
	for (var i = 0, length = l_type_radios.length; i < length; i++) {
		 if (l_type_radios[i].checked) {
		     l_type = parseInt(l_type_radios[i].value);
		 }
	}

	var conv = document.getElementById("t_conv_choice").value;
	
	var efg_plot_jmol_script = "";
	
	if(efg_plot_on)
	{
		switch(l_type)
		{
			case 0:
				label_components[2] = "Vzz = %.2[property_" + tag + "_vzz] au";
				break; 
			case 1:
				if (conv == "haeb")
				{
					label_components[2] = "aniso = %.2[property_" + tag + "_aniso] au";
				}
				else 
				{
					label_components[2] = "span = %.2[property_" + tag + "_span] au";
				}
				break; 
			case 2:
				if (conv == "haeb")
				{
					label_components[2] = "asymm = %.2[property_" + tag + "_asymm]";
				}
				else 
				{
					label_components[2] = "skew = %.2[property_" + tag + "_skew]";
				}
				break; 
			case 3:
				label_components[2] = "chi = %.2[property_" + tag + "_chi_" + q_units + "] " + q_units;
				break;
		}
	}
	else
		label_components[2] = "";
	
	efg_plot_jmol_script += label_composer();

	Jmol.script(mainJmol, efg_plot_jmol_script);
}

function efg_color_handler()
{
	var efg_plot_on = document.getElementById("efg_check_3").checked;
	var tag = document.getElementById("efg_drop").value;
	
	var l_type_radios = document.getElementsByName("efg_ltype");
	var l_type = 0;
	
	var conv = document.getElementById("t_conv_choice").value;
		
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
		efg_plot_jmol_script += "color {displayed} {200, 200, 200}; {all}.property_efg_colorscale = NaN; {selected}.property_efg_colorscale = {selected}";
		switch(l_type)
		{
			case 0:
				efg_plot_jmol_script += ".tensor(\"" + tag + "\", \"value\")";
				break; 
			case 1:
				if (conv == "haeb") {
					efg_plot_jmol_script += ".tensor(\"" + tag + "\", \"anisotropy\")";					
				}
				else
				{
					efg_plot_jmol_script += ".tensor(\"" + tag + "\", \"span\")";										
				}
				break; 
			case 2:
				if (conv == "haeb") {
					efg_plot_jmol_script += ".tensor(\"" + tag + "\", \"asymmetry\")";
				}
				else
				{
					efg_plot_jmol_script += ".tensor(\"" + tag + "\", \"skew\")";										
				}
				break; 
			case 3:
				efg_plot_jmol_script += ".tensor(\"" + tag + "\", \"chi\")";
				break;
		}
		
		efg_plot_jmol_script += ".mul(-1); color {selected} property_efg_colorscale;";
	}
	else
	{
		efg_plot_jmol_script += "color {displayed} none;"
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