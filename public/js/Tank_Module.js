//=== Tank Prototype ===
function TankPrototype(DOMelement, character, configData) {
	this.tankBodyEl = DOMelement;
	this.main = document.getElementById("main");
	this.rotateTimer = null;
	this.moveTimer = null;
	this.lockonTimer = null;
	this.offsetAngle = 270;
	this.x = null; //center of X
	this.y = null; //center of Y
	this.offsetX = null; // originX + offsetX = center of X
	this.offsetY = null; // originY + offsetY = center of Y
	this.lockOnTarget = null;
	this.tankBottom = null;

	//=== event binding ===
	this.main.addEventListener("click", this.setPoint.bind(this));
	document.addEventListener("keydown", this.stopAndShow.bind(this));

	//=== initialize ===
	this.init(configData, character);
}

//=== Action ===
TankPrototype.prototype.init = function (configData, character) {
	this.characterData = configData;
	//this.setData(configData);
	this.initPosition(character);
};

TankPrototype.prototype.setPoint = function (event) {
	//console.log(event);

	var distanceX = event.clientX - this.x;
	var distanceY = event.clientY - this.y;
	var hypotenuse = Math.round(Math.sqrt((distanceX * distanceX) + (distanceY * distanceY)));

	var forwardX = distanceX / hypotenuse;
	var forwardY = distanceY / hypotenuse;
	var angle = (Math.atan2(distanceY, distanceX) * 180 / Math.PI) + 180 + this.offsetAngle;

	if (isNaN(forwardX)) {
		forwardX = 0;
	}
	if (isNaN(forwardY)) {
		forwardY = 0;
	}


	this.targetPoint = {
		"x": event.clientX,
		"y": event.clientY,
		"distanceX": distanceX,
		"distanceY": distanceY,
		"hypotenuse": hypotenuse,
		"forwardX": forwardX,
		"forwardY": forwardY,
		"angle": angle
	};

	//Rotation
	clearTimeout(this.rotateTimer);
	clearTimeout(this.moveTimer);
	//console.log(this.rotateTimer);
	//console.log(this.moveTimer);
	this.rotate();
	return;

};

TankPrototype.prototype.rotate = function () {
	var angle = this.targetPoint.angle;
	//clockwise, Counterclockwise
	var clockwise;
	var counterClockwise;

	//Condition
	if (Math.abs(angle - this.currentAngle) < this.characterData.rotate) {
		this.currentAngle = angle;
	} else if (angle > this.currentAngle) {
		clockwise = angle - this.currentAngle;
		counterClockwise = (this.currentAngle + 360) - angle;

		if (clockwise > counterClockwise) {
			this.currentAngle -= this.characterData.rotate;
		} else {
			this.currentAngle += this.characterData.rotate;
		}
	} else if (angle < this.currentAngle) {
		clockwise = (angle + 360) - this.currentAngle;
		counterClockwise = this.currentAngle - angle;
		if (clockwise > counterClockwise) {
			this.currentAngle -= this.characterData.rotate;
		} else {
			this.currentAngle += this.characterData.rotate;
		}
	}

	if (this.currentAngle > 630) {
		this.currentAngle -= 360;
	} else if (this.currentAngle < 270) {
		this.currentAngle += 360;
	}

	this.tankBottom.style.transform = "rotate(" + this.currentAngle + "deg)";

	if (this.currentAngle !== angle) {
		this.rotateTimer = setTimeout(function () {
			this.rotate();
		}.bind(this), 42);
	} else {
		//=== moving ===
		this.move();
	}
	// console.log("angle:" + angle + ", current:" + this.currentAngle);

};

TankPrototype.prototype.move = function () {
	if (this.targetPoint.forwardX === 0) {
		this.x = this.targetPoint.x;
		//console.log("forwardX = 0");
	} else if (Math.abs(this.targetPoint.x - this.x) < Math.abs(this.targetPoint.forwardX * this.characterData.speed)) {
		this.x = this.targetPoint.x;
		//console.log("X close");
	} else {
		this.x += this.targetPoint.forwardX * this.characterData.speed;
		//console.log("X < distance");
	}

	if (this.targetPoint.forwardY === 0) {
		this.y = this.targetPoint.y;
		//console.log("forwardY = 0");
	} else if (Math.abs(this.targetPoint.y - this.y) < Math.abs(this.targetPoint.forwardY * this.characterData.speed)) {
		//console.log("Y close");
		this.y = this.targetPoint.y;
	} else {
		this.y += this.targetPoint.forwardY * this.characterData.speed;
		//console.log("Y < distance");
	}

	this.tankBodyEl.style.left = (this.x - this.offsetX) + "px";
	this.tankBodyEl.style.top = (this.y - this.offsetY) + "px";

	if (this.x !== this.targetPoint.x || this.y !== this.targetPoint.y) {
		this.moveTimer = setTimeout(function () {
			this.move();
		}.bind(this), 42);
	}

	//console.log("current:" + this.x + " : " + this.y + "; target: " + this.targetPoint.x + " : " + this.targetPoint.y);
}

TankPrototype.prototype.lockOn = function (target) {
	//TODO:
	this.lockOnTarget = target;
	var cannon = this.tankBodyEl.querySelector('.cannon');
	this.lockonTimer = setInterval(function () {
		var distanceX = this.x - this.lockOnTarget.x;
		var distanceY = this.y - this.lockOnTarget.y;
		var cannonAngle = (Math.atan2(distanceY, distanceX) * 180 / Math.PI) + 270;
		cannon.style.transform = "rotate(" + cannonAngle + "deg)";
	}.bind(this), 300);

};

TankPrototype.prototype.eventHandler = function (event) {
};

//=== Method ===
TankPrototype.prototype.initPosition = function (character) {
	console.log("initPosition: " + character);
	var startX;
	var startY = 350;
	this.offsetX = parseFloat(this.tankBodyEl.clientWidth) / 2;
	this.offsetY = parseFloat(this.tankBodyEl.clientHeight) / 2;

	if (character === 1) {
		startX = 50;
		this.currentAngle = 180 + this.offsetAngle;
	} else if (character === 2) {
		startX = 750;
		this.currentAngle = 0 + this.offsetAngle;
	}

	this.x = startX + this.offsetX;
	this.y = startY + this.offsetY;

	console.log("x:" + this.x);
	console.log("y:" + this.y);

	//render
	this.tankBodyEl.style.left = startX + "px";
	this.tankBodyEl.style.top = startY + "px";
	this.tankBottom = this.tankBodyEl.querySelector('.tankBody');
	this.tankBottom.style.transform = "rotate(" + this.currentAngle + "deg)";

};

TankPrototype.prototype.stopAndShow = function () {
	clearTimeout(this.rotateTimer);
	clearTimeout(this.moveTimer);
	console.info(this);
	console.info(this.targetPoint);
};

//temporary
TankPrototype.prototype.setTouchPoint = function (object) {
	console.log(object);

	var distanceX = object.touchX - this.x;
	var distanceY = object.touchY - this.y;
	var hypotenuse = Math.round(Math.sqrt((distanceX * distanceX) + (distanceY * distanceY)));

	var forwardX = distanceX / hypotenuse;
	var forwardY = distanceY / hypotenuse;
	var angle = (Math.atan2(distanceY, distanceX) * 180 / Math.PI) + 180 + this.offsetAngle;

	if (isNaN(forwardX)) {
		forwardX = 0;
	}
	if (isNaN(forwardY)) {
		forwardY = 0;
	}


	this.targetPoint = {
		"x": event.clientX,
		"y": event.clientY,
		"distanceX": distanceX,
		"distanceY": distanceY,
		"hypotenuse": hypotenuse,
		"forwardX": forwardX,
		"forwardY": forwardY,
		"angle": angle
	};

	//Rotation
	clearTimeout(this.rotateTimer);
	clearTimeout(this.moveTimer);
	//console.log(this.rotateTimer);
	//console.log(this.moveTimer);
	this.rotate();
	return;
};