//MagresView 
//by Simone Sturniolo
//
//Copyright 2013 Science and Technology Facilities Council
//This software is distributed under the terms of the GNU General Public License (GNU GPL)
//Please refer to the file COPYING for the text of the license

// Console input handling

// Console history holds the last five commands inserted

var console_history = ["", "", "", "", ""];
var cons_hist_i = 5;

//Handles the onkeyup event

function console_input(evt)
{
	// This line is inserted for compatibility with IE which uses window.event instead of the passed 'event' argument
	var evt = window.event || evt;
	// This one for compatibility with Firefox, which uses 'charCode'. Because unified standards are for pansies.
	var myKey = (evt.keyCode)? evt.keyCode: evt.charCode;
	var in_line = $("#jmol_console").val();
	
	// Execution of a command (ENTER)
	if (myKey == 13)
	{
		//Empty the console
		document.getElementById("jmol_console").value = "";

		//Check that the command didn't alter the model - if it did, disable NMR functionalities and clear atom_set data
		//This is done by signaling the proper callback function
		cmd_script = in_line + "; message 'mview_console_command';";
		
		//Run the command
		Jmol.script(mainJmol, cmd_script);
		
		//Add the command to history
		console_history.shift();
		console_history.push(in_line);
		cons_hist_i = 5;
		
	}
	// Navigation of command history (UP, DOWN)
	// 38 = UP
	else if (myKey == 38 && cons_hist_i >= 0)
	{
		if (cons_hist_i > 0) 
			--cons_hist_i;
		document.getElementById("jmol_console").value = console_history[cons_hist_i];
	}
	// 40 = DOWN
	else if (myKey == 40 && cons_hist_i <= 4)
	{
		if (cons_hist_i < 5)
			++cons_hist_i;
			
		if (cons_hist_i < 5)
			document.getElementById("jmol_console").value = console_history[cons_hist_i];
		else if (cons_hist_i == 5)
			document.getElementById("jmol_console").value = "";
	}
}
