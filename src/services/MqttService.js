// mqttClient.js
import mqtt from 'https://esm.sh/mqtt@5.10.3';
import { config } from '../config.js';

const brokerUrl = 'wss://' + config.MQTT['brokerUrl+port'];

class MqttService {
    deviceIdentifier;
    ALPHANUMERIC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    client;
    creationIdentifier = this.getRandomIdentifier(8);
    constructor() {
        var string = localStorage.getItem('deviceIdentifier');
        if (string) {
            this.deviceIdentifier = string;
        } else {
            this.deviceIdentifier = this.getRandomIdentifier(32);
            localStorage.setItem('deviceIdentifier', this.deviceIdentifier);
        }

        this.client = mqtt.connect(brokerUrl);
        this.client.on('connect', () => {
            console.log('Connected to MQTT broker');
        });
        this.client.on('message', (topic, message) => {
            this.receivedMessage(topic, message);
        });
    }

    onReceivedMessage(topic, message) {

    }


    getRandomIdentifier(length = 8) {
        return Array.from({ length }, () => this.ALPHANUMERIC[Math.floor(Math.random() * this.ALPHANUMERIC.length)]).join('');
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

    resetMqtt() {

    }
}
export { MqttService };
