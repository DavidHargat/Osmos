var Bubble = function( options ){
	var parent = Entity( options );

	var graphics = parent.graphics,
		update   = parent.update,
		move     = parent.move,
		vx       = options.vx || 0,
		vy       = options.vy || 0,
		color    = options.color,
		alpha    = options.alpha || 0,
		borderAlpha = options.borderAlpha || options.alpha || 1,
		borderWidth = options.borderWidth || 1,
		bubbleList = options.bubbleList;

	parent.radius = options.radius;

	var createGraphics = function(){
		var r = 10;
		var fillColor = options.fillColor; 
		var borderColor = options.borderColor;

		var fill = new PIXI.Graphics();
		fill.beginFill(fillColor,alpha);
		fill.drawCircle(0, 0, r);
		fill.endFill();

		var border = new PIXI.Graphics();
		border.lineStyle(borderWidth, borderColor, borderAlpha);
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

	var setRadius = function(r){
		graphics.scale.x = r/10;
		graphics.scale.y = r/10;
	};

	var updateRadius = function(){
		setRadius(parent.radius);
	};

	updateRadius();

	parent.updateRadius = updateRadius;
	parent.accelerate = accelerate;
	parent.update = update;

	return parent;
};