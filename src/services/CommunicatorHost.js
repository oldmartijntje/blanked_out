import { events, EventTypes } from '../system/Events.js';
import { config } from '../config.js';
import { MqttService, CommunicationCodes } from './MqttService.js';

class CommunicatorHost extends MqttService {
    openLobbies = {};
    pingInterval;
    constructor() {
        super();
        console.log(this.creationIdentifier);
        this.pingInterval = setInterval(() => {
            console.log('Ping');
            this.publishMessage(config.MQTT["lobbyTopic"], JSON.stringify({
                Protocol: CommunicationCodes.I_AM_A_LOBBY,
                LobbyId: this.creationIdentifier,
                Username: this.username,
                playersConnected: 0,
                Settings: {}
            }));
        }, 5000);

    }

    onReceivedMessage(topic, message) {
        try {
            var parsed = JSON.parse(message);
        } catch (e) {
            console.log('Error parsing message:', e);
            return;
        }

    }

    resetMqtt() {
        this.client.end();
        clearInterval(this.pingInterval);
    }

}

export { CommunicatorHost };