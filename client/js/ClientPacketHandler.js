/**
* {ClientPacketHandler} interprets packets from the
* server and respectively updates the state of the client.
*/
var ClientPacketHandler = function( game ){

	var update = function( packet ){
		var ply = game.getPlayer(packet.id);
		ply.pos(packet.x, packet.y);
	};

	var add = function( packet ){
		var player = Player(packet.options);
		game.addPlayer(player);
	};

	var remove = function( packet ){
		var ply = game.getPlayer(packet.id);
		if(ply){
			game.removePlayer(ply);
		}
	};

	var handle = function( packet ){
		var router = {
			update: update,
			add: add,
			remove: remove
		};

		if( router[packet.header] ){
			router[packet.header]( packet );
		}else{
			console.log("ERROR (PacketHandler::handle) Invalid packet header '" + packet.header + "'" );
		}
	};

	return {
		handle: handle
	};
};