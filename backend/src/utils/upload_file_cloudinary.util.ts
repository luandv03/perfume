import { v2, UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import multer from "multer";

import { configService } from "../configs/configService.config";

v2.config({
    cloud_name: configService.getCloudName(),
    api_key: configService.getCldApiKey(),
    api_secret: configService.getCldApiSecret(),
});

// Cấu hình multer để xử lý việc tải lên tệp ảnh
const storage = multer.diskStorage({});
export const upload = multer({ storage: storage }); // sử dụng làm middleware cho uploadRoutes

class UploadService {
    async uploadImage(
        filePath: any
    ): Promise<
        { public_id: string; secure_url: string } | UploadApiErrorResponse
    > {
        try {
            const fileData: UploadApiResponse = await v2.uploader.upload(
                filePath,
                {
                    folder: configService.getCloudFolder(),
                }
            );

            const { public_id, secure_url } = fileData;

            return {
                public_id,
                secure_url,
            };
        } catch (err: UploadApiErrorResponse | any) {
            return err;
        }
    }

    async uploadMultiImage(
        listFilePath: string[]
    ): Promise<
        { public_id: string; secure_url: string }[] | UploadApiErrorResponse[]
    > {
        try {
            // create promise to contain all files
            const promiseClouds = listFilePath.map((filePath: string) =>
                v2.uploader.upload(filePath, {
                    folder: configService.getCloudFolder(),
                })
            );

            // use promise allsettled to upload multi file concurrency to cloud.
            const listResFromCloud = Promise.allSettled(promiseClouds).then(
                (res) => {
                    const listData = res
                        .filter((item: any) => item.status === "fulfilled")
                        .map((item: any) => {
                            const { public_id, secure_url } = item.value; //res from cloud of each file;

                            return { public_id, secure_url };
                        });

                    return listData;
                }
            );

            return listResFromCloud;
        } catch (err: UploadApiErrorResponse | any) {
            return err;
        }
    }

    async destroyImage(public_id: string): Promise<any> {
        const destroy = await v2.uploader.destroy(public_id);
        return destroy;
    }
}

export const uploadService = new UploadService();
