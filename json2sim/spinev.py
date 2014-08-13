# spinev.py
# 
# by Simone Sturniolo
# 
# SPINEVOLUTION module for the json_to_sim.py script tool (version 1.1)
#
#Copyright 2013 Science and Technology Facilities Council
#This software is distributed under the terms of the GNU General Public License (GNU GPL)
#Please refer to the file COPYING for the text of the license

import sys

# Small function to print out data in a file

def arr_to_str(arr):
    o_str = ""
    for i in range(0, len(arr)):
        o_str += str(arr[i]) + " "
    
    return o_str

def json_to_spinev(dataset, path_and_name, sim_options, sim_options_num, sim_options_str):
    
    data_path = path_and_name[0]
    data_name = path_and_name[1]
    
    main_file = open(data_name + "_spinev", 'w')
    cor_file = open(data_name + "_spinev.cor", 'w')
    
    atoms = dataset['atoms']
    magres = dataset['magres']
    isotopes = atoms['isotopes']
    atomno = len(atoms['atom'])
    
    # Check that the file is not empty - if it is, just quit

    if atomno <= 0:
        sys.exit("Error - the selected input file has no atom information!")
    
    # Dipolar switchboard is generated only if there is more than one spin in the system
    if atomno > 1:
        dip_file = open(data_name + "_spinev.dip", 'w')
    else:
        dip_file = None
        
    # Isotropic and anisotropical chemical shift files are generated only if there is magnetic shielding data in the dataset
    flag_ms = False
    flag_ms_aniso = False
    
    if magres.has_key('ms'):
        for ms in magres['ms']:
            if ms.has_key('mview_data'):
                if not flag_ms and ms['mview_data'][0] != 0:
                    flag_ms = True
                    if not flag_ms_aniso and ms['mview_data'][1] != 0:
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
    
    if magres.has_key('efg'):
        for efg in magres['efg']:
            if efg.has_key('mview_data'):
                if not flag_efg and efg['mview_data'][0] != 0.0:
                    flag_efg = True
    
    if flag_efg:
        q_file = open(data_name + "_spinev.q", 'w')
    else:
        q_file = None
        
    del(flag_efg)

    # Same as above for J coupling file
    flag_isc = False
    
    if magres.has_key('isc'):
        for isc in magres['isc']:
            if isc.has_key('mview_data'):
                if not flag_isc:
                    flag_isc = True
    
    if flag_isc:
        j_file = open(data_name + "_spinev.j", 'w')
    else:
        j_file = None
        
    del(flag_isc)
    
    # Output coordinates file and create a lookup table of indices in the 'atom' array for further quick reference 
    atom_lookup = {}
    
    for i in range(0, atomno):
        a = atoms['atom'][i]
        if not atom_lookup.has_key(a['id']):
            atom_lookup[a['id']] = i+1
        cor_file.write(arr_to_str(a['position']))
        cor_file.write("\t" + a['label'] + "\t" + str(i+1) + "\t#" + a['id'] + "\n")        
    
    cor_file.flush()
    cor_file.close()
        
    # Output dipolar switchboard if present
    
    if dip_file != None:
        dip_switch = [[]]*(atomno-1)
        for i in range(0, atomno-1):
            dip_switch[i] = [0]*(i+1)

        if magres.has_key('dip'):
            for dip in magres['dip']:
                if dip.has_key('mview_data'):
                    if dip['mview_data'][0] != 0:
                        a1 = dip['atom1_id']
                        a2 = dip['atom2_id']
                        i = atom_lookup[a1]
                        j = atom_lookup[a2]
                        if j > i:
                            dummy_a = a2
                            dummy = j
                            j = i
                            a2 = a1
                            i = dummy
                            a1 = dummy_a
                        elif j == i:
                            continue
                        dip_switch[i-2][j-1] = 1
        
        for i in range(0, atomno-1):
            for j in range(0, i+1):
                dip_file.write(str(dip_switch[i][j]) + " ")
            dip_file.write("*\n")
        dip_file.flush()
        dip_file.close()
    
    # Output isotropical and anisotropical chemical shift files if present
    
    if cs_file != None:
        for ms in magres['ms']:
            if ms.has_key('mview_data'):
                a = ms['atom_id']
                i = atom_lookup[a]
                cs_file.write(str(ms['mview_data'][0]) + "\t#" + str(i) + "\n")     
                if csa_file != None:
                    csa_file.write(str(i) + " " + str(ms['mview_data'][1]) + " " + arr_to_str(ms['mview_data'][2:]) + "\t#" + str(i) + "\n")                    
        cs_file.flush()
        cs_file.close()
        if csa_file != None:
            csa_file.flush()
            csa_file.close()        
    
    #Output quadrupolar constants file if present
    
    if q_file != None:
        for efg in magres['efg']:
            if (efg.has_key('mview_data') and efg['mview_data'][0] != 0.0):
                a = efg['atom_id']
                i = atom_lookup[a]
                q_file.write(str(i) + " " + str(efg['mview_data'][0]/1000.0) + " " + arr_to_str(efg['mview_data'][1:]) + "\t#" + str(i) + "\n") # Quadrupole constant is converted Hz -> kHz
        q_file.flush()
        q_file.close()
        
    # Output j-couplings file if present
    
    if j_file != None:
        for isc in magres['isc']:
            if isc.has_key('mview_data'):
                a1 = isc['atom1_id']
                a2 = isc['atom2_id']
                i = atom_lookup[a1]
                j = atom_lookup[a2]
                if j > i:
                    dummy_a = a2
                    dummy = j
                    j = i
                    a2 = a1
                    i = dummy
                    a1 = dummy_a
                elif j == i:
                    continue
                j_file.write(str(j) + " " + str(i) + " " + arr_to_str(isc['mview_data']) + "\t#" + str(i) + "<-->" + "\t#" + str(j) + "\n")
        j_file.flush()
        j_file.close()
        

    # Output main file
    
    main_file.write("****** The System ***********************************\n")
    main_file.write("spectrometer(MHz)  500\n")
    main_file.write("spinning_freq(kHz) *\n")
    
    #Identify channels
    
    chn_list = []
    for a in atoms['atom']:
        a_chn = str(isotopes[a['id']][0]) + isotopes[a['id']][1]
        is_chn = False
        for chn in chn_list:
            chn_name = str(chn[1]) + chn[0]
            if chn_name == a_chn:
                is_chn = True
        if is_chn == False:
            chn_list.append([isotopes[a['id']][1], isotopes[a['id']][0]])
    
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
    for a in atoms['atom']:
        elem = a['species']
        main_file.write(elem+str(isotopes[a['id']][0])+" ")
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
        main_file.write("timing(usec)       2.5\'\t(" + str(sim_options_num["-dw"]) + ")" + (str(int(sim_options_num["-np"])) if i==0 else "") + "\n")  # Needed since the number of acquisition points must appear only in CHN 1
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
