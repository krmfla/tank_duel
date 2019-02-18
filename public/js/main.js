/*window.onerror = function (errorMsg, url, lineNumber) {
	alert('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber);
};*/

window.onload = function () {
	var tank1 = document.getElementById("tank1");
	var tank2 = document.getElementById("tank2");
	var config = {
		"speed": 2,
		"rotate": 2
	};
	window.tankPrototype1 = new TankPrototype(tank1, 1, config);
	window.tankPrototype2 = new TankPrototype(tank2, 2, config);
	createRoom();
}

function createRoom() {
	var qrcode_el = document.getElementById("qrcode");
	console.warn(qrcode_el);
	var room_id = Math.floor(Math.random() * 10000);
	var url = "https://9676d270.ngrok.io";
	var path = "/controller.html";
	console.log(location);
	console.log(room_id);
	var qrcode = new QRCode(qrcode_el, url + path + "?room=" + room_id);
}

function gameStart() {
	$("#qrcode_box").hide();
	$("#main").removeClass('hidden');
	window.tankPrototype1.lockOn(window.tankPrototype2);
	window.tankPrototype2.lockOn(window.tankPrototype1);
}

var socket = io();
//console.log(socket);

//Event handler
function EventHandler(instance1, instance2) {

}

socket.on("player1 hit", function (data) {
	console.log(data);
	window.tankPrototype1.setTouchPoint(data);
});

socket.on("player2 hit", function (data) {
	console.log(data);
	window.tankPrototype2.setTouchPoint(data);
});

socket.on("game start", function (data) {
	console.log(data);
	// alert("game start");
	gameStart();
});