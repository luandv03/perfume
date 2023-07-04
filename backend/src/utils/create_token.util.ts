import jwt from "jsonwebtoken";

export function createToken<Data extends object>(
    data: Data,
    secret_key: string,
    expiresIn: { expiresIn: string | number }
): string {
    const access_token = jwt.sign(data, secret_key, expiresIn);

    return access_token;
}
