// mqttClient.js
import { connect } from "mqtt";
import { events, EventTypes } from '../system/Events.js';
import { config } from '../config.js';

const brokerUrl = 'wss://' + config.MQTT['brokerUrl+port'];
const options = {
    clientId: `mqttjs_${Math.random().toString(16).slice(2, 8)}`,
};

const client = connect(brokerUrl, options);

client.on('connect', () => {
    console.log('Connected to MQTT broker');
});

client.on('message', (topic, message) => {
    console.log(`Received message: ${message.toString()} on topic: ${topic}`);
});

// Function to publish a message
export const publishMessage = (topic, message) => {
    topic = config.MQTT.topicBase + topic;
    client.publish(topic, message, {}, (err) => {
        if (err) console.error('Publish error:', err);
        else console.log(`Message sent to ${topic}: ${message}`);
    });
};

// Function to subscribe to a topic
export const subscribeToTopic = (topic) => {
    topic = config.MQTT.topicBase + topic;
    client.subscribe(topic, (err) => {
        if (err) console.error('Subscribe error:', err);
        else console.log(`Subscribed to topic: ${topic}`);
    });
};
subscribeToTopic('test');
publishMessage('test', 'Hello from MQTT service');

// Exporting client for direct use if needed
export default client;
