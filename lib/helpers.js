Object.defineProperty(exports, "__esModule", { value: true });
function normalizeDate(body) {
    if (body['start_time']) {
        body['start_time'] = new Date(body['start_time']).toISOString().slice(0, 10);
    }
    if (body['end_time']) {
        body['end_time'] = new Date(body['end_time']).toISOString().slice(0, 10);
    }
    return body;
}
exports.normalizeDate = normalizeDate;
function normalizeErrors(body) {
    return {
        error: true,
        message: body['error_description'] || body['error_message'] || body['message']
    };
}
exports.normalizeErrors = normalizeErrors;
function queryStringify(object) {
    return Object.keys(object).map(function (key) { return encodeURIComponent(key) + "=" + encodeURIComponent(object[key]); }).join('&');
}
exports.queryStringify = queryStringify;
//# sourceMappingURL=helpers.js.map