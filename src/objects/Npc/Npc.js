import { GameObject } from "../../system/GameObject.js";
import { Vector2 } from "../../system/Vector2.js";
import { Sprite } from "../../system/Sprite.js";
import { resources } from '../../system/Resource.js';
import { storyFlags } from "../../system/StoryFlags.js";
import { Entity } from "../Entity/Entity.js";

/**
 * @class Npc
 * @description Represents an NPC in the game world.
 * @extends Entity
 * @exports Npc
 */
export class Npc extends Entity {

    /**
     * @constructor
     * @param {number} x - Npc x position. (in pixels)
     * @param {number} y - Npc y position. (in pixels)
     * @param {object} textConfig - Configuration for the text that the NPC will display.
     */
    constructor(x, y, textConfig = {}) {

        const body = new Sprite({
            resource: resources.images.knight,
            frameSize: new Vector2(32, 32),
            hFrames: 2,
            vFrames: 1,
            position: new Vector2(-8, -20)
        })

        super({
            position: new Vector2(x, y),
            body: body,
            speed: null
        });

        this.isSolid = true;

        this.textContent = textConfig.content ?? "Default Text";
        this.textPortraitFrame = textConfig.portraitFrame ?? null;
    }

    getContent() {
        const match = storyFlags.getRelevantScenario(this.textContent);
        if (!match) {
            console.warn("No match found for this scenario", this.textContent);
            return null; // No match, might want to return a default text
        }
        portraitFrame = this.textPortraitFrame;
        if (match.portraitFrame != undefined) {
            // If the scenario has an override for the portrait frame, use that.
            var portraitFrame = match.portraitFrame;
        }
        return {
            string: match.string,
            portraitFrame: portraitFrame,
            addsFlags: match.addsFlags ?? null,
            removesFlags: match.removesFlags ?? null,
        }
    }
}