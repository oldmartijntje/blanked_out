class Events {
    callbacks = [];
    nextId = 0;

    emit(eventName, value) {
        this.callbacks.forEach(stored => {
            if (stored.eventName === eventName) {
                stored.callback(value);
            }

        })
    }

    on(eventName, caller, callback) {
        this.nextId++;
        this.callbacks.push({
            id: this.nextId,
            eventName: eventName,
            caller: caller,
            callback: callback
        });
        return this.nextId;
    }

    off(id) {
        this.callbacks = this.callbacks.filter(stored => stored.id !== id);
    }

    unsubscribe(caller) {
        this.callbacks = this.callbacks.filter(stored => stored.caller !== caller);
    }
}

export const events = new Events();

export class EventTypes {
    static PLAYER_PICK_UP_ITEM = 'PLAYER_PICK_UP_ITEM';
    static CHANGE_SCENE = 'CHANGE_SCENE';
    static START_TEXT_BOX = 'START_TEXT_BOX';
    static END_TEXT_BOX = 'END_TEXT_BOX';
    static CAMERA_POSITION = 'CAMERA_POSITION';
    static DO_ACTION_ON_COORDINATE = 'DO_ACTION_ON_COORDINATE';
    static USER_CLICK_CANVAS = 'USER_CLICK_CANVAS';
    static USER_DOUBLE_CLICK_CANVAS = 'USER_DOUBLE_CLICK_CANVAS';
    static LOBBY_FOUND = 'LOBBY_FOUND';
    static SETUP_MQTT_CONNECTOR = 'SETUP_MQTT_CONNECTOR';
    static CLOSE_MQTT_CONNECTOR = 'CLOSE_MQTT_CONNECTOR';
}