// mqttClient.js
import mqtt from 'https://esm.sh/mqtt@5.10.3';
import { config } from '../config.js';

const brokerUrl = 'wss://' + config.MQTT['brokerUrl+port'];
const options = {
    clientId: `mqttjs_${Math.random().toString(16).slice(2, 8)}`,
};

class MqttService {
    client;
    constructor() {
        this.client = mqtt.connect(brokerUrl, options);
        this.client.on('connect', () => {
            console.log('Connected to MQTT broker');
        });
        this.client.on('message', (topic, message) => {
            this.receivedMessage(topic, message);
        });
    }

    onReceivedMessage(topic, message) {

    }

    publishMessage(topic, message) {
        topic = config.MQTT.topicBase + topic;
        this.client.publish(topic, message, {}, (err) => {
            if (err) console.error('Publish error:', err);
            else console.log(`Message sent to ${topic}: ${message}`);
        });
    }

    subscribeToTopic(topic) {
        topic = config.MQTT.topicBase + topic;
        this.client.subscribe(topic, (err) => {
            if (err) console.error('Subscribe error:', err);
            else console.log(`Subscribed to topic: ${topic}`);
        });
    }

    unsubscribeFromTopic(topic) {
        topic = config.MQTT.topicBase + topic;
        this.client.unsubscribe(topic, (err) => {
            if (err) console.error('Unsubscribe error:', err);
            else console.log(`Unsubscribed from topic: ${topic}`);
        });
    }
}

var mqttService = new MqttService();
export { mqttService };
