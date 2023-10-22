import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls';
import {DragControls} from 'three/addons/controls/DragControls';
import {TransformControls} from 'three/addons/controls/TransformControls';
import {GUI} from 'three/addons/libs/lil-gui.module.min.js';
import {func} from "three/addons/nodes/code/FunctionNode";

let camera, scene, renderer;
let transformControl;
const point = new THREE.Vector3();
const splineHelperObjects = [];

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const onUpPosition = new THREE.Vector2();
const onDownPosition = new THREE.Vector2();

function init(container) {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0)

    const width = window.innerWidth
    const height = window.innerHeight

    camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, 1000);
    camera.position.set(0, 0, 3);
    scene.add(camera)

    //const planeGeometry = new THREE.PlaneGeometry(2000, 2000);
    //planeGeometry.rotateX(-Math.PI / 2);
    //const planeMaterial = new THREE.ShadowMaterial({color: 0x000000, opacity: 0.2});

    //const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    //plane.position.y = -200;
    //plane.receiveShadow = true;
    //scene.add(plane);

    const helper = new THREE.GridHelper(2000, 100);
    helper.position.y = -199;
    helper.material.opacity = 0.25;
    helper.material.transparent = true;
    scene.add(helper);

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
}

init(document.body)

function initControls() {
    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.damping = 0.2;
    controls.addEventListener('change', render);

    transformControl = new TransformControls(camera, renderer.domElement);
    transformControl.addEventListener('change', render);
    transformControl.addEventListener('dragging-changed', function (event) {
        controls.enabled = !event.value;
    });
    scene.add(transformControl);

    transformControl.addEventListener('objectChange', function () {

        updateSplineOutline();

    });

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('pointerup', onPointerUp);
    document.addEventListener('pointermove', onPointerMove);
    window.addEventListener('resize', onWindowResize);
}

class ControlPoint {
    constructor(posX, posY) {
        this.position = new THREE.Vector2(posX, posY)
        this.geometry = new THREE.CircleGeometry(3, 16);
        this.material = new THREE.MeshBasicMaterial({color: 0xffff00});
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position = this.position
        scene.add(this.mesh);
    }
}

const controlPoints = [
    new ControlPoint(-10, 0),
    new ControlPoint(-5, 15),
    new ControlPoint(20, 15),
    new ControlPoint(10, 0),
]

const controlPointMeshes = [
    controlPoints[0].mesh,
    controlPoints[1].mesh,
    controlPoints[2].mesh,
    controlPoints[3].mesh,
]

const curve = new THREE.CubicBezierCurve(
    controlPoints[0].position,
    controlPoints[1].position,
    controlPoints[2].position,
    controlPoints[3].position,
);

const points = curve.getPoints(50);
const geometry = new THREE.BufferGeometry().setFromPoints(points);

const material = new THREE.LineBasicMaterial({color: 0xff0000});

// Create the final object to add to the scene
const curveObject = new THREE.Line(geometry, material);
scene.add(curveObject)

// Create controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableRotate = false;

const drag_controls = new DragControls(controlPoints, camera, renderer.domElement)
drag_controls.addEventListener('dragstart', function (event) {
    event.object.material.emissive.set(0xaaaaaa);
});

drag_controls.addEventListener('dragend', function (event) {
    event.object.material.emissive.set(0x000000);
});

//controls.update() must be called after any manual changes to the camera's transform
controls.update();

function render() {
    renderer.render(scene, camera)
}

window.addEventListener('resize', onWindowResize, false)

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

function animate() {

    requestAnimationFrame(animate);

    // required if controls.enableDamping or controls.autoRotate are set to true
    controls.update();

    renderer.render(scene, camera);
}

function onPointerDown(event) {
    onDownPosition.x = event.clientX;
    onDownPosition.y = event.clientY;
}

function onPointerUp(event) {
    onUpPosition.x = event.clientX;
    onUpPosition.y = event.clientY;
    if (onDownPosition.distanceTo(onUpPosition) === 0) {
        transformControl.detach();
        render();
    }
}

function onPointerMove(event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(splineHelperObjects, false);
    if (intersects.length > 0) {
        const object = intersects[0].object;
        if (object !== transformControl.object) {
            transformControl.attach(object);
        }
    }
}

animate()