import { error, redirect } from '@sveltejs/kit';
import { adminDb } from '$lib/server/firebase-admin';
import { getPrivateDownloadUrl } from '$lib/server/r2';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, locals, url }) => {
  const { token } = params;
  const fileKey = url.searchParams.get('key');

  if (!token) {
    throw error(400, 'Missing download token');
  }

  const db = adminDb();

  // Find order by portal token
  const ordersSnap = await db.collection('orders')
    .where('portalToken', '==', token)
    .limit(1)
    .get();

  if (ordersSnap.empty) {
    throw error(404, 'Link de descarga inválido');
  }

  const orderDoc = ordersSnap.docs[0];
  const order = orderDoc.data();

  // Verify the order is completed or paid
  if (!['completed', 'paid'].includes(order.status)) {
    throw error(403, 'La orden aún no está lista para descarga');
  }

  // If a specific file key is requested, verify it belongs to this order
  if (fileKey) {
    const uploads = order.uploads as Record<string, Record<string, string>> | undefined;
    const deliverables = uploads?.deliverables;

    if (!deliverables || !Object.values(deliverables).includes(fileKey)) {
      throw error(403, 'Archivo no autorizado');
    }

    try {
      const downloadUrl = await getPrivateDownloadUrl(fileKey);
      throw redirect(302, downloadUrl);
    } catch (e) {
      if (e && typeof e === 'object' && 'status' in e) throw e;
      throw error(500, 'Error al generar link de descarga');
    }
  }

  // No specific key — list available downloads
  const uploads = order.uploads as Record<string, Record<string, string>> | undefined;
  const deliverables = uploads?.deliverables;

  if (!deliverables || Object.keys(deliverables).length === 0) {
    throw error(404, 'No hay archivos disponibles para descarga');
  }

  // Generate signed URLs for all deliverables
  const downloads: Record<string, string> = {};
  for (const [name, key] of Object.entries(deliverables)) {
    try {
      downloads[name] = await getPrivateDownloadUrl(key);
    } catch {
      // Skip files that fail
    }
  }

  // Return as JSON for the portal to use
  return new Response(JSON.stringify({ downloads, orderId: orderDoc.id }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
