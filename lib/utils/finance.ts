export function parseAmount(value: string | number): number {
  if (typeof value === 'number') {
    return value;
  }

  const normalized = value.trim().replace(/\s+/g, '');

  if (/^-?\d+(\.\d+)?$/.test(normalized)) {
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  const parsed = Number(normalized.replace(/\./g, '').replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

export function formatDate(value: string): string {
  const date = new Date(value);
  return date.toLocaleDateString('pt-BR');
}
