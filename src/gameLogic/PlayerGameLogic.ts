import { events, EventTypes } from "../system/Events.ts";
import { GameObject } from "../system/GameObject.ts"

class PlayerGameLogic extends GameObject {
    gameCommunicator = null;

    constructor() {
        super({});
    }

    killOldCommunicator() {
        if (this.gameCommunicator != null) {
            this.gameCommunicator.die();
        }
    }

    onInit() {

    }

    setupNewMqttCommunicator(mqttClient) {
        this.killOldCommunicator()

    }

    getGameCommunicator() {
        return this.gameCommunicator;
    }


}

export { PlayerGameLogic }