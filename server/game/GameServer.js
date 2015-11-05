var Game = require('./Game.js');
var PacketHandler = require('./PacketHandler.js');
var Player = require('./Player.js');
var PacketFactory = require("./PacketFactory");

var GameServer = function( io ){

	var game = Game();

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

	var lastboard;

	var updateLeaderboard = function(){	
		io.emit('update-leaderboard', game.getLeaderboard());
	};

	// Start continously updating server
	var run = function(){
		var tickInterval = 1000/60;
		var netInterval = 40;
		var leaderboardInterval = 2000;

		// Continously update the leaderboard.
		setInterval(updateLeaderboard, leaderboardInterval);	

		// Continously run Game update logic.
		setInterval(game.tick, tickInterval);

		// Continously run GameServer networking logic.
		setInterval(sendAll, netInterval);
	};

	// When a socket disconnects
	var onDisconnect = function( socket ){
		// If the socket is mapped.
		if(sockets[socket.id]){
			// If they have a player, and that player is 'active' (Added to the game)
			if(socket.player && socket.player.active){
				// Remove the player, log to console
				game.remove(socket.player);
				console.log(
					"LOG (GameServer::onDisconnect) Removed Player " 
					+ socket.player.id
					+ " : "
					+ socket.player.name
				);
			}
			delete sockets[socket.id]; // Unmap the socket.
		}else{
			console.log("WARNING (GameServer::onDisconnect) Attempted to remove unmapped socket.");
		}
	};

	// When a socket connects
	var onConnect = function( socket ){

		// Remember this socket
		sockets[socket.id] = socket;

		// Create a new player object
		// (but don't add it t othe game yet)
		var newPlayer = Player({
			socket: socket,
			x: 50,
			y: 50,
			radius: 20 + Math.round(Math.random()*10),
			id: playerIndex
		});
		newPlayer.active = false;

		socket.player = newPlayer;

		// Increment the playerIndex (so each player gets a unique id)
		playerIndex++;

		var setupPlayer = function(){
			// Send the current state of the game to the new player.
			socket.emit("packet", PacketFactory_.state(game));

			// Add the player to the game.
			game.add(newPlayer);
			newPlayer.active = true;

			// Tell the client their id.
			socket.emit("player-id", newPlayer.id);

			// start handling incoming packets
			socket.on("packet", function(packet){
				PacketHandler_.handle( socket, packet );
			});

			// log
			console.log("LOG (GameServer::onConnect) Added Player " + newPlayer.id + " : " + newPlayer.name);
		};

		var checkName = function( name ){
			// <ERROR CHECKING>
			if( !(typeof(name)==="string") ){ 
				// If it's not a string
				socket.emit('name-invalid',"Data was not a string.");
				return;
			}
			if( name.length<3 ){ 
				// If it's not long enough
				socket.emit('name-invalid',"Please enter a name at least 3 letters long.");
				return;
			} 
			if( name.length>16 ){ 
				// If it's not long enough
				socket.emit('name-invalid',"Please enter a name no more than 16 letters long.");
				return;
			} 
			// </ERROR CHECKING>

			// We know they have a valid name at this point
			socket.player.name = name;

			// When the client says they're ready
			// Initialize them in the game.
			socket.on('ready', setupPlayer);

			// Tell the client they're good to go!
			// When they're ready they emit the 'ready'
			// message that we handle above.
			socket.emit('start-client');
		};

		// When the client disconnects.
		socket.on('disconnect', function(){
			onDisconnect(socket);
		});

		// When the client sends us their name.
		socket.on('name',checkName);
	};

	return {
		onConnect: onConnect,
		setup: setup,
		run: run
	};
};

module.exports = GameServer;
