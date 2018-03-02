	var stage = new Konva.Stage({
      container: 'container',
      width: 1200,
      height: 400
    });
	var layer = new Konva.Layer();
	var numberOfArc=8;
	var counter=1;
	for(n = 0; n < numberOfArc; n++) {
            addArc(n);
    }

    

    /*
    * create a triangle shape by defining a
    * drawing function which draws a triangle
    */
	function addArc(n) {
        var angle = 2 * Math.PI / numberOfArc

        var arcGroupe = new Konva.Group({
			x: stage.getWidth() / 2,
			y: stage.getHeight() / 2,
            rotation: 115* n * Math.PI / numberOfArc,
        });

        var arc= new Konva.Arc({
			innerRadius: 40,
			outerRadius: 150,
			angle: 360/numberOfArc,
			fill: 'yellow',
			stroke: 'black',
			strokeWidth: 4
		});

        arcGroupe.add(arc);
		
		//from : https://konvajs.github.io/docs/sandbox/Wheel_of_Fortune.html
        var text = new Konva.Text({
            text: counter,
            fontFamily: 'Calibri',
            fontSize: 50 / counter.toString().length,
            fill: 'white',
            align: 'center',
            stroke: 'black',
            strokeWidth: 1
        });
        text.toImage({
            width: text.getWidth(),
            height: text.getHeight(),
            callback: function(img) {
                var cachedText = new Konva.Image({
                    image: img,
                    listening: false,
                    rotation: 115,
                    x: 120,
                    y: 35
                });
				//cachedText.startRotation = cachedText.getRotation();
                arcGroupe.add(cachedText);
                layer.draw();
            }
        });

        arcGroupe.startRotation = arcGroupe.getRotation();
		
        layer.add(arcGroupe);
		counter++;
    }
    // add the layer to the stage
    stage.add(layer);
