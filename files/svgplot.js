//MagresView 
//by Simone Sturniolo
//
//Copyright 2014 Science and Technology Facilities Council
//This software is distributed under the terms of the GNU General Public License (GNU GPL)
//Please refer to the file COPYING for the text of the license

//This file creates SVG plots of arbitrary quantities (here used for spectra)

SVGP_styles = {
    
    'default': {
        bkg_color: '#ffffff',
        axes_color: '#000000',
        axes_stroke: 2,
        text_color: '#000000',
        data_col_table: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'],
    },
    
    'grey': {
        bkg_color: '#eeeeee',
        axes_color: '#333333',
        axes_stroke: 4,        
        text_color: '#333333',        
        data_col_table: ['#cc3300', '#00cc33', '#3300cc', '#cccc33', '#cc33cc', '#33cccc'],
    },
    
    'mview': {
        bkg_color: '#303030',
        axes_color: '#f5f5eb',
        axes_stroke: 3,        
        text_color: '#f5f5eb',        
        data_col_table: ['#ff8800', '#0088ff', '#88ff00', '#ffff88', '#ff88ff', '#88ffff'],        
    }
    
}

function SVGPlot(width, height, style, id)
{
    
    this.set_style = function(sty) {
        if (SVGP_styles[sty] == undefined) {        
            this.style = SVGP_styles['default'];
        }
        else
        {
            this.style = SVGP_styles[sty];
        }
    }
    
    
    if (id == undefined) {
        id = 'my_svgplot';
    }
    
    this.w = width;
    this.h = height;
    this.style = SVGP_styles[style];
    this.id = id;
    
    this.xrange = [0, 1];
    this.yrange = [0, 1];
    
    this.ticn = 4;    
    this.ticl = Math.min(this.h*0.03, this.w*0.03);
    this.tic_max = 0.92;
    
    this.xlabel = 'x';
    this.ylabel = 'y';
    
    this.data_series_n = 0;
    this.data_series = {};
    
    this.jq_rep = '';
    
    this.lor_width = 1.0;
    this.lor_points = 100;

    // A series of options to hide/show some elements

    this.has_x_axis = true;
    this.has_y_axis = true;
    this.has_x_tics = true;
    this.has_y_tics = true;
    
    this.plot_area_calc = function () {
        this.x0y0 = [this.w*0.1,this.h*0.9];
        this.x1y0 = [this.w*0.9,this.h*0.9];
        this.x0y1 = [this.w*0.1,this.h*0.1];
    };
    
    // Graphical plotting functions
    
    this.data_col = function(i) {
        
        i = parseInt(i);
        
        if (isNaN(i)) {
            return '#555555';
        }
        
        return this.style.data_col_table[i%6];
        
    }
    
    this.nearest_round_num = function(x, upwards) {
        
        if (upwards) {
            if (x > 0) {
                magn = Math.pow(10, Math.floor(Math.log(x)/Math.LN10));
                return Math.ceil(1.1*x/magn)*magn;
            }
            else if (x == 0) {
                magn = 1;
                return Math.ceil(1.1*x/magn)*magn;
            }
            else
            {
                magn = Math.pow(10, Math.floor(Math.log(-x)/Math.LN10));
                return Math.ceil(0.9*x/magn)*magn;                
            }
        }
        else
        {
            if (x > 0) {
                magn = Math.pow(10, Math.floor(Math.log(x)/Math.LN10));
                return Math.floor(0.9*x/magn)*magn;
            }
            else if (x == 0) {
                magn = 1;
                return Math.floor(0.9*x/magn)*magn;
            }
            else
            {
                magn = Math.pow(10, Math.floor(Math.log(-x)/Math.LN10));
                return Math.floor(1.1*x/magn)*magn;              
            }
        }
        
    }
    
    this.bkg_gen = function () {
        return $('<rect></rect>').attr({
            width: this.w,
            height: this.h,
            }).css({
            'fill': this.style.bkg_color,
            }).addClass('SVGP_bkg');
    }
    
    this.axis_gen = function (ax) {
        return $('<line></line>').attr({
            x1: this.x0y0[0],
            y1: this.x0y0[1],
            x2: {'x': this.x1y0[0], 'y': this.x0y1[0]}[ax],
            y2: {'x': this.x1y0[1], 'y': this.x0y1[1]}[ax],
        }).css({
           'stroke': this.style.axes_color,
           'stroke-width': this.style.axes_stroke,
           'stroke-linecap': 'round',
        }).addClass('SVGP_axis').addClass('SVGP_'+ax+'axis');
    }
    
    this.arrow_gen = function (ax) {
        var p1 = {'x': (this.x1y0[0] - 2*this.style.axes_stroke), 'y': (this.x0y1[0] - this.style.axes_stroke)}[ax] + ',' +
        {'x': (this.x1y0[1] - this.style.axes_stroke), 'y': (this.x0y1[1] + 2*this.style.axes_stroke)}[ax];
        var p2 = {'x': this.x1y0[0], 'y': this.x0y1[0]}[ax] + ',' +
        {'x': this.x1y0[1], 'y': this.x0y1[1]}[ax];
        var p3 = {'x': (this.x1y0[0] - 2*this.style.axes_stroke), 'y': (this.x0y1[0] + this.style.axes_stroke)}[ax] + ',' +
        {'x': (this.x1y0[1] + this.style.axes_stroke), 'y': (this.x0y1[1] + 2*this.style.axes_stroke)}[ax];
        
        return $('<polyline></polyline>').attr({
            'points': p1 + ' ' + p2 + ' ' + p3,
        }).css({
           'fill': 'none',
           'stroke': this.style.axes_color,
           'stroke-width': this.style.axes_stroke,
        }).addClass('SVGP_arrow').addClass('SVGP_'+ax+'arrow');
    }
    
    this.tic_gen = function(ax, i) {
            
            var tic_pos = {'x': i*this.tic_max*(this.x1y0[0]-this.x0y0[0])/this.ticn + this.x0y0[0], 'y': i*this.tic_max*(this.x0y1[1]-this.x0y0[1])/this.ticn + this.x0y0[1]}[ax];
            
            return $('<line></line>').attr({
                x1: {'x': tic_pos, 'y': this.x0y0[0]}[ax],
                y1: {'x': this.x0y0[1], 'y': tic_pos}[ax],
                x2: {'x': tic_pos, 'y': this.x0y0[0] + this.ticl}[ax],
                y2: {'x': this.x0y0[1] - this.ticl, 'y': tic_pos}[ax],
            }).css({
                'stroke': this.style.axes_color,
                'stroke-width': this.style.axes_stroke,
            }).addClass('SVGP_tic').addClass('SVGP_'+ax+'tic');
        
    }
    
    this.ticlabel_gen = function(ax, i) {
        
        var tic_pos = {'x': i*this.tic_max*(this.x1y0[0]-this.x0y0[0])/this.ticn + this.x0y0[0], 'y': i*this.tic_max*(this.x0y1[1]-this.x0y0[1])/this.ticn + this.x0y0[1]}[ax];
        var tic_val = {'x': i/this.ticn*(this.xrange[1]-this.xrange[0]) + this.xrange[0], 'y': i/this.ticn*(this.yrange[1]-this.yrange[0]) + this.yrange[0]}[ax].toFixed(2);
        
        return $('<text></text>').attr({
            x: {'x': tic_pos, 'y': this.x0y0[0] - this.w*0.06}[ax],
            y: {'x': this.x0y0[1] + this.h*0.04, 'y': tic_pos}[ax],
            fill: this.style.text_color,
        }).css({
            'font-size': this.ticl,
        }).html(tic_val).addClass('SVGP_ticlab').addClass('SVGP_'+ax+'ticlab');
    }
    
    this.key_gen = function() {
        
        var key = [];
        
        var i = 0;
        
        for (ds_i in this.data_series) {
            
            var ds = this.data_series[ds_i];
            
            key.push($('<text></text>').attr({
              x: this.x1y0[0]*0.87,
              y: this.x0y1[1]*1.15 + this.ticl*1.2*i,
              fill: this.style.text_color,
              'text-anchor': 'end',
            }).css({
                'font-size': this.ticl,
            }).html(ds.title).addClass('SVGP_key_' + ds_i)
            );
            
            key.push($('<line></line>').attr({
              x1: this.x1y0[0]*0.88,
              y1: this.x0y1[1]*1.15 + this.ticl*1.2*i - this.style.axes_stroke,
              x2: this.x1y0[0]*0.93,
              y2: this.x0y1[1]*1.15 + this.ticl*1.2*i - this.style.axes_stroke,
            }).css({
                'fill': 'none',
                'stroke': this.data_col(ds_i),
                'stroke-width': 2.0*this.style.axes_stroke,
            }).addClass('SVGP_keyline_' + ds_i)
            );
            
            ++i;
            
        }
        
        return key;
        
    }
    
    this.label_gen = function(ax) {
        
        var xpos = {'x': (this.x1y0[0] + this.x0y0[0])/2.0, 'y': this.x0y0[0] - this.w*0.07}[ax];
        var ypos = {'x': this.x0y0[1] + this.h*0.08, 'y': (this.x0y1[1] + this.x0y0[1])/2.0}[ax]
        
        return $('<text></text>').attr({
            x : xpos,
            y : ypos,
            transform: {x: '', y: 'rotate(-90 ' + xpos + ',' + ypos + ')'}[ax],
            fill: this.style.text_color,
            'text-anchor': 'middle',
        }).css({
            'font-size': this.ticl,
        }).html({'x': this.xlabel, 'y': this.ylabel}[ax]).addClass('SVGP_label').addClass('SVGP_'+ax+'label');
        
    }
    
    this.data_plot = function(ds_i, style) {
        
        var x = this.data_series[ds_i].x;
        var y = this.data_series[ds_i].y;
        
        var pplot = [];
        
        var x_i_old = NaN;
        var y_i_old = NaN;
        
        for (var i = 0; i < x.length; ++i) {
            
            var x_i = (x[i] - this.xrange[0])/(this.xrange[1] - this.xrange[0])*(this.x1y0[0] - this.x0y0[0])*this.tic_max + this.x0y0[0];
            var y_i = (y[i] - this.yrange[0])/(this.yrange[1] - this.yrange[0])*(this.x0y1[1] - this.x0y0[1])*this.tic_max + this.x0y0[1];
            
            switch(style) {
                case "pulses":                    
                    pplot.push($('<line></line>').attr({
                        x1: x_i,
                        y1: this.x0y0[1],
                        x2: x_i,
                        y2: y_i,
                    }).css({
                       'fill': 'none',
                       'stroke': this.data_col(ds_i),
                       'stroke-width': 1.2*this.style.axes_stroke,
                    }));
                    break;
                case "points":
                    pplot.push($('<circle></circle>').attr({
                        cx: x_i,
                        cy: y_i,
                        r: 2.0*this.style.axes_stroke,
                    }).css({
                       'fill': this.data_col(ds_i),
                       'stroke': this.data_col(ds_i),
                       'stroke-width': this.style.axes_stroke,
                    }));
                    break;
                case "lines":
                    if (isNaN(x_i_old) || isNaN(y_i_old)) {
                        break;
                    }
                    pplot.push($('<line></line>').attr({
                        x1: x_i_old,
                        y1: y_i_old,
                        x2: x_i,
                        y2: y_i,
                    }).css({
                       'fill': 'none',
                       'stroke': this.data_col(ds_i),
                       'stroke-width': this.style.axes_stroke,
                    }));
                    break;                    
                case "linespoints":
                    pplot.push($('<circle></circle>').attr({
                        cx: x_i,
                        cy: y_i,
                        r: 2.0*this.style.axes_stroke,
                    }).css({
                       'fill': this.data_col(ds_i),
                       'stroke': this.data_col(ds_i),
                       'stroke-width': this.style.axes_stroke,
                    }));
                    if (isNaN(x_i_old) || isNaN(y_i_old)) {
                        break;
                    }
                    pplot.push($('<line></line>').attr({
                        x1: x_i_old,
                        y1: y_i_old,
                        x2: x_i,
                        y2: y_i,
                    }).css({
                       'fill': 'none',
                       'stroke': this.data_col(ds_i),
                       'stroke-width': this.style.axes_stroke,
                    }));
                    break;
                case "peaks":
                    
                    pplot.push(this.data_plot_interp(ds_i, this.lor_width, this.lor_points)[0]);
                    
                    break;
                default:
                    break;
            }
            
            x_i_old = x_i;
            y_i_old = y_i;
            
        }
        
        
        return pplot;
        
    }
    
    // Plot a data set using interpolating Lorentzians
    
    this.data_plot_interp = function(ds_i, w, points) {
        
        var lor = function(x, x0, w, h) {
            return h/(1.0+Math.pow((x-x0)/w, 2.0));
        }
        
        var dlor_dx = function(x, x0, w, h) {
            return -h/Math.pow(1.0+Math.pow((x-x0)/w, 2.0), 2.0)*2.0*(x-x0)/(w*w);
        }
        
        pplot = [];
        
        // Create a series of points to interpolate
        
        // Using default value for optional argument
        points = (typeof(points) == 'undefined'? 100: points);
        
        lor_points = [];
        
        this.yrange[0] = Math.min(this.nearest_round_num(0.0, false), this.yrange[0]);
        
        for (var p = 0; p < points; ++p) {
            
            var x = (this.xrange[1]-this.xrange[0])/points*p + this.xrange[0];
            
            lor_points.push([x, 0, 0]); //x, f(x), f'(x)
            
            for (var i = 0; i < this.data_series[ds_i].x.length; ++i) {
                
                lor_points[p][1] += lor(x, this.data_series[ds_i].x[i], w, this.data_series[ds_i].y[i]);
                lor_points[p][2] += dlor_dx(x, this.data_series[ds_i].x[i], w, this.data_series[ds_i].y[i]);
                
                // Adjust range if needed
                this.yrange[1] = Math.max(this.nearest_round_num(lor_points[p][1], true), this.yrange[1]);
                
            }
            
        }
        
        // Convert to graph scale
        
        for (var p = 0; p < points; ++p) {
            lor_points[p][0] = (lor_points[p][0] - this.xrange[0])/(this.xrange[1] - this.xrange[0])*(this.x1y0[0] - this.x0y0[0])*this.tic_max + this.x0y0[0];
            lor_points[p][1] = (lor_points[p][1] - this.yrange[0])/(this.yrange[1] - this.yrange[0])*(this.x0y1[1] - this.x0y0[1])*this.tic_max + this.x0y0[1];
            lor_points[p][2] = lor_points[p][2]*((this.xrange[1] - this.xrange[0])/(this.yrange[1] - this.yrange[0]))*((this.x0y1[1] - this.x0y0[1])/(this.x1y0[0] - this.x0y0[0]));
        }
        
        // Do the actual spline
        
            
        pplot.push($('<path></path>').attr({
            d: 'M ' + lor_points[0][0] + ',' + lor_points[0][1],
        }).css({
           'fill': 'none',
           'stroke': this.data_col(ds_i),
           'stroke-width': this.style.axes_stroke,
        }));
        
        for (var p = 1; p < points; ++p) {
            
            // Anchor point coordinates
            
            x_a = lor_points[p-1][0];
            y_a = lor_points[p-1][1];
            df_a = lor_points[p-1][2];
            
            x_b = lor_points[p][0];
            y_b = lor_points[p][1];
            df_b = lor_points[p][2];
            
            x_C = -((y_a-df_a*x_a) - (y_b-df_b*x_b))/(df_a-df_b);
            y_C = (y_a-df_a*x_a) + df_a*x_C;
            
            pplot[0].attr({
                            'd': pplot[0].attr('d') + ' Q ' + x_C + ',' + y_C + ' ' + x_b + ',' + y_b,
            });
            
        }
        
        // ...and that should be it!
        
        return pplot;
        
    }
    
    // Redrawing
    
    this.redraw = function () {
        
        this.jq_rep = $('<svg></svg>').attr({
            id: this.id,
            width: this.w,
            height: this.h,});
            
        console.log('SVGPlot - Creating background...')
        
        var bkg_rect = this.bkg_gen();
        
        this.jq_rep.append(bkg_rect);
        
        console.log('SVGPlot - Plotting data...')
        
        this.plot_area_calc();
        
        for (ds_i in this.data_series) {
            
            console.log('SVGPlot - Plotting data set n.' + ds_i + '...');
            
            var ds = this.data_series[ds_i];
            
            this.jq_rep.append(this.data_plot(ds_i, ds.style));
            
            
        }
        
        console.log('SVGPlot - Creating key...')
        
        this.jq_rep.append(this.key_gen());
        
        console.log('SVGPlot - Creating axes and labels...')
        
        if (this.has_x_axis)
        {
            var x_axis = this.axis_gen('x');
            var x_arr = this.arrow_gen('x');
            var x_label = this.label_gen('x');
            this.jq_rep.append(x_axis);
            this.jq_rep.append(x_arr);
            this.jq_rep.append(x_label);
        }
        
        if (this.has_y_axis)
        {
            var y_axis = this.axis_gen('y');        
            var y_arr = this.arrow_gen('y');
            var y_label = this.label_gen('y');
            this.jq_rep.append(y_axis);
            this.jq_rep.append(y_arr);
            this.jq_rep.append(y_label);
        }
        
        // Create tics
        
        if (this.has_x_tics || this.has_y_tics)
        {
            for (var i = 0; i <= this.ticn; ++i) {
                            
                console.log('SVGPlot - Creating tics, n.' + (i+1) + '...');
                
                if (this.has_x_tics)
                {
                    var newticx = this.tic_gen('x', i);
                    var newticlabelx = this.ticlabel_gen('x', i);
                    
                    this.jq_rep.append(newticx);
                    this.jq_rep.append(newticlabelx);
                }

                if (this.has_y_tics)
                {
                    var newticy = this.tic_gen('y', i);
                    var newticlabely = this.ticlabel_gen('y', i);
                    
                    this.jq_rep.append(newticy);
                    this.jq_rep.append(newticlabely);
                }
            }        
        }
    
    };
    
    this.add_data_series = function(i, x_points, y_points, style, title) {
        
        var data_len = Math.min(x_points.length, y_points.length);
        
        x_points = x_points.slice(0, data_len);
        y_points = y_points.slice(0, data_len);
        
        this.data_series[i] = {'x': x_points,'y': y_points,'style': style, 'title': String(title)};
        
        // Reset xrange and yrange
        
        min_x = Math.min.apply(Math, x_points);
        max_x = Math.max.apply(Math, x_points);
        min_y = Math.min.apply(Math, y_points);
        max_y = Math.max.apply(Math, y_points);
        
        this.data_series_n++;
        
        if (this.data_series_n > 1) {
            
            this.xrange[0] = Math.min(this.nearest_round_num(min_x, false), this.xrange[0]);
            this.xrange[1] = Math.max(this.nearest_round_num(max_x, true), this.xrange[1]);
            this.yrange[0] = Math.min(this.nearest_round_num(min_y, false), this.yrange[0]);
            this.yrange[1] = Math.max(this.nearest_round_num(max_y, true), this.yrange[1]);
        }
        else
        {
            this.xrange[0] = this.nearest_round_num(min_x, false);
            this.xrange[1] = this.nearest_round_num(max_x, true);
            this.yrange[0] = this.nearest_round_num(min_y, false);
            this.yrange[1] = this.nearest_round_num(max_y, true);
        }
        
    }
    
    this.remove_data_series = function(i) {
        
        delete this.data_series[i];
        this.data_series_n--;
        
    }
        
    this.show = function(container) {
        
        this.redraw();
        $(container).html($('<div>').append(this.jq_rep.clone()).html());
        
    }
    
    this.toString = function() {
        
        this.redraw();
        
        return $('<div>').append(this.jq_rep.clone()).html();
        
    }
    
}