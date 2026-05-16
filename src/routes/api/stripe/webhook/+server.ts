import { stripe } from '$lib/server/stripe';
import { adminDb, FieldValue } from '$lib/server/firebase-admin';
import { sendEmail } from '$lib/server/resend';
import { orderConfirmationTemplate } from '$lib/server/email-templates';
import { error, json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  if (!sig) throw error(400, 'No signature');

  let event;
  try {
    event = stripe().webhooks.constructEvent(body, sig, env.STRIPE_WEBHOOK_SECRET ?? '');
  } catch {
    throw error(400, 'Invalid signature');
  }

  // Respond immediately — process async
  handleEvent(event).catch(console.error);

  return json({ received: true });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleEvent(event: any) {
  const db = adminDb();

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const intent = event.data.object;
      const { orderId } = intent.metadata;

      await db.runTransaction(async (tx) => {
        const orderRef = db.doc(`orders/${orderId}`);
        const order = await tx.get(orderRef);

        if (!order.exists) return;
        if (order.data()?.payment?.status === 'paid') return;

        tx.update(orderRef, {
          'payment.status': 'paid',
          'payment.paymentId': intent.id,
          status: 'stems_needed',
          updatedAt: FieldValue.serverTimestamp(),
        });

        tx.set(db.doc(`orders/${orderId}/timeline/payment_received`), {
          event: 'payment_received',
          message: 'Pago recibido. Esperando stems.',
          timestamp: FieldValue.serverTimestamp(),
        });
      });

      // Send confirmation email
      const orderDoc = await db.doc(`orders/${orderId}`).get();
      if (orderDoc.exists) {
        const order = orderDoc.data()!;
        await sendEmail({
          to: order.clientEmail,
          subject: `Orden confirmada — ${order.productName}`,
          html: orderConfirmationTemplate({
            clientName: order.clientName,
            serviceName: order.productName,
            orderId,
            portalUrl: `${env.PUBLIC_SITE_URL}/portal/${order.portalToken}`,
            deadline: order.deadline
              ? new Date(order.deadline.toDate()).toLocaleDateString('es-MX')
              : 'Por confirmar',
          }),
        }).catch(console.error);
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const intent = event.data.object;
      const { orderId } = intent.metadata;

      await db.doc(`orders/${orderId}`).update({
        'payment.status': 'failed',
        status: 'cancelled',
        updatedAt: FieldValue.serverTimestamp(),
      }).catch(console.error);
      break;
    }

    case 'charge.refunded': {
      const charge = event.data.object;
      const orderId = charge.metadata?.orderId;

      if (orderId) {
        await db.doc(`orders/${orderId}`).update({
          'payment.status': 'refunded',
          status: 'refunded',
          updatedAt: FieldValue.serverTimestamp(),
        }).catch(console.error);
      }
      break;
    }
  }
}
