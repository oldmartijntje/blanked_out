import { GameObject } from "../../system/GameObject.ts";

export class Level extends GameObject {
    constructor() {
        super({});
        this.background = null;
        this.walls = new Set();
    }
}