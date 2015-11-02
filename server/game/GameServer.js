var Game          = require('./Game.js'),
	PacketHandler = require('./PacketHandler.js'),
	Player        = require('./Player.js'),
	PacketFactory = require("./PacketFactory");

var GameServer = function( io ){

	var game   = Game();

	var PacketHandler_ = PacketHandler( game );
	
	var PacketFactory_ = PacketFactory();

	var packets = [];
	var sockets = {};
	var playerIndex = 0;

	/**
	* Emits the accumulated packets to every client.
	*/
	var sendAll = function(){
		io.emit('packet', {
			header: 'list',
			list: packets
		});
		packets = [];
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
			packets.push(PacketFactory_.update(ply));
		});

	};

	var run = function(){
		var tickInterval = 1000/60;
		var netInterval = 40;

		// Continously run Game update logic.
		setInterval(game.tick, tickInterval);

		// Continously run GameServer networking logic.
		setInterval(sendAll, netInterval);
	};

	var onDisconnect = function( socket ){
		if(sockets[socket.id]){
			if(socket.player){
				game.remove(socket.player);
				console.log("LOG (GameServer::onDisconnect) Removed Player " + socket.player.id);
			}
			delete sockets[socket.id];
		}else{
			console.log("WARNING (GameServer::onDisconnect) Attempted to remove unmapped socket.");
		}
	};

	var onConnect = function( socket ){
		sockets[socket.id] = socket;

		// Initialize player
		socket.player = Player({
			socket: socket,
			x: 50,
			y: 50,
			radius: 10 + Math.round(Math.random()*10),
			id: playerIndex
		});

		// Increment the playerIndex (so each player gets a unique id)
		playerIndex++;

		// Handle incoming packets
		socket.on("packet", function(packet){
			PacketHandler_.handle( socket, packet );
		});

		// Handle disconnection
		socket.on('disconnect', function(){
			onDisconnect(socket);
		});

		// Send the current state of the game to the new player.
		socket.emit("packet", PacketFactory_.state(game));

		// Add the player to the game.
		game.add(socket.player);

		// Tell the player their id.
		socket.emit("packet", {
			header: "setPlayerId",
			id: socket.player.id
		});

		// log
		console.log("LOG (GameServer::onConnect) Added Player " + socket.player.id);
	};

	return {
		onConnect: onConnect,
		setup: setup,
		run: run
	};
};

module.exports = GameServer;