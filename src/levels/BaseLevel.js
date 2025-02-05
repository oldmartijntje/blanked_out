import { resources } from "../system/Resource.js";
import { Sprite } from "../system/Sprite.js";
import { Vector2 } from "../system/Vector2.js";
import { Level } from "../objects/Level/Level.js";
import { gridCells } from "../helpers/grid.js";
import { config } from "../config.js";
import { events } from "../system/Events.js";
import { TALKED_TO_A, TALKED_TO_B } from "../system/StoryFlags.js";

const DEFAULT_HERO_POSITION = new Vector2(gridCells(10), gridCells(4));

export class BaseLevel extends Level {
    constructor(params = {}) {
        super({});
        this.background = new Sprite({
            resource: resources.images.sky,
            frameSize: new Vector2(config.sizes.canvasWidth, config.sizes.canvasHeight),
        });

        const groundSprite = new Sprite({
            resource: resources.images.ground,
            frameSize: new Vector2(config.sizes.canvasWidth, config.sizes.canvasHeight),
        });

        this.addChild(groundSprite);


        // this.walls = new Set(); // this is already defined in the Level class
        this.walls.add(`64,48`); // tree
        this.walls.add(`64,64`); // squares
        this.walls.add(`64,80`);
        this.walls.add(`80,64`);
        this.walls.add(`80,80`);
        this.walls.add(`112,80`); // water
        this.walls.add(`128,80`);
        this.walls.add(`144,80`);
        this.walls.add(`160,80`);
    }

    onInit() {
        events.on('HERO_EXITS', this, () => {
            events.emit('CHANGE_LEVEL', new CaveLevel1({
                heroPosition: new Vector2(gridCells(4), gridCells(5)),
            }));
        });
    }
}
