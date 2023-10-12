/**
 * @file @justkd/uidmanager.ts
 * @version 1.1.1
 * @author Cadence Holmes
 * @copyright Cadence Holmes 2023
 * @license MIT
 * @fileoverview `export const UIDManager`
 * Generate RFC4122 version 4 compliant unique identifiers
 * and associate them with entities in a `map`.
 */

import { uid as UID } from "./uid";

const onError = (name: string, e: unknown, msg?: string) => {
  console.groupCollapsed(`UIDManager.${name}${msg ? ` : ${msg}` : ""}`);
  console.log(e);
  console.groupEnd();
};

const defaultMsg =
  "All values must be valid RFC4122 version 4 " +
  "compliant unique identifiers.";

/**
 * Generate RFC4122 version 4 compliant unique identifiers
 * and associate them with entities in a `map`.
 * @returns
 */
export const UIDManager = () => {
  const generator = UID();
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
    validate: (uids: null | string | (string | null)[]): string[] | null => {
      try {
        return generator.validate(uids);
      } catch (e) {
        onError("validate", e, defaultMsg);
        return null;
      }
    },

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
    generateUIDFor: (key: any): string | null => {
      try {
        if (key === undefined) throw new Error("Keys must not be undefined.");
        if (key === null) throw new Error("Keys must not be null.");
        if (Number.isNaN(key)) throw new Error("Keys must not be NaN.");
        const uid = generator.generate();
        if (map.has(key)) map.delete(key);
        map.set(key, uid);
        return uid;
      } catch (e) {
        onError("generateUIDFor", e);
        return null;
      }
    },

    /**
     * Retrieve the UID string for the associated object.
     * @param {any} key
     * The entity reference.
     * @returns {string|undefined}
     * Returns the UID `string` or `undefined` if a value is not found.
     */
    getUIDFor: (key: any): string | undefined => map.get(key) ?? null,

    /**
     * Retrieve the key for the associated UID string.
     * @param {string} uid
     * The UID string.
     * @returns {any}
     * Returns the associated key or `undefined` if a matching
     * value is not found. Returns `null` on error.
     */
    getKeyFor: (uid: string): any => {
      try {
        const entries = Array.from(map.entries());
        const i = entries.findIndex((e) => uid === e[1]);
        if (i < 0) return undefined;
        return entries[i][0];
      } catch (e) {
        onError("getKeyFor", e);
        return null;
      }
    },

    /**
     * Check if there is an existing UID for the target key.
     * @param {any} key
     * The entity reference.
     * @returns {boolean}
     */
    hasUIDFor: (key: any): boolean => map.has(key),

    /**
     * Check if there is an existing key for the target UID.
     * @param {string} uid - The UID string.
     * @returns {boolean}
     */
    hasKeyFor: (uid: string): boolean => [...map.values()].includes(uid),

    /**
     * Retrieve a new array containing all keys held in the map.
     * @returns {any[]}
     */
    keys: (): any[] => Array.from(map.keys()),

    /**
     * Retrieve a new array containing all values (uids) held in the map.
     * @returns {string[]}
     */
    uids: (): string[] => Array.from(map.values()),

    /**
     * Retrieve a new array containing [key, value] arrays for each entry.
     * @returns {[any, string][]}
     */
    entries: (): [any, string][] => Array.from(map.entries()),

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
    restore: (entries: [any, string][]): boolean | null => {
      try {
        const $entries = entries.map(([k, v]) => [k, v.toLowerCase()]);
        const bank: string[] = [];
        const validated = $entries.every(([k, v], i) => {
          if (bank.includes(v)) {
            const err = `Invalid entry [${k}, ${v}] at index ${i}`;
            const msg = `Duplicate UID found: ${v}.`;
            onError("restore", new Error(err), msg);
            return false;
          }
          bank.push(v);
          if (!generator.validate(v)) {
            const err = `Invalid entry [${k}, ${v}] at index ${i}`;
            onError("restore", new Error(err), defaultMsg);
            return false;
          }
          if (k === undefined || k === null || Number.isNaN(k)) {
            const err = `Invalid entry [${k}, ${v}] at index ${i}`;
            const msg = "Keys must not be null, undefined, or NaN.";
            onError("restore", new Error(err), msg);
            return false;
          }
          return true;
        });
        if (!validated) return false;
        map.clear();
        generator.setExisting($entries.map((entry) => entry[1]));
        $entries.forEach(([k, v]) => map.set(k, v));
        return true;
      } catch (e) {
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
    set: (entry: [any, string]): boolean | null => {
      try {
        const [k, v] = [entry[0], entry[1].toLowerCase()];
        if (!generator.validate(v)) {
          const err = `Invalid entry [${k}, ${v}]`;
          onError("set", new Error(err), defaultMsg);
          return false;
        }
        if (k === undefined || k === null || Number.isNaN(k)) {
          const err = `Invalid entry [${k}, ${v}]`;
          const msg = "Keys must not be null, undefined, or NaN.";
          onError("set", new Error(err), msg);
          return false;
        }
        if (
          [...map.values()].includes(v) ||
          generator.getExisting().includes(v)
        ) {
          const err = `Invalid entry [${k}, ${v}]`;
          const msg = "UID already exists.";
          onError("set", new Error(err), msg);
          return false;
        }
        if (map.has(k)) map.delete(k);
        map.set(k, v);
        return true;
      } catch (e) {
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
    deleteUID: (uid: string): boolean | null => {
      try {
        const entries = Array.from(map.entries());
        const i = entries.findIndex((e) => uid === e[1]);
        if (i < 0) return false;
        const k = entries[i][0];
        map.delete(k);
        return true;
      } catch (e) {
        onError("deleteUID", e);
        return null;
      }
    },

    /**
     * Delete a UID association for a given key.
     * @param {any} key
     * The key entity reference.
     * @returns {boolean|null}
     * Returns `true|false` on success or failure.
     * Returns `null` on error.
     */
    deleteUIDFor: (key: any): boolean | null => {
      try {
        if (!map.has(key)) return false;
        map.delete(key);
        return true;
      } catch (e) {
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
    getMap: (): Map<any, string> => map,
  };

  Object.freeze(self);

  return self;
};

export type UIDManagerInterface = ReturnType<typeof UIDManager>;
