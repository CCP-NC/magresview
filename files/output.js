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
	var to_newtab = document.getElementById("file_newtab_check").checked;	
		
	if (to_newtab == true)
	{	
		var out_window = window.open('', 'JMol file output');	
		out_window.document.write("<title>JMol file output</title>");	
		//The <pre> tags are required to make the page writable as if it was a .txt file
		out_window.document.write("<pre id=\"file_text\" style=\"white-space:pre-wrap\">");
		var file_destination = out_window.document;
	}
	else
	{
		var file_destination = {
			file_str: "",
			write: function(s) {
				this.file_str += s;
			},			
			close: function(s) {
				this.file_str = "";
			}
		}
	}
	
	switch (filetype)
	{
		case "recap":
			recap_file_gen(file_destination);
			if (to_newtab == true)
			{
				file_destination.write("</pre>");
				file_destination.close();
				out_window.focus();
			}
			break;
		case "json":
			json_file_gen(file_destination);
			if (to_newtab == true)
			{
				file_destination.write("</pre>");
				file_destination.close();
				out_window.getSelection().selectAllChildren(out_window.document);		//JSON document needs to be copied, so we select it all for convenience
				out_window.focus();
			}
			break;
	}
			
	if(to_newtab == false)
	{
		if (current_framework == "Java") {
			var savefile_script = "data \"out_file\"\n" + file_destination.file_str + "\nend \"out_file\";";
			switch (filetype)
			{
				case "recap":
					savefile_script += "x = data(\"out_file\"); write var x ?.mview; data clear; x = null;";
					break;
				case "json":
					savefile_script += "x = data(\"out_file\"); write var x ?.json; data clear; x = null;";
					break;
			}
			
			//Necessary as the "data clear" instruction will delete all new user defined properties
			
			savefile_script += load_data_asproperty_script();
			
			Jmol.script(mainJmol, savefile_script);
		}
		else
		{
			//Replacement solution using data URI for JSmol
			
			switch(filetype)
			{
				case "recap":
					$("#file_download").attr("download", "magres.txt");
					break;
				case "json":
					$("#file_download").attr("download", "magres.json");
					break;				
			}
			
			$("#file_download").attr("href", "data:text/plain," + file_destination.file_str);
			$("#file_download").removeClass("hidden");
		}
		
	}
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
		document.getElementById("range_sphere_check").disabled = false;
	}
	else
	{
		div.style.visibility="hidden";
		document.getElementById("range_file_r").disabled = true;
		document.getElementById("range_sphere_check").disabled = true;
	}

	range_sphere_handler();	
	
}

//Make the JSON related controls active if needed

function json_controls_switch()
{
	var filetype = document.getElementById("file_type_drop").value;

	if (filetype == "json")
	{
		document.getElementById("soft_targ_drop").disabled = false;
		if(atom_set.is_magres && atom_set.has_ms)
			document.getElementById("ms_file_check").disabled = false;
			document.getElementById("ms_file_ref").disabled = false;
		if(atom_set.is_magres && atom_set.has_efg)
			document.getElementById("efg_file_check").disabled = false;
		
		if(atom_set.is_magres && atom_set.has_isc)
			document.getElementById("isc_file_check").disabled = false; 
		
		document.getElementById("dip_file_check").disabled = false;
		document.getElementById("sel_file_drop").disabled = false;
	}
	else
	{
		document.getElementById("soft_targ_drop").disabled = true;
		document.getElementById("ms_file_check").disabled = true;
		document.getElementById("ms_file_ref").disabled = true;
		document.getElementById("efg_file_check").disabled = true;
		document.getElementById("isc_file_check").disabled = true;
		document.getElementById("dip_file_check").disabled = true;
		document.getElementById("sel_file_drop").disabled = true;
	}
	
	range_sphere_handler();
	
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
	
	range_sphere_handler();
}

//Updates the range sphere if ENTER was pressed in the radius textbox

function range_file_r_handler(evt)
{
	//Compatibility code - see console.js for details
	var evt = window.event || evt;
	var myKey = (evt.keyCode)? evt.keyCode: evt.charCode;
	
	if (myKey == 13)
	{
		range_sphere_handler();
	}
}

//Clears out the Download link if it's not required

function download_link_handler()
{
	var active = $("#main_tabs").tabs("option", "active");
	if($("#main_tabs ul>li a").eq(active).attr('href') == "#file_gen")				//Is the File generation tab active?
	{
		if(current_framework == "Java")
		{
			$("#file_download").addClass("hidden");
			$("#file_download").attr("href", "");
		}
	}
	else
	{
		$("#file_download").addClass("hidden");		
		$("#file_download").attr("href", "");
	}
	
}

//Draws a sphere visualizing the selected range

function range_sphere_handler()
{
	sphere_script = "ellipsoid range_sphere_choice";
	
	//A bit of jQuery magic to check whether the active tab is the "File generation" one.

	var active = $("#main_tabs").tabs("option", "active");
	if($("#main_tabs ul>li a").eq(active).attr('href') == "#file_gen" &&				//Is the File generation tab active?
		document.getElementById("file_type_drop").value == "json" && 					//Is the JSON file generation active?
		document.getElementById("sel_file_drop").value.indexOf("range") > -1 &&			//Is one of the 'range' options selected?
		document.getElementById("range_sphere_check").checked == true)					//Is the box "Visualize range sphere" ticked?
	{
		var r = parseFloat(document.getElementById("range_file_r").value);
		
		sphere_script += " axes {" + r + " 0 0} {0 " + r + " 0} {0 0 " + r + "} center {*}[" + last_atom_picked + "] color translucent 0.7 {200 200 200};";
		sphere_script += " display {default_displaygroup or within(" + r + ", ({*}[" + last_atom_picked + "]))};";
		sphere_script += " color {displayed and not default_displaygroup} translucent;"
	}
	else
	{
		sphere_script += " delete;";
		sphere_script += "display default_displaygroup;"
	}
     
   Jmol.script(mainJmol, sphere_script);		
				       
}

//Trims numbers to print to a fixed length of d digits

var recap_trim_digits = 7;

function trim_num(n, d)
{
	//d is the total width of the field, including evental sign
	
	str_n = n.toString();
	if (str_n.length > d)
	{
		e = str_n.indexOf('.');
		if (e > -1)
			n = Math.round(n*Math.pow(10, d-e-1))/Math.pow(10, d-e-1);
		if (n > 0)
			str_n = " " + n.toString().substring(0, d-1);
		else
			str_n = n.toString().substring(0, d);
	}

	if (str_n.length < d)
	{
		//Pad with spaces
		for (var i = str_n.length; i < d; ++i)
			str_n = " " + str_n;
	}
	
	return str_n;
		
}

//A file format meant for readability

function recap_file_gen(out)
{
	//This kind of file is meant to be a recap with readability as its main purpose. As such, it will be spaced and commented as much as possible
	
	//Uses the same method as the json one to gather data from Jmol
	
	var data_set = {
		
		magres_view: "Made with MagresView " + magresview_version_number,		//Tagline
		
		soft_targ: "", //Software target of the JSON file, the final format to be generated for NMR simulation
		
		atoms: {units: [], lattice: [], atom: [], isotopes: {}},	//Will contain units, lattice, elements, isotopes and atom coordinates for the system
		
		magres: {units: []}	//Will contain efg, isc, ms, and dipolar interaction terms for the system

	};
	
	//This structure holds the parameters controlling the choice of atoms to use for the file
	
	var atom_choice = {
		
		t: "unitcell",
		
		r: 0,

		c: 0,
				
	}
	
	if(!compile_data_set(data_set, atom_choice, true))
	{
		out.close();
		return;
	}
	
	//Header
	out.write("--------------   JMol Web - Summary file --------------\n");

	//Print total number of atoms
	out.write("\n% Number of atoms: " + data_set.atoms.atom.length + "\n");


	//Print crystallographic labels and compile id -> label and element table
	
	var i_to_info = {};

	var labels = [];
	var labels_n = {};
	for (var i = 0; i < data_set.atoms.atom.length; ++i)
	{
		var sp = data_set.atoms.atom[i].label;
		var ind = data_set.atoms.atom[i].index;
		if (labels.indexOf(sp) < 0)
		{
			labels.push(sp);
			labels_n[sp] = 1;
		}
		else
		{
			labels_n[sp] += 1;
		}
		
		i_to_info[data_set.atoms.atom[i].id] = [sp, ind];
	}
	
	out.write("\n% Number of crystallographic labels: " + labels.length + "\n");
	for (var i = 0; i < labels.length; ++i)
	{
		var sp = labels[i];
		out.write((i+1) + ":\t" + sp + " => " + labels_n[sp] + " atoms\n"); 
	}
	
	delete(labels);
	delete(labels_n);
	
	//Print elements and compile id -> label and element table
	var elems = [];
	var elems_n = {};
	for (var i = 0; i < data_set.atoms.atom.length; ++i)
	{
		var el = data_set.atoms.atom[i].species;
		if (elems.indexOf(el) < 0)
		{
			elems.push(el);
			elems_n[el] = 1;
		}
		else
		{
			elems_n[el] += 1;
		}

		i_to_info[data_set.atoms.atom[i].id].push(el);
	}

	delete(elems);
	delete(elems_n);
	
	out.write("\n% Number of elements: " + elems.length + "\n");
	for (var i = 0; i < elems.length; ++i)
	{
		var el = elems[i];
		out.write((i+1) + ":\t" + el + " => " + elems_n[el] + " atoms\n");
	}

	//If present, print isotropic magnetic shielding tensors
	if ("ms" in data_set.magres)
	{
		out.write("\n% Magnetic shielding data (symmetric component)\n");
		for (var i = 0; i < data_set.magres.ms.length; ++i)
		{
			var id = data_set.magres.ms[i].atom_id;
			var sp_label = i_to_info[id][0];
			var atom_i = i_to_info[id][1];
			var el = i_to_info[id][2];
			
			var tens = data_set.magres.ms[i].sigma;
			
			var haeb = data_set.magres.ms[i].mview_data.slice(0, 3);
			var eul_ang = data_set.magres.ms[i].mview_data.slice(3, 6);
									
			//Write down atomic label
			out.write("\n" + sp_label + "\t" + atom_i + "   :\n");
			
			//FULL TENSOR
			out.write("\n--- Absolute reference frame tensor ---\n\n");
			
			for (var j = 0; j < 3; ++j)
			{
				out.write("\t|");
				for (var k = 0; k < 3; ++k)
				{
					out.write("\t" + trim_num(tens[j][k], recap_trim_digits));
				}
				if (j == 1)
					out.write("\t|\tppm\n");
				else
					out.write("\t|\n");
			}
			
			/* Temporarily removed
			
			//SYMMETRIC COMPONENT
			out.write("\n--- Diagonalized symmetric component ---\n");
			
			//Write down eigenvalues
			out.write("\nEigenvalues:\ns_1: " + eigval[0] + " ppm\ts_2: " + eigval[1] + " ppm\ts_3: " + eigval[2] + " ppm\n");
			
			//Write down eigenvectors
			out.write("\nEigenvectors:");
			out.write("\n\t|" + eigv_1[0] + "\t|\t\t|" + eigv_2[0] + "\t|\t\t|" + eigv_3[0] + "\t|");
			out.write("\ne_1=\t|" + eigv_1[1] + "\t|\te_2=\t|" + eigv_2[1] + "\t|\te_3=\t|" + eigv_3[1] + "\t|");
			out.write("\n\t|" + eigv_1[2] + "\t|\t\t|" + eigv_2[2] + "\t|\t\t|" + eigv_3[2] + "\t|\n");
			
			*/
			
			//Write down Haeberlen parameters
			out.write("\nHaeberlen parameters:\ns_iso: " + haeb[0] + " ppm\t\taniso: " + haeb[1] + " ppm\t\tasymm: " + haeb[2] + "\n");			
			//Write down Euler angles
			out.write("\nEuler angles:\nalpha: " + eul_ang[0] + "\t\tbeta: " + eul_ang[1] + "\t\tgamma: " + eul_ang[2] + "\n");			
			
			//Dividing line
			out.write("\n\n--------------------------------------------------------------------------------------\n\n");
			
		}
		
	}

	//If present, print electric field gradient tensors
	if ("efg" in data_set.magres)
	{
		out.write("\n% Electric field gradient and quadrupole constant data\n")
			
		for (var i = 0; i < data_set.magres.efg.length; ++i)
		{
			var id = data_set.magres.efg[i].atom_id;
			var sp_label = i_to_info[id][0];
			var atom_i = i_to_info[id][1];
			var el = i_to_info[id][2];
			
			var tens = data_set.magres.efg[i].V;
			
			var haeb = data_set.magres.efg[i].mview_data.slice(0, 2);
			var eul_ang = data_set.magres.efg[i].mview_data.slice(2, 5);
						
			//Write down atomic label
			out.write("\n" + sp_label + "\t" + atom_i + "   :\n");
			
			//FULL TENSOR
			out.write("\n--- Absolute reference frame tensor ---\n\n");
			
			for (var j = 0; j < 3; ++j)
			{
				out.write("\t|");
				for (var k = 0; k < 3; ++k)
				{
					out.write("\t" + trim_num(tens[j][k], recap_trim_digits));
				}
				if (j == 1)
					out.write("\t|\tau\n");
				else
					out.write("\t|\n");
			}
			
			//Write down Haeberlen parameters
			out.write("\nHaeberlen parameters:\nV_zz: " + haeb[0] + " Hz\t\tasymm: " + haeb[1] + "\n");			
			//Write down Euler angles
			out.write("\nEuler angles:\nalpha: " + eul_ang[0] + "\t\tbeta: " + eul_ang[1] + "\t\tgamma: " + eul_ang[2] + "\n");			
			
			//Dividing line
			out.write("\n\n--------------------------------------------------------------------------------------\n\n");

			/*
			 * 
			var sp_label = atom_set.mag_efg[t][i].sp;
			var atom_i = atom_set.mag_efg[t][i].sp_i;
			
			var tens = atom_set.mag_efg[t][i].tens.r;
			
			var eigval = atom_set.mag_efg_eigenvals[t][i];
			
			var eigv_1 = atom_set.mag_efg_eigenvect[t][i][0];
			var eigv_2 = atom_set.mag_efg_eigenvect[t][i][1];
			var eigv_3 = atom_set.mag_efg_eigenvect[t][i][2];

			var haeb = atom_set.mag_efg_haeb[t][i];
			
			//Write down atomic label
			out.write("\n" + sp_label + "\t" + atom_i + "   :\n");

			//FULL TENSOR
			out.write("\n--- Absolute reference frame tensor ---\n\n");
			
			for (var j = 0; j < 3; ++j)
			{
				out.write("\t|");
				for (var k = 0; k < 3; ++k)
				{
					out.write("\t" + trim_num(tens[j][k], recap_trim_digits));
				}
				if (j == 1)
					out.write("\t|\tau\n");
				else
					out.write("\t|\n");
			}
			
			//SYMMETRIC COMPONENT
			out.write("\n--- Diagonalized symmetric component ---\n");

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
			* */
		}
	}
	
	//If present, print internal spin-spin couplings
	if ("isc" in data_set.magres)
	{
		out.write("\n% Internal spin-spin coupling data\n")
		
		for (var i = 0; i < data_set.magres.isc.length; ++i)
		{
			var id1 = data_set.magres.isc[i].atom1_id;
			var id2 = data_set.magres.isc[i].atom2_id;
			var sp1_label = i_to_info[id1][0];
			var atom1_i = i_to_info[id1][1];
			var el1 = i_to_info[id1][2];
			var sp2_label = i_to_info[id2][0];
			var atom2_i = i_to_info[id2][1];
			var el2 = i_to_info[id2][2];
			
			var J = data_set.magres.isc[i].mview_data[0];
									
			//Write down atomic labels
			out.write("\n" + sp1_label + "\t" + atom1_i + "\t<==>\t" + sp2_label + "\t" + atom2_i + ":\n");
			
			/*
			 * 
			 * Temporarily removed
			
			//FULL TENSOR
			out.write("\n--- Absolute reference frame tensor ---\n\n");
			
			for (var j = 0; j < 3; ++j)
			{
				out.write("\t|");
				for (var k = 0; k < 3; ++k)
				{
					out.write("\t" + trim_num(tens[j][k], recap_trim_digits));
				}
				if (j == 1)
					out.write("\t|\tau\n");
				else
					out.write("\t|\n");
			}
			
			//Write down Haeberlen parameters
			out.write("\nHaeberlen parameters:\nV_zz: " + haeb[0] + " Hz\t\tasymm: " + haeb[1] + "\n");			
			//Write down Euler angles
			out.write("\nEuler angles:\nalpha: " + eul_ang[0] + "\t\tbeta: " + eul_ang[1] + "\t\tgamma: " + eul_ang[2] + "\n");			
			* 
			*/
			
			//Write down coupling constant
			out.write("\nCoupling:\nJ: " + J + "Hz\n");			
			
			//Dividing line
			out.write("\n\n--------------------------------------------------------------------------------------\n\n");
		}
		
		/*
		
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
		* 
		* */
	
	}

}

//A file format optimized for transferring data to a Python script

function json_file_gen(out)
{
	//A dataset containing all necessary quantities is generated, so that it might be imported later in a Python script
	//Its structure is thought as to be compatible with Tim Green's MagresAtom Python library conventions, but has added elements to store software target, diagonalized data, etc.	
	
	var data_set = {
		
		magres_view: "Made with MagresView " + magresview_version_number,		//Tagline
		
		soft_targ: "", //Software target of the JSON file, the final format to be generated for NMR simulation
		
		atoms: {units: [], lattice: [], atom: [], isotopes: {}},	//Will contain units, lattice, elements, isotopes and atom coordinates for the system
		
		magres: {units: []}	//Will contain efg, isc, ms, and dipolar interaction terms for the system

	};
	
	//This structure holds the parameters controlling the choice of atoms to use for the file
	
	var atom_choice = {
		
		t: document.getElementById("sel_file_drop").value,				//Type of choice
		
		r: parseFloat(document.getElementById("range_file_r").value),	//Radius (for "atoms within...")

		c: last_atom_picked,											//Center atom (for "atoms within...")
				
	}
	
	if(!compile_data_set(data_set, atom_choice, false))
	{
		out.close();
		return;
	}

	var to_write = JSON.stringify(data_set);
	
	out.write(to_write);
	
}

//Build a Jmol atom expression which represents the given choice

function choice_atomexp(ac)
{
	
	switch(ac.t)
	{
		case "all":
			return "{displayed}";
			break;
		case "unitcell":
			return "{unitcell}";
			break;
		case "sel":
			return "{displayed and selected}";
			break;
		case "range":
			return "{displayed and within(" + ac.r + ", ({*}[" + ac.c + "]))}";
			break;
		case "sel_range":			
			return "{displayed and selected and within(" + ac.r + ", ({*}[" + ac.c + "]))}";
			break;
		default:
			return "{none}";
			break;		
	}
	
	return false;
}

//Fill in the data_set with the required atoms

function compile_data_set(ds, ac, use_all)
{
	var eul_conv = "zyz"; //May be changed in future
	
	ds.soft_targ = document.getElementById("soft_targ_drop").value;
	
	var atom_n = 0;    //All atoms in data_set will be simply ordered by an increasing number, no crystallographic labels
	var atom_map = []; //For the sake of speed, a map which correlates species numbers and indices to the corresponding value of atom_n
	
	var abc = atom_set.lattice_pars;	//Storing the lattice parameters for convenience
	var ch = choice_atomexp(ac);
	
	//To prevent errors if there is no lattice data; it will be irrelevant anyway, because in this case the k_*_max will all be zero

	if (abc == null)
	{
		abc = new Array();
		abc[0] = [0, 0, 0];
		abc[1] = [0, 0, 0];
		abc[2] = [0, 0, 0];
	}
	else	//Insert lattice data in the final file
	{
		ds.atoms.units.push(["lattice", "Angstrom"]);
		ds.atoms.lattice.push(abc);
	}
		
	ds.atoms.units.push(["atom", "Angstrom"]);

	Jmol.scriptWait(mainJmol, "coord_info = []; for (a in " + ch + ") {coord_info = coord_info or [a.atomno, a.atomname, a.element, a.xyz];}");
	var coord_info = Jmol.evaluate(mainJmol, "coord_info").split('\n');

	var species_indices = {};

	for (var i = 0; i < coord_info.length; i += 4)
	{
		var a_no = coord_info[i];
		if (a_no == '')
			continue;
		var a_name = coord_info[i+1];
		var a_el = coord_info[i+2];
		var a_xyz = coord_info[i+3];

		//Evaluate coordinates as an array

		a_xyz = a_xyz.substring(1, a_xyz.length-1).split(' ');

		for (var j in a_xyz)
		{
			a_xyz[j] = parseFloat(a_xyz[j]);
		}

		//Split element in isotope + element

		var k = 0;
		while (!isNaN(parseInt(a_el.charAt(k))))
			++k;
		var a_iso = a_el.substring(0, k);
		a_el = a_el.substring(k);

		//If there's no isotope information, find the most common one for the element

		if (a_iso == '')
		{
			if (a_el == 'D')
			{
				a_iso = 2;
			}
			else if (a_el == 'T')
			{
				a_iso = 3;
			}
			else
			{
				var isos = Jmol.getPropertyAsArray(mainJmol, "NMRinfo", a_el);
				for (iso in isos)
				{
					if (isos[iso][0] < 0)
					{
						a_iso = Math.abs(isos[iso][0]);
						break;
					}
				}

				if(a_iso == '')
				{
					//Should never be the case. Anyway, for safety, just use the first value
					a_iso = isos[0][0];
				}
			}
		}
		else
		{
			a_iso = parseInt(a_iso);
		}

		if(atom_set.is_magres)
		{
			var a_label = a_name.substring(0, a_name.lastIndexOf('_'));
			var a_index = parseInt(a_name.substring(a_name.lastIndexOf('_')+1));
		}
		else
		{
			var a_label = a_el;

			if (!(a_label in species_indices))
				species_indices[a_label] = 0;

			var a_index = ++species_indices[a_label];

		}

		ds.atoms.isotopes[a_no] = [a_iso, a_el];

		ds.atoms.atom[i/4] = {
			id:    		a_no,
			index: 		a_index,
			label: 		a_label,
			species: 	a_el,
			position: 	a_xyz
		};
	}

	//If required, cycle through magnetic shieldings

	if ((document.getElementById("ms_file_check").checked == true || use_all == true) && atom_set.has_ms)
	{
		ds.magres.units.push(["ms", "ppm"]);
		ds.magres.ms = [];
		
		var ms_reference = parseFloat(document.getElementById("ms_file_ref").value);

		Jmol.scriptWait(mainJmol, "ms_info = []; for (a in " + ch + ") {ms_info = ms_info or [a.atomno, a.tensor('ms', 'asymmatrix'), a.tensor('ms', 'isotropy'), a.tensor('ms', 'anisotropy'), a.tensor('ms', 'asymmetry'), a.tensor('ms', 'euler" + eul_conv + "')];}");
		var ms_info = Jmol.evaluate(mainJmol, "ms_info").split('\n');
		//Clean up the info array
		for (l in ms_info)
		{
			if (ms_info[l] == "" || ms_info[l] == "\t[")
				ms_info.splice(l, 1);
		}

		for (var i = 0; i < ms_info.length; i += 11)
		{
			var a_no = ms_info[i];
			var a_sigma_1 = ms_info[i+1].substring(ms_info[i+1].lastIndexOf('[')+1, ms_info[i+1].lastIndexOf(']')).split(',');
			var a_sigma_2 = ms_info[i+2].substring(ms_info[i+2].lastIndexOf('[')+1, ms_info[i+2].lastIndexOf(']')).split(',');
			var a_sigma_3 = ms_info[i+3].substring(ms_info[i+3].lastIndexOf('[')+1, ms_info[i+3].lastIndexOf(']')).split(',');
			var a_iso   = parseFloat(ms_info[i+4]);
			if (!isNaN(ms_reference))
			{
				a_iso = ms_reference - a_iso;
			}
			var a_aniso = parseFloat(ms_info[i+5]);
			var a_asymm = parseFloat(ms_info[i+6]);
			var a_alpha = parseFloat(ms_info[i+7]);
			var a_beta  = parseFloat(ms_info[i+8]);
			var a_gamma = parseFloat(ms_info[i+9]);

			var a_sigma = [[],[],[]];

			for (var j = 0; j < 3; ++j)
			{
				a_sigma[0][j] = parseFloat(a_sigma_1[j]);
				a_sigma[1][j] = parseFloat(a_sigma_2[j]);
				a_sigma[2][j] = parseFloat(a_sigma_3[j]);
			}

			ds.magres.ms[i/11] = {
				sigma:	a_sigma,
				mview_data: [a_iso, a_aniso, a_asymm, a_alpha, a_beta, a_gamma],
				atom_id: a_no, 
			};

		}

	}

	//If required, cycle through electric field gradients

	if ((document.getElementById("efg_file_check").checked == true || use_all == true) && atom_set.has_efg)
	{
		ds.magres.units.push(["efg", "au"]);
		ds.magres.efg = [];		

		Jmol.scriptWait(mainJmol, "efg_info = []; for (a in " + ch + ") {efg_info = efg_info or [a.atomno, a.tensor('efg', 'asymmatrix'), a.tensor('efg', 'chi'), a.tensor('efg', 'asymmetry'), a.tensor('efg', 'euler" + eul_conv + "')];}");
		var efg_info = Jmol.evaluate(mainJmol, "efg_info").split('\n');
		//Clean up the info array
		for (l in efg_info)
		{
			if (efg_info[l] == "" || efg_info[l] == "\t[")
				efg_info.splice(l, 1);
		}

		for (var i = 0; i < efg_info.length; i += 10)
		{
			var a_no = efg_info[i];
			var a_V_1 = efg_info[i+1].substring(efg_info[i+1].lastIndexOf('[')+1, efg_info[i+1].lastIndexOf(']')).split(',');
			var a_V_2 = efg_info[i+2].substring(efg_info[i+2].lastIndexOf('[')+1, efg_info[i+2].lastIndexOf(']')).split(',');
			var a_V_3 = efg_info[i+3].substring(efg_info[i+3].lastIndexOf('[')+1, efg_info[i+3].lastIndexOf(']')).split(',');
			var a_chi   = parseFloat(efg_info[i+4]);
			var a_asymm = parseFloat(efg_info[i+5]);
			var a_alpha = parseFloat(efg_info[i+6]);
			var a_beta  = parseFloat(efg_info[i+7]);
			var a_gamma = parseFloat(efg_info[i+8]);

			var a_V = [[],[],[]];

			for (var j = 0; j < 3; ++j)
			{
				a_V[0][j] = parseFloat(a_V_1[j]);
				a_V[1][j] = parseFloat(a_V_2[j]);
				a_V[2][j] = parseFloat(a_V_3[j]);
			}

			ds.magres.efg[i/10] = {
				V: a_V,
				mview_data: [a_chi, a_asymm, a_alpha, a_beta, a_gamma],
				atom_id: a_no, 
			};

		}

	}

	//If required, cycle through dipolar couplings
	
	if (document.getElementById("dip_file_check").checked == true)
	{
		ds.magres.units.push(["dip", "Hz"]);
		ds.magres.dip = [];
		
		Jmol.scriptWait(mainJmol, "dip_info = []; for (i = 1; i < " + ch + ".length; ++i) {for (j=i+1; j<= " + ch + ".length; ++j) {dip_info = dip_info or [measure(" + ch + "[i] " + ch + "[j], \"khz\")]; r = " + ch + "[i].xyz-" + ch + "[j].xyz; mod = sqrt(r*r); dip_info = dip_info or [r/mod];}}");
		var dip_info = Jmol.evaluate(mainJmol, "dip_info").split('\n');
		
		//Clean up the info array
		for (l in dip_info)
		{
			if (dip_info[l] == "")
				dip_info.splice(l, 1);
		}
		
		for (var i = 0; i < dip_info.length; i += 2)
		{
			var a_dip = dip_info[i].split('\t');
			var a_b = parseFloat(a_dip[2])*1000.0;		//Coupling constant in Hz
			var a_no_1 = parseInt(a_dip[4].substring(a_dip[4].indexOf('#')+1));
			var a_no_2 = parseInt(a_dip[5].substring(a_dip[5].indexOf('#')+1));
			var a_r = dip_info[i+1].substring(1, dip_info[i+1].length-1).split(' ');
			
			//a_r is the versor of the vector connecting the two spins. With it we can build the corresponding Euler angles
			
			a_r = [parseFloat(a_r[0]), parseFloat(a_r[1]), parseFloat(a_r[2])];
			
			var a_alpha = rad2deg(Math.atan2(a_r[1], a_r[0]));
			var a_beta = rad2deg(Math.acos(a_r[2]));
			
			ds.magres.dip[i/2] = {
				mview_data: [a_b, a_alpha, a_beta, 0.0],
				atom1_id: "" + a_no_1, 
				atom2_id: "" + a_no_2,
			}
		}
		
	}
	
	if ((document.getElementById("isc_file_check").checked == true || use_all == true) && atom_set.has_isc)
	{
		ds.magres.units.push(["isc", "10^19.T^2.J^-1"]);
		ds.magres.isc = [];
		
		Jmol.scriptWait(mainJmol, "isc_info = []; for (i = 1; i < " + ch + ".length; ++i) {for (j=i+1; j<= " + ch + ".length; ++j) {isc_info = isc_info or [\"#\" + ({" + ch + "[i] or " + ch + "[j]}.tensor(\"isc\", \"j\")[1])[3], \
								   \"#\" + ({" + ch + "[i] or " + ch + "[j]}.tensor(\"isc\", \"eta\")[1])[3], \"#\" + ({" + ch + "[i] or " + ch + "[j]}.tensor(\"isc\", \"asymmetry\")[1])[3], \
								   \"#\" + (({" + ch + "[i] or " + ch + "[j]}.tensor(\"isc\", \"eulerzyz\")[1])[3])[1], \"#\" + (({" + ch + "[i] or " + ch + "[j]}.tensor(\"isc\", \"eulerzyz\")[1])[3])[2], \"#\" + (({" + ch + "[i] or " + ch + "[j]}.tensor(\"isc\", \"eulerzyz\")[1])[3])[3],  \
								   \"#\" + i, \"#\" + j];}}");
		var isc_info = Jmol.evaluate(mainJmol, "isc_info").split('\n');
				
		//Clean up the info array
		for (l = isc_info.length-1; l >= 0; --l)
		{
			if (isc_info[l] == "")
				isc_info.splice(l, 1);
		}
				
		nonzero_isc = 0;
		
		for (var i = 0; i < isc_info.length; i += 8)
		{			
			var a_J = parseFloat(isc_info[i].substring(isc_info[i].indexOf('#')+1));
			var a_eta = parseFloat(isc_info[i+1].substring(isc_info[i+1].indexOf('#')+1));
			var a_asymm = parseFloat(isc_info[i+2].substring(isc_info[i+2].indexOf('#')+1));
			var a_eul_a = parseFloat(isc_info[i+3].substring(isc_info[i+3].indexOf('#')+1));
			var a_eul_b = parseFloat(isc_info[i+4].substring(isc_info[i+4].indexOf('#')+1));
			var a_eul_c = parseFloat(isc_info[i+5].substring(isc_info[i+5].indexOf('#')+1));
			var a_no_1 = parseInt(isc_info[i+6].substring(isc_info[i+6].indexOf('#')+1));
			var a_no_2 = parseInt(isc_info[i+7].substring(isc_info[i+7].indexOf('#')+1));
			
			if (isNaN(a_J))
				continue;

			ds.magres.isc[nonzero_isc] = {
				mview_data: [a_J, a_eta, a_asymm, a_eul_a, a_eul_b, a_eul_c],				//Right now only the isotropic component of ISC is implemented!
				atom1_id: a_no_1,
				atom2_id: a_no_2,
			}
						
			++nonzero_isc;

		}		
	}

/*
	
	//If required, add indirect spin-spin couplings
	
	if (document.getElementById("isc_file_check").checked == true && atom_set.mag_isc.length > 0)
	{
		ds.magres.units.push(["isc", atom_set.units["isc"]]);
		ds.magres.isc = [];
		
		for (var i = 0; i < atom_set.mag_isc[0].length; ++i)
		{
				var s1 = atom_set.atom_species[atom_set.mag_isc[0][i].sp1];
				var a1 = atom_set.mag_isc[0][i].sp1_i-1;
				var s2 = atom_set.atom_species[atom_set.mag_isc[0][i].sp2];
				var a2 = atom_set.mag_isc[0][i].sp2_i-1;
				var label1 = atom_set.mag_isc[0][i].sp1;
				var label2 = atom_set.mag_isc[0][i].sp2;	
				
				var sigma = atom_set.mag_isc[0][i].tens.r;
				var isc_split_matr = symm_antisymm(sigma);   //Split the matrix into symmetric and anti-symmetric parts				
				var isc_diag = symm_matr_diag_card(isc_split_matr[0]);
				var isc_haeb = haeberlen_and_order(isc_diag); 			//Store the values for isotropic component, anisotropy and asymmetry and reorder the eigenvalues and eigenvectors
				var isc_euler = euler_diff(isc_diag[1], isc_diag[2], isc_diag[3], [1, 0, 0], [0, 1, 0], [0, 0, 1], eul_conv);
				//Contents to store: [isotropic value, anisotropy, asimmetry, alpha, beta, gamma]
				var mview_data = [t2j_2_hertz(isc_haeb[0], atom_set.atoms[s1][a1].elem, atom_set.atoms[s2][a2].elem), t2j_2_hertz(2.0/3.0*isc_haeb[1], atom_set.atoms[s1][a1].elem, atom_set.atoms[s2][a2].elem), isc_haeb[2], rad2deg(isc_euler[0]),  rad2deg(isc_euler[1]),  rad2deg(isc_euler[2])]; 
				
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
										var s_i_1 = atom_map[s1][a1][k_a1+k_a_max][k_b1+k_b_max][k_c1+k_c_max][1]; var s_i_2 = atom_map[s2][a2][k_a2+k_a_max][k_b2+k_b_max][k_c2+k_c_max][1];
										if (s_i_1 > -1 && s_i_2 > -1)
										{
											ds.magres.isc.push({
												sigma: sigma,
												mview_data: mview_data,
												atom1: {
													index: s_i_1,
													label: label1
												},
												atom2: {
													index: s_i_2,
													label: label2
												}												
											});
										}
									}
								}
							}
						}
					}
				}

		}
	}

	*/
	
	return true;
}

//Useful bit of code for Euler angles output
function rad2deg(a)
{
	return a/Math.PI*180.0;
}
