//MagresView 
//by Simone Sturniolo
//
//Copyright 2013 Science and Technology Facilities Council
//This software is distributed under the terms of the GNU General Public License (GNU GPL)
//Please refer to the file COPYING for the text of the license

//This file handles the plotting of Magnetic Shieldings

var ms_last_scale = 0.01; //Saves the last used value of the scale - in the case that a zero comes out, uses this one

function ms_plot_handler()
{
	var ms_plot_on = document.getElementById("ms_check").checked;
	
	var transl = document.getElementById("opt_transl").value;
	var scale_ratio = parseFloat(document.getElementById("ms_ell_scale").value);

	var ms_plot_jmol_script = "";

	if (scale_ratio == 0.0)
	{
		//This part serves the purpose of roughly estimating a size scale for the ellipsoids to print
		
		var ms_iso = Jmol.evaluate(mainJmol, "{selected}.tensor(\"ms\", \"isotropy\")").split('\n');
		var avg_ms = 0.0;
		var n = 0;

		for (var i = 0; i < ms_iso.length; ++i)
		{
			var mi = parseFloat(ms_iso[i]);
			if (isNaN(mi))
				continue;
			avg_ms += Math.abs(mi);
			n++;
		}

		avg_ms /= n;
		avg_radius = Jmol.evaluate(mainJmol, "{selected}.radius");

		if (avg_radius == 0.0)
			scale_ratio = 0.5;
		else
			scale_ratio = avg_radius/avg_ms*1.2/0.006*0.5; //Slightly bigger than the average atom
	}

	//New Jmol functionality here!

	ms_plot_jmol_script = "ellipsoid set \"ms\" {all} off;" 
	if (ms_plot_on == true)
		ms_plot_jmol_script += "ellipsoid set \"ms\" {selected} on scale " + scale_ratio + " color translucent " + transl + " {192 96 0};";

	Jmol.script(mainJmol, ms_plot_jmol_script);
	
}

function ms_label_handler()
{
	/*
	Note: in this as well as in other plotting functions, special care is put to writing the entire action in a single string which is later fed as a script to the Jmol applet.
	The reason for this is that the Jmol.script(...) function seems to constitute a bottleneck which can considerably slow down execution if called repeatedly. Since the memory limit for
	javascript strings is VERY high in most modern browsers, I felt that this was a better solution. Of course, there IS a slight risk that for very long strings and very bad browsers this could cause
	a crash/error due to excessive memory consumption. I have never experienced that though.
	*/
	
	var ms_plot_on = document.getElementById("ms_check_2").checked;

	var shielding_ref = 0;
	
	var l_type_radios = document.getElementsByName("ms_ltype");
	var l_type = 0;
	
	var conv = document.getElementById("t_conv_choice").value;

	// Label precision: default value is 1

	var prec = parseInt(document.getElementById("opt_lab_prec").value);	
	prec = isNaN(prec)? 1 : prec;		// If it's NaN or something, use default value
	
	var ms_plot_jmol_script = "";

	// This part sends to JMol the reference values for chemical shielding, if either option that makes use of that is selected

	for (var i = 0, length = l_type_radios.length; i < length; i++) {
		 if (l_type_radios[i].checked) {
		 	if(l_type_radios[i].value == "shield")
		 	{
		 		l_type = -1;

		 		shielding_ref = document.getElementById("ms_shield_ref").value;
		 		ms_plot_jmol_script += "{all}.property_ms_cs = {all}.tensor('ms', 'isotropy').mul(-1).add(" + shielding_ref + ");";
		 	}
		 	else if (l_type_radios[i].value == "shield_reftable")
		 	{
		 		l_type = -1;

		 		for (var l = 0; l < atom_set.speciesno; ++l) {

		 			var lab = atom_set.atom_species_labels[l];
			        var ref = parseFloat($('#ref_input_' + lab).val());

			        // If not present, treat it as zero
			        ref = isNaN(ref)?0:ref;

		 			ms_plot_jmol_script += "{" + lab + "_*}.property_ms_cs = {" + lab + "_*}.tensor('ms', 'isotropy').mul(-1).add(" + ref + ");";
		 		}
		 	}
		 	else
		 	{
		     l_type = parseInt(l_type_radios[i].value);
		   }
		 }
	}
	
	label_components[1] = "";

	// Build the label component piece by piece

	if(ms_plot_on)
	{	
		var prop = "";
		switch(l_type)
		{
			case 0:
				prop = "iso";
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
				switch(conv)
				{
					case "haeb":
					case "haeb_red":
						prop = "asymm";
						break;
					case "herber":	
						prop = "skew";
						break;
				}
				break; 
			case -1:
				prop = "cs";
				break;
		}

		// Build the final string

		label_components[1] = prop + " = %." + prec + "[property_ms_" + prop + "]" + (l_type != 2? " ppm": "");

	}
	
	ms_plot_jmol_script += label_composer();

	Jmol.script(mainJmol, ms_plot_jmol_script);
}

function ms_color_handler()
{
	var ms_plot_on = document.getElementById("ms_check_3").checked;
	
	var shielding_ref = 0;
	
	var l_type_radios = document.getElementsByName("ms_ltype");
	var l_type = 0;
	
	var conv = document.getElementById("t_conv_choice").value;
	
	var tab_active = $("#main_tabs").tabs("option", "active");
	var acc_active = $("#visual_accordion").accordion("option", "active");
	var translucency_on = (document.getElementById("vvleck_sphere_check").checked == true) && 
	((document.getElementById("dipolar_check").checked == true) || ((tab_active == tab_index("#visual_accordion") &&				
	acc_active == 3)));
	var ms_plot_jmol_script = "";

	for (var i = 0, length = l_type_radios.length; i < length; i++) {
		 if (l_type_radios[i].checked) {
		 	if(l_type_radios[i].value == "shield")
		 	{
		 		shielding_ref = document.getElementById("ms_shield_ref").value;
		 		l_type = -1;
		 	}
		 	else
		 	{
				l_type = parseInt(l_type_radios[i].value);
			}
		 }
	}
	
	//Disable efg color scale (two at the same time would only generate confusion...)
	if (ms_plot_on == true)
	{
		document.getElementById("efg_check_3").disabled = true;
	} else
	{
		document.getElementById("efg_check_3").disabled = false;
	}

	//Color all atoms in a bleak tone 

	if(ms_plot_on)
	{
		ms_plot_jmol_script += "color {displayed} {200, 200, 200}; {all}.property_ms_colorscale = NaN; {selected}.property_ms_colorscale = {selected}.";
		switch(l_type)
		{
			case 0:
				ms_plot_jmol_script += "tensor('ms', 'isotropy')";
				break; 
			case 1:
				switch(conv)
				{
					case "haeb":
						ms_plot_jmol_script += "tensor('ms', 'anisotropy')";
						break;
					case "haeb_red":
						ms_plot_jmol_script += "tensor('ms', 'anisotropy').mul(2.0/3.0)";
						break;
					case "herber":
						ms_plot_jmol_script += "tensor('ms', 'span')";
						break;
				}
				break; 
			case 2:
				switch(conv)
				{
					case "haeb":
					case "haeb_red":
						ms_plot_jmol_script += "tensor('ms', 'asymmetry')";
						break;
					case "herber":
						ms_plot_jmol_script += "tensor('ms', 'skew')";
						break;
				}
				break; 
			case -1:
				ms_plot_jmol_script += "tensor('ms', 'isotropy').mul(-1).add(" + shielding_ref + ")";
				break;
		}
		ms_plot_jmol_script += ".mul(-1); color {selected} property_ms_colorscale;";
	}
	else
	{
		ms_plot_jmol_script += "color {displayed} none;"
	}
	
	if (translucency_on)
	{
		ms_plot_jmol_script += " color {displayed and not default_displaygroup} translucent;";
	}

	Jmol.script(mainJmol, ms_plot_jmol_script);
}

function ms_radio_handler(evt)
{
	ms_label_handler();
	ms_color_handler();
}

//Handler for the reference shielding textbox, updates the labels when RETURN is pressed

function ms_shield_ref_handler(evt)
{
	//Compatibility code - see console.js for details
	var evt = window.event || evt;
	var myKey = (evt.keyCode)? evt.keyCode: evt.charCode;
	
	if (myKey == 13)
	{
		evt.preventDefault();
		ms_label_handler();
		ms_color_handler();		
	}
}

//Same, for ellipsoid scale

function ms_ell_scale_handler(evt)
{
	//Compatibility code - see console.js for details
	var evt = window.event || evt;
	var myKey = (evt.keyCode)? evt.keyCode: evt.charCode;
	
	if (myKey == 13)
	{
		evt.preventDefault();
		ms_plot_handler();		
	}
}

