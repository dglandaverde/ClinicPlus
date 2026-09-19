// Placeholder appointment store backed by localStorage until the NestJS API
// exists. Swap these for real API calls then.
export interface Appointment {
  patientRegistrationNumber: string;
  patientName: string;
  date: string; // ISO date, e.g. "2026-09-24"
  time: string; // "HH:mm"
}

const STORAGE_KEY = "clinicplus.appointments";

function readAll(): Appointment[] {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as Appointment[];
  } catch {
    return [];
  }
}

function writeAll(appointments: Appointment[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
}

export function getAppointment(
  patientRegistrationNumber: string
): Appointment | null {
  return (
    readAll().find(
      (appointment) =>
        appointment.patientRegistrationNumber === patientRegistrationNumber
    ) ?? null
  );
}

export function saveAppointment(appointment: Appointment): void {
  const others = readAll().filter(
    (existing) =>
      existing.patientRegistrationNumber !==
      appointment.patientRegistrationNumber
  );
  writeAll([...others, appointment]);
}

export function clearAppointment(patientRegistrationNumber: string): void {
  writeAll(
    readAll().filter(
      (appointment) =>
        appointment.patientRegistrationNumber !== patientRegistrationNumber
    )
  );
}

export function getAllAppointments(): Appointment[] {
  return readAll().sort((a, b) =>
    `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`)
  );
}
