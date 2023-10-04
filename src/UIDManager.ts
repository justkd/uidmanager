/**
 * @file @justkd/uid.manager.ts
 * @version 1.0.0
 * @author Cadence Holmes
 * @copyright Cadence Holmes 2023
 * @license MIT
 * @fileoverview `export const UIDManager`
 * Generate RFC4122 version 4 compliant unique identifiers and associate them with entities
 * in a `map`.
 */

import { uid as UID } from "./uid";

/**
 * Generate RFC4122 version 4 compliant unique identifiers and associate them with entities
 * in a `map`.
 * @returns
 */
export const UIDManager = () => {
  const generator = UID();

  const map = new Map();

  const self = {
    /**
     * Generate a unique identifier and associate it with the `target` entity.
     * Internally, these associations are stored in a `new Map()`. The target entity
     * is set as the key, and the UID string is set as the value. If the target entity
     * already exists in the map, the existing association is deleted and a new UID is
     * mapped to that entity.
     * @param {any} target - `any` entity to be mapped to a unique identifier.
     */
    generateUIDFor: (target: any) => {
      const uid = generator.generate();
      if (map.has(target)) map.delete(target);
      map.set(target, uid);
      return uid;
    },

    /**
     * Retrieve the UID string for the associated object.
     * @param {any} target - The entity reference.
     * @returns {string} Returns the UID `string`.
     */
    getUIDFor: (target: any): string => map.get(target),

    /**
     * Retrieve the key for the associated UID string.
     * @param {string} uid - The UID string.
     * @returns {any} Returns the associated key or `undefined` if a matching value is not found.
     */
    getKeyFor: (uid: string): any => {
      const entries = Array.from(map.entries());
      const i = entries.findIndex((e) => uid === e[1]);
      if (i < 0) return undefined;
      return entries[i][0];
    },

    /**
     * Check if there is an existing UID for the target object.
     * @param {any} target - The entity reference.
     * @returns {boolean}
     */
    hasUIDFor: (target: any): boolean => map.has(target),

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
     * Retrieve a new array containing individual arrays [key, value] for each entry.
     * @returns {[any, string][]}
     */
    entries: (): [any, string][] => Array.from(map.entries()),

    /**
     * Delete a UID association for a given UID string.
     * @param {string} uid - The UID string.
     */
    deleteUID: (uid: string) => {
      const entries = Array.from(map.entries());
      const i = entries.findIndex((e) => uid === e[1]);
      if (i < 0) return;
      const k = entries[i][0];
      map.delete(k);
    },

    /**
     * Delete a UID association for a given target.
     * @param {any} target - The entity reference.
     */
    deleteUIDFor: (target: any) => {
      if (!map.has(target)) return;
      map.delete(target);
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
