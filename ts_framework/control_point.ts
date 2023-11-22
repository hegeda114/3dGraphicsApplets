import * as THREE from 'three';
import {Draggable} from "./interfaces";

export abstract class ControlPoint extends THREE.Mesh implements Draggable {
    isZAxisFixed: boolean;
    material: THREE.MeshStandardMaterial;

    protected constructor(radius: number, isZAxisFixed: boolean) {
        const geometry = new THREE.CircleGeometry(radius, 16);
        const material = new THREE.MeshStandardMaterial(
            {color: new THREE.Color(0xff0000)}
        )
        super(geometry, material);
        this.rotateX(-Math.PI / 2);
        this.isZAxisFixed = isZAxisFixed;
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
}

export class ControlPoint2d extends ControlPoint {
    constructor(radius = 0.2) {
        super(radius, true);
    }
}

export class ControlPoint3d extends ControlPoint {
    constructor(radius = 0.2) {
        super(radius, true);
    }
}