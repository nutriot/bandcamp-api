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

export const requestSchema = {
	/**
	 * Account API
	 * @see {@link https://bandcamp.com/developer/account}
	 */
	clientCredentials: object(sharedCredentialProps),

	refreshToken: object({
		...sharedCredentialProps,
		refresh_token: string()
	}),

	/**
	 * Sales API
	 * @see {@link https://bandcamp.com/developer/sales}
	 */
	salesReport: object({
		...sharedSalesMerchProps,
		format: format
	}),

	/**
	 * Merchant API
	 * @see {@link https://bandcamp.com/developer/merch}
	 */
	getMerchDetails: object({
		...sharedSalesMerchProps,
		package_ids: array(number())
	}),

	getShippingOrigin: object({
		band_id: optional(number()),
		origin_id: optional(number())
	}),

	getOrders: object({
		band_id: number(),
		member_band_id: optional(number()),
		start_time: optional(dateString),
		end_time: optional(dateString),
		unshipped_only: optional(boolean()),
		name: optional(string()),
		origin_id: optional(number()),
		format: format
	}),

	updateShippedItems: array(
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

	markDateRangeAsShipped: object({
		band_id: number(),
		member_band_id: optional(number()),
		start_time: optional(dateString),
		end_time: dateString,
		origin_id: optional(number()),
		email_notifications: optional(boolean())
	}),

	updateQuantities: array(
		object({
			id: number(),
			id_type: idType,
			quantity_sold: number(),
			quantity_available: number(),
			origin_id: optional(number())
		})
	),

	updateSku: array(
		object({
			id: number(),
			id_type: idType,
			sku: string()
		})
	)
};
