import { useAuthStore } from "@/store/auth";
import type { User } from "@/types/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

/**
 * Fetch wrapper that injects the JWT bearer token and handles errors.
 * Pass a plain object as `json` to send a JSON body.
 */
export async function apiFetch<T>(
  path: string,
  options: RequestInit & { json?: unknown } = {},
): Promise<T> {
  const { json, ...init } = options;
  const token = useAuthStore.getState().token;
  const headers = new Headers(init.headers);

  if (token) headers.set("Authorization", `Bearer ${token}`);

  let body = init.body;
  if (json !== undefined) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(json);
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers, body });

  if (res.status === 401) {
    useAuthStore.getState().logout();
    throw new ApiError(401, "Your session expired. Please log in again.");
  }

  if (!res.ok) {
    let detail: string = res.statusText;
    try {
      const data = await res.json();
      if (typeof data?.detail === "string") detail = data.detail;
      else if (data?.detail) detail = JSON.stringify(data.detail);
    } catch {
      /* non-JSON error body */
    }
    throw new ApiError(res.status, detail);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

/** Login uses form-encoded body (OAuth2 password flow). Returns the token. */
export async function loginRequest(
  email: string,
  password: string,
): Promise<string> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ username: email, password }),
  });
  if (!res.ok) {
    throw new ApiError(res.status, "Invalid email or password.");
  }
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

/** Create a new account. Throws ApiError(400) if the email already exists. */
export async function registerRequest(
  email: string,
  password: string,
  name: string,
): Promise<void> {
  await apiFetch("/auth/register", {
    method: "POST",
    json: { email, password, name },
  });
}

/** Fetch the current logged-in user (requires a token). */
export function getMe(): Promise<User> {
  return apiFetch<User>("/users/me");
}
