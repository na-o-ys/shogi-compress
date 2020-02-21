import { getTestData } from "./testdata";
import { encode, decode } from "../src";

test("v1", () => {
  for (const sfen of getTestData()) {
    const compressed = encode(sfen, "v1");
    const plain = decode(compressed);
    expect(plain).toEqual(sfen);
  }
});

test("v2", () => {
  for (const sfen of getTestData()) {
    const compressed = encode(sfen, "v2");
    const plain = decode(compressed);
    expect(plain).toEqual(sfen);
  }
});
