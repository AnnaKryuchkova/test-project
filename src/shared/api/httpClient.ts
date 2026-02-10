const DEFAULT_API_BASE_URL = "https://dummyjson.com";

const API_BASE_URL =
  (import.meta as { env: { VITE_API_BASE_URL?: string } }).env
    .VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL;

export interface HttpClientConfig {
  baseUrl?: string;
}

export interface HttpErrorPayload {
  status: number;
  message: string;
}

export class HttpError extends Error {
  status: number;

  constructor(payload: HttpErrorPayload) {
    super(payload.message);
    this.status = payload.status;
  }
}

async function request<TResponse, TBody = unknown>(
  path: string,
  options: RequestInit & { body?: TBody | null } = {},
): Promise<TResponse> {
  const url = `${API_BASE_URL}${path}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers ?? {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
    body:
      options.body && typeof options.body === "object"
        ? JSON.stringify(options.body)
        : (options.body as BodyInit | null | undefined),
  });

  if (!response.ok) {
    let message = response.statusText || "Request failed";

    try {
      const data = (await response.json()) as { message?: string };
      if (data && typeof data.message === "string") {
        message = data.message;
      }
    } catch {}

    throw new HttpError({ status: response.status, message });
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  return (await response.json()) as TResponse;
}

export const httpClient = {
  get: <TResponse>(path: string, init?: RequestInit) =>
    request<TResponse>(path, { method: "GET", ...init }),

  post: <TResponse, TBody = unknown>(
    path: string,
    body: TBody,
    init?: RequestInit,
  ) =>
    request<TResponse, TBody>(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
      ...init,
    }),

  put: <TResponse, TBody = unknown>(
    path: string,
    body: TBody,
    init?: RequestInit,
  ) =>
    request<TResponse, TBody>(path, {
      method: "PUT",
      body,
      ...init,
    }),

  patch: <TResponse, TBody = unknown>(
    path: string,
    body: TBody,
    init?: RequestInit,
  ) =>
    request<TResponse, TBody>(path, {
      method: "PATCH",
      body,
      ...init,
    }),
};
