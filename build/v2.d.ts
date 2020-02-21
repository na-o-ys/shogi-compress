import { Move, Position } from "./shogi";
export declare function encodeCsV2(moves: Move[], position?: Position): string;
export declare function decodeCsV2(csV2: string, position?: Position): Move[];
