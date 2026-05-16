import { adminDb, FieldValue } from '$lib/server/firebase-admin';
import { error, json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.text();

  let notification;
  try {
    notification = JSON.parse(body);
  } catch {
    throw error(400, 'Invalid JSON');
  }

  if (notification.type !== 'payment') {
    return json({ received: true });
  }

  const paymentId = notification.data?.id;
  if (!paymentId) {
    throw error(400, 'Missing payment ID');
  }

  const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: {
      Authorization: `Bearer ${env.MP_ACCESS_TOKEN}`,
    },
  });

  if (!mpRes.ok) {
    throw error(500, 'Failed to fetch MP payment');
  }

  const payment = await mpRes.json();
  const orderId = payment.external_reference;

  if (!orderId) {
    return json({ received: true });
  }

  const db = adminDb();

  if (payment.status === 'approved') {
    await db.runTransaction(async (tx) => {
      const orderRef = db.doc(`orders/${orderId}`);
      const order = await tx.get(orderRef);

      if (!order.exists) return;
      if (order.data()?.payment?.status === 'paid') return;

      tx.update(orderRef, {
        'payment.status': 'paid',
        'payment.paymentId': String(paymentId),
        status: 'stems_needed',
        updatedAt: FieldValue.serverTimestamp(),
      });

      tx.set(db.doc(`orders/${orderId}/timeline/payment_received`), {
        event: 'payment_received',
        message: 'Pago recibido (MercadoPago). Esperando stems.',
        timestamp: FieldValue.serverTimestamp(),
      });
    });
  }

  return json({ received: true });
};
