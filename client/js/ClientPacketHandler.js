/**
* {ClientPacketHandler} interprets packets from the
* server and respectively updates the state of the client.
*/
var ClientPacketHandler = function( game ){

	var update = function( packet ){
		var ply = game.getPlayer(packet.id);
		if(ply){
			//ply.pos(packet.x, packet.y);
			ply.setTarget(packet.x,packet.y);
			if(packet.radius != ply.radius){
				ply.radius = packet.radius;
				console.log(ply.radius);
			}
		}else{
			console.log("WARNING (ClientPacketHandler::update) Attempted to update unindex player " + packet.id);
		}
	};

	var add = function( packet ){
		console.log("LOG (ClientPacketHandler::add) Added Player: " + packet.options.id);
		var player = PlayerBubble(packet.options);
		game.addPlayer(player);
		game.addBubble(player);
	};

	var remove = function( packet ){
		var player = game.getPlayer(packet.id);
		if(player){
			game.removePlayer(player);
			game.removeBubble(player);
		}
	};

	var list = function( packet ){
		packet.list.forEach(function(packet_){
			handle(packet_);
		});
	};

	var setPlayerId = function( packet ){
		game.setPlayerId(packet.id);
	};

	var handle = function( packet ){
		//console.log(packet);

		var router = {
			update: update,
			add: add,
			remove: remove,
			list: list,
			setPlayerId: setPlayerId
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