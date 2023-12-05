import * as THREE from 'three';
import {DraggableMesh} from '../interfaces/draggable.js'

export class ControlPoint extends DraggableMesh {
    /**
     * Creates a new control point.
     * @param radius {number} radius of the displayed circle
     * @param segments {number} number of the segments of the displayed circle
     * @param color {number} color of the displayed circle
     */
    constructor(
        radius = 0.2,
        segments = 16,
        color = THREE.Color.NAMES.red
    ) {
        const geometry = new THREE.CircleGeometry(radius, segments);
        const material = new THREE.MeshStandardMaterial(
            {color: new THREE.Color(color)}
        )
        super(geometry, material);
        this.rotateX(-Math.PI / 2);
    }

    onDragStart() {
        this.material.needsUpdate = true
        this.material.transparent = true;
        this.material.opacity = 0.5;
    }

    onDragEnd() {
        this.material.opacity = 1;
        this.material.transparent = false;
        this.material.needsUpdate = false;
    }
}