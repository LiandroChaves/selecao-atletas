import { API_URL } from "./utils";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function setToken(token: string) {
  localStorage.setItem("token", token);
}

export function removeToken() {
  localStorage.removeItem("token");
}

export function getStoredUser() {
  if (typeof window === "undefined") return null;
  const u = localStorage.getItem("user");
  return u ? JSON.parse(u) : null;
}

export function setStoredUser(user: object) {
  localStorage.setItem("user", JSON.stringify(user));
}

export function removeStoredUser() {
  localStorage.removeItem("user");
}

interface FetchOptions extends RequestInit {
  noAuth?: boolean;
}

export async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { noAuth, ...fetchOptions } = options;
  const headers: Record<string, string> = {};

  if (!noAuth) {
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  if (
    fetchOptions.body &&
    !(fetchOptions.body instanceof FormData)
  ) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers: { ...headers, ...fetchOptions.headers },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.error || errorData.message || `Erro ${res.status}`
    );
  }

  if (res.status === 204) return {} as T;
  return res.json();
}

export function fetcher<T>(endpoint: string): Promise<T> {
  return apiFetch<T>(endpoint);
}
