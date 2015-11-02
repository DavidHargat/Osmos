var RandomBubble = function( options ){

	var vx = (Math.random()-Math.random())*0.5,
		vy = (Math.random()-Math.random())*0.5,
		x = Math.round(Math.random()* (options.globalWidth+256+128) )-128,
		y = Math.round(Math.random()* (options.globalHeight+256+128) )-128,
		radius = (Math.random()*16)+4,
		fillColor = Math.floor(Math.random()*(255*255*255)/600),
		borderColor = Math.floor(Math.random()*(255*255*255)/600);

	var parent = Bubble({
		x: x,
		y: y,
		radius: radius,
		vx: vx,
		vy: vy,
		borderColor: borderColor,
		fillColor: fillColor,
		alpha: 0.3
	});

	parent.addToWorld = false;

	var move = parent.move,
		x    = parent.x,
		y    = parent.y;
	
	var drag, checkBounds, randomMovement, update;

	checkBounds = function(){
		var drawX = x() + options.world.x;
		var drawY = y() + options.world.y;

		var w = options.globalWidth;
		var h = options.globalHeight;

		var leftBound   = 0-128;
		var rightBound  = w+256;
		var topBound    = 0-128;
		var bottomBound = h+256;

		// too far left
		if( drawX < leftBound ){
			x( (0-options.world.x+w)+64 );
		}

		// too far right
		if( drawX > rightBound ){
			x( (0-options.world.x)-64 );
		}

		// too far up
		if( drawY < topBound ){
			y( (0-options.world.y+h)+64 );
		}

		// too far down
		if( drawY > bottomBound ){
			y( (0-options.world.y)-64 );
		}
	};

	randomMovement = function(){
		if( (Math.round((Math.random()*2))==1) ){
			vx += (Math.random()-Math.random())/10;
			vy += (Math.random()-Math.random())/10;
		}
	};

	drag = function(){
		vx /= 1.01;
		vy /= 1.01;
	};

	update = function(){
		checkBounds();
		randomMovement();
		drag();
		move(vx, vy);
	};

	parent.update = update;

	return parent;
};