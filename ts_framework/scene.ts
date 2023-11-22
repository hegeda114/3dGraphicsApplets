import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {DragControls} from 'three/examples/jsm/controls/DragControls';
import {TransformControls} from 'three/examples/jsm/controls/TransformControls';
import {GUI} from 'three/examples/jsm/libs/lil-gui.module.min.js';
import {ControlPoint, ControlPoint3d} from './control_point';
import {Animatable, ComplexObject} from "./object";
import {OrthographicCamera} from "three";


export class Scene {
    threeScene: THREE.Scene;
    containerWidth: number;
    containerHeight: number;
    threeRenderer: THREE.WebGLRenderer;
    animatedObjects: Animatable[];
    mainCamera: THREE.OrthographicCamera | THREE.PerspectiveCamera;

    // Controls
    dragControl: DragControls
    dragControlObjects: THREE.Mesh[];
    cameraOrbitControl: OrbitControls;
    transformControl: TransformControls;

    // Existence flags
    hasMainCamera: boolean = false;
    hasDragControl: boolean = false;
    hasTransformControl: boolean = false;

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
            const obj: Animatable = event.object as Animatable;
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
            this.cameraOrbitControl.enabled = !this.cameraOrbitControl.enabled;  // TODO not tested!
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
        this.mainCamera.updateMatrixWorld(true);
        this.threeScene.add(this.mainCamera);

        // Create orbit control
        this.cameraOrbitControl = new OrbitControls(this.mainCamera, this.threeRenderer.domElement);
        this.cameraOrbitControl.dampingFactor = 0.2;
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
        this.cameraOrbitControl.dampingFactor = 0.2;
    }

    addPointLight() {
        const light = new THREE.PointLight(0xffffff, 1000)
        light.position.set(10, 10, 10)
        this.threeScene.add(light)
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

    addMesh(mesh: THREE.Mesh) {
        this.threeScene.add(mesh);
    }

    /**
     * Adds the given object to the scene and returns the success.
     */
    addComplexObject(object: ComplexObject) {
        this.threeScene.add(object.getRenderObject())
        const controlPoints = object.getControlPoints()
        controlPoints.forEach((controlPoint: ControlPoint) => {
            this.threeScene.add(controlPoint);
            this.dragControlObjects.push(controlPoint)
        })

        this.dragControl.addEventListener('drag', (event) => {
            object.updateCurveObject();
        });
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
