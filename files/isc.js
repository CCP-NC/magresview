//MagresView 
//by Simone Sturniolo
//
//Copyright 2013 Science and Technology Facilities Council
//This software is distributed under the terms of the GNU General Public License (GNU GPL)
//Please refer to the file COPYING for the text of the license

//This file handles the plotting of ISC couplings, aka J-couplings

//This function is called with the enable_NMR_controls method and updates the dropdown for efg tag selection

function isc_detect_center() {

	if(atom_set.has_isc) {
		var all_isc_values = Jmol.evaluateVar(mainJmol, "{all}.tensor('" + atom_set.isc_tags[0] + "', 'value')");
		// Is there an isc_center?
		atom_set.isc_center = all_isc_values[0][0];
		for (var i = 1; i < all_isc_values.length; ++i) {
			if (all_isc_values[i][0] != atom_set.isc_center) {
				atom_set.isc_center = null;
				break;
			}
		}
	}

	if (atom_set.isc_center != null) {
		atom_set.isc_center = Jmol.evaluateVar(mainJmol, "{*}[" + (atom_set.isc_center + 1) + "].atomname");
	}

}

function isc_dropdown_update()
{
	var dropd = document.getElementById("isc_drop");
	
	dropd.options.length = atom_set.isc_tags.length;
	atom_set.isc_tags.sort(); // Sort to get the total as first option

	for(var i=0; i < atom_set.isc_tags.length; ++i)
	{
		dropd.options[i] = new Option(atom_set.isc_tags[i], atom_set.isc_tags[i]);
	}
}

function isc_closest_handler()
{
	// Edits the visibility of the ghosts of the "closest" periodic copies to the picked atom
	// Works on the model of vvleck_sphere_handler

	var closest_script = " define default_displaygroup " + default_displaygroup + ";";
	var isc_atom = last_atom_picked;
	if ($('#isc_center_atom').prop('checked')) {
		isc_atom = Jmol.evaluateVar(mainJmol, '{default_displaygroup and ' + atom_set.isc_center + '}')[0]+1;
	}
	var aexpr = '{*}[' + isc_atom + ']';
	
	//A bit of jQuery magic to check whether the active tab is the "Visualization" one. It just works.

	var tab_active = $("#main_tabs").tabs("option", "active");
	var acc_active = $("#visual_accordion").accordion("option", "active");
	if(((tab_active == tab_index("#visual_accordion") &&								//Is the Visualization tab active?
		acc_active == 2)							||					//Is the ISC accordion section active?
		document.getElementById("isc_check").checked == true) )
	{
		closest_script += "fx0=" + aexpr + ".fx; fy0=" + aexpr + ".fy; fz0=" + aexpr + ".fz;";
		closest_script += "fxmin=fx0-0.5; fxmax=fx0+0.5;";
		closest_script += "fymin=fy0-0.5; fymax=fy0+0.5;";
		closest_script += "fzmin=fz0-0.5; fzmax=fz0+0.5;";
		closest_script += "display default_displaygroup or {fx>fxmin and fx<=fxmax and fy>fymin and fy<=fymax and fz>fzmin and fz<=fzmax};";
		closest_script += "color {fx>fxmin and fx<=fxmax and fy>fymin and fy<=fymax and fz>fzmin and fz<=fzmax} and not default_displaygroup translucent;";
	}
	else
	{
		//To prevent erroneously deleting "range" ghosts
		if ($("#main_tabs").tabs("option", "active") != tab_index("#file_gen")    ||
			document.getElementById("file_type_drop").value != "json" 		      ||		//Is the JSON file generation active?
			document.getElementById("sel_file_drop").value.indexOf("range") <= -1 ||			//Is one of the 'range' options selected?
			document.getElementById("range_sphere_check").checked == false)					//Is the box "Visualize range sphere" ticked?
		{
			closest_script += "display default_displaygroup;";
		}
	}
	
	Jmol.script(mainJmol, closest_script);						       
}

function isc_label_handler()
{	
	var isc_plot_on = document.getElementById("isc_check").checked;
	var isc_tag = document.getElementById("isc_drop").value;
	var isc_min = 0.0;
	var isc_max = 0.0;

	var isc_atom = last_atom_picked;
	if ($('#isc_center_atom').prop('checked')) {
		isc_atom = Jmol.evaluateVar(mainJmol, '{default_displaygroup and ' + atom_set.isc_center + '}')[0]+1;
	}

	isc_plot_jmol_script = "measure delete;";

	// Label precision for couplings: default value is 2

	var prec = parseInt(document.getElementById("opt_coup_lab_prec").value);	
	prec = isNaN(prec)? 2 : prec;		// If it's NaN or something, use default value	

	if (isc_plot_on)
	{
		var isc_info = isc_info_eval(isc_atom, isc_tag);

		//Deactivate dipolar measures

		document.getElementById("dipolar_check").checked = false;

		//Find min and max

		if (document.getElementById("isc_min").disabled == true && document.getElementById("isc_max").disabled == true)
		{
			isc_min = NaN;
			isc_max = NaN;

			for (id in isc_info)
			{
				var isc = isc_info[id];
				if (isNaN(isc_min) || Math.abs(isc) < isc_min)
					isc_min = Math.abs(isc);
				if (isNaN(isc_max) || Math.abs(isc) > isc_max)
					isc_max = Math.abs(isc);
			}

			document.getElementById("isc_min").value = isc_min;
			document.getElementById("isc_max").value = isc_max;

			document.getElementById("isc_min").disabled = false;
			document.getElementById("isc_max").disabled = false;

		}
		else
		{
			isc_min = parseFloat(document.getElementById("isc_min").value);
			isc_max = parseFloat(document.getElementById("isc_max").value);
		}

		for (id in isc_info)
		{
			var isc = isc_info[id];

			if (Math.abs(isc) > isc_max || Math.abs(isc) < isc_min)
				continue;

			if (isc > 0)
				isc_plot_jmol_script += "color measure {128 255 0};";
			else
				isc_plot_jmol_script += "color measure {255 0 128};";

			isc_plot_jmol_script += "measure {*}[" + isc_atom + "] {*}[" + id + "] \"" + isc.toFixed(prec) + " Hz\";";

		}
	}
	else
	{
		document.getElementById("isc_min").disabled = true;
		document.getElementById("isc_max").disabled = true;
	}
	
	Jmol.script(mainJmol, isc_plot_jmol_script);
}

function isc_drop_handler()
{
	if (!$('#isc_fix_rng').prop('checked')) {
		document.getElementById("isc_min").disabled = true;
		document.getElementById("isc_max").disabled = true;
	}

	isc_label_handler();	
}

function isc_info_eval(a_num, tag)
{
	// First define the group of closest periodic copies to the atom a_num

	var aexpr = '{*}[' + a_num + ']';
	var fcoords = Jmol.evaluateVar(mainJmol, aexpr + '.fxyz');

	var fxmin = fcoords[0]-0.5; var fxmax = fcoords[0]+0.5;
	var fymin = fcoords[1]-0.5; var fymax = fcoords[1]+0.5;
	var fzmin = fcoords[2]-0.5; var fzmax = fcoords[2]+0.5;

	var closest = '{fx>'+fxmin+' and fx<='+fxmax+' and fy>'+fymin+' and fy<='+fymax+' and fz>'+fzmin+' and fz<='+fzmax+' and selected}';

	var isc_info_raw = Jmol.evaluate(mainJmol, "measure(" + aexpr + " " + closest + ", \"" + tag + "_hz\")").split('\n');
	var isc_info = {};	// An object is more convenient

	for (var j = 0; j < isc_info_raw.length; ++j)
	{
		if (isc_info_raw[j] == '')
			continue;
		isc_line = isc_info_raw[j].split('\t');
		if (parseFloat(isc_line[1]) == 0.0 || isNaN(parseFloat(isc_line[1])))
			continue;
		// In this way each isc_info element has  #number of the atom coupled with as key and isc intensity in Hz as value
		var key = parseInt(isc_line[4].split(' ')[1].replace('#',''));

		isc_info[key] =  parseFloat(isc_line[1]);
	}

	return isc_info;
}

function isc_minmax_handler()
{
	//This has the purpose of updating the various plots if needed when the min/max values are changed
	var isc_labels_on = document.getElementById("isc_check").checked;

	if (isc_labels_on == true)	
		isc_label_handler();	
}
