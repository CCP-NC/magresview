//MagresView 
//by Simone Sturniolo
//
//Copyright 2013 Science and Technology Facilities Council
//This software is distributed under the terms of the GNU General Public License (GNU GPL)
//Please refer to the file COPYING for the text of the license



//Updating the atom selection menu, built on the model of sel_drop_handler()

function vvleck_species_drop_handler()
{
	var el = document.getElementById("vvleck_species_drop").value;
	var dropd_atoms = document.getElementById("vvleck_atom_drop");

	var s = atom_set.atom_species[el];
	dropd_atoms.options.length = atom_set.atoms[s].length;
	for (var i = 0; i < dropd_atoms.options.length; ++i)
		dropd_atoms.options[i] = new Option(i+1, i+1);
	
	vvleck_sphere_handler();
	if (document.getElementById("dipolar_check").checked == true)
	{
		dip_label_clear();
		dip_label_handler();
	}
}

function vvleck_atom_drop_handler()
{
	vvleck_sphere_handler();
	if (document.getElementById("dipolar_check").checked == true)
	{
		dip_label_clear();
		dip_label_handler();
	}
}

//Updates the range sphere if ENTER was pressed in the radius textbox

function vvleck_r_handler(evt)
{
	//Compatibility code - see console.js for details
	var evt = window.event || evt;
	var myKey = (evt.keyCode)? evt.keyCode: evt.charCode;
	
	if (myKey == 13)
	{
		vvleck_sphere_handler();
	}
}

function hkl_field_handler(evt)
{
	//Compatibility code - see console.js for details
	var evt = window.event || evt;
	var myKey = (evt.keyCode)? evt.keyCode: evt.charCode;
	var h = parseFloat(document.getElementById("h_Hdir").value);
	var k = parseFloat(document.getElementById("k_Hdir").value);
	var l = parseFloat(document.getElementById("l_Hdir").value);


	if (myKey == 13)
	{
		if (document.getElementById("dipolar_check").checked == true)
		{
			//No need to clear since only numerical values will change
			dip_label_handler();
		}

	}	
}

function vvleck_sphere_handler()
{
	var sphere_script = " define default_displaygroup " + default_displaygroup + ";";
	sphere_script += "ellipsoid id dipolar_sphere_choice";
	
	//A bit of jQuery magic to check whether the active tab is the "Visualization" one. It just works.

	var tab_active = $("#main_tabs").tabs("option", "active");
	var acc_active = $("#visual_accordion").accordion("option", "active");
	if(((tab_active == tab_index("#visual_accordion") &&								//Is the Visualization tab active?
		acc_active == 3)							||					//Is the Dipolar coupling accordion section active?
		document.getElementById("dipolar_check").checked == true)		&&
		document.getElementById("vvleck_sphere_check").checked == true)							//Is the box "Visualize range sphere" ticked?
	{
		var r = parseFloat(document.getElementById("vvleck_r").value);		

		sphere_script += " axes {" + r + " 0 0} {0 " + r + " 0} {0 0 " + r + "} center {*}[" + last_atom_picked + "] color translucent 0.7 {200 200 200};";
		sphere_script += " display {default_displaygroup or within(" + r + ", ({*}[" + last_atom_picked + "]))};";
		sphere_script += " color {displayed and not default_displaygroup} translucent;"
	}
	else
	{
		sphere_script += " delete;";
		//To prevent erroneously deleting "range" ghosts
		if ($("#main_tabs").tabs("option", "active") != tab_index("#file_gen")    ||
			document.getElementById("file_type_drop").value != "json" 		      ||		//Is the JSON file generation active?
			document.getElementById("sel_file_drop").value.indexOf("range") <= -1 ||			//Is one of the 'range' options selected?
			document.getElementById("range_sphere_check").checked == false)					//Is the box "Visualize range sphere" ticked?
		{
			sphere_script += "display default_displaygroup;";
		}
	}
	
	Jmol.script(mainJmol, sphere_script);						       
}

function dip_label_handler()
{	
/*	Waiting for Jmol to implement this functionality
	
	var f_h = parseFloat(document.getElementById("h_Hdir").value);
	var f_k = parseFloat(document.getElementById("k_Hdir").value)
	var f_l = parseFloat(document.getElementById("l_Hdir").value);
	
	*/

	var dip_plot_on = document.getElementById('dipolar_check').checked;

	dip_plot_jmol_script = "color measure {0 230 230}; measure delete;";

	var r = parseFloat(document.getElementById("vvleck_r").value);

	if (dip_plot_on)
	{
		//Deactivate isc measures 
		document.getElementById("isc_check").checked = false;

		dip_plot_jmol_script += "measure all {*}[" + last_atom_picked + "] {selected and within(" + r + ", ({*}[" + last_atom_picked + "]))} \"2:%VALUE//khz\";";
	}

	Jmol.evaluateVar(mainJmol, 'script(\'' + dip_plot_jmol_script + '\');');
	//Jmol.scriptWait(mainJmol, dip_plot_jmol_script);
	
	// Added this part to insert the 2pi factor!
	
	dip_const = Jmol.getPropertyAsArray(mainJmol, "measurementInfo.strMeasurement");
	dip_plot_jmol_script_correct = "";
	
	
	for (var i = 0; i < dip_const.length; ++i) {
		dip_const[i] = parseFloat(dip_const[i])/(2.0*Math.PI);
		dip_plot_jmol_script_correct += 'script inline @{"select measure ({"+(' + i + ')+"})"};';
		dip_plot_jmol_script_correct += 'measure @{"2:"+' + dip_const[i] + '%2.2 +" kHz"};';
	}
	
	Jmol.script(mainJmol, dip_plot_jmol_script_correct);
	
	
}

function vvleck_eval(is_iso)
{

	var r = parseFloat(document.getElementById("vvleck_r").value);
	var name = Jmol.evaluate(mainJmol, "{*}[" + last_atom_picked + "].atomname");

	if (is_iso)
	{
		var el = Jmol.evaluate(mainJmol, "{*}[" + last_atom_picked + "].element");
		var couplings = Jmol.evaluate(mainJmol, "measure({*}[" + last_atom_picked + "] {_" + el + " and within(" + r + ", ({*}[" + last_atom_picked + "]))}, \"khz\");");
	}
	else
	{
		var couplings = Jmol.evaluate(mainJmol, "measure({*}[" + last_atom_picked + "] {within(" + r + ", ({*}[" + last_atom_picked + "]))}, \"khz\");");
	}

	var rss_dip = 0.0;

	couplings = couplings.split('\n');

	for(var c=0; c < couplings.length; ++c)
	{
		if (couplings[c] == '')
			continue;

		rss_dip += Math.pow(parseFloat(couplings[c].split('\t')[1]), 2.0);		

	}

	// Show the results
	document.getElementById("vvleck_popup").innerHTML = "RSS dipolar coupling calculated around:<br>";
	document.getElementById("vvleck_popup").innerHTML += name + "&nbsp;";
	document.getElementById("vvleck_popup").innerHTML += "with a cutoff of " + r + "&Aring;<br>";
	document.getElementById("vvleck_popup").innerHTML += "<br>";
	document.getElementById("vvleck_popup").innerHTML += "RSS coupling = " + Math.sqrt(rss_dip).toFixed(2) + " kHz<br>";
	
	$("#vvleck_popup").dialog("open");
}
