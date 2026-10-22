// Compone talks/openai-hf/slides.md desde talks/openai-hf/slides.src.md y docs/guion.md (directorio de investigación, privado).
// Uso: node scripts/guion-to-slides.mjs <ruta/a/guion.md>
// El esqueleto trae el texto en pantalla de cada diapositiva. Este script añade, sin cambiar una palabra,
// los títulos, las notas del orador y los pies de fuentes del guion. Marcadores del esqueleto:
//   @@ESCENA nn Cnn@@  diapositiva de mapa completa (título, acto, escena, pie y notas)
//   @@TITULO nn@@  @@ACTO nn@@  @@PIE nn@@  @@NOTAS nn@@   piezas sueltas de la diapositiva nn
//   @@RESPALDO Bnn@@  respaldos B01–B06 (una o varias diapositivas, con la tabla paginada)
//   @@REF Sn@@  enlace a una fuente de guion.md, con su nombre corto
import { readFileSync, writeFileSync } from 'node:fs';

const guion = readFileSync(process.argv[2], 'utf8');
const skeleton = new URL('../talks/openai-hf/slides.src.md', import.meta.url);
const out = new URL('../talks/openai-hf/slides.md', import.meta.url);

// --- Referencias [S7]: URL de guion.md y nombre corto (los de B06) ---
const urls = Object.fromEntries([...guion.matchAll(/^\[(S\d+)\]: (\S+)$/gm)].map(([, id, url]) => [id, url]));
const names = {
	S1: 'Aviso HF', S2: 'Aviso OpenAI', S3: 'Reconstrucción HF', S6: 'Informe METR', S7: 'Informe OpenAI', S8: 'Avisos JFrog', S9: 'Versiones JFrog',
	S11: 'Modal', S15: 'Pausa OpenAI', S27: 'Método METR', S35: 'Incidentes Anthropic', S36: 'System card Mythos Preview',
	S37: 'Agentic misalignment', S38: 'Summer 2026', S39: 'Campaña Anthropic', S40: 'Agentes OpenAI', S41: 'Repositorios JFrog', S42: 'Archivos JFrog',
	S43: 'SSRF OWASP', S45: 'Modal Docs', S46: 'Listado JFrog', S47: 'Búsqueda JFrog',
};
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function inline(md) {
	const link = (id, text) => {
		if (!urls[id]) throw new Error(`Referencia ${id} sin URL en guion.md`);
		return `<a href="${urls[id]}">${text}</a>`;
	};
	return esc(md)
		.replace(/\[(S\d+)\]\[(S\d+)\]/g, (_, id) => link(id, `${names[id] ?? id} (${id})`))
		.replace(/\[([^\]]+)\]\[(S\d+)\]/g, (_, text, id) => link(id, text))
		.replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g, '<a href="$2">$1</a>')
		.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
		.replace(/`([^`]+)`/g, '<code>$1</code>');
}

// --- Diapositivas orales ---
const cut = guion.slice(guion.indexOf('## Acto 0'), guion.indexOf('## Respaldo para preguntas'));
const slides = {};
let act = '';
for (const block of cut.split(/^(?=## Acto|### \d\d\. )/m)) {
	const a = block.match(/^## (Acto \d · .+?) — \d+ minutos?$/m);
	if (a && block.startsWith('## ')) {
		act = a[1];
		continue;
	}
	const h = block.match(/^### (\d\d)\. (.+?) — (\d+) segundos$/m);
	if (!h) continue;
	const [, nn, title] = h;
	const notas = block.match(/\*\*Notas del orador:\*\*\s*\n\n([\s\S]*?)\n\n\*\*Pie/);
	const pie = block.match(/\*\*Pie(?: de hechos)?:\*\* ([\s\S]*?) \*\*Transición:\*\*/);
	if (!notas || !pie) throw new Error(`Diapositiva ${nn}: faltan notas o pie en guion.md`);
	slides[nn] = { title, act, notas: notas[1].trim(), pie: pie[1].trim() };
}
if (Object.keys(slides).length !== 32) throw new Error(`Se esperaban 32 diapositivas y hay ${Object.keys(slides).length}`);
const times = Object.fromEntries([...guion.matchAll(/^\| (\d\d) \| \d \| .+? \| (\d+) \| (\S+) \|$/gm)].map(([, nn, s, span]) => [nn, `${s} s (${span})`]));

const slide = (nn) => {
	const s = slides[nn];
	if (!s) throw new Error(`No existe la diapositiva ${nn} en guion.md`);
	return s;
};
const notas = (nn) => `${slide(nn).notas}\n\nTiempo: ${times[nn]}.`;
const pie = (nn) => inline(slide(nn).pie);
const title = (nn) => JSON.stringify(slide(nn).title);
const acto = (nn) => JSON.stringify(slide(nn).act);

// --- Respaldos B01–B06 ---
const backup = {};
for (const block of guion.slice(guion.indexOf('## Respaldo para preguntas')).split(/^(?=### B\d\d\. )/m)) {
	const h = block.match(/^### (B\d\d)\. (.+)$/m);
	if (h) backup[h[1]] = { title: h[2], body: block.slice(block.indexOf('\n') + 1).split('\n## ')[0].trim() };
}
const cells = (line) => line.replace(/^\||\|\s*$/g, '').split(' | ').map((c) => c.trim());
function table(lines, head, withHead = true) {
	const [h, ...rows] = [head, ...lines].map(cells);
	return `<table class="respaldo">${withHead ? `<thead><tr>${h.map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead>` : ''}<tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}
const paras = (md) => md.split(/\n\n+/).filter(Boolean).map((p) => `<p class="respaldo-nota">${inline(p.replace(/\n/g, ' '))}</p>`).join('\n\n');
function page(id, suffix, extra) {
	const b = backup[id];
	return `---\nlayout: pantalla\nrespaldo: true\ntitle: ${JSON.stringify(`${id}. ${b.title}${suffix}`)}\n---\n\n${extra}\n`;
}
function split(md) {
	const lines = md.split('\n');
	const rows = lines.filter((l) => l.startsWith('|'));
	const prose = lines.filter((l) => !l.startsWith('|')).join('\n').split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
	return { head: rows[0], rows: rows.slice(2), prose };
}
const respaldo = {
	// Tablas con grupos de filas: [filas por página], texto antes (al principio) y después (al final)
	B01(id) {
		const { head, rows, prose } = split(backup[id].body);
		return [0, 5, 10].map((i, k, a) => page(id, ` (${k + 1}/${a.length})`, `${k === 0 ? '<span id="respaldo"></span>\n\n' + paras(prose[0]) + '\n\n' : ''}${table(rows.slice(i, i + 5), head)}\n\n${k === a.length - 1 ? paras(prose.slice(1).join('\n\n')) : ''}`));
	},
	B02(id) {
		const { head, rows, prose } = split(backup[id].body);
		return [0, 5, 10].map((i, k, a) => page(id, ` (${k + 1}/${a.length})`, `${table(rows.slice(i, i + 5), head)}${k === a.length - 1 && prose.length ? '\n\n' + paras(prose.join('\n\n')) : ''}`));
	},
	B03: (id) => [page(id, '', paras(backup[id].body))],
	B04: (id) => [page(id, '', paras(backup[id].body))],
	B05(id) {
		const { head, rows, prose } = split(backup[id].body);
		return [page(id, '', `${table(rows, head)}\n\n${paras(prose.join('\n\n'))}`)];
	},
	B06(id) {
		const { head, rows, prose } = split(backup[id].body);
		return [0, 6].map((i, k, a) => page(id, ` (${k + 1}/${a.length})`, `${table(rows.slice(i, i + 6), head)}\n\n${k === a.length - 1 ? paras(prose.join('\n\n')) : ''}`));
	},
};
// B06 cierra con la nota de método; B05 con sus límites. Los textos salen del cuerpo de cada respaldo.
const respaldoPages = (id) => respaldo[id](id).join('\n');

// --- Esqueleto ---
let md = readFileSync(skeleton, 'utf8');
md = md.replace(/@@ESCENA (\d\d) (C\d\d|B\d\d)@@/g, (_, nn, scene) =>
	[`---`, `layout: pantalla`, `scene: ${scene}`, `title: ${title(nn)}`, `acto: ${acto(nn)}`, `---`, ``, `<Fuentes>${pie(nn)}</Fuentes>`, ``, `<!--\n${notas(nn)}\n-->`, ``].join('\n'),
);
md = md.replace(/@@TITULO (\d\d)@@/g, (_, nn) => title(nn));
md = md.replace(/@@ACTO (\d\d)@@/g, (_, nn) => acto(nn));
md = md.replace(/@@PIE (\d\d)@@/g, (_, nn) => pie(nn));
md = md.replace(/@@NOTAS (\d\d)@@/g, (_, nn) => notas(nn));
md = md.replace(/@@RESPALDO (B\d\d)@@/g, (_, id) => respaldoPages(id));
md = md.replace(/@@REF (S\d+)@@/g, (_, id) => inline(`[${id}][${id}]`));
if (/@@/.test(md)) throw new Error('Quedan marcadores sin resolver: ' + md.match(/@@[^@]+@@/)[0]);

writeFileSync(out, md);
console.log(`slides.md: ${md.split(/^---$/m).length} bloques; ${Object.keys(slides).length} diapositivas orales`);
