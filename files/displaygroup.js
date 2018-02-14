//MagresView 
//by Simone Sturniolo
//
//Copyright 2016 Science and Technology Facilities Council
//This software is distributed under the terms of the GNU General Public License (GNU GPL)
//Please refer to the file COPYING for the text of the license

//This file contains all functions and variables related to setting the
//atomic expression identifying which atoms Jmol should effectively plot

var default_displaygroup = null;                    //Basic Jmol atom expression for default displaying of the structure

function auto_displaygroup() {
    // Return an automatic displaygroup based on the nature of the system
    console.log('Auto displaygroup search...');

    switch (is_mol_crystal())
    {
        case 1:
            if (document.getElementById("ismol_check").checked == false)
            {
                return centroid_displaygroup();
            }
            else
            {
                return molecular_displaygroup();                        
            }
            break;
        case -1:
            if (document.getElementById("ismol_check").checked == false)
            {
                return all_displaygroup();
            }
            else
            {
                return molecular_displaygroup();                        
            }
            break;
        case 0:
        default:
            break;
            
    }

    return supercell_displaygroup();
}

function supercell_displaygroup(x_lat, y_lat, z_lat) {
    // Make a displaygroup including only the required visible cells for
    // a given supercell.
    // If supercell size isn't passed it fetches it directly as required

    x_lat = x_lat | parseInt($("#x_lat").val());
    y_lat = y_lat | parseInt($("#y_lat").val());
    z_lat = z_lat | parseInt($("#z_lat").val());

    var displcells = "none";
    for (var xl = 0; xl < x_lat; ++xl)
        for (var yl = 0; yl < y_lat; ++yl)
            for (var zl = 0; zl < z_lat; ++zl)
                    displcells += " or cell=" + (5+xl) + (5+yl) + (5+zl);

    return displcells;

}

function centroid_displaygroup(x_lat, y_lat, z_lat) {

    // Same as above, but using centroids

    x_lat = x_lat | parseInt($("#x_lat").val());
    y_lat = y_lat | parseInt($("#y_lat").val());
    z_lat = z_lat | parseInt($("#z_lat").val());

    var displcells = "none";
    for (var xl = 0; xl < x_lat; ++xl)
        for (var yl = 0; yl < y_lat; ++yl)
            for (var zl = 0; zl < z_lat; ++zl)
                    displcells += " or centroid=" + (5+xl) + (5+yl) + (5+zl);

    return displcells;    

}

function molecular_displaygroup() {

    // Slightly more complex, detects the unique molecules required to 
    // visualize (say, for a co-crystal)

    var gen_dd_script = "";
    
    // Check against composition and gyration radius
    gen_dd_script += "mols = []; mol_elems = []; mol_gyrs = []; unique_mols = [];";
    gen_dd_script += "ucell = {centroid=555}; if (ucell.length == 0) {ucell = {all}};";     //This fixes the case of molecules with no lattice parameters
    gen_dd_script += "if (ucell.tensor('ms', 'value').sum != 'NaN') {mol_ms = []} else {mol_ms = 'None'};"; //Taking into account whether there are also NMR parameters in play
    gen_dd_script += "if (ucell.tensor('efg', 'value').sum != 'NaN') {mol_efg = []} else {mol_ms = 'None'};";
    gen_dd_script += "for (a in ucell) {";
    gen_dd_script += "mol_i = a.molecule; if (mols.find(mol_i)) {continue};";
    gen_dd_script += "mols = mols + [mol_i];"
    gen_dd_script += "this_mol = {within(molecule, a)};";
    // Take composition
    gen_dd_script += "elems = this_mol.elemno.sum;";
    // Take gyration radius
    gen_dd_script += "gyr = 0.0; for (m in this_mol) {";
    gen_dd_script += "gyr = gyr + ({m}.xyz - {this_mol}.xyz)**2};";
    gen_dd_script += "gyr = gyr%1;";
    // Take NMR related quantities - if needed
    gen_dd_script += "if (mol_ms != 'None') { this_ms = this_mol.tensor('ms', 'isotropy').sum2%1; };";
    gen_dd_script += "if (mol_efg != 'None') { this_efg = this_mol.tensor('efg', 'value').sum2%1; };";
    // Check if composition or gyration are already present
    gen_dd_script += "elems_new = (mol_elems.find(elems) == null);"
    gen_dd_script += "gyr_new = (mol_gyrs.find(gyr) == null);"
    gen_dd_script += "ms_new = (mol_ms == 'None' || (mol_ms.find(this_ms) == null));"
    gen_dd_script += "efg_new = (mol_efg == 'None' || (mol_efg.find(this_efg) == null));"
    gen_dd_script += "if ( elems_new or gyr_new or ms_new or efg_new ) {";
    gen_dd_script += "unique_mols = unique_mols + [a];};";
    gen_dd_script += "mol_elems = mol_elems + [elems]; mol_gyrs = mol_gyrs + [gyr];";
    gen_dd_script += "if (mol_ms != 'None') { mol_ms = mol_ms + [this_ms]; };";
    gen_dd_script += "if (mol_efg != 'None') { mol_efg = mol_efg + [this_efg]; }; };";
    gen_dd_script += "temp_ddgroup = []; for (u in unique_mols) { temp_ddgroup = temp_ddgroup or within(molecule, u);};";
    gen_dd_script += "display temp_ddgroup;";
    gen_dd_script += "center {displayed}; zoom 0;";

    Jmol.evaluateVar(mainJmol, 'script("' + gen_dd_script + '");');

    var unique_mols = Jmol.evaluateVar(mainJmol, 'unique_mols');

    displmols = "";
        
    for (var i = 0; i < unique_mols.length; ++i) {
        displmols += " within(molecule, {*}[" + (unique_mols[i][0] + 1) + "]) ";
        if (i < unique_mols.length - 1) {
            displmols += "or";
        }
    }

    return displmols;    
}

function element_displaygroup(elems) {
    // A list of elements
    if (typeof(elems) == 'string')
        elems = [elems];

    displelems = '';

    for (var i=0; i < elems.length; ++i) {
        displelems += '_' + elems[i];
        if (i<elems.length-1) {
            displelems += ' or ';
        }
    }

    return displelems;
}

function picked_displaygroup() {
    // Last atom picked
    return "{*}[" + last_atom_picked + "]";
}

function sphere_displaygroup(r, dd) {
    return "within(" + r + ", (" + dd + "))";
}

function all_displaygroup() {
    // Just for convenience, it's silly
    return 'all';
}

function or_displaygroup(dd1, dd2) {
    // Logically join two displaygroups
    return "(" + dd1 + ") or (" + dd2 + ")";
}

function and_displaygroup(dd1, dd2) {
    // Logically join two displaygroups
    return "(" + dd1 + ") and (" + dd2 + ")";
}

// Types of dropdown and consequent handlers
var displ_def_types = {
    'auto': auto_displaygroup,
    'ucell': supercell_displaygroup,
    'centroid': centroid_displaygroup,
    'molecule': molecular_displaygroup,
    'element': function() {
        // Grab the element list
        elems_string = $('#displ_def_type_forms')
                        .find('[formOpt=element]')
                        .val();
        elems = [];
        elems_string = elems_string.split(',');
        for (var i = 0; i < elems_string.length; ++i) {
            elems.push(elems_string[i].trim());
        }
        return element_displaygroup(elems);
    },
    'cluster': function() {
        var r = range_sphere_getR();
        return sphere_displaygroup(r, picked_displaygroup());
    },
    'custom': function() {
        return $('#displ_custom_box').val();
    }

}

function displ_def_type_handler() {
    var val = $('#displ_def_type').val();
    var forms = $('#displ_def_type_forms');

    forms.children().addClass('nodisplay');
    forms.find('[formOpt="'+val+'"]').removeClass('nodisplay');    

    range_sphere_update();
    $('#displ_custom_box').val(default_displaygroup);
}

function displ_r_handler(evt) {
    //Compatibility code - see console.js for details
    var evt = window.event || evt;
    var myKey = (evt.keyCode)? evt.keyCode: evt.charCode;
    
    if (myKey == 13)
    {
        range_sphere_update();
    }
}

function displ_def_submit(stop_change) {
    var type = $('#displ_def_type').val();
    test_displaygroup = displ_def_types[type]();
    // Check if actually valid
    sel = Jmol.evaluateVar(mainJmol, '{'+test_displaygroup+'}');
    if (sel == "ERROR") {
        $('#displ_custom_box').val(default_displaygroup);
    }
    else {

        // None of this makes sense if there is no unit cell data to begin with...
        if (atom_set.lattice_pars == null) {
            default_displaygroup = 'all';
        }
        else {
            default_displaygroup = test_displaygroup;
        }
    
        if (!stop_change)
            global_state_machine.handle_change('state');
    }
}