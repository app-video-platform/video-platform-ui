import { AxiosError } from 'axios';

export const extractErrorMessage = (err: unknown): string => {
  if (err instanceof AxiosError && err.response?.data?.message) {
    return err.response.data.message;
  } else if (err instanceof Error) {
    return err.message;
  }
  return 'An unknown error occurred';
};
