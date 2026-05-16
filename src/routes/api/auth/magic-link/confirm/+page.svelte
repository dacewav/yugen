<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  let status = $state<'loading' | 'email' | 'error' | 'success'>('loading');
  let email = $state('');
  let errorMsg = $state('');

  onMount(async () => {
    try {
      const { getAuth, isSignInWithEmailLink, signInWithEmailLink } = await import('firebase/auth');
      const { initializeApp } = await import('firebase/app');

      const firebaseConfig = {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      };

      const app = initializeApp(firebaseConfig);
      const auth = getAuth(app);

      if (!isSignInWithEmailLink(auth, window.location.href)) {
        status = 'error';
        errorMsg = 'Link inválido o expirado.';
        return;
      }

      // Check if email was stored from the send step
      const savedEmail = window.localStorage.getItem('yugenMagicEmail');

      if (savedEmail) {
        await completeSignIn(auth, signInWithEmailLink, savedEmail);
      } else {
        // Need to ask for email
        status = 'email';
      }
    } catch (err) {
      status = 'error';
      errorMsg = err instanceof Error ? err.message : 'Error inesperado';
    }
  });

  async function completeSignIn(
    auth: ReturnType<typeof import('firebase/auth').getAuth>,
    signInFn: typeof import('firebase/auth').signInWithEmailLink,
    emailAddr: string
  ) {
    status = 'loading';
    try {
      const credential = await signInFn(auth, emailAddr, window.location.href);
      const idToken = await credential.user.getIdToken();

      // Create session cookie
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) throw new Error('Error al crear sesión');

      window.localStorage.removeItem('yugenMagicEmail');
      status = 'success';
      setTimeout(() => goto('/account'), 1500);
    } catch (err) {
      status = 'error';
      errorMsg = err instanceof Error ? err.message : 'Error al iniciar sesión';
    }
  }

  async function handleEmailSubmit() {
    if (!email.trim()) return;
    window.localStorage.setItem('yugenMagicEmail', email.trim());
    try {
      const { getAuth, signInWithEmailLink } = await import('firebase/auth');
      const { initializeApp } = await import('firebase/app');

      const firebaseConfig = {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      };

      const app = initializeApp(firebaseConfig);
      const auth = getAuth(app);
      await completeSignIn(auth, signInWithEmailLink, email.trim());
    } catch (err) {
      status = 'error';
      errorMsg = err instanceof Error ? err.message : 'Error';
    }
  }
</script>

<svelte:head>
  <title>Accediendo — YUGEN</title>
</svelte:head>

<div class="confirm-page">
  <div class="confirm-card">
    <h1 class="logo">YUGEN</h1>

    {#if status === 'loading'}
      <p class="msg">Verificando link...</p>
      <div class="spinner"></div>
    {:else if status === 'email'}
      <p class="msg">Ingresá tu email para completar el acceso:</p>
      <form onsubmit={(e) => { e.preventDefault(); handleEmailSubmit(); }}>
        <input
          type="email"
          bind:value={email}
          placeholder="tu@email.com"
          required
          class="email-input"
        />
        <button type="submit" class="btn-confirm">Confirmar</button>
      </form>
    {:else if status === 'success'}
      <p class="msg success">✓ Sesión iniciada. Redirigiendo...</p>
    {:else}
      <p class="msg error">{errorMsg}</p>
      <a href="/login" class="back-link">Volver al login</a>
    {/if}
  </div>
</div>

<style>
  .confirm-page {
    min-height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-xl);
  }

  .confirm-card {
    width: 100%;
    max-width: 380px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: var(--space-2xl);
    text-align: center;
  }

  .logo {
    font-size: var(--text-xl);
    font-weight: 700;
    letter-spacing: 8px;
    color: var(--text-primary);
    margin-bottom: var(--space-xl);
  }

  .msg {
    color: var(--text-muted);
    font-size: var(--text-sm);
    margin-bottom: var(--space-lg);
  }

  .msg.success { color: var(--neon); }
  .msg.error { color: var(--sakura); }

  .spinner {
    width: 24px;
    height: 24px;
    border: 2px solid var(--border);
    border-top-color: var(--cyan);
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
    margin: 0 auto;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .email-input {
    width: 100%;
    padding: var(--space-sm) var(--space-md);
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    color: var(--text-primary);
    font-size: var(--text-sm);
    margin-bottom: var(--space-md);
    box-sizing: border-box;
  }

  .email-input:focus {
    outline: none;
    border-color: var(--cyan);
  }

  .btn-confirm {
    width: 100%;
    padding: var(--space-sm) var(--space-md);
    background: var(--cyan-dim);
    border: 1px solid var(--cyan);
    color: var(--cyan);
    font-size: var(--text-sm);
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-out);
  }

  .btn-confirm:hover {
    background: rgba(0, 240, 255, 0.15);
  }

  .back-link {
    color: var(--text-muted);
    font-size: var(--text-sm);
    text-decoration: none;
  }

  .back-link:hover { color: var(--cyan); }
</style>
