"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadService = exports.upload = void 0;
var cloudinary_1 = require("cloudinary");
var multer_1 = __importDefault(require("multer"));
var configService_config_1 = require("../configs/configService.config");
cloudinary_1.v2.config({
    cloud_name: configService_config_1.configService.getCloudName(),
    api_key: configService_config_1.configService.getCldApiKey(),
    api_secret: configService_config_1.configService.getCldApiSecret(),
});
// Cấu hình multer để xử lý việc tải lên tệp ảnh
var storage = multer_1.default.diskStorage({});
exports.upload = (0, multer_1.default)({ storage: storage }); // sử dụng làm middleware cho uploadRoutes
var UploadService = /** @class */ (function () {
    function UploadService() {
    }
    UploadService.prototype.uploadImage = function (filePath) {
        return __awaiter(this, void 0, void 0, function () {
            var fileData, public_id, secure_url, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, cloudinary_1.v2.uploader.upload(filePath, {
                                folder: configService_config_1.configService.getCloudFolder(),
                            })];
                    case 1:
                        fileData = _a.sent();
                        public_id = fileData.public_id, secure_url = fileData.secure_url;
                        return [2 /*return*/, {
                                public_id: public_id,
                                secure_url: secure_url,
                            }];
                    case 2:
                        err_1 = _a.sent();
                        return [2 /*return*/, err_1];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UploadService.prototype.uploadMultiImage = function (listFilePath) {
        return __awaiter(this, void 0, void 0, function () {
            var promiseClouds, listResFromCloud;
            return __generator(this, function (_a) {
                try {
                    promiseClouds = listFilePath.map(function (filePath) {
                        return cloudinary_1.v2.uploader.upload(filePath, {
                            folder: configService_config_1.configService.getCloudFolder(),
                        });
                    });
                    listResFromCloud = Promise.allSettled(promiseClouds).then(function (res) {
                        var listData = res
                            .filter(function (item) { return item.status === "fulfilled"; })
                            .map(function (item) {
                            var _a = item.value, public_id = _a.public_id, secure_url = _a.secure_url; //res from cloud of each file;
                            return { public_id: public_id, secure_url: secure_url };
                        });
                        return listData;
                    });
                    return [2 /*return*/, listResFromCloud];
                }
                catch (err) {
                    return [2 /*return*/, err];
                }
                return [2 /*return*/];
            });
        });
    };
    UploadService.prototype.destroyImage = function (public_id) {
        return __awaiter(this, void 0, void 0, function () {
            var destroy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, cloudinary_1.v2.uploader.destroy(public_id)];
                    case 1:
                        destroy = _a.sent();
                        return [2 /*return*/, {
                                destroy: destroy,
                                public_id: public_id,
                            }];
                }
            });
        });
    };
    return UploadService;
}());
exports.uploadService = new UploadService();
