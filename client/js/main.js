
var game;
window.addEventListener('load',function(){
	var socket = io();
	var client = GameClient( socket );
	client.start();
	game = client;
});