import { Request, Response } from "express";
import { HttpStatusCode } from "../../configs/httpStatusCode.config";
import { ResponseType } from "../../types/response.type";
import { revenueService } from "../../services/revenues/revenue.service";

export class RevenueController {
    async getRevenueByYear(req: Request, res: Response): Promise<any> {
        try {
            const { year } = req.query;

            const data: ResponseType<any> =
                await revenueService.getRevenueByYear(Number(year));

            return res.status(data.statusCode).json(data);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
                message: error,
            });
        }
    }
}
