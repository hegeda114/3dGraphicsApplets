import * as THREE from "three";
import {ControlPoint, ControlPoint2d} from "../control_point.js";
import {Vector3} from "three";
import {bersnstein} from "../math.js";


export class BezierCurve {
    degree: number;
    controlPoints: ControlPoint[]

    constructor(degree) {
        this.degree = degree;

        //this.controlPoints = new Array(this.degree).fill(new ControlPoint2d());
        for (let i = 0; i < this.degree; i++) {
            this.controlPoints.push(new ControlPoint2d());
        }
        this.controlPoints.forEach((cp, idx) => {
            cp.position.set(0.2*idx, 0, 0.5*idx);
        })

        this.geometry = new THREE.BufferGeometry()
        this.material = new THREE.LineBasicMaterial({color: 0xff0000});
        this.curveObject = new THREE.Line(this.geometry, this.material);
        // this.curveObject.rotateX(Math.PI / 2);

        this.updateCurveObject();
    }

    updateCurveObject() {
        const controlPointPositions = this.controlPoints.map((controlPoint) => {
            return controlPoint.position;
        })
        const curve = new CustomBezierCurve(controlPointPositions);
        const points = curve.getPoints(10);
        this.geometry.setFromPoints(points);
    }
}


class CustomBezierCurve extends THREE.Curve {
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
            const controlPointEffect = new Vector3().copy(controlPosition).multiplyScalar(bernstein);
            tx += controlPointEffect.x;
            ty += controlPointEffect.y;
            tz += controlPointEffect.z;
        }
        return point.set(tx, ty, tz);
    }
}