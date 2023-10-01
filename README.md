Link demo: [https://perfume-umber.vercel.app/](https://perfume-umber.vercel.app/) 
### VNPAY account test:
- Ngân hàng: NCB
- Số thẻ: 9704198526191432198
- Tên chủ thẻ:NGUYEN VAN A
- Ngày phát hành:07/15
- Mật khẩu OTP:123456 
# Đây là dự án quản lý website bán hàng (nước hoa)

## I. Mô tả bài toán.

### 1. Các tính năng trong hệ thống

#### **Về quản trị** :

**Đối với sản phẩm**

-   Thêm, sửa, xóa , cập nhật thông tin về danh sách các sản phẩm.
-   Phân loại sản phẩm theo các thuộc tính (tên, mô tả, giá, danh mục, trạng thái, số lượng,...)

-   Quản lý sản phẩm bán ra, sản phẩm tồn kho.

-   Thống kê được các sản phẩm bán chạy, sản phẩm được nhiều khách hàng đánh giá.
-   Phát động chiến dịch giảm giá, ưu đãi cho các sản phẩm mình lựa chọn.

**Đối với khách hàng**

-   Tính năng quản lý khách hàng đăng ký trong hệ thống.
-   Cung cấp tính năng chat giữa khách hàng và shop để trao đổi thông tin dễ dàng hơn.
-   Lọc danh sách các khách hàng thân quen (hay mua hàng tại trang cửa hàng).
-   Tặng voucher cho các khách hàng thân quen, free ship cho các đơn hàng ( > n money), v.v...
-   Lưu ý số lượng voucher sẽ có hạn

*   Optional (tính năng phát triển):

-   Tạo blacklist đối với các khách hàng thường xuyên hủy đơn hàng (sẽ đo lường theo 1 mức độ nào đó (ví dụ hủy hàng >= 5 lần) : sẽ bị khóa tài khoản đăng nhập vào hệ thống.

**Đối với các đơn hàng**

-   Thống kê các chi tiết các đơn hàng (trong ngày, tháng, quý, năm)
-   Các đơn hàng thì sẽ có các hình thức vận chuyển khác nhau: hỏa tốc (1 ngày), nhanh (2-3 ngày), tiêu chuẩn (4-6 ngày)

-   Quản lý tình trạng của đơn hàng: chưa giao | đang giao | đã giao | đã hủy.
-   Tính năng thông báo (notification) : khi có đơn đặt hàng từ khách hàng thì sẽ có thông báo gửi về trang admin ngay lập tức để quản trị viên có thể kiểm tra (đòi hỏi realtime)
-   Xác nhận đơn hàng cho khách hàng
-   Gửi email | nhắn tin | gọi điện cho khách hàng về việc xác nhận đơn hàng

**Đối với các giao dịch**

-   Thống kê các giao dịch trong tháng (ngày, tháng, quý, năm)
-   Các giao dịch sẽ có 2 phương thức thanh toán chính: thanh toán khi nhận hàng | chuyển khoản
-   Sau khi khách hàng thanh toán thành công thì quản trị viên cần phải xác nhận để người dùng biết đã chuyển khoản thành công (gửi email | sms)

**Đối với doanh thu**

-   Thống kê doanh thu bán hàng của website theo chu kỳ (ngày, tháng, năm)

-   Thống kê tổng số sản phẩm bán ra theo chu kỳ (ngày, tháng, năm)

**Viết blog để giới thiệu về các thông tin hữu ích, kiến thức về sản phẩm**

-   có các tính năng trong blog đó như: đánh giá bài viết (comment), hiển thị lượt view, lượt đánh giá (1sao -> 5sao) .

**Tính năng hỗ trợ khách hàng trực tuyến**

-   Trả lời khách hàng qua tin nhắn của hệ thống, các nền tảng mạng xã hội như facebook, zalo thông qua thông tin liên hệ của của hàng.

#### **Về khách hàng:**

Tài khoản

-   Khách hàng sẽ được lựa chọn nhiều hình thức đăng nhập vào website :

*   Đăng ký tài khoản trực tiếp trên hệ thống bằng email, password.

*   Hoặc để thuận tiện hơn thì khách hàng có thể đăng nhập thông qua Google, Facebook

*   Thậm chí khách hàng không cần đăng kỳ tài khoản trên hệ thống.

-   Đối với khách hàng đăng ký tài khoản trên hệ thống thì nên cập nhật thông tin liên hệ trên hệ thống: họ tên, địa chỉ, số điện thoại để phục vụ cho việc mua hàng, vận chuyển thuận tiện hơn.
-   Các khách hàng mà đăng ký tài khoản trên hệ thống sẽ được hưởng các ưu đãi đặc biệt, nhận thông tin về các sự kiện giảm giá, ưu đãi sớm nhất .

Quyền lợi của khách hàng

-   Xem các sản phẩm trong hệ thống
-   Tìm kiếm sản phẩm theo các thuộc tính: tên sản phẩm, giá cả, mùi hương, thương hiệu, danh mục,…
-   Đánh giá sản phẩm : khách hàng có thể vote sản phẩm (1sao – 5sao)

-   Đọc các bài post trên blog của website để nắm bắt được các thông tin hữu ích, các kiến thức về nước hoa, các chương trình khuyến mãi, giảm giá,...

-   Có chức năng yêu thích sản phẩm: (thêm + sửa + xóa) để khách hàng thuận lợi xem lại các sản phẩm mình đã yêu thích khi ghé thăm website mà chưa mua.
-   Chức năng thêm giỏ hàng: giúp khách hàng thuận tiện hơn trong việc mua sắm
-   Áp voucher giảm giá

-   Khi đặt hàng: khách hàng cần để lại thông tin liên hệ, địa chỉ để phục cho việc giao hàng.
-   Xem trạng thái đơn hàng đã đặt(đã được xác nhận hay chưa)

-   Có thể hoàn trả hàng khi có lỗi
-   Xem lịch sử mua hàng tại website
-   Thậm chí khách hàng có thể hủy đơn hàng
-   Thanh toán đơn hàng theo 2 hình thức:

*   Thanh toán online : chuyển khoản qua tài khoản ngân hang của hệ thống

*   Thanh toán trực tiếp khi nhận được hàng

### 2. Sơ đồ thực thể liên kết

![Sơ đồ thực thể liên kết](https://res.cloudinary.com/dlbpgaw8k/image/upload/v1689872488/perfume/website_b%C3%A1n_n%C6%B0%E1%BB%9Bc_hoa_%C4%91%E1%BA%B3ng_s_c%E1%BA%A5p_fsxywt.png)

### 3. Sơ đồ quan hệ

![Sơ đồ quan hệ](https://res.cloudinary.com/dlbpgaw8k/image/upload/v1689872815/perfume/charm_g7ylci.png)

## II. Công nghệ sử dụng

### 1. Backend

-   Database: Postgresql
-   Language: Typescript
-   Platform: Nodejs
-   Framework: ExpressJS
-   Các công nghệ hỗ trợ khác:
    -   DB conncection: PG: ở đây sử dụng pg node module chỉ để kết nối với database, truy vấn thuần túy, tăng hiệu xuất truy vấn, gần gũi với SQL.
    -   Nodemailer
    -   JWT
    -   PassportJT: google oauth2, facebook
    -   Bcrypt
    -   Websocket: gửi thông báo khi có đơn đặt hàng
    -   Messenger chat box
    -   Zalo chat box
    -   Redis: lưu giỏ hàng
    -   Message Queue: xử lý nhiều người đặt hàng cùng lúc
    -   Cloudinary
    -   Multer
    -   Morgan | Wiston: ghi log
    -   Swagger
    -   Stripe: hỗ trợ thanh toán online

### 2. Frontend

-   Thư viện: Reactjs 18
-   Bundle build: Vite
-   Language: Typescript
-   CSS library: Mantine UI
-   Các công nghệ hỗ trợ khác:
    -   axios
    -   react-tabler-icon
    -   rich editor
    -   ....
