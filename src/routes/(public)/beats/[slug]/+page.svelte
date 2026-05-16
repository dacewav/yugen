<script lang="ts">
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{data.beat?.title ?? 'Beat'} — YUGEN</title>
</svelte:head>

<section class="page">
  <div class="container">
    {#if data.beat}
      <div class="beat-detail">
        <div class="beat-cover">
          {#if data.beat.coverUrl}
            <img src={data.beat.coverUrl} alt={data.beat.title} width="600" height="600" />
          {:else}
            <div class="cover-placeholder">♫</div>
          {/if}
          {#if data.beat.isExclusive}
            <span class="exclusive-badge">EXCLUSIVE</span>
          {/if}
          {#if data.beat.isSold}
            <div class="sold-overlay">VENDIDO</div>
          {/if}
        </div>

        <div class="beat-info">
          <span class="section-tag">{data.beat.genre?.join(', ')}</span>
          <h1>{data.beat.title}</h1>
          <p class="producer">por {data.beat.memberName}</p>

          <div class="meta-row">
            <span class="meta">{data.beat.bpm} BPM</span>
            {#if data.beat.key}
              <span class="meta">{data.beat.key}</span>
            {/if}
            <span class="meta">{data.beat.plays ?? 0} plays</span>
            {#if data.beat.mood?.length}
              <span class="meta">{data.beat.mood.join(', ')}</span>
            {/if}
          </div>

          <!-- Waveform player placeholder -->
          <div class="waveform-container" id="waveform">Waveform player — próximamente</div>

          {#if data.beat.isSold}
            <div class="sold-message">Este beat exclusivo ya fue vendido.</div>
          {:else}
            <div class="licenses">
              <div class="license-card">
                <span class="license-name">Basic</span>
                <span class="license-price">${data.beat.priceBasic}</span>
                <span class="license-desc">MP3 lease</span>
              </div>
              <div class="license-card featured">
                <span class="license-name">Premium</span>
                <span class="license-price">${data.beat.pricePremium}</span>
                <span class="license-desc">WAV + stems</span>
              </div>
              {#if data.beat.isExclusive}
                <div class="license-card exclusive">
                  <span class="license-name">Exclusive</span>
                  <span class="license-price">${data.beat.priceExclusive}</span>
                  <span class="license-desc">Full rights — único comprador</span>
                </div>
              {:else}
                <div class="license-card">
                  <span class="license-name">Exclusive</span>
                  <span class="license-price">${data.beat.priceExclusive}</span>
                  <span class="license-desc">Full rights</span>
                </div>
              {/if}
            </div>
          {/if}

          {#if data.beat.tags?.length}
            <div class="tag-list">
              {#each data.beat.tags as tag}
                <span class="tag">{tag}</span>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    {:else}
      <p class="text-muted">Beat no encontrado.</p>
    {/if}
  </div>
</section>

<style>
  .page { padding: var(--space-3xl) 0; }

  .beat-detail {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-2xl);
    align-items: start;
  }

  .beat-cover {
    border-radius: var(--radius-lg);
    overflow: hidden;
    background: var(--bg-card);
    position: relative;
  }

  .beat-cover img {
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
  }

  .cover-placeholder {
    width: 100%;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 4rem;
    color: var(--text-faint);
  }

  .exclusive-badge {
    position: absolute;
    top: var(--space-md);
    right: var(--space-md);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.5px;
    padding: 4px 12px;
    background: var(--sakura);
    color: white;
    border-radius: var(--radius-sm);
  }

  .sold-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.7);
    color: var(--sakura);
    font-size: var(--text-2xl);
    font-weight: 800;
    letter-spacing: 4px;
  }

  .section-tag {
    font-size: var(--text-xs);
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--cyan);
  }

  .beat-info h1 {
    font-size: var(--text-2xl);
    font-weight: 600;
    color: var(--text-primary);
    margin: var(--space-sm) 0 var(--space-xs);
  }

  .producer {
    color: var(--text-muted);
    margin-bottom: var(--space-lg);
  }

  .meta-row {
    display: flex;
    gap: var(--space-md);
    margin-bottom: var(--space-xl);
    flex-wrap: wrap;
  }

  .meta {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--text-muted);
    padding: var(--space-xs) var(--space-sm);
    background: var(--bg-card);
    border-radius: var(--radius-sm);
  }

  .waveform-container {
    height: 80px;
    background: var(--bg-card);
    border-radius: var(--radius-md);
    margin-bottom: var(--space-xl);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-faint);
    font-size: var(--text-sm);
  }

  .sold-message {
    padding: var(--space-lg);
    background: var(--bg-card);
    border: 1px solid var(--sakura);
    border-radius: var(--radius-lg);
    color: var(--sakura);
    text-align: center;
    font-weight: 600;
  }

  .licenses {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-md);
  }

  .license-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: var(--space-lg);
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    transition: border-color var(--duration-fast) var(--ease-out);
  }

  .license-card:hover {
    border-color: var(--border-hover);
  }

  .license-card.featured {
    border-color: var(--neon-border);
    background: var(--neon-dim);
  }

  .license-card.exclusive {
    border-color: var(--sakura);
    background: rgba(255, 107, 157, 0.05);
  }

  .license-name {
    font-size: var(--text-xs);
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .license-price {
    font-size: var(--text-xl);
    font-weight: 600;
    color: var(--text-primary);
    font-family: var(--font-mono);
  }

  .license-desc {
    font-size: var(--text-xs);
    color: var(--text-muted);
  }

  .tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
    margin-top: var(--space-xl);
  }

  .tag {
    font-size: var(--text-xs);
    padding: 2px 8px;
    background: var(--bg-elevated);
    color: var(--text-muted);
    border-radius: var(--radius-full);
  }

  .text-muted { color: var(--text-muted); }

  @media (max-width: 768px) {
    .beat-detail { grid-template-columns: 1fr; }
    .licenses { grid-template-columns: 1fr; }
  }
</style>
