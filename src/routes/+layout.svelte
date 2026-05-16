<script lang="ts">
  import '../app.css';
  import type { LayoutData } from './$types';

  export let data: LayoutData;
</script>

<svelte:head>
  <title>YUGEN</title>
</svelte:head>

<div class="app">
  <header class="nav">
    <nav class="nav-inner container">
      <a href="/" class="logo">YUGEN</a>
      <ul class="nav-links">
        <li><a href="/beats">Beats</a></li>
        <li><a href="/drumkits">Drumkits</a></li>
        <li><a href="/services">Servicios</a></li>
        <li><a href="/drops">Drops</a></li>
        <li><a href="/contact">Contacto</a></li>
      </ul>
      <div class="nav-actions">
        {#if data.user}
          {#if data.user.role === 'owner' || data.user.role === 'admin' || data.user.role === 'editor'}
            <a href="/admin" class="btn-ghost">Admin</a>
          {/if}
          <span class="mono">{data.user.crewName ?? data.user.email}</span>
        {:else}
          <a href="/login" class="btn-outline">Login</a>
        {/if}
      </div>
    </nav>
  </header>

  <main>
    <slot />
  </main>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-inner">
        <span class="logo-sm">YUGEN</span>
        <p class="mono">© {new Date().getFullYear()} YUGEN. Puebla, México.</p>
      </div>
    </div>
  </footer>
</div>

<style>
  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .nav {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(3, 3, 5, 0.85);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
  }

  .nav-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
    gap: var(--space-xl);
  }

  .logo {
    font-size: var(--text-lg);
    font-weight: 700;
    letter-spacing: 6px;
    color: var(--text-primary);
  }

  .logo:hover {
    color: var(--cyan);
  }

  .nav-links {
    display: flex;
    list-style: none;
    gap: var(--space-lg);
  }

  .nav-links a {
    font-size: var(--text-sm);
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--text-muted);
    transition: color var(--duration-fast) var(--ease-out);
  }

  .nav-links a:hover {
    color: var(--text-primary);
  }

  .nav-actions {
    display: flex;
    align-items: center;
    gap: var(--space-md);
  }

  .btn-ghost {
    font-size: var(--text-xs);
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--text-muted);
    padding: var(--space-xs) var(--space-sm);
    transition: color var(--duration-fast) var(--ease-out);
  }

  .btn-ghost:hover {
    color: var(--cyan);
  }

  .btn-outline {
    font-size: var(--text-xs);
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--cyan);
    padding: var(--space-xs) var(--space-md);
    border: 1px solid var(--cyan-dim);
    border-radius: var(--radius-sm);
    transition: all var(--duration-fast) var(--ease-out);
  }

  .btn-outline:hover {
    background: var(--cyan-dim);
    border-color: var(--cyan);
  }

  main {
    flex: 1;
  }

  .site-footer {
    border-top: 1px solid var(--border);
    padding: var(--space-2xl) 0;
    margin-top: var(--space-3xl);
  }

  .footer-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo-sm {
    font-size: var(--text-sm);
    font-weight: 600;
    letter-spacing: 4px;
    color: var(--text-faint);
  }

  @media (max-width: 768px) {
    .nav-links {
      display: none;
    }
  }
</style>
