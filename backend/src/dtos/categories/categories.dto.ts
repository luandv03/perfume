import { IsString, Length } from "class-validator";

export class CategoryDto {
    @IsString()
    @Length(1, 50, {
        message: "Category phai co do dai tu 1-50 ky tu",
    })
    category_name: string = "";
}
