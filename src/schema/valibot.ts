import { array, boolean, date, email, enumType, integer, isoDate, literal, minLength, minValue, null_, number, object, optional, record, string, tuple, union, url } from 'valibot';

const currency = number([minValue(0)]);
const format = optional(enumType(['csv', 'json']));
const dateString = tuple([date(), string()]);
const idType = enumType(['o', 'p'])

const sharedCredentialProps = {
	grant_type: literal('client_credentials'),
	client_id: number([integer()]),
	client_secret: string()
};

const sharedSalesMerchProps = {
	band_id: number([integer()]),
	member_band_id: optional(number([integer()])),
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
 * Account API
 * @see {@link https://bandcamp.com/developer/account}
 */
export const getMyBands = {
	requestBody: undefined,
	reponse: object({
		bands: array(object({
			subdomain: string(),
			band_id: number([integer()]),
			name: string(),
			member_bands: object({
				subdomain: string(),
				band_id: number([integer()]),
				name: string()
			})
		}))
	})
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
	response: record(string([minLength(1)]), object({
		date: string([isoDate()]),
		paid_to: string(),
		item_type: tuple([literal('album'), literal('track')]),
		item_name: string(),
		artist: string(),
		currency: union([
			literal('AUD'),
			literal('CAD'),
			literal('CHF'),
			literal('CZK'),
			literal('DKK'),
			literal('EUR'),
			literal('GBP'),
			literal('HKD'),
			literal('HUF'),
			literal('ILS'),
			literal('JPY'),
			literal('MXN'),
			literal('NOK'),
			literal('NZD'),
			literal('PLN'),
			literal('SEK'),
			literal('SGD'),
			literal('USD')
		]),
		item_price: currency,
		quantity: number([integer(), minValue(0)]),
		discount_code: tuple([null_(), string()]),
		sub_total: currency,
		// seller_tax: null,
		// marketplace_tax: null,
		// shipping: null,
		// ship_from_country_name: null,
		transaction_fee: currency,
		// fee_type: paypal,
		item_total: currency,
		amount_you_received: currency,
		bandcamp_transaction_id: number([integer()]),
		// // paypal_transaction_id: null,
		// net_amount: currency,
		// // package: digital download,
		// // option: null,
		item_url: string([url()]),
		// // catalog_number: null,
		upc: string(),
		isrc: string(),
		buyer_name: string(),
		buyer_email: string([email()]),
		// // buyer_phone: null,
		// // buyer_note: null,
		ship_to_name: string(),
		ship_to_street: string(),
		ship_to_street_2: string(),
		// // ship_to_city: null,
		// // ship_to_state: null,
		// // ship_to_zip: null,
		// // ship_to_country: null,
		// // ship_to_country_code: null,
		// // ship_date: null,
		// // ship_notes: null,
		// // country: United States,
		// // country_code: US,
		// // region_or_state: IL,
		city: string(),
		referer: string(),
		// referer_url: bandcamp.com/app/android/search,
		// // sku: null
	}))
};

/**
 * Merchant API
 * @see {@link https://bandcamp.com/developer/merch}
 */
export const getMerchDetails = {
	requestBody: object({
		...sharedSalesMerchProps,
		package_ids: array(number([integer()]))
	}),
	response: undefined
};

export const getShippingOrigin = {
	requestBody: object({
		band_id: optional(number([integer()])),
		origin_id: optional(number([integer()]))
	}),
	response: undefined
};

	export const getOrders = {
		requestBody: object({
		band_id: number([integer()]),
		member_band_id: optional(number([integer()])),
		start_time: optional(dateString),
		end_time: optional(dateString),
		unshipped_only: optional(boolean()),
		name: optional(string()),
		origin_id: optional(number([integer()])),
		format: format
	}),
	response: undefined
};

export const updateShippedItems = {
	requestBody: array(
		object({
			id: number([integer()]),
			id_type: enumType(['p', 's']),
			shipped: optional(boolean()),
			notification: optional(boolean()),
			notification_message: optional(string()),
			ship_date: optional(dateString),
			carrier: optional(string()),
			tracking_code: optional(tuple([number([integer()]), string()]))
		})
	),
	response: undefined
};

export const markDateRangeAsShipped = {
	requestBody: object({
		band_id: number([integer()]),
		member_band_id: optional(number([integer()])),
		start_time: optional(dateString),
		end_time: dateString,
		origin_id: optional(number([integer()])),
		email_notifications: optional(boolean())
	}),
	response: undefined
};

export const updateQuantities = {
	requestBody: array(
		object({
			id: number([integer()]),
			id_type: idType,
			quantity_sold: number([integer()]),
			quantity_available: number([integer()]),
			origin_id: optional(number([integer()]))
		})
	),
	response: undefined
};

export const updateSku = {
	requestBody:  array(
		object({
			id: number([integer()]),
			id_type: idType,
			sku: string()
		})
	),
	response: undefined
};
