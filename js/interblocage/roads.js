var groundMarkLeft = null;
var groundMarkTop = null;
var groundMarkRight = null;
var groundMarkBottom = null;

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

function groundMarks() {
    //Ground mark left
    groundMarkLeft = groundMark(stage.getWidth() / 2 - size / 2 - groundMarkSize, stage.getHeight() / 2, groundMarkSize, size / 2,
        'js/interblocage/static/marquage_sol_left.png');
    groundMark(stage.getWidth() / 2 - size / 2 - groundMarkSize, stage.getHeight() / 2 - size / 2, groundMarkSize, size / 2,
        'js/interblocage/static/marquage_sol_2_left_and_right.png');

    //Ground mark top
    groundMarkTop = groundMark(stage.getWidth() / 2 - size / 2, stage.getHeight() / 2 - size / 2 - groundMarkSize, size / 2, groundMarkSize,
        'js/interblocage/static/marquage_sol_top.png');
    groundMark(stage.getWidth() / 2, stage.getHeight() / 2 - size / 2 - groundMarkSize, size / 2, groundMarkSize,
        'js/interblocage/static/marquage_sol_2_top_and_bottom.png');

    //Ground mark right
    groundMarkRight = groundMark(stage.getWidth() / 2 + size / 2, stage.getHeight() / 2 - size / 2, groundMarkSize, size / 2,
        'js/interblocage/static/marquage_sol_right.png');
    groundMark(stage.getWidth() / 2 + size / 2, stage.getHeight() / 2, groundMarkSize, size / 2,
        'js/interblocage/static/marquage_sol_2_left_and_right.png');

    //Ground mark bottom
    groundMarkBottom = groundMark(stage.getWidth() / 2, stage.getHeight() / 2 + size / 2, size / 2, groundMarkSize,
        'js/interblocage/static/marquage_sol_bottom.png');
    groundMark(stage.getWidth() / 2 - size / 2, stage.getHeight() / 2 + size / 2, size / 2, groundMarkSize,
        'js/interblocage/static/marquage_sol_2_top_and_bottom.png');
}

function groundMark(_x,_y,_width,_height, imageSource){

    let groundMarkImage = new Image();

    let groundMark = new Konva.Image({
        x: _x,
        y: _y,
        image: groundMarkImage,
        width: _width,
        height: _height
    });

    layer.add(groundMark);
    groundMarkImage.src = imageSource;

    return groundMark;
}