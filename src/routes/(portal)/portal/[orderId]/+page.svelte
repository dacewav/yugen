<script lang="ts">
  import type { PageData } from './$types';
  import { getOrderStatusLabel, getOrderStatusColor, formatDateTime } from '$utils/formatters';

  export let data: PageData;

  $: order = data.order;
  $: timeline = data.timeline;
  $: downloadUrls = data.downloadUrls;

  let uploading = false;
  let uploadError = '';

  async function handleFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    uploading = true;
    uploadError = '';

    try {
      // Get signed upload URL
      const urlRes = await fetch('/api/r2/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentType: file.type,
          fileSize: file.size,
          fileName: file.name,
        }),
      });

      if (!urlRes.ok) throw new Error('Error al obtener URL de upload');
      const { uploadUrl, key } = await urlRes.json();

      // Upload directly to R2
      await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      // Confirm upload
      await fetch('/api/r2/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, orderId: order.id, purpose: 'stems' }),
      });
    } catch (err: unknown) {
      uploadError = err instanceof Error ? err.message : 'Error al subir archivo';
    } finally {
      uploading = false;
    }
  }
</script>

<svelte:head>
  <title>Portal — Orden {order.id} — YUGEN</title>
</svelte:head>

<section class="portal">
  <div class="container">
    <header class="portal-header">
      <span class="logo">YUGEN</span>
      <span class="portal-tag">Portal del cliente</span>
    </header>

    <div class="order-card">
      <div class="order-top">
        <div>
          <h1>{order.productName}</h1>
          <p class="mono">Orden: {order.id}</p>
        </div>
        <span class="status-badge" style="color: {getOrderStatusColor(order.status)}">
          {getOrderStatusLabel(order.status)}
        </span>
      </div>

      {#if order.status === 'stems_needed'}
        <div class="upload-section">
          <h2>Sube tus stems</h2>
          <p>Sube los archivos de audio para que podamos comenzar.</p>
          <label class="upload-btn">
            {uploading ? 'Subiendo...' : 'Seleccionar archivos'}
            <input type="file" accept="audio/*,.zip" on:change={handleFileUpload} hidden disabled={uploading} />
          </label>
          {#if uploadError}
            <p class="error">{uploadError}</p>
          {/if}
        </div>
      {/if}

      {#if order.status === 'completed' && Object.keys(downloadUrls).length > 0}
        <div class="download-section">
          <h2>Tus archivos</h2>
          <div class="download-list">
            {#each Object.entries(downloadUrls) as [name, url]}
              <a href={url} class="download-link" download>
                <span class="download-name">{name}</span>
                <span class="download-action">Descargar →</span>
              </a>
            {/each}
          </div>
        </div>
      {/if}
    </div>

    {#if timeline?.length}
      <div class="timeline">
        <h2>Historial</h2>
        <div class="timeline-list">
          {#each timeline as event}
            <div class="timeline-item">
              <span class="timeline-dot"></span>
              <div class="timeline-content">
                <p>{event.message}</p>
                <span class="mono">{event.timestamp ? formatDateTime((event.timestamp as any)?.toDate?.() ?? event.timestamp as any) : ''}</span>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</section>

<style>
  .portal { padding: var(--space-2xl) 0; }
  .portal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-2xl); }
  .logo { font-size: var(--text-lg); font-weight: 700; letter-spacing: 6px; color: var(--text-primary); }
  .portal-tag { font-size: var(--text-xs); letter-spacing: 2px; text-transform: uppercase; color: var(--text-muted); }
  .order-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: var(--space-2xl); margin-bottom: var(--space-2xl); }
  .order-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-xl); }
  .order-top h1 { font-size: var(--text-xl); font-weight: 600; color: var(--text-primary); margin-bottom: var(--space-xs); }
  .status-badge { font-size: var(--text-xs); font-weight: 600; letter-spacing: 1px; text-transform: uppercase; font-family: var(--font-mono); }
  .upload-section, .download-section { border-top: 1px solid var(--border); padding-top: var(--space-xl); }
  .upload-section h2, .download-section h2 { font-size: var(--text-lg); font-weight: 600; color: var(--text-primary); margin-bottom: var(--space-sm); }
  .upload-section p { color: var(--text-muted); margin-bottom: var(--space-lg); }
  .upload-btn { display: inline-block; padding: 14px 32px; background: var(--cyan-dim); border: 1px solid rgba(0, 240, 255, 0.3); color: var(--cyan); font-size: var(--text-xs); font-weight: 600; letter-spacing: 2px; text-transform: uppercase; border-radius: var(--radius-sm); cursor: pointer; transition: all var(--duration-normal) var(--ease-out); }
  .upload-btn:hover { background: rgba(0, 240, 255, 0.15); }
  .error { font-size: var(--text-sm); color: var(--error); margin-top: var(--space-sm); }
  .download-list { display: flex; flex-direction: column; gap: var(--space-sm); }
  .download-link { display: flex; justify-content: space-between; align-items: center; padding: var(--space-md); background: var(--bg-elevated); border: 1px solid var(--border); border-radius: var(--radius-md); text-decoration: none; transition: border-color var(--duration-fast) var(--ease-out); }
  .download-link:hover { border-color: var(--border-hover); }
  .download-name { color: var(--text-primary); font-size: var(--text-sm); }
  .download-action { font-size: var(--text-xs); color: var(--cyan); letter-spacing: 1px; text-transform: uppercase; }
  .timeline { margin-top: var(--space-2xl); }
  .timeline h2 { font-size: var(--text-lg); font-weight: 600; color: var(--text-primary); margin-bottom: var(--space-lg); }
  .timeline-list { display: flex; flex-direction: column; gap: var(--space-md); padding-left: var(--space-lg); border-left: 1px solid var(--border); }
  .timeline-item { position: relative; }
  .timeline-dot { position: absolute; left: calc(-1 * var(--space-lg) - 4px); top: 6px; width: 8px; height: 8px; border-radius: 50%; background: var(--cyan); }
  .timeline-content p { color: var(--text-secondary); font-size: var(--text-sm); }
  .timeline-content .mono { font-size: var(--text-xs); color: var(--text-muted); }
</style>
