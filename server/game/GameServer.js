var Game          = require('./Game.js'),
	PacketHandler = require('./PacketHandler.js'),
	PacketFactory = require("./PacketFactory");

var GameServer = function(){

	var game   = Game();
	var handle = PacketHandler( game );
	var PacketHandler_ = PacketHandler( game );
	var PacketFactory_ = PacketFactory();
	var packets = [];
	var sockets = {};

	/**
	* Emits the accumulated packets to every client.
	*/
	var sendAll = function(){

	};

	// Adds callbacks
	var setup = function(){

		// When a new player is added, add a packet to the list.
		game.on('add', function( ply ){
			packets.push(PacketFactory_.add(ply));
		});

		// When a player is removed, add a packet to the list.
		game.on('remove', function( ply ){
			packets.push(PacketFactory_.remove(ply));
		});

		// When a player is updated, add a packet to the list.
		game.on('update', function( ply ){
			packets.push(PacketFactory_.position(ply));
		});

	};

	var onDisconnect = function( socket ){
		if(sockets[socket.id]){
			delete sockets[socket.id];
		}else{
			console.log("WARNING (GameServer::onDisconnect) ");
		}
	};

	var onConnect = function( socket ){
		
		sockets[socket.id] = socket;

		// Initialize player
		socket.player = Player({
			socket: socket
		});

		// Add socket event listener
		socket.on("packet", function(packet){
			PacketHandler_.handle( socket, packet );
		});

		var state = PacketFactory_.state(game);
		socket.emit("packet-list", state);

		game.addPlayer(socket.player);

	};

	return {
		onConnect: onConnect
	};
};

modules.exports = GameServer;