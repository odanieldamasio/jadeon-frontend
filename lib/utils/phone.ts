function getDigits(value: string): string {
  return value.replace(/\D/g, '');
}

export function maskBrPhoneInput(value: string): string {
  const digits = getDigits(value).slice(0, 13);
  const national = digits.startsWith('55') && digits.length > 11 ? digits.slice(2) : digits;

  if (!national) {
    return '';
  }

  if (national.length <= 2) {
    return `(${national}`;
  }

  const ddd = national.slice(0, 2);
  const rest = national.slice(2);

  if (rest.length <= 4) {
    return `(${ddd}) ${rest}`;
  }

  if (rest.length <= 8) {
    return `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}`;
  }

  return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5, 9)}`;
}

export function normalizePhoneToE164(value: string): string | null {
  const digits = getDigits(value);

  if (!digits) {
    return null;
  }

  if (digits.startsWith('55') && (digits.length === 12 || digits.length === 13)) {
    return `+${digits}`;
  }

  if (digits.length === 10 || digits.length === 11) {
    return `+55${digits}`;
  }

  return null;
}
