import { config } from '../config.js';

export const LEFT = 'LEFT';
export const RIGHT = 'RIGHT';
export const UP = 'UP';
export const DOWN = 'DOWN';
export const SPACE = 'Space';

export const APP_KEYS = { // The KEY is the valuye that the program will use. The VALUE is the key that the user will press.
    UP: config.keys.upKeys,
    DOWN: config.keys.downKeys,
    LEFT: config.keys.leftKeys,
    RIGHT: config.keys.rightKeys,
    SPACE: [SPACE],
};
export const DIRECTIONS_KEYS = [LEFT, RIGHT, UP, DOWN];
// all above has gotta go into a config file

export class Input {
    constructor() {
        this.heldDirections = [];
        this.keys = {};
        this.lastKeys = {};

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
}