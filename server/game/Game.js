var Player = require("./Player.js");

var Game = function( server ){
	
	// setTimeout update interval.
	var setTimeoutInterval = 50;

	// Whether or not the game should be updating.
	var running = false;

	// Game Data
	var players  = [];

	// Callbacks
	var callbacks = {
		add: function(){},
		remove: function(){},
		update: function(){}	
	};

	var on = function(name,callback){
		if(typeof(callbacks[name])==="function"){
			callbacks[name] = callback;
		}else{
			console.log("WARNING (Game::on) ["+name+"] is not a valid callback.");
		}
	};

	// Game Functions
	var add = function( ply ){
		players.push(ply);
		callbacks.add(ply);
	};
	var remove = function( ply ){
		var i = players.indexOf(ply);
		if(i>-1){
			players.splice(i,1);
		}else{
			console.log("WARNING (Game::remove) Attempted to remove non-indexed player", ply);
		}
		callbacks.remove(ply);
	};
	var update = function(){
		players.onEach(function(e){
			// Players need to know about eachother to update
			e.update( players );
			callbacks.update(e);
		});
	};
	var loop = function(){
		if(running){
			update();
		}
		setTimeout(loop,setTimeoutInterval);
	};
	var start = function(){
		running = true;
	};
	var stop = function(){
		running = false;
	};
	return {
		update: update,
		loop: loop,
		start: start,
		stop: stop,
		players: players,
		on: on
	};
};