import { adminDb, FieldValue } from '$lib/server/firebase-admin';
import { rateLimit } from '$lib/server/rate-limit';
import { CreateOrderSchema } from '$utils/validators';
import { createPaymentIntent, getPriceFromDb } from '$lib/server/stripe';
import { createMPPreference } from '$lib/server/mercadopago';
import { reserveBeat } from '$lib/server/queries';
import { json, error } from '@sveltejs/kit';
import crypto from 'crypto';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  await rateLimit('orders', ip);

  const body = await request.json();
  const result = CreateOrderSchema.safeParse(body);

  if (!result.success) {
    throw error(400, result.error.issues[0].message);
  }

  const data = result.data;

  // Get real price from Firestore
  let price;
  try {
    price = await getPriceFromDb(data);
  } catch (e) {
    throw error(400, e instanceof Error ? e.message : 'Error al obtener precio');
  }

  // For exclusive beats, reserve before creating order
  if (data.beatId && data.tier === 'exclusive') {
    const uid = locals.user?.uid ?? 'guest-' + Date.now();
    const reserved = await reserveBeat(data.beatId, uid);
    if (!reserved) {
      throw error(409, 'El beat exclusivo ya no está disponible');
    }
  }

  const portalToken = crypto.randomBytes(32).toString('hex');
  const db = adminDb();

  // Create order document with real data
  const orderRef = db.collection('orders').doc();
  await orderRef.set({
    clientId: locals.user?.uid ?? null,
    clientName: data.clientName,
    clientEmail: data.clientEmail,
    productType: price.productType,
    productId: price.productId,
    productName: price.productName,
    tier: data.tier ?? null,
    status: 'pending_payment',
    payment: {
      method: data.paymentMethod,
      status: 'pending',
      amount: data.paymentMethod === 'stripe' ? price.usd : (price.mxn ?? Math.round(price.usd * 17.5)),
      currency: data.paymentMethod === 'stripe' ? 'USD' : 'MXN',
    },
    notes: data.notes ?? null,
    portalToken,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  // Create initial timeline event
  await orderRef.collection('timeline').doc('created').set({
    event: 'order_created',
    message: 'Orden creada. Esperando pago.',
    timestamp: FieldValue.serverTimestamp(),
  });

  // Handle payment
  if (data.paymentMethod === 'stripe') {
    try {
      const { clientSecret } = await createPaymentIntent(data);
      return json({ orderId: orderRef.id, clientSecret, portalToken });
    } catch (e) {
      // Rollback order on payment setup failure
      await orderRef.update({ status: 'cancelled', 'payment.status': 'failed' });
      throw error(500, e instanceof Error ? e.message : 'Error al crear pago');
    }
  } else {
    try {
      const initPoint = await createMPPreference({ ...data, orderId: orderRef.id });
      return json({ orderId: orderRef.id, initPoint, portalToken });
    } catch (e) {
      await orderRef.update({ status: 'cancelled', 'payment.status': 'failed' });
      throw error(500, e instanceof Error ? e.message : 'Error al crear preferencia de MercadoPago');
    }
  }
};
