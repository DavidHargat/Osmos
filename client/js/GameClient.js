var GameClient = function( socket, stage ){

	var tickInterval = 20;

	// Setup PIXI
	var myCanvas = document.getElementById("canvas");
	var stage = new PIXI.Stage(0xFFFFFF);
	
	var w = window.innerWidth;
	var h = window.innerHeight;

	var maxWidth = 600;

	var board = document.getElementById("leaderboard");
	board.style.visibility = "visible";

	var CANVAS_WIDTH = w+(maxWidth-w);
	var CANVAS_HEIGHT = (CANVAS_WIDTH*(h/w));

	if(w <= maxWidth){
		CANVAS_WIDTH = w;
		CANVAS_HEIGHT = h;
	}

	var renderer = new PIXI.CanvasRenderer(CANVAS_WIDTH, CANVAS_HEIGHT, {view:myCanvas});
	renderer.autoResize = true;
	renderer.backgroundColor = 0x000000;

	// Create our game object
	var game = Game( stage, renderer.width, renderer.height );
	var packetHandler = ClientPacketHandler( game );

	var start = function(){
		// Initialize game object.
		game.setup();
		// Start running inputs loop.
		tick();
		// Start running pixi animations.
		animate();
		// Start handling packets.
		socket.on('packet', function(packet){
			packetHandler.handle(packet);
		});
		// Receive our player.id so we know who we are!
		socket.on('player-id',function( id ){
			game.setPlayerId( id );
			console.log("Player ID: " + id);
		});
	};

	var tick = function(){

		socket.emit('packet', {
			header: "input",
			up: game.keystate.up,
			down: game.keystate.down,
			left: game.keystate.left,
			right: game.keystate.right,
		});

		setTimeout(tick, tickInterval);
	};

	var animate = function( time ){
		requestAnimationFrame( animate );
		game.update();
		renderer.render(stage);
	};

	return {
		game: game,
		start: start,
		packetHandler: packetHandler
	};

};