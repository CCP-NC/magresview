//MagresView 
//by Simone Sturniolo
//
//Copyright 2013 Science and Technology Facilities Council
//This software is distributed under the terms of the GNU General Public License (GNU GPL)
//Please refer to the file COPYING for the text of the license

//Periodic boundary conditions are applied by decomposing the vector v in its components along a, b and c and taking away their integer part.
//The decomposition is obtained by solving a system of three equations in three variables i, j, k - considering that v = ia+jb+kc.
//The solution is calculated with Cramer's rule

function periodic_bound(v, a, b, c)
{
			var det_abc = determinant_3([[a[0], b[0], c[0]],[a[1], b[1], c[1]],[a[2], b[2], c[2]]]);
			
			var ijk = [];
			
			ijk[0] = determinant_3([[v[0], b[0], c[0]],[v[1], b[1], c[1]],[v[2], b[2], c[2]]])/det_abc;
			ijk[1] = determinant_3([[a[0], v[0], c[0]],[a[1], v[1], c[1]],[a[2], v[2], c[2]]])/det_abc;
			ijk[2] = determinant_3([[a[0], b[0], v[0]],[a[1], b[1], v[1]],[a[2], b[2], v[2]]])/det_abc;
			
			for (var e = 0; e < 3; ++e)
			{
				ijk[e] = ijk[e]-Math.floor(ijk[e]);
			}
						
			v[0] = ijk[0]*a[0]+ijk[1]*b[0]+ijk[2]*c[0];
			v[1] = ijk[0]*a[1]+ijk[1]*b[1]+ijk[2]*c[1];
			v[2] = ijk[0]*a[2]+ijk[1]*b[2]+ijk[2]*c[2];
			
			return v;
} 
