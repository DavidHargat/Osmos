var express = require('express');
var app  = express();
var http = require('http').Server(app);
var io   = require('socket.io')(http);

var game = require("./game/GameServer.js")(io);
game.setup();
game.run();

var PORT = 8080;

app.use("/", express.static( __dirname + '/../client' ));

io.on('connection', function(socket){
	game.onConnect(socket);
});

http.listen(PORT, function(){
	console.log('listening on *:'+PORT);
});