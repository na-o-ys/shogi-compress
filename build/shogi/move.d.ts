import { Piece } from "./piece";
import { Position } from "./position";
export declare type Move = MoveFromCell | MoveFromHand;
export declare type MoveFromCell = {
    type: "move_from_cell";
    side: "b" | "w";
    piece: Piece;
    from: Cell;
    to: Cell;
    promote: boolean;
};
export declare type MoveFromHand = {
    type: "move_from_hand";
    side: "b" | "w";
    piece: Piece;
    to: Cell;
};
export declare type Cell = {
    file: number;
    rank: number;
};
export declare type ExtendedMove = Move | {
    type: "pass";
};
export declare function createMoveFromSfen(sfen: string, position: Position): Move | null;
export declare function convertMoveToSfen(move: Move): string;
export declare function convertMoveJp(move: Move): string;
export declare function createExtendedMoveFromSfen(sfen: string, position: Position): ExtendedMove | null;
export declare function convertExtendedMoveToSfen(move: ExtendedMove): string;
