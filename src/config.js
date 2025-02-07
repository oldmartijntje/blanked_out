export const config = {
    "baseUrl": "blanked_out",
    "assetsPath": "assets",
    "keys": {
        "upKeys": ["ArrowUp", "KeyW"],
        "downKeys": ["ArrowDown", "KeyS"],
        "leftKeys": ["ArrowLeft", "KeyA"],
        "rightKeys": ["ArrowRight", "KeyD"],
        "zoomMinus": ["NumpadSubtract"],
        "zoomPlus": ["NumpadAdd"],
    },
    "sizes": {
        "gridSize": 64,
        "BackgroundWidth": 1280,
        "BackgroundHeight": 1280,
    },
    "MQTT": {
        "brokerUrl+port": "test.mosquitto.org:8081",
        "topicBase": "https://oldmartijntje.github.io/blanked_out/"
    }
};