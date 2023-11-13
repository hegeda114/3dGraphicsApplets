import * as THREE from "three";

class ControlPoint extends THREE.Mesh {
    constructor(radius, is2DObject = false) {
        const geometry = new THREE.CircleGeometry(radius, 16);
        const material = new THREE.MeshStandardMaterial(
            {color: new THREE.Color(0xff0000)}
        )
        super(geometry, material);
        this.rotateX(-Math.PI / 2);
        this.is2DObject = is2DObject;
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

    get2dPosition() {
        return new THREE.Vector2(this.position.x, this.position.z)
    }
}