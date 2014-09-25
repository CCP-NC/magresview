var data_set = {};
var atom_set = {};

var species_id_list = {}; 	// Will keep species > ids of all atoms belonging to it
var id_ms_list = {};		// ms classified by id
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
		$(this).css("background-color", "rgb(45,45,45)");
	})	
	.mouseout(function() {
		$(this).css("background-color", "rgb(35,35,35)");
	})

	$('.load_button_fake').click(function() {
		$('.load_button_true').click();
	})

	// Fetch the atomic data from the main MagresView window

    atom_set = window.opener.atom_set;

    window.opener.init_data_set(data_set);
    window.opener.compile_data_set(data_set, {'t': 'all'}, true);

    compile_lists();

    // Get the maximum size for an image

    max_img_width = Math.floor($("#image_div").width()*max_img_width);
    max_img_height = Math.floor($("#image_div").height()*max_img_height);

	dndrop_init();
	update_species();
	reset_scale('x');
	reset_scale('y');	

}

function compile_lists()
{
	var atom_raw_list = data_set['atoms']['atom'];
	var ms_raw_list   = data_set['magres']['ms'];
	var dip_raw_list   = data_set['magres']['dip'];
	var isc_raw_list   = data_set['magres']['isc']; // This will be null if there are no isc

	// Compile an id-by-species list
	for(var i=0; i < atom_raw_list.length; ++i)
	{
		var a = atom_raw_list[i];
		if (a.label in species_id_list)
			species_id_list[a.label].push(a.id);
		else
			species_id_list[a.label] = [a.id];
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

		id_dip_list[min_id][max_id] = dip.mview_data[0];

	}

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
	var q  = $('#sel_order_' + axis).val();

	var min = NaN; 
	var max = NaN;

	// Find minimum and maximum

	for (var i=0; i< species_id_list[sp].length; ++i)
	{
		var id = species_id_list[sp][i];
		var ms = id_ms_list[id];
		if (isNaN(min) || ms < min)
			min = ms;
		if (isNaN(max) || ms > max)
			max = ms;
	}

	axis_scales[axis] = [Math.floor(min*q), Math.ceil(max*q)];

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

	//var width = $("#main_plot").width()*(1.0-2.0*default_border);
	//var height = $("#main_plot").height()*(1.0-2.0*default_border);

	var plot_area = d3.select('#main_plot').select('.plot_area');
	var width = plot_area.attr('width');
	var height = plot_area.attr('height');

	var ax = d3.scale.linear().domain(axis_scales[axis]).range(axis_points[axis].range);
    var fullAxis = d3.svg.axis().scale(ax).ticks(4).orient({'x': "bottom", 'y': "left"}[axis]);
    var axisLabel = $("#sel_species_" + axis).val() + " (" + $("#sel_order_"+axis).val() + "Q, ppm)";

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

	// This hides immediately the axis upon redrawing if that's the case
	axes_visibility_handler(axis);

}

function axes_visibility_handler(axis)
{
	// Changes visibility for an axis
	var vis = $('#display_' + axis + '_ax').prop('checked');
	var plot = d3.select('#main_plot');

	plot.selectAll('.' + axis).attr('display', {true: 'inline', false: 'none'}[vis]);
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
		'r':  8,
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
			'r': 8,			
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

			/*if (axis == 'x' && rx < axis_points[axis].p0[0])
			{
				axis_points[axis].p0 = [rx, ry];
			}*/

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

function plot_data()
{
	// The actual plotting function!


	// 1. Compile a list of points to be plotted

	var sp1 = $('#sel_species_x').val();
	var sp2 = $('#sel_species_y').val();

	var q1 = $('#sel_order_x').val();
	var q2 = $('#sel_order_y').val();

	var datapoints = [];

	for (var i=0; i < species_id_list[sp1].length; ++i)
	{
		var id1 = species_id_list[sp1][i];
		for (var j=0; j < species_id_list[sp2].length; ++j)
		{
			var id2 = species_id_list[sp2][j];
			datapoints.push({'msx': id_ms_list[id1]*q1, 'msy': id_ms_list[id2]*q2});
		}
	}

	// 2. Do the plotting

	var x = d3.scale.linear().domain(axis_scales.x).range(axis_points.x.range);
	var y = d3.scale.linear().domain(axis_scales.y).range(axis_points.y.range);

	var plot_sel = d3.select('.plot_area')
	.selectAll('.plotdot')
	.data(datapoints);

	// .enter	
	plot_sel.enter()
	.append('circle')
	.classed('plotdot', true)
	.attr('cx',  function(d) { return x(d.msx);} )
	.attr('cy',  function(d) { return y(d.msy);} )
	.attr('r', 4)
	.attr("transform", "translate( "+ axis_points.x.p0[0] + "," + axis_points.y.p0[1] + " )");

	// .update
	plot_sel
	.attr('cx',  function(d) { return x(d.msx);} )
	.attr('cy',  function(d) { return y(d.msy);} )
	.attr('r', 4)
	.attr("transform", "translate( "+ axis_points.x.p0[0] + "," + axis_points.y.p0[1] + " )");

	// .exit
	plot_sel.exit()
	.remove();


}

function redraw_all()
{
	draw_axis('x');
	draw_axis('y');
	plot_data();
}