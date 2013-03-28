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
	Euler angles is simpler and can be performed from the rotated vectors alone. The rotation matrix for this operation is build by using the vectors
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
																		| -cos(a)cos(b)sin(c)-sin(a)cos(c)		-sin(a)cos(b)sin(c)+cos(a)cos(c)			sin(b)sin(c)				|
																		|		cos(a)sin(b)							sin(a)sin(b)									cos(b)						|
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
