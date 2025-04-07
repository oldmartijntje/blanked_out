class hostClientLinkingResult {
    connected = false;
    hostId = null;
    hostData = null;

    constructor(connected, hostId, hostData) {
        this.connected = connected;
        this.hostId = hostId;
        this.hostData = hostData;
    }
}

export { hostClientLinkingResult };