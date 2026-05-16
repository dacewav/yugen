<script lang="ts">
  import type { PageData } from './$types';
  import { page } from '$app/state';
  let { data }: { data: PageData } = $props();

  const genres = ['trap', 'drill', 'r&b', 'boom bap', 'lo-fi'];
  const moods = ['dark', 'smooth', 'aggressive', 'chill', 'energetic', 'atmospheric', 'dreamy', 'gritty'];
  const sortOptions = [
    { value: 'recent', label: 'Más recientes' },
    { value: 'popular', label: 'Más populares' },
    { value: 'price_asc', label: 'Precio ↑' },
    { value: 'price_desc', label: 'Precio ↓' },
  ];

  function buildUrl(params: Record<string, string | undefined>) {
    const url = new URL(page.url.href);
    for (const [k, v] of Object.entries(params)) {
      if (v) url.searchParams.set(k, v);
      else url.searchParams.delete(k);
    }
    return url.toString();
  }
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

    <!-- Search bar -->
    <form method="GET" class="search-bar">
      <input
        type="text"
        name="q"
        placeholder="Buscar beats..."
        value={data.filters?.search ?? ''}
        class="search-input"
      />
      {#if data.filters?.genre}<input type="hidden" name="genre" value={data.filters.genre} />{/if}
      {#if data.filters?.mood}<input type="hidden" name="mood" value={data.filters.mood} />{/if}
      {#if data.filters?.sort}<input type="hidden" name="sort" value={data.filters.sort} />{/if}
      {#if data.filters?.bpmMin}<input type="hidden" name="bpm_min" value={data.filters.bpmMin} />{/if}
      {#if data.filters?.bpmMax}<input type="hidden" name="bpm_max" value={data.filters.bpmMax} />{/if}
      <button type="submit" class="search-btn">Buscar</button>
    </form>

    <!-- Filters -->
    <div class="filters">
      <!-- Genre pills -->
      <div class="filter-group">
        <span class="filter-label">Género</span>
        <div class="pills">
          <a href={buildUrl({ genre: undefined })} class="pill" class:active={!data.filters?.genre}>Todos</a>
          {#each genres as g}
            <a href={buildUrl({ genre: g })} class="pill" class:active={data.filters?.genre === g}>{g}</a>
          {/each}
        </div>
      </div>

      <!-- Mood pills -->
      <div class="filter-group">
        <span class="filter-label">Mood</span>
        <div class="pills">
          <a href={buildUrl({ mood: undefined })} class="pill" class:active={!data.filters?.mood}>Todos</a>
          {#each moods as m}
            <a href={buildUrl({ mood: m })} class="pill" class:active={data.filters?.mood === m}>{m}</a>
          {/each}
        </div>
      </div>

      <!-- Sort -->
      <div class="filter-group">
        <span class="filter-label">Ordenar</span>
        <div class="pills">
          {#each sortOptions as opt}
            <a href={buildUrl({ sort: opt.value })} class="pill" class:active={(data.filters?.sort ?? 'recent') === opt.value}>{opt.label}</a>
          {/each}
        </div>
      </div>
    </div>

    <!-- Results count -->
    <p class="results-count">{data.beats?.length ?? 0} beats encontrados</p>

    <!-- Beats grid -->
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
              {#if beat.isExclusive}
                <span class="exclusive-badge">EXCLUSIVE</span>
              {/if}
            </div>
            <div class="beat-info">
              <h3>{beat.title}</h3>
              <p class="mono">{beat.memberName} · {beat.bpm} BPM {#if beat.key}· {beat.key}{/if}</p>
              <div class="beat-tags">
                {#each beat.genre?.slice(0, 2) ?? [] as tag}
                  <span class="tag">{tag}</span>
                {/each}
              </div>
              <div class="beat-price">
                <span class="price-from">desde</span>
                <span class="price-value">${beat.priceBasic}</span>
              </div>
            </div>
          </a>
        {/each}
      {:else}
        <p class="text-muted">No se encontraron beats con esos filtros.</p>
      {/if}
    </div>
  </div>
</section>

<style>
  .page { padding: var(--space-3xl) 0; }

  .page-header { margin-bottom: var(--space-xl); }
  .section-tag { font-size: var(--text-xs); letter-spacing: 3px; text-transform: uppercase; color: var(--cyan); display: block; margin-bottom: var(--space-sm); }
  .page-header h1 { font-size: var(--text-2xl); font-weight: 600; color: var(--text-primary); }

  /* Search */
  .search-bar {
    display: flex;
    gap: var(--space-sm);
    margin-bottom: var(--space-xl);
    max-width: 500px;
  }
  .search-input {
    flex: 1;
    padding: var(--space-sm) var(--space-md);
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    color: var(--text-primary);
    font-size: var(--text-sm);
    font-family: var(--font-mono);
    outline: none;
  }
  .search-input:focus { border-color: var(--cyan); }
  .search-input::placeholder { color: var(--text-faint); }
  .search-btn {
    padding: var(--space-sm) var(--space-lg);
    background: var(--cyan-dim);
    color: var(--cyan);
    border: 1px solid var(--cyan);
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
    font-weight: 600;
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-out);
  }
  .search-btn:hover { background: var(--cyan); color: var(--bg); }

  /* Filters */
  .filters {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-lg);
    margin-bottom: var(--space-xl);
  }
  .filter-group { display: flex; align-items: center; gap: var(--space-sm); }
  .filter-label { font-size: var(--text-xs); color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; white-space: nowrap; }
  .pills { display: flex; flex-wrap: wrap; gap: var(--space-xs); }
  .pill {
    font-size: var(--text-xs);
    padding: 4px 12px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-full);
    color: var(--text-muted);
    text-decoration: none;
    transition: all var(--duration-fast) var(--ease-out);
  }
  .pill:hover { border-color: var(--border-hover); color: var(--text-primary); }
  .pill.active { background: var(--cyan-dim); border-color: var(--cyan); color: var(--cyan); }

  .results-count {
    font-size: var(--text-sm);
    color: var(--text-muted);
    margin-bottom: var(--space-lg);
    font-family: var(--font-mono);
  }

  /* Grid */
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
  .beat-card:hover { border-color: var(--border-hover); transform: translateY(-2px); box-shadow: var(--shadow-md); }

  .beat-cover { aspect-ratio: 1; overflow: hidden; background: var(--bg-elevated); position: relative; }
  .beat-cover img { width: 100%; height: 100%; object-fit: cover; }
  .cover-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 3rem; color: var(--text-faint); }

  .exclusive-badge {
    position: absolute;
    top: var(--space-sm);
    right: var(--space-sm);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.5px;
    padding: 2px 8px;
    background: var(--sakura);
    color: white;
    border-radius: var(--radius-sm);
  }

  .beat-info { padding: var(--space-md); }
  .beat-info h3 { font-size: var(--text-base); font-weight: 600; color: var(--text-primary); margin-bottom: var(--space-xs); }
  .beat-info .mono { font-size: var(--text-xs); color: var(--text-muted); }

  .beat-tags { display: flex; gap: var(--space-xs); margin-top: var(--space-sm); }
  .tag { font-size: var(--text-xs); padding: 2px 8px; background: var(--cyan-dim); color: var(--cyan); border-radius: var(--radius-full); }

  .beat-price {
    margin-top: var(--space-sm);
    display: flex;
    align-items: baseline;
    gap: var(--space-xs);
  }
  .price-from { font-size: var(--text-xs); color: var(--text-faint); }
  .price-value { font-size: var(--text-lg); font-weight: 700; color: var(--neon); font-family: var(--font-mono); }

  .text-muted { color: var(--text-muted); }
</style>
