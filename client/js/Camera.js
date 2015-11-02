var Camera = function( world, width, height ){

	var position = {
		x: 0,
		y: 0
	};

	var tx = 4,
		ty = 4,
		width = width,
		height = height,
		set,target,update;


	set = function(px,py){
		position.x = px;
		position.y = py;
		world.x = -px + width/2;
		world.y = -py + height/2;
	};

	target = function(px,py){
		tx = px;
		ty = py;
		
	};

	//var tween;

	update = function(){
		var x1=position.x,
			y1=position.y,
			x2=tx,
			y2=ty;

		var d = Math.sqrt(
			((x2 - x1) * (x2 - x1))+
			((y2 - y1) * (y2 - y1)) 
		);

		if( d > 2){
			var dx = (x2-x1)/d;
			var dy = (y2-y1)/d;

			var nx = position.x+dx*(d/8);
			var ny = position.y+dy*(d/8);
			
			set(nx, ny);
		}
	};

	return {
		set: set,
		target: target,
		update: update
	};
};