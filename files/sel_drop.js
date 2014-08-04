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
	
	dropd.options.length = atom_set.speciesno + 2; //The additional ones are the "all" and the "custom" option
	dropd_atoms.options.length = 1;

	if(atom_set.atom_species_sites == null)
		dropd_atoms.disabled = true;

	for (var s = 0; s < atom_set.speciesno; ++s)
	{
		dropd.options[s+1] = new Option(atom_set.atom_species_labels[s], atom_set.atom_species_labels[s]);
	}

	dropd.options[atom_set.speciesno + 1] = new Option("Custom", "custom");
	
	// To update range_file_atom_drop and vvleck_atom_drop
//	range_file_species_drop_handler();
//	vvleck_species_drop_handler();
	
}

function sel_drop_handler(from_change)
{
	var sp = document.getElementById("sel_drop").value;
	var dropd_atoms = document.getElementById("sel_atom_drop");
	
	script_callback_flag_selectiondrop = true;
	
	if (sp == "all")
	{
		dropd_atoms.disabled = true;
		dropd_atoms.options.length = 1;
		Jmol.script(mainJmol, "set pickingstyle select none; set picking measure distance; select displayed");
	}
	else if (sp == "custom")
	{
		dropd_atoms.disabled = true;
		dropd_atoms.options.length = 1;
		document.getElementById("halos_check").checked = true;
		Jmol.script(mainJmol, "selectionhalos on; set pickingstyle select drag; set picking select atom");
	}
	else
	{
		if (atom_set.atom_species_sites == null)
		{
			dropd_atoms.disabled = true;
			Jmol.script(mainJmol, "set pickingstyle select none; set picking measure distance; select displayed and {_" + sp + "};");
		}
		else if (from_change)	// from_change prevents resetting the selection when sel_drop_handler is not called as a callback of sel_drop
		{
			dropd_atoms.disabled = false;
			dropd_atoms.options.length = atom_set.atom_species_sites[sp].length + 1;
			for (var i = 1; i < dropd_atoms.options.length; ++i)
				dropd_atoms.options[i] = new Option(atom_set.atom_species_sites[sp][i-1], atom_set.atom_species_sites[sp][i-1]);
			Jmol.script(mainJmol, "set pickingstyle select none; set picking measure distance; select displayed and " + sp + "_*");
		}
		else
		{
			sel_atom_drop_handler();
		}
	}
	
}

function sel_atom_drop_handler(turn_flag_on)
{
	var sp = document.getElementById("sel_drop").value;
	var ind = document.getElementById("sel_atom_drop").value;
	
	script_callback_flag_selectiondrop = true;

	if (sp == "all")
		Jmol.script(mainJmol, "select displayed");
	else if (ind == "all")
		Jmol.script(mainJmol, "select displayed and " + sp + "_*");
	else
		Jmol.script(mainJmol, "select displayed and " + sp + "_" + ind);

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
	var sp = document.getElementById("sel_drop").value;
	var ind = document.getElementById("sel_atom_drop").value;
	var bond_script = "";
	
	if (is_on == true)
		bond_script += "select all; color bonds none;";
	else
		bond_script += "select all; color bonds black translucent 1.0;";
		
	if (sp == "all")
	{
		bond_script += "select all";
	}
	else if (ind == "all")
	{
		bond_script += "select " + sp + "_*";
	}
	else
	{
		bond_script += "select " + sp + "_" + ind;
	}
		
	Jmol.script(mainJmol, bond_script);
}

function axes_check_handler()
{
	var is_on = document.getElementById("axes_check").checked;

	if (is_on == true)
		Jmol.script(mainJmol, "set axes unitcell; axes ON; unitcell ON;");
	else
		Jmol.script(mainJmol, "axes OFF; unitcell OFF;");
	
}

function labels_check_handler()
{
	var is_on = document.getElementById("labels_check").checked;

	var label_script = "";

	if (is_on == true)
		label_components[0] = "%[atomname]";
	else
		label_components[0] = "";

	Jmol.script(mainJmol, label_composer());
}

function sticks_check_handler()
{
	var is_on = document.getElementById("sticks_check").checked;

	if (document.getElementById("sel_drop").value == "custom")
	{
		var sel_list = jmolEvaluate_each(mainJmol, "selected");
	}

	var sticks_script = "select *;"

	if (is_on == false)
	{
		sticks_script += "wireframe only;"
	}
	else
	{
		sticks_script += "wireframe 0.15; spacefill 23%;"
	}

	Jmol.script(mainJmol, sticks_script);
	
	if (document.getElementById("sel_drop").value == "custom")
	{
		sel_script = "select none";
		for (var s = 0; s < atom_set.atom_species_labels.length; ++s)
		{
			for (var a = 0; a < atom_set.atoms[s].length; ++a)
			{
				if(sel_list[s][a] == 1.0)
				{
					var atom_name = atom_set.atom_species_labels[s] + "_" + (a+1);
					sel_script += " or " + atom_name;
				}
			}
		}
		Jmol.script(mainJmol, sel_script);
	}
	else
	{
		sel_atom_drop_handler();
	}
}

function is_selected(species, atom_i)
{
	var atom_name = species + "_" + atom_i;
	var ans = Jmol.evaluate(mainJmol, "{" + atom_name + "}.selected");

	if (ans == 1.0)
		return true;
	else
		return false;
}