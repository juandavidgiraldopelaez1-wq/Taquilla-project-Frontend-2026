# Taquilla · Frontend

Frontend del proyecto Taquilla (Universidad de Caldas): cartelera de conciertos, teatro, deportes y festivales. Está construido con **React 19 + Vite**, reproduce el diseño de Figma del curso y toma todos los datos y textos de la API del proyecto.

- Despliegue: https://taquilla-project-frontend-2026.vercel.app
- API: https://yanethm-taquilla-api.fly.dev/api/v1 · [endpoints](https://yanethm-taquilla-api.fly.dev/docs) · [contrato por vista](https://yanethm-taquilla-api.fly.dev/docs/contrato)

## Requisitos

- Node.js 20.19 o posterior (rama 20) o Node.js 22.12 o posterior.

## Instalación y ejecución

```sh
npm ci
cp .env.example .env
npm run dev
```

Abre la dirección que muestra Vite (por defecto http://localhost:5173).

## Variables de entorno

| Variable                | Obligatoria | Uso                                                                                 |
| ----------------------- | ----------- | ----------------------------------------------------------------------------------- |
| `VITE_API_URL`          | Sí          | Dirección base de la API, por ejemplo `https://yanethm-taquilla-api.fly.dev/api/v1` |
| `VITE_SIMULAR_LATENCIA` | No          | Milisegundos de espera (`X-Simular-Latencia`) para ver los estados de carga         |
| `VITE_SIMULAR_ERROR`    | No          | `500`, `503` o `504` (`X-Simular-Error`) para ver los estados de error              |

El archivo `.env` no se sube al repositorio. En Vercel las variables se configuran en **Settings → Environment Variables** (Production y Preview).

## Scripts

| Comando                                   | Qué hace                                           |
| ----------------------------------------- | -------------------------------------------------- |
| `npm run dev`                             | Servidor de desarrollo                             |
| `npm run build`                           | Compilación de producción en `dist/`               |
| `npm run preview`                         | Sirve la compilación de producción                 |
| `npm run lint`                            | ESLint (debe terminar sin errores ni advertencias) |
| `npm run format` / `npm run format:check` | Prettier                                           |

## Vistas

| Ruta             | Vista                                | Historias                  |
| ---------------- | ------------------------------------ | -------------------------- |
| `/`              | Inicio público                       | US-TAQ-S1-03               |
| `/explorar`      | Explorar eventos (filtros en la URL) | US-TAQ-S1-04               |
| `/eventos/:slug` | Detalle de un evento                 | US-TAQ-S2-01               |
| `/ingresar`      | Iniciar sesión                       | US-TAQ-S2-03, US-TAQ-S2-04 |
| cualquier otra   | No encontrado                        | US-TAQ-S2-01               |

En todas: navegación y menú móvil (S1-02), idioma ES | EN (S1-05), aviso de cookies (S1-06), estados de carga, vacío y error (S2-02) y sesión con la cookie `sesion` (S2-05).

## Organización

```
src/
├── assets/iconos/     Íconos SVG exportados de Figma
├── components/        Un componente por carpeta (.jsx + .css)
├── config/            Variables de entorno y textos de accesibilidad que la API no trae
├── context/           Preferencias (idioma, cookies, accesibilidad) y sesión
├── hooks/             useRecurso (consultas), usePreferencias, useSesion, useEsMovil
├── pages/             Una vista por archivo
├── services/          Cliente de la API y cookies
├── styles/            tokens.css (sistema de diseño de Figma) y base.css
└── utils/             Formato de fechas y precios, filtros de Explorar
```

## Decisiones

- **Sin datos escritos a mano**: eventos, categorías, ciudades e idiomas vienen de la API, y los textos de la interfaz de `GET /textos?idioma=es|en`.
- **Tokens de Figma**: `tokens.css` usa los mismos nombres de variable del sistema de diseño de Figma; los componentes no usan colores, tamaños de letra ni radios escritos a mano.
- **Sesión**: la API pone la cookie httpOnly `sesion` y el frontend la envía con `credentials: "include"`. El token nunca se guarda en el navegador.
- **Equivalentes de Next.js**: el curso describe algunas funciones de Next.js. En React + Vite se usan `<title>`/`<meta>` de React 19 en lugar de `generateMetadata`, una página de no encontrado en lugar de `notFound()`, y componentes de esqueleto y error en lugar de `loading.tsx`/`error.tsx`.

## Uso de IA

Ver [IA.md](IA.md).
