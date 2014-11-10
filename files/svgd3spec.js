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
    var plabs_on = $('#spec_plabel_check').prop('checked');

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
            /*for (var i = 0; i < ms_labels.length; ++i)
            {
                ms_labels[i] = ms_labels[i].split('_')[1];
            }*/
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
    .style('display', 'inline')
    .style({
        'width': plot_W,
        'height': plot_H,
    });

    // This for Firefox compatibility - for whatever reason, d3 does not work here
    $('#spec_plot_svg')
    .css({
        'width': plot_W,
        'height': plot_H,
    });

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
    var tickRange = d3.range(min, max + ((max-min)%step==0?step:0), step);
    var fullAxis = d3.svg.axis().scale(ax).tickValues(tickRange).orient("bottom");

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
    var plabs_on = $('#spec_plabel_check').prop('checked');

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

    var lorp = d3.range(0, lor_points);

    el_i = 0;  // Keeping track of the colour

    // Creating a legend

    var legend = plot_area.append('g')
    .classed('mviewsvg legend', true)
    .attr('transform', 'translate( '+ width*0.9 + ', 0 )');

    // Also a force layout for labels

    if (plabs_on)
    {
        var force_labels = d3.layout.force()
        .size([width,height])
        .linkStrength(0.8)
        .friction(0.7)
        .linkDistance(40)
        .charge(function(d, i) {
            if (d.fixed)
                return 0;
            else
                return -80;
        })
        .chargeDistance(width/5.0)
        .gravity(0.0)
        .theta(0.8)
        .alpha(0.1);

        var label_nodes = [];
        var label_links = [];

        var el_labels = [];
        var el_links =  [];

    }

    for (el in data)
    {
        switch(style)
        {
            case 'pulses':

                var puls = plot_area.selectAll('.pulses_' + el).data(data[el].ms);

                // Create missing pulses

                puls.enter().append('rect')
                .classed('mviewsvg col' + el_i%6 + ' pulses pulses_' + el, true)
                .attr({
                    'x': function(d) {return ax(d)-1;},
                    'y': ay(0.0),
                    'width': 2,
                    'height': 0,
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
                                    return ay(lorline[d].y/max_y*0.5);
                                })
                                .interpolate('cardinal');

                var lineGraph = plot_area.append("path")
                            .classed('mviewsvg col' + el_i%6 + ' peaks lorline_' + el, true)
                            .attr("d", lorline_func(lorp))
                            .transition()
                            .attr("d", lorline_norm(lorp));

                break;
        }

        // Now add the legend line, only if the element is present

        if (data[el].ms.length > 0)
        {
            row_i = legend.selectAll('text')[0].length; // Number of lines already present

            legend.append('text')
            .classed('mviewsvg col' + el_i%6, true)
            .attr('y', row_i*15)
            .html(el);

            legend.append('line')
            .classed('mviewsvg col' + el_i%6, true)
            .attr({
                'x1': 20,
                'y1': row_i*15-3,
                'x2': 40,
                'y2': row_i*15-3
            })
            .style('stroke-width', 2);

            if (plabs_on)
            {
                // Label creation

                nodelen = label_nodes.length;

                data[el].ms.forEach(function (e, i, a) {

                    // The anchor
                    label_nodes.push({
                        'index': nodelen+2*i,
                        'x': ax(e),
                        'y': ay(0.6),
                        'fixed': true,
                        'text': '',
                    });

                    // The label
                    label_nodes.push({
                        'index': nodelen+2*i+1,
                        'x': (ax(e)-width/2.0)*10.0+width/2.0,
                        'y': ay(0.8),
                        'text': data[el].labels[i],
                        'el_i': el_i,
                        'base_x': ax(e),
                    });

                    // The link
                    label_links.push({
                        'source': nodelen+2*i,
                        'target': nodelen+2*i+1,
                    });
                });
            }
            
        }

        ++el_i;

    }

    if (plabs_on)
    {
        // Actually initialize the label system

        force_labels.nodes(label_nodes)
                    .links(label_links);
       
        el_labels = plot_area.selectAll('mviewsvg el_labels')
        .data(label_nodes)
        .enter().append('text')
        .attr({
            'x': function(d) {return d.x},
            'y': function(d) {return d.y},
            'class': function(d) { return 'mviewsvg el_labels col'+d.el_i;},
            'text-anchor': 'middle',
        })
        .html(function(d) {return d.text});

        el_links = plot_area.selectAll('mviewsvg el_links')
        .data(label_links)
        .enter().append('line')
        .attr({
            'x1': function(d) {return d.source.x},
            'y1': function(d) {return d.source.y},
            'x2': function(d) {return d.target.x},
            'y2': function(d) {return d.target.y},
        });

        var tick = function() {
            el_labels.attr({
                'x': function(d) { return d.x},
                'y': function(d) { if (!d.fixed) {d.y = ay(0.75);} return d.y;},
            });
            el_links.attr({
                'x1': function(d) {return d.source.x;},
                'y1': function(d) {return d.source.y;},
                'x2': function(d) {return d.target.x;},
                'y2': function(d) {return ay(0.72);},
                'class': function(d) { return 'mviewsvg el_links col' + d.target.el_i;},
            });
        }

        force_labels.on("tick", tick);

        force_labels.start();
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

//Snippet to launch the NMR2D tool, that has its own scripts and code

function launch_NMR2D() {

    console.log("Launching NMR2D...");
    var nmr2d_win = window.open('nmr2d/nmr2d_graph.html', '', 'toolbar=no,height=' + winH + ',width=' + winW);
    if (!nmr2d_win.opener)
        nmr2d_win.opener = window;

}

// This callback creates the file to download when you right click

function svg_download_update() {

    // So, this is a little contrived, but bear with me

    // First: we need to clone the currently existing SVG plot. We do so with jQuery because apparently d3 lacks the ability    
    var svg_clone = $('#spec_plot_svg').clone();
    // Second: but now we need to put it into d3, because that can do SVG class manipulation much better, and we need to change the style
    var d3_svg_clone = d3.select(svg_clone[0]);
    // Still with me? Good. Third, we swap classes from mviewsvg to defaultsvg (this is easy)
    d3_svg_clone.selectAll('.mviewsvg').classed('defaultsvg', true).classed('mviewsvg', false);
    // Fourth, we now need a text representation of this. A text representation which needs to contain the stylesheet for defaultsvg as well!
    // So we start by building it...
    var svg_downloadable = $('<svg>');
    // ...then we append the stylesheet...
    svg_downloadable.append($('#svg_defaultstyle').clone());
    // ...and finally, the actual plot code. 
    svg_downloadable.append(d3_svg_clone.node().innerHTML);
    // Now we create a mock div element for the sole sake of pasting the plot inside, so we can get a text representation of it...
    var svg_URI = $('<div>').append(svg_downloadable).html();
    // And last but not least, we perform a few substitutions which make the URI work
    svg_URI.replace(/%/g, '%25')           //The % symbol must be replaced first, or everything goes down the drain!
    .replace(/\n/g, '%0A')
    .replace(/\t/g, '%09')
    .replace(/&/g, '%26')
    .replace(/#/g, '%23')
    .replace(/"/g, '%22')
    .replace(/'/g, '%27');
    svg_URI = "data:text/plain," + svg_URI;

    // Now we have our URI, we're all happy, let's attach it to the download link!
    $('#plot_download').attr('href', svg_URI);

    return;

}