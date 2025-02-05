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
export const PLAYER_PICK_UP_ITEM = 'PLAYER_PICK_UP_ITEM';
export const CHANGE_SCENE = 'CHANGE_SCENE';
export const START_TEXT_BOX = 'START_TEXT_BOX';
export const END_TEXT_BOX = 'END_TEXT_BOX';
export const CAMERA_POSITION = 'CAMERA_POSITION';