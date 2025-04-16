
/**
 * @function moveTowards
 * @description Move an entity towards a destination position. 
 * If the entity is already at the destination, it will snap to the destination.
 * 
 * @param {object} person - The entity to move.
 * @param {Vector2} destinationPosition - The destination position.
 * @param {number} speed - The speed to move at.
 * @returns {number} The distance remaining to the destination.
 */
export function moveTowards(person, destinationPosition, speed) {
    let distanceToTravelX = destinationPosition.x - person.position.x;
    let distanceToTravelY = destinationPosition.y - person.position.y;

    let distance = Math.sqrt(distanceToTravelX ** 2 + distanceToTravelY ** 2);
    if (distance === 0) {
        return distance;
    }
    if (distance <= speed) {
        // We've arrived, snap to destination
        person.position.x = destinationPosition.x;
        person.position.y = destinationPosition.y;
        return 0;
    } else {
        // snapping back to the grid (for tight corners can otherwise get both an x and y movement at the same time)
        if (Math.abs(distanceToTravelX) <= speed) {
            person.position.x = destinationPosition.x;
        }
        if (Math.abs(distanceToTravelY) <= speed) {
            person.position.y = destinationPosition.y;
        }

        // We still have further to go
        // move towards the destination at the current speed
        let normalizedX = distanceToTravelX / distance;
        let normalizedY = distanceToTravelY / distance;

        person.position.x += normalizedX * speed;
        person.position.y += normalizedY * speed;


        // Recalculate the distance after moving
        distanceToTravelX = destinationPosition.x - person.position.x;
        distanceToTravelY = destinationPosition.y - person.position.y;
        distance = Math.sqrt(distanceToTravelX ** 2 + distanceToTravelY ** 2);
    }

    return distance
}

/**
 * @function calculateMoveOnto
 * @description Check if an entity has moved onto a position. Because of how the movement system is setup, theoretically you can move onto and off a tile in the same frame.
 * But these frames should still count as "stepped onto the tile" so we need to check if the entity has moved onto the tile.
 * @param {Vector2} position - The position to check.
 * @param {Vector2} entityPosition - The entity position.
 * @param {Vector2} lastEntityPosition - The last entity position.
 * @param {number} pixelOffset - The pixel offset.
 * @returns {boolean} True if the entity has moved onto the position, false otherwise.
 */
export function calculateMoveOnto(position, entityPosition, lastEntityPosition = undefined, pixelOffset = 1) {
    entityPosition.x = Math.round(entityPosition.x);
    entityPosition.y = Math.round(entityPosition.y);
    if (!lastEntityPosition) {
        lastEntityPosition = entityPosition;
    }
    const x = Math.round(entityPosition.x);
    const y = Math.round(entityPosition.y);
    // if the hero is on the same position as the exit or 1 pixel away from it
    // this is needed because somethimes the hero can make it's next turn without the game noticing it has reached cordinates.
    if (Math.abs(position.x - x) <= pixelOffset && Math.abs(position.y - y) <= pixelOffset && (Math.abs(position.y - y) <= Math.abs(position.y - lastEntityPosition.y) && Math.abs(position.x - x) <= Math.abs(position.x - lastEntityPosition.x))) {
        // this will fire 1, 2, or 3 times depending on the way the player moves.
        return true;
    } else {
        return false;
    }
}