
var Player = function( options ){
	var socket = options.socket;

	var position = {
		x: 0,
		y: 0
	};

	var radius = 32;

	var touches = function( other ){
		var r1 = radius;
		var r2 = other.radius;

		return false;
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

	return {
		position: position,
		controller: controller,
		socket: socket
	};
};

modules.exports = Player;