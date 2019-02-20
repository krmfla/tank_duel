function Bullet_Module(self) {
    this.stampId = new Date().getTime();
    this.tankBase = self;
    this.ratioX = null;
    this.ratioY = null;
    this.baseX = null;
    this.baseY = null;
    this.angle = null;
    this.element = null;
    this.timer = null;
    this.init();
}

Bullet_Module.prototype.init = function () {
    console.warn("=== init ===");
    var tank = this.tankBase;
    var dis_x = tank.x - tank.lockOnTarget.x;
    var dis_y = tank.y - tank.lockOnTarget.y;
    var dis_h = Math.sqrt(dis_x * dis_x + dis_y * dis_y);
    this.angle = Math.atan2(dis_y, dis_x) * 180 / Math.PI;

    this.baseX = tank.x - dis_x / dis_h * tank.tankBodyEl.clientWidth / 2;
    this.baseY = tank.y - dis_y / dis_h * tank.tankBodyEl.clientHeight / 2;

    this.ratioX = dis_x / dis_h * tank.characterData.bullet_step_range;
    this.ratioY = dis_y / dis_h * tank.characterData.bullet_step_range;

    // render
    if (!this.element) {
        this.element = document.createElement("DIV");
        this.element.classList.add("bullet_wrapper");
        this.element.style.transform = "rotate(" + this.angle + "deg)";
        tank.main.appendChild(this.element);
    }
    this.process();
}

Bullet_Module.prototype.process = function () {
    this.baseX -= this.ratioX;
    this.baseY -= this.ratioY;

    this.clip();

    if (this.hitTest()) {
        clearTimeout(this.timer);
        this.decreaseHP();
        this.discard();
        return;
    } else if (this.outField()) {
        clearTimeout(this.timer);
        this.discard();
        return;
    } else {
        this.timer = setTimeout(function () {
            this.process();
        }.bind(this), 42);
    }
}

Bullet_Module.prototype.clip = function () {
    this.element.style.left = (this.baseX - this.element.clientWidth / 2) + "px";
    this.element.style.top = (this.baseY - this.element.clientHeight / 2) + "px";
}

Bullet_Module.prototype.hitTest = function () {
    var disX = this.baseX - this.tankBase.lockOnTarget.x;
    var disY = this.baseY - this.tankBase.lockOnTarget.y;
    var range = Math.sqrt(disX * disX + disY * disY);
    if (range < (this.tankBase.lockOnTarget.tankBodyEl.clientWidth / 2 - 10)) {
        console.warn("HIT!");
        return true;
    } else {
        return false;
    }
}

Bullet_Module.prototype.decreaseHP = function () {
    var element = this.tankBase.lockOnTarget.tankBodyEl;
    this.tankBase.lockOnTarget.hitPoint -= 10;
    element.classList.add('shake');
    setTimeout(function () {
        element.classList.remove('shake');
    }, 1000);
}

Bullet_Module.prototype.outField = function () {
    if (this.baseX < 0 || this.baseX > this.tankBase.main.clientWidth || this.baseY < 0 || this.baseY > this.tankBase.main.clientHeight) {
        console.warn("out of field");
        return true;
    } else {
        return false;
    }
}

Bullet_Module.prototype.discard = function () {
    discardElement(this.element);
    this.tankBase.removeBullet(this);
}

