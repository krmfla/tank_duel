/*window.onerror = function (errorMsg, url, lineNumber) {
	alert('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber);
};*/

var room_id = null;

console.log(location);

if (window.location.pathname === "/") {
	room_id = Math.floor(Math.random() * 10000);
	window.location.href = window.location.href + room_id;
} else {
	var content = window.location.pathname;
	var reg = /^\/(\d*)$/g;
	var match = reg.exec(content);
	console.warn(match[1]);
	if (match[1]) {
		room_id = match[1];
	} else {
		alert("房間不存在");
	}
}

console.log("room_id: " + room_id);

window.onload = function () {
	var tank1 = document.getElementById("tank1");
	var tank2 = document.getElementById("tank2");
	var config = {
		"speed": 2,
		"rotate": 2,
		"bullet_step_range": 10
	};
	window.tankPrototype1 = new TankPrototype(tank1, 1, config);
	window.tankPrototype2 = new TankPrototype(tank2, 2, config);
	createRoom();
}

function createRoom() {
	var qrcode_el = document.getElementById("qrcode");
	console.warn(qrcode_el);
	var url = window.location.origin;
	console.log("url: " + url);
	var path = "/controller/" + room_id;
	// console.log(location);
	console.log(url + path);
	var qrcode = new QRCode(qrcode_el, url + path);
}

function gameStart() {
	console.warn("gameStart");
	$("#qrcode_box").hide();
	$("#main").removeClass('hidden');
	window.tankPrototype1.lockOn(window.tankPrototype2);
	window.tankPrototype2.lockOn(window.tankPrototype1);

	window.tankPrototype1.setFireSystem();
	window.tankPrototype2.setFireSystem();
}

var socket = io(`/${room_id}`);
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
	gameStart();
});