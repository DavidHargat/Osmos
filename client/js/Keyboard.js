
/**
* Contains the state of certain keys
*/
var Keyboard = function(){
	
	var keyCodes = {
		backspace: 8,
		tab: 9,
		enter: 13,
		shift: 16,
		ctrl: 17,
		alt: 18,
		left:37,
		up: 38,
		right: 39,
		down: 40,
		a: 65,
		b: 66,
		c: 67,
		d: 68,
		e: 69,
		f: 70,
		g: 71,
		h: 72,
		i: 73,
		j: 74,
		k: 75,
		l: 76,
		m: 77,
		n: 78,
		o: 79,
		p: 80,
		q: 81,
		r: 82,
		s: 83,
		t: 84,
		u: 85,
		v: 86,
		w: 87,
		x: 88,
		y: 89,
		z: 90,
		zero: 48,
		one: 49,
		two: 50,
		three: 51,
		four: 52,
		five: 53,
		six: 54,
		seven: 55,
		eight: 56,
		nine: 57,
		spacebar: 32
	};

	var keyNames = {};
	var state = {};

	var setup = function(){
		
		for( name in keyCodes ){
			state[ name ] = false;
		}

		for( name in keyCodes ){
			keyNames[ keyCodes[ name ] ] = name;
		}

		document.addEventListener('keyup',function( e ){
			var code = e.keyCode,
				name = keyNames[code];
			if( name ){
				state[name] = false;
			}		
		});

		document.addEventListener('keydown',function( e ){
			var code = e.keyCode,
				name = keyNames[code];
			if( name ){
				state[name] = true;
			}
		});
	
	};

	setup();

	return {
		state: state
	};
};