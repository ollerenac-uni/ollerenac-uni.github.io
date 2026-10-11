# Presentación: Incidente OpenAI–Hugging Face

Deck en [Slidev](https://sli.dev). Todo el contenido vive en `slides.md`.

## Comandos

```bash
cd talks/openai-hf
npm ci               # una vez
npm run dev          # http://localhost:3030, recarga en vivo
npm run export       # genera openai-hf.pdf (respaldo offline)
npm run build        # genera dist/ con base /talks/openai-hf/
```

`npm run export` necesita Chromium. La primera vez, si falla:

```bash
npx playwright install chromium
```

## Estado

Esqueleto sin hechos. Cada `[FUENTE: ...]` en `slides.md` marca un dato
que falta. T1 (`docs/fuentes.md`) los provee; T3 los verifica.

## Publicación

El workflow `.github/workflows/deploy.yml` de la raíz del repositorio construye el sitio y
esta charla juntos con `npm run build:all`. Publica en https://ollerenac-uni.github.io/talks/openai-hf/.
La charla usa `routerMode: hash`: GitHub Pages no sirve rutas de una SPA al recargar.
