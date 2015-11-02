// main.js
// Instantiation of our game client, and socket.io.
var game;

window.addEventListener('load',function(){
	var socket = io();
	var client = GameClient( socket );
	client.start();
	game = client;
});