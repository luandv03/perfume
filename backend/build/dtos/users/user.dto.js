"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserAccountDto = exports.LoginUserAccountDto = void 0;
var class_validator_1 = require("class-validator");
var LoginUserAccountDto = exports.LoginUserAccountDto = /** @class */ (function () {
    function LoginUserAccountDto() {
        this.email = "";
        this.password = "";
    }
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.Length)(7, 30, {
            message: "Email phai co toi thieu 8 hoac toi da 30 ky tu",
        })
    ], LoginUserAccountDto.prototype, "email", void 0);
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.Length)(7, 50, {
            message: "Mat khau phai co toi thieu 8 hoac toi da 50 ky tu",
        })
    ], LoginUserAccountDto.prototype, "password", void 0);
    return LoginUserAccountDto;
}());
var RegisterUserAccountDto = exports.RegisterUserAccountDto = /** @class */ (function () {
    function RegisterUserAccountDto() {
        this.email = "";
        this.password = "";
        this.fullname = "";
        this.address = "";
        this.phone_number = "";
        this.dob = "";
    }
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.Length)(7, 30, {
            message: "Email phai co toi thieu 8 hoac toi da 30 ky tu",
        })
    ], RegisterUserAccountDto.prototype, "email", void 0);
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.Length)(7, 50, {
            message: "Mat khau phai co toi thieu 8 hoac toi da 50 ky tu",
        })
    ], RegisterUserAccountDto.prototype, "password", void 0);
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.Length)(7, 50, {
            message: "Fullname phai co toi thieu 8 hoac toi da 30 ky tu",
        })
    ], RegisterUserAccountDto.prototype, "fullname", void 0);
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.Length)(7, 50, {
            message: "Dia chi phai co toi thieu 8 hoac toi da 50 ky tu",
        })
    ], RegisterUserAccountDto.prototype, "address", void 0);
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.Length)(7, 50, {
            message: "Vui long nhap so dien thoai",
        })
    ], RegisterUserAccountDto.prototype, "phone_number", void 0);
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.Length)(7, 50, {
            message: "Vui long nhap ngay sinh cua ban",
        })
    ], RegisterUserAccountDto.prototype, "dob", void 0);
    return RegisterUserAccountDto;
}());
