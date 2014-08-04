//MagresView 
//by Simone Sturniolo
//
//Copyright 2013 Science and Technology Facilities Council
//This software is distributed under the terms of the GNU General Public License (GNU GPL)
//Please refer to the file COPYING for the text of the license

//This file contains all the default values of the parameters that can be configured in mview_config.js

// ------ Jmol framework ------

//Set this variable to "true" if you want MagresView to load Jmol instead of JSmol at startup. Default is false.
var use_java_framework = false;

// ------ Loading options ------

//Set this variable to "true" if you want MagresView to always start with the Load as molecule option on. Default is false
var load_as_molecule = false;

// ------ Visual options ------

//Set this variable to "true" if you want MagresView to start with the selection halos turned on. Default is false.
var use_selection_halos = false;

//Set this variable to "false" if you want MagresView to hide the bonds (sticks) in the model. Default is true.
var use_visible_bonds = true;

//Set this variable to "false" if you want MagresView to start with a default wire representation of models (no sticks and balls). Default is true.
var use_sticks_and_balls = true;

//Set this variable to "false" if you want MagresView to hide the axes and unit cell in the model. Default is true.
var use_axes_unitcell = true;

//Set this variable to "true" if you want MagresView to show atomic labels next to them (only valid for .magres files). Default is false.
var use_atom_labels = false;

/* Change this variable to change the convention used in measure units.
 * 0 = Haeberlen (DEFAULT)
 * 1 = Haeberlen with reduced anisotropy
 * 2 = Herzfeld-Berger */
var use_unit_convention = 0;
