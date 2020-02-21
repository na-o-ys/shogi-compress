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
var position_1 = require("./position");
function canPromote(side, from, to, piece) {
    if (!piece)
        return false;
    var canPromotePiece = ["l", "n", "s", "b", "r", "p"].includes(piece);
    if (!canPromotePiece)
        return false;
    var isPromoteArea = function (rank) {
        return (side === "b" && rank <= 3) || (side === "w" && rank >= 7);
    };
    return isPromoteArea(from.rank) || isPromoteArea(to.rank);
}
exports.canPromote = canPromote;
function validateMove(position, move) {
    var _a, _b;
    if (move.type === "move_from_cell") {
        if (position.side !== move.side)
            return { type: "invalid", reason: "手番違い" };
        var fromP = position_1.getPiece(position, move.from);
        if (((_a = fromP) === null || _a === void 0 ? void 0 : _a.side) !== move.side || ((_b = fromP) === null || _b === void 0 ? void 0 : _b.piece) !== move.piece)
            return { type: "invalid", reason: "不正な移動元" };
        var toP = position_1.getPiece(position, move.to);
        if (toP && toP.side === move.side)
            return { type: "invalid", reason: "不正な移動先" };
    }
    if (move.type === "move_from_hand") {
        if (position.side !== move.side)
            return { type: "invalid", reason: "手番違い" };
        var toP = position_1.getPiece(position, move.to);
        if (toP)
            return { type: "invalid", reason: "不正な移動先" };
        if (position.hand[move.side][move.piece] <= 0)
            return {
                type: "invalid",
                reason: "存在しない持ち駒"
            };
    }
    if (isChecked(__assign(__assign({}, position_1.doMove(position, move)), { side: position.side }))) {
        return { type: "invalid", reason: "王手放置" };
    }
    return { type: "valid" };
}
exports.validateMove = validateMove;
function getLegalMoves(position) {
    // TODO: 打ち歩詰めチェック
    var kingCell;
    for (var file = 1; file <= 9; file++) {
        for (var rank = 1; rank <= 9; rank++) {
            var piece = position_1.getPiece(position, { file: file, rank: rank });
            if (piece && piece.side === position.side && piece.piece === "k") {
                kingCell = { file: file, rank: rank };
            }
        }
    }
    var moves = getPseudoLegalMoves(position);
    if (kingCell === undefined)
        return moves;
    var rev = function (side, rank) {
        return side === "b" ? rank : 10 - rank;
    };
    return moves.filter(function (move) {
        // 行き所のない駒
        if (move.type === "move_from_hand" || !move.promote) {
            if (["p", "l"].includes(move.piece) && rev(move.side, move.to.rank) === 1)
                return false;
            if (move.piece === "n" && rev(move.side, move.to.rank) <= 2)
                return false;
        }
        // 王手放置
        var nextPosition = position_1.doMove(position, move);
        var nextKingCell = move.piece === "k" ? move.to : kingCell;
        return getPseudoLegalMoves(nextPosition).every(function (m) { return !(m.to.file === nextKingCell.file && m.to.rank === nextKingCell.rank); });
    });
}
exports.getLegalMoves = getLegalMoves;
function isChecked(position) {
    var kingCell;
    for (var file = 1; file <= 9; file++) {
        for (var rank = 1; rank <= 9; rank++) {
            var piece = position_1.getPiece(position, { file: file, rank: rank });
            if (piece && piece.side === position.side && piece.piece === "k") {
                kingCell = { file: file, rank: rank };
            }
        }
    }
    if (kingCell === undefined)
        return false;
    return getPseudoLegalMoves(__assign(__assign({}, position), { side: position.side === "b" ? "w" : "b" })).some(function (m) { var _a; return m.to.file === ((_a = kingCell) === null || _a === void 0 ? void 0 : _a.file) && m.to.rank === kingCell.rank; });
}
exports.isChecked = isChecked;
// unchecked: 王手放置, 打ち歩詰め, 行き所の無い駒
// checked: 二歩
function getPseudoLegalMoves(position) {
    var moves = [];
    for (var rank = 1; rank <= 9; rank++) {
        for (var file = 1; file <= 9; file++) {
            var piece = position_1.getPiece(position, { rank: rank, file: file });
            if (piece && piece.side === position.side) {
                moves.push.apply(moves, getPseudoLegalMovesFrom(position, { rank: rank, file: file }));
            }
        }
    }
    var hand = position.hand[position.side];
    var toCells0 = getMovesFromHand(position, 0);
    var toCells1 = getMovesFromHand(position, 1);
    var toCells2 = getMovesFromHand(position, 2);
    var toCellsP = getMovesFromHandPawn(position);
    moves.push.apply(moves, ["s", "g", "b", "r"].flatMap(function (piece) {
        return hand[piece] > 0
            ? toCells0.map(function (to) { return genMovesFromHand(position, piece, to); })
            : [];
    }));
    moves.push.apply(moves, ["l"].flatMap(function (piece) {
        return hand[piece] > 0
            ? toCells1.map(function (to) { return genMovesFromHand(position, piece, to); })
            : [];
    }));
    moves.push.apply(moves, ["n"].flatMap(function (piece) {
        return hand[piece] > 0
            ? toCells2.map(function (to) { return genMovesFromHand(position, piece, to); })
            : [];
    }));
    moves.push.apply(moves, ["p"].flatMap(function (piece) {
        return hand[piece] > 0
            ? toCellsP.map(function (to) { return genMovesFromHand(position, piece, to); })
            : [];
    }));
    return moves;
}
exports.getPseudoLegalMoves = getPseudoLegalMoves;
function genMovesFromHand(position, piece, to) {
    return {
        type: "move_from_hand",
        side: position.side,
        piece: piece,
        to: to
    };
}
function getPseudoLegalMovesFrom(position, cell) {
    var piece = position_1.getPiece(position, cell);
    if (piece === null || piece.side !== position.side)
        return [];
    switch (piece.piece) {
        case "l":
            return getMovesL(position, cell);
        case "n":
            return getMovesN(position, cell);
        case "s":
            return getMovesS(position, cell);
        case "g":
            return getMovesG(position, cell);
        case "k":
            return getMovesK(position, cell);
        case "b":
            return getMovesB(position, cell);
        case "r":
            return getMovesR(position, cell);
        case "p":
            return getMovesP(position, cell);
        case "+l":
        case "+n":
        case "+s":
        case "+p":
            return getMovesG(position, cell);
        case "+b":
            return getMovesBp(position, cell);
        case "+r":
            return getMovesRp(position, cell);
    }
}
exports.getPseudoLegalMovesFrom = getPseudoLegalMovesFrom;
function canMovePsuedoLegally(position, cell) {
    if (!isValidRange(cell))
        return false;
    var piece = position_1.getPiece(position, cell);
    return piece === null || piece.side !== position.side;
}
function isValidRange(cell) {
    return cell.file >= 1 && cell.file <= 9 && cell.rank >= 1 && cell.rank <= 9;
}
function dir(_a) {
    var side = _a.side;
    return side === "b" ? -1 : 1;
}
function getPromotes(_a, from, to, piece) {
    var side = _a.side;
    return canPromote(side, from, to, piece) ? [true, false] : [false];
}
function genMovesFromCell(position, from, to) {
    if (!canMovePsuedoLegally(position, to))
        return [];
    var piece = position_1.getPiece(position, from);
    if (piece === null)
        return [];
    return getPromotes(position, from, to, piece.piece).map(function (promote) { return ({
        type: "move_from_cell",
        side: position.side,
        piece: piece.piece,
        from: from,
        to: to,
        promote: promote
    }); });
}
function getMovesL(position, cell) {
    return getStraightMoves(position, cell, {
        file: 0,
        rank: dir(position)
    }).flatMap(function (to) { return genMovesFromCell(position, cell, to); });
}
function getMovesN(position, cell) {
    return [
        { file: cell.file - 1, rank: cell.rank + dir(position) * 2 },
        { file: cell.file + 1, rank: cell.rank + dir(position) * 2 }
    ].flatMap(function (to) { return genMovesFromCell(position, cell, to); });
}
function getMovesP(position, cell) {
    return [{ file: cell.file, rank: cell.rank + dir(position) }].flatMap(function (to) {
        return genMovesFromCell(position, cell, to);
    });
}
function getMovesG(position, cell) {
    return [
        { file: cell.file - 1, rank: cell.rank },
        { file: cell.file + 1, rank: cell.rank },
        { file: cell.file, rank: cell.rank - dir(position) },
        { file: cell.file - 1, rank: cell.rank + dir(position) },
        { file: cell.file + 1, rank: cell.rank + dir(position) },
        { file: cell.file, rank: cell.rank + dir(position) }
    ].flatMap(function (to) { return genMovesFromCell(position, cell, to); });
}
function getMovesS(position, cell) {
    return [
        { file: cell.file - 1, rank: cell.rank + dir(position) },
        { file: cell.file + 1, rank: cell.rank + dir(position) },
        { file: cell.file, rank: cell.rank + dir(position) },
        { file: cell.file - 1, rank: cell.rank - dir(position) },
        { file: cell.file + 1, rank: cell.rank - dir(position) }
    ].flatMap(function (to) { return genMovesFromCell(position, cell, to); });
}
function getMovesK(position, cell) {
    return [
        { file: cell.file - 1, rank: cell.rank - 1 },
        { file: cell.file, rank: cell.rank - 1 },
        { file: cell.file + 1, rank: cell.rank - 1 },
        { file: cell.file - 1, rank: cell.rank },
        { file: cell.file + 1, rank: cell.rank },
        { file: cell.file - 1, rank: cell.rank + 1 },
        { file: cell.file, rank: cell.rank + 1 },
        { file: cell.file + 1, rank: cell.rank + 1 }
    ].flatMap(function (to) { return genMovesFromCell(position, cell, to); });
}
function getMovesB(position, cell) {
    return [
        { file: -1, rank: -1 },
        { file: -1, rank: 1 },
        { file: 1, rank: -1 },
        { file: 1, rank: 1 }
    ]
        .flatMap(function (d) { return getStraightMoves(position, cell, d); })
        .flatMap(function (to) { return genMovesFromCell(position, cell, to); });
}
function getMovesR(position, cell) {
    return [
        { file: -1, rank: 0 },
        { file: 1, rank: 0 },
        { file: 0, rank: -1 },
        { file: 0, rank: 1 }
    ]
        .flatMap(function (d) { return getStraightMoves(position, cell, d); })
        .flatMap(function (to) { return genMovesFromCell(position, cell, to); });
}
function getMovesBp(position, cell) {
    var movesA = getMovesB(position, cell).map(function (move) { return (__assign(__assign({}, move), { piece: "+b" })); });
    var movesB = [
        { file: cell.file, rank: cell.rank + 1 },
        { file: cell.file, rank: cell.rank - 1 },
        { file: cell.file - 1, rank: cell.rank },
        { file: cell.file + 1, rank: cell.rank }
    ].flatMap(function (to) { return genMovesFromCell(position, cell, to); });
    return movesA.concat(movesB);
}
function getMovesRp(position, cell) {
    var movesA = getMovesR(position, cell).map(function (move) { return (__assign(__assign({}, move), { piece: "+r" })); });
    var movesB = [
        { file: cell.file + 1, rank: cell.rank + 1 },
        { file: cell.file + 1, rank: cell.rank - 1 },
        { file: cell.file - 1, rank: cell.rank + 1 },
        { file: cell.file - 1, rank: cell.rank - 1 }
    ].flatMap(function (to) { return genMovesFromCell(position, cell, to); });
    return movesA.concat(movesB);
}
function getStraightMoves(position, cell, d) {
    var moves = [];
    var i = 1;
    while (true) {
        var next = { file: cell.file + d.file * i, rank: cell.rank + d.rank * i };
        if (!canMovePsuedoLegally(position, next))
            break;
        moves.push(next);
        var piece = position_1.getPiece(position, next);
        if (piece && piece.side !== position.side)
            break;
        i += 1;
    }
    return moves;
}
function getMovesFromHand(position, rankBound) {
    var rankL = position.side === "b" ? 1 + rankBound : 1;
    var rankH = position.side === "b" ? 9 : 9 - rankBound;
    var moves = [];
    for (var file = 1; file <= 9; file++) {
        for (var rank = rankL; rank <= rankH; rank++) {
            if (position_1.getPiece(position, { file: file, rank: rank }) === null) {
                moves.push({ file: file, rank: rank });
            }
        }
    }
    return moves;
}
function getMovesFromHandPawn(position) {
    var rankL = position.side === "b" ? 2 : 1;
    var rankH = position.side === "b" ? 9 : 8;
    var cells = [];
    for (var file = 1; file <= 9; file++) {
        var fileCells = [];
        var cantPut = false;
        for (var rank = rankL; rank <= rankH; rank++) {
            var piece = position_1.getPiece(position, { file: file, rank: rank });
            if (piece && piece.side === position.side && piece.piece === "p")
                cantPut = true;
            if (piece === null) {
                fileCells.push({ file: file, rank: rank });
            }
        }
        if (!cantPut)
            cells = cells.concat(fileCells);
    }
    return cells;
}
