
/**
* {ClientPacketHandler} interprets packets from the
* server and respectively updates the state of the client.
*/
var ClientPacketHandler = function( game ){

	var handlePosition = function( packet ){
		var ent = game.get(packet.id);
		ent.pos(packet.x, packet.y);
	};

	var handleAdd = function( packet ){
		var type = packet.type;

		var router = {
			"circle": Circle
		};

		if( router[type] ){
			options.world = game.world;
			router[type](packet.options);
		}else{
			console.log("ERROR (PacketHandler::handlePacketAdd) Invalid Entity Type '" + type + "'");
		}
	};

	var handle = function( packet ){
		var router = {
			"position": handlePosition,
			"add": handleAdd
		};

		if( router[packet.header] ){
			router[packet.header]( packet );
		}else{
			console.log("ERROR (PacketHandler::handlePacket) Invalid packet header '" + packet.header + "'" );
		}
	};

	return {
		handle: handle
	};
};

var Camera = function( world ){
	var x  = 0,
		y  = 0,
		tx = 4,
		ty = 4,
		set,target,update;

	set = function(px,py){
		x = px;
		y = py;
		world.x = -px + renderer.width/2;
		world.y = -py + renderer.height/2;
	};

	target = function(px,py){
		tx = px;
		ty = py;
	};

	update = function(){
		var x1=x,
			y1=y,
			x2=tx,
			y2=ty;

		var d = Math.sqrt(
			((x2 - x1) * (x2 - x1))+
			((y2 - y1) * (y2 - y1)) 
		);

		if( d > 4){
			var dx = (x2-x1)/d;
			var dy = (y2-y1)/d;

			x += dx*(d/16);
			y += dy*(d/16);

			set(x,y);
		}
	};

	return {
		set: set,
		target: target,
		update: update
	};
};

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
	var serverList = [];

	/** A map of {ServerEntity}s to their respective ids. */
	var serverTable = {};

	/**
	* Add a ServerEntity to the serverList and serverTable 
	* (defined seperately for optimal lookup and iteration).
	* @param {ServerEntity} ent
	*/
	var addServerEntity = function(){
		args(arguments).forEach(function(ent){
			world.addChild(ent.graphics);
			serverList.push(ent);
			serverTable[ent.id]=ent;
		});
	};
	/**
	* Gets a {ServerEntity} from the serverTable, returns 
	* undefined if the given id is not found.
	* @param {number} id
	*/
	var getServerEntity = function(id){
		if( serverTable[id] ){
			return serverTable[id];
		}else{

			console.log("ERROR (Game::getServerEntity) Attempted to get an invalid id '" + id + "'");
			return;
		}
	};
	/**
	* Removes a {ServerEntity} from the game.
	* @param {ServerEntity} ent
	*/
	var removeServerEntity = function(ent){
		var i = serverList.indexOf(ent);
		ent.splice(i,1);
		if( serverTable[ent.id] ){
			delete serverTable[ent.id];	
		}else{
			console.log("ERROR (Game::removeServerEntity) Entity was not found in serverTable.");
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
	* This isn't (yet) neccesary for the serverList because
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
		serverList: serverList,
		addServerEntity: addServerEntity,
		removeServerEntity: removeServerEntity,
		getServerEntity: getServerEntity,
		clientList: clientList,
		updateClientList: updateClientList,
		update: update,
		setup: setup
	};
};


