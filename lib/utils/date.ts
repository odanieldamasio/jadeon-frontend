export function getMonthRange(referenceDate = new Date()): {
  startDate: string;
  endDate: string;
} {
  const start = new Date(referenceDate);
  start.setDate(1);
  start.setHours(0, 0, 0, 0);

  const end = new Date(referenceDate);
  end.setMonth(end.getMonth() + 1, 0);
  end.setHours(23, 59, 59, 999);

  return {
    startDate: start.toISOString(),
    endDate: end.toISOString()
  };
}

function formatDateParts(day: string, month: string, year: string): string {
  return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
}

export function normalizeBrDateInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }

  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export function isValidBrDateInput(value: string): boolean {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);

  if (!match) {
    return false;
  }

  const [, dayString, monthString, yearString] = match;
  const day = Number(dayString);
  const month = Number(monthString);
  const year = Number(yearString);

  if (year < 1900 || year > 9999) {
    return false;
  }

  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return false;
  }

  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export function toDateInputValue(value: string): string {
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60_000);
  return localDate.toISOString().slice(0, 10);
}

export function toBrDateInputValue(value: string): string {
  const [year, month, day] = toDateInputValue(value).split('-');
  return formatDateParts(day, month, year);
}

export function fromDateInputValue(value: string, endOfDay = false): string {
  const date = new Date(`${value}T00:00:00`);

  if (endOfDay) {
    date.setHours(23, 59, 59, 999);
  }

  return date.toISOString();
}

export function fromBrDateInputValue(value: string, endOfDay = false): string {
  if (!isValidBrDateInput(value)) {
    throw new Error('Data inválida');
  }

  const [day, month, year] = value.split('/');
  return fromDateInputValue(`${year}-${month}-${day}`, endOfDay);
}
