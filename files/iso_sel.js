//MagresView 
//by Simone Sturniolo
//
//Copyright 2013 Science and Technology Facilities Council
//This software is distributed under the terms of the GNU General Public License (GNU GPL)
//Please refer to the file COPYING for the text of the license

//This file handles the dropdown menu controlling the choice of isotopes for the various elements

//This function updates the element selection dropdown with the elements currently present in the model.
//It's called by the "file loaded" callback of the JMol applet

function iso_drop_update()
{
	//Quit immediately if the currently selected tab is not the one of isotope selection

	var tab_active = $("#main_tabs").tabs("option", "active");
	if(tab_active != tab_index("#iso_selection"))
	{
		return;
	}

	//Get data on selection

	var sel_elems = Jmol.evaluate(mainJmol, "{selected}.element").split('\n');
	var iso_drop = document.getElementById('iso_drop');

	while(sel_elems.indexOf('') >= 0)
		sel_elems.splice(sel_elems.indexOf(''), 1);

	if(sel_elems.length == 0)
		return;

	var k = 0;
	while (!isNaN(parseInt(sel_elems[0].charAt(k))))
		++k;
	var el = sel_elems[0].substring(k);

	//Check for the special case of Hydrogen-Deuterium-Tritium

	var is_h = ("H_D_T").indexOf(el);

	if (is_h >=0)
	{
		el = "H";
		for (var i = 1; i < sel_elems.length; ++i)
		{
			if (("H_D_T").indexOf(sel_elems[i]) < 0)
			{
				iso_drop.disabled = true;
				return;
			}

		}

	}
	else
	{
		for (var i = 1; i < sel_elems.length; ++i)
		{
			var k = 0;
			while (!isNaN(parseInt(sel_elems[i].charAt(k))))
				++k;
			e = sel_elems[i].substring(k);

			if (e != el)
			{
				iso_drop.disabled = true;
				return;
			}
		}
	}

	iso_drop.disabled = false;

	var iso_raw_list = Jmol.getPropertyAsJavaObject(mainJmol, "NMRinfo", el).toArray();
	var iso_list = [];

	for (var i = 0; i < iso_raw_list.length; ++i)
	{
		iso_list.push(iso_raw_list[i][0]);
	}

	iso_drop.options.length = iso_list.length + 2;

	for (var i=0; i < iso_list.length; ++i)
	{
		var iso_name = Math.abs(iso_list[i]) + el;
		iso_drop.options[i+2] = new Option(iso_name, iso_name);
		if (iso_list[i] < 0)
		{
			iso_drop.options[1] = new Option("Default (" + iso_name + ")", iso_name);
		}
	}

}

function iso_drop_handler()
{
	Jmol.script(mainJmol, "{selected}.element = \"" + iso_drop.value + "\"");
	load_data_asproperty();
	plot_update();
}
