<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;
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
          </div>

          <!-- Waveform player placeholder -->
          <div class="waveform-container" id="waveform"></div>

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
            <div class="license-card">
              <span class="license-name">Exclusive</span>
              <span class="license-price">${data.beat.priceExclusive}</span>
              <span class="license-desc">Full rights</span>
            </div>
          </div>
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

  .text-muted { color: var(--text-muted); }

  @media (max-width: 768px) {
    .beat-detail { grid-template-columns: 1fr; }
    .licenses { grid-template-columns: 1fr; }
  }
</style>
