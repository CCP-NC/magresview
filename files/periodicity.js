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

// This algorithm returns the closest periodic distance for two points, given
// a vector and the eigenvalues of the lattice's R2 quadratic form matrix.
// This matrix is defined as the dot product of the cartesian lattice matrix
// by its transpose

/* The algorithm: 

    # The logic of this algorithm isn't obvious, so let's make it clearer.
    #
    # What we are basically looking for is the AABB bounding box of a sphere
    # in absolute space.
    # This becomes a rotated ellipsoid in fractional coordinates space.
    # r_matrix represents a quadratic form which turns a fractional coordinate
    # into a squared distance in space.
    # By diagonalizing it we can calculate the transformation matrix
    # which morphs a simple unit sphere into this ellipsoid through
    # scaling (with the eigenvalues) and rotating (with the eigenvectors).
    # We have thus that a point p in unit sphere space becomes q = M*p
    # in fractional space. On the other hand, a point q in fractional space
    # will be transformed into absolute space by p = M^-1*q.
    # Now, the boundaries of the ellipsoids are none other but the points
    # which, in regular space, have normals aligned with the axes.
    # And NORMALS transform between spaces with a matrix that is the
    # inverse transpose of the regular one. So the logic goes:
    # - take an axis direction in fractional space (for example, [1,0,0])
    # - transform it into absolute space by premultiplying (M^-1)^-1^T = M^T
    # - now that we have the direction of the normal in absolute space,
    # we just need to normalize it to find the point p which has that normal
    # (thanks to the properties of the unit sphere)
    # - then we transform back to fractional space with M and there you go,
    # that's your boundary point.
    # - wash, rinse, repeat for all axes directions.
    # Find the maxima in each direction and you've got your box.
    # After you have it, loop over it to find the closest periodic copy
    */

function qmatrix_from_latt(latt_cart) {
	// Assumes lattice parameters in the form contained by atom set
	rmat = mat3_product(transpose(latt_cart), latt_cart);
	r_diag = symm_matr_diag_card(rmat);

	inv_e = [	1.0/Math.sqrt(r_diag[0][0]),
				1.0/Math.sqrt(r_diag[0][1]),
				1.0/Math.sqrt(r_diag[0][2])];
	utransf_matrix = [[r_diag[1][0]*inv_e[0], r_diag[2][0]*inv_e[1], r_diag[3][0]*inv_e[2]], 
					  [r_diag[1][1]*inv_e[0], r_diag[2][1]*inv_e[1], r_diag[3][1]*inv_e[2]],
					  [r_diag[1][2]*inv_e[0], r_diag[2][2]*inv_e[1], r_diag[3][2]*inv_e[2]]];

	utransf_norm = [vec_scale(utransf_matrix[0], 1.0/vec_module(utransf_matrix[0])),
					vec_scale(utransf_matrix[1], 1.0/vec_module(utransf_matrix[1])),
					vec_scale(utransf_matrix[2], 1.0/vec_module(utransf_matrix[2]))];

	return mat3_product(transpose(utransf_norm), utransf_matrix);
}

function minimum_periodic_copy(v, latt_cart, qmatrix) {

	// v is a 3-vector
	// latt_cart and qmatrix are 3x3 matrices

	max_r = vec_module(v);

    // To find the boundaries, we need to iterate over the three main
   	// directions.
   	bounds = [0, 0, 0];
   	for (var i = 0; i < 3; ++i) {
	   	for (var j = 0; j < 3; ++j) {
	   		if (bounds[i] < Math.ceil(Math.abs(max_r*qmatrix[i][j])))
	   			bounds[i] = Math.ceil(Math.abs(max_r*qmatrix[i][j]));
	   	}
   	}

   	// Now to actually find the minimum distance
   	r_min = max_r;

   	for (var i = -bounds[0]; i < bounds[0]+1; ++i) {
   		var a = vec_scale(latt_cart[0], i);
	   	for (var j = -bounds[1]; j < bounds[1]+1; ++j) {
 	  		var b = vec_scale(latt_cart[1], j);
		   	for (var k = -bounds[2]; k < bounds[2]+1; ++k) {
	 	  		var c = vec_scale(latt_cart[2], k);
	 	  		var r = vec_module([v[0] + a[0] + b[0] + c[0],
	 	  				 			v[1] + a[1] + b[1] + c[1],
	 	  				 			v[2] + a[2] + b[2] + c[2]]);
	 	  		if (r < r_min)
	 	  			r_min = r;
		   	}	
	   	}   		
   	}

   	return r_min;
}


/*
def minimum_supcell(max_r, latt_cart=None, r_matrix=None):
    """
    Generate the bounds for a supercell containing a sphere
    of given radius, knowing the unit cell.

    | Args:
    |   max_r (float): radius of the sphere contained in the supercell
    |   latt_cart (np.ndarray): unit cell in cartesian form
    |   r_matrix (np.ndarray): matrix for the quadratic form returning
    |                          r^2 for this supercell.
    |                          Alternative to latt_cart, for a direct
    |                          space cell would be equal to
    |                          np.dot(latt_cart, latt_cart.T)

    | Returns:
    |   bounds (tuple[int]): bounds of the supercell to be built.
    |                        These are to be interpreted as the
    |                        thickness of the "shell" one has to build
    |                        around a core unit cell: for example (1,2,1)
    |                        means the supercell will be 3x5x3

    | Raises:
    |   ValueError: if some of the arguments are invalid

    """

    if latt_cart is not None:
        latt_cart = np.array(latt_cart, copy=False)
        if latt_cart.shape != (3, 3):
            raise ValueError("Invalid latt_cart passed to minimum_supcell")
        r_matrix = np.dot(latt_cart, latt_cart.T)
    elif r_matrix is not None:
        r_matrix = np.array(r_matrix, copy=False)
        if r_matrix.shape != (3, 3):
            raise ValueError("Invalid r_matrix passed to minimum_supcell")
    else:
        raise ValueError("One between latt_cart and r_matrix has to \
                          be present")


    r_evals, r_evecs = np.linalg.eigh(r_matrix)

    # Unit sphere - to - ellipsoid transformation matrix
    utransf_matrix = np.dot(r_evecs, np.diag(1.0/np.sqrt(r_evals)))
    # To find the boundaries, we need to iterate over the three main
    # directions. We do this implicitly though.
    qmatrix = np.dot(utransf_matrix,
                     max_r*(utransf_matrix/np.linalg.norm(utransf_matrix,
                            axis=1)[:, None]).T)
    r_bounds = np.max(np.ceil(abs(qmatrix)), axis=1).astype(int)

    return tuple(r_bounds)
    */