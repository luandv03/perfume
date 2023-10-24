import { HttpStatusCode } from "../../configs/httpStatusCode.config";
import { query } from "../../db/index.db";
import { ResponseType } from "../../types/response.type";

class RevenueService {
    async getRevenueByYear(year: number): Promise<ResponseType<any>> {
        const result = await query(
            `with tmp1 as(
                        with tmp2 as (
                        select o.order_id, extract(month from order_date) AS sales_month, sum(net_price * quantity) as total_amount
                        from orders as o
                        join orderlines as ol on o.order_id=ol.order_id
                        where extract(year from order_date) = $1
                        group by o.order_id
                        order by o.order_id asc)
                    select tmp2.order_id,tmp2.sales_month, total_amount,sum(coalesce(cp.coupon_discount, 0)) as tong_giam_gia
                    from tmp2
                    left join coupon_orders cpo on tmp2.order_id = cpo.order_id
                    left join coupons cp on cp.coupon_id = cpo.coupon_id
                    group by tmp2.order_id,tmp2.sales_month,total_amount)
                select tmp1.sales_month, sum(total_amount * (1-cast( tong_giam_gia as float)/100)) as revenue
                from tmp1
                group by tmp1.sales_month;`,
            [year]
        );

        return {
            statusCode: HttpStatusCode.OK,
            message: "Get Revenue " + year + " successfull",
            data: result.rows,
        };
    }
}

export const revenueService: RevenueService = new RevenueService();
