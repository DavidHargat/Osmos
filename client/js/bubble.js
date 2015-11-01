var Bubble = function( options ){
	var parent = ClientEntity( options );

	var graphics = parent.graphics,
		update   = parent.update,
		move     = parent.move,
		radius_  = options.radius,
		vx       = options.vx || 0,
		vy       = options.vy || 0,
		color    = options.color,
		alpha    = options.alpha || 1,
		borderWidth = options.borderWidth || 1,
		bubbleList = options.bubbleList;

	var radius = function(v){
		if( typeof(v) === "number" ){
			radius_ = v;
		}
		return radius_;
	};

	var createGraphics = function(){
		var r = radius_;
		var fillColor = options.fillColor; 
		var borderColor = options.borderColor;

		var fill = new PIXI.Graphics();
		fill.beginFill(fillColor,alpha);
		fill.drawCircle(0, 0, r);
		fill.endFill();

		var border = new PIXI.Graphics();
		border.lineStyle(borderWidth, borderColor, alpha);
		border.drawCircle(0, 0, r);   //(x,y,radius)		
		border.endFill();

		graphics.addChild(fill);
		graphics.addChild(border);	
	};
	createGraphics();


	var accelerate;

	accelerate = function(px,py){
		vx += px;
		vy += py;
	};

	var update = function(){
		move(vx, vy);
		vx /= 1.1;
		vy /= 1.1;
	};

	parent.accelerate = accelerate;
	parent.radius = radius;
	parent.update = update;

	return parent;
};

var RandomBubble = function( options ){

	var vx = (Math.random()-Math.random())*0.5,
		vy = (Math.random()-Math.random())*0.5,
		x = Math.round(Math.random()* (renderer.width+256+128) )-128,
		y = Math.round(Math.random()* (renderer.height+256+128) )-128,
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

		var w = renderer.width;
		var h = renderer.height;

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