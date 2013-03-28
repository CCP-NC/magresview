# simpson.py
# 
# by Simone Sturniolo
# 
# Simpson module for the json_to_sim.py script tool
#
#Copyright 2013 Science and Technology Facilities Council
#This software is distributed under the terms of the GNU General Public License (GNU GPL)
#Please refer to the file COPYING for the text of the license

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

	# Spinsys file is generated
	spinsys_file.write("spinsys {\n")
	
	# If not otherwise indicated, channel is the first spin
	
	main_chn = ""	# Main channel for the system
	
	if sim_options_str["-chn"] != "":
		for i in range(0, dataset['atomno']):
			if (str(dataset['atom_isos'][i]) + dataset['atom_elems'][i]) == sim_options_str["-chn"]:
				main_chn = str(dataset['atom_isos'][i]) + dataset['atom_elems'][i]
				break
		if main_chn == "":
			main_chn = str(dataset['atom_isos'][0]) + dataset['atom_elems'][0]
			print "Channel " + sim_options_str["-chn"] + " not present in system, using first element as default"			
	else:
		main_chn = str(dataset['atom_isos'][0]) + dataset['atom_elems'][0]
	
	spinsys_file.write(" channels\t" + main_chn + "\n")
	
	#Nuclei list
	spinsys_file.write(" nuclei\t")
	for i in range(0, dataset['atomno']):
		spinsys_file.write(str(dataset['atom_isos'][i]) + dataset['atom_elems'][i] + " ")
	spinsys_file.write("\n")
	
	#Chemical shifts
	for i in range(0, dataset['atomno']):
		ms = dataset['ms'][i]
		if ms != 0:
			spinsys_file.write(" shift\t" + str(i+1) + " " + str(ms[0]) + "p " + str(ms[1]) + "p " + str(ms[2]) + " " + str(ms[3]) + " " + str(ms[4]) + " " + str(ms[5]) + "\n")
	
	#Quadrupole interactions
	for i in range(0, dataset['atomno']):
		efg = dataset['efg'][i]
		if efg != 0:
			spinsys_file.write(" quadrupole\t" + str(i+1) + " 2 " + str(efg[0]) + " " + str(efg[1]) + " " + str(efg[2]) + " " + str(efg[3]) + " " + str(efg[4]) + "\n") #Standard is order 1. Possibly will include in options
		
	#Dipole interactions
	for i in range(0, dataset['atomno']):
		for j in range(0, i):
			dip = dataset['dip'][i][j]
			if dip != 0:
				spinsys_file.write(" dipole\t" + str(j+1) + " " + str(i+1) + " " + str(dip[0]/(2.0*math.pi)) + " " + str(dip[1]) + " " + str(dip[2]) + " " + str(dip[3]) + "\n")
				
	#J couplings
	for i in range(0, dataset['atomno']):
		for j in range(0, i):
			isc = dataset['isc'][i][j]
			if isc != 0:
				spinsys_file.write(" jcoupling\t" + str(j+1) + " " + str(i+1) + " " + str(isc[0]) + " " + str(isc[1]) + " " + str(isc[2]) + " " + str(isc[3]) + " " + str(isc[4]) + " " + str(isc[5]) + "\n")
	
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
	main_file.write(" puts \"Simulation of " + data_name + "_simps.in finished\"")
	main_file.write("}")
	
	main_file.flush()
	main_file.close()

	
	
