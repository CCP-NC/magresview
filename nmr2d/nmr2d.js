var data_set = {};
var atom_set = {};

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

    // Get the maximum size for an image

    max_img_width = Math.floor($("#image_div").width()*max_img_width);
    max_img_height = Math.floor($("#image_div").height()*max_img_height);

	dndrop_init();
	update_species();
	reset_scale('x');
	reset_scale('y');	

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

function reset_scale(axis)
{	
	// Invalid value
	if (['x', 'y'].indexOf(axis) < 0)
		return;

	var sp = $('#sel_species_' + axis).val();

	var min = NaN; 
	var max = NaN;

	// Find minimum and maximum

	var atom_list = data_set['atoms']['atom'];
	var ms_list   = data_set['magres']['ms'];

	for (var i=0; i < atom_list.length; ++i)
	{
		if (atom_list[i]['label'] == sp)
		{
			var id = parseInt(atom_list[i]['id']);
			for (var j=0; j < ms_list.length; ++j)
			{
				if (ms_list[j]['atom_id'] == id)
				{
					if (isNaN(min) || ms_list[j]['mview_data'][0] < min)
					{
						min = ms_list[j]['mview_data'][0];
					}
					if (isNaN(max) || ms_list[j]['mview_data'][0] > max)
					{
						max = ms_list[j]['mview_data'][0];
					}
				}
			}
		}
	}

	axis_scales[axis] = [Math.floor(min), Math.ceil(max)];

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

		draw_axis('x');
		draw_axis('y');
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
			.insert('image', 'g')
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
    .attr("transform", "translate(" + w*default_border + "," + h*default_border + ")");

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

	var plot_area = d3.select('#main_plot').select('g');
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

