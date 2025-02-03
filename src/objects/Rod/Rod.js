import { events } from "../../system/Events.js";
import { GameObject } from "../../system/GameObject.js";
import { resources } from "../../system/Resource.js";
import { Sprite } from "../../system/Sprite.js";
import { Vector2 } from "../../system/Vector2.js";
import { calculateMoveOnto } from "../../helpers/moveTowards.js";

export class Rod extends GameObject {
    constructor(x, y) {
        super({
            position: new Vector2(x, y),
        });
        this.position = new Vector2(x, y);
        const sprite = new Sprite({
            resource: resources.images.rod,
            position: new Vector2(0, -2),
        });
        this.addChild(sprite);
    }

    onInit() {
        events.on('HERO_POSITION', this, (value) => {
            if (calculateMoveOnto(this.position, value.position)) {
                this.onCollideWithHero();
            }
        });
    }


    onCollideWithHero() {
        events.emit('HERO_PICK_UP_ITEM', {
            position: this.position,
            image: resources.images.rod,
        });
        this.destroy();
    }
}