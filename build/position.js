"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var piece_1 = require("./piece");
var sfen_parser_1 = require("./sfen-parser");
function parseSfen(sfen) {
    try {
        var parsed = sfen_parser_1.parse(sfen);
        return __assign({}, parsed);
    }
    catch (e) {
        console.error(e);
        return null;
    }
}
exports.parseSfen = parseSfen;
function generateSfen(position) {
    var board = position.cells
        .map(function (row) {
        var rowStr = [];
        for (var _i = 0, row_1 = row; _i < row_1.length; _i++) {
            var cell = row_1[_i];
            if (cell === null) {
                if (typeof rowStr[rowStr.length - 1] === "number") {
                    rowStr[rowStr.length - 1] += 1;
                }
                else {
                    rowStr.push(1);
                }
            }
            else {
                var p = cell.side === "b" ? cell.piece.toUpperCase() : cell.piece;
                rowStr.push(p);
            }
        }
        return rowStr.join("");
    })
        .join("/");
    var ps = ["p", "l", "n", "s", "g", "b", "r", "k"];
    var bhand = ps
        .map(function (p) {
        if (position.hand.b[p] === 0)
            return "";
        if (position.hand.b[p] === 1)
            return p.toUpperCase();
        return "" + position.hand.b[p] + p.toUpperCase();
    })
        .join("");
    var whand = ps
        .map(function (p) {
        if (position.hand.w[p] === 0)
            return "";
        if (position.hand.w[p] === 1)
            return p;
        return "" + position.hand.w[p] + p;
    })
        .join("");
    var hand = bhand + whand;
    if (hand.length === 0)
        hand = "-";
    return [board, position.side, hand, "1"].join(" ");
}
exports.generateSfen = generateSfen;
function doMove(currentPosition, move) {
    try {
        var position = JSON.parse(JSON.stringify(currentPosition));
        position.side = position.side === "b" ? "w" : "b";
        if (move.type === "pass")
            return __assign(__assign({}, position), { lastMove: undefined });
        if (move.type === "move_from_hand") {
            position.hand[move.side][move.piece] -= 1;
            setPiece(position, move.to, { piece: move.piece, side: move.side });
        }
        else {
            setPiece(position, move.from, null);
            var piece = JSON.parse(JSON.stringify(move.piece));
            if (move.promote) {
                piece = "+" + piece;
            }
            var originalPiece = getPiece(position, move.to);
            if (originalPiece) {
                position.hand[move.side][piece_1.convertToRawPiece(originalPiece.piece)] += 1;
            }
            setPiece(position, move.to, { piece: piece, side: move.side });
        }
        position.lastMove = move;
        return __assign({}, position);
    }
    catch (e) {
        console.log(JSON.stringify(currentPosition));
        console.log(JSON.stringify(move));
        throw e;
    }
}
exports.doMove = doMove;
function getPiece(position, cell) {
    return position.cells[cell.rank - 1][9 - cell.file];
}
exports.getPiece = getPiece;
function setPiece(position, cell, piece) {
    position.cells[cell.rank - 1][9 - cell.file] = piece;
}
exports.setPiece = setPiece;
function getEmptyHand() {
    return {
        p: 0,
        l: 0,
        n: 0,
        s: 0,
        g: 0,
        b: 0,
        r: 0,
        k: 0,
        "+p": 0,
        "+l": 0,
        "+n": 0,
        "+s": 0,
        "+b": 0,
        "+r": 0
    };
}
exports.getEmptyHand = getEmptyHand;
function getEmptyPosition() {
    return {
        cells: new Array(9).map(function () { return new Array(9); }),
        side: "b",
        hand: { b: getEmptyHand(), w: getEmptyHand() }
    };
}
exports.getEmptyPosition = getEmptyPosition;
function getInitialPosition() {
    return parseSfen("lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b - 1");
}
exports.getInitialPosition = getInitialPosition;
