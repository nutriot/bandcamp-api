# @nutriot/bandcamp-api

> Library for interacting with the [Bandcamp API](https://bandcamp.com/developer)

[![License](https://img.shields.io/github/license/nutriot/bandcamp-api?color=blue&style=for-the-badge)](https://github.com/nutriot/bandcamp-api/blob/main/LICENSE)
[![Version: npm](https://img.shields.io/npm/v/@nutriot/bandcamp-api?style=for-the-badge)](https://www.npmjs.org/package/@nutriot/bandcamp-api)
[![Version: jsr](https://img.shields.io/jsr/v/@nutriot/bandcamp-api?style=for-the-badge)](https://jsr.io/@nutriot/bandcamp-api)
[![Build: NodeJS](https://img.shields.io/github/actions/workflow/status/nutriot/bandcamp-api/node.yml?logo=nodedotjs&logoColor=white&style=for-the-badge)](https://github.com/nutriot/bandcamp-api/actions)
[![Build: Deno](https://img.shields.io/github/actions/workflow/status/nutriot/bandcamp-api/deno.yml?logo=deno&logoColor=white&style=for-the-badge)](https://github.com/nutriot/bandcamp-api/actions)

## Installation

`npm install --save @nutriot/bandcamp-api`

## Prerequisites

In order to make API calls, you need to [register](https://bandcamp.com/contact?subj=API%20Access) to get client ID and secret.

## Usage

> [!CAUTION]  
> You should never use this library in the browser to avoid leaking your API credentials!

Import and initialize the Bandcamp module

```ts
import Bandcamp from "@nutriot/bandcamp-api";

const api = new Bandcamp({
	id: "<YOUR_CLIENT_ID>",
	secret: "<YOUR_CLIENT_SECRET>",
});
```

### Methods

#### `getClientCredentials()`

Usage: `getClientCredentials()`

Returns access token and refresh token. Both expire after one hour.

<details>
<summary><strong>Example</strong></summary>

```ts
const { access_token, refresh_token } = await api.getClientCredentials();
```

</details>

#### `refreshToken()`

Usage: `refreshToken(refreshToken)`

Access tokens expire after one hour. You can use the refresh token to get a new access token.

<details>
<summary><strong>Example</strong></summary>

```ts
await api.refreshToken(refresh_token);
```

</details>

#### `getMyBands()`

Usage: `getMyBands(accessToken)`

Returns a list of the bands you have access to (either through artist accounts, label accounts, or partnerships).

<details>
<summary><strong>Example</strong></summary>

```ts
await api.getMyBands(access_token);
```

</details>

#### `getSalesReport()`

Usage: `getSalesReport(accessToken, requestBody)`

Returns your sales reports for a label, band, or artist

<details>
<summary><strong>Example</strong></summary>

```ts
await api.getSalesReport(access_token, {
	band_id: 1633770804,
	member_band_id: 1925197437,
	start_time: "2015-12-31 23:59:59",
	end_time: "2016-01-31 00:00:00",
});
```

</details>

#### `getMerchDetails()`

Usage: `getMerchDetails(accessToken, requestBody)`

Returns merchandise a label, band, or artist has available for purchase on Bandcamp

<details>
<summary><strong>Example</strong></summary>

```ts
await api.getMerchDetails(access_token, {
	band_id: 1633770804,
	start_time: "2015-12-31",
	end_time: "2016-01-01",
	member_band_id: 1925197437,
	package_ids: [175167691, 1154611570],
});
```

</details>

#### `getShippingOriginDetails()`

Usage: `getShippingOriginDetails(accessToken, requestBody)`

Returns the shipping origins for artists and labels linked to your account on Bandcamp

<details>
<summary><strong>Example</strong></summary>

```ts
await api.getShippingOriginDetails(access_token);
```

</details>

#### `getOrders()`

Usage: `getOrders(accessToken, requestBody)`

Returns merchandise orders placed with a band or label

<details>
<summary><strong>Example</strong></summary>

```ts
await api.getOrders(access_token, {
	band_id: 1633770804,
});
```

</details>

#### `updateShipped()`

Usage: `updateShipped(accessToken, itemsArray)`

Updates shipped/unshipped status of merchandise orders

<details>
<summary><strong>Example</strong></summary>

```ts
await api.updateShipped(access_token, [
	{
		id: 1925197437,
		id_type: "p",
		shipped: true,
		notification_message: "Your items have shipped!",
		ship_date: "2016-02-29 12:59:59",
		carrier: "UPS",
		tracking_code: "VM13243546US",
	},
	{
		id: 4261657553,
		id_type: "s",
		shipped: false,
	},
]);
```

</details>

#### `markDateRangeAsShipped()`

Usage: `markDateRangeAsShipped(accessToken, requestBody)`

Updates shipped/unshipped status of merchandise orders within given date range

<details>
<summary><strong>Example</strong></summary>

```ts
await api.markDateRangeAsShipped(access_token, {
	band_id: 2293737955,
	member_band_id: 4261657553,
	start_time: "2015-12-31 23:59:59",
	end_time: "2016-01-31 00:00:00",
	email_notifications: true,
});
```

</details>

#### `updateQuantities()`

Usage: `updateQuantities(accessToken, itemsArray)`

Updates merch items' stock quantities (inventory levels)

**Note:** Because of the inherent race condition, this method requires you pass in a `quantity_sold` parameter as well as `quantity_available`.

<details>
<summary><strong>Example</strong></summary>

```ts
await api.updateQuantities(access_token, [
	{
		id_type: "p",
		id: 3387163565,
		quantity_available: 365,
		quantity_sold: 57,
		origin_id: 12345698,
	},
	{
		type: "o",
		id: 6789054322,
		quantity_available: 45,
		quantity_sold: 12,
		origin_id: 12345678,
	},
]);
```

</details>

#### `updateSKU()`

Usage: `updateSKU(accessToken, itemsArray)`

Updates merch item stock-keeping unit (SKU)

<details>
<summary><strong>Example</strong></summary>

```ts
await api.updateSKU(access_token, [
	{
		id: 175167691,
		id_type: "p",
		sku: "AFIB",
	},
	{
		id: 1154611570,
		id_type: "o",
		sku: "AFIB-XL",
	},
]);
```

</details>

### Validators

This library includes a set of _experimental_ validators for the API. Since the responses are undocumented at this point, the validators are not guaranteed to be correct (PRs are welcome!)

Future versions of this library will create its types from these validator schemas.

#### Valibot

```ts
import * as validators from "@nutriot/bandcamp-api/schema/valibot";
```

#### Zod

```ts
import * as validators from "@nutriot/bandcamp-api/schema/zod";
```

## License

This work is licensed under [The MIT License](https://opensource.org/licenses/MIT).
