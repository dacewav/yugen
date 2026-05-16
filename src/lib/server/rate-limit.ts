// Rate limiting with Upstash Redis
// Install: npm install @upstash/ratelimit @upstash/redis
import { error } from '@sveltejs/kit';

// Placeholder — replace with actual Upstash implementation after installing deps
// import { Ratelimit } from '@upstash/ratelimit';
// import { Redis } from '@upstash/redis';

interface RateLimitResult {
  success: boolean;
  reset: number;
}

// Stub implementation — swap for Upstash after npm install
const stores = new Map<string, { count: number; resetAt: number }>();

export async function rateLimit(
  type: 'api' | 'auth' | 'orders' | 'uploads',
  identifier: string
): Promise<void> {
  const limits: Record<string, { max: number; windowMs: number }> = {
    api: { max: 10, windowMs: 60_000 },
    auth: { max: 3, windowMs: 15 * 60_000 },
    orders: { max: 1, windowMs: 60 * 60_000 },
    uploads: { max: 30, windowMs: 60 * 60_000 },
  };

  const config = limits[type];
  const key = `${type}:${identifier}`;
  const now = Date.now();
  const entry = stores.get(key);

  if (!entry || now > entry.resetAt) {
    stores.set(key, { count: 1, resetAt: now + config.windowMs });
    return;
  }

  if (entry.count >= config.max) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    throw error(429, `Too many requests. Retry in ${retryAfter}s`);
  }

  entry.count++;
}
