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
		out_window.document.body.innerHTML = '';
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
	
	var data_set = {};
	init_data_set(data_set);
	
		//This structure holds the parameters controlling the choice of atoms to use for the file
	
	var atom_choice = {
		
		t: document.getElementById("sel_file_drop").value,				//Type of choice
		
		r: parseFloat(document.getElementById("range_file_r").value),	//Radius (for "atoms within...")

		c: last_atom_picked,									//Center atom (for "atoms within...")
				
	}
	
	var use_all = (filetype == "recap");
	
	if(!compile_data_set(data_set, atom_choice, use_all))
	{
		file_destination.close();
		return;
	}

	
	switch (filetype)
	{
		case "recap":
			recap_file_gen(data_set, file_destination);
			break;
		case "table":
			table_file_gen(data_set, file_destination);
			break;						
		case "json":
			json_file_gen(data_set, file_destination);
			break;
		case "magres":
			magres_file_gen(data_set, file_destination);
			break;
		case "spinsys":
			spinsys_file_gen(data_set, file_destination);
			break;			
	}
			
	if (to_newtab == true)
	{
		file_destination.write("</pre>");
		file_destination.close();
		if (filetype != "recap") {
			out_window.getSelection().selectAllChildren(out_window.document);		//All types except recap need to be copied, so we select it all for convenience
		}
		out_window.focus();
	}
	else
	{
		if (current_framework == "Java") {
			var savefile_script = "";
			switch (filetype)
			{
				case "recap":
					savefile_script += "x = '" + file_destination.file_str + "'; write var x ?.txt; x = null;";
					break;
				case "table":
					savefile_script += "x = '" + file_destination.file_str + "'; write var x ?.dat; x = null;";
					break;
				case "json":
					savefile_script += "x = '" + file_destination.file_str + "'; write var x ?.json; x = null;";
					break;
				case "magres":
					savefile_script += "x = '" + file_destination.file_str + "'; write var x ?.magres; x = null;";
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
				case "table":
					$("#file_download").attr("download", "magres.dat");
					break;
				case "json":
					$("#file_download").attr("download", "magres.json");
					break;				
				case "magres":
					$("#file_download").attr("download", "magres.magres");
					break;				
			}
			$("#file_download").attr("href", "data:text/plain," + file_destination.file_str
						 .replace(/%/g, '%25')			//The % symbol must be replaced first, or everything goes down the drain!
						 .replace(/\n/g, '%0A')
						 .replace(/\t/g, '%09')
						 .replace(/&/g, '%26')
						 .replace(/#/g, '%23')
						 .replace(/"/g, '%22')
					         .replace(/'/g, '%27'));
			$("#file_download").removeClass("hidden");
		}
	}
}

//Activate xml format specific controls only when needed

function file_type_drop_handler()
{
	//Clear out the previous file
	$("#file_download").addClass("hidden");
	update_filetype_classes();
	include_controls_switch();
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

//Update the "software target" dropdown depending on the required filetype

function update_filetype_classes()
{
	var filetype = document.getElementById("file_type_drop").value;	
	var soft_targ = document.getElementById("soft_targ_drop");
	
	
	if (filetype == "json")
	{
		soft_targ.options.length = 2;
		
		soft_targ.options[0] = new Option("SIMPSON", "simpson");
		soft_targ.options[1] = new Option("SPINEVOLUTION", "spinev");		
	}
	else if (filetype == "spinsys")
	{
		soft_targ.options.length = 2;
		
		soft_targ.options[0] = new Option("SIMPSON", "simpson");
		soft_targ.options[1] = new Option("pNMRsim", "pnmr");		
	}
}


//Make the NMR include controls active if needed

function include_controls_switch()
{
	var filetype = document.getElementById("file_type_drop").value;

	if (filetype == "json" || filetype == "spinsys")
	{
		document.getElementById("soft_targ_drop").disabled = false;
		if(atom_set.is_magres && atom_set.has_ms)
		{
			document.getElementById("ms_file_check").disabled = false;
			document.getElementById("ms_file_ref").disabled = false;
		}
		if(atom_set.is_magres && atom_set.has_efg)
		{
			console.log("Wut?");
			document.getElementById("efg_file_check").disabled = false;
		}
		
		if(atom_set.is_magres && atom_set.has_isc)
		{
			document.getElementById("isc_file_check").disabled = false; 
		}
		
		document.getElementById("dip_file_check").disabled = false;
		document.getElementById("sel_file_drop").disabled = false;
	}
	else if (filetype == "table" || filetype == "magres")
	{
		document.getElementById("soft_targ_drop").disabled = true;
		if(atom_set.is_magres && atom_set.has_ms)
		{
			document.getElementById("ms_file_check").disabled = false;
			document.getElementById("ms_file_ref").disabled = false;
		}
		if(atom_set.is_magres && atom_set.has_efg)
		{
			document.getElementById("efg_file_check").disabled = false;
		}
		
		if(atom_set.is_magres && atom_set.has_isc)
		{
			document.getElementById("isc_file_check").disabled = false; 
		}
		
		document.getElementById("dip_file_check").disabled = false;
		document.getElementById("sel_file_drop").disabled = false;
	}
	else
	{
		//Overview
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
	evt = window.event || evt;
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
	if(active == tab_index("#file_gen"))				//Is the File generation tab active?
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
	if(active == tab_index("#file_gen") &&				//Is the File generation tab active?
		document.getElementById("file_type_drop").value != "recap" && 					//Is the JSON or the Tabulated file generation active?
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

function recap_file_gen(data_set, out)
{
	//This kind of file is meant to be a recap with readability as its main purpose. As such, it will be spaced and commented as much as possible
	
	//Uses the same method as the json one to gather data from Jmol
		
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
			out.write("\nHaeberlen parameters:\nChi: " + haeb[0] + " Hz\t\tasymm: " + haeb[1] + "\n");			
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
		out.write("\n% Internal spin-spin coupling data\n");
		
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
			
			
			var haeb = data_set.magres.isc[i].mview_data.slice(0, 3);
			var eul_ang = data_set.magres.isc[i].mview_data.slice(3, 6);
			
									
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
			out.write("\nCoupling:\nJ: " + haeb[0]+ " Hz\n");			
			//Write down Haeberlen parameters
			out.write("\nHaeberlen parameters:\neta: " + haeb[1] + " Hz\t\tasymm: " + haeb[2] + "\n");			
			//Write down Euler angles
			out.write("\nEuler angles:\nalpha: " + eul_ang[0] + "\t\tbeta: " + eul_ang[1] + "\t\tgamma: " + eul_ang[2] + "\n");			
			
			//Dividing line
			out.write("\n\n--------------------------------------------------------------------------------------\n\n");
		}
	
	}

}

//An output in normal .magres format

function magres_file_gen(data_set, out) {
	
	//Outputs as a new .magres file
	
	//Print crystallographic labels and compile id -> label and element table
	
	var i_to_info = {};

	var labels = [];
	var labels_i = {};
	for (var i = 0; i < data_set.atoms.atom.length; ++i)
	{
		var sp = data_set.atoms.atom[i].label;
		var ind = data_set.atoms.atom[i].index;
		if (labels.indexOf(sp) < 0)
		{
			labels.push(sp);
			labels_i[sp] = 1;
		}
		else
		{
			labels_i[sp] += 1;		
		}
		
		i_to_info[data_set.atoms.atom[i].id] = [sp, ind, labels_i[sp]];
	}
		
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
	
	// Write header lines
	
	out.write("#$magres-abinitio\n");
	
	var system_stochiometry = "";
	
	for (var i = 0; i < elems.length; ++i) {
		l = elems[i];
		system_stochiometry += l + "_" + elems_n[l] + " ";
	}
	
	out.write("#.magres formatted NMR data for " + system_stochiometry + "\n");
	out.write("#" + data_set.magres_view + "\n");
	
	// Write down 'calculation' block
	
	if (atom_set.is_magres) {
		out.write("[calculation]\n");
		out.write(Jmol.getPropertyAsString(mainJmol, "fileHeader"));
		out.write("[/calculation]\n");
	}
	
	// Write down atoms and lattice
	
	out.write("[atoms]\n");
	
	// Start with units...
	
	for (var i = 0; i < data_set.atoms.units.length; ++i) {
		out.write("units " + data_set.atoms.units[i][0] + " " + data_set.atoms.units[i][1] + "\n");
	}
	
	if ("lattice" in data_set.atoms && data_set.atoms.lattice.length > 0) {
		
		//Then lattice...
		
		out.write("lattice ");
		
		for (var i = 0; i < 3; ++i) {
			for (var j = 0; j < 3; ++j) {
				out.write(data_set.atoms.lattice[0][i][j] + " ");
			}
		}
		out.write("\n");
		
	}
		
	//Then atoms...
	
	for (var i = 0; i < data_set.atoms.atom.length; ++i) {
		var a = data_set.atoms.atom[i];
		out.write("atom " + a.species + " " + a.label + " " + i_to_info[a.id][2]);
		for (var j = 0; j < 3; ++j) {
			out.write(" " + a.position[j]);
		}
		out.write("\t#" + a.label + "_" + a.index);
		out.write("\n");
	}
	
	out.write("[/atoms]\n");
	
	// Now on to the magres section!
	
	if (("ms" in data_set.magres) || ("efg" in data_set.magres) || ("isc" in data_set.magres)) {
		
		out.write("[magres]\n");
		
		for (var i = 0; i < data_set.magres.units.length; ++i) {
			out.write("units " + data_set.magres.units[i][0] + " " + data_set.magres.units[i][1] + "\n");
		}
		
		if ("ms" in data_set.magres) {
			
			for (var i = 0; i < data_set.magres.ms.length; ++i)
			{
				var ms = data_set.magres.ms[i];
				
				out.write("ms " + i_to_info[ms.atom_id][0] + " " + i_to_info[ms.atom_id][2]);
				
				for (var j=0; j < 3; ++j)
				{
					for (var k = 0; k < 3; ++k)
					{
						out.write(" " + ms.sigma[j][k]);
					}
				}
				out.write("\n");
				
			}
		}
		
		if ("efg" in data_set.magres) {
			
			for (var i = 0; i < data_set.magres.efg.length; ++i)
			{
				var efg = data_set.magres.efg[i];
				
				out.write("efg " + i_to_info[efg.atom_id][0] + " " + i_to_info[efg.atom_id][2]);
				
				for (var j=0; j < 3; ++j)
				{
					for (var k = 0; k < 3; ++k)
					{
						out.write(" " + efg.V[j][k]);
					}
				}
				out.write("\n");
				
			}
		}
		
		
		if ("isc" in data_set.magres) {
			
			for (var i = 0; i < data_set.magres.isc.length; ++i)
			{
				var isc = data_set.magres.isc[i];
				
				out.write("isc " + i_to_info[isc.atom1_id][0] + " " + i_to_info[isc.atom1_id][2] + " " + i_to_info[isc.atom2_id][0] + " " + i_to_info[isc.atom2_id][2]);
				
				for (var j=0; j < 3; ++j)
				{
					for (var k = 0; k < 3; ++k)
					{
						out.write(" " + isc.sigma[j][k]);					
					}
				}
				out.write("\n");
				
			}
		}
		
		out.write("[/magres]\n");		
		
	}
	
	// Isotopes block, not in the official format definitiion
	
	if ("isotopes" in data_set.atoms && data_set.atoms.isotopes.length > 0)
	{
		out.write("[isotopes]\n");
			
		for (var i = 0; i < data_set.atoms.atom.length; ++i) {
			var label = data_set.atoms.atom[i].label;
			var id = data_set.atoms.atom[i].id;
			out.write("iso " + label + " " + i_to_info[id][2] + " " + data_set.atoms.isotopes[id][0] + data_set.atoms.isotopes[id][1] + "\n");
		}
		
		out.write("[/isotopes]\n");
	}
	
	// Dipolar couplings, as above, not official
	
	if ("dip" in data_set.magres) {
		
		out.write("[dipolar]\n");
		out.write("units dip kHz\n");
		
		for (var i = 0; i < data_set.magres.dip.length; ++i)
		{
			var dip = data_set.magres.dip[i];
			
			out.write("dip " + i_to_info[dip.atom1_id][0] + " " + i_to_info[dip.atom1_id][2] + " " + i_to_info[dip.atom2_id][0] + " " + i_to_info[dip.atom2_id][2]);
			for (var j = 0; j < 3; ++j)
			{
				out.write(" " + dip.mview_data[j]);
			}
			out.write("\n");
			
		}
		out.write("[/dipolar]");		
	}
	
	
}

// An output directly in .spinsys format, for Simpson and pNMRsim

function spinsys_file_gen(data_set, out)
{
	//Print crystallographic labels and compile id -> label and element table
	
	var i_to_info = {};

	var labels = [];
	var labels_i = {};
	for (var i = 0; i < data_set.atoms.atom.length; ++i)
	{
		var sp = data_set.atoms.atom[i].label;
		var ind = data_set.atoms.atom[i].index;
		if (labels.indexOf(sp) < 0)
		{
			labels.push(sp);
			labels_i[sp] = 1;
		}
		else
		{
			labels_i[sp] += 1;		
		}
		
		i_to_info[data_set.atoms.atom[i].id] = [sp, ind, labels_i[sp]];
	}
		
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
	
	if (data_set.soft_targ == "simpson")
	{			
		out.write('spinsys {\n');
		
		//And the channels part (by default, all elements are used)
		
		out.write('channels');
		
		var channel_str = '';
		
		for (i in data_set.atoms.isotopes)
		{
			var iso = data_set.atoms.isotopes[i][0] + data_set.atoms.isotopes[i][1];
			
			// Compensate for the cases of weird symbols, for hydrogen isotopes
			switch(iso)
			{
				case "2D":
					iso = "2H";
					break;
				case "3T":
					iso = "3H";
					break;
			}
			
			if (channel_str.indexOf(iso) < 0)
			{
				channel_str += '\t' + iso;
			}
	
		}
		
		out.write(channel_str + '\n');
		
	}
	
	// Write down nuclei
	
	var atom_lookup = {}

	out.write(" nuclei\t");
	var a_n = 1 //Arbitrary sequential atom number for internal purposes
	for (var i = 0; i < data_set.atoms.atom.length; ++i)
	{
		var a = data_set.atoms.atom[i];
		out.write(data_set.atoms.isotopes[a.id][0] + data_set.atoms.isotopes[a.id][1] + " ");
		atom_lookup[a.id] = {"index": a.index, "label": a.label, "n": a_n};
		a_n += 1;
	}
	out.write("\n");
	
	if ('ms' in data_set.magres)
	{
		for (var i = 0; i < data_set.magres.ms.length; ++i)
		{
			var ms = data_set.magres.ms[i];
			
			if ('mview_data' in ms)
			{
				var n = atom_lookup[ms.atom_id].n;
				out.write(" shift\t" + n + " " + (-ms.mview_data[0]) + "p " + (-ms.mview_data[1])
				+ "p " + (ms.mview_data[2]) + " " + (ms.mview_data[3]) + " " + (ms.mview_data[4]) + " " + (ms.mview_data[5]) + "\n");
			}
		}
	}

	if ('efg' in data_set.magres)
	{
		for (var i = 0; i < data_set.magres.efg.length; ++i)
		{
			var efg = data_set.magres.efg[i];
			
			if ('mview_data' in efg)
			{
			    var n = atom_lookup[efg.atom_id].n;
				if (efg.mview_data[0] == 0.0)
				{
				    continue;
				}
				out.write(" quadrupole\t" + n + " 2 " + (efg.mview_data[0]) + " " + (efg.mview_data[1]) 
				+ " " + (efg.mview_data[2]) + " " + (efg.mview_data[3]) + " " + (efg.mview_data[4]) + "\n");
			}
		}
	}

	if ('dip' in data_set.magres)
	{
	        for (var i = 0; i < data_set.magres.dip.length; ++i)
		{
			var dip = data_set.magres.dip[i];
			
			if ('mview_data' in dip)
			{
				n1 = atom_lookup[dip.atom1_id].n;
				n2 = atom_lookup[dip.atom2_id].n;
				out.write(" dipole\t" + n2 + " " + n1 + " " + (dip.mview_data[0]/(2.0*Math.PI))
				+ " " + (dip.mview_data[1]) + " " + (dip.mview_data[2]) + " " + (dip.mview_data[3]) + "\n");
			}
		}
	}
		
	if ('isc' in data_set.magres)
        {
	        for (var i = 0; i < data_set.magres.isc.length; ++i)
		{
			var isc = data_set.magres.isc[i];
			
			if ('mview_data' in isc)
			{
	                    n1 = atom_lookup[isc.atom1_id].n;
	                    n2 = atom_lookup[isc.atom2_id].n;				
			}
	                out.write(" jcoupling\t" + n2 + " " + n1 + " " + (isc.mview_data[0]) + " " + (isc.mview_data[1])
			+ " " + (isc.mview_data[2]) + " " + (isc.mview_data[3]) + " " + (isc.mview_data[4]) + " " + (isc.mview_data[5]) + "\n");
		}
	}
	
	if (data_set.soft_targ == "simpson")
	{			
		out.write('}');
	}


}

//A file format meant for parsing in Excel/Origin like software

function table_file_gen(data_set, out)
{
	//This kind of file is meant to be a recap with easy parsing as its main purpose
	
	//Uses the same method as the json one to gather data from Jmol	
	
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
	
	//Header lines
	
	var system_stochiometry = "";
	
	for (var i = 0; i < atom_set.atom_species_labels.length; ++i) {
		l = atom_set.atom_species_labels[i];
		system_stochiometry += l + "_" + atom_set.atom_species_sites[l].length + " ";
	}
	
	out.write("Tabulated NMR data for " + system_stochiometry + "\n");
	
	//If present, print isotropic magnetic shielding tensors
	if ("ms" in data_set.magres)
	{
		out.write("Magnetic shielding data (symmetric component)\n");
		out.write("Atom\ts_iso(ppm)\ts_aniso(ppm)\ts_asymm\ts_1(ppm)\ts_2(ppm)\ts_3(ppm)\talpha\tbeta\tgamma");
		for (var i = 0; i < data_set.magres.ms.length; ++i)
		{
			var id = data_set.magres.ms[i].atom_id;
			var sp_label = i_to_info[id][0];
			var atom_i = i_to_info[id][1];
			var el = i_to_info[id][2];
			
			var tens = data_set.magres.ms[i].sigma;
			
			var haeb = data_set.magres.ms[i].mview_data.slice(0, 3);
			var eul_ang = data_set.magres.ms[i].mview_data.slice(3, 6);
			
			var eigvals = [0.0, 0.0, 0.0];
			eigvals[2] = 2.0/3.0*haeb[1]+haeb[0];
			eigvals[0] = ((3.0*haeb[0] + eigvals[2])-(haeb[2]*2.0/3.0*haeb[1]))/2.0;
			eigvals[1] = ((3.0*haeb[0] + eigvals[2])+(haeb[2]*2.0/3.0*haeb[1]))/2.0;
			
			//Write down atomic label
			out.write("\n" + sp_label + "_" + atom_i);
			//Write down Haeberlen and eigenvalue representations and Euler angles
			out.write("\t" + haeb[0] + "\t" + haeb[1] + "\t" + haeb[2]);
			out.write("\t" + eigvals[0] + "\t" + eigvals[1] + "\t" + eigvals[2]);
			out.write("\t" + eul_ang[0] + "\t" + eul_ang[1] + "\t" + eul_ang[2]);			
		}
		
		out.write("\n\n");
		
	}

	//If present, print electric field gradient tensors
	if ("efg" in data_set.magres)
	{
		out.write("Electric field gradient data (symmetric component)\n");
		out.write("Atom\tChi(Hz)\tasymm\tv_1(Hz)\tv_2(Hz)\tv_3(Hz)\talpha\tbeta\tgamma");
		for (var i = 0; i < data_set.magres.efg.length; ++i)
		{
			var id = data_set.magres.efg[i].atom_id;
			var sp_label = i_to_info[id][0];
			var atom_i = i_to_info[id][1];
			var el = i_to_info[id][2];
			
			var tens = data_set.magres.efg[i].sigma;
			
			var haeb = data_set.magres.efg[i].mview_data.slice(0, 2);
			var eul_ang = data_set.magres.efg[i].mview_data.slice(2, 6);
			
			var eigvals = [0.0, 0.0, 0.0];
			eigvals[2] = 2.0/3.0*haeb[0];
			eigvals[0] = (eigvals[2]-(haeb[1]*2.0/3.0*haeb[0]))/2.0;
			eigvals[1] = (eigvals[2]+(haeb[1]*2.0/3.0*haeb[0]))/2.0;
			
			//Write down atomic label
			out.write("\n" + sp_label + "_" + atom_i);
			//Write down Haeberlen and eigenvalue representations and Euler angles
			out.write("\t" + haeb[0] + "\t" + haeb[1]);
			out.write("\t" + eigvals[0] + "\t" + eigvals[1] + "\t" + eigvals[2]);
			out.write("\t" + eul_ang[0] + "\t" + eul_ang[1] + "\t" + eul_ang[2]);			
		}
		
		out.write("\n\n");
	}
	
	//If present, print dipolar couplings
	if ("dip" in data_set.magres)
	{
		out.write("Dipolar coupling data\n")
		out.write("Atom1\tAtom2\tD(Hz)\talpha\tbeta");
		
		for (var i = 0; i < data_set.magres.dip.length; ++i)
		{
			var id1 = data_set.magres.dip[i].atom1_id;
			var id2 = data_set.magres.dip[i].atom2_id;
			var sp1_label = i_to_info[id1][0];
			var atom1_i = i_to_info[id1][1];
			var el1 = i_to_info[id1][2];
			var sp2_label = i_to_info[id2][0];
			var atom2_i = i_to_info[id2][1];
			var el2 = i_to_info[id2][2];
			
			var dip_c = data_set.magres.dip[i].mview_data[0];
			var eul_ang = data_set.magres.dip[i].mview_data.slice(1, 3);
			
									
			//Write down atomic labels
			out.write("\n" + sp1_label + "_" + atom1_i + "\t" + sp2_label + "_" + atom2_i);
			//Write down couplings and angles
			out.write("\t" + dip_c + "\t" + eul_ang[0] + "\t" + eul_ang[1]);
		}
		out.write("\n\n");
	
	}
	
	//If present, print internal spin-spin couplings
	if ("isc" in data_set.magres)
	{
		out.write("Internal spin-spin coupling data\n")
		out.write("Atom1\tAtom2\tJ(Hz)\taniso(Hz)\tasymm\tj_1(Hz)\tj_2(Hz)\tj_3(Hz)\talpha\tbeta\tgamma");
		
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
			
			var haeb = data_set.magres.isc[i].mview_data.slice(0, 3);
			var eul_ang = data_set.magres.isc[i].mview_data.slice(3, 6);
			
			var eigvals = [0.0, 0.0, 0.0];
			eigvals[2] = 2.0/3.0*haeb[1]+haeb[0];
			eigvals[0] = ((3.0*haeb[0] + eigvals[2])-(haeb[2]*2.0/3.0*haeb[1]))/2.0;
			eigvals[1] = ((3.0*haeb[0] + eigvals[2])+(haeb[2]*2.0/3.0*haeb[1]))/2.0;
			
			//Write down atomic labels
			out.write("\n" + sp1_label + "_" + atom1_i + "\t" + sp2_label + "_" + atom2_i);
			//Write down data
			out.write("\t" + haeb[0] + "\t" + haeb[1] + "\t" + haeb[2]);
			out.write("\t" + eigvals[0] + "\t" + eigvals[1] + "\t" + eigvals[2]);
			out.write("\t" + eul_ang[0] + "\t" + eul_ang[1] + "\t" + eul_ang[2]);
		}
		
		out.write("\n\n");
	
	}

}

//A file format optimized for transferring data to a Python script

function json_file_gen(data_set, out)
{
	//A dataset containing all necessary quantities is generated, so that it might be imported later in a Python script
	//Its structure is thought as to be compatible with Tim Green's MagresAtom Python library conventions, but has added elements to store software target, diagonalized data, etc.	
	
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
			if (atom_set.lattice_pars == null) {
				//If there are no lattice parameters, "unitcell" is meaningless
				return "{all}";
			}
			else
			{
				return "{cell=555 and not (cell=556 or cell=565 or cell=655)}";
			}
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

function init_data_set(data_set)
{			
	data_set.magres_view = "Made with MagresView " + magresview_version_number,		//Tagline
		
	data_set.soft_targ = "", //Software target of the JSON file, the final format to be generated for NMR simulation
		
	data_set.atoms = {units: [], lattice: [], atom: [], isotopes: {}},	//Will contain units, lattice, elements, isotopes and atom coordinates for the system
		
	data_set.magres = {units: []}	//Will contain efg, isc, ms, and dipolar interaction terms for the system

}

//Fill in the data_set with the required atoms

function compile_data_set(ds, ac, use_all)
{
	var eul_conv = "zyz"; //May be changed in future
	var conv_table = {
		"zyz": "%6",
		"zxz": "%5" 
	}
	
	ds.soft_targ = document.getElementById("soft_targ_drop").value;
	
	var atom_n = 0;    //All atoms in data_set will be simply ordered by an increasing number, no crystallographic labels
	var atom_map = []; //For the sake of speed, a map which correlates species numbers and indices to the corresponding value of atom_n
	
	var abc = atom_set.lattice_pars;	//Storing the lattice parameters for convenience
	var ch = choice_atomexp(ac);
	
	var use_rotated_frame = document.getElementById("rot_file_check").checked;
	var rot_matrix = null;
	
	//To prevent errors if there is no lattice data; it will be irrelevant anyway, because in this case the k_*_max will all be zero
	
	if (use_rotated_frame) {
		
		//Here we store the current orientation quaternion to express properly all further tensor orientations & coordinates down the line
		
		Jmol.script(mainJmol, 'rot_q = quaternion();')
	}

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
		
		if (!use_rotated_frame) {
			ds.atoms.lattice.push(abc);
		}
		else
		{
			// Form lattice parameters as points in Jmol, THEN rotate them.
			var temp_abc = new Array();
			var rotated_lattice_script = 	'par_a = rot_q%{1/1 0 0};' + 
							'par_b = rot_q%{0 1/1 0};' +
							'par_c = rot_q%{0 0 1/1};';
			
			Jmol.scriptWait(mainJmol, rotated_lattice_script);
			temp_abc[0] = Jmol.evaluateVar(mainJmol, 'par_a');
			temp_abc[1] = Jmol.evaluateVar(mainJmol, 'par_b');
			temp_abc[2] = Jmol.evaluateVar(mainJmol, 'par_c');
			ds.atoms.lattice.push(temp_abc);
			
		}
	}
		
	ds.atoms.units.push(["atom", "Angstrom"]);
	
	if (!rotated_lattice_script) {
		Jmol.scriptWait(mainJmol, "coord_info = []; for (a in " + ch + ") {coord_info = coord_info or [a.atomno, a.atomname, a.element, a.xyz];}");
	}
	else
	{
		Jmol.scriptWait(mainJmol, "coord_info = []; for (a in " + ch + ") {coord_info = coord_info or [a.atomno, a.atomname, a.element, rot_q%a.xyz];}");		
	}
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
				try
				{
					var isos = Jmol.getPropertyAsJavaObject(mainJmol, "NMRinfo", a_el).toArray();					
				}
				catch(err)
				{
					return false;
				}
				for (var iso = 0; iso < isos.length; ++iso)
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
		var ms_calc_script = "ms_info = []; for (a in " + ch + ") {ms_info = ms_info or [a.atomno, a.tensor('ms', 'asymmatrix'), a.tensor('ms', 'isotropy'), a.tensor('ms', 'anisotropy'), a.tensor('ms', 'asymmetry'),";
		
		if (!rotated_lattice_script) {
			ms_calc_script += " quaternion(a.tensor('ms', 'quaternion'))" + conv_table[eul_conv] + "];}";
		}
		else
		{
			ms_calc_script += " (quaternion(a.tensor('ms', 'quaternion')) * rot_q)" + conv_table[eul_conv] + "];}";

		}
		 		
		Jmol.scriptWait(mainJmol, ms_calc_script);
		var ms_info = Jmol.evaluateVar(mainJmol, "ms_info");
		
		for (var i = 0; i < ms_info.length-5; i += 6)
		{
			var a_no = ms_info[i];
			var ms_reference = parseFloat(document.getElementById('ref_input_' + ds.atoms.isotopes[a_no][1]).value);
			var a_sigma = ms_info[i+1][0];
			var a_iso = ms_info[i+2][0];
			if (!isNaN(ms_reference))
			{
				a_iso = ms_reference - a_iso;
			}
			var a_aniso = ms_info[i+3][0];
			var a_asymm = ms_info[i+4][0];
			var a_alpha = ms_info[i+5][0];
			var a_beta  = ms_info[i+5][1];
			var a_gamma = ms_info[i+5][2];
			
			// A small simplification for special cases
			
			if (a_beta == 0) {
				a_alpha = (a_alpha+a_gamma)%360;
				a_gamma = 0;
			}
			
			// If required, make Jmol rotate the matrix
			
			if (rotated_lattice_script) {
				
				if (rot_matrix == null) {
					rot_matrix = Jmol.evaluateVar(mainJmol, '(rot_q%-9)');
				}
				
				a_sigma = mat3_product(a_sigma, rot_matrix);
				a_sigma = mat3_product(transpose(rot_matrix), a_sigma);
			}

			ds.magres.ms[i/6] = {
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
		var efg_calc_script = "efg_info = []; for (a in " + ch + ") {efg_info = efg_info or [a.atomno, a.tensor('efg', 'asymmatrix'), a.tensor('efg', 'chi'), a.tensor('efg', 'asymmetry'),";
		if (!rotated_lattice_script) {
			efg_calc_script += " quaternion(a.tensor('efg', 'quaternion')) " + conv_table[eul_conv] + "];}";
		}
		else
		{
			efg_calc_script += " (quaternion(a.tensor('efg', 'quaternion')) * rot_q)" + conv_table[eul_conv] + "];}";			
		}

		Jmol.scriptWait(mainJmol, efg_calc_script);

		var efg_info = Jmol.evaluateVar(mainJmol, "efg_info");
		
		for (var i = 0; i < efg_info.length-4; i += 5)
		{
			var a_no = efg_info[i];
			var a_V = efg_info[i+1][0];
			var a_chi = efg_info[i+2][0]
			var a_asymm = efg_info[i+3][0]
			var a_alpha = efg_info[i+4][0];
			var a_beta  = efg_info[i+4][1];
			var a_gamma = efg_info[i+4][2];
			
			// A small simplification for special cases
			
			if (a_beta == 0) {
				a_alpha = (a_alpha+a_gamma)%360;
				a_gamma = 0;
			}
			
			// If required, make Jmol rotate the matrix
			
			if (rotated_lattice_script) {
				
				if (rot_matrix == null) {
					rot_matrix = Jmol.evaluateVar(mainJmol, '(rot_q%-9)');
				}
				
				a_V = mat3_product(a_V, rot_matrix);
				a_V = mat3_product(transpose(rot_matrix), a_V);
			}


			ds.magres.efg[i/5] = {
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
		
		var dip_calc_script = "dip_info = []; for (i = 1; i < " + ch + ".length; ++i) {for (j=i+1; j<= " + ch + ".length; ++j) {dip_info = dip_info or [measure(" + ch + "[i] " + ch + "[j], \"khz\")]; r = " + ch + "[i].xyz-" + ch + "[j].xyz;";
		if (rotated_lattice_script) {
			dip_calc_script += "r = rot_q % r;";
		}
		dip_calc_script += "mod = sqrt(r*r); dip_info = dip_info or [r/mod];}}";
		
		Jmol.scriptWait(mainJmol, dip_calc_script);
		var dip_info = Jmol.evaluateVar(mainJmol, "dip_info");
		
		for (var i = 0; i < dip_info.length-1; i += 2)
		{
			var a_dip = dip_info[i][0].split('\t');
			var a_b = parseFloat(a_dip[1])*1000.0;		//Coupling constant in Hz
			var a_no_1 = parseInt(a_dip[3].substring(a_dip[3].indexOf('#')+1));
			var a_no_2 = parseInt(a_dip[4].substring(a_dip[4].indexOf('#')+1));
			var a_r = dip_info[i+1];
						
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
		
		var isc_calc_script = "isc_info = []; for (i = 1; i < " + ch + ".length; ++i) {for (j=i+1; j<= " + ch + ".length; ++j) {isc_info = isc_info or [({(" + ch + ")[i] or (" + ch + ")[j]}.tensor(\"isc\", \"j\")[1])[3], \
								    ({(" + ch + ")[i] or (" + ch + ")[j]}.tensor(\"isc\", \"eta\")[1])[3], ({(" + ch + ")[i] or (" + ch + ")[j]}.tensor(\"isc\", \"asymmetry\")[1])[3],";
		if (!rotated_lattice_script) {
			isc_calc_script += "(({(" + ch + ")[i] or (" + ch + ")[j]}.tensor(\"isc\", \"quaternion\")[1])[3])" + conv_table[eul_conv] + ",";
		}
		else
		{
			isc_calc_script += "((({(" + ch + ")[i] or (" + ch + ")[j]}.tensor(\"isc\", \"quaternion\")[1])[3]) * rot_q) " + conv_table[eul_conv] + ",";
		}
				
		isc_calc_script += "({(" + ch + ")[i] or (" + ch + ")[j]}.tensor(\"isc\", \"asymmatrix\")[1])[3],";			   
		isc_calc_script += ch + "[i].atomno," + ch + "[j].atomno];}}";
		
		
		Jmol.scriptWait(mainJmol, isc_calc_script);
		
		/// THIS SHOULD BE REPLACED WITH AN evaluateVar CALL SOONER OR LATER ///
		
		var isc_info = Jmol.evaluateVar(mainJmol, "isc_info");
		
		nonzero_isc = 0;
		
		for (var i = 0; i < isc_info.length-6; i += 7)
		{			
			var a_J = isc_info[i];
			var a_eta = isc_info[i+1];
			var a_asymm = isc_info[i+2];
			var a_eulang = isc_info[i+3];
			var a_eul_a = a_eulang[0];
			var a_eul_b = a_eulang[1];
			var a_eul_c = a_eulang[2];
			var a_sigma = isc_info[i+4];
			var a_no_1 = isc_info[i+5];
			var a_no_2 = isc_info[i+6];
			
			// A small simplification for special cases
			
			if (a_eul_b == 0) {
				a_eul_a = (a_eul_a+a_eul_c)%360;
				a_eul_c = 0;
			}
			
			if (isNaN(a_J))
			{
				continue;
			}
			
			ds.magres.isc[nonzero_isc] = {
				sigma: a_sigma,
				mview_data: [a_J, a_eta, a_asymm, a_eul_a, a_eul_b, a_eul_c],				//Right now only the isotropic component of ISC is implemented!
				atom1_id: a_no_1,
				atom2_id: a_no_2,
			}
						
			++nonzero_isc;

		}
		
	}
	
	return true;
}

function ref_table_gen() {
	
	$('.ref_table').html('').append('<tr><td>Element</td><td>Reference (ppm)</td></tr>');
	
	for (var s = 0; s < atom_set.speciesno; ++s)
	{
		var t_row = $('<tr></tr>');
		t_row.append($('<td></td>').html(atom_set.atom_species_labels[s]).attr('id', 'ref_label_' + atom_set.atom_species_labels[s]));
		t_row.append($('<td></td>').append($('<input></input>').addClass('ref_input').attr({'id': 'ref_input_' + atom_set.atom_species_labels[s], 'value': NaN})));
		
		$('.ref_table').append(t_row);
	}
	
}

function ref_table_popup_handler()
{
	var active = $("#main_tabs").tabs("option", "active");
	if(active == tab_index("#spec_plot"))
		svg_spectrum_plot(true);
}

//Useful bit of code for Euler angles output
function rad2deg(a)
{
	return a/Math.PI*180.0;
}

//Convenient, turns a 3x3 matrix into a Jmol string representation
function mat3_to_string(m)
{
	s = '';
	
	if (m.length != 3) {
		return s;
	}
	
	for (var i = 0; i<3; ++i) {
		if (m[i].length != 3) {
			return s;
		}
	}
	
	s += '[';
	
	for (var i = 0; i<3; ++i) {
		s+='[';
		for (var j = 0; j<3; ++j) {
			s+= m[i][j];
			if (j < 2) {
				s += ',';
			}
		}
		s+=']';
		if (i<2) {
			s+=',';
		}
	}
	
	s+=']';
	
	return s;
	
}
