<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;
</script>

<svelte:head>
  <title>Beats — YUGEN</title>
</svelte:head>

<section class="page">
  <div class="container">
    <header class="page-header">
      <span class="section-tag">Catálogo</span>
      <h1>Beats</h1>
    </header>

    <div class="beats-grid">
      {#if data.beats?.length}
        {#each data.beats as beat}
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
              <div class="beat-tags">
                {#each beat.genre?.slice(0, 2) ?? [] as tag}
                  <span class="tag">{tag}</span>
                {/each}
              </div>
            </div>
          </a>
        {/each}
      {:else}
        <p class="text-muted">Conecta Firestore para mostrar beats aquí.</p>
      {/if}
    </div>
  </div>
</section>

<style>
  .page { padding: var(--space-3xl) 0; }

  .page-header {
    margin-bottom: var(--space-2xl);
  }

  .section-tag {
    font-size: var(--text-xs);
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--cyan);
    display: block;
    margin-bottom: var(--space-sm);
  }

  .page-header h1 {
    font-size: var(--text-2xl);
    font-weight: 600;
    color: var(--text-primary);
  }

  .beats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: var(--space-lg);
  }

  .beat-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    overflow: hidden;
    transition: all var(--duration-normal) var(--ease-out);
    text-decoration: none;
  }

  .beat-card:hover {
    border-color: var(--border-hover);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  .beat-cover {
    aspect-ratio: 1;
    overflow: hidden;
    background: var(--bg-elevated);
  }

  .beat-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .cover-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    color: var(--text-faint);
  }

  .beat-info {
    padding: var(--space-md);
  }

  .beat-info h3 {
    font-size: var(--text-base);
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--space-xs);
  }

  .beat-info .mono {
    font-size: var(--text-xs);
    color: var(--text-muted);
  }

  .beat-tags {
    display: flex;
    gap: var(--space-xs);
    margin-top: var(--space-sm);
  }

  .tag {
    font-size: var(--text-xs);
    padding: 2px 8px;
    background: var(--cyan-dim);
    color: var(--cyan);
    border-radius: var(--radius-full);
  }

  .text-muted { color: var(--text-muted); }
</style>
