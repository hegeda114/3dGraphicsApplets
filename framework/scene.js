import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {DragControls} from 'three/addons/controls/DragControls.js';
import {TransformControls} from 'three/addons/controls/TransformControls.js';
import {GUI} from 'three/addons/libs/lil-gui.module.min.js';
import {ControlPoint2d} from "./control_point/control_point.js";


export class Scene {
    constructor(container, usePerspectiveCamera = false, background = 0xf0f0f0) {
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

        // Add basic things
        this.usePerspectiveCamera = usePerspectiveCamera;
        this.updateMainCamera();
        this.addDragControls();
        this.addAxesHelper();
        this.addGridHelper();
        this.addPointLight();

        // Existence flags
        this.hasMainCamera = false;
        this.hasTransformControl = false;

        // Style
        this.controlPointSize = 0.2;
    }

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

    updateMainCamera() {
        if (this.usePerspectiveCamera) {
            this.addPerspectiveMainCamera();
        } else {
            this.addOrthographicMainCamera();
        }
    }

    addPointLight() {
        const light = new THREE.PointLight(0xffffff, 1000);
        light.position.set(10, 10, 10);
        this.threeScene.add(light);
    }

    showSettingsGui(gui) {
        const sceneFolder = gui.addFolder('Scene');
        let test = false;
        const cameraTypeController = sceneFolder
            .add(this, 'usePerspectiveCamera').name('Use perspective camera')
            .listen();
        cameraTypeController.onChange((newValue) => {
            this.updateMainCamera();
        });
        //sceneFolder.add(this, 'controlPointSize', 'CP size');
    }

    addObject(object) {
        // Add render object to the scene
        this.threeScene.add(object.getRenderObject());

        const controlPoints = object.getControlPoints();

        // Make control points draggable
        controlPoints.forEach((controlPoint) => {
            this.threeScene.add(controlPoint);
            this.dragControlObjects.push(controlPoint);
        });
        this.dragControl.addEventListener('drag', (event) => {
            object.update();
        });

        // Set control points resizable

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
