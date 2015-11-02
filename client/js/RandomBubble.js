/**
* A randomized bubble to be rendered on the client only.
* Had a random size, position, color, and velocity.
* Also randomly shifts velocity.
* @param {Object} options
*/
var RandomBubble = function( options ){

	var mod = 512;

	var vx = (Math.random()-Math.random())*0.5,
		vy = (Math.random()-Math.random())*0.5,
		x = Math.round(Math.random()* ( options.globalWidth+mod) )-(options.globalWidth/2)-(mod/2),
		y = Math.round(Math.random()* ( options.globalHeight+mod) )-(options.globalHeight/2)-(mod/2),
		radius = (Math.random()*256)+4,
		fillColor = Math.round(Math.random()*(255*255*255)/1),
		borderColor = Math.round(Math.random()*(255*255*255)/1);

	var parent = Bubble({
		x: x,
		y: y,
		radius: radius,
		vx: vx,
		vy: vy,
		borderColor: borderColor,
		fillColor: fillColor,
		alpha: 0.05
	});
	
	var move = parent.move,
		x    = parent.x,
		y    = parent.y;
	
	var drag, randomMovement, update;

	/**
	* Randomly increment/decrement the velocity.
	*/
	randomMovement = function(){	
		vx += (Math.random()-Math.random())/10;
		vy += (Math.random()-Math.random())/10;
	};

	/**
	* Applies 'drag' to the velocity to keep bubbles from zooming around.
	*/
	drag = function(){
		vx /= 1.01;
		vy /= 1.01;
	};

	/**
	* Update the bubble.
	*/
	update = function(){
		randomMovement();
		drag();
		move(vx, vy);
	};

	parent.update = update;

	return parent;
};