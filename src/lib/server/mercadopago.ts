import { MercadoPagoConfig, Preference } from 'mercadopago';
import { env } from '$env/dynamic/private';

let _mp: MercadoPagoConfig;

function getMP(): MercadoPagoConfig {
  if (!_mp) {
    const token = env.MP_ACCESS_TOKEN;
    if (!token) throw new Error('Missing MP_ACCESS_TOKEN');
    _mp = new MercadoPagoConfig({ accessToken: token });
  }
  return _mp;
}

export async function createMPPreference(params: {
  orderId: string;
  title: string;
  price: number;
  email: string;
}): Promise<string> {
  const preference = new Preference(getMP());
  const response = await preference.create({
    body: {
      items: [{
        id: params.orderId,
        title: params.title,
        quantity: 1,
        currency_id: 'MXN',
        unit_price: params.price,
      }],
      payer: { email: params.email },
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
