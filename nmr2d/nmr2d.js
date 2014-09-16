var data_set = {};
var speciesno = 0;
var atom_species_labels = [];

function document_ready_callback() {

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

    speciesno = window.opener.atom_set.speciesno;
    atom_species_labels = window.opener.atom_set.atom_species_labels;

    window.opener.init_data_set(data_set);
    window.opener.compile_data_set(data_set, {'t': 'all'}, true);

	dndrop_init();
	dataset_loaded_callback();

}

function dataset_loaded_callback() {

	// Detect species and update the dropdown menus



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

			var imdiv_w = $('#image_div').width();
			var imdiv_h = $('#image_div').height();

			var w = this.width;
			var h = this.height;

			d3.select('#main_plot')
			.style('display', 'inline')
			.style({'width': w,
			'height': h,
			'top': (imdiv_h-h)/2.0,
			'left': (imdiv_w-w)/2.0,})
			.append('image')
			.attr({'xlink:href': $(this).attr('src'),
			'width': w,
			'height': h});


		});


	}

	image_rdr.readAsDataURL(to_load);


}

function create_empty_plot() {

	var imdiv_w = $('#image_div').width();
	var imdiv_h = $('#image_div').height();

	var w = parseInt($('#create_w').attr('value'));
	var h = parseInt($('#create_h').attr('value'));

	// If someone wrote something that doesn't make sense, let's get outta here

	if (isNaN(w) || isNaN(h))
		return;

	$('.dragbox_div').css('display', 'none')

	d3.select('#main_plot')
	.style('display', 'inline')
	.style({'width': w,
	'height': h,
	'top': (imdiv_h-h)/2.0,
	'left': (imdiv_w-w)/2.0,});

}