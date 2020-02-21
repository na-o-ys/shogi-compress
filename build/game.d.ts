import { Position } from "./position";
import { Move, ExtendedMove } from "./move";
export declare type Game = {
    positions: Position[];
    sfenPositions: string[];
    isChecked: boolean[];
    moves: Move[];
    turns: number;
};
export declare type ExtendedGame = Omit<Game, "moves"> & {
    moves: ExtendedMove[];
};
export declare type ValidateResult = Valid | Invalid;
export declare type Valid = {
    type: "valid";
};
export declare type Invalid = {
    type: "invalid";
    turn: number;
    message: string;
    validGame: ExtendedGame;
};
export declare function validateGame(game: ExtendedGame): ValidateResult;
