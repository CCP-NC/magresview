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
var current_theme = 'dark'; 		// Useful to keep this in a variable for the 2D NMR tool to check

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

// The base name for the Jmol applet
var jmolAppName = "mainJmol";

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
 readyFunction: appready_callback,
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
	console.log("Enabling NMR controls");
	
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
		document.getElementById("ms_ltype_reftable").disabled = false;
		document.getElementById("ms_shield_ref").disabled = false;
		document.getElementById("ms_ell_scale").disabled = false;
		document.getElementById("eultype1_ms").disabled = false;
		document.getElementById("eultype2_ms").disabled = false;
		document.getElementById("align_t_2").disabled = false;
		document.getElementById("nmr2d_butt").disabled = false;

		// Hide the disabled_div 
		$('#ms_disabled_div').css('display', 'none');
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
		document.getElementById("efg_ltype_5").disabled = false;
		document.getElementById("efg_ltype_6").disabled = false;
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

		// Hide the disabled_div 
		$('#efg_disabled_div').css('display', 'none');
	}
	
	if (atom_set.has_isc)
	{
		document.getElementById("isc_drop").disabled = false;
		document.getElementById("isc_check").disabled = false;
		isc_dropdown_update();

		// Hide the disabled_div 
		$('#isc_disabled_div').css('display', 'none');
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
			console.log("Disabling NMR controls");

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
			document.getElementById("ms_ltype_reftable").disabled = true;
			document.getElementById("ms_shield_ref").disabled = true;
			document.getElementById("ms_ell_scale").value = "0";
			document.getElementById("ms_ell_scale").disabled = true;
			document.getElementById("eultype1_ms").disabled = true;
			document.getElementById("eultype2_ms").disabled = true;
			document.getElementById("eultype1_ms").checked = true;
			document.getElementById("eultype2_ms").checked = true;
			document.getElementById("align_t_2").disabled = true;
			document.getElementById("nmr2d_butt").disabled = true;

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
			document.getElementById("efg_ltype_5").disabled = true;
			document.getElementById("efg_ltype_6").disabled = true;
			document.getElementById("efg_ell_scale").value = "0";
			document.getElementById("efg_ell_scale").disabled = true;
			document.getElementById("eultype1_efg").disabled = true;
			document.getElementById("eultype2_efg").disabled = true;
			document.getElementById("align_t_3").disabled = true;

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

			$('#ms_disabled_div').css('display',  'inline');
			$('#efg_disabled_div').css('display', 'inline');
			$('#isc_disabled_div').css('display', 'inline');


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

function appready_callback()
{
	//This serves the purpose of turning localization OFF
	//It's crucial because localized versions of Jmol will send different messages that won't be properly parsed by afterscript_callback
	Jmol.script(mainJmol, 'set languageTranslation OFF');
    // This one more line instead deactivates Jmol's default drop event catching, 
    // so that MagresView's will be always working, even if one drops on the applet
    $("#" + jmolAppName + "_appletdiv").off("drop");
    // And load the spin table
    load_spin_inJmol();
}

//This callback gets called when Jmol executes a line of script [with Jmol.script(...)]. The callback's purpose is to recognize when the script has been executed and provide the necessary actions.
//This proves to be often required as the Jmol scripts tend to be slow, and thus we need to handle asynchronously any action that has to be performed necessarily after their execution.
//A series of boolean global flags keeps track of what needs to be done.

function afterscript_callback(app, msg, scr_line)
{
	
	console.log(msg);
	console.log(scr_line);

	//If a console line has just been fed, and the command has been executed, check whether it altered the model
	//and if it did, disable NMR functionalities and clear atom_set data
	if (msg.indexOf("mview_console_command") > 0)
	{
		if(atom_set.atomno > 0)
		{
			var jmol_atomno = Jmol.evaluateVar(mainJmol, "{*}.length");
			if(jmol_atomno != atom_set.atomno)
			{
				disable_NMR_controls();
				reset_atom_set();
				alert("Console actions that alter the model will disable NMR functionalities.\nPlease reload your model.");
			}
		}		
		script_callback_flag_consoleline = false;
	}
	else if (msg.indexOf("displayed_change") > 0)
	{
		// A change in what is displayed
		global_state_machine.handle_change('display');
	}
	else if (msg.indexOf("selected_change") > 0)
	{	
		// A change in what is selected
		global_state_machine.handle_change('selection');
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
		
		// Automatic displaygroup setting
		$('#displ_def_type').prop('selectedIndex', 0);
		displ_def_submit(true);

		opt_theme_handler();	// Load the theme
		opt_jmol_theme_handler();

		get_atom_info();
		load_data_asproperty();

		sel_drop_update();
		ref_table_gen();		//Generates the shield reference table for output
		larmor_table_gen();		//Same for Larmor frequency

		enable_NMR_controls();

		halos_check_handler();	
		bonds_check_handler();		
		axes_check_handler();
		sticks_check_handler();
		euler_diff_calc_handler(); 	//Takes care also of setting the picking to measure distance

		// Initializing the state machine
		global_state_machine = new state_machine();

		q_units_choice_handler();
		t_conv_choice_handler();

		//Just to make sure that no one downloads a file belonging to another system
		$("#file_download").addClass("hidden");
		$("#eul_file_download").addClass("hidden");

		global_state_machine.handle_change('state');

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
	if (sel_drop_selected().length != 0)
	{
		document.getElementById("range_atom_picked").innerHTML = "" + atom.substring(atom.indexOf(':') + 1, atom.lastIndexOf(' '));
		last_atom_picked = parseInt(atom.substring(atom.lastIndexOf('#') + 1));
		global_state_machine.handle_change('state');
	}
	else
	{
		Jmol.script(mainJmol, "message 'selected_change';");
	}
}

// A convenient shortcut to get the name of the last atom picked

function last_atom_picked_name()
{
	return Jmol.evaluateVar(mainJmol, "{{*}[" + last_atom_picked + "]}.atomname");
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

// A convenient function that returns the index of a tab given its id

function tab_index(id) {
	return $(".tablink[href='" + id +  "']").parent().index()
}


