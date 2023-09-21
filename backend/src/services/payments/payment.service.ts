import { ResponseType } from "../../types/response.type";
import { query } from "../../db/index.db";
import { HttpStatusCode } from "../../configs/httpStatusCode.config";

interface VnpayType {
    vnp_TxnRef: number;
    vnp_Amount: string;
    vnp_BankCode: string;
    vnp_CardType: string;
    vnp_OrderInfo: string;
    vnp_PayDate: string;
    vnp_ResponseCode: string;
    vnp_TmnCode: string;
    vnp_TransactionNo: string;
    vnp_TransactionStatus: string;
    vnp_SecureHash: string;
}

interface MomoType {
    orderId: number;
    partnerCode: string;
    requestId: string;
    amount: string;
    orderType: string;
    transId: string;
    resultCode: string;
    message: string;
    payType: string;
    signature: string;
}

class PaymentService {
    async createPaymentVnpayTrans(
        vnpayData: VnpayType
    ): Promise<ResponseType<any>> {
        const {
            vnp_TxnRef, // order_id
            vnp_Amount,
            vnp_BankCode,
            vnp_CardType,
            vnp_OrderInfo,
            vnp_PayDate,
            vnp_ResponseCode,
            vnp_TmnCode,
            vnp_TransactionNo,
            vnp_TransactionStatus,
            vnp_SecureHash,
        } = vnpayData;

        const result = await query(
            `INSERT INTO vnpay_wallet VALUES(DEFAULT, $1, $2, $3, 
            $4, $5, $6, $7, $8, 
            $9, $10, $11)`,
            [
                vnp_TxnRef,
                vnp_Amount,
                vnp_BankCode,
                vnp_CardType,
                vnp_OrderInfo,
                vnp_PayDate,
                vnp_ResponseCode,
                vnp_TmnCode,
                vnp_TransactionNo,
                vnp_TransactionStatus,
                vnp_SecureHash,
            ]
        );

        return {
            statusCode: HttpStatusCode.OK,
            message: "Giao dịch hoàn tất",
            data: result.rows[0],
        };
    }

    async createPaymentMomoTrans(
        momoData: MomoType
    ): Promise<ResponseType<any>> {
        const {
            partnerCode,
            orderId,
            requestId,
            amount,
            orderType,
            transId,
            resultCode,
            message,
            payType,
            signature,
        } = momoData;

        const result = await query(
            `INSERT INTO momo_wallet VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [
                orderId,
                partnerCode,
                requestId,
                amount,
                orderType,
                transId,
                resultCode,
                message,
                payType,
                signature,
            ]
        );

        return {
            statusCode: HttpStatusCode.OK,
            message: "Giao dịch hoàn tất",
            data: result.rows[0],
        };
    }
}

export const paymentService = new PaymentService();
