import * as THREE from 'three';


export class DraggableMesh extends THREE.Mesh {
    /**
     * Called when the drag event started.
     */
    onDragStart() {};

    /**
     * Called when the drag event ended.
     */
    onDragEnd() {};

    /**
     * Returns the list of the blocked axis as strings.
     * @return {string[]} list of the blocked axis
     */
    getBlockedAxisList() {
        return [];
    };
}