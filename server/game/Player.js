
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

	var update = function( players ){
		
		var speed = 1;

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

	var getRadius = function(){
		return radius;
	};

	return {
		id: id,
		position: position,
		controller: controller,
		update: update,
		getRadius: getRadius,
		socket: socket
	};
};

module.exports = Player;