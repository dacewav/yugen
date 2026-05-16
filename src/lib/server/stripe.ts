import Stripe from 'stripe';
import { env } from '$env/dynamic/private';

let _stripe: Stripe;

export function stripe(): Stripe {
  if (!_stripe) {
    const key = env.STRIPE_SECRET_KEY;
    if (!key) throw new Error('Missing STRIPE_SECRET_KEY');
    _stripe = new Stripe(key, {
      apiVersion: '2025-02-24.acacia',
      typescript: true,
    });
  }
  return _stripe;
}

export async function createPaymentIntent(params: {
  serviceId?: string;
  beatId?: string;
  kitId?: string;
  dropId?: string;
  clientEmail: string;
  notes?: string;
}): Promise<{ clientSecret: string; orderId: string }> {
  const price = await getPriceFromDb(params);
  const orderId = await createPendingOrder(params);

  const intent = await stripe().paymentIntents.create({
    amount: Math.round(price.usd * 100),
    currency: 'usd',
    metadata: {
      orderId,
      productType: getProductType(params),
      productId: getProductId(params),
    },
    receipt_email: params.clientEmail,
  });

  return { clientSecret: intent.client_secret!, orderId };
}

async function getPriceFromDb(_params: Record<string, unknown>): Promise<{ usd: number }> {
  throw new Error('Implement getPriceFromDb: query Firestore for real price');
}

async function createPendingOrder(_params: Record<string, unknown>): Promise<string> {
  throw new Error('Implement createPendingOrder: create order doc in Firestore');
}

function getProductType(params: Record<string, unknown>): string {
  if (params.serviceId) return 'service';
  if (params.beatId) return 'beat';
  if (params.kitId) return 'drumkit';
  if (params.dropId) return 'drop';
  return 'unknown';
}

function getProductId(params: Record<string, unknown>): string {
  return (params.serviceId ?? params.beatId ?? params.kitId ?? params.dropId ?? '') as string;
}
