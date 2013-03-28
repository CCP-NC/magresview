import re
import json

try:
  import numpy
except:
  numpy = None

import sys

blocks_re = re.compile(r"<(?P<block_name>.*?)>(.*?)\</(?P=block_name)>", re.M | re.S)

if numpy is not None:
  def tensor33(x):
    return numpy.mat(numpy.reshape(x, (3,3))).tolist()
  def tensor31(x):
    return numpy.mat(numpy.reshape(x, (3,1))).tolist()
else:
  def tensor33(x):
    return [x[0:3], x[3:6], x[6:]] 
  
  def tensor31(x):
    return x

class BadVersion(Exception):
  pass

class BadMagresFile(Exception):
  pass

class BadUnits(Exception):
  pass

def get_version(file_contents):
  """
    Look for and parse the magres file format version line
  """

  lines = file_contents.split('\n')
  match = re.match("\#\$magres-abinitio-v([0-9]+).([0-9]+)", lines[0])

  if match:
    version = match.groups()
    version = tuple(map(int, version))
  else:
    version = None

  return version

def parse_blocks(file_contents):
  """
    Parse series of XML-like deliminated blocks into a list of (block_name, contents) tuples
  """

  blocks = blocks_re.findall(file_contents)

  return blocks

def parse_block(block):
  """
    Parse block contents into a series of (tag, data) records
  """

  def clean_line(line):
    # Remove comments and whitespace at start and ends of line
    line = re.sub('#(.*?)\n', '', line)
    line = line.strip()

    return line

  name, data = block

  lines = [clean_line(line) for line in data.split('\n')]

  records = []

  for line in lines:
    xs = line.split()

    if not xs:
      continue

    tag = xs[0]
    data = xs[1:]
    
    records.append((tag, data))

  return (name, records)

def check_units(d):
  """
    Verify that given units for a particular tag are correct.
  """

  allowed_units = {'lattice': 'Angstrom',
                   'atom': 'Angstrom',
                   'ms': 'ppm',
                   'efg': 'au',
                   'efg_local': 'au',
                   'efg_nonlocal': 'au',
                   'isc': '10^19.T^2.J^-1',
                   'isc_fc': '10^19.T^2.J^-1',
                   'isc_orbital_p': '10^19.T^2.J^-1',
                   'isc_orbital_d': '10^19.T^2.J^-1',
                   'isc_spin': '10^19.T^2.J^-1',
                   'isc': '10^19.T^2.J^-1',
                   'sus': '10^-6.cm^3.mol^-1',
                   'calc_cutoffenergy': 'Hartree',}

  if d[0] in d and d[1] == allowed_units[d[0]]:
    pass
  else:
    raise BadUnits("Unrecognized units: %s %s" % (d[0], d[1]))
  
  return d

def parse_magres_block(block):
  """
    Parse magres block into data dictionary given list of record tuples.
  """

  name, records = block

  # Atom label, atom index and 3x3 tensor
  def sitensor33(d):
     return (data[0], int(data[1]), tensor33(map(float, data[2:])))
  
  # 2x(Atom label, atom index) and 3x3 tensor
  def sisitensor33(d):
     return (data[0], int(data[1]), data[2], int(data[3]), tensor33(map(float, data[4:])))
    
  tags = {'ms': sitensor33,
          'efg': sitensor33,
          'efg_local': sitensor33, 'efg_nonlocal': sitensor33,
          'isc': sisitensor33,
          'isc_fc': sisitensor33, 'isc_spin': sisitensor33, 'isc_orbital_p': sisitensor33, 'isc_orbital_d': sisitensor33,
          'units': check_units}

  data_dict = {}

  for record in records:
    tag, data = record

    if tag not in data_dict:
      data_dict[tag] = []

    data_dict[tag].append(tags[tag](data))

  return data_dict

def write_units(data, out):
  if 'units' in data:
    for tag, units in data['units']:
      out.append("  units %s %s" % (tag, units))

def tensor_string(tensor):
  return " ".join([" ".join(map(str, xs)) for xs in tensor])

def write_magres_block(data):
  """
    Write out a <magres> block from its dictionary representation
  """

  out = []

  def siout(tag):
    if tag in data:
      for s, i, tensor in data[tag]:
        out.append("  %s %s %d %s" % (tag, s, i,tensor_string(tensor)))

  write_units(data, out)

  siout('ms')

  siout('efg_local')
  siout('efg_nonlocal')
  siout('efg')

  def sisiout(tag):
    if tag in data:
      for s1, i1, s2, i2, tensor in data[tag]:
        out.append("  %s %s %d %s %d %s" % (tag, s1, i1, s2, i2, tensor_string(tensor)))

  sisiout("isc_fc")
  sisiout("isc_orbital_p")
  sisiout("isc_orbital_d")
  sisiout("isc_spin")
  sisiout("isc")

  return "\n".join(out)

def parse_atoms_block(block):
  """
    Parse atoms block into data dictionary given list of record tuples.
  """

  name, records = block

  # Lattice record: a1, a2 a3, b1, b2, b3, c1, c2 c3
  def lattice(d):
    return tensor33(map(float, data))

  # Atom record: label, index, x, y, z
  def atom(d):
    return (data[0], data[1], int(data[2]), tensor31(map(float, data[3:])))

  def symmetry(d):
    return " ".join(data)

  tags = {'lattice': lattice,
          'atom': atom,
          'units': check_units,
          'symmetry': symmetry}
  
  data_dict = {}

  for record in records:
    tag, data = record

    if tag not in data_dict:
      data_dict[tag] = []

    data_dict[tag].append(tags[tag](data))

  return data_dict

def write_atoms_block(data):
  out = []

  write_units(data, out)

  if 'lattice' in data:
    for lat in data['lattice']:
      out.append("  lattice %s" % tensor_string(lat))
  
  if 'symmetry' in data:
    for sym in data['symmetry']:
      out.append("  symmetry %s" % sym)

  if 'atom' in data:
    for s, l, i, p in data['atom']:
      out.append("  atom %s %s %s %s" % (s, l, i, " ".join(map(str, p[0]))))

  return "\n".join(out)

def parse_generic_block(block):
  """
    Parse any other block into data dictionary given list of record tuples.
  """

  name, records = block
  
  data_dict = {}

  for record in records:
    tag, data = record

    if tag not in data_dict:
      data_dict[tag] = []

    data_dict[tag].append(data)

  return data_dict

def write_generic_block(data):
  out = []

  for tag, data in data.items():
    for value in data:
      out.append("%s %s" % (tag, " ".join(map(str, value))))

  return "\n".join(out)

class MagresFile(object):
  block_parsers = {'magres': parse_magres_block,
                   'atoms': parse_atoms_block,
                   'calculation': parse_generic_block,}


  block_writers = {'magres': write_magres_block,
                   'atoms': write_atoms_block,
                   'calculation': write_generic_block,}

  version = (1,0)

  def __init__(self, data=None):
    if data is not None:
      self.parse(data)

  def parse(self, data, clean=True, include_unrecognised=False):
    if type(data) == str:
      try:
        file_contents = open(data).read()
      except:
        file_contents = data
    else:
      try:
        file_contents = data.read()
      except:
        raise BadMagresFile("Can't load given magres file")
    
    version = get_version(file_contents)

    if version is None:
      pass # Emit a warning?
    else:
      if version[0] != self.version[0]: # this is a major version 1 parser
        raise BadVersion("Version %d.%d not recognised. This is a version 1.x parser" % version)

    self.blocks = parse_blocks(file_contents)

    if clean or not hasattr(self, 'data_dict'):
      self.data_dict = {}

    for block_data in self.blocks:
      block = parse_block(block_data)

      if block[0] in self.block_parsers:
        data_dict = self.block_parsers[block[0]](block)
        self.data_dict[block[0]] = data_dict
      else:
        #print "Block type \"%s\" not recognised" % block[0]

        # Throw in the text content of blocks we don't recognise
        if include_unrecognised:
          self.data_dict[block[0]] = block_data[1]

  def load_json(self, json_string):
    """
      Load from a json dictionary
    """

    self.data_dict = json.loads(json_string)

  def as_json(self):
    """
      Dump as a json dictionary for easy storage/transmission
    """

    return json.dumps(self.data_dict)

  def __str__(self):
    """
      Convert the internal data dictionary representation to a magres-abinitio format file
    """

    out = []

    out.append("#$magres-abinitio-v%d.%d" % self.version)
    out.append("# Generated by format.py. For format definition and code samples see http://www.ccpnc.ac.uk/pmwiki.php/CCPNC/Fileformat")

    # Order of the blocks, lower weights are higher up. Default weight is 0.
    order = {'calculation': -2,
             'atoms': -1,}

    for block_type in sorted(self.data_dict, key=lambda x: order.get(x,0)):
      data = self.data_dict[block_type]

      textout = self.block_writers[block_type](data)

      out.append("<%s>\n" % block_type + textout + "\n</%s>" % block_type)

    return "\n".join(out)


if __name__ == "__main__":
  f = open(sys.argv[1])

  magres_file = MagresFile(f)

  # Convert it to json and back again for giggles
  magres_file.load_json(magres_file.as_json())

  print magres_file

