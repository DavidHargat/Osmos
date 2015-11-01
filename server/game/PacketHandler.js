
/**
* PacketHandler handles incoming packets from the client(s)
* by applying them to the game state.
*/
var PacketHandler = function( game ){

	var input = function( socket, packet ){
		
	};

	var handle = function( socket, packet ){
		var header = packet.header;

		var router = {
			input: input
		};

		if( router[header] ){
			router[header](socket, packet);
		}else{
			console.log("WARNING (PacketHandler::handle) Invalid packet header '" + header + "'");
		}

	};

};