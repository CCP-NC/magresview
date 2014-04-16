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
        }
        
    };
    
    old_magres_rdr.readAsText(to_load);
    
    
}

function castep_drop_handler(e) {
    
    e.preventDefault();
    e.stopPropagation();
    
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
        var parse_jc = jc_tensor_regex.exec(atoms[i][4]);
        
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
                'sigma': [[parseFloat(parse_efg[2]), parseFloat(parse_efg[3]), parseFloat(parse_efg[4])],
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

function findall(regex, string)
{
    var res = [];    
    
    while (regex.lastIndex < string.length)
    {
        var lastres = regex.exec(string);
        if (lastres == null) {
            break;
        }
        res.push(lastres);        
    }
    
    return res;    
}


