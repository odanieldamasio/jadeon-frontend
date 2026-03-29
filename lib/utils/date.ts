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

export function toDateInputValue(value: string): string {
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60_000);
  return localDate.toISOString().slice(0, 10);
}

export function fromDateInputValue(value: string, endOfDay = false): string {
  const date = new Date(`${value}T00:00:00`);

  if (endOfDay) {
    date.setHours(23, 59, 59, 999);
  }

  return date.toISOString();
}
