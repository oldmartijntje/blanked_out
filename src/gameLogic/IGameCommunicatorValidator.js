import { MqttGameCommunicator } from "./gameCommunicators/MqttGameCommunicator.js";


// this will be the class that either talks to a host via mqtt or talks to your local "server" that handels robot logic

function ensureImplements(object, methods, checkName) {
    for (let method of methods) {
        if (typeof object[method] !== 'function') {
            throw new Error(`Missing method in ${checkName}: ${method}`);
        }
    }
}

class IGameCommunicatorValidator {
    constructor() {
        let methodsNeeded = ['sendMessage', 'die']
        // we have to check it the scuffed way by checking all implementations
        // since we don't use typescript
        const mqttCheck = new MqttGameCommunicator();
        ensureImplements(mqttCheck, methodsNeeded, "MqttGameCommunicator");
    }
}

export { IGameCommunicatorValidator };