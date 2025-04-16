import { Camera } from "../../system/Camera.ts";
import { events, EventTypes } from "../../system/Events.ts";
import { GameObject } from "../../system/GameObject.ts";
import { Input } from "../../system/Input.ts";
import { storyFlags } from "../../system/StoryFlags.ts";
import { Inventory } from "../Inventory/Inventory.ts";
import { SpriteTextString } from "../SpriteTextString/SpriteTextString.ts";
import { TextBox } from "../TextBox/TextBox.ts";

const TEXT_SPRITE_SHEET = 'TEXT_SPRITE_SHEET';
const TEXT_TTF_FONT = 'TEXT_TTF_FONT';
const TEXT_MODE = TEXT_SPRITE_SHEET;

export class Main extends GameObject {
    constructor(settings) {
        super({});
        this.position = settings.position
        this.level = null;
        this.input = new Input();
        this.camera = new Camera();

    }

    onInit() {
        events.on(EventTypes.USER_CLICK_CANVAS, this, (position) => {
            console.log(position, 1);
        });
        events.on(EventTypes.USER_DOUBLE_CLICK_CANVAS, this, (position) => {
            console.log(position, 2);
        });
        const inventory = new Inventory();
        this.addChild(inventory);

        events.on(EventTypes.CHANGE_SCENE, this, newLevelInstance => {
            this.setLevel(newLevelInstance);
        });

        events.on(EventTypes.DO_ACTION_ON_COORDINATE, this, (withObject) => {
            if (typeof withObject.getContent === 'function') {
                const content = withObject.getContent();
                if (!content) {
                    return;
                }

                if (content.addsFlags) {
                    content.addsFlags.forEach(flag => {
                        storyFlags.add(flag);
                    });
                }
                if (content.removesFlags) {
                    content.removesFlags.forEach(flag => {
                        storyFlags.remove(flag);
                    });
                }
                const options = {
                    string: content.string,
                    portraitFrame: content.portraitFrame ?? null
                }
                let textBox = null;
                if (TEXT_MODE === TEXT_TTF_FONT) {
                    textBox = new TextBox();
                } else {
                    textBox = new SpriteTextString(options);
                }
                this.addChild(textBox);
                events.emit(EventTypes.START_TEXT_BOX);

                // Remove the text box when the player presses space
                const endingSub = events.on(EventTypes.END_TEXT_BOX, this, () => {
                    textBox.destroy();
                    events.off(endingSub);
                });
            }


        });
    }

    registerMouseMovement(canvas) {
        this.input.registerMouseMovement(canvas, this.camera);
    }

    setLevel(newLevelInstance) {
        if (this.level) {
            this.level.destroy();
        }
        this.level = newLevelInstance;
        this.addChild(this.level);
    }

    drawBackground(ctx) {
        this.level?.background.drawImage(ctx, 0, 0)
    }

    drawObjects(ctx) {
        this.children.forEach(child => {
            if (child.drawLayer !== "HUD") {
                child.draw(ctx, 0, 0);
            }
        });
    }

    drawForeground(ctx) {
        this.children.forEach(child => {
            if (child.drawLayer === "HUD") {
                child.draw(ctx, 0, 0);
            }
        });
    }
}