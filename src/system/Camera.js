import { events } from "./Events.js";
import { GameObject } from "./GameObject.js";
import { Vector2 } from "./Vector2.js";

export class Camera extends GameObject {
    constructor() {
        super({});
        this.offset = new Vector2(0, 0);
        this.onInit();
    }

    onInit() {
        events.on('HERO_POSITION', this, (value) => {
            if (value.focus) {
                this.centerPositionOnTarget(value.position);
            }
        });

        events.on('CHANGE_LEVEL', this, (newMap) => {
            this.centerPositionOnTarget(newMap.heroStartPosition);
        });
    }

    centerPositionOnTarget(position) {
        // create a camera offset
        const personHalf = 8;
        const canvasWidth = 320;
        const canvasHeight = 180;
        const halfWidth = -personHalf + canvasWidth / 2;
        const halfHeight = -personHalf + canvasHeight / 2;
        this.position = new Vector2(-position.x + halfWidth, -position.y + halfHeight);
    }
}