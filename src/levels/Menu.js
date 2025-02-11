import { resources } from "../system/Resource.js";
import { Sprite } from "../system/Sprite.js";
import { Vector2 } from "../system/Vector2.js";
import { Level } from "../objects/Level/Level.js";
import { config } from "../config.js";
import { events, EventTypes } from "../system/Events.js";
import { CommunicatorClient } from "../services/CommunicatorClient.js";
import { CommunicatorHost } from "../services/CommunicatorHost.js";

export class Menu extends Level {
    menu;
    campaignButton;
    onlineButton;
    offlineButton;
    originalButton;
    homeModal;
    onlineMultiplayerModal;
    lobbiesFound;
    joinButton;
    hostButton;
    backButtons = [];
    joinModal;
    hostModal;
    usernameField;
    client;
    constructor(params = {}) {
        super({});
        this.background = new Sprite({
            resource: resources.images.sky,
            frameSize: new Vector2(config.sizes.BackgroundWidth, config.sizes.BackgroundHeight),
            scale: 8
        });
        this.menu = document.getElementById("homeMenu");
        this.menu.style.display = "block";
        this.campaignButton = document.getElementById("campaignButton");
        this.onlineButton = document.getElementById("onlineMultiplayerButton");
        this.offlineButton = document.getElementById("offlineMultiplayerButton");
        this.originalButton = document.getElementById("originalButton");
        this.onlineButton.addEventListener("click", () => { this.clickedButton("online") });
        this.offlineButton.addEventListener("click", () => { this.clickedButton("offline") });
        this.originalButton.addEventListener("click", () => { this.clickedButton("original") });
        this.campaignButton.addEventListener("click", () => { this.clickedButton("campaign") });
        this.homeModal = document.getElementById("homeModal");
        this.homeModal.style.display = "block";
        this.onlineMultiplayerModal = document.getElementById("onlineMultiplayerModal");
        this.onlineMultiplayerModal.style.display = "none";
        this.lobbiesFound = document.getElementById("lobbiesFound");
        this.joinButton = document.getElementById("joinButton");
        this.hostButton = document.getElementById("hostButton");
        this.joinButton.addEventListener("click", () => { this.clickedButton("join") });
        this.hostButton.addEventListener("click", () => { this.clickedButton("host") });
        this.backButtons = document.getElementsByClassName("backButton");
        for (let i = 0; i < this.backButtons.length; i++) {
            this.backButtons[i].addEventListener("click", () => { this.clickedButton("back") });
        }
        this.joinModal = document.getElementById("joinModal");
        this.joinModal.style.display = "none";
        this.hostModal = document.getElementById("hostModal");
        this.hostModal.style.display = "none";
        this.usernameField = document.getElementById("usernameField");
        this.usernameField.addEventListener("change", () => { this.changeUsername() });
    }

    changeUsername() {
        this.client.username = this.usernameField.value;
        events.emit(EventTypes.SET_DATA, {
            key: 'username',
            value: this.client.username
        });
        this.client.username = this.usernameField.value;
    }


    onInit() {
        this.client = new CommunicatorClient();
        this.client.discoveryTopic();
        events.emit(EventTypes.SETUP_MQTT_CONNECTOR, this.client);
    }

    clickedButton(id) {
        console.log(id);
        if (id === "online") {
            this.setModalAsActive("online");
        } else if (id === "back") {
            this.client = new CommunicatorClient();
            this.client.discoveryTopic();
            events.emit(EventTypes.SETUP_MQTT_CONNECTOR, this.client);
            this.setModalAsActive("home");
        } else if (id === "host") {
            this.client = new CommunicatorHost();
            this.client.discoveryTopic();
            events.emit(EventTypes.SETUP_MQTT_CONNECTOR, this.client);
            this.setModalAsActive("host");
        } else if (id === "join") {
            this.usernameField.value = this.client.username;
            this.setModalAsActive("join");
        }
    }

    setModalAsActive(modal) {
        if (modal == "join") {
            this.joinModal.style.display = "block";
        } else {
            this.joinModal.style.display = "none";
        }
        if (modal == "host") {
            this.hostModal.style.display = "block";
        } else {
            this.hostModal.style.display = "none";
        }
        if (modal == "home") {
            this.homeModal.style.display = "block";
        } else {
            this.homeModal.style.display = "none";
        }
        if (modal == "online") {
            this.onlineMultiplayerModal.style.display = "block";
        } else {
            this.onlineMultiplayerModal.style.display = "none";
        }

    }

    destroy() {
        this.children.forEach(child => child.destroy());
        if (this.parent) {
            this.parent.removeChild(this);
        }
        this.menu.removeEventListener("click");
        this.campaignButton.removeEventListener("click");
        this.onlineButton.removeEventListener("click");
        this.offlineButton.removeEventListener("click");
        this.originalButton.removeEventListener("click");
    }
}
