/**
* {ClientPacketHandler} interprets packets from the
* server and respectively updates the state of the client.
*/
var ClientPacketHandler = function( game ){

	var update = function( packet ){
		var ent = game.get(packet.id);
		ent.pos(packet.x, packet.y);
	};

	var add = function( packet ){
		var player = Player(packet.options);
		game.add(player);
	};

	var handle = function( packet ){
		var router = {
			update: update,
			add: add
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