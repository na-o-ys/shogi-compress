"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shogi_1 = require("./shogi");
var v1_1 = require("./v1");
var v2_1 = require("./v2");
function encode(sfenPosition, version) {
    var tokens = sfenPosition.split(" ");
    if (tokens[0] !== "position" ||
        tokens[1] !== "startpos" ||
        tokens[2] !== "moves") {
        throw new Error("sfen must start with 'sfen startpos moves ...'");
    }
    var position = shogi_1.getInitialPosition();
    var moves = [];
    for (var _i = 0, _a = tokens.slice(3); _i < _a.length; _i++) {
        var sfenMove = _a[_i];
        var move = shogi_1.createMoveFromSfen(sfenMove, position);
        if (!move) {
            throw new Error("invalid move '" + move + "'");
        }
        position = shogi_1.doMove(position, move);
        moves.push(move);
    }
    switch (version) {
        case "v1":
            return v1_1.encodeCsV1(moves);
        case "v2":
            return v2_1.encodeCsV2(moves);
    }
}
exports.encode = encode;
function decode(encoded) {
    var version = encoded.startsWith("csv1_")
        ? "v1"
        : encoded.startsWith("csv2_")
            ? "v2"
            : null;
    if (!version)
        throw "invalid format";
    var moves = version === "v1" ? v1_1.decodeCsV1(encoded) : v2_1.decodeCsV2(encoded);
    var sfenMoves = moves.map(shogi_1.convertMoveToSfen);
    return "sfen startpos moves " + sfenMoves.join(" ");
}
exports.decode = decode;
