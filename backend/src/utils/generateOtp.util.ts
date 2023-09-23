export const geneateOtp = () => {
    const chars = "0123456789";
    const len = chars.length;

    let otp = "";

    for (let i = 0; i < 6; i++) {
        otp += chars[Math.floor(Math.random() * len)];
    }

    return otp;
};
