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
	
	dropd.options.length = atom_set.mag_isc_tagno;
	
	for(var i=1; i < atom_set.mag_isc_tagno; ++i)
	{
		dropd.options[i] = new Option("ISC_" + atom_set.mag_isc_tags_labels[i], atom_set.mag_isc_tags_labels[i]);
	}
	
}

function isc_plot_handler()
{
	var isc_plot_on = document.getElementById("isc_check").checked;
	var isc_labels_on = document.getElementById("isc_check_2").checked;
	var tagno = atom_set.mag_isc_tags[document.getElementById("isc_drop").value];
	var sel = document.getElementById("sel_drop").value;
	
	var graph_width = document.getElementById("opt_width").value; 
	
	var isc_plot_jmol_script = "";
	
	//Calculate a scale for the color of the connections
	//The color scale is : green for positive, magenta for negative, and the translucency is proportional to the intensity.
	//The translucency goes from 0.05 (almost solid) to 1 (invisible); the value for 0.05 is the absolute max between the most positive and the most negative values registered
	
	var isc_iso = new Array();
	var isc_iso_more_pos = 0;
	var isc_iso_more_neg = 0;
		
	for (var i = 0; i < atom_set.mag_isc[tagno].length; ++i)
	{
			var species1 = atom_set.atom_species[atom_set.mag_isc[tagno][i].sp1];
			var atom1 = atom_set.atoms[species1][atom_set.mag_isc[tagno][i].sp1_i-1];
			var species2 = atom_set.atom_species[atom_set.mag_isc[tagno][i].sp2];
			var atom2 = atom_set.atoms[species2][atom_set.mag_isc[tagno][i].sp2_i-1];

			var isc = atom_set.mag_isc[tagno][i].tens.r;
		
			isc_iso[i] = t2j_2_hertz((isc[0][0] + isc[1][1] + isc[2][2])/3, atom1.elem, atom2.elem);
		
		//Note: if present, J couplings of an atom with itself are ignored
		
		if((atom_set.mag_isc[tagno][i].sp1 == atom_set.mag_isc[tagno][i].sp2) && (atom_set.mag_isc[tagno][i].sp1_i == atom_set.mag_isc[tagno][i].sp2_i))
			continue;
				
		if (is_selected(atom_set.mag_isc[tagno][i].sp1, atom_set.mag_isc[tagno][i].sp1_i) || is_selected(atom_set.mag_isc[tagno][i].sp2, atom_set.mag_isc[tagno][i].sp2_i))
		{
						
			if (isc_iso[i] > isc_iso_more_pos)
			{
				isc_iso_more_pos = isc_iso[i];
			}

			if (isc_iso[i] < isc_iso_more_neg)
			{
				isc_iso_more_neg = isc_iso[i];
			}			
		}		
		else		
		{
		}
	}
			
	//If the range min-max text boxes are disabled, enable them and insert the proper values; otherwise, use their min-max values for the scale
	minbox = document.getElementById("isc_min");
	maxbox = document.getElementById("isc_max");
	
	if (isc_plot_on == true)
	{	
		if(minbox.disabled == true && maxbox.disabled == true) 
		{
			minbox.disabled = false;
			maxbox.disabled = false;
			minbox.value = Math.floor(isc_iso_more_neg*100)/100;   //Sorry for the ugly workaround, I wanted a bit more than integer precision but it's essential that these values
			maxbox.value = Math.ceil(isc_iso_more_pos*100)/100;				//don't get respectively bigger/smaller than the true minimum/maximum
		}	
		else
		{
			isc_iso_more_neg = minbox.value;
			isc_iso_more_pos = maxbox.value;
		}
	}
	else if(isc_plot_on == false && isc_labels_on == false)
	{
			minbox.value = 0;
			maxbox.value = 0;
			minbox.disabled = true;
			maxbox.disabled = true;
	}
	
	var scale_ratio = ((isc_iso_more_pos > Math.abs(isc_iso_more_neg))? 1.0/isc_iso_more_pos: Math.abs(1.0/isc_iso_more_neg));
	
	for (var t = 0; t < atom_set.mag_isc_tagno; ++t)
	{
		for (var i = 0; i < atom_set.mag_isc[t].length; ++i)
		{
			var species1 = atom_set.atom_species[atom_set.mag_isc[t][i].sp1];
			var atom1 = atom_set.atoms[species1][atom_set.mag_isc[t][i].sp1_i-1];
			var species2 = atom_set.atom_species[atom_set.mag_isc[t][i].sp2];
			var atom2 = atom_set.atoms[species2][atom_set.mag_isc[t][i].sp2_i-1];
			
			//Note: if present, J couplings of an atom with itself are ignored

			if((atom_set.mag_isc[t][i].sp1 == atom_set.mag_isc[t][i].sp2) && (atom_set.mag_isc[t][i].sp1_i == atom_set.mag_isc[t][i].sp2_i))
				continue;

			isc_plot_jmol_script += "draw isc_graphline_" + t + "_" + i;	

			if ((isc_plot_on == true) && (t == tagno) && (is_selected(atom_set.mag_isc[tagno][i].sp1, atom_set.mag_isc[tagno][i].sp1_i) || is_selected(atom_set.mag_isc[tagno][i].sp2, atom_set.mag_isc[tagno][i].sp2_i))) 
			{
				//Note: the sp_i indices in the isc objects are the indices as present in the .magres file, that is, they begin with 1. This is why we use [atom_set.mag_isc[tagno][i].sp1_i-1]
				//in the instruction above
									
				start_number1 = atom_set.starting_nums[species1];
				start_number2 = atom_set.starting_nums[species2];
				
				var transl = 1.0 - Math.abs(isc_iso[i])*scale_ratio;				
				
				/*This if condition should be redundant, as in theory, using 'translucent 1' should make the cylinder effectively transparent. And turns out it does - if I input it
				in Jmol's console. When used in the script, however, some bug causes it to show fully solid. Whatever. It is also extremely unlikely that one has a perfectly 0 coupling, 
				but I'd rather avoid the risk.
				
				This also handles the possibility that the cylinder is out of the plotting range - in which case, it'll be transl > 1 or transl < 0
				*/
				if (transl < 1 && transl >= 0)
				{				
					isc_plot_jmol_script += " cylinder {" + atom1.elem + (start_number1 + atom_set.mag_isc[tagno][i].sp1_i) + "} {" + atom2.elem + (start_number2 + atom_set.mag_isc[tagno][i].sp2_i) + "} " +
					"width " + graph_width + " color translucent " + transl + " ";
					
					if (isc_iso[i] >= 0)
					{
						isc_plot_jmol_script += "{96 192 0};";
					}
					else
					{
						isc_plot_jmol_script += "{192 0 96};";
					}
				}
				else
				{
					isc_plot_jmol_script += " delete;";
				}				
			}		
			else		
			{
				isc_plot_jmol_script += " delete;";
			}
		}
	}
		
	Jmol.script(mainJmol, isc_plot_jmol_script);
	isc_label_handler();
}


function isc_label_handler()
{
	var isc_labels_on = document.getElementById("isc_check_2").checked;
	var isc_plot_on = document.getElementById("isc_check").checked;
	var tagno = atom_set.mag_isc_tags[document.getElementById("isc_drop").value];
	var sel = document.getElementById("sel_drop").value;
	
	var isc_plot_jmol_script = "";
	
	isc_plot_jmol_script += "font echo 12 sans bold;";
	isc_plot_jmol_script += "font measure 12 sans bold;";
	
	var isc_iso = new Array();
	var isc_iso_more_pos = 0;
	var isc_iso_more_neg = 0;
		
	for (var i = 0; i < atom_set.mag_isc[tagno].length; ++i)
	{
			var species1 = atom_set.atom_species[atom_set.mag_isc[tagno][i].sp1];
			var atom1 = atom_set.atoms[species1][atom_set.mag_isc[tagno][i].sp1_i-1];
			var species2 = atom_set.atom_species[atom_set.mag_isc[tagno][i].sp2];
			var atom2 = atom_set.atoms[species2][atom_set.mag_isc[tagno][i].sp2_i-1];

			var isc = atom_set.mag_isc[tagno][i].tens.r;
		
		isc_iso[i] = t2j_2_hertz((isc[0][0] + isc[1][1] + isc[2][2])/3, atom1.elem, atom2.elem);
				
		//Note: if present, J couplings of an atom with itself are ignored
		
		if((atom_set.mag_isc[tagno][i].sp1 == atom_set.mag_isc[tagno][i].sp2) && (atom_set.mag_isc[tagno][i].sp1_i == atom_set.mag_isc[tagno][i].sp2_i))
			continue;
				
		if (is_selected(atom_set.mag_isc[tagno][i].sp1, atom_set.mag_isc[tagno][i].sp1_i) || is_selected(atom_set.mag_isc[tagno][i].sp2, atom_set.mag_isc[tagno][i].sp2_i))
		{
						
			if (isc_iso[i] > isc_iso_more_pos)
			{
				isc_iso_more_pos = isc_iso[i];
			}

			if (isc_iso[i] < isc_iso_more_neg)
			{
				isc_iso_more_neg = isc_iso[i];
			}			
		}		
		else		
		{
		}
	}
			
	//If the range min-max text boxes are disabled, enable them and insert the proper values; otherwise, use their min-max values for the scale
	minbox = document.getElementById("isc_min");
	maxbox = document.getElementById("isc_max");
	
	if (isc_labels_on == true)
	{	
		if(minbox.disabled == true && maxbox.disabled == true) 
		{
			minbox.disabled = false;
			maxbox.disabled = false;
			minbox.value = Math.floor(isc_iso_more_neg*100)/100;   //Sorry for the ugly workaround, but I wanted a bit more than integer precision but it's essential that these values
			maxbox.value = Math.ceil(isc_iso_more_pos*100)/100;				//don't get respectively bigger/smaller than the true minimum/maximum
		}	
		else
		{
			isc_iso_more_neg = minbox.value;
			isc_iso_more_pos = maxbox.value;
		}
	}
	else if (isc_plot_on == false && isc_labels_on == false) //Necessary to prevent disabling at the wrong moment
	{
			minbox.value = 0;
			maxbox.value = 0;
			minbox.disabled = true;
			maxbox.disabled = true;
	}
				
	for (var t = 0; t < atom_set.mag_isc_tagno; ++t)
	{
		for (var i = 0; i < atom_set.mag_isc[t].length; ++i)
		{
			var species1 = atom_set.atom_species[atom_set.mag_isc[t][i].sp1];
			var atom1 = atom_set.atoms[species1][atom_set.mag_isc[t][i].sp1_i-1];
			var species2 = atom_set.atom_species[atom_set.mag_isc[t][i].sp2];
			var atom2 = atom_set.atoms[species2][atom_set.mag_isc[t][i].sp2_i-1];
			
			var start_number1 = atom_set.starting_nums[species1];
			var start_number2 = atom_set.starting_nums[species2];

			//Note: if present, J couplings of an atom with itself are ignored
			
			if((atom_set.mag_isc[t][i].sp1 == atom_set.mag_isc[t][i].sp2) && (atom_set.mag_isc[t][i].sp1_i == atom_set.mag_isc[t][i].sp2_i))
				continue;

			if ((isc_labels_on == true) && (t == tagno) && (is_selected(atom_set.mag_isc[tagno][i].sp1, atom_set.mag_isc[tagno][i].sp1_i) || is_selected(atom_set.mag_isc[tagno][i].sp2, atom_set.mag_isc[tagno][i].sp2_i))) 
			{
				//Note: the sp_i indices in the isc objects are the indices as present in the .magres file, that is, they begin with 1. This is why we use [atom_set.mag_isc[tagno][i].sp1_i-1]
				//in the instruction above
								
				//Calculate position of label by finding a vector orthogonal to the one connecting the two atoms
				var ortho = new Array();
				var ortho_mod = 0; var e_i = 0;
				while (ortho_mod == 0)
				{
					var connect = [atom1.x-atom2.x, atom1.y-atom2.y, atom1.z-atom2.z];
					var t_vec = [0, 0, 0];
					t_vec[e_i] = 1;
					ortho = vec_xprod(connect, t_vec);
					ortho_mod = Math.sqrt(ortho[0]*ortho[0]+ortho[1]*ortho[1]+ortho[2]*ortho[2]);
					++e_i;		
				}
				
				ortho = vec_scale(ortho, 0.3/ortho_mod);
				
				var label_pos = new Array();
				label_pos[0] = (atom1.x+atom2.x)/2.0+ortho[0];
				label_pos[1] = (atom1.y+atom2.y)/2.0+ortho[1];
				label_pos[2] = (atom1.z+atom2.z)/2.0+ortho[2];
				
				var isc = atom_set.mag_isc[tagno][i].tens.r;
				isc_iso[i] = t2j_2_hertz((isc[0][0] + isc[1][1] + isc[2][2])/3, atom1.elem, atom2.elem);
				
				if (isc_iso[i] > isc_iso_more_pos	|| isc_iso[i] < isc_iso_more_neg)
				{
						isc_plot_jmol_script += "set echo isc_label_" + t + "_" + i + " off;";				
						if (t == tagno)
							isc_plot_jmol_script += "measure {" + atom1.elem + (start_number1 + atom_set.mag_isc[t][i].sp1_i) + "} {" + atom2.elem + (start_number2 + atom_set.mag_isc[t][i].sp2_i) +	"} delete;";								
							continue;
				}			
				
				var label_color = "";
														
				if (isc_iso[i] >= 0)
				{
					label_color = "{96 192 0}";
				}
				else
				{
					label_color = "{192 0 96}";
				}
										
				//If the graph connections are off, draw measures as a guide for the eye; otherwise, only text (echoes)
				if(isc_plot_on == false)
				{
					isc_plot_jmol_script += "set echo isc_label_" + t + "_" + i + " off;";
					isc_plot_jmol_script += "color measures " + label_color + ";";
					isc_plot_jmol_script += "measure {" + atom1.elem + (start_number1 + atom_set.mag_isc[t][i].sp1_i) + "} {" + atom2.elem + (start_number2 + atom_set.mag_isc[t][i].sp2_i) +	"} \"" +
					isc_iso[i].toFixed(2) + "\";";
				}
				else
				{
					isc_plot_jmol_script += "set echo isc_label_" + t + "_" + i + " {" + label_pos[0] + " " + label_pos[1] + " " + label_pos[2] + "}; color echo " + label_color + ";";										
					isc_plot_jmol_script += "echo " + isc_iso[i].toFixed(2) + ";";
					isc_plot_jmol_script += "measure {" + atom1.elem + (start_number1 + atom_set.mag_isc[t][i].sp1_i) + "} {" + atom2.elem + (start_number2 + atom_set.mag_isc[t][i].sp2_i) +	"} delete;";							
				}

			}		
			else
			{
				isc_plot_jmol_script += "set echo isc_label_" + t + "_" + i + " off;";				
				if (t == tagno)
					isc_plot_jmol_script += "measure {" + atom1.elem + (start_number1 + atom_set.mag_isc[t][i].sp1_i) + "} {" + atom2.elem + (start_number2 + atom_set.mag_isc[t][i].sp2_i) +	"} delete;";								
			}		

		}
	}
	
	Jmol.script(mainJmol, isc_plot_jmol_script);
}

function isc_drop_handler()
{
	isc_plot_handler();
	isc_label_handler();	
}

function isc_minmax_handler()
{
	//This has the purpose of updating the various plots if needed when the min/max values are changed
	var isc_plot_on = document.getElementById("isc_check").checked;
	var isc_labels_on = document.getElementById("isc_check_2").checked;
	
	if (isc_plot_on == true)
		isc_plot_handler();

	if (isc_labels_on == true)	
		isc_label_handler();	
}

function t2j_2_hertz(t2j, el1, el2)
{
	var iso1 = atom_set.atom_elems[el1];
	var iso2 = atom_set.atom_elems[el2];
	
	if (iso1 == 0 || iso2 == 0)
		return 0;
	
	return h_bar_planck/(2*Math.PI)*iso_table[el1][iso1].G*iso_table[el2][iso2].G*(1e33)*t2j;
}



