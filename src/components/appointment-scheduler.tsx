"use client";

import { useMemo, useState } from "react";
import { cn } from "cn";
import { es } from "date-fns/locale";
import { Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { getSlotsForDate, isClinicOpen } from "@/lib/availability";
import { formatDateLabel } from "@/lib/format";

function startOfToday(): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

interface AppointmentSchedulerProps {
  onConfirm: (date: Date, time: string) => void;
  confirmLabel?: string;
  confirmDisabled?: boolean;
}

export function AppointmentScheduler({
  onConfirm,
  confirmLabel = "Confirmar cita",
  confirmDisabled = false,
}: AppointmentSchedulerProps) {
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState<string | undefined>();

  const today = useMemo(() => startOfToday(), []);
  const maxDate = useMemo(() => {
    const d = startOfToday();
    d.setMonth(d.getMonth() + 2);
    return d;
  }, []);

  const slots = useMemo(() => (date ? getSlotsForDate(date) : []), [date]);

  function handleSelectDate(next: Date | undefined) {
    setDate(next);
    setTime(undefined);
  }

  function handleConfirm() {
    if (!date || !time) return;
    onConfirm(date, time);
  }

  return (
    <div className="grid gap-8 rounded-2xl border border-border bg-card p-6 sm:p-8 lg:grid-cols-[auto_1fr]">
      <Calendar
        mode="single"
        locale={es}
        selected={date}
        onSelect={handleSelectDate}
        disabled={(d) => d < today || d > maxDate || !isClinicOpen(d)}
        className="mx-auto"
      />

      <div className="flex flex-col border-t border-border pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
        {!date && (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 py-10 text-center text-muted-foreground">
            <Clock className="size-6" />
            <p>Selecciona un día para ver los horarios disponibles.</p>
          </div>
        )}

        {date && slots.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 py-10 text-center text-muted-foreground">
            <p>No hay atención este día. Elige otra fecha.</p>
          </div>
        )}

        {date && slots.length > 0 && (
          <>
            <p className="text-sm font-medium">{formatDateLabel(date)}</p>

            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {slots.map(({ time: slotTime, available }) => (
                <button
                  key={slotTime}
                  type="button"
                  disabled={!available}
                  onClick={() => setTime(slotTime)}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                    !available &&
                      "cursor-not-allowed border-border/60 text-muted-foreground/50 line-through",
                    available &&
                      slotTime !== time &&
                      "border-border text-foreground hover:border-primary hover:bg-primary/5",
                    available &&
                      slotTime === time &&
                      "border-primary bg-primary text-primary-foreground"
                  )}
                >
                  {slotTime}
                </button>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                {time
                  ? `Horario seleccionado: ${time}`
                  : "Selecciona un horario disponible."}
              </p>
              <Button
                disabled={!time || confirmDisabled}
                onClick={handleConfirm}
              >
                {confirmLabel}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
