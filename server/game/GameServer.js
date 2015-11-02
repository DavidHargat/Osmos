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
		//packets.forEach(function(packet){
			//io.emit('packet', packet);	
		//});
		io.emit('packet',{
			header:'list',
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

		//game.on('tick', function(){
			//sendAll();
		//});
	
		//game.tick();
		
		game.start();

		var tickInterval = 1000/60;
		var netInterval = 40;

		setInterval(game.tick, tickInterval);
		setInterval(sendAll, netInterval);
	};

	var onDisconnect = function( socket ){
		console.log("LOG (GameServer::onDisconnect)" + socket.id);
		if(sockets[socket.id]){
			if(socket.player){
				game.remove(socket.player);
				console.log("LOG (GameServer::onDisconnect) Removed Player " + socket.player.id);
			}else{
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
		playerIndex++;

		// Add socket event listener
		socket.on("packet", function(packet){
			PacketHandler_.handle( socket, packet );
		});

		socket.on('disconnect', function(){
			onDisconnect(socket);
		});

		var state = PacketFactory_.state(game);
		socket.emit("packet", state);

		game.add(socket.player);

		socket.emit("packet", {
			header: "setPlayerId",
			id: socket.player.id
		});

		console.log("LOG (GameServer::onConnect) Added Player " + socket.player.id);
	};

	return {
		onConnect: onConnect,
		setup: setup
	};
};

module.exports = GameServer;