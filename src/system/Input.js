import { config } from '../config.js';
import { events, EventTypes } from './Events.js';

export const LEFT = 'LEFT';
export const RIGHT = 'RIGHT';
export const UP = 'UP';
export const DOWN = 'DOWN';
export const SPACE = 'Space';
export const ZOOM_MINUS = 'ZOOM_MINUS';
export const ZOOM_PLUS = 'ZOOM_PLUS';

const zoomSpeed = 0.05;
const MIN_SCALE = 0.5;
const MAX_SCALE = 3;

export const APP_KEYS = { // The KEY is the valuye that the program will use. The VALUE is the key that the user will press.
    UP: config.keys.upKeys,
    DOWN: config.keys.downKeys,
    LEFT: config.keys.leftKeys,
    RIGHT: config.keys.rightKeys,
    SPACE: [SPACE],
    ZOOM_MINUS: config.keys.zoomMinus,
    ZOOM_PLUS: config.keys.zoomPlus,
};
export const DIRECTIONS_KEYS = [LEFT, RIGHT, UP, DOWN, SPACE, ZOOM_MINUS, ZOOM_PLUS];
// all above has gotta go into a config file

export class Input {
    constructor() {
        this.heldDirections = [];
        this.keys = {};
        this.lastKeys = {};

        this.camera;
        this.canvas;
        this.isDragging = false;
        this.startX = 0, this.startY = 0;
        this.lastX = 0, this.lastY = 0;
        this.lastTouchDistance = 0;
        this.isZoomLimitReached = false;
        this.dragStartTime;

        document.addEventListener('keydown', (event) => {
            this.keys[event.code] = true;
            this.getDirection(event.code, true);
        });

        document.addEventListener('keyup', (event) => {
            this.keys[event.code] = false;
            this.getDirection(event.code, false);
        });
        document.addEventListener('DOMContentLoaded', () => {
            for (const direction of Object.keys(APP_KEYS)) {
                for (const key of APP_KEYS[direction]) {
                    const buttons = document.querySelectorAll(`.${key}.gameController`);
                    for (const button of buttons) {
                        button.addEventListener('mousedown', () => {
                            if (DIRECTIONS_KEYS.includes(direction)) {
                                this.onKeyPressed(direction);
                            }
                            this.keys[key] = true;
                        });
                        button.addEventListener('mouseup', () => {
                            if (DIRECTIONS_KEYS.includes(direction)) {
                                this.onKeyReleased(direction);
                            }
                            this.keys[key] = false;
                        });
                        button.addEventListener('touchstart', (event) => {
                            event.preventDefault(); // Prevent default touch behavior
                            if (DIRECTIONS_KEYS.includes(direction)) {
                                this.onKeyPressed(direction);
                            }
                            this.keys[key] = true;
                        });
                        button.addEventListener('touchend', (event) => {
                            event.preventDefault(); // Prevent default touch behavior
                            if (DIRECTIONS_KEYS.includes(direction)) {
                                this.onKeyReleased(direction);
                            }
                            this.keys[key] = false;
                        });
                    }
                }
            }
        });
    }

    get direction() {
        return this.heldDirections[0];
    }

    getDirection(eventCode, pressed) {
        for (const direction of Object.keys(APP_KEYS)) {
            if (APP_KEYS[direction].includes(eventCode)) {
                if (DIRECTIONS_KEYS.includes(direction)) {
                    if (pressed) {
                        this.onKeyPressed(direction);
                    } else {
                        this.onKeyReleased(direction);
                    }
                }
            }
        }
    }

    update() {
        // Diff the keys to get the keys that were pressed since the last update
        this.lastKeys = { ...this.keys };
        if (this.heldDirections.length > 0) {
            if ((this.heldDirections[0] === ZOOM_MINUS || this.heldDirections[0] === ZOOM_PLUS) && this.camera) {
                if (this.heldDirections[0] === ZOOM_MINUS && this.camera.zoom > MIN_SCALE) {
                    this.camera.zoom -= zoomSpeed / 2;
                } else if (this.heldDirections[0] === ZOOM_PLUS && this.camera.zoom < MAX_SCALE) {
                    this.camera.zoom += zoomSpeed / 2;
                }
            }
        }
    }

    getActionJustPressed(keyCode) {
        let justPressed = false;
        if (this.keys[keyCode] && !this.lastKeys[keyCode]) {
            justPressed = true;
        }
        return justPressed;
    }

    onKeyPressed(direction) {
        if (!this.heldDirections.includes(direction)) {
            this.heldDirections.unshift(direction);
        }
    }

    onKeyReleased(direction) {
        const index = this.heldDirections.indexOf(direction);
        if (index > -1) {
            this.heldDirections.splice(index, 1);
        }
    }

    onPointerDown(event) {
        this.isDragging = true;
        if (event.touches) {
            this.lastX = event.touches[0].clientX;
            this.lastY = event.touches[0].clientY;
        } else {
            this.lastX = event.clientX;
            this.lastY = event.clientY;
        }
        this.dragStartTime = new Date().getTime();
    };

    onPointerMove(event, camera) {
        if (!this.isDragging) return;

        let currentX, currentY;
        if (event.touches) {
            currentX = event.touches[0].clientX;
            currentY = event.touches[0].clientY;
        } else {
            currentX = event.clientX;
            currentY = event.clientY;
        }

        const dx = (currentX - this.lastX) / camera.zoom;
        const dy = (currentY - this.lastY) / camera.zoom;

        camera.position.x += dx;
        camera.position.y += dy;

        this.lastX = currentX;
        this.lastY = currentY;
    };

    onPointerUp(e, camera) {
        const dragEndTime = new Date().getTime();
        const dragDuration = dragEndTime - this.dragStartTime;

        if (dragDuration < 200 && !this.isZoomLimitReached) {
            this.handleClick(e, camera);
        }
        this.isDragging = false;
    };

    onWheel(event, camera) {
        event.preventDefault();
        const zoomFactor = event.deltaY < 0 ? (1 + zoomSpeed) : (1 - zoomSpeed);
        camera.zoom *= zoomFactor;
        camera.zoom = Math.max(MIN_SCALE, Math.min(MAX_SCALE, camera.zoom));
    };

    // Improved touch zoom handling
    onTouchStart(event) {
        if (event.touches.length === 2) {
            event.preventDefault();
            const touch1 = event.touches[0];
            const touch2 = event.touches[1];
            this.lastTouchDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
        } else if (event.touches.length === 1) {
            this.isDragging = true;
            this.lastX = event.touches[0].clientX;
            this.lastY = event.touches[0].clientY;
            this.dragStartTime = new Date().getTime();
        }
    };

    onTouchMove(event, camera) {
        if (event.touches.length === 2) {
            event.preventDefault();
            const touch1 = event.touches[0];
            const touch2 = event.touches[1];
            const currentTouchDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);

            if (this.lastTouchDistance > 0) {
                const zoomFactor = currentTouchDistance / this.lastTouchDistance;
                const newScale = camera.zoom * zoomFactor;

                if (newScale >= MIN_SCALE && newScale <= MAX_SCALE) {
                    // Calculate zoom center point (midpoint between touches)
                    const rect = canvas.getBoundingClientRect();
                    const centerX = ((touch1.clientX + touch2.clientX) / 2);
                    const centerY = ((touch1.clientY + touch2.clientY) / 2);

                    // Convert center point to world coordinates before scaling
                    const worldCenterX = (centerX - canvas.width / 2) / camera.zoom + camera.position.x;
                    const worldCenterY = (centerY - canvas.height / 2) / camera.zoom + camera.position.y;

                    // Apply new scale
                    camera.zoom = newScale;

                    // Adjust camera position to keep zoom centered
                    const newWorldCenterX = (centerX - canvas.width / 2) / camera.zoom + camera.position.x;
                    const newWorldCenterY = (centerY - canvas.height / 2) / camera.zoom + camera.position.y;

                    camera.position.x += worldCenterX - newWorldCenterX;
                    camera.position.y += worldCenterY - newWorldCenterY;
                }
            }

            this.lastTouchDistance = currentTouchDistance;
        } else if (event.touches.length === 1 && this.isDragging) {
            const currentX = event.touches[0].clientX;
            const currentY = event.touches[0].clientY;

            const dx = (currentX - this.lastX) / camera.zoom;
            const dy = (currentY - this.lastY) / camera.zoom;

            camera.position.x += dx;
            camera.position.y += dy;

            this.lastX = currentX;
            this.lastY = currentY;
        }
    };

    onTouchEnd(e, camera) {
        if (e.touches.length < 2) {
            this.lastTouchDistance = 0;
            this.isZoomLimitReached = false;
        }

        const dragEndTime = new Date().getTime();
        const dragDuration = dragEndTime - this.dragStartTime;

        if (dragDuration < 200 && !this.isZoomLimitReached && e.touches.length === 0) {
            this.handleClick(e, camera);
        }

        if (e.touches.length === 0) {
            this.isDragging = false;
        }
    };

    handleClick(e, camera, eventType = EventTypes.USER_CLICK_CANVAS) {
        if (!this.canvas) return;
        const rect = this.canvas.getBoundingClientRect();
        const screenX = (e.clientX || e.touches[0].clientX) - rect.left;
        const screenY = (e.clientY || e.touches[0].clientY) - rect.top;

        // Convert screen coordinates to world coordinates
        const worldX = (screenX - this.canvas.width / 2) / camera.zoom - camera.position.x;
        const worldY = (screenY - this.canvas.height / 2) / camera.zoom - camera.position.y;

        events.emit(eventType, { x: worldX, y: worldY });
    };

    registerMouseMovement(canvas, camera) {
        this.canvas = canvas;
        this.camera = camera;
        canvas.addEventListener("mousedown", (event) => { this.onPointerDown(event) });
        canvas.addEventListener("mousemove", (event) => { this.onPointerMove(event, camera) });
        canvas.addEventListener("mouseup", (event) => { this.onPointerUp(event, camera) });
        canvas.addEventListener("mouseleave", (event) => { this.onPointerUp(event, camera) });
        canvas.addEventListener("dblclick", (event) => { this.handleClick(event, camera, EventTypes.USER_DOUBLE_CLICK_CANVAS) });
        canvas.addEventListener("wheel", (event) => { this.onWheel(event, camera) }, { passive: false });

        canvas.addEventListener("touchstart", (event) => { this.onTouchStart(event) }, { passive: false });
        canvas.addEventListener("touchmove", (event) => { this.onTouchMove(event, camera) }, { passive: false });
        canvas.addEventListener("touchend", (event) => { this.onTouchEnd(event, camera) });
    }
}