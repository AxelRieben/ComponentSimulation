var stage = new Konva.Stage({
    container: 'container2',
    width: 600,
    height: 450
});

var console = document.getElementById("console");

var synchronised;

var layer = new Konva.Layer;
var insertArrow;
var removeArrow;

var numberOfArc;
var counter;
var elem;
var addNumber;
var writeDelay;
var readDelay;
var commonTimer;
var writeID;
var removeID;
var writeTimer = 100;
var readTimer = 0;

var workTimerIntervalID = null;


initValues();
draw(elem);
startTimers();


function initValues() {
    numberOfArc = document.getElementById("displayNumberOfArc").value;
    writeDelay = document.getElementById("displayWriteTimer").value;
    readDelay = document.getElementById("displayReadTimer").value;
    synchronised = document.getElementById('synchronisedBox').checked;
    counter = 1
    elem = []
    addNumber = 1
    writeID = 0;
    removeID = -1;
    //initiate array content
    for (i = 0; i < numberOfArc; i++) {
        elem[i] = ".";
    }
    insertArrow = new Konva.Arrow({
        points: [0, 0, 35, 120 / numberOfArc],
        pointerLength: 10,
        pointerWidth: 10,
        fill: 'green',
        stroke: 'green',
        strokeWidth: 4,
    });
    removeArrow = new Konva.Arrow({
        points: [140, 480 / numberOfArc, 200, 690 / numberOfArc],
        pointerLength: 10,
        pointerWidth: 10,
        fill: 'red',
        stroke: 'red',
        strokeWidth: 4,
    });
}

function startTimers() {
    if (workTimerIntervalID != null) {
        clearInterval(workTimerIntervalID);
    }
    commonTimer = 50;
    workTimerIntervalID = setInterval(workBuffer, commonTimer);
}

function draw(elemArray) {
    layer.destroyChildren();
    for (n = 0; n < elemArray.length; n++) {
        addArc(n, elem[n]);
    }
}

function addArc(n, content) {
    var angle = 2 * Math.PI / numberOfArc;

    var arcGroupe = new Konva.Group({
        x: stage.getWidth() / 2,
        y: stage.getHeight() / 2,
        rotation: 115 * n * Math.PI / numberOfArc,
    });

    var arc = new Konva.Arc({
        innerRadius: 40,
        outerRadius: 150,
        angle: 360 / numberOfArc,
        fill: 'yellow',
        stroke: 'black',
        strokeWidth: 4
    });

    arcGroupe.add(arc);

    //from : https://konvajs.github.io/docs/sandbox/Wheel_of_Fortune.html
    var text = new Konva.Text({
        text: content,
        fontFamily: 'Calibri',
        fontSize: 50 / content.toString().length,
        fill: 'white',
        align: 'center',
        stroke: 'black',
        strokeWidth: 1
    });
    text.toImage({
        width: text.getWidth(),
        height: text.getHeight(),
        callback: function (img) {
            var cachedText = new Konva.Image({
                image: img,
                listening: false,
                rotation: 133 - numberOfArc * 1.6,
                x: 120,
                y: 1 / numberOfArc * 360 - numberOfArc / 3
            });
            arcGroupe.add(cachedText);
            if (removeID == n) {
                arcGroupe.add(removeArrow);
            }
            if (writeID == n) {
                arcGroupe.add(insertArrow);
            }
            layer.draw();
        }
    });

    arcGroupe.startRotation = arcGroupe.getRotation();
    layer.add(arcGroupe);
}

// add the layer to the stage
stage.add(layer);

function writeInBuffer() {
    elem[(addNumber - 1) % numberOfArc] = addNumber;
    writeID = (addNumber - 1) % numberOfArc;
    draw(elem);
    addNumber++;
}

function readInBuffer() {
    elem[(writeID)] = 0;
    writeID = (writeID + 1) % numberOfArc;
}

function workBuffer() {
    writeTimer += commonTimer;
    readTimer += commonTimer;
    if (writeTimer >= writeDelay) {
        if (synchronised) {
            if (elem[(addNumber - 1) % numberOfArc] != ".") {

            } else {
                elem[(addNumber - 1) % numberOfArc] = addNumber;
                writeID = (addNumber - 1) % numberOfArc;
                addNumber++;
            }
            writeTimer -= writeDelay;
        } else {
            if (elem[(addNumber - 1) % numberOfArc] != ".") {
                var font = document.createTextNode("the producer overrided element " + elem[(addNumber - 1) % numberOfArc] + " !\n")
                console.appendChild(font);
                console.scrollTop = console.scrollHeight;
            }
            elem[(addNumber - 1) % numberOfArc] = addNumber;
            writeID = (addNumber - 1) % numberOfArc;
            addNumber++;
            writeTimer -= writeDelay;
        }

    }
    if (readTimer >= readDelay) {
        if (synchronised) {

            if (elem[removeID + 1] == ".") {

            } else {
                elem[removeID] = ".";
                removeID = (removeID + 1) % numberOfArc;
            }
            readTimer -= readDelay;
        } else {
            removeID = (removeID + 1) % numberOfArc;
            if (elem[removeID] == ".") {
                var font = document.createTextNode("The consumer tried to read an empty memory area \n")
                console.appendChild(font);
                console.scrollTop = console.scrollHeight;
            }
            elem[removeID] = ".";
            readTimer -= readDelay;
        }
    }
    draw(elem);
}

function updateRangeValue(val, field) {
    if (field != "null") {
        document.getElementById(field).value = val;
    }
    initValues();
    startTimers();
}

function changeRepresentation() {
    synchronised != synchronised
    initValues();
    startTimers();
}