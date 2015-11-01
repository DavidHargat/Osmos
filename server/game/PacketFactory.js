/**
* PacketFactory constructs outgoing packets to be sent to the client(s).
*/
var PacketFactory = function(){

	/**
	* (private)
	* Constructs a packet containing whatever properties
	* are selected from the 'ent' object.
	* @param {Entity} ent - The entity we're grabbing properties from.
	* @param {Array} properties - a list of strings, each of
	* which is the name of a property in 'ent' which you would
	* like to extract.
	*/
	var extract = function( header, ent, properties ){
		var packet = {};
		packets.header = header;
		for(var i=0; i<properties.length; i++){
			packet[properties[i]] = packet[properties[i]];
		}
		return packet;
	};

	/**
	* Creates an 'add' packet, which contains all the data neccesary
	* to create an entity on the client.
	* @param {Entity} ent - the entity we're sending to the client.
	*/
	var add = function( ent ){
		return extract("add", ent, ['id', 'x', 'y', 'type'] );
	};

	/**
	* Creates a 'position' packet which describes the position of
	* an entity.
	* @param {Entity} ent - the entity whose position we're sending to the client.
	*/
	var position = function( ent ){
		return extract("position", ent, ['id', 'x', 'y'] );
	};

	/**
	* Constructs a list of packets which collectively describe the entire
	* state of the game.
	* @param {Game} game - the Game instance we're sending.
	*/
	var state = function( game ){
		var packets = [];
		game.entities.forEach(function( ent ){
			packets.push(add(ent));
		});
		return packets;
	};

	return {
		add: add,
		position: position,
		state: state
	};
};

modules.exports = PacketFactory;