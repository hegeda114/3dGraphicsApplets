import * as THREE from 'three';
import {GUI} from 'three/addons/libs/lil-gui.module.min.js';
import type {EditableFromGui} from '../interfaces/editable_from_gui';

export class GridHelper extends THREE.GridHelper implements EditableFromGui {
    constructor(
        size: number = 2000,
        division: number = 2000,
        yPos: number = 0,
        opacity: number = 0.25,
    ) {
        super(size, division);
        this.position.y = yPos;
        this.material.opacity = opacity;
        this.material.transparent = true;
    }

    showGui(gui: GUI) {
        const grid_helper_gui = gui.addFolder('GridHelper');
        grid_helper_gui.add(this.position, 'y').name('Y position');
        grid_helper_gui.add(this, 'size').name('Size')
        grid_helper_gui.add(this, 'division').name('Division')
        grid_helper_gui.add(this.material, 'opacity').name('Opacity')
    }
}