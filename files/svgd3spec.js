//MagresView 
//by Simone Sturniolo
//
//Copyright 2014 Science and Technology Facilities Council
//This software is distributed under the terms of the GNU General Public License (GNU GPL)
//Please refer to the file COPYING for the text of the license

//This file creates SVG plots of arbitrary quantities (here used for spectra)

var svg_border_width = 0.1;    // Border between full plot size and inner area

function svg_spectrum_plot(from_change)
{
    var style = $('#spec_style_drop').val();
    var plabs_on = $('#spec_plabel_check').attr('checked');

    // First, gather the data

    if (!atom_set.has_ms) {
        // WTH are we doing here?
        return;
    }
    
    // Ask Jmol for info
    
    spectrum_data = {};

    xmin = NaN;
    xmax = NaN;
    
    for (var l = 0; l < atom_set.speciesno; ++l) {
        
        var lab = atom_set.atom_species_labels[l];
        var ms_shifts = Jmol.evaluateVar(mainJmol, "{" + lab + "_* and selected}.tensor('ms', 'isotropy')");
        
        if (plabs_on) {
            var ms_labels = Jmol.evaluateVar(mainJmol, "{" + lab + "_* and selected}.atomname");        
            // To take care of the case where only one atom is present
                if (typeof(ms_labels) != 'object') {
                    ms_labels = [ms_labels];
                }

            // Remove element name (temporary code)
            for (var i = 0; i < ms_labels.length; ++i)
            {
                ms_labels[i] = ms_labels[i].split('_')[1];
            }
        }
        
        var ref = parseFloat($('#ref_input_' + lab).val());
        
        for (var i = 0; i < ms_shifts.length; ++i) {
            if (!isNaN(ref)) {
                ms_shifts[i] = ref - ms_shifts[i];
            }
        }

        msmin = d3.min(ms_shifts);
        msmax = d3.max(ms_shifts);

        if (isNaN(xmin) || msmin < xmin)
            xmin = msmin;

        if (isNaN(xmax) || msmax > xmax)
            xmax = msmax;

        spectrum_data[lab] = {'ms': ms_shifts, 'labels': ms_labels};

    }

    // Clean up the automated values

    rounder = d3.format('.1f');
    xmin = rounder(Math.floor(xmin/10.0)/10.0)*100;
    xmax = rounder(Math.ceil(xmax/10.0)/10.0)*100;

    if (from_change) {
        $("#spec_xrange_min").val(xmax);
        $("#spec_xrange_max").val(xmin);
        $("#spec_xrange_step").val((xmax-xmin)/4.0);
    }

}

function svg_plot_clean()
{
    // Clean up the svg_plot div and ready it for plotting

    var plot_W = 0.3*winW;
    var plot_H = 0.35*winH;

    // First, set the size

    var main_plot = d3.select('#spec_plot_svg')
    .html('')
    .style({'width': plot_W,
    'height': plot_H,});

    // Now add a rectangle as background

    main_plot
    .append("rect")
    .classed("mviewsvg bkg", true)
    .attr({
        'x': 0,
        'y': 0,
        'width': plot_W,
        'height': plot_H,
    });

    // And finally, a group container for all the actual plotting

    gw = plot_W*(1.0-2.0*svg_border_width);
    gh = plot_H*(1.0-2.0*svg_border_width);

    main_plot
    .append("g")
    .attr("width", gw)
    .attr("height", gh)
    .attr("transform", "translate(" + plot_W*svg_border_width + "," + plot_H*svg_border_width + ")")
    .classed("plot_area", true);

}


function draw_axis()
{
    // Draw the X axis

    min = parseFloat($("#spec_xrange_min").val());
    max = parseFloat($("#spec_xrange_max").val());
    step = parseFloat($("#spec_xrange_step").val());

    // Quit if step is zero, otherwise adjust its value to avoid errors

    if (step == 0.0)
    {
        return;
    }
    else
    {
        if (min > max)
        {
            step = -Math.abs(step);
        }
        else
        {
            step = Math.abs(step);
        }
    }

    var plot_area = d3.select('#spec_plot_svg').select('.plot_area');
    var width = plot_area.attr('width');
    var height = plot_area.attr('height');

    var ax = d3.scale.linear().domain([min, max]).range([0, width]);
    var fullAxis = d3.svg.axis().scale(ax).tickValues(d3.range(min, max+step, step)).orient("bottom");

    ax_sel = plot_area.select('.axis');

    if (ax_sel.empty())
        ax_sel = plot_area.append('g').attr("class", "mviewsvg axis");

    ax_sel
        .attr("transform", "translate( 0," + height + " )")
        .call(fullAxis);

}

function plot_data(from_change)
{

}
