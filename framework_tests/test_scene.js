import {Scene} from '/framework/scene.js'

const container = document.getElementById('simple_scene');

let myScene = new Scene(container);
myScene.addPerspectiveMainCamera();
// myScene.addTestCube();
myScene.addHelperGrid()
myScene.addTestAnimatedCube();


// Update
function update() {
    myScene.update()
    requestAnimationFrame(update)
}

update()
