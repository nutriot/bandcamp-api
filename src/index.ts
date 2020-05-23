export default class Bandcamp {
  CLIENT_ID: string | number;
  CLIENT_SECRET: string;
  BANDCAMP_BASE_URL = 'https://bandcamp.com';

  constructor(credentials: BandcampCredentials = {}) {
    this.CLIENT_ID = credentials.id
      ? credentials.id
      : process.env.BANDCAMP_CLIENT_ID || undefined;

    this.CLIENT_SECRET = credentials.secret
      ? credentials.secret
      : process.env.BANDCAMP_CLIENT_SECRET || undefined;

    if (!this.CLIENT_ID || !this.CLIENT_SECRET) {
      throw new Error('You need to provide both, your Bandcamp client ID and secret')
    }
  }

  /**
   * Normalizes the date strings in the request body
   * @param {Object} body - request body
   */
  private normalizeDate(body: object): object {
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
  private normalizeErrors(body: object): object {
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
  private queryStringify(object: object): string {
    return Object.keys(object).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(object[key])}`).join('&');
  }

  private async post(url, data = {}): Promise<object> {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      ...data,
      method: 'POST',
    });

    return response.ok
      ? await response.json()
      : this.normalizeErrors(await response.json())
  }

  /**
   * Get access and refresh token
   *
   * @see {@link https://bandcamp.com/developer#initial_access}
   */
  public async getClientCredentials(): Promise<object> {
    const requestUrl = `${this.BANDCAMP_BASE_URL}/oauth_token`;

    const body: ClientCredentialsRequestBody = {
      'grant_type': 'client_credentials',
      'client_id': this.CLIENT_ID,
      'client_secret': this.CLIENT_SECRET
    };

    const payload = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: this.queryStringify(body)
    }

    return await this.post(requestUrl, payload);
  }

    /**
     * Access tokens expire in one hour. When this happens you can use the refresh token to get a new access token
     *
     * @param {string} refreshToken
     *
     * @see {@link https://bandcamp.com/developer#refresh_tokens}
     */
  async refreshToken(refreshToken): Promise<object> {
    const requestUrl = `${this.BANDCAMP_BASE_URL}/oauth_token`;

    const body: RefreshTokenRequestBody = {
      'grant_type': 'client_credentials',
      'client_id': this.CLIENT_ID,
      'client_secret': this.CLIENT_SECRET,
      'refresh_token': refreshToken
    }

    const payload = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: this.queryStringify(body)
    }

    return await this.post(requestUrl, payload);
  }

  /**
   * List of the bands you have access to (either through artist accounts, label accounts, or partnerships)
   *
   * @param {string} accessToken
   * @param {number} [version] - version of the API
   *
   * @see {@link https://bandcamp.com/developer/account}
   */
  public async getMyBands(accessToken, version = 1): Promise<object> {
    const requestUrl = `${this.BANDCAMP_BASE_URL}/api/account/${version}/my_bands`;

    const payload = {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }

    return await this.post(requestUrl, payload);
  }

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
  public async getSalesReport(accessToken: string, body: SalesReportRequestBody, version = 1): Promise<object> {
    const requestUrl = `${this.BANDCAMP_BASE_URL}/api/sales/${version}/sales_report`;

    const payload = {
      'headers': {
        'Authorization': `Bearer ${accessToken}`
      },
      'body': JSON.stringify(body)
    }

    return await this.post(requestUrl, payload);
  }

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
  public async getMerchDetails(accessToken: string, body: GetMerchDetailsRequestBody, version = 1): Promise<object> {
    const requestUrl = `${this.BANDCAMP_BASE_URL}/api/merchorders/${version}/get_merch_details`;

    const payload = {
      'headers': {
        'Authorization': `Bearer ${accessToken}`
      },
      'body': JSON.stringify(this.normalizeDate(body))
    }

    return await this.post(requestUrl, payload);
  }

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
  public async getShippingOriginDetails(accessToken: string, body: GetShippingOriginRequestBody = {}, version = 1): Promise<object> {
    const requestUrl = `${this.BANDCAMP_BASE_URL}/api/merchorders/${version}/get_shipping_origin_details`;

    const payload = {
      'headers': {
        'Authorization': `Bearer ${accessToken}`
      },
      'body': JSON.stringify(body)
    }

    return await this.post(requestUrl, payload);
  }

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
  public async getOrders(accessToken: string, body: GetOrdersRequestBody, version = 3): Promise<object> {
    const requestUrl = `${this.BANDCAMP_BASE_URL}/api/merchorders/${version}/get_orders`;

    const payload = {
      'headers': {
        'Authorization': `Bearer ${accessToken}`
      },
      'body': JSON.stringify(this.normalizeDate(body))
    }

    return await this.post(requestUrl, payload);
  }

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
  public async updateShipped(accessToken: string, items: UpdateShippedItems[], version = 2): Promise<object> {
    const requestUrl = `${this.BANDCAMP_BASE_URL}/api/merchorders/${version}/update_shipped`;

    const payload = {
      'headers': {
        'Authorization': `Bearer ${accessToken}`
      },
      'body': JSON.stringify({
        'items': items
      })
    }

    return await this.post(requestUrl, payload);
  }

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
  public async markDateRangeAsShipped(accessToken: string, body: MarkDateRangeAsShippedRequestBody, version = 1): Promise<object> {
    const requestUrl = `${this.BANDCAMP_BASE_URL}/api/merchorders/${version}/mark_date_range_as_shipped`;

    const payload = {
      'headers': {
        'Authorization': `Bearer ${accessToken}`
      },
      'body': JSON.stringify(this.normalizeDate(body))
    }

    return await this.post(requestUrl, payload);
  }

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
  public async updateQuantities(accessToken: string, items: UpdateQuantitiesRequestBody[], version = 1): Promise<object> {
    const requestUrl = `${this.BANDCAMP_BASE_URL}/api/merchorders/${version}/update_quantities`;

    const payload = {
      'headers': {
        'Authorization': `Bearer ${accessToken}`
      },
      'body': JSON.stringify({
        'items': items
      })
    }

    return await this.post(requestUrl, payload);
  }

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
  public async updateSKU(accessToken: string, items: UpdateSKURequestBody[], version = 1): Promise<object> {
    const requestUrl = `${this.BANDCAMP_BASE_URL}/api/merchorders/${version}/update_sku`;

    const payload = {
      'headers': {
        'Authorization': `Bearer ${accessToken}`
      },
      'body': JSON.stringify({
        'items': items
      })
    }

    return await this.post(requestUrl, payload);
  }
}
