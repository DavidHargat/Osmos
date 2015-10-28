

var PacketFactory = function(){

	var extract = function( ent, properties ){
		var data = {};
		for(var i=0; i<properties.length; i++){
			data[properties[i]] = ent[properties[i]];
		}
		return data;
	};

	var add = function( ent ){
		return extract(ent, ['id', 'x', 'y', 'type'] );
	};

	var position = function( ent ){
		return extract(ent, ['id', 'x', 'y'] );
	};

	return {
		add: add,
		position: position
	};
};

var packet = PacketFactory();

var Game = function(){
	var entities = [];
	var packets = [];

	var add = function( ent ){
		entities.push( ent );
		packets.push( packet.add(ent) );
	};

	var update = function(){
		entities.onEach(function(e){
			e.update();
		});
	};

	var sendPackets = function(){
		
	};

	return {
		entities: entities,
		add: add,
		update: update,
		sendPackets: sendPackets
	};
};