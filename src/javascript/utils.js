"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Format(str, args) {
    var a = str;
    for (var k in args) {
        a = a.replace("{" + k + "}", args[k]);
    }
    return a;
}
exports.Format = Format;
