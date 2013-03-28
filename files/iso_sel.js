//MagresView 
//by Simone Sturniolo
//
//Copyright 2013 Science and Technology Facilities Council
//This software is distributed under the terms of the GNU General Public License (GNU GPL)
//Please refer to the file COPYING for the text of the license

//This file handles the dropdown menu controlling the choice of isotopes for the various elements

//This function updates the element selection dropdown with the elements currently present in the model.
//It's called by the "file loaded" callback of the JMol applet

function elem_dropdown_update()
{
		var dropd = document.getElementById("elem_drop");
		
		dropd.options.length = atom_set.atom_elems.length+1; //The additional one is the "all" option
		
		dropd.options[0] = new Option("All elements", "all");

		var i = 1;
		for (elem in atom_set.atom_elems)
		{
			dropd.options[i] = new Option(elem, elem);
			++i;
		}
}

function iso_dropdown_update()
{
		var dropd = document.getElementById("iso_drop");
		var elem = document.getElementById("elem_drop").value;
		var sel_index = -1;
		
		if (elem == "all")
		{
			dropd.options.length = 2;

			dropd.options[0] = new Option("Default", "def");			
			dropd.options[1] = new Option("Inactive", "inac");	
			
			dropd.selectedIndex = -1;		
		}
		else if (iso_table[elem].length == 0)
		{
			dropd.options.length = 1;

			dropd.options[0] = new Option("Inactive", "inac");
		}
		else
		{			
			dropd.options.length = iso_table[elem].length+1; //The additional one is the "inactive" option

			
			var i = 0;
			
			for (iso in iso_table[elem])
			{
				
				if (iso == "DEF")
					dropd.options[i] = new Option("Default", iso_table[elem]['DEF']);
				else
					dropd.options[i] = new Option(iso, iso);
				if (atom_set.atom_elems[elem] == iso)
				{
					sel_index = i;
				}
				++i;
			}

			dropd.options[i] = new Option("Inactive", "inac");			

			if (sel_index == -1)
			{
				sel_index = i;
			}
			
			dropd.selectedIndex = sel_index;
		}
}

function elem_drop_handler(event)
{
	iso_dropdown_update();
}

function iso_drop_handler(event)
{
	var elem = document.getElementById("elem_drop").value;
	var iso = event.target.value;
		
	if (elem == "all")
	{
		if (iso == "def")
		{
				for (e in atom_set.atom_elems)
				{
					//For every atom, we check if there's a record of that atom. If there's not, the isotope is "0", meaning it's NMR inactive.
					//If there is, we use the default ( = most abundant) isotope
					
					if (iso_table[e].length == 0)
					{
						atom_set.atom_elems[e] = 0;
					}
					else
					{
						atom_set.atom_elems[e] = iso_table[e]['DEF'];
					}
				}
		}
		
		if (iso == "inac")
		{
				for (e in atom_set.atom_elems)
				{
					atom_set.atom_elems[e] = 0;
				}
		}
	}
	else
	{
		if (iso == "inac")
		{
			atom_set.atom_elems[elem] = 0;
		}
		else
		{
			atom_set.atom_elems[elem] = iso;
		}
	}
	
	//These plotting functions are rerun to update the label numerical values to any changes made in the isotopes
			if (document.getElementById("efg_check_2").checked == true)
				efg_label_handler();

			if (document.getElementById("isc_check_2").checked == true)
				isc_label_handler();

}
