//MagresView 
//by Simone Sturniolo
//
//Copyright 2013 Science and Technology Facilities Council
//This software is distributed under the terms of the GNU General Public License (GNU GPL)
//Please refer to the file COPYING for the text of the license

//This file handles the plotting of Magnetic Susceptibility. It is for now considered an experimental feature and thus not included in the present version of MagresView

var interval_id;

function sus_plot()
{
	//Steps:
	//1. get the current rotation matrix
	//2. calculate the direction of the Y axis, and therefore of the external magnetic field B, in the current frame of reference
	//3. calculate the magnetic response in the absolute frame of reference for the given B 
	//4. calculate the three versors in the current frame of reference and project the response along them
	//5. plot the whole thing
				
	//1.
	var rot_matrix = safe_jmolGetPropertyAsArray(mainJmol, "transformInfo", "", 40);
	var t_rot_matrix = transpose(rot_matrix);

	//2. 
	//Applied magnetic field is represented always along the y-axis (vertical axis for the viewer)
	var y_r = vec_rotate([0, atom_set.system_size/2.0, 0], t_rot_matrix);

	//3.
	//Calculate system response
	var resp = vec_rotate(y_r, atom_set.mag_sus[0].r);	
	var resp_mag = Math.sqrt(resp[0]*resp[0]+resp[1]*resp[1]+resp[2]*resp[2]);
	
	//4.
	//Calculate the versors of the three orthogonal axes in the CURRENT frame of reference...
	var i_r = vec_rotate([1, 0, 0], t_rot_matrix);
	var j_r = vec_rotate([0, 1, 0], t_rot_matrix);
	var k_r = vec_rotate([0, 0, 1], t_rot_matrix);
	
	var scale_factor = atom_set.system_size/(2.0*resp_mag);
	
	//...and project the response along them
	var resp_i = vec_scale(vec_project(resp, i_r), scale_factor);
	var resp_j = vec_scale(vec_project(resp, j_r), scale_factor);
	var resp_k = vec_scale(vec_project(resp, k_r), scale_factor);
	
	var resp_tot = vec_scale(resp, scale_factor);
				
	//5. 
	//Plotting. This is the most time-consuming step, as the communication from javascript to the Jmol applet seems to be sort of a bottleneck, so it's done all in one go.
	var next_scr = "draw mag_sus_main_field_arrow delete; draw mag_sus_main_field_arrow vector {"+
	(-atom_set.system_size/2.0) + " 0 0} {" + y_r[0] + " " + y_r[1] + " " + y_r[2] +"} diameter 10 color translucent 0.8 yellow; "+
	"draw mag_sus_resp_i_arrow delete; "+
	"draw mag_sus_resp_i_arrow vector {0 0 0} {" + resp_i[0] + " " + resp_i[1] + " " + resp_i[2] + "} diameter 10 color translucent 0.8 red; "+
	"draw mag_sus_resp_j_arrow delete; "+
	"draw mag_sus_resp_j_arrow vector {0 0 0} {" + resp_j[0] + " " + resp_j[1] + " " + resp_j[2] + "} diameter 10 color translucent 0.8 green; "+
	"draw mag_sus_resp_k_arrow delete; "+
	"draw mag_sus_resp_k_arrow vector {0 0 0} {" + resp_k[0] + " " + resp_k[1] + " " + resp_k[2] + "} diameter 10 color translucent 0.8 blue;"+ 
	"draw mag_sus_resp_tot_arrow delete; "+
	"draw mag_sus_resp_tot_arrow vector {0 0 0} {" + resp_tot[0] + " " + resp_tot[1] + " " + resp_tot[2] + "} diameter 10 color translucent 0.8 white;"; 
	Jmol.script(mainJmol, next_scr);	
		
}

function sus_plot_handler(event)
{
	//If the checkbox is ticked, reset the orientation and start repeating the sus_plot at regular intervals
	if (event.target.checked == true)
	{
		Jmol.script(mainJmol, "reset");
	 	interval_id = setInterval(sus_plot, 100);
   }
   
	else
	//If it's not, stop plotting, and delete all the arrows
	{
	 	clearInterval(interval_id);
	 	Jmol.script(mainJmol, "draw mag_sus_main_field_arrow delete;" +
		"draw mag_sus_resp_i_arrow delete; " +
		"draw mag_sus_resp_j_arrow delete; " +
		"draw mag_sus_resp_k_arrow delete; " +
		"draw mag_sus_resp_tot_arrow delete; ");
	}	
}
