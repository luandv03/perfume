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

        // //check trans of this order_id existed ?
        // const checkExist = await query(
        //     `SELECT * FROM vnpay_wallet WHERE vnp_TxnRef = $1`,
        //     [vnp_TxnRef]
        // );

        // if (!checkExist.rowCount) {
        //     return {
        //         statusCode: HttpStatusCode.OK,
        //         message: "Thông tin giao dịch của đơn hàng:::" + vnp_TxnRef,
        //         data: checkExist.rows[0],
        //     };
        // }

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

    async getVnpayTrans(order_id: number): Promise<ResponseType<any>> {
        const res = await query(
            `SELECT vnpay_wallet_id, vnp_BankCode, vnp_CardType, vnp_PayDate, vnp_TransactionStatus FROM vnpay_wallet WHERE vnp_TxnRef = $1`,
            [order_id]
        );

        return {
            statusCode: HttpStatusCode.OK,
            message: "Get transaction payment success",
            data: res.rows,
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

        //check trans of this order_id existed ?
        const checkExist = await query(
            `SELECT * FROM vnpay_wallet WHERE orderId = $1`,
            [orderId]
        );

        if (!checkExist.rowCount) {
            return {
                statusCode: HttpStatusCode.OK,
                message: "Thông tin giao dịch của đơn hàng:::" + orderId,
                data: checkExist.rows[0],
            };
        }

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
