export type ApiEnvelope<T> = {
  status_code: number;
  message: string;
  data: T;
};
