// Placeholder session store backed by localStorage until the NestJS auth
// API exists. Swap these three functions for real API/cookie calls then.
export interface AuthUser {
  name: string;
  email: string;
}

const SESSION_KEY = "clinicplus.session";

export function readSession(): AuthUser | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function writeSession(user: AuthUser): void {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function clearSession(): void {
  window.localStorage.removeItem(SESSION_KEY);
}
