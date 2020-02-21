import { Move, Position } from "./shogi";
export declare function encodeCsV1(moves: Move[], position?: Position): string;
export declare function decodeCsV1(csV1: string, position?: Position): Move[];
