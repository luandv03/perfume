import { IsString, Length } from "class-validator";

export class LoginUserAccountDto {
    @IsString()
    @Length(7, 30, {
        message: "Email phai co toi thieu 8 hoac toi da 30 ky tu",
    })
    email: string = "";

    @IsString()
    @Length(7, 50, {
        message: "Mat khau phai co toi thieu 8 hoac toi da 50 ky tu",
    })
    password: string = "";
}
