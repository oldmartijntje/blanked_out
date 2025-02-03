import { Animations } from "../../system/Animations.js";
import { FrameIndexPattern } from "../../system/FrameIndexPattern.js";
import { GameObject } from "../../system/GameObject.js";
import { resources } from "../../system/Resource.js";
import { Sprite } from "../../system/Sprite.js";
import { Vector2 } from "../../system/Vector2.js";

/**
 * @class Entity
 * @description Represents an entity in the game world.
 * @extends GameObject
 * @exports Entity
 */
export class Entity extends GameObject {

    /**
     * @constructor
     * @param {Vector2} position - Entity position.
     * @param {Sprite} body - Entity body.
     */
    constructor({
        position,
        body,
        speed = null,
    }) {
        super({
            position: position
        });

        this.movementSpeed = speed;

        const shadow = new Sprite({
            resource: resources.images.shadow,
            position: new Vector2(-8, -19),
            frameSize: new Vector2(32, 32),
        });
        this.addChild(shadow);

        this.body = body;

        this.addChild(this.body);
    }
}