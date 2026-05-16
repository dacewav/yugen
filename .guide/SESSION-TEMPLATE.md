# 📋 SESSION TEMPLATE — YUGEN.STORE

Copia y adapta esto para cada sesión de trabajo:

---

# YUGEN.STORE — SESIÓN [NÚMERO]

> Repo: https://github.com/dacewav/yugen
> Stack: SvelteKit 2 + Svelte 5 + Firebase Firestore + Cloudflare Pages + R2 + TypeScript

## Contexto

Lee `.guide/ROADMAP.md` para el plan completo.
Lee `memory/` para contexto de sesiones anteriores.

## Resumen de sesión anterior

[Completar con lo que se hizo]

## Objetivo de esta sesión

1. [Tarea 1]
2. [Tarea 2]
3. [Tarea 3]

## Constraints

- Svelte 5 (runes: `$state`, `$derived`, `$effect`)
- 0 TypeScript errors
- `svelte-check` limpio
- Browser test después de cada cambio significativo
- Commits frecuentes con mensajes descriptivos

## Arrancar

```bash
git clone https://github.com/dacewav/yugen.git
cd yugen
npm install  # Esto ejecuta postinstall que parchea el adapter
cp .env.example .env.local
# Llenar credenciales en .env.local
npm run dev
```

## Notas

- El adapter de Cloudflare necesita el parche postinstall (scripts/patch-cf-adapter.mjs)
- Firebase Admin se inicializa lazy — sin env vars, los endpoints fallan gracefully
- Los server loads retornan arrays vacíos hasta que se implementen las queries
