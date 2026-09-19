"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Stethoscope } from "lucide-react";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function MedicoLoginPage() {
  const router = useRouter();
  const { user, isReady, login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isReady && user?.role === "doctor") {
      router.replace("/medico");
    }
  }, [isReady, user, router]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim() || !email.trim()) {
      setError("Completa tu nombre y correo electrónico.");
      return;
    }

    login({ role: "doctor", name: name.trim(), email: email.trim().toLowerCase() });
    router.push("/medico");
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-sm">
        <Link href="/" className="mb-6 flex items-center justify-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Stethoscope className="size-4.5" />
          </span>
          <span className="text-lg font-semibold tracking-tight">
            ClinicPlus
          </span>
        </Link>

        <h1 className="text-center text-xl font-semibold tracking-tight">
          Acceso para personal médico
        </h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Gestiona la agenda y las citas de tus pacientes.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Nombre completo</Label>
            <Input
              id="name"
              autoComplete="name"
              placeholder="Ej. Dra. Laura Gómez"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="doctor@clinicplus.app"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="mt-2 w-full">
            Entrar
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          ¿Eres paciente?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
