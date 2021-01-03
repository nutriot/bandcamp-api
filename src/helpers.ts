/**
   * Normalizes the date strings in the request body
   * @param {Object} body - request body
   */
  function normalizeDate(body: unknown): unknown {
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
  function normalizeErrors(body: unknown): unknown {
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
  function queryStringify(object: unknown): string {
    return Object.keys(object).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(object[key])}`).join('&');
  }

  export {
    normalizeDate,
    normalizeErrors,
    queryStringify
  }
