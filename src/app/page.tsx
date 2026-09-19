import Link from "next/link";
import { cn } from "cn";
import {
  ArrowRight,
  BellRing,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  Stethoscope,
  Users,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const features = [
  {
    icon: Users,
    title: "Gestión de pacientes",
    description:
      "Historial clínico, datos de contacto y evolución de cada paciente en un solo lugar.",
  },
  {
    icon: CalendarDays,
    title: "Citas en línea",
    description:
      "El paciente elige el día y la hora disponible desde un calendario simple e intuitivo.",
  },
  {
    icon: Stethoscope,
    title: "Panel para el médico",
    description:
      "Agenda del día, próximas citas y registro de la consulta al momento de atender.",
  },
  {
    icon: BellRing,
    title: "Recordatorios",
    description:
      "Confirmaciones y avisos automáticos para reducir las inasistencias.",
  },
];

const steps = [
  {
    step: "1",
    title: "Elige fecha y hora",
    description: "Consulta el calendario y selecciona un horario disponible.",
  },
  {
    step: "2",
    title: "Completa tus datos",
    description: "Ingresa tu información de contacto para confirmar la cita.",
  },
  {
    step: "3",
    title: "Asiste a tu consulta",
    description: "El médico completa tu historial durante la atención.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
          <div className="flex flex-col gap-6">
            <Badge variant="secondary" className="w-fit">
              Plataforma para clínicas modernas
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Gestiona pacientes y citas en un solo lugar
            </h1>
            <p className="max-w-md text-lg text-muted-foreground">
              ClinicPlus conecta a tus pacientes con tu agenda médica: reservan
              su cita en segundos y tú llevas el control completo de cada
              consulta.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/agendar"
                className={cn(buttonVariants({ size: "lg" }), "h-11 px-6")}
              >
                Agendar una cita
                <ArrowRight />
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-lg shadow-primary/5">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <CalendarClock className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-medium">Próxima cita</p>
                  <p className="text-xs text-muted-foreground">
                    Jueves, 24 de septiembre
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                {["09:00", "09:30", "10:00"].map((time, i) => (
                  <div
                    key={time}
                    className={`flex items-center justify-between rounded-lg border px-4 py-2.5 text-sm ${
                      i === 1
                        ? "border-primary bg-primary/5 font-medium text-primary"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    <span>{time}</span>
                    {i === 1 && <CheckCircle2 className="size-4" />}
                  </div>
                ))}
              </div>

              <Link
                href="/agendar"
                className={cn(buttonVariants(), "mt-6 w-full")}
              >
                Confirmar horario
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="servicios" className="border-t border-border/60 bg-muted/30">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight">
                Todo lo que necesita tu clínica
              </h2>
              <p className="mt-3 text-muted-foreground">
                Una herramienta pensada para el médico y para el paciente.
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
                >
                  <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-4 font-medium">{title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="como-funciona" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight">
              Reservar una cita toma menos de un minuto
            </h2>
          </div>

          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {steps.map(({ step, title, description }) => (
              <div key={step} className="flex flex-col items-center text-center">
                <span className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {step}
                </span>
                <h3 className="mt-4 font-medium">{title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA band */}
        <section className="border-t border-border/60 bg-primary">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6">
            <h2 className="text-3xl font-semibold tracking-tight text-primary-foreground">
              Empieza a organizar tu agenda hoy
            </h2>
            <p className="max-w-md text-primary-foreground/80">
              Únete como paciente o gestiona tu clínica desde un solo panel.
            </p>
            <Link
              href="/agendar"
              className={cn(
                buttonVariants({ size: "lg", variant: "secondary" }),
                "h-11 px-6 text-foreground"
              )}
            >
              Agendar una cita
              <ArrowRight />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
