# cybersecnews

Serie de seguridad informática. Sitio: https://ollerenac-uni.github.io/

- `src/` — sitio [Astro](https://astro.build) (Vue activado). Posts en `src/content/posts/`.
- `talks/openai-hf/` — charla [Slidev](https://sli.dev). Se publica en `/talks/openai-hf/`.
- `fiee_cybersec_lab/` — sitio del Laboratorio de Ciberseguridad FIEE–UNI en Material for MkDocs.
- `shared/` — componentes Vue y datos que usan el post y la charla (`MapaIncidente.vue`, `mapa.json`, iconos Carbon).
- `scripts/` — generadores desde el directorio de investigación (mapa, diapositivas, post, línea de tiempo, iconos). Ver `talks/openai-hf/README.md`.
- `.github/workflows/deploy.yml` — construye todo y publica en GitHub Pages al hacer push a `main`.

## Correr en local

Requiere Node 22.12 o más nuevo.

```bash
npm ci                              # sitio
PLAYWRIGHT_BROWSERS_PATH=0 npm ci --prefix talks/openai-hf  # charla (Chromium dentro de node_modules)
npm run dev                         # sitio en http://localhost:4321
npm run dev --prefix talks/openai-hf  # charla en http://localhost:3030
```

## Construir todo

```bash
npm run build:all   # genera dist/ con el sitio y la charla
npm run preview     # sirve dist/ en http://localhost:4321
```

Comandos de la charla (PDF de respaldo, prueba sin red, componentes compartidos): `talks/openai-hf/README.md`.

## Laboratorio de Ciberseguridad FIEE–UNI

Requiere Python 3.12. Desde la raíz del repositorio:

```bash
python3.12 -m venv .venv
.venv/bin/python -m pip install -r fiee_cybersec_lab/requirements.txt
.venv/bin/python -m mkdocs serve -f fiee_cybersec_lab/mkdocs.yml
```

La vista previa está en `http://127.0.0.1:8000/fiee_cybersec_lab/`. Edita la introducción y agrega los enlaces en `fiee_cybersec_lab/docs/index.md`. Para añadir páginas, crea archivos Markdown en `docs/` y agrégalos a `nav` en `mkdocs.yml`.

El flujo de GitHub Actions compila MkDocs después de Astro y Slidev, y añade su salida a `dist/fiee_cybersec_lab/` en el artefacto de Pages. La URL canónica del laboratorio es [https://ollerenac-uni.github.io/fiee_cybersec_lab/](https://ollerenac-uni.github.io/fiee_cybersec_lab/).
