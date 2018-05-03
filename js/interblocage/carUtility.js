//Timers
var leftTimer = null;
var topTimer = null;
var rightTimer = null;
var bottomTimer = null;
//Main timer
var timer = null;
var mainLightTimer = null;
//Light timer
var lightTimerStopLeftRight = null;
var lightTimerStopTopBottom = null;
//Lists
var listCarLeft = [];
var listCarTop = [];
var listCarRight = [];
var listCarBottom = [];
var listCarLeftRight = [];
var listCarTopBottom = [];
var listCar = [];
//Boolean
var trafficLightsOn = false;

function startLeftTimer(){
    //Timer for the left cars
    leftTimer = setInterval(function () {
        if (Math.floor((Math.random() * 10) + 1) > 8 && listCarLeft.length < 4){
            listCarLeft.push(new CarLeft(-carSize,stage.getHeight()/scale/2 + 10,carSize,size/2 - 20,
                'js/interblocage/static/car_left.png', -carSize,stage.getWidth()/scale+carSize,0.2));
        }
    }, 1000);
}
function startTopTimer(){
    //Timer for the top cars
    topTimer = setInterval(function () {
        if (Math.floor((Math.random() * 10) + 1) > 8 && listCarTop.length < 2){
            listCarTop.push(new CarTop(stage.getWidth()/scale/2 - size/2 + 10,-carSize,size/2 - 20,carSize,
                'js/interblocage/static/car_top.png', -carSize,stage.getHeight()/scale+carSize,0.2));
        }
    }, 1000);
}
function startRightTimer(){
    //Timer for the right cars
    rightTimer = setInterval(function () {
        if (Math.floor((Math.random() * 10) + 1) > 8 && listCarRight.length < 4){
            listCarRight.push(new CarRight(stage.getWidth()/scale,stage.getHeight()/scale/2 - 60,carSize,size/2 - 20,
                'js/interblocage/static/car_right.png', stage.getWidth()/scale,-carSize,-0.2));
        }
    }, 1000);
}
function startBottomTimer(){
    //Timer for the bottom cars
    bottomTimer = setInterval(function () {
        if (Math.floor((Math.random() * 10) + 1) > 8 && listCarBottom.length < 2){
            listCarBottom.push(new CarBottom(stage.getWidth()/scale/2 + 10, stage.getHeight()/scale,size/2 - 20,carSize,
                'js/interblocage/static/car_bottom.png', stage.getHeight()/scale,-carSize,-0.2));
        }
    }, 1000);
}

function stopTimer(){
    clearInterval(leftTimer);
    clearInterval(topTimer);
    clearInterval(rightTimer);
    clearInterval(bottomTimer);
    clearInterval(timer);
}

function flushLists(){
    listCarLeft = [];
    listCarTop = [];
    listCarRight = [];
    listCarBottom = [];
    listCar = [];
}

function isOutOfScreen(list){
    for (let i = 0; i < list.length; i++){
        if (list[i].isOutOfScreen()){
            list[i].stopAnimation();
            list[i].rect.destroy();
            delete list[i];
            list.splice(i,1);
        }
    }
}

function rightPriority(carList_np, carList_p){
    carList_np.forEach((car) => {
        if (car.isInCriticalZone()){
            carList_p.forEach((car2) => {
                if (car2.isInCriticalZone()){
                    car.collisionWithGroundMark();
                }
            });
        }
    });

    let carAreThere = false;

    carList_np.forEach((car) => {
        carList_p.forEach((car2) => {
           if (car2.isAfterMidRoad()){
               carAreThere = false;
           }else{
               carAreThere = true;
           }
        });

        if (carAreThere === false){
            if (!car.isRunning){
                car.animation.start();
                car.isRunning = true;
            }
        }
    });


}

function lightStartLeftRight(){
    clearInterval(lightTimerStopLeftRight);
    listCarLeftRight.forEach((car) => {
        car.animation.start();
    });
}

function lightStopTopBottom(){
    lightTimerStopTopBottom = setInterval(function () {
        listCarTopBottom.forEach((car) => {
            car.collisionWithGroundMark();
        });
    },16);
}

function lightStartTopBottom(){
    clearInterval(lightTimerStopTopBottom);
    listCarTopBottom.forEach((car) => {
        car.animation.start();
    });
}

function lightStopLeftRight(){
    lightTimerStopLeftRight = setInterval(function () {
        listCarLeftRight.forEach((car) => {
            car.collisionWithGroundMark();
        });
    },16);
}

function manageLightsTraffic(){
    let cmpt = 0;
    let time = 0;
    let limitTime = 0;

    mainLightTimer = setInterval(function () {

        time ++;

        if(time * 16 >= limitTime){
            if (cmpt%2 === 0){
                lightStopLeftRight();
                setTimeout(function(){
                    lightStartTopBottom();
                    $('#trafficStatusTopBottom').html("Green for Top and Bottom");
                    $('#trafficStatusTopBottom').css("color","green");
                },3000);
                $('#trafficStatusLeftRight').html("Red for Left and Right");
                $('#trafficStatusLeftRight').css("color","red");
            }else{
                lightStopTopBottom();
                setTimeout(function(){
                    lightStartLeftRight();
                    $('#trafficStatusLeftRight').html("Green for Left and Right");
                    $('#trafficStatusLeftRight').css("color","green");
                },3000);
                $('#trafficStatusTopBottom').html("Red for Top and Bottom");
                $('#trafficStatusTopBottom').css("color","red");
            }
            limitTime = 10000;
            cmpt ++;
            time = 0;
        }

    }, 16);
}

function toggleMode(){
    trafficLightsOn = !trafficLightsOn;
    if (trafficLightsOn){
        manageLightsTraffic();
    }
}

function startTimer(){

    startLeftTimer();
    startTopTimer();
    startRightTimer();
    startBottomTimer();

    //Main timer
    timer = setInterval(function(){

        isOutOfScreen(listCarLeft);
        isOutOfScreen(listCarTop);
        isOutOfScreen(listCarRight);
        isOutOfScreen(listCarBottom);

        if (!trafficLightsOn){
            clearInterval(mainLightTimer);
            rightPriority(listCarLeft, listCarBottom);
            rightPriority(listCarBottom, listCarRight);
            rightPriority(listCarRight, listCarTop);
            rightPriority(listCarTop, listCarLeft);
        }

        listCar = listCarLeft.concat(listCarTop.concat(listCarRight.concat(listCarBottom)));
        listCarLeftRight = listCarLeft.concat(listCarRight);
        listCarTopBottom = listCarTop.concat(listCarBottom);

    }, 16);
}