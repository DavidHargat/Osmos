var Entity = function( options ){
	var graphics = new PIXI.Container();
	
	var x,y,width,height,pos,move,size,distance;
	
	x = function( px ){
		if( typeof( px ) === "number" ) graphics.x = px;
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
	distance = function( other ){
		var x1 = x(),
			y1 = y(),
			x2 = other.x(),
			y2 = other.y();

		return Math.sqrt(
			((x2 - x1) * (x2 - x1))+
			((y2 - y1) * (y2 - y1)) 
		);
	};
	direction = function( other ){
		var d = distance( other );
		var x1 = x(),
			y1 = y(),
			x2 = other.x(),
			y2 = other.y();

		return {
			x: (x2-x1)/d,
			y: (y2-y1)/d,
		};
	};
	addToWorld = true;

	var has_ = function(v){return !(typeof(v)==="undefined");};
	if( has_(options.x)      ) x(options.x);
	if( has_(options.y)      ) y(options.y);
	if( has_(options.width)  ) width(options.width);
	if( has_(options.height) ) height(options.height);
	//console.log(x(),y());

	return {
		x: x,
		y: y,
		width: width,
		height: height,
		pos: pos,
		move: move,
		size: size,
		distance: distance,
		direction: direction,
		graphics: graphics,
		addToWorld: addToWorld
	};
};

// Doesn't care about the server
var ClientEntity = function( options ){
	var parent = Entity( options );

	var world = options.world;

	parent.update = function(){
		// Placeholder
	};

	return parent;
};

// Get synchronized to the server.
var ServerEntity = function( options ){
	var parent = Entity( options );

	parent.id = options.id;

	return parent;
};