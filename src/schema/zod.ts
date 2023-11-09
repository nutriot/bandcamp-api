import { z } from 'zod';

const currency = z.number().min(0);
const format = z.union([z.literal('csv'), z.literal('json')]).optional();
const dateString = z.tuple([z.date(), z.string()]);
const idType = z.union([z.literal('o'), z.literal('p')])

const sharedCredentialProps = {
	grant_type: z.literal('client_credentials'),
	client_id: z.number().int(),
	client_secret: z.string()
};

const sharedSalesMerchProps = {
	band_id: z.number().int(),
	member_band_id: z.number().int().optional(),
	start_time: dateString,
	end_time: dateString.optional()
};

/**
 * Authorization API
 * @see {@link https://bandcamp.com/developer}
 */
export const clientCredentials = {
	requestBody: z.object(sharedCredentialProps),
	response: undefined
};

export const refreshToken = {
	requestBody: z.object({
		...sharedCredentialProps,
		refresh_token: z.string()
	}),
	response: undefined
};

/**
 * Account API
 * @see {@link https://bandcamp.com/developer/account}
 */
export const getMyBands = {
	requestBody: undefined,
	reponse: z.object({
		bands: z.array(z.object({
			subdomain: z.string(),
			band_id: z.number().int(),
			name: z.string(),
			member_bands: z.object({
				subdomain: z.string(),
				band_id: z.number().int(),
				name: z.string()
			}).optional()
		})),
	})
};

/**
 * Sales API
 * @see {@link https://bandcamp.com/developer/sales}
 */
export const salesReport = {
	requestBody: z.object({
		...sharedSalesMerchProps,
		format: format
	}),
	response: z.tuple([
		//JSON
		z.record(z.string().min(1), z.object({
			date: z.preprocess(date => new Date(String(date)), z.date()),
			paid_to: z.string(),
			item_type: z.tuple([z.literal('album'), z.literal('track')]),
			item_name: z.string(),
			artist: z.string(),
			currency: z.union([
				z.literal('AUD'),
				z.literal('CAD'),
				z.literal('CHF'),
				z.literal('CZK'),
				z.literal('DKK'),
				z.literal('EUR'),
				z.literal('GBP'),
				z.literal('HKD'),
				z.literal('HUF'),
				z.literal('ILS'),
				z.literal('JPY'),
				z.literal('MXN'),
				z.literal('NOK'),
				z.literal('NZD'),
				z.literal('PLN'),
				z.literal('SEK'),
				z.literal('SGD'),
				z.literal('USD')
			]),
			item_price: currency,
			quantity: z.number().int().gte(0),
			discount_code: z.tuple([z.null(), z.string()]),
			sub_total: currency,
			// seller_tax: null,
			// marketplace_tax: null,
			// shipping: null,
			// ship_from_country_name: null,
			transaction_fee: currency,
			// fee_type: paypal,
			item_total: currency,
			amount_you_received: currency,
			bandcamp_transaction_id: z.number().int(),
			// paypal_transaction_id: null,
			net_amount: currency,
			// package: digital download,
			// option: null,
			item_url: z.string().url(),
			// catalog_number: null,
			upc: z.string(),
			isrc: z.string(),
			buyer_name: z.string(),
			buyer_email: z.string().email(),
			// buyer_phone: null,
			// buyer_note: null,
			ship_to_name: z.string(),
			ship_to_street: z.string(),
			ship_to_street_2: z.string(),
			// ship_to_city: null,
			// ship_to_state: null,
			// ship_to_zip: null,
			// ship_to_country: null,
			// ship_to_country_code: null,
			// ship_date: null,
			// ship_notes: null,
			// country: United States,
			// country_code: US,
			// region_or_state: IL,
			city: z.string(),
			referer: z.string(),
			// referer_url: bandcamp.com/app/android/search,
			// sku: null
		})
		),
		// z.object({
		// 	csv: z.string()
		// })
	])
};

/**
 * Merchant API
 * @see {@link https://bandcamp.com/developer/merch}
 */
export const getMerchDetails = {
	requestBody: z.object({
		...sharedSalesMerchProps,
		package_ids: z.number().int().array()
	}),
	response: undefined
};

export const getShippingOrigin = {
	requestBody: z.object({
		band_id: z.number().int().optional(),
		origin_id: z.number().int().optional()
	}),
	response: undefined
};

export const getOrders = {
	requestBody: z.object({
		band_id: z.number().int(),
		member_band_id: z.number().int().optional(),
		start_time: dateString.optional(),
		end_time: dateString.optional(),
		unshipped_only: z.boolean().optional(),
		name: z.string().optional(),
		origin_id: z.number().int().optional(),
		format: format
	}),
	response: undefined
};

export const updateShippedItems = {
	requestBody: z.array(
		z.object({
			id: z.number().int(),
			id_type: z.union([z.literal('p'), z.literal('s')]),
			shipped: z.boolean().optional(),
			notification: z.boolean().optional(),
			notification_message: z.string().optional(),
			ship_date: dateString.optional(),
			carrier: z.string().optional(),
			tracking_code: z.tuple([z.number().int(), z.string()]).optional()
		}),
	),
	response: undefined
};

export const markDateRangeAsShipped = {
	requestBody: z.object({
		band_id: z.number().int(),
		member_band_id: z.number().int().optional(),
		start_time: dateString.optional(),
		end_time: dateString,
		origin_id: z.number().int().optional(),
		email_notifications: z.boolean().optional()
	}),
	response: undefined
};

export const updateQuantities = {
	requestBody: z.array(
		z.object({
			id: z.number().int(),
			id_type: idType,
			quantity_sold: z.number().int(),
			quantity_available: z.number().int(),
			origin_id: z.number().int().optional()
		})
	),
	response: undefined
};

export const updateSku = {
	requestBody: z.array(
		z.object({
			id: z.number().int(),
			id_type: idType,
			sku: z.string()
		})
	),
	response: undefined
};
