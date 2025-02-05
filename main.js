import { Vector2 } from "./src/system/Vector2.js";
import { GameLoop } from "./src/system/GameLoop.js";
import { Main } from "./src/objects/Main/Main.js";
import { BaseLevel } from "./src/levels/BaseLevel.js";

const canvas = document.querySelector("#game-canvas");
const ctx = canvas.getContext("2d");

// In the future, move this into a level object.
const mainScene = new Main({
    position: new Vector2(0, 0),
});
mainScene.setLevel(new BaseLevel());

const update = (deltaTime) => {
    mainScene.stepEntry(deltaTime, mainScene);
    mainScene.input?.update();
};

const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    mainScene.drawBackground(ctx);

    // save current state (for camera offset)
    ctx.save();

    // Offset by camera position
    if (mainScene.camera) {
        ctx.translate(mainScene.camera.position.x, mainScene.camera.position.y);
    }

    mainScene.drawObjects(ctx, 0, 0);

    // restore to original state
    ctx.restore();

    // Draw anything above the game world
    mainScene.drawForeground(ctx);
};

const gameLoop = new GameLoop(update, draw);
gameLoop.start();

// Handle mouse drag movement
let isDragging = false;
let lastX = 0, lastY = 0;

const onMouseDown = (event) => {
    isDragging = true;
    lastX = event.clientX;
    lastY = event.clientY;
};

const onMouseMove = (event) => {
    if (isDragging) {
        const deltaX = event.clientX - lastX;
        const deltaY = event.clientY - lastY;
        mainScene.camera.position.x += deltaX;
        mainScene.camera.position.y += deltaY;
        lastX = event.clientX;
        lastY = event.clientY;
    }
};

const onMouseUp = () => {
    isDragging = false;
};

canvas.addEventListener("mousedown", onMouseDown);
canvas.addEventListener("mousemove", onMouseMove);
canvas.addEventListener("mouseup", onMouseUp);
canvas.addEventListener("mouseleave", onMouseUp);
