import {
  parseSfen,
  createMoveFromSfen,
  getInitialPosition,
  doMove,
  Move,
  convertMoveToSfen
} from "./shogi";
import { encodeCsV1, decodeCsV1 } from "./v1";
import { encodeCsV2, decodeCsV2 } from "./v2";

type Version = "v1" | "v2";

export function encode(sfenPosition: string, version: Version): string {
  const tokens = sfenPosition.split(" ");
  if (
    tokens[0] !== "position" ||
    tokens[1] !== "startpos" ||
    tokens[2] !== "moves"
  ) {
    throw new Error("sfen must start with 'sfen startpos moves ...'");
  }

  let position = getInitialPosition();
  const moves: Move[] = [];
  for (const sfenMove of tokens.slice(3)) {
    const move = createMoveFromSfen(sfenMove, position);
    if (!move) {
      throw new Error(`invalid move '${move}'`);
    }
    position = doMove(position, move);
    moves.push(move);
  }

  switch (version) {
    case "v1":
      return encodeCsV1(moves);
    case "v2":
      return encodeCsV2(moves);
  }
}

export function decode(encoded: string): string {
  const version = encoded.startsWith("csv1_")
    ? "v1"
    : encoded.startsWith("csv2_")
    ? "v2"
    : null;
  if (!version) throw "invalid format";
  const moves = version === "v1" ? decodeCsV1(encoded) : decodeCsV2(encoded);
  const sfenMoves = moves.map(convertMoveToSfen);
  return `position startpos moves ${sfenMoves.join(" ")}`;
}
