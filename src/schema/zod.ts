import { z } from 'zod';

const format = z.union([z.literal('csv'), z.literal('json')]).optional();
const dateString = z.tuple([z.date(), z.string()]);
const idType = z.union([z.literal('o'), z.literal('p')])

const sharedCredentialProps = {
	grant_type: z.literal('client_credentials'),
	client_id: z.number(),
	client_secret: z.string()
};

const sharedSalesMerchProps = {
	band_id: z.number(),
	member_band_id: z.number().optional(),
	start_time: dateString,
	end_time: dateString.optional()
};

export const requestSchema = {
	/**
	 * Account API
	 * @see {@link https://bandcamp.com/developer/account}
	 */
	clientCredentials: z.object(sharedCredentialProps),

	refreshToke: z.object({
		...sharedCredentialProps,
		refresh_token: z.string()
	}),

	/**
	 * Sales API
	 * @see {@link https://bandcamp.com/developer/sales}
	 */
	salesReport: z.object({
		...sharedSalesMerchProps,
		format: format
	}),

	/**
	 * Merchant API
	 * @see {@link https://bandcamp.com/developer/merch}
	 */
	getMerchDetails: z.object({
		...sharedSalesMerchProps,
		package_ids: z.number().array()
	}),

	getShippingOrigin: z.object({
		band_id: z.number().optional(),
		origin_id: z.number().optional()
	}),

	getOrders: z.object({
		band_id: z.number(),
		member_band_id: z.number().optional(),
		start_time: dateString.optional(),
		end_time: dateString.optional(),
		unshipped_only: z.boolean().optional(),
		name: z.string().optional(),
		origin_id: z.number().optional(),
		format: format
	}),

	updateShippedItems: z.array(
		z.object({
			id: z.number(),
			id_type: z.union([z.literal('p'), z.literal('s')]),
			shipped: z.boolean().optional(),
			notification: z.boolean().optional(),
			notification_message: z.string().optional(),
			ship_date: dateString.optional(),
			carrier: z.string().optional(),
			tracking_code: z.tuple([z.number(), z.string()]).optional()
		})
	),

	markDateRangeAsShipped: z.object({
		band_id: z.number(),
		member_band_id: z.number().optional(),
		start_time: dateString.optional(),
		end_time: dateString,
		origin_id: z.number().optional(),
		email_notifications: z.boolean().optional()
	}),

	updateQuantities: z.array(
		z.object({
			id: z.number(),
			id_type: idType,
			quantity_sold: z.number(),
			quantity_available: z.number(),
			origin_id: z.number().optional()
		})
	),

	updateSku: z.array(
		z.object({
			id: z.number(),
			id_type: idType,
			sku: z.string()
		})
	)
};
