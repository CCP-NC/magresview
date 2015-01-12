//MagresView 
//by Simone Sturniolo
//
//Copyright 2013 Science and Technology Facilities Council
//This software is distributed under the terms of the GNU General Public License (GNU GPL)
//Please refer to the file COPYING for the text of the license

//Functions controlling the various possibilities present in the Options menu

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
			console.log(type);
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

function opt_lab_prec_handler(evt)
{
	// A handler for changes in precision, just needs to ask a replot if Enter was pressed

	//Compatibility code - see console.js for details
	var evt = window.event || evt;
	var myKey = (evt.keyCode)? evt.keyCode: evt.charCode;
	
	if (myKey == 13)	// ENTER key
	{
		evt.preventDefault();	
		plot_update();
	}
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

function opt_theme_handler()
{
	var theme = $('#opt_theme').val();

	// Change the color of the page
	$('body').removeClass("theme_light theme_dark");
	$('body').addClass("theme_" + theme);

	// Now on to changing the jQuery theme
	$('#jquery_theme').attr('href', 'jquery/css/theme_' + theme + '/jquery-ui.css');

	// Now the logos
	$('#stfc_logo').attr('src', 'images/' + theme + '/stfc_logo.png');
	$('#epsrc_logo').attr('src', 'images/' + theme + '/small_epsrc.png');

	// Now Jmol
	switch(theme)
	{
		case 'dark':
			Jmol.script(mainJmol, 'background black');
			break;
		case 'light':
			Jmol.script(mainJmol, 'background white');
			break;
	}

}