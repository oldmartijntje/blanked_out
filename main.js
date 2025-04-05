import { Vector2 } from "./src/system/Vector2.js";
import { GameLoop } from "./src/system/GameLoop.js";
import { Main } from "./src/objects/Main/Main.js";
import { Menu } from "./src/levels/Menu.js";
import { events, EventTypes } from "./src/system/Events.js";

const canvas = document.querySelector("#game-canvas");
const ctx = canvas.getContext("2d");

var MqttCommunicator = null;
events.on(EventTypes.SETUP_MQTT_CONNECTOR, this, (connector) => {
    if (MqttCommunicator) {
        MqttCommunicator.resetMqtt();
    }
    MqttCommunicator = connector;
}
);
events.on(EventTypes.CLOSE_MQTT_CONNECTOR, this, () => {
    MqttCommunicator.resetMqtt();
}
);

const mainScene = new Main({
    position: new Vector2(0, 0),
});
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

