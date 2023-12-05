import {GUI} from 'three/addons/libs/lil-gui.module.min.js';

export interface EditableFromGui {
    showGui(gui: GUI): void;  // TODO fix type!
}