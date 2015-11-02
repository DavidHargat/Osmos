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

	// Represents which player belongs to this client.
	var playerId = -1;
	var myPlayer;

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
	* Sets the playerIndex which determines which player the camera should follow.
	* @param {number} i - the index.
	*/
	var setPlayerId = function(i){
		playerId = i;
	};

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
	* Remove a bubble from the bubble list.
	* @param {Bubble} bub
	*/
	var removeBubble = function(bub){
		var i = bubbles.indexOf(bub);
		if(i>-1){
			bubbles.splice(i,1);
		}
	};

	/** 
	* updates every bubble.
	*/
	var updateBubbles = function(){
		bubbles.forEach(function(ent){
			ent.update();
		});
	};

	var cameraFollow = function(){
		if(playerId != -1){
			if(!myPlayer){
				myPlayer = getPlayer(playerId);
			}
			if(myPlayer){
				camera.target(myPlayer.x(),myPlayer.y());
				camera.update();
			}else{
				console.log("WARNING (Game::cameraFollow) Could not get player "+playerId);
			}

		}
	};

	var update = function(){
		updateBubbles();
		cameraFollow();
	};

	/**
	* Initialize some game objects.
	*/
	var setup = function(){
		
		var f = new PIXI.filters.BlurFilter();
		f.blur  = 2;
		background.filters = [f];
	
		for(var i=0;i<16;i++){
			var bub = RandomBubble({
				world: world,
				stage: stage,
				globalWidth: width,
				globalHeight: height
			});
			background.addChild(bub.graphics);
			addBubble(bub);
		}

		var wBorder = Bubble({
			x: 0,
			y: 0,
			radius: 500,
			vx: 0,
			vy: 0,
			borderColor: 0xFFFFFF,
			fillColor: 0x000000,
			alpha: 0,
			borderWidth: 0.1,
			borderAlpha: 1
		});

		background.addChild(wBorder.graphics);
	};

	return {
		setPlayerId: setPlayerId,
		addPlayer: addPlayer,
		addBubble: addBubble,
		removeBubble: removeBubble,
		removePlayer: removePlayer,
		getPlayer: getPlayer,
		keystate: keystate,
		update: update,
		world: world,
		setup: setup
	};
};


