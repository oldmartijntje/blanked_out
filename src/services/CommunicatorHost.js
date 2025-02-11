import { events, EventTypes } from '../system/Events.js';
import { config } from '../config.js';
import { MqttService } from './MqttService.js';

class CommunicationCodes {
    static I_AM_A_LOBBY = 'Stone Age';
    static CONNECTION_REQUEST = 'Getting an Upgrade';
}

class CommunicatorHost extends MqttService {
    openLobbies = {};
    constructor() {
        super();
        console.log(this.creationIdentifier);
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
            events.emit(EventTypes.LOBBY_FOUND, openLobbies);
        } else if (parsed.Protocol == CommunicationCodes.CONNECTION_REQUEST) {

        }
    }

    discoveryTopic(unsubscribe = false) {
        const topic = config.MQTT["lobbyTopic"];
        if (unsubscribe) {
            this.unsubscribeFromTopic(topic);
        } else {
            this.subscribeToTopic(topic);
        }

    }

}

export { CommunicatorHost };