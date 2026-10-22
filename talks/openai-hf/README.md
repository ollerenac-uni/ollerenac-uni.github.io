# Presentación: El incidente OpenAI–Hugging Face

Charla en [Slidev](https://sli.dev): 32 escenas orales (actos 0–8, 40 minutos más 10 de preguntas) y 12 diapositivas de respaldo (B01–B06).

## Comandos

```bash
cd talks/openai-hf
PLAYWRIGHT_BROWSERS_PATH=0 npm ci   # una vez; Chromium queda en node_modules/
npm run dev                         # http://localhost:3030, recarga en vivo
npm run build                       # genera dist/ con base /talks/openai-hf/
npm run export                      # genera public/openai-hf.pdf (respaldo offline)
npm run check:offline               # carga charla y post sin red (necesita `npm run build:all` en la raíz)
npm run check:contrast              # mide el contraste de todo el texto (necesita `npm run build:all`)
npm run check:mapa                  # foco, rutas, clave, descripción del mapa y texto dentro de cada diapositiva (necesita `npm run build:all`)
```

`PLAYWRIGHT_BROWSERS_PATH=0` hace que Playwright guarde Chromium dentro de `node_modules/` y no
en `~/.cache/ms-playwright`. Los scripts `export`, `check:offline` y `check:contrast` ya lo fijan.
Los scripts usan la sintaxis `VAR=valor comando` de shells POSIX (Linux, macOS, WSL).

## De dónde sale cada cosa

El contenido viene del directorio de investigación (`docs/`, privado). Tres generadores lo convierten; ejecútalos
cuando cambie la fuente. Todos se corren desde la raíz del repositorio:

| Fuente | Comando | Resultado |
|---|---|---|
| `docs/mapa.md` + títulos de `docs/guion.md` | `node scripts/mapa-md-to-json.mjs <docs>/mapa.md <docs>/guion.md` | `shared/data/mapa.json` (38 nodos, 34 conexiones, escenas) |
| `docs/guion.md` + `talks/openai-hf/slides.src.md` | `node scripts/guion-to-slides.mjs <docs>/guion.md` | `talks/openai-hf/slides.md` |
| `docs/post.md` | `node scripts/post-md-to-mdx.mjs <docs>/post.md` | `src/content/posts/openai-hf.mdx` |
| `docs/timeline.md` | `node scripts/timeline-md-to-json.mjs <docs>/timeline.md` | `shared/data/timeline.json` (la v2 ya no lo usa) |

- **`slides.md` es generado: edita `slides.src.md`.** El esqueleto lleva el texto en pantalla de cada diapositiva. El generador
  añade, sin cambiar una palabra, título, acto, notas del orador (más su tiempo de presupuesto) y pie de fuentes del guion.
  Las tablas de respaldo B01–B06 también salen del guion.
- La disposición del mapa (casillas, iconos, tramos origen → destino de cada conexión, texto en pantalla de cada escena) está en
  `scripts/mapa-layout.mjs`. Lo que dicen los nodos, las listas de cada escena y las fronteras salen de `docs/mapa.md`;
  el generador falla si una escena nombra un nodo o conexión que no puede dibujar.
- Si cambia `slides.md`, regenera el PDF: `PLAYWRIGHT_BROWSERS_PATH=0 npm run export`, y haz commit de `public/openai-hf.pdf`.
  Orden para publicar: generadores → `npm run export` → `npm run build:all` (el build copia el PDF a `dist/`).

## Notas del orador

La narración se lee en voz alta. Un recordatorio editorial puede usar `<aside class="nota-orador" role="note">`,
con el rótulo «Precisión para ti · No leer» en `<strong class="nota-orador__rotulo">`. Se escribe en las notas
del guion y el generador conserva ese HTML. `style.css` limita su recuadro azul a `.slidev-note`, en Presenter.
El rótulo permite distinguirlo sin depender solo del color. Los límites que cambian la interpretación de los
hechos siguen dentro de la narración. Por ahora estos recuadros se usan en las diapositivas 2, 4 y 5.

La escena C05 añade `components/FlujoSsrf.vue` en el slot `detalle` del mapa, debajo de sus bloques.
El recorrido ilustra qué servicio hace la petición; no reproduce un payload ni vincula un CVE con mayo.
El guion fija el contenido y sus límites. El slot está vacío en las demás escenas y en el post.

## Mapa del incidente

`shared/components/MapaIncidente.vue` lo usan el post (Astro) y la charla (Slidev). Recibe una escena y dibuja una instantánea completa:

- Charla: `layouts/pantalla.vue` lee `scene: C05` del frontmatter. Un clic cambia de diapositiva y de escena a la vez. No hay clics internos.
- Post: `<MapaIncidente client:load scenes={["C03","C04","C05"]} />` añade «Anterior» y «Siguiente» (también ← → Inicio Fin), y anuncia la escena nueva.
- Zonas y casillas fijas: lo que no está activo se atenúa y pierde su rótulo. Cada conexión lleva un número. La clave bajo el mapa dice, por conexión,
  su texto, su origen → destino (cadenas A → B → C; ↔ si va en los dos sentidos), su tipo (ESTRUCTURA, ACCESO OBSERVADO, INFORMACIÓN COMPARTIDA,
  INTENTO / RESULTADO NO CONFIRMADO, BLOQUEADA) y una muestra del estilo de línea. Los dos carriles de respuesta se distinguen por organización («de HF», «de OpenAI»).
- Trazado: `shared/components/ruta.js` calcula el camino más corto entre origen y destino que rodea los demás nodos activos (grafo de visibilidad).
  Una línea nunca pasa por detrás de un nodo activo. Si nada estorba, es recta. Con mucho texto en la clave (más de 350 caracteres) la clave gana ancho;
  con más de 700 el mapa se reduce un poco.
- Accesibilidad: el `<svg>` tiene `role="img"`, nombre = título de la escena y descripción (`aria-describedby`) con cada nodo activo y su organización
  y cada conexión con número, origen, destino, tipo y restricción. En el post, Siguiente/Anterior usan `aria-disabled`: el foco no sale del mapa en los extremos.
- Los carriles de respuesta solo aparecen en las escenas que los usan.
- Iconos: set [Carbon](https://carbondesignsystem.com/elements/icons/library/) (Apache 2.0), copiados a `shared/data/icons.json` con
  `node scripts/extract-icons.mjs`. Sin red. Las diapositivas usan el mismo set con `<carbon-key />` (Iconify de Slidev).
- Con movimiento reducido no hay transiciones.

Otros componentes: `shared/components/Icono.vue` (un icono Carbon), `shared/components/ruta.js` (trazado de conexiones), `shared/components/Timeline.vue` (línea de tiempo; sin uso en la v2),
`components/Fuentes.vue` (pie de fuentes de cada diapositiva), `components/EnlaceRespaldo.vue` (enlace de la diapositiva 32 al respaldo; ver «PDF de respaldo»).

`vite.config.ts` agrega `shared/` a `server.fs.allow`: sin eso Slidev rechaza el import fuera de `talks/openai-hf/`.

## PDF de respaldo

`npm run export` escribe `public/openai-hf.pdf`: una página por escena oral (C01–C32, cada una con sus fuentes y límites) y los respaldos B01–B06
en páginas aparte, fuera de los 40 minutos. El enlace de la diapositiva 32 al primer respaldo (B01) es un salto interno también en el PDF:
`EnlaceRespaldo.vue` apunta a `#respaldo`, un ancla que `guion-to-slides.mjs` pone en B01 y `style.css` fija al borde de la página.
(`<Link>` de Slidev 52 apunta a `#33`, pero el contenedor de esa página se llama `033-01`: el PDF perdía el enlace.) El PDF está versionado. `slidev build` lo copia a `dist/talks/openai-hf/openai-hf.pdf`, y `/talks/` y el post lo enlazan.

## Sin red

La charla y el post no piden nada a otros dominios:

- Fuentes: `style.css` importa `@fontsource/nunito-sans` y `@fontsource/fira-code` (subconjunto `latin`).
  `slides.md` fija `fonts.provider: none`, así Slidev no pide `fonts.googleapis.com`.
- Favicon: `public/favicon.svg`. Logo INICTEL-UNI: `public/inictel_peru_logo.jpeg`.

`npm run check:offline` abre `dist/` en Chromium, bloquea todo lo que no sea local, recorre las 44 diapositivas y las escenas de los mapas del post,
y falla si hay una petición externa, una respuesta 4xx/5xx o si no carga la tipografía.

## Contraste

`npm run check:contrast` mide el texto visible de cada diapositiva y de cada escena de cada mapa del post. Falla bajo 4.5:1.

## Mapa y diapositivas

`npm run check:mapa` recorre las 44 diapositivas y los mapas del post. Falla si el foco sale del mapa en un extremo, si una línea pasa por detrás de un nodo activo,
si la clave o la descripción SVG no dicen origen, destino, tipo y organización, o si un texto sale de la diapositiva o pisa el pie de fuentes.

## Publicación

El workflow `.github/workflows/deploy.yml` de la raíz del repositorio construye el sitio y
esta charla juntos con `npm run build:all`. Publica en https://ollerenac-uni.github.io/talks/openai-hf/.
La charla usa `routerMode: hash`: GitHub Pages no sirve rutas de una SPA al recargar.
