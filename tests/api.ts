import { env } from 'node:process';
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import Bandcamp from '../src/index';
import isCI from 'is-ci';

const api = new Bandcamp({
	id: String(env.BANDCAMP_CLIENT_ID),
	secret: String(env.BANDCAMP_CLIENT_SECRET),
});

const date = new Date();
const start_time = new Date('2018-01-01');
const package_ids = String(env.BANDCAMP_PACKAGE_IDS).split('|');

let BANDCAMP_ACCESS_TOKEN: string;
let BANDCAMP_REFRESH_TOKEN: string;

test('BANDCAMP_CLIENT_ID', () => {
	const actual = String(env.BANDCAMP_CLIENT_ID);

	if (!isCI) {
		console.log('BANDCAMP_CLIENT_ID:', env.BANDCAMP_CLIENT_ID);
	}

	assert.not.equal(actual, undefined);
});

test('BANDCAMP_CLIENT_SECRET', () => {
	const actual = String(env.BANDCAMP_CLIENT_SECRET);

	if (!isCI) {
		console.log('BANDCAMP_CLIENT_SECRET:', env.BANDCAMP_CLIENT_SECRET);
	}

	assert.is(actual.length > 0, true);
});

test('BANDCAMP_BAND_ID', () => {
	const actual = String(env.BANDCAMP_BAND_ID);

	if (!isCI) {
		console.log('BANDCAMP_BAND_ID:', env.BANDCAMP_BAND_ID);
	}

	assert.is(actual.length > 0, true);
});

test('BANDCAMP_SALE_ID', () => {
	const actual = String(env.BANDCAMP_SALE_ID);

	if (!isCI) {
		console.log('BANDCAMP_SALE_ID:', env.BANDCAMP_SALE_ID);
	}

	assert.is(actual.length > 0, true);
});

test('BANDCAMP_PACKAGE_IDS', () => {
	const actual = String(env.BANDCAMP_PACKAGE_IDS);

	if (!isCI) {
		console.log('BANDCAMP_PACKAGE_IDS:', env.BANDCAMP_PACKAGE_IDS);
	}

	assert.not.equal(actual, undefined);
});

test('client_credentials', async () => {
	const actual = await api.getClientCredentials();

	if (actual.error) {
		if (!isCI) {
			console.log(actual);
		}

		return;
	}

	BANDCAMP_ACCESS_TOKEN = actual.access_token;
	BANDCAMP_REFRESH_TOKEN = actual.refresh_token;

	assert.is(actual.ok, true);
});

test('refresh_token', async () => {
	const actual = await api.refreshToken(BANDCAMP_REFRESH_TOKEN);

	if (actual.error) {
		if (!isCI) {
			console.log(actual);
		}

		return;
	}

	BANDCAMP_ACCESS_TOKEN = actual.access_token;
	BANDCAMP_REFRESH_TOKEN = actual.refresh_token;

	assert.is(actual.ok, true);
});

test('my_bands', async () => {
	const actual = await api.getMyBands(BANDCAMP_ACCESS_TOKEN);

	if (actual.error) {
		if (!isCI) {
			console.log(actual);
		}

		throw new Error('Test failed');
	}

	assert.is(actual.bands.length > 0, true);
});

test('sales_report', async () => {
	const body = {
		band_id: env.BANDCAMP_BAND_ID,
		start_time: start_time
	};

	const actual = await api.getSalesReport(BANDCAMP_ACCESS_TOKEN, body);

	if (actual.error) {
		if (!isCI) {
			console.log(actual);
		}

		throw new Error('Test failed');
	}

	assert.is(Object.keys(actual).length > 0, true);
});

test('get_merch_details', async () => {
	const body = {
		band_id: env.BANDCAMP_BAND_ID,
		start_time: start_time
	};

	const actual = await api.getMerchDetails(BANDCAMP_ACCESS_TOKEN, body);

	if (actual.error) {
		if (!isCI) {
			console.log(actual);
		}

		throw new Error('Test failed');
	}

	assert.is(actual.success, true);
});

test('get_shipping_origin_details', async () => {
	const body = {
		band_id: env.BANDCAMP_BAND_ID
	};

	const actual = await api.getShippingOriginDetails(BANDCAMP_ACCESS_TOKEN, body);

	if (actual.error) {
		if (!isCI) {
			console.log(actual);
		}

		return;
	}

	assert.is(actual.success, true);
});

test('get_orders', async () => {
	const body = {
		band_id: env.BANDCAMP_BAND_ID
	};

	const actual = await api.getOrders(BANDCAMP_ACCESS_TOKEN, body);

	if (actual.error) {
		if (!isCI) {
			console.log(actual);
		}

		return;
	}

	assert.is(actual.success, true);
});

test('mark_date_range_as_shipped', async () => {
	const body = {
		band_id: env.BANDCAMP_BAND_ID,
		end_time: date,
		email_notifications: false
	};

	const actual = await api.markDateRangeAsShipped(BANDCAMP_ACCESS_TOKEN, body);

	if (actual.error) {
		if (!isCI) {
			console.log(actual);
		}

		throw new Error('Test failed');
	}

	assert.is(actual.success, true);
});

test('update_quantities', async () => {
	const items = [
		{
			id: package_ids[0],
			id_type: 'p',
			quantity_available: 0,
			quantity_sold: 0
		}
	];

	const actual = await api.updateQuantities(BANDCAMP_ACCESS_TOKEN, items);

	if (actual.error) {
		if (!isCI) {
			console.log(actual);
		}

		throw new Error('Test failed');
	}

	assert.is(actual.success, true);
});

test('update_sku', async () => {
	const items = [
		{
			id: package_ids[0],
			id_type: 'p',
			sku: 'TEST_SKU'
		}
	];

	const actual = await api.updateSKU(BANDCAMP_ACCESS_TOKEN, items);

	if (actual.error) {
		if (!isCI) {
			console.log(actual);
		}

		throw new Error('Test failed');
	}

	assert.is(actual.success, true);
});

test.run();
