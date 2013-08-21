//MagresView 
//by Simone Sturniolo
//
//Copyright 2013 Science and Technology Facilities Council
//This software is distributed under the terms of the GNU General Public License (GNU GPL)
//Please refer to the file COPYING for the text of the license

//This file handles the loading and parsing of .magres files, and the storage of the data they contain into a suitable data structure

//Some global variables of general use

var last_loaded_file = null;						//Holds the last successfully loaded file as string

var supercell_border = 2;							//Standard value for the supercell's width.

var default_displaygroup = null;					//Basic Jmol atom expression for default displaying of the structure

var label_components = ["", "", ""];				//This will hold the various pieces of the atom labels: [name, ms properties, efg properties]

//Data structure holding some essential atom information

var atom_set = {

	speciesno: 0,														//Total number of species (by crystallographic label) in the system
		
	atom_species_labels: [],											//Array: number -> label

	atom_species_sites: {},											    //Hash: label -> array of sites with that label 
	
	lattice_pars: [], 													//Tensor object containing lattice parameters

	has_ms: false,														//True if the current dataset has magnetic shielding data

	has_efg: false,														//As above, for electric field gradient

	efg_tags: [],														//Tags for various efg components

	has_isc: false,														//As above, for indirect spin coupling

	isc_tags: [],														//Tags for various isc components
	
	is_magres: true														//Flag to keep track if the original file was a .magres one or not
	
};

function reset_system()
{
	supercell_border = 2;

	atom_set = {

		speciesno: 0,
				
		atom_species_labels: [],
	
		atom_species_sites: {},										

		lattice_pars: [],	

		has_ms: false,				

		has_efg: false,		

		efg_tags: [], 											

		has_isc: false,												

		isc_tags: [], 											

		is_magres: true
	
	};
}

//File loading handling

function load_file(evt)
{
	// Check for the various File API support.
	if (window.File && window.FileReader && window.FileList && window.Blob) {
	  // Huge success! All the File APIs are supported.
	} else {
	  alert("The File APIs are not fully supported in this browser. Please load your files using the console");
	  return;
	}
	
	//Reset everything
	Jmol.script(mainJmol, "zap");
	reset_system();
	disable_NMR_controls();
	
	// Note: this won't work on Chrome if the webpage is running locally. In that case, one must launch Chrome with the flag --allow-file-access-from-files 	
	// Check if file is running locally and browser is Chrome or Chromium

	var to_load = evt.target.files[0];
	var jmol_rdr = new FileReader();
	
	jmol_rdr.onloadend = function() {
		
		if(this.result == "")
		{
			if (window.location.protocol == "file:") {
				var browser_version = navigator.appVersion;
				if ((browser_version.indexOf("Chrome") >= 0) || (browser_version.indexOf("Chromium") >= 0))
				{
					alert("This browser could be Chrome/Chromium. In that case, the File APIs won't work if you run the page locally.\n Please load your files using " 
					+ "the console, or launch Chrome with the flag:\n\n --allow-file-access-from-files");
					return;
				}
			}
		}

		var file_content = this.result;

		atom_set.is_magres = (file_content.indexOf("#$magres-abinitio") >= 0); //Is the loaded file a magres file?

		load_string(mainJmol, file_content);

		last_loaded_file = file_content;
	};

	jmol_rdr.readAsText(to_load);
}

function load_string(id, file_as_string)
{
	var load_script = "load data \"model current_model\"" + file_as_string + "end \"model current_model\"";
	var load_as_mol = document.getElementById("ismol_check").checked;

	if (!load_as_mol)
	{	

		var x_lat = parseInt(document.getElementById("x_lat").value);
		var y_lat = parseInt(document.getElementById("y_lat").value);
		var z_lat = parseInt(document.getElementById("z_lat").value);
		
		//Check that there are no errors
		if (x_lat <= 0)
		{
			x_lat = 1;
			document.getElementById("x_lat").value = 1;
		}

		if (y_lat <= 0)
		{
			y_lat = 1;
			document.getElementById("y_lat").value = 1;
		}

		if (z_lat <= 0)
		{
			z_lat = 1;
			document.getElementById("z_lat").value = 1;
		}

		var mincell = "" + (5-supercell_border) + (5-supercell_border) + (5-supercell_border);
		var maxcell = "" + (x_lat+4+supercell_border) + (y_lat+4+supercell_border) + (z_lat+4+supercell_border);
		var displcells = "none";
		for (var xl = 0; xl < x_lat; ++xl)
			for (var yl = 0; yl < y_lat; ++yl)
				for (var zl = 0; zl < z_lat; ++zl)
						displcells += " or cell=" + (5+xl) + (5+yl) + (5+zl);

		default_displaygroup = displcells;

		load_script += "{" + mincell + " " + maxcell + " -1}; display " + default_displaygroup + ";";
		
		document.getElementById("axes_check").checked = true;
	}
	else
	{
		var sc_min = 5 - supercell_border;
		var sc_max = 5 + supercell_border;
		default_displaygroup = "within(molecule, {*}[1])";
		load_script += "{" + (sc_min) + (sc_min) + (sc_min) + " " +  (sc_max) + (sc_max) + (sc_max) + " -1}; display " + default_displaygroup + ";";

		document.getElementById("axes_check").checked = false;
	}

	load_script += "center displayed; zoom {displayed} 0;"

	Jmol.script(id, load_script);
}

function ismol_check_handler()
{
	var ismol = document.getElementById("ismol_check").checked;

	if (ismol)
	{
		document.getElementById("x_lat").disabled = true;
		document.getElementById("y_lat").disabled = true;
		document.getElementById("z_lat").disabled = true;
	}
	else
	{
		document.getElementById("x_lat").disabled = false;
		document.getElementById("y_lat").disabled = false;
		document.getElementById("z_lat").disabled = false;
	}
}

//Reload model

function reload_butt_handler()
{
	if (last_loaded_file != null)
	{
		var is_magres = atom_set.is_magres;
		reset_system();
		atom_set.is_magres = is_magres;
		load_string(mainJmol, last_loaded_file);		
	}
}

//Retrieve basic atom information after loading a file

function get_atom_info()
{
	//Get lattice parameters

	var rawlattice = Jmol.getPropertyAsArray(mainJmol, "auxiliaryInfo.models[1].infoUnitCell");
	if (rawlattice == "")
	{
		//No lattice information is present!
		default_displaygroup = "all"
		Jmol.script(mainJmol, "display " + default_displaygroup);
		atom_set.lattice_pars = null;		
	}
	else
	{
		for (var i = 0; i < 3; ++i)
		{
			atom_set.lattice_pars[i] = [];
			for (var j = 0; j < 3; ++j)
			{
				atom_set.lattice_pars[i][j] = rawlattice[j+6+3*i];
			}
		}
	}

	if (atom_set.is_magres)
	{
		//If the file was a magres file, we can rely on the fact that Jmol will use the naming convention label_site
	
		var atomnames = Jmol.evaluate(mainJmol, "{" + default_displaygroup + "}.atomname.all").split('\n');

		//Espunge possible duplicates

		for (var i = 0; i < atomnames.length; ++i)
		{
			if (atomnames[i] == "" || atomnames.indexOf(atomnames[i]) < i)
			{
				atomnames.splice(i--,1);
			}
		}

		for (var i = 0; i < atomnames.length; ++i)
		{
			var name = atomnames[i];
			var sp = name.substring(0, name.lastIndexOf('_'));
			var ind = parseInt(name.substring(name.lastIndexOf('_')+1));

			if (atom_set.atom_species_labels.indexOf(sp) < 0)
			{
				atom_set.atom_species_labels.push(sp);
				atom_set.atom_species_sites[sp] = [];
			}

			if (atom_set.atom_species_sites[sp].indexOf(ind) < 0)
				atom_set.atom_species_sites[sp].push(ind);			
		}

		//Find Magres data contained within the file

		var magres_units = Jmol.getPropertyAsArray(mainJmol, "auxiliaryInfo.models[1].magresUnits");
		for (key in magres_units)
		{
			if (magres_units.hasOwnProperty(key))
			{
				if (key.indexOf("ms") == 0)
					atom_set.has_ms = true;
				else if (key.indexOf("efg") == 0)
				{
					atom_set.has_efg = true;
					atom_set.efg_tags.push(key);
				}
				else if (key.indexOf("isc") == 0)
				{
					atom_set.has_isc = true;
					atom_set.isc_tags.push(key);
				}
			}
		}
	}
	else
	{
		//If the file was not a magres file, we will just use elements as our reference
	
		var atomelems = Jmol.evaluate(mainJmol, "{" + default_displaygroup + "}.element").split('\n');

		for (var i = 0; i < atomelems.length; ++i)
		{
			el = atomelems[i];

			if (el != "" && atom_set.atom_species_labels.indexOf(el) < 0)
			{
				atom_set.atom_species_labels.push(el);
			}

			atom_set.atom_species_sites = null;
		}

		atom_set.has_ms  = false;
		atom_set.has_efg = false;
		atom_set.has_isc = false;
	}

	atom_set.speciesno = atom_set.atom_species_labels.length;

}

//Load relevant magnetic properties as atom properties in Jmol

function load_data_asproperty()
{
	load_data_script = load_data_asproperty_script();
	Jmol.script(mainJmol, load_data_script);
}

function load_data_asproperty_script()
{
	load_data_script = "";

	if(atom_set.has_ms)
	{
		load_data_script += "{all}.property_ms_iso = {all}.tensor(\"ms\", \"isotropy\"); \
		{all}.property_ms_aniso = {all}.tensor(\"ms\", \"anisotropy\");					 \
		{all}.property_ms_asymm = {all}.tensor(\"ms\", \"asymmetry\");";
	}

	if(atom_set.has_efg)
	{
		for (var i = 0; i < atom_set.efg_tags.length; ++i)
		{
			var tag = atom_set.efg_tags[i];
			load_data_script += "{all}.property_" + tag + "_vzz = {all}.tensor(\"" + tag + "\", \"value\"); \
			{all}.property_" + tag + "_aniso = {all}.tensor(\"" + tag + "\", \"anisotropy\");				\
			{all}.property_" + tag + "_asymm = {all}.tensor(\"" + tag + "\", \"asymmetry\");				\
			{all}.property_" + tag + "_chi = {all}.tensor(\"" + tag + "\", \"chi\");					\
			for (a in {all}) { a.property_" + tag + "_chi_MHz = a.property_" + tag + "_chi/1e6;};   \
			for (a in {all}) { a.property_" + tag + "_chi_kHz = a.property_" + tag + "_chi/1e3;};";
		}
	}

	return load_data_script;
}

//Heuristic check to verify whether a system can be considered a molecular crystal or not

function is_mol_crystal()
{
	var unitcell_n = Jmol.evaluate(mainJmol, "{cell=555}.length");
	var mol_n = Jmol.evaluate(mainJmol, "{within(molecule, {*}[1])}.length");

	return (mol_n < unitcell_n);
}
