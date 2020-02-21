import { Cell, Move, ExtendedMove } from "./move";
import { Piece } from "./piece";
import { Position } from "./position";
export declare function canPromote(side: "b" | "w", from: Cell, to: Cell, piece: Piece): boolean;
export declare type ValidateMoveResult = {
    type: "valid";
} | {
    type: "invalid";
    reason: string;
};
export declare function validateMove(position: Position, move: ExtendedMove): ValidateMoveResult;
export declare function getLegalMoves(position: Position): Move[];
export declare function isChecked(position: Position): boolean;
export declare function getPseudoLegalMoves(position: Position): Move[];
export declare function getPseudoLegalMovesFrom(position: Position, cell: Cell): Move[];
