# YUGEN.STORE

Beat store, servicios de audio y comunidad creativa.

## Stack

- **Frontend**: SvelteKit 2 + Svelte 5 + TypeScript
- **Hosting**: Cloudflare Pages (Workers runtime)
- **Auth**: Firebase Auth (session cookies + custom claims)
- **Database**: Firestore
- **Storage**: Cloudflare R2 (2 buckets: público/privado)
- **Payments**: Stripe (USD) + MercadoPago (MXN)
- **Email**: Resend
- **Validation**: Zod
- **Rate Limiting**: Upstash Redis

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy env file
cp .env.example .env.local

# 3. Fill in your credentials in .env.local

# 4. Run dev server
npm run dev

# 5. Build for Cloudflare
npm run build
```

## Project Structure

```
src/
├── app.d.ts              ← Global types (App.Locals, Role)
├── app.css               ← Design system (CSS variables)
├── hooks.server.ts       ← Auth middleware (every request)
├── lib/
│   ├── server/           ← Server-only modules
│   │   ├── firebase-admin.ts
│   │   ├── r2.ts
│   │   ├── stripe.ts
│   │   ├── mercadopago.ts
│   │   ├── resend.ts
│   │   ├── auth.ts
│   │   ├── rate-limit.ts
│   │   ├── file-validation.ts
│   │   └── email-templates.ts
│   ├── stores/           ← Svelte stores (client)
│   │   ├── auth.ts
│   │   └── cart.ts
│   ├── types/            ← TypeScript interfaces
│   │   ├── member.ts
│   │   ├── content.ts
│   │   └── order.ts
│   └── utils/
│       ├── validators.ts ← Zod schemas
│       └── formatters.ts
└── routes/
    ├── +layout.server.ts
    ├── +layout.svelte
    ├── +page.svelte      ← Homepage
    ├── login/
    ├── api/
    │   ├── auth/         ← login, logout, session
    │   ├── stripe/       ← webhook
    │   ├── mp/           ← MercadoPago webhook
    │   ├── r2/           ← upload-url, confirm
    │   └── orders/
    ├── (public)/         ← beats, drumkits, services, drops, contact
    ├── (admin)/          ← admin panel (editor+ role required)
    └── (portal)/         ← client portal (token-based access)
```

## Deployment

Push to `main` → auto-deploys to Cloudflare Pages via GitHub Actions.

### Environment Variables

Set in Cloudflare Pages dashboard → Settings → Environment variables.

Required:
- `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`
- `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `MP_ACCESS_TOKEN`
- `RESEND_API_KEY`

### Firestore Indexes

Deploy indexes:
```bash
firebase deploy --only firestore:indexes
```

See `firestore.indexes.json` for required composite indexes.

## License

Private — YUGEN © 2026
