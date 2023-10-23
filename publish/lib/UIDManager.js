"use strict";
/**
 * @file UIDManager.ts
 * @version 1.2.0
 * @author Cadence Holmes
 * @copyright Cadence Holmes 2023
 * @license MIT
 * @fileoverview `export const UIDManager`
 * Generate RFC4122 version 4 compliant unique identifiers
 * and associate them with entities in a `map`.
 */Object.defineProperty(exports,"__esModule",{value:!0}),exports.UIDManager=void 0;const uid_1=require("./uid"),onError=(name,e,msg)=>{const label=`UIDManager.${name}`,message=msg?` : ${msg}`:"";console.groupCollapsed(`${label}${message}`),console.log(e),console.groupEnd()},defaultMsg="All values must be valid RFC4122 version 4 compliant unique identifiers.",UIDManager=()=>{const generator=(0,uid_1.uid)(),map=new Map,self={validate:uids=>{try{return generator.validate(uids)}catch(e){return onError("validate",e,defaultMsg),null}},generateUIDFor:key=>{try{if(void 0===key)throw new Error("Keys must not be undefined.");if(null===key)throw new Error("Keys must not be null.");if(Number.isNaN(key))throw new Error("Keys must not be NaN.");map.has(key)&&map.delete(key);const uid=generator.generate();return map.set(key,uid),uid}catch(e){return onError("generateUIDFor",e),null}},getUIDFor:key=>map.get(key),getKeyFor:uid=>{try{const entries=[...map.entries()],i=entries.findIndex((e=>uid===e[1]));if(i<0)return;return entries[i][0]}catch(e){return onError("getKeyFor",e),null}},hasUIDFor:key=>map.has(key),hasKeyFor:uid=>[...map.values()].includes(uid),keys:()=>[...map.keys()],uids:()=>[...map.values()],entries:()=>[...map.entries()],restore:entries=>{try{const $entries=entries.map((([k,v])=>[k,v.toLowerCase()])),bank=[];return!!$entries.every((([k,v],i)=>{if(bank.includes(v)){const msg=`Duplicate UID found: ${v}.`;return onError("restore",new Error(`Invalid entry [${k}, ${v}] at index ${i}`),msg),!1}if(bank.push(v),!generator.validate(v)){return onError("restore",new Error(`Invalid entry [${k}, ${v}] at index ${i}`),defaultMsg),!1}if(null==k||Number.isNaN(k)){const msg="Keys must not be null, undefined, or NaN.";return onError("restore",new Error(`Invalid entry [${k}, ${v}] at index ${i}`),msg),!1}return!0}))&&(map.clear(),generator.setExisting($entries.map((entry=>entry[1]))),$entries.forEach((([k,v])=>map.set(k,v))),!0)}catch(e){return onError("restore",e),null}},set:entry=>{try{const[k,v]=[entry[0],entry[1].toLowerCase()];if(!generator.validate(v)){const err=`Invalid entry [${k}, ${v}]`;return onError("set",new Error(err),defaultMsg),!1}if(null==k||Number.isNaN(k)){const err=`Invalid entry [${k}, ${v}]`,msg="Keys must not be null, undefined, or NaN.";return onError("set",new Error(err),msg),!1}if((()=>{const values=[...map.values()],{getExisting:getExisting}=generator;return values.includes(v)||getExisting().includes(v)})()){const err=`Invalid entry [${k}, ${v}]`,msg="UID already exists.";return onError("set",new Error(err),msg),!1}return map.has(k)&&map.delete(k),map.set(k,v),!0}catch(e){return onError("set",e),null}},deleteUID:uid=>{try{const entries=[...map.entries()],i=entries.findIndex((e=>uid===e[1]));if(i<0)return!1;const k=entries[i][0];return map.delete(k)}catch(e){return onError("deleteUID",e),null}},deleteUIDFor:key=>{try{return map.has(key)&&map.delete(key)}catch(e){return onError("deleteUIDFor",e),null}},deleteAll:()=>map.clear(),getMap:()=>map};return Object.freeze(self)};exports.UIDManager=UIDManager;