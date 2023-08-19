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

export class RegisterUserAccountDto {
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

    @IsString()
    @Length(7, 50, {
        message: "Fullname phai co toi thieu 8 hoac toi da 30 ky tu",
    })
    fullname: string = "";

    @IsString()
    @Length(7, 50, {
        message: "Dia chi phai co toi thieu 8 hoac toi da 50 ky tu",
    })
    address: string = "";

    @IsString()
    @Length(7, 50, {
        message: "Vui long nhap so dien thoai",
    })
    phone_number: string = "";

    @IsString()
    @Length(7, 50, {
        message: "Vui long nhap ngay sinh cua ban",
    })
    dob: string = "";
}
