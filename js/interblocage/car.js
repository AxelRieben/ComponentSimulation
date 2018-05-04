class Car {
    constructor(x, y, width, height, imageSource, limitBegin, limitEnd, dx) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.imageSource = imageSource;
        this.limitBegin = limitBegin;
        this.limitEnd = limitEnd;
        this.dx = dx;
        this.car = null;
        this.rect = null;
        this.animation = null;
        this.isRunning = true;
        this.startCar();
    }

    startCar() {
        let self = this;

        this.car = new Image();

        this.rect = new Konva.Image({
            x: this.x,
            y: this.y,
            image: this.car,
            width: this.width,
            height: this.height
        });

        this.car.onload = function () {

            layer.add(self.rect);
        };

        this.car.src = this.imageSource;

        this.setAnimation();
        this.animation.start();
    }

    haveIntersection(car) {
        let security_distance = 5;
        return !(
            this.rect.getX() > car.rect.getX() + car.width + security_distance ||
            this.rect.getX() + this.width + security_distance < car.rect.getX() ||
            this.rect.getY() > car.rect.getY() + car.height + security_distance ||
            this.rect.getY() + this.height + security_distance < car.rect.getY()
        );
    }

    haveIntersectionGroundMark(mark) {
        let security_distance = 5;
        return !(
            this.rect.getX() > mark.getX() + mark.getWidth() + security_distance ||
            this.rect.getX() + this.width + security_distance < mark.getX() ||
            this.rect.getY() > mark.getY() + mark.getHeight() + security_distance ||
            this.rect.getY() + this.height + security_distance < mark.getY()
        );
    }

    collision() {
        self = this;
        listCar.forEach((car) => {
            if (self === car) {
                return;
            }
            if (self.haveIntersection(car)) {
                self.stopAnimation();
                self.isRunning = false;
            }
        });
    }

    collisionWithGroundMark() {
        //Nothing
    }

    setAnimation() {
        // Nothing
    }

    isOutOfScreen() {
        //Nothing
    }

    isAfterMidRoad() {
        //Nothing
    }

    isInCriticalZone() {
        //Nothing
    }

    isBeforeGroundMark() {
        //Nothing
    }

    stopAnimation() {
        this.animation.stop();
    }
}

class CarLeft extends Car {

    constructor(x, y, width, height, fillColor, borderColor, borderWith, limitBegin, limitEnd, dx) {
        super(x, y, width, height, fillColor, borderColor, borderWith, limitBegin, limitEnd, dx);
    }

    setAnimation() {
        let self = this;

        this.animation = new Konva.Animation(function (frame) {
            self.rect.setX(parseInt(self.limitBegin + self.dx * frame.time));
            if (self.isRunning)
                self.collision();
        }, layer);
    }

    collisionWithGroundMark() {
        if (this.haveIntersectionGroundMark(groundMarkLeft) && this.isBeforeGroundMark()) {
            this.stopAnimation();
            this.isRunning = false;
        }
    }

    isAfterMidRoad() {
        return this.rect.getX() > stage.getWidth() / scale / 2 + size / 2 + groundMarkSize;
    }

    isInCriticalZone() {
        return !(this.isAfterMidRoad())
            && this.rect.getX() > stage.getWidth() / scale / 2 - size / 2 - groundMarkSize - 3 * carSize;
    }

    isBeforeGroundMark() {
        return this.rect.getX() + this.width < stage.getWidth() / scale / 2 - size / 2 - groundMarkSize;
    }

    isOutOfScreen() {
        return this.rect.getX() > this.limitEnd;
    }
}

class CarTop extends Car {
    constructor(x, y, width, height, fillColor, borderColor, borderWith, limitBegin, limitEnd, dx) {
        super(x, y, width, height, fillColor, borderColor, borderWith, limitBegin, limitEnd, dx);
    }

    setAnimation() {
        let self = this;

        this.animation = new Konva.Animation(function (frame) {
            self.rect.setY(self.limitBegin + self.dx * frame.time);
            if (self.isRunning)
                self.collision();
        }, layer);
    }

    collisionWithGroundMark() {
        if (this.haveIntersectionGroundMark(groundMarkTop) && this.isBeforeGroundMark()) {
            this.stopAnimation();
            this.isRunning = false;
        }
    }

    isAfterMidRoad() {
        return this.rect.getY() > stage.getHeight() / scale / 2 + size / 2 + groundMarkSize;
    }

    isInCriticalZone() {
        return this.isBeforeGroundMark();
    }

    isBeforeGroundMark() {
        return this.rect.getY() + this.height < stage.getHeight() / scale / 2 - size / 2 - groundMarkSize;
    }

    isOutOfScreen() {
        return this.rect.getY() > this.limitEnd
    }
}

class CarRight extends Car {
    constructor(x, y, width, height, fillColor, borderColor, borderWith, limitBegin, limitEnd, dx) {
        super(x, y, width, height, fillColor, borderColor, borderWith, limitBegin, limitEnd, dx);
    }

    setAnimation() {
        let self = this;

        this.animation = new Konva.Animation(function (frame) {
            self.rect.setX(self.limitBegin + self.dx * frame.time);
            if (self.isRunning)
                self.collision();
        }, layer);
    }

    collisionWithGroundMark() {
        if (this.haveIntersectionGroundMark(groundMarkRight) && this.isBeforeGroundMark()) {
            this.stopAnimation();
            this.isRunning = false;
        }
    }

    isAfterMidRoad() {
        return this.rect.getX() + this.width < stage.getWidth() / scale / 2 - size / 2 - groundMarkSize;
    }

    isInCriticalZone() {
        return !(this.isAfterMidRoad())
            && this.rect.getX() + this.width < stage.getWidth() / scale / 2 + size / 2 + groundMarkSize + 3 * carSize;
    }

    isBeforeGroundMark() {
        return this.rect.getX() > stage.getWidth() / scale / 2 + size / 2 + groundMarkSize;
    }

    isOutOfScreen() {
        return this.rect.getX() + this.width < this.limitEnd;
    }
}

class CarBottom extends Car {
    constructor(x, y, width, height, fillColor, borderColor, borderWith, limitBegin, limitEnd, dx) {
        super(x, y, width, height, fillColor, borderColor, borderWith, limitBegin, limitEnd, dx);
    }

    setAnimation() {
        let self = this;

        this.animation = new Konva.Animation(function (frame) {
            self.rect.setY(self.limitBegin + self.dx * frame.time);
            if (self.isRunning)
                self.collision();
        }, layer);
    }

    collisionWithGroundMark() {
        if (this.haveIntersectionGroundMark(groundMarkBottom) && this.isBeforeGroundMark()) {
            this.stopAnimation();
            this.isRunning = false;
        }
    }

    isAfterMidRoad() {
        return this.rect.getY() + this.height < stage.getHeight() / scale / 2 - size / 2 - groundMarkSize;
    }

    isInCriticalZone() {
        return this.isBeforeGroundMark();
    }

    isBeforeGroundMark() {
        return this.rect.getY() > stage.getHeight() / scale / 2 + size / 2 + groundMarkSize;
    }

    isOutOfScreen() {
        return this.rect.getY() + this.height < this.limitEnd;
    }
}