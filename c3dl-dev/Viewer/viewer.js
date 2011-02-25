c3dl.addMainCallBack(canvasViewer, "objectViewer");
var camViewer = new c3dl.FreeCamera(),
objectViewing = null,
holding = false,
objPath = "object.dae";
c3dl.addModel(objPath);
  function canvasViewer(canvasName) {
    // Create new c3dl.Scene object
    scnViewer = new c3dl.Scene();
    scnViewer.setCanvasTag(canvasName);
    objectViewing = new c3dl.Collada();
    objectViewing.init(objPath);
    scnViewer.addObjectToScene(objectViewing);
    // Create GL context
    var renderer2 = new c3dl.WebGL();
    renderer2.createRenderer(this);
    // Attach renderer to the scene
    scnViewer.setRenderer(renderer2);
    scnViewer.init(canvasName);
    if (renderer2.isReady()) {
      scnViewer.setAmbientLight([0.5, 0.5, 0.5, 0.5]);
      var light = new c3dl.PositionalLight();
      light.setPosition([0, 10, 35]);
      light.setDiffuse([0.5, 0.5, 0.5, 0.5]);
      light.setOn(true);
      scnViewer.addLight(light);

      scnViewer.addLight(light);
      camViewer.setPosition([0, 0, 30]);
      camViewer.setLookAtPoint([0.0, 0.0, 0.0]);
      // Add the camera to the scene
      scnViewer.setCamera(camViewer);
      // Start the scene
      scnViewer.startScene();
      // tell the scene what function to use when
      // a mouse event is detected
      scnViewer.setUpdateCallback(updateViewer);
      scnViewer.setMouseCallback(mouseUp, mouseDown, mouseMove, mouseWheel);
    }
    //objectViewing.centerObject();
    document.getElementById('triCount').innerHTML = "Triangle Count:" + objectViewing.getTriangleCount();
    
    objectViewing.getLength();
    objectViewing.getWidth();
    var percent = 10/objectViewing.getHeight();
    objectViewing.setHeight(objectViewing.getHeight()*percent);
    objectViewing.setLength(objectViewing.getLength()*percent);
    objectViewing.setWidth(objectViewing.getWidth()*percent);
  }

  ////////////////////////////////////////////////////////////////////////////
  // Canvas Update 
  ////////////////////////////////////////////////////////////////////////////

  function updateViewer(deltaTime) {
  document.getElementById('fps').innerHTML = "FPS:" + scnViewer.getFPS().toFixed(2);
    if (holding) {
      objectViewing.rotateOnAxis([0, 1, 0], (mouseX - oldMouseX) / 100);
      objectViewing.rotateOnAxis([1, 0, 0], (mouseY - oldMouseY) / 100);
      oldMouseX = mouseX;
      oldMouseY = mouseY;
    }
  }

  ////////////////////////////////////////////////////////////////////////////
  // 3d Functions 
  ////////////////////////////////////////////////////////////////////////////
  // This function is the callback that is passed to the scene.
  // When a mouse down event is detected this function is called.
  // The handler is given an object that knows what button was
  // pressed and has a list of objects picked.


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

  //calculates world coordinates 
  var getworldCoords = this.getworldCoords = function (mmx, mmy, height) {
    if (mmx != null && mmy != null) {
      // NDC
      var normalizedDeviceCoords = [(2 * mmx / CANVAS_WIDTH) - 1, -((2 * mmy / CANVAS_HEIGHT) - 1), 1, 1];
      // Sometimes this is called before the perspective transform
      // is setup which causes warnings. This check prevents that.
      if (c3dl.isValidMatrix(scn.getProjectionMatrix())) {
        var iproj = c3dl.inverseMatrix(scn.getProjectionMatrix());
        // To get the clip coords, we multiply the viewspace coordinates by
        // the projection matrix.
        // Working backwards across the pipeline, we have to take the normalized
        // device coordinates and multiply by the inverse projection matrix to get
        // the clip coordinates.
        var clipCoords = c3dl.multiplyMatrixByVector(iproj, normalizedDeviceCoords);
        // perspective divide
        clipCoords[0] /= clipCoords[3];
        clipCoords[1] /= clipCoords[3];
        clipCoords[2] /= clipCoords[3];
        clipCoords[2] = -clipCoords[2];
        var rayInitialPoint = zcam[currentCam].getPosition();
        var x = clipCoords[0];
        var y = clipCoords[1];
        var z = clipCoords[2];
        var kludge = c3dl.multiplyVector(zcam[currentCam].getLeft(), -1);
        var viewMatrix = c3dl.makePoseMatrix(kludge, zcam[currentCam].getUp(), zcam[currentCam].getDir(), zcam[currentCam].getPosition());
        var rayTerminalPoint = c3dl.multiplyMatrixByVector(viewMatrix, [x, y, z, 0]);
        var rayDir = c3dl.normalizeVector(rayTerminalPoint);
        // get angle
        var angle = Math.acos(-1 * rayDir[1]);
        var camHeight = rayInitialPoint[1] - height;
        var hyp = camHeight / Math.cos(angle);
        selEndWorldCoords[0] = hyp * rayDir[0] + rayInitialPoint[0];
        selEndWorldCoords[1] = hyp * rayDir[2] + rayInitialPoint[2];
        return [selEndWorldCoords[0], hyp * rayDir[1], selEndWorldCoords[1]];
      }
    }
  }
  //calculates world coordinates 
  var getworldCoordsWall = this.getworldCoordsWall = function (mmx, mmy, origin, norm) {
    if (mmx != null && mmy != null) {
      // NDC
      var normalizedDeviceCoords = [(2 * mmx / CANVAS_WIDTH) - 1, -((2 * mmy / CANVAS_HEIGHT) - 1), 1, 1];
      // Sometimes this is called before the perspective transform
      // is setup which causes warnings. This check prevents that.
      if (c3dl.isValidMatrix(scn.getProjectionMatrix())) {
        var iproj = c3dl.inverseMatrix(scn.getProjectionMatrix());
        // To get the clip coords, we multiply the viewspace coordinates by
        // the projection matrix.
        // Working backwards across the pipeline, we have to take the normalized
        // device coordinates and multiply by the inverse projection matrix to get
        // the clip coordinates.
        var clipCoords = c3dl.multiplyMatrixByVector(iproj, normalizedDeviceCoords);

        // perspective divide
        clipCoords[0] /= clipCoords[3];
        clipCoords[1] /= clipCoords[3];
        clipCoords[2] /= clipCoords[3];
        clipCoords[2] = -clipCoords[2];
        var rayInitialPoint = zcam[currentCam].getPosition();
        var x = clipCoords[0];
        var y = clipCoords[1];
        var z = clipCoords[2];
        var kludge = c3dl.multiplyVector(zcam[currentCam].getLeft(), -1);
        var viewMatrix = c3dl.makePoseMatrix(kludge, zcam[currentCam].getUp(), zcam[currentCam].getDir(), zcam[currentCam].getPosition());
        var rayTerminalPoint = c3dl.multiplyMatrixByVector(viewMatrix, [x, y, z, 0]);
        //c3dl.multiplyVectorByVector(temp, rayTerminalPoint, rayTerminalPoint)
        var rayDir = c3dl.normalizeVector(rayTerminalPoint);
        // get angle
        var distance = c3dl.subtractVectors(origin, rayInitialPoint);
        var temp = c3dl.vectorDotProduct(norm, distance);
        var temp2 = c3dl.vectorDotProduct(norm, rayDir);
        t = temp / temp2;
        var intersection = c3dl.addVectors(rayInitialPoint, c3dl.multiplyVector(rayDir, t));
        return intersection;
      }
    }
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
