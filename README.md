# ClinicPlus — Web (Frontend)

Frontend de la plataforma de gestión de pacientes y citas médicas ClinicPlus.

**Stack:** Next.js (App Router) + TypeScript + Tailwind CSS + pnpm.

El backend (NestJS + PostgreSQL + Prisma) vive en un repositorio aparte.

## Requisitos

- Node.js 20+
- pnpm (`corepack enable`)

## Desarrollo

```bash
pnpm install
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Usuarios de prueba

Mientras no existe el backend, la sesión y los datos se simulan en el
`localStorage` del navegador (ver `src/lib/auth.ts`, `src/lib/patients.ts`).
Cada "home" de la app tiene su propio punto de entrada y credenciales:

| Home | URL | Usuario | Contraseña |
| --- | --- | --- | --- |
| Landing / paciente sin sesión | `/` | — | — |
| Paciente | `/login` | Número de registro: `PAC-0001` | DUI: `04567890-1` |
| Paciente (alterno) | `/login` | Número de registro: `PAC-0002` | DUI: `01234567-8` |
| Médico / admin | `/medico/login` | Cualquier nombre | Cualquier correo (sin validación real aún) |

Los pacientes nuevos se dan de alta desde el panel del médico
(`/medico/pacientes/nuevo`), que asigna automáticamente el siguiente número
de registro (`PAC-0003`, `PAC-0004`, ...).

## Scripts

- `pnpm dev` — servidor de desarrollo
- `pnpm build` — build de producción
- `pnpm start` — sirve el build de producción
- `pnpm lint` — linting con ESLint
