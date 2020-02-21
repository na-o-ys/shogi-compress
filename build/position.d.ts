import { Cell, ExtendedMove, Move } from "./move";
import { Piece, PieceOnBoard } from "./piece";
export declare type Position = {
    cells: Array<Array<PieceOnBoard | null>>;
    side: "b" | "w";
    hand: {
        b: Hand;
        w: Hand;
    };
    lastMove?: Move;
};
export declare type Hand = {
    [key in Piece]: number;
};
export declare function parseSfen(sfen: string): Position | null;
export declare function generateSfen(position: Position): string;
export declare function doMove(currentPosition: Position, move: ExtendedMove): Position;
export declare function getPiece(position: Position, cell: Cell): PieceOnBoard | null;
export declare function setPiece(position: Position, cell: Cell, piece: PieceOnBoard | null): void;
export declare function getEmptyHand(): Hand;
export declare function getEmptyPosition(): Position;
export declare function getInitialPosition(): Position;
