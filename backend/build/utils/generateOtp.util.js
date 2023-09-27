"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.geneateOtp = void 0;
var geneateOtp = function () {
    var chars = "0123456789";
    var len = chars.length;
    var otp = "";
    for (var i = 0; i < 6; i++) {
        otp += chars[Math.floor(Math.random() * len)];
    }
    return otp;
};
exports.geneateOtp = geneateOtp;
