"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jadeCompiler = void 0;
var jade_1 = __importDefault(require("jade"));
// @relativeTemplatePath is the path relative to the views directory, so include subDirectories if necessary
// @data is the data that will be injected into the template
function jadeCompiler(relativeTemplatePath, data) {
    // actual path where the template lives on the file system, assumes the standard /views directory
    // output would be something like /var/www/my-website/views/email-template.jade
    var absoluteTemplatePath = process.cwd() + "/views/" + relativeTemplatePath + ".jade";
    // get our compiled template by passing path and data to jade
    jade_1.default.renderFile(absoluteTemplatePath, data);
}
exports.jadeCompiler = jadeCompiler;
