//MagresView 
//by Simone Sturniolo
//
//Copyright 2013 Science and Technology Facilities Council
//This software is distributed under the terms of the GNU General Public License (GNU GPL)
//Please refer to the file COPYING for the text of the license

//A collection of functions to operate with vectors and matrices

//Matrix transpose

function transpose(matrix)
{
	var r = matrix.length;
	var transp = new Array();
		
	if (r == 0)
		return null;
	for(var i = 0; i < r; ++i)
	{
		if(matrix[i].length != r)
			return null;
	}
	
	for(var i = 0; i < r; ++i)
	{
		transp[i] = new Array();
		for (var j = 0; j < r; ++j)
		{
			transp[i][j] = matrix[j][i];
		}
	}
	
	return transp;
}

//Matrix by vector product. The matrix is required to be square (it's not strictly necessary, but since we're dealing with rotation matrices...)

function vec_rotate(vector, matrix)
{
	var r = matrix.length;
	var ans = new Array();
	
	if (r == 0)
		return null;
	if (vector.length != r)
		return null;
	for(var i = 0; i < r; ++i)
	{
		if(matrix[i].length != r)
			return null;
	}
	
	for(var i = 0; i < r; ++i)
	{
		ans [i] = 0;
		for (var j = 0; j < r; ++j)
		{
			ans[i] += matrix[i][j]*vector[j];
		}
	}
	
	return ans;	
}

//Projection of a vector along a versor, assumed to have unitary modulus.

function vec_project(vector, versor)
{
	var mod = 0;
	var ans = Array();
	
	if (vector.length != versor.length)
		return null;
	
	for(var i = 0; i < vector.length; ++i)
	{
		mod += vector[i]*versor[i];
	}
	
	for(var i = 0; i < vector.length; ++i)
	{
		ans[i] = versor[i]*mod;
	}
	
	return ans;
}

//Module of a vector

function vec_module(vec)
{
	var ans = 0;
	
	for (var i=0; i< vec.length; ++i)
	{
		ans += vec[i]*vec[i];
	}
	
	return Math.sqrt(ans);
}

//Scalar product of two vectors

function vec_dotprod(vec1, vec2)
{
	var ans = 0;
	
	if((vec1.length != 3) || (vec2.length != 3))
		return null;
		
	ans += vec1[0]*vec2[0];
	ans += vec1[1]*vec2[1];
	ans += vec1[2]*vec2[2];
		
	return ans;	
}

//Vectorial product of two vectors

function vec_xprod(vec1, vec2)
{
	var ans = new Array();
	
	if((vec1.length != 3) || (vec2.length != 3))
		return null;
		
	ans[0] = vec1[1]*vec2[2]-vec1[2]*vec2[1];
	ans[1] = vec1[2]*vec2[0]-vec1[0]*vec2[2];
	ans[2] = vec1[0]*vec2[1]-vec1[1]*vec2[0];
	
	return ans;	
}

//Product of a vector by a scalar

function vec_scale(vector, factor)
{
	var ans = new Array();
	
	for (var i = 0; i < vector.length; ++i)
	{
		ans[i] = vector[i]*factor;
	}
	
	return ans;
}

//Checks if two vectors are linearly dependent from each other - needed for the diagonalization. If they are, returns the factor - otherwise return 0

function vec_linear_combo(vec1, vec2)
{
	if (vec1.length != vec2.length)
		return 0;
	
	var fac;
	
	for(var i=0; i < vec1.length; ++i)
	{
		if ((vec1[i] == 0) && (vec2[i] == 0))
		{
			continue;
		}
		else if (vec2[i] == 0)
		{
			return 0;
		}
		
		fac = vec1[i]/vec2[i];
	}

	for(var i=0; i < vec1.length; ++i)
	{
		if ((vec1[i] == 0) && (vec2[i] == 0))
			continue;
		if (vec1[i]/vec2[i] != fac)
			return 0;
	}
	
	return fac;
}

//Diagonalization of a 3x3 symmetric (or Hermitian) matrix using Cardano's analytical formula
//(as it appears in Joachim Kopp - "Efficient numerical diagonalization of hermitian 3 × 3 matrices"
//arXiv:physics/0610206v3[physics.comp-ph] 4 Jul 2008)
//Accepts a matrix as an argument, produces four arrays of three elements, the first containing the eigenvalues,
//the other three being the eigenvectors

function symm_matr_diag_card(matrix)
{	
	if (matrix.length != 3)
		return null;
			
	for (var i = 0; i < 3; ++i)
	{
		if (matrix[i].length != 3)
			return null;
	}
	
	var ans = new Array();
	ans[0] = new Array();
	
	var to_calc = 3; //Number of eigenvalues still to calculate. Will lower if it turns out the matrix is already partly diagonalized
	var to_diag = new Array(); //Because the matrix might be altered in the process
	to_diag[0] = matrix[0].slice(0); //This is a quick way to copy the arrays by value rather than by reference
	to_diag[1] = matrix[1].slice(0);
	to_diag[2] = matrix[2].slice(0);
	
	//Look for trivial eigenvalues
	for (var i = 0; i < 3; ++i)
	{
		var is_trivial = true;
		
		for (var j = 0; j < 3; ++j)
		{
			if (i != j)
			{	
				is_trivial &= (matrix[i][j] == 0);
				is_trivial &= (matrix[j][i] == 0);
			}
		}
		
		//If that is the case, pop out the incriminated columns and rows from to_diag
		if (is_trivial == true)
		{
			//Save eigenvalue and eigenvector

			ans[0][3-to_calc] = matrix[i][i];
			ans[4-to_calc] = [0, 0, 0];
			ans[4-to_calc][i] = 1.0; 						
			
			//Reduce the matrix to diagonalize
			
			if (to_calc == 3)
			{
				for (var j = 0; j < to_diag.length; ++j)
				{
					if (i != j)
					{
						to_diag[j].splice(i, 1);
					}
				}
				to_diag.splice(i, 1);
			}
			else
			{
				ans[0][2] = matrix[i+1][i+1];
				ans[3] = [0, 0, 0];
				ans[3][i+1] = 1.0;
				to_calc = 0;
				break;
			}
			//Keep count
			--to_calc;
		}
	}
	
	//At this point, which path one has to follow depends on to_calc. If it's to_calc == 0 we're over. Otherwise it can be 2 or 3
	
	if (to_calc == 2)
	{
		a = 1;
		b = -(to_diag[0][0]+to_diag[1][1]);
		c = to_diag[0][0]*to_diag[1][1]-to_diag[0][1]*to_diag[0][1];
		
		delta = b*b-4*a*c;
		
		if (delta < 0)
			return null;
			
		//Eigenvalues
		ans[0][1] = (-b + Math.sqrt(delta))/(2*a);
		ans[0][2] = (-b - Math.sqrt(delta))/(2*a);
		
		//Calculating eigenvectors
		
		var eigvec1 = new Array();
		var eigvec2 = new Array();
		
		eigvec1[1] = Math.sqrt((to_diag[0][0]-ans[0][1])*(to_diag[0][0]-ans[0][1])/((to_diag[0][0]-ans[0][1])*(to_diag[0][0]-ans[0][1])+to_diag[0][1]*to_diag[0][1]));
		eigvec1[0] = -to_diag[0][1]/(to_diag[0][0]-ans[0][1])*eigvec1[1];
		eigvec2[1] = Math.sqrt((to_diag[0][0]-ans[0][2])*(to_diag[0][0]-ans[0][2])/((to_diag[0][0]-ans[0][2])*(to_diag[0][0]-ans[0][2])+to_diag[0][1]*to_diag[0][1]));
		eigvec2[0] = -to_diag[0][1]/(to_diag[0][0]-ans[0][2])*eigvec2[1];
		
		for (var i = 0; i < 3; ++i)
		{
			if (ans[1][i] == 1)
			{
				eigvec1.splice(i, 0, 0.0);
				eigvec2.splice(i, 0, 0.0);
			}
		}
		
		ans[2] = eigvec1;
		ans[3] = eigvec2;
		
	}
	
	if (to_calc == 3)															//The most difficult case. Use Cardan's formula
	{
		//Calculate the cohefficients of the characteristic polynomial
		var c_2 = -to_diag[0][0]-to_diag[1][1]-to_diag[2][2];
		var c_1 = to_diag[0][0]*to_diag[1][1] + to_diag[0][0]*to_diag[2][2] + to_diag[1][1]*to_diag[2][2] - to_diag[0][1]*to_diag[0][1] - to_diag[0][2]*to_diag[0][2] - to_diag[1][2]*to_diag[1][2];
		var c_0 = to_diag[0][0]*to_diag[1][2]*to_diag[1][2] + to_diag[1][1]*to_diag[0][2]*to_diag[0][2] + to_diag[2][2]*to_diag[0][1]*to_diag[0][1] - to_diag[0][0]*to_diag[1][1]*to_diag[2][2] - 2*(to_diag[0][2]*to_diag[0][1]*to_diag[1][2]);
		
		//Calculate p and q
		var p = c_2*c_2-3*c_1;
		var q = -27/2*c_0-c_2*c_2*c_2+9/2*c_2*c_1;
		
		
		//Calculate phi and its trigonometric functions
		var phi = 1/3*Math.atan2(Math.sqrt(27*(0.25*c_1*c_1*(p-c_1)+c_0*(q+27/4*c_0))),q);
		var cosphi = Math.cos(phi);
		var sinphi = Math.sin(phi);
			
		//Calculate ex_i
		var ex = new Array();
		ex[0] = 2*cosphi;
		ex[1] = -cosphi-Math.sqrt(3)*sinphi;
		ex[2] = -cosphi+Math.sqrt(3)*sinphi;
		
		//Calculate eigenvalues
		for(var i=0; i < 3; ++i)
			ans[0][i] = Math.sqrt(p)/3*ex[i]-c_2/3;
	
		//Order the values from more positive to more negative
		
		for (var i = 0; i < 2; ++i)
		{
			for (var j = i+1; j < 3; ++j)
			{
				if(ans[0][j] > ans[0][i])
				{
					var dummy = ans[0][i];
					ans[0][i] = ans[0][j];
					ans[0][j] = dummy;
				}
			}
		}
	 
		//Calculating eigenvectors
		var a_Col1 = new Array();
		var a_Col2 = new Array();
		
		//Eigenvector 1
		//The eigenvectors are obtained by vector product of the column vectors of the matrix to which one of the eigenvalues multiplied by a base vector has been subtracted:
		//see the paper cited above for details
		
		a_Col1[0] = to_diag[0][0]-ans[0][0]; a_Col1[1] = to_diag[1][0]; 				a_Col1[2] = to_diag[2][0];
		a_Col2[0] = to_diag[0][1];				a_Col2[1] = to_diag[1][1]-ans[0][0];	a_Col2[2] = to_diag[2][1];
		
		//Check if the two vectors are linearly dependent - if they are, use a quick method
		mu = vec_linear_combo(a_Col1, a_Col2);
		
		if (mu == 0)
		{
			ans[1] = vec_xprod(a_Col1, a_Col2);
			//Normalize
			ans[1] = vec_scale(ans[1], 1/Math.sqrt(ans[1][0]*ans[1][0] + ans[1][1]*ans[1][1] + ans[1][2]*ans[1][2]));
		}
		else
		{
			ans[1] = [1/Math.sqrt(1+mu*mu), -mu/Math.sqrt(1+mu*mu), 0];
		}
		
		//Eigenvector 2
		if(ans[0][1] == ans[0][0]) //Degenerate case
		{
			for (var i=0; i < 3; ++i)
			{
				a_Col1[0] = to_diag[0][i];	a_Col1[1] = to_diag[1][i]; a_Col1[2] = to_diag[2][i];
				a_Col1[i] -= ans[0][0];
				if (!vec_linear_combo(a_Col1, ans[1]))
					break;
			}
			
			ans[2] = vec_xprod(a_Col1, ans[1]);
					
			//Normalize
			ans[2] = vec_scale(ans[2], 1/Math.sqrt(ans[2][0]*ans[2][0] + ans[2][1]*ans[2][1] + ans[2][2]*ans[2][2]));
		}
		else
		{	
			a_Col1[0] = to_diag[0][0]-ans[0][1]; a_Col1[1] = to_diag[1][0]; 				a_Col1[2] = to_diag[2][0];
			a_Col2[0] = to_diag[0][1];				a_Col2[1] = to_diag[1][1]-ans[0][1];	a_Col2[2] = to_diag[2][1];
		
			//Check if the two vectors are linearly dependent - if they are, use a quick method
			mu = vec_linear_combo(a_Col1, a_Col2); 
			if (mu == 0)
			{
				ans[2] = vec_xprod(a_Col1, a_Col2);
				//Normalize
				ans[2] = vec_scale(ans[2], 1/Math.sqrt(ans[2][0]*ans[2][0] + ans[2][1]*ans[2][1] + ans[2][2]*ans[2][2]));
			}
			else
			{
				ans[2] = [1/Math.sqrt(1+mu*mu), -mu/Math.sqrt(1+mu*mu), 0];
			}
		}
		
		//Eigenvector 3
		if(ans[0][2] == ans[0][0])
		{
			for (var i=0; i < 3; ++i)
			{
				a_Col1[0] = to_diag[0][i];	a_Col1[1] = to_diag[1][i]; a_Col1[2] = to_diag[2][i];
				a_Col1[i] -= ans[0][0];
				if (!vec_linear_combo(a_Col1, ans[1]))
					break;
			}
	
			ans[3] = vec_xprod(a_Col1, ans[1]);		
		}
		else if (ans[0][2] == ans[0][1])
		{
			for (var i=0; i < 3; ++i)
			{
				a_Col1[0] = to_diag[0][i];	a_Col1[1] = to_diag[1][i]; a_Col1[2] = to_diag[2][i];
				a_Col1[i] -= ans[0][1];
				if (!vec_linear_combo(a_Col1, ans[2]))
					break;
			}
			ans[3] = vec_xprod(a_Col1, ans[2]);		
		}
		else
		{
			ans[3] = vec_xprod(ans[1], ans[2]);
		}
		
		//Normalize
		ans[3] = vec_scale(ans[3], 1/Math.sqrt(ans[3][0]*ans[3][0] + ans[3][1]*ans[3][1] + ans[3][2]*ans[3][2]));
	}
	
	//Check that the set constitutes a proper right-handed set; if not, change sign to the third axis
	var right_hand = vec_xprod(ans[1], ans[2]);
	if (vec_dotprod(right_hand, ans[3]) < 0.0)
	{
		ans[3] = vec_scale(ans[3], -1.0);
	}
	
	return ans;	
}

//This function splits a tensor in two: symmetric+antisymmetric

function symm_antisymm(matrix)
{
	var ans = new Array()
	var symm = new Array()
	var antsymm = new Array()
	var r = matrix.length;

	for (var i = 0; i < r; ++i)
	{
		if (matrix[i].length != r)
			return null;
		symm[i] = new Array();
		antsymm[i] = new Array();
	}
	
	for (var i = 0; i < r; ++i)
	{
		for (var j = 0; j <= i; ++j)
		{
			if (i == j)
			{
				symm[i][j] = matrix[i][j];
				antsymm[i][j] = 0;
			}
			else
			{
				symm[i][j] = (matrix[i][j]+matrix[j][i])/2;
				symm[j][i] = symm[i][j];
				antsymm[i][j] = (matrix[i][j]-matrix[j][i])/2;
				antsymm[j][i] = -antsymm[i][j];
			}
		}
	}
	
	ans[0] = symm;
	ans[1] = antsymm;
	
	return ans;	
}

//Given a set of three eigenvalues, expresses them in form of isotropic component, anisotropy, and asymmetry, following the Haeberlen convention.
//It also orders the passed array using the same convention

function haeberlen_and_order(diag)
{
	var ans = new Array();
	var dummy = 0;
	var dummy_arr = new Array();
	
	if(diag.length != 4)
		return null;
	 
	if(diag[0].length != 3)
		return null;

	//Calculate isotropic component
	ans[0] = (diag[0][0] + diag[0][1] + diag[0][2])/3;
	
	//Reorder the array following Haeberlen convention
	
	for(var i = 0; i < 2; ++i)
	{
		for(var j = i+1; j < 3; ++j)
		{
			if(Math.abs(diag[0][j]-ans[0]) < Math.abs(diag[0][i]-ans[0]))
			{
				dummy = diag[0][i];
				diag[0][i] = diag[0][j];
				diag[0][j] = dummy;
				dummy_arr = diag[i+1];
				diag[i+1] = diag[j+1];
				diag[j+1] = dummy_arr;	
			}
		} 
	}
	
	dummy = diag[0][1];
	diag[0][1] = diag[0][0];
	diag[0][0] = dummy;
	dummy_arr = diag[2];
	diag[2] = diag[1];
	diag[1] = dummy_arr;			
	
	//Calculate anisotropy
	
	ans[1] = diag[0][2] - (diag[0][0]+diag[0][1])/2;
	
	//Calculate asymmetry
	
	if (ans[1] != 0)
	{
		ans[2] = (diag[0][1]-diag[0][0])/(diag[0][2]-ans[0]);
	}
	else
	{
		ans[2] = 0
	}
	
	//Check that, even after the reordering, the eigenvector set constitutes a proper right-handed set; if not, change sign of all axes
	var right_hand = vec_xprod(diag[1], diag[2]);
	if (vec_dotprod(right_hand, diag[3]) < 0.0)
	{
		diag[1] = vec_scale(diag[1], -1.0);
		diag[2] = vec_scale(diag[2], -1.0);
		diag[3] = vec_scale(diag[3], -1.0);
	}
	
	return ans;
}

//Determinant of a 3x3 matrix

function determinant_3(m)
{
	return m[0][0]*m[1][1]*m[2][2]+m[0][1]*m[1][2]*m[2][0]+m[0][2]*m[1][0]*m[2][1]-(m[0][0]*m[1][2]*m[2][1]+m[0][1]*m[1][0]*m[2][2]+m[0][2]*m[1][1]*m[2][0]);
}	





