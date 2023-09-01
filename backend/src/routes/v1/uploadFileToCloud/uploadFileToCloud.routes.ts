import { Router } from "express";

import { UploadController } from "../../../controllers/upload/upload.controller";
import { upload } from "../../../utils/upload_file_cloudinary.util";

const uploadController = new UploadController();
const uploadRoutes: Router = Router();

// upload single file
uploadRoutes.post(
    "/image/upload/single",
    upload.single("file"),
    uploadController.uploadImageSingle
);
// khi lấy ở controller: req.file

//upload multi files
uploadRoutes.post(
    "/image/upload/multi",
    upload.array("file", 4),
    uploadController.uploadImageMulti
);
// khi lấy ở controller: req.files

uploadRoutes.post("/image/destroy", uploadController.destroyImageByPublicId);

export default uploadRoutes;
