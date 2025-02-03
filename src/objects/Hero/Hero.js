import { Animations } from "../../system/Animations.js";
import { GameObject } from "../../system/GameObject.js";
import { calculateNearestGridPosition, gridCells, isSpaceFree } from "../../helpers/grid.js";
import { resources } from '../../system/Resource.js';
import { DOWN, LEFT, RIGHT, UP } from "../../system/Input.js";
import { Sprite } from "../../system/Sprite.js";
import { Vector2 } from "../../system/Vector2.js";
import { PICK_UP_DOWN, STAND_DOWN, STAND_LEFT, STAND_RIGHT, STAND_UP, WALK_DOWN, WALK_LEFT, WALK_RIGHT, WALK_UP } from "./heroAnimations.js";
import { FrameIndexPattern } from "../../system/FrameIndexPattern.js";
import { moveTowards } from "../../helpers/moveTowards.js";
import { config } from '../../config.js';
import { events } from "../../system/Events.js";
import { Entity } from "../Entity/Entity.js";

/**
 * @class Hero
 * @description Represents the player character.
 * @extends Entity
 * @exports Hero
 */
export class Hero extends Entity {

    /**
     * @constructor
     * @param {number} x - Hero x position. (in pixels)
     * @param {number} y - Hero y position. (in pixels)
     */
    constructor(x, y, focus = true) {
        const body = new Sprite({
            resource: resources.images.hero,
            hFrames: 3,
            vFrames: 8,
            frame: 1,
            frameSize: new Vector2(32, 32),
            position: new Vector2(-8, -20),
            animations: new Animations({
                walkDown: new FrameIndexPattern(WALK_DOWN),
                walkUp: new FrameIndexPattern(WALK_UP),
                walkLeft: new FrameIndexPattern(WALK_LEFT),
                walkRight: new FrameIndexPattern(WALK_RIGHT),
                standDown: new FrameIndexPattern(STAND_DOWN),
                standUp: new FrameIndexPattern(STAND_UP),
                standLeft: new FrameIndexPattern(STAND_LEFT),
                standRight: new FrameIndexPattern(STAND_RIGHT),
                pickupDown: new FrameIndexPattern(PICK_UP_DOWN),
            })
        });

        super({
            position: new Vector2(x, y),
            body: body,
            speed: 1 // float numbers cause motion blur.
        });


        // the hero is the focus of the camera
        this.focus = focus;

        // the hero is solid, so other entities can't walk through it, nor can other playesr in multiplayer games.
        this.isSolid = true;

        this.facingDirection = DOWN;
        this.destinationPosition = this.position.duplicate();
        this.itemPickupTime = 0;
        this.itemPickupShell = null;
        this.isLocked = false;

        events.on('HERO_PICK_UP_ITEM', this, (value) => {
            this.onPickUpItem(value);
        });
    }

    onInit() {
        events.on('START_TEXT_BOX', this, (value) => {
            this.isLocked = true;
        });

        events.on('END_TEXT_BOX', this, (value) => {
            this.isLocked = false;
        });
    }

    step(deltaTime, root) {

        if (this.isLocked) {
            return;
        }

        if (this.itemPickupTime > 0) {
            this.workOnItemPickup(deltaTime);
            return;
        }

        /** @type {Input} */
        const input = root.input;
        if (input?.getActionJustPressed('Space')) {

            // check if there is an object in front of the hero
            const objAtPosition = this.parent.children.find(child => {
                return child.position.matches(this.position.toNeighbor(this.facingDirection));
            });
            if (objAtPosition) {
                events.emit('HERO_REQUESTS_ACTION', objAtPosition);
            }
        }

        let hasArrived = true;
        if (this.movementSpeed != null) {
            const distance = moveTowards(this, this.destinationPosition, this.movementSpeed);
            hasArrived = distance <= 1;
        }

        // if we've arrived, try to move in the direction of the input
        if (hasArrived) {
            this.tryMove(root);
        }
        this.tryEmitPosition()
    }

    tryEmitPosition() {
        if (this.lastPosition && this.lastPosition.x === this.position.x && this.lastPosition.y === this.position.y) {
            return;
        }
        events.emit('HERO_POSITION', { position: this.position, initialPosition: !this.lastPosition, focus: this.focus });
        this.lastPosition = this.position.duplicate();
    }

    onPickUpItem({ image, position }) {
        // make sure we are right on top of the item
        const pos = this.position.duplicate();
        this.position = calculateNearestGridPosition(pos.x, pos.y);
        this.destinationPosition = this.position.duplicate();

        this.itemPickupTime = 500; // ms

        // play the pickup animation
        this.itemPickupShell = new GameObject({});
        this.itemPickupShell.addChild(new Sprite({
            resource: image,
            position: new Vector2(0, -18)
        }));
        this.addChild(this.itemPickupShell);

    }

    tryMove(root) {
        const { input } = root;
        if (!input) {
            return;
        }
        if (!input.direction) {
            if (this.facingDirection === LEFT) {
                this.body.animations.play("standLeft");
            } else if (this.facingDirection === RIGHT) {
                this.body.animations.play("standRight");
            } else if (this.facingDirection === UP) {
                this.body.animations.play("standUp");
            } else if (this.facingDirection === DOWN) {
                this.body.animations.play("standDown");
            }
            return;
        }

        let nextX = this.destinationPosition.x;
        let nextY = this.destinationPosition.y;

        // round the x and y to the nearest whole number
        nextX = Math.round(nextX);
        nextY = Math.round(nextY);


        const gridSize = config.sizes.gridSize;

        if (input.direction === LEFT) {
            nextX -= gridSize;
            this.body.animations.play("walkLeft");
        } else if (input.direction === RIGHT) {
            nextX += gridSize;
            this.body.animations.play("walkRight");
        } else if (input.direction === UP) {
            nextY -= gridSize;
            this.body.animations.play("walkUp");
        } else if (input.direction === DOWN) {
            nextY += gridSize;
            this.body.animations.play("walkDown");
        }
        this.facingDirection = input.direction ?? this.facingDirection;

        // check if the next position is valid
        const spaceIsFree = isSpaceFree(root.level.walls, nextX, nextY);
        if (spaceIsFree) {
            // there is no wall in the way
            // so check for entities that are solid
            const solidBodyAtSpace = this.parent.children.find(child => {
                return child.isSolid && child.position.x === nextX && child.position.y === nextY;
            });
            if (!solidBodyAtSpace) {
                this.destinationPosition = calculateNearestGridPosition(nextX, nextY);
            }
        }
    }

    workOnItemPickup(deltaTime) {
        this.itemPickupTime -= deltaTime;
        this.body.animations.play("pickupDown");

        if (this.itemPickupTime <= 0) {
            this.removeChild(this.itemPickupShell);
            this.itemPickupShell = null;
        }
    }

}