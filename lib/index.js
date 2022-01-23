/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
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
}

/**
   * Normalizes the date strings in the request body
   * @param {Object} body - request body
   */
function normalizeDate(body) {
    if (body['start_time']) {
        body['start_time'] = new Date(body['start_time']).toISOString().slice(0, 10);
    }
    if (body['end_time']) {
        body['end_time'] = new Date(body['end_time']).toISOString().slice(0, 10);
    }
    return body;
}
/**
 * Normalizes the error responses from different API calls
 *
 * @param {Object} body - response body
 */
function normalizeErrors(body) {
    return {
        error: true,
        message: body['error_description'] || body['error_message'] || body['message']
    };
}
/**
 * Simply stringifier for query strings
 *
 * @param {object} object
 */
function queryStringify(object) {
    return Object.keys(object).map(function (key) { return "".concat(encodeURIComponent(key), "=").concat(encodeURIComponent(object[key])); }).join('&');
}

var Bandcamp = /** @class */ (function () {
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
    Bandcamp.prototype.post = function (url, data) {
        if (data === void 0) { data = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var response, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, fetch(url, __assign(__assign({ headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            } }, data), { method: 'POST' }))];
                    case 1:
                        response = _c.sent();
                        if (!response.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.json()];
                    case 2:
                        _a = _c.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        _b = normalizeErrors;
                        return [4 /*yield*/, response.json()];
                    case 4:
                        _a = _b.apply(void 0, [_c.sent()]);
                        _c.label = 5;
                    case 5: return [2 /*return*/, _a];
                }
            });
        });
    };
    /**
     * Get access and refresh token
     *
     * @see {@link https://bandcamp.com/developer#initial_access}
     */
    Bandcamp.prototype.getClientCredentials = function () {
        return __awaiter(this, void 0, void 0, function () {
            var requestUrl, body, payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        requestUrl = "".concat(this.BANDCAMP_BASE_URL, "/oauth_token");
                        body = {
                            'grant_type': 'client_credentials',
                            'client_id': this.CLIENT_ID,
                            'client_secret': this.CLIENT_SECRET
                        };
                        payload = {
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            body: queryStringify(body)
                        };
                        return [4 /*yield*/, this.post(requestUrl, payload)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Access tokens expire in one hour. When this happens you can use the refresh token to get a new access token
     *
     * @param {string} refreshToken
     *
     * @see {@link https://bandcamp.com/developer#refresh_tokens}
     */
    Bandcamp.prototype.refreshToken = function (refreshToken) {
        return __awaiter(this, void 0, void 0, function () {
            var requestUrl, body, payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        requestUrl = "".concat(this.BANDCAMP_BASE_URL, "/oauth_token");
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
                            body: queryStringify(body)
                        };
                        return [4 /*yield*/, this.post(requestUrl, payload)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * List of the bands you have access to (either through artist accounts, label accounts, or partnerships)
     *
     * @param {string} accessToken
     * @param {number} [version] - version of the API
     *
     * @see {@link https://bandcamp.com/developer/account}
     */
    Bandcamp.prototype.getMyBands = function (accessToken, version) {
        if (version === void 0) { version = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var requestUrl, payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        requestUrl = "".concat(this.BANDCAMP_BASE_URL, "/api/account/").concat(String(version), "/my_bands");
                        payload = {
                            headers: {
                                'Authorization': "Bearer ".concat(accessToken)
                            }
                        };
                        return [4 /*yield*/, this.post(requestUrl, payload)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Returns sales report for a label, band, or artist
     *
     * @param {string} accessToken
     * @param {Object} body
     * @param {number} body.band_id - the unique id of the band or label you are calling as or on behalf of
     * @param {number} [body.member_band_id] - (optional) the unique id of a band you wish to filter your results on, if you're calling as or on behalf of a label
     * @param {string} body.start_time -  the earliest UTC sale time an item could have and still be included in the results
     * @param {string} [body.end_time] - (optional) the latest UTC sale time an item could have and still be included in the results (default is the time of the call)
     * @param {string} body.format - (optional) the format you wish to receive results in - either 'csv' or 'json' (default is 'json')
     * @param {number} [version] - version of the API
     *
     * @see {@link https://bandcamp.com/developer/sales}
     */
    Bandcamp.prototype.getSalesReport = function (accessToken, body, version) {
        if (version === void 0) { version = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var requestUrl, payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        requestUrl = "".concat(this.BANDCAMP_BASE_URL, "/api/sales/").concat(String(version), "/sales_report");
                        payload = {
                            headers: {
                                'Authorization': "Bearer ".concat(accessToken)
                            },
                            body: JSON.stringify(body)
                        };
                        return [4 /*yield*/, this.post(requestUrl, payload)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Lists merchandise a label, band, or artist has available for purchase on Bandcamp
     *
     * @param {string} accessToken
     * @param {Object} body
     * @param {number} body.band_id - Bandcamp ID of your label or the (usually) label on whose behalf you are querying (get this ID from my_bands in the Account API)
     * @param {number} [body.member_band_id] - (optional) Bandcamp ID of the band on which you wish to filter results (get this ID from my_bands in the Account API)
     * @param {string} body.start_time - earliest date the items you are interested in would have been added to Bandcamp
     * @param {string} [body.end_time] - (optional) latest date items you are in interested in would have been added to Bandcamp; defaults to the time of the call
     * @param {array} [body.package_ids] - (optional) an array of package IDs that you wish to filter your results on
     * @param {number} [version] - version of the API
     *
     * @see {@link https://bandcamp.com/developer/merch#get_merch_details}
     */
    Bandcamp.prototype.getMerchDetails = function (accessToken, body, version) {
        if (version === void 0) { version = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var requestUrl, payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        requestUrl = "".concat(this.BANDCAMP_BASE_URL, "/api/merchorders/").concat(String(version), "/get_merch_details");
                        payload = {
                            headers: {
                                'Authorization': "Bearer ".concat(accessToken)
                            },
                            body: JSON.stringify(normalizeDate(body))
                        };
                        return [4 /*yield*/, this.post(requestUrl, payload)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Lists the shipping origins for artists and labels linked to your account on Bandcamp
     *
     * @param {string} accessToken
     * @param {Object} [body]
     * @param {number} [body.band_id] - (optional) Bandcamp ID of your label or the (usually) label on whose behalf you are querying (get this ID from my_bands in the Account API)
     * @param {number} [body.origin_id] - (optional) Bandcamp ID of a specific shipping origin you want to retrieve details for
     * @param {number} [version] - version of the API
     *
     * @see {@link https://bandcamp.com/developer/sales}
     */
    Bandcamp.prototype.getShippingOriginDetails = function (accessToken, body, version) {
        if (body === void 0) { body = {}; }
        if (version === void 0) { version = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var requestUrl, payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        requestUrl = "".concat(this.BANDCAMP_BASE_URL, "/api/merchorders/").concat(String(version), "/get_shipping_origin_details");
                        payload = {
                            headers: {
                                'Authorization': "Bearer ".concat(accessToken)
                            },
                            body: JSON.stringify(body)
                        };
                        return [4 /*yield*/, this.post(requestUrl, payload)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Lists merchandise orders placed with a band or label
     *
     * @param {string} accessToken
     * @param {Object} body
     * @param {number} body.band_id - Bandcamp ID of your label or the (usually) label on whose behalf you are querying (get this ID from my_bands in the Account API)
     * @param {number} [body.member_band_id] - (optional) Bandcamp ID of band to filter on; defaults to all
     * @param {string} [body.start_time] - (optional) earliest sale dates you're interested in
     * @param {string} [body.end_time] - (optional) latest sale dates you're interested in
     * @param {boolean} [body.unshipped_only] - (optional) query for unshipped orders only - true or false, default is false
     * @param {string} [body.name] - (optional) filter orders on this item name (or title)
     * @param {number} [body.origin_id] - (optional) filter orders on a particular shipping origin
     * @param {string} [body.format] - (optional) results format: 'csv' or 'json' (default is 'json')
     * @param {number} [version] - version of the API
     *
     * @see {@link https://bandcamp.com/developer/sales}
     */
    Bandcamp.prototype.getOrders = function (accessToken, body, version) {
        if (version === void 0) { version = 3; }
        return __awaiter(this, void 0, void 0, function () {
            var requestUrl, payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        requestUrl = "".concat(this.BANDCAMP_BASE_URL, "/api/merchorders/").concat(String(version), "/get_orders");
                        payload = {
                            headers: {
                                'Authorization': "Bearer ".concat(accessToken)
                            },
                            body: JSON.stringify(normalizeDate(body))
                        };
                        return [4 /*yield*/, this.post(requestUrl, payload)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Updates shipped/unshipped status of merchandise orders
     *
     * @param {string} accessToken
     * @param {Object[]} items - array of payments or sale items to update
     * @param {number} items[].id - unique Bandcamp ID of the payment or sale item to update
     * @param {number} items[].id_type - 'p' when id parameter refers to a payment, 's' for sale item
     * @param {boolean} [items[].shipped] - (optional), true to mark as shipped, false to mark as unshipped, missing or null (defaults to true)
     * @param {boolean} [items[].notification] - (optional) true to send notification, false don't, null or missing to honor seller (band or label) default setting
     * @param {string} [items[].notification_message] - (optional) custom message to send with shipping notificaton to buyer
     * @param {string} [items[].ship_date] - (optional) date of shipment; defaults to current date
     * @param {string} [items[].carrier] - (optional) name of the shipping carrier (displayed to buyer)
     * @param {string} [items[].tracking_code] - (optional) tracking code or number (displayed to buyer)
     *
     * @see {@link https://bandcamp.com/developer/sales}
     */
    Bandcamp.prototype.updateShipped = function (accessToken, items, version) {
        if (version === void 0) { version = 2; }
        return __awaiter(this, void 0, void 0, function () {
            var requestUrl, payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        requestUrl = "".concat(this.BANDCAMP_BASE_URL, "/api/merchorders/").concat(String(version), "/update_shipped");
                        payload = {
                            headers: {
                                'Authorization': "Bearer ".concat(accessToken)
                            },
                            body: JSON.stringify({ items: items })
                        };
                        return [4 /*yield*/, this.post(requestUrl, payload)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Updates shipped/unshipped status of merchandise orders within given date range
     *
     * @param {string} accessToken
     * @param {Object} body - array of payments or sale items to update
     * @param {number} body.id - identifies the label you're calling on behalf of
     * @param {number} body.member_band_id - (optional) identifies the band or artist to filter on
     * @param {string} [body.start_time] - (optional) earliest date in range of orders
     * @param {string} body.end_time - most recent date in range of orders (must be in past)
     * @param {number} body.origin_id - (optional) Bandcamp ID of a specific origin which the items you want to update were shipped from
     * @param {boolean} body.email_notifications - (optional) true to send notifications, false to suppress, leave out (or send null) to honor selling band preferences
     * @param {number} [version] - version of the API
     *
     * @see {@link https://bandcamp.com/developer/sales}
     */
    Bandcamp.prototype.markDateRangeAsShipped = function (accessToken, body, version) {
        if (version === void 0) { version = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var requestUrl, payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        requestUrl = "".concat(this.BANDCAMP_BASE_URL, "/api/merchorders/").concat(String(version), "/mark_date_range_as_shipped");
                        payload = {
                            headers: {
                                'Authorization': "Bearer ".concat(accessToken)
                            },
                            body: JSON.stringify(normalizeDate(body))
                        };
                        return [4 /*yield*/, this.post(requestUrl, payload)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Updates merch items' stock quantities (inventory levels)
     *
     * @param {string} accessToken
     * @param {Object[]} items - array of items or item-options to update, where each array item is structured
     * @param {number} items[].id - package (merch item) or option (merch item-option) ID
     * @param {string} items[].id_type - "p" if id is for an item (or package), or "o" for an item-option
     * @param {number} items[].quantity_sold - the number of items that Bandcamp has sold, as reported by get_merch_details
     * @param {number} items[].quantity_available - the new inventory level you want to set
     * @param {number} items[].origin_id - (optional) Bandcamp ID of a specific origin which the items you want to update were shipped from
     * @param {number} [version] - version of the API
     *
     * @see {@link https://bandcamp.com/developer/sales}
     */
    Bandcamp.prototype.updateQuantities = function (accessToken, items, version) {
        if (version === void 0) { version = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var requestUrl, payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        requestUrl = "".concat(this.BANDCAMP_BASE_URL, "/api/merchorders/").concat(String(version), "/update_quantities");
                        payload = {
                            headers: {
                                'Authorization': "Bearer ".concat(accessToken)
                            },
                            body: JSON.stringify({ items: items })
                        };
                        return [4 /*yield*/, this.post(requestUrl, payload)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Updates merch item stock-keeping units (SKU)
     *
     * @param {string} accessToken
     * @param {Object[]} items - array of items or item-options to update, where each array item is structured
     * @param {number} items[].id - merch item (package) and option ID
     * @param {string} items[].id_type - "p" if id refers to a merch item (package), or "o" an item-option
     * @param {string} items[].sku - the new SKU for the merch item (package) or item-option
     * @param {number} [version] - version of the API
     *
     * @see {@link https://bandcamp.com/developer/sales}
     */
    Bandcamp.prototype.updateSKU = function (accessToken, items, version) {
        if (version === void 0) { version = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var requestUrl, payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        requestUrl = "".concat(this.BANDCAMP_BASE_URL, "/api/merchorders/").concat(String(version), "/update_sku");
                        payload = {
                            headers: {
                                'Authorization': "Bearer ".concat(accessToken)
                            },
                            body: JSON.stringify({ items: items })
                        };
                        return [4 /*yield*/, this.post(requestUrl, payload)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return Bandcamp;
}());

export { Bandcamp as default };
