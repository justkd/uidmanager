"use strict";
/* eslint-disable no-bitwise */
Object.defineProperty(exports, "__esModule", { value: true });
exports.uid = void 0;
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
const uid = (uids) => {
    let generated = uids || [];
    /**
     * Lookup table holding 0-255 as hexadecimal numbers.
     */
    const lookup = Array(256)
        .fill(null)
        .map((_, i) => (i < 16 ? "0" : "") + i.toString(16));
    /**
     * Given an array of four random 32-bit unsigned integers, use the lookup table and
     * bitshift/bitwise operations to generate RFC4122 version 4 compliant unique identifier.
     * @param {[number, number, number, number]} values - Array holding four 32-bit unsigned integers.
     * @returns {string} - RFC4122 version 4 compliant unique identifier.
     */
    const formatUid = (values) => {
        const v = [
            lookup[values[0] & 0xff],
            lookup[(values[0] >> 8) & 0xff],
            lookup[(values[0] >> 16) & 0xff],
            lookup[(values[0] >> 24) & 0xff],
            lookup[values[1] & 0xff],
            lookup[(values[1] >> 8) & 0xff],
            lookup[((values[1] >> 16) & 0x0f) | 0x40],
            lookup[(values[1] >> 24) & 0xff],
            lookup[(values[2] & 0x3f) | 0x80],
            lookup[(values[2] >> 8) & 0xff],
            lookup[(values[2] >> 16) & 0xff],
            lookup[(values[2] >> 24) & 0xff],
            lookup[values[3] & 0xff],
            lookup[(values[3] >> 8) & 0xff],
            lookup[(values[3] >> 16) & 0xff],
            lookup[(values[3] >> 24) & 0xff],
        ];
        const s = [
            `${v[0]}${v[1]}${v[2]}${v[3]}`,
            `${v[4]}${v[5]}`,
            `${v[6]}${v[7]}`,
            `${v[8]}${v[9]}`,
            `${v[10]}${v[11]}${v[12]}${v[13]}${v[14]}${v[15]}`,
        ];
        const id = `${s[0]}-${s[1]}-${s[2]}-${s[3]}-${s[4]}`;
        return id;
    };
    /**
     * Determine which prng to use and return an array of four 32-bit unsigned integers.
     * @returns {[number, number, number, number]}
     */
    const getRandomValues = (() => {
        try {
            const { crypto } = window || {};
            return crypto?.getRandomValues
                ? () => {
                    const values = crypto.getRandomValues(new Uint32Array(4));
                    return Array.from(values);
                }
                : () => {
                    const rand = () => (Math.random() * 0x100000000) >>> 0;
                    return [rand(), rand(), rand(), rand()];
                };
        }
        catch (e) {
            console.log("Window/Crypto error : Falling back to Math.Random", e);
            return () => {
                const rand = () => (Math.random() * 0x100000000) >>> 0;
                return [rand(), rand(), rand(), rand()];
            };
        }
    })();
    const validator = (ids) => {
        if (!ids)
            return [];
        const re = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
        const arr = Array.isArray(ids) ? ids : [ids];
        return arr.filter((id) => id && re.test(id));
    };
    return {
        getExisting: () => [...generated],
        setExisting: (ids) => {
            const validated = validator(ids);
            if (validated.length === ids.length) {
                generated = [...validated];
                return true;
            }
            return false;
        },
        generate: () => {
            let id = null;
            const gen = () => formatUid(getRandomValues());
            while (!id || generated.includes(id))
                id = gen();
            generated.push(id);
            return id;
        },
        validate: validator,
    };
};
exports.uid = uid;
//# sourceMappingURL=uid.js.map