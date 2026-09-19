"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "cn";
import { format } from "date-fns";
import { CheckCircle2 } from "lucide-react";

import { useAuth } from "@/components/auth-provider";
import { AppointmentScheduler } from "@/components/appointment-scheduler";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { saveAppointment } from "@/lib/appointments";
import { formatDateLabel } from "@/lib/format";
import { findPatientByRegistrationNumber, type PatientRecord } from "@/lib/patients";

export default function NuevaCitaMedicoPage() {
  const router = useRouter();
  const { user, isReady } = useAuth();

  const hasCheckedAuth = useRef(false);
  useEffect(() => {
    if (!isReady || hasCheckedAuth.current) return;
    hasCheckedAuth.current = true;
    if (!user || user.role !== "doctor") {
      router.replace("/medico/login");
    }
  }, [isReady, user, router]);

  const [registrationNumber, setRegistrationNumber] = useState("");
  const [patient, setPatient] = useState<PatientRecord | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [confirmed, setConfirmed] = useState<{ date: Date; time: string } | null>(
    null
  );

  function handleLookup() {
    const found = findPatientByRegistrationNumber(registrationNumber);
    setPatient(found);
    setNotFound(!found);
  }

  function handleConfirm(date: Date, time: string) {
    if (!patient) return;

    saveAppointment({
      patientRegistrationNumber: patient.registrationNumber,
      patientName: patient.name,
      date: format(date, "yyyy-MM-dd"),
      time,
    });
    setConfirmed({ date, time });
  }

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

  if (confirmed && patient) {
    const { date, time } = confirmed;
    return (
      <div className="flex min-h-svh flex-col">
        <SiteHeader variant="app" />
        <main className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2 className="size-7" />
          </span>
          <h1 className="text-2xl font-semibold tracking-tight">
            Cita registrada
          </h1>
          <p className="text-muted-foreground">
            Se registró la cita de{" "}
            <span className="font-medium text-foreground">{patient.name}</span>{" "}
            para el{" "}
            <span className="font-medium text-foreground">
              {formatDateLabel(date)}
            </span>{" "}
            a las <span className="font-medium text-foreground">{time}</span>.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/medico" className={cn(buttonVariants())}>
              Volver al panel
            </Link>
            <Button
              variant="outline"
              onClick={() => {
                setConfirmed(null);
                setPatient(null);
                setRegistrationNumber("");
              }}
            >
              Registrar otra cita
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
              Registrar cita
            </h1>
            <p className="text-muted-foreground">
              Busca al paciente por su número de registro para agendar su
              consulta.
            </p>
          </div>

          <div className="mx-auto mb-8 flex max-w-md flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex flex-1 flex-col gap-1.5">
              <Label htmlFor="registrationNumber">
                Número de registro del paciente
              </Label>
              <Input
                id="registrationNumber"
                placeholder="Ej. PAC-0001"
                value={registrationNumber}
                onChange={(event) => {
                  setRegistrationNumber(event.target.value);
                  setPatient(null);
                  setNotFound(false);
                }}
              />
            </div>
            <Button type="button" variant="outline" onClick={handleLookup}>
              Buscar
            </Button>
          </div>

          {notFound && (
            <p className="mx-auto mb-8 max-w-md text-center text-sm text-destructive">
              No se encontró ningún paciente con ese número de registro.{" "}
              <Link href="/medico/pacientes/nuevo" className="underline">
                Regístralo primero
              </Link>
              .
            </p>
          )}

          {patient ? (
            <>
              <p className="mb-6 text-center text-sm text-muted-foreground">
                Agendando para{" "}
                <span className="font-medium text-foreground">
                  {patient.name}
                </span>
              </p>
              <AppointmentScheduler
                onConfirm={handleConfirm}
                confirmLabel="Registrar cita"
              />
            </>
          ) : (
            !notFound && (
              <p className="text-center text-sm text-muted-foreground">
                Busca a un paciente para ver el calendario de horarios.
              </p>
            )
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
