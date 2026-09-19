"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { cn } from "cn";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CheckCircle2, Clock } from "lucide-react";

import { useAuth } from "@/components/auth-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { saveAppointment } from "@/lib/appointments";
import { getSlotsForDate, isClinicOpen } from "@/lib/availability";
import { formatDateLabel } from "@/lib/format";

function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

export default function AgendarPage() {
  const { user } = useAuth();
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState<string | undefined>();
  const [confirmed, setConfirmed] = useState(false);

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
    setConfirmed(false);
  }

  function handleReset() {
    setDate(undefined);
    setTime(undefined);
    setConfirmed(false);
  }

  function handleConfirm() {
    if (!date || !time) return;

    if (user) {
      saveAppointment(user.email, { date: format(date, "yyyy-MM-dd"), time });
    }

    setConfirmed(true);
  }

  if (confirmed && date && time) {
    return (
      <div className="flex min-h-svh flex-col">
        <SiteHeader variant="app" />
        <main className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2 className="size-7" />
          </span>
          <h1 className="text-2xl font-semibold tracking-tight">
            Cita solicitada
          </h1>
          <p className="text-muted-foreground">
            Quedó registrada tu solicitud para el{" "}
            <span className="font-medium text-foreground">
              {formatDateLabel(date)}
            </span>{" "}
            a las <span className="font-medium text-foreground">{time}</span>.
            {user
              ? " Ya puedes verla en tu panel."
              : " Te contactaremos para confirmar tus datos."}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            {user && (
              <Link href="/panel" className={cn(buttonVariants())}>
                Ver mi panel
              </Link>
            )}
            <Button
              variant={user ? "outline" : "default"}
              onClick={handleReset}
            >
              Agendar otra cita
            </Button>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader variant="app" />

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <div className="mb-10 flex flex-col gap-2 text-center">
            <h1 className="text-3xl font-semibold tracking-tight">
              Agenda tu cita
            </h1>
            <p className="text-muted-foreground">
              Elige un día en el calendario y selecciona el horario que
              prefieras.
            </p>
          </div>

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
                    <Button disabled={!time} onClick={handleConfirm}>
                      Confirmar cita
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
