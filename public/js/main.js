/*window.onerror = function (errorMsg, url, lineNumber) {
	alert('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber);
};*/

var room_id = null;
counter_timer = null;
var counter_tens = 9;
var counter_ones = 9;
var counter_tens_el;
var counter_ones_el;
var duel_mode = null;
var computer_timer = null;

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
	eventBinding();
}

document.addEventListener("visibilitychange", function () {
	console.log(document.visibilityState);
	if (document.visibilityState === "hidden") {
		alert("對戰中斷！");
	}
});

function eventBinding() {
	var single_btn = document.getElementById("single_btn");
	var double_btn = document.getElementById("double_btn");

	single_btn.onclick = function () {
		createRoom(1);
		duel_mode = "single";
	}

	double_btn.onclick = function () {
		createRoom(2);
		duel_mode = "double";
	}
}

function createRoom(character) {
	var room_setting = document.getElementById("room_setting");
	var qrcode_box = document.getElementById("qrcode_box");
	var qrcode_el = document.getElementById("qrcode");
	console.warn(qrcode_el);
	var url = window.location.origin;
	console.log("url: " + url);
	var path = "/controller/" + room_id;
	// console.log(location);
	console.log(url + path);
	var qrcode = new QRCode(qrcode_el, url + path);

	socket.emit('room setting', {
		"character": character
	});
	room_setting.classList.add("hide");
	qrcode_box.classList.remove("hide");
}

function gameStart() {
	console.warn("=== gameStart ===");
	var ready = document.getElementById("signal_ready");
	var go = document.getElementById("signal_go");
	document.getElementById("signal_go");
	$("#qrcode_box").hide();
	$("#main").removeClass('hidden');

	counter_tens_el = document.getElementById("counter_tens");
	counter_ones_el = document.getElementById("counter_ones");

	window.tankPrototype1.lockOn(window.tankPrototype2);
	window.tankPrototype2.lockOn(window.tankPrototype1);



	ready.classList.add("active");
	go.classList.add("active");

	setTimeout(function () {
		window.tankPrototype1.setFireSystem();
		window.tankPrototype2.setFireSystem();
		//Game Start
		counter_timer = setInterval(function () {
			counter();
		}, 1000);
		//set Computer controller
		if (duel_mode === "single") {
			computerControl();
			computer_timer = setInterval(function () {
				computerControl();
			}, 15000);
		}

	}, 5000);
}

function gameEnd() {
	window.tankPrototype1.holdFiring();
	window.tankPrototype2.holdFiring();
	clearInterval(window.tankPrototype1.lockonTimer);
	clearInterval(window.tankPrototype2.lockonTimer);
	clearInterval(counter_timer);
	clearInterval(computer_timer);
}

function counter() {
	counter_ones -= 1;
	if (counter_ones < 0) {
		counter_tens -= 1;
		counter_ones = 9;
	}
	if (counter_tens === 0 && counter_ones === 0) {
		gameEnd();
	}

	counter_tens_el.className = "number" + counter_tens;
	counter_ones_el.className = "number" + counter_ones;
}

function computerControl() {
	console.log("computerControl");
	var x = Math.floor(Math.random() * 1280) + 1;
	var y = Math.floor(Math.random() * 720) + 1;
	window.tankPrototype2.setTouchPoint({
		"touchX": x,
		"touchY": y
	});
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