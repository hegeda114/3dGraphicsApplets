import * as THREE from 'three';
import {Scene} from '/framework/scene.js'
import {BezierCurve2DObject} from '/framework/curves/bezier.js';
import {GUI} from 'three/addons/libs/lil-gui.module.min.js';

const container = document.getElementById('simple_scene');

// Create empty 2d scene
let scene = new Scene(container, true);

// Add 2d Bezier Curve to scene
const bezierCurve2D = new BezierCurve2DObject(4);
// const positions = [
//     new THREE.Vector3(-4, 0, 0),
//     new THREE.Vector3(-2, 0, 0),
//     new THREE.Vector3(2, 0, 0),
//     new THREE.Vector3(4, 0, 0),
// ]
// bezierCurve2D.setCursorPointPositions(positions)
scene.addObject(bezierCurve2D);

// Initialize gui
const gui = new GUI();
scene.showSettingsGui(gui);

// Update
function update() {
    requestAnimationFrame(update)
    scene.update()
}

update()
