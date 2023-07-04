import { IsString, Length, IsPhoneNumber } from "class-validator";

export class LoginAccountDto {
    @IsString()
    @Length(7, 30, {
        message: "Username phai co toi thieu 8 hoac toi da 30 ky tu",
    })
    username: string = "";

    @IsString()
    @Length(7, 50, {
        message: "Mat khau phai co toi thieu 8 hoac toi da 50 ky tu",
    })
    password: string = "";
}

export class RegisterAccountDto {
    @IsString()
    @Length(7, 30, {
        message: "Username phai co toi thieu 8 hoac toi da 30 ky tu",
    })
    username: string = "";

    @IsString()
    @Length(7, 50, {
        message: "Mat khau phai co toi thieu 8 hoac toi da 50 ky tu",
    })
    password: string = "";

    @IsString()
    @IsPhoneNumber("VN", {
        message: "Vui long nhap 1 so dien thoai hop le",
    })
    phone_number: string = "";

    @IsString()
    role: string = "";
}
