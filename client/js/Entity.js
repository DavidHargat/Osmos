var Entity = function( options ){
	var graphics = new PIXI.Container();
	
	var x,y,radius_,radius,pos,move,size,distance;
	
	radius_ = options.radius || 4;

	x = function( px ){
		if( typeof( px ) === "number" ) graphics.x = px;
		return graphics.x;
	};
	y = function( py ){
		if( typeof( py ) === "number" ) graphics.y = py;
		return graphics.y;	
	};
	radius = function( pr ){
		if( typeof( pr ) === "number" ) radius = pw;
		return radius;
	};
	pos = function( px, py ){
		return { x: x( px ), y: y( py ) };
	};
	move = function( px , py ){
		return pos( x() + px , y() + py );
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
	if( has_(options.x) ) x(options.x);
	if( has_(options.y) ) y(options.y);

	return {
		x: x,
		y: y,
		radius: radius,
		pos: pos,
		move: move,
		size: size,
		distance: distance,
		direction: direction,
		graphics: graphics,
		addToWorld: addToWorld
	};
};