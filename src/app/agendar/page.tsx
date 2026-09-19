"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "cn";
import { format } from "date-fns";
import { CheckCircle2 } from "lucide-react";

import { useAuth } from "@/components/auth-provider";
import { AppointmentScheduler } from "@/components/appointment-scheduler";
import { Button, buttonVariants } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { saveAppointment } from "@/lib/appointments";
import { formatDateLabel } from "@/lib/format";

export default function AgendarPage() {
  const { user } = useAuth();
  const isPatient = user?.role === "patient";
  const [confirmed, setConfirmed] = useState<{ date: Date; time: string } | null>(
    null
  );

  function handleConfirm(date: Date, time: string) {
    if (user?.role === "patient") {
      saveAppointment({
        patientRegistrationNumber: user.registrationNumber,
        patientName: user.name,
        date: format(date, "yyyy-MM-dd"),
        time,
      });
    }

    setConfirmed({ date, time });
  }

  if (confirmed) {
    const { date, time } = confirmed;
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
            {isPatient
              ? " Ya puedes verla en tu panel."
              : " Te contactaremos para confirmar tus datos."}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            {isPatient && (
              <Link href="/panel" className={cn(buttonVariants())}>
                Ver mi panel
              </Link>
            )}
            <Button
              variant={isPatient ? "outline" : "default"}
              onClick={() => setConfirmed(null)}
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

          <AppointmentScheduler onConfirm={handleConfirm} />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
