#!/usr/bin/python

from json_to_sim import *

import tkFileDialog
from Tkinter import *
 
#The j2s_GUI class actually encapsulates the methods and window elements required for the program

class j2s_GUI:
	 
	 txt = "Hello world!"
	 
	 def __init__(self, master):
		 		 
		#Each row will contain two controls for different options
		
		self.top_padding = Frame(master, height=20)
		self.top_padding.grid(row=0, column=0, columnspan=2)
		
		self.fft_check_val = IntVar()
		self.fft_check = Checkbutton(master, text="Perform FFT", variable=self.fft_check_val)
		self.fft_check.grid(row=1, column=0, sticky=W)
		
		self.pwd_check_val = IntVar()
		self.pwd_check = Checkbutton(master, text="Perform powder average", variable=self.pwd_check_val)
		self.pwd_check.grid(row=1, column=1, sticky=W)
		
		self.dat_check_val = IntVar()
		self.dat_check = Checkbutton(master, text="Always use .dat format", variable=self.dat_check_val)
		self.dat_check.grid(row=2, column=0, sticky=W)

		self.ppm_check_val = IntVar()
		self.ppm_check = Checkbutton(master, text="Frequency in ppm", variable=self.ppm_check_val)
		self.ppm_check.grid(row=2, column=1, sticky=W)
		
		self.mid_padding = Frame(master, height=10)
		self.mid_padding.grid(row=3, column=0, columnspan=2)
		
		#Options requiring numerical arguments will be a label + a entry field packed in a frame

		self.dw_frame = Frame(master)
		self.dw_var = StringVar()
		self.dw_var.set("0.1")
		self.dw_label = Label(self.dw_frame, text="Dwell time (usec):")
		self.dw_label.pack(side=LEFT)
		self.dw_entry = Entry(self.dw_frame, background="white", width=4, textvariable=self.dw_var)
		self.dw_entry.pack(side=RIGHT)
		self.dw_frame.grid(row=4, column=0, sticky=W)

		self.np_frame = Frame(master)
		self.np_var = StringVar()
		self.np_var.set("8192")
		self.np_label = Label(self.np_frame, text="Acquisition points (usec):")
		self.np_label.pack(side=LEFT)
		self.np_entry = Entry(self.np_frame, background="white", width=5, textvariable=self.np_var)
		self.np_entry.pack(side=RIGHT)
		self.np_frame.grid(row=4, column=1, sticky=W)
		
		self.mid_padding_2 = Frame(master, height=10)
		self.mid_padding_2.grid(row=5, column=0, columnspan=2)
		
		self.chn_frame = Frame(master)
		self.chn_var = StringVar()
		self.chn_var.set("")
		self.chn_label = Label(self.chn_frame, text="Spin channel:")
		self.chn_label.pack(side=LEFT)
		self.chn_entry = Entry(self.chn_frame, background="white", width="6", textvariable=self.chn_var)
		self.chn_entry.pack(side=RIGHT)
		self.chn_frame.grid(row=6, column=0, sticky=W)
		
		self.mid_padding_3 = Frame(master, height=10)
		self.mid_padding_3.grid(row=7, column=0, columnspan=2)
		
		self.file_frame = Frame(master)
		self.file_name = StringVar()
		self.file_name.set("")
		self.file_entry = Entry(self.file_frame, background="white", width="15", textvariable=self.file_name)
		self.file_entry.pack(side=LEFT)
		self.file_label = Label(self.file_frame, text="   ")
		self.file_label.pack(side=LEFT)
		self.file_button = Button(self.file_frame, text="Load file", command=self.file_load)
		self.file_button.pack(side=LEFT)
		self.file_frame.grid(row=8, column=0, columnspan = 2)
		
		self.bot_padding = Frame(master, height=20)
		self.bot_padding.grid(row=9, column=0, columnspan=2)
		
		self.conv_button = Button(master, text="JSON to sim", command=self.convert_file)
		self.conv_button.grid(row=10, column=0, columnspan=2)
		
		self.status_msg = StringVar()
		self.status_msg.set("")
		self.status_label = Label(master, textvariable=self.status_msg)
		self.status_label.grid(row=11, column=0, columnspan=2)
		
	 def file_load(self):
		
		self.file_name.set(tkFileDialog.askopenfilename())
		
	 def convert_file(self):
		
		if self.fft_check_val.get() == 1:
			sim_options["-fft"] = True

		if self.pwd_check_val.get() == 1:
			sim_options["-pwd"] = True

		if self.dat_check_val.get() == 1:
			sim_options["-dat"] = True

		if self.ppm_check_val.get() == 1:
			sim_options["-ppm"] = True
		
		try:
			sim_options_num["-dw"] = float(self.dw_var.get())
		except ValueError:
			sim_options_num["-dw"] = 0.1

		try:
			sim_options_num["-np"] = int(self.np_var.get())
		except ValueError:
			sim_options_num["-np"] = 8192
		
		sim_options_str["-chn"] = self.chn_var.get()
		
		if json_to_sim(self.file_name.get(), sim_options, sim_options_num, sim_options_str):
			self.status_msg.set("File converted successfully!")
		else:
			self.status_msg.set("Conversion failed. Check error messages in the console")
				

#Initialize the root window

root = Tk()

scr_W = root.winfo_screenwidth()
scr_H = root.winfo_screenheight()

scr_prc = 0.22	#Size of window in percentage of the screen

root.title("JSON to sim")
root.geometry(str(int(scr_W*scr_prc)) + "x" + str(int(scr_H*scr_prc)) + "+" + str(int(scr_W*(1.0-scr_prc)/2.0)) + "+" + str(int(scr_H*(1.0-scr_prc)/2.0)))

#Create the GUI with the root window as master, then run the main loop

main_frame = Frame(root)
gui = j2s_GUI(main_frame)
main_frame.pack()

root.mainloop()
