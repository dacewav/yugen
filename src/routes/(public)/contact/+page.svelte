<script lang="ts">
  import { ContactSchema } from '$utils/validators';

  let name = '';
  let email = '';
  let subject = '';
  let message = '';
  let error = '';
  let success = false;
  let loading = false;

  async function handleSubmit() {
    loading = true;
    error = '';
    success = false;

    const result = ContactSchema.safeParse({ name, email, subject, message });
    if (!result.success) {
      error = result.error.issues[0].message;
      loading = false;
      return;
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message ?? 'Error al enviar');
      }

      success = true;
      name = '';
      email = '';
      subject = '';
      message = '';
    } catch (err: unknown) {
      error = err instanceof Error ? err.message : 'Error desconocido';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Contacto — YUGEN</title>
</svelte:head>

<section class="page">
  <div class="container">
    <header class="page-header">
      <span class="section-tag">Hablemos</span>
      <h1>Contacto</h1>
      <p class="page-desc">¿Tienes un proyecto en mente? Cuéntanos.</p>
    </header>

    <form class="contact-form" on:submit|preventDefault={handleSubmit}>
      <div class="field-row">
        <div class="field">
          <label for="name">Nombre</label>
          <input id="name" type="text" bind:value={name} placeholder="Tu nombre" required />
        </div>
        <div class="field">
          <label for="email">Email</label>
          <input id="email" type="email" bind:value={email} placeholder="tu@email.com" required />
        </div>
      </div>

      <div class="field">
        <label for="subject">Asunto</label>
        <input id="subject" type="text" bind:value={subject} placeholder="¿Sobre qué es?" required />
      </div>

      <div class="field">
        <label for="message">Mensaje</label>
        <textarea id="message" bind:value={message} placeholder="Cuéntanos tu proyecto..." rows="6" required></textarea>
      </div>

      {#if error}
        <p class="error">{error}</p>
      {/if}

      {#if success}
        <p class="success">Mensaje enviado. Te responderemos pronto.</p>
      {/if}

      <button type="submit" class="btn-submit" disabled={loading}>
        {loading ? 'Enviando...' : 'Enviar mensaje'}
      </button>
    </form>
  </div>
</section>

<style>
  .page { padding: var(--space-3xl) 0; }
  .page-header { margin-bottom: var(--space-2xl); }
  .section-tag { font-size: var(--text-xs); letter-spacing: 3px; text-transform: uppercase; color: var(--cyan); display: block; margin-bottom: var(--space-sm); }
  .page-header h1 { font-size: var(--text-2xl); font-weight: 600; color: var(--text-primary); margin-bottom: var(--space-sm); }
  .page-desc { color: var(--text-muted); }
  .contact-form { max-width: 600px; display: flex; flex-direction: column; gap: var(--space-lg); }
  .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md); }
  .field { display: flex; flex-direction: column; gap: var(--space-xs); }
  label { font-size: var(--text-xs); letter-spacing: 1px; text-transform: uppercase; color: var(--text-muted); }
  input, textarea { width: 100%; padding: var(--space-sm) var(--space-md); background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md); color: var(--text-primary); font-family: var(--font-sans); resize: vertical; }
  input:focus, textarea:focus { outline: none; border-color: var(--cyan); }
  .error { font-size: var(--text-sm); color: var(--error); }
  .success { font-size: var(--text-sm); color: var(--neon); }
  .btn-submit { align-self: flex-start; padding: 14px 32px; background: var(--neon-dim); border: 1px solid var(--neon-border); color: var(--neon); font-size: var(--text-xs); font-weight: 600; letter-spacing: 2px; text-transform: uppercase; border-radius: var(--radius-sm); transition: all var(--duration-normal) var(--ease-out); }
  .btn-submit:hover:not(:disabled) { background: rgba(57, 255, 20, 0.15); box-shadow: var(--shadow-glow-neon); }
  .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

  @media (max-width: 768px) {
    .field-row { grid-template-columns: 1fr; }
  }
</style>
