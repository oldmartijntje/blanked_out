import { events } from "../../system/Events.js";
import { GameObject } from "../../system/GameObject.js";
import { resources } from "../../system/Resource.js";
import { Sprite } from "../../system/Sprite.js";
import { Vector2 } from "../../system/Vector2.js";
import { getCharacterFrame, getCharacterWidth } from "./spriteFontMap.js";

// Settings for the font
const FONT_CHARACTER_OFFSET = 4; // every letter has 5 pixels of offset to the left in the sprite sheet
const FONT_CHARACTER_SPACE_BETWEEN = 1;
const FONT_WORD_SPACE_BETWEEN = 3;

// Settings for the text animation calculation
const TEXTSPEED = 20; // the speed of the ticks, lower is faster
const CURRENT_SHOWING_INCREMENT = 1; // amount fo showing indexes needed per character
const SHOWING_INDEX_INCREMENT = 1; // the increase in the showing index per tick

export class SpriteTextString extends GameObject {
    constructor(config = {}) {
        super({
            position: new Vector2(32, 108)
        });
        this.drawLayer = "HUD"

        const content = config.string ?? "Default Text";

        this.words = content.split(' ').map(word => {

            // Calculate the width of the word
            let wordWidth = 0;
            const chars = word.split('').map(char => {
                const charWidth = getCharacterWidth(char);
                wordWidth += charWidth;
                return {
                    width: charWidth,
                    sprite: new Sprite({
                        resource: resources.images.fontWhite,
                        hFrames: 13,
                        vFrames: 6,
                        frame: getCharacterFrame(char),
                    }),
                }
            });
            return {
                wordWidth,
                chars
            }
        });

        // Text box backdrop
        this.backdrop = new Sprite({
            resource: resources.images.textBox,
            frameSize: new Vector2(256, 64),
        })

        if (config.portraitFrame !== null && config.portraitFrame !== undefined) {
            this.portrait = new Sprite({
                resource: resources.images.portraits,
                hFrames: 4,
                vFrames: 1,
                frame: config.portraitFrame ?? 0,
            });
        } else {
            this.portrait = null;
        }

        // Text animation
        this.showingIndex = 0;
        this.finalIndex = this.words.reduce((acc, word) => {
            return acc + word.chars.length;
        }, 0);
        this.textSpeed = TEXTSPEED;
        this.timeUntilNextShow = this.textSpeed;
    }

    step(_deltaTime, root) {

        /** @type {Input} */
        const input = root.input;
        if (input?.getActionJustPressed('Space')) {
            if (this.showingIndex < this.finalIndex) {
                this.showingIndex = this.finalIndex;
                return;
            }
            events.emit('END_TEXT_BOX');

        }

        this.timeUntilNextShow -= _deltaTime;
        if (this.timeUntilNextShow <= 0) {
            this.showingIndex += SHOWING_INDEX_INCREMENT;
            this.timeUntilNextShow += this.textSpeed;
        }
    }

    drawImage(ctx, drawPosX, drawPosY) {
        this.backdrop.drawImage(ctx, drawPosX, drawPosY);

        const PORTRAIT_PADDING_LEFT = 6;
        const PORTRAIT_PADDING_TOP = 6;

        if (this.portrait) {
            this.portrait.drawImage(ctx, drawPosX + PORTRAIT_PADDING_LEFT, drawPosY + PORTRAIT_PADDING_TOP);
        }

        const PADDING_LEFT = 7;
        const PADDING_TOP = 7;
        const LINE_WIDTH_MAX = 240;
        const LINE_VERTICAL_HEIGHT = 14;
        const PADDING_LEFT_PORTRAIT_ADDITION = 18;
        const PADDING_TOP_PORTRAIT_ADDITION = 2;

        let totalPaddingLeft = PADDING_LEFT;
        let totalPaddingTop = PADDING_TOP;
        if (this.portrait) {
            totalPaddingLeft += PADDING_LEFT_PORTRAIT_ADDITION;
            totalPaddingTop += PADDING_TOP_PORTRAIT_ADDITION;
        }

        let cursorX = drawPosX + totalPaddingLeft;
        let cursorY = drawPosY + totalPaddingTop;
        let currentShowingIndex = 0;

        this.words.forEach(word => {

            // check if the word fits on the line
            const spaceRemaining = drawPosX + LINE_WIDTH_MAX - cursorX;
            if (spaceRemaining < word.wordWidth) {
                cursorX = drawPosX + totalPaddingLeft;
                cursorY += LINE_VERTICAL_HEIGHT;
            }

            // draw the word
            word.chars.forEach(char => {

                if (currentShowingIndex > this.showingIndex) {
                    return;
                }
                const { sprite, width } = char;

                const widthCharOffset = cursorX - FONT_CHARACTER_OFFSET;
                sprite.draw(ctx, widthCharOffset, cursorY);

                cursorX += width + FONT_CHARACTER_SPACE_BETWEEN;

                currentShowingIndex += CURRENT_SHOWING_INCREMENT;
            });

            cursorX += FONT_WORD_SPACE_BETWEEN;

        });


    }
}