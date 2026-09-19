"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "cn";
import { CalendarPlus } from "lucide-react";

import { useAuth } from "@/components/auth-provider";
import { buttonVariants } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getAppointment, type Appointment } from "@/lib/appointments";
import { formatDateLabel } from "@/lib/format";

export default function PanelPage() {
  const router = useRouter();
  const { user, isReady } = useAuth();
  const [appointment, setAppointment] = useState<Appointment | null>(null);

  // Only guards the initial visit: logging out from this page already
  // navigates away, so a later `user` change here must not redirect again.
  const hasCheckedAuth = useRef(false);
  useEffect(() => {
    if (!isReady || hasCheckedAuth.current) return;
    hasCheckedAuth.current = true;
    if (!user) {
      router.replace("/login");
    }
  }, [isReady, user, router]);

  useEffect(() => {
    if (user) {
      // localStorage is only readable on the client, so the appointment is
      // hydrated after mount to keep the first render matching the server.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAppointment(getAppointment(user.email));
    }
  }, [user]);

  if (!isReady || !user) {
    return (
      <div className="flex min-h-svh flex-col">
        <SiteHeader variant="app" />
        <main className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          Cargando…
        </main>
      </div>
    );
  }

  const firstName = user.name.split(" ")[0];

  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader variant="app" />

      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            Hola, {firstName}
          </h1>
          <p className="mt-1 text-muted-foreground">
            Este es el estado de tus citas.
          </p>

          <div className="mt-8 rounded-2xl border border-border bg-card p-10">
            {appointment ? (
              <div className="flex flex-col items-center gap-4 text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CalendarPlus className="size-6" />
                </span>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Tu próxima cita
                  </p>
                  <p className="mt-1 text-xl font-semibold tracking-tight">
                    {formatDateLabel(new Date(`${appointment.date}T00:00:00`))}
                  </p>
                  <p className="text-lg font-medium text-primary">
                    {appointment.time}
                  </p>
                </div>
                <Link
                  href="/agendar"
                  className={cn(buttonVariants({ variant: "outline" }))}
                >
                  Reagendar
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <CalendarPlus className="size-6" />
                </span>
                <div>
                  <p className="font-medium">No tienes citas próximas</p>
                  <p className="text-sm text-muted-foreground">
                    Agenda una cita con tu médico en menos de un minuto.
                  </p>
                </div>
                <Link href="/agendar" className={cn(buttonVariants())}>
                  Agendar cita
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
