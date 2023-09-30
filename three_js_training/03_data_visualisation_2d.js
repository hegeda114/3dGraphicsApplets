import * as THREE from 'three';

let fov = 40;
let near = 10;
let far = 100;
let aspect = viz_width / height;
new THREE.PerspectiveCamera(fov, aspect, near, far + 1);

let scene = new THREE.Scene();
scene.background = new THREE.Color(0xefefef);
scene.add(points);

function getScaleFromZ (camera_z_position) {
    let half_fov = fov/2;
    let half_fov_radians = toRadians(half_fov);
    let half_fov_height = Math.tan(half_fov_radians) * camera_z_position;
    let fov_height = half_fov_height * 2;
    let scale = height / fov_height; // Divide visualization height by height derived from field of view
    return scale;
}

function getZFromScale(scale) {
    let half_fov = fov/2;
    let half_fov_radians = toRadians(half_fov);
    let scale_height = height / scale;
    let camera_z_position = scale_height / (2 * Math.tan(half_fov_radians));
    return camera_z_position;
}