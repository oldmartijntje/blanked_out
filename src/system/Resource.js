import { config } from "../config.js";

class Resources {
    constructor() {
        this.toLoad = {
            hero: "sprites/hero-sheet.png",
            shadow: "sprites/shadow.png",
            rod: "sprites/rod.png",
            exit: "sprites/exit.png",

            sky: "sprites/sky.png",
            ground: "sprites/ground.png",
            cave: "sprites/cave.png",
            caveGround: "sprites/cave-ground.png",

            knight: "sprites/knight-sheet-1.png",

            //  HUD
            textBox: "sprites/text-box.png",
            portraits: "sprites/portraits-sheet.png",
            fontWhite: "sprites/sprite-font-white.png",
        }

        this.images = {};

        // Define the base URL for assets
        var baseUrl = '';
        try {
            baseUrl = process.env.NODE_ENV === 'production' ? "/" + config['baseUrl'] + "/" + config['assetsPath'] + "/" : './' + config['assetsPath'] + '/';
        } catch (e) {
            console.log(e);
            baseUrl = "/" + config['baseUrl'] + "/" + config['assetsPath'] + "/";
        }
        console.log(`"${baseUrl}"`);

        // Load all images
        Object.keys(this.toLoad).forEach((key) => {
            const img = new Image();
            img.src = baseUrl + this.toLoad[key];

            this.images[key] = {
                image: img,
                isLoaded: false
            };
            img.onload = () => {
                this.images[key].isLoaded = true;
            }
        });
    }


}

// Create one instance of the class and export it
export const resources = new Resources();