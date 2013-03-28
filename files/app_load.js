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
 isSigned: true,
 jarFile: "jmol/JmolAppletSigned.jar",
 jarPath: ".",
 memoryLimit: 512,
 readyFunction: null,
 script: "",
 serverURL: "http://chemapps.stolaf.edu/jmol/jmolcd.php",
 scriptCallback: "afterscript_callback",
 loadStructCallback: "afterload_callback",
 pickCallback: "pick_callback",
 src: null,
 use: "Java noWebGL noHTML5 noImage",
}   

Jmol.setDocument(false);
var mainJmol = Jmol.getApplet("mainJmol", main_info);

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

//NMR controls are by default disabled. They get enabled only if the related quantities have been properly loaded. They are disabled if:
//1. a non magres model is loaded
//2. an action is performed through the console that alters the model itself (e.g. an atom is deleted)

function enable_NMR_controls()
{
	document.getElementById("labels_check").disabled = false;

	if (atom_set.mag_ms.length != 0)
	{
		document.getElementById("ms_check").disabled = false;
		document.getElementById("ms_check_2").disabled = false;
		document.getElementById("ms_check_3").disabled = false;
		document.getElementById("ms_ltype_1").disabled = false;
		document.getElementById("ms_ltype_2").disabled = false;
		document.getElementById("ms_ltype_3").disabled = false;
		document.getElementById("ms_ltype_shield").disabled = false;
		document.getElementById("ms_shield_ref").disabled = false;
		document.getElementById("ms_pick_btn").disabled = false;
	}

	if (atom_set.mag_efg.length != 0)
	{
		document.getElementById("efg_drop").disabled = false;
		document.getElementById("efg_check").disabled = false;
		document.getElementById("efg_check_2").disabled = false;
		document.getElementById("efg_check_3").disabled = false;
		document.getElementById("efg_ltype_1").disabled = false;
		document.getElementById("efg_ltype_2").disabled = false;
		document.getElementById("efg_ltype_3").disabled = false;
		document.getElementById("efg_ltype_4").disabled = false;
		document.getElementById("efg_pick_btn").disabled = false;
		efg_dropdown_update();
	}
	
	if (atom_set.mag_isc.length != 0)
	{
		document.getElementById("isc_drop").disabled = false;
		document.getElementById("isc_check").disabled = false;
		document.getElementById("isc_check_2").disabled = false;
		isc_dropdown_update();
	}
	
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
			document.getElementById("halos_check").checked = false;
			document.getElementById("bonds_check").checked = true;
			document.getElementById("axes_check").checked = true;
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
			document.getElementById("ms_pick_btn").disabled = true;
			
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
			document.getElementById("efg_pick_btn").disabled = true;

			document.getElementById("isc_drop").disabled = true;
			document.getElementById("isc_check").checked = false;
			document.getElementById("isc_check").disabled = true;
			document.getElementById("isc_check_2").checked = false;
			document.getElementById("isc_check_2").disabled = true;

/*
			Part of the experimental "susceptibility" feature. Unused
			
			document.getElementById("sus_check").checked = false;
			document.getElementById("sus_check").disabled = true;
*/
}

//This callback gets called when Jmol executes a line of script [with Jmol.script(...)]. The callback's purpose is to recognize when the script has been executed and provide the necessary actions.
//This proves to be often required as the Jmol scripts tend to be slow, and thus we need to handle asynchronously any action that has to be performed necessarily after their execution.
//A series of boolean global flags keeps track of what needs to be done.

var script_callback_flag_consoleline = false;
var script_callback_flag_selectiondrop = false;

function afterscript_callback(app, msg, scr_line)
{
	
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
		
		//If the selected group has changed, wait for the new selection to take effect, and then update the plots
		if(script_callback_flag_selectiondrop == true)
		{
			//This is required in order to reset the maximum and minimum when replotting after a change of selection, or as a result the transparency scale will be wrong
			//(and potentially broken)
			document.getElementById("isc_min").disabled = true;
			document.getElementById("isc_max").disabled = true;

			plot_update();
			script_callback_flag_selectiondrop = false;
		}
		
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
		isc_plot_handler();
		
	if (document.getElementById("isc_check_2").checked == true)
		isc_label_handler();
}

//This callback executes once the loading of the file is complete (confirmed by state == 3). It executes all those parts of the program that depend on communication with the applet
//and thus require the model to be completely loaded to work well

function afterload_callback(id, url, fname, ftitle, error, state)
{
	if (state == 3)
	{
		atom_colors_load();
		atom_elems_load();
		elem_dropdown_update();
		
		halos_check_handler();	
		bonds_check_handler();		
		axes_check_handler();
		
		reset_pickings();
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
