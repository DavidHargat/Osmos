// main.js
// Test with vim.

var game;


window.addEventListener('load',function(){
	var socket = io();
	var nameElement = document.getElementById("name");
	var titleElement = document.getElementById("title");

	var removeElement = function( element ){
		element.parentElement.removeChild(element);
	};

	var startClient = function(){
		// Remove the 'sendName' event since we already sent it.
		nameElement.removeEventListener(sendNameListener);
		// Remove the login box
		removeElement(nameElement.parentElement);
		// Create Game Client
		var client = GameClient( socket );
		client.start();
		game = client; // export game to global scope for debugging.
		socket.emit('ready'); // Tell the server we're ready!
	};

	var nameInvalid = function( str ){
		titleElement.textContent = str;
	};

	// Wait for the server to tell us to start.
	socket.on('start-client', startClient);

	// If the server says our name is invalid display a message
	socket.on('name-invalid', nameInvalid);

	// Sends our name to the server.
	var sendName = function(){
		socket.emit('name', nameElement.value);
	};

	// When we press enter, send the name to the server.
	var sendNameListener = nameElement.addEventListener('keydown',function(e){
		var spacebar = 13;
		if(e.keyCode == spacebar){
			sendName();
		}
	});
});

