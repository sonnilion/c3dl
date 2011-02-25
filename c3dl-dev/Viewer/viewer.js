c3dl.addMainCallBack(canvasViewer, "objectViewer");
var camViewer = new c3dl.FreeCamera(),
    objectViewing = new c3dl.Collada(),
    holding = false,
    objPath = "object.dae";
    
c3dl.addModel(objPath);

function canvasViewer(canvasName) {
  // Create new c3dl.Scene object
  scnViewer = new c3dl.Scene();
  scnViewer.setCanvasTag(canvasName);

  //init object
  objectViewing.init(objPath);
  scnViewer.addObjectToScene(objectViewing);
  
  // Create GL context
  var renderer = new c3dl.WebGL();
  renderer.createRenderer(this);
 
 // Attach renderer to the scene
  scnViewer.setRenderer(renderer);
  scnViewer.init(canvasName);
 
 if (renderer.isReady()) {
    //set the lighting
    scnViewer.setAmbientLight([0, 0, 0, 0]);
    var light = new c3dl.PositionalLight();
    light.setPosition([0, 10, 35]);
    light.setDiffuse([1, 1, 1, 1]);
    light.setOn(true);
    scnViewer.addLight(light);
    
    // Add the camera to the scene
    camViewer.setPosition([0, 0, 30]);
    camViewer.setLookAtPoint([0.0, 0.0, 0.0]);  
    scnViewer.setCamera(camViewer);
    
    // Start the scene
    scnViewer.startScene();
    
    //set call backs
    scnViewer.setUpdateCallback(updateViewer);
    scnViewer.setMouseCallback(mouseUp, mouseDown, mouseMove, mouseWheel);
  }
  objectViewing.centerObject();
  document.getElementById('triCount').innerHTML = "Triangle Count:" + objectViewing.getTriangleCount();
    
  objectViewing.getLength();
  objectViewing.getWidth();
  var percent = 10/objectViewing.getHeight();
  objectViewing.setHeight(objectViewing.getHeight()* percent);
  objectViewing.setLength(objectViewing.getLength()* percent);
  objectViewing.setWidth(objectViewing.getWidth()* percent);
}

function updateViewer(deltaTime) {
  document.getElementById('fps').innerHTML = "FPS:" + scnViewer.getFPS().toFixed(2);
  if (holding) {
    objectViewing.rotateOnAxis([0, 1, 0], (mouseX - oldMouseX) / 100);
    objectViewing.rotateOnAxis([1, 0, 0], (mouseY - oldMouseY) / 100);
    oldMouseX = mouseX;
    oldMouseY = mouseY;
  }
}

function getClickedCoords(event) {
  var canvas = scnViewer.getCanvas();
  var canvasPosition = c3dl.getObjectPosition(canvas);
  // event.clientX and event.clientY contain where the user clicked 
  // on the client area of the browser
  // canvasPosition holds the coordinate of the top left corner where the canvas resides
  // on the client area.
  // window.pageXOffset, window.pageYOffset hold how much the user has scrolled.
  var X = event.clientX - canvasPosition[0] + window.pageXOffset - 1;
  var Y = event.clientY - canvasPosition[1] + window.pageYOffset - 1;
  return [X, Y];
}

//mouse events

function mouseUp(event) {    
  holding = false;
}

function mouseDown(event) {
  oldMouseX = mouseX;
  oldMouseY = mouseY;
  holding = true;
}

//when the mouse is moved it returns mouse coords relative to window
function mouseMove(event) {
  var viewportCoords = getClickedCoords(event);
  mouseX = viewportCoords[0];
  mouseY = viewportCoords[1];
}

//when the mouse wheel is use this is called
function mouseWheel(event) {
  var delta = 0;
  // Chromium
  if (event.wheelDelta) {
    delta = -event.wheelDelta / 20;
  }
  // Minefield
  else if (event.detail) {
    delta = event.detail * 4;
  }

  var curPos = camViewer.getPosition();
  if (-delta < 0) {
    camViewer.setPosition([curPos[0], curPos[1], curPos[2] + 1]);
  }
  else {
    camViewer.setPosition([curPos[0], curPos[1], curPos[2] - 1]);
  }
}
