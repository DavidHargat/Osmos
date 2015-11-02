var PlayerBubble = function( options ){
	var parent = Bubble(options);
	parent.id = options.id;

	var targetX = 0;
	var targetY = 0;

	var running = false;

	parent.setTarget = function(px, py){
		targetX = px;
		targetY = py;
	};

	var tween = function(){
		parent.pos(targetX,targetY);
		/*
		var position = parent.pos();
		var x1=position.x,
			y1=position.y,
			x2=targetX,
			y2=targetY;

		var d = Math.sqrt(
			((x2 - x1) * (x2 - x1))+
			((y2 - y1) * (y2 - y1)) 
		);

		if( d > 1){
			var dx = (x2-x1)/d;
			var dy = (y2-y1)/d;

			var nx = position.x+dx*(d/2);
			var ny = position.y+dy*(d/2);
			
			parent.pos(nx,ny);
		}
		*/
	};

	parent.update = function(){

		/*
		if(!running){
			var tween = new TWEEN.Tween(parent.graphics);
			   // tween.easing(TWEEN.Easing.Elastic.InOut);
			    tween.to({ x: targetX, y: targetY }, 10)
			    .onComplete(function(){
			    	running = false;
			    })
			    .start();
			running = true;
		}else{
			//console.log("Skipping animation.");
		}*/
		tween();
	    parent.updateRadius();

	};
	return parent;
};