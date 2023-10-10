/**
 * @file @justkd/uid.ts
 * @version 1.0.0
 * @author Cadence Holmes
 * @copyright Cadence Holmes 2023
 * @license MIT
 * @fileoverview `export const uid`
 * Generate RFC4122 version 4 compliant unique identifiers using pseudo-random
 * values from `window.crypto` (with a fallback to `Math.Random`). A pre-generated
 * lookup table is used for performance optimization, and generated UIDs are checked
 * against an array of previously generated UIDs to ensure uniqueness.
 * @note Based on discussions found here:
 * https://stackoverflow.com/questions/105034/create-guid-uid-in-javascript
 */
/**
 * Generate RFC4122 version 4 compliant unique identifiers using pseudo-random
 * values from `window.crypto` (with a fallback to `Math.Random`). A pre-generated
 * lookup table is used for performance optimization, and generated UIDs are checked
 * against an array of previously generated UIDs to ensure uniqueness.
 * @param {string[]} [uids] - Pass an array of existing UIDs to set/restore state.
 * @returns {{generate: () => string}}
 */
export declare const uid: (uids?: string[]) => {
    /**
     * Determine which pseudo-random number generator to use, generate four random
     * values, and coerce the output to a RFC4122 version 4 compliant unique identifier.
     * Checks with stored UIDs to absolutely ensure the value is unique.
     * @returns {string} RFC4122 version 4 compliant unique identifier as alpha-numeric `string`.
     */
    generate: () => string;
    /**
     * Retrieve the array of previously generated UIDs.
     * @return {string[]} `string[]`
     */
    getExisting: () => string[];
    /**
     * Set the array of previously generated UIDs. Checks the array for validity and only
     * sets the internal store if the check passes. Returns `true` on success and `false`
     * if failed.
     * @param {string[]} ids - Array of existing UIDs.
     * @returns {boolean} Returns `true` on success.
     */
    setExisting: (ids: string[]) => void;
    /**
     * Validate as RFC4122 version 4 compliant unique identifier.
     * @param {string | string[]} uids - Either a single string or array of strings to test.
     * @returns {string[]} Returns `string[]` containing all valid strings.
     *
     * @example `Single valid string`
     * const uid = uid.generate();
     * const validated = uid.validate(uid); // validated === [uid]
     * const isValid = validated.length > 0; // true
     *
     * @example `Array of valid strings`
     * const uids = [...new Array(5)].map((_) => uid.generate());
     * const validated = uid.validate(uids); // validated == uids
     * const isValid = validated.length === uids.length; // true
     *
     * @example `Array of invalid strings`
     * const uids = ['1', '2', '3', '4'];
     * const validated = uid.validate(uids); // validated != uids
     * const isValid = validated.length === uids.length; // false
     *
     * @example `Array of mixed validity strings`
     * const uid = 'AA97B177-9383-4934-8543-0F91A7A02836';
     * const uids = ['invalid-uid', uid];
     * const validated = uid.validate(uids); // validated == [uid]
     * const isValid = validated.length === uids.length; // false
     */
    validate: (ids: null | string | (string | null)[]) => string[];
};
//# sourceMappingURL=uid.d.ts.map