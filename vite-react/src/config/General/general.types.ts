export type THttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

export interface IMakeHttpRequest {
  url: string;
  method: THttpMethod;
  headers?: Record<string, any>;
  queryParams?: Record<string, any>;
  body?: Record<string, any>;
}
