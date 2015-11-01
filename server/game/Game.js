var Player        = require("./Player.js");
var Game = function( server ){
	// Game Data
	var players  = [],
		entities = [];

	// Game Functions
	var addPlayer = function( ply ){
		players.push(ply);
	};
	var removePlayer = function( ply ){
		var i = players.indexOf(ply);
		if(i>-1){
			players.splice(i,1);
		}else{
			console.log();
		}
	};
	var add = function( ent ){
		entities.push( ent );
	};
	var update = function(){
		entities.onEach(function(e){
			e.update();
		});
	};

	return {
		entities: entities,
		add: add,
		update: update,
		sendPackets: sendPackets
	};
};