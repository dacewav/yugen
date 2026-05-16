# Licencias YUGEN

Estructura de licencias para beats de YUGEN.STORE.

## Tiers

### 01 — Basic (MP3 Lease)
- **Formato:** MP3 320kbps
- **Uso:** Streams, YouTube, SoundCloud
- **Distribución:** Hasta 5,000 copias
- **Exclusividad:** No
- **Precio:** Desde $25 USD / $450 MXN

### 02 — Premium (WAV Lease)
- **Formato:** WAV 24-bit + stems
- **Uso:** Streams, YouTube, Spotify, Apple Music
- **Distribución:** Hasta 50,000 copias
- **Exclusividad:** No
- **Precio:** Desde $75 USD / $1,350 MXN

### 03 — Exclusive (Full Rights)
- **Formato:** WAV 24-bit + stems + proyecto
- **Uso:** Sin límites
- **Distribución:** Ilimitada
- **Exclusividad:** Sí — el beat se retira de venta
- **Precio:** Desde $300 USD / $5,400 MXN

## Contratos

Cada compra genera un contrato con:
- Datos del comprador
- Datos del beat (título, BPM, key, género)
- Tier de licencia seleccionada
- Precio pagado
- Fecha de compra
- Hash de verificación (SHA256)

El contrato se guarda como PDF en R2 y se vincula a la orden.
El comprador puede verificar el contrato en `/verify/{hash}`.

## Plantillas

- `01-basic.md` — Contrato Basic
- `02-premium.md` — Contrato Premium
- `03-exclusive.md` — Contrato Exclusive
