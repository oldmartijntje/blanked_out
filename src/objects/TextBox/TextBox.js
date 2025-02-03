import { resources } from '../../system/Resource.js';
import { Vector2 } from '../../system/Vector2.js';
import { GameObject } from '../../system/GameObject.js';
import { Sprite } from '../../system/Sprite.js';

export class TextBox extends GameObject {
    constructor() {
        super({
            position: new Vector2(32, 112)
        });
        this.content = "Hallo mijn naam is Gamemeneer en in Minecraft bouw ik boten.";
        this.backdrop = new Sprite({
            resource: resources.images.textBox,
            frameSize: new Vector2(256, 64),
        })
    }

    drawImage(ctx, drawPosX, drawPosY) {
        this.backdrop.drawImage(ctx, drawPosX, drawPosY);
        ctx.font = "10px fontRetroGaming";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillStyle = "#fff";

        const MAX_WIDTH = 250;
        const LINE_HEIGHT = 20;
        const PADDING_LEFT = 10;
        const PADDING_TOP = 12;

        let words = this.content.split(' ');
        let line = '';

        for (let n = 0; n < words.length; n++) {
            let testLine = line + words[n] + ' ';
            let metrics = ctx.measureText(testLine);
            let testWidth = metrics.width;

            if (testWidth > MAX_WIDTH && n > 0) {
                ctx.fillText(line, drawPosX + PADDING_LEFT, drawPosY + PADDING_TOP);
                line = words[n] + ' ';
                drawPosY += LINE_HEIGHT;
            } else {
                line = testLine;
            }

        }

        ctx.fillText(line, drawPosX + PADDING_LEFT, drawPosY + PADDING_TOP);
    }
}