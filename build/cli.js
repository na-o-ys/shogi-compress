"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require(".");
var command = process.argv[2];
if (command === "encode") {
    var version = process.argv[3];
    var body = process.argv[4];
    if (version === "v1") {
        console.log(_1.encode(body, "v1"));
    }
    if (version === "v2") {
        console.log(_1.encode(body, "v2"));
    }
}
if (command === "decode") {
    var body = process.argv[3];
    console.log(_1.decode(body));
}
