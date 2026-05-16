import { MercadoPagoConfig, Preference } from 'mercadopago';
import { env } from '$env/dynamic/private';
import { getPriceFromDb, type PaymentParams } from './stripe';

let _mp: MercadoPagoConfig;

function getMP(): MercadoPagoConfig {
  if (!_mp) {
    const token = env.MP_ACCESS_TOKEN;
    if (!token) throw new Error('Missing MP_ACCESS_TOKEN');
    _mp = new MercadoPagoConfig({ accessToken: token });
  }
  return _mp;
}

export async function createMPPreference(params: PaymentParams & { orderId: string }): Promise<string> {
  const price = await getPriceFromDb(params);
  const mpPrice = price.mxn ?? Math.round(price.usd * 17.5); // Fallback exchange rate

  const preference = new Preference(getMP());
  const response = await preference.create({
    body: {
      items: [{
        id: params.orderId,
        title: price.productName,
        quantity: 1,
        currency_id: 'MXN',
        unit_price: mpPrice,
      }],
      payer: { email: params.clientEmail },
      external_reference: params.orderId,
      notification_url: `${env.PUBLIC_SITE_URL}/api/mp/webhook`,
      back_urls: {
        success: `${env.PUBLIC_SITE_URL}/portal/${params.orderId}`,
        failure: `${env.PUBLIC_SITE_URL}/services/order?error=payment_failed`,
        pending: `${env.PUBLIC_SITE_URL}/portal/${params.orderId}`,
      },
      auto_return: 'approved',
    },
  });

  return response.init_point!;
}
