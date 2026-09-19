import Link from "next/link";
import { CalendarHeart } from "lucide-react";

export function SiteFooter() {
  return (
    <footer id="contacto" className="border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <CalendarHeart className="size-4" />
          </span>
          <span className="font-semibold tracking-tight">ClinicPlus</span>
        </Link>

        <p className="text-sm text-muted-foreground">
          contacto@clinicplus.app · Lun–Vie, 8:00–18:00
        </p>

        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} ClinicPlus. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  );
}
