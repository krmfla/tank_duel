var mapEl;
var mapRatio;
var touchX;
var touchY;
var socket;
var room_id;
var reg = /^\/controller\/(\d*)$/g;
var match = reg.exec(window.location.pathname);

if (match[1]) {
    room_id = match[1];
} else {
    alert("房間不存在");
}

console.log("room_id: " + room_id);

socket = io(`/${room_id}`);

document.addEventListener("DOMContentLoaded", init);

function init() {
    mapEl = document.getElementById("controlMap");
    console.log(mapEl);
    mapEl.addEventListener("touchstart", handleTouch);
}

function handleTouch(event) {
    console.log(event);
    console.log(event.targetTouches[0]);
    console.log(event.targetTouches[0].clientX, event.targetTouches[0].clientY);
    console.log(event.targetTouches[0].target.clientWidth, event.targetTouches[0].target.clientHeight);
    if (!mapRatio) {
        mapRatio = 1280 / event.targetTouches[0].target.clientWidth;
    }

    touchX = event.targetTouches[0].clientX * mapRatio;
    touchY = event.targetTouches[0].clientY * mapRatio;

    socket.emit(character + " hit", { "touchX": touchX, "touchY": touchY });
}