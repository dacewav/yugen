<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;
</script>

<svelte:head>
  <title>Admin — YUGEN</title>
</svelte:head>

<div class="dashboard">
  <header class="page-header">
    <h1>Dashboard</h1>
    <p class="mono">Bienvenido, {data.user.crewName ?? data.user.email}</p>
  </header>

  <div class="stats-grid">
    <div class="stat-card">
      <span class="stat-label">Órdenes activas</span>
      <span class="stat-value">—</span>
      <span class="stat-note">Conecta Firestore</span>
    </div>
    <div class="stat-card">
      <span class="stat-label">Beats publicados</span>
      <span class="stat-value">—</span>
      <span class="stat-note">Conecta Firestore</span>
    </div>
    <div class="stat-card">
      <span class="stat-label">Miembros</span>
      <span class="stat-value">—</span>
      <span class="stat-note">Conecta Firestore</span>
    </div>
    <div class="stat-card">
      <span class="stat-label">Ingresos (mes)</span>
      <span class="stat-value">—</span>
      <span class="stat-note">Conecta Firestore</span>
    </div>
  </div>

  <section class="recent">
    <h2>Actividad reciente</h2>
    <p class="text-muted">Conecta Firestore para mostrar actividad aquí.</p>
  </section>
</div>

<style>
  .page-header {
    margin-bottom: var(--space-2xl);
  }

  .page-header h1 {
    font-size: var(--text-2xl);
    font-weight: 600;
    color: var(--text-primary);
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--space-md);
    margin-bottom: var(--space-3xl);
  }

  .stat-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: var(--space-lg);
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .stat-label {
    font-size: var(--text-xs);
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .stat-value {
    font-size: var(--text-2xl);
    font-weight: 600;
    color: var(--text-primary);
    font-family: var(--font-mono);
  }

  .stat-note {
    font-size: var(--text-xs);
    color: var(--text-faint);
  }

  .recent h2 {
    font-size: var(--text-lg);
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--space-md);
  }

  .text-muted {
    color: var(--text-muted);
  }
</style>
