import { resources } from "../system/Resource.js";
import { Sprite } from "../system/Sprite.js";
import { Vector2 } from "../system/Vector2.js";
import { Level } from "../objects/Level/Level.js";
import { gridCells } from "../helpers/grid.js";
import { Exit } from "../objects/Exit/Exit.js";
import { Hero } from "../objects/Hero/Hero.js";
import { Rod } from "../objects/Rod/Rod.js";
import { config } from "../config.js";
import { events } from "../system/Events.js";
import { OutdoorLevel1 } from "./OutdoorLevel1.js";

const DEFAULT_HERO_POSITION = new Vector2(gridCells(8), gridCells(4));

export class CaveLevel1 extends Level {
    constructor(params = {}) {
        super({});
        this.background = new Sprite({
            resource: resources.images.cave,
            frameSize: new Vector2(config.sizes.canvasWidth, config.sizes.canvasHeight),
        });

        const groundSprite = new Sprite({
            resource: resources.images.caveGround,
            frameSize: new Vector2(config.sizes.canvasWidth, config.sizes.canvasHeight),
        });
        this.addChild(groundSprite);

        const exit = new Exit(gridCells(3), gridCells(5));
        this.addChild(exit);

        const rod = new Rod(gridCells(7), gridCells(3));
        this.addChild(rod);

        this.heroStartPosition = params.heroPosition ?? DEFAULT_HERO_POSITION;
        const hero = new Hero(this.heroStartPosition.x, this.heroStartPosition.y, true);
        this.addChild(hero);

        // this.walls = new Set(); // this is already defined in the Level class
    }

    onInit() {
        events.on('HERO_EXITS', this, () => {
            events.emit('CHANGE_LEVEL', new OutdoorLevel1({
                heroPosition: new Vector2(gridCells(11), gridCells(6)),
            }));
        });
    }
}