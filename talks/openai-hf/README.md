# Presentación: Incidente OpenAI–Hugging Face

Deck en [Slidev](https://sli.dev). Todo el contenido vive en `slides.md`.

## Comandos

```bash
cd talks/openai-hf
PLAYWRIGHT_BROWSERS_PATH=0 npm ci   # una vez; Chromium queda en node_modules/
npm run dev                         # http://localhost:3030, recarga en vivo
npm run build                       # genera dist/ con base /talks/openai-hf/
npm run export                      # genera openai-hf.pdf (respaldo offline)
npm run check:offline               # prueba la charla sin red (necesita `npm run build:all` en la raíz)
```

`PLAYWRIGHT_BROWSERS_PATH=0` hace que Playwright guarde Chromium dentro de `node_modules/` y no
en `~/.cache/ms-playwright`. Los scripts `export` y `check:offline` ya lo fijan. Sin esa variable,
`npm ci` descarga Chromium fuera del proyecto. Si Chromium falta, instálalo con:

```bash
PLAYWRIGHT_BROWSERS_PATH=0 npx playwright-chromium install chromium
```

Los scripts usan la sintaxis `VAR=valor comando` de shells POSIX (Linux, macOS, WSL).

## PDF de respaldo

`npm run export` escribe `openai-hf.pdf` aquí: una página por diapositiva, sin pasos de clic.
El PDF está en `.gitignore`. Se versiona y se publica en la etapa de publicación (OELL-23).

## Sin red

La charla no pide nada a otros dominios:

- Fuentes: `style.css` importa `@fontsource/nunito-sans` y `@fontsource/fira-code` (subconjunto `latin`).
  `slides.md` fija `fonts.provider: none`, así Slidev no pide `fonts.googleapis.com`.
- Favicon: `public/favicon.svg`, declarado con `favicon:` en `slides.md`.

`npm run check:offline` abre `dist/` en Chromium, bloquea todo lo que no sea local, navega por las
diapositivas y falla si hay una petición externa, una respuesta 4xx/5xx o si no carga la tipografía.
Si añades un recurso remoto (imagen, iframe, fuente), este comando lo detecta.

## Componentes Vue compartidos

Los componentes que usan el post (Astro) y la charla (Slidev) van en `shared/components/`, en la raíz
del repositorio. La carpeta se crea con el primer componente (la línea de tiempo, etapa 6).

```astro
---
// Ruta relativa al archivo: desde src/pages/x.astro es ../../shared/…,
// desde src/content/posts/x.mdx o src/pages/talks/x.astro es ../../../shared/…
import Timeline from '../../shared/components/Timeline.vue';
---
<Timeline client:load />
```

```md
<!-- slides.md -->
<script setup>
import Timeline from '../../shared/components/Timeline.vue'
</script>

<Timeline />
```

`vite.config.ts` agrega `shared/` a `server.fs.allow`: sin eso Slidev rechaza el import fuera de
`talks/openai-hf/`. Slidev ya resuelve `vue` una sola vez (`dedupe`), así que `ref` y `onMounted`
del componente funcionan en la charla. Un componente de prueba con `ref` y `onMounted` se montó
en la página de Astro y en la charla construida (OELL-18).

## Estado

Esqueleto sin hechos. Cada `[FUENTE: ...]` en `slides.md` marca un dato
que falta. T1 (`docs/fuentes.md`) los provee; T3 los verifica.

## Publicación

El workflow `.github/workflows/deploy.yml` de la raíz del repositorio construye el sitio y
esta charla juntos con `npm run build:all`. Publica en https://ollerenac-uni.github.io/talks/openai-hf/.
La charla usa `routerMode: hash`: GitHub Pages no sirve rutas de una SPA al recargar.
