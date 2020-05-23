var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
        while (_) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
var Bandcamp = (function () {
    function Bandcamp(credentials) {
        if (credentials === void 0) { credentials = {}; }
        this.BANDCAMP_BASE_URL = 'https://bandcamp.com';
        this.CLIENT_ID = credentials.id
            ? credentials.id
            : process.env.BANDCAMP_CLIENT_ID;
        this.CLIENT_SECRET = credentials.secret
            ? credentials.secret
            : process.env.BANDCAMP_CLIENT_SECRET;
        if (!this.CLIENT_ID || !this.CLIENT_SECRET) {
            throw new Error('You need to provide both, your Bandcamp client ID and secret');
        }
    }
    Bandcamp.prototype.normalizeDate = function (body) {
        if (body['start_time']) {
            body['start_time'] = new Date(body['start_time']).toISOString().slice(0, 10);
        }
        if (body['end_time']) {
            body['end_time'] = new Date(body['end_time']).toISOString().slice(0, 10);
        }
        return body;
    };
    Bandcamp.prototype.normalizeErrors = function (body) {
        return {
            error: true,
            message: body['error_description'] || body['error_message'] || body['message']
        };
    };
    Bandcamp.prototype.queryStringify = function (object) {
        return Object.keys(object).map(function (key) { return encodeURIComponent(key) + "=" + encodeURIComponent(object[key]); }).join('&');
    };
    Bandcamp.prototype.post = function (url, data) {
        if (data === void 0) { data = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var response, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4, fetch(url, __assign(__assign({ headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            } }, data), { method: 'POST' }))];
                    case 1:
                        response = _c.sent();
                        if (!response.ok) return [3, 3];
                        return [4, response.json()];
                    case 2:
                        _a = _c.sent();
                        return [3, 5];
                    case 3:
                        _b = this.normalizeErrors;
                        return [4, response.json()];
                    case 4:
                        _a = _b.apply(this, [_c.sent()]);
                        _c.label = 5;
                    case 5: return [2, _a];
                }
            });
        });
    };
    Bandcamp.prototype.getClientCredentials = function () {
        return __awaiter(this, void 0, void 0, function () {
            var requestUrl, body, payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        requestUrl = this.BANDCAMP_BASE_URL + "/oauth_token";
                        body = {
                            'grant_type': 'client_credentials',
                            'client_id': this.CLIENT_ID,
                            'client_secret': this.CLIENT_SECRET
                        };
                        payload = {
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            body: this.queryStringify(body)
                        };
                        return [4, this.post(requestUrl, payload)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    Bandcamp.prototype.refreshToken = function (refreshToken) {
        return __awaiter(this, void 0, void 0, function () {
            var requestUrl, body, payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        requestUrl = this.BANDCAMP_BASE_URL + "/oauth_token";
                        body = {
                            'grant_type': 'client_credentials',
                            'client_id': this.CLIENT_ID,
                            'client_secret': this.CLIENT_SECRET,
                            'refresh_token': refreshToken
                        };
                        payload = {
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            body: this.queryStringify(body)
                        };
                        return [4, this.post(requestUrl, payload)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    Bandcamp.prototype.getMyBands = function (accessToken, version) {
        if (version === void 0) { version = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var requestUrl, payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        requestUrl = this.BANDCAMP_BASE_URL + "/api/account/" + version + "/my_bands";
                        payload = {
                            headers: {
                                'Authorization': "Bearer " + accessToken
                            }
                        };
                        return [4, this.post(requestUrl, payload)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    Bandcamp.prototype.getSalesReport = function (accessToken, body, version) {
        if (version === void 0) { version = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var requestUrl, payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        requestUrl = this.BANDCAMP_BASE_URL + "/api/sales/" + version + "/sales_report";
                        payload = {
                            'headers': {
                                'Authorization': "Bearer " + accessToken
                            },
                            'body': JSON.stringify(body)
                        };
                        return [4, this.post(requestUrl, payload)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    Bandcamp.prototype.getMerchDetails = function (accessToken, body, version) {
        if (version === void 0) { version = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var requestUrl, payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        requestUrl = this.BANDCAMP_BASE_URL + "/api/merchorders/" + version + "/get_merch_details";
                        payload = {
                            'headers': {
                                'Authorization': "Bearer " + accessToken
                            },
                            'body': JSON.stringify(this.normalizeDate(body))
                        };
                        return [4, this.post(requestUrl, payload)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    Bandcamp.prototype.getShippingOriginDetails = function (accessToken, body, version) {
        if (body === void 0) { body = {}; }
        if (version === void 0) { version = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var requestUrl, payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        requestUrl = this.BANDCAMP_BASE_URL + "/api/merchorders/" + version + "/get_shipping_origin_details";
                        payload = {
                            'headers': {
                                'Authorization': "Bearer " + accessToken
                            },
                            'body': JSON.stringify(body)
                        };
                        return [4, this.post(requestUrl, payload)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    Bandcamp.prototype.getOrders = function (accessToken, body, version) {
        if (version === void 0) { version = 3; }
        return __awaiter(this, void 0, void 0, function () {
            var requestUrl, payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        requestUrl = this.BANDCAMP_BASE_URL + "/api/merchorders/" + version + "/get_orders";
                        payload = {
                            'headers': {
                                'Authorization': "Bearer " + accessToken
                            },
                            'body': JSON.stringify(this.normalizeDate(body))
                        };
                        return [4, this.post(requestUrl, payload)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    Bandcamp.prototype.updateShipped = function (accessToken, items, version) {
        if (version === void 0) { version = 2; }
        return __awaiter(this, void 0, void 0, function () {
            var requestUrl, payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        requestUrl = this.BANDCAMP_BASE_URL + "/api/merchorders/" + version + "/update_shipped";
                        payload = {
                            'headers': {
                                'Authorization': "Bearer " + accessToken
                            },
                            'body': JSON.stringify({
                                'items': items
                            })
                        };
                        return [4, this.post(requestUrl, payload)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    Bandcamp.prototype.markDateRangeAsShipped = function (accessToken, body, version) {
        if (version === void 0) { version = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var requestUrl, payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        requestUrl = this.BANDCAMP_BASE_URL + "/api/merchorders/" + version + "/mark_date_range_as_shipped";
                        payload = {
                            'headers': {
                                'Authorization': "Bearer " + accessToken
                            },
                            'body': JSON.stringify(this.normalizeDate(body))
                        };
                        return [4, this.post(requestUrl, payload)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    Bandcamp.prototype.updateQuantities = function (accessToken, items, version) {
        if (version === void 0) { version = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var requestUrl, payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        requestUrl = this.BANDCAMP_BASE_URL + "/api/merchorders/" + version + "/update_quantities";
                        payload = {
                            'headers': {
                                'Authorization': "Bearer " + accessToken
                            },
                            'body': JSON.stringify({
                                'items': items
                            })
                        };
                        return [4, this.post(requestUrl, payload)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    Bandcamp.prototype.updateSKU = function (accessToken, items, version) {
        if (version === void 0) { version = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var requestUrl, payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        requestUrl = this.BANDCAMP_BASE_URL + "/api/merchorders/" + version + "/update_sku";
                        payload = {
                            'headers': {
                                'Authorization': "Bearer " + accessToken
                            },
                            'body': JSON.stringify({
                                'items': items
                            })
                        };
                        return [4, this.post(requestUrl, payload)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    return Bandcamp;
}());
exports.default = Bandcamp;
//# sourceMappingURL=index.js.map