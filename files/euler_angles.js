//MagresView 
//by Simone Sturniolo
//
//Copyright 2013 Science and Technology Facilities Council
//This software is distributed under the terms of the GNU General Public License (GNU GPL)
//Please refer to the file COPYING for the text of the license

//This file handles the calculation of differences between reference frames in terms of Euler angles

var dotprod_tol = 1e-6;  //Defines a tolerance for the check that scalar products of orthogonal vectors really are zero.
var m_el_tol = 1e-10;					//Defines a tolerance for the check on matrix elements being comprised between -1 and 1
var sinb_tol = 1e-10;				//Defines a tolerance for the check sin(b) == 0 in the matrix-to-angles routine

function euler_diff(x1, y1, z1, x2, y2, z2, conv)
{
	/* This function is just a container; it accepts as arguments two sets of length 3 arrays (base vectors for two different reference frames)
	expressed in a common reference frame, and outputs the Euler angles between the two, according to the convention given. The convention can be
	zyz or zxz - where the letters represent the axes around which the various rotations are performed */
		
	if (check_axes(x1, y1, z1, x2, y2, z2) == false)
	{
		return [NaN, NaN, NaN];
	}
		
	/* It is convenient at this point to rotate the first reference frame so to express it in terms of the second one. In this way, the calculation of the
	Euler angles is simpler and can be performed from the rotated vectors alone. The rotation matrix for this operation is built by using the vectors
	x2, y2, z2 as rows */
	
	var ax1_2_ax2 = [x2, y2, z2];
	var x1rot = vec_rotate(x1, ax1_2_ax2);
	var y1rot = vec_rotate(y1, ax1_2_ax2);
	var z1rot = vec_rotate(z1, ax1_2_ax2);
		
	switch(conv)
	{
		case 'zyz':
			return euler_zyz(x1rot, y1rot, z1rot);
			break;
		case 'zxz':
			return euler_zxz(x1rot, y1rot, z1rot);
			break;
		default:
	}	
	
}

function check_axes(x1, y1, z1, x2, y2, z2)
{
	//This function checks whether x1, y1, z1 and x2, y2, z2 really form a set of two valid reference frames
	var to_check = [x1, y1, z1, x2, y2, z2];

	// 1. Check that vectors have the right length
	for (var i=0; i < 6; ++i)
	{
		if (to_check[i].length != 3)
		{
			alert("Invalid vectors - Euler angle difference can't be calculated");
			return false;
		}	
	}	
	
	// 2. Check that vectors are orthogonal
	for (var i = 0; i < 2; ++i)
	{
		for (var j = i+1; j < 3; ++j)
		{
			if (Math.abs(vec_dotprod(to_check[i], to_check[j])) > dotprod_tol || Math.abs(vec_dotprod(to_check[i+3], to_check[j+3])) > dotprod_tol)
			{
				alert("Vectors don't define a valid orthogonal reference frame - Euler angle difference can't be calculated");
				return false;
			}
		}
	}
	
	return true;	
}

function euler_zyz(e1, e2, e3)
{
	// Calculate the Euler angles to rotate from the principal axes system to the one defined by e1, e2, e3
	// Convention ZYZ - rotation a around Z, b around Y, then c around Z again
	
	/* This is accomplished by building the rotation matrix that has e1, e2 and e3 as columns and then solving it for
	the angles a, b, c.
	The matrix is:
									| cos(a)cos(b)cos(c)-sin(a)sin(c)		sin(a)cos(b)cos(c)+cos(a)sin(c)			-sin(b)cos(c)				|
									| -cos(a)cos(b)sin(c)-sin(a)cos(c)		-sin(a)cos(b)sin(c)+cos(a)cos(c)		sin(b)sin(c)				|
									| cos(a)sin(b)							sin(a)sin(b)							cos(b)						|
	*/
	
	var m = transpose([e1, e2, e3]);
	var a, b, c;
	
	//A loop to check that all elements of m are well behaved, i.e. comprised between +1 and -1
	for (var i = 0; i < 3; ++i)
	{
		for(var j = 0; j < 3; ++j)
		{
			if (m[i][j] > 1.0)
			{
				if(m[i][j]-1.0 < m_el_tol)
				{
					m[i][j] = 1.0;
				}
				else
				{
					alert("Invalid rotation matrix - Euler angles can't be calculated");
					return [NaN, NaN, NaN];					
				}
			}
			else if (m[i][j] < -1.0)
			{
				if(-m[i][j]-1.0 < m_el_tol)
				{
					m[i][j] = -1.0;
				}
				else
				{
					alert("Invalid rotation matrix - Euler angles can't be calculated");
					return [NaN, NaN, NaN];
				}
			}
		}
	}
	
	//If cos(b) = 1 or cos(b) = -1, then we are in Gimbal lock condition - that is, a+c is the only thing that matters. In this case, by convention, we fix c = 0.
	//sin(b) is assumed to be always positive, that is, b is comprised between 0 and PI.
	
	b = Math.acos(m[2][2]);
	var sb = Math.sin(b);

	if (Math.abs(sb) < sinb_tol)
	{	
		a = Math.atan2(-m[1][0], m[0][0]);
		c = 0;
	}
	else
	{
		a = Math.atan2(m[2][1]/sb, m[2][0]/sb);
		c = Math.atan2(m[1][2]/sb, -m[0][2]/sb);
	}
	
	return [a, b, c];	
}

function euler_zxz(e1, e2, e3)
{
	// Calculate the Euler angles to rotate from the principal axes system to the one defined by e1, e2, e3
	// Convention ZXZ - rotation a around Z, b around X, then c around Z again
	
	/* This is accomplished by building the rotation matrix that has e1, e2 and e3 as rows and then solving it for
	the angles a, b, c.
	The matrix is:
																		| cos(a)cos(c)-sin(a)cos(b)sin(c)		sin(a)cos(c)+cos(a)cos(b)sin(c)			-sin(b)sin(c)		|
																		| -cos(a)sin(c)-sin(a)cos(b)cos(c)		-sin(a)sin(c)+cos(a)cos(b)cos(c)			sin(b)cos(c)		|
																		|		sin(a)sin(b)							-cos(a)sin(b)									cos(b)				|
	*/
	
	var m = transpose([e1, e2, e3]);
	var a, b, c;
	
	//A loop to check that all elements of m are well behaved, i.e. comprised between +1 and -1
	for (var i = 0; i < 3; ++i)
	{
		for(var j = 0; j < 3; ++j)
		{
			if (m[i][j] > 1.0)
			{
				if(m[i][j]-1.0 < m_el_tol)
				{
					m[i][j] = 1.0;
				}
				else
				{
					alert("Invalid rotation matrix - Euler angles can't be calculated");
					return [NaN, NaN, NaN];					
				}
			}
			else if (m[i][j] < -1.0)
			{
				if(-m[i][j]-1.0 < m_el_tol)
				{
					m[i][j] = -1.0;
				}
				else
				{
					alert("Invalid rotation matrix - Euler angles can't be calculated");
					return [NaN, NaN, NaN];
				}
			}
		}
	}
	
	//If cos(b) = 1 or cos(b) = -1, then we are in Gimbal lock condition - that is, a+c is the only thing that matters. In this case, by convention, we fix c = 0.
	//sin(b) is assumed to be always positive, that is, b is comprised between 0 and PI.
	
	b = Math.acos(m[2][2]);
	var sb = Math.sin(b);

	if (Math.abs(sb) < sinb_tol)
	{	
		a = Math.atan2(-m[1][0], m[0][0]);
		c = 0;
	}
	else
	{
		a = Math.atan2(m[2][0]/sb, -m[2][1]/sb);
		c = Math.atan2(-m[0][2]/sb, m[1][2]/sb);
	}
	
	return [a, b, c];	
}

function euler_eigval(aname, type, conv)
{
	return Jmol.evaluate(mainJmol, "{" + aname + "}.tensor(\"" + type + "\", \"euler" + conv + "\")");
}

function euler_eigvaldiff(aname1, type1, aname2, type2, conv)
{
	var conv_scripts = {
		"zyz": "%6",
		"zxz": "%5" 
	};

	var euldiff_script =  "q1 = {" + aname1 + "}.tensor(\"" + type1 + "\", \"quaternion\")[0];"
	euldiff_script += 	  "q2 = {" + aname2 + "}.tensor(\"" + type2 + "\", \"quaternion\")[0];"
	euldiff_script += 	  "q3 = q2 \\ q1;";
	euldiff_script +=	  "euld = " + conv_scripts[conv];

	return Jmol.evaluate(mainJmol, "({" + aname1 + "}.tensor(\"" + type1 + "\", \"quaternion\")[0] \\ {" + aname2 + "}.tensor(\"" + type2 + "\", \"quaternion\")[0])" + conv_scripts[conv]);
}

var euldiff_pick_atom1 = null;
var euldiff_pick_atom2 = null;

function euler_diff_script(init)
{
	// Returns the Jmol script for initializing or terminating the Euler angles difference thing
	var euldiff_init_script = 'unbind "left-click"; unbind "right-click"; unbind "left-down"; unbind "right-down";';

	if(init)
	{
		var left_type_radios = document.getElementsByName("eultype1");
		var right_type_radios = document.getElementsByName("eultype2");

		var left_type  = (left_type_radios[0].checked?"ms":"efg");
		var right_type = (right_type_radios[0].checked?"ms":"efg");

		var left_color = (left_type == "ms"? "{192 96 0}":"{0 96 192}");
		var right_color = (right_type == "ms"? "{192 96 0}":"{0 96 192}");

        euldiff_init_script += "set disablePopupMenu TRUE; unbind _setMeasure; set picking off;";
        euldiff_init_script += "bind \"left-down\" \"+: if (_ATOM != ({})) {draw id euldiff_circle_1 delete; draw id euldiff_circle_1 circle {_ATOM} mesh nofill color " + left_color +" diameter @{{_ATOM}.radius*2.5};"
        + " print 'lc_" + left_type + "#_ATOM#'+{_ATOM}.tensor('" + left_type + "', 'quaternion');}\";";
        euldiff_init_script += "bind \"right-down\" \"if (_ATOM != ({})) {draw id euldiff_circle_2 delete; draw id euldiff_circle_2 circle {_ATOM} mesh nofill color " + right_color +" diameter @{{_ATOM}.radius*2.6};"
        + " print 'rc_" + right_type + "#_ATOM#'+{_ATOM}.tensor('" + right_type + "', 'quaternion');}\";";
	}
	else
	{
		euldiff_init_script += "unbind; set disablePopupMenu FALSE; set picking measure; draw id euldiff_circle_1 delete; draw id euldiff_circle_2 delete;";
	}

	return euldiff_init_script;

}

function euler_diff_calc_handler()
{
	
	//A bit of jQuery magic to check whether the active tab is the "Visualization" one. It just works.
	Jmol.script(mainJmol, euler_diff_script(true));
}

function euldiff_butt_handler()
{
	
	var eul_conv = document.getElementById("opt_euler_drop").value;
	var conv_table = {
		"zyz": "%6",
		"zxz": "%5" 
	}

	if (euldiff_pick_atom1 == null || euldiff_pick_atom2 == null)
		return;

	type1 = euldiff_pick_atom1.substring(euldiff_pick_atom1.indexOf('_')+1, euldiff_pick_atom1.indexOf('#'));
	atom1 = Jmol.evaluate(mainJmol, "{" + euldiff_pick_atom1.substring(euldiff_pick_atom1.indexOf('#')+1, euldiff_pick_atom1.lastIndexOf('#')) + "}.atomname");
	quat1 = euldiff_pick_atom1.substring(euldiff_pick_atom1.lastIndexOf('{'));

	type2 = euldiff_pick_atom2.substring(euldiff_pick_atom2.indexOf('_')+1, euldiff_pick_atom2.indexOf('#'));
	atom2 = Jmol.evaluate(mainJmol, "{" + euldiff_pick_atom2.substring(euldiff_pick_atom2.indexOf('#')+1, euldiff_pick_atom2.lastIndexOf('#')) + "}.atomname");
	quat2 = euldiff_pick_atom2.substring(euldiff_pick_atom2.lastIndexOf('{'));
	
	if (atom1 == atom2 && type1 == type2)
		return;
	
	//console.log("(" + quat1 + " \\ " + quat2 + ")" + conv_table[eul_conv]);

	eul = Jmol.evaluate(mainJmol, "(" + quat1 + " \\ " + quat2 + ")" + conv_table[eul_conv]).split('\n');

	//console.log(eul);

	euldiff_out_window(atom1, type1, atom2, type2, eul);
}

function echo_callback(id, echo)
{	
	if (echo.indexOf("lc") >= 0)
	{
		euldiff_pick_atom1 = echo;
	}	
	else if (echo.indexOf("rc") >= 0)
	{
		euldiff_pick_atom2 = echo;
	}
}

function euldiff_out_window(atom1, type1, atom2, type2, eul_ang)
{
	document.getElementById("euler_popup").innerHTML = "Euler angles between principal axes of:<br>";
	document.getElementById("euler_popup").innerHTML += type1 + " tensor of " + atom1 + "<br>";
	document.getElementById("euler_popup").innerHTML += "and<br>";
	document.getElementById("euler_popup").innerHTML += type2 + " tensor of " + atom2 + "<br>";
	document.getElementById("euler_popup").innerHTML += "<br>";
	document.getElementById("euler_popup").innerHTML += "&alpha; = " + parseFloat(eul_ang[0]).toFixed(2) + "&deg;<br>";
	document.getElementById("euler_popup").innerHTML += "&beta; = " + parseFloat(eul_ang[1]).toFixed(2) + "&deg;<br>";
	document.getElementById("euler_popup").innerHTML += "&gamma; = " + parseFloat(eul_ang[2]).toFixed(2) + "&deg;<br>";
	
	$("#euler_popup").dialog("open");
}

function eultab_calculate()
{
	var eul_conv = document.getElementById("opt_euler_drop").value;
	var to_newtab = document.getElementById("eultab_check").checked;

	if (to_newtab == true)
	{	
		var out_window = window.open('', 'Euler angles table');	
		out_window.document.write("<title>Euler angles table</title>");	
		//The <pre> tags are required to make the page writable as if it was a .txt file
		out_window.document.write("<pre id=\"file_text\" style=\"white-space:pre-wrap\">");
		var file_destination = out_window.document;
	}
	else
	{
		var file_destination = {
			file_str: "",
			write: function(s) {
				this.file_str += s;
			},
			close: function(s) {
				this.file_str = "";
			}
		}
	}

	var conv_table = {
		"zyz": "%6",
		"zxz": "%5" 
	}

	var eul_jmol_script = "ans = \"\"; for (a in {selected}) {n = a.atomname; q_ms = quaternion(a.tensor('ms', 'quaternion')); q_efg = quaternion(a.tensor('efg', 'quaternion')); ans = ans + n + \"\\n\" + (q_ms\\q_efg)" + conv_table[eul_conv] + " + \"\\n\";};";

	Jmol.scriptWait(mainJmol, eul_jmol_script);

	var eul_angs = Jmol.evaluate(mainJmol, "ans");
	eul_angs = eul_angs.split('\n\n');

	file_destination.write('Atom\tAngles (efg => ms)\tAngles (ms => efg)\n');
	file_destination.write("Atom\tAlpha\tBeta\tGamma\tAlpha'\tBeta'\tGamma'\n");	

	for (var ea=0; ea < eul_angs.length; ++ea)
	{
		if (eul_angs[ea] == '')
			continue;

		var e = eul_angs[ea].split('\n');
		var a = parseFloat(e[1]);
		var b = parseFloat(e[2]);
		var c = parseFloat(e[3]);
		file_destination.write(e[0] + '\t' + a.toFixed(2) + '\t' + b.toFixed(2) + '\t' + c.toFixed(2) + 
		'\t' + (-c).toFixed(2) + '\t' + b.toFixed(2) + '\t' + (-a).toFixed(2) + '\n');
	}

	if(to_newtab == true)
	{
		file_destination.write("</pre>");
		file_destination.close();
		out_window.focus();
	}
	else
	{
		if (current_framework == "Java") {
			var savefile_script = "data \"label\"\n" + file_destination.file_str + "\nend \"label\";";
			savefile_script += "x = data(\"label\"); write var x ?.eul; data clear; x = null;";
			Jmol.script(mainJmol, savefile_script);
		}
		else
		{
			$("#eul_file_download").attr("href", "data:text/plain," + file_destination.file_str.replace(/\n/g, '%0A').replace(/\t/g, '%09'));
			$("#eul_file_download").removeClass("hidden");
		}
	}

}
