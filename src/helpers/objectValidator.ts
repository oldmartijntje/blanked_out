class InterfaceObjectValidator {

    static isValidInterfaceObject(obj, theClassItShouldBe) {
        if (typeof obj !== 'object' || obj === null) {
            return false;
        }

        // Create an instance of the class
        const instance = new theClassItShouldBe();

        // Get keys from the class instance
        const expectedKeys = Object.keys(instance);

        // Get keys from the provided object
        const objKeys = Object.keys(obj);

        // Check if every expected key exists in the object
        const hasAllKeys = expectedKeys.every(key => objKeys.includes(key));

        // Optional: check for exact match (no extra keys)
        const sameKeyLength = expectedKeys.length === objKeys.length;

        return hasAllKeys && sameKeyLength;
    }
}

export { InterfaceObjectValidator };
