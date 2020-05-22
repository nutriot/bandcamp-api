// Dependencies
import Bandcamp from '../lib';
import dotenv from 'dotenv';
import fetch from 'isomorphic-fetch';
import isCI from 'is-ci';
import test from 'ava';

// Read .env file
dotenv.config();

const api = new Bandcamp();
const date = new Date();
const start_time = date.setMonth(date.getMonth() - 18);
const package_ids = process.env.BANDCAMP_PACKAGE_IDS.split('|');

test('BANDCAMP_CLIENT_ID', t => {
  const actual = process.env.BANDCAMP_CLIENT_ID;

  t.not(actual, undefined);
});

test('BANDCAMP_CLIENT_SECRET', t => {
  const actual = process.env.BANDCAMP_CLIENT_SECRET;

  t.not(actual, undefined);
});

test('client_credentials', async t => {
  const actual = await api.getClientCredentials();

  if (actual.error) {
    if (!isCI) t.log(actual.message);
    return t.fail();
  }

  process.env['BANDCAMP_ACCESS_TOKEN'] = actual.access_token;
  process.env['BANDCAMP_REFRESH_TOKEN'] = actual.refresh_token;

  t.is(actual.ok, true);
});

test('refresh_token', async t => {
  const actual = await api.getRefreshToken(process.env.BANDCAMP_REFRESH_TOKEN);

  if (actual.error) {
    if (!isCI) t.log(actual.message);
    return t.is.skip();
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
    start_time: start_time,
    package_ids: package_ids
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
  t.log('No tests for write operations implemented, skipping test');

  t.pass();
});

test('mark_date_range_as_shipped', async t => {
  t.log('No tests for write operations implemented, skipping test');

  t.pass();
});

test('update_quantities', async t => {
  t.log('No tests for write operations implemented, skipping test');

  t.pass();
});

test('update_sku', async t => {
  t.log('No tests for write operations implemented, skipping test');

  t.pass();
});
