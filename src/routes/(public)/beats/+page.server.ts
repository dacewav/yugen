import { getBeats } from '$lib/server/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  const genre = url.searchParams.get('genre') ?? undefined;
  const mood = url.searchParams.get('mood') ?? undefined;
  const key = url.searchParams.get('key') ?? undefined;
  const sort = url.searchParams.get('sort') as 'recent' | 'popular' | 'price_asc' | 'price_desc' | undefined;
  const search = url.searchParams.get('q') ?? undefined;
  const bpmMin = url.searchParams.has('bpm_min') ? Number(url.searchParams.get('bpm_min')) : undefined;
  const bpmMax = url.searchParams.has('bpm_max') ? Number(url.searchParams.get('bpm_max')) : undefined;
  const priceMin = url.searchParams.has('price_min') ? Number(url.searchParams.get('price_min')) : undefined;
  const priceMax = url.searchParams.has('price_max') ? Number(url.searchParams.get('price_max')) : undefined;

  try {
    const beats = await getBeats({ genre, mood, key, sort, search, bpmMin, bpmMax, priceMin, priceMax });
    return {
      beats,
      filters: { genre, mood, key, sort, search, bpmMin, bpmMax, priceMin, priceMax },
    };
  } catch (e) {
    // Firestore not configured — return empty
    console.error('[beats] Query error:', e);
    return {
      beats: [],
      filters: { genre, mood, key, sort, search, bpmMin, bpmMax, priceMin, priceMax },
    };
  }
};
