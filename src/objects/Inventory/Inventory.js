import { events } from "../../system/Events.js";
import { GameObject } from "../../system/GameObject.js";
import { resources } from "../../system/Resource.js";
import { Sprite } from "../../system/Sprite.js";
import { Vector2 } from "../../system/Vector2.js";

export class Inventory extends GameObject {
    constructor() {
        super({
            position: new Vector2(0, 1),
        });
        this.items = [

        ]
        this.drawLayer = "HUD";
        this.nextId = 0;

        this.renderInventory();
    }

    renderInventory() {
        this.children.forEach(child => child.destroy());

        this.items.forEach((item, index) => {
            const sprite = new Sprite({
                resource: item.image,
                position: new Vector2(index * 12, 0),
            });
            this.addChild(sprite);
        });
    }

    removeFromInventory(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.renderInventory();
    }

    onInit() {
        events.on('HERO_PICK_UP_ITEM', this, (value) => { // move to OnInit
            this.items.push({
                id: this.nextId++,
                image: value.image,
            });
            console.log(this.items);
            this.renderInventory();
        });
    }


}