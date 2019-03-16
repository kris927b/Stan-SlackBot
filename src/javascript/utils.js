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
function getCityName(text) {
    if (text.includes("in")) {
        var arr = text.split(" ");
        var index = arr.findIndex(function (key) {
            return key === "in";
        });
        return arr.slice(index + 1).join(" ");
    }
    else {
        return "Copenhagen";
    }
}
exports.getCityName = getCityName;
