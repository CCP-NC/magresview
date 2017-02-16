//MagresView 
//by Simone Sturniolo
//
//Copyright 2013 Science and Technology Facilities Council
//This software is distributed under the terms of the GNU General Public License (GNU GPL)
//Please refer to the file COPYING for the text of the license

//This file contains all functions necessary to the server side version of MagresView

function inspect_example_folder() {
    
    var inspect_request = new XMLHttpRequest();
    
    inspect_request.onload = file_load_drop_update;
    inspect_request.open('get', 'examples/example_list', true);
    inspect_request.send();
    
}

function file_load_drop_update() {
    
    var dropd = document.getElementById("file_load_drop");
    var example_file_list = [];
    var ext = '.magres';
    
    var split_raw_list = (this.responseText).split('\n');
        
    for (var i = 0; i < split_raw_list.length; ++i)
    {
        if (split_raw_list[i].indexOf('.magres', split_raw_list[i].length - ext.length) !== -1) {
            example_file_list.push(split_raw_list[i]);
        }
    }
    
    /*
    
    $(this.responseText).filter('ul').find('li').find('a').each(function(i, val) {
            var fname = $(val).attr('href');
            if (fname.indexOf('.magres', fname.length - ext.length) !== -1) {
               example_file_list.push(fname);
            }
        });
    */
    
    dropd.options.length = example_file_list.length + 1;
    
    for (var i = 0; i < example_file_list.length; ++i)
    {
        dropd.options[i] = new Option(example_file_list[i].slice(0,example_file_list[i].length - ext.length), 'examples/' + example_file_list[i]);
    }
    
    dropd.options[dropd.options.length-1] = new Option('Load database file...', '#database_file#');
    
    dropd.selectedIndex = -1;
    
}

function file_load_drop_handler()
{
    var to_load = $('#file_load_drop').val();
    if (to_load == '#database_file#') {
        load_from_database();
    }
    else
    {
        var file_req = new XMLHttpRequest();
        
        file_req.onload = forward_loadrequest;
        file_req.open('get', to_load, true);
        // Store the name for future retrieval
        file_req.model_name = get_rootname(to_load);
        file_req.send();            
    }
    
}

function load_from_database() {
    var query_id = window.prompt("Database ID of the required structure\n(example: 653683)");
    // Send a query
    var file_req = new XMLHttpRequest();

    file_req.onload = forward_loadrequest;
    file_req.open('get', 'http://localhost:5000/magresquery/' + query_id, true);
    file_req.model_name = 'DB' + query_id;
    file_req.onerror = function() {
        // Something went wrong...
        alert('Connection with server could not be established');
    }

    file_req.send();        
}

function forward_loadrequest()
{
    last_loaded_file = this.responseText;

    if (typeof(Storage) !== "undefined")
    {
        sessionStorage.setItem('last_loaded_file', last_loaded_file);
    }
    
    var is_magres = (last_loaded_file.indexOf("#$magres-abinitio") >= 0); //Is the loaded file a magres file?
    Jmol.script(mainJmol, "zap");
    reset_system();
    disable_NMR_controls();
    atom_set.is_magres = is_magres;
    atom_set.model_name = this.model_name;
    load_string(mainJmol, last_loaded_file);
}