var Camera = function( world, width, height ){
	var x  = 0,
		y  = 0,
		tx = 4,
		ty = 4,
		width = width,
		height = height,
		set,target,update;


	set = function(px,py){
		x = px;
		y = py;
		world.x = -px + width/2;
		world.y = -py + height/2;
	};

	target = function(px,py){
		tx = px;
		ty = py;
	};

	update = function(){
		var x1=x,
			y1=y,
			x2=tx,
			y2=ty;

		var d = Math.sqrt(
			((x2 - x1) * (x2 - x1))+
			((y2 - y1) * (y2 - y1)) 
		);

		if( d > 4){
			var dx = (x2-x1)/d;
			var dy = (y2-y1)/d;

			x += dx*(d/16);
			y += dy*(d/16);

			set(x,y);
		}
	};

	return {
		set: set,
		target: target,
		update: update
	};
};