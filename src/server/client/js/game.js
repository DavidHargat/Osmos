
var RGB = function(r,g,b){
	return "rgb(" + r +"," + g + ","+ b + ")";
};

var Entity = function( options ){
	var graphics = new PIXI.Container();
	
	var x,y,width,height,pos,move,size;
	
	x = function( px ){
		if( typeof( px ) === "number" ) graphics.x = px;
		//console.log( px );
		return graphics.x;
	};
	y = function( py ){
		if( typeof( py ) === "number" ) graphics.y = py;
		return graphics.y;	
	};
	width = function( pw ){
		if( typeof( pw ) === "number" ) graphics.width = pw;
		return graphics.width;
	};
	height = function( ph ){
		if( typeof( ph ) === "number" ) graphics.width = ph;
		return graphics.height;
	};
	pos = function( px, py ){
		return { x: x( px ), y: y( py ) };
	};
	move = function( px , py ){
		return pos( x() + px , y() + py );
	};
	size = function( pw , ph ){
		return { width: width( pw ), height: height( ph ) };
	};

	var has_ = function(v){return !(typeof(v)==="undefined");};
	
	if( has_(options.x)      ) x(options.x);
	if( has_(options.y)      ) y(options.y);
	if( has_(options.width)  ) width(options.width);
	if( has_(options.height) ) height(options.height);

	return {
		x: x,
		y: y,
		width: width,
		height: height,
		pos: pos,
		move: move,
		size: size,
		graphics: graphics
	};
};

// Doesn't care about the server
var ClientEntity = function( options ){
	var parent = Entity( options );

	var world = options.world;

	var update = function(){
		// Placeholder
	};

	return {
		x: parent.x,
		y: parent.y,
		width: parent.width,
		height: parent.height,
		size: parent.size,
		pos: parent.pos,
		move: parent.move,
		graphics: parent.graphics,
		update: update
	};
};

// Get synchronized to the server.
var ServerEntity = function( options ){
	var parent = Entity( options );

	var world = options.world;

	var id = options.id;

	return {
		id: id,
		x: parent.x,
		y: parent.y,
		pos: parent.pos,
		move: parent.move,
		graphics: parent.graphics
	};
};

var Circle = function( options ){
	var parent = ClientEntity( options );

	var x         = parent.x,
		y         = parent.y,
		pos       = parent.pos,
		move      = parent.move,
		graphics  = parent.graphics,
		world     = options.world,
		color     = options.color || 0xFFFFFF;

	var createGraphics = function(){
		var r = 32;
		var fillColor = color; 
		var borderColor = 0xFFFFFF;

		var fill = new PIXI.Graphics();
		fill.beginFill(fillColor,0.2);
		fill.drawCircle(0, 0, r);
		fill.endFill();

		var border = new PIXI.Graphics();
		border.lineStyle(1, borderColor );
		border.drawCircle(0, 0, r);   //(x,y,radius)		
		border.endFill();

		var center = new PIXI.Graphics();
		center.lineStyle(1, 0xFFFFFF );
		center.drawCircle(0, 0, 2);   //(x,y,radius)		
		center.endFill();

		graphics.addChild(fill);
		graphics.addChild(border);
		graphics.addChild(center);	
	};
	createGraphics();

	var radius = function(r){

	};

	var update = function(){
		move(0.1,0);
	};

	return {
		pos: pos,
		update: update,
		graphics: graphics
	};
};

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

var Bubble = function( options ){
	var parent = ClientEntity( options );

	var graphics = parent.graphics,
		update   = parent.update,
		move     = parent.move,
		radius   = options.radius,
		vx       = options.vx,
		vy       = options.vy,
		color    = options.color;

	var createGraphics = function(){
		var r = radius;
		var fillColor = color; 
		var borderColor = 0xFFFFFF;

		var fill = new PIXI.Graphics();
		fill.beginFill(fillColor,0.2);
		fill.drawCircle(0, 0, r);
		fill.endFill();

		var border = new PIXI.Graphics();
		border.lineStyle(1, borderColor );
		border.drawCircle(0, 0, r);   //(x,y,radius)		
		border.endFill();

		graphics.addChild(fill);
		graphics.addChild(border);	
	};
	createGraphics();

	update = function(){
		move(vx, vy);
	};

	return {
		x: parent.x,
		y: parent.y,
		width: parent.width,
		height: parent.height,
		size: parent.size,
		pos: parent.pos,
		move: parent.move,
		graphics: parent.graphics,
		update: update
	};
};

var createRandomBubble = function( world ){

	var vx = (Math.random()-Math.random())/2;
	var vy = (Math.random()-Math.random())/2;
	var radius = (Math.random()*8)+4;

	var x = Math.round(Math.random()*800);
	var y = Math.round(Math.random()*600);

	var rgb = "0000FF";
	var color =  parseInt(rgb, 16);

	color = Math.floor(Math.random()*(255*255*255));

	return Bubble({
		x: x,
		y: y,
		world: world,
		radius: radius,
		vx: vx,
		vy: vy,
		color: color
	});
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
			world.addChild(ent.graphics);
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

	var update = function(){
		updateClientList();
	};
	/**
	* Initialize some game objects.
	*/
	var setup = function(){
		
		for(var i=0;i<100;i++){
			var e = createRandomBubble();
			e.pos(420,300);
			addClientEntity(e);
		}
	};

	return {
		world: world,
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


