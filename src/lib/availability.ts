const SLOT_MINUTES = 30;

const OPENING_HOURS: Record<number, { start: string; end: string }[]> = {
  0: [],
  1: [
    { start: "09:00", end: "13:00" },
    { start: "15:00", end: "18:00" },
  ],
  2: [
    { start: "09:00", end: "13:00" },
    { start: "15:00", end: "18:00" },
  ],
  3: [
    { start: "09:00", end: "13:00" },
    { start: "15:00", end: "18:00" },
  ],
  4: [
    { start: "09:00", end: "13:00" },
    { start: "15:00", end: "18:00" },
  ],
  5: [
    { start: "09:00", end: "13:00" },
    { start: "15:00", end: "18:00" },
  ],
  6: [{ start: "09:00", end: "12:00" }],
};

export interface TimeSlot {
  time: string;
  available: boolean;
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const mins = (minutes % 60).toString().padStart(2, "0");
  return `${hours}:${mins}`;
}

export function isClinicOpen(date: Date): boolean {
  return OPENING_HOURS[date.getDay()].length > 0;
}

// Deterministic pseudo-random mock standing in for a real availability
// query, so the same date always shows the same booked slots.
function isSlotTaken(date: Date, minutes: number): boolean {
  const seed =
    date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  const hash = (seed * 9301 + minutes * 49297) % 233280;
  return hash % 5 === 0;
}

export function getSlotsForDate(date: Date): TimeSlot[] {
  const ranges = OPENING_HOURS[date.getDay()] ?? [];
  const slots: TimeSlot[] = [];

  for (const range of ranges) {
    const start = timeToMinutes(range.start);
    const end = timeToMinutes(range.end);
    for (let m = start; m < end; m += SLOT_MINUTES) {
      slots.push({ time: minutesToTime(m), available: !isSlotTaken(date, m) });
    }
  }

  return slots;
}
