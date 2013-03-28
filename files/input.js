//MagresView 
//by Simone Sturniolo
//
//Copyright 2013 Science and Technology Facilities Council
//This software is distributed under the terms of the GNU General Public License (GNU GPL)
//Please refer to the file COPYING for the text of the license

//This file handles the loading and parsing of .magres files, and the storage of the data they contain into a suitable data structure

//Data structure holding atom information

//Atoms are objects. They are stored in an array of arrays (each child array representing a chemical species, marked by a label in the magres file)

var atom_set = {

	atomno: 0,															//Total number of atoms in the system
	
	speciesno: 0,														//Total number of species (by crystallographic label) in the system

	atoms: [],															//Atom objects (element and coordinates), classified in an array of arrays (each sub-array is for a label)
	
	atom_species: {},													//Hash table: label -> number
	
	atom_species_labels: [],										//Array: number -> label
	
	starting_nums: [],												//Integers, starting indices of the various species arrays (in other words, starting_nums[0] = 0, starting_nums[1] = atoms[0].length, etc)
		
	lattice_pars: {}, 												//Tensor object containing lattice parameters
	
	mag_ms: [],															//Array of tensors - magnetic shielding on the various atoms
	
	mag_ms_haeb: [],													//Array of arrays - Haeberlen convention tensor parameters (isotropic component, anisotropy, and asymmetry)
	
	mag_ms_symm_eigenvals: [],										//Array of arrays - magnetic shielding, symmetric component, eigenvalues
	
	mag_ms_symm_eigenvect: [],										//Array of arrays - magnetic shielding, symmetric component, eigenvectors

	mag_ms_antisymm: [],												//Array of tensors - magnetic shielding, antisymmetric component
		
	mag_efg_tags: {},													//Hash table: efg tag -> number
	
	mag_efg_tags_labels: [],										//Array: number -> efg tag

	mag_efg_tagno: 1,													//Number of efg tags present (number 1 is always efg with no tags)

	mag_efg: [],														//efg tensors saved by tag (array of arrays)

	mag_efg_haeb: [],													//efg Haeberlen convention parameters saved by tag (array of arrays)
	
	mag_efg_eigenvals: [],											//as above, but with an array of the three eigenvalues instead of a tensor
	
	mag_efg_eigenvect: [],											//as above, but with a tensor containing the three eigenvectors
	
	mag_isc_tags: {},													//Hash table, tags for isc (see efg)

	mag_isc_tags_labels: [],										//Array: number -> isc tag

	mag_isc_tagno: 1,													//Number of tags for isc
		
	mag_isc: [],														//isc tensors
	
	mag_sus: [],														//array of one tensor containing the details of magnetic susceptibility. The use of an array is needed for the instantiation checks:
																			//(size 0 = no susceptibility, size 1 = susceptibility)
	
	system_size: 0,													//The maximum size of the system (in angstroms) in either the x, y or z direction (whichever is bigger).
																			//Used for some graphic representations to give a general scale
																			
	atom_colors: {},													//Base colors used by Jmol to represent the various chemical species
	
	atom_elems: {},													//Elements present in the sample by symbol, associated with their isotope
	
	units: {},															//Unit of measure for the various quantities
	
};

//The "atom" object holds the element type and three coordinates x y z

function atom(elem, a_x, a_y, a_z)
{
	this.elem = elem;
	this.x = a_x;
	this.y = a_y;
	this.z = a_z;
	
	this.to_string = function()
	{
		return this.elem + "\t" + this.x + "\t" + this.y + "\t" + this.z;
	}
}

//The tensor object is basically a 3x3 matrix

function tensor()
{
	this.r = new Array();

	this.r[0] = new Array();
	this.r[1] = new Array();
	this.r[2] = new Array();
	
}

//single_ and pair_interaction are objects designed to incapsulate the properties of the various interactions.
//This includes the tensor and the atoms involved (either one or two), classified by species label and label index

function single_interaction()
{
	this.sp = "";
	this.sp_i = 0;
	this.tens = new tensor();
}

function pair_interaction()
{
	this.sp1 = "";
	this.sp1_i = 0;
	this.sp2 = "";
	this.sp2_i = 0;
	this.tens = new tensor();
}

function reset_atom_set()
{
	atom_set = {

		atomno: 0,
		
		speciesno: 0,
		
		atoms: [],
		
		atom_species: {},
			
		atom_species_labels: [],

		starting_nums: [],	
	
		lattice_pars: {},	
			
		mag_ms: [],
		
		mag_ms_haeb: [],
		
		mag_ms_symm_eigenvals: [],
		
		mag_ms_symm_eigenvect: [],
	
		mag_ms_antisymm: [],
		
		mag_efg_tags: {},
		
		mag_efg_tags_labels: [],
		
		mag_efg_tagno: 1,
	
		mag_efg: [],
		
		mag_efg_haeb: [],
		
		mag_efg_eigenvals: [],
	
		mag_efg_eigenvect: [],

		mag_isc_tags: {},
	
		mag_isc_tags_labels: [],

		mag_isc_tagno: 1,
			
		mag_isc: [],
		
		mag_sus: [], 
		
		system_size: 0,
		
		atom_colors: {},
		
		atom_elems: {},
		
		units: {},
	
	};
}

function atom_colors_load()
{
	for (var s = 0; s < atom_set.atoms.length; ++s)
	{
		for (var a = 0; a < atom_set.atoms[s].length; ++a)
		{
			if(atom_set.atom_colors[atom_set.atoms[s][a].elem] == null)
			{
				var rgb = safe_jmolEvaluate(mainJmol, "{" + atom_set.atoms[s][a].elem + (atom_set.starting_nums[s] + a + 1) + "}.color", 1000);
				rgb = rgb.replace("{", "");
				rgb = rgb.replace("}", "");
				rgb = rgb.split(" ");
				

				if (rgb.length != 3)
				{
					atom_set.atom_colors[atom_set.atoms[s][a].elem] = [255, 255, 255];
					continue;
				}

				for (var i = 0; i < 3; ++i)
				{
					rgb[i] = parseInt(rgb[i]);
				}
				
				atom_set.atom_colors[atom_set.atoms[s][a].elem] = rgb;
				
			}
		}
	}
}

function atom_elems_load()
{
	for (var s = 0; s < atom_set.atoms.length; ++s)
	{
		for (var a = 0; a < atom_set.atoms[s].length; ++a)
		{
			var el = atom_set.atoms[s][a].elem;

			if(atom_set.atom_elems[el] == null)
			{
				if (iso_table[el].length == 0)
				{
					atom_set.atom_elems[el] = 0;
				}
				else
				{
					atom_set.atom_elems[el] = iso_table[el]['DEF'];
				}
			}
		}
	}
}

//Partial parsers for sections of the magres file
//Partial parsers for sections of the magres file

function parseAtomBlock(mag_parser)
{
	var cell_file = null;
	var now_scanning = "";
	
	while(!mag_parser.prs_end())
	{
		line = mag_parser.prs_getline();
		
		//If this is the case, the block is over		
		if(line.indexOf("</atoms>") >= 0)
			break;
		
		//Regexp for multiple spaces, and remove any spaces at the beginning of the line	
		line = line.replace(/^\s+/,'');
		var spl_line = line.split(/[\s\t]+/);

		
		switch(spl_line[0])
		{
			case "units":
				//Check the units
				if ((spl_line.length < 3) || (spl_line[2] != "Angstrom"))
					return null;
				now_scanning = spl_line[1];
				break;
			
			case "symmetry":
				if (now_scanning != "atom")
					return null;
				break;
			
			case "atom":
				//Exit on error if the length is not right OR if this is not what we're supposed to see now
				if ((spl_line.length < 7) || (now_scanning != "atom"))
					return null;
				
				var species = spl_line[2];
				if(atom_set.atom_species[species] == null)
				{
					atom_set.atom_species[species] = atom_set.speciesno;
					atom_set.atom_species_labels[atom_set.speciesno] = species;
	  				//Create an atom array for the current species
	  				atom_set.atoms[atom_set.speciesno] = new Array();
	  				++atom_set.speciesno;
				}

				var in_i = parseInt(spl_line[3]);
				var in_x = parseFloat(spl_line[4]); var in_y = parseFloat(spl_line[5]); var in_z = parseFloat(spl_line[6]); 

				//Fail if ANY of the values above is not properly parsed
				
				if (isNaN(in_i + in_x + in_y + in_z))
					return null;

				var in_atom = new atom(spl_line[1], in_x, in_y, in_z);
				
				//The number in species label is diminished by one to fit the array convention counting from zero
				
				atom_set.atoms[atom_set.atom_species[species]][in_i-1] = in_atom;
				++atom_set.atomno;
				
				break;
				
			case "lattice":
				if ((spl_line.length < 10) || (now_scanning != "lattice"))
					return null;
				//Lattices should last only one line...				
				now_scanning = "lattice_over";
								
				atom_set.lattice_pars = new tensor();
				
				for (var i = 0; i < 3; ++i)
				{
					for (var j = 0; j < 3; ++j)
					{
						var latt_par = parseFloat(spl_line[1+j+3*i]);
	
						//Fail if the parameters are not properly parsed
						if (isNaN(latt_par))
							return null;
							
						atom_set.lattice_pars.r[i][j] = latt_par;
					}
				}
				break;
				
			default:
				return null;
				break;
		}		
		
	}
	
	//Starting nums count
	
	atom_set.starting_nums[0] = 0;
	
	for (var s = 1; s < atom_set.speciesno; ++s)
	{
		atom_set.starting_nums[s] = atom_set.starting_nums[s-1] + atom_set.atoms[s-1].length;
	}
	
	atom_set.starting_nums[atom_set.speciesno] = atom_set.atomno;
		
	//After proper parsing, time to generate the .cell file	
	
	cell_file += "# CELL automatically generated by JMol NMR WebPage\n";

	if (atom_set.lattice_pars.r != null)
	{
		cell_file += "%BLOCK lattice_cart\n";
		cell_file += "ang\n";
	
		for (var i = 0; i < 3; ++i)
		{
			for (var j = 0; j < 3; ++j)
			{
				cell_file += atom_set.lattice_pars.r[i][j] + "\t";
			}
			cell_file += "\n";
		}
		cell_file += "%ENDBLOCK lattice_cart\n\n";
	}
	
	cell_file += "%BLOCK positions_abs\n";

	for(var s = 0; s < atom_set.speciesno; ++s)
	{
		for (var a = 0; a < atom_set.atoms[s].length; ++a)
		{
			cell_file += atom_set.atoms[s][a].to_string() + "\n";
		}
	}

	cell_file += "%ENDBLOCK positions_abs";
		
	return cell_file;
}

function parseCalcBlock(mag_parser)
{
	while(!mag_parser.prs_end() && ((mag_parser.prs_getline()).indexOf("</calculation>") < 0))
	{
		//Do nothing, just skip it
	}
	
	return true;
}	

function parseMagOldBlock(mag_parser)
{
	while(!mag_parser.prs_end() && ((mag_parser.prs_getline()).indexOf("</magres_old>") < 0))
	{
		//Do nothing, just skip it
	}
	
	return true;
}	

function parseMagresBlock(mag_parser)
{
	
	//If atoms were not parsed already, something's wrong. Get out of here
	if(atom_set.atomno == 0)
		return false;
				
	while(!mag_parser.prs_end())
	{
		line = mag_parser.prs_getline();
		
		//If this is the case, the block is over		
		if(line.indexOf("</magres>") >= 0)
			break;
		
		//Regexp for multiple spaces, and remove any spaces at the beginning of the line	
		line = line.replace(/^\s+/,'');
		var spl_line = line.split(/[\s]+/);

		//Regexp for keywords & tags
		var spl_tag = spl_line[0].match(/(efg_)|(isc_)|[a-z, A-Z, 0-9, \_]+/g);
		
		if(spl_tag == null)
			return false;			
		
		switch(spl_tag[0])
		{
			case "units":
				//Check the units
				if (spl_line.length < 3)
					return false;

				var scanning_tag = spl_line[1].match(/(efg_)|(isc_)|[a-z, A-Z, 0-9, \_]+/g);
				atom_set.units[scanning_tag[0]] = spl_line[2];
				
				//If we're dealing with a new tag, add it. mag_*_tagno = 0 is reserved for the tagless data
												
				if((scanning_tag[0] == "efg_") && (atom_set.mag_efg_tags[scanning_tag[1]] == null))
				{
					atom_set.mag_efg_tags[scanning_tag[1]] = atom_set.mag_efg_tagno;
					atom_set.mag_efg_tags_labels[atom_set.mag_efg_tagno] = scanning_tag[1];
					atom_set.mag_efg[atom_set.mag_efg_tagno] = new Array();
					atom_set.mag_efg_haeb[atom_set.mag_efg_tagno] = new Array();
					atom_set.mag_efg_eigenvals[atom_set.mag_efg_tagno] = new Array();
					atom_set.mag_efg_eigenvect[atom_set.mag_efg_tagno] = new Array();
					++atom_set.mag_efg_tagno;
				}
								
				if((scanning_tag[0] == "isc_") && (atom_set.mag_isc_tags[scanning_tag[1]] == null))
				{
					atom_set.mag_isc_tags[scanning_tag[1]] = atom_set.mag_isc_tagno;
					atom_set.mag_isc_tags_labels[atom_set.mag_isc_tagno] = scanning_tag[1];
					atom_set.mag_isc[atom_set.mag_isc_tagno] = new Array();
					++atom_set.mag_isc_tagno;
				}

				break;

			case "ms":
				//Perform unit check
				if ((spl_line.length < 12) || (atom_set.units["ms"] != "ppm"))
					return false;
				
				var ms = new single_interaction();
				var ms_el = 0.0; 
				
				ms.sp = spl_line[1];
				ms.sp_i = parseInt(spl_line[2]);
				
				if (isNaN(ms.sp_i))
					return false;
					
				for (var i = 0; i < 3; ++ i)
				{
					for (var j = 0; j < 3; ++j)
					{
						ms_el = parseFloat(spl_line[3+j+3*i]);
						if (isNaN(ms_el))
							return false;	
						ms.tens.r[i][j] = ms_el;
					}
				} 	
				
				atom_set.mag_ms.push(ms);
				var split_matrix = symm_antisymm(ms.tens.r);
				var diag = symm_matr_diag_card(split_matrix[0]);	
				
				atom_set.mag_ms_haeb.push(haeberlen_and_order(diag));
				atom_set.mag_ms_symm_eigenvals.push(diag[0]);
				atom_set.mag_ms_symm_eigenvect.push([diag[1], diag[2], diag[3]]);
				atom_set.mag_ms_antisymm.push(split_matrix[1]);
				
				break;
				
			case "efg":
				if ((spl_line.length < 12) || (atom_set.units["efg"] != "au"))
					return false;
				
				if (atom_set.mag_efg_tags_labels[0] == null)
				{
					atom_set.mag_efg_tags["efg"] = 0;
					atom_set.mag_efg_tags_labels[0] = "efg";
				}
				
				if (atom_set.mag_efg[0] == null)
					atom_set.mag_efg[0] = new Array();	
		
				if (atom_set.mag_efg_haeb[0] == null)
					atom_set.mag_efg_haeb[0] = new Array();

				if (atom_set.mag_efg_eigenvals[0] == null)
					atom_set.mag_efg_eigenvals[0] = new Array();

				if (atom_set.mag_efg_eigenvect[0] == null)
					atom_set.mag_efg_eigenvect[0] = new Array();
				
				var efg = new single_interaction();
				var efg_el = 0.0;
				
				efg.sp = spl_line[1];
				efg.sp_i = parseInt(spl_line[2]);
				
				if (isNaN(efg.sp_i))
					return false;
					
				for (var i = 0; i < 3; ++ i)
				{
					for (var j = 0; j < 3; ++j)
					{
						efg_el = parseFloat(spl_line[3+j+3*i]);
						if (isNaN(efg_el))
							return false;	
						efg.tens.r[i][j] = efg_el;
					}
				} 	
				
				var diag = symm_matr_diag_card(efg.tens.r);

				//It must be noted that, here as well as in the magnetic shielding acquisition, the instruction haeberlen_and_order(diag) does not simply output the isotropy, asymmetry etc. values - 
				//its purpose is also to order the eigenvalues array following the same convention. This is crucial for some features (like the visualization in labels of the Vzz component)
				
				atom_set.mag_efg[0].push(efg);
				atom_set.mag_efg_haeb[0].push(haeberlen_and_order(diag));
				atom_set.mag_efg_eigenvals[0].push(diag[0]);
				atom_set.mag_efg_eigenvect[0].push([diag[1], diag[2], diag[3]]);
								
				break;

			case "efg_":
				if ((spl_line.length < 12) || (atom_set.units["efg_"] != "au"))
					return false;

				var efg = new single_interaction();
				var efg_el = 0.0;
				var tagno = atom_set.mag_efg_tags[spl_tag[1]];
				
				efg.sp = spl_line[1];
				efg.sp_i = parseInt(spl_line[2]);
				
				if (isNaN(efg.sp_i))
					return false;
					
				for (var i = 0; i < 3; ++ i)
				{
					for (var j = 0; j < 3; ++j)
					{
						efg_el = parseFloat(spl_line[3+j+3*i]);
						if (isNaN(efg_el))
							return false;	
						efg.tens.r[i][j] = efg_el;
					}
				} 	
				
				var diag = symm_matr_diag_card(efg.tens.r);
				var eigenvect = [diag[1], diag[2], diag[3]];
				
				atom_set.mag_efg[tagno].push(efg);
				atom_set.mag_efg_haeb[tagno].push(haeberlen_and_order(diag));							
				atom_set.mag_efg_eigenvals[tagno].push(diag[0]);			
				atom_set.mag_efg_eigenvect[tagno].push(eigenvect);	
		
			 break;

			case "isc":
				if ((spl_line.length < 14) || (atom_set.units["isc"] != "10^19.T^2.J^-1"))
					return false;
				
				if (atom_set.mag_isc_tags_labels[0] == null)
				{
					atom_set.mag_isc_tags["isc"] = 0;
					atom_set.mag_isc_tags_labels[0] = "isc";
				}

				if (atom_set.mag_isc[0] == null)
					atom_set.mag_isc[0] = new Array();
	
				var isc = new pair_interaction();
				var isc_el = 0.0;
				
				isc.sp1 = spl_line[1];
				isc.sp1_i = parseInt(spl_line[2]);
				isc.sp2 = spl_line[3];
				isc.sp2_i = parseInt(spl_line[4]);
				
				if (isNaN(isc.sp1_i))
					return false;
				if (isNaN(isc.sp2_i))
					return false;
										
				for (var i = 0; i < 3; ++ i)
				{
					for (var j = 0; j < 3; ++j)
					{
						isc_el = parseFloat(spl_line[5+j+3*i]);
						if (isNaN(isc_el))
							return false;
						isc.tens.r[i][j] = isc_el;
					}
				} 	
					
				atom_set.mag_isc[0].push(isc);
	
				break;

			case "isc_":
				if ((spl_line.length < 14) || (atom_set.units["isc_"] != "10^19.T^2.J^-1"))
					return false;

				var isc = new pair_interaction();
				var isc_el = 0.0;
				var tagno = atom_set.mag_isc_tags[spl_tag[1]];				
				
				isc.sp1 = spl_line[1];
				isc.sp1_i = parseInt(spl_line[2]);
				isc.sp2 = spl_line[3];
				isc.sp2_i = parseInt(spl_line[4]);
				
				if (isNaN(isc.sp1_i))
					return false;
				if (isNaN(isc.sp2_i))
					return false;
										
				for (var i = 0; i < 3; ++ i)
				{
					for (var j = 0; j < 3; ++j)
					{
						isc_el = parseFloat(spl_line[5+j+3*i]);
						if (isNaN(isc_el))
							return false;
						isc.tens.r[i][j] = isc_el;
					}
				} 	
					
				atom_set.mag_isc[tagno].push(isc);

				break;

			case "sus":
				if ((spl_line.length < 10) || (atom_set.units["sus"] != "10^-6.cm^3.mol^-1"))
					return false;
								
				var sus = new tensor();
				var sus_el = 0.0;
				for (var i = 0; i < 3; ++ i)
				{
					for (var j = 0; j < 3; ++j)
					{
						sus_el = parseFloat(spl_line[1+j+3*i]);
						if (isNaN(sus_el))
							return false;	
						sus.r[i][j] = sus_el;
					}
				}
				
				atom_set.mag_sus[0] = sus;
												
				break;

			default:
				return false;
				break; 
		}
	}
	
	return true;
}

//This is the actual magres parser. It is run asynchronously by the onloadend callback of the FileReader. It returns a .cell version of the file to plot

function magres_parser(to_parse)
{
	var mag_parser = {
		prs_array: [],
		prs_length: 0,
		prs_i: 0,
		prs_end: function() {
			return (this.prs_i >= this.prs_length? true: false);
		},
		prs_getline: function() {
			return this.prs_array[this.prs_i++];
		},
	};
	
	var cell_file = "";
	
	//First: split file into lines	
	
	mag_parser.prs_array = to_parse.split("\n");
	mag_parser.prs_length = mag_parser.prs_array.length;
	
	//Second: check whether it actually is a magres file
	
	if (mag_parser.prs_array[0].indexOf("#$magres-abinitio") < 0)
	{
		alert("The loaded file is not a magres file. NMR functionalities will not be available");
		return null;
	}
	
	//Third: scan the file for atoms

	var all_is_well = true;
	var err_msg = "";

	while(!mag_parser.prs_end())
	{
		line = mag_parser.prs_getline();

		//If it's a comment, skip it
		
		if (line.charAt(0) == "#")
			continue;
			
		//Otherwise, partial parsers.
		//These functions return true if they succeeded, false if an error occurred
		//The <atoms> block parser returns a .cell file containing the atom arrangement if it succeeded, null if an error occurred
		
		if (line.indexOf("<atoms>") >= 0)
		{
			cell_file = parseAtomBlock(mag_parser);
			all_is_well = all_is_well && (cell_file != null);
			if (!all_is_well)
				err_msg = "<atoms>";
		}
		if (line.indexOf("<calculation>") >= 0)
			all_is_well = all_is_well && parseCalcBlock(mag_parser);
			if (!all_is_well)
				err_msg = "<calculation>";
		if (line.indexOf("<magres_old>") >= 0)
			all_is_well = all_is_well && parseMagOldBlock(mag_parser);
			if (!all_is_well)
				err_msg = "<magres_old>";
		if (line.indexOf("<magres>") >= 0)
			all_is_well = all_is_well && parseMagresBlock(mag_parser);
			if (!all_is_well)
				err_msg = "<magres>";
				
	}
		
	if (!all_is_well)
	{
		alert("An error as occurred while parsing the magres file, " + err_msg + " block.");
		return null;
	}
			
	//Evaluate system size (i.e. maximum distance on one axis between atoms - used for visualization purposes)

	var max_x = atom_set.atoms[0][0].x;
	var max_y = atom_set.atoms[0][0].y;
	var max_z = atom_set.atoms[0][0].z;
	var min_x = max_x;
	var min_y = max_y;
	var min_z = max_z;
	
	for (var s = 0; s < atom_set.speciesno; ++s)
	{
		for (var a = 0; a < atom_set.atoms[s].length; ++a)
		{
			if (atom_set.atoms[s][a].x > max_x)
			{
				max_x = atom_set.atoms[s][a].x;
			}
			else if (atom_set.atoms[s][a].x < min_x)
			{
				min_x = atom_set.atoms[s][a].x;
			}

			if (atom_set.atoms[s][a].y > max_y)
			{
				max_y = atom_set.atoms[s][a].y;
			}
			else if (atom_set.atoms[s][a].y < min_y)
			{
				min_y = atom_set.atoms[s][a].y;
			}

			if (atom_set.atoms[s][a].z > max_z)
			{
				max_z = atom_set.atoms[s][a].z;
			}
			else if (atom_set.atoms[s][a].z < min_z)
			{
				min_z = atom_set.atoms[s][a].z;
			}
		}
	}
	
	var size_x = max_x-min_x;
	var size_y = max_y-min_y;
	var size_z = max_z-min_z;
	
	atom_set.system_size = (size_x > size_y?(size_x > size_z? size_x: size_z): (size_y > size_z? size_y: size_z)); 

	return cell_file;
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
	reset_atom_set();
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

		var file_content = magres_parser(this.result);
	   file_content = ((file_content == null)?this.result:file_content);
		
		var load_script = "load data \"model current_model\" " + file_content + " end \"model current_model\"";
		
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
		
		if (x_lat > 1 || y_lat > 1 || z_lat > 1)
			load_script += "{" + x_lat + " " + y_lat + " " + z_lat + "}";
		
		Jmol.script(mainJmol, load_script);
		enable_NMR_controls();
		dropdown_update();
};

	jmol_rdr.readAsText(to_load);
}


