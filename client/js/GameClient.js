var GameUI = function(){
	var board = document.getElementById("leaderboard");
	var loseMessage = document.getElementById("lose-message");

	var list = document.getElementById("list");

	var showLeaderboard = function(){
		board.style.visibility = "visible";
	};

	var hideLeaderboard = function(){
		board.style.visibility = "hidden";
	};

	var showLoseMessage = function(){
		loseMessage.style.visibility = "visible";
	};
	
	var hideLoseMessage = function(){
		loseMessage.style.visibility = "hidden";
	};
	
	var setLeaderboard = function(playerList){
		// Remove current list
		while( list.firstChild )
			list.removeChild(list.firstChild);

		playerList.forEach(function(name,index){
			var str = name;
			var element = document.createElement("li");
			element.textContent = str;
			list.appendChild(element);
		});
	};

	return {
		showLeaderboard: showLeaderboard,
		hideLeaderboard: hideLeaderboard,
		setLeaderboard: setLeaderboard,
		hideLoseMessage: hideLoseMessage
	};
};

var GameClient = function( socket, stage ){

	var tickInterval = 20;

	// Setup PIXI
	var myCanvas = document.getElementById("canvas");
	var stage = new PIXI.Stage(0xFFFFFF);
	
	var w = window.innerWidth;
	var h = window.innerHeight;

	var maxWidth = 600;

	var ui = GameUI();
	ui.showLeaderboard();
	ui.hideLoseMessage();

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
		socket.on('player-id', function( id ){
			game.setPlayerId( id );
			console.log("Player ID: " + id);
		});
		// Update the leaderboard
		socket.on('update-leaderboard', function( data ){
			// The data we're expecting is a list of player id's.
			// so forEach id we grab the corresponding player,
			// and from that player we grab their name.
			ui.setLeaderboard(data.map(function(id){
				return game.getPlayer(id).name;
			}));
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
		packetHandler: packetHandler,
		ui: ui
	};

};
