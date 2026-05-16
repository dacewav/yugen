import Stripe from 'stripe';
import { env } from '$env/dynamic/private';
import { adminDb, FieldValue } from './firebase-admin';
import crypto from 'crypto';

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

export interface PaymentParams {
  serviceId?: string;
  beatId?: string;
  kitId?: string;
  dropId?: string;
  tier?: string;
  clientName: string;
  clientEmail: string;
  notes?: string;
}

export interface PriceResult {
  usd: number;
  mxn?: number;
  productName: string;
  productType: string;
  productId: string;
}

export async function getPriceFromDb(params: PaymentParams): Promise<PriceResult> {
  const db = adminDb();
  const productType = params.serviceId ? 'service' : params.beatId ? 'beat' : params.kitId ? 'drumkit' : 'drop';
  const productId = params.serviceId ?? params.beatId ?? params.kitId ?? params.dropId ?? '';

  if (params.beatId) {
    const beatDoc = await db.doc(`beats/${params.beatId}`).get();
    if (!beatDoc.exists) throw new Error('Beat not found');
    const beat = beatDoc.data()!;

    if (beat.isSold) throw new Error('Beat ya vendido');

    let usd: number;
    if (params.tier === 'premium') usd = beat.pricePremium;
    else if (params.tier === 'exclusive') usd = beat.priceExclusive;
    else usd = beat.priceBasic;

    return { usd, productName: beat.title, productType, productId };
  }

  if (params.kitId) {
    const kitDoc = await db.doc(`drumkits/${params.kitId}`).get();
    if (!kitDoc.exists) throw new Error('Drumkit not found');
    const kit = kitDoc.data()!;
    return { usd: kit.price, productName: kit.title, productType, productId };
  }

  if (params.serviceId) {
    const svcDoc = await db.doc(`services/${params.serviceId}`).get();
    if (!svcDoc.exists) throw new Error('Service not found');
    const svc = svcDoc.data()!;

    const tier = svc.tiers?.find((t: { name: string }) => t.name === (params.tier ?? 'basic'));
    if (!tier) throw new Error('Tier not found');

    return {
      usd: tier.price,
      mxn: tier.priceMXN,
      productName: `${svc.title} — ${tier.label}`,
      productType,
      productId,
    };
  }

  if (params.dropId) {
    const dropDoc = await db.doc(`drops/${params.dropId}`).get();
    if (!dropDoc.exists) throw new Error('Drop not found');
    const drop = dropDoc.data()!;
    if (drop.isSoldOut) throw new Error('Drop agotado');
    return { usd: drop.price, productName: drop.title, productType, productId };
  }

  throw new Error('No product specified');
}

export async function createPendingOrder(params: PaymentParams): Promise<string> {
  const db = adminDb();
  const price = await getPriceFromDb(params);
  const portalToken = crypto.randomBytes(32).toString('hex');

  const orderRef = db.collection('orders').doc();
  await orderRef.set({
    clientId: null, // Will be set by webhook or caller
    clientName: params.clientName,
    clientEmail: params.clientEmail,
    productType: price.productType,
    productId: price.productId,
    productName: price.productName,
    tier: params.tier ?? null,
    status: 'pending_payment',
    payment: {
      method: 'stripe',
      status: 'pending',
      amount: price.usd,
      currency: 'USD',
    },
    notes: params.notes ?? null,
    portalToken,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  await orderRef.collection('timeline').doc('created').set({
    event: 'order_created',
    message: 'Orden creada. Esperando pago.',
    timestamp: FieldValue.serverTimestamp(),
  });

  return orderRef.id;
}

export async function createPaymentIntent(params: PaymentParams): Promise<{ clientSecret: string; orderId: string }> {
  const price = await getPriceFromDb(params);
  const orderId = await createPendingOrder(params);

  // For exclusive beats, reserve during checkout
  if (params.beatId && params.tier === 'exclusive') {
    const { reserveBeat } = await import('./queries');
    const reserved = await reserveBeat(params.beatId, 'checkout-' + orderId);
    if (!reserved) throw new Error('El beat exclusivo ya no está disponible');
  }

  const intent = await stripe().paymentIntents.create({
    amount: Math.round(price.usd * 100),
    currency: 'usd',
    metadata: {
      orderId,
      productType: price.productType,
      productId: price.productId,
      tier: params.tier ?? '',
      clientEmail: params.clientEmail,
      clientName: params.clientName,
    },
    receipt_email: params.clientEmail,
  });

  // Update order with payment intent ID
  await adminDb().doc(`orders/${orderId}`).update({
    'payment.paymentId': intent.id,
  });

  return { clientSecret: intent.client_secret!, orderId };
}
