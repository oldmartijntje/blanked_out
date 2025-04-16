class MqttGameCommunicator {
    MqttCommunicator;
    constructor(MqttCommunicator) {
        this.MqttCommunicator = MqttCommunicator;
    }

    sendMessage() {

    }

    die() {
        MqttCommunicator.resetMqtt();
    }
}

export { MqttGameCommunicator }