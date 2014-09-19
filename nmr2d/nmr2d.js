var data_set = {};
var atom_set = {};


var axis_limits = {'x': [[0.0, 0.0], [1.0, 0.0]], 'y': [[0.0, 0.0], [0.0, 1.0]]};
var axis_scales = {'x': [0.0, 0.0], 'y': [0.0, 0.0]};

var default_border = 0.1	// Default ratio between bordered thickness and full area

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
				console.log(id);
				console.log(ms_list[j]['atom_id']);
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

			clean_up_svg(w, h)
			.append('image')
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
		return;

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

	// Resetting the points defining the corners of the plotting area, based on the default border

	axis_limits['x'][0] = [w*default_border, h*(1.0-default_border)];
	axis_limits['x'][1] = [w*(1.0-default_border), h*(1.0-default_border)];
	axis_limits['y'][0] = [w*default_border, h*default_border];
	axis_limits['y'][1] = [w*default_border, h*(1.0-default_border)];

	return main_plot;

}

function draw_axis(axis, update)
{
	// Leave if the plot isn't visible already

	if ($('#main_plot').css('display') == 'none')
		return;

	var plot = d3.select('#main_plot');
	var linestyle = {
		'stroke': 'rgb(255,128,0)',
		'stroke-width': 3,
		'stroke-linecap': 'round',
	};

	var axis_i = ['x', 'y'].indexOf(axis);
	var not_axis = {'x': 'y', 'y': 'x'}[axis];

	if ($('#display_'+axis+'_ax').prop('checked'))
	{
		// Draw axis

		// New or updating?

		if (update)
			axis_sel = plot.select(axis+'_axis')
		else
			axis_sel = plot.append('line')

		axis_sel.attr({
			'class': axis+'_axis axis',
			'x1': axis_limits[axis][0][0],
			'x2': axis_limits[axis][1][0],
			'y1': axis_limits[axis][0][1],
			'y2': axis_limits[axis][1][1]
		})
		.style(linestyle);

		// Draw min and max values and labels

		var labels = [''+axis_scales[axis][axis_i], $('#sel_species_'+axis).val() + ' (' + $('#sel_order_'+axis).val() + 'Q, ppm)', ''+axis_scales[axis][1-axis_i]];
		var lab_range = d3.scale.ordinal()
		.domain(labels)
		.rangeRoundBands([axis_limits[axis][0][axis_i], (axis_limits[axis][1][axis_i]/2.0*3.0)]);

		if (update)
			label_sel = plot.selectAll('.'+axis+'_label').data(labels)
		else
			label_sel = plot.selectAll('.'+axis+'_label').data(labels).enter()

		.append('text')
		.attr({
			'class': axis+'_label label',
			'fill': 'rgb(255,128,0)',
			'font-size': '11pt',
		})
		.attr(not_axis, axis_limits[axis][0][1-axis_i]+(1-2*axis_i)*18.0)
		.attr(axis, function(d) {return lab_range(d)-12.0;})
		.attr('transform', function(d) {return 'rotate(-' +(90*axis_i) + ' ' + (axis_limits[axis][0][1-axis_i]+(1-2*axis_i)*18.0) + ',' + (lab_range(d)-12.0) + ')';})
		.html(function(d) {return d;});
	}

}