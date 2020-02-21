export declare type Piece = keyof typeof jpPieceMap;
export declare type PieceOnBoard = {
    piece: Piece;
    side: "b" | "w";
};
export declare function convertToRawPiece(piece: Piece): Piece;
export declare const jpPieceMap: {
    p: string;
    l: string;
    n: string;
    s: string;
    g: string;
    b: string;
    r: string;
    k: string;
    "+p": string;
    "+l": string;
    "+n": string;
    "+s": string;
    "+b": string;
    "+r": string;
};
