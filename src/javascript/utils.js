"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data = require("./data");
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
function findGreeting(text) {
    var greeting = false;
    data.messages.greeting.forEach(function (greet) {
        if (text.includes(greet)) {
            greeting = true;
        }
    });
    return greeting;
}
exports.findGreeting = findGreeting;
function findRequest(text) {
    if ((text.includes("send") && text.includes("a")) ||
        text.includes("send a") || text.includes("send me")) {
        return true;
    }
    return false;
}
exports.findRequest = findRequest;
function getCategory(text) {
    if (text.match(/with|of/g)) {
        var arr = text.split(" ");
        var index = arr.findIndex(function (key) {
            return key === 'of' || key === 'with';
        });
        return arr.slice(index + 1).join(' ');
    }
    else {
        return 'random';
    }
}
exports.getCategory = getCategory;
