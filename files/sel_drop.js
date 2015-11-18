//MagresView 
//by Simone Sturniolo
//
//Copyright 2013 Science and Technology Facilities Council
//This software is distributed under the terms of the GNU General Public License (GNU GPL)
//Please refer to the file COPYING for the text of the license

//This file contains functions useful for handling the "select species" and "select atom" dropdown menus

// This function initializes the sel_drop menus with jQuery multiselect

function sel_drop_init()
{
	var contW = $('#sel_drop_container').width();

    $("#sel_drop").multiselect({
    	minWidth: contW/2.2,
    	checkAllText: "All species",
    	uncheckAllText: "Pick selection",
    	noneSelectedText: "Pick atoms to select",
    	selectedText: "# species of # selected",
    	selectedList: 9,				// A default value
        show: ['clip', 200],
        hide: ['clip', 200],
        classes: 'mySelDrop',
        click: sel_drop_handler,		// Same handler for any change 
        checkAll: sel_drop_handler,
        uncheckAll: sel_drop_handler,
    });


    $("#sel_atom_drop").multiselect({
    	minWidth: contW/2.2,
    	checkAllText: "All atoms",
    	uncheckAllText: "None",
    	noneSelectedText: "No atom selected",
    	selectedText: "# atoms of # selected",
        show: ['clip', 200],
        hide: ['clip', 200],
        classes: 'mySelDrop',
        click: sel_atom_drop_handler,
        checkAll: sel_atom_drop_handler,
        uncheckAll: sel_atom_drop_handler,
    });
}

function sel_drop_selected()
{
	return $('#sel_drop').multiselect('getChecked').map(function() {return this.value;}).get();
}

function sel_atom_drop_selected()
{
	return $('#sel_atom_drop').multiselect('getChecked').map(function() {return this.value;}).get();
}

//This function edits the dropdown menu for selection of single species adding in the various labels

function sel_drop_update()
{
	var dropd = $("#sel_drop");

	// This dropdown menu, used in file output, is updated at the same time 
	
	// First, clear them out altogether
	dropd.html('');

	// Now create the options for the various species
	for (var s = 0; s < atom_set.speciesno; ++s)
	{
		var sp = atom_set.atom_species_labels[s];
		var s_opt = $('<option>').attr('value', sp).text(sp);
		dropd.append(s_opt);
	}

	// Finally, refresh the multiselect menus or nothing will change
	dropd.multiselect('refresh');
	dropd.multiselect('checkAll');
}

function sel_atom_drop_update()
{
	var dropd_atoms = $("#sel_atom_drop");

	// Get list of selected species on sel_drop
	var sel = sel_drop_selected();

	dropd_atoms.html('');

	for (var s = 0; s < sel.length; ++s)
	{
		var sp = sel[s];
		var sp_optgroup = $('<optgroup>').attr('label', sp);
		for (var i = 0; i < atom_set.atom_species_sites[sp].length; ++i)
		{
			var sp_site = atom_set.atom_species_sites[sp][i];
			var a_opt = $('<option>').attr('value', sp + '_' + sp_site).text(sp + '_' + sp_site);
			sp_optgroup.append(a_opt);
		}
		dropd_atoms.append(sp_optgroup);
	}

	dropd_atoms.multiselect('refresh');
	dropd_atoms.multiselect('checkAll');
}

function sel_drop_handler(evt)
{
	// Get the selected elements
	var sel = sel_drop_selected();
	var dropd_atoms = $("#sel_atom_drop");
	
	if (sel.length == 0)
	{
		// Custom selection is on
		dropd_atoms.multiselect('option', 'noneSelectedText', 'Pick atoms to select');
		dropd_atoms.multiselect('option', 'selectedText', 'Pick atoms to select');
		dropd_atoms.multiselect('disable');
		var select_script = "selectionhalos on; set pickingstyle select drag; set picking select atom; message 'selected_change';";
		$('#halos_check').prop('checked', true);
		Jmol.script(mainJmol, select_script);
	}
	else
	{
		// Regular stuff; selection is left to sel_atom_drop_handler
		dropd_atoms.multiselect('enable');
		dropd_atoms.multiselect('option', 'noneSelectedText', 'No atom selected');
		dropd_atoms.multiselect('option', 'selectedText', '# atoms of # selected');
		sel_atom_drop_update();
	}

}

function sel_atom_drop_handler(evt)
{
	var dropd_atoms = $("#sel_atom_drop");
	var sel 		= sel_drop_selected();
	var sel_atom 	= sel_atom_drop_selected();

	var max_sel_atom = dropd_atoms.find('option').length; 	// To check for an 'all' condition

	// Resetting the aftermath of a potential "picking" selection
	var select_atom_script = "set pickingstyle select none; set picking measure distance; select displayed";

	// Now for the various possible combinations
	if (sel_atom.length == max_sel_atom)
	{
		if(sel.length == atom_set.speciesno)
		{
			// We're selecting EVERYTHING
			select_atom_script += ";";
		}
		else
		{
			select_atom_script += " and (";
			// We're just selecting whole species...
			for (var s = 0; s < sel.length; ++s)
			{
				select_atom_script += sel[s] + '_*' + (s < (sel.length-1)? ' or ' : ');');
			}
		}
	}
	else if (sel_atom.length > 0)
	{
		// Single selection
		select_atom_script += " and (";
		// We're just selecting whole species...
		for (var s = 0; s < sel_atom.length; ++s)
		{
			select_atom_script += sel_atom[s] + (s < (sel_atom.length-1)? ' or ' : ');');
		}
	}
	else
	{
		select_atom_script += " and none;";
	}

	select_atom_script += "message 'selected_change';";
	Jmol.script(mainJmol, select_atom_script);

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