//establish unrelated functs
function relMouseCoords(event){
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = this;

    do{
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while(currentElement = currentElement.offsetParent)

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;

    return {x:canvasX, y:canvasY}
}
HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;

//establish variables
var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
var strLayers = [];
var tmpLayers = [];
var drawing = false;

//canvas total width & height
var w = 300;
var h = 300;

//set canvas width & height
c.width = w;
c.height = h;

//calculate grid box size & other needed variables
var gsize = w/15; //w/15
var gsizeh = gsize/2;
var sizemgrid = ((w-gsize)/2)/10;

//draw grid
for (var x = 0; x <= w; x += gsize) {
    ctx.moveTo(0.5 + x, 0);
    ctx.lineTo(0.5 + x, h);
}

for (var x = 0; x <= h; x += gsize) {
    ctx.moveTo(0, 0.5 + x);
    ctx.lineTo(w, 0.5 + x);
}

ctx.strokeStyle = "#ddd";
ctx.stroke();

//drawing function
function drawPx(e){
    if(drawing){
        //get mouse coords and calculate them to the grid
        var d = canvas.relMouseCoords(e);
        var dx = Math.floor(d.x/gsize)*gsize;
        var dy = Math.floor(d.y/gsize)*gsize;
        var tmpx, tmpy;

        var storeAs = {
            id: 85,
            scale: 0.06,
            angle: 0,
            //calculate coords of box to bonk coords
            x: ((dx/gsizeh)-sizemgrid).toFixed(2),
            y: ((dy/gsizeh)-sizemgrid).toFixed(2),
            hf: false,
            vf: false,
            color: '#000000'
        };

        //check if not in array to prevent double layers
        if($.inArray(JSON.stringify(storeAs), strLayers) < 0){
            //add a layer to the tmplayers array
            tmpLayers.push(storeAs);
            strLayers.push(JSON.stringify(storeAs)); //this array is the same as layers, just used for comparing stuff as string
            console.log(storeAs);
        
            //draw square
            ctx.rect(dx,dy,gsize,gsize);
            ctx.fill();
        } else {
            console.log('dupe '+$.inArray(JSON.stringify(storeAs), strLayers));
        }
    }
}

//establish event listeners
c.addEventListener("mousedown", function (e) {
    drawing = true;
    drawPx(e);
}, false);
c.addEventListener("mouseup", function (e) {
    drawing = false;
}, false);
c.addEventListener("mouseout", function (e) {
    drawing = false;
}, false);
c.addEventListener("mousemove", function (e) {
    drawPx(e);
}, false);