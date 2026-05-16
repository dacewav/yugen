# 🔍 AUDIT PROMPT — YUGEN.STORE

Copia todo esto ↓

---

## Tarea principal

**Haz un audit EXTREMO de https://github.com/dacewav/yugen.** Cada página, cada botón, cada flujo. Nada se queda sin revisar.

Stack: SvelteKit 2 + Svelte 5 + Firebase Firestore + Cloudflare Pages + R2 + TypeScript.
Lee `.guide/ROADMAP.md` para contexto completo del estado del proyecto.

---

## FASE 1: NAVEGACIÓN COMPLETA CON BROWSER

Abre CADA una de estas URLs en browser, haz screenshot, y documenta lo que ves:

### Store (público)
- `/` — Homepage: hero, featured beats, crew
- `/beats` — Catálogo de beats (debería mostrar Firestore data o empty state)
- `/beats/[slug]` — Beat detail: player, licencias, precio
- `/drumkits` — Drumkits page
- `/services` — Servicios con tiers
- `/drops` — Drops con countdown
- `/contact` — Formulario de contacto
- `/login` — Login page

### Admin (requiere role editor+)
- `/admin` — Dashboard
- `/admin/beats` — Beats management
- `/admin/beats/new` — Crear beat
- `/admin/orders` — Órdenes
- `/admin/members` — Miembros

### Portal (acceso por token)
- `/portal/[orderId]` — Portal del cliente: upload de stems, timeline, descargas

### API Endpoints
- `POST /api/auth/login` — Login con ID token
- `POST /api/auth/logout` — Logout
- `GET /api/auth/session` — Ver sesión actual
- `POST /api/stripe/webhook` — Webhook de Stripe
- `POST /api/mp/webhook` — Webhook de MercadoPago
- `POST /api/r2/upload-url` — Generar URL de upload
- `POST /api/r2/confirm` — Confirmar upload
- `POST /api/orders` — Crear orden

Para CADA página documenta:
1. ¿Carga correctamente? ¿Errores en consola?
2. ¿Todos los elementos visuales se renderizan bien?
3. ¿Links rotos o botones que no hacen nada?
4. ¿Responsive? (prueba a reducir el ancho del browser)
5. ¿Accesibilidad? (tab navigation, aria-labels, contraste de color)

---

## FASE 2: TEST DE CADA INTERACCIÓN

### Auth
- Login con email/password → ¿funciona?
- Logout → ¿limpia sesión?
- Acceder a /admin sin login → ¿redirige a /login?
- Acceder a /admin como viewer → ¿muestra 403?

### Beats
- Navegar a /beats → ¿muestra lista o empty state?
- Click en beat card → ¿navega a detail?
- Play button → ¿reproduce audio?
- Seleccionar licencia → ¿actualiza precio?

### Carrito
- Agregar beat al carrito → ¿se agrega?
- Cambiar cantidad → ¿actualiza?
- Eliminar item → ¿se quita?
- Checkout → ¿redirige a Stripe/MP?

### Portal
- Abrir portal con token válido → ¿muestra orden?
- Subir stems → ¿upload a R2?
- Ver timeline → ¿muestra eventos?
- Descargar archivos → ¿funciona?

### Admin
- Crear beat → ¿guarda en Firestore?
- Editar beat → ¿actualiza?
- Eliminar beat → ¿elimina?
- Ver órdenes → ¿muestra datos?

---

## FASE 3: E2E FLOW TEST

Simula un comprador real:

1. Abre `/` como visitante
2. Navega a `/beats`
3. Escucha un beat (play)
4. Selecciona una licencia
5. Agrega al carrito
6. Ve al checkout
7. Selecciona Stripe → ¿redirige a Stripe?
8. (Test mode) Paga con `4242 4242 4242 4242`
9. Post-pago → ¿redirige a portal?
10. Verifica en Firestore: ¿order creada? ¿status=paid?
11. Descarga el archivo → ¿funciona?

---

## FASE 4: CÓDIGO Y ARQUITECTURA

```bash
# Tests
npx vitest run

# Type check
npx svelte-check --tsconfig ./tsconfig.json

# Build
npm run build
```

Revisa:
- ¿Tests fallan? ¿Cuántos? ¿Por qué?
- ¿TS errors? ¿Warnings?
- ¿Build OK?
- `grep -r "TODO\|FIXME\|HACK\|XXX" src/` — ¿hay code debt?
- ¿Hay `console.log` de debug que no deberían ir a producción?
- ¿Svelte 5 runes? (`$state`, `$derived`, `$effect`) o aún hay Svelte 4 patterns?
- ¿Error handling? ¿todos los fetch tienen try-catch?
- ¿Loading states? ¿skeletons? ¿empty states?

---

## FASE 5: SEO, PERFORMANCE, ACCESIBILIDAD

### SEO
- ¿Meta tags en cada página?
- ¿Sitemap? ¿robots.txt?
- ¿OG images?

### Performance
- ¿Lazy loading de imágenes?
- ¿Imágenes optimizadas? (WebP)
- ¿Bundle size razonable?

### Accesibilidad
- ¿Todas las imágenes tienen alt text?
- ¿Navegación por teclado funcional?
- ¿Contraste de color suficiente?
- ¿Form labels correctos?

---

## OUTPUT ESPERADO

### 🔴 CRÍTICO (bloquea ventas o funcionalidad)
- [Página] — [Problema] → [Solución]

### 🟡 MEDIO (afecta UX pero no bloquea)
- [Página] — [Problema] → [Solución]

### 🟢 MEJORA (nice-to-have, polish)
- [Página] — [Sugerencia] → [Implementación]

### 📊 MÉTRICAS
- Tests: X/Y passing
- TS errors: X
- Build: OK/FALLA
- Páginas testeadas: X
- Issues encontrados: X (🔴X 🟡X 🟢X)

---

## NOTAS TÉCNICAS

- **Firebase Admin** se inicializa lazy — necesita env vars para funcionar
- **Cloudflare adapter** está parcheado (postinstall) para externalizar Node built-ins
- **Server loads** retornan arrays vacíos — necesitan queries reales a Firestore
- **No hay datos de prueba** — necesitas crear beats/kits/services en Firestore primero
- **Stripe/MP** son stubs — getPriceFromDb() y createPendingOrder() necesitan implementación
