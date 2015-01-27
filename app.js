var path;

global.PORT = 3000;

var express = require('express')
  , app = express()
  , webserver = app.listen(global.PORT)
  , io = require('socket.io').listen(webserver)
  , path = require("path");

console.log('Listening on port %d', webserver.address().port);

var env = process.env.NODE_ENV || 'development';
if('development' == env){
  app.set('port', process.env.PORT || 3000); // process.env.PORT adjusts PORT to accept environmental parameter (ie deploying to Heroku)
  app.use(express.static(__dirname + '/client')); // serves static files from disk
  app.use("/node_modules", express.static(path.join(__dirname, 'node_modules')))
}

// Start the Neurosky Connection
var nodeThinkGear = require('./server/node-neurosky');
var tgClient = nodeThinkGear.createClient({
	appName:'NodeThinkGear',
	appKey:'0fc4141b4b45c675cc8d3a765b8d71c5bde9390'
});
tgClient.connect();

// Create a WebSocket connection with a client browser
io.sockets.on('connection', function (socket) {

	// when think-gear sends data
	tgClient.on('data',function(data){
		socket.emit('mindEvent', data);
	});
});