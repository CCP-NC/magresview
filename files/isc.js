//MagresView 
//by Simone Sturniolo
//
//Copyright 2013 Science and Technology Facilities Council
//This software is distributed under the terms of the GNU General Public License (GNU GPL)
//Please refer to the file COPYING for the text of the license

//This file handles the plotting of ISC couplings, aka J-couplings

//This function is called with the enable_NMR_controls method and updates the dropdown for efg tag selection

function isc_dropdown_update()
{
	var dropd = document.getElementById("isc_drop");
	
	dropd.options.length = atom_set.isc_tags.length;
	
	for(var i=0; i < atom_set.isc_tags.length; ++i)
	{
		dropd.options[i] = new Option(atom_set.isc_tags[i], atom_set.isc_tags[i]);
	}
}

function isc_label_handler()
{	
	var isc_plot_on = document.getElementById("isc_check").checked;
	var isc_tag = document.getElementById("isc_drop").value;
	var isc_min = 0.0;
	var isc_max = 0.0;

	isc_plot_jmol_script = "measure delete;";

	if (isc_plot_on)
	{
		var isc_info = isc_info_eval(Jmol.evaluate(mainJmol, "{{*}[" + last_atom_picked + "]}.atomname"), isc_tag);

		//Deactivate dipolar measures

		document.getElementById("dipolar_check").checked = false;

		//Find min and max

		if (document.getElementById("isc_min").disabled == true && document.getElementById("isc_max").disabled == true)
		{
			isc_min = NaN;
			isc_max = NaN;

			for (j in isc_info)
			{
				var isc = isc_info[j];
				if (isNaN(isc_min) || isc[1] < isc_min)
					isc_min = isc[1];
				if (isNaN(isc_max) || isc[1] > isc_max)
					isc_max = isc[1];
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

		for (j in isc_info)
		{
			var isc = isc_info[j];

			if (isc[1] > isc_max || isc[1] < isc_min)
				continue;

			if (isc[1] > 0)
				isc_plot_jmol_script += "color measure {128 255 0};";
			else
				isc_plot_jmol_script += "color measure {255 0 128};";

			isc_plot_jmol_script += "measure {*}[" + last_atom_picked + "] {selected and " + isc[0] + "} \"" + isc[1] + " Hz\";";

		}

		//isc_plot_jmol_script += "measure all {*}[" + last_atom_picked + "] {selected} \"2:%VALUE kHz//" + isc_tag + "_hz\";"
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
	document.getElementById("isc_min").disabled = true;
	document.getElementById("isc_max").disabled = true;

	isc_label_handler();	
}

function isc_info_eval(a_name, tag)
{
	var isc_info_raw = Jmol.evaluate(mainJmol, "measure({" + a_name + " and unitcell} {unitcell}, \"" + tag + "_hz\")").split('\n');
	var isc_info = []

	for (j in isc_info_raw)
	{
		if (isc_info_raw[j] == '')
			continue;

		isc_line = isc_info_raw[j].split('\t');
		if (parseFloat(isc_line[1]) == 0.0)
			continue;
		isc_info.push([(isc_line[4].split(' '))[0], parseFloat(isc_line[1])]);
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
