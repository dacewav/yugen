import { adminDb, FieldValue } from '$lib/server/firebase-admin';
import { markBeatSold } from '$lib/server/queries';
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
    let orderData: Record<string, unknown> | undefined;

    await db.runTransaction(async (tx) => {
      const orderRef = db.doc(`orders/${orderId}`);
      const order = await tx.get(orderRef);

      if (!order.exists) return;
      if (order.data()?.payment?.status === 'paid') return;

      orderData = order.data();

      tx.update(orderRef, {
        'payment.status': 'paid',
        'payment.paymentId': String(paymentId),
        status: orderData?.productType === 'beat' ? 'completed' : 'stems_needed',
        updatedAt: FieldValue.serverTimestamp(),
      });

      tx.set(db.doc(`orders/${orderId}/timeline/payment_received`), {
        event: 'payment_received',
        message: 'Pago recibido (MercadoPago). Esperando stems.',
        timestamp: FieldValue.serverTimestamp(),
      });
    });

    // For exclusive beats, mark as sold
    if (orderData?.productType === 'beat' && orderData?.tier === 'exclusive' && orderData?.productId) {
      await markBeatSold(orderData.productId as string, 'mp-buyer', orderId).catch(console.error);
    }

    // Add to client's purchase history
    if (orderData?.clientEmail) {
      const clientSnap = await db.collection('clients')
        .where('email', '==', orderData.clientEmail)
        .limit(1)
        .get();
      if (!clientSnap.empty) {
        await clientSnap.docs[0].ref.update({
          purchaseHistory: FieldValue.arrayUnion(orderId),
        }).catch(console.error);
      }
    }
  }

  return json({ received: true });
};
