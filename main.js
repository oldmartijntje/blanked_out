import { Vector2 } from "./src/system/Vector2.js";
import { GameLoop } from "./src/system/GameLoop.js";
import { Main } from './src/objects/Main/Main.js';
import { OutdoorLevel1 } from "./src/levels/OutdoorLevel1.js";

const canvas = document.querySelector('#game-canvas');
const ctx = canvas.getContext('2d');

// In the future, move this into a level object.
const mainScene = new Main({
    position: new Vector2(0, 0),
});
mainScene.setLevel(new OutdoorLevel1());

const update = (deltaTime) => {
    mainScene.stepEntry(deltaTime, mainScene);
    mainScene.input?.update();
}

const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    mainScene.drawBackground(ctx);

    // save current state (for camera offset)
    ctx.save();

    //offset by camera position
    if (mainScene.camera) {
        ctx.translate(mainScene.camera.position.x, mainScene.camera.position.y);
    }

    mainScene.drawObjects(ctx, 0, 0);

    // restore to original state
    ctx.restore();

    // draw anything above the game world
    mainScene.drawForeground(ctx);
}


const gameLoop = new GameLoop(update, draw);

gameLoop.start();