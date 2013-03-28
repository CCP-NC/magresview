# spinev.py
# 
# by Simone Sturniolo
# 
# SPINEVOLUTION module for the json_to_sim.py script tool
#
#Copyright 2013 Science and Technology Facilities Council
#This software is distributed under the terms of the GNU General Public License (GNU GPL)
#Please refer to the file COPYING for the text of the license

# Small function to print out data in a file

def arr_to_str(arr):
	o_str = ""
	for i in range(0, len(arr)):
		o_str += str(arr[i]) + " "
	
	return o_str

def json_to_spinev(dataset, data_name, sim_options, sim_options_num, sim_options_str):
	
	main_file = open(data_name + "_spinev", 'w')
	cor_file = open(data_name + "_spinev.cor", 'w')
	
	# Dipolar switchboard is generated only if there is more than one spin in the system
	if dataset['atomno'] > 1:
		dip_file = open(data_name + "_spinev.dip", 'w')
	else:
		dip_file = None
		
	# Isotropic and anisotropical chemical shift files are generated only if there is magnetic shielding data in the dataset
	flag_ms = False
	flag_ms_aniso = False
	for ms in dataset['ms']:
		if ms != 0:
			flag_ms = True
			if ms[1] != 0:
				flag_ms_aniso = True				
	
	if flag_ms:
		cs_file = open(data_name + "_spinev.cs", 'w')
		if flag_ms_aniso:
			csa_file = open(data_name + "_spinev.csa", 'w')
		else:
			csa_file = None
	else:
		cs_file = None
		csa_file = None
		
	del(flag_ms)
	del(flag_ms_aniso)
	
	# Same as above for quadrupolar constant file
	flag_efg = False
	for efg in dataset['efg']:
		if efg != 0:
			flag_efg = True
	
	if flag_efg:
		q_file = open(data_name + "_spinev.q", 'w')
	else:
		q_file = None
		
	del(flag_efg)

	# Same as above for J coupling file
	flag_isc = False
	for isc_row in dataset['isc']:
		for isc in isc_row:
			if isc != 0:
				flag_isc = True
	
	if flag_isc:
		j_file = open(data_name + "_spinev.j", 'w')
	else:
		j_file = None
		
	del(flag_isc)
	
	# Output coordinates file
	
	for i in range(0, dataset['atomno']):
		cor_file.write(arr_to_str(dataset['atom_coords'][i]))
		cor_file.write(dataset['atom_elems'][i] + str(i+1) + "\n")
	
	cor_file.flush()
	cor_file.close()

	# Output dipolar switchboard if present
	
	if dip_file != None:
		for i in range(0, dataset['atomno']):
			for j in range(0, i):
				if dataset['dip'][i][j] == 0:
					dip_file.write("0 ")
				else:
					dip_file.write("1 ")
			dip_file.write("*\n")
		dip_file.flush()
		dip_file.close()
	
	# Output isotropical and anisotropical chemical shift files if present
	
	if cs_file != None:
		for i in range(0, dataset['atomno']):
			if dataset['ms'][i] != 0:
				cs_file.write(str(dataset['ms'][i][0]) + "\t" + dataset['atom_elems'][i] + str(i+1) + "\n")
				if csa_file != None:
					csa_file.write(str(i+1) + " " + arr_to_str(dataset['ms'][i][1:]) + dataset['atom_elems'][i] + str(i+1) + "\n")
		cs_file.flush()
		cs_file.close()
		if csa_file != None:
			csa_file.flush()
			csa_file.close()		
	
	#Output quadrupolar constants file if present
	
	if q_file != None:
		for i in range(0, dataset['atomno']):
			if dataset['efg'][i] != 0 and dataset['efg'][i][0] != 0:
				q_file.write(str(i+1) + " " + str(dataset['efg'][i][0]/1000.0) + " " + arr_to_str(dataset['efg'][i][1:]) + dataset['atom_elems'][i] + str(i+1) + "\n") # Quadrupole constant is converted Hz -> kHz
		q_file.flush()
		q_file.close()
		
	# Output j-couplings file if present
	
	if j_file != None:
		for i in range(0, dataset['atomno']):
			for j in range(0, i):
				if dataset['isc'][i][j] != 0:
					j_file.write(str(j+1) + " " + str(i+1) + " " + arr_to_str(dataset['isc'][i][j]) + dataset['atom_elems'][i] + str(i+1) + "<-->" + dataset['atom_elems'][j] + str(j+1) + "\n")
		j_file.flush()
		j_file.close()
		

	# Output main file
	
	main_file.write("****** The System ***********************************\n")
	main_file.write("spectrometer(MHz)  500\n")
	main_file.write("spinning_freq(kHz) *\n")
	
	#Identify channels
	
	chn_list = []
	for i in range(0, dataset['atomno']):
		elem = dataset['atom_elems'][i]
		is_chn = False
		for chn in chn_list:
			if chn == elem:
				is_chn = True
		if is_chn == False:
			chn_list.append([elem, dataset['atom_isos'][i]])
	
	#If there is a preferred channel, identify it and put it at the first place
	
	if (sim_options_str["-chn"] != ""):
		dummy = ""
		for i in range(0, len(chn_list)):
			if (str(chn_list[i][1])+chn_list[i][0]) == sim_options_str["-chn"]:
				dummy = chn_list[0]
				chn_list[0] = chn_list[i]
				chn_list[i] = dummy
				break
		if dummy == "":
			print "Channel " + sim_options_str["-chn"] + " not present in system, using first element as default"
				
	#Write out channels
	
	main_file.write("channels           ")
	for chn in chn_list:
		 main_file.write(chn[0]+str(chn[1]) + "\t")
	main_file.write("\n")

	# Nuclei
	main_file.write("nuclei           ")
	for i in range(0, dataset['atomno']):
		main_file.write(dataset['atom_elems'][i]+str(dataset['atom_isos'][i])+" ")
	main_file.write("\n")
	main_file.write("atomic_coords      " + data_name + "_spinev.cor\n")
	if cs_file == None:
		main_file.write("cs_isotropic       *\n")
	else:
		main_file.write("cs_isotropic       " + data_name + "_spinev.cs ppm\n")
	if csa_file == None:
		main_file.write("csa_parameters     *\n")
	else:
		main_file.write("csa_parameters     " + data_name + "_spinev.csa ppm\n")
	if j_file == None:
		main_file.write("j_coupling         *\n")
	else:
		main_file.write("j_coupling         " + data_name + "_spinev.j\n")
	if q_file == None:
		main_file.write("quadrupole         *\n")
	else:
		main_file.write("quadrupole         " + data_name + "_spinev.q\n")
	if dip_file == None:
		main_file.write("dip_switchboard    *\n")		
	else:
		main_file.write("dip_switchboard    " + data_name + "_spinev.dip\n")
	main_file.write("csa_switchboard    *\n")
	main_file.write("exchange_nuclei    *\n")
	main_file.write("bond_len_nuclei    *\n")
	main_file.write("bond_ang_nuclei    *\n")
	main_file.write("tors_ang_nuclei    *\n")
	main_file.write("groups_nuclei      *\n")
	# The standard pulse sequence is a simple FID acquisition, 2.5 usec pi/2 along Y ideal pulse followed by 8192 acquisitions with 0.1 usec dwell time
	main_file.write("******* Pulse Sequence ******************************\n")
	for i in range(0, len(chn_list)):
		main_file.write("CHN " + str(i+1) + "\n")
		main_file.write("timing(usec)       2.5\'\t(" + str(sim_options_num["-dw"]) + ")" + (str(int(sim_options_num["-np"])) if i==0 else "") + "\n")	# Needed since the number of acquisition points must appear only in CHN 1
		main_file.write("power(kHz)         100\t0\n")
		main_file.write("phase(deg)         90\t0\n")
		main_file.write("freq_offs(kHz)     0\t0\n")
	# The only options used are the initial density matrix (all spins along Z) and the observed quantity (both X and Y components)
	main_file.write("******* Options **********\n")
	main_file.write("rho0               F1z\n")
	main_file.write("observables        F1p\n")
	if sim_options["-pwd"]:
		main_file.write("EulerAngles        rep100\n")
	else:
		main_file.write("EulerAngles        *\n")		
	main_file.write("n_gamma            *\n")
	main_file.write("line_broaden(Hz)   *\n")
	main_file.write("zerofill           *\n")
	if sim_options["-fft"]:
		main_file.write("FFT_dimensions     1"+ (" ppm" if sim_options["-ppm"] else "") + "\n")
	else:
		main_file.write("FFT_dimensions     *\n")
	main_file.write("options            *\n")
	
	main_file.flush()
	main_file.close()
