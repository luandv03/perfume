export interface UserProfileType {
    customer_id: number;
    fullname: string;
    address: string;
    phone_number: string;
    email: string;
    dob: string;
}

export interface IRegisterUser {
    fullname: string;
    password: string;
    phone_number: string;
    address: string;
    email: string;
    dob: string;
}

export interface ILoginUser {
    email: string;
    password: string;
}

export interface ITokenUser {
    access_token_user: string;
    refresh_token_user: string;
}
