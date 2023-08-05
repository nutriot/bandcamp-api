import { array, boolean, date, enumType, literal, number, object, optional, string, tuple } from 'valibot';

const format = optional(enumType(['csv', 'json']));
const dateString = tuple([date(), string()]);
const idType = enumType(['o', 'p'])

const sharedCredentialProps = {
	grant_type: literal('client_credentials'),
	client_id: number(),
	client_secret: string()
};

const sharedSalesMerchProps = {
	band_id: number(),
	member_band_id: optional(number()),
	start_time: dateString,
	end_time: optional(dateString)
};

/**
 * Authorization API
 * @see {@link https://bandcamp.com/developer}
 */
export const clientCredentials = {
	requestBody: object(sharedCredentialProps),
	response: undefined
};

export const refreshToken = {
	requestBody: object({
		...sharedCredentialProps,
		refresh_token: string()
	}),
	response: undefined
};

/**
 * Sales API
 * @see {@link https://bandcamp.com/developer/sales}
 */
export const salesReport = {
	requestBody: object({
		...sharedSalesMerchProps,
		format: format
	}),
	response: undefined
};

/**
 * Merchant API
 * @see {@link https://bandcamp.com/developer/merch}
 */
export const getMerchDetails = {
	requestBody: object({
		...sharedSalesMerchProps,
		package_ids: array(number())
	}),
	response: undefined
};

export const getShippingOrigin = {
	requestBody: object({
		band_id: optional(number()),
		origin_id: optional(number())
	}),
	response: undefined
};

	export const getOrders = {
		requestBody: object({
		band_id: number(),
		member_band_id: optional(number()),
		start_time: optional(dateString),
		end_time: optional(dateString),
		unshipped_only: optional(boolean()),
		name: optional(string()),
		origin_id: optional(number()),
		format: format
	}),
	response: undefined
};

export const updateShippedItems = {
	requestBody: array(
		object({
			id: number(),
			id_type: enumType(['p', 's']),
			shipped: optional(boolean()),
			notification: optional(boolean()),
			notification_message: optional(string()),
			ship_date: optional(dateString),
			carrier: optional(string()),
			tracking_code: optional(tuple([number(), string()]))
		})
	),
	response: undefined
};

export const markDateRangeAsShipped = {
	requestBody: object({
		band_id: number(),
		member_band_id: optional(number()),
		start_time: optional(dateString),
		end_time: dateString,
		origin_id: optional(number()),
		email_notifications: optional(boolean())
	}),
	response: undefined
};

export const updateQuantities = {
	requestBody: array(
		object({
			id: number(),
			id_type: idType,
			quantity_sold: number(),
			quantity_available: number(),
			origin_id: optional(number())
		})
	),
	response: undefined
};

export const updateSku = {
	requestBody:  array(
		object({
			id: number(),
			id_type: idType,
			sku: string()
		})
	),
	response: undefined
};
