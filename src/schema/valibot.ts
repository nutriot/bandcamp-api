import {
	url,
	array,
	boolean,
	date,
	email,
	integer,
	isoDate,
	literal,
	maxLength,
	minLength,
	minValue,
	null_,
	number,
	object,
	optional,
	picklist,
	record,
	string,
	tuple,
	union,
} from 'valibot';

const currency = number([minValue(0)]);
const format = optional(picklist(['csv', 'json']));
const dateString = tuple([date(), string()]);
const idType = picklist(['o', 'p']);
const nullOrString = tuple([null_(), string()]);

const sharedCredentialProps = {
	grant_type: literal('client_credentials'),
	client_id: number([integer()]),
	client_secret: string(),
};

const sharedSalesMerchProps = {
	band_id: number([integer()]),
	member_band_id: optional(number([integer()])),
	start_time: dateString,
	end_time: optional(dateString),
};

/**
 * Authorization API
 * @see {@link https://bandcamp.com/developer}
 */
export const clientCredentials = {
	requestBody: object(sharedCredentialProps),
	response: undefined,
};

export const refreshToken = {
	requestBody: object({
		...sharedCredentialProps,
		refresh_token: string(),
	}),
	response: undefined,
};

/**
 * Account API
 * @see {@link https://bandcamp.com/developer/account}
 */
export const getMyBands = {
	requestBody: undefined,
	reponse: object({
		bands: array(
			object({
				subdomain: string(),
				band_id: number([integer()]),
				name: string(),
				member_bands: object({
					subdomain: string(),
					band_id: number([integer()]),
					name: string(),
				}),
			}),
		),
	}),
};

/**
 * Sales API
 * @see {@link https://bandcamp.com/developer/sales}
 */
export const salesReport = {
	requestBody: object({
		...sharedSalesMerchProps,
		format: format,
	}),
	response: tuple([
		// JSON
		record(
			string([minLength(1)]),
			object({
				date: string([isoDate()]),
				paid_to: tuple([string(), string([email()])]),
				item_type: tuple([literal('album'), literal('package'), literal('track')]),
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
					literal('USD'),
				]),
				item_price: currency,
				quantity: number([integer(), minValue(0)]),
				discount_code: nullOrString,
				sub_total: currency,
				seller_tax: number(),
				marketplace_tax: number(),
				shipping: tuple([null_(), number()]),
				ship_from_country_name: string(), // TODO use literals?,
				transaction_fee: currency,
				fee_type: tuple([null_(), literal('creditcard'), literal('paypal')]), // TODO is it really 'creaditcard'?,
				item_total: currency,
				amount_you_received: currency,
				bandcamp_transaction_id: number([integer()]),
				paypal_transaction_id: nullOrString,
				net_amount: currency,
				package: string(), // TOD: can it be null?
				option: null_(), // TODO what values are there?
				item_url: string([url()]),
				catalog_number: nullOrString,
				upc: string(),
				isrc: string(),
				buyer_name: string(),
				buyer_email: string([email()]),
				buyer_phone: nullOrString,
				buyer_note: nullOrString,
				ship_to_name: nullOrString,
				ship_to_street: string(),
				ship_to_street_2: string(),
				ship_to_city: nullOrString,
				ship_to_state: nullOrString,
				ship_to_zip: nullOrString,
				ship_to_country: nullOrString,
				ship_to_country_code: nullOrString, // TODO use literals?
				ship_date: dateString,
				ship_notes: nullOrString,
				country: string(), // TODO literals?
				country_code: string([maxLength(2)]), // TODO literals?
				region_or_state: string(),
				city: nullOrString,
				referer: string(),
				referer_url: string(), // TODO url without protocol
				sku: nullOrString,
			}),
		),
		object({
			csv: string(),
		}),
	]),
};

/**
 * Merchant API
 * @see {@link https://bandcamp.com/developer/merch}
 */
export const getMerchDetails = {
	requestBody: object({
		...sharedSalesMerchProps,
		package_ids: array(number([integer()])),
	}),
	response: undefined,
};

export const getShippingOrigin = {
	requestBody: object({
		band_id: optional(number([integer()])),
		origin_id: optional(number([integer()])),
	}),
	response: undefined,
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
		format: format,
	}),
	response: undefined,
};

export const updateShippedItems = {
	requestBody: array(
		object({
			id: number([integer()]),
			id_type: picklist(['p', 's']),
			shipped: optional(boolean()),
			notification: optional(boolean()),
			notification_message: optional(string()),
			ship_date: optional(dateString),
			carrier: optional(string()),
			tracking_code: optional(tuple([number([integer()]), string()])),
		}),
	),
	response: undefined,
};

export const markDateRangeAsShipped = {
	requestBody: object({
		band_id: number([integer()]),
		member_band_id: optional(number([integer()])),
		start_time: optional(dateString),
		end_time: dateString,
		origin_id: optional(number([integer()])),
		email_notifications: optional(boolean()),
	}),
	response: undefined,
};

export const updateQuantities = {
	requestBody: array(
		object({
			id: number([integer()]),
			id_type: idType,
			quantity_sold: number([integer()]),
			quantity_available: number([integer()]),
			origin_id: optional(number([integer()])),
		}),
	),
	response: undefined,
};

export const updateSku = {
	requestBody: array(
		object({
			id: number([integer()]),
			id_type: idType,
			sku: string(),
		}),
	),
	response: undefined,
};
