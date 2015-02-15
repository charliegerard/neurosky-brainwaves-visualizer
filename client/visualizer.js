require(
	['typecast', 'frame', 'model', 'socket.io',
	    'css!/base/bootstrap/bootstrap.min.css',
        'css!stylist/style.css', 'dc'
	],
	function(type, Frame, Model, io, lscache, moment) {

	brainData = {
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
			}
			// ,
			// poorSignalLevel: 0,
			// blinkStrength: 0
			// }
		};

	var socket = io.connect();

	socket.on('connect', function (data) {
		console.log("web socket connected");
	});

	socket.on('mindEvent', function (datatest) {
		brainData = datatest
	});

	console.log('data', brainData.eSense);

	$('body').append('<div id="screen"></div>');

	var t = -1;
	var z = -5;
    var n = 300;
    var v = 0;
    var data = d3.range(n).map(test);

    function test(){
    	if(brainData.eSense != undefined){
	    	return {
		    	attention: brainData.eSense.attention,
		    	time: ++t
	    	}
	    } else {
	    	return {
		    	attention: 0,
		    	time: ++t
	    	}
	    }
    }

    var margin = {top: 10, right: 10, bottom: 20, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x = d3.scale.linear()
        .domain([0, n - 1])
        .range([0, width]);

    var y = d3.scale.linear()
        .domain([0, 200])
        .range([height, 0]);

    var line = d3.svg.line()
        .x(function(d, i) { console.log("this is line d value", d.time);
        	return x(d.time); })
        .y(function(d, i) { return y(d.attention); });

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var graph = g.append("svg")
        .attr("width", width)
        .attr("height", height + margin.top + margin.bottom);

    var xAxis = d3.svg.axis().scale(x).orient("bottom");
    var axis = graph.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    g.append("g")
        .attr("class", "y axis")
        .call(d3.svg.axis().scale(y).orient("left"));

	var path = graph.append("g")
		.append("path")
		.data([data])
		.attr("class", "line")
		.attr("d", line);

    tick();

    function tick() {
        // push a new data point onto the back
        data.push(test());

        // update domain
        x.domain([t - n, t]);

        // redraw path, shift path left
        // console.log("this is line", line.y)

        path
            .attr("d", line)
            .attr("transform", null)
            .transition()
            .duration(500)
            .ease("linear")
            // .attr("transform", "translate(" + t - 1 + ")")
            .each("end", tick);

        // shift axis left
        axis
            .transition()
            .duration(500)
            .ease("linear")
            .call(d3.svg.axis().scale(x).orient("bottom"));

        // pop the old data point off the front
        data.shift();
        console.log('this is data after shift', data)
    }

});