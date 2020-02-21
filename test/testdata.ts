import { readFileSync } from "fs";
import path from "path";

export function getTestData(): string[] {
  return readFileSync(path.join(__dirname, "sfen.txt"))
    .toString()
    .split("\n");
}
