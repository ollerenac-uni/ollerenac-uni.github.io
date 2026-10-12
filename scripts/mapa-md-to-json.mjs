// Solo pasa a mapa.json lo que se dibuja: los textos de mapa.md con instrucciones de dibujo no se publican.
// Convierte las tablas de docs/mapa.md y los títulos de docs/guion.md (directorio de investigación, privado)
// en shared/data/mapa.json, que dibuja shared/components/MapaIncidente.vue.
// Uso: node scripts/mapa-md-to-json.mjs <ruta/a/mapa.md> <ruta/a/guion.md>
// Vuelve a ejecutarlo cuando cambien esas tablas. La disposición y el texto en pantalla viven en mapa-layout.mjs.
import { readFileSync, writeFileSync } from 'node:fs';
import { VB, escenas, insignias, lanes, links, nodes, notasFijas, parentOf, tipos, zoneHeight, zones } from './mapa-layout.mjs';

const clean = (s) => s.replace(/\[([^\]]+)\]\[[^\]]*\]/g, '$1').replace(/[*`]/g, '').trim();
const rows = (md, re) => md.split('\n').filter((l) => re.test(l)).map((l) => l.replace(/^\||\|\s*$/g, '').split(' | ').map((c) => c.trim()));

const mapa = readFileSync(process.argv[2], 'utf8');
const guion = readFileSync(process.argv[3], 'utf8');

// --- Nodos, conexiones, escenas y fronteras de mapa.md ---
const meaning = Object.fromEntries(
	rows(mapa, /^\| N\d\d \|/).map(([id, label, text]) => [id, { label: clean(label).split(' · ')[0], text: clean(text) }]),
);
const linkText = Object.fromEntries(rows(mapa, /^\| L\d\d \|/).map(([id, ends, text]) => [id, { ends: clean(ends), text: clean(text) }]));
const ids = (s) => s.match(/N\d\d(?:\.\w+)?|L\d\d/g) ?? [];
const sceneRows = rows(mapa, /^\| C\d\d \|/).map(([id, when, n, l, text]) => {
	const [act, ...fecha] = when.split(';');
	return { id, act: Number(act), fecha: fecha.join(';').trim(), n: ids(n), l: ids(l), text: clean(text) };
});
const range = (a, b) => Array.from({ length: Number(b) - Number(a) + 1 }, (_, i) => 'C' + String(Number(a) + i).padStart(2, '0'));
const fronteras = Object.fromEntries(
	rows(mapa, /^\| F\d \|/).map(([id, label, cs]) => {
		const scenes = [...cs.matchAll(/C(\d\d)(?:–C(\d\d))?/g)].flatMap(([, a, b]) => (b ? range(a, b) : ['C' + a]));
		return [id, { label: clean(label), scenes }];
	}),
);
const titles = Object.fromEntries([...guion.matchAll(/^### (\d\d)\. (.+?) — \d+ segundos$/gm)].map(([, n, t]) => ['C' + n, t]));

if (Object.keys(meaning).length !== 38) throw new Error(`Se esperaban 38 nodos y hay ${Object.keys(meaning).length}`);
if (Object.keys(linkText).length !== 34) throw new Error(`Se esperaban 34 conexiones y hay ${Object.keys(linkText).length}`);
if (Object.keys(fronteras).length !== 8) throw new Error('Se esperaban 8 fronteras');

// --- Geometría ---
const outZones = Object.fromEntries(Object.entries(zones).map(([k, z]) => [k, { ...z, h: zoneHeight(z) }]));
const outLanes = lanes;
const placed = {};
for (const [id, n] of Object.entries(nodes)) {
	const base = meaning[parentOf(id)];
	if (!base) throw new Error(`${id}: sin fila en mapa.md`);
	let x, y, w, h;
	if (n.lane) {
		const lane = lanes[n.lane];
		[x, y, w, h] = [n.x, lane.y + 22, n.w, 28];
	} else {
		const z = zones[n.zone];
		const colW = z.cols === 1 ? z.w - 12 : (z.w - 20) / 2;
		[x, y, w, h] = [z.x + 6 + n.col * (colW + 8), z.y + 28 + n.row * 42, colW, 34 + ((n.span ?? 1) - 1) * 42];
	}
	placed[id] = { id, label: base.label, short: n.short, icon: n.icon, x, y, w, h, zone: n.zone ?? null, lane: n.lane ?? null, nota: notasFijas[id] ?? null };
}

// --- Escenas: listas de mapa.md + texto en pantalla de mapa-layout.mjs ---
const outScenes = {};
for (const s of sceneRows) {
	const extra = escenas[s.id];
	if (!extra) continue; // C01 y otras sin mapa
	outScenes[s.id] = {
		id: s.id,
		act: s.act,
		fecha: s.fecha,
		titulo: titles[s.id] ?? '',
		nodos: s.n.filter((n) => n !== 'N28'),
		enlaces: s.l,
		frontera: Object.entries(fronteras).filter(([, f]) => f.scenes.includes(s.id)).map(([k]) => k),
		insignias: insignias[s.id] ?? {},
		extremos: [],
		...extra,
	};
}
{
	const b = escenas.B03;
	outScenes.B03 = { id: 'B03', act: 0, fecha: b.fecha, titulo: b.titulo, nodos: b.nodos, enlaces: b.enlaces, frontera: [], extremos: [], insignias: {}, ...b };
}

// --- Comprobaciones: nada queda sin dibujar ni sin definir ---
for (const s of Object.values(outScenes)) {
	const activos = [...s.nodos, ...s.extremos];
	for (const n of activos) if (!placed[n]) throw new Error(`${s.id}: nodo ${n} sin casilla`);
	for (const l of s.enlaces) {
		if (!links[l]) throw new Error(`${s.id}: conexión ${l} sin trazado`);
		const drawn = links[l].segs.filter(([a, b]) => activos.includes(a) && activos.includes(b));
		if (!drawn.length) throw new Error(`${s.id}: ${l} no dibuja ningún tramo con los nodos activos (${activos.join(', ')})`);
	}
	if (!s.titulo) throw new Error(`${s.id}: sin título en guion.md`);
}
for (const [id, l] of Object.entries(links)) {
	if (!linkText[id]) throw new Error(`${id}: sin fila en mapa.md`);
	for (const n of l.segs.flatMap((g) => g.slice(0, 2))) if (!placed[n]) throw new Error(`${id}: extremo ${n} sin casilla`);
}

const outLinks = Object.fromEntries(
	Object.entries(links).map(([id, l]) => [id, { id, ...l, tipo: tipos[l.type].nombre }]),
);

writeFileSync(
	new URL('../shared/data/mapa.json', import.meta.url),
	JSON.stringify({ vb: VB, tipos, zones: outZones, lanes: outLanes, nodes: placed, links: outLinks, scenes: outScenes, fronteras }, null, '\t') + '\n',
);
console.log(`${Object.keys(placed).length} casillas, ${Object.keys(outLinks).length} conexiones, ${Object.keys(outScenes).length} escenas`);
