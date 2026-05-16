<script lang="ts">
  import type { LayoutData } from './$types';
  export let data: LayoutData;

  const adminLinks = [
    { href: '/admin', label: 'Dashboard', icon: '◆' },
    { href: '/admin/beats', label: 'Beats', icon: '♫' },
    { href: '/admin/orders', label: 'Órdenes', icon: '◇' },
    { href: '/admin/members', label: 'Miembros', icon: '○' },
  ];
</script>

<div class="admin-layout">
  <aside class="sidebar">
    <div class="sidebar-header">
      <a href="/admin" class="sidebar-logo">YUGEN</a>
      <span class="sidebar-tag">Admin</span>
    </div>
    <nav class="sidebar-nav">
      {#each adminLinks as link}
        <a href={link.href} class="sidebar-link">
          <span class="sidebar-icon">{link.icon}</span>
          {link.label}
        </a>
      {/each}
    </nav>
    <div class="sidebar-footer">
      <span class="mono">{data.user.crewName ?? data.user.email}</span>
      <span class="role-badge">{data.user.role}</span>
    </div>
  </aside>

  <main class="admin-main">
    <slot />
  </main>
</div>

<style>
  .admin-layout {
    display: flex;
    min-height: 100vh;
  }

  .sidebar {
    width: 240px;
    background: var(--bg-elevated);
    border-right: 1px solid var(--border);
    padding: var(--space-lg);
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 0;
    height: 100vh;
  }

  .sidebar-header {
    margin-bottom: var(--space-2xl);
  }

  .sidebar-logo {
    font-size: var(--text-lg);
    font-weight: 700;
    letter-spacing: 6px;
    color: var(--text-primary);
  }

  .sidebar-tag {
    display: block;
    font-size: var(--text-xs);
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--cyan);
    margin-top: var(--space-xs);
  }

  .sidebar-nav {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .sidebar-link {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-sm) var(--space-md);
    border-radius: var(--radius-md);
    color: var(--text-muted);
    font-size: var(--text-sm);
    transition: all var(--duration-fast) var(--ease-out);
  }

  .sidebar-link:hover {
    background: var(--bg-card);
    color: var(--text-primary);
  }

  .sidebar-icon {
    font-size: var(--text-xs);
    width: 20px;
    text-align: center;
  }

  .sidebar-footer {
    padding-top: var(--space-lg);
    border-top: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .role-badge {
    font-size: var(--text-xs);
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--cyan);
    font-family: var(--font-mono);
  }

  .admin-main {
    flex: 1;
    padding: var(--space-2xl);
    max-width: 1200px;
  }

  @media (max-width: 768px) {
    .sidebar {
      display: none;
    }
  }
</style>
