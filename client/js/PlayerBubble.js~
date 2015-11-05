var PlayerBubble = function( options ){
	var parent = Bubble(options);

	parent.id = options.id;
	parent.name = options.name || "ERROR";

	var targetX = 0;
	var targetY = 0;

	var text = new PIXI.Text(parent.name, {font:"48px Arial", fill:"white"});
	text.anchor.set(0.5,0.5);
	text.scale.set(0.1,0.1);
	parent.graphics.addChild(text);

	parent.setTarget = function(px, py){
		targetX = px;
		targetY = py;
	};

	var tween = function(){
		/*
		parent.pos(targetX,targetY);
		*/
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

			var nx = position.x+dx*(d/4);
			var ny = position.y+dy*(d/4);
			
			parent.pos(nx,ny);
		}
	};

	parent.update = function(){
		tween();
	    parent.updateRadius();

	};
	return parent;
};