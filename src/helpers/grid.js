import { config } from '../config.js';
import { Vector2 } from '../system/Vector2.js';

/**
 * @function gridCells
 * @description Converts a number of grid cells to pixels.
 * @param {number} number - The number of grid cells.
 * @returns {number} The number of pixels.
 */
export const gridCells = number => {
    return number * config.sizes.gridSize;
}

/**
 * @function isSpaceFree
 * @description Checks if a space is free of walls.
 * @param {Set} walls - The walls set.
 * @param {number} x - The x coordinate.
 * @param {number} y - The y coordinate.
 * @returns {boolean} True if the space is free of walls, false otherwise.
 */
export const isSpaceFree = (walls, x, y) => {
    // round the x and y to the nearest whole number
    x = Math.round(x);
    y = Math.round(y);

    // convert to string to use as key
    const str = `${x},${y}`;
    // check if the key is present in the walls set
    const isWallPresent = walls.has(str);
    return !isWallPresent;
}

/**
 * @function calculateNearestGridPosition
 * @description Calculates the nearest grid position, meant for error correction.
 * @param {number} x - The x coordinate.
 * @param {number} y - The y coordinate.
 * @returns {Vector2} The nearest grid position.
 */
export const calculateNearestGridPosition = (x, y) => {
    const gridSize = config.sizes.gridSize;
    const gridX = Math.round(x / gridSize) * gridSize;
    const gridY = Math.round(y / gridSize) * gridSize;
    return new Vector2(gridX, gridY);
}

/**
 * @function calculateNearestGridPositionFloored
 * @description Calculates the nearest grid position rounded down, since the tile is calculated from the top left corner and not the middle.
 * @param {number} x - The x coordinate.
 * @param {number} y - The y coordinate.
 * @returns {Vector2} The nearest grid position floored.
 */
export const calculateNearestGridPositionFloored = (x, y) => {
    const gridSize = config.sizes.gridSize;
    const gridX = Math.floor(x / gridSize) * gridSize;
    const gridY = Math.floor(y / gridSize) * gridSize;
    return new Vector2(gridX, gridY);
}