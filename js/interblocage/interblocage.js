var stageWidth = 1300;
var stageHeight = 600;

var stage = new Konva.Stage({
    container: 'container',
    width: stageWidth,
    height: stageHeight
});

var layer = new Konva.Layer();
var size = 140;
var carSize = 120;
var scale = 1;
var timer = null;
var listCar = [];

roads();

function roads() {

    var rect1 = new Konva.Rect({
        x: 0,
        y: stage.getHeight()/2 - size/2,
        width: stage.getWidth(),
        height: size,
        fill: 'gray'
    });

    var rect2 = new Konva.Rect({
        x: stage.getWidth()/2 - size/2,
        y: 0,
        width: size,
        height: stage.getHeight(),
        fill: 'gray'
    });

    var dotLine = new Konva.Line({
        points: [0, stage.getHeight()/2, stage.getWidth(), stage.getHeight()/2],
        stroke: 'white',
        strokeWidth: 2,
        lineJoin: 'round',
        dash: [26, 12]
    });

    var dotLine2 = new Konva.Line({
        points: [stage.getWidth()/2, 0, stage.getWidth()/2, stage.getHeight()],
        stroke: 'white',
        strokeWidth: 2,
        lineJoin: 'round',
        dash: [25, 10]
    });

    // add the shape to the layer
    layer.add(rect1);
    layer.add(rect2);
    layer.add(dotLine);
    layer.add(dotLine2);
}

function startTimer(){
    timer = setInterval(function(){
        if (Math.floor((Math.random() * 10) + 1) > 8){
            listCar.push(new CarLeft(-carSize,stage.getHeight()/scale/2 + 10,carSize,size/2 - 20,'red',
                'black',2,-carSize,stage.getWidth()/scale+carSize,0.2));
        }
        if (Math.floor((Math.random() * 10) + 1) > 8){
            listCar.push(new CarTop(stage.getWidth()/scale/2 - size/2 + 10,-carSize,size/2 - 20,carSize,'green',
                'black',2,-carSize,stage.getHeight()/scale+carSize,0.2));
        }
        if (Math.floor((Math.random() * 10) + 1) > 8){
            listCar.push(new CarRight(stage.getWidth()/scale,stage.getHeight()/scale/2 - 60,carSize,size/2 - 20,'yellow',
                'black',2,stage.getWidth()/scale,-carSize,-0.2));
        }
        if (Math.floor((Math.random() * 10) + 1) > 8){
            listCar.push(new CarBottom(stage.getWidth()/scale/2 + 10, stage.getHeight()/scale,size/2 - 20,carSize,'blue',
                'black',2,stage.getHeight()/scale,-carSize,-0.2));
        }

        for (let i = 0; i < listCar.length; i++){
            if (listCar[i].isOutOfScreen()){
                listCar[i].stopAnimation();
                listCar[i].rect.destroy();
                delete listCar[i];
                listCar.splice(i,1);
            }
        }
    }, 1000);
}

function callCars(){
    startTimer();
}

function stopCars() {
    listCar.forEach(function(car) {
        car.stopAnimation();
        car.rect.destroy();
    });
    clearInterval(timer);
}

// add the layer to the stage
stage.add(layer);

//make the app responsive
function fitStageIntoParentContainer() {
    var container = document.querySelector('#container');

    // now we need to fit stage into parent
    var containerWidth = container.offsetWidth;
    // to do this we need to scale the stage
    scale = containerWidth / stageWidth;

    stage.width(stageWidth * scale);
    stage.height(stageHeight * scale);
    stage.scale({ x: scale, y: scale });

    stage.draw();
}
fitStageIntoParentContainer();
// adapt the stage on any window resize
window.addEventListener('resize', fitStageIntoParentContainer);