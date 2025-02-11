import { resources } from "../system/Resource.js";
import { Sprite } from "../system/Sprite.js";
import { Vector2 } from "../system/Vector2.js";
import { Level } from "../objects/Level/Level.js";
import { config } from "../config.js";
import { events, EventTypes } from "../system/Events.js";


export class Menu extends Level {
    menu;
    constructor(params = {}) {
        super({});
        this.background = new Sprite({
            resource: resources.images.sky,
            frameSize: new Vector2(config.sizes.BackgroundWidth, config.sizes.BackgroundHeight),
            scale: 8
        });
        this.menu = document.getElementById("homeMenu");
        this.menu.addEventListener("click", (e) => {


        });
        this.menu.style.display = "block";

    }

    onInit() {
    }

    destroy() {
        this.children.forEach(child => child.destroy());
        if (this.parent) {
            this.parent.removeChild(this);
        }
        this.menu.removeEventListener("click");
    }
}
