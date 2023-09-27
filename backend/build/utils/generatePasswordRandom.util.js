"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePasswordRandom = void 0;
function generatePasswordRandom(passwordLength) {
    if (passwordLength === void 0) { passwordLength = 10; }
    var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var password = "";
    for (var i = 0; i < passwordLength; i++) {
        var randomNumber = Math.floor(Math.random() * chars.length);
        password += chars.substring(randomNumber, randomNumber + 1);
    }
    return password;
}
exports.generatePasswordRandom = generatePasswordRandom;
