#!/usr/bin/python

# json_to_sim.py 1.1
# 
# by Simone Sturniolo
# 2013
# 
# This script comes bundled with the HTML tool for visualization of .magres CASTEP output files
# It can adapt the json data into different NMR simulation software input formats
# The formats supported for now are:
# - Simpson
# - SPINEVOLUTION
#
# Version 1.1 supports the new JSON output format of MagresView 1.0.5
#
#Copyright 2013 Science and Technology Facilities Council
#This software is distributed under the terms of the GNU General Public License (GNU GPL)
#Please refer to the file COPYING for the text of the license

# json is imported as it handles the interpretation of the data file

import sys
import json
#from magres.atoms import MagresAtoms
#from magres.format import MagresFile
#from jsonschema import ValidationError

from simpson import json_to_simpson
from spinev  import json_to_spinev

# The sim_options, sim_options_num and sim_options_str data will carry the relevant information about the command line options and their arguments
# The use of -help in this way is not really necessary and means that useless data is passed forward to other functions, but I chose it to keep the same standard for all option handling

sim_options = {
	
	"-fft":	False,
	
	"-pwd":	False,
	
	"-dat": False,
	
	"-ppm": False,
	
	"-help": False
}

sim_options_num = {
	
	"-dw":	0.1,
	
	"-np":	8192,
}

sim_options_str = {
	
	"-chn": ""
}

def json_to_sim(datafile, sim_options, sim_options_num, sim_options_str):
	
	# Opening the file and checking that the operation is successful
	
	try:
		in_file = open(datafile, 'r')
	except IOError:
		sys.stderr.write("File \'" + datafile + "\' not found.\nSkipping...\n")
		return False
	
	# Loading the data structure with json
	
	try:
		dataset = json.loads(in_file.read())
	except ValueError:
		sys.stderr.write("File \'" + datafile + "\' is corrupted or empty.\nSkipping...\n")
		return False
			
	data_name = datafile.split('.', 1)[0]
	in_file.close()

	# Load the json dataset into a MagresAtoms object and check its integrity
	
#	try:
#		loaded_file = MagresFile(dataset)
#	except ValidationError:
#		sys.stderr.write("File \'" + datafile + "\' is not a valid MagresFile format file.\nSkipping...\n")
#		return False
	
	# Processing. If the soft_targ key does not exist or is not recognizable, throw an error and skip the file
	
	if dataset.has_key('soft_targ') == False:
		sys.stderr.write("File \'" + datafile + "\' is corrupted. No software target identified.\nSkipping...\n")
		return False
	elif dataset['soft_targ'] == 'simpson':
		json_to_simpson(dataset, data_name, sim_options, sim_options_num, sim_options_str)
	elif dataset['soft_targ'] == 'spinev':
		json_to_spinev(dataset, data_name, sim_options, sim_options_num, sim_options_str)
	else:
		sys.stderr.write("File \'" + datafile + "\' has unknown software target.\nSkipping...\n")
		return False
		
	return True

def help_msg():
	
	print '''
	json_to_sim.py 1.0
	
	by Simone Sturniolo
	2013
	
	This script comes bundled with the HTML tool for visualization of .magres CASTEP output files
	It can adapt the json data into different NMR simulation software input formats
	The formats supported for now are:
	- Simpson
	- SPINEVOLUTION
	
	Syntax:
	python json_to_sim.py <options> <file list>
	
	Files must be in json format, as given as output by the HTML page, copypasted without changes into ASCII text files.
	Extension is irrelevant.
	List of allowed options:
	-fft : use Fast Fourier Transform at the end of the simulation, providing a spectrum instead of a FID signal. Irrelevant for Simpson simulations, as they automatically produce both anyway.
	-pwd : use powder average in simulation instead of a single crystallite. The default average set for both Simpson and SPINEVOLUTION is rep100.
	-dat : use .dat format instead of default native .spe/.fid format for Simpson output (plottable only with Simplot). Irrelevant for SPINEVOLUTION simulations
	-ppm : express the frequencies in spectra in ppm instead of kHz
	-dw <float>: use the chosen value for time between acquisition points, in microseconds. Default is 0.1.
	-np <int>:   use the chosen value for number of acquisition points. Default is 8192.
	-chn <isotope>: choose the main nucleus to observe. Default is the first nucleus in the system. <isotope> must be expressed in the form of nuclear mass + element symbol (e.g. 2H, 19F...)
	-help: show this help
	'''

# Main program: run the function json_to_sim for all data files received as input

if __name__ == "__main__":
	
	arg_list = sys.argv[1:]
	
	# Read the command line options, obligatorily before the input files
	
	while len(arg_list) > 0 and (sim_options.has_key(arg_list[0]) or sim_options_num.has_key(arg_list[0]) or sim_options_str.has_key(arg_list[0])):
		# If the option is only a boolean...
		if sim_options.has_key(arg_list[0]):
			sim_options[arg_list[0]] = True
			arg_list.pop(0)
			if sim_options["-help"] == True:
				help_msg()
				exit()
		# ...if it requires a numerical argument...
		elif sim_options_num.has_key(arg_list[0]):
			try:
				val = float(arg_list[1])
			except ValueError:
				sys.stderr.write("The option " + arg_list[0] + " requires a numerical argument. Skipping option...\n")
				arg_list.pop(0)
				continue
			sim_options_num[arg_list[0]] = val
			arg_list = arg_list[2:]
		# ...or a string argument.
		else:
			sim_options_str[arg_list[0]] = arg_list[1]
			arg_list = arg_list[2:]
	
	# Process the files
	
	if len(arg_list) <= 0:
		sys.exit("No input file; please supply at least one input file name\nFor a list of commands and a guide on how to use the script, type \"python json_to_sim.py -help\"")
	
	for datafile in arg_list:
		json_to_sim(datafile, sim_options, sim_options_num, sim_options_str)
	
	
