# 🎯 ROADMAP — YUGEN.STORE
**Stack:** SvelteKit 2 + Svelte 5 + Firebase Firestore + Cloudflare Pages + R2 + TypeScript
**Repo:** https://github.com/dacewav/yugen
**Último update:** 2026-05-17

---

## 📌 Estado actual

- ✅ Scaffolding completo (50 archivos fuente)
- ✅ Server modules: firebase-admin, r2, stripe, mercadopago, resend, auth, rate-limit
- ✅ API endpoints: auth, webhooks, r2 upload, orders
- ✅ Páginas: beats, drumkits, services, drops, contact, admin, portal
- ✅ Firestore rules + indexes definidos
- ✅ Design system CSS (dark theme)
- ✅ `svelte-check` 0 errores, Cloudflare build OK
- ⚠️ Server loads retornan arrays vacíos (sin queries reales)
- ⚠️ Sin audio pipeline, sin imágenes sharp, sin search

---

## 🔴 FASE 1: Fundamentos de datos (CRÍTICO — sin esto el producto no funciona)

### 1.1 — Modelo de CLIENTE
**Problema:** Solo existe `members` (el crew). Los compradores no tienen documento.
**Archivo nuevo:** `src/lib/types/client.ts`
**Colección Firestore:** `clients/{clientId}`
```typescript
interface Client {
  id: string;
  uid: string;           // Firebase Auth UID
  email: string;
  displayName?: string;
  photoURL?: string;
  phone?: string;
  country?: string;
  purchaseHistory: string[];  // order IDs
  favorites: string[];        // beat IDs
  createdAt: Date;
  lastLoginAt: Date;
}
```
**Tareas:**
- [ ] Crear tipo `Client`
- [ ] Crear cliente automáticamente al hacer login (Google o email)
- [ ] Guardar en Firestore `clients/{uid}`
- [ ] Actualizar `hooks.server.ts` para detectar clientes vs crew
- [ ] Crear página `/account` con perfil del cliente
- [ ] Crear página `/account/orders` con historial de compras

### 1.2 — Lógica de exclusividad (transacción atómica)
**Problema:** Si dos personas compran el mismo beat exclusivo al mismo tiempo, se vende dos veces.
**Archivo:** `src/lib/server/exclusivity.ts`
**Tareas:**
- [ ] Agregar campos al beat: `isExclusive`, `isSold`, `soldTo`, `soldAt`, `soldOrderId`
- [ ] Transacción atómica al comprar exclusivo:
  ```
  tx.get(beatRef) → if (!beat.isSold) → tx.update({ isSold: true, soldTo, soldAt })
  → if (beat.isSold) → throw error(409, 'Beat ya vendido')
  ```
- [ ] Marcar beat como no disponible en la UI cuando `isSold === true`
- [ ] Endpoint `POST /api/beats/reserve` con lock temporal (5min) mientras el cliente paga
- [ ] Si el pago falla, liberar el beat (rollback)

### 1.3 — Portal con login real (no solo token)
**Problema:** Si el cliente pierde el link del portal, pierde acceso a sus compras.
**Tareas:**
- [ ] Los clientes autenticados ven sus órdenes en `/account/orders`
- [ ] El portal por token (`/portal/{token}`) sigue funcionando para guest checkout
- [ ] Agregar magic link por email para recuperar acceso al portal
- [ ] Email post-compra con link al portal + link para crear cuenta

### 1.4 — Search y filtrado de beats
**Problema:** Con 50+ beats el catálogo es inútil sin búsqueda.
**Opciones:**
- **Opción A (simple):** Firestore queries con composite indexes (ya definidos)
- **Opción B (mejor):** Algolia o Meilisearch para full-text search
**Tareas:**
- [ ] Filtros por: género, BPM range, mood, key, precio range
- [ ] Ordenamiento: recientes, populares, precio asc/desc
- [ ] Search por nombre de beat y tags
- [ ] UI: barra de filtros en `/beats` con pills/badges
- [ ] Filtros como query params para URLs compartibles (`/beats?genre=trap&bpm=140`)

---

## 🟡 FASE 2: Pagos y órdenes reales

### 2.1 — Stripe: getPriceFromDb() y createPendingOrder()
**Archivo:** `src/lib/server/stripe.ts`
**Tareas:**
- [ ] `getPriceFromDb()`: consultar Firestore para precio real del beat/servicio/kit
- [ ] `createPendingOrder()`: crear documento en `orders/` con status `pending_payment`
- [ ] Validar que el precio no fue manipulado (SIEMPRE server-side)
- [ ] Idempotency key en PaymentIntent para evitar cobros dobles
- [ ] Webhook: actualizar order status + crear timeline event + enviar email

### 2.2 — MercadoPago: flujo completo
**Archivo:** `src/lib/server/mercadopago.ts`
**Tareas:**
- [ ] Obtener precio real desde Firestore (no hardcodeado)
- [ ] Crear preference con datos reales del producto
- [ ] Webhook: verificar pago con la API de MP
- [ ] Tipo de cambio: job diario que consulta `open.er-api.com` y actualiza `config/exchange`

### 2.3 — Checkout flow completo
**Tareas:**
- [ ] Página `/checkout` con resumen de orden
- [ ] Selección de método de pago (Stripe vs MercadoPago)
- [ ] Formulario de datos del cliente (nombre, email)
- [ ] Para beats exclusivos: verificación de disponibilidad antes de pagar
- [ ] Post-pago: redirect a `/portal/{token}` con confirmación
- [ ] Email de confirmación con link al portal

### 2.4 — Descargas seguras
**Tareas:**
- [ ] Endpoint `GET /api/download/{token}` con signed URL de R2
- [ ] Token de descarga con TTL (7 días)
- [ ] Verificar que el usuario tiene derecho a la descarga (es el comprador)
- [ ] Contador de descargas (limitar a N descargas por compra)
- [ ] Link de re-descarga desde el portal

---

## 🟢 FASE 3: Contenido y media

### 3.1 — Audio pipeline
**Opción C (MVP):** WaveSurfer calcula waveform en browser. Sin procesamiento server.
**Opción A (producción):** ffmpeg.wasm en Cloudflare Worker o micro-servicio Railway.
**Tareas:**
- [ ] Componente `BeatPlayer.svelte` con WaveSurfer.js
- [ ] Preview de 30s (cortar en browser o server)
- [ ] Waveform visualization
- [ ] Play/pause, progress bar, tiempo actual/duración
- [ ] IntersectionObserver para lazy load
- [ ] Preload de audio al hover
- [ ] Migrar a Opción A cuando haya 20+ beats

### 3.2 — Imágenes con sharp
**Archivo:** `src/lib/server/image-processor.ts`
**Tareas:**
- [ ] Integrar sharp para convertir a WebP al subir
- [ ] Tamaños estándar: avatars 240x240, covers 600x600, banners 1200x400, OG 1200x630
- [ ] Upload flow: cliente → pre-signed URL → R2 → server procesa → guarda en R2 público
- [ ] Lazy loading + `decoding="async"` en todas las imágenes
- [ ] `srcset` para responsive images

### 3.3 — Contracts / Licencias
**Referencia:** `contracts/` en storewav (01-mp3, 02-wav, 03-premium, 04-ilimitada, 05-exclusiva)
**Tareas:**
- [ ] Definir 3-4 tiers de licencia para YUGEN (Basic, Premium, Exclusive)
- [ ] Template de contrato en Markdown
- [ ] Generar PDF de contrato al comprar (con datos de la orden)
- [ ] Guardar contrato en R2 y link en la orden
- [ ] Página `/verify/{hash}` para verificar contratos
- [ ] Hash del contrato = SHA256(orderId + licenseType + fecha)

---

## 🔵 FASE 4: Features de producto

### 4.1 — Favoritos / Wishlist
**Tareas:**
- [ ] Campo `favorites: string[]` en el documento del cliente
- [ ] Botón de corazón en BeatCard (toggle)
- [ ] Persistir en Firestore (no solo local)
- [ ] Página `/account/favorites`
- [ ] Badge en nav con count de favoritos

### 4.2 — Reviews / Ratings
**Tareas:**
- [ ] Colección `reviews/{reviewId}` con: beatId, clientId, rating (1-5), comment, createdAt
- [ ] Mostrar rating promedio en BeatCard
- [ ] Mostrar reviews individuales en beat detail
- [ ] Moderación: reviews pendientes de aprobación
- [ ] Un review por cliente por beat

### 4.3 — Recomendaciones
**Tareas:**
- [ ] "Beats similares": mismo género + mismo rango de BPM
- [ ] "Lo que otros compraron": co-occurrence analysis
- [ ] "Basado en tu historial": filtrado colaborativo simple
- [ ] MVP: mostrar 4 beats relacionados en beat detail

### 4.4 — Newsletter
**Tareas:**
- [ ] Doble opt-in: signup → email de confirmación → confirmar
- [ ] Colección `newsletter/{email}` con `confirmed: boolean`
- [ ] Endpoint `POST /api/newsletter/subscribe`
- [ ] Endpoint `GET /api/newsletter/confirm/{token}`
- [ ] Envío masivo: ¿Resend batch? ¿Mailchimp? ¿ConvertKit?
- [ ] Template de newsletter

### 4.5 — Drops con countdown
**Tareas:**
- [ ] Countdown server-rendered (no client-side manipulable)
- [ ] Auto-close cuando se agota (maxBuyers alcanzado)
- [ ] Notificación a los que no alcanzaron (email)
- [ ] Subcolección `drops/{dropId}/buyers/{uid}` para tracking

### 4.6 — Analytics de reproducción
**Tareas:**
- [ ] Registrar play con: uid (o anon), beatId, timestamp, duration listened
- [ ] Distinguir preview (30s) vs full play
- [ ] Distributed counters (ya implementado en spec)
- [ ] Dashboard de analytics en admin: plays por día, top beats, etc.
- [ ] No contar plays duplicados del mismo usuario en misma sesión

---

## 🟣 FASE 5: Admin CRUD completo

### 5.1 — Beats CRUD
**Tareas:**
- [ ] Formulario crear/editar beat: título, género, BPM, key, mood, tags, precios
- [ ] Upload de cover image (→ R2 público, convertir a WebP con sharp)
- [ ] Upload de audio file (→ R2 privado, generar preview)
- [ ] Preview del beat en el admin antes de publicar
- [ ] Toggle publicar/despublicar
- [ ] Marcar como featured
- [ ] Eliminar con confirmación

### 5.2 — Drumkits CRUD
**Tareas:**
- [ ] Formulario crear/editar drumkit
- [ ] Upload de cover + ZIP de samples
- [ ] Contar samples automáticamente
- [ ] Preview de samples individuales

### 5.3 — Services CRUD
**Tareas:**
- [ ] Formulario crear/editar servicio
- [ ] Definir tiers (nombre, precio, features, días de entrega, revisiones)
- [ ] Precios en USD y MXN

### 5.4 — Orders management
**Tareas:**
- [ ] Lista de órdenes con filtros por status
- [ ] Detalle de orden con timeline
- [ ] Cambiar status manualmente
- [ ] Subir entregables al portal del cliente
- [ ] Mensajes al cliente (chat en portal)

### 5.5 — Members management
**Tareas:**
- [ ] Invitar nuevo miembro (crear usuario + setear custom claims)
- [ ] Editar perfil de miembro
- [ ] Cambiar rol
- [ ] Desactivar miembro

---

## 🟤 FASE 6: Pulir y production-ready

### 6.1 — UI/UX polish
- [ ] Animaciones de página (View Transitions API)
- [ ] Add-to-cart animation
- [ ] Like animation (heart burst)
- [ ] Skeleton loaders realistas
- [ ] Empty states con illustrations
- [ ] Loading states con feedback
- [ ] Toast notifications
- [ ] Mobile bottom nav bar
- [ ] Responsive: 375px → 1440px

### 6.2 — SEO
- [ ] Meta tags dinámicos por página
- [ ] OG images dinámicos
- [ ] Sitemap.xml dinámico (beats, kits, páginas estáticas)
- [ ] robots.txt
- [ ] Canonical URLs
- [ ] Structured data (JSON-LD)

### 6.3 — Performance
- [ ] Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
- [ ] Code splitting (ya lo hace SvelteKit)
- [ ] Image optimization (WebP, srcset, lazy)
- [ ] Font loading optimization
- [ ] Preload de recursos críticos

### 6.4 — Security hardening
- [ ] CSP headers en `_headers`
- [ ] Rate limiting real con Upstash (actualmente es stub)
- [ ] Zod validation en TODOS los endpoints
- [ ] File validation con magic bytes
- [ ] CORS configurado en R2
- [ ] Firestore rules testeadas con emulador
- [ ] No exponer credenciales al cliente

### 6.5 — Email
- [ ] Templates para: orden confirmada, pago recibido, orden completada, newsletter
- [ ] Email de bienvenida al registrarse
- [ ] Email de recuperación de contraseña
- [ ] Email de descarga disponible

### 6.6 — CI/CD
- [ ] GitHub Actions: lint → test → build → deploy
- [ ] Deploy staging en push a `staging`
- [ ] Deploy producción en push a `main` (con aprobación manual)
- [ ] Environment variables en Cloudflare Pages

### 6.7 — Monitoring
- [ ] Sentry para errores (JS + server)
- [ ] Cloudflare Analytics para tráfico
- [ ] Logs estructurados
- [ ] Alertas de error rate

---

## 📋 Orden de ejecución recomendado

```
Sprint 1: Fase 1 completa (datos, exclusividad, search)
Sprint 2: Fase 2 completa (pagos reales, checkout, descargas)
Sprint 3: Fase 3.1 + 3.2 (audio player, imágenes)
Sprint 4: Fase 4.1 + 4.2 (favoritos, reviews)
Sprint 5: Fase 5 (admin CRUD)
Sprint 6: Fase 6 (pulir, SEO, performance)
```

---

## 📊 Métricas de éxito

| Métrica | Target |
|---|---|
| Tests | 200+ passing |
| TS errors | 0 |
| Build | OK (Cloudflare) |
| LCP | < 2.5s |
| Páginas | Todas funcionales |
| Flujos E2E | Compra → descarga funciona |
| Mobile | 375px responsive |

---

## 🔧 Notas técnicas

- **Firebase Admin** se inicializa lazy (no en import) para que el build funcione sin credenciales
- **Cloudflare adapter** necesita parche postinstall (`scripts/patch-cf-adapter.mjs`) para externalizar todos los módulos Node
- **`firebase-admin`** depende de `http`, `https`, `net`, `tls` — el adapter parcheado los externaliza
- **Resend SDK** depende de `react` — también externalizado
- **Firestore rules** están en `firestore.rules` — deployar con `firebase deploy --only firestore:rules`
- **Firestore indexes** están en `firestore.indexes.json` — deployar con `firebase deploy --only firestore:indexes`
