//MagresView 
//by Simone Sturniolo
//
//Copyright 2013 Science and Technology Facilities Council
//This software is distributed under the terms of the GNU General Public License (GNU GPL)
//Please refer to the file COPYING for the text of the license

//This file handles the loading of files by hovering them on the page in HTML5

var dragdrop_target = "#main_page_body";

function hover_load() {
        
    $(dragdrop_target).on("dragover", drag_handler);
    $(dragdrop_target).on("dragleave", drag_handler);
    $(dragdrop_target).on("drop", drop_handler);
    
}

function drop_handler(e) {
    
    e.preventDefault();
        
    load_file(e);
    
    drag_handler(e);
        
}

function drag_handler(e) {
    
    e.preventDefault();
    
    hover_on = (e.type == "dragover");
    $(dragdrop_target).toggleClass("hovered", hover_on);
    
}