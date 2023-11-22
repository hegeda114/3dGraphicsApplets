import * as THREE from 'three';
import {ControlPoint} from "./control_point";

export interface ComplexObject {
    getRenderObject(): THREE.Mesh;
    getControlPoints(): ControlPoint[];
}