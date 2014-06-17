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

function svg_spectrum_plot(from_change)
{
    
    var active = $("#main_tabs").tabs("option", "active");
    if(!($("#main_tabs ul>li a").eq(active).attr('href') == "#spec_plot"))
        return;
    
    var plot_W = 0.3*winW;
    var plot_H = 0.35*winH;
    
    var style = document.getElementById('spec_style_drop').value;
    
    var spec_plot = new SVGPlot(plot_W, plot_H, 'mview', 'svg_spec_plot');
    
    spec_plot.xlabel = "Magnetic shielding, isotropic (ppm)";
    spec_plot.ylabel = "";
    
    spec_plot.lor_points = parseInt(document.getElementById('spec_interp_n').value);
    spec_plot.lor_width = parseFloat(document.getElementById('spec_broad').value);
    
    
    if (atom_set.has_ms) {
        
        // Ask Jmol for info
        
        for (var l = 0; l < atom_set.speciesno; ++l) {
            
            var lab = atom_set.atom_species_labels[l];
            
            var ms_shifts = Jmol.evaluateVar(mainJmol, "{" + lab + "_* and selected}.tensor('ms', 'isotropy')");
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
            
            spec_plot.add_data_series(l, ms_shifts, peaks, style, lab);
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
    
}