import { Move } from "./move";
import { Position } from "./position";
export declare type UsiEngineCommand = UsiInfoCommand | UsiBestMoveCommand;
export declare type UsiInfoCommand = {
    commandType: "info";
    depth?: number;
    seldepth?: number;
    time?: number;
    nodes?: number;
    pvSfen?: string[];
    pv?: Move[];
    multipv?: number;
    scoreCp?: number;
    scoreMate?: number;
    hashfull?: number;
    nps?: number;
};
export declare type UsiBestMoveCommand = {
    commandType: "bestMove";
    type: "resign" | "win";
} | {
    commandType: "bestMove";
    type: "move";
    move: Move;
};
export declare function parseCommand(command: string, position: Position): UsiEngineCommand | null;
export declare function convertPvToMove(pv: string[], position: Position): Move[] | null;
export declare function generateUsiCommand(hash: number, multiPv: number, sfen: string, byoyomiMs: number): string;
