var data_set = {};
var atom_set = {};
var reference_list = {};

var species_id_list = {}; 	// Will keep species > ids of all atoms belonging to it
var id_label_list = {};		// label classified by id
var id_ms_list = {};		// ms classified by id
var id_r_list = {};			// distance classified by id
var id_dip_list = {};		// dip classified by id
var id_isc_list = {};		// isc classified by id

var axis_points = {'x': {'p0': [0.0, 0.0], 'range': [0.0, 0.0], 'angle': 0.0}, 'y': {'p0': [0.0, 0.0], 'range': [0.0, 0.0], 'angle': 0.0}};
// NOTE: angle not implemented yet and may never be if not explicitly required
var axis_scales = {'x': [0.0, 0.0], 'y': [0.0, 0.0]};

var default_border = 0.1	// Default ratio between bordered thickness and full area

var max_img_width  = 0.95 	// Maximum width for loaded png images
var max_img_height = 0.9	// Maximum height for loaded png images

function document_ready_callback() {

	// Disable page refresh with F5

	function disableF5(e) { if ((e.which || e.keyCode) == 116) e.preventDefault(); };
	$(document).on("keydown", disableF5);

	// Assign visual effects and correspondences to buttons
	$('.visual_button')
	.mouseover(function() {
		$(this).toggleClass("highlighted");
	})	
	.mouseout(function() {
		$(this).toggleClass("highlighted");
	});

	$('.load_button_fake').click(function() {
		$('.load_button_true').click();
	});

	// Update the size field

	psize_slide_handler();

	// Fetch the atomic data from the main MagresView window

    atom_set = window.opener.atom_set;

    window.opener.init_data_set(data_set);
    var t_0 = (new Date()).getTime()/1000.0;
    window.opener.compile_data_set(data_set, {'t': 'all'}, true, true);   // Ignore shifts, they will be read later
    console.log("Total loading time: " + (new Date()).getTime()/1000.0 - t_0 + " s");
    
    for (var s = 0; s < atom_set.speciesno; ++s)
    {
		var lab = atom_set.atom_species_labels[s];
    	var ref = parseFloat(window.opener.document.getElementById('ref_input_' + lab).value);
		reference_list[lab] = ref;
    }

    set_theme();
    compile_lists();

    // Get the maximum size for an image

    max_img_width = Math.floor($("#image_div").width()*max_img_width);
    max_img_height = Math.floor($("#image_div").height()*max_img_height);

	dndrop_init();
	ref_table_init();
	update_species();
	reset_scale('x');
	reset_scale('y');	

}

function ref_table_init()
{
	$("#ref_table_popup").dialog({
		autoOpen: false, 
		modal: true, 
		position: {my: 'right', at: 'right', of: window}, 
		width: '330pt', 
		close: ref_table_popup_handler});

	var header = $('<tr></tr>');
	header.append($('<td></td>').html("Element").addClass("ref_td"));
	header.append($('<td></td>').html("Reference (ppm)").addClass("ref_td"));

	$('.ref_table').html('').append(header);
	
	for (var s = 0; s < atom_set.speciesno; ++s)
	{
		var t_row = $('<tr></tr>');
		var lab = atom_set.atom_species_labels[s];
		t_row.append($('<td></td>').html(atom_set.atom_species_labels[s]).attr('id', 'ref_label_' + atom_set.atom_species_labels[s]).addClass('ref_td'));
		t_row.append($('<td></td>').append($('<input></input>').addClass('ref_input').attr({
			'id': 'ref_input_' + lab, 
			'value': (isNaN(reference_list[lab])? '' : reference_list[lab])})
		.keypress(ref_change_handler)));
		
		$('.ref_table').append(t_row);
	}
	
}

function ref_change_handler(evt)
{
	//Compatibility code - see console.js for details
	var evt = window.event || evt;
	var myKey = (evt.keyCode)? evt.keyCode: evt.charCode;
	
	console.log(myKey);

	if (myKey == 13)
	{
		evt.preventDefault();
		ref_table_popup_handler();
	}
}

function ref_table_popup_handler()
{
	// Update the reference list, then the plot and everything else, really

	for (var s = 0; s < atom_set.speciesno; ++s)
	{
		var lab = atom_set.atom_species_labels[s];
		reference_list[lab] = parseFloat($('#ref_input_' + lab).val());		
	}

	//reset_scale('x');
	//reset_scale('y');
	redraw_all();

}

function compile_lists()
{
	var atom_raw_list = data_set['atoms']['atom'];
	var ms_raw_list   = data_set['magres']['ms'];	
	var dip_raw_list   = data_set['magres']['dip'];
	var isc_raw_list   = data_set['magres']['isc']; // This will be null if there are no isc

	// Compile an id-by-species and a label-by-id list
	for(var i=0; i < atom_raw_list.length; ++i)
	{
		var a = atom_raw_list[i];
		if (a.label in species_id_list)
			species_id_list[a.label].push(a.id);
		else
			species_id_list[a.label] = [a.id];

		id_label_list[a.id] = a.label + '_' + a.index;
	}

	// Now an ms-by-id one
	for (var i=0; i < ms_raw_list.length; ++i)
	{
		var ms = ms_raw_list[i];
		id_ms_list[ms.atom_id] = ms.mview_data[0];
	}

	// Now a dip-by-id one. Each id only contains the pairing with the ids higher or equal
	for (var i=0; i < dip_raw_list.length; ++i)
	{
		var dip = dip_raw_list[i];
		var min_id = Math.min(dip.atom1_id, dip.atom2_id);
		var max_id = Math.max(dip.atom1_id, dip.atom2_id);

		if (!(min_id in id_dip_list))
			id_dip_list[min_id] = {};

		if (!(min_id in id_r_list))
			id_r_list[min_id] = {};

		id_dip_list[min_id][max_id] = dip.mview_data[0];
		id_r_list[min_id][max_id]   = dip.r;

	}

	// Now an isc_by_id one. Same rules as for the dip one apply
	if (isc_raw_list != null)
	{
		for (var i=0; i < isc_raw_list.length; ++i)
		{
			var isc = isc_raw_list[i];
			var min_id = Math.min(isc.atom1_id, isc.atom2_id);
			var max_id = Math.max(isc.atom1_id, isc.atom2_id);

			if (!(min_id in id_isc_list))
				id_isc_list[min_id] = {};

			id_isc_list[min_id][max_id] = isc.mview_data[0];

		}
	}
	else
	{
		// Disable the related option in psize_coup
		$('#psize_coup').find('#isc_opt').attr('disabled', true)
	}
}

function update_species()
{

	$('.sel_species').empty();

	for (i=0; i < atom_set.speciesno; ++i)
	{
		var new_opt = $('<option/>')
		.attr('value', atom_set.atom_species_labels[i])
		.html(atom_set.atom_species_labels[i]);

		$('.sel_species').append(new_opt);
	}

}

function sel_order_handler()
{
	reset_scale('x');
	reset_scale('y');
	redraw_all();
}

function sel_species_handler(axis)
{
	reset_scale(axis);
	redraw_all();
}

function reset_scale(axis)
{	
	// Invalid value
	if (['x', 'y'].indexOf(axis) < 0)
		return;

	var sp = $('#sel_species_' + axis).val();
	var q = $('#sel_order').val();

	var min = NaN; 
	var max = NaN;

	// Find minimum and maximum

	for (var i=0; i<species_id_list[sp].length; ++i)
	{
		var id = species_id_list[sp][i];
		var ms = id_ms_list[id];
		ms = isNaN(reference_list[sp])?ms:(reference_list[sp]-ms);
		if (isNaN(min) || ms < min)
			min = ms;
		if (isNaN(max) || ms > max)
			max = ms;
	}
	if (q == 2) {
		// For double quantum we need maximum and minimum on BOTH axes
		var axis2 = {'x': 'y', 'y': 'x'}[axis];
		var sp2 = $('#sel_species_' + axis2).val();

		var min2 = NaN; 
		var max2 = NaN;

		if (sp2 != sp) {
			for (var i=0; i<species_id_list[sp2].length; ++i)
			{
				var id = species_id_list[sp2][i];
				var ms = id_ms_list[id];
				ms = isNaN(reference_list[sp2])?ms:(reference_list[sp2]-ms);
				if (isNaN(min2) || ms < min2)
					min2 = ms;
				if (isNaN(max2) || ms > max2)
					max2 = ms;
			}
		}
		else {
			min2 = min;
			max2 = max;
		}

		console.log(min, min2);
		console.log(max, max2);

		switch(axis) {
			case 'x':
				// The minimum is the absolute minimum, the maximum same
				min = Math.min(min, min2);
				max = Math.max(max, max2);
				break;
			case 'y':
				// The minimum is the sum of the two minima, same for the maximum
				min = min+min2;
				max = max+max2;
				break
		}
					
	}

	axis_0 = Math.ceil(max);
	axis_1 = Math.floor(min);

	axis_scales[axis] = [axis_0, axis_1];

	$('#'+axis+'_0_val').val(axis_scales[axis][0]);
	$('#'+axis+'_1_val').val(axis_scales[axis][1]);
}

function dndrop_init()
{	
	$('#image_div').on("dragover", function(e) {
        e.preventDefault();
	    e.stopPropagation();
    });
	$('#image_div').on("drop", function(e) {
        e.preventDefault();
	    e.stopPropagation();
		var dummy_evt = {'target': e.originalEvent.dataTransfer};
		load_image_file(dummy_evt);
	});
}

function axes_scale_handler(evt)
{
	//Compatibility code - see console.js for details
	evt = window.event || evt;
	var myKey = (evt.keyCode)? evt.keyCode: evt.charCode;
	
	if (myKey == 13)
	{
		axis_scales['x'][0] = parseFloat($('#x_0_val').val());
		axis_scales['x'][1] = parseFloat($('#x_1_val').val());
		axis_scales['y'][0] = parseFloat($('#y_0_val').val());
		axis_scales['y'][1] = parseFloat($('#y_1_val').val());

		redraw_all();
	}
}

function load_image_file(evt) {

	// Check for the various File API support.
	if (window.File && window.FileReader && window.FileList && window.Blob) {
	  // Huge success! All the File APIs are supported.
	} else {
	  alert("The File APIs are not fully supported in this browser. Please load your files using the console");
	  return;
	}

	var to_load = evt.target.files[0];

	var image_rdr = new FileReader();

	image_rdr.onloadend = function() {

		$('.dragbox_div').css('display', 'none')

		// Get image size

		$('<img/>').attr('src', this.result).load(function() {

			var w = this.width;
			var h = this.height;

			// Check that the sizes are okay, if they're too big resize

			if (w > max_img_width)
			{
				h = h*max_img_width/w;
				w = max_img_width;
			}
			if (h > max_img_height)
			{
				w = w*max_img_height/h;
				h = max_img_height;
			}

			clean_up_svg(w, h)
			.insert('image', '.plot_area')
			.attr({'xlink:href': $(this).attr('src'),
			'width': w,
			'height': h});

			// Now do the plot

			redraw_all();


		});

	}

	image_rdr.readAsDataURL(to_load);

}

function create_empty_plot() {

	var w = parseInt($('#create_w').val());
	var h = parseInt($('#create_h').val());

	// If someone wrote something that doesn't make sense, let's get outta here

	if (isNaN(w) || isNaN(h))
	{
		alert("Invalid values for new image size");
		return;
	}

	if (w > max_img_width || h > max_img_height)
	{
		alert("New image size must be smaller than " + max_img_width + "x" + max_img_height);
		return;
	}

	clean_up_svg(w, h);
	redraw_all();

}

function clean_up_svg(w, h)
{
	var imdiv_w = $('#image_div').width();
	var imdiv_h = $('#image_div').height();

	$('.dragbox_div').css('display', 'none')

	var main_plot = d3.select('#main_plot')
	.html('')
	.style('display', 'inline')
	.style({'width': w,
	'height': h,
	'top': (imdiv_h-h)/2.0,
	'left': (imdiv_w-w)/2.0,});

	// This fix is needed for webkit based browsers to redraw the whole thing and not render the thing in a buggy way when changing sizes.
	// On the matter of why it works I must quote stackoverflow user Charlie Martin:
	// << I tried everything above this, but only this one worked for me. WTF webkit! This is not computer science! This is black magic!>>
	//
	// ...indeed, Charlie. Indeed.

	$('#image_div').css('display', 'none').height();
	$('#image_div').css('display', 'block');

	// Applying margins for the plot

	gw = w*(1.0-2.0*default_border);
	gh = h*(1.0-2.0*default_border);

	main_plot
	.append("g")
	.attr("width", gw)
	.attr("height", gh)
    .attr("transform", "translate(" + w*default_border + "," + h*default_border + ")")
    .classed("plot_area", true);

	// Reset axis vector definitions

	axis_points.x.p0 = [0, gh];
	axis_points.x.range = [0, gw];
	axis_points.x.angle = 0.0;

	axis_points.y.p0 = [0, 0];
	axis_points.y.range = [gh, 0];
	axis_points.y.angle = 0.0;

	draw_axis('x');
	draw_axis('y');

	return main_plot;

}

function draw_axis(axis)
{
	console.log("(Re-)Drawing " + axis);

	// Leave if the plot isn't visible already

	if ($('#main_plot').css('display') == 'none')
		return;

	// Or if this axis isn't visible, because then who cares
	if (!axes_visibility_handler(axis))
		return;

	//var width = $("#main_plot").width()*(1.0-2.0*default_border);
	//var height = $("#main_plot").height()*(1.0-2.0*default_border);

	var plot_area = d3.select('#main_plot').select('.plot_area');
	var width = plot_area.attr('width');
	var height = plot_area.attr('height');

	var ax = d3.scale.linear().domain(axis_scales[axis]).range(axis_points[axis].range);
    var fullAxis = d3.svg.axis().scale(ax).ticks(4).orient({'x': "bottom", 'y': "left"}[axis]);
    var axisLabel = $("#sel_species_" + axis).val() + " (" + (axis=='x'? "1" : $("#sel_order").val()) + "Q, ppm)";

    ax_sel =plot_area.select('.'+axis+'.axis');

    // If not present, create it
    if (ax_sel.empty())
	    ax_sel = d3.select('#main_plot').select('g').append('g').attr("class", axis+" axis");

	ax_sel
      .attr("transform", "translate( "+ axis_points[axis].p0[0] + "," + axis_points[axis].p0[1] + " )")
      .call(fullAxis);

   	// Now the label

   	axlab_sel = plot_area.select('.'+axis+'.axislabel');

   	if (axlab_sel.empty())
	   	axlab_sel = d3.select('#main_plot').select('g').append('text').attr('class', axis+' axislabel');

	// Calculate label positions
	ax_bbox = ax_sel.node().getBBox();
	lab_x = axis_points[axis].p0[0] + ax_bbox.x + (axis=='x'?1:-1)*ax_bbox.width/2.0;
	lab_y = axis_points[axis].p0[1] + ax_bbox.y + (axis=='x'?3:1)*ax_bbox.height/2.0;

	axlab_sel
		.attr("transform", "translate(" + 
				lab_x + "," + lab_y + ")" +
			" rotate(" + {'x': 0, 'y': -90}[axis] + ")")
		.html(axisLabel);
}

function axes_visibility_handler(axis)
{
	// Changes visibility for an axis
	var vis = $('#display_' + axis + '_ax').prop('checked');
	var plot = d3.select('#main_plot');

	plot.selectAll('.' + axis + '.axis').attr('display', {true: 'inline', false: 'none'}[vis]);
	plot.selectAll('.' + axis + '.axislabel').attr('display', {true: 'inline', false: 'none'}[vis]);

	return vis;
}

function pick_axis(axis)
{
	// Pick an axis by clicking on the main plot

	// First, if the plot isn't even visible, scrap everything

	if ($('#main_plot').css('display') == 'none')
		return;

	// Now set up to pick the first point

	// 0. Preliminary. Disable the button, write a suggestion message

	$('.pick_button').attr('disabled', true);
	$('#main_plot').css('cursor', 'crosshair');
	$('#pick_message').html('Pick the first point for the ' + axis.toUpperCase() + ' axis');

	// 1. Create an indicator

	d3.select('#main_plot')
	.append('circle')
	.classed(axis+'0sel seldot', true)
	.attr({
		'cx': 0,
		'cy': 0,
		'r':  5,
	});

	// 2. Create an event handler to have it follow the mouse

	$('#main_plot').on('mousemove', function(e) {

		var p = $(this).offset();
		var m = ($(this).outerWidth()-$(this).innerWidth())/2

		d3.select('.'+axis+'0sel').attr({
			'cx': e.clientX - p.left - m,
			'cy': e.clientY - p.top - m,
		});

	});

	// 3. And another to control the effect of a click

	$('#main_plot').on('click', function(e) {

		var p = $(this).offset();
		var m = ($(this).outerWidth()-$(this).innerWidth())/2
		var p_rel = $(this).find('.plot_area').attr('transform');

		// Set the p0 of the currently used axis to the relevant value

		axis_points[axis].p0 = [e.clientX - d3.transform(p_rel).translate[0] - p.left - m,
		e.clientY - d3.transform(p_rel).translate[1] - p.top - m];

		$('#main_plot').off('click');
		$('#main_plot').off('mousemove');

		$('#pick_message').html('Pick the second point for the ' + axis.toUpperCase() + ' axis');

		// 4. Now reset: second seldot, and new callbacks

		d3.select('#main_plot')
		.append('circle')
		.classed(axis+'1sel seldot', true)
		.attr({
			'cx': e.clientX - p.left - m,
			'cy': e.clientY - p.top - m,
			'r': 5,			
		});

		$('#main_plot').on('mousemove', function(e) {

			var p = $(this).offset();
			var m = ($(this).outerWidth()-$(this).innerWidth())/2

			switch(axis)
			{
				case 'x':
					d3.select('.x1sel').attr({
						'cx': e.clientX - p.left - m,
					});
					break;			
				case 'y':
					d3.select('.y1sel').attr({
						'cy': e.clientY - p.top - m,
					});
					break;
				default:
					break;
			}

		});

		$('#main_plot').on('click', function(e) {

			// Yo dawg I heard you like callbacks

			var p = $(this).offset();
			var m = ($(this).outerWidth()-$(this).innerWidth())/2
			var p_rel = $(this).find('.plot_area').attr('transform');

			var rx = e.clientX - p.left - m - d3.transform(p_rel).translate[0];
			var ry = e.clientY - p.top - m - d3.transform(p_rel).translate[1];
			axis_points[axis].range = {
				'x': [0.0, rx-axis_points[axis].p0[0]],
				'y': [0.0, ry-axis_points[axis].p0[1]]
			}[axis];

			$('#main_plot').off('click');
			$('#main_plot').off('mousemove');

			d3.selectAll('.seldot').remove();

			draw_axis(axis);
			plot_data();

			$('#pick_message').html('');
			$('#main_plot').css('cursor', 'initial');
			$('.pick_button').attr('disabled', false);

		});


	});


}

function psize_slide_handler()
{
	var val = $('#psize_slide').val();
	$('#psize_val').html(val);
	val = $('#psize_opcty').val();
	$('#psize_opcty_val').html(val);
	redraw_all();
}

function plot_data()
{
	// The actual plotting function!

	// 1. Compile a list of points to be plotted

	var sp1 = $('#sel_species_x').val();
	var sp2 = $('#sel_species_y').val();

	var q = $('#sel_order').val();

	var datapoints = [];
	var x_lablines   = {};
	var y_lablines   = {};

	var ptype = $('#ptype').val();
	var psize_coup = $('#psize_coup').val();
	var psize = parseFloat($('#psize_slide').val());
	var opcty = parseFloat($('#psize_opcty').val());
	var pcut  = parseFloat($('#psize_cut').val());

	var show_out = $('#pshow_out').prop('checked');

	var max_r = 0;

	var is_homonuclear = (sp1 == sp2);

	for (var i=0; i < species_id_list[sp1].length; ++i)
	{
		var id1 = species_id_list[sp1][i];
		var lab1 = id_label_list[id1];
		var ms1 = id_ms_list[id1];
		ms1 = isNaN(reference_list[sp1])?ms1:(reference_list[sp1]-ms1);

		var start_j = is_homonuclear? i : 0;

		var any_r = false; // Keep track if there's a need for an x labline on this specific value of x
		// - namely, if r > 0.0 for any of the corresponding y points

		for (var j=start_j; j < species_id_list[sp2].length; ++j)
		{
			var id2 = species_id_list[sp2][j];
			var lab2 = id_label_list[id2];
			var ms2 = id_ms_list[id2];
			ms2 = isNaN(reference_list[sp2])?ms2:(reference_list[sp2]-ms2);

			var r = 0;
			var idmin = Math.min(id1, id2);
			var idmax = Math.max(id1, id2);
			if (idmin != idmax)
			{
				switch(psize_coup)
				{
					case 'dip':
						r = Math.abs(id_dip_list[idmin][idmax]);
						break;
					case 'isc':
						r = Math.abs(id_isc_list[idmin][idmax]);
						break;
					default:
						r = 1.0;
						break;
				}
				// Remove the point if it's beyond cutoff though
				if (!isNaN(pcut) && id_r_list[idmin][idmax] > pcut)
					r = 0.0;
				if (r > max_r)
					max_r = r;
			}
			else
			{
				r = NaN;
			}

			if (q == 1)
			{
				datapoints.push({'msx': ms1, 'msy': ms2, 'r': r});
				if (r > 0)
					y_lablines[lab2] = {'ms': ms2, 'lab': lab2};				
				if (is_homonuclear) {
					datapoints.push({'msx': ms2, 'msy': ms1, 'r': r});
					if (r > 0) {
						y_lablines[lab1] = {'ms': ms1, 'lab': lab1};				
						x_lablines[lab2] = {'ms': ms2, 'lab': lab2};				
					}
				}

			}
			else if (q == 2)
			{
				// No diagonal points
				if (is_homonuclear && i == j)
					continue;
				datapoints.push({'msx': ms1, 'msy': ms1+ms2, 'r': r});
				datapoints.push({'msx': ms2, 'msy': ms1+ms2, 'r': r});
				if (r > 0) {
					y_lablines[lab1+"+"+lab2] = {'ms': ms1+ms2, 'lab': lab1 + "+" + lab2};				
					x_lablines[lab2] = {'ms': ms2, 'lab': lab2};
				}
			}

			any_r = any_r || (r > 0);

		}

		if (any_r)
			x_lablines[lab1] = {'ms': ms1, 'lab': lab1};

	}

	// 1.5 Normalize the r values to psize

	if (max_r == 0)
	{
		// No points visualized! Set it to 1 to avoid dividing by zero
		max_r = 1;
	}

	for (var i = 0; i < datapoints.length; ++i)
	{
		datapoints[i].r *= psize/max_r;
		if (isNaN(datapoints[i].r))
			datapoints[i].r = psize;
		else if (datapoints[i].r <= 0.5)
			datapoints[i].r = 0;
	}

	// 2. Do the plotting

	var x = d3.scale.linear().domain(axis_scales.x).range(axis_points.x.range);
	var y = d3.scale.linear().domain(axis_scales.y).range(axis_points.y.range);

	var plot_sel = d3.select('.plot_area')
	.selectAll('.plotdot')
	.data(datapoints);

	switch(ptype)
	{
		case 'cross':

			// .enter	
			plot_sel.enter()
			.append('path')
			.classed('plotdot', true)
			.attr('d', function(d) {
				return cross_path(0, axis_points.y.range[0], 0);
			});

			// .update
			plot_sel
			.transition()
			.duration(800)
			.style('opacity', function(d) {
				if (!show_out) {
					if (!(is_between(d.msx, axis_scales.x)) || !(is_between(d.msy, axis_scales.y)) || d.r == 0.0)
					{
						return 0.0;
					}
				}
				return opcty;
			})
			.attr('d', function(d) {
				return cross_path(x(d.msx), y(d.msy), d.r);
			})
			.attr("transform", "translate( "+ axis_points.x.p0[0] + "," + axis_points.y.p0[1] + " )");

			// .exit
			plot_sel.exit()
			.transition()
			.duration(800)
			.style('opacity', 0.0)
			.remove();

			break;
		case 'circle':
		case 'dot':
			// .enter	
			plot_sel.enter()
			.append('circle')
			.classed('plotdot', true)
			.attr('cx',  0 )
			.attr('cy',  axis_points.y.range[0])
			.attr('r', 0);

			// .update
			plot_sel
			.transition()
			.duration(800)
			.style('opacity', function(d) {
				if (!show_out) {
					if (!(is_between(d.msx, axis_scales.x)) || !(is_between(d.msy, axis_scales.y)) || d.r == 0.0)
					{
						return 0.0;
					}
				}
				return opcty;
			})
			.attr('cx',  function(d) { return x(d.msx);} )
			.attr('cy',  function(d) { return y(d.msy);} )
			.attr('r',   function(d) { return d.r;     } )
			.attr("transform", "translate( "+ axis_points.x.p0[0] + "," + axis_points.y.p0[1] + " )");

			// .exit
			plot_sel.exit()
			.transition()
			.duration(800)
			.style('opacity', 0.0)
			.remove();

			if (ptype == 'dot')
				plot_sel.classed('fill', true);
			else
				plot_sel.classed('fill', false);

			break;

		default:
			break;
	}

	// 3. Add label dotted lines (if required)

	draw_lablines(x_lablines, y_lablines, x, y, opcty);

}

function draw_lablines(x_lablines_dict, y_lablines_dict, x, y, opcty)
{

	var show_lablines = $('#label_on_check').prop('checked');
	var show_out = $('#pshow_out').prop('checked');

	// Here for convenience lablines are prepared as tables/dictionaries, but we will convert them to arrays now

	x_lablines = [];
	y_lablines = [];

	for (i in x_lablines_dict)
		x_lablines.push(x_lablines_dict[i]);
	for (i in y_lablines_dict)
		y_lablines.push(y_lablines_dict[i]);

	console.log(x_lablines);

	var x_lablines_sel = d3.select('.plot_area')
	.selectAll('.x.lablines')
	.data(x_lablines);

	// .enter
	x_lablines_sel.enter()
	.append('line')
	.classed('x lablines', true)
	.attr('x1', 0)
	.attr('y1', axis_points.y.range[0])
	.attr('x2', 0)
	.attr('y2', axis_points.y.range[0]);

	// .update
	x_lablines_sel
	.transition()
	.duration(800)
	.style('opacity', function(d) {

		if (!show_out) {
					if (!(is_between(d.ms, axis_scales.x)))
					{
						return 0.0;
					}
		}

		return opcty*show_lablines;
	})
	.attr('x1', function(d) {return x(d.ms);})
	.attr('y1', function(d) {return axis_points.y.range[0];})
	.attr('x2', function(d) {return x(d.ms);})
	.attr('y2', function(d) {return axis_points.y.range[1];})
	.attr("transform", "translate( "+ axis_points.x.p0[0] + "," + axis_points.y.p0[1] + " )");

	// .exit
	x_lablines_sel
	.exit()
	.transition()
	.duration(800)
	.style('opacity', 0.0)
	.remove();

	var x_labtext_sel = d3.select('.plot_area')
	.selectAll('.x.labtext')
	.data(x_lablines);

	// .enter
	x_labtext_sel.enter()
	.append('text')
	.classed('x labtext', true)
	.attr('x', 0)
	.attr('y', axis_points.y.range[1])

	// .update
	x_labtext_sel
	.html(function(d) {return d.lab;})
	.attr('transform', function(d) {return 'rotate(-90 0,0)';})
	.transition()
	.duration(800)
	.style('opacity', function(d) {

		if (!show_out) {
					if (!(is_between(d.ms, axis_scales.x)))
					{
						return 0.0;
					}
		}

		return 1.0*show_lablines;
	})
	.attr('transform', function(d) {return ' translate(' + (x(d.ms) + axis_points.x.p0[0]) + ',' + (axis_points.y.range[1] + axis_points.y.p0[1]) + ') rotate(-90 0,0)';});

	// .exit
	x_labtext_sel
	.exit()
	.transition()
	.duration(800)
	.style('opacity', 0.0)
	.remove();

	var y_lablines_sel = d3.select('.plot_area')
	.selectAll('.y.lablines')
	.data(y_lablines);

	// .enter
	y_lablines_sel.enter()
	.append('line')
	.classed('y lablines', true)
	.attr('x1', 0)
	.attr('y1', axis_points.y.range[0])
	.attr('x2', 0)
	.attr('y2', axis_points.y.range[0]);

	// .update
	y_lablines_sel
	.transition()
	.duration(800)
	.style('opacity', function(d) {

		if (!show_out) {
					if (!(is_between(d.ms, axis_scales.y)))
					{
						return 0.0;
					}
		}

		return opcty*show_lablines;
	})
	.attr('x1', function(d) {return axis_points.x.range[0];})
	.attr('y1', function(d) {return y(d.ms);})
	.attr('x2', function(d) {return axis_points.x.range[1];})
	.attr('y2', function(d) {return y(d.ms);})
	.attr("transform", "translate( "+ axis_points.x.p0[0] + "," + axis_points.y.p0[1] + " )");

	// .exit
	y_lablines_sel
	.exit()
	.transition()
	.duration(800)
	.style('opacity', 0.0)
	.remove();

	var y_labtext_sel = d3.select('.plot_area')
	.selectAll('.y.labtext')
	.data(y_lablines);

	// .enter
	y_labtext_sel.enter()
	.append('text')
	.classed('y labtext', true)
	.attr('x', axis_points.x.range[1])
	.attr('y', axis_points.y.range[0]);

	// .update
	y_labtext_sel
	.html(function(d) {return d.lab;})
	.transition()
	.duration(800)
	.style('opacity', function(d) {

		if (!show_out) {
					if (!(is_between(d.ms, axis_scales.y)))
					{
						return 0.0;
					}
		}

		return 1.0*show_lablines;
	})
	.attr('x', axis_points.x.range[1])
	.attr('y', function(d) {return y(d.ms);})
	.attr("transform", "translate( "+ axis_points.x.p0[0] + "," + axis_points.y.p0[1] + " )");

	// .exit
	y_labtext_sel
	.exit()
	.transition()
	.duration(800)
	.style('opacity', 0.0)
	.remove();
}

function redraw_all()
{
	// First, if the plot isn't even visible, scrap everything

	if ($('#main_plot').css('display') == 'none')
		return;

	draw_axis('x');
	draw_axis('y');
	plot_data();

}

function svg_download()
{
	// Put everything in URI form associated with the download button

	var svg_to_save = $('#main_plot').clone().prepend($('<style>').html($('.svgstyle_box').html()));

	svg_to_save.find('.lablines').filter(function() { console.log($(this).css('opacity')); return $(this).css('opacity') == 0.0;}).remove();
	svg_to_save.find('.labtext').filter(function() { console.log($(this).css('opacity')); return $(this).css('opacity') == 0.0;}).remove();
	svg_to_save.find('.plotdot').filter(function() { console.log($(this).css('opacity')); return $(this).css('opacity') == 0.0;}).remove();

	/*
	$('.download_button')
	.attr('target', '_blank')
	.attr('download', 'nmr2d.svg')
	.attr('href', "data:text/plain," + 
	$('<div>').append(svg_to_save).html()
	.replace(/%/g, '%25')			//The % symbol must be replaced first, or everything goes down the drain!
	.replace(/\n/g, '%0A')
	.replace(/\t/g, '%09')
	.replace(/&/g, '%26')
	.replace(/#/g, '%23')
	.replace(/"/g, '%22')
	.replace(/'/g, '%27'));
	*/

	// Testing pdf generation functionality here

	var scale = 72.0/96.0;		// Pixel/pt ratio
	var svg = $('#main_plot');
	var w = svg.width()*scale;
	var h = svg.height()*scale;
	var pdf = new jsPDF('p', 'pt', [w, h]);
    pdf.addSVG(svg.get(0), 0, 0, {
	    scale: scale, // this is the ratio of px to pt units
	    removeInvalid: true // this removes elements that could not be translated to pdf from the source svg
    });

    $('.download_button')
		.attr('target', '_blank')
		.attr('download', 'nmr2d.pdf')
		.attr('href', pdf.output('datauristring')
			.replace(/%/g, '%25')			//The % symbol must be replaced first, or everything goes down the drain!
			.replace(/\n/g, '%0A')
			.replace(/\t/g, '%09')
			.replace(/&/g, '%26')
			.replace(/#/g, '%23')
			.replace(/"/g, '%22')
			.replace(/'/g, '%27'));	

	return true;

}

function set_theme()
{
	// Check the theme from the original window
	var current_theme = window.opener.current_theme;

	// Change the color of the page
	$('body').removeClass("theme_light theme_dark");
	$('body').addClass("theme_" + current_theme);

	// Now on to changing the jQuery theme
	$('#jqueryUI_style').attr('href', '../jquery/css/theme_' + current_theme + '/jquery-ui.css');

}

function ptype_handler(e)
{
	d3.select('.plot_area')
	.selectAll('.plotdot')
	.remove();

	redraw_all();
}

function psize_cut_on_handler(evt)
{
	if ($('#psize_cut_on').prop('checked'))
	{
		$('#psize_cut').attr('disabled', false);
		$('#psize_cut').val('10');		
	}
	else
	{
		$('#psize_cut').attr('disabled', true);
		$('#psize_cut').val('N/A');				
	}	

	redraw_all();
}

function psize_cut_handler(evt)
{
	//Compatibility code - see console.js for details
	evt = window.event || evt;
	var myKey = (evt.keyCode)? evt.keyCode: evt.charCode;

	if (myKey == 13)
	{
		redraw_all();
	}
}

// Very simple utility functions

function is_between(x, xrange)
{
	var min = Math.min(xrange[0], xrange[1]);
	var max = Math.max(xrange[0], xrange[1]);

	return (x >= min) && (x <= max);
}

function cross_path(cx, cy, r)
{
	return 'M' + (cx-r) + ' ' + (cy) + ' L' + (cx+r) + ' ' + (cy) + ' M' + (cx) + ' ' + (cy-r) + ' L' + (cx) + ' ' + (cy+r); 
}