import { Game } from "../game";
export declare type ParseSuccess = {
    type: "success";
    game: Game;
};
export declare type ParseError = {
    type: "parse_error";
    message: string;
};
export declare function parseKif(text: string): ParseSuccess | ParseError;
export declare function parseCsa(text: string): ParseSuccess | ParseError;
export declare function normalizeGame(game: Game): Game;
