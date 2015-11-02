/**
* Game contains and manages both Server and Client entities.
* Game also contains a {PIXI.Container} object called 'world'
* which contains all graphical components.
*/
var Game = function( stage, width, height ){
	
	/** Converts arguments to a proper Array. */
	var args = function(rawArgs){
		var args = [];
		for(var i=0; i<rawArgs.length; i++){
			args.push(rawArgs[i]);
		}
		return args;
	};

	/** A container for all graphical entity components. */
	var world = new PIXI.Container();

	var background = new PIXI.Container();

	var camera = new Camera( world, width, height );

	var keystate = Keyboard().state;

	world.addChild( background );
	stage.addChild( world );
	
	/** A list of entities that AREN'T synchronized to the server. */
	var bubbles = []; 

	/** A map of {Player}s to their respective ids. */
	var playerTable = {};

	/**
	* Add a Player to the playerTable.
	* @param {...}
	*/
	var addPlayer = function(){
		args(arguments).forEach(function(ply){
			world.addChild(ply.graphics);
			playerTable[ply.id]=ply;
		});
	};
	/**
	* Gets a {Player} from the playerTable, returns 
	* undefined if the given id is not found.
	* @param {number} id
	*/
	var getPlayer = function(id){
		if( playerTable[id] ){
			return playerTable[id];
		}else{
			console.log("ERROR (Game::getPlayer) Attempted to get an invalid id '" + id + "'");
			return;
		}
	};
	/**
	* Removes a {Player} from the playerTable.
	* @param {Player} ent
	*/
	var removePlayer = function(ent){
		if( playerTable[ent.id] ){
			world.removeChild(ent.graphics);
			delete playerTable[ent.id];	
		}else{
			console.log("ERROR (Game::removePlayer) Entity was not found in playerTable.");
		}
	};

	/**
	* Add a bubble to the bubble list.
	* @param {Bubble} bub
	*/
	var addBubble = function(bub){
		bubbles.push(bub);
	};

	/** 
	* updates every bubble.
	*/
	var updateBubbles = function(){
		bubbles.forEach(function(ent){
			ent.update();
		});
	};


	var update = function(){

		updateBubbles();

		//camera.target(ply.x(),ply.y());
		//camera.update();

		var speed = 0.5;
		
		/*
		if(keystate.left)
			ply.accelerate(-speed,0);
		if(keystate.right)
			ply.accelerate(+speed,0);
		if(keystate.up)
			ply.accelerate(0,-speed);
		if(keystate.down)
			ply.accelerate(0,+speed);
		*/
	};

	/**
	* Initialize some game objects.
	*/
	var setup = function(){
		
		var f = new PIXI.filters.BlurFilter();
		f.blur  = 2;
		background.filters = [f];
	
		for(var i=0;i<100;i++){
			var bub = RandomBubble({
				world: world,
				stage: stage,
				globalWidth: width,
				globalHeight: height
			});
			background.addChild(bub.graphics);
			addBubble(bub);
		}

		/*
		ply = Bubble({
			world: world,
			x: width/2,
			y: height/2,
			radius: 64,
			fillColor: 0x87FFA2,
			borderColor: 0xFFFFFF,
			alpha: 0.5,
			borderWidth: 4
		});
		camera.set(ply.x(),ply.y());
		world.addChild(ply.graphics);
		addBubble(ply);
		*/
		
	};

	return {
		addPlayer: addPlayer,
		removePlayer: removePlayer,
		getPlayer: getPlayer,
		keystate: keystate,
		update: update,
		setup: setup
	};
};


