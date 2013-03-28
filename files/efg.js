//MagresView 
//by Simone Sturniolo
//
//Copyright 2013 Science and Technology Facilities Council
//This software is distributed under the terms of the GNU General Public License (GNU GPL)
//Please refer to the file COPYING for the text of the license

//This file handles the plotting of Electric Field Gradients

//This function is called with the enable_NMR_controls method and updates the dropdown for efg tag selection

function efg_dropdown_update()
{
	var dropd = document.getElementById("efg_drop");
	
	dropd.options.length = atom_set.mag_efg_tagno;
	
	for(var i=1; i < atom_set.mag_efg_tagno; ++i)
	{
		dropd.options[i] = new Option("EFG_" + atom_set.mag_efg_tags_labels[i], atom_set.mag_efg_tags_labels[i]);
	}
	
}

function efg_plot_handler()
{
	var efg_plot_on = document.getElementById("efg_check").checked;
	var tagno = atom_set.mag_efg_tags[document.getElementById("efg_drop").value];
	var sel = document.getElementById("sel_drop").value;
	
	var transl = document.getElementById("opt_transl").value;
	
	var efg_plot_jmol_script = "";
	
	//This part serves the purpose of roughly estimating a size scale for the ellipsoids to print
	
	var avg_efg = 0;
	var avg_efg_n = 0;
		
	for (var i = 0; i < atom_set.mag_efg[tagno].length; ++i)
	{
		if (is_selected(atom_set.mag_efg[tagno][i].sp, atom_set.mag_efg[tagno][i].sp_i))
		{
			eigval = atom_set.mag_efg_eigenvals[tagno][i];
	
			avg_efg += Math.sqrt(eigval[0]*eigval[0] + eigval[1]*eigval[1] + eigval[2]*eigval[2]); 
	
			avg_efg_n += 3;
		}		
		else		
		{
		}
	}
	
	avg_efg /= avg_efg_n;
	avg_radius = safe_jmolEvaluate(mainJmol, "{selected}.radius", 100);

	var scale_ratio = avg_radius/avg_efg*1.2; //Slightly bigger than the average atom

	for (var t = 0; t < atom_set.mag_efg_tagno; ++t)
	{	
		for (var i = 0; i < atom_set.mag_efg[t].length; ++i)
		{
			var species = atom_set.atom_species[atom_set.mag_efg[t][i].sp];
			var atom = atom_set.atoms[species][atom_set.mag_efg[t][i].sp_i-1];
			
			efg_plot_jmol_script += "ellipsoid efg_ellipsoid_" + t + "_" + i;	
	
			if ((efg_plot_on == true) && (t == tagno) && is_selected(atom_set.mag_efg[tagno][i].sp, atom_set.mag_efg[tagno][i].sp_i))
			{
				//Note: the sp_i indices in the efg objects are the indices as present in the .magres file, that is, they begin with 1. This is why we use [atom_set.mag_efg[tagno][i].sp_i-1]
				//in the instruction above
				
				start_number = atom_set.starting_nums[species];
				
				eigval = atom_set.mag_efg_eigenvals[tagno][i];
	
				eigv_1 = vec_scale(atom_set.mag_efg_eigenvect[tagno][i][0], eigval[0]*scale_ratio);
				eigv_2 = vec_scale(atom_set.mag_efg_eigenvect[tagno][i][1], eigval[1]*scale_ratio);
				eigv_3 = vec_scale(atom_set.mag_efg_eigenvect[tagno][i][2], eigval[2]*scale_ratio);
							
				efg_plot_jmol_script += " axes {" + eigv_1[0] + " " + eigv_1[1] + " " + eigv_1[2] + "} {" + eigv_2[0] + " " + eigv_2[1] + " " + eigv_2[2] + "} {" + eigv_3[0] + " " + eigv_3[1] + " " + eigv_3[2] + "} center {" +
				atom.elem + (start_number + atom_set.mag_efg[tagno][i].sp_i) + "} color translucent " + transl + " {0 96 192};";
			}		
			else		
			{
				efg_plot_jmol_script += " delete;";
			}
		}
	}	
	
	Jmol.script(mainJmol, efg_plot_jmol_script);			
}

function efg_label_handler()
{
	var efg_plot_on = document.getElementById("efg_check_2").checked;
	var tagno = atom_set.mag_efg_tags[document.getElementById("efg_drop").value];
	var sel = document.getElementById("sel_drop").value;
	
	var l_type_radios = document.getElementsByName("efg_ltype");
	var l_type = 0;
	
	for (var i = 0, length = l_type_radios.length; i < length; i++) {
		 if (l_type_radios[i].checked) {
		     l_type = parseInt(l_type_radios[i].value);
		 }
	}

	var efg_plot_jmol_script = "";

	efg_plot_jmol_script += "font echo 12 sans bold;";
	
	for (var t = 0; t < atom_set.mag_efg_tagno; ++t)
	{		
		for (var i = 0; i < atom_set.mag_efg[t].length; ++i)
		{
			if ((efg_plot_on == true) && (t == tagno) && is_selected(atom_set.mag_efg[tagno][i].sp, atom_set.mag_efg[tagno][i].sp_i))
			{
				//Note: the sp_i indices in the magnetic shielding objects are the indices as present in the .magres file, that is, they begin with 1. This is why we use [atom_set.mag_ms[i].sp_i-1]
				//in the instruction above
				var species = atom_set.atom_species[atom_set.mag_efg[tagno][i].sp];
				var atom = atom_set.atoms[species][atom_set.mag_efg[tagno][i].sp_i-1];
				
				if (l_type == 0)
					var efg_haeb = atom_set.mag_efg_eigenvals[tagno][i][2];
				else if (l_type == 3)
					var efg_haeb = vzz_2_chi(atom_set.mag_efg_eigenvals[tagno][i][2], atom.elem);
				else
					var efg_haeb = atom_set.mag_efg_haeb[tagno][i][l_type];				

				start_number = atom_set.starting_nums[species];
				
				efg_plot_jmol_script += "set echo efg_label_" + t + "_" + i + " {" + (atom.x+0.4) + " " + (atom.y+0.4) + " " + atom.z + "}; color echo {0 128 255}; echo " + efg_haeb.toFixed(2) + ";";
			}
			else
			{
				efg_plot_jmol_script += "set echo efg_label_" + t + "_" + i + " off;";
			}
		}
	}
			
	Jmol.script(mainJmol, efg_plot_jmol_script);
}

function efg_color_handler()
{
	var efg_plot_on = document.getElementById("efg_check_3").checked;
	var tagno = atom_set.mag_efg_tags[document.getElementById("efg_drop").value];
	var sel = document.getElementById("sel_drop").value;
	
	var l_type_radios = document.getElementsByName("efg_ltype");
	var l_type = 0;
	
	for (var i = 0, length = l_type_radios.length; i < length; i++) {
		 if (l_type_radios[i].checked) {
		     l_type = parseInt(l_type_radios[i].value);
		 }
	}

	var efg_plot_jmol_script = "";

	//Disable ms color scale (two at the same time would only generate confusion...)
	if (efg_plot_on == true)
	{
		document.getElementById("ms_check_3").disabled = true;
	} else
	{
		document.getElementById("ms_check_3").disabled = false;
	}

	//Color all atoms in a bleak tone 
	
	efg_plot_jmol_script += "color {all} {200, 200, 200};";
	
	//Find the max and min efg_mag value 
	var efg_haeb_max = NaN;
	var efg_haeb_min = NaN;
	
	for (var i = 0; i < atom_set.mag_efg[tagno].length; ++i)
	{
		if (l_type == 0)
			var efg_haeb = atom_set.mag_efg_eigenvals[tagno][i][2];
		else
			var efg_haeb = atom_set.mag_efg_haeb[tagno][i][l_type];				

		if (is_selected(atom_set.mag_efg[tagno][i].sp, atom_set.mag_efg[tagno][i].sp_i))
		{
			if (isNaN(efg_haeb_max) && isNaN(efg_haeb_min))
			{
				efg_haeb_max = efg_haeb;
				efg_haeb_min = efg_haeb;
				continue;			
			}
			
			if(efg_haeb_max < efg_haeb)
			{
				efg_haeb_max = efg_haeb;
			}
			else if(efg_haeb_min > efg_haeb)
			{
				efg_haeb_min = efg_haeb;
			}
		}		
	}
		
	if (efg_plot_on == true)
	{
		for (var t = 0; t < atom_set.mag_efg_tagno; ++t)
		{		
			for (var i = 0; i < atom_set.mag_efg[t].length; ++i)
			{
					if((t == tagno) && is_selected(atom_set.mag_efg[tagno][i].sp, atom_set.mag_efg[tagno][i].sp_i))
					{
//						alert(atom_set.mag_efg[tagno][i].sp_i);
						//Note: the sp_i indices in the magnetic shielding objects are the indices as present in the .magres file, that is, they begin with 1. This is why we use [atom_set.mag_ms[i].sp_i-1]
						//in the instruction above
						var species = atom_set.atom_species[atom_set.mag_efg[tagno][i].sp];
						var atom = atom_set.atoms[species][atom_set.mag_efg[tagno][i].sp_i-1];
						
						if (l_type == 0)
							var efg_haeb = atom_set.mag_efg_eigenvals[tagno][i][2];
						else
							var efg_haeb = atom_set.mag_efg_haeb[tagno][i][l_type];				

						if (efg_haeb_max != efg_haeb_min)
							var rgb_scale = color_scale((efg_haeb-efg_haeb_min)/(efg_haeb_max-efg_haeb_min));
						else
							var rgb_scale = color_scale(1);
											
						start_number = atom_set.starting_nums[species];					
						
						efg_plot_jmol_script += "color {" + atom.elem + (start_number + atom_set.mag_efg[tagno][i].sp_i) + "} {" + rgb_scale[0] + " " + rgb_scale[1] + " " + rgb_scale[2] + "};";
					}
					else
					{
					}
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
				efg_plot_jmol_script += "color {" + el + (atom_set.starting_nums[s] + a + 1) + "} {" + rgb[0] + " " + rgb[1] + " " + rgb[2] + "};";
			}
		}
	}
			
	Jmol.script(mainJmol, efg_plot_jmol_script);
}

function efg_drop_handler()
{
	efg_plot_handler();
	efg_label_handler();
	efg_color_handler();
}

function efg_radio_handler(event)
{
	efg_label_handler();
	efg_color_handler();
}

function vzz_2_chi(vzz, el)
{
	var iso = atom_set.atom_elems[el];
	
	if (iso == 0)
		return 0;
	
	return e_charge*iso_table[el][iso].Q*vzz*(9.71736e-7)/h_planck;
}
