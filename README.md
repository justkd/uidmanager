# [@justkd/uidmanager](https://github.com/justkd/uidmanager)

![CircleCI](https://img.shields.io/circleci/build/gh/justkd/uidmanager/master?token=2edcfec5c13eaf6d951a8f2939b220cdca74644c&style=for-the-badge&logo=circleci)

Generate RFC4122 version 4 compliant unique identifiers and associate them with entities in a `map`. Guarantees the generated identifier is unique compared to all other previously stored keys. Export and restore the map entities to facilitate persistence. Validates external UIDs for compliance and uniqueness.

## Install

```
npm i @justkd/uidmanager
```
```
yarn add @justkd/uidmanager
```

## Use

```
import { UIDManager } from '@justkd/uidmanager'
import type { UIDManagerInterface } from '@justkd/uidmanager'

const manager: UIDManagerInterface = UIDManager()
const key = 'keys can be anything except null, undefined, or NaN'
const uid = manager.generateUIDFor(key)
```

## Quick Docs

```
/* Validate strings as RFC4122 version 4 compliant unique identifiers. */
validate: (uids: null | string | (string | null)[]) => string[] | null;

/* Generate a unique identifier and associate it with the provided key. */
generateUIDFor: (key: any) => string | null;

/* Retrieve the UID string for the associated object. */
getUIDFor: (key: any) => string | undefined;

/* Retrieve the key for the associated UID string. */
getKeyFor: (uid: string) => any;

/* Check if there is an existing UID for the target object. */
hasUIDFor: (key: any) => boolean;

/* Check if there is an existing key for the target UID. */
hasKeyFor: (uid: string) => boolean;

/*  Retrieve a new array containing all keys held in the map. */
keys: () => any[];

/* Retrieve a new array containing all values (uids) held in the map. */
uids: () => string[];

/* Retrieve a new array containing [key, value] arrays for each entry. */
entries: () => [any, string][];

/* Replace the current map with a new set of entries. */
restore: (entries: [any, string][]) => boolean | null;

/* Manually set a new UID association. */
set: (entry: [any, string]) => boolean | null;

/* Delete a UID association for a given UID string. */
deleteUID: (uid: string) => boolean | null;

/* Delete a UID association for a given key. */
deleteUIDFor: (key: any) => boolean | null;

/* Clear all currently held target:UID associations. */
deleteAll: () => void;

/* Retrieve a reference to the internal map object. */
getMap: () => Map<any, string>;
```