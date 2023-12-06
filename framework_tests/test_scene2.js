import * as THREE from 'three';
import {Scene} from '/framework/scene/scene.js'
import {ControlPoint} from '/framework/control_point/control_point.js';

const container = document.getElementById('simple_scene');

let myScene;

function demo_01_perspective_scene() {
    myScene = new Scene(container, true);
    myScene.showGridHelper();
    myScene.showAxesHelper();
}

function demo_02_orthographic_scene() {
    myScene = new Scene(container, false);
    myScene.showGridHelper();
    myScene.showAxesHelper();
}

function demo_03_draggable_control_point() {
    myScene = new Scene(container, false);
    let control_point = new ControlPoint();
    myScene.addDraggableMesh(control_point);
}

// Call the appropriate demo
// demo_01_perspective_scene();
// demo_02_orthographic_scene();
demo_03_draggable_control_point();


// Update
function update() {
    requestAnimationFrame(update)
    myScene.update()
}

update()
