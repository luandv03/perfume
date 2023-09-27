"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterAccountDto = exports.LoginAccountDto = void 0;
var class_validator_1 = require("class-validator");
var LoginAccountDto = exports.LoginAccountDto = /** @class */ (function () {
    function LoginAccountDto() {
        this.username = "";
        this.password = "";
    }
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.Length)(7, 30, {
            message: "Username phai co toi thieu 8 hoac toi da 30 ky tu",
        })
    ], LoginAccountDto.prototype, "username", void 0);
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.Length)(7, 50, {
            message: "Mat khau phai co toi thieu 8 hoac toi da 50 ky tu",
        })
    ], LoginAccountDto.prototype, "password", void 0);
    return LoginAccountDto;
}());
var RegisterAccountDto = exports.RegisterAccountDto = /** @class */ (function () {
    function RegisterAccountDto() {
        this.username = "";
        this.password = "";
        this.phone_number = "";
        this.role = "";
    }
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.Length)(7, 30, {
            message: "Username phai co toi thieu 8 hoac toi da 30 ky tu",
        })
    ], RegisterAccountDto.prototype, "username", void 0);
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.Length)(7, 50, {
            message: "Mat khau phai co toi thieu 8 hoac toi da 50 ky tu",
        })
    ], RegisterAccountDto.prototype, "password", void 0);
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsPhoneNumber)("VN", {
            message: "Vui long nhap 1 so dien thoai hop le",
        })
    ], RegisterAccountDto.prototype, "phone_number", void 0);
    __decorate([
        (0, class_validator_1.IsString)()
    ], RegisterAccountDto.prototype, "role", void 0);
    return RegisterAccountDto;
}());
