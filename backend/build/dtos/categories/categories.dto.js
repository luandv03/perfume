"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryDto = void 0;
var class_validator_1 = require("class-validator");
var CategoryDto = exports.CategoryDto = /** @class */ (function () {
    function CategoryDto() {
        this.category_name = "";
    }
    __decorate([
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.Length)(1, 50, {
            message: "Category phai co do dai tu 1-50 ky tu",
        })
    ], CategoryDto.prototype, "category_name", void 0);
    return CategoryDto;
}());
