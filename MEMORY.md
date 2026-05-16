# YUGEN.STORE — Cerebro del proyecto

> Repo: https://github.com/dacewav/yugen (main)
> Stack: SvelteKit 2 + Svelte 5 + Firebase Firestore + Cloudflare Pages + R2 + TypeScript
> Último update: 2026-05-17

## Estado actual

### ✅ Completado
- Scaffolding completo (50+ archivos fuente)
- **Fase 1 completa**: client model, queries reales, filtros, exclusividad, magic link, favoritos, account pages, seed data
- **Fase 2 completa**: precios reales desde Firestore, checkout page, Stripe/MercadoPago flows, webhooks con exclusive beat handling, secure downloads
- 10 beats, 3 drumkits, 3 servicios, 1 cliente de prueba en Firestore
- 0 TypeScript errors, build Cloudflare OK

### ⚠️ Pendiente deploy
- Firestore composite indexes no deployados (queries filtran en memoria)
- No hay deploy en Cloudflare Pages aún
- .env.local con credenciales Firebase (no se pushea)

## Stack y decisiones técnicas

- **Svelte 5**: runes (`$state`, `$derived`, `$effect`), `$props()`, `onsubmit` (no `on:submit`)
- **Firebase Admin**: lazy init en `src/lib/server/firebase-admin.ts`, nunca en import time
- **Firestore Timestamps**: se convierten a ISO strings con `toPlain()` para serialización SSR
- **Cloudflare adapter**: parcheado con `scripts/patch-cf-adapter.mjs` para externalizar Node built-ins
- **Queries**: composite indexes no deployados → filtro `isPublished`/`isActive` en memoria
- **Exclusividad**: transacciones atómicas con `reserveBeat()` (5min lock) + `markBeatSold()`
- **Auth**: session cookies (14 días), `isClient` flag para diferenciar crew vs clientes

## Archivos clave

| Archivo | Qué hace |
|---|---|
| `src/lib/server/queries.ts` | **Módulo central** — todas las queries Firestore + exclusividad |
| `src/lib/server/stripe.ts` | `getPriceFromDb()`, `createPendingOrder()`, `createPaymentIntent()` |
| `src/lib/server/mercadopago.ts` | Preferencias MP con precios reales |
| `src/lib/server/firebase-admin.ts` | Lazy init Firebase Admin |
| `src/hooks.server.ts` | Auth middleware, client vs crew detection |
| `src/lib/types/content.ts` | Beat, Drumkit, Service types (con exclusividad) |
| `src/lib/types/client.ts` | Client type |
| `scripts/seed.mjs` | Seed data (10 beats, 3 kits, 3 services, 1 client) |

## Firebase

- Project: `yugen-c8655`
- Service account: `firebase-adminsdk-fbsvc@yugen-c8655.iam.gserviceaccount.com`
- Private key: tiene 1 byte extra al final — se reparó con ASN.1 trimming
- Firestore: habilitado, modo production
- Colecciones: `beats`, `drumkits`, `services`, `clients`, `orders`, `drops`

## Próximos pasos (ROADMAP)

1. **Deploy Cloudflare Pages** — GitHub integration o Wrangler CLI
2. **Deploy Firestore indexes** — `npx firebase deploy --only firestore:indexes`
3. **Fase 3**: audio pipeline (WaveSurfer.js), imágenes (sharp/WebP), contratos/licencias
4. **Fase 4**: reviews/ratings, recomendaciones, newsletter, drops countdown, analytics
5. **Fase 5**: admin CRUD UI (backend ya está)
6. **Fase 6**: polish, SEO, performance, CI/CD

## Session template para próximo chat

```
Estoy construyendo YUGEN.STORE — beat store con SvelteKit 2 + Firebase Firestore + Cloudflare R2 + Stripe/MercadoPago.

Repo: https://github.com/dacewav/yugen (rama main)

Lee primero:
- .guide/ROADMAP.md (plan completo con 6 fases)
- memory/ (sesiones anteriores)
- src/lib/server/queries.ts (módulo central de queries)
- src/lib/server/stripe.ts (pagos)
- src/hooks.server.ts (auth)

Estado: Fase 1 y 2 completas. 10 beats, 3 drumkits, 3 servicios en Firestore. Dev server funciona local.

Objetivo: [INSERTAR — ej: Deploy en Cloudflare Pages / Fase 3 audio pipeline / Fase 5 admin CRUD]

Constraints:
- Svelte 5 (runes: $state, $derived, $effect)
- 0 TypeScript errors, svelte-check limpio
- Firebase Admin lazy init
- Cloudflare adapter parcheado
- Commits frecuentes
```
