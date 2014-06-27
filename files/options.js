//MagresView 
//by Simone Sturniolo
//
//Copyright 2013 Science and Technology Facilities Council
//This software is distributed under the terms of the GNU General Public License (GNU GPL)
//Please refer to the file COPYING for the text of the license

//Functions controlling the various possibilities present in the Options menu

//Molecule shift handling function; refer to periodicity.js for more details about the way periodic boundary conditions are applied

function shift_btn_handler()
{
	if (atom_set.lattice_pars.r == null)
	{
		alert("No lattice parameters detected in the file. Shifting is impossible");
		return;
	}
	
	//First: calculate shifts
	
	var a_par = atom_set.lattice_pars.r[0];
	var b_par = atom_set.lattice_pars.r[1];
	var c_par = atom_set.lattice_pars.r[2];
		
	var a_shift_perc = document.getElementById("opt_a_shift").value;
	var b_shift_perc = document.getElementById("opt_b_shift").value;
	var c_shift_perc = document.getElementById("opt_c_shift").value;
	
	var a_shift = vec_scale(a_par, a_shift_perc/100.0);
	var b_shift = vec_scale(b_par, b_shift_perc/100.0);
	var c_shift = vec_scale(c_par, c_shift_perc/100.0);
	
	//Second: apply shifts and periodic boundary conditions
		
	for (var s = 0; s < atom_set.atoms.length; ++s)
	{
		for (var a = 0; a < atom_set.atoms[s].length; ++a)
		{
			var final_pos = [atom_set.atoms[s][a].x, atom_set.atoms[s][a].y, atom_set.atoms[s][a].z];
			
			final_pos[0] += a_shift[0] + b_shift[0] + c_shift[0];
			final_pos[1] += a_shift[1] + b_shift[1] + c_shift[1];
			final_pos[2] += a_shift[2] + b_shift[2] + c_shift[2];
						
			final_pos = periodic_bound(final_pos, a_par, b_par, c_par);
			
			atom_set.atoms[s][a].x = final_pos[0];
			atom_set.atoms[s][a].y = final_pos[1];			
			atom_set.atoms[s][a].z = final_pos[2];
		}
		
	}
	
	//Third: generate and submit a .cell file
	
	var cell_file = "# CELL automatically generated by JMol NMR WebPage\n";

	if (atom_set.lattice_pars.r != null)
	{
		cell_file += "%BLOCK lattice_cart\n";
		cell_file += "ang\n";
	
		for (var i = 0; i < 3; ++i)
		{
			for (var j = 0; j < 3; ++j)
			{
				cell_file += atom_set.lattice_pars.r[i][j] + "\t";
			}
			cell_file += "\n";
		}
		cell_file += "%ENDBLOCK lattice_cart\n\n";
	}
	
	cell_file += "%BLOCK positions_abs\n";

	for(var s = 0; s < atom_set.speciesno; ++s)
	{
		for (var a = 0; a < atom_set.atoms[s].length; ++a)
		{
			cell_file += atom_set.atoms[s][a].to_string() + "\n";
		}
	}

	cell_file += "%ENDBLOCK positions_abs";
		
	var load_script = "load data \"model current_model\" " + cell_file + " end \"model current_model\"";

	var x_lat = parseInt(document.getElementById("x_lat").value);
	var y_lat = parseInt(document.getElementById("y_lat").value);
	var z_lat = parseInt(document.getElementById("z_lat").value);
	
	//Check that there are no errors
	if (x_lat <= 0)
	{
		x_lat = 1;
		document.getElementById("x_lat").value = 1;
	}

	if (y_lat <= 0)
	{
		y_lat = 1;
		document.getElementById("y_lat").value = 1;
	}

	if (z_lat <= 0)
	{
		z_lat = 1;
		document.getElementById("z_lat").value = 1;
	}
	
	if (x_lat > 1 || y_lat > 1 || z_lat > 1)
		load_script += "{" + x_lat + " " + y_lat + " " + z_lat + "}";
	
	//Fourth: reset the plots, reload the molecule, replot.
	//The resetting step is necessary because reloading the molecule will clear the labels of the various ellipsoids/echoes used to plot. Without it there will be weird behaviours.
	
	disable_NMR_controls();
	plot_update();
	Jmol.script(mainJmol, load_script);
	enable_NMR_controls();	
	dropdown_update();
	plot_update();
	
	//Reset the shift values to zero
	document.getElementById("opt_a_shift").value = "0";
	document.getElementById("opt_b_shift").value = "0";
	document.getElementById("opt_c_shift").value = "0";
	
}

function opt_transl_handler(evt)
{
	//Compatibility code - see console.js for details
	var evt = window.event || evt;
	var myKey = (evt.keyCode)? evt.keyCode: evt.charCode;
	var transl_text = document.getElementById("opt_transl");
	
	if (myKey == 13)
	{
		evt.preventDefault();
	}
	
	if (transl_text.value > 1.0)
	{
		transl_text.value = 1.0;
	}
	else if (transl_text.value < 0.0)
	{
		transl_text.value = 0.0;
	}
	plot_update();

}

function opt_type_handler(evt)
{
	var type = document.getElementById("opt_type").value;
	var transl_text = document.getElementById("opt_transl");
	
	var typescript = ""
	
	switch (type) {
		case "fill":
			typescript = "set ellipsoidarcs false; set ellipsoidaxes false; set ellipsoidball true";
			transl_text.value = "0.4";
			transl_text.disabled = false;
			break;
		case "axearcs":
			typescript = "set ellipsoidarcs true; set ellipsoidaxes true; set ellipsoidball false";
			transl_text.value = "0.0";
			transl_text.disabled = true;
			break;
		case "axes":
			typescript = "set ellipsoidarcs false; set ellipsoidaxes true; set ellipsoidball false";
			transl_text.value = "0.0";
			transl_text.disabled = true;
			break;
	}
	
	Jmol.script(mainJmol, typescript);
	plot_update();
}

function opt_width_handler(evt)
{
	//Compatibility code - see console.js for details
	var evt = window.event || evt;
	var myKey = (evt.keyCode)? evt.keyCode: evt.charCode;
	var transl_text = document.getElementById("opt_width");
	
	if (myKey == 13)
	{
		evt.preventDefault();
	}
	
	if (transl_text.value < 0.0)
	{
		transl_text.value = 0.0;
	}
	
	plot_update();
}

function label_composer()
{
	var label_row = "{all}.label = \"\";font label 12 sans bold; color label white;";

	if (label_components[0] == "" && label_components[1] == "" && label_components[2] == "")
		label_row += "labels off;"
	else
	{
		label_row += "labels " + label_components[0] + (label_components[1] == ""? "":"|");
		label_row += "<color [xC06000]>" + label_components[1] + "</color>" + (label_components[2] == ""? "":"|");
		label_row += "<color [x0060C0]>" + label_components[2] + "</color>;";
	}

	return label_row;
}

function q_units_choice_handler()
{
	document.getElementById("q_units").innerHTML = document.getElementById("q_units_choice").value;
	
	if (document.getElementById("efg_check_2").checked == true)
		efg_label_handler();
}

function t_conv_choice_handler()
{
	var conv = document.getElementById("t_conv_choice").value;
	
	var ms_title_1_haeb  = "Anisotropy, defined as s_3-(s_1+s_2)/2";
	var ms_title_2_haeb  = "Asymmetry, defined as (s_2-s_1)/(s_3-s_iso)";
	var efg_title_1_haeb = "Anisotropy, defined as Vzz-(Vxx+Vyy)/2 (= 3/2 Vzz)";
	var efg_title_2_haeb = "Asymmetry, defined as (Vyy-Vxx)/Vzz";
	var ms_title_1_haeb_red  = "Reduced anisotropy, defined as s_3-s_iso";
	var ms_title_2_haeb_red  = "Asymmetry, defined as (s_2-s_1)/(s_3-s_iso)";
	var efg_title_1_haeb_red = "Reduced anisotropy, defined as Vzz-Viso (= Vzz)";
	var efg_title_2_haeb_red = "Asymmetry, defined as (Vyy-Vxx)/Vzz";
	var ms_title_1_herz  = "Span, defined as s_1-s_3";
	var ms_title_2_herz  = "Skew, defined as 3(s_2-s_iso)/(s1-s3)";
	var efg_title_1_herz = "Span, defined as Vxx-Vzz";
	var efg_title_2_herz = "Skew, defined as 3Vyy/(Vxx-Vzz)";
	
	switch(conv)
	{
		case "haeb":
			document.getElementById("ms_par_1").innerHTML = "Anisotropy";
			document.getElementById("efg_par_1").innerHTML = "Anisotropy";
			
			document.getElementById("ms_ltype_2").title  = ms_title_1_haeb;
			document.getElementById("efg_ltype_2").title = efg_title_1_haeb;
			document.getElementById("ms_ltype_3").title  = ms_title_2_haeb;
			document.getElementById("efg_ltype_3").title = efg_title_2_haeb;
	
			document.getElementById("ms_par_2").innerHTML = "Asymmetry";
			document.getElementById("efg_par_2").innerHTML = "Asymmetry";
			break;
		
			case "haeb_red":
			document.getElementById("ms_par_1").innerHTML = "Reduced anisotropy";
			document.getElementById("efg_par_1").innerHTML = "Reduced anisotropy";
			
			document.getElementById("ms_ltype_2").title  = ms_title_1_haeb_red;
			document.getElementById("efg_ltype_2").title = efg_title_1_haeb_red;
			document.getElementById("ms_ltype_3").title  = ms_title_2_haeb_red;
			document.getElementById("efg_ltype_3").title = efg_title_2_haeb_red;
	
			document.getElementById("ms_par_2").innerHTML = "Asymmetry";
			document.getElementById("efg_par_2").innerHTML = "Asymmetry";
			break;
		
		case "herber":
			document.getElementById("ms_par_1").innerHTML = "Span";
			document.getElementById("efg_par_1").innerHTML = "Span";
			
			document.getElementById("ms_ltype_2").title  = ms_title_1_herz;
			document.getElementById("efg_ltype_2").title = efg_title_1_herz;
			document.getElementById("ms_ltype_3").title  = ms_title_2_herz;
			document.getElementById("efg_ltype_3").title = efg_title_2_herz;
	
			document.getElementById("ms_par_2").innerHTML = "Skew";
			document.getElementById("efg_par_2").innerHTML = "Skew";
		break;
	}

	plot_update();
}

function snap_handler()
{
	//The way to do this is very different depending whether we're on Java or Javascript
	
	switch(current_framework)
	{
		case "Java":
			var snap_script = "write image ";
			snap_script += document.getElementById("snap_w").value + " " + document.getElementById("snap_h").value;
			snap_script += "png 2 \"?.png\"";
		
			Jmol.script(mainJmol, snap_script);
			break;
		
		case "JS":
			//Here we use a URI to let the user download the image
			var snap_uri = Jmol.getPropertyAsString(mainJmol, "image");
			$("#snap_download").attr("href", "data:image;base64," + snap_uri);
			$("#snap_download").attr("download", "snapshot.jpeg");
			$("#snap_download").removeClass("hidden");
			break;
	}
	
}

//Clears out the Snapshot download link if it's not required

function snap_download_link_handler()
{
	var active = $("#main_tabs").tabs("option", "active");
	if(active == tab_index("#options_accordion"))				//Is the Options tab active?
	{
		if(current_framework == "Java")
		{
			$("#snap_download").addClass("hidden");
			$("#snap_download").attr("href", "");
		}
	}
	else
	{
		$("#snap_download").addClass("hidden");		
		$("#snap_download").attr("href", "");
	}
	
}