<script lang="ts">
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();

  function statusLabel(status: string): string {
    const labels: Record<string, string> = {
      pending_payment: 'Pendiente de pago',
      paid: 'Pagado',
      stems_needed: 'Esperando stems',
      stems_uploaded: 'Stems recibidos',
      in_progress: 'En progreso',
      review: 'En revisión',
      revision: 'En revisión',
      completed: 'Completado',
      cancelled: 'Cancelado',
      refunded: 'Reembolsado',
    };
    return labels[status] ?? status;
  }
</script>

<svelte:head>
  <title>Mis Órdenes — YUGEN</title>
</svelte:head>

<section class="page">
  <div class="container">
    <header class="page-header">
      <span class="section-tag">Cuenta</span>
      <h1>Mis Órdenes</h1>
    </header>

    {#if data.orders?.length}
      <div class="orders-list">
        {#each data.orders as order}
          <a href="/portal/{order.portalToken ?? order.id}" class="order-row">
            <div class="order-main">
              <h3>{order.productName}</h3>
              <p class="mono">{order.clientEmail}</p>
            </div>
            <div class="order-meta">
              <span class="status status-{order.status}">{statusLabel(order.status)}</span>
              <span class="price">${order.payment?.amount}</span>
            </div>
          </a>
        {/each}
      </div>
    {:else}
      <p class="text-muted">No tienes órdenes todavía.</p>
    {/if}

    <a href="/account" class="back-link">← Volver a mi cuenta</a>
  </div>
</section>

<style>
  .page { padding: var(--space-3xl) 0; }
  .page-header { margin-bottom: var(--space-2xl); }
  .section-tag { font-size: var(--text-xs); letter-spacing: 3px; text-transform: uppercase; color: var(--cyan); display: block; margin-bottom: var(--space-sm); }
  .page-header h1 { font-size: var(--text-2xl); font-weight: 600; color: var(--text-primary); }

  .orders-list { display: flex; flex-direction: column; gap: var(--space-md); max-width: 700px; }

  .order-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-lg);
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    text-decoration: none;
    transition: all var(--duration-fast) var(--ease-out);
  }
  .order-row:hover { border-color: var(--border-hover); transform: translateX(4px); }

  .order-main h3 { font-size: var(--text-base); color: var(--text-primary); margin-bottom: var(--space-xs); }
  .mono { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--text-muted); }

  .order-meta { text-align: right; display: flex; flex-direction: column; gap: var(--space-xs); }
  .price { font-family: var(--font-mono); font-size: var(--text-lg); color: var(--text-primary); }

  .status {
    font-size: var(--text-xs);
    padding: 2px 8px;
    border-radius: var(--radius-full);
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 600;
  }
  .status-pending_payment { background: rgba(255, 193, 7, 0.15); color: #ffc107; }
  .status-paid { background: rgba(76, 175, 80, 0.15); color: #4caf50; }
  .status-completed { background: rgba(0, 255, 170, 0.15); color: var(--neon); }
  .status-in_progress, .status-review, .status-revision { background: rgba(0, 200, 255, 0.15); color: var(--cyan); }
  .status-cancelled, .status-refunded { background: rgba(244, 67, 54, 0.15); color: #f44336; }

  .back-link { display: inline-block; margin-top: var(--space-xl); color: var(--text-muted); text-decoration: none; font-size: var(--text-sm); }
  .back-link:hover { color: var(--cyan); }
  .text-muted { color: var(--text-muted); }
</style>
