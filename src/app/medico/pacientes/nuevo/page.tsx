"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "cn";
import { CheckCircle2 } from "lucide-react";

import { useAuth } from "@/components/auth-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  generateRegistrationNumber,
  registerPatient,
  type PatientRecord,
} from "@/lib/patients";

export default function NuevoPacientePage() {
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

  const [name, setName] = useState("");
  const [dui, setDui] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [registered, setRegistered] = useState<PatientRecord | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim() || !dui.trim()) {
      setError("Completa el nombre y el DUI del paciente.");
      return;
    }

    const patient: PatientRecord = {
      registrationNumber: generateRegistrationNumber(),
      name: name.trim(),
      dui: dui.trim(),
    };
    registerPatient(patient);
    setRegistered(patient);
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

  if (registered) {
    return (
      <div className="flex min-h-svh flex-col">
        <SiteHeader variant="app" />
        <main className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2 className="size-7" />
          </span>
          <h1 className="text-2xl font-semibold tracking-tight">
            Paciente registrado
          </h1>
          <p className="text-muted-foreground">
            Comparte este número de registro con{" "}
            <span className="font-medium text-foreground">
              {registered.name}
            </span>{" "}
            para que pueda iniciar sesión junto con su DUI.
          </p>
          <p className="rounded-lg bg-muted px-4 py-2 text-lg font-semibold tracking-wide">
            {registered.registrationNumber}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/medico" className={cn(buttonVariants())}>
              Volver al panel
            </Link>
            <Button
              variant="outline"
              onClick={() => {
                setRegistered(null);
                setName("");
                setDui("");
              }}
            >
              Registrar otro paciente
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
        <div className="mx-auto max-w-sm px-4 py-16 sm:px-6">
          <div className="mb-8 flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Registrar paciente
            </h1>
            <p className="text-muted-foreground">
              Se generará automáticamente su número de registro.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6"
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                placeholder="Ej. Carlos Pérez"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="dui">DUI</Label>
              <Input
                id="dui"
                placeholder="00000000-0"
                value={dui}
                onChange={(event) => setDui(event.target.value)}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="mt-2 w-full">
              Registrar paciente
            </Button>
          </form>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
