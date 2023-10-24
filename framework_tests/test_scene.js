import * as THREE from 'three';
import {ControlPoint2d, Scene} from '/framework/scene.js'

const container = document.getElementById('simple_scene');

// let myScene = new Scene(container);
// myScene.addPerspectiveMainCamera();
// myScene.addTestCube();
// myScene.addGridHelper();
// myScene.addAxesHelper();
// // myScene.addTestAnimatedCube();
// myScene.addDragControls()
// myScene.addTestCube(new THREE.Vector3(2, 3, 0));
// myScene.addPointLight()

let myScene = new Scene(container);
myScene.addOrthographicMainCamera();
myScene.addGridHelper();
myScene.addAxesHelper();
myScene.addDragControls();
let point = new ControlPoint2d();
myScene.addPointLight();
myScene.threeScene.add(point);
myScene.dragControlObjects.push(point);

// Update
function update() {
    requestAnimationFrame(update)
    myScene.update()
}

update()
