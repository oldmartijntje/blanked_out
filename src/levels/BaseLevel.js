import { resources } from "../system/Resource.js";
import { Sprite } from "../system/Sprite.js";
import { Vector2 } from "../system/Vector2.js";
import { Level } from "../objects/Level/Level.js";
import { gridCells } from "../helpers/grid.js";
import { config } from "../config.js";
import { events } from "../system/Events.js";

export class BaseLevel extends Level {
    constructor(params = {}) {
        super({});
        this.background = new Sprite({
            resource: resources.images.sky,
            frameSize: new Vector2(config.sizes.canvasWidth, config.sizes.canvasHeight),
            scale: 8
        });

        const groundSprite = new Sprite({
            resource: resources.images.ground,
            frameSize: new Vector2(config.sizes.canvasWidth, config.sizes.canvasHeight),
            scale: 4
        });

        this.addChild(groundSprite);

    }

    onInit() {
    }
}
