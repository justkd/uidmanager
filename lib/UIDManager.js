"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIDManager = void 0;
const uid_1 = require("./uid");
const onError = (name, e, msg) => {
    console.groupCollapsed(`UIDManager.${name}${msg ? ` : ${msg}` : ""}`);
    console.log(e);
    console.groupEnd();
};
/**
 * Generate RFC4122 version 4 compliant unique identifiers
 * and associate them with entities in a `map`.
 * @returns
 */
const UIDManager = () => {
    const generator = (0, uid_1.uid)();
    const map = new Map();
    const self = {
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
        validate: (uids) => {
            try {
                return generator.validate(uids);
            }
            catch (e) {
                onError("validate", e, "All values must be valid RFC4122 version 4 compliant unique identifiers.");
                return null;
            }
        },
        /**
         * Generate a unique identifier and associate it with the `target` entity.
         * Internally, these associations are stored in a `new Map()`. The target entity
         * is set as the key, and the UID string is set as the value. If the target entity
         * already exists in the map, the existing association is deleted and a new UID is
         * mapped to that entity.
         * @param {any} key
         * `any` entity to be mapped to a unique identifier.
         * Throws if the key is `undefined`, `null`, or `NaN`.
         * @returns {string|null}
         * Returns the newly generated UID `string`.
         * Returns `null` on error.
         */
        generateUIDFor: (key) => {
            try {
                if (key === undefined)
                    throw new Error("Keys must not be undefined.");
                if (key === null)
                    throw new Error("Keys must not be null.");
                if (Number.isNaN(key))
                    throw new Error("Keys must not be NaN.");
                const uid = generator.generate();
                if (map.has(key))
                    map.delete(key);
                map.set(key, uid);
                return uid;
            }
            catch (e) {
                onError("generateUIDFor", e);
                return null;
            }
        },
        /**
         * Retrieve the UID string for the associated object.
         * @param {any} key
         * The entity reference.
         * @returns {string|undefined}
         * Returns the UID `string` or `undefined` if a value is not found for the given key.
         */
        getUIDFor: (key) => map.get(key) ?? null,
        /**
         * Retrieve the key for the associated UID string.
         * @param {string} uid
         * The UID string.
         * @returns {any}
         * Returns the associated key or `undefined` if a matching value is not found.
         * Returns `null` on error.
         */
        getKeyFor: (uid) => {
            try {
                const entries = Array.from(map.entries());
                const i = entries.findIndex((e) => uid === e[1]);
                if (i < 0)
                    return undefined;
                return entries[i][0];
            }
            catch (e) {
                onError("getKeyFor", e);
                return null;
            }
        },
        /**
         * Check if there is an existing UID for the target object.
         * @param {any} key - The entity reference.
         * @returns {boolean}
         */
        hasUIDFor: (key) => map.has(key),
        /**
         * Check if there is an existing UID for the target object.
         * @param {string} uid - The UID string.
         * @returns {boolean}
         */
        hasKeyFor: (uid) => [...map.values()].includes(uid),
        /**
         * Retrieve a new array containing all keys held in the map.
         * @returns {any[]}
         */
        keys: () => Array.from(map.keys()),
        /**
         * Retrieve a new array containing all values (uids) held in the map.
         * @returns {string[]}
         */
        uids: () => Array.from(map.values()),
        /**
         * Retrieve a new array containing [key, value] arrays for each entry.
         * @returns {[any, string][]}
         */
        entries: () => Array.from(map.entries()),
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
        restore: (entries) => {
            try {
                const $entries = entries.map(([k, v]) => [k, v.toLowerCase()]);
                const bank = [];
                const validated = $entries.every(([k, v], i) => {
                    if (bank.includes(v)) {
                        onError("restore", new Error(`Invalid entry [${k}, ${v}] at index ${i}`), `Duplicate UID found: ${v}.`);
                        return false;
                    }
                    bank.push(v);
                    if (!generator.validate(v)) {
                        onError("restore", new Error(`Invalid entry [${k}, ${v}] at index ${i}`), "All values must be valid RFC4122 version 4 compliant unique identifiers.");
                        return false;
                    }
                    if (k === undefined || k === null || Number.isNaN(k)) {
                        onError("restore", new Error(`Invalid entry [${k}, ${v}] at index ${i}`), "Keys must not be null, undefined, or NaN.");
                        return false;
                    }
                    return true;
                });
                if (!validated)
                    return false;
                map.clear();
                generator.setExisting($entries.map((entry) => entry[1]));
                $entries.forEach(([k, v]) => map.set(k, v));
                return true;
            }
            catch (e) {
                onError("restore", e);
                return null;
            }
        },
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
        set: (entry) => {
            try {
                const [k, v] = [entry[0], entry[1].toLowerCase()];
                if (!generator.validate(v)) {
                    onError("set", new Error(`Invalid entry [${k}, ${v}]`), "All values must be valid RFC4122 version 4 compliant unique identifiers.");
                    return false;
                }
                if (k === undefined || k === null || Number.isNaN(k)) {
                    onError("set", new Error(`Invalid entry [${k}, ${v}]`), "Keys must not be null, undefined, or NaN.");
                    return false;
                }
                if ([...map.values()].includes(v) ||
                    generator.getExisting().includes(v)) {
                    onError("set", new Error(`Invalid entry [${k}, ${v}]`), "UID already exists.");
                    return false;
                }
                if (map.has(k))
                    map.delete(k);
                map.set(k, v);
                return true;
            }
            catch (e) {
                onError("set", e);
                return null;
            }
        },
        /**
         * Delete a UID association for a given UID string.
         * @param {string} uid
         * The UID string.
         * @returns {boolean|null}
         * Returns `true|false` on success or failure.
         * Returns `null` on error.
         */
        deleteUID: (uid) => {
            try {
                const entries = Array.from(map.entries());
                const i = entries.findIndex((e) => uid === e[1]);
                if (i < 0)
                    return false;
                const k = entries[i][0];
                map.delete(k);
                return true;
            }
            catch (e) {
                onError("deleteUID", e);
                return null;
            }
        },
        /**
         * Delete a UID association for a given target.
         * @param {any} key
         * The key entity reference.
         * @returns {boolean|null}
         * Returns `true|false` on success or failure.
         * Returns `null` on error.
         */
        deleteUIDFor: (key) => {
            try {
                if (!map.has(key))
                    return false;
                map.delete(key);
                return true;
            }
            catch (e) {
                onError("deleteUIDFor", e);
                return null;
            }
        },
        /**
         * Clear all currently held target:UID associations.
         */
        deleteAll: () => map.clear(),
        /**
         * Retrieve a reference to the internal map object.
         * @returns {Map<any, string>}
         */
        getMap: () => map,
    };
    Object.freeze(self);
    return self;
};
exports.UIDManager = UIDManager;
//# sourceMappingURL=UIDManager.js.map