interface BandcampCredentials {
  id?: number | string;
  secret?: string;
}

interface ClientCredentialsResponse {
  access_token: string;
  expires_in: number;
  ok: boolean;
  refresh_token: string;
  token_type: string;
}

interface ClientCredentialsRequestBody {
  grant_type: string;
  client_id: number | string;
  client_secret: string;
}

interface RefreshTokenRequestBody extends ClientCredentialsRequestBody {
  refresh_token: string;
}

interface BandsRequestBody {
  grant_type: string;
  client_id: number | string;
  client_secret: string;
}

interface SalesReportRequestBody {
  band_id: number;
  member_band_id?: number;
  start_time: string;
  end_time?: string;
  format?: string;
}

interface GetMerchDetailsRequestBody {
  band_id: number;
  member_band_id?: number;
  start_time: string;
  end_time?: string;
  package_ids?: number[];
}

interface GetShippingOriginRequestBody {
  band_id?: number;
  origin_id?: number;
}

interface GetOrdersRequestBody {
  band_id: number;
  member_band_id?: number;
  start_time?: string;
  end_time?: string;
  unshipped_only?: boolean;
  name?: string;
  origin_id?: number;
  format?: string;
}

interface UpdateShippedItems {
  id: number;
  id_type: string;
  shipped?: boolean;
  notification?: boolean;
  notification_message?: string;
  ship_date?: string;
  carrier?: string;
  tracking_code?: string;
}

interface MarkDateRangeAsShippedRequestBody {
  id: number;
  member_band_id: number;
  start_time?: string;
  end_time: string;
  origin_id: number;
  email_notifications: boolean;
}

interface UpdateQuantitiesRequestBody {
  id: number;
  id_type: string;
  quantity_sold: number;
  quantity_available: number;
  origin_id?: number;
}

interface UpdateSKURequestBody {
  id: number;
  id_type: string;
  sku: string;
}
