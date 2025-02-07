import { events, EventTypes } from "./Events.js";
import { GameObject } from "./GameObject.js";
import { Vector2 } from "./Vector2.js";

export class Camera extends GameObject {
    zoom = 1;
    constructor() {
        super({});
        this.zoom = 0.5;
        this.offset = new Vector2(0, 0);
        this.onInit();
    }

    onInit() {
        events.on(EventTypes.CAMERA_POSITION, this, (value) => {
            if (value.focus) {
                this.centerPositionOnTarget(value.position);
            }
        });

        events.on(EventTypes.CHANGE_SCENE, this, (newMap) => {
            this.centerPositionOnTarget(newMap.heroStartPosition);
        });
    }

    centerPositionOnTarget(position) {
        // create a camera offset
        const personHalf = 8;
        const canvasWidth = 1280;
        const canvasHeight = 1280;
        const halfWidth = -personHalf + canvasWidth / 2;
        const halfHeight = -personHalf + canvasHeight / 2;
        this.position = new Vector2(-position.x + halfWidth, -position.y + halfHeight);
    }
}