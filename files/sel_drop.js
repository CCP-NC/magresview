//MagresView 
//by Simone Sturniolo
//
//Copyright 2013 Science and Technology Facilities Council
//This software is distributed under the terms of the GNU General Public License (GNU GPL)
//Please refer to the file COPYING for the text of the license

//This file contains functions useful for handling the "select species" and "select atom" dropdown menus

//This function edits the dropdown menu for selection of single species adding in the various labels

function dropdown_update()
{
	var dropd = document.getElementById("sel_drop");
	var dropd_atoms = document.getElementById("sel_atom_drop");
	// This dropdown menu, used in file output, is updated at the same time 
	var file_out_dropd = document.getElementById("range_file_species_drop");
	
	dropd.options.length = atom_set.speciesno + 1; //The additional one is the "all" option
	dropd_atoms.options.length = 1;
	file_out_dropd.options.length = atom_set.speciesno;

	for (var s = 0; s < atom_set.speciesno; ++s)
	{
		dropd.options[s+1] = new Option(atom_set.atom_species_labels[s], atom_set.atom_species_labels[s]);
		file_out_dropd.options[s] = new Option(atom_set.atom_species_labels[s], atom_set.atom_species_labels[s]);
		
		//The function also defines the Jmol groups corresponding to the various labels for future selection
		var sel_script = "define ~species_label_" + atom_set.atom_species_labels[s] + " ";
		var start_number = atom_set.starting_nums[s];
		
		sel_script += atom_set.atoms[s][0].elem + (start_number + 1);
		
		for (var a = 1; a < atom_set.atoms[s].length; ++a)
		{
			sel_script += ", " + atom_set.atoms[s][a].elem + (start_number + a + 1);
		}
		
	   Jmol.script(mainJmol, sel_script);
	}
	
	// To update range_file_atom_drop
	range_file_species_drop_handler();
	
}

function sel_drop_handler()
{
	var el = document.getElementById("sel_drop").value;
	var dropd_atoms = document.getElementById("sel_atom_drop");

	script_callback_flag_selectiondrop = true;
		
	if (el == "all")
	{
		dropd_atoms.options.length = 1;
//		dropd_atoms.options[0] = new Option("All atoms", "all");
		Jmol.script(mainJmol, "select all");
	}
	else
	{
		var s = atom_set.atom_species[el];
		dropd_atoms.options.length = atom_set.atoms[s].length + 1;
//		dropd_atoms.options[0] = new Option("All atoms", "all");
		for (var i = 1; i < dropd_atoms.options.length; ++i)
			dropd_atoms.options[i] = new Option(i, i);
		Jmol.script(mainJmol, "select ~species_label_" + el);
	}	
}

function sel_atom_drop_handler()
{
	var el = document.getElementById("sel_drop").value;
	var ind = document.getElementById("sel_atom_drop").value;
		
	script_callback_flag_selectiondrop = true;	

	if (el == "all")
		Jmol.script(mainJmol, "select all");
	else if (ind == "all")
		Jmol.script(mainJmol, "select ~species_label_" + el);
	else
		Jmol.script(mainJmol, "select {~species_label_" + el + "}[" + ind + "]");	
}

function halos_check_handler()
{
	var is_on = document.getElementById("halos_check").checked;
	
	if (is_on == true)
		Jmol.script(mainJmol, "selectionHalos ON");
	else
		Jmol.script(mainJmol, "selectionHalos OFF");
	
}

function bonds_check_handler()
{
	var is_on = document.getElementById("bonds_check").checked;
	var el = document.getElementById("sel_drop").value;
	var ind = document.getElementById("sel_atom_drop").value;
	var bond_script = "";
	
	if (is_on == true)
		bond_script += "select all; color bonds none;";
	else
		bond_script += "select all; color bonds black translucent 1.0;";
		
	if (el == "all")
	{
		bond_script += "select all";
	}
	else if (ind == "all")
	{
		bond_script += "select ~species_label_" + el;
	}
	else
	{
		bond_script += "select {~species_label_" + el + "}[" + ind + "]";
	}
		
	Jmol.script(mainJmol, bond_script);
}

function axes_check_handler()
{
	var is_on = document.getElementById("axes_check").checked;

	if (is_on == true)
		Jmol.script(mainJmol, "axes ON; unitcell ON;");
	else
		Jmol.script(mainJmol, "axes OFF; unitcell OFF;");
	
}

function labels_check_handler()
{
	var is_on = document.getElementById("labels_check").checked;
	
	var labels_script = "set labeloffset 10 10;";
	
	for (var s = 0; s < atom_set.atoms.length; ++s)
	{
		for (var a = 0; a < atom_set.atoms[s].length; ++a)
		{
			labels_script += "select " + atom_set.atoms[s][a].elem + (atom_set.starting_nums[s] + a + 1) + ";";
			if (is_on == true)
			{
				labels_script += "label \"" + atom_set.atom_species_labels[s] + " " + (a+1) + "\"; color label white;";
			}
			else
			{
				labels_script += "label \"\";";				
			}
		}
	}
		
	Jmol.script(mainJmol, labels_script);
	
	sel_atom_drop_handler();
}

function is_selected(species, atom_i)
{
	var s = document.getElementById("sel_drop").value;
	var i = document.getElementById("sel_atom_drop").value;
	
//	alert(s);
	
	if (s == "all")
		return true;
	else if (s == species)
	{
		if((i == "all") || (atom_i == i))
			return true;
	}
	
	return false;
}


