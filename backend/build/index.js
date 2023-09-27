"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var express_session_1 = __importDefault(require("express-session"));
var cors_1 = __importDefault(require("cors"));
var path_1 = __importDefault(require("path"));
var index_routes_1 = __importDefault(require("./routes/index.routes"));
var configService_config_1 = require("./configs/configService.config");
var app = (0, express_1.default)();
var PORT = 8888;
// view engine setup
app.set("views", path_1.default.join(__dirname, "views"));
app.set("view engine", "jade");
console.log(configService_config_1.configService.getClientDomain());
app.use((0, cors_1.default)({
    credentials: true,
    origin: [
        configService_config_1.configService.getClientDomain(),
        configService_config_1.configService.getAdminDomain(),
    ],
}));
// xử lý dữ liệu gửi lên từ Client
app.use(express_1.default.json()); // xử lý dữ liệu gửi từ frontend -> backend dưới định dạng json:
//chuyển đổi sang Javascript giúp ta có thể lấy được trong req.body
// xử lý dữ liệu được gửi lên dưới dạng form HTML (application/x-www-form-url)
app.use(express_1.default.urlencoded({
    extended: true,
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.use((0, express_session_1.default)({
    secret: "I_LOVE_TTMH",
    resave: false,
    saveUninitialized: true,
}));
app.use("/", index_routes_1.default);
app.listen(PORT, function () {
    console.log("server is listening on port " + PORT);
});
