<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;
</script>

<svelte:head>
  <title>Drumkits — YUGEN</title>
</svelte:head>

<section class="page">
  <div class="container">
    <header class="page-header">
      <span class="section-tag">Samples</span>
      <h1>Drumkits</h1>
    </header>

    <div class="kits-grid">
      {#if data.kits?.length}
        {#each data.kits as kit}
          <div class="kit-card">
            <div class="kit-cover">
              {#if kit.coverUrl}
                <img src={kit.coverUrl} alt={kit.title} width="300" height="300" loading="lazy" />
              {:else}
                <div class="cover-placeholder">◇</div>
              {/if}
            </div>
            <div class="kit-info">
              <h3>{kit.title}</h3>
              <p class="mono">{kit.memberName} · {kit.sampleCount} samples</p>
              <span class="price">${kit.price}</span>
            </div>
          </div>
        {/each}
      {:else}
        <p class="text-muted">Conecta Firestore para mostrar drumkits aquí.</p>
      {/if}
    </div>
  </div>
</section>

<style>
  .page { padding: var(--space-3xl) 0; }
  .page-header { margin-bottom: var(--space-2xl); }
  .section-tag { font-size: var(--text-xs); letter-spacing: 3px; text-transform: uppercase; color: var(--cyan); display: block; margin-bottom: var(--space-sm); }
  .page-header h1 { font-size: var(--text-2xl); font-weight: 600; color: var(--text-primary); }
  .kits-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: var(--space-lg); }
  .kit-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; transition: all var(--duration-normal) var(--ease-out); }
  .kit-card:hover { border-color: var(--border-hover); transform: translateY(-2px); }
  .kit-cover { aspect-ratio: 1; overflow: hidden; background: var(--bg-elevated); }
  .kit-cover img { width: 100%; height: 100%; object-fit: cover; }
  .cover-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 3rem; color: var(--text-faint); }
  .kit-info { padding: var(--space-md); }
  .kit-info h3 { font-size: var(--text-base); font-weight: 600; color: var(--text-primary); margin-bottom: var(--space-xs); }
  .kit-info .mono { font-size: var(--text-xs); color: var(--text-muted); }
  .price { display: block; margin-top: var(--space-sm); font-family: var(--font-mono); font-size: var(--text-lg); color: var(--neon); }
  .text-muted { color: var(--text-muted); }
</style>
