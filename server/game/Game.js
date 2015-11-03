var Player = require("./Player.js");

var Game = function( server ){

	// Whether or not the game should be updating.
	var running = false;

	// Game Data
	var players  = [];

	
	var callbacks = {
		add: function(){},
		remove: function(){},
		update: function(){}
	};

	/**
	* Define a callback for a certain a game event (psuedo-event?)
	* this allows the GameServer to add logic after
	* each of these events, for instance the
	* GameServer will want to create a packet after each
	* 'add' event so it can inform the clients.
	* @param {String} name - the name of the callback.
	* @param {function} callback - the callback itself.
	*/
	var on = function(name,callback){
		if(typeof(callbacks[name])==="function"){
			callbacks[name] = callback;
		}else{
			console.log("WARNING (Game::on) ["+name+"] is not a valid callback.");
		}
	};

	/**
	* Adds a player to the game.
	* @param {Player} ply - the player to add.
	*/
	var add = function( ply ){
		players.push(ply);
		callbacks.add(ply);
	};
	
	/**
	* Removes a player from the game.
	* @param {Player} ply - the player to remove.
	*/
	var remove = function( ply ){
		var i = players.indexOf( ply );
		if(i>-1){
			players.splice(i,1);
		}else{
			console.log("WARNING (Game::remove) Attempted to remove non-indexed player " + ply.id);
		}
		callbacks.remove(ply);
	};

	/**
	* Updates the game logic.
	*/
	var tick = function(){
		players.forEach(function(e){
			// Players need to know about eachother to update
			e.update( players );
			callbacks.update(e);
		});
	};

	return {
		add: add,
		remove: remove,
		tick: tick,
		players: players,
		on: on
	};
};

module.exports = Game;