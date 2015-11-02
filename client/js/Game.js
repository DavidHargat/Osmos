/**
* Game contains and manages both Server and Client entities.
* Game also contains a {PIXI.Container} object called 'world'
* which contains all graphical components.
*/
var Game = function( stage ){
	
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

	var camera = new Camera( world );

	var keystate = Keyboard().state;

	world.addChild( background );
	stage.addChild( world );
	
	/** A list of entities that AREN'T synchronized to the server. */
	var clientList = []; 

	/** A list of entities that ARE synchronized to the server. */
	var players = [];

	/** A map of {ServerEntity}s to their respective ids. */
	var playerTable = {};

	/**
	* Add a ServerEntity to the players and playerTable 
	* (defined seperately for optimal lookup and iteration).
	* @param {ServerEntity} ent
	*/
	var addPlayer = function(){
		args(arguments).forEach(function(ent){
			world.addChild(ent.graphics);
			players.push(ent);
			playerTable[ent.id]=ent;
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
	* Removes a {Player} from the game.
	* @param {Player} ent
	*/
	var removePlayer = function(ent){
		var i = players.indexOf(ent);
		ent.splice(i,1);
		if( playerTable[ent.id] ){
			delete playerTable[ent.id];	
		}else{
			console.log("ERROR (Game::removePlayer) Entity was not found in playerTable.");
		}
	};
	/**
	* Add a ClientEntity to the clientList.
	* @param {ClientEntity} ent
	*/
	var addClientEntity = function(){
		args(arguments).forEach(function(ent){
			if(ent.addToWorld) world.addChild(ent.graphics);
			clientList.push(ent);
		});
	};
	/** 
	* Updates all the entities in the clientList. 
	* This isn't (yet) neccesary for the players because
	* their logic resides on the server, whereas the client
	* entities are independent. 
	*/
	var updateClientList = function(){
		clientList.forEach(function(ent){
			ent.update();
		});
	};

	var ply;

	var update = function(){
		updateClientList();
		camera.target(ply.x(),ply.y());
		camera.update();

		var speed = 0.5;

		if(keystate.left)
			ply.accelerate(-speed,0);
		if(keystate.right)
			ply.accelerate(+speed,0);
		if(keystate.up)
			ply.accelerate(0,-speed);
		if(keystate.down)
			ply.accelerate(0,+speed);
	};

	/**
	* Initialize some game objects.
	*/
	var setup = function(){
		
		var f = new PIXI.filters.BlurFilter();
		f.blur  = 2;
		background.filters = [f];
	
		for(var i=0;i<100;i++){
			var e = RandomBubble({
				world: world,
				stage: stage
			});
			background.addChild(e.graphics);
			addClientEntity(e);
		}

		ply = new Bubble({
			world: world,
			x: renderer.width/2,
			y: renderer.height/2,
			radius: 64,
			fillColor: 0x87FFA2,
			borderColor: 0xFFFFFF,
			alpha: 0.5,
			borderWidth: 4
		});

		camera.set(ply.x(),ply.y());

		addClientEntity(ply);
	};

	return {
		stage: stage,
		world: world,
		background: background,
		camera: camera,
		players: players,
		addPlayer: addPlayer,
		removePlayer: removePlayer,
		getPlayer: getPlayer,
		clientList: clientList,
		updateClientList: updateClientList,
		update: update,
		setup: setup
	};
};


