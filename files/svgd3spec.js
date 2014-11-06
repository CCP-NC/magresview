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
        // WTH are we doing here? Disable everything and go home
        $("#spec_xrange_min").attr('disabled', true);
        $("#spec_xrange_max").attr('disabled', true);
        $("#spec_xrange_step").attr('disabled', true);
        $('#spec_plot_svg').css('display', 'none');      
        return;
    }
    else
    {
        $("#spec_xrange_min").attr('disabled', false);
        $("#spec_xrange_max").attr('disabled', false);
        $("#spec_xrange_step").attr('disabled', false);        
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

    svg_plot_clean();
    draw_axis();
    plot_data(spectrum_data);

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
    'height': plot_H,
    'display': 'inline',});

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

function plot_data(data)
{
    var x1 = parseFloat($("#spec_xrange_min").val());
    var x2 = parseFloat($("#spec_xrange_max").val());

    var style = $('#spec_style_drop').val();

    var lor_points = parseInt($('#spec_interp_n').val());
    var lor_width = parseFloat($('#spec_broad').val());

    var plot_area = d3.select('#spec_plot_svg').select('.plot_area');
    var width = plot_area.attr('width');
    var height = plot_area.attr('height');

    var ax = d3.scale.linear().domain([x1, x2]).range([0, width]);
    var ay = d3.scale.linear().domain([1.0, 0.0]).range([0, height]);

    var lorentzian = function(x, x0, w, h) {
        return h/(1.0+Math.pow((x-x0)/w, 2.0));
    }

    var lorp = [];
    for (var i = 0; i < lor_points; ++i)
    {
        lorp.push(i);
    }

    for (el in data)
    {
        switch(style)
        {
            case 'pulses':

                var puls = plot_area.selectAll('.pulses_' + el).data(data[el].ms);

                // Create missing pulses

                puls.enter().append('rect')
                .attr({
                    'x': function(d) {return ax(d)-1;},
                    'y': ay(0.0),
                    'width': 2,
                    'height': 0,
                })
                .style({
                    'fill': 'rgb(255,128,0)',
                })
                .transition()
                .attr({
                    'y': ay(0.5),
                    'height': ay(0.5),
                });
                break;

            case 'peaks':

                // Create a Lorentzian line

                var lorx = d3.scale.linear().domain([0, lor_points]).range([String(x1), String(x2)]);   // Yes, cast to string. Apparently this makes d3 work here. No, I don't understand it either.

                // We need to estimate a normalization factor
                // A factor rescales taking into account the effect of spline interpolation, which lowers the peaks

                var lorline = [];
                var max_y = 0;

                var lorline_func = d3.svg.line()
                                .x(function(d) { lorline.push({'x': ax(lorx(d))}); return lorline[d].x;})
                                .y(function(d) {

                                    var y = 0.0;

                                    for (var p_i = 0; p_i < data[el].ms.length; ++p_i)
                                    {   
                                        y += lorentzian(lorx(d), data[el].ms[p_i], lor_width, 0.2);
                                    }

                                    lorline[d].y = y;
                                    if (y > max_y)
                                        max_y = y;

                                    return ay(y);
                                })
                                .interpolate('cardinal');

                var lorline_norm = d3.svg.line()
                                .x(function(d) { return lorline[d].x;})
                                .y(function(d) {
                                    return ay(lorline[d].y/max_y*0.7);
                                })
                                .interpolate('cardinal');

                var lineGraph = plot_area.append("path")
                            .attr("d", lorline_func(lorp))
                            .attr({
                                "stroke": "rgb(255,128,0)",
                                "stroke-width": 2,
                                "fill": "none",
                            })
                            .transition()
                            .attr("d", lorline_norm(lorp));

                break;
        }

    }
    
}

function spec_style_drop_handler() 
{
    var sty = $('#spec_style_drop').val();
    
    switch (sty) {
        case "peaks":
            $('#spec_interp_n').attr('disabled', false);
            $('#spec_broad').attr('disabled', false);
            break;
        default:
            $('#spec_interp_n').attr('disabled', true);
            $('#spec_broad').attr('disabled', true);
            break;
    }

    svg_spectrum_plot(false);
}

function spec_replot_handler(evt)
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