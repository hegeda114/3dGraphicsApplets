import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {DragControls} from 'three/addons/controls/DragControls.js';
import {TransformControls} from 'three/addons/controls/TransformControls.js';
import {GUI} from 'three/addons/libs/lil-gui.module.min.js';
import {BezierCurve} from "./curves/bezier.js";
import {ControlPoint2d} from "./control_point.js";


export class Scene {
    /**
     * Creates a Scene instance
     * @param container - HTML Dom element to where the WebGL will be rendering
     * @param background - background color of the scene
     */
    constructor(container, background = 0xf0f0f0) {
        this.threeScene = new THREE.Scene();
        this.threeScene.background = new THREE.Color(background);

        this.containerWidth = container.clientWidth;
        this.containerHeight = container.clientHeight;

        this.threeRenderer = new THREE.WebGLRenderer({antialias: true});
        this.threeRenderer.setPixelRatio(window.devicePixelRatio);
        this.threeRenderer.setSize(this.containerWidth, this.containerHeight);
        this.threeRenderer.shadowMap.enabled = true;
        container.appendChild(this.threeRenderer.domElement);

        this.animatedObjects = [];
        this.dragControlObjects = [];

        // Existence flags
        this.hasMainCamera = false;
        this.hasDragControl = false;
        this.hasTransformControl = false;
    }

    /**
     * Adds a GridHelper to the scene.
     * @param size - the size of the grid helper
     * @param division - the division of the grid helper
     * @param yPos - the y position of the grid helper
     * @param opacity - the opacity of the grid helper
     */
    addGridHelper(size = 2000, division = 2000, yPos = 0, opacity = 0.25) {
        const helper = new THREE.GridHelper(size, division);
        helper.position.y = yPos;
        helper.material.opacity = opacity;
        helper.material.transparent = true;
        this.threeScene.add(helper);
    }

    addAxesHelper(size = 5) {
        const axesHelper = new THREE.AxesHelper(size);
        this.threeScene.add(axesHelper);
    }

    addDragControls() {
        if (!this.hasMainCamera) {
            let error_text = 'You have to create a camera before call this function.';
            error_text += 'Use the "addPerspectiveMainCamera" or "addOrthographicMainCamera" functions!';
            throw Error(error_text);
        }

        this.hasDragControl = true;
        this.dragControl = new DragControls(this.dragControlObjects, this.mainCamera, this.threeRenderer.domElement);
        this.dragControl.addEventListener('dragstart', (event) => {
            event.object.enableHighlight();
            this.cameraOrbitControl.enabled = false;
        });

        this.dragControl.addEventListener('dragend', (event) => {
            event.object.disableHighlight();
            this.cameraOrbitControl.enabled = true;
        });

        this.dragControl.addEventListener('drag', (event) => {
            if (event.object.is2DObject) {
                event.object.position.y = 0;
            }
        })
    }

    // TODO implement!
    addTransformControls() {
        if (!this.hasMainCamera) {
            let error_text = 'You have to create a camera before call this function.';
            error_text += 'Use the "addPerspectiveMainCamera" or "addOrthographicMainCamera" functions!';
            throw Error(error_text);
        }

        this.hasTransformControl = true;
        this.transformControl = new TransformControls(this.mainCamera, this.threeRenderer.domElement);
        this.transformControl.addEventListener('dragging-changed', (event) => {
            // Block cameraOrbitControl while dragging an object
            this.cameraOrbitControl.enabled = !this.cameraOrbitControl.value;
        });
        this.threeScene.add(this.transformControl);

        // TODO implement this, to update anything while dragging
        // transformControl.addEventListener( 'objectChange', function () {
        //     updateSplineOutline();
        // } );
    }

    addOrthographicMainCamera(position = new THREE.Vector3(0, 1, 0)) {
        this.hasMainCamera = true;

        // Create and add camera to the scene
        this.mainCamera = new THREE.OrthographicCamera(
            this.containerWidth / -2, this.containerWidth / 2,
            this.containerHeight / 2, this.containerHeight / -2, 0.001, 10
        );
        this.mainCamera.position.set(position.x, position.y, position.z);
        this.mainCamera.zoom = 40;
        this.mainCamera.updateMatrixWorld(1);
        this.threeScene.add(this.mainCamera);

        // Create orbit control
        this.cameraOrbitControl = new OrbitControls(this.mainCamera, this.threeRenderer.domElement);
        this.cameraOrbitControl.damping = 0.2;
        this.cameraOrbitControl.enableRotate = false;
    }

    addPerspectiveMainCamera(position = new THREE.Vector3(0, 5, 10)) {
        this.hasMainCamera = true;

        // Create and add camera to the scene
        this.mainCamera = new THREE.PerspectiveCamera(70, this.containerWidth / this.containerHeight, 1, 1000);
        this.mainCamera.position.set(position.x, position.y, position.z);
        this.mainCamera.updateMatrixWorld(1);
        this.threeScene.add(this.mainCamera);

        // Create orbit control
        this.cameraOrbitControl = new OrbitControls(this.mainCamera, this.threeRenderer.domElement);
        this.cameraOrbitControl.damping = 0.2;
    }

    addTestCube(position = new THREE.Vector3(0, 0, 0)) {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({color: new THREE.Color(0x00ff00)});
        const cube = new ExtendedMesh(geometry, material);
        cube.position.set(position.x, position.y, position.z)
        this.threeScene.add(cube);
        this.dragControlObjects.push(cube);
    }

    addPointLight() {
        const light = new THREE.PointLight(0xffffff, 1000)
        light.position.set(10, 10, 10)
        this.threeScene.add(light)
    }

    addTestAnimatedCube(position = new THREE.Vector3(0, 0, 0)) {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({color: 0xff0000});
        const cube = new ExtendedMesh(geometry, material);
        this.threeScene.add(cube)
        this.animatedObjects.add(cube)
    }

    addTestQuadraticBezier() {
        const quadraticBezier = new EditableQuadraticBezierCurve();
        this.threeScene.add(quadraticBezier.curveObject);
        quadraticBezier.controlPoints.forEach((controlPoint) => {
            this.threeScene.add(controlPoint);
            this.dragControlObjects.push(controlPoint);
        });
        this.dragControl.addEventListener('drag', (event) => {
            quadraticBezier.updateCurveObject();
        });
    }

    addTestBezierCurve() {
        const bezier = new BezierCurve(16);
        this.threeScene.add(bezier.curveObject);
        bezier.controlPoints.forEach((controlPoint) => {
            this.threeScene.add(controlPoint);
            this.dragControlObjects.push(controlPoint);
        });
        this.dragControl.addEventListener('drag', (event) => {
            bezier.updateCurveObject();
        });
    }

    /**
     * Adds the given object to the scene and returns the success.
     */
    addObject(object) {
        if (typeof object.getMesh !== 'function') {
            return false;
        }
        this.threeScene.add()
        return true;
    }

    addMesh() {

    }

    animate() {
        this.animatedObjects.forEach((element) => element.animate());
    }

    update() {
        this.animate();

        this.cameraOrbitControl.update();
        this.threeRenderer.render(this.threeScene, this.mainCamera);
    }
}

class AnimatedObject {
    constructor(mesh) {
        this.mesh = mesh
    }

    animate() {
        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.01;
    }
}

class ExtendedMesh extends THREE.Mesh {
    constructor(geometry = new THREE.BufferGeometry(), material = new THREE.MeshStandardMaterial()) {
        super(geometry, material);
    }

    enableHighlight() {
        this.material.needsUpdate = true
        this.material.transparent = true;
        this.material.opacity = 0.5;
    }

    disableHighlight() {
        this.material.opacity = 1;
        this.material.transparent = false;
        this.material.needsUpdate = false;
    }

    animate() {
        this.rotation.x += 0.01;
        this.rotation.y += 0.01;
    }
}

export class EditableQuadraticBezierCurve {
    constructor() {
        this.controlPoints = [
            new ControlPoint2d(),
            new ControlPoint2d(),
            new ControlPoint2d(),
            new ControlPoint2d(),
        ];

        this.controlPoints[0].position.set(-3, 0, 0);
        this.controlPoints[1].position.set(0, 0, 2);
        this.controlPoints[2].position.set(3, 0, 3);
        this.controlPoints[3].position.set(5, 0, -3);

        this.geometry = new THREE.BufferGeometry()
        this.material = new THREE.LineBasicMaterial({color: 0xff0000});
        this.curveObject = new THREE.Line(this.geometry, this.material);
        this.curveObject.rotateX(Math.PI / 2);

        this.updateCurveObject();
    }

    updateCurveObject() {
        const curve = new THREE.CubicBezierCurve(
            this.controlPoints[0].get2dPosition(),
            this.controlPoints[1].get2dPosition(),
            this.controlPoints[2].get2dPosition(),
            this.controlPoints[3].get2dPosition(),
        );

        const points = curve.getPoints(50);
        this.geometry.setFromPoints(points);
    }
}