<script lang="ts">
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Mi Cuenta — YUGEN</title>
</svelte:head>

<section class="page">
  <div class="container">
    <header class="page-header">
      <span class="section-tag">Cuenta</span>
      <h1>Mi Cuenta</h1>
    </header>

    {#if data.client}
      <div class="account-card">
        <div class="account-info">
          <div class="avatar">
            {#if data.client.photoURL}
              <img src={data.client.photoURL} alt={data.client.displayName} />
            {:else}
              <span>{data.client.displayName?.[0] ?? data.client.email[0].toUpperCase()}</span>
            {/if}
          </div>
          <div>
            <h2>{data.client.displayName ?? 'Usuario'}</h2>
            <p class="mono">{data.client.email}</p>
          </div>
        </div>

        <div class="account-stats">
          <div class="stat">
            <span class="stat-value">{data.client.purchaseHistory?.length ?? 0}</span>
            <span class="stat-label">Compras</span>
          </div>
          <div class="stat">
            <span class="stat-value">{data.client.favorites?.length ?? 0}</span>
            <span class="stat-label">Favoritos</span>
          </div>
        </div>

        <nav class="account-nav">
          <a href="/account/orders" class="nav-link">Mis Órdenes</a>
        </nav>
      </div>
    {:else}
      <p class="text-muted">No se encontró tu perfil.</p>
    {/if}
  </div>
</section>

<style>
  .page { padding: var(--space-3xl) 0; }
  .page-header { margin-bottom: var(--space-2xl); }
  .section-tag { font-size: var(--text-xs); letter-spacing: 3px; text-transform: uppercase; color: var(--cyan); display: block; margin-bottom: var(--space-sm); }
  .page-header h1 { font-size: var(--text-2xl); font-weight: 600; color: var(--text-primary); }

  .account-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: var(--space-xl);
    max-width: 600px;
  }

  .account-info {
    display: flex;
    align-items: center;
    gap: var(--space-lg);
    margin-bottom: var(--space-xl);
  }

  .avatar {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: var(--bg-elevated);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    font-size: var(--text-xl);
    font-weight: 700;
    color: var(--cyan);
  }

  .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .account-info h2 {
    font-size: var(--text-lg);
    color: var(--text-primary);
    margin-bottom: var(--space-xs);
  }

  .mono { font-family: var(--font-mono); font-size: var(--text-sm); color: var(--text-muted); }

  .account-stats {
    display: flex;
    gap: var(--space-xl);
    margin-bottom: var(--space-xl);
    padding: var(--space-lg) 0;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }

  .stat { text-align: center; }
  .stat-value { display: block; font-size: var(--text-2xl); font-weight: 700; color: var(--text-primary); font-family: var(--font-mono); }
  .stat-label { font-size: var(--text-xs); color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }

  .account-nav { display: flex; gap: var(--space-md); }
  .nav-link {
    padding: var(--space-sm) var(--space-lg);
    background: var(--bg-elevated);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    color: var(--text-primary);
    text-decoration: none;
    font-size: var(--text-sm);
    transition: all var(--duration-fast) var(--ease-out);
  }
  .nav-link:hover { border-color: var(--cyan); color: var(--cyan); }
  .text-muted { color: var(--text-muted); }
</style>
