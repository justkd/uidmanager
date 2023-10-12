"use strict";
/**
 * @file @justkd/uid.ts
 * @version 1.1.0
 * @author Cadence Holmes
 * @copyright Cadence Holmes 2023
 * @license MIT
 * @fileoverview `export const uid`
 * Generate RFC4122 version 4 compliant unique identifiers
 * using pseudo-random values from `window.crypto` (with a
 * fallback to `Math.Random`). A pre-generated lookup table
 * is used for performance optimization, and generated UIDs
 * are checked against an array of previously generated UIDs
 * to ensure uniqueness.
 * @note Based on discussions found here:
 * https://stackoverflow.com/questions/105034/create-guid-uid-in-javascript
 */Object.defineProperty(exports,"__esModule",{value:!0}),exports.uid=void 0;const uid=uids=>{let generated=uids||[];const lookup=Array(256).fill(null).map(((_,i)=>(i<16?"0":"")+i.toString(16))),formatUid=values=>{const v=[lookup[255&values[0]],lookup[values[0]>>8&255],lookup[values[0]>>16&255],lookup[values[0]>>24&255],lookup[255&values[1]],lookup[values[1]>>8&255],lookup[values[1]>>16&15|64],lookup[values[1]>>24&255],lookup[63&values[2]|128],lookup[values[2]>>8&255],lookup[values[2]>>16&255],lookup[values[2]>>24&255],lookup[255&values[3]],lookup[values[3]>>8&255],lookup[values[3]>>16&255],lookup[values[3]>>24&255]],s=[`${v[0]}${v[1]}${v[2]}${v[3]}`,`${v[4]}${v[5]}`,`${v[6]}${v[7]}`,`${v[8]}${v[9]}`,`${v[10]}${v[11]}${v[12]}${v[13]}${v[14]}${v[15]}`];return`${s[0]}-${s[1]}-${s[2]}-${s[3]}-${s[4]}`},getRandomValues=(()=>{try{const{crypto:crypto}=window||{};return crypto?.getRandomValues?()=>{const values=crypto.getRandomValues(new Uint32Array(4));return Array.from(values)}:()=>{const rand=()=>4294967296*Math.random()>>>0;return[rand(),rand(),rand(),rand()]}}catch(e){return console.log("Window/Crypto error : Falling back to Math.Random",e),()=>{const rand=()=>4294967296*Math.random()>>>0;return[rand(),rand(),rand(),rand()]}}})(),validator=ids=>{if(!ids)return[];const re=/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;return(Array.isArray(ids)?ids:[ids]).filter((id=>id&&re.test(id)))};return{getExisting:()=>[...generated],setExisting:ids=>{const validated=validator(ids);return validated.length===ids.length&&(generated=[...validated],!0)},generate:()=>{let id=null;const gen=()=>formatUid(getRandomValues());for(;!id||generated.includes(id);)id=gen();return generated.push(id),id},validate:validator}};exports.uid=uid;