export default class Bandcamp {
    CLIENT_ID: string | number;
    CLIENT_SECRET: string;
    BANDCAMP_BASE_URL: string;
    constructor(credentials?: BandcampCredentials);
    private normalizeDate;
    private normalizeErrors;
    private post;
    getClientCredentials(): Promise<object>;
    refreshToken(refreshToken: any): Promise<object>;
    getMyBands(accessToken: any, version?: number): Promise<object>;
    getSalesReport(accessToken: string, body: SalesReportRequestBody, version?: number): Promise<object>;
    getMerchDetails(accessToken: string, body: GetMerchDetailsRequestBody, version?: number): Promise<object>;
    getShippingOriginDetails(accessToken: string, body?: GetShippingOriginRequestBody, version?: number): Promise<object>;
    getOrders(accessToken: string, body: GetOrdersRequestBody, version?: number): Promise<object>;
    updateShipped(accessToken: string, items: UpdateShippedItems[], version?: number): Promise<object>;
    markDateRangeAsShipped(accessToken: string, body: MarkDateRangeAsShippedRequestBody, version?: number): Promise<object>;
    updateQuantities(accessToken: string, items: UpdateQuantitiesRequestBody[], version?: number): Promise<object>;
    updateSKU(accessToken: string, items: UpdateSKURequestBody[], version?: number): Promise<object>;
}
