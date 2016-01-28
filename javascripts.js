
/*
todos:

clean up this code
get a great dodec in here

*/

function toRadians(deg)
 {
 return deg * (Math.PI/180);
 }

// globals
var renderer, scene, camera, mirrorCamera, dodec



renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

scene = new THREE.Scene();

// initialize scenic elements

// background / foreground
new THREE.TextureLoader().load(
  'IMG_3049.JPG',
  function(bgTexture) {
    var plane = new THREE.PlaneGeometry(15, 15,0);
    var bgMaterial = new THREE.MeshBasicMaterial({map: bgTexture});
    var backgroundMesh = new THREE.Mesh(plane, bgMaterial);
    backgroundMesh.position.z = -5;
    scene.add(backgroundMesh);

    var frontPlane = new THREE.PlaneGeometry(18, 18,0);
    var fgMaterial = new THREE.MeshBasicMaterial({map: bgTexture});
    var foregroundMesh = new THREE.Mesh(frontPlane, fgMaterial);
    foregroundMesh.position.z = 5;
    foregroundMesh.material.side = THREE.DoubleSide;
    scene.add(foregroundMesh);

    var cubeGeom = new THREE.BoxGeometry(20, 20, 20);
    var cubeMat = [

      new THREE.MeshBasicMaterial({map: bgTexture}),
      new THREE.MeshBasicMaterial({map: bgTexture}),
      new THREE.MeshBasicMaterial({map: bgTexture}),
      new THREE.MeshBasicMaterial({map: bgTexture}),
      new THREE.MeshBasicMaterial({map: bgTexture}),
      new THREE.MeshBasicMaterial({map: bgTexture})
    ];
    var cube = new THREE.Mesh(cubeGeom, new THREE.MeshFaceMaterial(cubeMat));
    for (var i = 0; i < cubeMat.length; i++) {
      cubeMat[i].side = THREE.DoubleSide;
    }
    scene.add(cube);
  }
);

camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 1;

// great dodecahedron
var mirrorCamera = new THREE.CubeCamera(0.1, 1000, 512);
scene.add(mirrorCamera);































var vertices = [
0, 0, 0,
0, 0.809, 0.5,
-0.5, 0, 0.809,
0.5, 0, 0.809,
0.809, 0.5, 0,
0.809, -0.5, 0,
0, -0.809, 0.5,
-0.809, -0.5, 0,
-0.809, 0.5, 0,
0, 0.809, -0.5,
-0.5, 0, -0.809,
0, -0.809, -0.5,
0.5, 0, -0.809,
0, -0.124, -0.325,
0.201, -0.201, -0.201,
0.325, 0, -0.124,
0.201, 0.201, -0.201,
0, 0.124, -0.325,
-0.201, 0.201, -0.201,
-0.325, 0, -0.124,
-0.201, -0.201, -0.201,
-0.124, -0.325, 0,
0.124, -0.325, 0,
0.201, -0.201, 0.201,
0.325, 0, 0.124,
0.124, 0.325, 0,
0.201, 0.201, 0.201,
0, 0.124, 0.325,
-0.201, 0.201, 0.201,
-0.124, 0.325, 0,
-0.325, 0, 0.124,
0, -0.124, 0.325,
-0.201, -0.201, 0.201
];

// why are the normal backwards :(
var indices = [
1, 27, 3,
3, 27, 2,
2, 27, 1,
6, 3, 31,
3, 2, 31,
6, 31, 2,
6, 2, 32,
2, 7, 32,
7, 6, 32,
7, 2, 30,
2, 8, 30,
8, 7, 30,
2, 1, 28,
1, 8, 28,
8, 2, 28,
4, 1, 26,
1, 3, 26,
3, 4, 26,
5, 4, 24,
4, 3, 24,
3, 5, 24,
6, 5, 23,
5, 3, 23,
3, 6, 23,
1, 9, 29,
9, 8, 29,
8, 1, 29,
1, 4, 25,
4, 9, 25,
9, 1, 25,
10, 8, 18,
8, 9, 18,
9, 10, 18,
7, 8, 19,
8, 10, 19,
10, 7, 19,
11, 7, 20,
7, 10, 20,
10, 11, 20,
5, 6, 22,
6, 11, 22,
11, 5, 22,
12, 4, 15,
4, 5, 15,
5, 12, 15,
6, 7, 21,
7, 11, 21,
11, 6, 21,
10, 9, 17,
9, 12, 17,
12, 10, 17,
12, 9, 16,
9, 4, 16,
4, 12, 16,
11, 10, 13,
10, 12, 13,
12, 11, 13
,
11, 12, 14,
12, 5, 14,
5, 11, 14
];

var dodecGeom = new THREE.PolyhedronGeometry(vertices, indices, 2, 0);
//
// for(var i = 0; i < dodecGeom.faces.length; i++){
//
//   dodecGeom.faceVertexUvs[0].push([
//     new THREE.Vector2( 0,0 ),
//     new THREE.Vector2( 0,1 ),
//     new THREE.Vector2( 1,1),
//   ]);
// }
//
// dodecGeom.computeFaceNormals();
// dodecGeom.dynamic = true;
// dodecGeom.uvsNeedUpdate = true;


var dodecMaterial = new THREE.MeshBasicMaterial(
  {
    envMap: mirrorCamera.renderTarget
  }
);

var colorMaterial = new THREE.MeshBasicMaterial({color: 0xaaaaff});

// var materials = [  colorMaterial, colorMaterial, colorMaterial, colorMaterial, colorMaterial, colorMaterial];

dodec = new THREE.Mesh(dodecGeom, dodecMaterial);
dodec.position.z = -4;
scene.add(dodec);

// var edges = new THREE.EdgesHelper(dodec, 0x00ff00);
// scene.add(edges);

// make an object that is the reverse and a color!

// a light makes things better!

var light = new THREE.PointLight(0xff0000, 1, 100);
light.position.set(10, 10, 10);
scene.add(light);


// dragging

var isDragging = false;
var previousMousePosition = {
    x: 0,
    y: 0
};
$(renderer.domElement).on('mousedown', function(e) {
    isDragging = true;
})
.on('mousemove', function(e) {
    //console.log(e);
    var deltaMove = {
        x: e.offsetX-previousMousePosition.x,
        y: e.offsetY-previousMousePosition.y
    };

    if(isDragging) {

        var deltaRotationQuaternion = new THREE.Quaternion()
            .setFromEuler(new THREE.Euler(
                toRadians(deltaMove.y * 1),
                toRadians(deltaMove.x * 1),
                0,
                'XYZ'
            ));

        dodec.quaternion.multiplyQuaternions(deltaRotationQuaternion, dodec.quaternion);
    }

    previousMousePosition = {
        x: e.offsetX,
        y: e.offsetY
    };
});
/* */

$(document).on('mouseup', function(e) {
    isDragging = false;
});




function render() {
  dodec.visible = false;
  mirrorCamera.updateCubeMap(renderer, scene);
  dodec.visible = true;

  requestAnimationFrame(render);

  renderer.render(scene, camera);
};

$(document).ready(function() {
  render();
});
