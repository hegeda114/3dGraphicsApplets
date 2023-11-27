// import * as THREE from "three";
//
// addTestCube(position = new THREE.Vector3(0, 0, 0)) {
//     const geometry = new THREE.BoxGeometry(1, 1, 1);
//     const material = new THREE.MeshStandardMaterial({color: new THREE.Color(0x00ff00)});
//     const cube = new ExtendedMesh(geometry, material);
//     cube.position.set(position.x, position.y, position.z)
//     this.threeScene.add(cube);
//     this.dragControlObjects.push(cube);
// }
//
// class ExtendedMesh extends THREE.Mesh {
//     constructor(geometry = new THREE.BufferGeometry(), material = new THREE.MeshStandardMaterial()) {
//         super(geometry, material);
//     }
//
//     enableHighlight() {
//         this.material.needsUpdate = true
//         this.material.transparent = true;
//         this.material.opacity = 0.5;
//     }
//
//     disableHighlight() {
//         this.material.opacity = 1;
//         this.material.transparent = false;
//         this.material.needsUpdate = false;
//     }
//
//     animate() {
//         this.rotation.x += 0.01;
//         this.rotation.y += 0.01;
//     }
// }