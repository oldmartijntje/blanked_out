import { config } from '../config.ts';
import { CommunicatorClient } from './CommunicatorClient.ts';
import { CommunicatorHost } from './CommunicatorHost.ts';
import { MqttService, CommunicationCodes } from './MqttService.ts';

class CommunicationHostClient {
    _host = null;
    _client = null;
    constructor(initialise = true) {
        if (initialise) {
            this._host = new CommunicatorHost();
            this._client = new CommunicatorClient();
        }
    }

    getHost() {
        return this._host;
    }

    getClient() {
        return this._client;
    }

    setHost(host) {
        this._host = host;
    }

    setClient(client) {
        this._client = client;
    }

    linkHostClient() {
        this._host.setClientHostConnection(this._client, (hostClientLinkingResult) => {
            if (hostClientLinkingResult.connected) {
                this._client.setClientHostConnection(this._host);
                return true;
            } else {
                return false;
            }
        });

    }
}