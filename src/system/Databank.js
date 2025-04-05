import { events, EventTypes } from "./Events.js";
import { GameObject } from "./GameObject.js";

class Databank extends GameObject {
    data;
    timeSinceLastSave = 0;
    constructor() {
        super({});
        var string = localStorage.getItem('playerData');
        if (string) {
            try {
                this.data = JSON.parse(string);
            } catch (e) {
                console.error('Error parsing playerData:', e);
                this.data = {};
            }
        } else {
            this.data = {};
            localStorage.setItem('playerData', JSON.stringify(this.data));
        }
    }

    onInit() {
        events.on(EventTypes.SET_DEEP_DATA, this, (data) => {
            const path = data.key.split('.');
            const value = data.value;
            let current = this.data;
            try {
                for (let i = 0; i < path.length - 1; i++) {
                    if (!current[path[i]]) {
                        current[path[i]] = {};
                    }
                    current = current[path[i]];
                }
                current[path[path.length - 1]] = value;
                this.saveData();
            } catch (e) {
                console.error('Error setting data:', e);
                if (data.onError) {
                    data.onError();
                }
            }
        });
        events.on(EventTypes.GET_DEEP_DATA, this, (data) => {
            const path = data.key.split('.');
            let current = this.data;
            try {
                for (let i = 0; i < path.length; i++) {
                    current = current[path[i]];
                }
                if (data.onSuccess) {
                    data.onSuccess(current);
                }
            } catch (e) {
                console.error('Error getting data:', e);
                if (data.onError) {
                    data.onError();
                }
            }
        });
        events.on(EventTypes.SET_DATA, this, (data) => {
            this.data[data.key] = data.value;
            this.saveData();
        });
        events.on(EventTypes.GET_DATA, this, (data) => {
            if (this.data[data.key]) {
                data.onSuccess(this.data[data.key]);
            } else if (data.onError) {
                data.onError();
            }
        }
        );
    }


    step(delta) {
        this.timeSinceLastSave++;
        if (this.timeSinceLastSave > 1000) {
            this.saveData();
        }
    }

    saveData() {
        localStorage.setItem('playerData', JSON.stringify(this.data));
        this.timeSinceLastSave = 0;
    }

    addData(data) {
        this.data.push(data);
    }

    getData() {
        return this.data;
    }
}

export { Databank };