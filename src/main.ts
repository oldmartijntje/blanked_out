import { Vector2 } from "./system/Vector2.js";
import { GameLoop } from "./system/GameLoop.js";
import { Main } from "./objects/Main/Main.js";
import { Menu } from "./levels/Menu.js";
import { events, EventTypes } from "./system/Events.js";
import { Databank } from "./system/Databank.js";
import { PlayerGameLogic } from "./gameLogic/PlayerGameLogic.js"
import { IGameCommunicatorValidator } from "./gameLogic/IGameCommunicatorValidator.js"

let tempValidator: IGameCommunicatorValidator | null = new IGameCommunicatorValidator();
tempValidator = null;

const canvas = document.querySelector("#game-canvas");
if (canvas == null) {
    throw Error("canvas is null");
}
if (canvas instanceof HTMLCanvasElement) {
} else {
    throw Error("canvas is not canvastype");
}
const ctx = canvas.getContext("2d");
if (ctx == null) {
    throw Error("ctx is null");
}
const databank = new Databank();

let playerGameLogic = new PlayerGameLogic();
events.on(EventTypes.SETUP_MQTT_CONNECTOR, this, (connector) => {
    playerGameLogic.setupNewMqttCommunicator(connector);
}
);
events.on(EventTypes.CLOSE_MQTT_CONNECTOR, this, () => {
}
);

const mainScene = new Main({
    position: new Vector2(0, 0),
});
mainScene.addChild(databank);
mainScene.setLevel(new Menu());
mainScene.registerMouseMovement(canvas);

const update = (deltaTime) => {
    mainScene.stepEntry(deltaTime, mainScene);
    mainScene.input?.update();
};

const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    mainScene.drawBackground(ctx);

    ctx.save();

    if (mainScene.camera) {
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(mainScene.camera.zoom, mainScene.camera.zoom);
        ctx.translate(-canvas.width / 2 + mainScene.camera.position.x, -canvas.height / 2 + mainScene.camera.position.y);
    }

    mainScene.drawObjects(ctx);
    ctx.restore();
    mainScene.drawForeground(ctx);
};

const gameLoop = new GameLoop(update, draw);
gameLoop.start();

