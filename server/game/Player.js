
var Player = function( options ){
	var socket = options.socket;

	var x_  = options.x;
	var y_  = options.y;
	var r_  = options.radius;
	var id_ = options.id;

	var id = id_;

	var position = {
		x: x_,
		y: y_
	};

	var velocity = {
		x: 0,
		y: 0
	};

	var radius = r_;

	var touches = function( other ){
		var r1 = radius;
		var r2 = other.radius;

		return false;
	};

	var handleCollision = function( other, d ){
		var r1 = getRadius();
		var r2 = other.getRadius();
		if( r1!=r2 ){
			if(r1>0&&r2>0){
				if(r1>r2){
					setRadius(r1+1);
					other.setRadius(r2-1);
				}else{
					setRadius(r1-1);
					other.setRadius(r2+1);
				}
				var dx = (position.x-other.position.x)/d;
				var dy = (position.y-other.position.y)/d;
				position.x += dx;
				position.y += dy;
				other.position.x -= dx;
				other.position.y -= dy;
			}
		}
	};

	var handleBoundaries = function(){
		var WORLD_SIZE = 500;
		var center = {position:{x:0, y:0}};
		var d = distance(center);
		if( d >= WORLD_SIZE-getRadius()){
			var dx = (position.x-center.position.x)/d;
			var dy = (position.y-center.position.y)/d;
			position.x -= dx*(d/100);
			position.y -= dy*(d/100);
			velocity.x *= -dx;
			velocity.y *= -dx;
		}
	};

	var update = function( players ){
		var speed = 0.25;

		// input/acceleration
		if( controller.up    ) velocity.y -= speed;
		if( controller.down  ) velocity.y += speed;
		if( controller.left  ) velocity.x -= speed;
		if( controller.right ) velocity.x += speed;

		// drag
		velocity.x /= 1.1;
		velocity.y /= 1.1;

		// move
		position.x += velocity.x;
		position.y += velocity.y;

		players.forEach(function( ply ){
			if(ply.id != id){
				var d = distance(ply);
				if( d<(getRadius()+ply.getRadius()) ){
					handleCollision(ply, d);
				}
			}
		});
		handleBoundaries();
	};

	var distance = function( other ){
		var x1 = position.x,
			y1 = position.y,
			x2 = other.position.x,
			y2 = other.position.y;

		return Math.sqrt(
			((x2 - x1) * (x2 - x1))+
			((y2 - y1) * (y2 - y1)) 
		);
	};

	var controller = {
		up: false,
		down: false,
		left: false,
		right: false
	};

	var setRadius = function(r){
		radius = r;
	};

	var getRadius = function(){
		return radius;
	};

	return {
		id: id,
		setRadius: setRadius,
		getRadius: getRadius,
		position: position,
		controller: controller,
		update: update,
		getRadius: getRadius,
		socket: socket
	};
};

module.exports = Player;