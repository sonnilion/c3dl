
c3dl.addMainCallBack(canvasMain, "test");
c3dl.addModel("cube.dae");
c3dl.addModel("table.dae");
var cube=new c3dl.Collada();
var table=new c3dl.Collada();
var oldWidth ,oldLength, oldHeight;
function canvasMain(canvasName){
    scn = new c3dl.Scene();
    scn.setCanvasTag(canvasName);
    renderer = new c3dl.WebGL();
    renderer.createRenderer(this);
    scn.setRenderer(renderer);
    scn.init(canvasName);
    if(renderer.isReady() )
    {
        table.init("table.dae");
        table.setTexture("boarder2.jpg");
        cube.init("cube.dae");
        cube.setTexture("boarder.jpg");
        scn.addObjectToScene(cube);
      


        scn.addObjectToScene(table);
        var cam = new c3dl.FreeCamera();
        cam.setPosition(new Array(0.0, 0.0, 10.0));
        cam.setLookAtPoint(new Array(0.0, 0.0, 0.0));
        scn.setCamera(cam);
        scn.startScene();
    }
            document.getElementById("length").value=getSize()[0];
            document.getElementById("width").value=getSize()[2];
            document.getElementById("height").value=getSize()[1];
            document.getElementById("length2").value=getSize2()[0];
            document.getElementById("width2").value=getSize2()[2];
            document.getElementById("height2").value=getSize2()[1];
}
function getSize() {
  var size =[];
  size[0] = cube.getLength();
  size[1] = cube.getHeight();
  size[2] = cube.getWidth();
  return size;
}
function setSize(length,width,height) {
  cube.setSize(length,width,height);
}
function getSize2() {
  var size =[];
  size[0] = table.getLength().toFixed(2);
  size[1] = table.getHeight().toFixed(2);
  size[2] = table.getWidth().toFixed(2);
  return size;
}
function setSize2(length,width,height) {
  table.setSize(length,width,height);
}

