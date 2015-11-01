var Game          = require('./Game.js'),
	PacketHandler = require('./PacketHandler.js'),
	PacketFactory = require("./PacketFactory");

var GameServer = function(){

	var game   = Game();
	var handle = PacketHandler( game );
	var PacketHandler_ = PacketHandler( game );
	var PacketFactory_ = PacketFactory();
	var packets = [];

	var onConnect = function( socket ){
		
		// Initialize player
		socket.player = Player({
			socket: socket
		});

		// Add socket event listener
		socket.on("packet", function(packet){
			PacketHandler_.handle( packet );
		});

		var state = PacketFactory_.state(game);
		socket.emit("packet-list", state);

	};

	return {
		onConnect: onConnect
	};
};

modules.exports = GameServer;