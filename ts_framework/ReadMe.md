Néhány fejlesztéshez kapcsolódó információ
- three installálása typescript-hez
```
npm install three
npm install @types/three
```
- importok
```typescript
import * as THREE from 'three'
import {DragControls} from 'three/examples/jsm/controls/DragControls';
// Fontos, hogy ne így:
// import {DragControls} from 'three/js/controls/DragControls';
```
- typescript handbook: https://www.typescriptlang.org/docs/handbook/2/classes.html
- 