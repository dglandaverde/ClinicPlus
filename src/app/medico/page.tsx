"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "cn";
import { CalendarPlus, Stethoscope, UserPlus } from "lucide-react";

import { useAuth } from "@/components/auth-provider";
import { buttonVariants } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getAllAppointments, type Appointment } from "@/lib/appointments";
import { formatDateLabel } from "@/lib/format";

export default function MedicoPage() {
  const router = useRouter();
  const { user, isReady } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const hasCheckedAuth = useRef(false);
  useEffect(() => {
    if (!isReady || hasCheckedAuth.current) return;
    hasCheckedAuth.current = true;

    if (!user) {
      router.replace("/medico/login");
    } else if (user.role === "patient") {
      router.replace("/panel");
    }
  }, [isReady, user, router]);

  useEffect(() => {
    if (user?.role === "doctor") {
      // localStorage is only readable on the client, so appointments are
      // hydrated after mount to keep the first render matching the server.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAppointments(getAllAppointments());
    }
  }, [user]);

  if (!isReady || !user || user.role !== "doctor") {
    return (
      <div className="flex min-h-svh flex-col">
        <SiteHeader variant="app" />
        <main className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          Cargando…
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader variant="app" />

      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Hola, {user.name}
              </h1>
              <p className="mt-1 text-muted-foreground">
                Estas son las próximas citas de tus pacientes.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link
                href="/medico/pacientes/nuevo"
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                <UserPlus /> Registrar paciente
              </Link>
              <Link
                href="/medico/nueva-cita"
                className={cn(buttonVariants())}
              >
                <CalendarPlus /> Registrar cita
              </Link>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-border bg-card">
            {appointments.length === 0 ? (
              <div className="flex flex-col items-center gap-3 p-12 text-center text-muted-foreground">
                <Stethoscope className="size-8" />
                <p>No hay citas registradas todavía.</p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {appointments.map((appointment) => (
                  <li
                    key={`${appointment.patientRegistrationNumber}-${appointment.date}-${appointment.time}`}
                    className="flex items-center justify-between gap-4 p-5"
                  >
                    <div>
                      <p className="font-medium">{appointment.patientName}</p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.patientRegistrationNumber}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {formatDateLabel(new Date(`${appointment.date}T00:00:00`))}
                      </p>
                      <p className="text-sm text-primary">{appointment.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
