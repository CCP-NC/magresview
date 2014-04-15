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
}

function oldmagres_drop_handler(e) {
    
    e.preventDefault();
    e.stopPropagation();
    
    var to_load = e.originalEvent.dataTransfer.files[0];
    var old_magres_rdr = new FileReader();
    
    old_magres_rdr.onloadend = function() {      
        
    };
    
    old_magres_rdr.readAsText(to_load);
    
    
}

function castep_drop_handler(e) {
    
    e.preventDefault();
    e.stopPropagation();
    
}