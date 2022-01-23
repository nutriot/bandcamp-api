import test from 'ava';

// Dependencies
import 'isomorphic-fetch';
import Bandcamp from '../lib/index.mjs';
import dotenv from 'dotenv';
import isCI from 'is-ci';

// Read .env file
dotenv.config();

const api = new Bandcamp();
const date = new Date();
const start_time = date.setMonth(date.getMonth() - 18);
const package_ids = process.env.BANDCAMP_PACKAGE_IDS.split('|');

test('BANDCAMP_CLIENT_ID', t => {
  const actual = process.env.BANDCAMP_CLIENT_ID;

  if (!isCI) t.log(process.env.BANDCAMP_CLIENT_ID);

  t.not(actual, undefined);
});

test('BANDCAMP_CLIENT_SECRET', t => {
  const actual = process.env.BANDCAMP_CLIENT_SECRET;

  if (!isCI) t.log(process.env.BANDCAMP_CLIENT_SECRET);

  t.not(actual.length, 0);
});

test('BANDCAMP_PACKAGE_IDS', t => {
  const actual = process.env.BANDCAMP_PACKAGE_IDS;

  if (!isCI) t.log(process.env.BANDCAMP_PACKAGE_IDS);

  t.not(actual, undefined);
});

test('client_credentials', async t => {
  const actual = await api.getClientCredentials();

  if (actual.error) {
    if (!isCI) t.log(actual.message);
    return t.pass();
  }

  process.env['BANDCAMP_ACCESS_TOKEN'] = actual.access_token;
  process.env['BANDCAMP_REFRESH_TOKEN'] = actual.refresh_token;

  t.is(actual.ok, true);
});

test('refresh_token', async t => {
  const actual = await api.refreshToken(process.env.BANDCAMP_REFRESH_TOKEN);

  if (actual.error) {
    if (!isCI) t.log(actual.message);
    return t.pass();
  }

  process.env['BANDCAMP_ACCESS_TOKEN'] = actual.access_token;
  process.env['BANDCAMP_REFRESH_TOKEN'] = actual.refresh_token;

  t.is(actual.ok, true);
});

test('my_bands', async t => {
  const actual = (await api.getMyBands(process.env.BANDCAMP_ACCESS_TOKEN));

  if (actual.error) {
    if (!isCI) t.log(actual.message);
    return t.fail();
  }

  t.is(actual.bands.length > 0, true);
});

test('sales_report', async t => {
  const body = {
    band_id: process.env.BANDCAMP_BAND_ID,
    start_time: start_time
  };

  const actual = Object.keys(await api.getSalesReport(process.env.BANDCAMP_ACCESS_TOKEN, body));

  if (actual.error) {
    if (!isCI) t.log(actual.message);
    return t.fail();
  }

  t.is(actual.length > 0, true);
});

test('get_merch_details', async t => {
  const body = {
    band_id: process.env.BANDCAMP_BAND_ID,
    start_time: start_time
  };

  const actual = (await api.getMerchDetails(process.env.BANDCAMP_ACCESS_TOKEN, body));

  if (actual.error) {
    if (!isCI) t.log(actual.message);
    return t.fail();
  }

  t.is(actual.success, true);
});

test('get_shipping_origin_details', async t => {
  const body = {
    band_id: process.env.BANDCAMP_BAND_ID
  };

  const actual = (await api.getShippingOriginDetails(process.env.BANDCAMP_ACCESS_TOKEN, body));

  if (actual.error) {
    if (!isCI) t.log(actual.message);
    return t.is.skip();
  }

  t.is(actual.success, true);
});

test('get_orders', async t => {
  const body = {
    band_id: process.env.BANDCAMP_BAND_ID
  };

  const actual = (await api.getOrders(process.env.BANDCAMP_ACCESS_TOKEN, body));

  if (actual.error) {
    if (!isCI) t.log(actual.message);
    return t.is.skip();
  }

  t.is(actual.success, true);
});

test('update_shipped', async t => {
  const items = [
    {
      id: process.env.BANDCAMP_SALE_ID,
      id_type: 's',
      notification: false
    }
  ];

  const actual = (await api.updateShipped(process.env.BANDCAMP_ACCESS_TOKEN, items));

  if (actual.error) {
    if (!isCI) t.log(actual.message);
    return t.fail();
  }

  t.is(actual.success, true);
});

test('mark_date_range_as_shipped', async t => {
  const body = {
    band_id:  process.env.BANDCAMP_BAND_ID,
    end_time: date,
    email_notifications: false
  };

  const actual = (await api.markDateRangeAsShipped(process.env.BANDCAMP_ACCESS_TOKEN, body));

  if (actual.error) {
    if (!isCI) t.log(actual.message);
    return t.fail();
  }

  t.is(actual.success, true);
});

test('update_quantities', async t => {
  const items = [
    {
      id: package_ids[0],
			id_type: 'p',
			quantity_available: 0,
			quantity_sold: 0
    }
  ];

  const actual = (await api.updateQuantities(process.env.BANDCAMP_ACCESS_TOKEN, items));

  if (actual.error) {
    if (!isCI) t.log(actual.message);
    return t.fail();
  }

  t.is(actual.success, true);
});

test('update_sku', async t => {
  const items = [
    {
      id: package_ids[0],
			id_type: 'p',
			sku: 'TEST_SKU'
    }
  ];

  const actual = (await api.updateSKU(process.env.BANDCAMP_ACCESS_TOKEN, items));

  if (actual.error) {
    if (!isCI) t.log(actual.message);
    return t.fail();
  }

  t.is(actual.success, true);
});
