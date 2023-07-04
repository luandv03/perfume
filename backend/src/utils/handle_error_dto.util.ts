import { validate } from "class-validator";

import { ResponseType } from "../types/response.type";
import { HttpStatusCode } from "../configs/httpStatusCode.config";

export const handleErrorDto = async <T extends Record<string, any>>(
    dataDto: T,
    entityDto: T
): Promise<ResponseType<any>> => {
    const keysOfData: string[] = Object.keys(dataDto);

    keysOfData.map((key: string) => {
        entityDto[key as keyof T] = dataDto[key as keyof T];
    });

    const errors = await validate(entityDto);

    // chỗ này để bắn ra lỗi theo định dạng:
    //Ví dụ: { username: ["username phải có..."], password: ["password phải có", "phai có ký tự @, ..."]}
    // bắn lỗi tường minh để frontend dễ xử lý
    if (errors.length) {
        const errorObj = Object.assign({});

        errors.forEach((err: any) => {
            const arr = Object.keys(err.constraints);

            errorObj[err.property] = arr.map((item) => err.constraints[item]);
        });

        return {
            statusCode: HttpStatusCode.BAD_REQUEST,
            message: "Input Error",
            data: errorObj,
        };
    }

    return {
        statusCode: 0,
        message: "Next",
    };
};
