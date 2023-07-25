import { Router } from "express";

import { UploadController } from "../../../controllers/upload/upload.controller";
import { upload } from "../../../utils/upload_file_cloudinary.util";

const uploadController = new UploadController();
const uploadRoutes: Router = Router();

uploadRoutes.post(
    "/image/upload",
    upload.single("file"),
    uploadController.uploadImage
);

uploadRoutes.post("/image/destroy", uploadController.destroyImageByPublicId);

export default uploadRoutes;
