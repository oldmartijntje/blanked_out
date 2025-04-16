import { resources } from "../system/Resource.ts";
import { Sprite } from "../system/Sprite.ts";
import { Vector2 } from "../system/Vector2.ts";
import { Level } from "../objects/Level/Level.ts";
import { gridCells } from "../helpers/grid.ts";
import { config } from "../config.ts";
import { events } from "../system/Events.ts";
import { DrawSprite, DrawFigures } from "../system/DrawSprite.ts";



const squareChessBoard = {};
for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
        squareChessBoard[`${i}-${j}`] = {
            x: i,
            y: j,
            color: (i + j) % 2 === 0 ? 'white' : 'black',
            occupied: false
        }
    }
}
console.log(squareChessBoard)

export class BaseLevel extends Level {
    constructor(params = {}) {
        super({});
        this.background = new Sprite({
            resource: resources.images.sky,
            frameSize: new Vector2(config.sizes.BackgroundWidth, config.sizes.BackgroundHeight),
            scale: 8
        });

        const groundSprite = new Sprite({
            resource: resources.images.ground,
            frameSize: new Vector2(config.sizes.BackgroundWidth, config.sizes.BackgroundHeight),
            scale: 4
        });

        const testDrawing1 = new DrawSprite({
            color: 'blue',
            width: 64,
            height: 64,
            figure: DrawFigures.SQUARE,
            position: new Vector2(0, 0)
        });
        const testDrawing2 = new DrawSprite({
            color: 'red',
            width: 64,
            height: 64,
            figure: DrawFigures.CIRCLE,
            position: new Vector2(64, 0)
        });
        const testDrawing3 = new DrawSprite({
            color: 'green',
            width: 64,
            height: 64,
            figure: DrawFigures.TRIANGLE,
            position: new Vector2(128, 0)
        });
        const testDrawing4 = new DrawSprite({
            color: 'yellow',
            width: 64,
            height: 64,
            figure: DrawFigures.HEXAGON,
            position: new Vector2(192, 0)
        });
        const testDrawing5 = new DrawSprite({
            color: 'black',
            width: 64,
            height: 64,
            figure: DrawFigures.PENTAGON,
            position: new Vector2(256, 0)
        });
        const testDrawing6 = new DrawSprite({
            figure: DrawFigures.CUSTOM,
            position: new Vector2(0, 64),
            customShapeDrawingFunction: (ctx, x, y) => {
                ctx.beginPath();
                ctx.moveTo(x + 32, y);
                ctx.lineTo(x + 64, y + 64);
                ctx.lineTo(x, y + 640);
                ctx.fill();
            }
        });




        this.addChild(groundSprite);
        this.addChild(testDrawing1);
        this.addChild(testDrawing2);
        this.addChild(testDrawing3);
        this.addChild(testDrawing4);
        this.addChild(testDrawing5);
        this.addChild(testDrawing6);

    }

    onInit() {
    }
}
