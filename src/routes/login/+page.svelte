<script lang="ts">
  import { goto } from '$app/navigation';

  let email = '';
  let password = '';
  let error = '';
  let loading = false;

  async function handleLogin() {
    loading = true;
    error = '';

    try {
      // Firebase client SDK — import lazily
      const { getAuth, signInWithEmailAndPassword } = await import('firebase/auth');
      const { initializeApp } = await import('firebase/app');

      const firebaseConfig = {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      };

      const app = initializeApp(firebaseConfig);
      const auth = getAuth(app);

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      // Send ID token to server to create session cookie
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message ?? 'Error al iniciar sesión');
      }

      goto('/admin');
    } catch (err: unknown) {
      error = err instanceof Error ? err.message : 'Error desconocido';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Login — YUGEN</title>
</svelte:head>

<div class="login-page">
  <div class="login-card">
    <h1 class="logo">YUGEN</h1>
    <p class="subtitle">Acceso al panel</p>

    <form on:submit|preventDefault={handleLogin}>
      <div class="field">
        <label for="email">Email</label>
        <input
          id="email"
          type="email"
          bind:value={email}
          placeholder="tu@email.com"
          required
          autocomplete="email"
        />
      </div>

      <div class="field">
        <label for="password">Contraseña</label>
        <input
          id="password"
          type="password"
          bind:value={password}
          placeholder="••••••••"
          required
          autocomplete="current-password"
        />
      </div>

      {#if error}
        <p class="error">{error}</p>
      {/if}

      <button type="submit" class="btn-login" disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  </div>
</div>

<style>
  .login-page {
    min-height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-xl);
  }

  .login-card {
    width: 100%;
    max-width: 380px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: var(--space-2xl);
  }

  .logo {
    font-size: var(--text-xl);
    font-weight: 700;
    letter-spacing: 8px;
    color: var(--text-primary);
    text-align: center;
    margin-bottom: var(--space-xs);
  }

  .subtitle {
    font-size: var(--text-sm);
    color: var(--text-muted);
    text-align: center;
    margin-bottom: var(--space-2xl);
  }

  .field {
    margin-bottom: var(--space-lg);
  }

  label {
    display: block;
    font-size: var(--text-xs);
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: var(--space-xs);
  }

  input {
    width: 100%;
    padding: var(--space-sm) var(--space-md);
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    color: var(--text-primary);
  }

  .error {
    font-size: var(--text-sm);
    color: var(--error);
    margin-bottom: var(--space-md);
  }

  .btn-login {
    width: 100%;
    padding: var(--space-sm) var(--space-md);
    background: var(--neon-dim);
    border: 1px solid var(--neon-border);
    color: var(--neon);
    font-size: var(--text-sm);
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    border-radius: var(--radius-md);
    transition: all var(--duration-normal) var(--ease-out);
  }

  .btn-login:hover:not(:disabled) {
    background: rgba(57, 255, 20, 0.15);
    box-shadow: var(--shadow-glow-neon);
  }

  .btn-login:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
