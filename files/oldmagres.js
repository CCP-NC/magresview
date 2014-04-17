//MagresView 
//by Simone Sturniolo
//
//Copyright 2013 Science and Technology Facilities Council
//This software is distributed under the terms of the GNU General Public License (GNU GPL)
//Please refer to the file COPYING for the text of the license

//This file handles the loading and converting of old .magres files, and all the drag and drop operations connected with them

function dndrop_popup_init()
{    
    $("#oldmagres_box").on("dragover", function(e) {
        e.preventDefault();
    })
    
    $("#oldmagres_box").on("drop", oldmagres_drop_handler);
    $("#castep_box").on("drop", castep_drop_handler);

    $("#oldmagres_box").addClass("obfuscated");
    $("#castep_box").addClass("obfuscated");
    
    var data_set = {}; // The data set that is going to contain the info on the system as JSON
    init_data_set(data_set);
    $("#newmagres_box").data("data_set", data_set);
    
    
}

function oldmagres_drop_handler(e) {
    
    e.preventDefault();
    e.stopPropagation();
    
    var to_load = e.originalEvent.dataTransfer.files[0];
    var old_magres_rdr = new FileReader();
    
    old_magres_rdr.onloadend = function() {
        
        var data_set = $("#newmagres_box").data("data_set");
        
        if (parse_old_magres(data_set, this.result))
        {
            $("#newmagres_box").data("data_set", data_set);
            $("#oldmagres_box").removeClass("obfuscated");
            $("#newmagres_box").attr("draggable", true);
            $("#newmagres_box").css("-khtml-user-drag", "element");
            $("#newmagres_box").on("dragstart", newmagres_drag_handler)
            $("#newmagres_box").removeClass("obfuscated");
         
        }
        
    };
    
    old_magres_rdr.readAsText(to_load);
    
}

function castep_drop_handler(e) {
    
    e.preventDefault();
    e.stopPropagation();
    
    var to_load = e.originalEvent.dataTransfer.files[0];
    var castep_rdr = new FileReader();
    
    castep_rdr.onloadend = function() {
        
        var data_set = $("#newmagres_box").data("data_set");
        
        if(parse_castep(data_set, this.result))
        {
            $("#newmagres_box").data("data_set", data_set);
            $("#castep_box").removeClass("obfuscated");            
        }
        
        
    }
    
    castep_rdr.readAsText(to_load);
    
}

function newmagres_drag_handler(e)
{
    
    var data_set = $("#newmagres_box").data("data_set");
    var file_destination = {
			file_str: "",
			write: function(s) {
				this.file_str += s;
			},			
			close: function(s) {
				this.file_str = "";
			},
    };
    
    atom_set.is_magres = false; //This prevents undesired calls to Jmol
    magres_file_gen(data_set, file_destination);
        
    e.originalEvent.dataTransfer.setData("magres_file", file_destination.file_str);
    
}

function parse_old_magres(ds, mfile) {
    
    var atom_regex = /[=]+[\r\n]+( Perturbing Atom|Atom): ([A-Za-z\:0-9]+)\s+([0-9]+)[\r\n]+[=]+[\r\n]+([^=]+)[\r\n]+/mg;
    var shielding_tensor_regex = /\s{0,}(.*?) Shielding Tensor[\r\n]+\s+([0-9\.\-]+)\s+([0-9\.\-]+)\s+([0-9\.\-]+)[\n\r]+\s+([0-9\.\-]+)\s+([0-9\.\-]+)\s+([0-9\.\-]+)[\n\r]+\s+([0-9\.\-]+)\s+([0-9\.\-]+)\s+([0-9\.\-]+)\s+/;
    var jc_tensor_regex = /\s{0,}J-coupling (.*?)[\r\n]+\s+([0-9eE\.\-]+)\s+([0-9eE\.\-]+)\s+([0-9eE\.\-]+)[\n\r]+\s+([0-9eE\.\-]+)\s+([0-9eE\.\-]+)\s+([0-9eE\.\-]+)[\r\n]+\s+([0-9eE\.\-]+)\s+([0-9eE\.\-]+)\s+([0-9eE\.\-]+)\s+/;
    var efg_tensor_regex = /\s{0,}(.*?) tensor[\r\n]+\s+([0-9\.\-]+)\s+([0-9\.\-]+)\s+([0-9\.\-]+)[\r\n]+\s+([0-9\.\-]+)\s+([0-9\.\-]+)\s+([0-9\.\-]+)[\r\n]+\s+([0-9\.\-]+)\s+([0-9\.\-]+)\s+([0-9\.\-]+)\s+/;
    var coords_regex = /([A-Za-z\:0-9]+)\s+([0-9]+)\s+Coordinates\s+([0-9\.\-]+)\s+([0-9\.\-]+)\s+([0-9\.\-]+)\s+A[\r\n]+/;
        
    var atoms = findall(atom_regex, mfile);
    
    if (atoms.length == 0) {
        return false;
    }
    
    // This table keeps track of the various indices met for different atom species - required to avoid inserting an atom multiple times
    
    var atom_table = {};
    
    for (var i = 0; i < atoms.length; ++i) {
        
        // Reset all regex 
        coords_regex.lastIndex = 0;
        shielding_tensor_regex.lastIndex = 0;
        jc_tensor_regex.lastIndex = 0;
        efg_tensor_regex.lastIndex = 0;
        
        // Parse
        var parse_coords = coords_regex.exec(atoms[i][4]);
        var parse_shielding = shielding_tensor_regex.exec(atoms[i][4]);
        var parse_efg = efg_tensor_regex.exec(atoms[i][4]);
        //var parse_jc = jc_tensor_regex.exec(atoms[i][4]);
        
        /* J-coupling removed for now as it's a developer code feature and will probably never
         * be used by anyone with old .magres files */
        
        // Fill in the data structure
        
        var species = atoms[i][2];
        var index = parseInt(atoms[i][3]);
        
        if (!(species in atom_table)) {
          atom_table[species] = {};
        }
        
        if (!(index in atom_table[species])) {
            
            atom_table[species][index] = i;
            
            var new_atom = {
                'id':   i,
                'index': index,
                'label': species,
                'species': species,
                'position': [parseFloat(parse_coords[3]),
                             parseFloat(parse_coords[4]),
                             parseFloat(parse_coords[5])]
            }
            
            ds.atoms.atom.push(new_atom);
        }        
        
        if (parse_shielding != null) {
            
            if (!("ms" in ds.magres)) {
                
                // Add the ms section
                
                ds.magres['ms'] = [];
                ds.magres.units.push(["ms","ppm"]);    
            }
            
            var ms = {
                'sigma': [[parseFloat(parse_shielding[2]), parseFloat(parse_shielding[3]), parseFloat(parse_shielding[4])],
                          [parseFloat(parse_shielding[5]), parseFloat(parse_shielding[6]), parseFloat(parse_shielding[7])],
                          [parseFloat(parse_shielding[8]), parseFloat(parse_shielding[9]), parseFloat(parse_shielding[10])]],
                'atom_id': atom_table[species][index],
            };
            
            ds.magres.ms.push(ms);
            
        }
        
        if (parse_efg != null) {
            
            if (!("efg" in ds.magres)) {
                
                // Add the ms section
                
                ds.magres['efg'] = [];
                ds.magres.units.push(["efg","au"]);    
            }
            
            var efg = {
                'V': [[parseFloat(parse_efg[2]), parseFloat(parse_efg[3]), parseFloat(parse_efg[4])],
                          [parseFloat(parse_efg[5]), parseFloat(parse_efg[6]), parseFloat(parse_efg[7])],
                          [parseFloat(parse_efg[8]), parseFloat(parse_efg[9]), parseFloat(parse_efg[10])]],
                'atom_id': atom_table[species][index],
            };
            
            ds.magres.efg.push(efg);
            
        }
        
    }
    
    var has_units = false;
    
    for (var i = 0; i < ds.atoms.units.length; ++i) {
        
        has_units = has_units || (ds.atoms.units[i][0] == "atom");
        
    }
    
    if (!has_units) {
        ds.atoms.units.push(["atom","Angstrom"]);
    }
    
    return true;
    
}

function parse_castep(ds, cfile)
{
    var lattice_regex = /\s+Real Lattice\(A\)\s+Reciprocal Lattice\(1\/A\)\n(.*?)\n(.*?)\n(.*?)\n/;
    var lline_regex = /([0-9eE\.\-]+)\s+([0-9eE\.\-]+)\s+([0-9eE\.\-]+)\s.*/;
    
    var lattices = findall(lattice_regex, cfile);
    
    if (lattices.length == 0) {
        return false;
    }
    
    var latt_1 = lline_regex.exec(lattices.slice(-1)[0][1]);
    var latt_2 = lline_regex.exec(lattices.slice(-1)[0][2]);
    var latt_3 = lline_regex.exec(lattices.slice(-1)[0][3]);
    
    if (latt_1 == null || latt_2 == null || latt_3 == null) {
        return false;
    }
    
    ds.atoms.lattice.push([[parseFloat(latt_1[1]), parseFloat(latt_1[2]), parseFloat(latt_1[3])],
                           [parseFloat(latt_2[1]), parseFloat(latt_2[2]), parseFloat(latt_2[3])],
                           [parseFloat(latt_3[1]), parseFloat(latt_3[2]), parseFloat(latt_3[3])]]);
    
    // Now add units
    
    var has_units = false;
    
    for (var i = 0; i < ds.atoms.units.length; ++i) {
        
        has_units = has_units || (ds.atoms.units[i][0] == "lattice");
        
    }
    
    if (!has_units) {
        ds.atoms.units.push(["lattice","Angstrom"]);
    }

    
    return true;
    
}

function findall(regex, string)
{
    var res = [];    
    
    while (regex.test(string))
    {
        regex.lastIndex = 0;
        var lastres = regex.exec(string);
        if (lastres == null) {
            break;
        }
        res.push(lastres);
        string = string.slice(lastres.index + lastres[0].length);
    }
    
    return res;    
}


