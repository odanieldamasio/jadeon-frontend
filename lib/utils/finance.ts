export function parseAmount(value: string | number): number {
  if (typeof value === 'number') {
    return value;
  }

  const normalized = value
    .trim()
    .replace(/\s+/g, '')
    .replace(/[R$r$\u00A0]/g, '')
    .replace(/[^0-9,.\-]/g, '');

  if (/^-?\d+(\.\d+)?$/.test(normalized)) {
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  const parsed = Number(normalized.replace(/\./g, '').replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatCurrencyInput(value: string | number): string {
  const amount = typeof value === 'number' ? value : parseAmount(value);

  if (!Number.isFinite(amount) || amount <= 0) {
    return '';
  }

  return formatCurrency(amount);
}

export function maskCurrencyInput(rawValue: string): string {
  const digits = rawValue.replace(/\D/g, '');

  if (!digits) {
    return '';
  }

  const value = Number(digits) / 100;

  if (!Number.isFinite(value)) {
    return '';
  }

  return formatCurrency(value);
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
