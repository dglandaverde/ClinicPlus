// Placeholder per-patient appointment store backed by localStorage until
// the NestJS API exists. Swap these for real API calls then.
export interface Appointment {
  date: string; // ISO date, e.g. "2026-09-24"
  time: string; // "HH:mm"
}

function storageKey(email: string): string {
  return `clinicplus.appointment.${email}`;
}

export function getAppointment(email: string): Appointment | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(storageKey(email));
  if (!raw) return null;

  try {
    return JSON.parse(raw) as Appointment;
  } catch {
    return null;
  }
}

export function saveAppointment(email: string, appointment: Appointment): void {
  window.localStorage.setItem(storageKey(email), JSON.stringify(appointment));
}

export function clearAppointment(email: string): void {
  window.localStorage.removeItem(storageKey(email));
}
