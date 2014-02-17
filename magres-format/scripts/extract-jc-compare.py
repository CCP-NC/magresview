#!python

"""
  Only show couplings where the coupling in the opposite direction exists in another calculation.
"""

import os
import sys

from magres.format import BadVersion
from magres.atoms import MagresAtoms
from magres.utils import load_all_magres

cwd = "."

if len(sys.argv)>1:
    cwd = str(sys.argv[1])

#magres_files = find_all_magres(cwd)
#magres_atoms = []

#for magres_file in magres_files:
#  try:
#    magres_atoms.append(MagresAtoms.load_magres(magres_file))
#  except BadVersion:
#    print "Couldn't load %s" % magres_file

magres_atoms = load_all_magres(cwd)

if len(sys.argv) >= 4:
  find_s = str(sys.argv[2])
  find_i = int(sys.argv[3])
else:
  find_s = find_i = None

if len(sys.argv) >= 5 and sys.argv[4] != "X":
  find_s2 = str(sys.argv[4])
else:
  find_s2 = None

all_Js = {}

tensors = ['isc', 'isc_fc', 'isc_spin', 'isc_orbital_p', 'isc_orbital_d']

for atoms in magres_atoms:
  have_all_tensors = True
  for tensor in tensors:
    if not hasattr(atoms, tensor):
      print "# J-coupling %s not found" % (tensor,)
      have_all_tensors = False

  if not have_all_tensors:
    continue

  for tensor in tensors:
    for isc in getattr(atoms, tensor):
      if (find_s is None and find_i is None) or (isc.atom2.species == find_s and isc.atom2.index == find_i) or (isc.atom1.species == find_s and isc.atom1.index == find_i) and (find_s2 is None or isc.atom2.species == find_s2):

        idx = (isc.atom1.species,isc.atom1.index,isc.atom2.species,isc.atom2.index)
        if idx not in all_Js:
          all_Js[idx] = {}

        all_Js[idx][tensor] = isc

matching_Js = []

for (s1,i1,s2,i2),iscs in all_Js.items():
  if not (s2 == s1 and i2 == i1) and (s2,i2,s1,i1) in all_Js:
    matching_Js.append((s1,i1,s2,i2,iscs))

matching_Js = sorted(matching_Js, key=lambda (s1,i1,s2,i2,isc): sorted(((s1,i1),(s2,i2))))

print "#atm1\tatm2\t", "\t".join(tensors), "\tr"

for s1,i1,s2,i2,iscs in matching_Js:
  atom1 = iscs['isc'].atom1
  atom2 = iscs['isc'].atom2

  d = atom1.dist(atom2)

  J_isos = []
  K_isos = []
  for tensor in tensors:
    J_isos.append(iscs[tensor].J_iso)
    K_isos.append(iscs[tensor].K_iso)

  print "%s\t" % atom1 + "%s\t" % atom2 + "\t".join(["%.2f" % K_iso for K_iso in K_isos]) + "\t" + str(d)

