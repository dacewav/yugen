<script lang="ts">
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Favoritos — YUGEN</title>
</svelte:head>

<section class="page">
  <div class="container">
    <header class="page-header">
      <span class="section-tag">Cuenta</span>
      <h1>Mis Favoritos</h1>
    </header>

    {#if data.favorites?.length}
      <div class="beats-grid">
        {#each data.favorites as beat}
          <a href="/beats/{beat.slug}" class="beat-card">
            <div class="beat-cover">
              {#if beat.coverUrl}
                <img src={beat.coverUrl} alt={beat.title} width="300" height="300" loading="lazy" />
              {:else}
                <div class="cover-placeholder">♫</div>
              {/if}
            </div>
            <div class="beat-info">
              <h3>{beat.title}</h3>
              <p class="mono">{beat.memberName} · {beat.bpm} BPM</p>
              <div class="beat-price">
                <span class="price-from">desde</span>
                <span class="price-value">${beat.priceBasic}</span>
              </div>
            </div>
          </a>
        {/each}
      </div>
    {:else}
      <div class="empty-state">
        <p class="empty-icon">♡</p>
        <p>No tenés favoritos todavía.</p>
        <a href="/beats" class="browse-link">Explorar beats →</a>
      </div>
    {/if}

    <a href="/account" class="back-link">← Volver a mi cuenta</a>
  </div>
</section>

<style>
  .page { padding: var(--space-3xl) 0; }
  .page-header { margin-bottom: var(--space-2xl); }
  .section-tag { font-size: var(--text-xs); letter-spacing: 3px; text-transform: uppercase; color: var(--cyan); display: block; margin-bottom: var(--space-sm); }
  .page-header h1 { font-size: var(--text-2xl); font-weight: 600; color: var(--text-primary); }

  .beats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: var(--space-lg); }

  .beat-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    overflow: hidden;
    transition: all var(--duration-normal) var(--ease-out);
    text-decoration: none;
  }
  .beat-card:hover { border-color: var(--border-hover); transform: translateY(-2px); box-shadow: var(--shadow-md); }

  .beat-cover { aspect-ratio: 1; overflow: hidden; background: var(--bg-elevated); }
  .beat-cover img { width: 100%; height: 100%; object-fit: cover; }
  .cover-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 3rem; color: var(--text-faint); }

  .beat-info { padding: var(--space-md); }
  .beat-info h3 { font-size: var(--text-base); font-weight: 600; color: var(--text-primary); margin-bottom: var(--space-xs); }
  .mono { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--text-muted); }
  .beat-price { margin-top: var(--space-sm); display: flex; align-items: baseline; gap: var(--space-xs); }
  .price-from { font-size: var(--text-xs); color: var(--text-faint); }
  .price-value { font-size: var(--text-lg); font-weight: 700; color: var(--neon); font-family: var(--font-mono); }

  .empty-state {
    text-align: center;
    padding: var(--space-3xl) 0;
    color: var(--text-muted);
  }
  .empty-icon { font-size: 3rem; color: var(--text-faint); margin-bottom: var(--space-md); }
  .browse-link {
    display: inline-block;
    margin-top: var(--space-lg);
    color: var(--cyan);
    text-decoration: none;
    font-size: var(--text-sm);
    font-weight: 600;
  }
  .browse-link:hover { text-decoration: underline; }

  .back-link { display: inline-block; margin-top: var(--space-xl); color: var(--text-muted); text-decoration: none; font-size: var(--text-sm); }
  .back-link:hover { color: var(--cyan); }
</style>
