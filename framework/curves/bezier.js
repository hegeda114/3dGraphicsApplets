import * as THREE from "three";
import {ControlPoint2d} from "../control_point.js";
import {bersnstein} from "../math.js";


export class BezierCurve3DObject {

}


export class BezierCurve2DObject {
    constructor(degree) {
        this.degree = degree;

        this.controlPoints = []
        for (let i = 0; i < this.degree; i++) {
            this.controlPoints.push(new ControlPoint2d());
        }
        this.controlPoints.forEach((cp, idx) => {
            cp.position.set(0.2*idx, 0, 0.5*idx);
        })

        this.geometry = new THREE.BufferGeometry()
        this.material = new THREE.LineBasicMaterial({color: 0xff0000});
        this.curveObject = new THREE.Line(this.geometry, this.material);

        this.update();
    }

    setCursorPointPositions(positions) {
        for (let i = 0; i < positions.length; i++) {
            this.controlPoints[i].position.set(positions[i]);
        }
        this.update();
    }

    addControlPoint(position) {
        this.degree++;
        this.controlPoints.push(new ControlPoint2d())
    }

    update() {
        const controlPointPositions = this.controlPoints.map((controlPoint) => {
            return controlPoint.position;
        })
        const curve = new BezierCurve(controlPointPositions);
        const points = curve.getPoints(10);
        this.geometry.setFromPoints(points);
    }

    getRenderObject() {
        return this.curveObject;
    }

    getControlPoints() {
        return this.controlPoints;
    }

}


class BezierCurve extends THREE.Curve {
    constructor(controlPointPositions) {
        super();
        this.controlPointPositions = controlPointPositions;
        this.degree = this.controlPointPositions.length;
    }

    getPoint(t, optionalTarget = new THREE.Vector3()) {
        const point = optionalTarget;
        let tx = 0, ty = 0, tz = 0;
        for (const [index, controlPosition] of this.controlPointPositions.entries()) {
            const k = index;
            const n = this.degree - 1;
            const bernstein = bersnstein(n, k, t);
            const controlPointEffect = new THREE.Vector3().copy(controlPosition).multiplyScalar(bernstein);
            tx += controlPointEffect.x;
            ty += controlPointEffect.y;
            tz += controlPointEffect.z;
        }
        return point.set(tx, ty, tz);
    }
}