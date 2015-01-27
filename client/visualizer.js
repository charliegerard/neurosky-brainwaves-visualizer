require(
	['typecast', 'frame', 'model', 'socket.io',
	    'css!/base/bootstrap/bootstrap.min.css',
        'css!stylist/style.css', 'dc'
        //    /bootstrap/bootstrap-responsive.min.css
		//    /stylist/layout.css
		//    /stylist/forms.css
		//    /bootstrap/font-awesome.min.css
	],
	function(type, Frame, Model, io, lscache, moment) {
		console.log('I AM HEEEEEEERE')

	// Create a data model for the data coming in
	var MindEvent = Model({
		eSense: {
			attention: 0,
			meditation: 0
		},
		eegPower: {
			delta: 0,
			theta: 0,
			lowAlpha: 0,
			highAlpha: 0,
			lowBeta: 0,
			highBeta: 0,
			lowGamma: 0,
			highGamma: 0
		},
		poorSignalLevel: 0,
		blinkStrength: 0
	});

	// Basic Application
	// socket working!
	var socket = io.connect();
	console.log(socket)

	socket.on('connect', function (data) {
		console.log("web socket connected");
	});

	// $('body').append('<div id="screen"></div>');

	// var $screen = $('#screen');

	// $screen
	// 	.css({
	// 		height: $(window).height() -100,
	// 		width: $(window).width() -50,
	// 		padding: '20px 30px',
	// 		margin: 'auto',
	// 		'margin-top': 50
	// 	})
	// 	.html('<div class="display full scroll"></div>');


	socket.on('mindEvent', function (data) {
		console.log(data)

		var graph = dc.pieChart('#graph');

		var facts = crossfilter(data);

		var all = facts.groupAll();

		var testGraph = facts.dimension(function(d){
			console.log('DDDDDD', d)
			return d.eSense.attention
		})

		var testGraphGroup = testGraph.groupAll();

		graph.width(200)
		.height(195)
		.radius(95)
		.innerRadius(60)
		.dimension(testGraph)
		.group(testGraphGroup, function(d){ return d.key});
	});

	dc.renderAll();

});