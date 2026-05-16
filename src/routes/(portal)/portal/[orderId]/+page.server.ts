import { error } from '@sveltejs/kit';
import { adminDb } from '$lib/server/firebase-admin';
import { getPrivateDownloadUrl } from '$lib/server/r2';
import type { PageServerLoad } from './$types';
import type { Order } from '$types/order';

export const load: PageServerLoad = async ({ params }) => {
  const { orderId } = params;
  const db = adminDb();

  // Find order by portal token or order ID
  const orderDoc = await db.doc(`orders/${orderId}`).get();

  let orderData: Record<string, unknown>;
  let orderRef: FirebaseFirestore.DocumentReference;

  if (!orderDoc.exists) {
    const orders = await db.collection('orders')
      .where('portalToken', '==', orderId)
      .limit(1)
      .get();

    if (orders.empty) {
      throw error(404, 'Orden no encontrada');
    }

    orderRef = orders.docs[0].ref;
    orderData = { id: orders.docs[0].id, ...orders.docs[0].data() };
  } else {
    orderRef = orderDoc.ref;
    orderData = { id: orderDoc.id, ...orderDoc.data() };
  }

  const timelineSnap = await orderRef.collection('timeline')
    .orderBy('timestamp', 'asc')
    .get();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let downloadUrls: Record<string, string> = {};
  const uploads = orderData.uploads as Record<string, Record<string, string>> | undefined;
  if (orderData.status === 'completed' && uploads?.deliverables) {
    for (const [key, r2Key] of Object.entries(uploads.deliverables)) {
      downloadUrls[key] = await getPrivateDownloadUrl(r2Key);
    }
  }

  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    order: orderData as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    timeline: timelineSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any,
    downloadUrls,
  };
};
