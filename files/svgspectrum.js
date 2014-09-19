function spec_style_drop_handler() {
    
    var sty = document.getElementById('spec_style_drop').value;
    
    switch (sty) {
        case "peaks":
            document.getElementById('spec_interp_n').disabled = false;
            document.getElementById('spec_broad').disabled = false;
            break;
        default:
            document.getElementById('spec_interp_n').disabled = true;
            document.getElementById('spec_broad').disabled = true;
            break;
    }
    
    svg_spectrum_plot(false);
    
}

function spec_interp_n_handler(evt)
{
    //Compatibility code - see console.js for details
    var evt = window.event || evt;
    var myKey = (evt.keyCode)? evt.keyCode: evt.charCode;
	
    if (myKey == 13)
    {
        evt.preventDefault();
        svg_spectrum_plot(false);
    }
}

function spec_xrange_handler(evt)
{
    //Compatibility code - see console.js for details
    var evt = window.event || evt;
    var myKey = (evt.keyCode)? evt.keyCode: evt.charCode;
	
    if (myKey == 13)
    {
        evt.preventDefault();
        svg_spectrum_plot(false);
    }    
}

function spec_plab_handler()
{
    svg_spectrum_plot(false);
}

function svg_spectrum_plot(from_change)
{
    
    var active = $("#main_tabs").tabs("option", "active");
    if(!(active == tab_index("#spec_plot")))
        return;
    
    var plot_W = 0.3*winW;
    var plot_H = 0.35*winH;
    
    var style = document.getElementById('spec_style_drop').value;
    var plabs_on = document.getElementById('spec_plabel_check').checked;
    
    var spec_plot = new SVGPlot(plot_W, plot_H, 'mview', 'svg_spec_plot');
    
    spec_plot.has_y_axis = false;
    spec_plot.has_y_tics = false;
    
    spec_plot.xlabel = "Magnetic shielding, isotropic (ppm)";
    spec_plot.ylabel = "";
    
    spec_plot.lor_points = parseInt(document.getElementById('spec_interp_n').value);
    spec_plot.lor_width = parseFloat(document.getElementById('spec_broad').value);
    
    if (atom_set.has_ms) {
        
        // Ask Jmol for info
        
        for (var l = 0; l < atom_set.speciesno; ++l) {
            
            var lab = atom_set.atom_species_labels[l];
            
            var ms_shifts = Jmol.evaluateVar(mainJmol, "{" + lab + "_* and selected}.tensor('ms', 'isotropy')");
	    if (plabs_on) {
		var ms_labels = Jmol.evaluateVar(mainJmol, "{" + lab + "_* and selected}.atomname");		
		// To take care of the case where only one atom is present
		if (typeof(ms_labels) != 'object') {
		    ms_labels = [ms_labels];
		}
	    }
	    
            var peaks = [];
            
            var ref = parseFloat(document.getElementById('ref_input_' + lab).value);
            
            if (ms_shifts.length == 0) {
                continue;
            }
            
            for (var i = 0; i < ms_shifts.length; ++i) {
                if (!isNaN(ref)) {
                    ms_shifts[i] = ref - ms_shifts[i];
                }
                peaks.push(1);
            }
            
            spec_plot.add_data_series(l, ms_shifts, peaks, style, lab, ms_labels);
        }
        
    }
    
    if (from_change) {
        document.getElementById("spec_xrange_min").value = spec_plot.xrange[0];
        document.getElementById("spec_xrange_max").value = spec_plot.xrange[1];
    }
    else
    {
        spec_plot.xrange[0] = parseFloat(document.getElementById("spec_xrange_min").value);
        spec_plot.xrange[1] = parseFloat(document.getElementById("spec_xrange_max").value);
    }
    
    spec_plot.show('#spec_container');
    
    // Prepare the downloadable version
    
    spec_plot.set_style('default');
    
    $("#plot_download").attr("href", "data:text/plain," + spec_plot.toString()
	.replace(/%/g, '%25')			//The % symbol must be replaced first, or everything goes down the drain!
	.replace(/\n/g, '%0A')
	.replace(/\t/g, '%09')
	.replace(/&/g, '%26')
	.replace(/#/g, '%23')
	.replace(/"/g, '%22')
	.replace(/'/g, '%27'));
    
}

//Snippet to launch the NMR2D tool, that has its own scripts and code

function launch_NMR2D() {

    var data_set = {}
    init_data_set(data_set);
    compile_data_set(data_set, {'t': 'all'}, true);

    console.log("Launching NMR2D...");
    var nmr2d_win = window.open('nmr2d/nmr2d_graph.html', '', 'toolbar=no');
    if (!nmr2d_win.opener)
        nmr2d_win.opener = window;

}