// globals
var renderer, scene, camera, mirrorCamera, dodec, dodecInitialized;

// helpers

function toRadians(deg) {
  return deg * (Math.PI/180);
}


// gl initialization

renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

scene = new THREE.Scene();
    
// initialize scenic elements

// background / foreground
new THREE.TextureLoader().load(
  
  'IMG_3049.JPG',
  
  function(bgTexture) {
    bgTexture.wrapS = THREE.RepeatWrapping;
    bgTexture.repeat.x = - 1;

    var bgMaterial = new THREE.MeshBasicMaterial({map: bgTexture});

    var cubeGeom = new THREE.BoxGeometry(25, 16, 16);
    var cubeMat = [
//       new THREE.MeshBasicMaterial({color: 0xffaaff}),
//       new THREE.MeshBasicMaterial({color: 0xaaffff}),
//       new THREE.MeshBasicMaterial({color: 0xffffaa}),
//       new THREE.MeshBasicMaterial({color: 0xaaaaff}),
//       new THREE.MeshBasicMaterial({color: 0xffaaaa}),
//       new THREE.MeshBasicMaterial({color: 0xaaffaa})
      
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


dodecInitialized = false;
var objLoader = new THREE.OBJLoader();
objLoader.load(
'dodec.obj',
  function(object) {

    var dodecMaterial = new THREE.MeshBasicMaterial( 
      { 
        envMap: mirrorCamera.renderTarget,
      } 
    );

    object.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material = dodecMaterial;
        console.log("mesh");
      }
    });
  
    object.position.z = -4;
    object.scale.set(0.06, 0.06, 0.06);
    dodec = object;

    scene.add(object);  
    dodecInitialized = true;
  }
);

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

$(document).on('mouseup', function(e) {
    isDragging = false;
});

function render() {
  if (dodecInitialized ) {
    dodec.visible = false;
    mirrorCamera.updateCubeMap(renderer, scene);
    dodec.visible = true;
  }

  requestAnimationFrame(render);
  
  renderer.render(scene, camera);
};

$(document).ready(function() {
  render();
});