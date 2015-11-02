var PlayerBubble = function( options ){
	var parent = Bubble(options);
	parent.id = options.id;
	parent.update = function(){

	};
	return parent;
};