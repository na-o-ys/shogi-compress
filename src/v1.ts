import deepEqual from "deep-equal";
import {
  doMove,
  getInitialPosition,
  getPseudoLegalMovesFrom,
  Move,
  Piece,
  Position
} from "./shogi";

const Header = "csv1_";
const Alphabet =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_~.";
const MoveFromHandPatterns = 7 * 81;
const MoveToPatterns = 32; // 11に生飛車がいる場合、成不成あわせて 8*2+8*2=32
const MoveHandPieces = "plnsgbr";

export function encodeCsV1(
  moves: Move[],
  position: Position = getInitialPosition()
): string {
  const moveIds: number[] = [];
  for (const move of moves) {
    if (move.type === "move_from_cell") {
      const fromIndex = (move.from.file - 1) * 9 + (move.from.rank - 1);
      const legalMoves = getPseudoLegalMovesFrom(position, move.from);
      const moveToIndex = legalMoves.findIndex(m => deepEqual(m, move));
      if (moveToIndex < 0) throw "unexpected error";
      moveIds.push(
        MoveFromHandPatterns + fromIndex * MoveToPatterns + moveToIndex
      );
    }
    if (move.type === "move_from_hand") {
      const toIndex = (move.to.file - 1) * 9 + (move.to.rank - 1);
      moveIds.push(MoveHandPieces.indexOf(move.piece) + toIndex * 7);
    }
    position = doMove(position, move);
  }
  return (
    Header +
    moveIds
      .map(id => {
        const s1 = Alphabet[Math.floor(id / Alphabet.length)];
        const s2 = Alphabet[id % Alphabet.length];
        if (s1 === undefined || s2 === undefined) throw "unexpected error";
        return s1 + s2;
      })
      .join("")
  );
}

export function decodeCsV1(
  csV1: string,
  position: Position = getInitialPosition()
): Move[] {
  if (!csV1.startsWith(Header)) throw "invalid format";
  const encoded = csV1.slice(Header.length);
  if (encoded.length % 2 !== 0) throw "invalid format";
  const l = encoded.length / 2;

  const moves: Move[] = [];
  for (let i = 0; i < l; i++) {
    const s1 = encoded[i * 2];
    const s2 = encoded[i * 2 + 1];
    let moveId = Alphabet.indexOf(s1) * Alphabet.length + Alphabet.indexOf(s2);

    if (moveId < MoveFromHandPatterns) {
      const toIndex = Math.floor(moveId / 7);
      const piece = MoveHandPieces[moveId % 7] as Piece;
      const move: Move = {
        type: "move_from_hand",
        piece,
        to: {
          file: Math.floor(toIndex / 9) + 1,
          rank: (toIndex % 9) + 1
        },
        side: position.side
      };
      moves.push(move);
      position = doMove(position, move);
    } else {
      moveId = moveId - MoveFromHandPatterns;
      const fromIndex = Math.floor(moveId / MoveToPatterns);
      const moveToIndex = moveId % MoveToPatterns;
      const from = {
        file: Math.floor(fromIndex / 9) + 1,
        rank: (fromIndex % 9) + 1
      };
      const legalMoves = getPseudoLegalMovesFrom(position, from);
      const move = legalMoves[moveToIndex];
      if (move === undefined) throw "invalid format";
      moves.push(move);
      position = doMove(position, move);
    }
  }

  return moves;
}
