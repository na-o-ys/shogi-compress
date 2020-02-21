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
var json_kifu_format_1 = require("json-kifu-format");
var position_1 = require("../position");
var rule_1 = require("../rule");
var lodash_es_1 = require("lodash-es");
function parseKif(text) {
    try {
        var jkf = json_kifu_format_1.Parsers.parseKIF(text);
        if (jkf.initial &&
            jkf.initial.preset !== "HIRATE" &&
            !lodash_es_1.isEqual(jkf.initial.data, hirateData)) {
            return { type: "parse_error", message: "平手以外は未対応です" };
        }
        return {
            type: "success",
            game: parseJkfMoves(json_kifu_format_1.Parsers.parseKIF(text).moves)
        };
    }
    catch (e) {
        return { type: "parse_error", message: e.toString() };
    }
}
exports.parseKif = parseKif;
function parseCsa(text) {
    try {
        var jkf = json_kifu_format_1.Parsers.parseCSA(text);
        if (jkf.initial &&
            jkf.initial.preset !== "HIRATE" &&
            !lodash_es_1.isEqual(jkf.initial.data, hirateData)) {
            return { type: "parse_error", message: "平手以外は未対応です" };
        }
        return {
            type: "success",
            game: parseJkfMoves(json_kifu_format_1.Parsers.parseCSA(text).moves)
        };
    }
    catch (e) {
        return { type: "parse_error", message: e.toString() };
    }
}
exports.parseCsa = parseCsa;
function parseJkfMoves(jkfMoves) {
    var lastMoveTo;
    var side = "w";
    var moves = jkfMoves
        .slice(1)
        .map(function (m) {
        side = side === "b" ? "w" : "b";
        if (!m.move)
            return null;
        var jkfMove = m.move;
        if (jkfMove.same && jkfMove.to === undefined) {
            jkfMove.to = lastMoveTo;
        }
        if (!jkfMove.to)
            throw new Error("move.to is undefined");
        lastMoveTo = jkfMove.to;
        var piece = CsaToSfen[jkfMove.piece];
        var to = { file: jkfMove.to.x, rank: jkfMove.to.y };
        if (jkfMove.from) {
            var from = { file: jkfMove.from.x, rank: jkfMove.from.y };
            var promote = jkfMove.promote === true;
            return {
                type: "move_from_cell",
                from: from,
                to: to,
                piece: piece,
                side: side,
                promote: promote
            };
        }
        return {
            type: "move_from_hand",
            to: to,
            piece: piece,
            side: side
        };
    })
        .filter(function (v) { return v; });
    var positions = [position_1.getInitialPosition()];
    var crr = positions[0];
    for (var _i = 0, moves_1 = moves; _i < moves_1.length; _i++) {
        var move = moves_1[_i];
        crr = position_1.doMove(crr, move);
        positions.push(crr);
    }
    var sfenPositions = positions.map(position_1.generateSfen);
    var turns = positions.length;
    return normalizeGame({
        positions: positions,
        sfenPositions: sfenPositions,
        isChecked: positions.map(rule_1.isChecked),
        moves: moves,
        turns: turns
    });
}
// JKF CSA パースのバグ
// promote が常に false, piece が成り駒
function normalizeGame(game) {
    var _a;
    var moves = [];
    for (var i = 0; i < game.turns - 1; i++) {
        var position = game.positions[i];
        var move = game.moves[i];
        if (move.type === "move_from_cell") {
            var piece = ((_a = position_1.getPiece(position, move.from)) === null || _a === void 0 ? void 0 : _a.piece) || move.piece;
            var promote = move.piece === "+" + piece;
            moves.push(__assign(__assign({}, move), { piece: piece,
                promote: promote }));
        }
        else {
            moves.push(move);
        }
    }
    return __assign(__assign({}, game), { moves: moves });
}
exports.normalizeGame = normalizeGame;
var CsaToSfen = {
    FU: "p",
    KY: "l",
    KE: "n",
    GI: "s",
    KI: "g",
    KA: "b",
    HI: "r",
    OU: "k",
    TO: "+p",
    NY: "+l",
    NK: "+n",
    NG: "+s",
    UM: "+b",
    RY: "+r"
};
var hirateData = {
    board: [
        [
            { color: 1, kind: "KY" },
            {},
            { color: 1, kind: "FU" },
            {},
            {},
            {},
            { color: 0, kind: "FU" },
            {},
            { color: 0, kind: "KY" }
        ],
        [
            { color: 1, kind: "KE" },
            { color: 1, kind: "KA" },
            { color: 1, kind: "FU" },
            {},
            {},
            {},
            { color: 0, kind: "FU" },
            { color: 0, kind: "HI" },
            { color: 0, kind: "KE" }
        ],
        [
            { color: 1, kind: "GI" },
            {},
            { color: 1, kind: "FU" },
            {},
            {},
            {},
            { color: 0, kind: "FU" },
            {},
            { color: 0, kind: "GI" }
        ],
        [
            { color: 1, kind: "KI" },
            {},
            { color: 1, kind: "FU" },
            {},
            {},
            {},
            { color: 0, kind: "FU" },
            {},
            { color: 0, kind: "KI" }
        ],
        [
            { color: 1, kind: "OU" },
            {},
            { color: 1, kind: "FU" },
            {},
            {},
            {},
            { color: 0, kind: "FU" },
            {},
            { color: 0, kind: "OU" }
        ],
        [
            { color: 1, kind: "KI" },
            {},
            { color: 1, kind: "FU" },
            {},
            {},
            {},
            { color: 0, kind: "FU" },
            {},
            { color: 0, kind: "KI" }
        ],
        [
            { color: 1, kind: "GI" },
            {},
            { color: 1, kind: "FU" },
            {},
            {},
            {},
            { color: 0, kind: "FU" },
            {},
            { color: 0, kind: "GI" }
        ],
        [
            { color: 1, kind: "KE" },
            { color: 1, kind: "HI" },
            { color: 1, kind: "FU" },
            {},
            {},
            {},
            { color: 0, kind: "FU" },
            { color: 0, kind: "KA" },
            { color: 0, kind: "KE" }
        ],
        [
            { color: 1, kind: "KY" },
            {},
            { color: 1, kind: "FU" },
            {},
            {},
            {},
            { color: 0, kind: "FU" },
            {},
            { color: 0, kind: "KY" }
        ]
    ],
    hands: [
        { FU: 0, KY: 0, KE: 0, GI: 0, KI: 0, KA: 0, HI: 0 },
        { FU: 0, KY: 0, KE: 0, GI: 0, KI: 0, KA: 0, HI: 0 }
    ],
    color: 0
};
