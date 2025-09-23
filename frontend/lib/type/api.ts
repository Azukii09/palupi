export type ApiEnvelope<T> = {
  status_code: number;
  message: string;
  data: T;
};

export type Category = {
  id: string;
  name: string;
  description: string;
  status:boolean;
};
