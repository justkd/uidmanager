/**
 * @file UIDManager.test.ts
 * @version 1.1.0
 * @author Cadence Holmes
 * @copyright Cadence Holmes 2023
 * @license MIT
 * @fileoverview
 * Tests for UIDManager.ts
 */

import { describe, it } from "mocha";
import { expect } from "chai";
import { UIDManager } from "../src/UIDManager";

const validHexNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const validHexLetters = ["a", "b", "c", "d", "e", "f"];

const invalidHexLetters = ["x", "y", "z", "g", "h", "i"];
const invalidHexSymbols = ["_", "+", ",", "&", "^", "%", "*", "#", "."];
const invalidHexChars = [...invalidHexSymbols, ...invalidHexLetters];

const _validKeysA = [{}, {}, { a: "A" }, { a: "A" }, [], [], [{}], [{}]];
const _validKeysB = ["", "a", 0, 1, Infinity, true, false, Symbol(), Symbol()];
const validKeys = [..._validKeysA, ..._validKeysB];

const invalidKeys = [undefined, null, NaN];

const validIds = [
  "ba7faa56-24a2-4098-9850-2cdb3d8e5e85",
  "295b66a6-830f-478c-aa02-932556f6aec4",
  "b53f621e-34d2-4edf-9ced-8f674efef33b",
  "6c855981-b6eb-4498-8145-fa483c2c6ce5",
  "33e10c00-b3f2-4929-be1d-83a63d9114ba",
  "3c7e3fe8-8da8-4369-a5fa-2f563cc7b8b8",
  "49da574b-b79d-4143-a7e5-f36fa4df62dd",
  "d1c89f8d-6096-42dc-ac1a-b29d904c3c90",
  "71e037d4-eaa5-4db8-a532-6876c2daf24f",
  "bb08f784-1b07-4e21-9d82-3b7f937f015f",
];

describe(`UIDManager.ts`, () => {
  it("should be immutable", () => {
    const manager = UIDManager();
    expect(Object.isFrozen(manager)).to.be.true;
  });

  describe(`UIDManager.validate`, () => {
    const { validate } = UIDManager();

    describe(`passing cases`, () => {
      it(`should accept a single string and return a single member array containing that string if validation is successful`, () => {
        const results = validIds.flatMap((id) => validate(id));
        expect(results).to.eql(validIds);
      });

      it(`should accept an array of strings and return an array containing all validated strings`, () => {
        const results = validate(validIds);
        expect(results).to.eql(validIds);
      });

      it(`should not care about letter case`, () => {
        const test = validIds.map((id, i) => (i % 2 ? id : id.toUpperCase()));
        expect(validate(test)).to.eql(test);
      });

      it(`should not care about mixed letter case`, () => {
        const test = validIds.map((id) => {
          const segments = id.split("-");
          return segments
            .map((segment) => {
              return segment
                .split("")
                .map((c, i) => (i % 2 ? c : c.toUpperCase()))
                .join("");
            })
            .join("-");
        });
        expect(validate(test)).to.eql(test);
      });
    });

    describe(`failing cases`, () => {
      it(`should fail if it contains any special characters other than hyphens`, () => {
        const WRONG = invalidHexSymbols.map((c, i) =>
          validIds[i].replace("-", c),
        );
        expect(validate(WRONG)).to.be.empty;
      });

      it(`should fail if not all hexadecimal characters`, () => {
        const WRONG = invalidHexChars.map((c) => validIds[0].replace("a", c));
        expect(validate(WRONG)).to.be.empty;
      });

      it(`should fail if first char of third segment is not 4`, () => {
        const valid = ["4"];
        const [s, e] = [0, 2];
        const invalid = [
          ...validHexLetters.slice(s, e),
          ...validHexNumbers.slice(s, e),
          ...invalidHexLetters.slice(s, e),
          ...invalidHexSymbols.slice(s, e),
        ].filter((c) => !valid.includes(c));
        const WRONG = validIds.map((id, i) => {
          const [a, b, c, d, f] = id.split("-");
          const thirdseg = c.split("");
          thirdseg[0] = invalid[i];
          return [a, b, thirdseg.join("-"), d, f].join("-");
        });
        expect(validate(WRONG)).to.be.empty;
      });

      it(`should fail if first char of fourth segment is not 8, 9, a, or b`, () => {
        const valid = ["8", "9", "a", "b"];
        const invalid = [
          ...validHexLetters.slice(2, 4),
          ...validHexNumbers.slice(0, 2),
          ...invalidHexLetters.slice(0, 2),
          ...invalidHexSymbols.slice(0, 2),
          "-",
        ].filter((c) => !valid.includes(c));
        const WRONG = validIds.map((id, i) => {
          const [a, b, c, d, f] = id.split("-");
          const fourthseg = d.split("");
          fourthseg[0] = invalid[i];
          return [a, b, c, fourthseg.join(""), f].join("-");
        });
        expect(validate(WRONG)).to.be.empty;
      });

      it(`should fail if segments are not the correct length`, () => {
        const lengths = [8, 4, 4, 4, 12];
        const segmented = validIds.map((id) => id.split("-"));
        const counted = segmented.flatMap((segment) => {
          const results = segment.map((s, i) => s.length === lengths[i]);
          return [...new Set(results)];
        });
        const result = [...new Set(counted)];
        expect(result).to.eql([true]);
      });
    });
  });

  describe(`UIDManager.generateUIDFor`, () => {
    it(`should generate identifiers and store object associations in the internal map`, () => {
      const manager = UIDManager();
      expect(manager.entries()).to.be.empty;
      validKeys.forEach(manager.generateUIDFor);
      expect(manager.entries().length).to.eql(validKeys.length);
      expect(manager.keys()).to.eql(validKeys);
    });

    it(`should ensure all uids are always unique`, () => {
      const manager = UIDManager();
      const testLen = 1_000;
      const test = Array(testLen).fill(0).map(manager.generateUIDFor);
      expect([...new Set(test)].length).to.eql(testLen);
    });

    it(`should throw if undefined, null, or nan are given as keys`, () => {
      const manager = UIDManager();
      invalidKeys.forEach((k) => {
        expect(manager.generateUIDFor(k)).to.throw;
      });
    });

    it(`should re-generate a new uid association if a given key already exists`, () => {
      const manager = UIDManager();
      expect(manager.entries()).to.be.empty;
      const prev = validKeys.map(manager.generateUIDFor);
      const next = validKeys.map(manager.generateUIDFor);
      expect(manager.keys()).to.eql(validKeys);
      expect(manager.uids()).to.eql(next);
      expect(manager.uids()).to.not.eql(prev);
    });
  });

  describe(`UIDManager.getUIDFor`, () => {
    it(`should return the paired uid for a given key`, () => {
      const manager = UIDManager();
      const generated = validKeys.map(manager.generateUIDFor);
      const retrieved = validKeys.map(manager.getUIDFor);
      const results = retrieved.map((r, i) => r === generated[i]);
      expect([...new Set(results)]).to.eql([true]);
    });
  });

  describe(`UIDManager.getKeyFor`, () => {
    it(`should return the paired key (by reference) for a given uid`, () => {
      const manager = UIDManager();
      const generated = validKeys.map(manager.generateUIDFor) as string[];
      const retrieved = generated.map(manager.getKeyFor);
      const results = retrieved.map((r, i) => r === validKeys[i]);
      expect([...new Set(results)]).to.eql([true]);
    });
  });

  describe(`UIDManager.hasUIDFor`, () => {
    it(`should return true if a uid has been generated for a given key`, () => {
      const manager = UIDManager();
      validKeys.forEach(manager.generateUIDFor);
      const results = validKeys.map(manager.hasUIDFor);
      expect([...new Set(results)]).to.eql([true]);
    });

    it(`should return false if a uid has NOT been generated for a given key`, () => {
      const manager = UIDManager();
      const results = validKeys.map(manager.hasUIDFor);
      expect(results.length).to.eql(validKeys.length);
      expect([...new Set(results)]).to.eql([false]);
    });
  });

  describe(`UIDManager.hasKeyFor`, () => {
    it(`should return true if a key can be found for a given uid`, () => {
      const manager = UIDManager();
      const generated = validKeys.map(manager.generateUIDFor) as string[];
      const results = generated.map(manager.hasKeyFor);
      console.log(generated);
      console.log(results);
      expect(results.length).to.eql(validKeys.length);
      expect([...new Set(results)]).to.eql([true]);
    });

    it(`should return false if a key can NOT be found for a given uid`, () => {
      const manager = UIDManager();
      const results = validIds.map(manager.hasKeyFor);
      expect(results.length).to.eql(validIds.length);
      expect([...new Set(results)]).to.eql([false]);
    });
  });

  describe(`UIDManager.keys`, () => {
    it(`should return an array with all stored keys`, () => {
      const manager = UIDManager();
      validKeys.forEach(manager.generateUIDFor);
      expect(manager.keys()).to.eql(validKeys);
    });
  });

  describe(`UIDManager.uids`, () => {
    it(`should return an array with all stored uids`, () => {
      const manager = UIDManager();
      const generated = validKeys.map(manager.generateUIDFor);
      expect(manager.uids()).to.eql(generated);
    });
  });

  describe(`UIDManager.entries`, () => {
    it(`should return an array of stored entries (key/value pairs [k, v])`, () => {
      const manager = UIDManager();
      const generated = validKeys.map(manager.generateUIDFor);
      const entries = manager.entries();
      const keys = entries.map(([k]) => k);
      const values = entries.map(([_, v]) => v);
      expect(keys).to.eql(validKeys);
      expect(values).to.eql(generated);
    });
  });

  describe(`UIDManager.restore`, () => {
    it(`should replace the internal map with the provided entries`, () => {
      const manager = UIDManager();
      validKeys.forEach(manager.generateUIDFor);

      const prev = [...manager.entries()];
      const next = validKeys.map(manager.generateUIDFor);
      expect(manager.keys()).to.eql(validKeys);
      expect(manager.uids()).to.eql(next);
      expect(manager.entries()).to.not.eql(prev);

      manager.restore(prev);
      expect(manager.keys()).to.eql(validKeys);
      expect(manager.entries()).to.eql(prev);
    });
  });

  describe(`UIDManager.set`, () => {
    it(`should set a single key/value uid association returning true if successful`, () => {
      const manager = UIDManager();
      validKeys.forEach(manager.generateUIDFor);
      const entries = manager.entries();

      const manager2 = UIDManager();
      expect(manager2.entries()).to.be.empty;
      const results = entries.map((e) => manager2.set(e));
      expect(manager2.entries()).to.eql(entries);
      expect([...new Set(results)]).to.eql([true]);
    });
  });

  describe(`UIDManager.deleteUID`, () => {
    it(`should delete a key/value uid association for a given uid and return true on success`, () => {
      const manager = UIDManager();
      validKeys.forEach(manager.generateUIDFor);
      const results = manager.uids().map(manager.deleteUID);
      expect(manager.entries()).to.be.empty;
      expect([...new Set(results)]).to.eql([true]);
    });
  });

  describe(`UIDManager.deleteUIDFor`, () => {
    it(`should delete a key/value uid association for a given key and return true on success`, () => {
      const manager = UIDManager();
      validKeys.forEach(manager.generateUIDFor);
      expect(manager.entries().length).to.eql(validKeys.length);
      const results = manager.keys().map(manager.deleteUIDFor);
      expect(manager.entries()).to.be.empty;
      expect([...new Set(results)]).to.eql([true]);
    });
  });

  describe(`UIDManager.deleteAll`, () => {
    it(`should delete all previously store associations`, () => {
      const manager = UIDManager();
      validKeys.forEach(manager.generateUIDFor);
      expect(manager.entries().length).to.eql(validKeys.length);
      manager.deleteAll();
      expect(manager.entries()).to.be.empty;
    });
  });

  describe(`UIDManager.getMap`, () => {
    it(`should return a REFERENCE to the internal map object`, () => {
      const manager = UIDManager();
      const map1 = manager.getMap();
      expect(map1.size).to.eql(0);
      validKeys.forEach(manager.generateUIDFor);
      expect(map1.size).to.eql(validKeys.length);
      const map2 = manager.getMap();
      expect(map1).to.equal(map2);
    });
  });
});
