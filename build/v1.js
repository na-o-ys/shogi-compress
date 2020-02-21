"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var deep_equal_1 = __importDefault(require("deep-equal"));
var shogi_1 = require("./shogi");
var Header = "csv1_";
var Alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_~.";
var MoveFromHandPatterns = 7 * 81;
var MoveToPatterns = 32; // 11に生飛車がいる場合、成不成あわせて 8*2+8*2=32
var MoveHandPieces = "plnsgbr";
function encodeCsV1(moves, position) {
    if (position === void 0) { position = shogi_1.getInitialPosition(); }
    var moveIds = [];
    var _loop_1 = function (move) {
        if (move.type === "move_from_cell") {
            var fromIndex = (move.from.file - 1) * 9 + (move.from.rank - 1);
            var legalMoves = shogi_1.getPseudoLegalMovesFrom(position, move.from);
            var moveToIndex = legalMoves.findIndex(function (m) { return deep_equal_1.default(m, move); });
            if (moveToIndex < 0)
                throw "unexpected error";
            moveIds.push(MoveFromHandPatterns + fromIndex * MoveToPatterns + moveToIndex);
        }
        if (move.type === "move_from_hand") {
            var toIndex = (move.to.file - 1) * 9 + (move.to.rank - 1);
            moveIds.push(MoveHandPieces.indexOf(move.piece) + toIndex * 7);
        }
        position = shogi_1.doMove(position, move);
    };
    for (var _i = 0, moves_1 = moves; _i < moves_1.length; _i++) {
        var move = moves_1[_i];
        _loop_1(move);
    }
    return (Header +
        moveIds
            .map(function (id) {
            var s1 = Alphabet[Math.floor(id / Alphabet.length)];
            var s2 = Alphabet[id % Alphabet.length];
            if (s1 === undefined || s2 === undefined)
                throw "unexpected error";
            return s1 + s2;
        })
            .join(""));
}
exports.encodeCsV1 = encodeCsV1;
function decodeCsV1(csV1, position) {
    if (position === void 0) { position = shogi_1.getInitialPosition(); }
    if (!csV1.startsWith(Header))
        throw "invalid format";
    var encoded = csV1.slice(Header.length);
    if (encoded.length % 2 !== 0)
        throw "invalid format";
    var l = encoded.length / 2;
    var moves = [];
    for (var i = 0; i < l; i++) {
        var s1 = encoded[i * 2];
        var s2 = encoded[i * 2 + 1];
        var moveId = Alphabet.indexOf(s1) * Alphabet.length + Alphabet.indexOf(s2);
        if (moveId < MoveFromHandPatterns) {
            var toIndex = Math.floor(moveId / 7);
            var piece = MoveHandPieces[moveId % 7];
            var move = {
                type: "move_from_hand",
                piece: piece,
                to: {
                    file: Math.floor(toIndex / 9) + 1,
                    rank: (toIndex % 9) + 1
                },
                side: position.side
            };
            moves.push(move);
            position = shogi_1.doMove(position, move);
        }
        else {
            moveId = moveId - MoveFromHandPatterns;
            var fromIndex = Math.floor(moveId / MoveToPatterns);
            var moveToIndex = moveId % MoveToPatterns;
            var from = {
                file: Math.floor(fromIndex / 9) + 1,
                rank: (fromIndex % 9) + 1
            };
            var legalMoves = shogi_1.getPseudoLegalMovesFrom(position, from);
            var move = legalMoves[moveToIndex];
            if (move === undefined)
                throw "invalid format";
            moves.push(move);
            position = shogi_1.doMove(position, move);
        }
    }
    return moves;
}
exports.decodeCsV1 = decodeCsV1;
