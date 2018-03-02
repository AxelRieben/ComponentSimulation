//Canavas and context
var canvas = document.getElementById("canvas");
var context = canvas.getContext('2d');
var rect = canvas.getBoundingClientRect();

init()
rendering()

function init(){

}
async function running(){
	//clear the context
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.strokeStyle = '#000000';
	context.fillStyle = '#FFFFFF';
	context.lineWidth = 1;
	
	ctx.rect(20,20,150,100);
	context.fill();
	context.stroke();
	
	context.beginPath()
	context.arc(200,200,80,0,2*Math.PI);
	context.fill();
	context.stroke();
	
	context.beginPath();
	context.moveTo(0,0);
	context.lineTo(400,400);
	context.closePath();
	context.stroke();
	
	context.beginPath();
	context.moveTo(0,400);
	context.lineTo(400,0);
	context.closePath();
	context.stroke();
	
	context.beginPath();
	context.moveTo(0,200);
	context.lineTo(400,200);
	context.closePath();
	context.stroke();
	
	context.beginPath();
	context.moveTo(200,0);
	context.lineTo(200,400);
	context.closePath();
	context.stroke();
	
	context.beginPath();
	context.arc(200,200,40,0,2*Math.PI);
	context.fillStyle = '#000000';
	context.fill();
	context.stroke();
}
// redraw
function rendering() {     
    requestAnimationFrame(rendering);
	running();
}
//calculation if spring length with pythagore
function springLength(X,Y){
	return Math.sqrt(Math.pow(X,2)+Math.pow(Y,2))
}
//update html
function updateRangeValue(val,field){
	 document.getElementById(field).value=val;
	 initValues();
}