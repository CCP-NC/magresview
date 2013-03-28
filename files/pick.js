//MagresView 
//by Simone Sturniolo
//
//Copyright 2013 Science and Technology Facilities Council
//This software is distributed under the terms of the GNU General Public License (GNU GPL)
//Please refer to the file COPYING for the text of the license

//Asynchronous even handling for "picking" (clicking) atoms in JMol

//This array stores the info on the atoms on which we want to calculate the Euler angle differences stored as:
// [type (MS = 0, EFG = 1), tag (for MS it's always 0), species, atom]

var pick_selected = [];

var pick_callback_flag_ms = false;
var pick_callback_flag_efg = false;

function ms_pick_btn_handler()
{
	pick_callback_flag_ms = true;
   pick_callback_flag_efg = false;
}

function efg_pick_btn_handler()
{
	pick_callback_flag_efg = true;
   pick_callback_flag_ms = false;
}

function pick_callback(app, atom_line, atom_n)
{
	if (pick_callback_flag_ms == true || pick_callback_flag_efg == true)
	{		
		var t, tag, s, a;
		
		if (pick_callback_flag_ms == true)
		{
			t = 0;
			tag = 0;
		}
		else
		{
			t = 1;
			tag = atom_set.mag_efg_tags[document.getElementById("efg_drop").value];
		}
		
		//Extract the atom number from atom_line
		
		atom_line = atom_line.split(" ");

		//If the length is not 5, something wrong has happened
		if (atom_line.length != 5)
			return;
					
		var atom_abs_n = parseInt(atom_line[1].replace("#",""));
						
		for (var s_i = 0; s_i < atom_set.speciesno; ++s_i)
		{
			if (atom_abs_n-1 < atom_set.starting_nums[s_i+1])
			{
				s = s_i;
				a = atom_abs_n-1-atom_set.starting_nums[s];
				break;				
			}
		}
						
		//Add picked atom to selection
		pick_selected.push([t, tag, s, a]);
		
		switch (pick_selected.length)
		{
			case 1:
				//Highlight selected atom
				var rgb_color;
				if (t == 0)
				{
					rgb_color = "{192 96 0}";
				}
				else
				{
					rgb_color = "{0 96 192}";
				}
				
				var hl_script = "";

				hl_script += "draw id pick_hl_circle circle {" + atom_line[0] + "} mesh nofill color " + rgb_color +" diameter @{{" + atom_line[0] + "}.radius*2.5};";
				
				Jmol.script(mainJmol, hl_script);				
				
			break;
			
			case 2:
				
				//Find the first eigenvector set
				
				var eigv_1;
				
				if (pick_selected[0][0] == 0)
				{
					for (var i = 0; i < atom_set.mag_ms.length; ++i)
					{
						if (pick_selected[0][2] == atom_set.atom_species[atom_set.mag_ms[i].sp] &&
							 pick_selected[0][3] == atom_set.mag_ms[i].sp_i-1)
							 {
							 	eigv_1 = atom_set.mag_ms_symm_eigenvect[i];
							 }
					}
				}
				else if (pick_selected[0][0] == 1)
				{
					for (var i = 0; i < atom_set.mag_efg[pick_selected[0][1]].length; ++i)
					{
						if (pick_selected[0][2] == atom_set.atom_species[atom_set.mag_efg[pick_selected[0][1]][i].sp] &&
							 pick_selected[0][3] == atom_set.mag_efg[pick_selected[0][1]][i].sp_i-1)
							 {
							 	eigv_1 = atom_set.mag_efg_eigenvect[pick_selected[0][1]][i];
							 }
					}
				}
				
				var eigv_2;
				
				if (pick_selected[1][0] == 0)
				{
					for (var i = 0; i < atom_set.mag_ms.length; ++i)
					{
						if (pick_selected[1][2] == atom_set.atom_species[atom_set.mag_ms[i].sp] &&
							 pick_selected[1][3] == atom_set.mag_ms[i].sp_i-1)
							 {
							 	eigv_2 = atom_set.mag_ms_symm_eigenvect[i];
							 }
					}
				}
				else if (pick_selected[1][0] == 1)
				{
					for (var i = 0; i < atom_set.mag_efg[pick_selected[1][1]].length; ++i)
					{
						if (pick_selected[1][2] == atom_set.atom_species[atom_set.mag_efg[pick_selected[1][1]][i].sp] &&
							 pick_selected[1][3] == atom_set.mag_efg[pick_selected[1][1]][i].sp_i-1)
							 {
							 	eigv_2 = atom_set.mag_efg_eigenvect[pick_selected[1][1]][i];
							 }
					}
				}
				
				//Check that both eigv_1 and eigv_2 are non null and submit them to the euler angles function
				
				if (eigv_1 == null || eigv_2 == null)
				{
					alert("Error: no data found for the selected atoms. Euler angles can not be calculated");
					reset_pickings();
					return;
				}
				
				var eul_ang = euler_diff(eigv_1[0], eigv_1[1], eigv_1[2], eigv_2[0], eigv_2[1], eigv_2[2], document.getElementById("opt_euler_drop").value);
				
				//Produce an output window with the euler angles values
				pick_out_window(eul_ang);
				
				reset_pickings();			
			break;	
		}
					
	}
}

//Resets everything related to the pickings - the array that stores the selected atoms, the graphics and the flags.
//Called after a finished picking or when the molecule is reloaded

function reset_pickings()
{
	pick_selected = [];
	Jmol.script(mainJmol, "draw pick_hl_circle delete;");
	pick_callback_flag_ms = false;
	pick_callback_flag_efg = false;
}

function pick_out_window(eul_ang)
{
	document.getElementById("euler_popup").innerHTML = "Euler angles between principal axes of:<br>";
	document.getElementById("euler_popup").innerHTML += (pick_selected[0][0]==0?"MS":"EFG_" + pick_selected[0][1]) + " tensor of " + atom_set.atom_species_labels[pick_selected[0][2]] + " " + (pick_selected[0][3]+1) + "<br>";
	document.getElementById("euler_popup").innerHTML += "and<br>";
	document.getElementById("euler_popup").innerHTML += (pick_selected[1][0]==0?"MS":"EFG_" + pick_selected[1][1]) + " tensor of " + atom_set.atom_species_labels[pick_selected[1][2]] + " " + (pick_selected[1][3]+1) + "<br>";
	document.getElementById("euler_popup").innerHTML += "<br>";
	document.getElementById("euler_popup").innerHTML += "&alpha; = " + (eul_ang[0]/Math.PI*180.0).toFixed(2) + "&deg;<br>";
	document.getElementById("euler_popup").innerHTML += "&beta; = " + (eul_ang[1]/Math.PI*180.0).toFixed(2) + "&deg;<br>";
	document.getElementById("euler_popup").innerHTML += "&gamma; = " + (eul_ang[2]/Math.PI*180.0).toFixed(2) + "&deg;<br>";
	
	$("#euler_popup").dialog("open");
}


