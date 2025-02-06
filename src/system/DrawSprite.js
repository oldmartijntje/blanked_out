import { Vector2 } from "./Vector2.js";
import { config } from '../config.js';
import { Sprite } from "./Sprite.js";

export class DrawFigures {
    static CIRCLE = 'circle';
    static SQUARE = 'square';
    static TRIANGLE = 'triangle';
    static HEXAGON = 'hexagon';
    static PENTAGON = 'pentagon';
    static CUSTOM = 'custom';
}

export class DrawSprite extends Sprite {
    constructor({
        color,
        width,
        height,
        figure,
        position, // position of the sprite
        customShapeDrawingFunction
    }) {
        super({
            position: position ?? new Vector2(0, 0),
            resource: null,
        });
        this.color = color ?? 'orange';
        this.width = width ?? config.sizes.gridSize;
        this.height = height ?? config.sizes.gridSize;
        this.figure = figure ?? DrawFigures.SQUARE;
        this.customShapeDrawingFunction = customShapeDrawingFunction ?? null;

    }

    drawImage(ctx, x, y) {
        ctx.fillStyle = this.color;
        if (this.figure == DrawFigures.CUSTOM && this.customShapeDrawingFunction) {
            this.customShapeDrawingFunction(ctx, x, y);
        } else if (this.figure == DrawFigures.SQUARE) {
            ctx.fillRect(x, y, this.width, this.height);
        } else if (this.figure == DrawFigures.CIRCLE) {
            ctx.beginPath();
            ctx.arc(x + this.width / 2, y + this.width / 2, this.width / 2, 0, 2 * Math.PI);
            ctx.fill();
        } else if (this.figure == DrawFigures.TRIANGLE) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + this.width, y);
            ctx.lineTo(x + this.width / 2, y + this.height);
            ctx.fill();
        } else if (this.figure == DrawFigures.HEXAGON) {
            ctx.beginPath();
            ctx.moveTo(x + this.width / 4, y);
            ctx.lineTo(x + this.width * 3 / 4, y);
            ctx.lineTo(x + this.width, y + this.height / 2);
            ctx.lineTo(x + this.width * 3 / 4, y + this.height);
            ctx.lineTo(x + this.width / 4, y + this.height);
            ctx.lineTo(x, y + this.height / 2);
            ctx.fill();
        } else if (this.figure == DrawFigures.PENTAGON) {
            ctx.beginPath();
            ctx.moveTo(x + this.width / 2, y);
            ctx.lineTo(x + this.width, y + this.height * 2 / 5);
            ctx.lineTo(x + this.width * 3 / 4, y + this.height);
            ctx.lineTo(x + this.width / 4, y + this.height);
            ctx.lineTo(x, y + this.height * 2 / 5);
            ctx.fill();
        }

    }

}