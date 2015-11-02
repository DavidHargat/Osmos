
/**
* PacketHandler handles incoming packets from the client(s)
* by applying them to the game state.
*/
var PacketHandler = function( game ){

	var isBool = function(val){
		return typeof(val)==="boolean";
	};

	var input = function( socket, packet ){

		// the 'player' object from the socket that sent this packet
		// (Might wanna restructure that)
		var player = socket.player;

		// Destructure packet to make our code cleaner
		var up = packet.up,
			down = packet.down,
			right = packet.right,
			left = packet.left;

		// Never trust input from clients :)
		if(isBool( up    )) player.controller.up = up;
		if(isBool( down  )) player.controller.down = down;
		if(isBool( left  )) player.controller.left = left;
		if(isBool( right )) player.controller.right = right;

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

	return {
		handle: handle
	};

};

module.exports = PacketHandler;