import * as THREE from 'three';
import {ControlPoint} from '../control_point/control_point.js'

/**
 * A ComplexObject has to contain a three object and control points.
 */
export interface InteractiveObject {
    /**
     * Returns the list of the control points of the interactive object.
     * @return {ControlPoint[]} list of the control points
     */
    getControlPoints();

    /**
     * Returns the three object (this will be added to the threeScene).
     * @return {THREE.Object3D}
     */
    getThreeObject();
}