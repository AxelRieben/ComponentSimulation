class Car{
    constructor(x,y,width,height,fillColor,borderColor,borderWith, limitBegin, limitEnd, dx){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.fillColor = fillColor;
        this.borderColor = borderColor;
        this.borderWith = borderWith;
        this.limitBegin = limitBegin;
        this.limitEnd = limitEnd;
        this.dx = dx;
        this.rect = null;
        this.animation = null;
        this.startCar();
    }

    startCar(){
        let self = this;

        this.rect = new Konva.Rect({
            x: self.x,
            y: self.y,
            width: self.width,
            height: self.height,
            fill: self.fillColor,
            stroke: self.borderColor,
            strokeWidth: self.borderWith
        });

        this.setAnimation();
        this.animation.start();

        layer.add(this.rect);
    }

    haveIntersection(car) {
        return !(
            car.rect.getX() > this.rect.getX() + this.width ||
            car.rect.getX() + car.width < this.rect.getX() ||
            car.rect.getY() > this.rect.getY() + this.height ||
            car.rect.getY() + car.height < this.rect.getY()
        );
    }

    setAnimation(){
        // Nothing
    }

    isOutOfScreen(){
        //Nothing
    }

    stopAnimation(){
        this.animation.stop();
    }
}

class CarLeft extends Car{

    constructor(x,y,width,height,fillColor,borderColor,borderWith, limitBegin, limitEnd, dx){
        super(x,y,width,height,fillColor,borderColor,borderWith, limitBegin, limitEnd, dx);
    }

    setAnimation(){
        let self = this;

        this.animation = new Konva.Animation(function(frame){
            self.rect.setX(parseInt(self.limitBegin + self.dx * frame.time));
        }, layer);
    }

    isOutOfScreen(){
        return this.rect.getX() > this.limitEnd;
    }
}

class CarTop extends Car{
    constructor(x,y,width,height,fillColor,borderColor,borderWith, limitBegin, limitEnd, dx){
        super(x,y,width,height,fillColor,borderColor,borderWith, limitBegin, limitEnd, dx);
    }

    setAnimation(){
        let self = this;
        
        this.animation = new Konva.Animation(function(frame) {
            self.rect.setY(self.limitBegin + self.dx * frame.time);
        }, layer);
    }

    isOutOfScreen(){
        return this.rect.getY() > this.limitEnd
    }
}

class CarRight extends Car{
    constructor(x,y,width,height,fillColor,borderColor,borderWith, limitBegin, limitEnd, dx){
        super(x,y,width,height,fillColor,borderColor,borderWith, limitBegin, limitEnd, dx);
    }

    setAnimation(){
        let self = this;

        this.animation = new Konva.Animation(function(frame) {
            self.rect.setX(self.limitBegin + self.dx * frame.time);
        }, layer);
    }

    isOutOfScreen(){
        return this.rect.getX() < this.limitEnd;
    }
}

class CarBottom extends Car{
    constructor(x,y,width,height,fillColor,borderColor,borderWith, limitBegin, limitEnd, dx){
        super(x,y,width,height,fillColor,borderColor,borderWith, limitBegin, limitEnd, dx);
    }

    setAnimation(){
        let self = this;

        this.animation = new Konva.Animation(function(frame) {
            self.rect.setY(self.limitBegin + self.dx * frame.time);
        }, layer);
    }

    isOutOfScreen(){
        return this.rect.getY() < this.limitEnd;
    }
}