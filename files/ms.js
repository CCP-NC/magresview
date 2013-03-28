//MagresView 
//by Simone Sturniolo
//
//Copyright 2013 Science and Technology Facilities Council
//This software is distributed under the terms of the GNU General Public License (GNU GPL)
//Please refer to the file COPYING for the text of the license

//This file handles the plotting of Magnetic Shieldings

function ms_plot_handler()
{
	var ms_plot_on = document.getElementById("ms_check").checked;
	var sel = document.getElementById("sel_drop").value;
	
	var transl = document.getElementById("opt_transl").value;

	var ms_plot_jmol_script = "";
	
	//This part serves the purpose of roughly estimating a size scale for the ellipsoids to print
	
	var avg_ms = 0;
	var avg_ms_n = 0;
		
	for (var i = 0; i < atom_set.mag_ms.length; ++i)
	{
		if (is_selected(atom_set.mag_ms[i].sp, atom_set.mag_ms[i].sp_i))
		{
			eigval = atom_set.mag_ms_symm_eigenvals[i];
						
			avg_ms += Math.sqrt(eigval[0]*eigval[0] + eigval[1]*eigval[1] + eigval[2]*eigval[2]);	
			avg_ms_n += 3;
		}		
		else		
		{
		}
	}
	
	avg_ms /= avg_ms_n;
	avg_radius = safe_jmolEvaluate(mainJmol, "{selected}.radius", 100);

	var scale_ratio = avg_radius/avg_ms*1.2; //Slightly bigger than the average atom
	
	for (var i = 0; i < atom_set.mag_ms.length; ++i)
	{
		var species = atom_set.atom_species[atom_set.mag_ms[i].sp];
		var atom = atom_set.atoms[species][atom_set.mag_ms[i].sp_i-1];
		
		ms_plot_jmol_script += "ellipsoid ms_ellipsoid_" + i;

		if ((ms_plot_on == true) && is_selected(atom_set.mag_ms[i].sp, atom_set.mag_ms[i].sp_i))
		{
			//Note: the sp_i indices in the ms objects are the indices as present in the .magres file, that is, they begin with 1. This is why we use [atom_set.mag_ms[i].sp_i-1]
			//in the instruction above
			
			start_number = atom_set.starting_nums[species];
			
			eigval = atom_set.mag_ms_symm_eigenvals[i];

			eigv_1 = vec_scale(atom_set.mag_ms_symm_eigenvect[i][0], eigval[0]*scale_ratio);
			eigv_2 = vec_scale(atom_set.mag_ms_symm_eigenvect[i][1], eigval[1]*scale_ratio);
			eigv_3 = vec_scale(atom_set.mag_ms_symm_eigenvect[i][2], eigval[2]*scale_ratio);
						
			ms_plot_jmol_script += " axes {" + eigv_1[0] + " " + eigv_1[1] + " " + eigv_1[2] + "} {" + eigv_2[0] + " " + eigv_2[1] + " " + eigv_2[2] + "} {" + eigv_3[0] + " " + eigv_3[1] + " " + eigv_3[2] + "} center {" +
			atom.elem + (start_number + atom_set.mag_ms[i].sp_i) + "} color translucent " + transl + " {192 96 0};";
		}		
		else		
		{
			ms_plot_jmol_script += " delete;";
		}
	}
		
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
	var sel = document.getElementById("sel_drop").value;

   var shielding_ref = 0;
	
	var l_type_radios = document.getElementsByName("ms_ltype");
	var l_type = 0;
	
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
	
	var ms_plot_jmol_script = "";
	
	ms_plot_jmol_script += "font echo 12 sans bold;";
	
	for (var i = 0; i < atom_set.mag_ms.length; ++i)
	{
		if ((ms_plot_on == true) && is_selected(atom_set.mag_ms[i].sp, atom_set.mag_ms[i].sp_i))
		{
			//Note: the sp_i indices in the magnetic shielding objects are the indices as present in the .magres file, that is, they begin with 1. This is why we use [atom_set.mag_ms[i].sp_i-1]
			//in the instruction above
			var species = atom_set.atom_species[atom_set.mag_ms[i].sp];
			var atom = atom_set.atoms[species][atom_set.mag_ms[i].sp_i-1];
			
			if (l_type >= 0)
			{
				ms_haeb = atom_set.mag_ms_haeb[i][l_type];
			}
			else
			{
				ms_haeb = shielding_ref - atom_set.mag_ms_haeb[i][0];
			}
						
			ms_plot_jmol_script += "set echo ms_label_" + i + " {" + (atom.x-0.4) + " " + (atom.y-0.4) + " " + atom.z + "}; color echo {255 128 0}; echo " + ms_haeb.toFixed(2) + ";";
		}
		else
		{
			ms_plot_jmol_script += "set echo ms_label_" + i + " off;";			
		}
	}
			
	Jmol.script(mainJmol, ms_plot_jmol_script);
}

function ms_color_handler()
{
	var ms_plot_on = document.getElementById("ms_check_3").checked;
	var sel = document.getElementById("sel_drop").value;
	
   var shielding_ref = 0;
	
	var l_type_radios = document.getElementsByName("ms_ltype");
	var l_type = 0;
	
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
	
	var ms_plot_jmol_script = "";

	//Disable efg color scale (two at the same time would only generate confusion...)
	if (ms_plot_on == true)
	{
		document.getElementById("efg_check_3").disabled = true;
	} else
	{
		document.getElementById("efg_check_3").disabled = false;
	}

	//Color all atoms in a bleak tone 
	
	ms_plot_jmol_script += "color {all} {200, 200, 200};";
	
	//Find the max and min ms_haeb value 
	var ms_haeb_max = NaN;
	var ms_haeb_min = NaN;
	
	for (var i = 0; i < atom_set.mag_ms.length; ++i)
	{

		if (l_type >= 0)
		{
			ms_haeb = atom_set.mag_ms_haeb[i][l_type];
		}
		else
		{
			ms_haeb = shielding_ref - atom_set.mag_ms_haeb[i][0];
		}
		
		if (is_selected(atom_set.mag_ms[i].sp, atom_set.mag_ms[i].sp_i))
		{
			if (isNaN(ms_haeb_max) && isNaN(ms_haeb_min))
			{
				ms_haeb_max = ms_haeb;
				ms_haeb_min = ms_haeb;
				continue;			
			}
			
			if(ms_haeb_max < ms_haeb)
			{
				ms_haeb_max = ms_haeb;
			}
			else if(ms_haeb_min > ms_haeb)
			{
				ms_haeb_min = ms_haeb;
			}
		}		
	}
		
	if (ms_plot_on == true)
	{
		for (var i = 0; i < atom_set.mag_ms.length; ++i)
		{
				if(is_selected(atom_set.mag_ms[i].sp, atom_set.mag_ms[i].sp_i))
				{
					//Note: the sp_i indices in the magnetic shielding objects are the indices as present in the .magres file, that is, they begin with 1. This is why we use [atom_set.mag_ms[i].sp_i-1]
					//in the instruction above
					var species = atom_set.atom_species[atom_set.mag_ms[i].sp];
					var atom = atom_set.atoms[species][atom_set.mag_ms[i].sp_i-1];

					if (l_type >= 0)
					{
						ms_haeb = atom_set.mag_ms_haeb[i][l_type];
					}
					else
					{
						ms_haeb = shielding_ref - atom_set.mag_ms_haeb[i][0];
					}

					var rgb_scale = color_scale((ms_haeb-ms_haeb_min)/(ms_haeb_max-ms_haeb_min));
										
					start_number = atom_set.starting_nums[species];					
					
					ms_plot_jmol_script += "color {" + atom.elem + (start_number + atom_set.mag_ms[i].sp_i) + "} {" + rgb_scale[0] + " " + rgb_scale[1] + " " + rgb_scale[2] + "};";
				}
				else
				{
				}
		}
	}
	else
	{
		//Restore original colors
		for (var s = 0; s < atom_set.atoms.length; ++s)
		{
			for (var a = 0; a < atom_set.atoms[s].length; ++a)
			{
				var el = atom_set.atoms[s][a].elem;
				var rgb = atom_set.atom_colors[el];
				ms_plot_jmol_script += "color {" + el + (atom_set.starting_nums[s] + a + 1) + "} {" + rgb[0] + " " + rgb[1] + " " + rgb[2] + "};";
			}
		}
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


