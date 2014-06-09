//MagresView 
//by Simone Sturniolo
//
//Copyright 2013 Science and Technology Facilities Council
//This software is distributed under the terms of the GNU General Public License (GNU GPL)
//Please refer to the file COPYING for the text of the license

//This file contains all the instructions needed to load the main Jmol applet and Jmol related controls

//Standard windows size check
//The various lines are for compatibility with different browsers

var winW = 630, winH = 460;

var current_framework = "JS";

if (document.body && document.body.offsetWidth) {
 winW = document.body.offsetWidth;
 winH = document.body.offsetHeight;
}
if (document.compatMode=='CSS1Compat' &&
    document.documentElement &&
    document.documentElement.offsetWidth ) {
 winW = document.documentElement.offsetWidth;
 winH = document.documentElement.offsetHeight;
}
if (window.innerWidth && window.innerHeight) {
 winW = window.innerWidth;
 winH = window.innerHeight;
}

//The JMol applet's size is calculated on the basis of the window size. It is 95% of the size of the main_app division, which is 60% of the page in width and 80% of the page in height

var jmolW = Math.floor(0.6*0.95*winW);
var jmolH = Math.floor(0.8*0.95*winH);

//Main Jmol applet initialization

var main_info = {
 width: jmolW,
 height: jmolH,
 addSelectionOptions: false,
 color: "#000000",
 debug: false,
 defaultModel: "",
 j2sPath: "jsmol/j2s",
 jarPath: "jsmol/java",
 memoryLimit: 512,
 readyFunction: null,
 script: "",
 serverURL: "http://chemapps.stolaf.edu/jmol/jmolcd.php",
 scriptCallback: "afterscript_callback",
 loadStructCallback: "afterload_callback",
 messageCallback: "message_callback",
 echoCallback: "echo_callback", 
 pickCallback: "pick_callback",
 src: null,
 use: "noWebGL HTML5 noImage",
}

//This line prevents drag-and-dropping on the Jmol applet

Jmol._Applet.prototype._setDragDrop = function(){};

//These "safe" functions allow to extract information from the Jmol applet safely - i.e. without the applet lagging behind the javascript and causing weird behaviour

function safe_jmolEvaluate(id, expr, timeout)
{
	timeout += new Date().getTime(); //timeout is in milliseconds
	
	var ans = null;
	ans = Jmol.evaluate(id, expr);
	
	while ((ans==null) && new Date().getTime() < timeout); 
	
	return ans;
}

function safe_jmolGetPropertyAsArray(id, sKey, sValue, timeout)
{
	timeout += new Date().getTime(); //timeout is in milliseconds
	
	ans = [];
	ans = Jmol.getPropertyAsArray(id, sKey, sValue);
	
	while ((ans.length == 0) && new Date().getTime() < timeout);

	return ans;
}

//Evaluates a property for all atoms in the system and returns it in an array structure divided by species

function jmolEvaluate_each(id, prop)
{
	ans = []

	for (var s = 0; s < atom_set.atom_species_labels.length; ++s)
	{
		ans.push([])
		for (var a = 0; a < atom_set.atoms[s].length; ++a)
		{
			var atom_name = atom_set.atom_species_labels[s] + "_" + (a+1);
			ans[s].push(Jmol.evaluate(id, "{" + atom_name + "}." + prop));
		}
	}

	return ans;
}

//NMR controls are by default disabled. They get enabled only if the related quantities have been properly loaded. They are disabled if:
//1. a non magres model is loaded
//2. an action is performed through the console that alters the model itself (e.g. an atom is deleted)

function enable_NMR_controls()
{
	//reset_visualization_options();
	
	document.getElementById("labels_check").disabled = false;

	if (atom_set.has_ms)
	{
		document.getElementById("ms_check").disabled = false;
		document.getElementById("ms_check_2").disabled = false;
		document.getElementById("ms_check_3").disabled = false;
		document.getElementById("ms_ltype_1").disabled = false;
		document.getElementById("ms_ltype_2").disabled = false;
		document.getElementById("ms_ltype_3").disabled = false;
		document.getElementById("ms_ltype_shield").disabled = false;
		document.getElementById("ms_shield_ref").disabled = false;
		document.getElementById("ms_ell_scale").disabled = false;
		document.getElementById("eultype1_ms").disabled = false;
		document.getElementById("eultype2_ms").disabled = false;
		document.getElementById("align_t_2").disabled = false;
	}

	if (atom_set.has_efg)
	{
		document.getElementById("efg_drop").disabled = false;
		document.getElementById("efg_check").disabled = false;
		document.getElementById("efg_check_2").disabled = false;
		document.getElementById("efg_check_3").disabled = false;
		document.getElementById("efg_ltype_1").disabled = false;
		document.getElementById("efg_ltype_2").disabled = false;
		document.getElementById("efg_ltype_3").disabled = false;
		document.getElementById("efg_ltype_4").disabled = false;
		document.getElementById("efg_ell_scale").disabled = false;
		document.getElementById("eultype1_efg").disabled = false;
		document.getElementById("eultype2_efg").disabled = false;
		document.getElementById("align_t_3").disabled = false;
		if(!atom_set.has_ms)
		{
			document.getElementById("eultype1_efg").checked = true;
			document.getElementById("eultype2_efg").checked = true;
		}
		efg_dropdown_update();
	}
	
	if (atom_set.has_isc)
	{
		document.getElementById("isc_drop").disabled = false;
		document.getElementById("isc_check").disabled = false;
		isc_dropdown_update();
	}
	
	document.getElementById("dipolar_check").disabled = false;
	document.getElementById("vvleck_r").disabled = false;
	document.getElementById("vvleck_sphere_check").disabled = false;
	document.getElementById("vvleck_iso_eval").disabled = false;
	document.getElementById("vvleck_tot_eval").disabled = false;
	
	if (atom_set.has_ms || atom_set.has_efg)
		document.getElementById("euldiff_butt").disabled = false;

	if (atom_set.has_ms && atom_set.has_efg)
		document.getElementById("eultab_butt").disabled = false;

	/*
	
	Part of the experimental "susceptibility" feature. Unused
	
	if (atom_set.mag_sus.length != 0)
	{
		document.getElementById("sus_check").disabled = false;
	}
	
	*/

}

function disable_NMR_controls()
{
			document.getElementById("labels_check").checked = false;
			document.getElementById("labels_check").disabled = true;
			
			document.getElementById("ms_check").checked = false;
			document.getElementById("ms_check").disabled = true;
			document.getElementById("ms_check_2").checked = false;
			document.getElementById("ms_check_2").disabled = true;
			document.getElementById("ms_check_3").checked = false;
			document.getElementById("ms_check_3").disabled = true;
			document.getElementById("ms_ltype_1").disabled = true;
			document.getElementById("ms_ltype_2").disabled = true;
			document.getElementById("ms_ltype_3").disabled = true;
			document.getElementById("ms_ltype_shield").disabled = true;
			document.getElementById("ms_shield_ref").disabled = true;
			document.getElementById("ms_ell_scale").value = "0";
			document.getElementById("ms_ell_scale").disabled = true;
			document.getElementById("eultype1_ms").disabled = true;
			document.getElementById("eultype2_ms").disabled = true;
			document.getElementById("eultype1_ms").checked = true;
			document.getElementById("eultype2_ms").checked = true;
			document.getElementById("align_t_2").disabled = false;

			document.getElementById("efg_drop").disabled = true;
			document.getElementById("efg_check").checked = false;
			document.getElementById("efg_check").disabled = true;
			document.getElementById("efg_check_2").checked = false;
			document.getElementById("efg_check_2").disabled = true;
			document.getElementById("efg_check_3").checked = false;
			document.getElementById("efg_check_3").disabled = true;
			document.getElementById("efg_ltype_1").disabled = true;
			document.getElementById("efg_ltype_2").disabled = true;
			document.getElementById("efg_ltype_3").disabled = true;
			document.getElementById("efg_ltype_4").disabled = true;
			document.getElementById("efg_ell_scale").value = "0";
			document.getElementById("efg_ell_scale").disabled = true;
			document.getElementById("eultype1_efg").disabled = true;
			document.getElementById("eultype2_efg").disabled = true;
			document.getElementById("align_t_3").disabled = false;

			document.getElementById("isc_drop").disabled = true;
			document.getElementById("isc_check").checked = false;
			document.getElementById("isc_check").disabled = true;

			document.getElementById("dipolar_check").checked = false;
			document.getElementById("dipolar_check").disabled = true;
			document.getElementById("vvleck_r").value = "1";
			document.getElementById("vvleck_r").disabled = true;
			document.getElementById("vvleck_sphere_check").checked = true;
			document.getElementById("vvleck_sphere_check").disabled = true;
			document.getElementById("vvleck_iso_eval").disabled = true;
			document.getElementById("vvleck_tot_eval").disabled = true;

			document.getElementById("euldiff_butt").disabled = true;
			document.getElementById("eultab_butt").disabled = true;

/*
			Part of the experimental "susceptibility" feature. Unused
			
			document.getElementById("sus_check").checked = false;
			document.getElementById("sus_check").disabled = true;
*/
}

//This function embeds a few of the lines that previously were in "disable_NMR_controls". It resets the values of checkboxes etc. that have to do only with the way the model is plotted in general.

function reset_visualization_options() {
	
			if (typeof(load_as_molecule) == "boolean") {
				document.getElementById("ismol_check").checked = load_as_molecule;
			}
			else
			{
				document.getElementById("ismol_check").checked = false;				
			}
	
			if (typeof(use_selection_halos) == "boolean") {
				document.getElementById("halos_check").checked = use_selection_halos;
			}
			else
			{
				document.getElementById("halos_check").checked = false;
			}

			if (typeof(use_visible_bonds) == "boolean") {
				document.getElementById("bonds_check").checked = use_visible_bonds;
			}
			else
			{
				document.getElementById("bonds_check").checked = true;
			}
			
			if (typeof(use_sticks_and_balls) == "boolean") {
				document.getElementById("sticks_check").checked = use_sticks_and_balls;
			}
			else
			{
				document.getElementById("sticks_check").checked = true;				
			}
			
			if (typeof(use_axes_unitcell) == "boolean") {
				document.getElementById("axes_check").checked = use_axes_unitcell;
			}
			else
			{
				document.getElementById("axes_check").checked = true;
			}
			
			if (typeof(use_atom_labels) == "boolean") {
				document.getElementById("labels_check").checked = use_atom_labels;
			}
			else
			{
				document.getElementById("labels_check").checked = false;
			}
			
			if (typeof(use_unit_convention) == "number") {
				switch (use_unit_convention) {
					case 0:
						document.getElementById("t_conv_choice").value = "haeb";
						break;
					case 1:
						document.getElementById("t_conv_choice").value = "haeb_red";
						break;
					case 2:
						document.getElementById("t_conv_choice").value = "herber";
						break;
					default:
						document.getElementById("t_conv_choice").value = "haeb";
						break;						
				}
				t_conv_choice_handler();
			}
			else
			{
				document.getElementById("t_conv_choice").value = "haeb";
			}
			
}

//This callback gets called when Jmol executes a line of script [with Jmol.script(...)]. The callback's purpose is to recognize when the script has been executed and provide the necessary actions.
//This proves to be often required as the Jmol scripts tend to be slow, and thus we need to handle asynchronously any action that has to be performed necessarily after their execution.
//A series of boolean global flags keeps track of what needs to be done.

var script_callback_flag_consoleline = false;
var script_callback_flag_selectiondrop = false;

function afterscript_callback(app, msg, scr_line)
{
	
	console.log(msg);
	console.log(scr_line);

	if(msg == "Script completed")
	{
		//If a console line has just been fed, and the command has been executed, check whether it altered the model
		//and if it did, disable NMR functionalities and clear atom_set data
		if (script_callback_flag_consoleline == true)
		{
			if(atom_set.atomno > 0)
			{
				var jmol_atomno = safe_jmolEvaluate(mainJmol, "{*}.length", 1000);
				if(jmol_atomno != atom_set.atomno)
				{
					disable_NMR_controls();
					reset_atom_set();
					alert("Console actions that alter the model will disable NMR functionalities.\nPlease reload your model.");
				}
			}		
			script_callback_flag_consoleline = false;
		}
	}
	else if (msg.indexOf("atoms selected") > 0)
	{	
		//If the selected group has changed, wait for the new selection to take effect, and then update the plots
		//This is required in order to reset the maximum and minimum when replotting after a change of selection, or as a result the transparency scale will be wrong
		//(and potentially broken)
		document.getElementById("isc_min").disabled = true;
		document.getElementById("isc_max").disabled = true;

		plot_update();
		iso_drop_update();
		script_callback_flag_selectiondrop = false;
	}
	else if (msg.indexOf("atoms hidden") > 0)
	{
		sel_drop_handler(false);
	}
}

//Updates the plots when required 

function plot_update()
{
	if (document.getElementById("ms_check").checked == true)
		ms_plot_handler();

	if (document.getElementById("ms_check_2").checked == true)
		ms_label_handler();

	if (document.getElementById("ms_check_3").checked == true)
		ms_color_handler();

	if (document.getElementById("efg_check").checked == true)
		efg_plot_handler();

	if (document.getElementById("efg_check_2").checked == true)
		efg_label_handler();

	if (document.getElementById("efg_check_3").checked == true)
		efg_color_handler();

	if (document.getElementById("isc_check").checked == true)
		isc_label_handler();
		
	if (document.getElementById("dipolar_check").checked == true)
		dip_label_handler();

	if (document.getElementById("labels_check").checked == true)
		labels_check_handler();

}

//This callback executes once the loading of the file is complete (confirmed by state == 3). It executes all those parts of the program that depend on communication with the applet
//and thus require the model to be completely loaded to work well

function afterload_callback(id, url, fname, ftitle, error, state)
{
	if (state == 3)
	{
		switch (is_mol_crystal())
		{
			case 1:
				if (document.getElementById("ismol_check").checked == false)
				{
					default_displaygroup = default_displaygroup.replace(/cell/g, 'centroid');
					Jmol.script(mainJmol, "display " + default_displaygroup);
				}
				else
				{
					generate_molecular_dd();
					var unique_mols = Jmol.evaluateVar(mainJmol, 'unique_mols');
					
					default_displaygroup = "{";
					
					for (var i = 0; i < unique_mols.length; ++i) {
						default_displaygroup += " within(molecule, {*}[" + (unique_mols[i][0] + 1) + "]) ";
						if (i < unique_mols.length - 1) {
							default_displaygroup += "or";
						}
					}
					default_displaygroup += "}";
						
				}
				break;
			case -1:
				if (document.getElementById("ismol_check").checked == false)
				{
					default_displaygroup = 'all';
					Jmol.script(mainJmol, "display " + default_displaygroup);
				}
				else
				{
					generate_molecular_dd();
					var unique_mols = Jmol.evaluateVar(mainJmol, 'unique_mols');
					
					default_displaygroup = "{";
					
					for (var i = 0; i < unique_mols.length; ++i) {
						default_displaygroup += " within(molecule, {*}[" + (unique_mols[i][0] + 1) + "]) ";
						if (i < unique_mols.length - 1) {
							default_displaygroup += "or";
						}
					}
					default_displaygroup += "}";
						
				}
				break;
			case 0:
			default:
				break;
				
		}

		get_atom_info();
		load_data_asproperty();

		dropdown_update();

		enable_NMR_controls();

		halos_check_handler();	
		bonds_check_handler();		
		axes_check_handler();
		sticks_check_handler();
		euler_diff_calc_handler(); 	//Takes care also of setting the picking to measure distance

		vvleck_sphere_handler();
		
		q_units_choice_handler();
		t_conv_choice_handler();

		//Just to make sure that no one downloads a file belonging to another system
		$("#file_download").addClass("hidden");
		$("#eul_file_download").addClass("hidden");
	}
}

//Message callback

function message_callback(id, msg)
{
	if (msg.indexOf("Distance") >= 0)
	{
		msg = msg.split(" ");
		document.getElementById("meas_1").innerHTML = "" + msg[1];
		document.getElementById("meas_2").innerHTML = "" + msg[4];
		document.getElementById("meas_val").innerHTML = "" + parseFloat(msg[7]).toFixed(2);
	}
}

//Pick callback - keeps track of the last atom picked

var last_atom_picked = 1;

function pick_callback(id, atom, i)
{
	if (document.getElementById("sel_drop").value != "custom")
	{
		document.getElementById("range_atom_picked").innerHTML = "" + atom.substring(atom.indexOf(':') + 1, atom.lastIndexOf(' '));
		last_atom_picked = parseInt(atom.substring(atom.lastIndexOf('#') + 1));
		range_sphere_handler();
		vvleck_sphere_handler();
		dip_label_handler();
	}
}

//Generates a color scale from blue to red for plotting purposes

function color_scale(v)
{
	var r, g, b;
	
	if (v < 0)
		v = 0;
	if (v > 1)
		v = 1;
		
	if (v <= 0.5)
	{
		//linear interpolation between blue and green
		r = 0;
		if (v <= 0.25)
		{
			g = Math.floor(v/(0.5-v)*255);
			b = 255;
		}
		else
		{
			g = 255;
			b = Math.floor((0.5-v)/v*255);
		}
	}	

	if (v > 0.5)
	{
		//linear interpolation between blue and green
		b = 0;
		if (v <= 0.75)
		{
			r = Math.floor((v-0.5)/(1.0-v)*255);
			g = 255;
		}
		else
		{
			r = 255;
			g = Math.floor((1.0-v)/(v-0.5)*255);
		}
	}
	
	return [r, g, b];
}

function visual_accor_handler()
{
	euler_diff_calc_handler();
	vvleck_sphere_handler();
	download_link_handler();
	snap_download_link_handler();
}

//Handler for switching between Jmol and JSmol

function switch_handler(was_clicked) {
	
	current_state = window.location.search;
	
	if (was_clicked) {
		switch (current_state) {
			case "?_USE=SIGNED":
				window.location.search = "JS";
				current_framework = "JS";
				break;
			default:
				window.location.search = "?_USE=SIGNED";
				current_framework = "Java";
				break;
		}
	}
	else {
		switch (current_state) {
			case "?_USE=SIGNED":
				current_framework = "Java";
				break;
			default:
				current_framework = "JS";
				break;
		}

	}
	
	switch (current_framework)
	{
		case "JS":
			$(".switch_controldiv").css("left", 45);
			break;
		case "Java":
			$(".switch_controldiv").css("left", 0);
			break;
	}
	
	$(".switch_controldiv").html(current_framework);
	
	
	//A few adjustments required depending on which framework we are using
	
	switch (current_framework)
	{
		case "Java":
			$("#snap_w").attr("disabled", false);
			$("#snap_h").attr("disabled", false);
			break;
		case "JS":
			$("#snap_w").attr("disabled", true);
			$("#snap_h").attr("disabled", true);
			break;
		
	}
	
	
}


