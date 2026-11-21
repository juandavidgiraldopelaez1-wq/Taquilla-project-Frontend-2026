# Uso de inteligencia artificial

## Herramienta utilizada

Se utilizó ChatGPT como herramienta de apoyo durante el desarrollo de Taquilla. La IA ayudó a revisar código existente, comprender la estructura de la API, proponer modificaciones y diagnosticar errores. Las propuestas fueron revisadas e integradas en el proyecto por el estudiante.

## Actividades en las que se utilizó IA

### 1. Integración de la API en la página de inicio

ChatGPT ayudó a identificar cómo reutilizar el servicio de consultas y el hook `useRecurso` para consumir los endpoints de eventos destacados, catálogo de eventos y categorías.

También apoyó la adaptación de los datos recibidos de la API a las propiedades utilizadas por los componentes visuales de la página de inicio.

El resultado fue revisado mediante la compilación del proyecto y pruebas visuales en el navegador.

### 2. Internacionalización de la interfaz

ChatGPT apoyó la conexión de los textos de navegación y de las preferencias de cookies con el endpoint `GET /textos?idioma=es` y `GET /textos?idioma=en`.

Se propuso reutilizar el contexto de preferencias para distribuir los textos obtenidos de la API y conservar los textos locales como respaldo mientras se carga la información.

El cambio de idioma fue comprobado visualmente en el navegador.

### 3. Persistencia de preferencias y cookies

La IA ayudó a revisar la lógica existente de consentimiento e idioma, y a integrar los textos de la API en los componentes del banner y las preferencias de cookies.

Se conservó la lógica que diferencia entre aceptar y rechazar el consentimiento, evitando guardar la cookie del idioma cuando se rechazan las cookies opcionales.

### 4. Apoyo en Git y control de versiones

ChatGPT proporcionó orientación para revisar los cambios, separar modificaciones por funcionalidad, utilizar mensajes de commit convencionales y publicar las ramas en GitHub.

Se evitó incluir indiscriminadamente todos los archivos modificados en un mismo commit.

## Error de la IA y corrección realizada

En una consulta de diagnóstico, ChatGPT proporcionó inicialmente un comando que intentaba leer la variable `VITE_API_URL` desde el archivo `.env`.

La ejecución falló porque el proyecto tenía la variable configurada en `.env.local`. Como consecuencia, la URL quedaba vacía y las consultas posteriores no podían ejecutarse correctamente.

Se revisaron los archivos de entorno existentes y se corrigió el comando para leer `.env.local`. Después de la corrección, la consulta a `GET /textos?idioma=es` respondió correctamente y permitió identificar la estructura real de los textos de navegación, cookies e interfaz.

Este caso muestra la importancia de verificar las recomendaciones de la IA frente a la estructura real del proyecto.

## Sprint 2 · Uso de Claude (Anthropic)

En el Sprint 2 también se usó Claude como asistente de desarrollo, conectado al repositorio, al archivo de Figma y a la API. Cada cambio llegó como un pull request separado que el estudiante revisó antes de fusionar.

### 5. Sistema de diseño a partir de Figma

Claude leyó las variables del archivo de Figma (página «Sistema de diseño») y propuso `src/styles/tokens.css` con los mismos nombres de variable (`--fondo-pagina`, `--texto-principal`, etc.), la escala tipográfica de Figma y los radios y sombras. También exportó los íconos SVG de «Imágenes para exportar» y propuso el componente `Icono`, que los pinta con `mask-image` para que tomen el color del texto.

Se verificó comparando los valores con el panel de Figma y con `npm run lint` y `npm run build`.

### 6. Textos y datos desde la API

Claude ayudó a reemplazar los archivos `src/data/catalogo.js` e `src/data/interfaz.js` y los textos escritos dentro de los componentes por los de `GET /textos`. Primero consultó la respuesta real de la API para usar las claves correctas (por ejemplo `paginas.inicio.hero.titulo` o `general.formatos.fechaYHora`).

Los pocos textos de accesibilidad que la API no trae se dejaron documentados en `src/config/textosFaltantes.js`.

### 7. Detalle, ingreso y sesión

Claude propuso la vista `/eventos/:slug`, el formulario de ingreso con sus estados y la sesión con la cookie `sesion` de la API. Antes de escribir el código probó la API desde el dominio de Vercel: `POST /sesion`, `GET /sesion` con la cookie, `DELETE /sesion`, el error 401, el 422 de campos vacíos y el 429 con `Retry-After`.

### Error de la IA y corrección realizada (Sprint 2)

Al configurar ESLint aparecieron 10 problemas. Para una advertencia de `react-refresh/only-export-components` en `PreferenciasContext.jsx`, Claude agregó un comentario `eslint-disable-next-line` que ocultaba la advertencia en lugar de resolverla, y ese cambio llegó a fusionarse en `main` (PR #10).

Al revisar las reglas del proyecto ("no desactivar reglas de ESLint para ocultar errores") se detectó el problema. La corrección fue separar el contexto (`context/preferenciasContexto.js`) y el hook (`hooks/usePreferencias.js`) del componente Provider, y quitar el comentario (PR #11). Después de la corrección, `npm run lint` terminó sin errores ni advertencias.

Este caso muestra que una solución que "hace pasar" la herramienta no siempre es la correcta: hay que revisar por qué aparece la advertencia.

## Validación y responsabilidad

El estudiante revisó las propuestas, incorporó los cambios al código y ejecutó pruebas de compilación y funcionamiento.

La compilación de producción con Vite terminó correctamente. También se comprobó visualmente el cambio de idioma al inglés.

La IA se utilizó como herramienta de asistencia y no sustituyó la revisión, las decisiones técnicas ni la responsabilidad del estudiante sobre el resultado final.
