import axios from 'axios';

export function getErrorMessage(error: unknown, fallback = 'Não foi possível concluir a operação.'): string {
  if (axios.isAxiosError(error)) {
    const fromApi = error.response?.data as { message?: string | string[] } | undefined;

    if (Array.isArray(fromApi?.message)) {
      return fromApi.message.join(', ');
    }

    if (typeof fromApi?.message === 'string') {
      return fromApi.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
