var game,renderer;

window.addEventListener('load',function(){
	var socket = io();
	var myCanvas = document.getElementById("canvas");
	
	// create an new instance of a pixi stage
	var stage = new PIXI.Stage(0xFF0000);
	game = Game( stage );

	socket.on('packet',function(packet){
		game.handlePacket(packet);
	});

	// create a renderer instance.
	// renderer = PIXI.autoDetectRenderer(800, 600);
	// renderer = new PIXI.WebGLRenderer(800, 600, {view:myCanvas});
	renderer = new PIXI.CanvasRenderer(800, 600, {view:myCanvas});
	renderer.autoResize = true;

	var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
	var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
	//renderer.resize(w,h);
	renderer.backgroundColor = 0x001122;
	game.setup();

	// add the renderer view element to the DOM
	//document.body.appendChild(renderer.view);

	requestAnimationFrame( animate );

	function animate() {
		requestAnimationFrame( animate );
		game.update();
	    // render the stage   
		renderer.render(stage);
	}	

});