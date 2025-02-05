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

let scale = 1;
const zoomSpeed = 0.1;
let isDragging = false;
let lastX = 0, lastY = 0;

const update = (deltaTime) => {
    mainScene.stepEntry(deltaTime, mainScene);
    mainScene.input?.update();
};

const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    mainScene.drawBackground(ctx);

    // save current state (for camera offset and zoom)
    ctx.save();

    // Apply zoom and offset by camera position
    if (mainScene.camera) {
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(scale, scale);
        ctx.translate(-canvas.width / 2 + mainScene.camera.position.x, -canvas.height / 2 + mainScene.camera.position.y);
    }

    mainScene.drawObjects(ctx, 0, 0);

    // restore to original state
    ctx.restore();

    // Draw anything above the game world
    mainScene.drawForeground(ctx);
};

const gameLoop = new GameLoop(update, draw);
gameLoop.start();

// Handle drag movement
const onPointerDown = (event) => {
    isDragging = true;
    lastX = event.clientX || event.touches[0].clientX;
    lastY = event.clientY || event.touches[0].clientY;
};

const onPointerMove = (event) => {
    if (isDragging) {
        const currentX = event.clientX || event.touches[0].clientX;
        const currentY = event.clientY || event.touches[0].clientY;
        mainScene.camera.position.x += (currentX - lastX) / scale;
        mainScene.camera.position.y += (currentY - lastY) / scale;
        lastX = currentX;
        lastY = currentY;
    }
};

const onPointerUp = () => {
    isDragging = false;
};

const onWheel = (event) => {
    event.preventDefault();
    const zoomFactor = event.deltaY < 0 ? (1 + zoomSpeed) : (1 - zoomSpeed);
    scale *= zoomFactor;
    scale = Math.max(0.5, Math.min(3, scale)); // Clamping zoom level
};

let lastTouchDist = null;
const onTouchStart = (event) => {
    if (event.touches.length === 2) {
        const dx = event.touches[0].clientX - event.touches[1].clientX;
        const dy = event.touches[0].clientY - event.touches[1].clientY;
        lastTouchDist = Math.sqrt(dx * dx + dy * dy);
    }
};

const onTouchMove = (event) => {
    if (event.touches.length === 2) {
        event.preventDefault();
        const dx = event.touches[0].clientX - event.touches[1].clientX;
        const dy = event.touches[0].clientY - event.touches[1].clientY;
        const newDist = Math.sqrt(dx * dx + dy * dy);
        if (lastTouchDist) {
            const zoomFactor = newDist > lastTouchDist ? (1 + zoomSpeed) : (1 - zoomSpeed);
            scale *= zoomFactor;
            scale = Math.max(0.5, Math.min(3, scale)); // Clamping zoom level
        }
        lastTouchDist = newDist;
    }
};

canvas.addEventListener("mousedown", onPointerDown);
canvas.addEventListener("mousemove", onPointerMove);
canvas.addEventListener("mouseup", onPointerUp);
canvas.addEventListener("mouseleave", onPointerUp);
canvas.addEventListener("touchstart", onPointerDown, { passive: false });
canvas.addEventListener("touchmove", onPointerMove, { passive: false });
canvas.addEventListener("touchend", onPointerUp);
canvas.addEventListener("wheel", onWheel, { passive: false });
canvas.addEventListener("touchstart", onTouchStart, { passive: false });
canvas.addEventListener("touchmove", onTouchMove, { passive: false });
