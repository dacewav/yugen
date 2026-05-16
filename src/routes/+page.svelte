<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<svelte:head>
  <title>YUGEN — Beat Store & Servicios de Audio</title>
  <meta name="description" content="Beats exclusivos, servicios de mezcla/mastering y comunidad creativa." />
</svelte:head>

<section class="hero">
  <div class="container">
    <div class="hero-content">
      <p class="hero-tag">Beat Store · Servicios · Comunidad</p>
      <h1 class="hero-title">YUGEN</h1>
      <p class="hero-sub">Beats que cuentan historias. Sonido que define tu arte.</p>
      <div class="hero-actions">
        <a href="/beats" class="cta-primary">Explorar Beats</a>
        <a href="/services" class="cta-secondary">Servicios</a>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-header">
      <span class="section-tag">Destacados</span>
      <h2>Últimos Beats</h2>
    </div>
    <p class="text-muted">Conecta Firestore para mostrar beats aquí.</p>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-header">
      <span class="section-tag">Equipo</span>
      <h2>Crew</h2>
    </div>
    <p class="text-muted">Conecta Firestore para mostrar miembros aquí.</p>
  </div>
</section>

<style>
  .hero {
    padding: var(--space-3xl) 0;
    min-height: 70vh;
    display: flex;
    align-items: center;
    position: relative;
    overflow: hidden;
  }

  .hero::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -20%;
    width: 60%;
    height: 200%;
    background: radial-gradient(ellipse, var(--cyan-glow) 0%, transparent 70%);
    pointer-events: none;
  }

  .hero-content {
    position: relative;
    max-width: 700px;
  }

  .hero-tag {
    font-size: var(--text-xs);
    letter-spacing: 4px;
    text-transform: uppercase;
    color: var(--cyan);
    margin-bottom: var(--space-lg);
  }

  .hero-title {
    font-size: clamp(3rem, 10vw, 6rem);
    font-weight: 700;
    letter-spacing: 12px;
    color: var(--text-primary);
    line-height: 1;
    margin-bottom: var(--space-lg);
  }

  .hero-sub {
    font-size: var(--text-lg);
    color: var(--text-secondary);
    margin-bottom: var(--space-2xl);
    max-width: 500px;
  }

  .hero-actions {
    display: flex;
    gap: var(--space-md);
  }

  .cta-primary {
    display: inline-block;
    padding: 14px 32px;
    background: var(--neon-dim);
    border: 1px solid var(--neon-border);
    color: var(--neon);
    font-size: var(--text-xs);
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    border-radius: var(--radius-sm);
    transition: all var(--duration-normal) var(--ease-out);
  }

  .cta-primary:hover {
    background: rgba(57, 255, 20, 0.15);
    color: var(--neon);
    box-shadow: var(--shadow-glow-neon);
  }

  .cta-secondary {
    display: inline-block;
    padding: 14px 32px;
    border: 1px solid var(--border);
    color: var(--text-secondary);
    font-size: var(--text-xs);
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    border-radius: var(--radius-sm);
    transition: all var(--duration-normal) var(--ease-out);
  }

  .cta-secondary:hover {
    border-color: var(--border-hover);
    color: var(--text-primary);
  }

  .section {
    padding: var(--space-3xl) 0;
  }

  .section-header {
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

  .section-header h2 {
    font-size: var(--text-2xl);
    font-weight: 600;
    color: var(--text-primary);
  }

  .text-muted {
    color: var(--text-muted);
  }
</style>
