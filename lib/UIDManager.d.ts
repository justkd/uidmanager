/**
 * @file @justkd/UIDManager.ts
 * @version 1.1.0
 * @author Cadence Holmes
 * @copyright Cadence Holmes 2023
 * @license MIT
 * @fileoverview `export const UIDManager`
 * Generate RFC4122 version 4 compliant unique identifiers
 * and associate them with entities in a `map`.
 */
/**
 * Generate RFC4122 version 4 compliant unique identifiers
 * and associate them with entities in a `map`.
 * @returns
 */
export declare const UIDManager: () => {
    /**
     * Validate strings as RFC4122 version 4 compliant unique identifiers.
     * @param {string | string[]} uids
     * Either a single string or array of strings to test.
     * @returns {string[]|null}
     * Returns `string[]` containing all valid strings.
     * Returns `null` on error.
     * @example // Single valid string
     * const uid = 'AA97B177-9383-4934-8543-0F91A7A02836';
     * const validated = UIDManager().validate(uid); // validated === [uid]
     * const isValid = validated.length > 0; // true
     * @example // Array of valid strings
     * const uids = [...new Array(5)].map((_) => 'AA97B177-9383-4934-8543-0F91A7A02836');
     * const validated = UIDManager().validate(uids); // validated == uids
     * const isValid = validated.length === uids.length; // true
     * @example // Array of invalid strings
     * const uids = ['1', '2', '3', '4'];
     * const validated = UIDManager().validate(uids); // validated != uids
     * const isValid = validated.length === uids.length; // false
     * @example // Array of mixed validity strings
     * const uid = 'AA97B177-9383-4934-8543-0F91A7A02836';
     * const uids = ['invalid-uid', uid];
     * const validated = UIDManager().validate(uids); // validated == [uid]
     * const isValid = validated.length === uids.length; // false
     */
    validate: (uids: null | string | (string | null)[]) => string[] | null;
    /**
     * Generate a unique identifier and associate it with the provided key.
     * Internally, these associations are stored in a `new Map()`. The target
     * entity is set as the key, and the UID string is set as the value. If
     * the target entity already exists in the map, the existing association
     * is deleted and a new UID is mapped to that entity.
     * @param {any} key
     * `any` entity to be mapped to a unique identifier.
     * Throws if the key is `undefined`, `null`, or `NaN`.
     * @returns {string|null}
     * Returns the newly generated UID `string`.
     * Returns `null` on error.
     */
    generateUIDFor: (key: any) => string | null;
    /**
     * Retrieve the UID string for the associated object.
     * @param {any} key
     * The entity reference.
     * @returns {string|undefined}
     * Returns the UID `string` or `undefined` if a value is not found.
     */
    getUIDFor: (key: any) => string | undefined;
    /**
     * Retrieve the key for the associated UID string.
     * @param {string} uid
     * The UID string.
     * @returns {any}
     * Returns the associated key or `undefined` if a matching
     * value is not found. Returns `null` on error.
     */
    getKeyFor: (uid: string) => any;
    /**
     * Check if there is an existing UID for the target key.
     * @param {any} key
     * The entity reference.
     * @returns {boolean}
     */
    hasUIDFor: (key: any) => boolean;
    /**
     * Check if there is an existing key for the target UID.
     * @param {string} uid - The UID string.
     * @returns {boolean}
     */
    hasKeyFor: (uid: string) => boolean;
    /**
     * Retrieve a new array containing all keys held in the map.
     * @returns {any[]}
     */
    keys: () => any[];
    /**
     * Retrieve a new array containing all values (uids) held in the map.
     * @returns {string[]}
     */
    uids: () => string[];
    /**
     * Retrieve a new array containing [key, value] arrays for each entry.
     * @returns {[any, string][]}
     */
    entries: () => [any, string][];
    /**
     * Replace the current map with a new set of entries.
     * This will first validate each key/value pair to ensure
     * all keys are not `undefined`, `null`, or `NaN`, and that all
     * values are valid RFC4122 version 4 compliant unique
     * identifiers. If validation succeeds, the internal Map
     * is cleared and set with the new entries.
     * @param {[any, string][]} entries
     * An array of key/value pairs expressed as individual [k, v] arrays.
     * @returns {boolean|null}
     * Returns `true` on success or `false` if validation fails.
     * Returns `null` for all other errors.
     */
    restore: (entries: [any, string][]) => boolean | null;
    /**
     * Manually set a new UID association.
     * This will first validate the key/value pair to ensure
     * the key is not `undefined`, `null`, or `NaN`, and the
     * value is a valid RFC4122 version 4 compliant unique
     * identifier. If validation succeeds, the internal Map
     * is checked for an existing key and if found will delete
     * the association before setting the new one.
     * @param {[any, string][]} entries
     * An array of key/value pairs expressed as individual [k, v] arrays.
     * @returns {boolean|null}
     * Returns `true` on success or `false` if validation fails.
     * Returns `null` for all other errors.
     */
    set: (entry: [any, string]) => boolean | null;
    /**
     * Delete a UID association for a given UID string.
     * @param {string} uid
     * The UID string.
     * @returns {boolean|null}
     * Returns `true|false` on success or failure.
     * Returns `null` on error.
     */
    deleteUID: (uid: string) => boolean | null;
    /**
     * Delete a UID association for a given key.
     * @param {any} key
     * The key entity reference.
     * @returns {boolean|null}
     * Returns `true|false` on success or failure.
     * Returns `null` on error.
     */
    deleteUIDFor: (key: any) => boolean | null;
    /**
     * Clear all currently held target:UID associations.
     */
    deleteAll: () => void;
    /**
     * Retrieve a reference to the internal map object.
     * @returns {Map<any, string>}
     */
    getMap: () => Map<any, string>;
};
export type UIDManagerInterface = ReturnType<typeof UIDManager>;
//# sourceMappingURL=UIDManager.d.ts.map