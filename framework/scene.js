import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {DragControls} from 'three/addons/controls/DragControls';
import {TransformControls} from 'three/addons/controls/TransformControls';
import {GUI} from 'three/addons/libs/lil-gui.module.min.js';


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

        this.animatedObjects = []
    }

    /**
     * Adds a GridHelper to the scene.
     * @param size - the size of the grid helper
     * @param division - the division of the grid helper
     * @param yPos - the y position of the grid helper
     * @param opacity - the opacity of the grid helper
     */
    addHelperGrid(size = 2000, division = 2000, yPos = -0.1, opacity = 0.25) {
        const helper = new THREE.GridHelper(size, division);
        helper.position.y = yPos;
        helper.material.opacity = opacity;
        helper.material.transparent = true;
        this.threeScene.add(helper);
    }

    addOrthographicMainCamera(position = new THREE.Vector3(0, 1, 0)) {
        // TODO use the container instead of the window!
        const width = this.containerWidth;
        const height = this.containerHeight;

        // Create and add camera
        this.mainCamera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 0.001, 10);
        this.mainCamera.position.set(position.x, position.y, position.z);
        this.mainCamera.zoom = 40;
        this.mainCamera.updateMatrixWorld(1);
        this.threeScene.add(this.mainCamera);

        // Create and add orbit control
        this.cameraOrbitControl = new OrbitControls(this.mainCamera, this.threeRenderer.domElement);
        this.cameraOrbitControl.damping = 0.2;
        this.cameraOrbitControl.enableRotate = false;
    }

    addPerspectiveMainCamera(position = new THREE.Vector3(0, 0, 3)) {
        // TODO use the container instead of the window!
        const width = this.containerWidth;
        const height = this.containerHeight;

        // Create and add camera
        this.mainCamera = new THREE.PerspectiveCamera( 70, width / height, 1, 1000);
        this.mainCamera.position.set(position.x, position.y, position.z);
        this.mainCamera.updateMatrixWorld(1);
        this.threeScene.add(this.mainCamera);

        // Create and add orbit control
        this.cameraOrbitControl = new OrbitControls(this.mainCamera, this.threeRenderer.domElement);
        this.cameraOrbitControl.damping = 0.2;
    }

    addTestCube(position = new THREE.Vector3(0, 0, 0)) {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        const cube = new THREE.Mesh(geometry, material);
        this.threeScene.add(cube)
    }

    addTestAnimatedCube(position = new THREE.Vector3(0, 0, 0)) {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({color: 0xff0000});
        const cube = new THREE.Mesh(geometry, material);
        this.threeScene.add(cube)

        const animatedCube = new AnimatedObject(cube);
        this.animatedObjects.push(animatedCube)
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