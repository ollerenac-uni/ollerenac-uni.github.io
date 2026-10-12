// Convierte la tabla «Cronología» de docs/timeline.md (directorio de investigación, privado)
// en shared/data/timeline.json. Uso: node scripts/timeline-md-to-json.mjs <ruta/a/timeline.md>
// Vuelve a ejecutarlo cada vez que cambie la tabla. No inventa texto: solo quita enlaces y negritas.
import { readFileSync, writeFileSync } from 'node:fs';

// Orden de lectura de «Cómo leerla» en timeline.md. Las fases se solapan en el tiempo.
const phases = ['Preparación', 'Acceso inicial', 'Escape del aislamiento', 'Movimiento hacia terceros', 'Detección', 'Contención', 'Divulgación', 'Correcciones'];

const clean = (s) => s.replace(/\[([^\]]+)\]\[[^\]]*\]/g, '$1').replace(/[*`]/g, '').trim();

const events = readFileSync(process.argv[2], 'utf8')
	.split('\n')
	.filter((l) => /^\| E\d+ \|/.test(l))
	.map((l) => {
		const [id, when, phase, fact, actor, source, limit] = l.split('|').slice(1, -1).map(clean);
		const [date, ...rest] = when.split(';');
		const time = rest.join(';').trim();
		if (!phases.includes(phase)) throw new Error(`${id}: fase desconocida «${phase}»`);
		return { id, date: date.trim(), time: /^\d\d:\d\d$/.test(time) ? `${time} UTC` : time, phase, fact, actor, source, limit };
	});

if (events.length === 0) throw new Error('No hay filas E##: ¿ruta correcta?');
writeFileSync(new URL('../shared/data/timeline.json', import.meta.url), JSON.stringify({ phases, events }, null, '\t') + '\n');
console.log(`${events.length} eventos, ${phases.length} fases`);
