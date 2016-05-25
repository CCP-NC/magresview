//MagresView 
//by Simone Sturniolo
//
//Copyright 2013 Science and Technology Facilities Council
//This software is distributed under the terms of the GNU General Public License (GNU GPL)
//Please refer to the file COPYING for the text of the license

// Utilities for the range sphere visualized in file output, cluster display
// and such

function range_sphere_drawscript(r) {

        sphere_script = "define default_displaygroup " + default_displaygroup + ";";
        sphere_script += "ellipsoid range_sphere_choice";
        sphere_script += " axes {" + r + " 0 0} {0 " + r + " 0} {0 0 " + r + "} center {*}[" + last_atom_picked + "] color translucent 0.7 {200 200 200};";
        sphere_script += " display {default_displaygroup or within(" + r + ", ({*}[" + last_atom_picked + "]))};";
        sphere_script += " color {displayed and not default_displaygroup} translucent;";

        return sphere_script;
}

function range_sphere_delscript() {

        sphere_script = "define default_displaygroup " + default_displaygroup + ";";
        sphere_script += "ellipsoid range_sphere_choice delete; display default_displaygroup;";    

        return sphere_script;
}

function range_sphere_getR() {
    // Get the radius of the range sphere IF there are visible elements
    // tagged to define it. Otherwise it returns -1, meaning the sphere
    // should not be visible.

    // First, is there an ON instruction?
    var is_on = $('[rangesphereON]:visible:enabled').prop('checked');
    is_on = is_on == null? true : is_on;

    var r = parseFloat($('[rangesphereR]:visible:enabled').val());

    if (is_on && !isNaN(r)) {
        return r;
    }
    else {
        return -1;
    }
}

function range_sphere_update()
{   
    // Check the radius, redraw the sphere as demanded
    
    var r = range_sphere_getR();
    if (r > 0)
    {
        sphere_script = range_sphere_drawscript(r);
    }
    else
    {
        sphere_script = range_sphere_delscript();
    }
     
   Jmol.script(mainJmol, sphere_script);        
                       
}
