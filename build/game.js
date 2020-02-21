"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rule_1 = require("./rule");
function validateGame(game) {
    for (var i = 0; i < game.turns - 1; i++) {
        var position = game.positions[i];
        var move = game.moves[i];
        var validateMoveResult = rule_1.validateMove(position, move);
        if (validateMoveResult.type === "invalid") {
            return {
                type: "invalid",
                turn: i + 1,
                message: validateMoveResult.reason,
                validGame: {
                    positions: game.positions.slice(0, i + 1),
                    sfenPositions: game.sfenPositions.slice(0, i + 1),
                    isChecked: game.isChecked.slice(0, i + 1),
                    moves: game.moves.slice(0, i),
                    turns: i + 1
                }
            };
        }
    }
    return { type: "valid" };
}
exports.validateGame = validateGame;
