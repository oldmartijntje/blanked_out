import { Vector2 } from "./src/system/Vector2.js";
import { GameLoop } from "./src/system/GameLoop.js";
import { Main } from "./src/objects/Main/Main.js";
import { BaseLevel } from "./src/levels/BaseLevel.js";

const canvas = document.querySelector("#game-canvas");
const ctx = canvas.getContext("2d");

const mainScene = new Main({
    position: new Vector2(0, 0),
});
mainScene.setLevel(new BaseLevel());

let scale = 1;
const zoomSpeed = 0.05;
let isDragging = false;
let startX = 0, startY = 0;
let lastX = 0, lastY = 0;
let lastTouchDistance = 0;
let isZoomLimitReached = false;
const MIN_SCALE = 0.5;
const MAX_SCALE = 3;

// Update and draw functions (unchanged)
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

// Handle drag movement (mouse)
const onPointerDown = (event) => {
    isDragging = true;
    lastX = event.clientX || event.touches[0].clientX;
    lastY = event.clientY || event.touches[0].clientY;
};

const onPointerMove = (event) => {
    if (isDragging) {
        const currentX = event.clientX || event.touches[0].clientX;
        const currentY = event.clientY || event.touches[0].clientY;
        const speedFactor = event.touches ? 1 : 1; // Slow down movement on PC
        mainScene.camera.position.x += (currentX - lastX) * speedFactor / scale;
        mainScene.camera.position.y += (currentY - lastY) * speedFactor / scale;
        lastX = currentX;
        lastY = currentY;
    }

    if (event.touches && event.touches.length === 2) {
        event.preventDefault();
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
        const currentTouchDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);

        if (lastTouchDistance > 0) {
            const zoomFactor = currentTouchDistance / lastTouchDistance;
            const newScale = scale * zoomFactor;

            if (newScale >= MIN_SCALE && newScale <= MAX_SCALE) {
                scale = newScale;

                const centerX = (touch1.clientX + touch2.clientX) / 2;
                const centerY = (touch1.clientY + touch2.clientY) / 2;
                mainScene.camera.position.x = centerX - (centerX - mainScene.camera.position.x) * zoomFactor;
                mainScene.camera.position.y = centerY - (centerY - mainScene.camera.position.y) * zoomFactor;
            } else {
                isZoomLimitReached = true;
            }
        }

        lastTouchDistance = currentTouchDistance;
    }
};

const onPointerUp = () => {
    isDragging = false;
    lastTouchDistance = 0;
    isZoomLimitReached = false;
};

const onWheel = (event) => {
    event.preventDefault();
    const zoomFactor = event.deltaY < 0 ? (1 + zoomSpeed) : (1 - zoomSpeed);
    scale *= zoomFactor;
    scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale)); // Clamping zoom level
};

// Touch event listeners for zoom and drag on mobile
const onTouchStart = (event) => {
    if (event.touches.length === 2) {
        event.preventDefault();
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
        lastTouchDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
    } else if (event.touches.length === 1) {
        isDragging = true;
        startX = event.touches[0].clientX;
        startY = event.touches[0].clientY;
    }
};

const onTouchMove = (event) => {
    if (isZoomLimitReached) {
        event.preventDefault();
        return;
    }

    if (event.touches.length === 2) {
        event.preventDefault();
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
        const currentTouchDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);

        if (lastTouchDistance > 0) {
            const zoomFactor = currentTouchDistance / lastTouchDistance;
            const newScale = scale * zoomFactor;

            if (newScale >= MIN_SCALE && newScale <= MAX_SCALE) {
                scale = newScale;

                const centerX = (touch1.clientX + touch2.clientX) / 2;
                const centerY = (touch1.clientY + touch2.clientY) / 2;
                mainScene.camera.position.x = centerX - (centerX - mainScene.camera.position.x) * zoomFactor;
                mainScene.camera.position.y = centerY - (centerY - mainScene.camera.position.y) * zoomFactor;
            } else {
                isZoomLimitReached = true;
            }
        }

        lastTouchDistance = currentTouchDistance;
    } else if (event.touches.length === 1 && isDragging) {
        const currentX = event.touches[0].clientX;
        const currentY = event.touches[0].clientY;
        mainScene.camera.position.x += (currentX - startX) / scale;
        mainScene.camera.position.y += (currentY - startY) / scale;
        startX = currentX;
        startY = currentY;
    }
};

const onTouchEnd = () => {
    isDragging = false;
    lastTouchDistance = 0;
    isZoomLimitReached = false;
};

canvas.addEventListener("mousedown", onPointerDown);
canvas.addEventListener("mousemove", onPointerMove);
canvas.addEventListener("mouseup", onPointerUp);
canvas.addEventListener("mouseleave", onPointerUp);
canvas.addEventListener("wheel", onWheel, { passive: false });

canvas.addEventListener("touchstart", onTouchStart, { passive: false });
canvas.addEventListener("touchmove", onTouchMove, { passive: false });
canvas.addEventListener("touchend", onTouchEnd);
