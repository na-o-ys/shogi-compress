"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var piece_1 = require("./piece");
var position_1 = require("./position");
var rule_1 = require("./rule");
function createMoveFromSfen(sfen, position) {
    if (!/([1-9][a-i][1-9][a-i]\+?)|([KRBGSNLP]\*[1-9][a-i])/.test(sfen)) {
        console.error("cannot parse sfen move: " + sfen);
        return null;
    }
    var to = {
        file: sfen.charCodeAt(2) - "0".charCodeAt(0),
        rank: sfen.charCodeAt(3) - "a".charCodeAt(0) + 1
    };
    var fromHand = sfen[1] === "*";
    if (fromHand) {
        return {
            type: "move_from_hand",
            to: to,
            piece: sfen[0].toLowerCase(),
            side: position.side
        };
    }
    else {
        var from = {
            file: sfen.charCodeAt(0) - "0".charCodeAt(0),
            rank: sfen.charCodeAt(1) - "a".charCodeAt(0) + 1
        };
        var piece = position_1.getPiece(position, from);
        if (piece === null) {
            return null;
        }
        var promote = sfen[4] === "+";
        return {
            type: "move_from_cell",
            side: position.side,
            from: from,
            to: to,
            piece: piece.piece,
            promote: promote
        };
    }
}
exports.createMoveFromSfen = createMoveFromSfen;
function convertMoveToSfen(move) {
    var to = "" + move.to.file + String.fromCharCode("a".charCodeAt(0) + move.to.rank - 1);
    if (move.type === "move_from_cell") {
        var from = "" + move.from.file + String.fromCharCode("a".charCodeAt(0) + move.from.rank - 1);
        var promote = move.promote ? "+" : "";
        return "" + from + to + promote;
    }
    else {
        var piece = move.piece.toUpperCase();
        return piece + "*" + to;
    }
}
exports.convertMoveToSfen = convertMoveToSfen;
function convertMoveJp(move) {
    var side = move.side === "b" ? "▲" : "△";
    var moveTo = "" + move.to.file + move.to.rank;
    var piece = piece_1.jpPieceMap[move.piece];
    var promote = "";
    if (move.type === "move_from_cell" &&
        rule_1.canPromote(move.side, move.from, move.to, move.piece)) {
        promote = move.promote ? "成" : "不成";
    }
    var moveFrom = move.type === "move_from_cell"
        ? "(" + move.from.file + move.from.rank + ")"
        : "打";
    return side + moveTo + piece + promote + moveFrom;
}
exports.convertMoveJp = convertMoveJp;
function createExtendedMoveFromSfen(sfen, position) {
    if (sfen === "pass")
        return { type: "pass" };
    return createMoveFromSfen(sfen, position);
}
exports.createExtendedMoveFromSfen = createExtendedMoveFromSfen;
function convertExtendedMoveToSfen(move) {
    if (move.type === "pass")
        return "pass";
    return convertMoveToSfen(move);
}
exports.convertExtendedMoveToSfen = convertExtendedMoveToSfen;
