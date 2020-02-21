"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var big_integer_1 = __importDefault(require("big-integer"));
var deep_equal_1 = __importDefault(require("deep-equal"));
var shogi_1 = require("./shogi");
var Header = "csv2_";
var Alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_~.";
var AlphLen = Alphabet.length;
function encodeCsV2(moves, position) {
    if (position === void 0) { position = shogi_1.getInitialPosition(); }
    var moveIds = [];
    var _loop_1 = function (move) {
        var moveId = shogi_1.getPseudoLegalMoves(position).findIndex(function (m) {
            return deep_equal_1.default(m, move);
        });
        if (moveId < 0)
            throw "unexpeced error";
        moveIds.push(moveId);
        position = shogi_1.doMove(position, move);
    };
    for (var _i = 0, moves_1 = moves; _i < moves_1.length; _i++) {
        var move = moves_1[_i];
        _loop_1(move);
    }
    var v = big_integer_1.default(1);
    for (var _a = 0, moveIds_1 = moveIds; _a < moveIds_1.length; _a++) {
        var id = moveIds_1[_a];
        if (id < 128) {
            v = v.shiftLeft(1);
            v = v.shiftLeft(7);
            v = v.add(id);
        }
        else {
            v = v.shiftLeft(1);
            v = v.add(1);
            v = v.shiftLeft(10);
            v = v.add(id);
        }
    }
    return Header + v.toString(AlphLen, Alphabet);
}
exports.encodeCsV2 = encodeCsV2;
function decodeCsV2(csV2, position) {
    if (position === void 0) { position = shogi_1.getInitialPosition(); }
    if (!csV2.startsWith(Header))
        throw "invalid format";
    var encoded = csV2.slice(Header.length);
    var v = big_integer_1.default(encoded, AlphLen, Alphabet, true).toArray(2).value;
    var moves = [];
    var i = 1;
    while (i < v.length) {
        var legalMoves = shogi_1.getPseudoLegalMoves(position);
        var bitLen = v[i] === 0 ? 7 : 10;
        var moveId = big_integer_1.default
            .fromArray(v.slice(i + 1, i + 1 + bitLen), 2)
            .toJSNumber();
        var move = legalMoves[moveId];
        i = i + 1 + bitLen;
        if (move === undefined)
            throw "invalid format";
        moves.push(move);
        position = shogi_1.doMove(position, move);
    }
    return moves;
}
exports.decodeCsV2 = decodeCsV2;
