var GameClient = function( socket, stage ){

	var tickInterval = 100;

	// Setup PIXI
	var myCanvas = document.getElementById("canvas");
	var stage = new PIXI.Stage(0xFFFFFF);
	var renderer = new PIXI.CanvasRenderer(800, 600, {view:myCanvas});
	renderer.autoResize = true;
	renderer.backgroundColor = 0x001122;

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

	var animate = function(){
		game.update();
		renderer.render(stage);
		requestAnimationFrame( animate );
	};

	return {
		game: game,
		start: start,
		packetHandler: packetHandler
	};

};