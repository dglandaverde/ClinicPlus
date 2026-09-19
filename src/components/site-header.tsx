"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "cn";
import { CalendarHeart, Menu } from "lucide-react";

import { useAuth } from "@/components/auth-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
  { href: "#servicios", label: "Servicios" },
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#contacto", label: "Contacto" },
];

interface SiteHeaderProps {
  /** "marketing" shows the landing page section links; "app" hides them
   * for focused flows like booking or the patient panel. */
  variant?: "marketing" | "app";
}

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <CalendarHeart className="size-4.5" />
      </span>
      <span className="text-lg font-semibold tracking-tight">ClinicPlus</span>
    </Link>
  );
}

export function SiteHeader({ variant = "marketing" }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const { user, isReady, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    setOpen(false);
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />

        {variant === "marketing" && (
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}

        <div className="hidden items-center gap-2 md:flex">
          {isReady && user ? (
            <>
              <Link
                href={user.role === "doctor" ? "/medico" : "/panel"}
                className={cn(buttonVariants({ variant: "ghost" }))}
              >
                {user.role === "doctor" ? "Panel médico" : "Mi panel"}
              </Link>
              <Button variant="outline" onClick={handleLogout}>
                Cerrar sesión
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(buttonVariants({ variant: "ghost" }))}
              >
                Iniciar sesión
              </Link>
              <Link href="/agendar" className={cn(buttonVariants())}>
                Agendar cita
              </Link>
            </>
          )}
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="md:hidden" />
            }
          >
            <Menu />
            <span className="sr-only">Abrir menú</span>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle>
                <Logo />
              </SheetTitle>
            </SheetHeader>

            {variant === "marketing" && (
              <nav className="flex flex-col gap-1 px-4">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            )}

            <div className="mt-auto flex flex-col gap-2 p-4">
              {isReady && user ? (
                <>
                  <Link
                    href={user.role === "doctor" ? "/medico" : "/panel"}
                    onClick={() => setOpen(false)}
                    className={cn(buttonVariants({ variant: "outline" }))}
                  >
                    {user.role === "doctor" ? "Panel médico" : "Mi panel"}
                  </Link>
                  <Button variant="ghost" onClick={handleLogout}>
                    Cerrar sesión
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className={cn(buttonVariants({ variant: "outline" }))}
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    href="/agendar"
                    onClick={() => setOpen(false)}
                    className={cn(buttonVariants())}
                  >
                    Agendar cita
                  </Link>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
