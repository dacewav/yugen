<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;
</script>

<svelte:head>
  <title>Servicios — YUGEN</title>
</svelte:head>

<section class="page">
  <div class="container">
    <header class="page-header">
      <span class="section-tag">Producción</span>
      <h1>Servicios</h1>
      <p class="page-desc">Mezcla, mastering, producción y más. Elige el tier que se ajuste a tu proyecto.</p>
    </header>

    <div class="services-grid">
      {#if data.services?.length}
        {#each data.services as service}
          <div class="service-card">
            <div class="service-header">
              <span class="service-category">{service.category}</span>
              <h2>{service.title}</h2>
              <p class="service-desc">{service.description}</p>
            </div>
            <div class="tiers">
              {#each service.tiers as tier}
                <div class="tier">
                  <span class="tier-name">{tier.label}</span>
                  <span class="tier-price">${tier.price}</span>
                  <span class="tier-delivery">{tier.deliveryDays} días · {tier.revisions} revisiones</span>
                  <ul class="tier-features">
                    {#each tier.features as feature}
                      <li>{feature}</li>
                    {/each}
                  </ul>
                </div>
              {/each}
            </div>
          </div>
        {/each}
      {:else}
        <p class="text-muted">Conecta Firestore para mostrar servicios aquí.</p>
      {/if}
    </div>
  </div>
</section>

<style>
  .page { padding: var(--space-3xl) 0; }
  .page-header { margin-bottom: var(--space-2xl); }
  .section-tag { font-size: var(--text-xs); letter-spacing: 3px; text-transform: uppercase; color: var(--cyan); display: block; margin-bottom: var(--space-sm); }
  .page-header h1 { font-size: var(--text-2xl); font-weight: 600; color: var(--text-primary); margin-bottom: var(--space-sm); }
  .page-desc { color: var(--text-muted); max-width: 600px; }
  .services-grid { display: flex; flex-direction: column; gap: var(--space-2xl); }
  .service-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: var(--space-2xl); }
  .service-header { margin-bottom: var(--space-xl); }
  .service-category { font-size: var(--text-xs); letter-spacing: 2px; text-transform: uppercase; color: var(--sakura); font-family: var(--font-mono); }
  .service-header h2 { font-size: var(--text-xl); font-weight: 600; color: var(--text-primary); margin: var(--space-sm) 0; }
  .service-desc { color: var(--text-muted); }
  .tiers { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-md); }
  .tier { background: var(--bg-elevated); border: 1px solid var(--border); border-radius: var(--radius-md); padding: var(--space-lg); display: flex; flex-direction: column; gap: var(--space-xs); }
  .tier-name { font-size: var(--text-xs); letter-spacing: 2px; text-transform: uppercase; color: var(--text-muted); }
  .tier-price { font-size: var(--text-xl); font-weight: 600; color: var(--text-primary); font-family: var(--font-mono); }
  .tier-delivery { font-size: var(--text-xs); color: var(--text-muted); font-family: var(--font-mono); }
  .tier-features { list-style: none; margin-top: var(--space-sm); display: flex; flex-direction: column; gap: var(--space-xs); }
  .tier-features li { font-size: var(--text-sm); color: var(--text-secondary); padding-left: var(--space-md); position: relative; }
  .tier-features li::before { content: '→'; position: absolute; left: 0; color: var(--neon); }
  .text-muted { color: var(--text-muted); }
</style>
