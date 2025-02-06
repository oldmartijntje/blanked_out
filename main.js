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
let dragStartTime;

const update = (deltaTime) => {
    mainScene.stepEntry(deltaTime, mainScene);
    mainScene.input?.update();
};

// Fixed click handling to account for camera position and scale
const handleClick = (e) => {
    const rect = canvas.getBoundingClientRect();
    const screenX = (e.clientX || e.touches[0].clientX) - rect.left;
    const screenY = (e.clientY || e.touches[0].clientY) - rect.top;

    // Convert screen coordinates to world coordinates
    const worldX = (screenX - canvas.width / 2) / scale - mainScene.camera.position.x;
    const worldY = (screenY - canvas.height / 2) / scale - mainScene.camera.position.y;

    console.log("Clicked at world position:", worldX, worldY);
};

const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    mainScene.drawBackground(ctx);

    ctx.save();

    if (mainScene.camera) {
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(scale, scale);
        ctx.translate(-canvas.width / 2 + mainScene.camera.position.x, -canvas.height / 2 + mainScene.camera.position.y);
    }

    mainScene.drawObjects(ctx, 0, 0);
    ctx.restore();
    mainScene.drawForeground(ctx);
};

const gameLoop = new GameLoop(update, draw);
gameLoop.start();

// Fixed touch handling for mobile
const onPointerDown = (event) => {
    isDragging = true;
    if (event.touches) {
        lastX = event.touches[0].clientX;
        lastY = event.touches[0].clientY;
    } else {
        lastX = event.clientX;
        lastY = event.clientY;
    }
    dragStartTime = new Date().getTime();
};

const onPointerMove = (event) => {
    if (!isDragging) return;

    let currentX, currentY;
    if (event.touches) {
        currentX = event.touches[0].clientX;
        currentY = event.touches[0].clientY;
    } else {
        currentX = event.clientX;
        currentY = event.clientY;
    }

    const dx = (currentX - lastX) / scale;
    const dy = (currentY - lastY) / scale;

    mainScene.camera.position.x += dx;
    mainScene.camera.position.y += dy;

    lastX = currentX;
    lastY = currentY;
};

const onPointerUp = (e) => {
    const dragEndTime = new Date().getTime();
    const dragDuration = dragEndTime - dragStartTime;

    if (dragDuration < 200 && !isZoomLimitReached) {
        handleClick(e);
    }
    isDragging = false;
};

const onWheel = (event) => {
    event.preventDefault();
    const zoomFactor = event.deltaY < 0 ? (1 + zoomSpeed) : (1 - zoomSpeed);
    scale *= zoomFactor;
    scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale));
};

// Improved touch zoom handling
const onTouchStart = (event) => {
    if (event.touches.length === 2) {
        event.preventDefault();
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
        lastTouchDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
    } else if (event.touches.length === 1) {
        isDragging = true;
        lastX = event.touches[0].clientX;
        lastY = event.touches[0].clientY;
        dragStartTime = new Date().getTime();
    }
};

const onTouchMove = (event) => {
    if (event.touches.length === 2) {
        event.preventDefault();
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
        const currentTouchDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);

        if (lastTouchDistance > 0) {
            const zoomFactor = currentTouchDistance / lastTouchDistance;
            const newScale = scale * zoomFactor;

            if (newScale >= MIN_SCALE && newScale <= MAX_SCALE) {
                // Calculate zoom center point (midpoint between touches)
                const rect = canvas.getBoundingClientRect();
                const centerX = ((touch1.clientX + touch2.clientX) / 2);
                const centerY = ((touch1.clientY + touch2.clientY) / 2);

                // Convert center point to world coordinates before scaling
                const worldCenterX = (centerX - canvas.width / 2) / scale + mainScene.camera.position.x;
                const worldCenterY = (centerY - canvas.height / 2) / scale + mainScene.camera.position.y;

                // Apply new scale
                scale = newScale;

                // Adjust camera position to keep zoom centered
                const newWorldCenterX = (centerX - canvas.width / 2) / scale + mainScene.camera.position.x;
                const newWorldCenterY = (centerY - canvas.height / 2) / scale + mainScene.camera.position.y;

                mainScene.camera.position.x += centerX - (centerX - lastX) * scale;
                mainScene.camera.position.y += centerY - (centerY - lastY) * scale;;
            }
        }

        lastTouchDistance = currentTouchDistance;
    } else if (event.touches.length === 1 && isDragging) {
        const currentX = event.touches[0].clientX;
        const currentY = event.touches[0].clientY;

        const dx = (currentX - lastX) / scale;
        const dy = (currentY - lastY) / scale;

        mainScene.camera.position.x += dx;
        mainScene.camera.position.y += dy;

        lastX = currentX;
        lastY = currentY;
    }
};

const onTouchEnd = (e) => {
    if (e.touches.length < 2) {
        lastTouchDistance = 0;
        isZoomLimitReached = false;
    }

    const dragEndTime = new Date().getTime();
    const dragDuration = dragEndTime - dragStartTime;

    if (dragDuration < 200 && !isZoomLimitReached && e.touches.length === 0) {
        handleClick(e);
    }

    if (e.touches.length === 0) {
        isDragging = false;
    }
};

canvas.addEventListener("mousedown", onPointerDown);
canvas.addEventListener("mousemove", onPointerMove);
canvas.addEventListener("mouseup", onPointerUp);
canvas.addEventListener("mouseleave", onPointerUp);
canvas.addEventListener("wheel", onWheel, { passive: false });

canvas.addEventListener("touchstart", onTouchStart, { passive: false });
canvas.addEventListener("touchmove", onTouchMove, { passive: false });
canvas.addEventListener("touchend", onTouchEnd);