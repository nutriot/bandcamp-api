import type BandcampApi from '../types/index.d';

/**
 * Normalizes the date strings in the request body.
 *
 * @param {BandcampApi.GetOrdersRequestBody} body - request body
 */
export function normalizeDate(body: BandcampApi.GetOrdersRequestBody | BandcampApi.MarkDateRangeAsShippedRequestBody): unknown {
	if (body['start_time']) {
		body['start_time'] = new Date(body['start_time']).toISOString().slice(0, 10);
	}

	if (body['end_time']) {
		body['end_time'] = new Date(body['end_time']).toISOString().slice(0, 10);
	}

	return body;
}

/**
 * Normalizes the error responses from different API calls.
 *
 * @param {Record<string, string>} body - response body
 */
export function normalizeErrors(body: Record<string, string>): unknown {
return {
		error: true,
		message: body['error_description'] || body['error_message'] || body['message']
	};
}

/**
 * Simply stringifier for query strings.
 *
 * @param {object} object
 */
export function queryStringify(object: BandcampApi.ClientCredentialsRequestBody | BandcampApi.RefreshTokenRequestBody): string {
	return Object.entries(object).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
}
