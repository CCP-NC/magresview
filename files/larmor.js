//MagresView 
//by Simone Sturniolo
//
//Copyright 2013 Science and Technology Facilities Council
//This software is distributed under the terms of the GNU General Public License (GNU GPL)
//Please refer to the file COPYING for the text of the license

//This file contains all the functions related to Larmor frequency (used for quadrupolar shifts)

function larmor_table_gen() {
    
    $('#larmor_table').html('').append('<tr><td>Element</td><td>Larmor frequency (MHz)</td></tr>');
    
    for (var s = 0; s < atom_set.speciesno; ++s)
    {
        var t_row = $('<tr></tr>');
        t_row.append($('<td></td>').html(atom_set.atom_species_labels[s]).attr('id', 'larmor_label_' + atom_set.atom_species_labels[s]));
        t_row.append($('<td></td>').append($('<input></input>').addClass('ref_input')
                                   .attr({'id': 'larmor_input_' + atom_set.atom_species_labels[s], 'value': '100'})));
        
        $('#larmor_table').append(t_row);
    }
    
}

function larmor_table_popup_handler()
{
    var active = $("#main_tabs").tabs("option", "active");
    if(active == tab_index("#spec_plot"))
        svg_spectrum_plot(false);
    plot_update();
}

function load_spin_inJmol() {

    // To be ran only once: this bit loads the whole spin data dict inside Jmol!
    Jmol.script(mainJmol, "spin_data_table = " + spin_data_string + ";");

}