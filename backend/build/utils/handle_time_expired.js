"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleTimeExpired = void 0;
// convert 2023/08/16 => 20230826 (Number)
var handleTimeExpired = function (time) {
    var timeDate = new Date(time);
    var yearStartTime = timeDate.getFullYear();
    var monthStartTime = timeDate.getMonth() + 1;
    var dayStartTime = timeDate.getDate();
    var timeString = yearStartTime
        .toString()
        .concat(monthStartTime.toString())
        .concat(dayStartTime.toString());
    return Number(timeString);
};
exports.handleTimeExpired = handleTimeExpired;
