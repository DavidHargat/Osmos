/**
* PacketFactory constructs outgoing packets to be sent to the client(s).
*/
var PacketFactory = function(){

	/**
	* Creates an 'add' packet, which contains all the data neccesary
	* to create an entity on the client.
	* @param {Entity} ent - the entity we're sending to the client.
	*/
	var add = function( ply ){
		var options = {
			x: ply.position.x,
			y: ply.position.y,
			radius: ply.getRadius(),
			borderColor: 0xFFFFFF,
			fillColor: 0x999999,
			alpha: 0.75,
			id: ply.id
		};

		return {
			header: "add",
			options: options
		};
	};

	var remove = function( ply ){
		return {
			header: "remove",
			id: ply.id
		};
	};

	/**
	* Creates a 'update' packet which describes the new position of
	* an entity.
	* @param {Entity} ent - the entity whose position we're sending to the client.
	*/
	var update = function( ply ){
		return {
			header: "update",
			x: ply.position.x,
			y: ply.position.y,
			radius: ply.getRadius(),
			id: ply.id
		};
	};

	/**
	* Constructs a list of packets which collectively describe the entire
	* state of the game. This is used by the {GameServer} to bring new
	* clients up to speed.
	* @param {Game} game - the Game instance we're sending.
	*/
	var state = function( game ){
		var packets = [];
		game.players.forEach(function(ply){
			packets.push(add(ply));
		});
		return {
			header: "list",
			list: packets
		};
	};

	return {
		add: add,
		remove: remove,
		update: update,
		state: state
	};
};

module.exports = PacketFactory;