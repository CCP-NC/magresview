# simpson.py
# 
# by Simone Sturniolo
# 
# Simpson module for the json_to_sim.py script tool (version 1.1)
#
#Copyright 2013 Science and Technology Facilities Council
#This software is distributed under the terms of the GNU General Public License (GNU GPL)
#Please refer to the file COPYING for the text of the license

import sys
import math

def json_to_simpson(dataset, data_name, sim_options, sim_options_num, sim_options_str):	
	
	# Check that, if fft is on, np is a power of two as required by Simpson
	if sim_options["-fft"]:
		log2_np = math.log(sim_options_num["-np"], 2)
		if int(log2_np) != log2_np:
			print "Error - In order to perform a FFT, Simpson needs the number of acquisition points to be a power of 2"
			print "Replacing " + str(int(sim_options_num["-np"])) + " with " + str(int(pow(2, math.ceil(log2_np))))
			sim_options_num["-np"] = pow(2, math.ceil(log2_np))
	
	main_file = open(data_name + "_simps.in", 'w')
	spinsys_file = open(data_name + "_simps.spinsys", 'w')
	
	atoms = dataset['atoms']
	magres = dataset['magres']
	isotopes = atoms['isotopes']
	atomno = len(atoms['atom'])

	# Spinsys file is generated
	spinsys_file.write("spinsys {\n")
	
	# If not otherwise indicated, channel is the first spin
	
	main_chn = ""	# Main channel for the system
	
	if sim_options_str["-chn"] != "":
		for idn in isotopes:
			if ((str(isotopes[idn][0]) + isotopes[idn][1]) == sim_options_str["-chn"]):
				main_chn = (str(isotopes[idn][0]) + isotopes[idn][1])
				break
		if main_chn == "":
			main_chn = (str(isotopes[atoms['atom'][0]['id']][0]) + isotopes[atoms['atom'][0]['id']][1])
			print "Channel " + sim_options_str["-chn"] + " not present in system, using first element as default"			
	else:
		main_chn = (str(isotopes[atoms['atom'][0]['id']][0]) + isotopes[atoms['atom'][0]['id']][1])
		
	spinsys_file.write(" channels\t" + main_chn + "\n")
	
	atom_lookup = {}

	#Nuclei list
	spinsys_file.write(" nuclei\t")
	a_n = 1	#Arbitrary sequential atom number for internal purposes
	for a in atoms['atom']:
		spinsys_file.write(str(isotopes[a['id']][0]) + isotopes[a['id']][1] + " ")
		atom_lookup[a['id']] = {"index": a['index'], "label": a['label'], "n": a_n}
		a_n += 1
	spinsys_file.write("\n")
	
	#Chemical shifts
	if magres.has_key('ms'):
		for ms in magres['ms']:
			if ms.has_key('mview_data'):
				try:
					i = atom_lookup[ms['atom_id']]['n']
				except KeyError:
					#If the atom is not present in the system, skip
					sys.stderr.write("Warning - an interaction with no corresponding atom was found. File " + data_name + " might be corrupted.\n")
					continue
				spinsys_file.write(" shift\t" + str(i) + " " + str(-ms['mview_data'][0]) + "p " + str(-ms['mview_data'][1]) 
				+ "p " + str(ms['mview_data'][2]) + " " + str(ms['mview_data'][3]) + " " + str(ms['mview_data'][4]) + " " + str(ms['mview_data'][5]) + "\n")
	
	
	#Quadrupole interactions
	if magres.has_key('efg'):
		for efg in magres['efg']:
			if efg.has_key('mview_data'):
				try:
					i = atom_lookup[efg['atom_id']]['n']
				except KeyError:				
					sys.stderr.write("Warning - an interaction with no corresponding atom was found. File " + data_name + " might be corrupted.\n")
					continue
				#Skip null couplings
				if (efg['mview_data'][0] == 0.0):
					continue
				spinsys_file.write(" quadrupole\t" + str(i) + " 2 " + str(efg['mview_data'][0]) + " " + str(efg['mview_data'][1]) 
				+ " " + str(efg['mview_data'][2]) + " " + str(efg['mview_data'][3]) + " " + str(efg['mview_data'][4]) + "\n") #Standard is order 1. Possibly will include in options
	#Dipole interactions
	if magres.has_key('dip'):
		for dip in magres['dip']:
			if dip.has_key('mview_data'):
				try:
					i = atom_lookup[dip['atom1_id']]['n']
					j = atom_lookup[dip['atom2_id']]['n']
				except KeyError:
					sys.stderr.write("Warning - an interaction with no corresponding atom was found. File " + data_name + " might be corrupted.\n")
					continue
				spinsys_file.write(" dipole\t" + str(j) + " " + str(i) + " " + str(dip['mview_data'][0]/(2.0*math.pi))
				+ " " + str(dip['mview_data'][1]) + " " + str(dip['mview_data'][2]) + " " + str(dip['mview_data'][3]) + "\n")
					
	#J couplings
	if magres.has_key('isc'):
		for isc in magres['isc']:
			if isc.has_key('mview_data'):
				try:
					i = atom_lookup[isc['atom1_id']]['n']
					j = atom_lookup[isc['atom2_id']]['n']
				except KeyError:				
					sys.stderr.write("Warning - an interaction with no corresponding atom was found. File " + data_name + " might be corrupted.\n")
					continue				
				spinsys_file.write(" jcoupling\t" + str(j) + " " + str(i) + " " + str(isc['mview_data'][0]) + " " + str(isc['mview_data'][1]) 
				+ " " + str(isc['mview_data'][2]) + " " + str(isc['mview_data'][3]) + " " + str(isc['mview_data'][4]) + " " + str(isc['mview_data'][5]) + "\n")
	
	spinsys_file.write("}")
	spinsys_file.flush()
	spinsys_file.close()
	
	#Main file is generated

	#Inclusion of spinsys file
	main_file.write("source " + data_name + "_simps.spinsys\n\n")
	
	#Parameter section
	main_file.write("par {\n")
	main_file.write(" proton_frequency 500e6\n")
	main_file.write(" start_operator Inx\n")
	main_file.write(" detect_operator Inp\n")
	main_file.write(" np " + str(int(sim_options_num["-np"])) + "\n")
	if sim_options["-pwd"]:
		main_file.write(" crystal_file rep100\n")
	else:
		main_file.write(" crystal_file alpha0beta0\n")		
	main_file.write(" sw " + str(1e6/sim_options_num["-dw"]) + "\n")	#Dwell time, microseconds
	main_file.write("}\n\n")
	
	#Pulse sequence section - a standard pi/2 experiment
	main_file.write("proc pulseq {} {\n")
	main_file.write(" global par\n\n")
	main_file.write(" delay [expr 1e6/$par(sw)]\n")
	main_file.write(" store 1\n")
	main_file.write(" acq $par(np) 1\n")
	main_file.write("}\n\n")
	
	#Main section - saves FID and spectral data
	main_file.write("proc main {} {\n")
	main_file.write(" global par\n\n")
	main_file.write(" set f [fsimpson]\n")
	if not sim_options["-dat"]:											#Save in regular Simpson format
		main_file.write("fsave $f $par(name).fid\n")
		main_file.write("faddlb $f 30 0\n")
		main_file.write("fft $f\n")
		main_file.write("fsave $f $par(name).spe\n")
	else:																#Save with a time/frequency column
		main_file.write("fsave $f $par(name)_fid.dat -xreim\n")
		main_file.write("faddlb $f 30 0\n")
		main_file.write("fft $f\n")
		if sim_options["-ppm"]:
			main_file.write("fset $f -sw [expr $par(sw)/[resfreq " + main_chn + " $par(proton_frequency)]*1e6]\n")	#Conversion to ppm
		else:
			main_file.write("fset $f -sw [expr $par(sw)/1e3]\n")			#Conversion to kHz
		main_file.write("fsave $f $par(name)_spe.dat -xreim\n")
	main_file.write(" puts \"Simulation of " + data_name + "_simps.in finished\"\n")
	main_file.write("}")
	
	main_file.flush()
	main_file.close()	
	
