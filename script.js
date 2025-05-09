import { Vector2 } from "./src/system/Vector2.js";
import { GameLoop } from "./src/system/GameLoop.js";
import { Main } from "./src/objects/Main/Main.js";
import { Menu } from "./src/levels/Menu.js";
import { events, EventTypes } from "./src/system/Events.js";
import { Databank } from "./src/system/Databank.js";
import { PlayerGameLogic } from "./src/gameLogic/PlayerGameLogic.js"
import { IGameCommunicatorValidator } from "./src/gameLogic/IGameCommunicatorValidator.js"

let tempValidator = new IGameCommunicatorValidator();
tempValidator = null;

const canvas = document.querySelector("#game-canvas");
const ctx = canvas.getContext("2d");
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

    mainScene.drawObjects(ctx, 0, 0);
    ctx.restore();
    mainScene.drawForeground(ctx);
};

const gameLoop = new GameLoop(update, draw);
gameLoop.start();

