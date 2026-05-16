import { adminDb, FieldValue } from '$lib/server/firebase-admin';
import { rateLimit } from '$lib/server/rate-limit';
import { CreateOrderSchema } from '$utils/validators';
import { createPaymentIntent } from '$lib/server/stripe';
import { createMPPreference } from '$lib/server/mercadopago';
import { json, error } from '@sveltejs/kit';
import crypto from 'crypto';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  await rateLimit('orders', ip);

  const body = await request.json();
  const result = CreateOrderSchema.safeParse(body);

  if (!result.success) {
    throw error(400, result.error.issues[0].message);
  }

  const data = result.data;
  const portalToken = crypto.randomBytes(32).toString('hex');
  const db = adminDb();

  // Create order document
  const orderRef = db.collection('orders').doc();
  await orderRef.set({
    clientName: data.clientName,
    clientEmail: data.clientEmail,
    productType: data.serviceId ? 'service' : data.beatId ? 'beat' : data.kitId ? 'drumkit' : 'drop',
    productId: data.serviceId ?? data.beatId ?? data.kitId ?? data.dropId,
    productName: '', // Fetch from Firestore
    tier: data.tier ?? null,
    status: 'pending_payment',
    payment: {
      method: data.paymentMethod,
      status: 'pending',
      amount: 0, // Fetch real price
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
    const { clientSecret } = await createPaymentIntent({
      serviceId: data.serviceId,
      beatId: data.beatId,
      kitId: data.kitId,
      dropId: data.dropId,
      clientEmail: data.clientEmail,
      notes: data.notes,
    });
    return json({ orderId: orderRef.id, clientSecret, portalToken });
  } else {
    const initPoint = await createMPPreference({
      orderId: orderRef.id,
      title: 'Orden YUGEN',
      price: 0, // Fetch real price
      email: data.clientEmail,
    });
    return json({ orderId: orderRef.id, initPoint, portalToken });
  }
};
