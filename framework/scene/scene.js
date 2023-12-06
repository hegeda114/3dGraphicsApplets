import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {DragControls} from 'three/addons/controls/DragControls.js';
import {TransformControls} from 'three/addons/controls/TransformControls.js';

export class Scene {
    /**
     * Initializes the scene.
     * @param container {HTMLElement} the container htmlDOM element
     * @param usePerspectiveCamera {boolean} whether to use perspective camera
     * @param background {number} (optional) background color
     */
    constructor(
        container,
        usePerspectiveCamera,
        background = THREE.Color.NAMES.white
    ) {
        this.threeScene = new THREE.Scene();
        this.threeScene.background = new THREE.Color(background);

        this.containerWidth = container.clientWidth;
        this.containerHeight = container.clientHeight;

        this.threeRenderer = new THREE.WebGLRenderer({antialias: true});
        this.threeRenderer.setPixelRatio(window.devicePixelRatio);
        this.threeRenderer.setSize(this.containerWidth, this.containerHeight);
        this.threeRenderer.shadowMap.enabled = true;
        container.appendChild(this.threeRenderer.domElement);

        this.initMainCamera(usePerspectiveCamera);
        this.initDragControl();
    }

    /**
     * Initializes the main camera.
     * @param usePerspectiveCamera {boolean} whether to use perspective camera
     */
    initMainCamera(usePerspectiveCamera) {
        // Create camera
        if (usePerspectiveCamera) {
            this.mainCamera = new THREE.PerspectiveCamera(
                70, this.containerWidth / this.containerHeight, 1, 1000
            );
            this.mainCamera.position.set(0, 5, 20);
        } else {
            this.mainCamera = new THREE.OrthographicCamera(
                this.containerWidth / -2, this.containerWidth / 2,
                this.containerHeight / 2, this.containerHeight / -2, 0.001, 10
            );
            this.mainCamera.zoom = 40;
            this.mainCamera.position.set(0, 1, 0);
        }

        // Set global parameters and add to the scene
        this.mainCamera.updateMatrixWorld(1);
        this.threeScene.add(this.mainCamera);

        // Create orbit control
        this.cameraOrbitControl = new OrbitControls(this.mainCamera, this.threeRenderer.domElement);
        this.cameraOrbitControl.damping = 0.2;
        if (!usePerspectiveCamera) { this.cameraOrbitControl.enableRotate = false; }
    }

    /**
     * Initializes the dragControl. It has to be called after the initMainCamera function!
     */
    initDragControl() {
        this.dragControlObjects = [];
        this.dragControl = new DragControls(this.dragControlObjects, this.mainCamera, this.threeRenderer.domElement);
        this.dragControl.addEventListener('dragstart', (event) => {
            if (typeof event.object.onDragStart === "function") {
                event.object.onDragStart();
            }
            this.cameraOrbitControl.enabled = false;
        });

        this.dragControl.addEventListener('dragend', (event) => {
            if (typeof event.object.onDragEnd === "function") {
                event.object.onDragEnd();
            }
            this.cameraOrbitControl.enabled = true;
        });

        this.dragControl.addEventListener('drag', (event) => {
            if (typeof event.object.getBlockedAxisList === "function") {
                if ('y' in event.object.getBlockedAxisList()) {
                    event.object.position.y = 0;
                }
            }
        })
    }

    showGridHelper(size = 2000, division = 2000, yPos = 0, opacity = 0.25) {
        this.gridHelper = new THREE.GridHelper(size, division);
        this.gridHelper.position.y = yPos;
        this.gridHelper.material.opacity = opacity;
        this.gridHelper.material.transparent = true;
        this.threeScene.add(this.gridHelper);
    }

    showAxesHelper(size = 5) {
        this.axesHelper = new THREE.AxesHelper(size);
        this.threeScene.add(this.axesHelper);
    }

    /**
     * Adds the given interactive object to the scene.
     * @param object {InteractiveObject} the interactive object to add
     */
    addInteractiveObject(object) {
        this.threeScene.add(object);
    }

    /**
     * Adds the given draggable mesh to the scene.
     * @param draggableMesh {DraggableMesh} the draggable mesh to add
     */
    addDraggableMesh(draggableMesh) {
        this.threeScene.add(draggableMesh);

        // Make draggable
        this.dragControlObjects.push(draggableMesh);
        // this.dragControl.addEventListener('drag', (event) => {
        //     draggableMesh.update();
        // });
    }

    update() {
        this.cameraOrbitControl.update();
        this.threeRenderer.render(this.threeScene, this.mainCamera);
    }
}