<script lang="ts">
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();

  let clientName = $state('');
  let clientEmail = $state('');
  let notes = $state('');
  let paymentMethod = $state<'stripe' | 'mercadopago'>('stripe');
  let loading = $state(false);
  let error = $state('');
  let clientSecret = $state('');
  let orderId = $state('');
  let portalToken = $state('');

  function getPrice(): number {
    if (data.type === 'beat') {
      if (data.tier === 'premium') return data.product.pricePremium;
      if (data.tier === 'exclusive') return data.product.priceExclusive;
      return data.product.priceBasic;
    }
    if (data.type === 'drumkit') return data.product.price;
    if (data.type === 'service') {
      const tier = data.product.tiers?.find((t: { name: string }) => t.name === (data.tier ?? 'basic'));
      return tier?.price ?? 0;
    }
    return 0;
  }

  function getProductName(): string {
    if (data.type === 'service') {
      const tier = data.product.tiers?.find((t: { name: string }) => t.name === (data.tier ?? 'basic'));
      return `${data.product.title} — ${tier?.label ?? data.tier}`;
    }
    return data.product.title;
  }

  async function handleSubmit() {
    loading = true;
    error = '';

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [data.type === 'beat' ? 'beatId' : data.type === 'drumkit' ? 'kitId' : 'serviceId']: data.product.id,
          tier: data.tier,
          clientName,
          clientEmail,
          notes,
          paymentMethod,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message ?? 'Error al crear la orden');
      }

      const result = await res.json();
      orderId = result.orderId;
      portalToken = result.portalToken;

      if (paymentMethod === 'stripe' && result.clientSecret) {
        clientSecret = result.clientSecret;
        // TODO: Mount Stripe Elements and confirm payment
        // For now, redirect to portal
        window.location.href = `/portal/${portalToken}`;
      } else if (paymentMethod === 'mercadopago' && result.initPoint) {
        window.location.href = result.initPoint;
      }
    } catch (err) {
      error = err instanceof Error ? err.message : 'Error desconocido';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Checkout — YUGEN</title>
</svelte:head>

<section class="page">
  <div class="container">
    <header class="page-header">
      <span class="section-tag">Checkout</span>
      <h1>Finalizar compra</h1>
    </header>

    <div class="checkout-grid">
      <!-- Product summary -->
      <div class="order-summary">
        <h2>Tu orden</h2>
        <div class="product-card">
          <div class="product-cover">
            {#if data.product.coverUrl}
              <img src={data.product.coverUrl} alt={data.product.title} width="120" height="120" />
            {:else}
              <div class="cover-placeholder">♫</div>
            {/if}
          </div>
          <div class="product-details">
            <h3>{getProductName()}</h3>
            {#if data.type === 'beat'}
              <p class="mono">{data.product.bpm} BPM {#if data.product.key}· {data.product.key}{/if}</p>
            {/if}
            <p class="mono">{data.product.memberName}</p>
          </div>
        </div>
        <div class="total">
          <span>Total</span>
          <span class="price">${getPrice()}</span>
        </div>
      </div>

      <!-- Payment form -->
      <form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="payment-form">
        <h2>Datos de contacto</h2>

        <div class="field">
          <label for="name">Nombre</label>
          <input id="name" type="text" bind:value={clientName} placeholder="Tu nombre" required />
        </div>

        <div class="field">
          <label for="email">Email</label>
          <input id="email" type="email" bind:value={clientEmail} placeholder="tu@email.com" required />
        </div>

        <div class="field">
          <label for="notes">Notas (opcional)</label>
          <textarea id="notes" bind:value={notes} placeholder="Instrucciones especiales..." rows="3"></textarea>
        </div>

        <h2>Método de pago</h2>

        <div class="payment-methods">
          <label class="payment-option" class:selected={paymentMethod === 'stripe'}>
            <input type="radio" bind:group={paymentMethod} value="stripe" />
            <span class="method-name">Stripe</span>
            <span class="method-desc">Tarjeta · USD</span>
          </label>
          <label class="payment-option" class:selected={paymentMethod === 'mercadopago'}>
            <input type="radio" bind:group={paymentMethod} value="mercadopago" />
            <span class="method-name">MercadoPago</span>
            <span class="method-desc">MXN · OXXO · SPEI</span>
          </label>
        </div>

        {#if error}
          <p class="error">{error}</p>
        {/if}

        <button type="submit" class="btn-pay" disabled={loading}>
          {loading ? 'Procesando...' : `Pagar $${getPrice()}`}
        </button>
      </form>
    </div>
  </div>
</section>

<style>
  .page { padding: var(--space-3xl) 0; }
  .page-header { margin-bottom: var(--space-2xl); }
  .section-tag { font-size: var(--text-xs); letter-spacing: 3px; text-transform: uppercase; color: var(--cyan); display: block; margin-bottom: var(--space-sm); }
  .page-header h1 { font-size: var(--text-2xl); font-weight: 600; color: var(--text-primary); }

  .checkout-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-2xl);
    align-items: start;
  }

  /* Summary */
  .order-summary {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: var(--space-xl);
  }
  .order-summary h2 { font-size: var(--text-lg); color: var(--text-primary); margin-bottom: var(--space-lg); }

  .product-card { display: flex; gap: var(--space-md); margin-bottom: var(--space-xl); }
  .product-cover { width: 80px; height: 80px; border-radius: var(--radius-md); overflow: hidden; background: var(--bg-elevated); flex-shrink: 0; }
  .product-cover img { width: 100%; height: 100%; object-fit: cover; }
  .cover-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: var(--text-faint); }
  .product-details h3 { font-size: var(--text-base); color: var(--text-primary); margin-bottom: var(--space-xs); }
  .mono { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--text-muted); }

  .total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: var(--space-lg);
    border-top: 1px solid var(--border);
    font-size: var(--text-sm);
    color: var(--text-muted);
  }
  .price { font-family: var(--font-mono); font-size: var(--text-2xl); font-weight: 700; color: var(--neon); }

  /* Form */
  .payment-form { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: var(--space-xl); }
  .payment-form h2 { font-size: var(--text-lg); color: var(--text-primary); margin-bottom: var(--space-lg); }

  .field { margin-bottom: var(--space-lg); }
  label { display: block; font-size: var(--text-xs); letter-spacing: 1px; text-transform: uppercase; color: var(--text-muted); margin-bottom: var(--space-xs); }
  input, textarea {
    width: 100%;
    padding: var(--space-sm) var(--space-md);
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    color: var(--text-primary);
    font-size: var(--text-sm);
    box-sizing: border-box;
  }
  input:focus, textarea:focus { outline: none; border-color: var(--cyan); }

  .payment-methods { display: flex; gap: var(--space-md); margin-bottom: var(--space-xl); }
  .payment-option {
    flex: 1;
    padding: var(--space-md);
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-out);
    text-align: center;
  }
  .payment-option.selected { border-color: var(--cyan); background: var(--cyan-dim); }
  .payment-option input { display: none; }
  .method-name { display: block; font-size: var(--text-sm); font-weight: 600; color: var(--text-primary); }
  .method-desc { font-size: var(--text-xs); color: var(--text-muted); }

  .error { font-size: var(--text-sm); color: var(--sakura); margin-bottom: var(--space-md); }

  .btn-pay {
    width: 100%;
    padding: var(--space-md);
    background: var(--neon-dim);
    border: 1px solid var(--neon-border);
    color: var(--neon);
    font-size: var(--text-base);
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--duration-normal) var(--ease-out);
  }
  .btn-pay:hover:not(:disabled) { background: rgba(57, 255, 20, 0.15); box-shadow: var(--shadow-glow-neon); }
  .btn-pay:disabled { opacity: 0.5; cursor: not-allowed; }

  @media (max-width: 768px) {
    .checkout-grid { grid-template-columns: 1fr; }
    .payment-methods { flex-direction: column; }
  }
</style>
