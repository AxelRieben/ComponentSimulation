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
var groundMarkSize = 10;
var scale = 1;
var isStarted = false;

roads();
groundMarks();

function callCars(){
    if (isStarted === false){
        startTimer();
        isStarted = true;
    }
}

function stopCars() {
    if (isStarted === true){
        listCar.forEach(function(car) {
            car.stopAnimation();
            car.rect.destroy();
        });
        stopTimer();
        flushLists();
        isStarted = false;
    }
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