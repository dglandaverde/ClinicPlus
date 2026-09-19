// Placeholder patient registry backed by localStorage until the NestJS API
// exists. In production this lookup — and the DUI check — must happen on
// the server; a national ID must never be validated or stored client-side.
export interface PatientRecord {
  registrationNumber: string;
  dui: string;
  name: string;
}

const STORAGE_KEY = "clinicplus.patients";

const SEED_PATIENTS: PatientRecord[] = [
  { registrationNumber: "PAC-0001", dui: "04567890-1", name: "Ana Torres" },
  { registrationNumber: "PAC-0002", dui: "01234567-8", name: "Carlos Pérez" },
];

function readAll(): PatientRecord[] {
  if (typeof window === "undefined") return SEED_PATIENTS;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_PATIENTS));
    return SEED_PATIENTS;
  }

  try {
    return JSON.parse(raw) as PatientRecord[];
  } catch {
    return SEED_PATIENTS;
  }
}

function writeAll(patients: PatientRecord[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
}

function normalizeRegistrationNumber(value: string): string {
  return value.trim().toUpperCase();
}

export function findPatientByCredentials(
  registrationNumber: string,
  dui: string
): PatientRecord | null {
  const normalized = normalizeRegistrationNumber(registrationNumber);
  const trimmedDui = dui.trim();
  return (
    readAll().find(
      (patient) =>
        patient.registrationNumber === normalized && patient.dui === trimmedDui
    ) ?? null
  );
}

export function findPatientByRegistrationNumber(
  registrationNumber: string
): PatientRecord | null {
  const normalized = normalizeRegistrationNumber(registrationNumber);
  return (
    readAll().find((patient) => patient.registrationNumber === normalized) ??
    null
  );
}

export function registerPatient(patient: PatientRecord): void {
  const normalized = { ...patient, registrationNumber: normalizeRegistrationNumber(patient.registrationNumber) };
  const others = readAll().filter(
    (existing) => existing.registrationNumber !== normalized.registrationNumber
  );
  writeAll([...others, normalized]);
}

export function getAllPatients(): PatientRecord[] {
  return readAll();
}

export function generateRegistrationNumber(): string {
  const maxSeq = getAllPatients().reduce((max, patient) => {
    const seq = Number(patient.registrationNumber.replace("PAC-", ""));
    return Number.isFinite(seq) && seq > max ? seq : max;
  }, 0);
  return `PAC-${String(maxSeq + 1).padStart(4, "0")}`;
}
