/**
* {ClientPacketHandler} interprets packets from the
* server and respectively updates the state of the client.
*/
var ClientPacketHandler = function( game ){

	var update = function( packet ){
		var ply = game.getPlayer(packet.id);
		if(ply){
			ply.pos(packet.x, packet.y);
		}else{
			console.log("WARNING (ClientPacketHandler::update) Attempted to update unindex player " + packet.id);
		}
	};

	var add = function( packet ){
		console.log("LOG (ClientPacketHandler::add) Added Player: " + packet.options.id);
		var player = PlayerBubble(packet.options);
		game.addPlayer(player);
	};

	var remove = function( packet ){
		var ply = game.getPlayer(packet.id);
		if(ply){
			game.removePlayer(ply);
		}
	};

	var list = function( packet ){
		packet.list.forEach(function(packet_){
			handle(packet_);
		});
	};

	var handle = function( packet ){
		//console.log(packet);

		var router = {
			update: update,
			add: add,
			remove: remove,
			list: list
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