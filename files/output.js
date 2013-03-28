//MagresView 
//by Simone Sturniolo
//
//Copyright 2013 Science and Technology Facilities Council
//This software is distributed under the terms of the GNU General Public License (GNU GPL)
//Please refer to the file COPYING for the text of the license

//This file contains all functions handling the output of files (either Overview text files or JSON ones) from MagresView

//Encapsulating function for file generation, opens a window and then calls the proper function to fill in its contents

function output_file_gen()
{
	var filetype = document.getElementById("file_type_drop").value;
	var out_window = window.open('', 'JMol file output');
	
	out_window.document.write("<title>JMol file output</title>");
	
	//The <pre> tags are required to make the page writable as if it was a .txt file
	out_window.document.write("<pre id=\"file_text\" style=\"white-space:pre-wrap\">");	
	
	switch (filetype)
	{
		case "recap":
			recap_file_gen(out_window);
			out_window.document.write("</pre>");
			out_window.document.close();
			break;
		case "json":
			json_file_gen(out_window);
			out_window.document.write("</pre>");
			out_window.document.close();
			out_window.getSelection().selectAllChildren(out_window.document);		//JSON document needs to be copied, so we select it all for convenience
			break;
	}
			
	out_window.focus();
}

//Activate xml format specific controls only when needed

function file_type_drop_handler()
{
	json_controls_switch();
}

//Make the range_file_div division visible if needed

function sel_file_drop_handler()
{
	var val = document.getElementById("sel_file_drop").value;
	var div = document.getElementById("range_file_div");
	
	if (val == "range" || val == "sel_range")
	{
		div.style.visibility="visible";
		document.getElementById("range_file_r").disabled = false;
		document.getElementById("range_file_species_drop").disabled = false;
		document.getElementById("range_file_atom_drop").disabled = false;
	}
	else
	{
		div.style.visibility="hidden";
		document.getElementById("range_file_r").disabled = true;
		document.getElementById("range_file_species_drop").disabled = true;
		document.getElementById("range_file_atom_drop").disabled = true;
	}
}

function json_controls_switch()
{
	var filetype = document.getElementById("file_type_drop").value;

	if (filetype == "json")
	{
		document.getElementById("soft_targ_drop").disabled = false;
		document.getElementById("ms_file_check").disabled = false;
		document.getElementById("efg_file_check").disabled = false;
		document.getElementById("isc_file_check").disabled = false;
		document.getElementById("dip_file_check").disabled = false;
		document.getElementById("sel_file_drop").disabled = false;
	}
	else
	{
		document.getElementById("soft_targ_drop").disabled = true;
		document.getElementById("ms_file_check").disabled = true;
		document.getElementById("efg_file_check").disabled = true;
		document.getElementById("isc_file_check").disabled = true;
		document.getElementById("dip_file_check").disabled = true;
		document.getElementById("sel_file_drop").disabled = true;
	}
	
}

//Updating the atom selection menu, built on the model of sel_drop_handler()

function range_file_species_drop_handler()
{
	var el = document.getElementById("range_file_species_drop").value;
	var dropd_atoms = document.getElementById("range_file_atom_drop");

	var s = atom_set.atom_species[el];
	dropd_atoms.options.length = atom_set.atoms[s].length;
	for (var i = 0; i < dropd_atoms.options.length; ++i)
		dropd_atoms.options[i] = new Option(i+1, i+1);
}

//A file format meant for readability

function recap_file_gen(win)
{
	var out = win.document;
	//This kind of file is meant to be a recap with readability as its main purpose. As such, it will be spaced and commented as much as possible
		
	//Header
	out.write("--------------   JMol Web - Summary file --------------\n");

	//Print total number of atoms
	out.write("\n% Number of atoms: " + atom_set.atomno + "\n");

	//Print crystallographic labels
	out.write("\n% Number of crystallographic labels: " + atom_set.speciesno + "\n");
	for (var i=0; i < atom_set.speciesno; ++i)
		out.write((i+1) + ":\t" + atom_set.atom_species_labels[i] + " => " + atom_set.atoms[i].length + " atoms\n"); 

	//Print elements
	out.write("\n% Number of elements: " + Object.keys(atom_set.atom_elems).length + "\n");
	i = 1;
	for (var elem in atom_set.atom_elems)
	{
		out.write(i + ":\t" + atom_set.atom_elems[elem] + elem + "\n");
		++i;
	}
	
	//If present, print isotropic magnetic shielding tensors
	if (atom_set.mag_ms.length != 0)
	{
		out.write("\n% Magnetic shielding data (symmetric component)\n")
		for (var i = 0; i < atom_set.mag_ms.length; ++i)
		{
			var sp_label = atom_set.mag_ms[i].sp;
			var atom_i = atom_set.mag_ms[i].sp_i;
			
			var eigval = atom_set.mag_ms_symm_eigenvals[i];
			
			var eigv_1 = atom_set.mag_ms_symm_eigenvect[i][0];
			var eigv_2 = atom_set.mag_ms_symm_eigenvect[i][1];
			var eigv_3 = atom_set.mag_ms_symm_eigenvect[i][2];

			var haeb = atom_set.mag_ms_haeb[i];
			
			//Write down atomic label
			out.write("\n" + sp_label + "\t" + atom_i + "   :\n");
			
			//Write down eigenvalues
			out.write("\nEigenvalues:\ns_1: " + eigval[0] + " ppm\ts_2: " + eigval[1] + " ppm\ts_3: " + eigval[2] + " ppm\n");
			
			//Write down eigenvectors
			out.write("\nEigenvectors:");
			out.write("\n\t|" + eigv_1[0] + "\t|\t\t|" + eigv_2[0] + "\t|\t\t|" + eigv_3[0] + "\t|");
			out.write("\ne_1=\t|" + eigv_1[1] + "\t|\te_2=\t|" + eigv_2[1] + "\t|\te_3=\t|" + eigv_3[1] + "\t|");
			out.write("\n\t|" + eigv_1[2] + "\t|\t\t|" + eigv_2[2] + "\t|\t\t|" + eigv_3[2] + "\t|\n");
			
			//Write down Haeberlen parameters
			out.write("\nHaeberlen parameters:\ns_iso: " + haeb[0] + " ppm\t\taniso: " + haeb[1] + " ppm\t\tasymm: " + haeb[2] + "\n");			
			
			//Dividing line
			out.write("\n\n--------------------------------------------------------------------------------------\n\n");			
		}
	}
	
	//If present, print electric field gradient tensors
	if (atom_set.mag_efg.length != 0)
	{
		out.write("\n% Electric field gradient and quadrupole constant data\n")

		for (var t = 0; t < atom_set.mag_efg_tagno; ++t)
		{
			out.write("\nEFG component: " + atom_set.mag_efg_tags_labels[t] + "\n");
			
			for (var i = 0; i < atom_set.mag_efg[t].length; ++i)
			{
				var sp_label = atom_set.mag_efg[t][i].sp;
				var atom_i = atom_set.mag_efg[t][i].sp_i;
				
				var eigval = atom_set.mag_efg_eigenvals[t][i];
				
				var eigv_1 = atom_set.mag_efg_eigenvect[t][i][0];
				var eigv_2 = atom_set.mag_efg_eigenvect[t][i][1];
				var eigv_3 = atom_set.mag_efg_eigenvect[t][i][2];
	
				var haeb = atom_set.mag_efg_haeb[t][i];
				
				//Write down atomic label
				out.write("\n" + sp_label + "\t" + atom_i + "   :\n");
				
				//Write down eigenvalues
				out.write("\nEigenvalues:\ns_1: " + eigval[0] + " au\ts_2: " + eigval[1] + " au\ts_3: " + eigval[2] + " au\n");
				
				//Write down eigenvectors
				out.write("\nEigenvectors:");
				out.write("\n\t|" + eigv_1[0] + "\t|\t\t|" + eigv_2[0] + "\t|\t\t|" + eigv_3[0] + "\t|");
				out.write("\ne_1=\t|" + eigv_1[1] + "\t|\te_2=\t|" + eigv_2[1] + "\t|\te_3=\t|" + eigv_3[1] + "\t|");
				out.write("\n\t|" + eigv_1[2] + "\t|\t\t|" + eigv_2[2] + "\t|\t\t|" + eigv_3[2] + "\t|\n");
				
				//Write down Haeberlen parameters
				out.write("\nHaeberlen parameters:\naniso: " + haeb[1] + " au\t\tasymm: " + haeb[2] + "\n");
				
				//Write down quadrupolar constant
				out.write("\nQuadrupolar frequency:\nQ: " + vzz_2_chi(eigval[2], atom_set.atoms[atom_set.atom_species[sp_label]][atom_i-1].elem) + " Hz\n");
				
				//Dividing line
				out.write("\n\n--------------------------------------------------------------------------------------\n\n");			
			}
		}
	}
	
	//If present, print internal spin-spin couplings
	if (atom_set.mag_isc.length != 0)
	{
		out.write("\n% Internal spin-spin coupling data\n")
		
		for (var t = 0; t < atom_set.mag_isc_tagno; ++t)
		{
			out.write("\nISC component: " + atom_set.mag_isc_tags_labels[t] + "\n");
			
			for (var i = 0; i < atom_set.mag_isc[t].length; ++i)
			{
				var sp1_label = atom_set.mag_isc[t][i].sp1;
				var atom1_i = atom_set.mag_isc[t][i].sp1_i;
				var sp2_label = atom_set.mag_isc[t][i].sp2;
				var atom2_i = atom_set.mag_isc[t][i].sp2_i;
				
				var isc = atom_set.mag_isc[t][i].tens.r;
				
				//Convert tensor to Hertz
				for (var j = 0; j < isc.length; ++ j)
				{
					for (var k = 0; k < isc[j].length; ++k)
					{
						isc[j][k] = t2j_2_hertz(isc[j][k], atom_set.atoms[atom_set.atom_species[sp1_label]][atom1_i-1].elem, atom_set.atoms[atom_set.atom_species[sp2_label]][atom2_i-1].elem);
					}
				}
				
				//Write down atomic labels
				out.write("\n" + sp1_label + "\t" + atom1_i + "\t<==>\t" + sp2_label + "\t" + atom2_i + ":\n");

				//Write down coupling tensor
				out.write("\nCoupling tensor:");
				out.write("\n\t|" + isc[0][0] + "\t" + isc[0][1] + "\t" + isc[0][2] + "\t|");
				out.write("\nJ:\t|" + isc[1][0] + "\t" + isc[1][1] + "\t" + isc[1][2] + "\t|\tHz");
				out.write("\n\t|" + isc[2][0] + "\t" + isc[2][1] + "\t" + isc[2][2] + "\t|\n");
				
				//Write down isotropic coupling
				out.write("\nIsotropic coupling:");
				out.write("\nJ_iso:\t" + (isc[0][0]+isc[1][1]+isc[2][2])/3 + " Hz\n");			
				
				//Dividing line
				out.write("\n\n--------------------------------------------------------------------------------------\n\n");			
			}
		}
	
	}
}

//A file format optimized for transferring data to a Python script

function json_file_gen(win)
{
	//A dataset containing all necessary quantities is generated, so that it might be imported later in a Python script
	//Though similar, it is different from atom_set since it's organized with a different logic (for example, there are no longer any crystallographic labels)
	//Besides that, all references to functions are eliminated since this is just meant to be a storage structure
	
	var out = win.document;
	
	var data_set = {
		
		soft_targ: "", //Software target of the JSON file, the final format to be generated for NMR simulation
		
		atomno: 0, //Total number of atoms
		
		atom_elems: [], //Will contain the elements of the various atoms, atom per atom
		
		atom_isos: [], //Will contain the isotopes of the various atoms, atom per atom

		atom_coords: [], //Will hold arrays containing coordinates for the various atoms
				
		efg: [], 	//Will hold haeberlen variables and euler angles for total electric field gradient
		
		ms: [],		//Will hold haeberlen variables and euler angles for total magnetic shielding (symmetric)
		
		isc: [], 	//Array of arrays, with a triangular structure (isc[1][0], isc[2][0], isc[2][1], etc., with isc[0] conventionally set to null) holding J couplings
		
		dip: [], 	//Array of arrays, as above, for dipolar couplings
					
	};
	
	//This structure holds the parameters controlling the choice of atoms to use for the file
	
	var atom_choice = {
		
		t: document.getElementById("sel_file_drop").value,	//Type of choice
		
		r: parseFloat(document.getElementById("range_file_r").value),	//Radius (for "atoms within...")
		
		s: atom_set.atom_species[document.getElementById("range_file_species_drop").value],	//Central atom species (for "atoms within...")
				
		a: parseInt(document.getElementById("range_file_atom_drop").value)-1,		//Central atom number (for "atoms within...")
		
	}
	
	if(!compile_data_set(data_set, atom_choice))
	{
		win.close();
		return;
	}

	var to_write = JSON.stringify(data_set);
	
	out.write(to_write);
	
}

//Check if an atom is to be represented or not within the current choice
//Note: an atom and all its periodic images have the same s and a identifiers. Therefore, to tell them apart, we use k_a, k_b and k_c.
//The loop controlling k_a, k_b and k_c works only if the range option is selected - this is handled in compile_data_set().

function is_in_choice(s, a, ac, k_a, k_b, k_c)
{
	switch(ac.t)
	{
		case "all":
			return true;
			break;
		case "sel":
			if (is_selected(atom_set.atom_species_labels[s], a))
				return true;
			else
				return false;
			break;
		case "range":
		case "sel_range":			
			if(ac.t == "sel_range" && !is_selected(atom_set.atom_species_labels[s], a))
				return false;
			var abc = atom_set.lattice_pars.r;
			var x_d = atom_set.atoms[s][a].x + k_a*abc[0][0] + k_b*abc[1][0] + k_c*abc[2][0] - atom_set.atoms[ac.s][ac.a].x;
			var y_d = atom_set.atoms[s][a].y + k_a*abc[0][1] + k_b*abc[1][1] + k_c*abc[2][1]- atom_set.atoms[ac.s][ac.a].y;	
			var z_d = atom_set.atoms[s][a].z + k_a*abc[0][2] + k_b*abc[1][2] + k_c*abc[2][2]- atom_set.atoms[ac.s][ac.a].z;
			var dist = Math.sqrt(x_d*x_d+y_d*y_d+z_d*z_d);
			if (!isNaN(ac.r) && dist <= ac.r)
				return true;
			else
				return false;
			break;
		default:
			break;		
	}
	
	return false;
}

//Fill in the data_set with the required atoms

function compile_data_set(ds, ac)
{
	var eul_conv = "zyz"; //May be changed in future
	
	ds.soft_targ = document.getElementById("soft_targ_drop").value;
	
	var atom_n = 0;    //All atoms in data_set will be simply ordered by an increasing number, no crystallographic labels
	var atom_map = []; //For the sake of speed, a map which correlates species numbers and indices to the corresponding value of atom_n
	
	var abc = atom_set.lattice_pars.r;	//Storing the lattice parameters for convenience 
	var k_a_max = 0; var k_b_max = 0; var k_c_max = 0; //Maximum values of k_a, k_b, k_c at which one has to search for periodic images of a certain atom. Only matters for the range option
	
	if (ac.t.indexOf("range") > -1) //That is, if one of the "range" options is selected...
	{
		// The maximum indices along the three unit cell directions are defined as the ratio between the radius ( = maximum possible distance of interest) and the component of, respectively, a, b or c
		//	along the direction of the vector product of the other two. This corresponds to the shortest distance between two walls of the unit cell. The result is rounded to the next integer.
		 
		k_a_max = Math.ceil(ac.r*vec_module(vec_xprod(abc[1], abc[2]))/Math.abs(vec_dotprod(abc[0], vec_xprod(abc[1], abc[2]))));
		k_b_max = Math.ceil(ac.r*vec_module(vec_xprod(abc[2], abc[0]))/Math.abs(vec_dotprod(abc[1], vec_xprod(abc[2], abc[0]))));
		k_c_max = Math.ceil(ac.r*vec_module(vec_xprod(abc[0], abc[1]))/Math.abs(vec_dotprod(abc[2], vec_xprod(abc[0], abc[1]))));
	}
	
	//Security block, to prevent jamming
	if (atom_set.atomno*k_a_max*k_b_max*k_c_max > 500)
	{
		var to_do = confirm("The inserted value of range is very big. The execution of this command could cause severe slow down and other problems.\nDo you want to proceed?");
		if (!to_do)
			return false;
	}
	
	for (var s = 0; s < atom_set.atoms.length; ++s)
	{
		
		atom_map[s] = [];
		
		for (var a = 0; a < atom_set.atoms[s].length; ++a)
		{
			
			atom_map[s][a] = [];
			
			for (var k_a = -k_a_max; k_a <= k_a_max; ++k_a)
			{

				atom_map[s][a][k_a+k_a_max] = [];	//Annoying but necessary as negative indices are not
				
				for (var k_b = -k_b_max; k_b <= k_b_max; ++k_b)
				{	
					
					atom_map[s][a][k_a+k_a_max][k_b+k_b_max] = [];

					for (var k_c = -k_c_max; k_c <= k_c_max; ++k_c)
					{
						if (is_in_choice(s, a, ac, k_a, k_b, k_c))
						{
							atom_map[s][a][k_a+k_a_max][k_b+k_b_max][k_c+k_c_max] = atom_n;
							ds.atom_elems[atom_n] = atom_set.atoms[s][a].elem;
							ds.atom_isos[atom_n] = atom_set.atom_elems[ds.atom_elems[atom_n]];
							ds.atom_coords[atom_n] = [atom_set.atoms[s][a].x+k_a*abc[0][0]+k_b*abc[1][0]+k_c*abc[2][0],				//Coordinates include of course the periodicity
															  atom_set.atoms[s][a].y+k_a*abc[0][1]+k_b*abc[1][1]+k_c*abc[2][1],
															  atom_set.atoms[s][a].z+k_c*abc[0][2]+k_b*abc[1][2]+k_c*abc[2][2]];
						
							++atom_n;
						}
						else
						{
							//A value of -1 is used as a flag to indicate that the selected atom is NOT to pe inserted in the file
							
							atom_map[s][a][k_a+k_a_max][k_b+k_b_max][k_c+k_c_max] = -1;
						}
					}
				}
			}
		}
	}
	
	ds.atomno = atom_n;
		
	//Initialize everything to zero
	
	for (var i = 0; i < ds.atomno; ++i)
	{

		ds.ms[i] = 0;
		ds.efg[i] = 0;
		ds.dip[i] = [];
		ds.isc[i] = [];		
		ds.dip[i][0] = 0;
		ds.isc[i][0] = 0;		

		for (var j = 1; j < i; ++j)
		{
				ds.dip[i][j] = 0;
				ds.isc[i][j] = 0;
		}
	}	
		
	//If required, cycle through magnetic shieldings
	
	if (document.getElementById("ms_file_check").checked == true && atom_set.mag_ms.length > 0)
	{
		for (var i = 0; i < atom_set.mag_ms.length; ++i)
		{
			var s = atom_set.atom_species[atom_set.mag_ms[i].sp];
			var a = atom_set.mag_ms[i].sp_i-1;
			var euler_angs = euler_diff(atom_set.mag_ms_symm_eigenvect[i][0], atom_set.mag_ms_symm_eigenvect[i][1], atom_set.mag_ms_symm_eigenvect[i][2], [1, 0, 0], [0, 1, 0], [0, 0, 1], eul_conv);
			//Contents to store: [isotropic value, anisotropy, asimmetry, alpha, beta, gamma]
			var to_store = [atom_set.mag_ms_haeb[i][0], 2.0/3.0*atom_set.mag_ms_haeb[i][1], atom_set.mag_ms_haeb[i][2], rad2deg(euler_angs[0]), rad2deg(euler_angs[1]), rad2deg(euler_angs[2])];
			
			for (var k_a = -k_a_max; k_a <= k_a_max; ++k_a)
			{
				for (var k_b = -k_b_max; k_b <= k_b_max; ++k_b)
				{
					for (var k_c = -k_c_max; k_c <= k_c_max; ++k_c)
					{
						var ms_n = atom_map[s][a][k_a+k_a_max][k_b+k_b_max][k_c+k_c_max];				
						if (ms_n > -1)
						{							
							ds.ms[ms_n] = to_store;
						}
					}
				}
			}									
		}
	}
	
	//If required, cycle through electric field gradients
	
	if (document.getElementById("efg_file_check").checked == true && atom_set.mag_efg.length > 0)
	{
		for (var i = 0; i < atom_set.mag_efg[0].length; ++i)
		{
			var s = atom_set.atom_species[atom_set.mag_efg[0][i].sp];
			var a = atom_set.mag_efg[0][i].sp_i-1;
			var euler_angs = euler_diff(atom_set.mag_efg_eigenvect[0][i][0], atom_set.mag_efg_eigenvect[0][i][1], atom_set.mag_efg_eigenvect[0][i][2], [1, 0, 0], [0, 1, 0], [0, 0, 1], eul_conv);
			//Contents to store: [quadrupole constant in Hz, asimmetry, alpha, beta, gamma]
			var to_store = [vzz_2_chi(atom_set.mag_efg_eigenvals[0][i][2], ds.atom_elems[efg_n]), atom_set.mag_efg_haeb[0][i][2], rad2deg(euler_angs[0]), rad2deg(euler_angs[1]), rad2deg(euler_angs[2])];

			for (var k_a = -k_a_max; k_a <= k_a_max; ++k_a)
			{
				for (var k_b = -k_b_max; k_b <= k_b_max; ++k_b)
				{
					for (var k_c = -k_c_max; k_c <= k_c_max; ++k_c)
					{
						var efg_n = atom_map[s][a][k_a+k_a_max][k_b+k_b_max][k_c+k_c_max];			
						if (efg_n > -1)
						{		
							ds.efg[efg_n] = to_store;
						}
					}
				}
			}									
		}
	}
		
	//If required, add dipolar couplings
	
	if (document.getElementById("dip_file_check").checked == true)
	{
		for (var i = 1; i < ds.atomno; ++i)
		{
			for (var j = 0; j < i; ++j)
			{
				//First: calculate dipolar constant between atoms i and j
				var r = [ds.atom_coords[i][0]-ds.atom_coords[j][0], ds.atom_coords[i][1]-ds.atom_coords[j][1], ds.atom_coords[i][2]-ds.atom_coords[j][2]];
				var dist = vec_module(r);
				var el_i = ds.atom_elems[i]; var iso_i = ds.atom_isos[i];
				var el_j = ds.atom_elems[i]; var iso_j = ds.atom_isos[i];
				var b = -iso_table[el_i][iso_i].G*1e7*iso_table[el_j][iso_j].G*1e7*1.0e-7*h_bar_planck/Math.pow(dist*1e-10, 3); //All in SI units. Keep in mind that Simpson wants b/2Pi
				
				//Second: calculate principal axes
				//Axis z is easy, it's the connecting vector r
				var eig_z = vec_scale(r, 1.0/dist);
				//Axes x and y can be anything as long as they are orthogonal to z and between themselves
				var eig_x = vec_scale([-eig_z[1], eig_z[0], 0], Math.sqrt(eig_z[0]*eig_z[0]+eig_z[1]*eig_z[1])); 
				var eig_y = vec_xprod(eig_x, eig_z); eig_y = vec_scale(eig_y, 1.0/vec_module(eig_y));
				
				//Third: find euler angles for principal axes
				var euler_angs = euler_diff(eig_x, eig_y, eig_z, [1, 0, 0], [0, 1, 0], [0, 0, 1], eul_conv);
				
				//Finally, save everything
				ds.dip[i][j] = [b, rad2deg(euler_angs[0]), rad2deg(euler_angs[1]), rad2deg(euler_angs[2])];		
			}
		}
	}
	
	//If required, add indirect spin-spin couplings
	
	if (document.getElementById("isc_file_check").checked == true && atom_set.mag_isc.length > 0)
	{
		for (var i = 0; i < atom_set.mag_isc[0].length; ++i)
		{
				var s1 = atom_set.atom_species[atom_set.mag_isc[0][i].sp1];
				var a1 = atom_set.mag_isc[0][i].sp1_i-1;
				var s2 = atom_set.atom_species[atom_set.mag_isc[0][i].sp2];
				var a2 = atom_set.mag_isc[0][i].sp2_i-1;
				
				var isc_matr = atom_set.mag_isc[0][i].tens.r;
				var isc_split_matr = symm_antisymm(isc_matr);   //Split the matrix into symmetric and anti-symmetric parts				
				var isc_diag = symm_matr_diag_card(isc_split_matr[0]);
				var isc_haeb = haeberlen_and_order(isc_diag); 			//Store the values for isotropic component, anisotropy and asymmetry and reorder the eigenvalues and eigenvectors
				var isc_euler = euler_diff(isc_diag[1], isc_diag[2], isc_diag[3], [1, 0, 0], [0, 1, 0], [0, 0, 1], eul_conv);
				//Contents to store: [isotropic value, anisotropy, asimmetry, alpha, beta, gamma]
				var to_store = [t2j_2_hertz(isc_haeb[0], atom_set.atoms[s1][a1].elem, atom_set.atoms[s2][a2].elem), t2j_2_hertz(2.0/3.0*isc_haeb[1], atom_set.atoms[s1][a1].elem, atom_set.atoms[s2][a2].elem), isc_haeb[2], rad2deg(isc_euler[0]),  rad2deg(isc_euler[1]),  rad2deg(isc_euler[2])]; 
				
				//Interactions of an atom with itself are an artifact and ignored by default
				
				if (s1 == s2 && a1 == a2)
				{
					continue;
				}

				//Since we have to calculate all possible interactions between all atoms included in the sphere of radius r (for the case of a "range" choice), the loop is doubled
				
				for (var k_a1 = -k_a_max; k_a1 <= k_a_max; ++k_a1)
				{
					for (var k_b1 = -k_b_max; k_b1 <= k_b_max; ++k_b1)
					{
						for (var k_c1 = -k_c_max; k_c1 <= k_c_max; ++k_c1)
						{
							for (var k_a2 = -k_a_max; k_a2 <= k_a_max; ++k_a2)
							{
								for (var k_b2 = -k_b_max; k_b2 <= k_b_max; ++k_b2)
								{
									for (var k_c2 = -k_c_max; k_c2 <= k_c_max; ++k_c2)
									{
										var isc_n1 = atom_map[s1][a1][k_a1+k_a_max][k_b1+k_b_max][k_c1+k_c_max]; var isc_n2 = atom_map[s2][a2][k_a2+k_a_max][k_b2+k_b_max][k_c2+k_c_max];
										if (isc_n1 > -1 && isc_n2 > -1)
										{
											if (isc_n1 < isc_n2)
											{
												var dummy = isc_n2;
												isc_n2 = isc_n1;
												isc_n1 = dummy;
											}																						
											ds.isc[isc_n1][isc_n2] = to_store;
										}
									}
								}
							}
						}
					}
				}

		}
	}
	
	return true;
}

//Useful bit of code for Euler angles output
function rad2deg(a)
{
	return a/Math.PI*180.0;
}
