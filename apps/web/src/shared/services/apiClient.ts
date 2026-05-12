const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:8080/api";

type RequestOptions = Omit<RequestInit, "headers"> & {
  auth?: boolean;
  headers?: Record<string, string>;
};

export type ApiError = Error & {
  status?: number;
};

function createApiError(message: string, status: number): ApiError {
  const error = new Error(message) as ApiError;
  error.status = status;
  return error;
}

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("auth_token");

  if (!token) return {};

  return {
    Authorization: `Bearer ${token}`,
  };
}

function buildHeaders(
  customHeaders: Record<string, string> = {},
  auth = true,
  includeJson = true
): Record<string, string> {
  return {
    ...(includeJson ? { "Content-Type": "application/json" } : {}),
    ...(auth ? getAuthHeaders() : {}),
    ...customHeaders,
  };
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { auth = true, headers = {}, ...rest } = options;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...rest,
    headers: buildHeaders(headers, auth, true),
  });

  if (!response.ok) {
    throw createApiError(
      `API request failed: ${response.status}`,
      response.status
    );
  }

  return response.json() as Promise<T>;
}

export async function apiBlobRequest(
  endpoint: string,
  options: RequestOptions = {}
): Promise<Blob> {
  const { auth = true, headers = {}, ...rest } = options;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...rest,
    headers: buildHeaders(headers, auth, false),
  });

  if (!response.ok) {
    throw createApiError(
      `API blob request failed: ${response.status}`,
      response.status
    );
  }

  return response.blob();
}

export function getApiErrorStatus(error: unknown): number | undefined {
  if (
    error instanceof Error &&
    "status" in error &&
    typeof (error as ApiError).status === "number"
  ) {
    return (error as ApiError).status;
  }

  return undefined;
}