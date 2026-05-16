<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;
</script>

<svelte:head>
  <title>Drops — YUGEN</title>
</svelte:head>

<section class="page">
  <div class="container">
    <header class="page-header">
      <span class="section-tag">Exclusivos</span>
      <h1>Drops</h1>
      <p class="page-desc">Ediciones limitadas. Cuando se acaba, se acaba.</p>
    </header>

    <div class="drops-grid">
      {#if data.drops?.length}
        {#each data.drops as drop}
          <div class="drop-card">
            <div class="drop-cover">
              {#if drop.coverUrl}
                <img src={drop.coverUrl} alt={drop.title} width="400" height="400" loading="lazy" />
              {:else}
                <div class="cover-placeholder">◆</div>
              {/if}
              {#if drop.isSoldOut}
                <div class="sold-out-badge">SOLD OUT</div>
              {/if}
            </div>
            <div class="drop-info">
              <h3>{drop.title}</h3>
              <p class="mono">{drop.memberName}</p>
              <div class="drop-meta">
                <span class="price">${drop.price}</span>
                {#if drop.maxBuyers}
                  <span class="remaining">{drop.buyersCount ?? 0}/{drop.maxBuyers}</span>
                {/if}
              </div>
            </div>
          </div>
        {/each}
      {:else}
        <p class="text-muted">Conecta Firestore para mostrar drops aquí.</p>
      {/if}
    </div>
  </div>
</section>

<style>
  .page { padding: var(--space-3xl) 0; }
  .page-header { margin-bottom: var(--space-2xl); }
  .section-tag { font-size: var(--text-xs); letter-spacing: 3px; text-transform: uppercase; color: var(--sakura); display: block; margin-bottom: var(--space-sm); }
  .page-header h1 { font-size: var(--text-2xl); font-weight: 600; color: var(--text-primary); margin-bottom: var(--space-sm); }
  .page-desc { color: var(--text-muted); }
  .drops-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: var(--space-lg); }
  .drop-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; transition: all var(--duration-normal) var(--ease-out); }
  .drop-card:hover { border-color: var(--border-hover); transform: translateY(-2px); }
  .drop-cover { aspect-ratio: 1; overflow: hidden; background: var(--bg-elevated); position: relative; }
  .drop-cover img { width: 100%; height: 100%; object-fit: cover; }
  .cover-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 3rem; color: var(--text-faint); }
  .sold-out-badge { position: absolute; top: var(--space-md); right: var(--space-md); background: var(--sakura); color: white; font-size: var(--text-xs); font-weight: 700; letter-spacing: 2px; padding: var(--space-xs) var(--space-sm); border-radius: var(--radius-sm); }
  .drop-info { padding: var(--space-md); }
  .drop-info h3 { font-size: var(--text-lg); font-weight: 600; color: var(--text-primary); margin-bottom: var(--space-xs); }
  .drop-info .mono { font-size: var(--text-xs); color: var(--text-muted); margin-bottom: var(--space-sm); }
  .drop-meta { display: flex; justify-content: space-between; align-items: center; }
  .price { font-family: var(--font-mono); font-size: var(--text-lg); color: var(--neon); }
  .remaining { font-family: var(--font-mono); font-size: var(--text-sm); color: var(--text-muted); }
  .text-muted { color: var(--text-muted); }
</style>
