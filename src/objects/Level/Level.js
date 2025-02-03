import { GameObject } from "../../system/GameObject.js";

export class Level extends GameObject {
    constructor() {
        super({});
        this.background = null;
        this.walls = new Set();
    }
}