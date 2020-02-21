"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var move_1 = require("./move");
var position_1 = require("./position");
function parseCommand(command, position) {
    var _a = command.split(" "), mainCmd = _a[0], words = _a.slice(1);
    switch (mainCmd) {
        case "info":
            return parseInfoCommand(words, position);
        case "bestmove":
            return parseBestMoveCommand(words, position);
        default:
            return null;
    }
}
exports.parseCommand = parseCommand;
function convertPvToMove(pv, position) {
    var result = [];
    var lastMove;
    for (var _i = 0, pv_1 = pv; _i < pv_1.length; _i++) {
        var moveStr = pv_1[_i];
        lastMove = move_1.createMoveFromSfen(moveStr, position);
        if (lastMove === null)
            return null;
        result.push(lastMove);
        position = position_1.doMove(position, lastMove);
    }
    return result;
}
exports.convertPvToMove = convertPvToMove;
function generateUsiCommand(hash, multiPv, sfen, byoyomiMs) {
    return "usi\nsetoption name USI_Ponder value false\nsetoption name Hash value " + hash + "\nsetoption name MultiPV value " + multiPv + "\nsetoption name ConsiderationMode value true\nsetoption name EvalDir value /tmp/eval/illqha4\nisready\nusinewgame\nposition sfen " + sfen + "\ngo btime 0 wtime 0 byoyomi " + byoyomiMs + "\n";
}
exports.generateUsiCommand = generateUsiCommand;
function parseInfoCommand(words, position) {
    var result = { commandType: "info" };
    var i = 0;
    var stopCommands = [
        "depth",
        "seldepth",
        "time",
        "nodes",
        "pv",
        "multipv",
        "score",
        "currmove",
        "hashfull",
        "nps",
        "string"
    ];
    while (i < words.length) {
        switch (words[i]) {
            case "depth":
                result["depth"] = Number.parseInt(words[i + 1], 10);
                i += 2;
                break;
            case "seldepth":
                result["seldepth"] = Number.parseInt(words[i + 1], 10);
                i += 2;
                break;
            case "time":
                result["time"] = Number.parseInt(words[i + 1], 10);
                i += 2;
                break;
            case "nodes":
                result["nodes"] = Number.parseInt(words[i + 1], 10);
                i += 2;
                break;
            case "pv":
                var pv = [];
                i += 1;
                while (i < words.length && !stopCommands.includes(words[i])) {
                    pv.push(words[i]);
                    i += 1;
                }
                result["pvSfen"] = pv;
                var converted = convertPvToMove(pv, position);
                if (converted)
                    result["pv"] = converted;
                break;
            case "multipv":
                result["multipv"] = Number.parseInt(words[i + 1], 10);
                i += 2;
                break;
            case "cp":
                result["scoreCp"] = Number.parseInt(words[i + 1], 10);
                i += 2;
                break;
            case "mate":
                result["scoreMate"] = Number.parseInt(words[i + 1], 10);
                i += 2;
                break;
            case "hashfull":
                result["hashfull"] = Number.parseInt(words[i + 1], 10);
                i += 2;
                break;
            case "nps":
                result["nps"] = Number.parseInt(words[i + 1], 10);
                i += 2;
                break;
            default:
                i += 1;
                break;
        }
    }
    return result;
}
function parseBestMoveCommand(words, position) {
    if (words[0] === "resign") {
        return { commandType: "bestMove", type: "resign" };
    }
    if (words[0] === "win") {
        return { commandType: "bestMove", type: "win" };
    }
    var move = move_1.createMoveFromSfen(words[0], position);
    if (move === null)
        return null;
    return {
        commandType: "bestMove",
        type: "move",
        move: move
    };
}
