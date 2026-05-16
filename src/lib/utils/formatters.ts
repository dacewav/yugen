export function formatPrice(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: Date | string | number): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
}

export function formatDateTime(date: Date | string | number): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

export function getOrderStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending_payment: 'Esperando pago',
    paid: 'Pagado',
    stems_needed: 'Esperando stems',
    stems_uploaded: 'Stems recibidos',
    in_progress: 'En progreso',
    review: 'En revisión',
    revision: 'En revisión',
    completed: 'Completado',
    cancelled: 'Cancelado',
    refunded: 'Reembolsado',
  };
  return labels[status] ?? status;
}

export function getOrderStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending_payment: 'var(--warning)',
    paid: 'var(--neon)',
    stems_needed: 'var(--cyan)',
    stems_uploaded: 'var(--cyan)',
    in_progress: 'var(--cyan)',
    review: 'var(--sakura)',
    revision: 'var(--sakura)',
    completed: 'var(--neon)',
    cancelled: 'var(--text-muted)',
    refunded: 'var(--text-muted)',
  };
  return colors[status] ?? 'var(--text-muted)';
}
