var game;

window.addEventListener('load',function(){
	var socket = io();
	
	// create an new instance of a pixi stage
	var stage = new PIXI.Stage(0xFF0000);

	game = new Game( stage );
	game.setup();

	socket.on('packet',function(packet){
		game.handlePacket(packet);
	});

	// create a renderer instance.
	var renderer = PIXI.autoDetectRenderer(800, 600);
	renderer.autoResize = true;

	var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
	var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
	renderer.resize(w,h);

	// add the renderer view element to the DOM
	document.body.appendChild(renderer.view);

	requestAnimationFrame( animate );

	function animate() {
		requestAnimationFrame( animate );
		game.update();
	    // render the stage   
		renderer.render(stage);
	}	
});