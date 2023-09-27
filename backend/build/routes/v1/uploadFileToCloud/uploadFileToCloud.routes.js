"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var upload_controller_1 = require("../../../controllers/upload/upload.controller");
var upload_file_cloudinary_util_1 = require("../../../utils/upload_file_cloudinary.util");
var uploadController = new upload_controller_1.UploadController();
var uploadRoutes = (0, express_1.Router)();
// upload single file
uploadRoutes.post("/image/upload/single", upload_file_cloudinary_util_1.upload.single("file"), uploadController.uploadImageSingle);
// khi lấy ở controller: req.file
//upload multi files
uploadRoutes.post("/image/upload/multi", upload_file_cloudinary_util_1.upload.array("file", 4), uploadController.uploadImageMulti);
// khi lấy ở controller: req.files
uploadRoutes.post("/image/destroy", uploadController.destroyImageByPublicId);
exports.default = uploadRoutes;
