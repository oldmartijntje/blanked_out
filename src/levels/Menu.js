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
    lobbyHostId;
    amountOfLobbies = 0;
    lobbiesInDiscovery = {};
    discoveryAccordion;
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
        this.discoveryAccordion = document.getElementById("discoveryAccordion");
        for (let i = 0; i < this.backButtons.length; i++) {
            this.backButtons[i].addEventListener("click", () => { this.clickedButton("back") });
        }
        this.joinModal = document.getElementById("joinModal");
        this.joinModal.style.display = "none";
        this.hostModal = document.getElementById("hostModal");
        this.hostModal.style.display = "none";
        this.usernameField = document.getElementById("usernameField");
        this.usernameField.addEventListener("change", () => { this.changeUsername() });
        this.lobbyHostId = document.getElementById("lobbyHostId");
    }

    changeUsername() {
        var username = this.usernameField.value;
        if (username.length > 20) {
            this.usernameField.value = this.client.username;
            return;
        } else if (username.length < 4) {
            this.usernameField.value = this.client.username;
            return;
        }
        this.client.username = username;
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
        events.on(EventTypes.LOBBY_FOUND, this, (data) => {
            this.amountOfLobbies = Object.keys(data).length;
            this.lobbiesFound.innerHTML = this.amountOfLobbies;
            if (JSON.stringify(Object.keys(data)) === JSON.stringify(Object.keys(this.lobbiesInDiscovery))) {
                return;
            }
            this.lobbiesInDiscovery = data;
            this.discoveryAccordion.innerHTML = "";
            Object.keys(data).forEach(key => {
                var accordion = document.createElement("div");
                accordion.className = "accordion-item";
                var header = document.createElement("h2");
                header.className = "accordion-header";
                var button = document.createElement("button");
                button.className = "accordion-button";
                button.type = "button";
                button.setAttribute("data-bs-toggle", "collapse");
                button.setAttribute("data-bs-target", "#collapse" + key);
                button.setAttribute("aria-controls", "collapse" + key);
                button.innerHTML = `${data[key].Username} (${data[key].playersConnected}/2)`;
                header.appendChild(button);
                accordion.appendChild(header);
                var collapse = document.createElement("div");
                collapse.id = "collapse" + key;
                collapse.className = "accordion-collapse collapse";
                collapse.setAttribute("aria-labelledby", "heading" + key);
                collapse.setAttribute("data-bs-parent", "#discoveryAccordion");
                var body = document.createElement("div");
                body.className = "accordion-body";
                body.innerHTML = `Host: ${data[key].Username}<br>Players: ${data[key].playersConnected}/2<br>Id: ${key}<br><button id="joinLobby${key}" class="btn btn-primary">Join</button>`;
                collapse.appendChild(body);
                accordion.appendChild(collapse);
                this.discoveryAccordion.appendChild(accordion);
                var joinButton = document.getElementById("joinLobby" + key);
                joinButton.addEventListener("click", () => {
                    // this.client.joinLobby(key);
                    // this.setModalAsActive("home");
                });
            });
        });
    }

    clickedButton(id) {
        console.log(id);
        if (id === "online") {
            this.usernameField.value = this.client.username;
            this.setModalAsActive("online");
        } else if (id === "back") {
            this.client = new CommunicatorClient();
            this.client.discoveryTopic();
            events.emit(EventTypes.SETUP_MQTT_CONNECTOR, this.client);
            this.setModalAsActive("home");
        } else if (id === "host") {
            this.client = new CommunicatorHost();
            this.lobbyHostId.innerHTML = this.client.creationIdentifier;
            events.emit(EventTypes.SETUP_MQTT_CONNECTOR, this.client);
            this.setModalAsActive("host");
        } else if (id === "join") {
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
