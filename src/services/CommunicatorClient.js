import { events, EventTypes } from '../system/Events.js';
import { config } from '../config.js';
import { MqttService, CommunicationCodes } from './MqttService.js';

class CommunicatorClient extends MqttService {
    openLobbies = {};
    constructor() {
        super();
    }

    onReceivedMessage(topic, message) {
        try {
            var parsed = JSON.parse(message);
        } catch (e) {
            console.log('Error parsing message:', e);
            return;
        }
        if (parsed.Protocol == CommunicationCodes.I_AM_A_LOBBY) {
            this.openLobbies[parsed.LobbyId] = { date: new Date(), ...parsed };
            events.emit(EventTypes.LOBBY_FOUND, this.openLobbies);
        } else if (parsed.Protocol == CommunicationCodes.CONNECTION_REQUEST) {

        }
        console.log('Received message:', topic, parsed);
    }

    discoveryTopic(unsubscribe = false) {
        const topic = config.MQTT["lobbyTopic"];
        if (unsubscribe) {
            this.unsubscribeFromTopic(topic);
        } else {
            this.subscribeToTopic(topic);
        }

    }

    resetMqtt() {
        this.client.end();
    }

}

export { CommunicatorClient };