# cybersecnews

Serie de seguridad informática. Sitio: https://ollerenac-uni.github.io/

- `src/` — sitio [Astro](https://astro.build) (Vue activado). Posts en `src/content/posts/`.
- `talks/openai-hf/` — charla [Slidev](https://sli.dev). Se publica en `/talks/openai-hf/`.
- `.github/workflows/deploy.yml` — construye todo y publica en GitHub Pages al hacer push a `main`.

## Correr en local

Requiere Node 22.12 o más nuevo.

```bash
npm ci                              # sitio
npm ci --prefix talks/openai-hf     # charla
npm run dev                         # sitio en http://localhost:4321
npm run dev --prefix talks/openai-hf  # charla en http://localhost:3030
```

## Construir todo

```bash
npm run build:all   # genera dist/ con el sitio y la charla
npm run preview     # sirve dist/ en http://localhost:4321
```

El PDF de la charla y su exportación están en `talks/openai-hf/README.md`.
