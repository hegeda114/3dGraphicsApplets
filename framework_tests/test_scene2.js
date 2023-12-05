import * as THREE from 'three';
import {Scene} from '/framework/scene/scene.js'
import {ControlPoint} from '/framework/control_point/control_point.js';

const container = document.getElementById('simple_scene');

let myScene = new Scene(container, true);
let cp = new ControlPoint();
myScene.showGridHelper();
myScene.showAxesHelper();
myScene.threeScene.add(new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial()))

// Update
function update() {
    requestAnimationFrame(update)
    myScene.update()
}

update()
