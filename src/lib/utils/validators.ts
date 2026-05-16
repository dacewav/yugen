import { z } from 'zod';

export const CreateOrderSchema = z.object({
  serviceId: z.string().min(1).max(100).optional(),
  beatId: z.string().min(1).max(100).optional(),
  kitId: z.string().min(1).max(100).optional(),
  dropId: z.string().min(1).max(100).optional(),
  tier: z.enum(['basic', 'standard', 'premium']).optional(),
  clientName: z.string().min(2).max(100).trim(),
  clientEmail: z.string().email().toLowerCase().trim(),
  notes: z.string().max(2000).trim().optional(),
  paymentMethod: z.enum(['stripe', 'mercadopago']),
}).refine(
  data => data.serviceId || data.beatId || data.kitId || data.dropId,
  { message: 'Debes especificar un producto.' }
);

export const UploadMetaSchema = z.object({
  contentType: z.enum([
    'audio/mpeg', 'audio/wav', 'audio/flac', 'audio/aiff',
    'image/jpeg', 'image/png', 'image/webp',
    'application/zip',
  ]),
  fileSize: z.number().int().positive().max(500 * 1024 * 1024),
  fileName: z.string().min(1).max(255).regex(/^[a-zA-Z0-9._\- ]+$/),
});

export const ContactSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: z.string().email().toLowerCase().trim(),
  subject: z.string().min(3).max(200).trim(),
  message: z.string().min(10).max(5000).trim(),
});

export const NewsletterSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
});

export const BeatSchema = z.object({
  title: z.string().min(2).max(100).trim(),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/),
  genre: z.array(z.string()).min(1).max(5),
  bpm: z.number().int().min(60).max(200),
  key: z.string().max(10).optional(),
  mood: z.array(z.string()).max(5).optional(),
  tags: z.array(z.string()).max(10),
  priceBasic: z.number().min(0),
  pricePremium: z.number().min(0),
  priceExclusive: z.number().min(0),
});
