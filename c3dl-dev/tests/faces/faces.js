c3dl.addMainCallBack(canvasTester, "tester");
var cam = new c3dl.FreeCamera(),
object = null,
objPath = "fly_plane_polylist.dae";
c3dl.addModel(objPath);
  function canvasTester(canvasName) {
    // Create new c3dl.Scene object
    scn = new c3dl.Scene();
    scn.setCanvasTag(canvasName);
    // Create GL context
    var renderer = new c3dl.WebGL();
    renderer.createRenderer(this);
    // Attach renderer to the scene
    scn.setRenderer(renderer);
    scn.init(canvasName);
    if (renderer.isReady()) {
      object = new c3dl.Collada();
      object.init(objPath);
      object.centerObject();
      object.getLength();
      object.getWidth();
      var percent = 10/object.getHeight();
      object.setHeight(object.getHeight()*percent);
      object.setLength(object.getLength()*percent);
      object.setWidth(object.getWidth()*percent);
      object.setPosition([0, object.getHeight() / 2, 0]);
      object.setAngularVel([0.0, -0.001, 0.0]);
      scn.addObjectToScene(object);
      document.getElementById('faces').innerHTML = "Faces:" + object.getFaces();
    
      scn.setAmbientLight([0.1, 0.1, 0.1, 0.1]);
      var light = new c3dl.PositionalLight();
      light.setPosition([0, 10, 35]);
      light.setDiffuse([0.5, 0.5, 0.5, 0.5]);
      light.setOn(true);
      scn.addLight(light);

      cam.setPosition([0, object.getHeight()/2, 30]);
      cam.setLookAtPoint([0.0, object.getHeight()/2, 0.0]);
      // Add the camera to the scene
      scn.setCamera(cam);
      // Start the scene
      scn.startScene();
    }
  }