import bigInt from "big-integer";
import deepEqual from "deep-equal";
import {
  doMove,
  getInitialPosition,
  getPseudoLegalMoves,
  Move,
  Position
} from "./shogi";

const Header = "csv2_";
const Alphabet =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_~.";
const AlphLen = Alphabet.length;

export function encodeCsV2(
  moves: Move[],
  position: Position = getInitialPosition()
): string {
  const moveIds: number[] = [];
  for (const move of moves) {
    const moveId = getPseudoLegalMoves(position).findIndex(m =>
      deepEqual(m, move)
    );
    if (moveId < 0) throw "unexpeced error";
    moveIds.push(moveId);
    position = doMove(position, move);
  }

  let v = bigInt(1);
  for (const id of moveIds) {
    if (id < 128) {
      v = v.shiftLeft(1);
      v = v.shiftLeft(7);
      v = v.add(id);
    } else {
      v = v.shiftLeft(1);
      v = v.add(1);
      v = v.shiftLeft(10);
      v = v.add(id);
    }
  }
  return Header + v.toString(AlphLen, Alphabet);
}

export function decodeCsV2(
  csV2: string,
  position: Position = getInitialPosition()
): Move[] {
  if (!csV2.startsWith(Header)) throw "invalid format";
  const encoded = csV2.slice(Header.length);
  const v = bigInt(encoded, AlphLen, Alphabet, true).toArray(2).value;
  const moves: Move[] = [];
  let i = 1;
  while (i < v.length) {
    const legalMoves = getPseudoLegalMoves(position);

    const bitLen = v[i] === 0 ? 7 : 10;
    const moveId = bigInt
      .fromArray(v.slice(i + 1, i + 1 + bitLen), 2)
      .toJSNumber();
    const move = legalMoves[moveId];

    i = i + 1 + bitLen;
    if (move === undefined) throw "invalid format";

    moves.push(move);
    position = doMove(position, move);
  }

  return moves;
}
