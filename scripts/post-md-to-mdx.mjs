// Convierte docs/post.md (directorio de investigación, privado) en src/content/posts/openai-hf.mdx.
// Uso: node scripts/post-md-to-mdx.mjs <ruta/a/post.md>
// Cambia tres cosas, ninguna de contenido: quita el comentario de borrador, sustituye cada «<!-- Mapa Cnn–Cmm -->»
// por el componente del mapa con esas escenas, y añade el enlace a la charla y la nota de lectura del mapa.
import { readFileSync, writeFileSync } from 'node:fs';
import mapa from '../shared/data/mapa.json' with { type: 'json' };

const range = (a, b) => Array.from({ length: Number(b) - Number(a) + 1 }, (_, i) => 'C' + String(Number(a) + i).padStart(2, '0'));
let md = readFileSync(process.argv[2], 'utf8');

md = md.replace(/^<!-- Borrador v2[^>]*-->\n\n/m, '');
let embeds = 0;
md = md.replace(/^<!-- Mapa C(\d\d)(?:–C(\d\d))?[^>]*-->$/gm, (_, a, b) => {
	const ids = b ? range(a, b) : ['C' + a];
	for (const id of ids) if (!mapa.scenes[id]) throw new Error(`La escena ${id} no existe en mapa.json`);
	embeds++;
	return ids.length === 1 ? `<MapaIncidente client:load scene="${ids[0]}" />` : `<MapaIncidente client:load scenes={${JSON.stringify(ids)}} />`;
});
if (/<!--/.test(md)) throw new Error('Quedan comentarios HTML en el post');

const intro = `Material de la charla: [presentación interactiva](/talks/openai-hf/) y [PDF de respaldo](/talks/openai-hf/openai-hf.pdf).

**Cómo leer los mapas.** Cada mapa responde: ¿qué podía hacer una ejecución con cada recurso? Una escena es una instantánea completa; usa «Anterior» y «Siguiente» para recorrerlas. Las flechas describen capacidades documentadas de varias ejecuciones. No representan una sola sesión ni establecen el orden de todas las peticiones. [S7, II.B–VI, pp. 6–16][S7]; [S6, pp. 5–20 y 30–49][S6].

`;
const parts = md.split(/^(?=## Acto 0)/m);
if (parts.length !== 2) throw new Error('No encuentro «## Acto 0»');
md = parts[0] + intro + parts[1];
md = md.replace(/^---\n([\s\S]*?)\n---\n\n/, (all) => `${all}import MapaIncidente from '../../../shared/components/MapaIncidente.vue';\n\n`);

writeFileSync(new URL('../src/content/posts/openai-hf.mdx', import.meta.url), md);
console.log(`openai-hf.mdx: ${embeds} mapas`);
