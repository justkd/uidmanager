/**
 * @file uid.test.ts
 * @version 1.0.0
 * @author Cadence Holmes
 * @copyright Cadence Holmes 2023
 * @license MIT
 * @fileoverview
 * Tests for uid.ts
 */

import { describe, it } from "mocha";
import { expect } from "chai";
import { uid } from "../src/uid";

/**
 * Use long form logic to check that a string is a RFC 4122 Version 4 unique identifier.
 *
 * - RFC 4122 Version 4 identifiers should include five segments separated by hyphens.
 * - The segment lengths should be `[8, 4, 4, 4, 12]` in that order and should only
 * include hexadecimal characters (0-9 or A-F).
 * - The four most significant bits of the 7th byte should be `0100'B`, so the first
 * character of the third segment is always `4`.
 * - The two most significant bits of the 9th byte should be `10'B`, so the first
 * character of the fourth segment is always one of `8`, `9`, `A`, or `B`.
 */
export const longFormValidator: (uid: string | null) => boolean = (
  uid: string | null,
) => {
  if (!uid) return false;

  /**
   * Short regexp to ensure a segment comprises of only hexadecimal characters and
   * is of the the correct length.
   * @param {number} len - Expected length for the given segment.
   */
  const re = (len: number) => new RegExp(`^[0-9A-F]{${len}}$`, "i");

  /**
   * Segments should be separated by hyphens `-`.
   */
  const arr: string[] = uid.split("-");

  /**
   * Five segments with their expected lengths.
   */
  const segs: ({ seg: string; len: number } | boolean)[] = [
    { seg: arr[0], len: 8 },
    { seg: arr[1], len: 4 },
    { seg: arr[2], len: 4 },
    { seg: arr[3], len: 4 },
    { seg: arr[4], len: 12 },
  ];

  /**
   * Segments one, two, and five should be of lengths `[8, 4, 12]` respectively, and
   * only need to be comprised of hexadecimal characters with no other requirements.
   */
  [0, 1, 4].forEach((index) => {
    const seg = segs[index] as { seg: string; len: number };
    segs[index] = re(seg.len).test(seg.seg);
  });

  /**
   * The third segment should be length `4`, comprised of hexadecimal characters, and
   * always begin with the character `4`.
   */
  segs[2] = (() => {
    const seg = segs[2] as { seg: string; len: number };
    const allHex = re(seg.len).test(seg.seg);
    const firstChar = seg.seg.split("")[0];
    const checkFirstChar = firstChar === "4";
    return allHex && checkFirstChar;
  })();

  /**
   * The fourth segment should be length `4`, comprised of hexadecimal characters, and
   * always begin with a character `8`, `9`, `A`, or `B`.
   */
  segs[3] = (() => {
    const seg = segs[3] as { seg: string; len: number };
    const allHex = re(seg.len).test(seg.seg);
    const firstChar = seg.seg.split("")[0];
    const checkFirstChar = ["8", "9", "A", "B"]
      .map((char) => firstChar === char)
      .includes(true);
    return allHex && checkFirstChar;
  })();

  /**
   * Return `true` unless any segment failed its test.
   */
  return (() => {
    segs.forEach((seg) => {
      if (!(seg as boolean)) return false;
    });
    return true;
  })();
};

describe("uid.ts", () => {
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

  describe("uid.validate", () => {
    it("should VALIDATE a single string as a RFC4122 version 4 compliant unique identifier and return an array with the valid string", () => {
      const generator = uid();
      const ids = [...validIds];
      ids.forEach((id) => {
        const validated = generator.validate(id);
        expect(validated).to.eql([id]);
      });
    });

    it("should VALIDATE an ARRAY of strings as RFC4122 version 4 compliant unique identifiers and return an array with any valid strings", () => {
      const ids = [...validIds];
      const validated = uid().validate(ids);
      expect(validated.length).to.equal(ids.length);
    });
  });

  describe("uid.generate", () => {
    it("should GENERATE valid RFC4122 version 4 compliant unique identifiers", () => {
      const generator = uid();
      Array(10)
        .fill(generator.generate())
        .forEach((id) => {
          expect(longFormValidator(id)).to.be.true;
        });
    });

    it("should ALWAYS generate UNIQUE identifiers", () => {
      const generator = uid();
      const ids = Array(1000)
        .fill(0)
        .map(() => generator.generate());
      const filtered = [...new Set(ids)];
      expect(filtered.length).to.equal(ids.length);
    });
  });

  describe("uid.getExisting", () => {
    it("should return the current list of generated uids", () => {
      const generator = uid();
      const ids = Array(10)
        .fill(0)
        .map(() => generator.generate());
      const retrieved = generator.getExisting();
      expect(retrieved).to.eql(ids);
    });
  });

  describe("uid.setExisting", () => {
    it("should return true on success", () => {
      const generator = uid();
      Array(10)
        .fill(0)
        .map(() => generator.generate());
      const success = generator.setExisting(validIds);
      expect(success).to.be.true;
    });

    it("should return false on failure", () => {
      const ids = Array(10).fill(String(Math.random()));
      const success = uid().setExisting(ids);
      expect(success).to.be.false;
    });

    it("should replace the internal store with the new array", () => {
      const generator = uid();
      const ids = Array(10)
        .fill(0)
        .map(() => generator.generate());
      const success = generator.setExisting(validIds);
      const retrieved = generator.getExisting();
      expect(success).to.be.true;
      expect(retrieved).to.eql(validIds).but.not.eql(ids);
    });
  });
});
