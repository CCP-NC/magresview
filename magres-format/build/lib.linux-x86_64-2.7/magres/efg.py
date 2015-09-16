import numpy
import constants
import html_repr
from decorators import lazyproperty

class MagresAtomEfg(object):
  """
    Representation of the electric field gradient on a particular atom.
  """

  def __init__(self, atom, magres_efg):
    self.atom = atom
    self.magres_efg = magres_efg

  @lazyproperty
  def V(self):
    """
      The EFG V tensor in atomic units.
    """
    return numpy.array(self.magres_efg['V'])

  @lazyproperty
  def Cq(self):
    """
      The Cq of the V tensor.

      :math:`C_q = eV_{ZZ} Q / h`

      Where Q is the quadrupole moment of this particular species, e is the electron charge and h is Planck's constant.
    """
    try:
      return constants.efg_to_Cq_isotope(self.V, self.atom.species, self.atom.isotope)
    except KeyError:
      return 0.0

  @lazyproperty
  def eta(self):
    evals = self.evals

    return (evals[0] - evals[1])/evals[2]

  @lazyproperty
  def evalsvecs(self):
    """
      The eigenvalues and eigenvectors of V, ordered according to the Haeberlen convention:

      :math:`|V_{ZZ}| \geq |V_{XX}| \geq |V_{YY}|`
      
      where

        :math:`V_{XX}` = evals[0]

        :math:`V_{YY}` = evals[1]

        :math:`V_{ZZ}` = evals[2]
    """
    evals, evecs = numpy.linalg.eig(self.magres_efg['V'])

    se = zip(*sorted(zip(evals, evecs), key=lambda (x,y): abs(x)))

    return ([se[0][1], se[0][0], se[0][2]], [se[1][1], se[1][0], se[1][2]])

  @lazyproperty
  def evecs(self):
    """
      The eigenvectors of V, ordered according to the Haeberlen convention:

      :math:`|V_{ZZ}| \geq |V_{XX}| \geq |V_{YY}|`
      
      where

        :math:`V_{XX}` = evals[0]

        :math:`V_{YY}` = evals[1]

        :math:`V_{ZZ}` = evals[2]
    """
    return self.evalsvecs[1]
  
  @lazyproperty
  def evals(self):
    """
      The eigenvalues of V, ordered according to the Haeberlen convention:

      :math:`|V_{ZZ}| \geq |V_{XX}| \geq |V_{YY}|`
      
      where

        :math:`V_{XX}` = evals[0]

        :math:`V_{YY}` = evals[1]

        :math:`V_{ZZ}` = evals[2]
    """
    return self.evalsvecs[0]


  def _repr_html_(self):
    return html_repr.efg(self)

  def _repr_html_row_(self):
    return html_repr.efg_row(self)

  def _repr_html_row_head_(self):
    return html_repr.efg_row_head(self)
